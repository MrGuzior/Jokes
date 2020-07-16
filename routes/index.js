var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

const rootPath = 'https://sv443.net/jokeapi/v2/joke/';

router.get('/', async (req, res, next) => {

  const categories = [req.query.Programming, req.query.Miscellaneous]
  const blackList = [req.query.nsfw, req.query.religious, req.query.political, req.query.racist, req.query.sexist]
  const searchString = req.query.string ? `&contains=${req.query.string}` : '';

  const getBlackList = (blackList) => {
    let arr = []
    blackList.map(item => {
      if (item) {
        arr.push(item)
      }
    })
    return arr.join(',');
  }

  const getCategories = (cat) => {
    if (cat[0] && cat[1]) {
      return `${cat[0]},${cat[1]}`
    } else if (cat[0] && !cat[1]) {
      return cat[0]
    } else if (!cat[0] && cat[1]) {
      return cat[1]
    } else {
      return 'Any'
    }
  }

  const categoryString = getCategories(categories);

  const path = `${rootPath}${categoryString}?blacklistFlags=${getBlackList(blackList)}${searchString}`;

  const joke = await fetch(path)
    .then(data => data.json())
    .then(json => json);

  res.render('index', { joke: joke })

});


module.exports = router;
