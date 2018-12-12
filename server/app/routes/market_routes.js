module.exports = function(app, db) {
  app.post('/postUserMove', (req, res) => {
    var userID = req.body.userID
    var date = req.body.date
    var market = req.body.market
    if (userID && date && market) {
      db.ref("/stores/" + market + "/" + userID + "/timestamp").once('value').then(function (snap){
        var dateArray = snap.val()
        dateArray.push(date)
        db.ref("/stores/" + market + "/" + userID + "/timestamp").set(dateArray)
        db.ref("/users/" + userID + "/path").once('value').then(function (snap){
          var pathArray = snap.val()
          pathArray.push(market)
          db.ref("/users/" + userID + "/path").set(pathArray)
          res.send("SUCCESS")
        })
      })
    } else {
      res.send("FAIL - need userID, date and market on body");
    }
  })

  app.get('/getTimestamp/:storeName/:userId', (req, res) => {
    console.log("getTimestamp", req.params.storeName);
    db.ref("/stores/" + req.params.storeName + "/" + req.params.userId).once('value').then(function(snap) {
      var market = snap.val()
      console.log("lastItem == ", getLastItem(market.timestamp));
      res.send(getLastItem(market.timestamp))
    })
  })

  function countProperties (obj) {
    var count = 0;

    for (var property in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, property)) {
            count++;
        }
    }
    return count;
  }

  function getLastItem (obj) {
    var count = 0;

    for (var property in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, property)) {
        count++
        if (count == countProperties(obj)) {
          console.log("property = ", obj[property])
          return obj[property]
        }
      }
    }
  }

  app.get('/getStores', (req, res) => {
    db.ref("/stores/").once('value').then(function (snap){
      var resArray = []
      var marketArray = snap.val()
      Object.keys(marketArray).forEach(function(key){
        var market = marketArray[key]
        var tmp = {"name": key, "value": 0}
        Object.keys(market).forEach(function(id) {
          tmp.value += countProperties(market[id].timestamp);
        })
        resArray.push(tmp)
      })
      res.send(JSON.stringify(resArray))
    })
  })

  app.get('/getUsers', (req, res) => {
    db.ref("users/").once('value').then(function(snap) {
      var pathArray = snap.val()
      res.send(JSON.stringify(pathArray))
    })
  })

  app.get('/getPathByUserID/:userID', (req, res) => {
    var userID = req.params.userID
    console.log("userid = ", userID);
    if (userID) {
      db.ref("users/" + userID + "/path").once('value').then(function (snap){
        var pathArray = snap.val()
        res.send(JSON.stringify(pathArray))
      })
    } else {
      res.send("FAIL - need userID on params")
    }
  })
}
