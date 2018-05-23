#!bin/sh

cd ..
rm -rf ./dist
mkdir ./dist
mkdir ./dist/lib
babel ./src/index.js --out-file ./dist/index.js
babel ./src/lib/request.js --out-file ./dist/lib/request.js
babel ./src/lib/cookie.js --out-file ./dist/lib/cookie.js
babel ./src/lib/github-login.js --out-file ./dist/lib/github-login.js
babel ./src/lib/iconfont.js --out-file ./dist/lib/iconfont.js
