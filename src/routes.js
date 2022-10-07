const routes = require("express").Router();

const { Messanges } = require("./models");

routes.get("/messanges", async (req, res) => {
  const messanges = await Messanges.find();

  return res.json(messanges);
});

routes.post("/messanges", async (req, res) => {
  try {
    const { title, body, createdBy } = req.body;

    const messange = await Messanges.create({
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
    const messange = await Messanges.findById(req.params.id);

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
    const messange = await Messanges.findById(req.params.id);

    return res.json(messange);
  } catch (err) {
    return res
      .status(400)
      .send({ error: err, message: "Internal Server Error" });
  }
});

routes.put("/messange/:id", async (req, res) => {
  try {
    const messange = await Messanges.findById(req.params.id);

    const { title, body, editedBy } = req.body;

    messange.title = title;
    messange.body = body;
    messange.editedAt = Date.now();
    messange.editedBy = editedBy;

    await messange.save();

    return res.json(messange);
  } catch (err) {
    return res
      .status(400)
      .send({ error: err, message: "Internal Server Error" });
  }
});

module.exports = routes;
