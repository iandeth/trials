# docs
https://github.com/firebase/functions-samples
https://github.com/googleapis/google-api-nodejs-client

# service account set for localhost
```
export GOOGLE_APPLICATION_CREDENTIALS='/Users/iandeth/workspace/trials/service/chousei-g-20190622/01-proto/javascript/firebase-login/dev-config/application_default_credentials.json'
```

# config set
```
firebase functions:config:set gapi.id="" gapi.secret=""
firebase functions:config:get
```
## for localhost
```
cd functions
firebase functions:config:get > .runtimeconfig.json
```

