'use strict';

var doric = require('doric');

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") { r = Reflect.decorate(decorators, target, key, desc); }
    else { for (var i = decorators.length - 1; i >= 0; i--) { if (d = decorators[i]) { r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r; } } }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LayoutTest = /*@__PURE__*/(function (Panel) {
    function LayoutTest () {
        Panel.apply(this, arguments);
    }

    if ( Panel ) LayoutTest.__proto__ = Panel;
    LayoutTest.prototype = Object.create( Panel && Panel.prototype );
    LayoutTest.prototype.constructor = LayoutTest;

    LayoutTest.prototype.build = function build (root) {
        doric.vlayout([
            doric.text({
                text: "Fit -> Most",
                layoutConfig: {
                    widthSpec: doric.LayoutSpec.MOST,
                    heightSpec: doric.LayoutSpec.JUST,
                },
                textSize: 30,
                textColor: doric.Color.parse("#535c68"),
                backgroundColor: doric.Color.parse("#dff9fb"),
                textAlignment: doric.gravity().center(),
                height: 50,
            }),
            doric.stack([
                doric.stack([], {
                    layoutConfig: doric.layoutConfig().most(),
                    backgroundColor: doric.Color.BLUE
                }),
                doric.text({
                    text: "This is a stack content",
                    textSize: 20,
                    textColor: doric.Color.WHITE,
                }) ], {
                layoutConfig: {
                    widthSpec: doric.LayoutSpec.FIT,
                    heightSpec: doric.LayoutSpec.FIT,
                },
                backgroundColor: doric.Color.RED
            }),
            doric.vlayout([
                doric.stack([], {
                    layoutConfig: doric.layoutConfig().most(),
                    backgroundColor: doric.Color.BLUE
                }),
                doric.text({
                    text: "This is a stack content",
                    textSize: 20,
                    textColor: doric.Color.WHITE,
                }) ], {
                layoutConfig: {
                    widthSpec: doric.LayoutSpec.FIT,
                    heightSpec: doric.LayoutSpec.FIT,
                },
                backgroundColor: doric.Color.RED
            })
        ], {
            layoutConfig: {
                widthSpec: doric.LayoutSpec.MOST,
                heightSpec: doric.LayoutSpec.FIT,
            },
            space: 20,
        }).in(root);
    };

    return LayoutTest;
}(doric.Panel));
LayoutTest = __decorate([
    Entry
], LayoutTest);
//# sourceMappingURL=LayoutTestDemo.es5.js.map
