import newrelic from 'newrelic';
import express from 'express';
import bodyParser from 'body-parser';
import pgp from 'pg-promise';
import Evernote from 'evernote';

import { saveHighlightToDb, writeAllHighlightsToEvernote } from './core';

const db = new pgp()(process.env.DATABASE_URL);
const app = express();

const evernote = new Evernote.Client({
  token: process.env.EVERNOTE_TOKEN,
  sandbox: false
});

app.use(bodyParser.json());

const parseTimestameFromRequest = req => {
  if (req.body.highlight.timestamp) {
    try {
      return new Date(Date.parse(req.body.highlight.timestamp));
    } catch (error) {
      return new Date();
    }
  } else {
    return new Date();
  }
};

app.post('/highlights', (req, res) => {
  const highlight = {
    parentSlug: req.body.highlight.parentSlug,
    parentTitle: req.body.highlight.parentTitle,
    parentURL: req.body.highlight.parentURL,
    timestamp: parseTimestameFromRequest(req),
    text: req.body.highlight.text,
    url: req.body.highlight.url
  };

  const evernoteTags = req.body.evernote.tags || [];
  const evernoteNotebookId = req.body.evernote.notebookId;

  saveHighlightToDb(db)(highlight)
    .then(({ id, parentSlug }) => {
      console.log(id, parentSlug);
      return writeAllHighlightsToEvernote(
        db,
        evernote
      )(parentSlug, evernoteNotebookId, evernoteTags);
    })
    .then(() => {
      res.json({});
    })
    .catch(error => {
      console.error(error);
      newrelic.noticeError(error);
      res.status(500);
      res.json({ error: { message: 'Error on saving highlight' } });
    });
});

// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
