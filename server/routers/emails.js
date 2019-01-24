const express = require("express");
const moment = require("moment");
const populateUser = require("../middlewares/populateUser");
const db = require("../data/dbconfig.js");
const router = express.Router();

router.use(populateUser);

// Required fields: {
//    title,
//    addressee
// }
router.post("/", async (req, res) => {
  console.log("from server post", req.body);
  try {
    const { email, version } = req.body;
    email.user_id = req.user.id;
    if (email.id) {
      const { title, addressee, id } = email;
      await db("emails")
        .where({ id })
        .update({ title, addressee });
    } else {
      email.id = (await db("emails").insert(email))[0];
    }

    if (version) {
      version.email_id = email.id;
      await db("versions").insert(version);
    }

    res.json({ id: email.id });
  } catch (err) {
    res.json({ err });
    throw err;
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const count = await db("emails")
    .where({ id })
    .del();
  res.json({ count });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const email = await db("emails")
    .where({ id })
    .first();
  email.versions = await db("versions").where({ email_id: id });
  res.json({ email });
});

router.get("/", async (req, res) => {
  const emails = await db("emails")
    .leftJoin("versions", "versions.email_id", "emails.id")
    .orderBy("versions.date_created", "desc")
    .select(
      "emails.id",
      "title",
      "addressee",
      "versions.date_created as updated"
    )
    .then(emails => emails.map(processEmail));
  res.json({ emails });
});

processEmail = email => {
  const { updated } = email;
  const m = moment(updated);
  if (m.isValid()) {
    email.updated = m.calendar();
  } else {
    email.updated = "No versions.";
  }
  return email;
};

module.exports = router;
