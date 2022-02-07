import Perceptron from "../src/NeuroEvolution/Perceptron";

describe("Testing Perceptron", () => {
    const inputLayer = [2,1];
    const input = [0.1,0.3];
    const weights = [[[0.6,0.2]]];
    const inputBias = 0;
    const perceptron = new Perceptron({layerConf : inputLayer});
    perceptron.setWeights(JSON.stringify(weights),inputBias);
    test("Testing evaluator",()=>{
        const output = perceptron.evaluate(input);
        expect(output[0]).toBeCloseTo(0.530,4);
    });

    test("Testing mutation",() => {
       const clonedPerceptron = perceptron.getClone();
       clonedPerceptron.mutate(0.6,0.2);
       const clonedWeights = clonedPerceptron.getWeights();
       const originalWeights = perceptron.getWeights();
       const diff = [];
        for(let i =0;i<originalWeights.length;i++) {
            for (let j = 0; j < originalWeights[i].length; j++) {
                for (let k = 0; k < originalWeights[i][j].length; k++) {
                    diff.push(Math.abs(originalWeights[i][j][k] - clonedWeights[i][j][k]));
                }
            }
        }
        for(let i=0;i<diff.length;i++){
            expect(diff[i]).toBeLessThanOrEqual(0.2);
        }
    });


})