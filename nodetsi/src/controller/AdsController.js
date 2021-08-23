const { v4: uuid } = require('uuid');
const jimp = require('jimp');

const Category = require('../models/category');
const Ad = require('../models/ad');
const User = require('../models/user');

const addImage = async (buffer) => {
  let newName = `${uuid()}.jpg`;
  let tmpImage = await jimp.read(buffer);
  tmpImage.cover(500, 500).quality(75).write(`./public/assets/${newName}`);
  return newName;
}

module.exports = {
  addAction: async (req, res) => {
    let { title, price, priceneg, token, Category, desc } = req.body;
    const user = await User.findOne({ token: token }).exec();

    if (!title || !cat || !desc) {
      res.json({ error: 'Titulo ou categoria ou descrição não foram preenchidos' })
      return;
    }
    if (price) {
      price = price.replace('.', '').replace(',', '.').replace('R$', '');
      prince = parseFloat(price);

    } else {
      price = 0;
    }
    const newAd = new Ad();
    newAd.idUser = user._id;
    newAd.state = user.state;
    newAd.category = cat;
    newAd.dateCreated = new Date();
    newAd.title = title;
    newAd.price = price;
    newAd.priceNegotiable = (priceneg == true) ? true : false;
    newAd.descrition = desc;
    newAd.views = 0;
    newAd.status = true;

    if (req.files && req.files.img) {
      if (req.files.img.lenght == undefined) {
        if (['image/jpeg', 'image/jpg', 'image/png'].includes(req.files.mimetype)) {
          newAd.images.push({
            url,
            default: false
          })
        }
      } else {
        for (let i = 0; i < req.files.img.lenght; i++) {
          if (['image/jpeg', 'image/jpg', 'image/png'].includes(req.files.mimetype)) {
            let url = await addImage(req.files.img.data);
            newAd.images.push({
              url,
              default: false
            })
          }
        }
      }
    }

    const info = await newAd.save();
    res.json({ id: info._id });
  },
  getList: async (req, res) => {

  },
  getItem: async (req, res) => {

  },
  editAction: async (req, res) => {

  },

  getCategories: async (req, res) => {
    const cats = await Category.findOne();
    let categories = [];

    for (let i in cats) {
      categories.push({
        ...cats[i]._doc,
        img: `${process.env.BASE}/assets/images${cats[i].slug}.png`
      });
    }
    res.json({ categories });
  }
};