#!/usr/bin/env bash
# exit on error
set -o errexit

#npm i -g @quasar/cli
quasar clean
quasar build
echo "Workaround: creating src folder to handle assets.."
mkdir ./dist/spa/src
mkdir ./dist/spa/src/assets
echo "Workaround: copying assets to src folder.."
cp -v ./src/assets/mi-*.* ./dist/spa/src/assets
firebase deploy --only hosting:foodlinic