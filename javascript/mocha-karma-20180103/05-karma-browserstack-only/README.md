# concept
- 目的 #1 ブラウザでの動作品質を担保する事
  - なので Node.js 環境でのコード実行・テスト実行は**考慮しない**
- 目的 #2 複数種のブラウザで品質を担保する
  - 開発時には local chrome でのみテスト
  - deploy 時には browserstack で複数種のブラウザを対象にテスト

# pre-requisities
get your browserstack ID/KEY and export through shell.
karma.conf.js will expect these env vars to be set.
```sh
export BROWSERSTACK_USERNAME={your username}
export BROWSERSTACK_KEY={your key}
```
```sh
# sample setup
vim ~/.browserstack
  # write above 2 lines and save it

vim ~/.bashrc
  # paste at bottom  and save it
  source ~/.browserstack

# enable in current shell
. ~/.bashrc
```

# setup
```sh
npm install
```

* you'll need node.js version 9.2.1
* if you don't have it, here's how you get it on your mac via [Homebrew](https://brew.sh/)

```sh
brew install nodenv
nodenv install 9.2.1
```

# run tests
```sh
# local chrome: integration(watch) mode
npm test

# local chrome: single run mode
npm run test:single

# browserstack: single run mode
npm run test:bs
```

# tech overview

![image](https://user-images.githubusercontent.com/900714/34562276-ef149dca-f190-11e7-874f-1a0000c0e853.png)

* [original doc](https://docs.google.com/drawings/d/1W8U_xYJDGo_fpZdXpV99zI-rlOIR-NtpHnScnl3K2zU/edit)

# todo
- [ ] use browserify to better orgainze file dependency structure
- [x] write dom mocking test util code
- [x] write before handler to initialize cookie state
