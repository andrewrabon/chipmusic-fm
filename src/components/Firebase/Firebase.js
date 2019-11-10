const config = {
  apiKey: process.env.GATSBY_API_KEY,
  authDomain: process.env.GATSBY_AUTH_DOMAIN,
  databaseURL: process.env.GATSBY_DATABASE_URL,
  projectId: process.env.GATSBY_PROJECT_ID,
  storageBucket: process.env.GATSBY_STORAGE_BUCKET,
  messagingSenderId: process.env.GATSBY_MESSAGING_SENDER_ID,
  appId: process.env.GATSBY_APP_ID,
};

class Firebase {
  constructor(app) {
    if (!app.apps.length) {
      app.initializeApp(config);
    }
    this.auth = app.auth();
    this.db = app.database();
  }

  doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(
    email,
    password,
  );

  doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(
    email,
    password,
  );

  doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);

  doSignInWithFacebook = () => this.auth.signInWithPopup(this.facebookProvider);

  doSignInWithTwitter = () => this.auth.signInWithPopup(this.twitterProvider);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

  doSendEmailVerification = () => this.auth.currentUser.sendEmailVerification({
    url: process.env.GATSBY_CONFIRMATION_EMAIL_REDIRECT,
  });

  doPasswordUpdate = (password) => this.auth.currentUser.updatePassword(password);

  onAuthUserListener = (next, fallback) => this.auth.onAuthStateChanged((authUser) => {
    if (authUser) {
      this.user(authUser.uid)
        .once('value')
        .then((snapshot) => {
          const dbUser = snapshot.val();

          // default empty roles
          if (!dbUser.roles) {
            dbUser.roles = {};
          }

          // merge auth and db user
          const newAuthUser = {
            uid: authUser.uid,
            email: authUser.email,
            emailVerified: authUser.emailVerified,
            providerData: authUser.providerData,
            ...dbUser,
          };

          next(newAuthUser);
        });
    } else {
      fallback();
    }
  });
}

let firebase;
export const getFirebase = (app, auth, database) => {
  if (!firebase) {
    firebase = new Firebase(app, auth, database);
  }

  return firebase;
};
