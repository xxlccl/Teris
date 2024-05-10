import GameConfig from "./GameConfig";
import { Square } from "./Square";
import { SquareGroup } from "./SquareGroup";
import { MoveDirection, Point, Shape } from "./types";

function isPoint(obj: any): obj is Point {
    if (typeof obj.x === "undefined") {
        return false;
    } else {
        return true;
    }
}

export class TerisRules {
    static canIMove(
        shape: Shape,
        targetPoint: Point,
        exists: Square[]
    ): boolean {
        const targeSquarePoint: Point[] = shape.map((p) => ({
            x: p.x + targetPoint.x,
            y: p.y + targetPoint.y,
        }));

        let result = targeSquarePoint.some((p) => {
            return (
                p.x < 0 ||
                p.x >= GameConfig.panelSize.width ||
                p.y < 0 ||
                p.y >= GameConfig.panelSize.height
            );
        });

        if (result) {
            return false;
        }

        result = targeSquarePoint.some((p) =>
            exists.some((sq) => sq.point.x === p.x && sq.point.y === p.y)
        );

        if (result) {
            return false;
        }

        return true;
    }

    static move(
        teris: SquareGroup,
        targetPoint: Point,
        exists: Square[]
    ): boolean;
    static move(
        teris: SquareGroup,
        direciton: MoveDirection,
        exists: Square[]
    ): boolean;
    static move(
        teris: SquareGroup,
        targetPointOrDirection: Point | MoveDirection,
        exists: Square[]
    ): boolean {
        if (isPoint(targetPointOrDirection)) {
            if (this.canIMove(teris.shape, targetPointOrDirection, exists)) {
                teris.centerPoint = targetPointOrDirection;
                return true;
            } else {
                return false;
            }
        } else {
            const direciton = targetPointOrDirection;
            let targetPoint: Point;

            if (direciton === MoveDirection.down) {
                targetPoint = {
                    x: teris.centerPoint.x,
                    y: teris.centerPoint.y + 1,
                };
            } else if (direciton === MoveDirection.left) {
                targetPoint = {
                    x: teris.centerPoint.x - 1,
                    y: teris.centerPoint.y,
                };
            } else {
                targetPoint = {
                    x: teris.centerPoint.x + 1,
                    y: teris.centerPoint.y,
                };
            }
            return this.move(teris, targetPoint, exists);
        }
    }

    static moveDirectly(
        teris: SquareGroup,
        direction: MoveDirection,
        exists: Square[]
    ) {
        while (this.move(teris, direction, exists)) {}
    }

    static rotate(teris: SquareGroup, exists: Square[]): boolean {
        const newShape = teris.afterRotateShape();
        if (this.canIMove(newShape, teris.centerPoint, exists)) {
            teris.rotate();
            return true;
        } else {
            return false;
        }
    }

    /**
     * 从已存在的方块中进行消除，并返回消除的行数
     * @param exists
     */
    static deleteSquares(exists: Square[]): number {
        // 1.获取到y坐标数组
        const ys = exists.map((sq) => sq.point.y);

        // 2.获取到最大最小值
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        // 3.计数
        let count = 0;
        for (let y = minY; y <= maxY; y++) {
            if (this.deleteLine(exists, y)) {
                count++;
            }
        }

        return count;
    }

    /**
     * 消除一行
     * @param exists
     * @param y
     */
    private static deleteLine(exists: Square[], y: number): boolean {
        const squares = exists.filter((sq) => sq.point.y === y);
        console.log();

        if (squares.length === GameConfig.panelSize.width) {
            //这一行可以消除
            squares.forEach((sq) => {
                // 1.从界面中移除
                if (sq.viewer) {
                    sq.viewer.remove();
                }

                const index = exists.indexOf(sq);
                exists.splice(index, 1);
            });
            // 2.找到比当前行数低的方块向下移动一格
            exists
                .filter((sq) => {
                    return sq.point.y < y;
                })
                .forEach((sq) => {
                    sq.point = {
                        x: sq.point.x,
                        y: sq.point.y + 1,
                    };
                });

            return true;
        }
        return false;
    }
}
