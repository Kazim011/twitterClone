const router = require("express").Router();
const commetsModel = require("./commets-model");
const mdw = require("./commets-middleware");

router.get("/", async (req, res, next) => {
  try {
    const allCommets = await commetsModel.getAll();
    res.status(200).json(allCommets);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", mdw.checkCommetId, async (req, res, next) => {
  const insertedId = await commetsModel.getCommetById(req.params.id);
  res.status(200).json(insertedId);
});

router.post("/", async (req, res, next) => {
  try {
    const newCommets = await commetsModel.create(req.body);
    res.status(201).json(newCommets);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", mdw.checkCommetId, async (req, res, next) => {
  try {
    const updateComment = await commetsModel.updateById(
      req.params.id,
      req.body
    );
    res.json(updateComment);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", mdw.checkCommetId, async (req, res, next) => {
  try {
    await commetsModel.remove(req.params.id);
    res.json({ message: "Yorum silme işlemi başarılı." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
