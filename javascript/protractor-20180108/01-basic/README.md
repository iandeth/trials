# what is this?

* tryout code for protractor + browserstack e2e testing

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

# run test
```sh
./node_modules/protractor/bin/protractor conf-browserstack.js
```
