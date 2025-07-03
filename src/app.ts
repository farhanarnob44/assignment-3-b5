import express, {Application, Request, Response} from 'express';
import { bookRoutes } from './app/controllers/book.controller';

const app: Application = express();
app.use(express.json())
app.use("/books", bookRoutes)



app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to new APP')
})

export default app;