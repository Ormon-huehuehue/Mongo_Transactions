import mongoose, {Schema} from "mongoose"


const accountSchema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required: true
    },

    //In the real world, you shouldn’t store `floats` for balances in the database.
    // You usually store an integer which represents the INR value with
    // decimal places (for eg, if someone has 33.33 rs in their account,
    // you store 3333 in the database).

    // There is a certain precision that you need to support (which for india is
    // 2/4 decimal places) and this allows you to get rid of precision
    // errors by storing integers in your DB
    balance :{
        type: Number,
        required : true,

    }
})


export const Account = mongoose.model("Account", accountSchema);
