import last from "lodash/last";
import Pipe from "./Pipe";
class Obstacles {
  obstacleArray: Pipe[] = [];
  meanDistance: number = 270;
  gap = 50;
  velocity = 0;

  canvas: HTMLCanvasElement = null;
  constructor(
    meanDistance: number,
    gap: number,
    velocity: number,
    canvas: HTMLCanvasElement
  ) {
    this.gap = gap;
    this.canvas = canvas;
    this.meanDistance = meanDistance;
    this.velocity = velocity;
  }

  update = () => {
    if (
      this.obstacleArray.length === 0 ||
      this.canvas.width - last(this.obstacleArray).pos.x > this.meanDistance
    ) {
      const yPos = Math.random() * 250 + 30 + this.gap / 2;

      const np_up = new Pipe(
        {
          yPos: yPos - this.gap / 2,
          alignment: "UP",
          velocity: this.velocity,
        },
        this.canvas
      );
      const np_down = new Pipe(
        {
          yPos: yPos + this.gap / 2,
          alignment: "DOWN",
          velocity: this.velocity,
        },
        this.canvas
      );
      this.obstacleArray.push(np_up);
      this.obstacleArray.push(np_down);
    }

    this.obstacleArray = this.obstacleArray.filter((pipe) => {
      if (!pipe.img.complete) {
        return true;
      }
      return pipe.pos.x + pipe.img.width > 0;
    });

    this.obstacleArray.forEach((pipe) => {
      pipe.update();
    });
  };

  render = () => {
    this.obstacleArray.forEach((pipe) => {
      pipe.render();
    });
  };
}

export default Obstacles;
