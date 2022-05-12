import mongoose from 'mongoose';
//import autoIncrement from 'mongoose-auto-increment-prefix';

const { Schema } = mongoose;

const URI = 'mongodb+srv://beto123:superpassw123@sietedeoro.pmni0.mongodb.net/sietedeoro?retryWrites=true&w=majority';

const conn = mongoose.createConnection(URI);

conn.once('open', () => {
    console.log('Connected to MongoDB');
});

//autoIncrement.initialize(connection);                        

const productSchema = new Schema ({  
    //code: {type: Number, required: false}, 
    name: {type: String, required: true},  
    description: {type: String, required: true},    
    price: {type: Number, required: true},
    stock: {type: Number, required: true},
    image: {data: Buffer, contentType: String},
    status: {type: String, required: true}
},
{
    collection: 'products'
}
);

//SchemaProduct.plugin(autoIncrement.plugin, 'code');
//let code = connection.model('code', SchemaProduct);

const ProductModel = conn.model('ProductModel', productSchema); //'producto' es el nombre del modelo;
//Exportar el modelo de la base de datos con el esquema de productos
//Servirá para conectarse y manipular la bds
export default ProductModel;
