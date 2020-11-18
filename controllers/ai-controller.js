const request = require('request');
const config = require('config');

const AIurl = config.get('AIurl');

function predict_tl(province_id, rice_id, mode, start_date) {
  return new Promise((resolve) => {
    console.log(province_id);
    console.log(rice_id);
    console.log(mode);
    console.log(start_date);

    //let url_callback = "http://192.168.1.101:3000/api/varieties/eval";
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
          // console.log(body);
          resolve(JSON.parse(body));
        }
      }
    );
  });
}
/* */
function update_tl(
  province_id,
  rice_id,
  start_date, //startDate
  current_date, // Date now (after midnight)
  next_day, // order
  old_timeline,
  test_mode,
  test_data
) {
  return new Promise((resolve) => {
    const payload = {
      province_id: province_id,
      rice_id: rice_id,
      start_date: start_date, // From farmSchema
      current_date: current_date,
      next_day: next_day,
      old_timeline: old_timeline,
      test_mode: test_mode, // 0,1
      test_data: test_data, // 0,1
    };
    /*console.log(start_date);
    console.log(current_date);
    console.log(next_day);*/
    console.log(payload);

    request(
      {
        url: AIurl.concat('/update_timeline'),
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
        if (resp) console.log('OK');
        if (body) {
          //console.log(body);
          resolve(JSON.parse(body));
        }
      }
    );
  });
}

function getFeed(date, ad_number) {
  // var req = {
  //   method: 'POST',
  //   url: AIurl.concat('/update_Feed'),
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   formData: { date: date, ad_number: ad_number },
  // };
  // console.log(req);
  return new Promise((resolve) => {
    request(
      {
        url: AIurl.concat('/update_Feed'),
        method: 'POST',
        headers: {
          //'Content-Type': 'application/json',
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
          // console.log('sdasdas', body);
          // return resolve(body);
          resolve(body);
        }
      }
    );
  });
}

module.exports.update_tl = update_tl;
module.exports.predict_tl = predict_tl;
module.exports.getFeed = getFeed;
