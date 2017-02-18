import express from 'express';
import bodyParser from 'body-parser';
import pgp from 'pg-promise';

const db = new pgp()(process.env.DATABASE_URL);
const app = express();

app.use(bodyParser.json());

app.get('/testing', (req, res) => {
  db
    .one('SELECT COUNT(*) FROM highlights')
    .then(data => {
      res.json({ test: data.count });
    })
    .catch(error => {
      res.json({ test: false });
    });
});

// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
