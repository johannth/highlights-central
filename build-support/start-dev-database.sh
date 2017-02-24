set -e

docker pull postgres:9.6.2-alpine
docker run -p 5432:5432 --name postgres -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD -e POSTGRES_USER=$POSTGRES_USER -e POSTGRES_DB=$POSTGRES_DB -d postgres:9.6.2-alpine
sleep 5
psql $DATABASE_URL -f ./build-support/init-database.sql
for MIGRATION_FILE in ./build-support/migrations/*
do
    psql $DATABASE_URL -f $MIGRATION_FILE
done
