import mongoose from 'mongoose';
//import autoIncrement from 'mongoose-auto-increment-prefix';

const { Schema } = mongoose;

const URI = 'mongodb+srv://beto123:superpassw123@sietedeoro.pmni0.mongodb.net/sietedeoro?retryWrites=true&w=majority';

const conn = mongoose.createConnection(URI);

conn.once('open', () => {
    console.log('Connected to MongoDB');
});
                        
//autoIncrement.initialize(connection);                        

const itemSchema = new Schema ({          
    product: {type: String, required: true},    
    description: {type: String, required: true},
    price: {type: Number, required: true}, 
    lot: {type: Number, required: true}    //cantidad
});

//SchemaProduct.plugin(autoIncrement.plugin, 'code');
//let code = connection.model('code', SchemaProduct);

const Item = conn.model('Item', itemSchema); //'producto' es el nombre del modelo;
//Exportar el modelo de la base de datos con el esquema de productos
//Servirá para conectarse y manipular la bds
export default Item;