import express from "express";
import ordersRouter from "./routes/order.routes.js"

global.fileName = "./data/pedidos.json";

const app = express();
app.use(express.json());

app.use("/orders", ordersRouter);

app.listen(3000, async () => {    
    console.log("API started!");
});