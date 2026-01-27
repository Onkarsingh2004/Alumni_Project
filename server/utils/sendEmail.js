const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    let transporter;

    // Check if real SMTP credentials are provided
    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        });
    } else {
        // Fallback to Ethereal (Fake Email for Development)
        console.log('No SMTP credentials found in .env. Using Ethereal (Dev mode)...');
        const testAccount = await nodemailer.createTestAccount();

        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
    }

    const message = {
        from: `${process.env.FROM_NAME || 'Alumni Portal'} <${process.env.FROM_EMAIL || 'noreply@alumni.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);

    // If using Ethereal, log the preview URL
    if (!process.env.SMTP_EMAIL) {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
};

module.exports = sendEmail;
