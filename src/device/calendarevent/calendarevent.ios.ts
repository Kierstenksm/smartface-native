import { AbstractCalendarEvent, PresentEventCreatingDialogParams } from './calendarevent';

class CalendarEventIOS implements AbstractCalendarEvent {
  static calenderEvent = new __SF_CalenderEvent()

  static presentEventCreatingDialog(params: PresentEventCreatingDialogParams) {
    CalendarEventIOS.calenderEvent.presentEventCreatingDialog(params.title, params.description, params.location, params.startDate, params.endDate, params.allDay)
  }
}

export default CalendarEventIOS;