import userModel from "../models/user.model.js";
import sessionModel from "../models/session.model.js";
import jwt from 'jsonwebtoken'
import config from "../config/config.js";
import crypto from 'crypto'

export async function userRegister(req,res){

    let { username, email, password } = req.body;

    let isAlreadyRegistred = await userModel.findOne({
        $or : [ {username} , {email} ]
    });

    if(isAlreadyRegistred){
        return res.status(409).json({
            message:"Username or email Already Exist"
        });
    }

    const hashedPassword = crypto
        .createHash('sha256')
        .update(password)
        .digest('hex');

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword,
        role: "user"
    });

    const refreshtoken = jwt.sign(
        { username, email },
        config.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.cookie("refreshtoken", refreshtoken, {
        httpOnly:true,
        secure:true,
        sameSite: "lax",
        maxAge: 7*24*60*60*1000
    });

    let hashedrefreshtoken = crypto
        .createHash('sha256')
        .update(refreshtoken)
        .digest('hex');

    let session = await sessionModel.create({
        userId:user._id,
        refreshtoken:hashedrefreshtoken,
        ip:req.ip,
        userAgent:req.headers["user-agent"]
    });

    const accesstoken = jwt.sign({
        id: user._id,
        role: user.role,
        session_id: session._id
        }, config.JWT_SECRET,{
        expiresIn:'15m'
        });

    return res.status(201).json({
        message:"User created successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            role:user.role
        },
        accesstoken
    });
}

export  async function getMe(req,res){
    const token = req.headers.authorization?.split(" ")[1]
    if(!token){
        return res.status(401).json({
            "message":"Token not found"
        })
    }
    let decode;
    try{
        decode =  jwt.verify(token,config.JWT_SECRET) 
    }catch(error){
        return res.status(401).json({message:"Invalid token"})
    }
    let user = await userModel.findById(decode.id);
    if(!user){
        return res.status(404).json({
            message:"User not found"
        })
    }
    return res.status(200).json({
        message:"Found the user",
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            role:user.role
        }
    })
}

export async function refresh(req,res){
    let refreshtoken = req.cookies.refreshtoken;
    if(!refreshtoken){
        return res.status(409).json({
            message : "Refresh token not found"
        })
    }

    let hashedrefreshtoken = crypto.createHash('sha256').update(refreshtoken).digest('hex')

    let decode;
    try{
        decode = jwt.verify(refreshtoken,config.JWT_SECRET)
    }catch(error){
        return res.status(401).json({message:"Invalid token"})
    }
    let {email} = decode 

    let user = await userModel.findOne({email})

    if(!user){
        return res.status(404).json({
            message:"User not found"

        })
    }

    let session = await sessionModel.findOne({userId:user._id,refreshtoken:hashedrefreshtoken ,revoke:false})
    
    if(!session){
        return res.status(401).json({
            message:"Session Revoked"
        })
    }

    const accesstoken = jwt.sign({
        id: user._id,
        role: user.role,
        session_id: session._id
        }, config.JWT_SECRET,{
        expiresIn:'15m'
        });

    refreshtoken = jwt.sign({
        username:user.username,
        email:user.email,
    },config.JWT_SECRET,{
        expiresIn: '7d'
    })

    session.refreshtoken = crypto.createHash('sha256').update(refreshtoken).digest('hex')
    await session.save()
    res.cookie("refreshtoken",refreshtoken,{
        httpOnly:true,
        secure:true,
        sameSite: "lax",
        maxAge: 7*24*60*60*1000 // 7 days
    })

    res.status(200).json({
        message:"Access token created sccuessfully",
        user:{
                id:user._id,
                username:user.username,
                email:user.email,
                role:user.role
        },
        accesstoken:accesstoken
    })
}

export async function logout(req,res){
    let refreshtoken = req.cookies.refreshtoken

    if(!refreshtoken){
        return res.status(400).json({
            message:"Refresh token not found"
        })
    }

    let hashedrefreshtoken = crypto
        .createHash('sha256')
        .update(refreshtoken)
        .digest('hex')

    let session = await sessionModel.findOne({
        refreshtoken: hashedrefreshtoken,
        revoke:false
    })

    if(!session){
        return res.status(400).json({
            message:"Refresh token not found"
        })
    }

    session.revoke = true
    await session.save()

    res.clearCookie('refreshtoken')

    res.status(200).json({
        message:"Logged out Successfully"
    })
}

export async function logoutAll(req,res){
    let refreshtoken = req.cookies.refreshtoken
    if(!refreshtoken){
         return res.status(400).json({
            message:"Refresh token not found"
        })
    }
    let decode;
    try{
        decode = jwt.verify(refreshtoken,config.JWT_SECRET)
    }catch(error){
        return res.status(401).json({message:"Invalid token"})
    }
    let {email} = decode 
    let user = await userModel.findOne({email})
    if(!user){
        return res.status(404).json({
            message:"user not found"
        })
    }
     await sessionModel.updateMany({userId:user._id,revoke:false},{revoke:true})
    res.clearCookie('refreshtoken')
    res.status(200).json({
        message:"Logged out from all devices successfully"
    })

} 

export async function login(req,res) {
    let {email,password} = req.body
    if(!email || !password){
        return res.status(400).json({
            message:"Email or Password Required"
        })
    }
    console.log(req.body);
    let user = await userModel.findOne({email})
    if(!user){
        return res.status(404).json({
            message:"Not found the User"
        })
    }
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex')
    if(hashedPassword!=user.password){
        return res.status(409).json({
            message:"Email or Password is Not matched"
        })
    }
    let refreshtoken = jwt.sign({
        username:user.username,
        email:user.email
    },config.JWT_SECRET,{
        expiresIn:'7d'
    })

    let hashedrefreshtoken = crypto.createHash('sha256').update(refreshtoken).digest('hex')
    let session = await sessionModel.create({
        userId:user._id,
        refreshtoken:hashedrefreshtoken,
        ip:req.ip,
        userAgent:req.headers["user-agent"]
    })

    const accesstoken = jwt.sign({
        id: user._id,
        role: user.role,
        session_id: session._id
        }, config.JWT_SECRET, {
        expiresIn: "15m"
        });

    res.cookie('refreshtoken',refreshtoken,{
        httpOnly:true,
        secure:true,
        sameSite: "lax",
        maxAge: 7*24*60*60*1000
    })
    res.status(200).json({
    message:"Login successful",
    user:{
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    },
    accesstoken
})
}

