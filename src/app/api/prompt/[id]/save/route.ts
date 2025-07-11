import { NextRequest, NextResponse } from "next/server"
import { Prompt } from "@/models/prompt.model"
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser'
import mongoose from "mongoose"

export async function PATCH(
  req: NextRequest, 
  { params }: { params: any }
) {
  try {
    const { userId, error } = await getAuthenticatedUser()
    if(error) return error

    const promptId = (await params).id
    if(!mongoose.Types.ObjectId.isValid(promptId)) {
      return NextResponse.json(
        { message: 'invalid promptId' },
        { status: 400 }
      )
    }

    const { content } = await req.json();
    if (!content){
      return NextResponse.json(
        { error: "missing required feilds" }, 
        { status: 400 }
      )
    }

    const updatedPrompt = await Prompt.findOneAndUpdate(
      { _id: promptId, ownerId: userId },
      {
        $set: {
          content,
          isCurrent: true
        }
      },
      { new: true}
    )

    if (!updatedPrompt) {
      return NextResponse.json(
        { error: "Prompt not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Prompt saved", updatedPrompt },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'err while saving' },
      { status: 500 }
    );
  }
}
