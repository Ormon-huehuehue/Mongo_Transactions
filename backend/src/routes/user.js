import express from "express";
import zod from "zod"
import jwt from "jsonwebtoken"
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt"
import {verifyJWT} from "../middleware/auth.middleware.js"
import { Account } from "../models/accountModel.js";

const router = express.Router();


const signUpSchema = zod.object({
    email: zod.string().email(),
    password : zod.string(),
    username : zod.string()
})


router.post("/signup", async(req,res)=>{
    const body = req.body;

    const {success} = signUpSchema.safeParse(body);

    if(!success){
        return res.json({
            message: "invalid input"
        })
    }

    const existingUser = await User.findOne({email : body.email});

    if(existingUser){
        return res.status(401).json({
            message : "Email already taken"
        })
    }

    //hashing the password before storing it in the database
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await User.create({
        email : body.email,
        password : hashedPassword,
        username : body.username
    });

    const userId = user._id;

    // Create new balance account with some default amount of money(between 1-10000) already in it
    await Account.create({
        userId,
        balance : 1 + Math.random()*10000
    })

    const token = jwt.sign({
        userId
    }, process.env.JWT_SECRET)

    res.json({
        message : "User created successfully",
        token : token
    })
})


const signInBody = zod.object({
    email : zod.string().email(),
    password: zod.string()
})


router.post("/signin", async(req, res)=>{
    const body = req.body;
    const {success} = signInBody.safeParse(body);

    if(!success){
        res.status(400).json({
            message: "Invalid credentials"
        })
    }

    const existingUser = await User.findOne({
        email : body.email
    })

    if(existingUser){
        const isPasswordCorrect = bcrypt.compare(body.password, existingUser.password);
        if(isPasswordCorrect){
            const userId = existingUser._id
            const token = jwt.sign({
                userId
            }, process.env.JWT_SECRET)
        
            res.cookie("token", token);
            
            res.status(200).json({
                message : "Successfully signed in",
                token : token
            })

        }
        return;
    }   

    return res.status(401).json({
        message : "Error while logging in"
    })    
})

const updateBody = zod.object({
    username : zod.string().optional(),
    password : zod.string().optional()
})

router.put("changePassword",verifyJWT, async(req,res)=>{
    const body = req.body;
    const {success} = updateBody.safeParse(body)
    if(!success){
        return res.status(400).json({
            message: "Error while reading the input"
        })
    }

    try{
        await User.updateOne(body, 
            {
                _id : body.userId
            });
        
        return res.json({
            message  : "User details updated "
        })


    }
    catch(error){
        return res.status(400).json({
            message : "Error while updating the user details"
        })
    }

})


//route to search for a user based on the username
router.get("/search", async(req,res)=>{
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [
            {username : {
                $regex : filter
            }},
            {email: {
                $regex : filter
            }}
        ]
    })

    res.json({
        user : users.map(user=>({
            username : user.username,
            email : user.email,
            _id : user._id
        }))
    })

})


export default router;