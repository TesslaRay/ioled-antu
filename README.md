# iOLED monolith

[![iOLEDBackend](https://img.shields.io/badge/iOLED-Backend-%23783578.svg)](https://www.ioled.cl/)

## Routes in API

### Auth

| N°  | Query                 | Method  | Response                       |
| :-: | --------------------- | ------- | ------------------------------ |
|  1  | /auth/google          | **GET** | Google Authentication          |
|  2  | /auth/google/callback | **GET** | Google Authentication Callback |

### User

| N°  | Query             | Method  | Response                                             | Only available to admin |
| :-: | ----------------- | ------- | ---------------------------------------------------- | ----------------------- |
|  1  | /user/currentUser | **GET** | Returns the current authenticated user               | No                      |
|  2  | /user/devices     | **GET** | List all the registered devices for the current user | No                      |

### Device Control

| N°  | Query              | Method   | Response                 | Only available to admin |
| :-: | ------------------ | -------- | ------------------------ | ----------------------- |
|  1  | /device/saveDevice | **POST** | Save device in Firestore | NO                      |
