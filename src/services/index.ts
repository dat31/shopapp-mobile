import axios from 'axios';

export const service = axios.create({
  baseURL: 'http://10.0.2.2:3000',
});
