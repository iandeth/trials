# setup
## install homebrew
https://brew.sh/

## install nodenv
https://github.com/nodenv/nodenv

## install node
```
nodenv install 13.0.1
nodenv rehash
```

## install firebase cli
```
npm install -g firebase-tools
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
dist 配下 file は git commit しない運用で。
※ .gitignore で無視設定済み
