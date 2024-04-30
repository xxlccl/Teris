import GameConfig from "./GameConfig";
import { SquareGroup } from "./SquareGroup";
import { MoveDirection, Point, Shape } from "./type";

function isPoint(obj: any): obj is Point {
    if (typeof obj.x === "undefined") {
        return false;
    } else {
        return true;
    }
}

export class TerisRules {
    static canIMove(shape: Shape, targetPoint: Point): boolean {
        const targeSquarePoint: Point[] = shape.map((p) => ({
            x: p.x + targetPoint.x,
            y: p.y + targetPoint.y,
        }));

        const result = targeSquarePoint.some((p) => {
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

        return true;
    }

    static move(teris: SquareGroup, targetPoint: Point): boolean;
    static move(teris: SquareGroup, direciton: MoveDirection): boolean;
    static move(
        teris: SquareGroup,
        targetPointOrDirection: Point | MoveDirection
    ): boolean {
        if (isPoint(targetPointOrDirection)) {
            if (this.canIMove(teris.shape, targetPointOrDirection)) {
                teris.centerPoint = targetPointOrDirection;
                return true;
            } else {
                return false;
            }
        } else {
            const direciton = targetPointOrDirection;
            let targetPoint: Point;

            if (direciton === MoveDirection.Down) {
                targetPoint = {
                    x: teris.centerPoint.x,
                    y: teris.centerPoint.y + 1,
                };
            } else if (direciton === MoveDirection.Left) {
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
            return this.move(teris, targetPoint);
        }
    }

    static moveDirectly(teris: SquareGroup, direction: MoveDirection) {
        while (this.move(teris, direction)) {}
    }

    static rotate(teris: SquareGroup): boolean {
        const newShape = teris.afterRotateShape();
        if (this.canIMove(newShape, teris.centerPoint)) {
            teris.rotate();
            return true;
        } else {
            return false;
        }
    }
}
