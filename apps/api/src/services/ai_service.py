import openai
from ..core.config import settings
from typing import List, Dict

class AIService:
    def __init__(self):
        if settings.openai_api_key:
            openai.api_key = settings.openai_api_key
    
    def generate_questions(self, subject: str, topic: str, difficulty: str, count: int) -> Dict:
        """Generate questions using OpenAI API"""
        if not settings.openai_api_key:
            return self._mock_questions(subject, topic, count)
        
        try:
            prompt = f"Generate {count} {difficulty} level questions about {topic} in {subject} for school students. Provide questions and answers."
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=1000
            )
            
            content = response.choices[0].message.content
            return self._parse_questions(content)
            
        except Exception:
            return self._mock_questions(subject, topic, count)
    
    def generate_poster(self, title: str, description: str, theme: str) -> str:
        """Generate poster using DALL-E"""
        if not settings.openai_api_key:
            return f"https://example.com/poster/{title.replace(' ', '-')}.jpg"
        
        try:
            prompt = f"Create a school event poster for: {title}. Description: {description}. Theme: {theme}"
            
            response = openai.Image.create(
                prompt=prompt,
                n=1,
                size="1024x1024"
            )
            
            return response.data[0].url
        except Exception:
            return f"https://example.com/poster/{title.replace(' ', '-')}.jpg"
    
    def chatbot_response(self, message: str, context: str) -> str:
        """AI chatbot response"""
        if not settings.openai_api_key:
            return "I'm here to help with school management. How can I assist you today?"
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": f"Context: {context}. Question: {message}"}],
                max_tokens=150
            )
            
            return response.choices[0].message.content
        except Exception:
            return "I'm here to help with school management. How can I assist you today?"
    
    def _mock_questions(self, subject: str, topic: str, count: int) -> Dict:
        """Mock questions for when OpenAI is not configured"""
        questions = [f"{topic} question {i+1} for {subject}" for i in range(count)]
        answers = [f"Answer to {topic} question {i+1}" for i in range(count)]
        
        return {"questions": questions, "answers": answers}
    
    def _parse_questions(self, content: str) -> Dict:
        """Parse OpenAI response into questions and answers"""
        # Simple parsing - implement better parsing based on OpenAI response format
        lines = content.split('\n')
        questions = [line for line in lines if '?' in line]
        answers = [f"Answer to question {i+1}" for i in range(len(questions))]
        
        return {"questions": questions[:10], "answers": answers[:10]}