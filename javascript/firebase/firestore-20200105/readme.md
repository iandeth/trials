# setup
## install homebrew
https://brew.sh/

## install nodenv
https://github.com/nodenv/nodenv

## install node
```
nodenv install 10.15.3
nodenv rehash
```

## install global npms
```
npm install -g fsevents
npm install -g firebase-tools
```

## install npm packages
## ①src 配下 code 用
```
cd {project-root-dir}
npm install
```

## ②functions 配下 code 用
```
cd {project-root-dir}/functions
npm install
```

# development
## ①src 配下 code
新たな terminal を開いて project root dir で以下実行:
```
npm start
```
→ dist/ 配下に deploy 用 js/html/image ファイル群が生成されます
※ 元から dist/ 配下にあった file は全消去されるよ (=clean build)

以降 ctrl-c で command を終了させない限りは js code を変更する度にファイルが再生成され続けます (=watch mode)

## ②firebase
もうひとつ terminal を開いて project root dir で以下実行:
```
firebase serve
```
→ public/ がブラウザ起動されます:
```
http://localhost:5000/
```
これを使って code 変更を保存 → browser reload で繰り返しの動作確認ができる。

さらに cloud functions も以下 URL で host されます:
```
# entrypoint 例
http://localhost:5001/bashi-fiddle-20200105/us-central1/helloWorld
```

# production
```
firebase deploy
```
→ src 配下 code が build された後に firebase hosting に deploy されます
