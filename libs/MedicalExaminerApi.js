const { setup } = require('axios-cache-adapter');

const axios = setup({
  baseURL: 'https://datacatalog.cookcountyil.gov/resource/cjeq-bs86.json',
  cache: {
    maxAge: 60 * 60 * 1000
  }
})

// https://datacatalog.cookcountyil.gov/Public-Safety/Medical-Examiner-Case-Archive/cjeq-bs86
function getDeathsCountAsync(startTime, endTime){
    const startTimeQuery = startTime.toISOString().split('.')[0];
    const endTimeQuery = endTime.toISOString().split('.')[0];

    return axios.get(`?$where=death_date%20between%20%27${startTimeQuery}%27%20and%20%27${endTimeQuery}%27&$select=count(casenumber)`)
      .then((response) => {
        return parseInt(response.data[0].count_casenumber);
      });
}

module.exports = {
  getDeathsCountAsync
};