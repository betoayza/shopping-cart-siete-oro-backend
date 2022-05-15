import mongoose from 'mongoose';
const { Schema } = mongoose;

const URI = 'mongodb+srv://beto123:superpassw123@sietedeoro.pmni0.mongodb.net/sietedeoro?retryWrites=true&w=majority';

const conn = mongoose.createConnection(URI);

conn.once('open', () => {
    console.log('Connected to MongoDB');
});                  

const userSchema = new Schema ({    
    code: {type: Number, required: true},    
    name: {type: String, required: true},    
    lastName: {type: String, required: true},
    email: {type: String, required: true}, 
    passw: {type: String, required: true},
    address: {type: String, required: true},
    neighborhood: {type: String, required: true},  
    phone: {type: Number, required: true},
    zip: {type: String, required: true},
    type: {type: String, required: true},
    status: {type: String, required: true},
},{
    collection: 'users'
});

const UserModel = conn.model('UserModel', userSchema); 

export default UserModel;