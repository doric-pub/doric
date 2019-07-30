//
//  DoricGroupNode.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/30.
//

#import "DoricGroupNode.h"

@interface DoricGroupNode ()
@property (nonatomic,strong) NSMutableArray *indexInfo;
@end

@implementation DoricGroupNode

- (instancetype)init {
    if(self = [super init]) {
        _children = [[NSMutableDictionary alloc] init];
        _indexInfo = [[NSMutableArray alloc] init];
    }
    return self;
}

- (UIView *)build:(NSDictionary *)props {
    return [[UIView alloc] init];
}

- (void)blendView:(UIView *)view forPropName:(NSString *)name propValue:(id)prop {
    if([name isEqualToString:@"children"]) {
        NSArray *array = prop;
        NSInteger i;
        for (i = 0; i< array.count; i++) {
            NSDictionary *val = array[i];
            if (!val) {
                continue;
            }
            NSString *type = [val objectForKey:@"type"];
            NSString *viewId = [val objectForKey:@"id"];
            DoricViewNode *node = [self.children objectForKey:viewId];
            if (node == nil) {
                node = [DoricViewNode create:self.doricContext withType:type];
                node.index = i;
                node.parent = self;
                node.viewId = viewId;
                [self.children setObject:node forKey:viewId];
            } else if (i != node.index){
                node.index = i;
                [node.view removeFromSuperview];
            }
            LayoutParams *params = node.layoutParams;
            if (params == nil) {
                params = [self generateDefaultLayoutParams];
            }
            [node blend:[val objectForKey:@"props"]];
            if ([self.indexInfo objectAtIndex:i] == nil) {
                [self.view insertSubview:node.view atIndex:i];
                [self.indexInfo setObject:node atIndexedSubscript:i];
            }
        }
        for (; i < self.view.subviews.count; i++) {
            [self.view.subviews[i] removeFromSuperview];
            DoricViewNode *node = [self.indexInfo objectAtIndex:i];
            if (node != nil) {
                [self.children removeObjectForKey: node.viewId];
                [self.indexInfo removeObjectAtIndex:i];
            }
        }
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}

- (LayoutParams *)generateDefaultLayoutParams {
    LayoutParams *params = [[LayoutParams alloc] init];
    return params;
}

- (void)blendChild:(DoricViewNode *)child layoutConfig:(NSDictionary *)layoutconfig {
    LayoutParams *params = child.layoutParams;
    NSDictionary *margin = [layoutconfig objectForKey:@"margin"];
    params.margin.top = [(NSNumber *)[margin objectForKey:@"top"] floatValue];
    params.margin.left = [(NSNumber *)[margin objectForKey:@"left"] floatValue];
    params.margin.right = [(NSNumber *)[margin objectForKey:@"right"] floatValue];
    params.margin.bottom = [(NSNumber *)[margin objectForKey:@"bottom"] floatValue];
}
@end
