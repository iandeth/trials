# learn

- https://reactjs.org/docs/hello-world.html

# setup

- https://create-react-app.dev/
- (solve fsevents build error)[https://qiita.com/dmrt/items/90ad12850c0ed29758a2]
- (ie11 support)[https://github.com/facebook/create-react-app/blob/master/packages/react-app-polyfill/README.md]
  - (unresolved: not working in dev server)[https://github.com/facebook/create-react-app/issues/5336]
- (VS Code + Prettier)[https://create-react-app.dev/docs/setting-up-your-editor]
  - (VS Code jest)[https://create-react-app.dev/docs/running-tests#editor-integration]
- (analyzing bundle size)[https://create-react-app.dev/docs/analyzing-the-bundle-size]
- (absolute path imports)[https://create-react-app.dev/docs/importing-a-component/#absolute-imports]
- (env variables)[https://create-react-app.dev/docs/adding-custom-environment-variables]

```sh
npx create-react-app my-app --template typescript --use-npm
npm install react-app-polyfill
npm install husky lint-staged prettier # and edit package.json
npm install source-map-explorer # and edit package.json
```

# router

- [react router](https://reacttraining.com/react-router/web/guides/quick-start)
- [reach router](https://reach.tech/router)
