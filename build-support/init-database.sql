CREATE TABLE highlights (
    "id" UUID PRIMARY KEY,
    "parentSlug" text NOT NULL,
    "parentTitle" text NOT NULL,
    "parentURL" text NOT NULL,
    "timestamp" timestamp NOT NULL,
    "text" text NOT NULL,
    "url" text
);
CREATE UNIQUE INDEX unique_parentSlug_text_index on highlights ("parentSlug", MD5(text));

CREATE TABLE evernote (
    "parentSlug" text PRIMARY KEY,
    "evernoteNoteId" text NOT NULL
);
