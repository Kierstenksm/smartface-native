import { IHeaderBarItem } from './headerbaritem';
import { NativeMobileComponent } from '../../core/native-mobile-component';
import { Point2D } from '../../primitive/point2d';
import AndroidConfig from '../../util/Android/androidconfig';
import AndroidUnitConverter from '../../util/Android/unitconverter';
import HeaderBarItemPadding from '../../util/Android/headerbaritempadding';
import ImageAndroid from '../image/image.android';
import LayoutParams from '../../util/Android/layoutparams';
import BadgeAndroid from '../badge/badge.android';
import ColorAndroid from '../color/color.android';
import { IColor } from '../color/color';
import { IView } from '../view/view';
import { IBadge } from '../badge/badge';
import { IImage } from '../image/image';
import { ISearchView } from '../searchview/searchview';

const SFView = requireClass('io.smartface.android.sfcore.ui.view.SFViewUtil');
const NativeTextButton = requireClass('android.widget.Button');
const NativePorterDuff = requireClass('android.graphics.PorterDuff');
const NativeImageButton = requireClass('android.widget.ImageButton');
const NativeView = requireClass('android.view.View');
const NativeRelativeLayout = requireClass('android.widget.RelativeLayout');

const activity = AndroidConfig.activity;

function PixelToDp(px) {
    return AndroidUnitConverter.pixelToDp(px);
}

export default class HeaderBarItemAndroid extends NativeMobileComponent<any, IHeaderBarItem> implements IHeaderBarItem {
    protected createNativeObject() {
        return null;
    }
    static iOS = { SystemItem: {} };
    private _title: string;
    private _image: IImage | string | null;
    private _customView?: IView;
    private _enabled: boolean;
    private _color: IColor | null;
    private _badge?: IBadge;
    private _accessibilityLabel: string;
    private isLeftItem: boolean;
    isBadgeEnabled: boolean;
    private actionBar: any | null;
    private _imageButton: boolean;
    private _searchView: ISearchView | null;
    private _menuItem: any | null;
    nativeBadgeContainer: any;
    private _itemColor: IColor;
    private _systemIcon: number | string;

    protected preConstruct(params?: Partial<IHeaderBarItem>): void {
        this._title = '';
        this._image = null;
        this._customView = undefined;
        this._enabled = true;
        this._color = null;
        this._badge = undefined;
        this.isLeftItem = false;
        this.isBadgeEnabled = false;
        this.actionBar = null;
        this._imageButton = false;
        this._searchView = null;
        this._menuItem = null;
        this._itemColor = ColorAndroid.WHITE;
        super.preConstruct(params);
    }

