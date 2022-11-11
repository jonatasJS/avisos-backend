const routes = require("express").Router();

const { messages } = require("./models");

routes.get("/messages", async (req, res) => {
  const messagesResponse = await messages.find();

  return res.json(messagesResponse);
});

routes.post("/messages", async (req, res) => {
  try {
    const { title, body, createdBy } = req.body;

    const messagesResponse = await messages.create({
      title,
      body,
      createdBy,
    });

    return res.json(messagesResponse);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: err, message: "Internal Server Error" });
  }
});

routes.delete("/messange/:id", async (req, res) => {
  try {
    const messagesResponse = await messages.findById(req.params.id);

    await messagesResponse.remove();

    return res.send({
      message: `Aviso \"${messagesResponse.title}\" removido com sucesso!`,
    });
  } catch (err) {
    return res
      .status(400)
      .send({ error: err, message: "Internal Server Error" });
  }
});

routes.get("/messange/:id", async (req, res) => {
  try {
    const messagesResponse = await messages.findById(req.params.id);

    return res.json(messagesResponse);
  } catch (err) {
    return res
      .status(400)
      .send({ error: err, message: "Internal Server Error" });
  }
});

routes.put("/messange/:id", async (req, res) => {
  try {
    const messagesResponse = await messages.findById(req.params.id);

    const { title, body, editedBy } = req.body;

    console.log({
      title,
      body,
      editedBy,
      messagesResponse
    });

    title != "" && (messagesResponse.title = title);
    body != "" && (messagesResponse.body = body);
    messagesResponse.editedAt = Date.now();
    messagesResponse.editedBy = editedBy;

    console.log(messagesResponse);

    await messagesResponse.save({
      validateBeforeSave: true
    });

    console.log(messagesResponse);

    return res.json(messagesResponse);
  } catch (err) {
    return res
      .status(400)
      .send({ error: err, message: "Internal Server Error" });
  }
});

module.exports = routes;
