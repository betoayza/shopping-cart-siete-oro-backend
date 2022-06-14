import mongoose from 'mongoose';
//import autoIncrement from 'mongoose-auto-increment-prefix';

const { Schema } = mongoose;

const URI = 'mongodb+srv://beto123:superpassw123@sietedeoro.pmni0.mongodb.net/sietedeoro?retryWrites=true&w=majority';

const conn = mongoose.createConnection(URI);

conn.once('open', () => {
    console.log('Connected to MongoDB');
});
                        
//autoIncrement.initialize(connection);                        

const orderSchema = new Schema ({     
    userID: {type: String, required: true},      
    items: {type: Array, required: true},    
    price: {type: Number, required: true},
    state: {type: String, required: true}, 
    date: {type: Date, required: true}    
},{
    collection: 'orders'
});

//SchemaProduct.plugin(autoIncrement.plugin, 'code');
//let code = connection.model('code', SchemaProduct);

const Order = conn.model('Order', orderSchema); //'producto' es el nombre del modelo;
//Exportar el modelo de la base de datos con el esquema de productos
//Servirá para conectarse y manipular la bds
export default Order;