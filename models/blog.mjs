import mongoose from 'mongoose';
import { blogDBConnection } from '../config/connectDB.mjs';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }, 
    description: {
        type: String,
        required: true
    }, 
    image: {
        type: String,
        required: true
    }, 
    date: {
        type: Date,
        default: Date.now
    }, 
    content: {
        type: String,
        required: true
    }, 
});
export default blogDBConnection.model('Blog', blogSchema);
