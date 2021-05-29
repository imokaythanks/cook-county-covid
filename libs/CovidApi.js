const { setup } = require('axios-cache-adapter');

const axios = setup({
  baseURL: 'https://idph.illinois.gov/DPHPublicInformation/api/COVID/',
  cache: {
    maxAge: 60 * 60 * 1000
  }
})

function getReportedDeathsForCountyAsync(countyName)
{
  return axios.get(`GetCountyHistorical?countyName=${countyName}`)
    .then((response) => {
      return response.data.values[response.data.values.length - 1].deaths;
    });
}

async function getTotalCaseCountAsync() {
  const chicagoCount = await getReportedDeathsForCountyAsync('Chicago');
  const cookCount = await getReportedDeathsForCountyAsync('Cook');

  return chicagoCount + cookCount;
}

module.exports = {
  getTotalCaseCountAsync
};