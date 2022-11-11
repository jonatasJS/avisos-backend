const routes = require("express").Router();

const { messages } = require("./models");

routes.get("/messages", async (req, res) => {
  const messages = await messages.find();

  return res.json(messages);
});

routes.post("/messages", async (req, res) => {
  try {
    const { title, body, createdBy } = req.body;

    const message = await messages.create({
      title,
      body,
      createdBy,
    });

    return res.json(message);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: err, message: "Internal Server Error" });
  }
});

routes.delete("/message/:id", async (req, res) => {
  try {
    const message = await messages.findById(req.params.id);

    await message.remove();

    return res.send({
      message: `Aviso \"${message.title}\" removido com sucesso!`,
    });
  } catch (err) {
    return res
      .status(400)
      .send({ error: err, message: "Internal Server Error" });
  }
});

routes.get("/message/:id", async (req, res) => {
  try {
    const message = await messages.findById(req.params.id);

    return res.json(message);
  } catch (err) {
    return res
      .status(400)
      .send({ error: err, message: "Internal Server Error" });
  }
});

routes.put("/message/:id", async (req, res) => {
  try {
    const message = await messages.findById(req.params.id);

    const { title, body, editedBy } = req.body;

    console.log({
      title,
      body,
      editedBy,
      message
    });

    title != "" && (message.title = title);
    body != "" && (message.body = body);
    message.editedAt = Date.now();
    message.editedBy = editedBy;

    console.log(message);

    await message.save({
      validateBeforeSave: true
    });

    console.log(message);

    return res.json(message);
  } catch (err) {
    return res
      .status(400)
      .send({ error: err, message: "Internal Server Error" });
  }
});

module.exports = routes;
