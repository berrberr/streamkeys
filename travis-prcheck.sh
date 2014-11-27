#!/bin/bash
set -ev
echo $TRAVIS_PULL_REQUEST
if [ "${TRAVIS_PULL_REQUEST}" = "false" ]; then
  openssl aes-256-cbc -K $encrypted_b30e2c7e7c3f_key -iv $encrypted_b30e2c7e7c3f_iv -in secrets.json.enc -out test/secrets.json -d
fi