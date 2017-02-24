# Highlights Central

## What problem are you trying to solve?

I read a lot using many applications. I've learned that is a must to be able to highlight and lookup highlights to learn from my reading.

I currently read using Kindle, Pocket/Instapaper and in browser. I've decided to use only Kindle and Instapaper because both offer highlighting. Yet, neither Kindle nor Instapaper has a good way of feeding the highlights to a central location.

Kindle has no official extraction method and bad search. This locks your highlights into the Kindle ecosystem and diminishes their value.

Instapaper has an IFTTT integration but it's triggered per each highlight. This makes it hard to gather them into a single note using only IFTTT.

Evernote seems to be an ideal candidate to store the highlights. Good search and nice formatting options.

The best scenario stores the highlights as a single note with a heading, link and list of highlights.

With this API deployed, I can do the following:

+ Feed Instapaper highlights to Evernote through this API using IFTTT. (phew)
+ Feed Kindle highlights to Evernote through this API using a custom Chrome extension.

## API

Bulk store highlights.

```
POST /highlights
{
  "parent": {
    "slug": "http://nytimes.com/article-2",
    "title": "A NYTimes Article",
    "url": "http://nytimes.com/article"
  },
  "highlights": [
    {
      "timestamp": "2014-01-24T00:00:00.000Z",
      "text": "A super informative highlight",
      "url": "http://nytimes.com/article",
      "order": 0
    },
    {
      "timestamp": "2014-01-24T00:00:00.000Z",
      "text": "Should I bring a coat? Another one?",
      "url": "http://nytimes.com/article",
      "order": 1
    }
  ],
  "evernote": {
    "notebookId": "e6ae73d5-026b-422c-bbf3-b45ffacbe974",
    "tags": [
      "instapaper"
    ]
  }
}
```

## Development

Local development depends on

+ node
+ yarn (or npm)
+ docker

### Run Locally

```bash
echo "export EVERNOTE_TOKEN=<your_sandbox_token>" >> .env
yarn start-dev
```

### Run Tests

```bash
yarn test
```

### Deploy to Heroku

```bash
heroku login
yarn deploy
```
