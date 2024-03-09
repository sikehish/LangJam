const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User= require('../models/userModel');
const Admin= require('../models/adminModel');
const validator=require('validator');
const asyncWrapper=require('express-async-handler')

const  path = require('path');
const { sendMail } = require('../utils/mailFunc');
const { requestReset, passwordReset } = require('../services/passwords');
const Language = require('../models/LanguageModel');


// Set up routes
exports.createLanguage=createLangasyncWrapper(async (req, res) => {

  const id = req.user;
    const user = await Admin.findById(id);

    if (!user) {
       res.status(404)
       throw new Error("User isn't authorized")
    }

    let { lang } = req.body;

    lang=lang.trim()

    if (!lang) {
      res.status(400)
      throw Error("All fields must be filled");
    }

    const checkLang = await Language.findOne({ lang });
    if (checkLang) {
      res.status(400)
      throw new Error('Language already entered!');
    }

    const data = await Language.create({ lang });
    
    console.log(data)

    res.status(201).json({ status: 'success', data });
})

exports.getAllLanguages=createLangasyncWrapper(async (req, res) => {


    const data = await Language.find();
    console.log(data)
    res.status(201).json({ status: 'success', data });
})
