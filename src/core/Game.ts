import { GameStatus, MoveDirection, GameViewer, Point } from "./types";
import { SquareGroup } from "./SquareGroup";
import { createTeris } from "./Teris";
import { TerisRules } from "./TerisRules";
import GameConfig from "./GameConfig";
import { Square } from "./Square";

export class Game {
    //游戏状态
    private _gameStatus: GameStatus = GameStatus.init;

    public get gameStatus() {
        return this._gameStatus;
    }

    //当前玩家操作的方块
    private _curTeris?: SquareGroup;
    //下一个方块
    private _nextTeris: SquareGroup;

    private _timer?: number;
    //自动下落的间隔时间
    private _duration: number;

    public get duration() {
        return this._duration;
    }

    public set duration(val: number) {
        clearInterval(this._timer);
        this._timer = undefined;
        this._duration = val;
        this.autoDrop();
    }

    //当前游戏中，已存在的小方块
    private _exists: Square[] = [];
    // 积分
    private _score: number;

    public get score() {
        return this._score;
    }
    public set score(val) {
        this._viewer.showScore(val);
        this._score = val;
        const level = GameConfig.level.filter((v) => v.score <= val).pop();
        if (level.dropSpeed === this.duration) return;
        this.duration = level.dropSpeed;
    }

    constructor(private _viewer: GameViewer) {
        this.score = 0;
        this.createNext();
        this._viewer.init(this);
    }

    private createNext() {
        this._nextTeris = createTeris({ x: 0, y: 0 });
        this.resetCenterPoint(GameConfig.nextSize.width, this._nextTeris);
        this._viewer.showNext(this._nextTeris);
    }

    private init() {
        this._exists.forEach((sq) => {
            sq.viewer?.remove();
        });
        this._exists = [];
        this._curTeris = undefined;
        this.createNext();
    }

    /**
     * 游戏开始
     */
    start() {
        //游戏状态的改变
        if (this._gameStatus === GameStatus.playing) {
            return;
        }

        if (this._gameStatus === GameStatus.over) {
            this.init();
        }

        this._viewer.onGameStart();

        this._gameStatus = GameStatus.playing;
        if (!this._curTeris) {
            //给当前玩家操作的方块赋值
            this.switchTeris();
        }
        this.autoDrop();
    }

    /**
     * 游戏暂停
     */
    pause() {
        if (this._gameStatus === GameStatus.playing) {
            this._viewer.onGamePause();
            this._gameStatus = GameStatus.pause;
            clearInterval(this._timer);
            this._timer = undefined;
        }
    }

    controlLeft() {
        if (this._curTeris && this._gameStatus === GameStatus.playing) {
            TerisRules.move(this._curTeris, MoveDirection.left, this._exists);
        }
    }

    controlRight() {
        if (this._curTeris && this._gameStatus === GameStatus.playing) {
            TerisRules.move(this._curTeris, MoveDirection.right, this._exists);
        }
    }

    controlDown() {
        if (this._curTeris && this._gameStatus === GameStatus.playing) {
            TerisRules.move(this._curTeris, MoveDirection.down, this._exists);
        }
    }

    controlFastDown() {
        if (this._curTeris && this._gameStatus === GameStatus.playing) {
            TerisRules.moveDirectly(
                this._curTeris,
                MoveDirection.down,
                this._exists
            );
            //触底
            this.hitBottom();
        }
    }

    controlRotate() {
        if (this._curTeris && this._gameStatus === GameStatus.playing) {
            TerisRules.rotate(this._curTeris, this._exists);
        }
    }

    /**
     * 当前方块自由下落
     */
    private autoDrop() {
        console.log(this._timer, this._gameStatus);
        if (this._timer || this._gameStatus !== GameStatus.playing) {
            return;
        }
        console.log("执行一次", this.duration);
        this._timer = setInterval(() => {
            if (this._curTeris) {
                if (
                    !TerisRules.move(
                        this._curTeris,
                        MoveDirection.down,
                        this._exists
                    )
                ) {
                    //触底
                    this.hitBottom();
                }
            }
        }, this.duration);
    }

    /**
     * 切换方块
     */
    private switchTeris() {
        this._curTeris = this._nextTeris;
        this.resetCenterPoint(GameConfig.panelSize.width, this._curTeris);

        // 当下一个方块生成时，可能已经无法移动
        if (
            !TerisRules.canIMove(
                this._curTeris.shape,
                this._curTeris.centerPoint,
                this._exists
            )
        ) {
            this._gameStatus = GameStatus.over;
            this._viewer.onGameOver();
            clearInterval(this._timer);
            this._timer = undefined;

            this._nextTeris.squares.forEach((sq) => {
                sq.viewer?.remove();
            });
            return;
        }

        this._nextTeris = createTeris({ x: 0, y: 0 });
        this.resetCenterPoint(GameConfig.nextSize.width, this._nextTeris);
        this._viewer.switch(this._curTeris);
        this._viewer.showNext(this._nextTeris);
    }

    /**
     * 设置中心点坐标，已达到让该方块出现在区域的中上方
     * @param width
     * @param teris
     */
    private resetCenterPoint(width: number, teris: SquareGroup) {
        const x = Math.ceil(width / 2) - 1;
        const y = 0;
        teris.centerPoint = { x, y };
        while (teris.squares.some((it) => it.point.y < 0)) {
            teris.centerPoint = {
                x: teris.centerPoint.x,
                y: teris.centerPoint.y + 1,
            };
        }
    }

    /**
     * 触底之后的操作
     */
    private hitBottom() {
        //将当前的俄罗斯方块包含的小方块，加入到已存在的方块数组中。
        this._exists = this._exists.concat(this._curTeris!.squares);
        //处理移除
        const num = TerisRules.deleteSquares(this._exists);
        // 增加积分
        this.addScore(num);
        //切换方块
        this.switchTeris();
    }

    // 加分
    private addScore(lineNum: number) {
        switch (lineNum) {
            case 1:
                this.score += 10;
                break;
            case 2:
                this.score += 30;
                break;
            case 3:
                this.score += 60;
                break;
            case 4:
                this.score += 100;
                break;
        }
    }
}
