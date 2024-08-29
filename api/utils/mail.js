import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD, 
  },
});

export const sendOTPEmail = (email, otp, type) => {
  const mailOptions = {
    from: `'FINDYOUR-ESTATE' <${process.env.EMAIL}`,
    to: email,
    subject: type === 'verification' 
      ? 'Verify Your Email Address for FIND YOUR ESTATE' 
      : 'Password Reset Request for FIND YOUR ESTATE',
      html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="font-size: 22px; color: #333;">
              ${type === 'verification' 
                  ? 'Verify Your Email Address' 
                  : 'Password Reset Request'}
          </h2>
          <p style="font-size: 16px; line-height: 1.5;">Dear User,</p>
          <p style="font-size: 16px; line-height: 1.5;">
              ${type === 'verification' 
                  ? `Thank you for registering with FINDYOUR-ESTATE! To complete your registration, please verify your email address by entering the following OTP (One-Time Password) in the application:`
                  : `We received a request to reset the password for your account on FINDYOUR-ESTATE. To proceed with resetting your password, please use the following OTP (One-Time Password):`}
          </p>
          <div style="text-align: center; margin: 20px 0;">
              <span style="font-size: 24px; color: #4CAF50; font-weight: bold;">${otp}</span>
          </div>
          <p style="font-size: 16px; line-height: 1.5;">
              For security reasons, this OTP will expire in 10 minutes. If you did not request this OTP, please disregard this email.
          </p>
          <p style="font-size: 16px; line-height: 1.5;">
              If you need any further assistance, please contact our support team.
          </p>
          <p style="font-size: 16px; line-height: 1.5;">Thank you for using FINDYOUR-ESTATE.</p>
          <p style="font-size: 16px; line-height: 1.5; font-weight: bold;">Best Regards,<br>The FINDYOUR-ESTATE Team</p>
          <hr style="border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="font-size: 12px; color: #888; text-align: center;">
              This is an automated message, please do not reply. If you need assistance, contact us at <a href="mailto:findyourrestate@gmail.com" style="color: #4CAF50; text-decoration: none;">findyourrestate@gmail.com</a>.
          </p>
          <p style="font-size: 12px; color: #888; text-align: center;">
              &copy; 2024 FINDYOUR-ESTATE. All rights reserved.
          </p>
      </div>
  `,
};

console.log('Sending email with options:', mailOptions);

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
      console.error('Error sending email:', error);
  } else {
      console.log('Email sent:', info.response);
  }
});
}

export const sendVerificationEmail = async (email, Title) => {
  const mailOptions = {
      from: `"FINDYOUR-ESTATE" <${process.env.EMAIL}>`,
      to: email,
      subject: 'Your Listing Has Been Verified!',
      html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
              <h2 style="font-size: 24px; color: #4CAF50;">Congratulations, Your Listing Has Been Verified!</h2>
              <p style="font-size: 16px; line-height: 1.5;">Dear Valued User,</p>
              <p style="font-size: 16px; line-height: 1.5;">
                  We are excited to inform you that your listing titled <strong>"${Title}"</strong> has been successfully verified by our team. Your listing is now live and available on the public feed for everyone to see.
              </p>
              <p style="font-size: 16px; line-height: 1.5;">
                  We appreciate your trust in FINDYOUR-ESTATE and look forward to helping you connect with potential buyers and renters. If you have any questions or need further assistance, please do not hesitate to reach out to our support team.
              </p>
              <p style="font-size: 16px; line-height: 1.5;">Best regards,</p>
              <p style="font-size: 16px; line-height: 1.5; font-weight: bold;">The FINDYOUR-ESTATE Team</p>
              <hr style="border-top: 1px solid #ddd; margin: 30px 0;">
              <p style="font-size: 12px; color: #888; text-align: center;">
                  This is an automated message, please do not reply. If you need assistance, contact us at <a href="mailto:findyourrestate@gmail.com" style="color: #4CAF50; text-decoration: none;">findyourrestate@gmail.com</a>.
              </p>
              <p style="font-size: 12px; color: #888; text-align: center;">
                  &copy; 2024 FINDYOUR-ESTATE. All rights reserved.
              </p>
          </div>
      `,
  };

  try {
      await transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${email}`);
  } catch (error) {
      console.error('Error sending email:', error);
  }
}