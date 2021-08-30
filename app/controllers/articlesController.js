// require node packages
const ArticlesController = require('express').Router();
//const User = require('../models/user');
const Article = require('../models/article');
const Comment = require('../models/comment');
const Reply = require('../models/reply');
const _ = require("lodash");
const async = require("async");

// set views path to constant
const view = "../app/views/";

// API Providers
let cgTicker = fetchJSON("https://api.coingecko.com/api/v3/simple/price?ids=tron%2Cbitcoin&vs_currencies=usd");


// call tickers function from api module key
function fetchJSON(url) {
  return new Promise(function(resolve) {
    const https = require("https");
    https.get(url, function(response) {
      response.on("data", function(data){
        resolve(JSON.parse(data));
      });
    });
  }).catch(error => console.error('There was a problem with function fetchJSON Reco', error));
}


ArticlesController.get("/articles/:page", function(req, res) {
  let page = req.params.page || 1, pageLimit = 40, perPage = pageLimit * page, start = perPage - pageLimit, showEnd = perPage;

  async.parallel([
    function(callback) {
      Article.find({}, function(err, article){
        if(err){
          callback(err);
        } else {
          callback(null, article);
        }
      });
    },
    function(callback) {
      Comment.find({}, function(err, comments){
        if(err){
          callback(err);
        } else {
          callback(null, comments);
        }
      });
    }
  ],
  // optional async callback
  function(err, results) {
    if (err) {
      res.send(err);
      return res.sendStatus(400);
    }

    if (results == null || results[0] == null) {
      return res.sendStatus(400);
    }
    //results contains [array1, array2, array3]
    let articles = results[0];
    let comments = results[1];
    let totalpages = Math.ceil(articles.length / pageLimit);
    let articlesCountIndex = start + 1;
    if(articles.length === 0){
      articlesCountIndex = 0;
    }
    if(articles.length < perPage){
      showEnd = articles.length;
    }
    if(page <= totalpages || page == 1){ // throw err if page nonexistent
      // use promise values
      Promise.all([cgTicker]).then(function(data){
        console.log(data[0].bitcoin.usd);
        // render views
        res.render(view + "articles/index", {
          btcTicker: data[0].bitcoin.usd,
          trxTicker: data[0].tron.usd,
          showStart: articlesCountIndex,
          showEnd: showEnd,
          total: articles.length,
          articles: articles.slice(start, perPage),
          current: page,
          pages: totalpages, // match/ciel to prevent decimal values
          comments: comments
        });
        
      // catch errors if any
      }).catch(error => console.error('There was a problem', error));
    } else {
      // err 404
      res.send("page does not exist!");
    }
  });
});

ArticlesController.get("/create-article", function(req, res){
  Promise.all([cgTicker]).then(function(data){
    res.render(view + "articles/create", {btcTicker: data[0].bitcoin.usd, trxTicker: data[0].tron.usd});
  }).catch(error => console.error('There was a problem with pagesController Reco', error));
});

ArticlesController.get("/show", function(req, res){
  Promise.all([cgTicker]).then(function(data){
    res.render(view + "articles/show", {btcTicker: data[0].bitcoin.usd, trxTicker: data[0].tron.usd});
  }).catch(error => console.error('There was a problem with pagesController Reco', error));
});

// view specific job project
ArticlesController.get("/article/:id/:title", function(req, res) {
  // use async function to run find queries in parallel
  async.parallel([
    function(callback) {
      Article.findOne({_id: req.params.id}, function(err, articles){
        if(err){
          callback(err);
        } else {
          callback(null, articles);
        }
      });
    },
    function(callback) {
      Comment.find({Article: req.params.id}, function(err, comments){
        if(err){
          callback(err);
        } else {
          callback(null, comments);
        }
      });
    },
    function(callback) {
      Reply.find({Article: req.params.id}, function(err, replies){
        if(err){
          callback(err);
        } else {
          callback(null, replies);
        }
      });
    }
  ],
  // optional async callback
  function(err, results) {
    if (err) {
      console.log(err);
      return res.sendStatus(400);
    }

    if (results == null || results[0] == null) {
      return res.sendStatus(400);
    }
    //results contains [array1, array2, array3]
    let Article = results[0];
    let comments = results[1];
    let replies = results[2];
    // use promise values
    Promise.all([cgTicker]).then(function(data){
    // render views
      res.render(view + "articles/show", {
        id: article._id,
        title: article.title,
        body: article.spiel,
        comments: comments,
        replies: replies,
        btcTicker: data[0].bitcoin.usd,
        trxTicker: data[0].tron.usd
      });
    // catch errors if any
    }).catch(error => console.error('There was a problem', error));
  });

});

ArticlesController.post("/create-article", function(req, res){  
  if(req.body.title === "" || req.body.spiel === "" ){
    console.log("Missing fields found");
  } else {
    const article = new Article({
      workType: req.body.workType,
      title: _.capitalize(req.body.title),
      spiel: req.body.spiel
    });
    
    article.save(function (err) {
      if(err){
        res.send(err);
      } else {
        res.redirect("/");
        console.log("data saved"); 
        //res.redirect("/jobs/1");
      }
    });
  }
});

/*

// delete a Article
ArticlesController.post("/delete-article", function(req, res) {
  // find parent by provided child id, delete specific child from array
  User.findOneAndUpdate({"articles._id": req.body.articleId}, {
    $pull: { articles: { _id: req.body.articleId } }
  }, {new: true}, function(err, article){
    if(err){
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

*/

module.exports = ArticlesController;