import express from "express";
import OrderController from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", OrderController.createOrder);
router.put("/", OrderController.updateOrder);
router.patch("/status", OrderController.updateOrderStatus);
router.delete("/:id", OrderController.deleteOrder);
router.get("/", OrderController.getOrders);
router.get("/byid/:id", OrderController.getOrder);
router.get("/totalbyclient", OrderController.getOrderByClient);
router.get("/totalbyproduct", OrderController.getOrderByProduct);
router.get("/mostordered", OrderController.getMostOrdered);

router.use((err, req, res, next) => {   
    res.status(400).send({ error: err.message });    
});

export default router;