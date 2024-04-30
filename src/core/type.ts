export interface Point {
    readonly x: number;
    readonly y: number;
}

export interface IViewer {
    /**
     * 显示
     */
    show(): void;

    /**
     * 隐藏
     */
    remove(): void;
}

export type Shape = Point[];

export enum MoveDirection {
    Left,
    Right,
    Down,
    Up,
}
