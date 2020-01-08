export default class FirebaseUtil {
  static waitForSDK() {
    return new Promise((resolve)=> {
      $(()=> {
        let app = firebase.app();
        let features = [
          'auth', 'functions', 'database', 'performance'
        ].filter(f => typeof app[f] === 'function');
        console.log(`Firebase SDK loaded with ${features.join(', ')}`);
        resolve();
      });
    });
  }
}
