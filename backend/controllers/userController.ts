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
import Quiz from '../models/quizModel';
import { UserDocument } from '../models/userModel';
import { getQuizzesIncomplete, getQuizzesCompleted, getQuizzesNotAttempted } from '../utils/filterMethods';
import redisClient from "../config/redisConfig"


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

    
    res.status(201).json({ status: 'success', data: { name, email, id:user._id} });
})

export const userLogin =asyncWrapper( async (req, res) => {
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
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY as jwt.Secret, /*{ expiresIn: '5d'}*/);
    // console.log(token) 
    // console.log(user,user.name,  user.isAdmin, Boolean(user.isAdmin))            
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
    const token = jwt.sign({ id: user._id }, (process?.env?.JWT_ADMIN_KEY as jwt.Secret), /*{ expiresIn: '1d'}*/);
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

//Updates made from the profile page
export const updateUser = asyncWrapper(async (req, res) => {
  const id = ((req as unknown) as AuthReq).user;
  let { name, password, confirmPassword, description,dp } = req.body;

  if (password !== undefined && confirmPassword !== undefined) {
    password = password.trim();
    confirmPassword = confirmPassword.trim();

    if (!password || !confirmPassword) {
      res.status(400);
      throw new Error("Passwords cannot be empty");
    }
    if (password !== confirmPassword) {
      res.status(400);
      throw new Error("Passwords do not match");
    }
    if (!validator.isStrongPassword(password)) {
      res.status(400);
      throw new Error("Password is not strong enough");
    }

    const updatedUser = await User.findByIdAndUpdate(id, { password }, {
      new: true,
      runValidators: true
    });
    console.log(updatedUser);
  }

  if (name !== undefined) {
    name = name.trim();

    if (!name) {
      res.status(400);
      throw new Error("Please enter a valid name");
    }

    const updatedUser = await User.findByIdAndUpdate(id, { name }, {
      new: true,
      runValidators: true
    });
  }

  if (description !== undefined) {
    description = description.trim();

    if (!description) {
      res.status(400);
      throw new Error("Description cannot be empty!");
    }

    const updatedUser = await User.findByIdAndUpdate(id, { description }, {
      new: true,
      runValidators: true
    });
  }

  if(!dp){
    const imageData = req?.file?.buffer.toString("base64"); 
  if(!imageData){
    res.status(400)
    throw new Error("Image data issue")
  }

  await redisClient.set(id, imageData);
  }

  res.status(200).json({ status: "success" });
});



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


export const attemptQuestion = asyncWrapper(async (req: Request, res: Response) => {
  const { quizId, questionId, chosenOption } = req.body;
  const userId = ((req as AuthReq)?.user); 

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
     res.status(404)
     throw new Error('Quiz not found');
  }

  if (chosenOption < 0 || chosenOption >= quiz.questions.length) {
     res.status(400)
     throw new Error('Invalid chosen option')
  }


  const user: UserDocument | null = await User.findById(userId);
  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  const question = quiz.questions.find(q => q._id.toString() === questionId);
  if (!question) {
    res.status(404)
    throw new Error('Question not found')
  }

  const isCorrect = question.correctOption === chosenOption;
    console.log(question.correctOption, chosenOption)

  user.recordAttempt(quizId, questionId, chosenOption, isCorrect, quiz?.difficulty);

  res.status(200).json({ status:"success", data:{isCorrect} });
});


export const getAttemptedQuestions =asyncWrapper(async (req: Request, res: Response) => {
    const userId = (req as AuthReq)?.user; 
    const user = await User.findById(userId);

    if (!user) {
       res.status(404)
       throw new Error('User not found')
    }
    const attemptedQuestions = user.attempts || {}; 
    res.status(200).json({ status:"success", data:{attemptedQuestions}});
})

