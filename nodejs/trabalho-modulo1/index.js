import express from "express";
import brandRouter from "./routes/marcas.js";

const app = express();
app.use(express.json());

app.use("/marcas", brandRouter);


app.listen(3000, async () => {
    console.log("API started");
});