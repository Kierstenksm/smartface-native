import { AbstractCalendarEvent } from "./calendarevent";

class CalendarEventImpl extends AbstractCalendarEvent { }

const CalendarEvent: typeof CalendarEventImpl = require(`./calendarevent.${Device.deviceOS.toLowerCase()}`).default;
type CalendarEvent = CalendarEventImpl;

export default CalendarEvent;