import {
  Group,
  Panel,
  jsx,
  Color,
  layoutConfig,
  Image,
  Scroller,
  VLayout,
  Text,
  Gravity,
  createRef,
  loge,
  ViewComponent,
  HLayout,
} from "doric";
import {
  binarization,
  extractGrayValue,
  fastBlur,
  gaussianBlur,
  ostu,
  vampix,
} from "./imageUtils";
import { colors } from "./utils";

@ViewComponent
export class Label extends Text {
  constructor() {
    super();
    this.width = 100;
    this.height = 40;
    this.backgroundColor = colors[1];
    this.textColor = Color.WHITE;
    this.textSize = 20;
  }
}

@Entry
export class ImageProcessorDemo extends Panel {
  build(root: Group): void {
    const iv = createRef<Image>();
    // const imageUrl = "https://doric.pub/about/The_Parthenon_in_Athens.jpg";
    const imageUrl =
      "https://img-blog.csdn.net/20181022194542112?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MzA0NjY1Mw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70";
    //"https://doric.pub/logo.png";
    <Scroller parent={root} layoutConfig={layoutConfig().most()}>
      <VLayout
        layoutConfig={layoutConfig().mostWidth().fitHeight()}
        gravity={Gravity.Center}
      >
        <Text
          layoutConfig={layoutConfig().mostWidth().justHeight()}
          textSize={30}
          textColor={Color.WHITE}
          backgroundColor={colors[5]}
          textAlignment={Gravity.Center}
          height={50}
        >
          图片处理
        </Text>
        <Image
          ref={iv}
          layoutConfig={layoutConfig().justWidth().fitHeight()}
          width={(Environment.screenWidth / 5) * 4}
          imageUrl={imageUrl}
        />
        <VLayout
          layoutConfig={layoutConfig().mostWidth().fitHeight()}
          padding={{ left: 10, right: 10, top: 10, bottom: 10 }}
        >
          <Label
            backgroundColor={Color.RED}
            layoutConfig={layoutConfig().just()}
            onClick={async () => {
              iv.current.imageUrl = undefined;
              iv.current.imageUrl = imageUrl;
            }}
          >
            重置
          </Label>
        </VLayout>
        <VLayout
          layoutConfig={layoutConfig().mostWidth().fitHeight()}
          padding={{ left: 10, right: 10, top: 10, bottom: 10 }}
          backgroundColor={colors[3].alpha(0.1)}
          space={5}
        >
          <Text textSize={20}>简单</Text>
          <HLayout space={10}>
            <Label
              layoutConfig={layoutConfig().just()}
              onClick={async () => {
                const imageInfo = await iv.current.getImageInfo(context);
                const pixels = await iv.current.getImagePixels(context);
                const data = new Uint32Array(pixels);
                vampix(data);
                iv.current.imagePixels = {
                  width: imageInfo.width,
                  height: imageInfo.height,
                  pixels: pixels,
                };
              }}
            >
              黑白
            </Label>
            <Label
              layoutConfig={layoutConfig().just()}
              onClick={async () => {
                const imageInfo = await iv.current.getImageInfo(context);
                loge(imageInfo);
                const pixels = await iv.current.getImagePixels(context);
                loge(pixels.byteLength);
                const data = new Uint8Array(pixels);
                for (let i = 0; i < data.length - 4; i += 4) {
                  data[i + 3] = 0xff / 2;
                }
                iv.current.imagePixels = {
                  width: imageInfo.width,
                  height: imageInfo.height,
                  pixels: pixels,
                };
              }}
            >
              透明
            </Label>
          </HLayout>
        </VLayout>
        <VLayout
          layoutConfig={layoutConfig().mostWidth().fitHeight()}
          padding={{ left: 10, right: 10, top: 10, bottom: 10 }}
          backgroundColor={colors[2].alpha(0.1)}
          space={5}
        >
          <Text textSize={20}>模糊</Text>
          <HLayout space={10}>
            <Label
              layoutConfig={layoutConfig().just()}
              onClick={async () => {
                const imageInfo = await iv.current.getImageInfo(context);
                const pixels = await iv.current.getImagePixels(context);
                const data = new Uint32Array(pixels);
                fastBlur(data, imageInfo.width, imageInfo.height, 30);
                iv.current.imagePixels = {
                  width: imageInfo.width,
                  height: imageInfo.height,
                  pixels: pixels,
                };
              }}
            >
              FastBlur
            </Label>
            <Label
              layoutConfig={layoutConfig().just()}
              onClick={async () => {
                const imageInfo = await iv.current.getImageInfo(context);
                const pixels = await iv.current.getImagePixels(context);
                const data = new Uint32Array(pixels);
                gaussianBlur(data, imageInfo.width, imageInfo.height, 1);
                iv.current.imagePixels = {
                  width: imageInfo.width,
                  height: imageInfo.height,
                  pixels: pixels,
                };
              }}
            >
              高斯模糊
            </Label>
          </HLayout>
        </VLayout>
        <VLayout
          layoutConfig={layoutConfig().mostWidth().fitHeight()}
          padding={{ left: 10, right: 10, top: 10, bottom: 10 }}
          backgroundColor={colors[3].alpha(0.1)}
          space={5}
        >
          <Text textSize={20}>二值化</Text>
          <HLayout space={10}>
            <Label
              layoutConfig={layoutConfig().just()}
              onClick={async () => {
                const imageInfo = await iv.current.getImageInfo(context);
                const pixels = await iv.current.getImagePixels(context);
                const data = new Uint32Array(pixels);
                extractGrayValue(data);
                binarization(data, 127);
                iv.current.imagePixels = {
                  width: imageInfo.width,
                  height: imageInfo.height,
                  pixels: pixels,
                };
              }}
            >
              普通
            </Label>
            <Label
              layoutConfig={layoutConfig().just()}
              onClick={async () => {
                const imageInfo = await iv.current.getImageInfo(context);
                const pixels = await iv.current.getImagePixels(context);
                const data = new Uint32Array(pixels);
                extractGrayValue(data);
                const t = ostu(data);
                binarization(data, t);
                iv.current.imagePixels = {
                  width: imageInfo.width,
                  height: imageInfo.height,
                  pixels: pixels,
                };
              }}
            >
              OSTU
            </Label>
          </HLayout>
        </VLayout>
      </VLayout>
    </Scroller>;
  }
}
