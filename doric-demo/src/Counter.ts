import {
  text,
  vlayout,
  ViewHolder,
  VMPanel,
  ViewModel,
  Gravity,
  NativeCall,
  Text,
  Color,
  log,
  logw,
  loge,
  Group,
  LayoutSpec,
  layoutConfig,
  modal,
  Panel,
} from "doric";

interface CountModel {
  count: number;
}
class CounterView extends ViewHolder {
  number!: Text;
  counter!: Text;
  build(root: Group) {
    vlayout(
      [
        text({
          text: `Current language is ${Environment.localeLanguage}`,
        }),
        text({
          text: `Current country is ${Environment.localeCountry}`,
        }),
        this.number = text({
          textSize: 40,
          tag: "tvNumber",
        }),

        this.counter = text({
          text: "Click To Count 1",
          textSize: 20,
          tag: "tvCounter",
        }),
      ],
      {
        layoutConfig: layoutConfig().most(),
        gravity: Gravity.Center,
        space: 20,
      }
    ).in(root);
  }
}

class CounterVM extends ViewModel<CountModel, CounterView> {
  onAttached(s: CountModel, vh: CounterView) {
    vh.counter.onClick = () => {
      Promise.resolve(this.getState().count).then(count => {
        this.updateState((state) => {
          state.count = count + 1;
        });
      })
    };
  }
  onBind(s: CountModel, vh: CounterView) {
    vh.number.text = `${s.count}`;
    log(`Current count  is ${s.count}`);
    logw(`Current count is ${s.count}`);
    loge(`Current count is ${s.count}`);
  }
}

@Entry
export class CounterPage extends VMPanel<CountModel, CounterView> {
  state = {
    count: 1,
  }
  constructor() {
    super();
    log("Constructor");
  }
  getViewHolderClass() {
    return CounterView;
  }

  getViewModelClass() {
    return CounterVM;
  }

  getState(): CountModel {
    return this.state;
  }
}
