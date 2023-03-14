import express from "express";
import emailExistence from "email-existence";
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
  emailExistence.check(email, function(error, response){
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else {
      console.log('res: '+response);
      res.send({email: email, exists: response});
    }
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
