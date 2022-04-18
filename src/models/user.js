import mongoose from 'mongoose';
//import autoIncrement from 'mongoose-auto-increment-prefix';

const { Schema } = mongoose;

const URI = 'mongodb+srv://beto123:superpassw123@sietedeoro.pmni0.mongodb.net/sietedeoro?retryWrites=true&w=majority';

const conn = mongoose.createConnection(URI);

conn.once('open', () => {
    console.log('Connected to MongoDB');
});
                        
//autoIncrement.initialize(connection);                        

const userSchema = new Schema ({           
    name: {type: String, required: true},    
    lastName: {type: String, required: true},
    address: {type: String, required: true}, 
    phone: {type: Number, required: true},
    cp: {type: String, required: true},
    email: {type: String, required: true},  
    mobile: {type: Number, required: true},
    //status: true (active) 
    //status: false (dischaged) 
    status: {type: Boolean, required: true},
});



//SchemaProduct.plugin(autoIncrement.plugin, 'code');
//let code = connection.model('code', SchemaProduct);

const User = conn.model('User', userSchema); //'producto' es el nombre del modelo;
//Exportar el modelo de la base de datos con el esquema de productos
//Servirá para conectarse y manipular la bds
export default User;