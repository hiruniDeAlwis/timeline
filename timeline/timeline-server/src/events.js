const express = require('express');

function createRouter(db) {
  const router = express.Router();

 //insert new events to the data base
 //route will only activate when a post request is recieved
 //data posted will be obtained through req.body object.
  router.post('/event', (req, res, next) => {
    const owner = req.user.email; //each user will only see their own events.bcoz events are stored seperately for users
    db.query(
      'INSERT INTO events (owner, name, description, date) VALUES (?,?,?,?)',
      [owner, req.body.name, req.body.description, new Date(req.body.date)],
      (error) => {
        if (error) {
          console.error(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json({status: 'Hiruni It worked'});
        }
      }
    );
  });
//list events of a single owner
//links HTTTP GET request to MySql Select Statement
  router.get('/event', function (req, res, next) {
    const owner = req.user.email;
    db.query(
      'SELECT id, name, description, date FROM events WHERE owner=? ORDER BY date LIMIT 10 OFFSET ?',
      [owner, 10*(req.params.page || 0)],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json(results);
        }
      }
    );
  });
//links HTTP Put request with mysql update statement
//id is obtained as a route parameter from req.params
  router.put('/event/:id', function (req, res, next) {
    const owner = req.user.email;
    db.query(
      'UPDATE events SET name=?, description=?, date=? WHERE id=? AND owner=?',
      [req.body.name, req.body.description, new Date(req.body.date), req.params.id, owner],
      (error) => {
        if (error) {
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json({status: 'ok'});
        }
      }
    );
  });

  router.delete('/event/:id', function (req, res, next) {
    const owner = req.user.email;
    db.query(
      'DELETE FROM events WHERE id=? AND owner=?',
      [req.params.id, owner],
      (error) => {
        if (error) {
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json({status: 'ok'});
        }
      }
    );
  });

  return router;
}

module.exports = createRouter;