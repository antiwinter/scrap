#!/bin/sh

git config --global user.email "travis@travis-ci.org"
git config --global user.name "travis"
git checkout master
git add .
git commit -m "[ci skip] update"

# Attempt to commit to git only if "git commit" succeeded
if [ $? -eq 0 ]; then
  git remote rm origin
  git remote add origin https://antiwinter:${GITHUB_TOKEN}@github.com/antiwinter/scrap.git
  git push origin master
else
  echo "no change"
fi
