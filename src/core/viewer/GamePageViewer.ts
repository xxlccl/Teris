import { GameStatus, GameViewer } from "../types";
import { SquareGroup } from "../SquareGroup";
import { SquarePageViewer } from "./SquarePageViewer";
import $ from "jquery";
import GameConfig from "../GameConfig";
import { Game } from "../Game";

export class GamePageViewer implements GameViewer {
    private panelDom = $("#panel");
    private nextDom = $("#next");
    private scoreDom = $("#score");
    private msgDom = $("#msg");

    init(game: Game): void {
        // 根据配置文件生成界面
        this.panelDom.css({
            width: GameConfig.panelSize.width * GameConfig.pixel + "px",
            height: GameConfig.panelSize.height * GameConfig.pixel + "px",
        });

        this.nextDom.css({
            width: GameConfig.nextSize.width * GameConfig.pixel + "px",
            height: GameConfig.nextSize.height * GameConfig.pixel + "px",
        });

        $(document).on("keydown", (ev) => {
            switch (ev.key) {
                case "ArrowUp":
                    game.controlRotate();
                    break;
                case "ArrowDown":
                    game.controlDown();
                    break;
                case "ArrowLeft":
                    game.controlLeft();
                    break;
                case "ArrowRight":
                    game.controlRight();
                    break;
                case "Escape":
                    if (game.gameStatus === GameStatus.playing) game.pause();
                    else game.start();
                    break;
                case " ":
                    if (game.gameStatus !== GameStatus.playing) {
                        game.start();
                        return;
                    }
                    game.controlFastDown();
                    break;
            }
        });
    }

    showNext(teris: SquareGroup): void {
        teris.squares.forEach((sq) => {
            sq.viewer = new SquarePageViewer(sq, $("#next"));
        });
    }

    switch(teris: SquareGroup): void {
        teris.squares.forEach((sq) => {
            sq.viewer!.remove();
            sq.viewer = new SquarePageViewer(sq, $("#panel"));
        });
    }

    showScore(val: number) {
        this.scoreDom.text(val);
    }

    onGamePause(): void {
        this.msgDom.css({ display: "flex" });
        this.msgDom.find("p").text("游戏已暂停");
    }
    onGameStart(): void {
        this.msgDom.css({ display: "none" });
    }
    onGameOver(): void {
        this.msgDom.css({ display: "flex" });
        this.msgDom.find("p").text("游戏结束");
    }
}
