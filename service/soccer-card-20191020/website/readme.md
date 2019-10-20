# setup
## install homebrew
https://brew.sh/

## install nodenv
https://github.com/nodenv/nodenv

## install Node (latest version)
```
nodenv install 12.4.0
nodenv global 12.4.0
nodenv rehash
```

## install npm packages
```
cd {project-root-dir}
npm install
```

# development
新たな terminal を開いて project root dir で以下実行:
```
npm start
```
→ dev/index.html がブラウザ起動されます。
entrypoint js file も以下のような URL で配信されます。
※src 配下の file を保存する度に自動更新されます。
```
http://localhost:8080/hello.bundle.js
```

# production
```
npm run build
```
dist 配下に以下のような hash つきの static file が生成されます。
これらを CDN に upload すべし。
※旧バージョンの dist file は自動で削除されます。
```
dist/
  hello.752f64ecfa4e6f325937.js
```
かつ git commit もすべし。
**ただし目的の施策とは関係ない dist file も更新されるので、それらは discard して commit させない運用で。**
