import jwt from "jsonwebtoken"


export const verifyJWT = async(req, res, next) =>{
    
    // const token = req.cookies?.token || req.headers("Authorization").replace("Bearer ", "");

    //easier way to get rid of "Bearer "
    const token = req.headers.authorization.split(' ')[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.userId;

        next();
    }
    catch(error){
        return res.status(403).json({
            message : "Invalid token"
        })
    }
        
}