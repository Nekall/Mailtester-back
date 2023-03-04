import express from "express";
import nodemailer from "nodemailer";
import fetch from "node-fetch";
const app = express();
const port = 3333;

app.get("/", (req, res) => {
  return res
    .status(200)
    .json({ success: true, message: "Welcome on Mailtester API" });
});

app.get("/one-mail/:email", async (req, res) => {
  const email = req.params.email;
  console.log("verifyDomain", verifyDomain(email));
  console.log("checkif", (await verifyEmailComposition(email)) , (await verifyDomain(email)))
  if ((await verifyEmailComposition(email)) && (await verifyDomain(email))) {
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
  const transporter = nodemailer.createTransport({
    host: "smtp.example.com",
    port: 587,
    secure: false,
    auth: {
      user: "your_username",
      pass: "your_password",
    },
  });

  try {
    const info = await transporter.verify();
    console.log("SMTP server is ready to send mails.");
    const result = await transporter.verifyRecipient(email);
    console.log("Mail address is valid and active.");
    return true;
  } catch (error) {
    console.log("Erreur : " + error);
    return false;
  }
};

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
