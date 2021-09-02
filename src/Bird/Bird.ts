import Perceptron from "../NeuroEvolution/Perceptron";
import Obstacles from "../Obstacles/Obstacles";

class Bird{
    velocityY = 0;
    pos = {
        x : 20,
        y : 250,
    }
    gravity = -2;
    isDead = false;
    img : HTMLImageElement = null;
    jumpV = 0;
    jumpMutex = false;
    perceptron : Perceptron;
    fitness = 0;
    canvas : HTMLCanvasElement = null;
    constructor(json : {
        gravity : number,
        xOffset : number,
        jump : number,
        canvas : HTMLCanvasElement
    }) {
        this.gravity = json.gravity;
        this.pos.x = json.xOffset;
        this.canvas = json.canvas;
        this.jumpV = json.jump;
        this.img = document.createElement("img");
        this.img.src = require("../assets/bird.png")
    }

    setPerceptron = (perceptron : Perceptron) => {
        this.perceptron = perceptron;
    }

    isAlive = () => {
        return !this.isDead;
    }

    getFitness = () => {
        return this.fitness;
    }

    update = (obstacles : Obstacles) => {
        if(this.isDead){
            return;
        }
        if(this.pos.y<0 || this.pos.y>this.canvas.height){
            this.isDead = true;
            return;
        }
        for(var i = 0; i<obstacles.obstacleArray.length;i++){
            const pipe = obstacles.obstacleArray[i];
            if(!this.img.complete || !pipe.img.complete){
                continue;
            }
            if(pipe.alignment==="UP"){
                if(!((this.pos.x+this.img.width)<pipe.pos.x || (this.pos.x-this.img.width)>(pipe.pos.x+pipe.img.width))){
                    if(!(this.pos.y>pipe.pos.y)){
                        this.isDead = true;
                        return;
                    }
                }
            }
            if(pipe.alignment==="DOWN"){
                if(!((this.pos.x+this.img.width)<pipe.pos.x || (this.pos.x-this.img.width)>(pipe.pos.x+pipe.img.width))){
                    if(!((this.pos.y+this.img.height)<pipe.pos.y)){
                        this.isDead = true;
                        return;
                    }
                }
            }
            
            
        }

        const closestPipe = obstacles.obstacleArray.filter(pipe => {
            return pipe.pos.x+pipe.img.width > this.pos.x;
        }).sort((a,b)=>{
            return a.pos.x - b.pos.x;
        })[0];

        const evals = this.perceptron.evaluate(
            [
                this.pos.y/this.canvas.height,
                closestPipe.pos.y/this.canvas.height,
            ]
        )
        if(evals[0]>0.5){
            this.velocityY = this.jumpV;
        }
        this.pos.y+=this.velocityY;
        this.velocityY+=this.gravity;
    }

    render = () => {
        if(this.img.complete && !this.isDead ){
            this.canvas.getContext("2d").drawImage(this.img,this.pos.x,this.pos.y);
        }
    }
}

export default Bird;