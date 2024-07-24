import mongoose from 'mongoose'

let isConnected = false

export const connectToDB = async () => {
  try {
    if(isConnected) {
      console.log("ALREADY CONNECTED TO DB")
      return
    }
      
    mongoose.set('strictQuery', true)
    if(!process.env.MONGODB_URL) return console.log("MONGO DB URL NOT FOUND")

    await mongoose.connect(process.env.MONGODB_URL)
    console.log("CONNECTED TO DB")
    isConnected = true
  } catch (error) {
    console.log(error)
  }
}