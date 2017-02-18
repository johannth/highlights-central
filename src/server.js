import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

app.get('/testing', (req, res) => {
  res.json({ test: true });
});

// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
