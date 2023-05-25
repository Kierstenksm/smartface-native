import AndroidConfig from '../../util/Android/androidconfig';
import { AbstractCalendarEvent, PresentEventCreatingDialogParams } from './calendarevent';

const NativeIntent = requireClass('android.content.Intent');
const NativeCalendarContract = requireClass('android.provider.CalendarContract');
const NativeOffsetDateTime = requireClass('java.time.OffsetDateTime');
const NativeDateTimeFormatter = requireClass('java.time.format.DateTimeFormatter');

const EVENT_TITLE = "title";              // NativeCalendarContract.Events.TITLE
const EVENT_DESCRIPTION = "description";  // NativeCalendarContract.Events.DESCRIPTION
const EVENT_BEGIN_TIME = "beginTime";     // NativeCalendarContract.Events.EXTRA_EVENT_BEGIN_TIME
const EVENT_END_TIME = "endTime";         // NativeCalendarContract.Events.EXTRA_EVENT_END_TIME
const EVENT_LOCATION = "eventLocation";   // NativeCalendarContract.Events.EVENT_LOCATION
const EVENT_ALL_DAY = "allDay";           // NativeCalendarContract.EXTRA_EVENT_ALL_DAY

class CalendarEventAndroid implements AbstractCalendarEvent {
  static presentEventCreatingDialog(params: PresentEventCreatingDialogParams) {
    const intent = new NativeIntent(NativeIntent.ACTION_INSERT);
    intent.setData(NativeCalendarContract.Events.CONTENT_URI);
    if (params.title) {
      intent.putExtra(EVENT_TITLE, params.title);
    }
    if (params.description) {
      intent.putExtra(EVENT_DESCRIPTION, params.description);
    }
    const startDate = params.startDate && this.parseDate(params.startDate);
    if (startDate) {
      intent.putExtra(EVENT_BEGIN_TIME, long(startDate));
    }
    const endDate = params.endDate && this.parseDate(params.endDate);
    if (endDate) {
      intent.putExtra(EVENT_END_TIME, long(endDate));
    }
    if (params.location) {
      intent.putExtra(EVENT_LOCATION, params.location);
    }
    if (params.allDay !== undefined) {
      intent.putExtra(EVENT_ALL_DAY, params.allDay);
    }
    AndroidConfig.activity.startActivity(NativeIntent.createChooser(intent, null));
  }

  private static parseDate(dateStr: string) {
    return NativeOffsetDateTime.parse(dateStr, NativeDateTimeFormatter.ISO_OFFSET_DATE_TIME).toInstant().toEpochMilli();
  }
}

export default CalendarEventAndroid;
