const { verifyUserForLogin } = require("../service/authentication");

function checkAuthenticationByToken(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies ? req.cookies[cookieName] : null;

    if (!tokenCookieValue) {
      // return res.status(401).json({ message: "Unauthorized" });
      return next();
    }

    try {
      const userPaylaod = verifyUserForLogin(tokenCookieValue);
      if (!userPaylaod) {
        // return res.status(401).json({ message: "Unauthorized" });
        return next();
      }

      req.user = userPaylaod;
      res.locals.user = userPaylaod; 
     
    } catch (error) {
      // return res.status(401).json({ message: "Unauthorized " });
    }

    return next();
  };
}

module.exports = { checkAuthenticationByToken };
