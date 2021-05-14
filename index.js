const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = canvas.height = 600
ctx.fillStyle = 'black'
ctx.fillRect(0, 0, canvas.width, canvas.height)

const UNIT = 20
const LEFT = 37
const UP = 38
const RIGHT = 39
const DOWN = 40
class Vector2d {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}
const currentDir = new Vector2d(1, 0)


class Snake {
    constructor() {
        this.head = new Vector2d(200, 100)
        this.body = [
            new Vector2d(180, 100),
            new Vector2d(160, 100),
        ]
        this.velocity = new Vector2d(1, 0)
    }
    draw() {
        ctx.fillStyle = 'blue'
        ctx.fillRect(this.head.x, this.head.y, UNIT, UNIT)


        ctx.fillStyle = 'white'
        for (let cube of this.body) {
            ctx.fillRect(cube.x, cube.y, UNIT, UNIT)
        }
    }

    clear() {
        ctx.fillStyle = 'black'
        ctx.fillRect(this.head.x, this.head.y, UNIT, UNIT)
        ctx.fillStyle = 'black'
        for (let cube of this.body) {
            ctx.fillRect(cube.x, cube.y, UNIT, UNIT)
        }

    }

    move() {
        this.clear()
        let tmp = new Vector2d(this.head.x, this.head.y)

        this.head.x += this.velocity.x * UNIT
        this.head.y += this.velocity.y * UNIT

        for (let i = this.body.length - 1; i >= 1; i--) {
            this.body[i].x = this.body[i - 1].x
            this.body[i].y = this.body[i - 1].y
        }

        this.body[0] = tmp
        this.draw()
    }

    grow() {

        let mountX = this.body[this.body.length - 1].x - this.body[this.body.length - 2].x
        let mountY = this.body[this.body.length - 1].y - this.body[this.body.length - 2].y

        let newCube = new Vector2d(this.body[this.body.length - 1].x + mountX, this.body[this.body.length - 1].y - this.body[this.body.length - 1].y + mountY)
        this.body.push(newCube)
        this.clear()
        this.draw()
    }
    eat() {
        if (food.pos.x === this.head.x && food.pos.y === this.head.y) {
            return true
        }
        return false
    }

}

class Food {
    constructor() {
        this.pos = new Vector2d(0, 0)
        this.color = 'green'
    }

    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.pos.x, this.pos.y, UNIT, UNIT)
    }
    clear() {
        ctx.fillStyle = 'black'
        ctx.fillRect(this.pos.x, this.pos.y, UNIT, UNIT)
    }
    getRandomNumber() {
        let result = Math.floor(Math.random() * canvas.width)
        result -= result % 20
        return result
    }
    spawn() {
        this.clear()
        this.pos.x = this.getRandomNumber()
        this.pos.y = this.getRandomNumber()
        this.draw()
    }
}

document.onkeydown = getInputKey



let player = new Snake()
player.draw()

let food = new Food()
food.spawn()


function getInputKey(e) {
    switch (e.keyCode) {
        case UP:
            if (currentDir.y === 1) break
            player.velocity.x = 0
            player.velocity.y = -1
            currentDir.x = 0
            currentDir.y = -1
            break;
        case DOWN:
            if (currentDir.y === -1) break
            player.velocity.x = 0
            player.velocity.y = 1
            currentDir.x = 0
            currentDir.y = 1
            break;
        case LEFT:
            if (currentDir.x === 1) break
            player.velocity.x = -1
            player.velocity.y = 0
            currentDir.x = -1
            currentDir.y = 0
            break;
        case RIGHT:
            if (currentDir.x === -1) break
            player.velocity.x = 1
            player.velocity.y = 0
            currentDir.x = 1
            currentDir.y = 0
            break;

    }
}


setInterval(() => {
    player.move()
    if (player.eat()) {
        player.grow()
        food.spawn()
    }
}, 200);