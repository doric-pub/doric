import QtQuick 2.12
import QtQuick.Controls 2.5

ApplicationWindow {
    visible: true
    width: 960
    height: 720
    title: qsTr("Scroll")

    ScrollView {
        anchors.fill: parent

        ListView {
            width: parent.width
            model: 4
            delegate: Rectangle {
                Column {
                    anchors.centerIn: parent
                    Text {
                        text: {
                            switch (index) {
                                case 0:
                                    return "Counter.es5.js"
                                case 1:
                                    return "Gobang.es5.js"
                                case 2:
                                    return "SimpleDemo.es5.js"
                                case 3:
                                    return "Snake.es5.js"
                            }
                        }
                    }
                }
                width: parent.width
                height: 60
                MouseArea {
                    anchors.fill: parent
                    onClicked: {
                        demoBridge.navigate(index)
                    }
                }
            }
        }
    }
}
