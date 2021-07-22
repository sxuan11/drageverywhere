const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {cors: true})
const port = 3030;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

let obj = {}

io.on('connection', (socket) => {
  socket.on('init-position', ()=>{ // 获得之前的数据
    socket.emit('position', obj)
  });
  //---------------------------------------------------
  socket.on('drag-out', (data) => { // 移出
    const id = data.id;
    obj[id] = data;
    socket.broadcast.emit('drag-out', obj[id]);
  })
  socket.on('drag-in', (data) => { // 移入
    delete obj[data.id];
    socket.broadcast.emit('drag-in', data.id);
  })
  //-----------------------------------------------------
  socket.on('drag-move', (data) => { // 移动
    const id = data.id;
    obj[id] = data;
    socket.broadcast.emit('drag-move', obj[id]);
  })
  socket.on('drag-zoom', (data) => { // 缩放
    const id = data.id;
    obj[id] = data;
    socket.broadcast.emit('drag-zoom', obj[id])
  })
  socket.on('drag-index', (data) => { // 改变层级
    const id = data.id;
    obj[id] = data;
    socket.broadcast.emit('drag-index', obj[id])
  })
  //-----------------------------------------------------
  socket.on('change-width', (data) => { // 改变宽高
    // obj.height = data.height;
    // obj.width = data.width;
    socket.broadcast.emit('change-width', obj)
  })
})

server.listen(port, () => {
  console.log(`socket at http://localhost:${port}`)
})
