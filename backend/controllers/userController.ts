import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';
import asyncWrapper from 'express-async-handler';
import path from 'path';

import User from '../models/userModel';
import Admin, { AdminSchema } from '../models/adminModel';
import { sendMail } from '../utils/mailFunc';
import { requestReset, passwordReset } from '../services/passwords';
import { AuthReq } from '../typings';


export const userSignup=asyncWrapper(async (req, res) => {
    let { name, email, password, confirmPassword } = req.body;

    name=name.trim()
    email=email.trim()
    password=password.trim()
    confirmPassword=confirmPassword.trim()


    if (!email || !password || !confirmPassword || !name) {
      res.status(400)
      throw Error("All fields must be filled");
    }
    else if (password !== confirmPassword){
      res.status(400)
      throw Error("Passwords not matching")
    }

    // Check if the user already exists
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      res.status(400)
      throw new Error('User already exists');
    }

    if(!validator.isStrongPassword(password)) {
      res.status(400)
      throw new Error('Password not strong enough!')
    }
    
    if(!validator.isEmail(email)) {
      res.status(400)
      throw new Error("Entered email address not valid!")
    }
    
    //Sending an email to the user
    
    const user = await User.create({ email, password, name });
    
    const token = user.createToken(true); //verify=true
    
    const url = `http://localhost:3000/api/users/verify/${token}`
    

    const subject = 'Account Verification'
    const html=`
        <h1>Account Verification</h1>
        <p>Thank you for signing up. Please click the following link to verify your account:</p>
        <a href=${url}>Verify Email</a>`

      //Will be implemented later.
    // sendMail(email,subject, html)

    
    res.status(201).json({ status: 'success', data: { name, email} });
})

export const userLogin =asyncWrapper( async (req, res) => {
  // try {
    console.log(req.body)
    let { email, password } = req.body;
    email=email.trim()
    password=password.trim()
    if (!email || !password) {
      res.status(400)
      throw Error("Email and password must be filled");
    }
        else if (!validator.isEmail(email)) {
          res.status(400)
          throw Error("Email format invalid");
        }
        
        
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
          res.status(404)
          throw new Error("User doesn't exist")
        }
        
        // Compare passwords
        const exists = await bcrypt.compare(password, user.password);
        if (!exists) {
          res.status(401)
          throw new Error("Incorrect password")
        }

        //Will be implemented later
        // if(!user.verified) {
        //   res.status(401)
        //   throw new Error("User is not verified")
        // }

    // Create a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY as jwt.Secret, { expiresIn: '5d'});
    console.log(user,user.name,  user.isAdmin, Boolean(user.isAdmin))
    res.status(200).json({status:"success", data:{  email , name:user.name, token }});
})


//Admin Login
export const adminLogin =asyncWrapper( async (req, res) => {
    let { email, password } = req.body;
    email=email.trim()
    password=password.trim()
    if (!email || !password) {
      res.status(400)
      throw Error("Email and password must be filled");
    }
        else if (!validator.isEmail(email)) {
          res.status(400)
          throw Error("Email format invalid");
        }
        
        
        // Find the user by email
        const user: AdminSchema | null= await Admin.findOne({ email });
        console.log(Admin)

        if (!user) {
          res.status(404)
          throw new Error("You aren't authorized!")
        }
        
        // Compare passwords
        const exists = await bcrypt.compare(password, user.password);
        if (!exists) {
          res.status(401)
          throw new Error("Incorrect password")
        }

        //Will be implemented later
        // if(!user.verified) {
        //   res.status(401)
        //   throw new Error("User is not verified")
        // }

    // Create a JWT token
    const token = jwt.sign({ id: user._id }, (process?.env?.JWT_KEY as jwt.Secret), { expiresIn: '1d'});
    res.status(200).json({status:"success", data:{ email ,isAdmin: true, name:user?.email, token }});

})

//NOTE: Will be implemented later. Not using it anywhere for now.
export const userVerify=asyncWrapper(async (req,res)=>{
  const {token} = req.params;
    const { id }= jwt.verify(token,process.env.JWT_VERIFY_KEY as jwt.Secret) as JwtPayload
  console.log(token, id)
  const newDoc = await User.findByIdAndUpdate(id,{ verified: true},{
    new: true
  } )
  if (!newDoc) {
    res.status(404)
    throw new Error("User doesn't exist")
  }
  console.log(newDoc)
  res.sendFile(path.join(__dirname,'..','static','html','verified.html'));
})


export const deleteAccount = asyncWrapper(async (req, res) => {
    const id = ((req as unknown) as AuthReq).user;

    // Find the user by email
    const user = await User.findByIdAndDelete(id);

    if (!user) {
       res.status(404)
       throw new Error("User doesn't exist")
    }

    const url = `${process.env.CLIENT_URL}/signup`

    const subject = 'Account Deleted'
    const html=`
        <h1>Account Deleted</h1>
        <p>Your account was succesfully deleted</p>
        <a href=${url}>Sign up to create an account!</a>`

        //Will be implemented later.
    // sendMail(user.email,subject, html)

    res.status(204).json({ status:"success",message: 'User account deleted successfully.' });
})

export const updateUser= asyncWrapper(async (req,res)=>{
  const id = ((req as unknown) as AuthReq).user;
  let { name,password,confirmPassword } = req.body;
  console.log(name,password,confirmPassword)
  //Changing passwords
  if( password!==undefined && confirmPassword!==undefined){
    password=password.trim()
    confirmPassword=confirmPassword.trim()
    if(!password || !confirmPassword) {
      res.status(400)
      throw new Error("Passwords cannot be empty");
    }
    if (password !== confirmPassword) {
      res.status(400)
      throw Error("Passwords not matching")
    }
    if(!validator.isStrongPassword(password)){
      res.status(400)
      throw new Error("Password not strong enough!")
    }
    
    const newDoc = await User.findByIdAndUpdate(id,{ password },{
      new: true,
      runValidators: true
    } )
  }  

  //Updating name
  if(name==undefined){
    res.status(404)  
    throw new Error("No name to update")
  }
  
  name=name.trim()

  if(!name) {
    res.status(404)  
    throw new Error("Please enter a valid name!")
  }


  const newDoc = await User.findByIdAndUpdate(id,{ name },{
    new: true,
    runValidators: true
  } )
  if (!newDoc) {
    res.status(404)
    throw new Error("User doesn't exist")
  }
  console.log(newDoc)
  res.status(200).json({status:"success", data: newDoc})
})


export const resetRequestController=asyncWrapper(async (req,res)=>{
    let { email } = req.body
    email=email.trim()
    if(!email || !validator.isEmail(email)) {
      res.status(400)
      throw new Error("Please enter a valid email")
    }
    const data = await requestReset(email)
    res.status(200).json({status:"success", data})
})

export const resetPasswordController=asyncWrapper(async (req,res)=>{
    let { password, confirmPassword, uid, token } = req.body
    const newDoc=await passwordReset(uid, token, password, confirmPassword)
    res.status(200).json({status:"success", data: newDoc})
})
