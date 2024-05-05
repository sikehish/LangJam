import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from "passport"

passport.use(new GoogleStrategy({ 
    clientID:process.env.OAUTH_CLIENT_ID!, // Your Credentials here. 
    clientSecret:process.env.OAUTH_CLIENT_SECRET!, // Your Credentials here. 
    callbackURL:"/api/oauth/google/callback",
    scope:["profile","email"],
    passReqToCallback:true
  }, 
  function(request, accessToken, refreshToken, profile, done) { 
    // console.log(accessToken, profile)
    return done(null, profile); 
  } 
  ));
