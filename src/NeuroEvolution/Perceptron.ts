
import cloneDeep from 'lodash/cloneDeep';
function sigmoid(t : number) {
    return 1/(1+Math.pow(Math.E, -t));
}
class Perceptron {
    layerConf : number[]
    weights : number[][][] = [];
    bias = 0;
    score = 0;
    constructor(json : {
        layerConf : number[]
    }) {
        this.layerConf = json.layerConf;

        for(let layer = 1;layer<this.layerConf.length;layer++){
            const l1 = [];
            for(let neuron = 0; neuron< this.layerConf[layer];neuron++){
                const l2 = [];
                for( let synapse = 0; synapse<this.layerConf[layer-1];synapse++){
                    l2.push(Math.random()*2-1);
                }
                l1.push(l2);
            }
            this.weights.push(l1);
        }
    }

    setWeights = (weigths : string, bias : number) => {
        this.weights = JSON.parse(weigths);
        this.bias=bias;
    }

    setScore = (score : number) => {
        this.score = score;
    }

    getScore = () => {
        return this.score;
    }

    getClone = () => {
        const nn = new Perceptron({ layerConf : this.layerConf});
        nn.weights = cloneDeep(this.weights);
        return nn;
    }

    calcLayer = (layer : number, input : number[]) : number[] => {
        if(layer>=this.weights.length) return input;

        const layerOutput = []
        for(let neuron=0;neuron<this.weights[layer].length;neuron++){
            let sm = 0;
            for(let synapse = 0; synapse < this.weights[layer][neuron].length;synapse++){
                sm += this.weights[layer][neuron][synapse]*input[synapse];
            }
            layerOutput.push(sigmoid(sm+this.bias))
        }
        return this.calcLayer(layer+1,layerOutput);
    }
    
    evaluate = (input : number[]) => {
        if(input.length!==this.layerConf[0]){
            throw "invalid Input size";
        }
        return this.calcLayer(0,input);
    }

    mutate = (mutagen : number, mutationSeverity: number) => {
        for(let layer = 1;layer<this.weights.length;layer++){
            for(let neuron = 0; neuron< this.weights[layer].length;neuron++){
                for( let synapse = 0; synapse<this.weights[layer][neuron].length;synapse++){
                    if(mutagen>Math.random()){
                        this.weights[layer][neuron][synapse] += (Math.random()*2-1)*mutationSeverity;
                    }
                }
            }
        }
        if(mutagen>Math.random()){
            this.bias += (Math.random()*2-1)*mutationSeverity;
        }
    }

}

export default Perceptron;