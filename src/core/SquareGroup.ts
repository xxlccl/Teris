import { Square } from "./Square";
import { Point, Shape } from "./type";

export class SquareGroup {
    private _squares: readonly Square[];

    public get squares() {
        return this._squares;
    }

    public get centerPoint(): Point {
        return this._centerPoint;
    }

    public get shape(): Shape {
        return this._shape;
    }

    public set shape(v: Shape) {
        this._shape = v;
        this.setShape();
    }

    public set centerPoint(v: Point) {
        this._centerPoint = v;
        this.setShape();
    }

    constructor(
        private _shape: Shape,
        private _centerPoint: Point,
        private _color: string
    ) {
        const arr: Square[] = [];

        this._shape.forEach((p) => {
            const sq = new Square();
            sq.color = this._color;
            sq.point = {
                x: this._centerPoint.x + p.x,
                y: this._centerPoint.y + p.y,
            };

            arr.push(sq);
        });

        this._squares = arr;
    }

    /**
     * 根据新的形状或者位置，更新每个方块的位置
     */
    private setShape() {
        this._shape.forEach((p, index) => {
            this._squares[index].point = {
                x: this._centerPoint.x + p.x,
                y: this._centerPoint.y + p.y,
            };
        });
    }

    protected isClock = true;

    afterRotateShape(): Shape {
        if (this.isClock) {
            return this.shape.map((s) => ({
                x: -s.y,
                y: s.x,
            }));
        } else {
            return this.shape.map((s) => ({
                x: s.y,
                y: -s.x,
            }));
        }
    }

    rotate() {
        const newS = this.afterRotateShape();
        this.shape = newS;
    }
}
