const BACKGROUND_COLOR = 'black'
const SNAKE_COLOR = 'white'
const UNIT = 20
const LEFT = 37
const UP = 38
const RIGHT = 39
const DOWN = 40
const SPACE = 32
const canvas = document.getElementById('canvas')
let currentDir = LEFT
canvas.width = canvas.height = 600
ctx = canvas.getContext('2d')
ctx.fillStyle = BACKGROUND_COLOR
ctx.fillRect(0, 0, canvas.width, canvas.height)


class Snake {
    constructor() {
        this.currentLength = 3
        this.body = [
            new Coord(260, 300),
            new Coord(280, 300),
            new Coord(300, 300)
        ]

        this.speed = new Coord(-1, 0)
    }

    draw() {

        let [head, ..._body] = this.body

        ctx.fillStyle = 'blue'
        ctx.fillRect(head.x, head.y, UNIT, UNIT)

        ctx.fillStyle = SNAKE_COLOR
        for (let pos of _body) {
            ctx.fillRect(pos.x, pos.y, UNIT, UNIT)
        }
    }


    clear() {
        ctx.fillStyle = BACKGROUND_COLOR
        for (let pos of this.body) {
            ctx.fillRect(pos.x, pos.y, UNIT, UNIT)
        }
    }



    move() {
        this.clear()

        let oldHead = { ...this.body[0] }
        this.body[0].x += this.speed.x * UNIT
        this.body[0].y += this.speed.y * UNIT


        for (let i = this.body.length - 1; i >= 2; i--) {
            this.body[i] = this.body[i - 1]
        }

        this.body[1] = oldHead


        this.draw()
    }


    death() {
        if (this.body[0].x < 0 || this.body[0].x > 600 - UNIT) {
            return true
        }


        if (this.body[0].y < 0 || this.body[0].y > 600 - UNIT) {
            return true
        }

        let headX = this.body[0].x
        let headY = this.body[0].y

        for (let i = 1; i < this.currentLength; i++) {
            if (headX === this.body[i].x && headY === this.body[i].y) {
                return true
            }
        }


        return false
    }

    grow() {
        this.clear()
        let newPartXMount = this.body[this.currentLength - 1].x - this.body[this.currentLength - 2].x
        let newPartYMount = this.body[this.currentLength - 1].y - this.body[this.currentLength - 2].y

        let newPart = new Coord(this.body[this.currentLength - 1].x + newPartXMount, this.body[this.currentLength - 1].y + newPartYMount)
        this.body.push(newPart)
        this.currentLength++
        this.draw()
    }
}

class Food {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    draw() {
        ctx.fillStyle = 'green'
        ctx.fillRect(this.x, this.y, UNIT, UNIT)
    }

    delete() {
        ctx.fillStyle = BACKGROUND_COLOR
        ctx.fillRect(this.x, this.y, UNIT, UNIT)
    }




    spawn() {
        this.delete()
        this.x = Math.floor(Math.random() * 600)
        this.y = Math.floor(Math.random() * 600)
        if (this.x % 20 !== 0) {
            this.x -= this.x % 20
        }

        if (this.y % 20 !== 0) {
            this.y -= this.y % 20
        }
        this.draw()



    }


}

function Coord(x, y) {
    this.x = x
    this.y = y
}



function drawGrid() {
    ctx.fillStyle = "gray"
    for (let i = UNIT; i <= 600; i += UNIT) {
        ctx.fillRect(i, 0, 1, 600)
    }

    for (let i = UNIT; i <= 600; i += UNIT) {
        ctx.fillRect(0, i, 600, 1)
    }



}


function showLose() {
    ctx.fillStyle = "blue"

    let u = [[4, 4], [4, 5], [4, 6], [5, 6], [6, 4], [6, 5], [6, 6]]

    let l = [[8, 4], [8, 5], [8, 6], [9, 6]]

    let o = [[11, 4], [11, 5], [11, 6], [13, 4], [13, 5], [13, 6], [12, 4], [12, 6]]

    for (let pos of u) {
        ctx.fillRect(pos[0] * 20, pos[1] * 20, UNIT, UNIT)
    }

    for (let pos of l) {
        ctx.fillRect(pos[0] * 20, pos[1] * 20, UNIT, UNIT)
    }

    for (let pos of o) {
        ctx.fillRect(pos[0] * 20, pos[1] * 20, UNIT, UNIT)
    }
}



document.onkeydown = getInputKey



drawGrid()
let player = new Snake()
let food = new Food(0, 0)
food.spawn()

console.log(food.x)
console.log(food.y)
player.draw()


function play() {
    let game = setInterval(() => {
        player.move()
        if (player.death()) {
            console.log(player.body[0].x)
            clearInterval(game)
            player.clear()
            food.delete()
            drawGrid()
            showLose()
        }

        if (player.body[0].x === food.x && player.body[0].y === food.y) {
            player.grow()
            food.spawn()
        }


    }, 200)

}


play()



function getInputKey(e) {
    console.log(e.keyCode)
    switch (e.keyCode) {
        case UP:
            if (currentDir === DOWN) break
            player.speed.x = 0
            player.speed.y = -1
            currentDir = UP
            break;
        case RIGHT:
            if (currentDir === LEFT) break
            player.speed.x = 1
            player.speed.y = 0
            currentDir = RIGHT
            break;
        case DOWN:
            if (currentDir === UP) break
            player.speed.x = 0
            player.speed.y = 1
            currentDir = DOWN
            break;
        case LEFT:
            if (currentDir === RIGHT) break
            player.speed.x = -1
            player.speed.y = 0
            currentDir = LEFT
            break;

        case SPACE:
            console.log('ghaha')
            break;


    }
}






