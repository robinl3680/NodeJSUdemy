// // const fs = require('fs');

// // const path = require('path');

// const Cart = require('./cart');

// const db = require('../utils/database');

// const products = [];

// // const p = path.join(path.dirname(require.main.filename),
// //     'data',
// //     'products.json');

// // const getProductsFromFile = cb => {
// //     fs.readFile(p, (err, fileContent) => {
// //         if (err) {
// //             cb([]);
// //         } else{
// //             cb(JSON.parse(fileContent));
// //         }
// //     });
// // }

// module.exports = class Product {
//     constructor(id, title, imageUrl, description, price) {
//         this.id = id;
//         this.title = title;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this.price = price;
//     }

//     // save() {
//     //     getProductsFromFile(products => {
//     //         if (this.id) {
//     //             const existingProductIndex = products.findIndex(prod => prod.id === this.id);
//     //             const updatedProducts = [...products];
//     //             updatedProducts[existingProductIndex] = this;
//     //             fs.writeFile(p, JSON.stringify(updatedProducts), (error) => {
//     //                 console.log(error);
//     //             });
//     //         } else {
//     //             this.id = Math.random().toString();
//     //             products.push(this);
//     //             fs.writeFile(p, JSON.stringify(products), (error) => {
//     //                 console.log(error);
//     //             });
//     //         }
//     //     });
//     // }

//     // static fetchAll(cb) {
//     //     getProductsFromFile(cb);
//     // }

//     // static findById(id, cb) {
//     //     getProductsFromFile(products => {
//     //         const product = products.find(p => p.id === id);
//     //         cb(product);
//     //     });
//     // }

//     // static deleteById(id) {
//     //     getProductsFromFile(products => {
//     //         const product = products.find(product => product.id === id);
//     //         const updatedProducts = products.filter(p => p.id !== id);
//     //         fs.writeFile(p, JSON.stringify(updatedProducts), err => {
//     //             if(!err) {
//     //                 Cart.deleteProduct(id, product.price);
//     //             }
//     //         })
//     //     });
//     // }


//     save() {
//         return db.execute('INSERT INTO products (title, price, description, imageUrl) VALUES(?, ?, ?, ?)',
//         [this.title, this.price, this.description, this.imageUrl]
//         );
//     }

//     static deleteById(id) {

//     }

//     static fetchAll() {
//         return db.execute('SELECT * FROM products');
//     }

//     static findById(id) {
//         return db.execute(`SELECT * FROM products where id = ${id}`);
//     }

// }


const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Product;