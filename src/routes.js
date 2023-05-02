const routes = require("express").Router();

const { Messages, ScreenTime } = require("./models");

routes.get("/messages", async (req, res) => {
  const messages = await Messages.find();

  return res.json(messages);
});

routes.post("/messages", async (req, res) => {
  try {
    const { title, body, createdBy, screenTime } = req.body;

    const messange = await Messages.create({
      title,
      body,
      createdBy,
      screenTime
    });

    return res.json(messange);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: err, message: "Internal Server Error" });
  }
});

routes.delete("/messange/:id", async (req, res) => {
  try {
    const messange = await Messages.findById(req.params.id);

    await messange.remove();

    return res.send({
      message: `Aviso \"${messange.title}\" removido com sucesso!`,
    });
  } catch (err) {
    return res
      .status(400)
      .send({ error: err, message: "Internal Server Error" });
  }
});

routes.get("/messange/:id", async (req, res) => {
  try {
    const messange = await Messages.findById(req.params.id);

    return res.json(messange);
  } catch (err) {
    return res
      .status(400)
      .send({ error: err, message: "Internal Server Error" });
  }
});

routes.put("/messange/:id", async (req, res) => {
  try {
    const messange = await Messages.findById(req.params.id);

    const { title, body, editedBy } = req.body;

    title != "" && (messange.title = title);
    body != "" && (messange.body = body);
    messange.editedAt = Date.now();
    messange.editedBy = editedBy;

    console.log(messange);

    await messange.save({
      validateBeforeSave: true
    });

    console.log(messange);

    return res.json(messange);
  } catch (err) {
    return res
      .status(400)
      .send({ error: err, message: "Internal Server Error" });
  }
});

routes.get("/screentime", async (req, res) => {
  const {time} = await ScreenTime.findById("645181b3dc27cc8e13208683");

  return res.json(time);
});

routes.post("/screentime", async (req, res) => {
  try {
    const TimeData = await ScreenTime.findById("645181b3dc27cc8e13208683");
    const { time } = req.body;

    // const data = ScreenTime.create({
    //   time: newTime
    // })
    TimeData.time = await time;

    TimeData.save({
      validateBeforeSave: true
    });

    return res.json({
      message: "Success",
      // data
      TimeData
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: err, message: "Internal Server Error" });
  }
});

module.exports = routes;
