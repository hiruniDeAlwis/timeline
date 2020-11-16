const OktaJwtVerifier = require('@okta/jwt-verifier');

const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: '{0oarwwq7GiCCopDhI5d5}',
  issuer: 'https://{dev-3671640.okta.com}/oauth2/default'
});

//defines express middleware that reads a token from the request
//and verifies it using Okta JWT verifier
//when a user authenticates succesfuly 
//a user object containing the user id and email will be added to the request
async function oktaAuth(req, res, next) {
  try {
    const token = req.token;
    if (!token) {
      return res.status(401).send('Not Authorized');
    }
    const jwt = await oktaJwtVerifier.verifyAccessToken(token, ['api://default']);
    req.user = {
      uid: jwt.claims.uid,
      email: jwt.claims.sub
    };
    next();
  }
  catch (err) {
    console.log('AUTH ERROR: ', err);
    return res.status(401).send(err.message);
  }
}

module.exports = oktaAuth;