import uuid from 'uuid/v1';
const pgp = require('pg-promise')();

const highlightToDbValue = (
  { parentSlug, parentTitle, parentURL, timestamp, text, url }
) => {
  return {
    id: uuid(),
    parentSlug,
    parentTitle,
    parentURL,
    timestamp: timestamp.toISOString(),
    text,
    url
  };
};

export const saveHighlightsToDb = db => highlights => {
  const columnSet = new pgp.helpers.ColumnSet(
    [
      'id',
      'parentSlug',
      'parentTitle',
      'parentURL',
      'timestamp',
      'text',
      'url'
    ],
    { table: 'highlights' }
  );
  const values = highlights.map(highlightToDbValue);
  const query = pgp.helpers.insert(values, columnSet);
  return db.none(query).then(() => {
    return values;
  });
};

const noteTitle = highlights => {
  return highlights[0].parentTitle;
};

const highlightContent = highlight => {
  if (highlight.url) {
    return `<p>${highlight.text}<br /><a href="${highlight.url}">Link</a></p>`;
  } else {
    return `<p>${highlight.text}</p>`;
  }
};

const noteContent = highlights => {
  var lines = [
    '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">',
    '<en-note>'
  ];
  lines = lines.concat(highlights.map(highlightContent));
  lines = lines.concat(['</en-note>']);
  return lines.join('\n');
};

export const writeAllHighlightsToEvernote = (db, evernote) => (
  parentSlug,
  evernoteNotebookId,
  evernoteTags
) => {
  const noteStore = evernote.getNoteStore();
  return db
    .many(
      'SELECT id, "parentSlug", "parentTitle", "parentURL", timestamp, text, url FROM highlights WHERE "parentSlug" = $1 ORDER BY timestamp ASC',
      [parentSlug]
    )
    .then(highlightRows => {
      const highlights = highlightRows.map((
        { id, parentSlug, parentTitle, parentURL, timestamp, text, url }
      ) => {
        return {
          id,
          parentSlug,
          parentTitle,
          parentURL,
          timestamp: new Date(Date.parse(timestamp)),
          text,
          url
        };
      });
      const { parentTitle, parentURL } = highlights[0];
      return db
        .one('SELECT "evernoteNoteId" FROM evernote WHERE "parentSlug" = $1', [
          parentSlug
        ])
        .then(data => {
          // There is an evernoteNoteId -> update existing node
          return noteStore
            .updateNote({
              guid: data.evernoteNoteId,
              notebookGuid: evernoteNotebookId,
              tagNames: evernoteTags,
              title: noteTitle(highlights),
              content: noteContent(highlights),
              attributes: { sourceURL: parentURL }
            })
            .then(createdNote => {
              return {};
            });
        })
        .catch(error => {
          // No evernoteNoteId -> createNote
          return noteStore
            .createNote({
              notebookGuid: evernoteNotebookId,
              tagNames: evernoteTags,
              title: noteTitle(highlights),
              content: noteContent(highlights),
              attributes: { sourceURL: parentURL }
            })
            .then(createdNode => {
              return db.none(
                'INSERT INTO evernote ("parentSlug", "evernoteNoteId") VALUES ($1, $2)',
                [parentSlug, createdNode.guid]
              );
            });
        });
    });
};
