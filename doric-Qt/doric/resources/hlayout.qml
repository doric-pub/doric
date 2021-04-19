import QtQuick 2.12
import QtQuick.Controls 2.5
import QtQuick.Layouts 1.15

import "util.mjs" as Util

Rectangle {
    property var wrapper

    clip: true

    property var uuid: Util.uuidv4()

    property var tag: "HLayout"

    onWidthChanged: {
        console.log(tag, uuid + " onWidthChanged: " + this.width)
    }

    onHeightChanged: {
        console.log(tag, uuid + " onHeightChanged: " + this.height)
    }

    color: 'transparent'

    property var backgroundColor

    onBackgroundColorChanged: {
        color = backgroundColor
    }

    property var borderWidth: 0
    onBorderWidthChanged: {
        border.width = borderWidth
    }

    property var borderColor: ""
    onBorderColorChanged: {
        border.color = borderColor
    }

    MouseArea {
        anchors.fill: parent
        onClicked: {
            console.log(tag, uuid + " wrapper: " + wrapper)
            mouseAreaBridge.onClick(wrapper)
        }
    }
}
