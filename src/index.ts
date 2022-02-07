import BackgroundController from "./Background";
import Bird from "./Bird/Bird";
import NeuroEvolution from "./NeuroEvolution/NeuroEvolution";
import ObstacleController from "./Obstacles/Obstacles";

const WIDTH = 500;
const HEIGHT = 500;

//Visual elements
const canvas: HTMLCanvasElement = <HTMLCanvasElement>(
  document.getElementById("gameCanvas")
);
const iterationIndicator = <HTMLSpanElement>(
  document.getElementById("Iteration")
);
const aliveIndicator = <HTMLSpanElement>document.getElementById("Alive");
const fitnessIndicator = <HTMLSpanElement>document.getElementById("Fitness");

canvas.width = WIDTH;
canvas.height = HEIGHT;

const ITERATIONS = 100;
const FRAMERATE = 100;
const BIRD_VELOCITY = -3.5;
const OBSTACLE_GAP = 160;
const OBSTACLE_INBETWEEN_DISTANCE = 350;
const birbConf = {
  gravity: 0.3,
  xOffset: 20,
  jump: -6,
  canvas: canvas,
};

const NE_CONF = {
  perceptronConf: [2, 3, 1],
  populationSize: 300,
  survivalFraction: 0.3,
  mutagen: 0.5, //Chance of changing a weight
  mutationChance: 0.6, //Chance of mutating a Perceptron
  mutationSeverity: 0.2, //Severity of change [-1,1]
  newSpecimenRate: 0.4,
  populateWithPreExisting: true,
};

const NE = new NeuroEvolution(NE_CONF);

function delay(n: number) {
  n = n || 2000;
  return new Promise<void>((done) => {
    setTimeout(() => {
      done();
    }, n);
  });
}

async function GameBoard() {
  for (let iter = 0; iter < ITERATIONS; iter++) {
    const bgController = new BackgroundController(BIRD_VELOCITY * 0.7, canvas);
    const birbPopulation: Bird[] = [];
    NE.evolve();
    for (var i = 0; i < NE.populationSize; i++) {
      const nBrb = new Bird(birbConf);
      nBrb.setPerceptron(NE.getPerceptron(i));
      birbPopulation.push(nBrb);
    }

    let survivors = true;
    let fitness = 0;
    const obstacleController = new ObstacleController(
      OBSTACLE_INBETWEEN_DISTANCE,
      OBSTACLE_GAP,
      BIRD_VELOCITY,
      canvas
    );
    iterationIndicator.innerHTML = `Iteration : ${iter}/${ITERATIONS}`;
    while (survivors) {
      fitness++;
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      bgController.render();

      obstacleController.update();
      for (let idx1 = 0; idx1 < NE.populationSize; idx1++) {
        if (birbPopulation[idx1].isAlive()) {
          NE.setPerceptronFitness(idx1, fitness);
        }
        birbPopulation[idx1].update(obstacleController);
        birbPopulation[idx1].render();
      }
      obstacleController.render();
      bgController.update();

      survivors = false;
      for (let idx = 0; idx < birbPopulation.length; idx++) {
        if (birbPopulation[idx].isAlive()) {
          survivors = true;
          break;
        }
      }

      await delay(1000 / FRAMERATE);
      const totalAlive = birbPopulation
        .map((brb) => {
          return brb.isAlive() ? 1 : 0;
        })
        .reduce((total: any, num: any) => {
          return total + num;
        })
        .toString();
      aliveIndicator.innerHTML = `Alive : ${totalAlive}/${birbPopulation.length}`;
      fitnessIndicator.innerHTML = `fitness : ${fitness}`;
    }
  }

  NE.storeBestPerceptron();
}

GameBoard();
