import newrelic from 'newrelic';
import express from 'express';
import bodyParser from 'body-parser';
import pgp from 'pg-promise';
import Evernote from 'evernote';
import cors from 'cors';

import { saveHighlightsToDb, writeAllHighlightsToEvernote } from './core';

const db = new pgp()(process.env.DATABASE_URL);
const app = express();

const evernote = new Evernote.Client({
  token: process.env.EVERNOTE_TOKEN,
  sandbox: process.env.EVERNOTE_SANDBOX === 'true'
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

const parseTimestampFromPayload = payload => {
  if (payload.timestamp) {
    try {
      return new Date(Date.parse(payload.timestamp));
    } catch (error) {
      return new Date();
    }
  } else {
    return new Date();
  }
};

const parseParentFromPayload = payload => {
  return {
    slug: payload.slug,
    title: payload.title,
    url: payload.url
  };
};

const parseHighlightFromPayload = parent => payload => {
  return {
    parentSlug: parent.slug,
    parentTitle: parent.title,
    parentURL: parent.url,
    order: payload.order,
    timestamp: parseTimestampFromPayload(payload),
    text: payload.text,
    url: payload.url
  };
};

app.post('/highlights', (req, res) => {
  if (!req.body.highlights) {
    res.json({});
    return;
  }

  const parent = parseParentFromPayload(req.body.parent);
  const highlights = req.body.highlights.map(parseHighlightFromPayload(parent));

  const evernoteTags = req.body.evernote.tags || [];
  const evernoteNotebookId = req.body.evernote.notebookId;

  saveHighlightsToDb(db)(highlights)
    .then(savedHighlights => {
      return writeAllHighlightsToEvernote(db, evernote)(
        parent.slug,
        evernoteNotebookId,
        evernoteTags
      );
    })
    .then(() => {
      res.json({});
    })
    .catch(error => {
      console.error(error);
      newrelic.noticeError(error, { requestBody: req.body });
      res.status(500);
      res.json({ error: { message: 'Error on saving highlights' } });
    });
});

// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
