var express = require('express');
var State = require('../models/State');
var Country = require('../models/Country');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json('Express');
});

// sort countries

router.get('/list', async (req, res, next) => {
  let type = req.query.type;
  let list = type
    ? await State.find({}).sort({ name: type })
    : await State.find({});
  res.json(list);
});

router.get('/list/population', async (req, res, next) => {
  let type = req.query.type;
  let list = type
    ? await State.find({}).sort({ population: type })
    : await State.find({});
  res.json(list);
});

//list neighbour states

router.get('/:id/neighbours', async (req, res, next) => {
  let stateId = req.params.id;
  try {
    let neighbouringStates = await State.findById(stateId)
      .populate('neighbouring_states')
      .exec((err, neighbouringStates));
    res.json({ neighbouringStates });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/neighbours/:neighbourId', async (req, res, next) => {
  let stateId = req.params.id;
  let neighbourId = req.params.neighbourId;
  try {
    const neighbouringStates = await State.findByIdAndUpdate(
      stateId,
      {
        $addToSet: { neighbouring_states: neighbourId },
      },
      { new: true }
    );
    res.json({ neighbouringStates });
  } catch (error) {
    next(error);
  }
});

//update state

router.post('/:id/update', async (req, res, next) => {
  let stateId = req.params.id;
  let data = req.body;
  try {
    let updatedState = await State.findByIdAndUpdate(stateId, data);
    res.json({ updatedState });
  } catch (error) {
    next(error);
  }
});

//delete state

router.get('/:id/delete', async (req, res, next) => {
  let stateId = req.params.id;
  try {
    let deletedState = await State.findByIdAndDelete(stateId);
    let updatedCountry = await Country.findByIdAndUpdate(deletedState.country, {
      $pull: { states: deletedState.id },
    });
    res.json({ deletedState, updatedCountry });
  } catch (error) {
    next(error);
  }
});

module.exports = router;