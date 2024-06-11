import { Router, Request, Response } from "express";
import passport from "passport";
import { failureHandler, successHandler } from "../controllers/oauthController";
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

const router = Router();

router.get("/login/success", successHandler);

router.get("/login/failed", failureHandler);

router.get("/google", passport.authenticate("google",  { scope: ["profile", "email"], prompt: 'select_account' }));

// Google OAuth callback URL
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect:`${process.env.CLIENT_URL}/failed`,prompt: 'select_account' }), (req, res) => {
    console.log("HAHAHAHAH")
  if (req.user) {
    const user: any = req.user;
    console.log("USERRRR: ", user)
    const token = jwt.sign({ id: (user)._id }, process.env.JWT_KEY as jwt.Secret, { expiresIn: '5d' });

    // Set the cookie
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',  
      // sameSite: 'none',  
      maxAge: 5 * 24 * 60 * 60 * 1000 
    });

    // Redirect to the success URL
    if(process.env.NODE_ENV=="aws-eb")  res.redirect(`/success`);
    else res.redirect(`${process.env.CLIENT_URL}/success`);
  } else {
    // Redirect to the failure URL
    if(process.env.NODE_ENV=="aws-eb")  res.redirect(`/failed`);
    else res.redirect(`${process.env.CLIENT_URL}/failed`);
  }
});


router.get("/logout", (req: Request, res: Response) => {
    res.redirect(process.env.CLIENT_URL as string);
});

export default router;
