const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

//google auth client
const GAUTH_CLIENT_ID = "976335406231-k2kefqav01d3r3sqfai6agktotpj97tb.apps.googleusercontent.com";
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(GAUTH_CLIENT_ID);

//DB auth fn
const getUserData = require('./app/user/getUserData');
const registerUser = require('./app/user/registerUser');
const renewUserData = require('./app/user/renewUserData');
const getNearbyUsers = require('./app/map/getNearbyUsers');
const createUserData = require('./app/user/createUserData');

// Middleware
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});


app.get('/top', checkAuthenticated, (req, res) => {

  console.log('route/top: gauth verifyed.');
  console.log('route/top: ready for checking if user is already registered or not');
  (async function() {

      //gauth id_token verified user data(name, email, picture(src))
      let user = req.user;
      console.log("user content");
      console.log(user);

      //getting user data from db(return User Model, if not registered => return null)
      // console.log("user object: ");
      // console.log(user);
      const userData = await getUserData.byEmail(user.email);

      //define top.ejs template contents
      const displayContent = {
        isRegistered: {
          title: `おかえりなさい！${user.name}さん！`,
          nearbyUsers: []
        },
        isNotRegistered: {
          title: `ようこそ、そしてはじめまして！${user.name}さん！`,
          nearbyUsers: [],
        }
      }

      if(userData) {
        console.log("already registered account.")
        //google メアドが登録されてる
        res.render('top', { 
          user: userData, 
          content: {
            ...displayContent.isRegistered,
            nearbyUsers: await getNearbyUsers(userData)
          } 
        });

      } else {
        //google メアドが登録されてない
        //新たにDBに登録
        const registerUserResult = await registerUser(user);

        console.log("registerUser result:");
        console.log(registerUserResult);

        //DBに無事登録できました => /topへ
        //DBに登録失敗 => 残念、/loginへ
        registerUserResult ?
          res.render('top', {
            user: registerUserResult, content: displayContent.isNotRegistered}) :
          res.render('login') ;
      }
              

  })().catch(err => {
    console.log("router/top: error has occured.");
    console.log(err);
    res.redirect('/login');
  });
});

app.get('/userProfile', (req, res) => {
  console.log("router/userProfile");
  console.log("get query:", req.query);
  const targetID = req.query.id;

  (async function() {

    res.render('userProfile', {
      target: await getUserData.byID(targetID),
      user: await getAuthenticatedUserData(req),
    });

  })().catch(err => {
    console.log(err);
    res.redirect('/top');
  });
})

//Account関係
app.post('/renewUserData', (req, res) => {
  console.log("router/renewUserData");
  // console.log("request body log:");
  // console.log(req.body);

  (async function(){

    const user = await getAuthenticatedUserData(req);
    const renewData = req.body.content;
    await renewUserData(user, renewData);

    res.send('success');

  })().catch(err => {
    console.log("failed to renew account data.");
    console.log(err);
  });

});

app.post('/createUserData', (req, res) => {
  console.log("router/createUserData");
  // console.log("request body log:");
  // console.log(req.body);

  (async function(){

    const inputData = req.body.content;
    await createUserData(inputData);

    res.send('success');

  })().catch(err => {
    console.log("failed to renew account data.");
    console.log(err);
  });

});


app.get('/deleteUserData', (req, res)=>{
  (async function() {

    const userModel = await getAuthenticatedUserData(req);
    await userModel.destroy();

    res.clearCookie('session-token');
    res.redirect('/login');

  })().catch(err => {
    console.log("failed to delete account data.");
    console.log(err);
  });

});

// login, logout 関係
app.get('/login', (req, res) => {
  res.render('login', {
    gauthClientID: GAUTH_CLIENT_ID
  });
});

app.get('/logout', (req, res) => {
  res.clearCookie('session-token');
  res.redirect('/login');
});

app.post('/gauthLogin', (req, res) => {
  let token = req.body.token;

  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GAUTH_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    // console.log(payload);
  }
  verify()
    .then(() => {
      res.cookie('session-token', token);
      res.send('success');
    })
    .catch(console.error)
});


// open port for server
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});


// Middleware func
function checkAuthenticated(req, res, next) {
  console.log("gauth fn checkAuthenticated");
  let token = req.cookies['session-token'];
  let user = {};

  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GAUTH_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    user.name = payload.name;
    user.email = payload.email;
    user.picture = payload.picture;
  }
  verify()
    .then(() => {
      req.user = user;
      next();
    })
    .catch(err => { res.redirect('/login') });
}

async function getAuthenticatedUserData(req) {
  console.log("gauth fn checkAuthenticated");
  let token = req.cookies['session-token'];
  let user = {};

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: GAUTH_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  return await getUserData.byEmail(payload.email);
}