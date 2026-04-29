import mongoose from "mongoose";
const connectDB = async() => {
    try{
        await mongoose.connect('${process.env.MONGO_URI}/eventsphere')
        console.log('Mongodb Created Successfully');
    } catch(error){
      console.log('Mongodb Connection Error', error)
    }
}

export default connectDB