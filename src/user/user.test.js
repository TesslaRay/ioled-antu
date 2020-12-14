const app = require('../index');
const supertest = require('supertest');
const request = supertest(app);

describe('TEST USER ROUTES', () => {
  it('Test /user/currentUser', async () => {
    const res = await request
      .get('/user/currentUser')
      .set(
        ('Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMTE3MjgyNjA2Njg3NzI5NDIwMTI3IiwiaWF0IjoxNTkzOTY5MzM0fQ.UK6CEobnlwc8c-riaQw_dapTBxm3yUXCtETnS5on41M')
      );
    expect(res.status).toBe(200);
    expect(res.body.currentUser.googleID).toBe('117282606687729420127');
  });

  it('Test /user/devices', async () => {
    const res = await request.post('/user/devices').send({
      user: '117282606687729420127',
    });
    expect(res.status).toBe(200);
  });

  // it('Test /user/saveDevice', async () => {
  //   const res = await request.post('/user/saveDevice').send({
  //     user: '117282606687729420127',
  //     deviceID: 'esp8266_test',
  //     power: 10000,
  //   });
  //   expect(res.status).toBe(200);
  // });

  // it('Test /user/deleteDevice', async () => {
  //   const res = await request.post('/user/deleteDevice').send({
  //     deviceID: 'esp8266_test',
  //   });
  //   expect(res.status).toBe(200);
  // });
});
