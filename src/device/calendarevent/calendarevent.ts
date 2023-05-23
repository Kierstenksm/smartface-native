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
 *       location: "43.5565, 37.43434",
 *       startDate: "2023-06-23T10:45",
 *       endDate: "2023-06-23T14:45",
 *       allDay: false
 *     });
 */
export interface ICalendarEvent {
}

export abstract class AbstractCalendarEvent implements ICalendarEvent {
  /**
   * Use presentEventCreatingDialog to open a calendar for the add calendar event.
   *
   * @method presentEventCreatingDialog
   * @param {String} params.title title of event
   * @param {String} params.description notes (iOS) or description (Android) associated with the event.
   * @param {String} params.location location of event
   * @param {String} params.startDate start date of event in UTC, format: 'YYYY-MM-DDTHH:mm:ss.SSSZ'
   * @param {String} params.endDate end date of event in UTC, format: 'YYYY-MM-DDTHH:mm:ss.SSSZ'
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
