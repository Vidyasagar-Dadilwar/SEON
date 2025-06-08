import User from "../models/user.model.js";

export const createUser = async ({email, password}) => {
    if(!email || !password){
        throw new Error("Email and password are required");
    }
    const hashedPassword = await User.hashPassword(password);
    const user = await User.create({
        email, 
        password: hashedPassword
    });
    return user;
}

export const loginUser = async ({email, password}) => {
    const user = await User.findOne({email}).select("+password");
    if(!user){
        throw new Error("User not found");
    }
    const isPasswordValid = await user.validatePassword(password);
    if(!isPasswordValid){
        throw new Error("Invalid password");
    }
    return user;
}


export const getAllUsers = async ({userId}) => {
    if(!userId) {
        throw new Error("userId is required");
    }
    const users = await User.find({_id: {$ne: userId}});
    return users;
}
