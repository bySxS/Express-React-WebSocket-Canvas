import Tool from "./Tool";


export default class Circle extends Tool {
    constructor(canvas) {
        super(canvas)
        this.r = 30
        this.listen()
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    }

    mouseDownHandler() {
        this.mouseDown = true
    }

    mouseUpHandler() {
        this.mouseDown = false
    }

    mouseMoveHandler(e) {
        if(this.mouseDown) {

            this.startX = e.pageX-e.target.offsetLeft
            this.startY = e.pageY-e.target.offsetTop

            this.draw(this.startX, this.startY)
        }
    }

    draw(x,y) {
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.arc(x, y, this.r, 0, 2*Math.PI)
            this.ctx.fill()
            this.ctx.stroke()
    }

    static staticDraw(x, y, w, h,  r, ctx) {
        ctx.beginPath()
        ctx.clearRect(0,0, w, h)//очищаем
        ctx.arc(x, y, r, 0, 2*Math.PI)
        ctx.fill()
        ctx.stroke()
    }

}

