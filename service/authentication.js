////tokens
const jwt = require("jsonwebtoken");

const secretKey = "my_Secrte_key_For_JWT";

const createTokenForLoginUser = (user) => {
  const payload = {
    id: user._id,
    fullname: user.fullname,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, secretKey);
};


const verifyUserForLogin=(token)=>{

    return jwt.verify(token,secretKey)


}

module.exports={createTokenForLoginUser,verifyUserForLogin}