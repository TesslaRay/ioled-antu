const app = require("../index");
const supertest = require("supertest");
const request = supertest(app);

describe("Test for user routes", () => {
  it("Test currentUser", async () => {
    const response = await request.post("/user/currentUser").send({
      user: "117282606687729420127",
    });
    // console.log(response);
  });
});
