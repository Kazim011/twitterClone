const db = require("./data/dbConfig");
const usersModel = require("./api/users/users-model");
const tweetsModel = require("./api/tweets/tweet-model");
const commentsModel = require("./api/commets/commets-model");
const superTest = require("supertest");
const server = require("./api/server");
const jwtDecode = require("jwt-decode");
const bcrpyt = require("bcryptjs");

test("test environment testing olarak ayarlı", () => {
  expect(process.env.NODE_ENV).toBe("testing");
});

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy();
});

describe("USERS TEST", () => {
  test("[1] users'lar geliyor mu", async () => {
    const users = await usersModel.getAll();
    expect(users).toBeDefined();
    expect(users).toHaveLength(1);
    expect(users[0]).toHaveProperty("name", "Kazım");
  });

  test("[2] eklenen user doğru formatta geliyor mu", async () => {
    const newUser = await usersModel.create({
      name: "Kazım",
      surname: "Nergiz",
      email: "kazimnergiz1234@gmail.com",
      password: "3456",
    });
    expect(newUser).toBeDefined();
    expect(newUser).toMatchObject({
      name: "Kazım",
      surname: "Nergiz",
      email: "kazimnergiz1234@gmail.com",
    });
  });

  test("[3] güncellenen user dogru formatta dönüyor mu", async () => {
    const updatedUser = await usersModel.update(1, {
      name: "Kazım Beyy",
      surname: "Nergiz",
      email: "kazimnergiz123@gmail.com",
    });
    expect(updatedUser).toMatchObject({
      name: "Kazım Beyy",
      surname: "Nergiz",
      email: "kazimnergiz123@gmail.com",
    });
  });
});

describe("TWEETS TEST", () => {
  test("[1] Tweet'ler geliyor mu", async () => {
    const tweets = await tweetsModel.getAll();
    expect(tweets).toBeDefined();
    expect(tweets).toHaveLength(1);
    expect(tweets[0]).toMatchObject({ user_id: 1, text: "merhaba dünya" });
  });

  test("[2] eklenen tweet doğru formatta geliyor mu", async () => {
    const newTweet = await tweetsModel.create({
      user_id: 1,
      text: "Yarın 18.15 sunum var iyi hazırlan",
    });
    expect(newTweet).toBeDefined();
    expect(newTweet).toMatchObject({
      user_id: 1,
      text: "Yarın 18.15 sunum var iyi hazırlan",
    });
  });

  test("[3] güncellenen tweet dogru formatta dönüyor mu", async () => {
    const updatedTweet = await tweetsModel.updateById(1, {
      user_id: 1,
      text: "merhaba dünya nasılsın",
    });
    expect(updatedTweet).toMatchObject({
      user_id: 1,
      text: "merhaba dünya nasılsın",
    });
  });
});

describe("COMMENTS TEST", () => {
  test("[1] Yorumlar'lar geliyor mu", async () => {
    const comments = await commentsModel.getAll();
    expect(comments).toBeDefined();
    expect(comments).toHaveLength(1);
    expect(comments[0]).toMatchObject({
      content: "hello word",
      user_id: 1,
      tweet_id: 1,
    });
  });

  test("[2] eklenen yorum doğru formatta geliyor mu", async () => {
    const newComments = await commentsModel.create({
      user_id: 1,
      tweet_id: 1,
      content: "Sunumun yarın kaçta kazım",
    });
    expect(newComments).toBeDefined();
    expect(newComments[0]).toMatchObject({
      user_id: 1,
      tweet_id: 1,
      content: "Sunumun yarın kaçta kazım",
    });
  });

  test("[3] güncellenen yorum dogru formatta dönüyor mu", async () => {
    const updateComment = await commentsModel.updateById(1, {
      content: "hello word , How is going today",
      user_id: 1,
      tweet_id: 1,
    });
    expect(updateComment).toMatchObject({
      content: "hello word , How is going today",
      user_id: 1,
      tweet_id: 1,
    });
  });
});

describe("Users Test GET isteği", () => {
  it("[1] Doğru Sayıda Users Geliyor mu ", async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJpYXQiOjE2NzkwNTQyMTIsImV4cCI6MTY3OTE0MDYxMn0.oo0VNSed_i-zZD2DS47mn5PpNrcxNFdJ1tpx9K0UY2s";
    const res = await superTest(server)
      .get("/api/users")
      .set("Authorization", token);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  }, 1000);

  it("[2] İstenilen id yoksa 404 hata kodu dönüyor", async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJpYXQiOjE2NzkwNTQyMTIsImV4cCI6MTY3OTE0MDYxMn0.oo0VNSed_i-zZD2DS47mn5PpNrcxNFdJ1tpx9K0UY2s";
    const res = await superTest(server)
      .get("/api/users/5")
      .set("Authorization", token);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("kullanıcı bulunamadı.");
  }, 1000);
});

describe("Tweets Test GET isteği", () => {
  it("[1] Doğru Sayıda Tweets Geliyor mu ", async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJpYXQiOjE2NzkwNTQyMTIsImV4cCI6MTY3OTE0MDYxMn0.oo0VNSed_i-zZD2DS47mn5PpNrcxNFdJ1tpx9K0UY2s";
    const res = await superTest(server)
      .get("/api/tweets")
      .set("Authorization", token);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  }, 1000);

  it("[2] İstenilen id yoksa 404 hata kodu dönüyor", async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJpYXQiOjE2NzkwNTQyMTIsImV4cCI6MTY3OTE0MDYxMn0.oo0VNSed_i-zZD2DS47mn5PpNrcxNFdJ1tpx9K0UY2s";
    const res = await superTest(server)
      .get("/api/tweets/7")
      .set("Authorization", token);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("id bulunamadı");
  }, 1000);
});

