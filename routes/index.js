import express from "express";
const router = express.Router();

router.get("/", function (req, res, next) {
  res.send("MDRLOL!");
});

export default router;
