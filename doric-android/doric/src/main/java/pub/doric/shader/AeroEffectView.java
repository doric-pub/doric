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
package pub.doric.shader;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.PorterDuff;
import android.graphics.Rect;

import androidx.annotation.NonNull;
import pub.doric.utils.DoricUtils;

/**
 * @Description: This could blur what's contained.
 * @Author: pengfei.zhou
 * @CreateDate: 2021/11/24
 */
public class AeroEffectView extends DoricLayer {
    private Rect mEffectiveRect = null;

    private Bitmap mFullBitmap = null;
    private Canvas mFullCanvas = null;
    private Bitmap mRectBitmap = null;
    private Canvas mRectCanvas = null;
    private Rect mDstRect = null;

    private Bitmap mScaledBitmap = null;
    private Canvas mScaledCanvas = null;

    public AeroEffectView(@NonNull Context context) {
        super(context);
    }

    public void setEffectiveRect(Rect rect) {
        this.mEffectiveRect = rect;
        this.mDstRect = new Rect(0, 0, rect.width(), rect.height());
        invalidate();
    }

    @Override
    protected void dispatchDraw(Canvas canvas) {
        if (mFullBitmap == null
                || mFullBitmap.getWidth() != canvas.getWidth()
                || mFullBitmap.getHeight() != canvas.getHeight()) {
            mFullBitmap = Bitmap.createBitmap(canvas.getWidth(), canvas.getHeight(), Bitmap.Config.ARGB_8888);
            mFullCanvas = new Canvas(mFullBitmap);
        }
        mFullCanvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR);
        super.dispatchDraw(mFullCanvas);
        Bitmap blurringBitmap;
        if (mEffectiveRect != null) {
            if (mRectBitmap == null
                    || mRectBitmap.getWidth() != mEffectiveRect.width()
                    || mRectBitmap.getHeight() != mEffectiveRect.height()) {
                mRectBitmap = Bitmap.createBitmap(mEffectiveRect.width(), mEffectiveRect.height(), Bitmap.Config.ARGB_8888);
                mRectCanvas = new Canvas(mRectBitmap);
            }
            blurringBitmap = mRectBitmap;
            mRectCanvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR);
            mRectCanvas.drawBitmap(mFullBitmap, mEffectiveRect, mDstRect, null);
        } else {
            blurringBitmap = mFullBitmap;
        }
        Bitmap blurredBitmap;
        int radius = 15;
        float scale = Math.max(blurringBitmap.getWidth() / 50f, blurringBitmap.getHeight() / 50f);
        int scaledWidth = (int) (blurringBitmap.getWidth() / scale);
        int scaledHeight = (int) (blurringBitmap.getHeight() / scale);
        if (mScaledBitmap == null
                || mScaledBitmap.getWidth() != scaledWidth
                || mScaledBitmap.getHeight() != scaledHeight) {
            mScaledBitmap = Bitmap.createScaledBitmap(blurringBitmap, scaledWidth, scaledHeight, true);
            mScaledCanvas = new Canvas(mScaledBitmap);
        } else {
            mScaledCanvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR);
            Matrix matrix = new Matrix();
            matrix.setScale(1 / scale, 1 / scale);
            mScaledCanvas.drawBitmap(blurringBitmap, matrix, null);
        }
        blurredBitmap = DoricUtils.blur(getContext(), mScaledBitmap, radius);
        if (mEffectiveRect != null) {
            mFullCanvas.drawBitmap(blurredBitmap,
                    new Rect(0, 0, blurredBitmap.getWidth(), blurredBitmap.getHeight()),
                    mEffectiveRect,
                    null);
        } else {
            Paint paint = new Paint();
            paint.setAntiAlias(true);
            mFullCanvas.drawBitmap(blurredBitmap,
                    new Rect(0, 0, blurredBitmap.getWidth(), blurredBitmap.getHeight()),
                    new Rect(0, 0, mFullBitmap.getWidth(), mFullBitmap.getHeight()),
                    paint);
        }
        canvas.drawBitmap(mFullBitmap, 0, 0, null);
    }
}
