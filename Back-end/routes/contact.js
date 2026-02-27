const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const logger = require('../config/logger');
const nodemailer = require('nodemailer');

// Strict rate limit for contact form
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: { error: 'Too many messages sent. Please try again in an hour.' },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * @route   POST /api/contact
 * @desc    Handle contact form submission
 * @access  Public (rate-limited)
 * Body: { name, email, subject, message }
 */
router.post('/', contactLimiter, async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'name, email, and message are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email address.' });
    }

    if (message.length > 2000) {
        return res.status(400).json({ error: 'Message is too long (max 2000 characters).' });
    }

    try {
        // Log the contact submission (in production you'd email this via nodemailer/sendgrid)
        logger.info('Contact form submission', {
            name,
            email,
            subject: subject || '(no subject)',
            messageLength: message.length,
            timestamp: new Date().toISOString(),
        });

        // Integrate nodemailer to forward to visionaid07@gmail.com
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const htmlEmail = `
            <h3>New Contact Form Submission - Vision Aid</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
            <h4>Message:</h4>
            <p>${message}</p>
        `;

        await transporter.sendMail({
            from: process.env.EMAIL_USER, // Using authenticated email sender
            replyTo: email,              // Set reply-to as the submitter
            to: 'visionaid07@gmail.com', // Sending to the admin account directly
            subject: `New Message: ${subject || 'Vision Aid Contact Form'}`,
            html: htmlEmail
        });

        res.status(200).json({
            success: true,
            message: 'Thank you! Your message has been received. We\'ll reply within 24 hours.',
        });
    } catch (error) {
        logger.error('Contact form error', { error: error.message });
        res.status(500).json({ error: 'Failed to send message. Please try again later.' });
    }
});

module.exports = router;
