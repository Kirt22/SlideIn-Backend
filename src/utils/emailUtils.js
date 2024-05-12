const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
    service: `${process.env.EMAIL_SERVICE}`,
    auth: {
        user: `${process.env.EMAIL}`, // Your Gmail email address
        pass: `${process.env.EMAIL_PASSWORD}` // Your Gmail password
    }
});

const sendResetEmail = async (email, resetLink) => {
    const mailOptions = {
        from: `${process.env.EMAIL}`, // Sender email address
        to: email,
        subject: 'Password Reset- SlideIn',
        html: `<p>Click the following link to reset your password:</p>
               <a href="${resetLink}">${resetLink}</a>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully');
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
};

module.exports = { sendResetEmail };
