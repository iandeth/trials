export default class FirebaseUtil {
  static waitForSDK() {
    return new Promise((resolve)=> {
      $(()=> {
        let app = firebase.app();
        let features = [
          'auth', 'functions', 'firestore', 'database', 'performance'
        ].filter(f => typeof app[f] === 'function');
        console.log(`firebase: ${features.join(', ')}`);
        resolve();
      });
    });
  }
}
