import { Superview, View } from "../ui/view";
import { Stack } from "./layouts";
import { BridgeContext } from "../runtime/global";
export declare class SlideItem extends Stack {
    /**
     * Set to reuse native view
     */
    identifier?: string;
}
export declare class Slider extends Superview {
    private cachedViews;
    private ignoreDirtyCallOnce;
    allSubviews(): IterableIterator<SlideItem>;
    itemCount: number;
    renderPage: (index: number) => SlideItem;
    batchCount: number;
    onPageSlided?: (index: number) => void;
    loop?: boolean;
    private getItem;
    isDirty(): boolean;
    private renderBunchedItems;
    slidePage(context: BridgeContext, page: number, smooth?: boolean): Promise<any>;
    getSlidedPage(context: BridgeContext): Promise<number>;
}
export declare function slider(config: Partial<Slider>): Slider;
export declare function slideItem(item: View | View[], config?: Partial<SlideItem>): SlideItem;
