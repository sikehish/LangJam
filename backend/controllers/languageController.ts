import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import Admin from '../models/adminModel';
import validator from 'validator';
import asyncWrapper from 'express-async-handler';
import path from 'path';
import { sendMail } from '../utils/mailFunc';
import { requestReset, passwordReset } from '../services/passwords';
import Language from '../models/languageModel';
import { AuthReq } from '../typings';

export const createLanguage = asyncWrapper(async (req: Request, res: Response) => {
  const id = ((req as unknown)as AuthReq).user;
  const user = await Admin.findById(id);

  if (!user) {
    res.status(404);
    throw new Error("User isn't authorized");
  }

  let { lang } = req.body;

  lang = lang.trim();

  if (!lang) {
    res.status(400);
    throw new Error('All fields must be filled');
  }

  const checkLang = await Language.findOne({ name: lang });
  if (checkLang) {
    res.status(400);
    throw new Error('Language already entered!');
  }
  const data = await Language.create({ name: lang });
  res.status(201).json({ status: 'success', data });
});

export const getAllLanguages = asyncWrapper(async (req: Request, res: Response) => {
  const data = await Language.find();
  res.status(200).json({ status: 'success', data });
});
