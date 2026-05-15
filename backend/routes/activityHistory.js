const express = require('express');

const router = express.Router();

const {
  getActivityHistory,
} = require('../db/database');

router.get('/', (req, res) => {
  try {
    const history =
      getActivityHistory();

    res.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        'Failed to fetch activity history',
    });
  }
});

module.exports = router;