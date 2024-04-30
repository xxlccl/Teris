import { Square } from "../Square";
import { IViewer } from "../type";
import $ from "jquery";
import PageConfig from "./PageConfig";

/**
 * 显示一个小方块道页面上
 */
export class SquarePageViewer implements IViewer {
    private dom: JQuery<HTMLElement>;
    private isRemoved: boolean = false;

    show(): void {
        if (this.isRemoved) {
            return;
        }
        if (!this.dom) {
            this.dom = $("<div>")
                .css({
                    position: "absolute",
                    width: PageConfig.SquareSize.width,
                    height: PageConfig.SquareSize.height,
                    border: "1px solid lightgray",
                    boxSizing: "border-box",
                })
                .appendTo(this.container);
        }
        this.dom.css({
            left: this.square.point.x * PageConfig.SquareSize.width,
            top: this.square.point.y * PageConfig.SquareSize.height,
            backgroundColor: this.square.color,
        });
    }
    remove(): void {
        if (this.dom && !this.isRemoved) {
            this.dom.remove();
            this.isRemoved = true;
        }
    }

    constructor(
        private square: Square,
        private container: JQuery<HTMLElement>
    ) {}
}
