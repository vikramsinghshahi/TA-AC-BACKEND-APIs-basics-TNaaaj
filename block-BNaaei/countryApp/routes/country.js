var express = require('express');
var State = require('../models/State');
var Country = require('../models/Country');
var router = express.Router();

//Get all country

router.get('/', async (req, res, next) => {
  try {
    let countries = await Country.find({});
    res.status(200).json({ countries });
  } catch (error) {
    next(error);
  }
});

// Save a country

router.post('/', async (req, res, next) => {
  let data = req.body;
  data.ethnicity = data.ethnicity.trim().split(',');
  try {
    let createdCountry = await Country.create(data);
    res.status(200).json({ createdCountry });
  } catch (error) {
    next(error);
  }
});

// sort countries

router.get('/list', async (req, res, next) => {
  let type = req.query.type;
  let list = type
    ? await Country.find({}).sort({ name: type })
    : await Country.find({});
  res.json(list);
});

//update country
router.get('/:id/update', async (req, res, next) => {
  let countryId = req.params.id;
  try {
    let country = await Country.findById(countryId);
    res.json({ country });
  } catch (error) {
    next(error);
  }
});

//delete country

router.get('/:id/delete', async (req, res, next) => {
  let countryId = req.params.id;
  try {
    const deletedCountry = await Country.findByIdAndDelete(countryId);
    res.json({ deletedCountry });
  } catch (error) {
    next(error);
  }
});

//add state to country

router.post('/:id/state/add', async (req, res, next) => {
  let countryId = req.params.id;
  let data = req.body;
  data.country = countryId;
  try {
    const createdState = await State.create(data);
    const country = await Country.findByIdAndUpdate(countryId, {
      $push: { States: createdState.id },
    });
    res.json({ createdState, country });
  } catch (error) {
    next(error);
  }
});

//get all neighbouring countries

router.get('/:id/neighbours', async (req, res, next) => {
  let countryId = req.params.id;
  try {
    let neighbouringCountries = await Country.findById(countryId)
      .populate('neighbouring_countires')
      .exec((err, neighbouringCountries));
    res.json({ neighbouringCountries });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/neighbours/:neighbourId', async (req, res, next) => {
  let countryId = req.params.id;
  let neighbourId = req.params.neighbourId;
  try {
    const neighbouringCountries = await Country.findByIdAndUpdate(
      countryId,
      {
        $addToSet: { neighbouring_countires: neighbourId },
      },
      { new: true }
    );
    res.json({ neighbouringCountries });
  } catch (error) {
    next(error);
  }
});

//get list of all religions

router.get('/list/religion', async (req, res, next) => {
  try {
    let listOfReligions = await Country.find({}).select('ethnicity -_id');
    res.json({ listOfReligions });
  } catch (error) {
    next(error);
  }
});

//list of countries based on religion

router.get('/list/religion/:type', async (req, res, next) => {
  let type = req.params.type;
  try {
    let countries = await Country.find({ ethnicity: type });
    res.json({ countries });
  } catch (error) {
    next(error);
  }
});

//list of countries based on continent
router.get('/list/continent/:name', async (req, res, next) => {
  let name = req.params.name;
  try {
    let countries = Country.find({ continent: name });
    res.json({ countries });
  } catch (error) {
    next(error);
  }
});
module.exports = router;