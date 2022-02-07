import { cloneDeep } from "lodash";

function sigmoid(t: number) {
  return 1 / (1 + Math.pow(Math.E, -t));
}
class Perceptron {
  layerConf: number[];
  private weights: number[][][] = [];
  private bias = 0;
  private score = 0;
  constructor(json: { layerConf: number[] }) {
    this.layerConf = json.layerConf;

    for (let layer = 1; layer < this.layerConf.length; layer++) {
      const l1 = [];
      for (let neuron = 0; neuron < this.layerConf[layer]; neuron++) {
        const l2 = [];
        for (let synapse = 0; synapse < this.layerConf[layer - 1]; synapse++) {
          l2.push(Math.random() * 2 - 1);
        }
        l1.push(l2);
      }
      this.weights.push(l1);
    }
  }

  getWeights = () => {
    return this.weights;
  };

  setWeights = (weigths: string, bias: number) => {
    this.weights = JSON.parse(weigths);
    this.bias = bias;
  };

  setScore = (score: number) => {
    this.score = score;
  };

  getScore = () => {
    return this.score;
  };

  getClone = () => {
    debugger;
    const nn = new Perceptron({ layerConf: this.layerConf });
    nn.weights = cloneDeep(this.weights);
    return nn;
  };

  calcLayer = (layer: number, input: number[]): number[] => {
    if (layer >= this.weights.length) return input;
    const layerOutput = [];
    for (let neuron = 0; neuron < this.weights[layer].length; neuron++) {
      let sm = 0;
      for (
        let synapse = 0;
        synapse < this.weights[layer][neuron].length;
        synapse++
      ) {
        sm += this.weights[layer][neuron][synapse] * input[synapse];
      }
      layerOutput.push(sigmoid(sm + this.bias));
    }
    return this.calcLayer(layer + 1, layerOutput);
  };

  evaluate = (input: number[]) => {
    if (input.length !== this.layerConf[0]) {
      throw "invalid Input size";
    }
    return this.calcLayer(0, input);
  };

  /**
   *  mutates a perceptron
   *  @Param {number} mutagen - value between 0 and 1 indicating chances of mutation per synapse
   *  @Param {number} mutationSeverity - value between 0 and 1 indicating mutation severity of synapse
   */
  mutate = (mutagen: number, mutationSeverity: number) => {
    for (let layer = 1; layer < this.weights.length; layer++) {
      for (let neuron = 0; neuron < this.weights[layer].length; neuron++) {
        for (
          let synapse = 0;
          synapse < this.weights[layer][neuron].length;
          synapse++
        ) {
          if (mutagen > Math.random()) {
            this.weights[layer][neuron][synapse] +=
              (Math.random() * 2 - 1) * mutationSeverity;
          }
        }
      }
    }
    if (mutagen > Math.random()) {
      this.bias += (Math.random() * 2 - 1) * mutationSeverity;
    }
  };

  getBias = () => {
    return this.bias;
  };
}

export default Perceptron;
