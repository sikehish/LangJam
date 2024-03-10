import User from "../models/userModel";
import Token from "../models/tokenModel";
import { sendMail } from "../utils/mailFunc";
import crypto from "crypto";
import bcrypt from "bcrypt";
import validator from "validator";
import { UserDocument } from '../models/userModel';

interface ResetRequestResult {
  uid: string;
  token: string;
}


export const requestReset = async (email: string): Promise<ResetRequestResult> => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("User does not exist");

  const token = await Token.findOneAndDelete({ uid: user.id });

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = await bcrypt.hash(resetToken, 10);

  const newToken = await Token.create({
    uid: user.id,
    token: hashedToken,
  });

  const url = `${process.env.CLIENT_URL}/passwordReset?uid=${user.id}&token=${resetToken}`;

  const subject = "Password Reset Request";

  const html = `
        <h1>Password Reset</h1>
        <p>Hello ${user.email}</p>
        <p>Click on the link below to reset your password</p>
        <a href=${url}>Password Reset</a>`;

  sendMail(user.email, subject, html);

  return {
    uid: user.id,
    token: resetToken,
  };
};

export const passwordReset = async (
  uid: string,
  token: string,
  password: string,
  confirmPassword: string
): Promise<UserDocument | null> => {
  const hashedTokenDoc = await Token.findOne({ uid });

  if (!hashedTokenDoc) {
    throw new Error("The user doesn't exist!");
  }

  const exists = await bcrypt.compare(token, hashedTokenDoc.token);

  if (!exists) {
    throw new Error("The reset password token is invalid");
  }

  password = password.trim();
  confirmPassword = confirmPassword.trim();

  if (!password || !confirmPassword) throw new Error("Passwords cannot be empty");
  if (password !== confirmPassword) throw Error("Passwords not matching");
  if (!validator.isStrongPassword(password)) throw new Error("Password not strong enough!");

  const hashedPassword = await bcrypt.hash(password, 10);

  const newDoc = await User.findByIdAndUpdate(
    uid,
    { password: hashedPassword },
    {
      new: true,
      runValidators: true,
    }
  ) as UserDocument;

  if(newDoc==null) return null


  const url = `${process.env.CLIENT_URL}/login`;

  const subject = "Password Reset Successful";

  const html = `
        <h1>Your password was reset successfully!</h1>
        <p>Hello ${newDoc?.email}</p>
        <p>Your password reset was successful</p>
        <p>Click on the link below to login</p>
        <a href=${url}>Login</a>`;

  sendMail(newDoc?.email as string, subject, html);

  await hashedTokenDoc.deleteOne();

  return newDoc;
};
