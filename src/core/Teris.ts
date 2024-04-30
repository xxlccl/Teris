import { SquareGroup } from "./SquareGroup";
import { Point, Shape } from "./type";
import { getRandom } from "./utils";

class TShape extends SquareGroup {
    constructor(_centerPoint: Point, _color: string) {
        super(
            [
                { x: -1, y: 0 },
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 0, y: -1 },
            ],
            _centerPoint,
            _color
        );
    }
}

class LShape extends SquareGroup {
    constructor(_centerPoint: Point, _color: string) {
        super(
            [
                { x: -2, y: 0 },
                { x: -1, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: -1 },
            ],
            _centerPoint,
            _color
        );
    }
}

class LMirrorShape extends SquareGroup {
    constructor(_centerPoint: Point, _color: string) {
        super(
            [
                { x: 2, y: 0 },
                { x: 1, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: -1 },
            ],
            _centerPoint,
            _color
        );
    }
}

class SquareShape extends SquareGroup {
    constructor(_centerPoint: Point, _color: string) {
        super(
            [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 0, y: 1 },
                { x: 1, y: 1 },
            ],
            _centerPoint,
            _color
        );
    }

    afterRotateShape(): Shape {
        return this.shape;
    }
}

class SShape extends SquareGroup {
    constructor(_centerPoint: Point, _color: string) {
        super(
            [
                { x: -1, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: -1 },
                { x: 1, y: -1 },
            ],
            _centerPoint,
            _color
        );
    }

    rotate(): void {
        super.rotate();
        this.isClock = !this.isClock;
    }
}

class SMirrorShape extends SquareGroup {
    constructor(_centerPoint: Point, _color: string) {
        super(
            [
                { x: 1, y: 0 },
                { x: 0, y: 0 },
                { x: 0, y: -1 },
                { x: -1, y: -1 },
            ],
            _centerPoint,
            _color
        );
    }

    rotate(): void {
        this.isClock = !this.isClock;
        super.rotate();
    }
}

class LineShape extends SquareGroup {
    constructor(_centerPoint: Point, _color: string) {
        super(
            [
                { x: -1, y: 0 },
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 2, y: 0 },
            ],
            _centerPoint,
            _color
        );
    }

    rotate(): void {
        super.rotate();
        this.isClock = !this.isClock;
    }
}

export const shapes = [
    TShape,
    LShape,
    LMirrorShape,
    SquareShape,
    SShape,
    SMirrorShape,
    LineShape,
];

export const colors = [
    "red",
    "green",
    "blue",
    "yellow",
    "purple",
    "orange",
    "gray",
    "pink",
    "brown",
    "black",
    "white",
    "cyan",
    "magenta",
    "silver",
    "lime",
    "maroon",
    "navy",
    "olive",
    "teal",
];

export function createTeris(centerPoint: Point): SquareGroup {
    let index = getRandom(0, shapes.length - 1);
    const shape = shapes[index];

    index = getRandom(0, colors.length - 1);
    const color = colors[index];

    return new shape(centerPoint, color);
}
