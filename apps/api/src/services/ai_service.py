import google.generativeai as genai
from PIL import Image, ImageDraw, ImageFont
import io
import base64
from ..core.config import settings
from typing import List, Dict
import json

class AIService:
    def __init__(self):
        if settings.gemini_api_key:
            genai.configure(api_key=settings.gemini_api_key)
            self.model = genai.GenerativeModel(settings.gemini_model)
        else:
            self.model = None
    
    def generate_questions(self, subject: str, topic: str, difficulty: str, count: int) -> Dict:
        """Generate questions using Gemini AI"""
        if not self.model:
            return self._mock_questions(subject, topic, count)
        
        try:
            prompt = f"""
            Generate {count} {difficulty} level questions about {topic} in {subject} for school students.
            
            Return the response in the following JSON format:
            {{
                "questions": ["Question 1?", "Question 2?", ...],
                "answers": ["Answer 1", "Answer 2", ...]
            }}
            
            Make sure the questions are appropriate for {difficulty} level and cover different aspects of {topic}.
            """
            
            response = self.model.generate_content(prompt)
            content = response.text
            
            # Try to parse JSON response
            try:
                parsed_response = json.loads(content)
                if "questions" in parsed_response and "answers" in parsed_response:
                    return parsed_response
            except json.JSONDecodeError:
                pass
            
            # Fallback parsing if JSON fails
            return self._parse_questions_fallback(content, count)
            
        except Exception as e:
            print(f"Gemini API error: {e}")
            return self._mock_questions(subject, topic, count)
    
    def generate_poster(self, title: str, description: str, theme: str) -> str:
        """Generate poster using PIL (since Gemini doesn't have image generation yet)"""
        try:
            # Create a simple poster using PIL
            width, height = 800, 1000
            
            # Choose colors based on theme
            if theme == "school":
                bg_color = (245, 245, 255)  # Light blue
                title_color = (25, 25, 112)  # Navy blue
                text_color = (60, 60, 60)   # Dark gray
            elif theme == "sports":
                bg_color = (255, 245, 245)  # Light red
                title_color = (139, 0, 0)   # Dark red
                text_color = (60, 60, 60)
            else:
                bg_color = (245, 255, 245)  # Light green
                title_color = (0, 100, 0)   # Dark green
                text_color = (60, 60, 60)
            
            # Create image
            img = Image.new('RGB', (width, height), bg_color)
            draw = ImageDraw.Draw(img)
            
            # Try to use a better font, fallback to default
            try:
                title_font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 48)
                desc_font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 24)
                theme_font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 20)
            except:
                title_font = ImageFont.load_default()
                desc_font = ImageFont.load_default()
                theme_font = ImageFont.load_default()
            
            # Draw title
            title_bbox = draw.textbbox((0, 0), title, font=title_font)
            title_width = title_bbox[2] - title_bbox[0]
            title_x = (width - title_width) // 2
            draw.text((title_x, 100), title, fill=title_color, font=title_font)
            
            # Draw description (wrap text)
            words = description.split()
            lines = []
            current_line = []
            for word in words:
                test_line = ' '.join(current_line + [word])
                test_bbox = draw.textbbox((0, 0), test_line, font=desc_font)
                test_width = test_bbox[2] - test_bbox[0]
                if test_width <= width - 100:
                    current_line.append(word)
                else:
                    if current_line:
                        lines.append(' '.join(current_line))
                        current_line = [word]
                    else:
                        lines.append(word)
            if current_line:
                lines.append(' '.join(current_line))
            
            y_offset = 250
            for line in lines[:8]:  # Limit to 8 lines
                line_bbox = draw.textbbox((0, 0), line, font=desc_font)
                line_width = line_bbox[2] - line_bbox[0]
                line_x = (width - line_width) // 2
                draw.text((line_x, y_offset), line, fill=text_color, font=desc_font)
                y_offset += 35
            
            # Draw theme badge
            theme_text = f"Theme: {theme.capitalize()}"
            theme_bbox = draw.textbbox((0, 0), theme_text, font=theme_font)
            theme_width = theme_bbox[2] - theme_bbox[0]
            theme_x = (width - theme_width) // 2
            draw.text((theme_x, height - 100), theme_text, fill=title_color, font=theme_font)
            
            # Convert to base64 for return
            buffer = io.BytesIO()
            img.save(buffer, format='PNG')
            img_str = base64.b64encode(buffer.getvalue()).decode()
            
            return f"data:image/png;base64,{img_str}"
            
        except Exception as e:
            print(f"Poster generation error: {e}")
            return f"https://via.placeholder.com/800x1000/cccccc/666666?text={title.replace(' ', '+')}"
    
    def chatbot_response(self, message: str, context: str) -> str:
        """AI chatbot response using Gemini"""
        if not self.model:
            return "I'm here to help with school management. How can I assist you today?"
        
        try:
            prompt = f"""
            You are a helpful school management assistant. You help with questions about:
            - Student admissions and enrollment
            - Teacher and staff management
            - Academic planning and curriculum
            - School events and activities
            - General school administration
            
            Context: {context}
            User question: {message}
            
            Provide a helpful, concise response (2-3 sentences maximum).
            """
            
            response = self.model.generate_content(prompt)
            return response.text.strip()
            
        except Exception as e:
            print(f"Chatbot error: {e}")
            return "I'm here to help with school management. How can I assist you today?"
    
    def _mock_questions(self, subject: str, topic: str, count: int) -> Dict:
        """Mock questions when AI is not available"""
        questions = []
        answers = []
        
        for i in range(count):
            questions.append(f"What is the {i+1}{'st' if i==0 else 'nd' if i==1 else 'rd' if i==2 else 'th'} important concept in {topic} for {subject}?")
            answers.append(f"The {i+1}{'st' if i==0 else 'nd' if i==1 else 'rd' if i==2 else 'th'} important concept in {topic} involves understanding the fundamental principles and their applications.")
        
        return {"questions": questions, "answers": answers}
    
    def _parse_questions_fallback(self, content: str, count: int) -> Dict:
        """Fallback parsing when JSON parsing fails"""
        lines = content.split('\n')
        questions = []
        answers = []
        
        for line in lines:
            line = line.strip()
            if '?' in line and len(questions) < count:
                questions.append(line)
            elif line and len(answers) < len(questions):
                answers.append(line)
        
        # Fill missing answers
        while len(answers) < len(questions):
            answers.append(f"Answer to question {len(answers) + 1}")
        
        return {"questions": questions[:count], "answers": answers[:count]}