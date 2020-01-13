# docs
https://blog.quid.works/serverless-oauth2-flows/
https://github.com/firebase/functions-samples
https://github.com/googleapis/google-api-nodejs-client
https://developers.google.com/calendar/v3/reference/events/list
https://firebase.google.com/docs/firestore/query-data/get-data

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

# deploy firebase rules
```
firebase deploy --only firestore:rules
```

# lint check cloud function rules
```
cd functions
npm run lint
```
