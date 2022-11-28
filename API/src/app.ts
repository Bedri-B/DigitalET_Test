import express from "express";
import path from "path";
import sequelize from "./Config/db";
import DepartmentModel from "./Model/Department.Model";

const cors = require("cors");
const app = express();

app.use(cors());
const port = 3001;

const bodyParser = require('body-parser')

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

sequelize
  .sync()
  .then(async () => {
    console.log("Database Synced!");
    console.log("Seeding CEO!");
    const p_ceo = await DepartmentModel.findOne({ where: { name: "CEO" } });
    if (!p_ceo) {
      const ceo = await DepartmentModel.create({
        name: "CEO",
        description: "Chief Executive Officer",
        ceo: true,
      });
      if (ceo) {
        console.log("CEO seed complete");
      } else {
        console.log("Error seeding CEO");
      }
    }
    else{
      console.log("CEO seed complete");
    }
  })
  .catch((e) => {
    console.log("Database sync failed!");
    console.log(e);
    console.log("------------------------");
  });

app.use(express.static(path.join(__dirname, "../public")));

const DepartmentRoute = require("./Route/Department.Route");

app.use("/api/departments", DepartmentRoute);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
