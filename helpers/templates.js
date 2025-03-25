const verifyEmailTemplate = (otp)=>{
    return `
    <div style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4CAF50;">Welcome to ChatWeb</h1>
            <p>Please verify your email address to complete your registration.</p>
        </div>
        <div>
            <p>Thank you for signing up! To complete the registration process, please verify your email address:</p>
            <p style="text-align: center;">
                <p style="background-color: #4CAF50; color: white; padding: 15px 30px; text-align: center; text-decoration: none; border-radius: 5px; font-size: 16px;">${otp}</p>
            </p>
            <p>If you did not sign up for an account, please ignore this email.</p>
        </div>
        <div style="margin-top: 30px; text-align: center; font-size: 14px; color: #777;">
            <p>If you have any questions, feel free to contact our support team.</p>
            <p>Best regards, <br> The ChatWeb Team</p>
        </div>
    </div>
    </div>`
}

module.exports = {verifyEmailTemplate}