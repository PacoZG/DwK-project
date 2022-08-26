#!/usr/bin/env bash

DB_PORT=5432
DB_NAME=tododb
DB_USER=postgres
DB_PASSWORD=postgres
CONTAINER_NAME=tododb

docker inspect $CONTAINER_NAME &>/dev/null
if [ $? -eq 0 ]; then
  echo "Container $CONTAINER_NAME is already running"
  exit 0
fi

docker run --name $CONTAINER_NAME -e POSTGRES_PASSWORD=$DB_PASSWORD -e POSTGRES_USER=$DB_USER -e POSTGRES_DB=$DB_NAME --rm -p $DB_PORT:5432 postgres:14
