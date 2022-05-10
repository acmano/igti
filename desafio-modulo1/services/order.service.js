import OrderRepository from "../repositories/order.repository.js";

async function createOrder(order) {
    return await OrderRepository.insertOrder(order);
}

async function updateOrder(order) {
    return await OrderRepository.updateOrder(order);
}

async function updateOrderStatus(order) {
    const orderStatus = await OrderRepository.getOrder(order.id);
    orderStatus.entregue = order.entregue;
    return await OrderRepository.updateOrder(orderStatus); 
}

async function deleteOrder(id) {
    return await OrderRepository.deleteOrder(id);
}

async function getOrders() {
    return await OrderRepository.getOrders();
}

async function getOrder(id) {
    return await OrderRepository.getOrder(id);
}

async function getOrderByClient(cliente) {     
    return await OrderRepository.getOrderByClient(cliente);
}

async function getOrderByProduct(produto) {     
    return await OrderRepository.getOrderByProduct(produto);
}

async function getMostOrdered() {     
    return formatResult(await OrderRepository.getMostOrdered());
}

function formatResult(data) {

    let result = [];

    for (let d in data){
        result.push(`${data[d].produto} - ${data[d].count}`)
    }

    return result;
}

export default {
    createOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
    getOrders,
    getOrder,
    getOrderByClient,
    getOrderByProduct,
    getMostOrdered
}