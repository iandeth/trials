# development

```
npm install
npm start
```

http://localhost:8080 がブラウザで開かれるよ
中身は public 配下だよ

# 他者行動 emulate ON/OFF 別の URL

- [timeline ON + actions ON](http://localhost:8080/) (default)
- [action ON only](http://localhost:8080/?tl=0)
- [timeline ON only](http://localhost:8080/?re=0)
- [both OFF](http://localhost:8080/?re=0&tl=0)

# deploy

```
npm run build
```

public 配下をサーバに反映すれば完了
