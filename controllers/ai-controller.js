const request = require('request');
const config = require('config');

const AIurl = config.get('AIurl');

function predict_tl(province_id, rice_id, mode, start_date) {
  return new Promise((resolve) => {
    console.log(province_id);
    console.log(rice_id);
    console.log(mode);
    console.log(start_date);
    request(
      {
        url: AIurl.concat('/predict'),
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        formData: {
          province_id: province_id,
          rice_id: rice_id,
          mode: mode,
          start_date: start_date,
        },
      },
      function (err, resp, body) {
        if (err) resolve('Error');
        if (resp) console.log('success from ai');
        if (body) {
          resolve(JSON.parse(body));
        }
      }
    );
  });
}
/* */
function update_tl(
  province_id,
  rice_id, // varieties
  start_date, //startDate
  current_date, // Date now (after midnight)
  next_day, // Start order of new timeline
  old_timeline, // From now to end timeline Status 3 and 4
  test_mode,
  test_data
) {
  return new Promise((resolve) => {
    request(
      {
        url: AIurl.concat('/update_timeline'),
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        json: true,
        formData: {
          province_id: province_id,
          rice_id: rice_id,
          start_date: start_date,
          current_date: current_date,
          next_day: next_day,
          old_timeline: old_timeline,
          test_mode: test_mode,
          test_data: test_data,
        },
      },
      function (err, resp, body) {
        if (err) resolve('Error');
        if (resp) console.log('success from ai');
        if (body) {
          resolve(body);
        }
      }
    );
  });
}

function getFeed(date, ad_number) {
  return new Promise((resolve) => {
    request(
      {
        url: AIurl.concat('/update_Feed'),
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        formData: {
          date: date,
          ad_number: ad_number,
        },
      },
      function (err, resp, body) {
        if (err) resolve('Error');
        if (resp) {
          console.log('success from ai');
        }
        if (body) {
          resolve(body);
        }
      }
    );
  });
}

function resultEvaluate(province_id, rice_id, evalproduct) {
  return new Promise((resolve) => {
    request(
      {
        url: AIurl.concat('/update_evalproduct'),
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        json: true,
        formData: {
          province_id: province_id,
          rice_id: rice_id,
          evalproduct: evalproduct,
        },
      },
      function (err, resp, body) {
        if (err) resolve('Error');
        if (resp) console.log('success from ai');
        if (body) {
          resolve(body);
        }
      }
    );
  });
}
module.exports.update_tl = update_tl;
module.exports.predict_tl = predict_tl;
module.exports.getFeed = getFeed;
module.exports.resultEvaluate = resultEvaluate;
