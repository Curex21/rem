function drawLine(x0, y0, x1, y1, color, emit) {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.stroke();
    context.closePath();

    if (!emit) {
        return;
    }
    var w = canvas.width;
    var h = canvas.height;

    socket.emit("drawing", {
        x0: x0 / w,
        y0: y0 / h,
        x1: x1 / w,
        y1: y1 / h,
        color: color,
    });
}


let globalRemUserID;
            let drawingContext = {};

            window.onload = () => {
                const remUserID = localStorage.getItem("remUserID");
                if (remUserID && remUserID !== "") globalRemUserID = remUserID;

                const ioInstance = io({
                    query: {
                        remID: remUserID,
                    },
                });

                ioInstance.on("register", (data) => {
                    console.log("register", data);
                    if (globalRemUserID && globalRemUserID !== "") return;
                    localStorage.setItem("remUserID", data.remID);
                    // localStorage.setItem("remUserColor", data.color)
                    globalRemUserID = data.remID;
                });

                // ioInstance.emit("indentify", {})

                var selectCanvas = document.getElementById("canvas-board");
                // var isDown = false;
                var context = selectCanvas.getContext("2d");
                var canvasX, canvasY;
                context.lineWidth = 2;

                // var brushPalette = document.getElementById("brushPalette");
                // selectCanvas.console.log(selectCanvas);

                if (selectCanvas) {
                    const start = (e) => {
                        console.log("start event");
                        isDown = true;
                        // [draw start cmd]
                        ioInstance.emit("drawing", { user: globalRemUserID, event: "start" });

                        // context.beginPath();
                        canvasX = e.pageX - selectCanvas.offsetLeft;
                        canvasY = e.pageY - selectCanvas.offsetTop;
                        // context.moveTo(canvasX, canvasY);

                        // [canvasX0, canvasY0]
                        ioInstance.emit("drawing", {
                            user: globalRemUserID,
                            event: "draw",
                            payload: { x: canvasX, y: canvasY },
                        });

                        // "string template js"
                    };
                    const draw = (e) => {
                        console.log("draw event");
                        if (isDown) {
                            canvasX = e.pageX - selectCanvas.offsetLeft;
                            canvasY = e.pageY - selectCanvas.offsetTop;
                            // context.lineTo(canvasX, canvasY);
                            // context.strokeStyle = selectedColor;
                            // context.stroke();
                            // [canvasX1, canvasY1, canvasX2, canvasY2, ...]
                            ioInstance.emit("drawing", {
                                user: globalRemUserID,
                                event: "draw",
                                payload: { x: canvasX, y: canvasY },
                            });
                        }
                    };
                    const stop = (e) => {
                        console.log("stop event");
                        // isDown = false;
                        // context.closePath();
                        // [draw end cmd]
                        ioInstance.emit("drawing", {
                            user: globalRemUserID,
                            event: "stop",
                        });
                    };

                    selectCanvas.addEventListener("mousedown", start, false);
                    selectCanvas.addEventListener("mouseup", stop, false);
                    selectCanvas.addEventListener("mousemove", draw, false);
                    // brushPalette.addEventListener(
                    //     "click",
                    //     function (e) {
                    //         changeStroke(e, this);
                    //     },
                    //     false
                    // );

                    // function changeStroke(e, obj) {
                    //     if (e.target.dataset.stroke) {
                    //         var parent = e.target.parentElement.children;
                    //         for (var i in parent) {
                    //             if (parent.hasOwnProperty(i)) {
                    //                 if (e.target.className === parent[i].className) {
                    //                     e.target.style.border = "2px dotted";
                    //                 } else {
                    //                     parent[i].style.border = "none";
                    //                 }
                    //             }
                    //         }
                    //         context.lineWidth = e.target.dataset.stroke;
                    //     }
                    // }

                    //ioInstance.on("drawing", function (data) {
                    //  context.lineTo(data[1], data[2]);
                    // context.strokeStyle = selectedColor;
                    // context.stroke();

                    //})

                    // ioInstance.on("start", (data) => {
                    //     const id = localStorage.getItem("remUserID");
                    //     if (id) {
                    //         ioInstance.emit("identify", {
                    //             id: id,
                    //         });
                    //     }
                    // });

                    ioInstance.on("to-draw", (data) => {
                        // console.log(data);
                        // if (data.event === "start") {
                        //     isDown = true;
                        // }
                        // if (data.event === "draw") {
                        //     if (isDown) {
                        //         canvasX = data.payload.x;
                        //         canvasY = data.payload.y;
                        //         context.lineTo(canvasX, canvasY);
                        //         context.strokeStyle = data.color;
                        //         context.stroke();
                        //     }
                        // }
                        // if (data.event === "stop") {
                        //     isDown = false;
                        //     context.closePath();
                        // }
                    });
                }
            };