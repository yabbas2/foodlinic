#!/usr/bin/env bash
# exit on error
set -o errexit

npm i -g @quasar/cli
quasar clean
quasar build
echo "Workaround: creating src folder to handle assets.."
mkdir ./dist/spa/src
echo "Workaround: copying assets to src folder.."
cp -avr ./src/assets ./dist/spa/src