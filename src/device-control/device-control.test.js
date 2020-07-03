const app = require('../index');
const supertest = require('supertest');
const {italic} = require('colors');
const request = supertest(app);

describe('TEST DEVICE CONTROL ROUTES', () => {
  it('Test /device/:id/state-history', async () => {
    const res = await request.get('/device/esp8266_7E3800/state-history');
    expect(res.status).toBe(200);
  });

  it('Test /device/:id/state', async () => {
    const res = await request.get('/device/esp8266_7E3800/state');
    expect(res.status).toBe(200);
  });

  it('Test /device/:id', async () => {
    const res = await request.put('/device/esp8266_7E3800').send({
      device: {
        deviceId: 'esp8266_7E3800',
        config: {
          duty: 0.5,
          state: true,
          timerOn: '18:30',
          timerOff: '18:29',
          timerState: true,
          timerDuty: 1,
          rampState: true,
          onTime: 1,
          offTime: 0,
        },
      },
    });

    expect(res.status).toBe(200);
  });
});
