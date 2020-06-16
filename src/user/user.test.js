const app = require("../index");
const supertest = require("supertest");
const request = supertest(app);

it("Test currentUser", async () => {
  const response = await request
    .post("/user/currentUser")
    .set("Content-type", "application/json")
    .send({
      user: "117282606687729420127",
    });

  // console.log(response);
});
