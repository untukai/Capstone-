// A placeholder WebSocket signaling service.
// In a real application, this would be replaced with a robust backend service.
// This uses a public echo server which is not ideal for production but demonstrates the concept.

const SIGNALING_SERVER_URL = 'wss://socketsbay.com/wss/v2/1/demo/';

let socket: WebSocket | null = null;
let onMessageCallback: ((message: any) => void) | null = null;
let currentSessionId: string | null = null;
let peerId: string | null = null; // A unique ID for this client instance

const signalingService = {
  connect: (sessionId: string) => {
    if (socket && socket.readyState === WebSocket.OPEN && currentSessionId === sessionId) {
      console.log('Already connected to signaling service for this session.');
      return;
    }
    
    if (socket) {
        socket.close();
    }
    
    // Generate a unique ID for this peer connection to filter out echoed messages
    peerId = `peer_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`Generated Peer ID: ${peerId}`);

    currentSessionId = sessionId;
    socket = new WebSocket(SIGNALING_SERVER_URL);

    socket.onopen = () => {
      console.log(`Signaling service connected for session: ${sessionId} with peerId: ${peerId}`);
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        // **CRITICAL**: Ignore messages sent by ourselves (echoed back by the public server).
        if (message.fromPeerId === peerId) {
          return;
        }
        
        // **CRITICAL**: Filter messages to only process those for the current session.
        if (message.sessionId === currentSessionId && onMessageCallback) {
          onMessageCallback(message);
        }
      } catch (error) {
        // Ignore non-JSON messages that might be sent by other clients on the public server.
      }
    };
    
    socket.onerror = (error) => {
      console.error('Signaling service error:', error);
    };

    socket.onclose = () => {
      console.log('Signaling service disconnected.');
      if (currentSessionId === sessionId) {
        socket = null;
        currentSessionId = null;
        peerId = null;
      }
    };
  },
  
  sendMessage: (message: any) => {
    if (!message.sessionId) {
        console.error('Signaling message must include a sessionId.');
        return;
    }
    if (socket && socket.readyState === WebSocket.OPEN) {
      // **CRITICAL**: Attach the sender's peerId to every outgoing message.
      const messageWithSender = { ...message, fromPeerId: peerId };
      socket.send(JSON.stringify(messageWithSender));
    } else {
      console.error('Signaling service is not connected.');
    }
  },

  onMessage: (callback: (message: any) => void) => {
    onMessageCallback = callback;
  },
  
  getPeerId: (): string | null => {
    return peerId;
  },
  
  disconnect: () => {
    if (socket) {
      socket.close();
    }
    socket = null;
    onMessageCallback = null;
    currentSessionId = null;
    peerId = null;
  }
};

export default signalingService;