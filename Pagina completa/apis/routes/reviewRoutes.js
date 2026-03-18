const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/reviewController");
const { authenticateToken } = require("../middleware/auth");

router.post("/", authenticateToken, ReviewController.create);
router.get("/banquete/:id", ReviewController.getByBanquete);

module.exports = router;
