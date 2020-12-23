import React from "react";
import Sketch from "react-p5";
import P5 from "p5"; //Import this for typechecking and intellisense

interface DrawPoint {
    x: number;
    y: number;
    r: number;
    color: P5.Color;
}

interface BasicBoardProps {
    //Your component props
    pointerColor: string;
    pointerScale?: number;
    pointerSmooth?: number;
    onCanvasLoaded?: (canvas: HTMLCanvasElement) => void;
    width?: string | number;
    height?: string | number;
}

const BasicBoard: React.FC<BasicBoardProps> = ({
    pointerColor,
    onCanvasLoaded: onCanvasRef,
    pointerScale = 1,
    pointerSmooth = 1,
    width = 500,
    height = 500,
}: BasicBoardProps) => {
    const minR = 3 * pointerScale;
    const deltaR = 1.8 * pointerScale;
    const smoothSegments = pointerSmooth;

    let points: DrawPoint[] = [];

    let w: number = typeof width === "string" ? Number.parseInt(width) : width;

    let h: number = typeof height === "string" ? Number.parseInt(height) : height;

    //See annotations in JS for more information
    const setup = (p5: P5, canvasParentRef: Element) => {
        p5.createCanvas(w, h).parent(canvasParentRef);
        p5.background("transparent");
        onCanvasRef && onCanvasRef(canvasParentRef as HTMLCanvasElement);
    };

    const draw = (p5: P5) => {
        p5.background("transparent");
        // p5.ellipse(x, y, 70, 70);
        // x++;
        points.map((p) => {
            p5.fill(p.color);
            p5.ellipse(p.x, p.y, p.r);
        });
    };

    const addPoint = (p5: P5, j: number, cX: number, cY: number, baseR: number) => {
        const c = p5.color(pointerColor);
        c.setAlpha(100 * Math.max(0, 0.6 - (1 / smoothSegments) * j));

        points = [
            ...points,
            {
                x: cX,
                y: cY,
                r: baseR + j * deltaR,
                color: c,
            },
        ];

        if (points.length > 100) {
            setTimeout(() => {
                points = points.slice(2);
            }, 1200);
        }
    };

    const addSegment = (p5: P5) => {
        const [x0, y0, x1, y1] = [p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY];

        const dX = x1 - x0;
        const dY = y1 - y0;

        const d = Math.sqrt(dX * dX + dY * dY);

        const segments = d;

        p5.noStroke();

        for (let i = 0; i < segments; i++) {
            const cX = x1 - i * (dX / segments);
            const cY = y1 - i * (dY / segments);

            const n = 2 * p5.noise(cX, cY) - 1;

            const baseR = minR + deltaR * n;

            for (let j = 0; j < smoothSegments; j++) {
                addPoint(p5, j, cX, cY, baseR);
            }
        }
    };

    const mouseDragged = (p5: P5) => {
        addSegment(p5);
    };

    return <Sketch setup={setup} draw={draw} mouseDragged={mouseDragged} />;
};

export default BasicBoard;
