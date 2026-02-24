const nodemailer = require('nodemailer');
const { logger } = require('../config/logger');

// Create transporter (Gmail SMTP)
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

const FROM_ADDRESS = `"VisionAid" <${process.env.EMAIL_USER || 'noreply@visionaid.app'}>`;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

/**
 * Send email verification link
 */
const sendVerificationEmail = async (email, name, token) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS ||
        process.env.EMAIL_USER === 'your-email@gmail.com') {
        logger.warn('Email not configured — skipping verification email', { email });
        return;
    }

    const verificationUrl = `${FRONTEND_URL}/verify-email?token=${token}`;
    const transporter = createTransporter();

    try {
        await transporter.sendMail({
            from: FROM_ADDRESS,
            to: email,
            subject: '✅ Verify your VisionAid account',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; border-radius: 16px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 40px 32px; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px;">👁️ VisionAid</h1>
                        <p style="margin: 8px 0 0; opacity: 0.85; font-size: 14px;">Color Accessibility Platform</p>
                    </div>
                    <div style="padding: 40px 32px;">
                        <h2 style="margin: 0 0 16px; font-size: 22px;">Hi ${name || 'there'} 👋</h2>
                        <p style="color: #aaa; line-height: 1.7;">Thanks for signing up! Please verify your email address to complete your account setup.</p>
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="${verificationUrl}" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; padding: 14px 36px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
                                ✅ Verify Email Address
                            </a>
                        </div>
                        <p style="color: #666; font-size: 13px; text-align: center;">This link expires in <strong style="color: #aaa;">24 hours</strong>. If you didn't sign up, please ignore this email.</p>
                        <hr style="border: none; border-top: 1px solid #222; margin: 32px 0;" />
                        <p style="color: #555; font-size: 12px; text-align: center;">Or copy this link: <a href="${verificationUrl}" style="color: #8b5cf6;">${verificationUrl}</a></p>
                    </div>
                </div>
            `,
        });
        logger.info('Verification email sent', { email });
    } catch (err) {
        logger.error('Failed to send verification email', { email, error: err.message });
        throw err;
    }
};

/**
 * Send password reset link
 */
const sendPasswordResetEmail = async (email, name, token) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS ||
        process.env.EMAIL_USER === 'your-email@gmail.com') {
        logger.warn('Email not configured — skipping password reset email', { email });
        return;
    }

    const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;
    const transporter = createTransporter();

    try {
        await transporter.sendMail({
            from: FROM_ADDRESS,
            to: email,
            subject: '🔑 Reset your VisionAid password',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; border-radius: 16px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 40px 32px; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px;">👁️ VisionAid</h1>
                        <p style="margin: 8px 0 0; opacity: 0.85; font-size: 14px;">Password Reset Request</p>
                    </div>
                    <div style="padding: 40px 32px;">
                        <h2 style="margin: 0 0 16px; font-size: 22px;">Hi ${name || 'there'} 🔑</h2>
                        <p style="color: #aaa; line-height: 1.7;">We received a request to reset your password. Click the button below to create a new password.</p>
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="${resetUrl}" style="background: linear-gradient(135deg, #ef4444, #dc2626); color: #fff; padding: 14px 36px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
                                🔑 Reset My Password
                            </a>
                        </div>
                        <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 16px; margin: 24px 0;">
                            <p style="margin: 0; color: #aaa; font-size: 13px;">⏰ This link expires in <strong style="color: #fff;">1 hour</strong></p>
                            <p style="margin: 8px 0 0; color: #aaa; font-size: 13px;">🔒 If you didn't request this, your account is still secure — just ignore this email.</p>
                        </div>
                        <hr style="border: none; border-top: 1px solid #222; margin: 32px 0;" />
                        <p style="color: #555; font-size: 12px; text-align: center;">Or copy this link: <a href="${resetUrl}" style="color: #ef4444;">${resetUrl}</a></p>
                    </div>
                </div>
            `,
        });
        logger.info('Password reset email sent', { email });
    } catch (err) {
        logger.error('Failed to send password reset email', { email, error: err.message });
        throw err;
    }
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
