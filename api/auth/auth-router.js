const router = require("express").Router();
const mdw = require("../auth/auth-middleware");
const usersModel = require("../users/users-model");
const utils = require("../secrets/utilst");

router.post(
  "/register",
  mdw.payloadCheck,
  mdw.emailUnique,
  async (req, res, next) => {
    try {
      const newUser = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.inPassword,
      };

      const insertedUsers = await usersModel.create(newUser);
      res.status(201).json(insertedUsers);
    } catch (error) {
      next(error);
    }
  }
);

router.post("/login", mdw.passwordCheck, async (req, res, next) => {
  try {
    const payload = {
      user_id: req.user.user_id,
    };
    let token = utils.generateToken(payload, "1d");
    res.status(200).json({
      message: `Welcome ${req.user.name} `,
      token,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
