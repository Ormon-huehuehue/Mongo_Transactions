import { Router } from "express";
import { Account } from "../models/accountModel.js";
import { User } from "../models/userModel.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import mongoose from "mongoose";

const router = Router();


router.get("/balance", verifyJWT, async(req,res)=>{
    const userId = req.userId;

    const account = await Account.findOne({userId});

    return res.json({
        balance:  account.balance
    })
})


router.post("/transfer", verifyJWT, async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const transactionResults = await session.withTransaction(async () => {
            const {amount, to} = req.body;
            console.log("TO : ", to);
            console.log("Amount : ", amount)

            const userId = req.userId;
            console.log("userId : ", userId)

            // Fetch accounts within the transaction
            const fromAccount = await Account.findOne({userId : userId}).session(session);

            if (!fromAccount || fromAccount.balance < amount) {
                throw new Error("Invalid account or insufficient balance");
            }

            const toAccount = await Account.findOne({ userId: to }).session(session);
            if (!toAccount) {
                throw new Error("Invalid receiver account");
            }

            // Perform the transfer
            await Account.updateOne({userId: req.userId}, {$inc: {balance: -amount}}).session(session);
            await Account.updateOne({userId: to}, {$inc: {balance: amount}}).session(session);

            console.log("Transfer successful")

            return true;
        });

        if (transactionResults) {
            res.json({message: "Transfer successful"});
        } else {
            res.status(400).json({message: "Transfer failed"});
        }
    } catch (error) {
        res.status(400).json({message: error.message});
    } finally {
        session.endSession();
    }
});

router.get("/search", async(req,res)=>{

    const userId = req.body.userId || "";
    console.log(userId)

    const accounts = await Account.findOne({
           userId: userId
    })

    res.json({
        account : {
            userId : accounts.userId,
            balance : accounts.balance
        }
    })
    
    // res.json({
    //     accounts : accounts.map(account=>({
    //         userId : account.userId,
    //         balance : account.balance
    //     }))
    // })

})

export default router;