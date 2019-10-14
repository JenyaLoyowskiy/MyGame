class Game {
    constructor(size_x = 20, size_y = 20, scale = 5, speed = 100, players = 1) {
        this.width = size_x;
        this.height = size_y;
        this.scale = scale;
        this.speed = speed;
        this.playersCount = players;
        this.container = document.querySelector('.container');
        this.playersList = [
            {
                playerName:'Nazik',
                warmBody:[{ x: 3 , y: 0 },{ x: 2 , y: 0 },{ x: 1 , y: 0 }],
                direction: 'right',
                className:'red',
                isPlaying: true,
                speed: 50
            },{
                playerName:'Jenya',
                warmBody:[{ x: size_x - 3 , y: 0 },{ x: size_x - 2 , y: 0 },{ x: size_x - 1 , y: 0 }],
                direction: 'left',
                className:'blue',
                isPlaying: true,
                speed: 50
            },{
                playerName:'Player3',
                warmBody:[{ x: 3 , y: size_y - 1 },{ x: 2 , y: size_y - 1 },{ x: 1 , y: size_y - 1 }],
                direction: 'right',
                className:'yellow',
                isPlaying: true,
                speed: 50
            },{
                playerName:'Player4',
                warmBody:[{ x: size_x - 3 , y: size_y - 1 },{ x: size_x - 2 , y: size_y - 1 },{ x: size_x - 1 , y: size_y - 1 }],
                direction: 'left',
                className:'orange',
                isPlaying: true,
                speed: 50
            }
        ];
        this.players = [];
        for (let i = 0; i <= players - 1; i++){
            this.players.push(this.playersList[i]);
        }
        this.food = [{
            x: Math.floor(Math.random()*this.width),
            y: Math.floor(Math.random()*this.height)
        },{
            x: Math.floor(Math.random()*this.width),
            y: Math.floor(Math.random()*this.height)
        },{
            x: Math.floor(Math.random()*this.width),
            y: Math.floor(Math.random()*this.height)
        }];
        this.container.style.width = `${size_x * scale * 10}px`;
        this.container.style.height = `${size_y * scale * 10}px`;
        this.drawField();
        this.checkDirection();
        this.warmStep.bind(this);
        this._isPlaying = setInterval(()=>{
            for (let i = 0; i <= players - 1; i++) {
                    this.warmStep(this.players[i], this.players[i].className);
            }
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
                    case 40: if (this.players[0].direction == 'top'){break}else{this.players[0].direction = 'bottom'; break}
                    case 38: if (this.players[0].direction == 'bottom'){break}else{this.players[0].direction = 'top'; break}
                    case 37: if (this.players[0].direction == 'right'){break}else{this.players[0].direction = 'left'; break}
                    case 39: if (this.players[0].direction == 'left'){break}else{this.players[0].direction = 'right'; break}
                    case 83: if (this.players[1].direction == 'top'){break}else{this.players[1].direction = 'bottom'; break}
                    case 87: if (this.players[1].direction == 'bottom'){break}else{this.players[1].direction = 'top'; break}
                    case 65: if (this.players[1].direction == 'right'){break}else{this.players[1].direction = 'left'; break}
                    case 68: if (this.players[1].direction == 'left'){break}else{this.players[1].direction = 'right'; break}
                    case 53: if (this.players[2].direction == 'top'){break}else{this.players[2].direction = 'bottom'; break}
                    case 56: if (this.players[2].direction == 'bottom'){break}else{this.players[2].direction = 'top'; break}
                    case 52: if (this.players[2].direction == 'right'){break}else{this.players[2].direction = 'left'; break}
                    case 54: if (this.players[2].direction == 'left'){break}else{this.players[2].direction = 'right'; break}
                }
            // },1000);
        })
    };

    warmStep(warm, className){
        if (warm.isPlaying) {
            let body = warm.warmBody;
            let head = warm.warmBody[0];
            this.drawElement(body, className);
            this.food.forEach(el=>{
                if (el.x == head.x && el.y == head.y){
                    body.push({x: (body[body.length - 1].x - body[body.length - 2].x) + body[body.length - 1].x, y: (body[body.length - 1].y - body[body.length - 2].y) + body[body.length - 1].y});
                    warm.speed += 10;
                    el.x = Math.floor(Math.random()*this.width);
                    el.y = Math.floor(Math.random()*this.height);
                    this.spawnFood();
                }
            })
            this.moveBody(warm);
            switch (warm.direction) {
                case 'bottom': head.y++; break;
                case 'top': head.y--; break;
                case 'left': head.x--; break;
                case 'right': head.x++; break;
            }
        }
    };

    clearField(element_class){
        document.querySelectorAll(`.${element_class}`).forEach((element)=>{
            element.classList.remove(element_class);
        })
    };

    moveBody(warm){
        let head = warm.warmBody[0];
        let body = warm.warmBody;
        body.splice(body.length - 1, 1);
        body.splice(1,0,{x:head.x, y:head.y});
        if (body.filter(el => el.x == head.x && el.y == head.y).length == 3) {
            this.playersCount--;
            this.playersCount != 1 ? warm.isPlaying = false : (warm.isPlaying = false, this.tryAgain());
            console.log(this.playersCount);
        }
    }

    spawnFood(){
        // this.foodSpanwInterval = this.playersCount < 2 ? setTimeout(()=>{this.drawElement(this.food, 'food')}, Math.floor(Math.random()*10000)) : setTimeout(()=>{this.drawElement(this.food, 'food')}, 2000);
        this.foodSpanwInterval = setTimeout(()=>{this.drawElement(this.food, 'food')}, this.playersCount < 2 ? Math.floor(Math.random()*10000) : 0);
    }

    tryAgain(){
        let winner = this.players.filter(el=> el.isPlaying == true);
        clearInterval(this._isPlaying);
        winner.isPlaying = false;
        console.log(winner.isPlaying, winner);
        clearTimeout(this.foodSpanwInterval);
        document.getElementById("playerName").innerHTML = `${winner[0].playerName} wins`;
        document.getElementById('you-lose').style.display = 'flex';
    }

    newGame(){
        game = new Game(50, 40, 2, 50, 2);
        document.getElementById('you-lose').style.display = 'none';
    }
}

let game = new Game(50, 40, 2,50, 4);