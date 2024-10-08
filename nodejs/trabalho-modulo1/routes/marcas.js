import express from "express";
import { promises as fs } from "fs";

const filename = "car-list.json";
const router = express.Router();
const { readFile, writeFile } = fs;

router.get("/maisModelos", async (_, res) => {
    const data = JSON.parse(await readFile(filename));
    const result = brandTopBottom(data, true);

    res.send(result);
});

router.get("/menosModelos", async (_, res) => {
    const data = JSON.parse(await readFile(filename));
    const result = brandTopBottom(data, false);

    res.send(result);
});

router.get("/listaMaisModelos/:top", async (req, res) => {
    const data = JSON.parse(await readFile(filename));
    const result = brandTopList(data, req.params.top, true);

    res.send(result);
});

router.get("/listaMenosModelos/:top", async (req, res) => {
    const data = JSON.parse(await readFile(filename));
    const result = brandTopList(data, req.params.top, false);

    res.send(result);
});

router.post("/listaModelos", async (req, res) => {

    let brand = req.body;

    if (!brand) {
        throw new Error("Informe a marca que deseja buscar");
    }

    const data = JSON.parse(await readFile(filename));
    const models = modelsByBrand(data, brand.nomeMarca);

    res.send(models);
});

function modelsByBrand(data, brandSearch) {

    const listModels = data.map(brand => {
        return {
            'brand': brand.brand,
            'models': brand.models
        }
    }).filter((item) => item.brand.toLowerCase() === brandSearch.toLowerCase());

    return listModels.length > 0 ? listModels[0].models : [];
}

function brandTopBottom(data, asc) {

    const listBrand = data.map(brand => {
        return {
            'brand': brand.brand,
            'models': brand.models.length
        }
    }).sort(function (a, b) {
        return a.models > b.models ? -1 : a.models < b.models ? 1 : 0
    });

    let index = (asc) ? 0 : listBrand.length - 1;

    const result = listBrand.filter(brand => brand.models === listBrand[index].models);
    const brands = [];

    for (let i in result) {
        brands.push(result[i].brand);
    }
    return (brands.length > 1) ? brands : `"${brands[0]}"`;

}

function brandTopList(data, top, asc) {
    const listBrand = data.map(brand => {
        return {
            'brand': brand.brand,
            'models': brand.models.length
        }
    }).sort((a, b) => a.models > b.models ? -1 : a.models < b.models ? 1 : a.brand > b.brand ? 1 : -1);

    let brands = [];
    if (asc) {
        brands = listBrand.slice(0, top);
    } else {
        brands = listBrand.slice(-top).sort((a, b) => a.models > b.models ? 1 : a.models < b.models ? -1 : a.brand > b.brand ? 1 : -1);
    }

    return formatBrandReduced(brands);
}

function formatBrandReduced(data) {

    const brands = [];

    for (let b in data) {
        brands.push(`${data[b].brand} - ${data[b].models}`)
    }
    return brands;
}

export default router;