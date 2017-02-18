import newrelic from 'newrelic';
import express from 'express';
import bodyParser from 'body-parser';
import pgp from 'pg-promise';

import { saveHighlightToDb } from './core';

const db = new pgp()(process.env.DATABASE_URL);
const app = express();

app.use(bodyParser.json());

app.post('/highlights', (req, res) => {
  const highlight = {
    parentSlug: req.body.parentSlug,
    parentTitle: req.body.parentTitle,
    parentURL: req.body.parentURL,
    timestamp: new Date(Date.parse(req.body.timestamp)),
    text: req.body.text,
    url: req.body.url
  };

  saveHighlightToDb(db)(highlight)
    .then(({ id }) => {
      res.json({ highlight: { id } });
    })
    .catch(error => {
      console.error('POST /highlights', error.toString());
      res.status(500);
      res.json({ message: 'Error on saving highlight' });
    });
});

// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
