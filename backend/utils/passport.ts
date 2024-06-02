import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModel';
import redisClient from "../config/redisConfig"
import { getImageDataFromUrl } from './getImageDataFromUrl';

passport.use(new GoogleStrategy({ 
    clientID:process.env.OAUTH_CLIENT_ID!,
    clientSecret:process.env.OAUTH_CLIENT_SECRET!, 
    callbackURL:"/api/oauth/google/callback",
    scope:["profile","email"],
    passReqToCallback:true
  }, 
  async function(request, accessToken, refreshToken, profile: any, done) { 
      try {
        const email = profile?.emails[0]?.value;
        let user = await User.findOne({ email });
  
        if (!user) {
          const randomPassword = (length = 12) => Array.from(crypto.getRandomValues(new Uint32Array(length)), x => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]".charAt(x % 72)).join('');
          user = await User.create({ email, password: randomPassword(), name: profile?.displayName });
  
          const imageData = await getImageDataFromUrl(profile.photos[0].value);
          await redisClient.set(user?._id, imageData);
        }
  
        return done(null, user); 
      } catch (err) {
        return done(err, false);
      }
  } 
  ));
