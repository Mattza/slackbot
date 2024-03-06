import express from "express";
import { choose, show, start } from "./db";
const app = express();
app.use(express.json());
app.use(express.urlencoded());

// create a RESTful-style API handler
const commandHandler = async (
  command: string,
  name: string,
  rest: string[],
) => {
  switch (command) {
    case "välj":
      await choose(name, rest.join(" "));
      return { response_type: "in_channel", response: ["Tackar och bockar!", "Vilket strålande val", "Låter smaskigt!", "Kul att du är med :)"][Math.floor(Math.random()*4)] };
    case "admin:starta":
      await start();
      return {
        response_type: "ephemeral",
        response: `Sådär ja, nu är det dags att beställa lunch till nästa lunch and learn!🍕
Denna vecka beställer vi från ${rest[0]} ${rest[1]}.
Beställ genom att skriva "/frontendlunch välj {namn på rätten}" `,
      };
    case "visa":
      const data = await show();
      return {
        response_type: "in_channel",
        response: data
          .map((person) => `${person.name} vill äta ${person.choose}`)
          .join("\n"),
      };
    default:
      return {
        response_type: "in_channel",
        response: "Okänt kommando, använd 'välj {din maträtt}' eller 'visa'",
      };
  }
};

app.post("/api", async (req, res) => {
  const name = req.body.user_name as string;
  const [command, ...rest] = req.body.text.split(" ");
  const { response, response_type } = await commandHandler(command, name, rest);

  res.send({
    response_type,
    text: response,
  });
  console.log("response", response); //tslint:disable-line
});
app.listen(1337, () =>
  console.log("🚀 Server ready at: http://localhost:1337"),
);
