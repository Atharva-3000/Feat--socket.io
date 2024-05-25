import { useEffect, useMemo, useState } from 'react';
import {io} from 'socket.io-client';
import { Box, Button, Container, Stack, TextField, Typography } from '@mui/material';
const App = () => {

  const socket = useMemo(()=>
    io("http://localhost:3000",{
      withCredentials:true,
    })
  ,[]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketID] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("")


  const handleSubmit=(e)=>{
    e.preventDefault();
    // console.log(message);
    socket.emit("message",{message, room});
    setMessage("");
  };

  const joinRoomHandler=(e)=>{
    e.preventDefault();
    socket.emit("join-room",roomName);
    setRoomName("");
  }
  useEffect(()=>{
    socket.on('connect',()=>{
      setSocketID(socket.id);
      console.log("Connected to the server", socket.id);
    });

    socket.on('welcome',(message)=>{
      console.log(message);
    }); 
    socket.on('receive-message',(data)=>{
      console.log(data);
      setMessages((prev)=>[...prev, data]);
    
    })
  return ()=>{
      socket.disconnect();
  }
  },[socket] );

  return (
    <Container maxWidth='sm'>
      <Box sx={{height:300}}/>
      <Typography variant='h2' align='center' component="div" gutterBottom>Welcome to a simple Socket.io Chat
      </Typography>

    <Typography variant='h6' component="div" gutterBottom>
      Room is: {socketID}
    </Typography>

    <form onSubmit={joinRoomHandler}>
<h5>Join Room</h5>
<TextField value={roomName}
      onChange={(e)=>{
        setRoomName(e.target.value);
      }} id='outlined-basic' label='Room Name' variant="outlined"/>

<Button type='submit' variant="contained" color="primary">Join</Button>
    </form>
    

    <form onSubmit={handleSubmit}>

      <TextField value={message}
      onChange={(e)=>{
        setMessage(e.target.value);
      }} id='outlined-basic' label='Message' variant="outlined"/>

<TextField value={room}
      onChange={(e)=>{
        setRoom(e.target.value);
      }} id='outlined-basic' label='Room'
      variant="outlined"/>


      <Button type='submit' variant="contained" color="primary">Send</Button>
    </form>

    <Stack>
      {messages.map((message, index)=>(
        <Typography key={index} variant='h6' component="div" gutterBottom>
          {message}
        </Typography>
      ))}
    </Stack>
    </Container>
  )
}

export default App