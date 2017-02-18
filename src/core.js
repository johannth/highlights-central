import uuid from 'uuid/v1';

export const saveHighlightToDb = db => highlight => {
  const id = uuid();
  console.log(highlight.timestamp);
  return db
    .none(
      'INSERT INTO highlights (id, parentSlug, parentTitle, parentURL, timestamp, text, url) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [
        id,
        highlight.parentSlug,
        highlight.parentTitle,
        highlight.parentURL,
        highlight.timestamp.toISOString(),
        highlight.text,
        highlight.url
      ]
    )
    .then(() => {
      return { id: id };
    });
};
