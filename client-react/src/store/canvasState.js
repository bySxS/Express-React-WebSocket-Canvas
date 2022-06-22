import {makeAutoObservable} from "mobx";


class CanvasState {
    canvas = null
    socket = null
    sessionId = null
    username = ""

    constructor() {
        makeAutoObservable(this)
    }

    setSessionId(id) {
        this.sessionId = id
    }
    setSocket(socket) {
        this.socket = socket
    }

    setUsername(username) {
        this.username = username
    }

    setCanvas(canvas) {
        this.canvas = canvas
    }

}

export default new CanvasState()
