var http = require('https');

console.log('starting function')
exports.handle = function(e, ctx) {
  console.log('processing event: %j', e);

  console.log(new Buffer(e).toString('base64'));
  event_data = new Buffer(JSON.stringify(e)).toString('base64');

  data = {
    "commit": "HEAD",
    "branch": "master",
    "message": "auto",
    "env": {
      "EVENT_DATA": event_data
    }
  }

  data = JSON.stringify(data);

  access_token = "?access_token=" + process.env.BUILDKITE_API_TOKEN;

  var options = {
    host: 'api.buildkite.com',
    port: '443',
    path: '/v2/organizations/hooroo/pipelines/hooroo-status/builds' + access_token,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  }

  // Set up the request
  var post_req = http.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        console.log('Response: ' + chunk);
      });

      res.on('finish', function () {
        ctx.succeed({ hello: 'world' })
      });
  });

  post_req.write(data);
  post_req.end();

}
