const app = require('../index');
const supertest = require('supertest');
const request = supertest(app);

describe('TEST USER ROUTES', () => {
  it('Test /user/currentUser', async () => {
    const res = await request.post('/user/currentUser').send({
      user: '117282606687729420127',
    });
    expect(res.status).toBe(200);
    expect(res.body.currentUser.googleID).toBe('117282606687729420127');
  });

  it('Test /user/devices', async () => {
    const res = await request.post('/user/devices').send({
      user: '117282606687729420127',
    });
    expect(res.status).toBe(200);
  });

  it('Test /user/saveDevice', async () => {
    const res = await request.post('/user/saveDevice').send({
      user: '117282606687729420127',
      deviceID: 'esp8266_test',
      power: 10000,
    });
    expect(res.status).toBe(200);
  });

  it('Test /user/deleteDevice', async () => {
    const res = await request.post('/user/deleteDevice').send({
      deviceID: 'esp8266_test',
    });
    expect(res.status).toBe(200);
  });
});
