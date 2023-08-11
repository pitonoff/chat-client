import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000', { transports: ['websocket', 'polling', 'flashsocket'] });

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    socket.on('message', handleNewMessage);

    return () => {
      socket.off('message', handleNewMessage);
    };
  }, []);

  const handleNewMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const sendMessage = () => {
    if (message.trim() !== '' && !isSending) {
      setIsSending(true);
      socket.emit('message', { text: message });
      setMessage('');

      setTimeout(() => {
        setIsSending(false);
      }, 500);
    }
  };

  return (
    <div className="App">
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ flex: 1, textAlign: 'center', padding: '20px', background: '#f2f3f5' }}>
          <h1 style={{ color: '#3f4c67', fontSize: '24px', marginBottom: '20px' }}>Простой чат</h1>
          <div
            className="message-list"
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              marginBottom: '10px',
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className="message"
                style={{
                  padding: '10px',
                  background: msg.sender === 'user' ? '#ffffff' : '#e1f0fe',
                  borderRadius: '5px',
                  marginBottom: '5px',
                  display: 'flex',
                  flexDirection: 'column',
                  maxWidth: '70%',
                  wordWrap: 'break-word',
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            background: '#f2f3f5',
            padding: '10px',
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'space-between',
          }}
        >
          <input
            type="text"
            placeholder="Введите сообщение..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              flex: '1',
              padding: '8px',
              borderRadius: '20px',
              border: '1px solid #ccd0d5',
              outline: 'none',
              fontSize: '14px',
              marginRight: '10px',
              marginBottom: '10px',
              height: '5vh',
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              background: '#5181b8',
              color: '#ffffff',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 15px',
              fontSize: '14px',
              justifyContent: 'center',
              marginBottom: '2vh',
              cursor: 'pointer',
              transition: 'background 0.3s',
            }}
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
