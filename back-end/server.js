import dotenv from  'dotenv'
dotenv.config()
import {connectDB} from './src/db/mongoDb.js'
import app from './src/app.js'


const startApp = async ()=> {
    try{
        connectDB();
        const port = process.env.PORT || 3000;
        app.listen(port,()=>{
            console.log('App is running at port',port);
        })
    } catch(error){
        console.log("We can't start the server");
    }
}

startApp()

