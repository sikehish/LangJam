import { Router, Request, Response } from "express";
import passport from "passport";

export const successHandler = async (req: any, res: Response) => {
    // console.log("SUCCESS ", Object.keys(req))
    // console.log(req.cookies)
    if (req.user) {
        res.status(200).json({
            error: false,
            message: "Successfully Logged In",
            user: req.user,
        });
    } else {
        res.status(403).json({ error: true, message: "Not Authorized" });
    }
}

export const failureHandler = async (req: Request, res: Response) => {
    console.log("ERROR ")
    res.status(401).json({
        error: true,
        message: "Login failure",
    });
}



// router.get("/logout", (req: Request, res: Response) => {
//     res.redirect(process.env.CLIENT_URL as string);
// });

