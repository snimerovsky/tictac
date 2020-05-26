const User = require("../../../models/user");

exports.userUpdateCoins = (req, res) => {
  console.log("req");
  User.updateOne({ username: req.headers.name }, req.body, function (err) {
    if (err) return res.send(500, { error: err });
    return res.send("Coins added");
  });
};
