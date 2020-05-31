# eslint

- https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md

# babel

- https://www.typescriptlang.org/docs/handbook/integrating-with-build-tools.html
- https://nansystem.com/migrate-babel-polyfill-to-core-js/

```sh
npm install --save-dev @babel/cli @babel/core @babel/preset-env @babel/preset-typescript
npm install --save-dev core-js regenerator-runtime
```

```json
// babel.config.json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "chrome": "78",
          "firefox": "72",
          "ie": "11",
          "edge": "17",
          "safari": "11"
        },
        "useBuiltIns": "usage",
        "corejs": 3
      }
    ],
    "@babel/preset-typescript"
  ]
}
```
