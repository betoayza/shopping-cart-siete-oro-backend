import mongoose from 'mongoose';

const { Schema } = mongoose;

const URI = 'mongodb+srv://beto123:superpassw123@sietedeoro.pmni0.mongodb.net/sietedeoro?retryWrites=true&w=majority';

const conn = mongoose.createConnection(URI);

conn.once('open', () => {
    console.log('Connected to MongoDB');
});                     

const orderSchema = new Schema ({  
    code: {type: Number, required: true},   
    userCode: {type: Number, required: true},      
    products: {type: Array, default: [], required: true},    
    amount: {type: Number, required: true},
    date: {type: String, required: true},    
    status: {type: String, required: true} 
},{
    collection: 'orders'
});

const Order = conn.model('Order', orderSchema); 

export default Order;