describe("Comments Test GET isteği", () => {
  it("[1] Doğru Sayıda Comments Geliyor mu ", async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJpYXQiOjE2NzkwNTQyMTIsImV4cCI6MTY3OTE0MDYxMn0.oo0VNSed_i-zZD2DS47mn5PpNrcxNFdJ1tpx9K0UY2s";
    const res = await superTest(server)
      .get("/api/comments")
      .set("Authorization", token);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  }, 1000);

  it("[2] İstenilen id yoksa 404 hata kodu dönüyor", async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJpYXQiOjE2NzkwNTQyMTIsImV4cCI6MTY3OTE0MDYxMn0.oo0VNSed_i-zZD2DS47mn5PpNrcxNFdJ1tpx9K0UY2s";
    const res = await superTest(server)
      .get("/api/comments/5")
      .set("Authorization", token);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("id bulanamadı");
  }, 1000);
});

describe("[POST] /api/auth/login", () => {
  it("[1] geçerli kriterlerde doğru mesajı döndürüyor", async () => {
    const res = await superTest(server)
      .post("/api/auth/login")
      .send({ email: "kazimnergiz123@gmail.com", password: "1234" });
    expect(res.body.message).toMatch("Welcome Kazım");
  }, 750);

  it("[2] kriterler geçersizse doğru mesaj ve durum kodu", async () => {
    let res = await superTest(server)
      .post("/api/auth/login")
      .send({ email: "kazimnergiz12345@gmail.com", password: "3423" });
    expect(res.body.message).toMatch("Geçersiz kriterler");
    expect(res.status).toBe(401);
  }, 750);
  it("[3] doğru token ve { user_id, exp, iat } ile yanıtlıyor", async () => {
    let res = await superTest(server)
      .post("/api/auth/login")
      .send({ email: "kazimnergiz123@gmail.com", password: "1234" });
    let decoded = jwtDecode(res.body.token);
    expect(decoded).toHaveProperty("iat");
    expect(decoded).toHaveProperty("exp");
    expect(decoded).toMatchObject({
      user_id: 1,
    });
    res = await superTest(server)
      .post("/api/auth/login")
      .send({ email: "kazimnergiz123@gmail.com", password: "1234" });
    decoded = jwtDecode(res.body.token);
    expect(decoded).toHaveProperty("iat");
    expect(decoded).toHaveProperty("exp");
    expect(decoded).toMatchObject({
      user_id: 1,
    });
  }, 750);
});

describe("[POST] /api/auth/register", () => {
  it("[1] veritabanına yeni kullanıcı kaydı", async () => {
    await superTest(server).post("/api/auth/register").send({
      name: "kazim",
      surname: "nergiz",
      email: "kazimnergiz1234@gmail.com",
      password: "1234",
    });
    const kazim = await db("users")
      .where({
        name: "kazim",
        surname: "nergiz",
        email: "kazimnergiz1234@gmail.com",
      })
      .first();
    expect(kazim).toMatchObject({ name: "kazim" });
  }, 750);
  it("[2] şifre düz metin yerine kriptolu bir şekilde kaydediliyor", async () => {
    await superTest(server).post("/api/auth/register").send({
      name: "kazim",
      surname: "nergiz",
      email: "kazimnergiz1234@gmail.com",
      password: "1234",
    });
    const kazim = await db("users").where("name", "kazim").first();
    expect(bcrpyt.compareSync("1234", kazim.password)).toBeTruthy();
  }, 750);

  it("[3] veritabında kayıtlı bir email ile kayıt olmaya çalısınca dogru hata dönüyor mu", async () => {
    const res = await superTest(server).post("/api/auth/register").send({
      name: "kazim",
      surname: "nergiz",
      email: "kazimnergiz123@gmail.com",
      password: "1234",
    });
    expect(res.body.message).toBe("Bu email ile kayıtlı kullanıcı var!");
  }, 750);

  it("[4] name  string girilmeyince dogru hata kodu dönüyor mu", async () => {
    const res = await superTest(server).post("/api/auth/register").send({
      name: 555,
      surname: "nergiz",
      email: "kazimnergiz1234@gmail.com",
      password: "1234",
    });
    expect(res.body.message).toBe("name veya surname string degildir");
  }, 750);

  it("[4] name  dogru formatta girilmeyince dogru hata kodu dönüyor mu", async () => {
    const res = await superTest(server).post("/api/auth/register").send({
      name: "kn",
      surname: "nergiz",
      email: "kazimnergiz1234@gmail.com",
      password: "1234",
    });
    expect(res.body.message).toBe(
      "girilen name veya surname formata uygun değildir."
    );
  }, 750);

  it("[5] surname string girilmeyince dogru hata kodu dönüyor mu", async () => {
    const res = await superTest(server).post("/api/auth/register").send({
      name: "kazim",
      surname: 666,
      email: "kazimnergiz1234@gmail.com",
      password: "1234",
    });
    expect(res.body.message).toBe("name veya surname string degildir");
  }, 750);

  it("[6] surname  dogru formatta girilmeyince dogru hata kodu dönüyor mu", async () => {
    const res = await superTest(server).post("/api/auth/register").send({
      name: "kazim",
      surname: "ne",
      email: "kazimnergiz1234@gmail.com",
      password: "1234",
    });
    expect(res.body.message).toBe(
      "girilen name veya surname formata uygun değildir."
    );
  }, 750);
});
