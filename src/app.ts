import express, {Application, ErrorRequestHandler, NextFunction, Request, Response} from 'express';
import { bookRoutes } from './app/controllers/book.controller';



const app: Application = express();
app.use(express.json())

const jsonErrorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
): void => {      // Return type is void now
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      success: false,
      message: "Invalid JSON in request body",
      error: err,
    });
    return;       // Just return void here, don't return res
  }

  next(err);
};

// Then register the middleware normally
app.use(jsonErrorHandler);


app.use("/api", bookRoutes)
// app.use('/api', borrowControl);



app.get('/', (_req: Request, res: Response) => {
    res.send('Welcome to new APP')
})

export default app;