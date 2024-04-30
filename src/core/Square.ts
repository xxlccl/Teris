import { IViewer, Point } from "./type";

/**
 * 小方块
 */
export class Square {
    private _point: Point = {
        x: 0,
        y: 0,
    };

    private _color: string = "";

    // 属性：显示者
    private _viewer?: IViewer;

    public get viewer() {
        return this._viewer;
    }

    public set viewer(v) {
        this._viewer = v;
        if (v) {
            v.show();
        }
    }

    public get point(): Point {
        return this._point;
    }

    public set point(value: Point) {
        this._point = value;
        // 设置新的位置后显示
        if (this._viewer) {
            this._viewer.show();
        }
    }

    public get color(): string {
        return this._color;
    }

    public set color(color: string) {
        this._color = color;
    }
}
