const request = require("supertest");
const app = require("../app");

describe("health", () => {
  it("returns API health", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
