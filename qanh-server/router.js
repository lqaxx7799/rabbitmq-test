const dayjs = require('dayjs');
const Router = require('express').Router();
const publisher = require('./job/publisher');

Router.post('/schedule', (req, res) => {

  const { type, period, eventName, eventData } = req.body;
  let scheduledAt;
  if (type === 'absolute') {
    scheduledAt = dayjs(period).toDate();
  } else if (type === 'relative') {
    scheduledAt = dayjs().add(period.value, period.unit);
  }

  const delayInMilliSeconds = scheduledAt.diff(dayjs());
  console.log(1111111, delayInMilliSeconds);
  publisher(eventName, eventData, delayInMilliSeconds);
  res.json({ success: true });
});

// Router.delete('/schedule/:id', (req, res) => {
//   const { id } = req.params;
//   producer.cancel(id);
//   res.json({ success: true });
// });

module.exports = Router;