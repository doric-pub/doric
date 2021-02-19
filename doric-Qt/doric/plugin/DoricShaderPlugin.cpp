#include <QDebug>

#include "../shader/DoricRootNode.h"
#include "DoricShaderPlugin.h"

void DoricShaderPlugin::render(QJSValue jsValue, QString callbackId) {
  qDebug() << getContext();
  getContext()->getDriver()->asyncCall(
      [this, jsValue] {
        QString viewId = jsValue.property("id").toString();
        DoricRootNode *rootNode = getContext()->getRootNode();

        if (rootNode->getId().isEmpty() && jsValue.property("type").toString() == "Root") {
          rootNode->setId(viewId);
          rootNode->blend(jsValue.property("props"));
        }
      },
      DoricThreadMode::UI);
}