export const getAttemptedQuizDetails =asyncWrapper(async (req: Request, res: Response) => {
  const userId = (req as AuthReq)?.user; 
  const user = await User.findById(userId);
  const {quizId} = req.params
  console.log("ahhahahh ", quizId)
  if (!user) {
     res.status(404)
     throw new Error('User not found')
  }
  console.log(user)
  const attemptedQuizDetails = (quizId && user.quizAttempts.get(quizId) )? user.quizAttempts.get(quizId) : {}; 
  res.status(200).json({ status:"success", data:{attemptedQuizDetails}});
})

export const getFilteredQuizzes = asyncWrapper(async (req: Request, res: Response) => {
  const userId = (req as AuthReq)?.user;
  const user = await User.findById(userId);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  const {topicId} = req.params
  const { filter } = req.query;

  if (!filter || !topicId) {
    res.status(400);
    throw new Error('Filter and topicId parameters are required');
  }

  let filteredQuizzes;

  switch (filter) {
    case 'yetto':
      filteredQuizzes = await getQuizzesNotAttempted(user, topicId);
      break;
    case 'completed':
      filteredQuizzes = await getQuizzesCompleted(user, topicId);
      break;
    case 'incomplete':
      filteredQuizzes = await getQuizzesIncomplete(user, topicId);
      break;
    default:
      res.status(400);
      throw new Error('Invalid filter value');
  }

  // console.log("FILTER: ",filteredQuizzes)

  res.status(200).json({ status: 'success', data: filteredQuizzes });
});


export const getLeaderboard = asyncWrapper(async (req, res) => {
  const leaderboard = await User.find({}, '_id email name xp dp').sort({ xp: -1 }).limit(5); // Get top 5 users based on XP
  for(const user of leaderboard){
      const imageData = await redisClient.get(user._id);
      if(imageData) user["dp"]=imageData
    
  }
  res.status(200).json({ status: 'success', data: leaderboard });
})

export const getRank = asyncWrapper(async (req, res) => {
  const userId = (req as AuthReq)?.user;
  // const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }

  const userRank = await User.countDocuments({ xp: { $gt: user?.xp ?? 0 } }) + 1;
  const imageData = await redisClient.get(user._id);
  const data= { user: userId, rank: userRank, xp: user?.xp, name:user?.name , email:user?.email, dp: imageData || ""} 
  res.status(200).json({ status: 'success', data});
})

export const getCurrentUser = asyncWrapper(async (req, res) => {
  const userId = (req as AuthReq)?.user;
  const user = await User.findById(userId, { password: 0, isAdmin: 0 });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const imageData = await redisClient.get(userId);
  const data= imageData? { ...(user.toJSON()), dp: imageData } : user 
  res.status(200).json({ status: 'success', data });
});



export const uploadImage = asyncWrapper(async (req, res) => {
  const userId = (req as AuthReq)?.user;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404)
    throw new Error("User not found")
  }
  const imageData = req?.file?.buffer.toString("base64"); 

  if(!imageData){
    res.status(400)
    throw new Error("Image data issue")
  }

  await redisClient.set(userId, imageData);

  res.status(200).json({ status: 'success', data: {...user, dp: imageData} });
});

//Handle Optional fields(on signup)
export const handleOptionalFields = asyncWrapper(async (req, res) => {
  let { email, description } = req.body;

  if(!email){
    res.status(400);
    throw new Error("Email cannot be empty!");
  }
  
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    res.status(404);
    throw new Error("User not found");
  }

  if(typeof description === "string" && description.length && !description.trim()){
    res.status(404);
    throw new Error("Ensure that the description you enter isnt an empty string!");
  }
  
  if(description!==undefined)
    {
      description = description.trim();
      const updatedUser = await User.findOneAndUpdate({ email }, { description }, {
        new: true,
        runValidators: true
      });
    }


  const imageData = req?.file?.buffer.toString("base64");
  if (imageData) {
    await redisClient.set(existingUser._id, imageData);
  } 

  res.status(200).json({ status: "success" });
});
