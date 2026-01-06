import mongoose from 'mongoose'

interface IUser{
    _id?:mongoose.Types.ObjectId
    name:string
    email:string
    password?:string
    mobile?:string
    role:"user" | "deliveryBoy" | "admin"
    image?:string
}
function Nav({user}:{user:IUser}) {
    return (
    <div>Nav</div>
  )
}

export default Nav