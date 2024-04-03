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
      return {
        response_type: "in_channel",
        response: [
          "Tackar och bockar!",
          "Vilket strålande val",
          "Låter smaskigt!",
          "Kul att du är med :)",
        ][Math.floor(Math.random() * 4)],
      };
    case "admin:starta":
      const [resturangNamn, webbadress] = rest;
      await start(resturangNamn, webbadress);
      return {
        response_type: "ephemeral",
        response: `Sådär ja, nu är det dags att beställa lunch till nästa lunch and learn!🍕
Denna vecka beställer vi från ${rest[0]} ${rest[1]}.
Beställ genom att skriva "/frontendlunch välj {namn på rätten}" `,
      };
    case "visa":
      const { restaurang, personer } = await show();
      const response = `tjabba tjena, denna veckan beställer vi från ${restaurang?.name} ${restaurang?.url}
      ${personer
        .map((person) => `${person.name} vill äta ${person.choose}`)
        .join("\n")}
      `;
      return {
        response_type: "in_channel",
        response,
      };
    case "admin:beställ":
      const { restaurang: r, personer: p } = await show();
      console.log("p", p); //tslint:disable-line
      const choices = p.reduce(
        (acc, person) => {
          if (acc[person.choose]) {
            acc[person.choose]++;
          } else {
            acc[person.choose] = 1;
          }
          return acc;
        },
        {} as Record<string, number>,
      );
      return {
        response_type: "in_channel",
        response: `Måltid: Lunch
Datum: 3/20/2024 kl 11:30
Mat: https://www.aptit.se/nd/lev.asp?fas=&sid=1031#s_1031
Syfte: Lunch and Learn
KST: Senso 104
Övrigt: ${Object.entries(choices)
          .map(([dish, count]) => `${count}st ${dish}`)
          .join("\n")}
${p.map((person) => `användare: ${person.name} Företag: Senso`).join("\n")}
Antal: ${p.length}`,
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
