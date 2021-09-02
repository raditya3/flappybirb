class Background {
    img : HTMLImageElement = null;
    bgVelocity : number = 0;
    canvas : HTMLCanvasElement = null;
    posx  = 0;
    constructor(json : {
        bgVelocity : number;
        posX : number;
        canvas : HTMLCanvasElement;
    }){
        this.posx = json.posX;
        this.bgVelocity = json.bgVelocity;
        this.img = document.createElement("img");
        this.img.src = require('./assets/background-day.png')
        this.canvas=  json.canvas;
    }

    render = () => {
        if(this.img.complete){
            this.canvas.getContext("2d").drawImage(this.img,this.posx,0);
        }
    }
    update = () => {
        if(!this.img.complete) return;
        this.posx+=this.bgVelocity;
        if(this.posx+this.img.width<0){
            this.posx = this.canvas.width;
        }
    }
}


class BackgroundController {
    background : Background[] = [];
    bgWIDTH : number = 0;
    canvasWidth = 0;
    constructor(bgVelocity : number, canvas : HTMLCanvasElement){
        this.background.push(new Background({bgVelocity, posX : 0, canvas}));
        for(let i =0;i<3;i++){
            this.background.push(new Background({bgVelocity, posX : 288*this.background.length, canvas}));
        }
    }

    update = () => {
        this.background.forEach(bg => {
            bg.update();
        })
    }

    render = () => {
        this.background.forEach(bg => {
            bg.render();
        })
    }
}

export default BackgroundController;