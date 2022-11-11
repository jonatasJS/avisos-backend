const routes = require("express").Router();

const { Messages } = require("./models");

routes.get("/messages", async (req, res) => {
  const messages = await Messages.find();

  return res.json(messages);
});

routes.post("/messages", async (req, res) => {
  try {
    const { title, body, createdBy } = req.body;

    const messange = await Messages.create({
      title,
      body,
      createdBy,
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

    console.log({
      title,
      body,
      editedBy,
      messange
    });

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

module.exports = routes;
