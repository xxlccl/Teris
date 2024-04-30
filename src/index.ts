import $ from "jquery";
import { createTeris } from "./core/Teris";
import { SquarePageViewer } from "./core/viewer/SquarePageViewer";
import { TerisRules } from "./core/TerisRules";
import { MoveDirection } from "./core/type";

const teris = createTeris({ x: 2, y: 2 });
teris.squares.forEach((sq) => {
    sq.viewer = new SquarePageViewer(sq, $("#root"));
});

$(window).on("keydown", (ev) => {
    switch (ev.code) {
        case "ArrowUp":
            TerisRules.rotate(teris);
            break;
        case "ArrowDown":
            TerisRules.move(teris, MoveDirection.Down);
            break;
        case "ArrowLeft":
            TerisRules.move(teris, MoveDirection.Left);
            break;
        case "ArrowRight":
            TerisRules.move(teris, MoveDirection.Right);
            break;
    }
});

$("#rotate").on("click", () => {});
