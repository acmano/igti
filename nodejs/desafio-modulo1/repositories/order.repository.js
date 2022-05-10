import { promises as fs } from "fs";

const { readFile, writeFile } = fs;

async function insertOrder(order) {
    const data = JSON.parse(await readFile(global.fileName));

    order = { 
        id: data.nextId++, 
        cliente: order.cliente,
        produto: order.produto,
        valor: order.valor,
        entregue: false,
        timestamp: new Date()
    };

    data.pedidos.push(order);

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    return order;
}

async function updateOrder(order) {
    const data = JSON.parse(await readFile(global.fileName));
    const index = data.pedidos.findIndex(a => a.id === order.id);

    if (index === -1) {
        throw new Error("Pedido não encontrado.");
    }

    data.pedidos[index].cliente = order.cliente;
    data.pedidos[index].produto = order.produto;
    data.pedidos[index].valor = order.valor;
    data.pedidos[index].entregue = order.entregue;

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    return data.pedidos[index];
}

async function deleteOrder(id) {
    const data = JSON.parse(await readFile(global.fileName));    
    data.pedidos = data.pedidos.filter(
        order => order.id !== parseInt(id));        
    await writeFile(global.fileName, JSON.stringify(data, null, 2));  
}

async function getOrders() {
    const data = JSON.parse(await readFile(global.fileName));
    return data.pedidos;
}

async function getOrder(id) {
    const orders = await getOrders();
    const order = orders.find(order => order.id === parseInt(id));
    if (order) {
        return order;
    }
    throw new Error("Pedido não encontrado.");
}

async function getOrderByClient(cliente) {
    const orders = await getOrders();
    const ordersDelivered = orders.filter(order => order.cliente === cliente && order.entregue === true);
    
    if (!ordersDelivered)
        throw new Error("Nenhum pedido entregue encontrado.");

    let totalValue = 0;

    for (let key in ordersDelivered){
        totalValue += ordersDelivered[key].valor;
    }

    return totalValue;
}

async function getOrderByProduct(produto) {
    const orders = await getOrders();
    const ordersDelivered = orders.filter(order => order.produto === produto && order.entregue === true);
    
    if (!ordersDelivered)
        throw new Error("Nenhum pedido entregue encontrado.");

    let totalValue = 0;

    for (let key in ordersDelivered){
        totalValue += ordersDelivered[key].valor;
    }

    return totalValue;
}

async function getMostOrdered() {

    const orders = await getOrders();
    const products = orders.filter(order => order.entregue === true).map(order => order.produto);
    const items = [];
    const count = [];
    const summary = [items, count];
    const sorted = [];

    for (let p in products){

        let index = items.findIndex(a => a === products[p]);

        if (index === -1) {
            items.push(products[p]);
            count.push(1);
        } else {
            items[index] = products[p];
            count[index]++;
        }
    }
    
    for (let d in summary[0]) {

        let item = {};
        item.produto = summary[0][d];
        item.count = summary[1][d];

        sorted.push(item);
    }

    return sorted.sort((a, b) => a.count > b.count ? -1 : a.count < b.count  ? 1 : 0);
}

export default {
    insertOrder,
    updateOrder,
    deleteOrder,
    getOrders,
    getOrder,
    getOrderByClient,
    getOrderByProduct,
    getMostOrdered
}