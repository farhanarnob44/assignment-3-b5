import express, {Application, ErrorRequestHandler, NextFunction, Request, Response} from 'express';
import { bookRoutes } from './app/controllers/book.controller';


const app: Application = express();
app.use(express.json())

const jsonErrorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
): void => {    
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(404).json({
      success: false,
      message: "Invalid JSON in request body",
      error: err,
    });
    return;     
  }

  next(err);
};

app.use(jsonErrorHandler);


app.use("/api", bookRoutes)

app.get('/', (_req: Request, res: Response) => {
    res.send('Welcome to new APP')
})

export default app;