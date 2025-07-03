 import {Server} from 'http';
import app from './app';
import mongoose from 'mongoose';

let server : Server;

const PORT = 5000;

async function main() {
    try{

        await mongoose.connect('mongodb+srv://mongoDB:mongoDB@cluster0.cpxrc.mongodb.net/library-app?retryWrites=true&w=majority&appName=Cluster0')

        console.log("Connected to mongoDB")
        server = app.listen(PORT , () => {
            console.log(`App is listening on the port : ${PORT}`)
        })

    }catch (error){
        console.log(error);
    }
    
}
main ();