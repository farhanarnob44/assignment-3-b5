import express, {Application, Request, Response} from 'express';
// import { model, Schema } from 'mongoose';
// import { Note } from './models/notes.models';
// import { notesRoutes } from './controllers/notes.controller';
// import { usersRoutes } from './controllers/user.controller';

const app: Application = express();
app.use(express.json())



// app.use("/note", notesRoutes)
// app.use("/users", usersRoutes)

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to new APP')
})

export default app;