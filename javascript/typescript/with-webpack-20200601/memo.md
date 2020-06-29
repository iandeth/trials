# webpack

- https://webpack.js.org/

```sh
npm install -D webpack webpack-cli webpack-dev-server
npm install -D webpack-merge clean-webpack-plugin
npm install -D css-loader style-loader html-webpack-plugin file-loader
```

# typescript

- https://webpack.js.org/guides/typescript/

```sh
npm install -D typescript @types/jquery
npm install -D ts-loader # for webpack
```

# eslint

- https://eslint.org/
- https://github.com/typescript-eslint/typescript-eslint

```sh
npm install -D eslint
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin # for typescript
npm install -D eslint-loader # for webpack
```

# prettier

- https://prettier.io/
- https://github.com/prettier/eslint-config-prettier

```sh
npm install -D prettier
npm install -D eslint-config-prettier # for eslint
```

# babel

- https://github.com/babel/babel-loader
- https://nansystem.com/migrate-babel-polyfill-to-core-js/

```sh
npm install -D @babel/core @babel/preset-env core-js@3 regenerator-runtime
npm install -D babel-loader # for webpack

# for https://bit.ly/2Xu1Xdb
npm install -D @babel/plugin-transform-runtime @babel/runtime-corejs3
```

# mocha + chai

- https://mochajs.org/
- https://www.chaijs.com/

```sh
npm install mocha chai chai-as-promised sinon # not dev-dependency b/c it'll run in web browsers
npm install -D @types/mocha @types/chai @types/chai-as-promised @types/sinon # for typescript
```

## es5 非対応 npm module を babel にかける方法

- babel は npm modules を変換対象にしていない (build 重くなるから避けるのが基本)
- 今回 chai-as-promised が es5 非対応だった
- 単品で babel をかけたものを使う事で解決

```sh
# es5 非対応 module を判別する方法
# ※ただし対象 module が package.json の dependencies (not dev-dependencies) に列挙されている必要あり
npm install -D are-you-es5
are-you-es5 check -r .
```

```sh
# 単品で babel をかける
babel node_modules/chai-as-promised/lib/chai-as-promised.js > chai-as-promised-es6.js
vim chai-as-promised-es6.js  #=> code 先頭に /* eslint-disable */ を追記
```
