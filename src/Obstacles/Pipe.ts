class Pipe {
  pos = {
    x: 0,
    y: 0,
  };
  img: HTMLImageElement = null;
  alignment: "UP" | "DOWN" = "UP";
  velocity = -1;

  canvas: HTMLCanvasElement = null;
  constructor(
    json: {
      yPos: number;
      alignment: "UP" | "DOWN";
      velocity: number;
    },
    canvas: HTMLCanvasElement
  ) {
    this.alignment = json.alignment;
    this.canvas = canvas;
    this.pos.x = this.canvas.width;
    this.pos.y = json.yPos;
    this.velocity = json.velocity;
    this.img = document.createElement("img");
    if (this.alignment === "UP") {
      this.img.src = require("../assets/pipe-flip.png");
    } else {
      this.img.src = require("../assets/pipe.png");
    }
  }

  render = () => {
    if (this.img.complete) {
      if (this.alignment === "UP")
        this.canvas
          .getContext("2d")
          .drawImage(this.img, this.pos.x, this.pos.y - this.img.height);
      else
        this.canvas
          .getContext("2d")
          .drawImage(this.img, this.pos.x, this.pos.y);
    }
  };

  update = () => {
    this.pos.x += this.velocity;
  };
}

export default Pipe;
