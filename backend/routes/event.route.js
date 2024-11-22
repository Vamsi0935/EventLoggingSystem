const express = require("express");
const { createLogging, getCreateLog, streamLogs } = require("../controllers/event.controller");
const router = express.Router();

router.post("/createLog", createLogging);
router.get("/createLog/get", getCreateLog);
router.get("/streamLog", streamLogs)
module.exports = router;