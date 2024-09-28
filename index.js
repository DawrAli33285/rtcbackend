const express=require('express')
const http=require('http')
const app=express();
const cors=require('cors')
const {Server}=require('socket.io')
app.use(express.json())
app.use(cors())
let server=http.createServer(app)
let io=new Server(server,{
    cors:{
        origin:'*',
        methods:['POST','GET']
    }
})
let users=[];
io.on('connection',(socket)=>{

    console.log(`${socket.id} has connected`)
    users=[...users,socket.id]

socket.on('startCall',()=>{
 
    let data={
        connUserId:socket.id
    }
    let otheruser=users.filter(u=>u!=socket.id)
    console.log(otheruser)
   io.to(otheruser[0]).emit('connprepare',data)
})    

socket.on('conn-init',(data)=>{
   let newdata={
    connUserId:socket.id
   }
  console.log("Conn init")
  console.log(data)
  console.log(newdata)
 io.to(data.connUserId).emit('conn-init',newdata)
})
socket.on('signal',(data)=>{

    let newdata={
        connUserId:socket.id,
        signal:data.signal
    }
io.to(data.connUserId).emit('signal',newdata)
})

socket.on('disconnect',()=>{
    console.log(`users are`)
users=users.filter(u=>u==socket.id)
console.log(users)
})

})



server.listen(5000,()=>{
    console.log("Working")
})