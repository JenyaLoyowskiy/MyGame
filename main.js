class Game {
    constructor(size_x = 20, size_y = 20, scale = 5, speed = 100) {
        this.width = size_x;
        this.height = size_y;
        this.speed = speed;
        this.scale = scale;
        this.container = document.querySelector('.container');
        this.warm = {
            body:[{ x: 3 , y: 0 },{ x: 2 , y: 0 },{ x: 1 , y: 0 }],
            direction: 'right',
            name:'player 1'
        };
        this.warm2 = {
            body:[{ x: size_x - 3 , y: 0 },{ x: size_x - 2 , y: 0 },{ x: size_x - 1 , y: 0 }],
            direction: 'left',
            name:'player 2'
        };
        this.players = [
            {
                playerName:'Player1',
                warmBody:[{ x: 3 , y: 0 },{ x: 2 , y: 0 },{ x: 1 , y: 0 }],
                direction: 'right',
            },{
                playerName:'Player2',
                warmBody:[{ x: size_x - 3 , y: 0 },{ x: size_x - 2 , y: 0 },{ x: size_x - 1 , y: 0 }],
                direction: 'left',
            },{
                playerName:'Player3',
                warmBody:[{ x: 3 , y: size_y - 1 },{ x: 2 , y: size_y - 1 },{ x: 1 , y: size_y - 1 }],
                direction: 'right',
            },{
                playerName:'Player4',
                warmBody:[{ x: size_x - 3 , y: size_y - 1 },{ x: size_x - 2 , y: size_y - 1 },{ x: size_x - 1 , y: size_y - 1 }],
                direction: 'left',
            }
        ];
        this.winner = {};
        this.food = [{
            x: Math.floor(Math.random()*this.width),
            y: Math.floor(Math.random()*this.height)
        }];
        this.container.style.width = `${size_x * scale * 10}px`;
        this.container.style.height = `${size_y * scale * 10}px`;
        this.drawField();
        this.checkDirection();
        this.warmStep.bind(this);
        this.isPlaying = setInterval(()=>{
            this.warmStep(this.warm, 'warm');
            this.warmStep(this.warm2, 'warm2');
        }, this.speed);
        this.spawnFood();
    }
    drawField(){
        let out = ``;
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                out += `<div class="block" data-x="${x}" data-y="${y}" style="width: ${this.scale*10}px; height: ${this.scale*10}px"></div>`
            }
        }
        this.container.innerHTML = out;
    }

    drawElement(element, element_class){
        this.clearField(element_class);
        Array.from(element).forEach((block)=>{
            if (block.x > this.width - 1) {
                block.x = 0;
            }else if (block.x < 0) {
                block.x = this.width - 1;
            } else if (block.y < 0) {
                block.y = this.height - 1;
            } else if (block.y > this.height - 1) {
                block.y = 0;
            }
            document.querySelector(`.block[data-x="${block.x}"][data-y="${block.y}"]`).classList.add(element_class);
        })
    };

    checkDirection(){
        document.addEventListener('keydown', (key)=>{
            // setTimeout(()=>{
                switch (key.keyCode) {
                    case 40: if (this.warm.direction == 'top'){break}else{this.warm.direction = 'bottom'; break}
                    case 38: if (this.warm.direction == 'bottom'){break}else{this.warm.direction = 'top'; break}
                    case 37: if (this.warm.direction == 'right'){break}else{this.warm.direction = 'left'; break}
                    case 39: if (this.warm.direction == 'left'){break}else{this.warm.direction = 'right'; break}
                    case 83: if (this.warm2.direction == 'top'){break}else{this.warm2.direction = 'bottom'; break}
                    case 87: if (this.warm2.direction == 'bottom'){break}else{this.warm2.direction = 'top'; break}
                    case 65: if (this.warm2.direction == 'right'){break}else{this.warm2.direction = 'left'; break}
                    case 68: if (this.warm2.direction == 'left'){break}else{this.warm2.direction = 'right'; break}
                }
            // },1000);
        })
    };

    warmStep(warm, className){
        let body = warm.body;
        let head = warm.body[0];
        this.drawElement(body, className);
        if (head.y == this.food[0].y && head.x == this.food[0].x) {
            body.push({x: (body[body.length - 1].x - body[body.length - 2].x) + body[body.length - 1].x, y: (body[body.length - 1].y - body[body.length - 2].y) + body[body.length - 1].y});
            console.log(body.length);
            this.clearField('food');
            this.food[0].x = Math.floor(Math.random()*20);
            this.food[0].y = Math.floor(Math.random()*20);
            this.spawnFood();
        }
        this.moveBody(head, body);
        switch (warm.direction) {
            case 'bottom': head.y++; break;
            case 'top': head.y--; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        };
    };

    clearField(element_class){
        document.querySelectorAll(`.${element_class}`).forEach((element)=>{
            element.classList.remove(element_class);
        })
    };

    moveBody(head, body){
        body.splice(body.length - 1, 1);
        body.splice(1,0,{x:head.x, y:head.y});
        if (body.filter(el => el.x == head.x && el.y == head.y).length == 3) {
            this.tryAgain();
        }
    }

    spawnFood(){
        this.foodSpanwInterval = setTimeout(()=>{
            this.drawElement(this.food, 'food');
        }, Math.floor(Math.random()*10000))
    }

    tryAgain(){
        clearInterval(this.isPlaying);
        clearTimeout(this.foodSpanwInterval);
        document.getElementById("playerName").innerHTML = `Player`;
        document.getElementById('you-lose').style.display = 'block';
    }

    newGame(){
        game = new Game(20, 30, 2);
        document.getElementById('you-lose').style.display = 'none';
    }
}

let game = new Game(20, 30, 2, 50);