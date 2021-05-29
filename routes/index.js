const express = require('express');
const router = express.Router();

const covidApi = require('../libs/CovidApi');
const medicalExaminerApi = require('../libs/MedicalExaminerApi');

/* GET home page. */
router.get('/', async (req, res, next) => {
  const referenceYearStart = new Date(2019, 0, 1);
  const referenceYearEnd = new Date(2020, 0, 1);
  const covidYearStart = new Date(2020, 0, 1);
  const now = new Date();
  
  const deathsInReferenceYear = await medicalExaminerApi.getDeathsCountAsync(referenceYearStart, referenceYearEnd);
  const allDeaths = await medicalExaminerApi.getDeathsCountAsync(covidYearStart, now);
  const reportedDeaths = await covidApi.getTotalCaseCountAsync();

  const covidTicks = now - covidYearStart;
  const referenceTicks = referenceYearEnd - referenceYearStart;
  const expectedDeaths = Math.ceil(deathsInReferenceYear * (covidTicks / referenceTicks));
  const unexpectedDeaths = allDeaths - expectedDeaths - reportedDeaths;

  res.render('index', { allDeaths, deathsInReferenceYear, reportedDeaths, expectedDeaths, unexpectedDeaths });
});

module.exports = router;
