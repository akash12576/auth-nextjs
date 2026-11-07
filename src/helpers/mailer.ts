import nodemailer from "nodemailer";
import User from "@/models/userModel.js";
import bcryptjs from 'bcryptjs';


export const sendEmail = async ({ email, emailType, userId }: { email: string; emailType: string; userId: any }) => {
    try {
      const hashedToken =  await bcryptjs.hash(userId.toString() , 10);
      
      if(emailType === "VERIFY"){
        await User.findByIdAndUpdate(userId , 
        {verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000})
      }else if(emailType === "RESET"){
        await User.findByIdAndUpdate(userId , 
        {forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000})
      }

        var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "15eb36ed95368c",
        pass: "e8894fe4b3c6fb"
    }
    });

    transport.sendMail({
    from: "Private Person <from@example.com>",
    to: "A Test User <to@example.com>",
    subject: "Hello from Mailtrap",
    text: "This is a test e-mail message."
    }, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    });

    const mailOptions = {
        from: 'ks2143@gmail.com',
        to: email,
        subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
        html: `<p> Click <a href="${process.env.domain}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "Verify your email" : "reset your password"}</p>`
    }

    const mailresponse =  await transport.sendMail(mailOptions)
    return mailresponse;

    } catch (error:any) {
        throw new Error(error.message)
    }
}


