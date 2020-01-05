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

※fsevents の install error が出た場合、原因は pyenv にある。
以下のように system python をつかえば解決
```
pyenv local system
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
→ dist/ がブラウザ起動されます。
entrypoint js file も以下のような URL で配信されます。
※src 配下の file を保存する度に自動更新されます。
```
http://localhost:8080/hello.bundle.js
```
## ②firebase
もうひとつ terminal を開いて project root dir で以下実行:
```
firebase serve
```
→ public/ がブラウザ起動されます:
```
http://localhost:5000/
```
public/index.html にベタ書き script tag で①を読み込んでいるので、この状態で src 配下 code を更新すると自動反映されます。

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
