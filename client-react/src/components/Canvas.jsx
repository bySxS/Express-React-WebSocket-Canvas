import React, {useEffect, useRef, useState} from 'react';
import "../styles/canvas.scss"
import {observer} from "mobx-react-lite";
import toolState from "../store/toolState";
import canvasState from "../store/canvasState";
import Circle from '../tools/Circle'


const Canvas = observer(() => {
    const canvasRef = useRef()
    const [mouseDown, setMouseDown] = useState(false)
    const [errorSocket, setErrorSocket] = useState(true)

    useEffect(() => {
        const id = `${(+new Date()).toString(15)}`
        canvasState.setUsername(`USER_${id}`)
    }, [])

    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:5000/`);
        canvasState.setSocket(socket)
        setErrorSocket(false)
        canvasState.socket.onclose = (event) => {

            if (event.wasClean) {
                console.log('Соединение закрыто, переподключаемся через 5сек')
            } else {
                console.log('Обрыв соединения, переподключаемся через 5сек')
            }

            setTimeout(() => {
                setErrorSocket(true)
            },10000)

        }
    }, [errorSocket])

    useEffect(() => {
        if (canvasState.socket) {
            canvasState.setCanvas(canvasRef.current)


            if (canvasState.username) {
                const ctx = canvasRef.current.getContext('2d')
                toolState.setTool(new Circle(canvasRef.current))
                toolState.setFillColor('#ff0000')
                canvasState.socket.onopen = () => {
                    if (errorSocket === false){
                    // setTimeout(() => {
                        console.log('Подключение установлено')
                        canvasState.socket.send(JSON.stringify({
                            username: canvasState.username,
                            method: "connection"
                        }))
                    }
                    // },1000)

                }
                canvasState.socket.onmessage = (event) => {
                        let msg = JSON.parse(event.data)
                        switch (msg.method) {
                            case "connection":
                                console.log(`пользователь ${msg.username} присоединился`)
                                const figure = msg.figure //начальные координаты
                                Circle.staticDraw(figure.x, figure.y, canvasRef.current.width, canvasRef.current.height, 30, ctx)
                                break
                            case "send_draw":
                                drawHandler(msg)
                                break
                            default:
                                break
                        }
                }
            }
        }

    }, [errorSocket])



    const drawHandler = (msg) => {
        const figure = msg.figure
        const ctx = canvasRef.current.getContext('2d')
        switch (figure.type) {
            case "circle":
                Circle.staticDraw(figure.x, figure.y, canvasRef.current.width, canvasRef.current.height, 30, ctx)
                break
            default:
                break
        }
    }


    const mouseDownHandler = () => {
        setMouseDown(true)
    }

    const mouseUpHandler = () => {
        setMouseDown(false)
    }

    const mouseMoveHandler = (e) => {
        if (mouseDown) {
            let currentX = e.pageX - e.target.offsetLeft
            let currentY = e.pageY - e.target.offsetTop
            const data = {
                username: canvasState.username,
                method: 'send_draw',
                figure: {type: 'circle', x: currentX, y: currentY}
            }
            canvasState.socket.send(JSON.stringify(data))
        }
    }


    return (
        <div className="canvas">
            <canvas
                onMouseDown={() => mouseDownHandler()}
                onMouseUp={() => mouseUpHandler()}
                onMouseMove={(e) => mouseMoveHandler(e)}
                ref={canvasRef}
                width={1000}
                height={500}/>
        </div>
    );
});

export default Canvas;
