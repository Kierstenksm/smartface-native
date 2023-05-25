export type PresentEventCreatingDialogParams = {
  title?: string,
  description?: string,
  location?: string,
  startDate?: string,
  endDate?: string,
  allDay?: boolean
};

/**
 * @class Device.CalendarEvent
 * @since 5.1.4
 *
 * This class provides access to calendar events.
 *
 * @example
 *     import CalendarEvent from '@smartface/native/device/calendarevent';
 *
 *     CalendarEvent.presentEventCreatingDialog({
 *       title: "Event Title",
 *       description: "Event Description",
 *       location: "Ankara, Etimesgut, Türkiye",
 *       startDate: "2023-05-26T07:10:42.616+03:00",
 *       endDate: "2023-05-26T13:30:42.616+03:00",
 *       allDay: false,
 *     });
 */
export interface ICalendarEvent {
}

export abstract class AbstractCalendarEvent implements ICalendarEvent {
  /**
   * Use presentEventCreatingDialog to open a calendar for the add calendar event. {@link Permissions#calendar} Permisson is required for iOS to access native Calender app.
   *
   * @example
   *     import CalendarEvent from '@smartface/native/device/calendarevent';
   *
   *     CalendarEvent.presentEventCreatingDialog({
   *       title: "Event Title",
   *       description: "Event Description",
   *       location: "Ankara, Etimesgut, Türkiye",
   *       startDate: "2023-05-26T07:10:42.616+03:00",
   *       endDate: "2023-05-26T13:30:42.616+03:00",
   *       allDay: false,
   *     });
   * 
   * @method presentEventCreatingDialog
   * @param {String} params.title title of event
   * @param {String} params.description notes (iOS) or description (Android) associated with the event.
   * @param {String} params.location location of event
   * @param {String} params.startDate start date of event in UTC, format: 'yyyy-MM-dd'T'HH:mm:ss.SSSZZZZZ'
   * @param {String} params.endDate end date of event in UTC, format: 'yyyy-MM-dd'T'HH:mm:ss.SSSZZZZZ'
   * @param {Boolean} params.allDay event cover the whole day or not
   * @static
   * @android
   * @ios
   * @since 5.1.4
   */
  static presentEventCreatingDialog(params: PresentEventCreatingDialogParams) {
    throw new Error('Method not implemented.');
  }
}
