import express from 'express';
import matchRouter from './routes/match';

const app = express();
const PORT = 8080;

app.use(express.json());


app.use('/match',matchRouter);
app.get('/', (req, res) => {
    res.send('Hello, your Express server is running on port 8080!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
