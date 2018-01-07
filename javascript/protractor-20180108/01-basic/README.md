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
$(npm bin)/webdriver-manager update
```

* you'll need node.js version 7.10.1
  * reason: see `debugging` section below
* if you don't have it, here's how you get it on your mac via [Homebrew](https://brew.sh/)

```sh
brew install nodenv
nodenv install 7.10.1
```

# run test
## local chrome
```sh
# first, launch webdriver server on another shell
npm run test:local-server
```
```sh
# test all
npm run test

# run only specified tests (grep by describe||it labels)
npm run test -- --grep title

# run only specified suite (defined in conf.js)
npm run test -- --suite calculator
```
## browserstack
```sh
# test all
npm run test:bs

# run only specified tests
npm run test:bs -- --grep title

# run only specified suite
npm run test:bs -- --suite calculator
```

# for debugging

* refer to [protractor doc](http://www.protractortest.org/#/debugging) for details.
* since we want to enjoy better debugging support, we are going with `Enabled Control Flow` pattern in that doc.
  * == need to use node.js v7.x

## 1. add this in your test code:

```js
it('can find search results', function() {
  indexPage.get();

  // for debugging
  browser.pause();  // or .explore()

  indexPage.searchInput.sendKeys('BrowserStack', protractor.Key.ENTER);
  ...
```

## 2. run protractor like this

local chrome:
```js
npm run test -- --long-timeout
```

browserstack:
```js
npm run test:bs -- --long-timeout
```
