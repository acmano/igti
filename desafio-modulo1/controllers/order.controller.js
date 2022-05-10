import OrderService from "../services/order.service.js";

async function createOrder(req, res, next) {
    try {
        let order = req.body;
        if (!order.cliente || !order.produto || order.valor == null) {
            throw new Error("Cliente, Produto e valor do pedido são obrigatórios.");
        }
        order = await OrderService.createOrder(order);
        res.send(order);
    } catch (err) {        
        next(err);
    }
}

async function updateOrder(req, res, next) {
    try {
        const order = req.body;
        if (!order.id || !order.cliente || !order.produto || !order.entregue || order.valor == null) {
            throw new Error("Id, Cliente, Produto, Situação da Entrega e Valor do pedido são obrigatórios.");
        }
        res.send(await OrderService.updateOrder(order));
    } catch (err) {
        next(err);               
    }
}

async function updateOrderStatus(req, res, next) {
    try {
        const order = req.body;
        if (!order.id || typeof order.entregue != "boolean") {
            throw new Error("Id e Situação da Entrega são obrigatórios.");
        }
        res.send(await OrderService.updateOrderStatus(order));
    } catch (err) {
        next(err);
    }
}

async function deleteOrder(req, res, next) {
    try {
        await OrderService.deleteOrder(req.params.id);
        res.end();
    } catch (err) {
        next(err);  
    }
}

async function getOrders(req, res, next) {
    try {
        res.send(await OrderService.getOrders());
    } catch (err) {
        next(err);
    }
}

async function getOrder(req, res, next) {
    try {        
        res.send(await OrderService.getOrder(req.params.id));
    } catch (err) {
        next(err);
    }
}

async function getOrderByClient(req, res, next) {
    try {    
        const client = req.body;
        const totalValue = `{"Total de Pedidos": ${await OrderService.getOrderByClient(client.cliente)}}`;

        res.send(totalValue);
    } catch (err) {
        next(err);
    }
}

async function getOrderByProduct(req, res, next) {
    try {    
        const product = req.body;
        const totalValue = `{"Total de Pedidos": ${await OrderService.getOrderByProduct(product.produto)}}`;

        res.send(totalValue);
    } catch (err) {
        next(err);
    }
}

async function getMostOrdered(_, res, next) {
    try {        
        res.send(await OrderService.getMostOrdered());
    } catch (err) {
        next(err);
    }
}

export default {
    createOrder,
    updateOrder,
    updateOrderStatus,
    getOrders,
    getOrder,
    deleteOrder,
    getOrderByClient,
    getOrderByProduct,
    getMostOrdered
}