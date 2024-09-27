import express, { Request, Response } from 'express';
import clientRouter from './routes/client_email';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json());
app.use('/api', clientRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});