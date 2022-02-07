import Perceptron from "./Perceptron";

class NeuroEvolution {
  perceptronConf: number[] = [];
  populationSize: number = 0;
  population: Perceptron[] = [];
  mutagen: number = 0.5;
  survivalFraction: number = 1;
  mutationChance: number = 0;
  mutationSeverity: number = 0;
  populatePreExisting = false;
  newSpecimenRate = 0;
  constructor(json: {
    perceptronConf: number[];
    populationSize: number;
    survivalFraction: number;
    mutagen: number;
    mutationChance: number;
    mutationSeverity: number;
    newSpecimenRate: number;
    populateWithPreExisting?: boolean;
  }) {
    this.perceptronConf = json.perceptronConf;
    this.populationSize = json.populationSize;
    this.survivalFraction = json.survivalFraction;
    this.mutagen = json.mutagen;
    this.mutationChance = json.mutationChance;
    this.mutationSeverity = json.mutationSeverity;
    this.populatePreExisting = !!json.populateWithPreExisting;
    this.newSpecimenRate = json.newSpecimenRate;
    for (var i = 0; i < this.populationSize; i++) {
      this.population.push(new Perceptron({ layerConf: this.perceptronConf }));
      if (this.populatePreExisting && !!localStorage.getItem("weights")) {
        this.population[i].setWeights(
          localStorage.getItem("weights"),
          +localStorage.getItem("bias")
        );
      }
    }
  }

  evolve = () => {
    //Natural Selection
    this.population = this.population.sort((a, b) => {
      return b.getScore() - a.getScore();
    });
    this.population = this.population.slice(
      0,
      this.populationSize * this.survivalFraction
    );
    const repopulateNum = this.populationSize * (1 - this.survivalFraction);
    //Repopulate
    for (let i = 0; i < repopulateNum * this.newSpecimenRate; i++) {
      const specimen = this.population[i].getClone();
      if (Math.random() < this.mutationChance)
        specimen.mutate(this.mutagen, this.mutationSeverity);
      this.population.push(specimen);
    }
    for (let i = 0; i < repopulateNum * (1 - this.newSpecimenRate); i++) {
      this.population.push(new Perceptron({ layerConf: this.perceptronConf }));
    }
  };

  getPerceptron = (index: number) => {
    return this.population[index].getClone();
  };

  setPerceptronFitness = (index: number, fitness: number) => {
    this.population[index].setScore(fitness);
  };

  storeBestPerceptron = () => {
    const fittestPerceptron = this.population.sort((a, b) => {
      return b.getScore() - a.getScore();
    })[0];
    const weights = JSON.stringify(fittestPerceptron.getWeights());
    localStorage.setItem("weights", weights);
    localStorage.setItem("bias", fittestPerceptron.getBias().toString());
  };
}

export default NeuroEvolution;
