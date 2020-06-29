const app = require("../index");
const supertest = require("supertest");
const request = supertest(app);

describe("Test for user routes", () => {
  it("Test currentUser", async () => {
    const res = await request.post("/user/currentUser").send({
      user: "117282606687729420127",
    });
    expect(res.status).toBe(200);
    expect(res.body.currentUser.googleID).toBe("117282606687729420127");
  });

  it("Test devices", async () => {
    const res = await request.post("/user/devices").send({
      user: "117282606687729420127",
    });
    expect(res.status).toBe(200);
  });
});
