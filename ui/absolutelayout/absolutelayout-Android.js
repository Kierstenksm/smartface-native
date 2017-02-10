const extend                    = require('js-base/core/extend');
const FlexLayout                = require('../flexlayout');

const AbsoluteLayout = extend(FlexLayout)(
    function (_super, params) {
        var self = this;
        _super(this);

        const super_AddChild = this.addChild;
        this.addChild = function(view){
            super_AddChild(view);
            view.position = FlexLayout.Position.ABSOLUTE;
        };
        // Assign parameters given in constructor
        if (params) {
            for (var param in params) {
                this[param] = params[param];
            }
        }
    }
);

module.exports = AbsoluteLayout;