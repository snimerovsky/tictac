const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");
const config = require("../config");

const User = new Schema({
  username: String,
  password: String,
  coins: Number,
});

User.statics.create = function (username, password) {
  const encrypted = crypto
    .createHmac("sha1", config.secret)
    .update(password)
    .digest("base64");

  const user = new this({
    username,
    password: encrypted,
    coins: 1000,
  });

  return user.save();
};

User.statics.findOneByUsername = function (username) {
  return this.findOne({
    username,
  }).exec();
};

// verify the password of the User documment
User.methods.verify = function (password) {
  const encrypted = crypto
    .createHmac("sha1", config.secret)
    .update(password)
    .digest("base64");
  console.log(this.password === encrypted);

  return this.password === encrypted;
};

module.exports = mongoose.model("User", User);
