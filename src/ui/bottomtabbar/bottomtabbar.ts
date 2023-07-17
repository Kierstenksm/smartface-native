import { INativeMobileComponent, MobileOSProps } from '../../core/native-mobile-component';
import { IColor } from '../color/color';
import TabBarItem from '../tabbaritem';

export interface IBottomTabBarAndroidProps {
  /**
   * Gets the maximum number of items that add to bottom tab bar.
   *
   * @since 1.1.10
   * @property {Number} maxItemCount
   * @android
   * @readonly
   */
  maxItemCount: number;
  /**
   * Enable/disable the default animation of BottomTabBar item. Might be used while badge being used.
   *
   * @since 4.0.1
   * @property {Boolean} disableItemAnimation
   * @android
   * @removed since 4.2.2
   */
  disableItemAnimation?: boolean; //TODO: Find out why this exists because it isn't used on bottomtabbar.android.ts
}

export interface IBottomTabBarIOSProps {
  /**
   * A Boolean value that indicates whether the tab bar is translucent.
   *
   * @property {Boolean} translucent
   * @ios
   * @since 4.0.2
   */
  translucent: boolean;
}

/**
 * @class UI.BottomTabBar
 * @since 1.1.10
 *
 * BottomTabBar represents a bottom navigation bar. You can specify bar color and item color.
 *
 * @see {@link https://docs.smartface.io/smartface-native-framework/ui-elements/bottomtabbar  BottomTabBar}
 *
 */
export interface IBottomTabBar extends INativeMobileComponent<any, MobileOSProps<IBottomTabBarIOSProps, IBottomTabBarAndroidProps>> {
  /**
   * Gets/sets background color of the tab bar items.
   *
   * @property {UI.Color} backgroundColor
   * @android
   * @ios
   * @since 1.1.10
   */
  backgroundColor: IColor;
  /**
   * Gets/sets title and icon color of the tab bar items.
   *
   * @property {Object} itemColor
   * @property {UI.Color} itemColor.normal
   * @property {UI.Color} itemColor.selected
   * @android
   * @ios
   * @since 1.1.10
   */
  itemColor: {
    normal: IColor;
    selected: IColor;
  };
  /**
   * Gets/sets items of the tab bar.
   *
   * @android
   * @ios
   * @since 3.2.0
   */
  items: TabBarItem[] | null;
  
  /**
   * Gets/sets size of the tab bar item icon.
   *
   * @android
   * @ios
   * @since 5.0.5
   */
  iconSize: number;
}
