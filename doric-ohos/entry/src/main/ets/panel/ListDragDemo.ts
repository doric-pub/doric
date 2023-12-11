import { Panel, Group, layoutConfig, Color, stack, list, listItem, text, loge, List } from "doric"
import { colors } from "./utils"

export class ListDragDemo extends Panel {

  private data = new Array(10000).fill(1)

  private list?: List

  build(root: Group) {
    function insertAt(array: Array<any>, index: number, ...elements: Array<any>) {
      array.splice(index, 0, ...elements);
    }

    stack(
      [
        this.list = list({
          itemCount: this.data.length,
          renderItem: (idx) => {
            return listItem(text({
              text: `Item :${this.data[idx]}`,
              layoutConfig: layoutConfig().just(),
              width: root.width,
              height: 50,
              textColor: Color.WHITE,
              backgroundColor: colors[idx % colors.length],
            }))
          },
          layoutConfig: layoutConfig().most(),
          canDrag: true,
          itemCanDrag: (from) => {
            if (from === 0) {
              return false;
            } else {
              return true;
            }
          },
          beforeDragging: (from) => {
            return [0, 1, 2]
          },
          onDragging: (from, to) => {
            loge(`onDragging from: ${from}, to: ${to}`)
          },
          onDragged: (from, to) => {
            loge(`onDragged from: ${from}, to: ${to}`)

            const tmp = this.data[from]
            this.data.splice(from, 1)
            insertAt(this.data, to, tmp)
            loge(this.data)
          }
        })
      ],
      {
        layoutConfig: layoutConfig().most()
      }
    ).into(root)

    setTimeout(() => {
      this.list!.scrollToItem(this.context, 3, {
        animated: true,
        topOffset: 0
      })
    }, 3000)
  }
}