    constructor(params?: Partial<IHeaderBarItem>) {
        super(params);

        this.addAndroidProps(this.getAndroidProps());
    }
    onPress: (() => void) | null;
    private getAndroidProps() {
        const self = this;
        return {
            get systemIcon() {
                return self._systemIcon;
            },
            set systemIcon(systemIcon) {
                self._systemIcon = systemIcon;

                if (!self.nativeObject || !self.imageButton) {
                    self.nativeObject = self.createNativeImageButton.call(self);
                    self.updateAccessibilityLabel(self._accessibilityLabel);
                }

                if (typeof self._systemIcon === 'number') {
                    self.nativeObject && self.nativeObject.setImageResource(ImageAndroid.systemDrawableId(self._systemIcon));
                }
            }
        };
    }
    get color() {
        return this._color;
    }
    set color(value: IColor | null) {
        if (value instanceof ColorAndroid) {
            this._color = value;
            this.updateColor(value);
        }
    }
    get title() {
        return this._title;
    }
    set title(value: string) {
        if (value !== null && typeof value !== 'string') {
            throw new TypeError('title must be string or null.');
        }
        this._title = value;
        this.titleSetterHelper(this._title);
    }
    get imageButton() {
        return this._imageButton;
    }
    set imageButton(value) {
        this._imageButton = value;
    }
    get menuItem() {
        return this._menuItem;
    }
    set menuItem(value) {
        this._menuItem = value;
    }
    get image() {
        return this._image;
    }
    set image(value: IImage | string | null) {
        if (typeof value === 'string')
            value = ImageAndroid.createImageFromPath(value); //IDE requires this implementation.

        this._image = value;
        if (!this.nativeObject || !this.imageButton) {
            this.nativeObject = this.createNativeImageButton();
            this.updateAccessibilityLabel(this._accessibilityLabel);
        }
        if (this._image) {
            const imageCopy = (this._image as ImageAndroid).nativeObject.mutate();
            this.nativeObject.setImageDrawable(imageCopy);
        } else {
            this.nativeObject.setImageDrawable(null);
            this.nativeObject = null;
            if (this.android.attributedTitle) {
                this.android.attributedTitle = this.android.attributedTitle;
            } else {
                this.title = this._title;
            }
        }
    }
    get searchView() {
        return this._searchView;
    }
    set searchView(searchView) {
        if (searchView) {
            this._searchView = searchView;
            if (this.nativeObject) {
                this.nativeObject.setActionView(this._searchView?.nativeObject);
            }
        }
    }
    get enabled() {
        return this._enabled;
    }
    set enabled(value: boolean) {
        this._enabled = !!value;
        if (this.nativeObject) {
            this.nativeObject.setEnabled(this._enabled);
        }
    }
    get size() {
        return this.nativeObject
            ? {
                width: AndroidUnitConverter.pixelToDp(this.nativeObject.getWidth()),
                height: AndroidUnitConverter.pixelToDp(this.nativeObject.getHeight())
            }
            : undefined;
    }
    set size(value) {
        if (typeof value === 'object' && this.nativeObject) {
            this.nativeObject.setWidth(AndroidUnitConverter.dpToPixel(value.width));
            this.nativeObject.setHeight(AndroidUnitConverter.dpToPixel(value.height));
        }
    }
    get badge() {
        if (this._badge === undefined) {
            this._badge = new BadgeAndroid();
            this.isBadgeEnabled = true;
            this.assignRules(this._badge);
            this.addToHeaderView(this._badge);
        }
        return this._badge;
    }
    get customView() {
        return this._customView;
    }
    set customView(view) {
        this._customView = view;
    }
    get accessibilityLabel() {
        return this._accessibilityLabel;
    }
    set accessibilityLabel(value: string) {
        this._accessibilityLabel = value;
        if (this.nativeObject)
            this.updateAccessibilityLabel(this._accessibilityLabel);
    }
    get itemColor() {
        return this._itemColor;
    }
    set itemColor(color: IColor) {
        if (color instanceof ColorAndroid) {
            this._itemColor = color;
        }
    }
    setValues() {
        this.enabled = this.enabled;

        if (!this._customView) {
            if (this.imageButton) {
                this.image && (this.image = this.image);
                this.android.systemIcon && (this.android.systemIcon = this.android.systemIcon);
            } else if (this.android.attributedTitle) {
                this.android.attributedTitle = this.android.attributedTitle;
            } else {
                this.title = this._title;
            }
            this.color = this.color;
        }

        this.nativeObject.setOnClickListener(
            NativeView.OnClickListener.implement({
                onClick: () => {
                    this.onPress?.();
                }
            })
        );
    }
    toString() {
        return 'HeaderBarItem';
    }
    titleSetterHelper(title: string) {
        const itemTitle = title ? title : '';
        if (!this.nativeObject || this.imageButton) {

            this.nativeObject = new NativeTextButton(activity);
            this.updateAccessibilityLabel(this._accessibilityLabel);
            this.nativeObject.setText(itemTitle);
            this.nativeObject.setBackgroundColor(ColorAndroid.TRANSPARENT.nativeObject);
            this.nativeObject.setPaddingRelative(HeaderBarItemPadding.vertical, HeaderBarItemPadding.horizontal, HeaderBarItemPadding.vertical, HeaderBarItemPadding.horizontal);
            this.imageButton = false;
            this.color = this._color;
            if (this.menuItem) {
                const itemView = this.menuItem.getActionView();
                itemView.getChildCount() && itemView.removeAllViews();
                itemView.addView(this.nativeObject);
            }
        } else {
            this.nativeObject.setText(itemTitle);
            this.color = this._color;
        }
    }
    updateAccessibilityLabel(accessibilityLabel: string) {
        if (this.isLeftItem && this.actionBar) {
            this.actionBar.setHomeActionContentDescription(accessibilityLabel);
        } else {
            this.nativeObject && this.nativeObject.setContentDescription(accessibilityLabel);
        }
    }
    assignRules(badge: IBadge) {
        if (!this.nativeObject) return;
        const ALIGN_END = 19;

        const layoutParams = new NativeRelativeLayout.LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
        this.nativeObject.setId(NativeView.generateViewId());
        layoutParams.addRule(ALIGN_END, this.nativeObject.getId());

        badge.nativeObject.setLayoutParams(layoutParams);
    }
    addToHeaderView(badge: IBadge) {
        if (!this.nativeBadgeContainer || !badge) return;

        if (!badge.nativeObject.getParent()) {
            this.nativeBadgeContainer.addView(badge.nativeObject);
        } else {
            const parentOfNativeObject = badge.nativeObject.getParent();
            parentOfNativeObject.removeAllViews();
            this.nativeBadgeContainer.addView(badge.nativeObject);
        }
    }
    getScreenLocation(): Point2D {
        const location = toJSArray(SFView.getLocationOnScreen(this.nativeObject));
        const position: Partial<{ x: number; y: number }> = {};
        position.x = PixelToDp(location[0]);
        position.y = PixelToDp(location[1]);
        return position;
    }
    createNativeImageButton() {
        const headerBarItem = this;

        let nativeImageButton;
        if (!headerBarItem.nativeObject || !headerBarItem.imageButton) {
            nativeImageButton = new NativeImageButton(activity);
            nativeImageButton.setBackground(null);
            nativeImageButton.setPaddingRelative(HeaderBarItemPadding.vertical, HeaderBarItemPadding.horizontal, HeaderBarItemPadding.vertical, HeaderBarItemPadding.horizontal);
        } else nativeImageButton = headerBarItem.nativeObject;
        headerBarItem.imageButton = true;
        if (headerBarItem.menuItem) {
            /*
            We know that got action view is ViewGroup.
            */
            const itemView = headerBarItem.menuItem.getActionView();
            itemView.getChildCount() && itemView.removeAllViews();
            itemView.addView(nativeImageButton);
        }

        return nativeImageButton;
    }

    updateColor(color: IColor) {
        if (this.nativeObject && color instanceof ColorAndroid && !this._customView) {
            if (this.imageButton) {
                const imageCopy = this.nativeObject.getDrawable().mutate();
                imageCopy.setColorFilter(color.nativeObject, NativePorterDuff.Mode.SRC_IN);
                this.nativeObject.setImageDrawable(imageCopy);
            } else {
                this.nativeObject.setTextColor(color.nativeObject);
            }
        }
    }
}
