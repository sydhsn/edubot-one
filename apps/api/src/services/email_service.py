import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from ..core.config import settings
from typing import Optional

class EmailService:
    def __init__(self):
        self.smtp_server = settings.smtp_server
        self.smtp_port = settings.smtp_port
        self.username = settings.smtp_username
        self.password = settings.smtp_password
        self.from_email = settings.from_email
    
    async def send_password_reset_email(self, to_email: str, reset_token: str) -> bool:
        """Send password reset email"""
        if not self.username or not self.password:
            print(f"Email not configured. Password reset token for {to_email}: {reset_token}")
            return True  # Return True for development
        
        try:
            # Create message
            msg = MIMEMultipart()
            msg['From'] = self.from_email
            msg['To'] = to_email
            msg['Subject'] = "EduBot School - Password Reset Request"
            
            # Email body
            body = f"""
            Dear User,
            
            You have requested to reset your password for your EduBot School account.
            
            Your password reset token is: {reset_token}
            
            Please use this token to reset your password. This token will expire in 1 hour.
            
            If you did not request this password reset, please ignore this email.
            
            Best regards,
            EduBot School Management Team
            """
            
            msg.attach(MIMEText(body, 'plain'))
            
            # Connect to server and send email
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.username, self.password)
            text = msg.as_string()
            server.sendmail(self.from_email, to_email, text)
            server.quit()
            
            return True
            
        except Exception as e:
            print(f"Email send error: {e}")
            # In development, still print token to console
            print(f"Password reset token for {to_email}: {reset_token}")
            return True  # Return True for development so workflow continues
    
    async def send_welcome_email(self, to_email: str, user_name: str, role: str) -> bool:
        """Send welcome email to new users"""
        if not self.username or not self.password:
            print(f"Welcome email would be sent to {to_email} for {user_name} ({role})")
            return True
        
        try:
            msg = MIMEMultipart()
            msg['From'] = self.from_email
            msg['To'] = to_email
            msg['Subject'] = f"Welcome to EduBot School - {role.capitalize()} Account Created"
            
            body = f"""
            Dear {user_name},
            
            Welcome to EduBot School Management System!
            
            Your {role} account has been successfully created.
            Email: {to_email}
            Role: {role.capitalize()}
            
            You can now log in to the system using your email and password.
            
            If you have any questions, please contact your administrator.
            
            Best regards,
            EduBot School Management Team
            """
            
            msg.attach(MIMEText(body, 'plain'))
            
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.username, self.password)
            text = msg.as_string()
            server.sendmail(self.from_email, to_email, text)
            server.quit()
            
            return True
            
        except Exception as e:
            print(f"Welcome email error: {e}")
            return False