#!/bin/bash
set -ev
echo $TRAVIS_PULL_REQUEST
if [ "${TRAVIS_PULL_REQUEST}" = "false" ]; then
  openssl aes-256-cbc -k "$secrets_password" -in secrets.json.enc -out test/secrets.json -d
fi
