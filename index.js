import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import nodemailer from "nodemailer";
import fetch from "node-fetch";
const app = express();
const port = 3333;

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

app.get("/", (req, res) => {
  return res
    .status(200)
    .json({ success: true, message: "Welcome on Mailtester API" });
});

app.get("/one-mail/:email", async (req, res) => {
  const email = req.params.email;
  console.log("verifyDomain", verifyDomain(email));
  console.log("checkif", await verifyEmail(email))
  if ((await verifyEmailComposition(email)) && (await verifyDomain(email)) && (await verifyEmail(email))) {
    return res
      .status(200)
      .json({ success: true, message: `${email} is a valid email address.` });
  }
  return res
    .status(406)
    .json({
      success: false,
      message: `${email} is NOT a valid email address.`,
    });
});

app.post("/multiple-mails", (req, res) => {
    const emails = req.body.emails;
    const validEmails = [];
    const invalidEmails = [];
    emails.forEach((email) => {
        if (verifyEmailComposition(email)) {
            if (verifyDomain(email)) {
                validEmails.push(email);
            } else {
                invalidEmails.push(email);
            }
        } else {
            invalidEmails.push(email);
        }
    });
    return res.send({
        validEmails: validEmails,
        invalidEmails: invalidEmails,
    });
});

const verifyEmailComposition = async (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const verifyDomain = async (email) => {
  const url = new URL(`https://${email.split("@")[1]}`);
  let valid = false;
  try {
    let response = await fetch(url);
    valid = response.ok;
  } catch {
    console.error("Domain is not valid.");
    valid = false;
  }
  return valid;
};


const verifyEmail = async (email) => {
  try {
    await transporter.verify();
    const result = await transporter.verifyRecipient(email);
    return true;
  } catch (error) {
    console.error('Error: ' + error.message);
    return false;
  }
};


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
