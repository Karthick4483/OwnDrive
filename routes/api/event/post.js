const keystone = require('keystone');

const Event = keystone.list('Event');

// eslint-disable-next-line consistent-return
module.exports = (req, res) => {
  if (!req.body.name || !req.body.startTime || !req.body.endTime) {
    return res.send({ status: 'incomplete data set' });
  }

  // eslint-disable-next-line new-cap
  const newEvent = new Event.model();
  Event.updateItem(newEvent, req.body, error => {
    res.locals.enquirySubmitted = true;
    if (error) res.locals.saveError = true;
    res.render('addEvent');
  });
};
