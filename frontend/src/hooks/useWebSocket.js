import { useEffect, useRef, useCallback } from 'react';

export function useWebSocket(userId, role, onMessage) {
  const ws = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = useRef(3000);

  const connect = useCallback(() => {
    if (!userId || !role) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/${userId}/${role}`;

    try {
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('WebSocket connected');
        reconnectAttempts.current = 0;
        reconnectDelay.current = 3000;
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          onMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current += 1;
          console.log(`Reconnecting... Attempt ${reconnectAttempts.current}/${maxReconnectAttempts}`);
          setTimeout(() => {
            connect();
          }, reconnectDelay.current);
          reconnectDelay.current = Math.min(reconnectDelay.current * 1.5, 30000);
        } else {
          console.error('Max reconnection attempts reached');
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
    }
  }, [userId, role, onMessage]);

  useEffect(() => {
    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  return ws.current;
}
