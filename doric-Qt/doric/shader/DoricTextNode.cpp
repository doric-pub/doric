#include "DoricTextNode.h"
#include "../utils/DoricUtils.h"

QQuickItem *DoricTextNode::build() {
  QQmlComponent component(getContext()->getQmlEngine());

  const QUrl url(QStringLiteral("qrc:/doric/qml/text.qml"));
  component.loadUrl(url);

  if (component.isError()) {
    qCritical() << component.errorString();
  }

  QQuickItem *item = qobject_cast<QQuickItem *>(component.create());

  item->setProperty("wrapper", QString::number((qint64)this));
  return item;
}

void DoricTextNode::blend(QQuickItem *view, QString name, QJsonValue prop) {
  if (name == "text") {
    view->childItems().at(0)->setProperty("text", prop.toString());
  } else if (name == "textColor") {
    QString color = DoricUtils::doricColor(prop.toInt()).name();
    view->childItems().at(0)->setProperty("color", color);
  } else if (name == "textSize") {
    QFont font = view->childItems().at(0)->property("font").value<QFont>();
    font.setPixelSize(prop.toInt());
    view->childItems().at(0)->setProperty("font", QVariant(font));
  } else if (name == "textAlignment") {
    view->childItems().at(0)->setProperty("textAlignment", prop.toInt());
  } else {
    DoricViewNode::blend(view, name, prop);
  }
}
