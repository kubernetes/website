#!/bin/bash

if [ "$HUGO_ENV" == "production" ]; then
  echo "INFO: Production environment. Checking the _headers file for noindex headers."

  if grep -q "noindex" public/_headers; then
    echo "PANIC: noindex headers were found in the _headers file. This build has failed."
    exit 1
  else
    echo "INFO: noindex headers were not found in the _headers file. All clear."
    exit 0
  fi
else
  echo "Non-production environment. Skipping the _headers file check."
  exit 0
fi
