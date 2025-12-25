import express from 'express'

const app = express();

app.get('/',(req,res)=>{
    res.send('Main page');
})



//routes
export default app;