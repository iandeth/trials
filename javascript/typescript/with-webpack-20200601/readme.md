# 背景

https://docs.google.com/presentation/d/1_-e_McFxOAEpajhe4FriCP5UeZPAR7uOWJQdPcfpF0Y/edit#slide=id.g5f864c5f99_0_0

# setup

## install homebrew

https://brew.sh/

## install nodenv

https://github.com/nodenv/nodenv

## install Node (latest version)

```
nodenv install 13.11.0
nodenv rehash
```

## install npm packages

```
cd {project-root-dir}
npm install
```

# development

新たな terminal を開いて project root dir で以下実行:

```sh
npm start
```

→ dist/ がブラウザ起動されます。
entrypoint js file も以下のような URL で配信されます。
※src 配下の file を保存する度に自動更新されます。

```
http://localhost:8080/bundle.dev.js
```

# unit test

前述の development server を止めて以下を実行:

```sh
npm run start-test
```

→ test/ 配下の \*.spec.ts が build され、test/index.html がブラウザ起動されます。
test/index.ts にて import されている \*.spec.ts files の中身がすべてブラウザ上で実行されます。

任意の test case だけ再実行したい場合は画面右側の ▷ を click するべし

# production

```
npm run build
```

dist 配下に必要な file 群が生成されます
これらを CDN に upload すべし。

dist 配下 file は git commit しない運用で。
※ .gitignore で無視設定済み
