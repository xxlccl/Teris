import { SquareGroup } from "./SquareGroup";

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

export enum GameStatus {
    Init,
    Playing,
    Pause,
    Over,
}

export interface GameViewer {
    /**
     * 显示下一个方块
     * @param Treis 下一个方块
     */
    showNext(Treis: SquareGroup): void;

    /**
     * 切换方块
     * @param Treis 切换的方块
     */
    switch(Treis: SquareGroup): void;
}
