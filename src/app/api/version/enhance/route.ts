import { NextRequest, NextResponse } from "next/server";
import {
  checkSubscription,
  deductTokens,
  isEnoughToken,
} from "@/utils/manageTokens";

import { enhancedPrompt } from "@/utils/enhancePrompt";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const result = await rateLimit(req);
    if (result) return result;

    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const { content, tokenEstimated } = await req.json();
    if (typeof tokenEstimated !== "number" || tokenEstimated <= 0) {
      return NextResponse.json(
        { message: "tokenEstimated is required and must be a positive number" },
        { status: 400 }
      );
    }

    const subs = await checkSubscription({ userId });
    if (!subs.success) {
      return NextResponse.json(
        { message: "subscription expired" },
        { status: 403 }
      );
    }

    const tokens = await isEnoughToken({ userId, tokenEstimated });
    if (!tokens.success) {
      return NextResponse.json(
        { message: "not enough tokens" },
        { status: 402 }
      );
    }

    const enhanced = await enhancedPrompt(content);
    if (
      !enhanced?.response ||
      enhanced.response.toLowerCase().includes("error calling openrouter")
    ) {
      return NextResponse.json(
        { message: "Enhancement failed", error: "OpenRouter error" },
        { status: 500 } // Proper error status
      );
    }

    await deductTokens({ userId, tokensUsed: enhanced.tokensUsed });

    return NextResponse.json(
      { message: "enhanced", response: enhanced.response },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "err while enhancing", err },
      { status: 500 }
    );
  }
}
