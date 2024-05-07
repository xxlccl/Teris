import { SquareGroup } from "../SquareGroup";
import { GameViewer } from "../type";
import { SquarePageViewer } from "./SquarePageViewer";
import $ from "jquery";

export class GamePageViewer implements GameViewer {
    showNext(treis: SquareGroup): void {
        treis.squares.forEach((sq) => {
            sq.viewer = new SquarePageViewer(sq, $("#next"));
        });
    }
    switch(treis: SquareGroup): void {
        treis.squares.forEach((sq) => {
            sq.viewer.remove();
            sq.viewer = new SquarePageViewer(sq, $("#panel"));
        });
    }
}
