import express from "express";
import nodemailer from "nodemailer";
import fetch from "node-fetch";
const app = express();
const port = 3333;

app.get("/", (req, res) => {
  res.send("Hello World!");s
});

app.get("/one-mail/:email", (req, res) => {
  const email = req.params.email;
  if (verifyEmailComposition(email)) {
    if (verifyDomain(email.split("@")[1])) {
      return res.send(`${email} is a valid email address.`);
    }
  }
  return res.send(`${email} is not a valid email address.`);
});

app.post("/multiple-mails", (req, res) => {
    const emails = req.body.emails;
    const validEmails = [];
    const invalidEmails = [];
    emails.forEach((email) => {
        if (verifyEmailComposition(email)) {
            if (verifyDomain(email.split("@")[1])) {
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

  if (regex.test(email)) {
    console.log("Mail address valid.");
    return true;
  } else {
    console.log("Mail address invalid.");
    return false;
  }
};

const verifyDomain = async (domain) => {
  fetch(domain)
    .then((response) => {
      if (response.ok) {
        console.log("Domain is valid.");
      } else {
        console.log("Erreur : " + response.status);
      }
    })
    .catch((error) => {
      console.log("Erreur : " + error);
    });
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
