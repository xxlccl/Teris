import $ from "jquery";
import { Game } from "./core/Game";
import { GamePageViewer } from "./core/viewer/GamePageViewer";

const g = new Game(new GamePageViewer());
g.start();

$("#pause").click(() => {
    g.pause();
});

$("#play").click(() => {
    g.play();
});

$(window).on("keydown", (ev) => {
    switch (ev.key) {
        case "ArrowUp":
            g.control_rotate();
            break;
        case "ArrowDown":
            g.control_down();
            break;
        case "ArrowLeft":
            g.control_left();
            break;
        case "ArrowRight":
            g.control_right();
            break;
        case "Escape":
            g.pause();
            break;
        case " ":
            g.play();
            break;
    }
});
