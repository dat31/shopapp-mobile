import { useEffect } from 'react';
import { AppState } from 'react-native';
import Config from 'react-native-config';
import { io } from 'socket.io-client';

export default function useSocket() {
  useEffect(() => {
    const ws = io(Config.API_URL);
    ws.on('connect', () => {});
    ws.on('events', data => {});
    ws.on('disconnect', () => {});
    AppState.addEventListener('change', state => {
      if (state === 'background') {
        console.log(ws.active);
        ws.connect();
      }
    });
  }, []);
}
