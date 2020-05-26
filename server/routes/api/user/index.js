const router = require("express").Router();
const controller = require("./user.controller");

router.post("/userUpdateCoins", controller.userUpdateCoins);

module.exports = router;
