import GameConfig from "./GameConfig";
import { Square } from "./Square";
import { SquareGroup } from "./SquareGroup";
import { createTeris } from "./Teris";
import { TerisRules } from "./TerisRules";
import { GameStatus, GameViewer, MoveDirection } from "./type";

export class Game {
    // 游戏状态
    private _gameStatus = GameStatus.Init;

    // 当前方块
    private _curTeris?: SquareGroup;

    // 下一个方块
    private _nextTeris: SquareGroup = createTeris({ x: 0, y: 0 });

    //计时器
    private _timer: number = undefined;

    // 速度
    private _duration = 500;

    // 已经固定下来的方块
    private _exists: Square[] = [];

    constructor(private _viewer: GameViewer) {
        this.resetCenterPoint(GameConfig.nextSize.width, this._nextTeris);
        this._viewer.showNext(this._nextTeris);
    }

    public get gameStatus() {
        return this._gameStatus;
    }

    /**
     * 游戏开始
     */
    start() {
        if (this._gameStatus === GameStatus.Playing) return;

        this._gameStatus = GameStatus.Playing;

        if (!this._curTeris) {
            // 给当前玩家操作的方块赋值
            this.switchTeris();
            this.autoDrop();
        }
    }

    pause() {
        if (this._gameStatus === GameStatus.Playing) {
            this._gameStatus = GameStatus.Pause;
            clearInterval(this._timer);
            this._timer = undefined;
        }
    }

    play() {
        if (this._gameStatus === GameStatus.Pause) {
            this._gameStatus = GameStatus.Playing;
            this.autoDrop();
        }
    }

    /**
     * 向左移动
     */
    control_left() {
        if (this._curTeris && this.gameStatus === GameStatus.Playing) {
            TerisRules.move(this._curTeris, MoveDirection.Left, this._exists);
        }
    }

    /**
     * 向右移动
     */
    control_right() {
        if (this._curTeris && this.gameStatus === GameStatus.Playing) {
            TerisRules.move(this._curTeris, MoveDirection.Right, this._exists);
        }
    }

    /**
     * 旋转方块
     */
    control_rotate() {
        if (this._curTeris && this.gameStatus === GameStatus.Playing) {
            TerisRules.rotate(this._curTeris, this._exists);
        }
    }

    /**
     * 快速下落
     */
    control_down() {
        if (this._curTeris && this.gameStatus === GameStatus.Playing) {
            TerisRules.moveDirectly(
                this._curTeris,
                MoveDirection.Down,
                this._exists
            );
            //触底
            this.hitBottom();
        }
    }

    /**
     * 当前方块自由下落
     */
    private autoDrop() {
        if (this._timer || this._gameStatus !== GameStatus.Playing) {
            return;
        }

        this._timer = setInterval(() => {
            if (this._curTeris) {
                if (
                    !TerisRules.move(
                        this._curTeris,
                        MoveDirection.Down,
                        this._exists
                    )
                ) {
                    // 触底
                    this.hitBottom();
                }
            }
        }, this._duration);
    }

    /**
     * 切换方块
     */
    private switchTeris() {
        this._curTeris = this._nextTeris;
        this.resetCenterPoint(GameConfig.panelSize.width, this._curTeris);
        this._nextTeris = createTeris({ x: 0, y: 0 });
        this.resetCenterPoint(GameConfig.nextSize.width, this._nextTeris);
        this._viewer.switch(this._curTeris);
        this._viewer.showNext(this._nextTeris);
    }

    private resetCenterPoint(width: number, teris: SquareGroup) {
        const x = Math.ceil(width / 2 - 1);
        const y = 0;
        teris.centerPoint = { x, y };
        while (teris.squares.some((sq) => sq.point.y < 0)) {
            teris.squares.forEach((sq) => {
                sq.point = {
                    x: sq.point.x,
                    y: sq.point.y + 1,
                };
            });
        }
    }

    private hitBottom() {
        this._exists.push(...this._curTeris!.squares);
        this.switchTeris();
    }
}
