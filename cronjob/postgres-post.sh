#!/bin/sh
set -e

if [ $SERVER_URL ]; then
  echo Server URL: $SERVER_URL
  WIKI_PAGE=$(curl -v https://en.wikipedia.org/wiki/Special:Random 2>&1 >/dev/null | grep '< location: ' | cut -c13-153 | tr -d "\r\n")
  echo Page to save: $WIKI_PAGE

  curl -X POST $SERVER_URL -H 'Content-Type: application/json' \
    -d '{"task": "'${WIKI_PAGE}'"}'
fi
