#!/bin/sh

git config --global user.email "travis@travis-ci.org"
git config --global user.name "travis"
git checkout master
git add .
git commit -m "[ci skip] update"

#push to github
git remote rm origin
git remote add origin https://antiwinter:${GITHUB_TOKEN}@github.com/antiwinter/scrap.git
git push origin master

#push to gitee
#git remote rm origin
#git remote add origin https://antiwinter:${GITEE_TOKEN}@gitee.com/antiwinter/scrap.git
#git push origin master

