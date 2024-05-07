import GameConfig from "./GameConfig";
import { Square } from "./Square";
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
}
