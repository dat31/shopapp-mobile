import axios from 'axios';

export const service = axios.create({
  baseURL: 'http://10.0.2.2:3000',
});

service.interceptors.request.use(req => {
  req.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6InJvb3QiLCJuYW1lIjoicm9vdCIsInBob25lIjpudWxsLCJhZGRyZXNzIjpudWxsLCJwYXNzd29yZCI6IiQyYiQxMCRGMmZRcldjZUI0TmNuYzJoeEViaUlPdldoTmJvcnNQNnNBdWxRa0JhRmpWcUFNOHo2ODRjLiIsInJvbGUiOiJDVVNUT01FUiJ9LCJpYXQiOjE3MTkxNTE4MjAsImV4cCI6MTcxOTIzODIyMH0.45G_ze4eMgzwXL2KQFO6TLw9V-J4rrAX3wzJKazdze8`;
  return req;
});
