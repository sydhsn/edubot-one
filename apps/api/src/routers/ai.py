from fastapi import APIRouter, HTTPException
from ..models.schemas import (
    AIQuestionRequest, AIQuestionResponse, 
    AIChatRequest, AIChatResponse, 
    PosterRequest, PosterResponse
)
from ..services.ai_service import AIService

router = APIRouter()
ai_service = AIService()

@router.post("/generate-questions", response_model=AIQuestionResponse)
async def generate_questions(request: AIQuestionRequest):
    try:
        questions = await ai_service.generate_questions(
            request.subject,
            request.topic,
            request.difficulty,
            request.question_type,
            request.num_questions
        )
        return AIQuestionResponse(**questions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

@router.post("/generate-poster", response_model=PosterResponse)
async def generate_poster(request: PosterRequest):
    try:
        poster = await ai_service.generate_poster(
            request.title,
            request.description,
            request.theme,
            request.size
        )
        return PosterResponse(**poster)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chatbot", response_model=AIChatResponse)
async def chatbot_query(request: AIChatRequest):
    try:
        response = await ai_service.chatbot_response(
            request.message,
            request.context
        )
        return AIChatResponse(**response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))