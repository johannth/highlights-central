CREATE TABLE highlights (
    id UUID PRIMARY KEY,
    parentSlug text NOT NULL,
    parentTitle text NOT NULL,
    parentURL text NOT NULL,
    timestamp timestamp NOT NULL,
    text text NOT NULL,
    url text,
    UNIQUE (parentSlug, text)
);
