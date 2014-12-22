#!/bin/bash
set -ev
echo $TRAVIS_PULL_REQUEST
if [ "${TRAVIS_PULL_REQUEST}" = "false" ]; then
  openssl aes-256-cbc -K $encrypted_e72e740b7464_key -iv $encrypted_e72e740b7464_iv -in secrets.json.enc -out test/secrets.json -d
fi
