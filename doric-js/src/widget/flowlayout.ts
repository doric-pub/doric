/*
 * Copyright [2019] [Doric.Pub]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Stack } from './layouts'
import { Property, Superview, View, NativeViewModel } from '../ui/view'
import { layoutConfig } from '../util/index.util'
import { BridgeContext } from '../..'

export class FlowLayoutItem extends Stack {
    /**
    * Set to reuse native view
    */
    @Property
    identifier?: string
    /**
     * When set to true, the item will layout using all span area. 
     * HeaderView, footerView or loadMoreView is always true by default.
     */
    @Property
    fullSpan?: boolean
}

export class FlowLayout extends Superview {
    private cachedViews: Map<string, FlowLayoutItem> = new Map

    allSubviews() {
        const ret = [...this.cachedViews.values()]
        if (this.loadMoreView) {
            ret.push(this.loadMoreView)
        }
        if (this.header) {
            ret.push(this.header)
        }
        if (this.footer) {
            ret.push(this.footer)
        }
        return ret
    }

    @Property
    columnCount = 2

    @Property
    columnSpace?: number

    @Property
    rowSpace?: number

    @Property
    itemCount = 0

    @Property
    renderItem!: (index: number) => FlowLayoutItem

    @Property
    batchCount = 15

    @Property
    onLoadMore?: () => void

    @Property
    loadMore?: boolean

    @Property
    loadMoreView?: FlowLayoutItem

    @Property
    onScroll?: (offset: { x: number, y: number }) => void

    @Property
    onScrollEnd?: (offset: { x: number, y: number }) => void

    @Property
    scrollable?: boolean
    /**
     * Take effect only on iOS
     */
    @Property
    bounces?: boolean

    @Property
    header?: FlowLayoutItem

    @Property
    footer?: FlowLayoutItem
    /**
     * @param context 
     * @returns Returns the range of the visible views for each column.
     */
    findVisibleItems(context: BridgeContext) {
        return this.nativeChannel(context, 'findVisibleItems')() as Promise<{ first: number, last: number }[]>
    }
    /**
     * @param context 
     * @returns Returns the range of the completely visible views for each column.
     */
    findCompletelyVisibleItems(context: BridgeContext) {
        return this.nativeChannel(context, 'findCompletelyVisibleItems')() as Promise<{ first: number, last: number }[]>
    }


    reset() {
        this.cachedViews.clear()
        this.itemCount = 0
    }
    private getItem(itemIdx: number) {
        let view = this.renderItem(itemIdx)
        view.superview = this
        this.cachedViews.set(`${itemIdx}`, view)
        return view
    }
    private renderBunchedItems(start: number, length: number) {
        return new Array(Math.min(length, this.itemCount - start)).fill(0).map((_, idx) => {
            const listItem = this.getItem(start + idx)
            return listItem.toModel()
        })
    }

    toModel(): NativeViewModel {
        if (this.loadMoreView) {
            this.dirtyProps['loadMoreView'] = this.loadMoreView.viewId
        }
        if (this.header) {
            this.dirtyProps['header'] = this.header.viewId
        }
        if (this.footer) {
            this.dirtyProps['footer'] = this.footer.viewId
        }
        return super.toModel()
    }
}

export function flowlayout(config: Partial<FlowLayout>) {
    const ret = new FlowLayout
    for (let key in config) {
        Reflect.set(ret, key, Reflect.get(config, key, config), ret)
    }
    return ret
}

export function flowItem(item: View | View[], config?: Partial<FlowLayoutItem>) {
    return (new FlowLayoutItem).also((it) => {
        it.layoutConfig = layoutConfig().fit()
        if (item instanceof View) {
            it.addChild(item)
        } else {
            item.forEach(e => {
                it.addChild(e)
            })
        }
        if (config) {
            it.apply(config)
        }
    })
}
