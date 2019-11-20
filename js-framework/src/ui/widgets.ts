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
import { IView, View, Property } from "./view"
import { Color } from "../util/color"
import { Gravity } from "../util/gravity"

export interface IText extends IView {
    text?: string
    textColor?: Color
    textSize?: number
    maxLines?: number
    textAlignment?: Gravity
}

export class Text extends View implements IText {
    @Property
    text?: string

    @Property
    textColor?: Color

    @Property
    textSize?: number

    @Property
    maxLines?: number

    @Property
    textAlignment?: Gravity
}

export enum ScaleType {
    ScaleToFill = 0,
    ScaleAspectFit,
    ScaleAspectFill,
}

export interface IImage extends IView {
    imageUrl?: string
    scaleType?: ScaleType
}

export class Image extends View implements IImage {
    @Property
    imageUrl?: string

    @Property
    scaleType?: ScaleType
}