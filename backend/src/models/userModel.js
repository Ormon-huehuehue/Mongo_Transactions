import mongoose,{Schema} from "mongoose"

const userSchema = new Schema({
    email:{
        required: true,
        type:String,
        unique : true,
        trim : true,
    },
    username :{
        required : true,
        type:String,
        unique: true
    },
    password : {
        type: String,
        required : true,
        minlength : 6
    }
})

export const User = mongoose.model("User", userSchema);