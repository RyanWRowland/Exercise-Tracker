const User = require('../models/User.js');

const router = require('express').Router();

// error, send to next --> next(err)
// next({status: 400, message: 'error text'})

// create new user
router.post('/new-user', (req, res, next) => {
  let username = req.body.username;
  if (!username) {
    return next({
      status: 400,
      message: 'Username is required'
    });
  }
  
  let newUser = new User({
    username: username
  });
  newUser.save((err, savedUser) => {
    if (err) return next(err);
    res.json({
      username: savedUser.username,
      _id: savedUser._id
    });
  });
});

// add exercise
router.post('/add', (req, res, next) => {
  const userId = req.body.userId;
  const desc = req.body.description;
  let dur = req.body.duration;
  let date = req.body.date;
  
  if (!userId) return next({status: 400, message: 'UserId is required'});
  
  if (!desc) return next({status: 400, message: 'Description is required'});
  
  if (!dur) return next({status: 400, message: 'Duration is required'});
  if (/^\d+$/.test(dur)) {
    dur = parseInt(dur, 10);
  }
  else return next({status: 400, message: 'Duration must be only numbers'});
  
  if (!date) {
    date = new Date();
  }
  else {
    date = new Date(date);
    if (isNaN(date)) return next({status: 400, message: 'Invalid date'});
  }
  
  User.findById(userId, (err, user) => {
    if (err) return next(err);
    if (!user) return next({status: 400, message: 'User not found'});
    user.log.push({description: desc, duration: dur, date: date});
    user.save((err, savedUser) => {
      if (err) return next(err);
      let exercise = savedUser.log[savedUser.log.length - 1];
      
      res.json({
        username: savedUser.username,
        userId: savedUser._id,
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date.toDateString()
      });
    });
  });
});

// all users
router.get('/users', (req, res, next) => {
  User.find({}).select('username _id').exec((err, data) => {
    if (err) return next(err);
    res.json(data);
  });
});

// /log?userId=<userId>&from=<date>&to=<date>&limit=<number>
router.get('/log', (req, res, next) => {
  const userId = req.query.userId;
  User.findById(userId, (err, user) => {
    if (err) return next(err);
    if (!user) return next({status: 400, message: 'User not found'});
    // found user, format data then send
    let log = user.log;
    log.sort((a, b) => b.date - a.date);
    
    if (req.query.limit && !isNaN(req.query.limit)) {
      log = log.slice(0, parseInt(req.query.limit));
    }
    
    if (req.query.from && req.query.to) {
      // filter /w from and to
      let from = new Date(req.query.from);
      let to = new Date(req.query.to);
      if (!isNaN(from) && !isNaN(to)) {
        log = log.filter(exercise => exercise.date >= from && exercise.date <= to);
      }
    }
    else if (req.query.to) {
      // filter /w just to
      let to = new Date(req.query.to);
      if (!isNaN(to)) {
        log = log.filter(exercise => exercise.date <= to);
      }
    }
    else if (req.query.from) {
      // filter /w just from
      let from = new Date(req.query.from);
      if (!isNaN(from)) {
        log = log.filter(exercise => exercise.date >= from);
      }
    }
    
    log = log.map(exercise => ({
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString()
    }));
    
    res.json({
      _id: user.userId,
      username: user.username,
      count: log.length,
      log: log
    });
  });
});

module.exports = router;