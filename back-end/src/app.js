import express from 'express'
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.send('Main page');
})



//routes
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import likeRoutes from './routes/like.route.js';

app.use('/api/v1/users',userRoutes);
app.use('/api/v1/posts',postRoutes);
app.use('/api/v1/comments',commentRoutes);
app.use('/api/v1/likes',likeRoutes);

//last middleware as it wont be called if any route after this
app.use(errorMiddleware)
export default app;