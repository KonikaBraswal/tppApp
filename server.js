const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  // Function to get URL parameters by name
  function getUrlParameterByName(name, url) {
    if (!url) url = req.url;
    var match = new RegExp('[?&]' + name + '=([^&]*)').exec(url) ||
                new RegExp('#' + name + '=([^&]*)').exec(url);
    return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : null;
  }

  // Get the "code" parameter from the URL query string or fragment part
  const consentCode = getUrlParameterByName('code', req.url);

  // Display the extracted code
  if (consentCode) {
    res.send(`<p>Consent Code: ${consentCode}</p>`);
  } else {
    res.send('<p>No consent code found in the URL query parameters or fragment part.</p>');
  }

  // Print the current URL in the console
  console.log(`Current URL: ${req.protocol}://${req.hostname}${req.originalUrl}`);
});

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});







//working
// const express = require('express');
// const app = express();
// const port = 3000;

// app.get('/', (req, res) => {
//   // Function to get URL parameters by name
//   function getUrlParameterByName(name, url) {
//     if (!url) url = req.url;
//     var match = new RegExp('[?&]' + name + '=([^&]*)').exec(url);
//     return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : null;
//   }

//   // Get the "code" parameter from the URL query string
//   const consentCode = getUrlParameterByName('code', req.url);

//   // Display the extracted code
//   if (consentCode) {
//     res.send(`<p>Consent Code: ${consentCode}</p>`);
//   } else {
//     res.send('<p>No consent code found in the URL query parameters.</p>');
//   }

//   // Add additional logic here, e.g., notify the user or perform further actions
// });

// app.listen(port, () => {
//   console.log(`Server is running at https://localhost:${port}`);
// });
