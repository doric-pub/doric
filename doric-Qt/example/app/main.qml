import QtQuick 2.12
import QtQuick.Controls 2.5
import QtQuick.Layouts 1.15

ApplicationWindow {
    visible: true
    width: 600
    height: 844
    title: qsTr("Doric Demo")

    ColumnLayout{
        spacing: 0
        anchors.fill: parent

        Rectangle {
            id: navbar
            visible: false
            Layout.fillWidth: true
            Layout.preferredHeight: 44

            Text {
                text: "Title"
                font.pixelSize: 16
                anchors.centerIn: parent
            }

            RowLayout {
                anchors.verticalCenter: parent.verticalCenter
                Rectangle {
                    Layout.preferredWidth: 10
                }

                Image {
                    Layout.preferredWidth: 24
                    Layout.preferredHeight: 24
                    id: name
                    source: "qrc:/doric/qml/doric_icon_back.png"
                }

                Text {
                    text: "Left"
                    font.pixelSize: 16
                }

                MouseArea {
                    width: parent.width
                    height: parent.height
                    onClicked: {
                        navigatorPop()
                    }
                }
            }

            RowLayout {
                anchors.right: parent.right
                anchors.verticalCenter: parent.verticalCenter

                Text {
                    text: "Right"
                    font.pixelSize: 16
                }

                Rectangle {
                    Layout.preferredWidth: 10
                }
            }
        }

        Rectangle {
            id: content
            Layout.fillWidth: true
            Layout.fillHeight: true

            StackView {
                id: stack
                objectName: "stackView"
                anchors.fill: content

                initialItem: ScrollView {
                    id: entry

                    width: content.width
                    height: content.height

                    ScrollBar.horizontal.policy: ScrollBar.AlwaysOff
                    ScrollBar.vertical.policy: ScrollBar.AlwaysOff

                    ListView {
                        id: list
                        width: content.width
                        model: 23
                        boundsBehavior: Flickable.StopAtBounds

                        function getSource(index) : string {
                            switch (index) {
                                case 0:
                                    return "ComponetDemo.js"
                                case 1:
                                    return "Counter.js"
                                case 2:
                                    return "DraggableDemo.js"
                                case 3:
                                    return "EffectsDemo.js"
                                case 4:
                                    return "FlexDemo.js"
                                case 5:
                                    return "Gobang.js"
                                case 6:
                                    return "ImageDemo.js"
                                case 7:
                                    return "InputDemo.js"
                                case 8:
                                    return "LayoutDemo.js"
                                case 9:
                                    return "LayoutTestDemo.js"
                                case 10:
                                    return "ModalDemo.js"
                                case 11:
                                    return "ModularDemo.js"
                                case 12:
                                    return "NavigatorDemo.js"
                                case 13:
                                    return "NetworkDemo.js"
                                case 14:
                                    return "NotificationDemo.js"
                                case 15:
                                    return "PopoverDemo.js"
                                case 16:
                                    return "ScrollerDemo.js"
                                case 17:
                                    return "SimpleDemo.js"
                                case 18:
                                    return "SliderDemo.js"
                                case 19:
                                    return "Snake.js"
                                case 20:
                                    return "StorageDemo.js"
                                case 21:
                                    return "SwitchDemo.js"
                                case 22:
                                    return "TextDemo.js"
                            }
                        }

                        delegate: Rectangle {
                            Column {
                                anchors.centerIn: parent
                                Text {
                                    text: {
                                        return list.getSource(index)
                                    }
                                }
                            }
                            width: content.width
                            height: 60
                            MouseArea {
                                anchors.fill: parent
                                onClicked: {
                                    let source = list.getSource(index)
                                    demoBridge.navigate("assets://src/" + source, source)
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    function navigatorPush(page) {
        stack.push(page)
        if (stack.depth > 1) {
            navbar.visible = true
        } else {
            navbar.visible = false
        }
    }

    function navigatorPop() {
        stack.pop()
        if (stack.depth > 1) {
            navbar.visible = true
        } else {
            navbar.visible = false
        }
    }

    function navigatorPopToRoot() {
        while (stack.depth > 1) {
            stack.pop()
        }

        if (stack.depth > 1) {
            navbar.visible = true
        } else {
            navbar.visible = false
        }
    }
}
