import { findAllCategories, findCategoryById, findCategoryByName } from "../models/Category.js"
import { findUserByToken } from "../models/User.js";
import { createAd } from "../models/Ad.js";
import { randomUUID } from "node:crypto";
import jimp from 'jimp';


const AddImage = async(buffer) => {
    let getName = `${randomUUID()}.png`;
    let tmpImg = await jimp.read(buffer);
    tmpImg.cover(500, 500).quality(80).write(`./public/media/${newName}`)
    return newName;
}
export const getCategories = async (req, res) => {
    try {
        const bdCategories = await findAllCategories();
        let categories = [];
        for (let i in bdCategories) {
            categories.push({
                ...bdCategories[i],
                img: `${process.env.BASE}/assets/img/${bdCategories[i].slug}.png`
            });
        }

        return res.status(200).json({ categories });
    } catch (error) {
        res
            .status(500)
            .json({ error: "Failed to get categories", message: error.message })
    }
};

export const create = async (req, res) => {
    try {
        let { title, price, priceneg, desc, category, token } = req.token;
        const user = await findUserByToken(token);
        const categoryId = await findCategoryByName(category);
        const data = {
            status: true,
            userId: user.id,
            state: user.stateId,
            dateCreated: new Date(),
            title,
            categoryId: categoryId.id,
            price: parseFloat(price.match(/\d,/g).join("").replace(",", ".")),
            priceNegotiable: priceneg == "true" ? true : false,
            description: desc,
            views: 0,
            images: [],
        };
        if (req.files) {
            for (let i = 0; i < req.files.images.length; i++) {
                if (["image/jpeg", "image/jpg", "image/png"].includes(req.files.images[i].mimetype)) {
                    let url = await AddImage(req.files.images[i].data);
                    data.images.push({
                        url,
                        default: false
                    });
                }
            }
        }
        else {
            let url = `${process.env.BASE}/media/default.png`
            data.images.push({
                url,
                default: false
            });
        }

        const info = await createAd(data);
        return res.status(201).json({ data });
    }
    catch (error) {
        res
            .status(500)
            .json({ error: "Failed to create Ad", message: error.message })
    }
};