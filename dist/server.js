"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
let server;
const PORT = 5000;
async function main() {
    try {
        await mongoose_1.default.connect('mongodb+srv://mongoDB:mongoDB@cluster0.cpxrc.mongodb.net/library-app?retryWrites=true&w=majority&appName=Cluster0');
        console.log("Connected to mongoDB");
        server = app_1.default.listen(PORT, () => {
            console.log(`App is listening on the port : ${PORT}`);
        });
    }
    catch (error) {
        console.log(error);
    }
}
main();
