from fastapi import APIRouter, HTTPException
from ..models.schemas import AIQuestionRequest, AIQuestionResponse
from ..services.ai_service import AIService

router = APIRouter()
ai_service = AIService()

@router.post("/generate-questions", response_model=AIQuestionResponse)
async def generate_questions(request: AIQuestionRequest):
    try:
        questions = ai_service.generate_questions(
            request.subject,
            request.topic,
            request.difficulty,
            request.number_of_questions
        )
        return AIQuestionResponse(**questions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

@router.post("/generate-poster")
async def generate_poster(event_data: dict):
    try:
        poster = ai_service.generate_poster(
            event_data.get("title"),
            event_data.get("description"),
            event_data.get("theme", "school")
        )
        return {"poster_url": poster, "message": "Poster generated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chatbot")
async def chatbot_query(query: dict):
    try:
        response = ai_service.chatbot_response(
            query.get("message"),
            query.get("context", "general")
        )
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))