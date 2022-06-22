const express = require('express')
const app = express()
const WSServer = require('express-ws')(app)
const aWss = WSServer.getWss()
const cors = require('cors')
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

let x = 50
let y = 50
app.ws('/', (ws, req) => {
    ws.on('message', (msg) => {
        msg = JSON.parse(msg)
        switch (msg.method) {
            case "connection":
                msg = {...msg, figure: {x, y}} //добавляем начальные координаты
                connectionHandler(ws, msg) //сохраняем ник клиента и оправляем сообщение о подключении с координатами
                break
            case "send_draw":
                x = msg.figure.x //запоминаем для новых пользователей
                y = msg.figure.y //
                broadcastDraw(ws, msg) //отправляем всем кроме отправителя
                break
        }
    })
})

app.listen(PORT, () => console.log(`server started on PORT ${PORT}`))

const connectionHandler = (ws, msg) => {
    ws.username = msg.username
    broadcastConnection(ws, msg)
}

const broadcastConnection = (ws, msg) => {
    aWss.clients.forEach(client => {
        if (client.username === msg.username) {
            client.send(JSON.stringify(msg))
        }
    })
}

const broadcastDraw = (ws, msg) => {
    aWss.clients.forEach(client => {
        if ((client.username !== undefined) &&
            (msg.username !== undefined) &&
            (msg.username !== client.username)) {//отправляем всем другим положение
            client.send(JSON.stringify(msg))
        }
    })
}