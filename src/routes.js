const routes = require("express").Router();

const { Messanges } = require("./models");

routes.get("/messanges", async (req, res) => {
  const messanges = await Messanges.find();

  return res.json(messanges);
});

routes.post("/messanges", async (req, res) => {
  try {
    const { title, body } = req.body;

    const messange = await Messanges.create({
      title,
      body
    });

    return res.json(messange);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

routes.delete("/messange/:id", async (req, res) => {
  try {
    const messange = await Messanges.findById(req.params.id);

    await messange.remove();

    return res.send({
      message: "Messanges removido com sucesso!"
    });
  } catch (err) {
    return res.status(400).send({ error: "Error deleting post", err });
  }
});

routes.get("/messange/:id", async (req, res) => {
  try {
    const messange = await Messanges.findById(req.params.id);

    return res.json(messange);
  } catch (err) {
    return res.status(400).send({ error: "Error deleting post" });
  }
});

module.exports = routes;
