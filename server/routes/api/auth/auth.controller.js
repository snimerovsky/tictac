const jwt = require("jsonwebtoken");
const User = require("../../../models/user");

exports.register = (req, res) => {
  const { username, password } = req.body;

  const create = async (user) => {
    if (user) {
      this.login(req, res);
    } else {
      if (username === "") {
        throw new Error("Username can't be empty");
      }
      if (password.length < 6) {
        throw new Error("Password length must be at least 6 characters");
      }
      await User.create(username, password);
      await this.login(req, res);
      return;
    }
  };

  // run when there is an error (username exists)
  const onError = (error) => {
    res.status(409).json({
      message: error.message,
    });
  };

  // check username duplication
  User.findOneByUsername(username)
    .then(create)
    .catch(onError);
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  const secret = req.app.get("jwt-secret");
  // check the user info & generate the jwt
  const check = (user) => {
    if (!user) {
      throw new Error("login failed");
    } else {
      // user exists, check the password
      if (user.verify(password)) {
        // create a promise that generates jwt asynchronously
        const p = new Promise((resolve, reject) => {
          jwt.sign(
            {
              _id: user._id,
              username: user.username,
              coins: user.coins,
            },
            secret,
            {
              expiresIn: "7d",
              subject: "userInfo",
            },
            (err, token) => {
              if (err) reject(err);
              resolve(token);
            },
          );
        });
        return p;
      } else {
        throw new Error("login failed");
      }
    }
  };

  // respond the token
  const respond = (token) => {
    console.log("login");
    res.json({
      message: "logged in successfully",
      token,
    });
  };

  // error occured
  const onError = () => {
    res.status(400).json({
      message: "This username already in use. Password incorrect",
    });
  };

  // find the user
  User.findOneByUsername(username).then(check).then(respond).catch(onError);
};

exports.check = (req, res) => {
  res.json({
    success: true,
    info: req.decoded,
  });
};
