import { saveHighlightsToDb } from './core';

const createMockDb = () => {
  return { none: jest.fn().mockReturnValue(Promise.resolve()) };
};

test('saveHighlightsToDb inserts to db', () => {
  const mockDb = createMockDb();
  const highlight = {
    parentSlug: 'http://nytimes.com/article',
    parentTitle: 'A NYTimes Article',
    parentURL: 'http://nytimes.com/article',
    timestamp: new Date(),
    text: 'A super informative highlight',
    url: null
  };

  saveHighlightsToDb(mockDb)([highlight]).then(highlights => {
    const id = highlights[0].id;
    const timestamp = highlights[0].timestamp.toISOString();
    expect(mockDb.none).toBeCalledWith(
      `insert into "highlights"("id","parentSlug","parentTitle","parentURL","timestamp","text","url") values(\'${id}\',\'http://nytimes.com/article\',\'A NYTimes Article\',\'http://nytimes.com/article\',\'${timestamp}\',\'A super informative highlight\',null)`
    );
  });
});

test('saveHighlightsToDb returns id to db', () => {
  const mockDb = createMockDb();
  const highlight = {
    parentSlug: 'http://nytimes.com/article',
    parentTitle: 'A NYTimes Article',
    parentURL: 'http://nytimes.com/article',
    timestamp: new Date(),
    text: 'A super informative highlight',
    url: null
  };

  saveHighlightsToDb(mockDb)([highlight]).then(highlights => {
    expect(highlights[0].id).isNotNull();
  });
});
