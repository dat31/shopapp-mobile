import axios from 'axios';

export const service = axios.create({
  baseURL: 'http://10.0.2.2:3000',
});

service.interceptors.request.use(req => {
  req.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6InJvb3QiLCJuYW1lIjoicm9vdCIsInBob25lIjpudWxsLCJhZGRyZXNzIjpudWxsLCJyb2xlIjoiQ1VTVE9NRVIifSwiaWF0IjoxNzE5NDA1MzcwLCJleHAiOjE3MTk0OTE3NzB9.RTVGNQYZV_mNkaRTUe63D_ytHEmvEx_b_aBnRX3idxY`;
  return req;
});
