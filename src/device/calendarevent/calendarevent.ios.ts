import { AbstractCalendarEvent, PresentEventCreatingDialogParams } from './calendarevent';

class CalendarEventIOS implements AbstractCalendarEvent {
  static presentEventCreatingDialog(params: PresentEventCreatingDialogParams) {
    const calenderEvent = new __SF_CalenderEvent()
    calenderEvent.presentEventCreatingDialog(params.title, params.description, params.location, params.startDate, params.endDate, params.allDay)
  }
}

export default CalendarEventIOS;