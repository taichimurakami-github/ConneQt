const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.handleOnWriteHook = (docRef) => {
  functions.firestore.document(docRef)
    .onWrite((snap, context) => {
      console.log(snap.data().original);
    })
}