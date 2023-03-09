import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { validate } from "deep-email-validator";
const app = express();
const port = 3333;

app.get("/", (req, res) => {
  return res
    .status(200)
    .json({ success: true, message: "Welcome on Mailtester API" });
});

app.get("/one-mail/:email", async (req, res) => {
  const email = req.params.email;
  console.log("Check", email, " in progress...")
  let checkAll = await validate({
    email: email,
    sender: email,
    validateRegex: true,
    validateMx: true,
    validateTypo: false,
    validateDisposable: true,
    validateSMTP: true,
  });

  console.log(checkAll);
  if (checkAll.valid) {
    return res
      .status(200)
      .json({
        success: true,
        message: `${email} is a valid email address.`,
        details: checkAll, });
  }
  return res
    .status(406)
    .json({
      success: false,
      message: `${email} is NOT a valid email address.`,
      details: checkAll,
    });
});

app.post("/multiple-mails", (req, res) => {
    //const emails = req.body.emails;
    return res
    .status(418)
    .json({
      success: true,
      message: "Not implemented yet",
    });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
