import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectDb from "./lib/db"
import User from "./models/user.model"
import bcrypt from "bcryptjs"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDb()

        if (!credentials) {
          throw new Error("No credentials provided")
        }

        const { email, password } = credentials

        if (!email || !password) {
          throw new Error("Email or password missing")
        }
      
        const user = await User.findOne({ email })

        if (!user) {
          throw new Error("User does not exist")
        }

        const isMatch = await bcrypt.compare(
          password as string,
          user.password
        )

        if (!isMatch) {
          throw new Error("Invalid password")
        }

      return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      }
    }

    }),
  ],
  callbacks:{
    // token ke andar user ka data dalta hai 
    jwt({token,user}){
      if(user){
        token.id=user.id
        token.name = user.name
        token.email = user.email
        token.role = user.role
      }
      return token
    },
    session({session,token}){
      if(session.user){
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages:{
    signIn:"/login",
    error:"/login"
  },
  session:{
    strategy:"jwt",
    maxAge:10*24*60*60*1000
  },
  secret:process.env.AUTH_SECRET
})

// connect db 
// email check
// password match

