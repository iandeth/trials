'use strict';
const utils = require('../utils');
const UserCalendarM = require('../model/user_calendar.js');

class CalendarC {
  async getEventsForUser(req, res) {
    let user = await utils.CurrentUser.get(req);
    let events = await new UserCalendarM(user).getEvents();
    let d = { events: events };
    return res.send({ data:d });
  }
}

module.exports = CalendarC;
