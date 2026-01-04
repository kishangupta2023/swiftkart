import connectDb from "@/lib/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await connectDb()
        const {name,email,password} = await req.json()
        if (!name || !email || !password) {
            return NextResponse.json(
            { message: "All fields are required" },
            { status: 400 }
            );
        }
        if(password.length < 6){
            return NextResponse.json(
                {
                    message:"Password must be atleast 6 character"
                },
                {
                    status:400
                }
            )
        }
        const existUser = await User.findOne({email})
        if(existUser){
            return NextResponse.json(
                {
                    message:"Email already exist!"
                },
                {
                    status:400
                }
            )
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const user = await User.create({
            name,email,password:hashedPassword
        })
        return NextResponse.json(
          {
            success:true,
            message:"User registered successfully",
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
            },
          }
        )
    } catch (error) {
        return NextResponse.json(
            {message:`Internal server error ${error}`},
            {status:500}
        )
    }
}
// connect db 
//name,email,password from frontent and check the email is it already exists or not 
// check for password 6 character 
// hash the password 
// create user 