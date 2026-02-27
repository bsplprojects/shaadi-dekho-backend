import axios from "axios";

export async function sendEmail(to, link) {
  await axios.post(
    "https://api.zeptomail.in/v1.1/email",
    {
      bounce_address: process.env.ZOHO_BOUNCE_ADDRESS,
      from: {
        address: process.env.ZOHO_MAIL_FROM,
        name: "Vivah Bandhan",
      },
      to: [{ email_address: { address: to } }],
      subject: "Verify Your Email",
      htmlbody: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f4f4f4;">
        <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">  
            <h2 style="color: #333333; margin-bottom: 10px;">Verify Your Email</h2>
            
            <p style="color: #555555; font-size: 16px; line-height: 1.5;">
                Thanks for signing up! Please confirm your email address by clicking the button below.
            </p>

            <a
                href="${link}"
                target="_blank"
                style="
                    display: inline-block;
                    margin-top: 20px;
                    padding: 14px 28px;
                    font-size: 16px;
                    font-weight: bold;
                    color: #ffffff;
                    background-color: #007BFF;
                    text-decoration: none;
                    border-radius: 6px;
                 "
            >
                Verify Email
            </a>

            <p style="color: #555555; font-size: 14px; margin-top: 20px;">
                This verification link is valid for <strong>1 hour</strong>.
            </p>

            <p style="color: #777777; font-size: 13px; margin-top: 10px;">
                If the button doesn’t work, copy and paste this link into your browser:
            </p>

            <p style="word-break: break-all; font-size: 12px; color: #007BFF;">
                ${link}
            </p>

            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">

            <p style="color: #888888; font-size: 12px;">
                If you did not create an account, you can safely ignore this email.
            </p>
        </div>
    </div>
          `,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Zoho-enczapikey ${process.env.ZOHO_API_KEY}`,
      },
    },
  );
}
