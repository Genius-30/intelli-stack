<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server';
import { testPromptOnModels } from '@/utils/testModels';
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser';
import { ModelResponse } from '@/models/modelResponse.model'
import { checkSubscription, deductTokens, estimateTokens } from '@/utils/manageTokens';
import { IResponse } from '@/utils/enhancePrompt';
import { Prompt } from '@/models/prompt.model';

// tests prompt on models
export async function POST(
  req: NextRequest,
  { params }: { params: any }
) {
  try {
    const { userId, error } = await getAuthenticatedUser()
    if(error) return error

    const { models, tokenEstimated } = await req.json();
    const promptId = (await params).id

    if (!promptId || !Array.isArray(models) || models.length === 0) {
      return NextResponse.json({ error: 'Prompt and models are required.' }, { status: 400 });
    }

    const subs = await checkSubscription({ userId })
    if(!subs.success){
      return NextResponse.json({ message:'Subscription expired' }, { status: 400 });
    }

    const tokens = await estimateTokens({ userId, tokenEstimated })
    if(!tokens.success){
      return NextResponse.json({ message:'Not enough token' }, { status: 400 });
    }

    const promptDoc = await Prompt.findById(promptId)
    if(!promptDoc){
      return NextResponse.json({ message:'prompt not found' }, { status: 404 });
    }
    const prompt = promptDoc?.content
    
    const results = await Promise.all(
      models.map(async (modelOption) => {
        const result = await testPromptOnModels({ ...modelOption, prompt }) as IResponse;

        await ModelResponse.create({
=======
import { NextRequest, NextResponse } from "next/server";
import { testPromptOnModels } from "@/utils/testModels";
import { getAuthenticatedUser } from "@/utils/getAuthenticatedUser";
import { ModelResponse } from "@/models/modelResponse.model";
import {
  checkSubscription,
  deductTokens,
  estimateTokens,
} from "@/utils/manageTokens";
import { IResponse } from "@/utils/enhancePrompt";
import { Prompt } from "@/models/prompt.model";

// tests prompt on models
export async function POST(req: NextRequest, { params }: { params: any }) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;

    const { models, tokenEstimated } = await req.json();
    const promptId = (await params).id;

    if (!promptId || !Array.isArray(models) || models.length === 0) {
      return NextResponse.json(
        { error: "Prompt and models are required." },
        { status: 400 }
      );
    }

    const subs = await checkSubscription({ userId });
    if (!subs.success) {
      return NextResponse.json(
        { message: "Subscription expired" },
        { status: 400 }
      );
    }

    const tokens = await estimateTokens({ userId, tokenEstimated });
    if (!tokens.success) {
      return NextResponse.json(
        { message: "Not enough token" },
        { status: 400 }
      );
    }

    const promptDoc = await Prompt.findById(promptId);
    if (!promptDoc) {
      return NextResponse.json(
        { message: "prompt not found" },
        { status: 404 }
      );
    }
    const prompt = promptDoc?.content;

    const results = await Promise.all(
      models.map(async (modelOption) => {
        const result = (await testPromptOnModels({
          ...modelOption,
          prompt,
        })) as IResponse;

        if ("err" in result || result.response?.startsWith("Error")) {
          return {
            ...modelOption,
            response: result.response || "No response generated",
            _id: null,
            isFavorite: false,
            error: "Error occurred while generating response!",
          };
        }

        const createdResponse = await ModelResponse.create({
>>>>>>> c857343d943f0a3577c9fce47f534286961ee6d4
          promptId,
          ownerId: userId,
          model: modelOption.model,
          temperature: modelOption.temperature,
          response: result.response,
<<<<<<< HEAD
          isFavorite: false
        })

        await deductTokens({ userId, tokensUsed: result.tokensUsed})
        
        return {
          ...modelOption,
          response: result.response
=======
          isFavorite: false,
        });

        await deductTokens({ userId, tokensUsed: result.tokensUsed });

        return {
          ...modelOption,
          response: result.response,
          _id: createdResponse._id,
          isFavorite: createdResponse.isFavorite,
>>>>>>> c857343d943f0a3577c9fce47f534286961ee6d4
        };
      })
    );

<<<<<<< HEAD
    return NextResponse.json({ message:'testing completed', results }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'error while testing model', err }, { status: 500 });
=======
    return NextResponse.json(
      { message: "testing completed", results },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "error while testing model", err },
      { status: 500 }
    );
>>>>>>> c857343d943f0a3577c9fce47f534286961ee6d4
  }
}
