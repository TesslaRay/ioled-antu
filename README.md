# iOLED monolith

[![iOLEDBackend](https://img.shields.io/badge/iOLED-Backend-%23783578.svg)](https://www.ioled.cl/)

## Routes in API

### Auth

|  N°   | Query                 | Method  | Function                       |
| :---: | --------------------- | ------- | ------------------------------ |
|   1   | /auth/google          | **GET** | Google Authentication          |
|   2   | /auth/google/callback | **GET** | Google Authentication Callback |

### User

|  N°   | Query              | Method   | Function                                                                             |
| :---: | ------------------ | -------- | ------------------------------------------------------------------------------------ |
|   1   | /user/currentUser  | **POST** | Returns the current authenticated user                                               |
|   2   | /user/devices      | **POST** | List all the registered devices for the current user                                 |
|   3   | /user/saveDevice   | **POST** | Save a new device in the firestore database with default config for the current user |
|   4   | /user/deleteDevice | **POST** | Delete device in the firestore database                                              |

### Device

|  N°   | Query                     | Method  | Function                                         |
| :---: | ------------------------- | ------- | ------------------------------------------------ |
|   1   | /device/:id/state-history | **GET** | Get list of the last 10 state of device          |
|   2   | /device/:id/state         | **GET** | Get list of the last state of device             |
|   3   | /device/:id               | **PUT** | Update the configuration of a registered device. |





