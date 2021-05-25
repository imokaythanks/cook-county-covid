var express = require('express');
var axios = require('axios');
var router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
  const referenceYearStart = new Date(2019, 0, 1);
  const referenceYearEnd = new Date(2020, 0, 1);
  const covidYearStart = new Date(2020, 0, 1);
  const now = new Date();
  
  const deathsInReferenceYear = await axios.get(`https://datacatalog.cookcountyil.gov/resource/cjeq-bs86.json?$where=death_date%20between%20%27${referenceYearStart.toISOString().split('.')[0]}%27%20and%20%27${referenceYearEnd.toISOString().split('.')[0]}%27&$select=count(casenumber)`)
    .then((response) => {
      return response.data[0].count_casenumber;
    });

  const allDeaths = await axios.get(`https://datacatalog.cookcountyil.gov/resource/cjeq-bs86.json?$where=death_date%20between%20%27${covidYearStart.toISOString().split('.')[0]}%27%20and%20%27${now.toISOString().split('.')[0]}%27&$select=count(casenumber)`)
    .then((response) => {
      return response.data[0].count_casenumber;
    });

  const cookReportedDeaths = await axios.get('https://idph.illinois.gov/DPHPublicInformation/api/COVID/GetCountyHistorical?countyName=Cook')
    .then((response) => {
      return response.data.values[response.data.values.length - 1].deaths;
    });
  const chicagoReportedDeaths = await axios.get('https://idph.illinois.gov/DPHPublicInformation/api/COVID/GetCountyHistorical?countyName=Chicago')
    .then((response) => {
      return response.data.values[response.data.values.length - 1].deaths;
    });

  const reportedDeaths = cookReportedDeaths + chicagoReportedDeaths;  
  const covidTicks = now - covidYearStart;
  const referenceTicks = referenceYearEnd - referenceYearStart;
  const expectedDeaths = Math.ceil(deathsInReferenceYear * (covidTicks / referenceTicks));
  const unexpectedDeaths = allDeaths - expectedDeaths - reportedDeaths;

  res.render('index', { allDeaths, deathsInReferenceYear, reportedDeaths, expectedDeaths, unexpectedDeaths });
});

module.exports = router;
