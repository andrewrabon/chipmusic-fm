/* globals exports */
'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.storeExternalSong = functions.https.onRequest((req, res) => {
  console.log(req, res);
  res.status(200).end();
});
