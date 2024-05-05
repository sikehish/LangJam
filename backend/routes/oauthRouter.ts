import { Router, Request, Response } from "express";
import passport from "passport";
import { failureHandler, successHandler } from "../controllers/oauthController";

const router = Router();

router.get("/login/success", successHandler);

router.get("/login/failed", failureHandler);

router.get("/google", passport.authenticate("google",  { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", {
    successRedirect: "/api/oauth/login/success",
    failureRedirect: "/api/oauth/login/failed",
    session: false,
}));

router.get("/logout", (req: Request, res: Response) => {
    res.redirect(process.env.CLIENT_URL as string);
});

export default router;
