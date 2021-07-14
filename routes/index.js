var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/viewer', function(req, res, next) {
  res.render('blueprintView', { name: 'Demo Cutter', bpString: 'NobwRAxg9gtgDlAdgU0QFwM5gFzgMpoCGaAlhALKFwCi6JaAnjuFAE4kDmJizYAHjgC0ARgA0YJtgAMAX3GsoRUkhwAmAOxTxbTt0IAbAEqLiJFdg1bIUACbIcwmU9Hho8JKky8CpilVqkjLw6XDy4-DhWkrLyJsphViF6RnFmYZbi0HZqTnKusAgo6FjhPqR+NHRB4Ulh4ALS4pKOsUppkdrsoQbGbeZWWfbYwi1gAJJoyDAACgoQyBgYbLwofGgA8gCuaHDbePqKkXLjkzDUAFbIEGjL4RgHXtigYPRTOIib+vricAocrAsSrIALq5FzWdxFR74NoVAL0SQsLrcXgNKI5VqmfqdXSIHqpbHWbLYACcxwmU1mUHmi1u4FWG22uzQ+0O0nJpwuVxurF490UJWerxg70+3zAvyg-0BR3BwtFXx+fwBiyOoOc+UhnhKMN8lEqgURYFqqI6EhwAGZjgo+gkcd0UrazYMHGDNYVtd5Yfr4dUkbjTcMmrKwDasXbjci8Y7wzgSQNbEMrRqIR7il69f4qkaTeEGmJzcNrQSI7V8U7GkShsJVBzKXNAXSwAytjs9g8QxSzpdrk3+Y8hacFeLJdLVez1XlUx506VvVnDcEo4HVMH2Zj4nHElHy7HSQniY4nMCgA' });
});

module.exports = router;
