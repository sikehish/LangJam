import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(new GoogleStrategy({ 
    clientID:process.env.OAUTH_CLIENT_ID!,
    clientSecret:process.env.OAUTH_CLIENT_SECRET!, 
    callbackURL:"/api/oauth/google/callback",
    scope:["profile","email"],
    passReqToCallback:true
  }, 
  function(request, accessToken, refreshToken, profile, done) { 
    // console.log(accessToken, profile)
    return done(null, profile); 
  } 
  ));
