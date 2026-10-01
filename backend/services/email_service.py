import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional, Dict, Any

logger = logging.getLogger("zerolatency.email")

SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM = os.getenv("SMTP_FROM", "ZeroLatency Wealth <noreply@zerolatency.invest>")
APP_URL = os.getenv("APP_URL", "http://localhost:5173")
REQUIRE_EMAIL_VERIFICATION = os.getenv("REQUIRE_EMAIL_VERIFICATION", "false").lower() == "true"

# In-memory development outbox for local testing inspection
DEV_EMAIL_OUTBOX = []

class EmailService:
    @staticmethod
    def is_smtp_configured() -> bool:
        return bool(SMTP_HOST and SMTP_PORT and SMTP_USERNAME)

    @classmethod
    def send_email(cls, to_email: str, subject: str, html_content: str, text_content: Optional[str] = None) -> bool:
        # Dev fallback when SMTP credentials are not configured
        if not cls.is_smtp_configured():
            outbox_entry = {
                "to": to_email,
                "subject": subject,
                "html": html_content,
                "text": text_content or subject
            }
            DEV_EMAIL_OUTBOX.append(outbox_entry)
            # Log safely without printing raw passwords or sensitive credentials
            logger.info(f"[DEV MAILBOX] Outgoing email dispatched to {to_email} with subject: '{subject}'")
            return True

        # Production SMTP dispatch
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = SMTP_FROM
            msg["To"] = to_email

            if text_content:
                msg.attach(MIMEText(text_content, "plain"))
            msg.attach(MIMEText(html_content, "html"))

            with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:
                server.starttls()
                server.login(SMTP_USERNAME, SMTP_PASSWORD)
                server.sendmail(SMTP_FROM, [to_email], msg.as_string())

            logger.info(f"Production email successfully sent to {to_email}")
            return True
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False

    @classmethod
    def send_welcome_email(cls, to_email: str, name: str) -> bool:
        subject = "Welcome to ZeroLatency Wealth — Unified Multi-Asset OS"
        html = f"""
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0c0b12; color: #f4f4f5; padding: 32px; border-radius: 16px; border: 1px solid rgba(168,85,247,0.3);">
            <div style="text-align: center; margin-bottom: 24px;">
                <span style="font-size: 24px; font-weight: 900; background: linear-gradient(135deg, #a855f7, #6366f1); -webkit-background-clip: text; color: transparent;">ZERO LATENCY WEALTH</span>
            </div>
            <h2 style="color: #ffffff; font-size: 20px;">Welcome aboard, {name}!</h2>
            <p style="color: #a1a1aa; line-height: 1.6;">Your unified financial command center is ready. Track equities, sovereign bonds, commercial REITs, and infrastructure InvITs with zero latency.</p>
            <div style="margin: 28px 0; text-align: center;">
                <a href="{APP_URL}/dashboard" style="background: linear-gradient(135deg, #9333ea, #6366f1); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: bold; display: inline-block;">Open Wealth OS</a>
            </div>
            <p style="font-size: 12px; color: #71717a; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px;">This is an automated message from ZeroLatency Wealth. Educational and simulation platform.</p>
        </div>
        """
        return cls.send_email(to_email, subject, html, f"Welcome to ZeroLatency Wealth, {name}! Open your dashboard at {APP_URL}/dashboard")

    @classmethod
    def send_verification_email(cls, to_email: str, name: str, token: str) -> bool:
        verify_url = f"{APP_URL}/verify-email?token={token}"
        subject = "Verify Your ZeroLatency Wealth Account"
        html = f"""
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0c0b12; color: #f4f4f5; padding: 32px; border-radius: 16px; border: 1px solid rgba(168,85,247,0.3);">
            <div style="text-align: center; margin-bottom: 24px;">
                <span style="font-size: 24px; font-weight: 900; background: linear-gradient(135deg, #a855f7, #6366f1); -webkit-background-clip: text; color: transparent;">ZERO LATENCY WEALTH</span>
            </div>
            <h2 style="color: #ffffff; font-size: 20px;">Verify your email address</h2>
            <p style="color: #a1a1aa; line-height: 1.6;">Hello {name}, please confirm your email address to activate your full Wealth OS terminal access.</p>
            <div style="margin: 28px 0; text-align: center;">
                <a href="{verify_url}" style="background: linear-gradient(135deg, #9333ea, #6366f1); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: bold; display: inline-block;">Verify Email Address</a>
            </div>
            <p style="font-size: 12px; color: #a1a1aa;">Or paste this link into your browser: <br/><code style="color: #c084fc;">{verify_url}</code></p>
            <p style="font-size: 11px; color: #71717a; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px;">If you did not request this account, please disregard this email.</p>
        </div>
        """
        return cls.send_email(to_email, subject, html, f"Verify your email at {verify_url}")

    @classmethod
    def send_password_reset_email(cls, to_email: str, name: str, token: str) -> bool:
        reset_url = f"{APP_URL}/reset-password?token={token}"
        subject = "Reset Your ZeroLatency Wealth Password"
        html = f"""
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0c0b12; color: #f4f4f5; padding: 32px; border-radius: 16px; border: 1px solid rgba(168,85,247,0.3);">
            <div style="text-align: center; margin-bottom: 24px;">
                <span style="font-size: 24px; font-weight: 900; background: linear-gradient(135deg, #a855f7, #6366f1); -webkit-background-clip: text; color: transparent;">ZERO LATENCY WEALTH</span>
            </div>
            <h2 style="color: #ffffff; font-size: 20px;">Password Reset Request</h2>
            <p style="color: #a1a1aa; line-height: 1.6;">Hello {name}, we received a request to reset your ZeroLatency Wealth account password. This link will expire in 60 minutes.</p>
            <div style="margin: 28px 0; text-align: center;">
                <a href="{reset_url}" style="background: linear-gradient(135deg, #9333ea, #6366f1); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            <p style="font-size: 12px; color: #a1a1aa;">Or visit: <br/><code style="color: #c084fc;">{reset_url}</code></p>
            <p style="font-size: 11px; color: #71717a; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px;">If you did not request a password reset, you can safely ignore this message.</p>
        </div>
        """
        return cls.send_email(to_email, subject, html, f"Reset your password at {reset_url}")

    @classmethod
    def send_security_alert(cls, to_email: str, name: str, activity: str) -> bool:
        subject = "Security Alert: ZeroLatency Wealth Account Notice"
        html = f"""
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0c0b12; color: #f4f4f5; padding: 32px; border-radius: 16px; border: 1px solid rgba(239,68,68,0.3);">
            <h2 style="color: #ef4444; font-size: 20px;">Security Notification</h2>
            <p style="color: #a1a1aa; line-height: 1.6;">Hello {name}, your ZeroLatency Wealth account registered the following security event:</p>
            <p style="color: #f4f4f5; font-weight: bold; background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px;">{activity}</p>
            <p style="font-size: 11px; color: #71717a; margin-top: 16px;">If this was you, no action is required.</p>
        </div>
        """
        return cls.send_email(to_email, subject, html, f"Security Alert: {activity}")
