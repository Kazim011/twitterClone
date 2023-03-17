const userModel = require("../users/users-model");
const bcrpyt = require("bcryptjs");

const payloadCheck = async (req, res, next) => {
  try {
    const { name, surname, email, password } = req.body;
    if (!name || !surname || !email || !password) {
      res.status(400).json({ message: "Eksik alan var!" });
    } else {
      req.inPassword = await bcrpyt.hash(password, 8);
      if (
        name.length < 3 ||
        name.length > 128 ||
        surname.length < 3 ||
        surname.length > 128
      ) {
        res.status(400).json({
          message: "girilen name veya surname formata uygun değildir.",
        });
      } else if (typeof name !== "string" || typeof surname !== "string") {
        res.status(400).json({ message: "name veya surname string degildir" });
      } else {
        next();
      }
    }
  } catch (error) {
    next(error);
  }
};

const emailUnique = async (req, res, next) => {
  try {
    let isExistsUser = await userModel.getByFilter({ email: req.body.email });
    if (isExistsUser) {
      res.status(401).json({ message: "Bu email ile kayıtlı kullanıcı var!" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

const passwordCheck = async (req, res, next) => {
  try {
    const email = await userModel.getByFilter({ email: req.body.email });
    if (!email || !req.body.password) {
      res.status(401).json({ message: "Geçersiz kriterler" });
    } else {
      const { password } = req.body;
      const isTruePassword = bcrpyt.compareSync(password, email.password);
      if (!isTruePassword) {
        res.status(401).json({ message: "Geçersiz kriterler" });
      } else {
        req.user = email;
        next();
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  payloadCheck,
  emailUnique,
  passwordCheck,
};
