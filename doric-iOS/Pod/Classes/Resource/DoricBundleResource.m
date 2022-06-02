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
// Created by pengfei.zhou on 2021/10/25.
//

#import "DoricBundleResource.h"

@implementation DoricBundleResource
- (DoricAsyncResult <NSData *> *)fetchRaw {
    DoricAsyncResult *result = [DoricAsyncResult new];
    NSString *path = [self.bundle bundlePath];
    NSString *fullPath = [path stringByAppendingPathComponent:self.identifier];
    NSData *imgData = [[NSData alloc] initWithContentsOfFile:fullPath];
    if (imgData) {
        [result setupResult:imgData];
    } else {
        [result setupError:[NSException exceptionWithName:@"ResourceLoadError"
                                                   reason:@"Load resource error"
                                                 userInfo:nil]];
    }
    return result;
}
@end
