
// const socket = io('https://snake-vein.herokuapp.com/')
const socket = io('http://localhost:5000/')

socket.emit('play')
socket.on('message', message => {
    console.log(`Message from server: ${message}`)
})


let canvas = document.getElementById("canvas")
let ctx = canvas.getContext('2d')
const UNIT = 40
const GAME_SIZE = UNIT * 15
const BACKGROUND_COLOR = 'black'
canvas.width = canvas.height = GAME_SIZE
ctx.fillStyle = BACKGROUND_COLOR
ctx.fillRect(0, 0, GAME_SIZE, GAME_SIZE)

const LEFT = 37
const UP = 38
const RIGHT = 39
const DOWN = 40
const GAME_SPEED = 100

let currentDir = RIGHT

function Coord(x, y) {
    this.x = x
    this.y = y
}


class Snake {
    constructor() {
        this.id
        this.speed = new Coord(1, 0)
        this.body = [
            new Coord(UNIT * 3, UNIT),
            new Coord(UNIT * 2, UNIT),
            new Coord(UNIT * 1, UNIT),
        ]
        this.color = 'white'
    }
    draw() {
        ctx.fillStyle = 'red'
        ctx.fillRect(this.body[0].x, this.body[0].y, UNIT + 1, UNIT + 1)

        for (let i = 1; i < this.body.length; i++) {
            ctx.fillStyle = 'blue'
            ctx.fillRect(this.body[i].x, this.body[i].y, UNIT + 1, UNIT + 1)
            ctx.fillStyle = this.color
            ctx.fillRect(this.body[i].x, this.body[i].y, UNIT, UNIT)
        }
    }

    clear() {
        ctx.fillStyle = BACKGROUND_COLOR
        for (let i = 0; i < this.body.length; i++) {
            ctx.fillRect(this.body[i].x, this.body[i].y, UNIT + 3, UNIT)
        }
    }

    handleBound() {
        if (this.body[0].x > GAME_SIZE - UNIT) {
            this.body[0].x = 0
        }

        if (this.body[0].x < 0) {
            this.body[0].x = GAME_SIZE - UNIT
        }

        if (this.body[0].y > GAME_SIZE - UNIT) {
            this.body[0].y = 0
        }

        if (this.body[0].y < 0) {
            this.body[0].y = GAME_SIZE - UNIT

        }
    }

    handleEatSelf() {
        for (let i = 1; i < this.body.length; i++) {
            if (this.body[0].x === this.body[i].x && this.body[0].y === this.body[i].y) {
                this.body.splice(i, this.body.length - i)
            }
        }
    }

    move() {
        this.clear()
        for (let i = this.body.length - 1; i >= 1; i--) {
            this.body[i].x = this.body[i - 1].x
            this.body[i].y = this.body[i - 1].y
        }
        this.body[0].x += this.speed.x * UNIT
        this.body[0].y += this.speed.y * UNIT

        this.handleBound()
        this.handleEatSelf()

        this.draw()
    }

    grow() {
        this.clear()
        let mountX = this.body[this.body.length - 1].x - this.body[this.body.length - 2].x
        let mountY = this.body[this.body.length - 1].y - this.body[this.body.length - 2].y
        let newPart = new Coord(this.body[this.body.length - 1].x + mountX, this.body[this.body.length - 1].y + mountY)
        this.body.push(newPart)
        this.draw()

    }

    eat(food) {
        return this.body[0].x === food.x && this.body[0].y === food.y
    }
}

class Food {
    constructor() {
        this.x = 0
        this.y = 0
        this.color = 'green'
    }

    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, UNIT, UNIT)
    }

    clear() {
        ctx.fillStyle = BACKGROUND_COLOR
        ctx.fillRect(this.x, this.y, UNIT, UNIT)
    }

    getRandomNumber() {
        let randomNumber = Math.floor(Math.random() * GAME_SIZE)
        randomNumber -= randomNumber % UNIT
        return randomNumber
    }

    spawn(snakeBody) {
        this.clear()
        const checkCollision = () => {
            for (let part of snakeBody) {
                if (part.x === this.x && part.y === this.y) {
                    return true
                }
            }
            return false
        }
        this.x = this.getRandomNumber()
        this.y = this.getRandomNumber()
        while (checkCollision()) {
            this.x = this.getRandomNumber()
            this.y = this.getRandomNumber()
        }

        this.draw()
    }
}


let player = new Snake()

player.draw()

let food = new Food()
food.spawn(player.body)

function handleGame() {

    player.move()
    if (player.eat(food)) {
        player.grow()
        food.spawn(player.body)
    }

}
let game = setInterval(handleGame, GAME_SPEED)
clearInterval(game)

socket.on('start', (id) => {
    player.id = id
    setInterval(handleGame, GAME_SPEED)
    document.onkeydown = getInputKey
    alert(player.id)
})


socket.on('new player', (id) => {
    let newPlayer = new Snake()
    newPlayer.id = id
})



function getInputKey(e) {
    let moveCoord;
    switch (e.keyCode) {
        case UP:
            if (currentDir === DOWN) break
            moveCoord = new Coord(0, -1)
            currentDir = UP
            break;
        case DOWN:
            if (currentDir === UP) break
            moveCoord = new Coord(0, 1)
            currentDir = DOWN
            break;
        case LEFT:
            if (currentDir === RIGHT) break

            moveCoord = new Coord(-1, 0)
            currentDir = LEFT
            break;
        case RIGHT:
            if (currentDir === LEFT) break

            moveCoord = new Coord(1, 0)
            currentDir = RIGHT
            break;
    }
    socket.emit('move', { moveCoord: moveCoord ? moveCoord : player.speed, id: player.id })
}

socket.on('move', ({ moveCoord, id }) => {
    console.log(player.id)
    if (player.id === id)
        player.speed = moveCoord
})




