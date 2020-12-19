import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello');
});

app.post('/rate', (req, res) => {
    console.log(req.body);
    res.send('Rating received');
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});