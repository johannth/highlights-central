import { saveHighlightToDb } from './core';

const createMockDb = () => {
  return { none: jest.fn().mockReturnValue(Promise.resolve()) };
};

test('saveHighlightToDb inserts to db', () => {
  const mockDb = createMockDb();
  const highlight = {
    parentSlug: 'http://nytimes.com/article',
    parentTitle: 'A NYTimes Article',
    parentURL: 'http://nytimes.com/article',
    timestamp: new Date(),
    text: 'A super informative highlight',
    url: null
  };

  saveHighlightToDb(mockDb)(highlight).then(({ id }) => {
    expect(
      mockDb.none
    ).toBeCalledWith('INSERT INTO highlights (id, parentSlug, parentTitle, parentURL, timestamp, text, url) VALUES ($1, $2, $3, $4, $5, $6, $7)', [ id, highlight.parentSlug, highlight.parentTitle, highlight.parentURL, highlight.timestamp.toISOString(), highlight.text, highlight.url ]);
  });
});

test('saveHighlightToDb returns id to db', () => {
  const mockDb = createMockDb();
  const highlight = {
    parentSlug: 'http://nytimes.com/article',
    parentTitle: 'A NYTimes Article',
    parentURL: 'http://nytimes.com/article',
    timestamp: new Date(),
    text: 'A super informative highlight',
    url: null
  };

  saveHighlightToDb(mockDb)(highlight).then(value => {
    expect(value.id).isNotNull();
  });
});
