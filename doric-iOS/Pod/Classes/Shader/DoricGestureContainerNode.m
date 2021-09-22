/*
 * Copyright [2021] [Doric.Pub]
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
//
//  DoricGestureContainerNode.m
//  Doric
//
//  Created by jingpeng.wang on 2021/09/17.
//

#import "DoricGestureContainerNode.h"


@interface DoricGestureContainerNode()

@property(nonatomic, strong) NSString *onSingleTap;
@property(nonatomic, strong) NSString *onDoubleTap;
@property(nonatomic, strong) NSString *onLongPress;
@property(nonatomic, strong) NSString *onPinch;
@property(nonatomic, strong) NSString *onPan;
@property(nonatomic, strong) NSString *onRotate;
@property(nonatomic, strong) NSString *onSwipe;

@property(nonatomic) CGPoint startPanLocation;
@property(nonatomic) CGFloat startRotationDegree;

@end

#define SWIPE_UP_THRESHOLD -1000.0f
#define SWIPE_DOWN_THRESHOLD 1000.0f
#define SWIPE_LEFT_THRESHOLD -1000.0f
#define SWIPE_RIGHT_THRESHOLD 1000.0f

@implementation DoricGestureContainerNode
- (UIView *)build {
    UIView *stackView = [super build];
    
    UITapGestureRecognizer *singleTap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(singleTapAction:)];
    [stackView addGestureRecognizer:singleTap];
    
    UITapGestureRecognizer *doubleTap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(doubleTapAction:)];
        doubleTap.numberOfTapsRequired = 2;
    [stackView addGestureRecognizer:doubleTap];
    
    [singleTap requireGestureRecognizerToFail:doubleTap];
    
    UILongPressGestureRecognizer *longPress = [[UILongPressGestureRecognizer alloc] initWithTarget:self action:@selector(longPressAction:)];
    [stackView addGestureRecognizer:longPress];
    
    UIPinchGestureRecognizer *pinchGesture = [[UIPinchGestureRecognizer alloc] initWithTarget:self action:@selector(pinchAction:)];
    [stackView addGestureRecognizer:pinchGesture];
    
    UIPanGestureRecognizer *panGesture = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(panAction:)];
    [stackView addGestureRecognizer:panGesture];
    
    UIRotationGestureRecognizer *rotation = [[UIRotationGestureRecognizer alloc] initWithTarget:self action:@selector(rotationAction:)];
    [stackView addGestureRecognizer:rotation];
    
    return stackView;
}

-(void)singleTapAction:(UITapGestureRecognizer *)sender{
    if (self.onSingleTap)
        [self callJSResponse:self.onSingleTap, nil];
}

-(void)doubleTapAction:(UITapGestureRecognizer *)sender{
    if (self.onDoubleTap)
        [self callJSResponse:self.onDoubleTap, nil];
}

-(void)longPressAction:(UILongPressGestureRecognizer *)sender{
    if (sender.state == UIGestureRecognizerStateBegan) {
        if (self.onLongPress)
            [self callJSResponse:self.onLongPress, nil];
    }
}

-(void)pinchAction:(UIPinchGestureRecognizer *)sender{
    if (self.onPinch)
        [self callJSResponse:self.onPinch, @(sender.scale), nil];
}

-(void)panAction:(UIPanGestureRecognizer *)sender{
    if (sender.state == UIGestureRecognizerStateBegan)  {
        self.startPanLocation = [sender locationInView:self.view];
    }
    CGPoint currentLocation = [sender locationInView:self.view];
    
    CGFloat dx = self.startPanLocation.x - currentLocation.x;
    CGFloat dy = self.startPanLocation.y - currentLocation.y;
    
    self.startPanLocation = currentLocation;
    
    if (self.onPan)
        [self callJSResponse:self.onPan, @(dx), @(dy), nil];

        // detect the swipe gesture
        if (sender.state == UIGestureRecognizerStateEnded) {
            CGPoint vel = [sender velocityInView:sender.view];

            if (vel.x < SWIPE_LEFT_THRESHOLD) {
                if (self.onSwipe)
                    [self callJSResponse:self.onSwipe, @(0), nil];
            } else if (vel.x > SWIPE_RIGHT_THRESHOLD) {
                if (self.onSwipe)
                    [self callJSResponse:self.onSwipe, @(1), nil];
            } else if (vel.y < SWIPE_UP_THRESHOLD) {
                if (self.onSwipe)
                    [self callJSResponse:self.onSwipe, @(2), nil];
            } else if (vel.y > SWIPE_DOWN_THRESHOLD) {
                if (self.onSwipe)
                    [self callJSResponse:self.onSwipe, @(3), nil];
            } else {
                // TODO:
                // Here, the user lifted the finger/fingers but didn't swipe.
                // If you need you can implement a snapping behaviour, where based on the location of your         targetView,
                // you focus back on the targetView or on some next view.
                // It's your call
            }
        }
}

-(void)rotationAction:(UIRotationGestureRecognizer *)sender{
    if (sender.state == UIGestureRecognizerStateBegan)  {
        self.startRotationDegree = sender.rotation;
    }
    
    CGFloat diffRotation = sender.rotation - self.startRotationDegree;
    self.startRotationDegree = sender.rotation;
    if (self.onRotate)
        [self callJSResponse:self.onRotate, @(diffRotation), nil];
}

- (void)blendView:(UIView *)view forPropName:(NSString *)name propValue:(id)prop {
    if ([name isEqualToString:@"onSingleTap"]) {
        self.onSingleTap = prop;
    } else if ([name isEqualToString:@"onDoubleTap"]) {
        self.onDoubleTap = prop;
    } else if ([name isEqualToString:@"onLongPress"]) {
        self.onLongPress = prop;
    } else if ([name isEqualToString:@"onPinch"]) {
        self.onPinch = prop;
    } else if ([name isEqualToString:@"onPan"]) {
        self.onPan = prop;
    } else if ([name isEqualToString:@"onRotate"]) {
        self.onRotate = prop;
    } else if ([name isEqualToString:@"onSwipe"]) {
        self.onSwipe = prop;
    } else {
        [super blendView:view forPropName:name propValue:prop];
    }
}
@end
