import express from "express";
import { choose, show, start } from "./db";
const app = express();
app.use(express.json());
app.use(express.urlencoded());

// create a RESTful-style API handler
const commandHandler = async (
  command: string,
  namn: string,
  kanalid: string,
  kanalnamn: string,
  rest: string[]
) => {
  switch (command) {
    case "hjälpa":
      return {
        response: [
          "Möjliga commands är: ",
          "välj [namn på rätt]",
          "admin:starta [restaurangnamn] [URL]",
          "visa",
          "admin:beställ",
        ],
      };
    case "välj":
      await choose(namn, rest.join(" "), kanalid);
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
      await start(resturangNamn, webbadress, kanalid, kanalnamn);
      return {
        response_type: "ephemeral",
        response: `Sådär ja, nu är det dags att beställa lunch till nästa lunch and learn!ð
Denna vecka beställer vi från ${rest[0]} ${rest[1]}.
Beställ genom att skriva "/frontendlunch välj {namn på rätten}" `,
      };
    case "visa":
      const { restaurang, personer } = await show();
      const response = `tjabba tjena, denna veckan beställer vi från ${restaurang?.restaurangnamn} ${restaurang?.webbadress}
      ${personer
        .map((person) => `${person.namn} vill äta ${person.val}`)
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
          if (acc[person.val]) {
            acc[person.val]++;
          } else {
            acc[person.val] = 1;
          }
          return acc;
        },
        {} as Record<string, number>
      );
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return {
        response_type: "in_channel",
        response: `Måltid: Lunch
Datum: ${tomorrow.toLocaleDateString()} kl 11:45
Mat: https://www.aptit.se/nd/lev.asp?fas=&sid=1031#s_1031
Syfte: Lunch and Learn
KST: Senso 104
Ãvrigt: ${Object.entries(choices)
          .map(([dish, count]) => `${count}st ${dish}`)
          .join("\n")}
${p.map((person) => `användare: ${person.namn} Företag: Senso`).join("\n")}
Antal: ${p.length}`,
      };
    default:
      return {
        response_type: "in_channel",
        response: "Okänt kommando, använd 'välj {din matätt}' eller 'visa'",
      };
  }
};

app.post("/api", async (req, res) => {
  const kanalid = req.body.channel_id as string;
  const kanalnamn = req.body.channel_name as string;
  const namn = req.body.user_name as string;
  console.log(kanalid, kanalnamn);
  const [command, ...rest] = req.body.text.split(" ");
  const { response, response_type } = await commandHandler(
    command,
    namn,
    kanalid,
    kanalnamn,
    rest
  );

  res.send({
    response_type,
    text: response,
  });
  console.log("response", response); //tslint:disable-line
});
app.listen(1337, () => console.log("ð Server ready at: http://localhost:1337"));
