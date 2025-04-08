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

const resetPassTemplate = (randomString, email)=>{
    return `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #f4f4f4; padding: 20px 0;">
        <tr>
            <td align="center">
                <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; background-color: #ffffff; padding: 20px; border-radius: 8px;">
                    <tr>
                        <td style="text-align: center; padding-bottom: 20px;">
                            <h2 style="color: #333333; font-size: 24px;">Forgot Your Password?</h2>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 20px; color: #333333; font-size: 16px; line-height: 1.5;">
                            <p>Hello</p>
                            <p>We received a request to reset the password for your account. If you didn't request this change, please ignore this email.</p>
                            <p>To reset your password, click the button below:</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <a href="${process.env.BASE_URL}/api/v1/auth/resetpassword/${randomString}?email=${email}" style="background-color: #007bff; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">Reset Your Password</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="color: #666666; font-size: 14px; text-align: center;">
                            <p>This link will expire in 10 min for security reasons.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</div>
    `
}
module.exports = {verifyEmailTemplate, resetPassTemplate}