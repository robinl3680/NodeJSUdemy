const Product = require('../models/product');
const productModel = require('../models/product');

exports.getProducts = (req, res, next) => {
    // console.log("In second middleware");
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    // console.log(adminData.products);
    // productModel.fetchAll()
    // .then(([rows, fieldData]) => {
    //     res.render('shop/product-list', {
    //         prods: rows,
    //         pageTitle: 'All products',
    //         path: '/products',
    //     });
    // })
    // .catch(err => {
    //     console.log(err);
    // });

    productModel.findAll()
    .then((products) => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All products',
            path: '/products',
        });
    })
    .catch(err => {
        console.log(err);
    })
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params['productId'];
    // Product.findById(prodId)
    // .then(([rows, fieldData]) => {
    //     res.render('shop/product-details', {
    //         product: rows[0],
    //         pageTitle: rows[0].title,
    //         path: '/products'
    //     });
    // })
    // .catch( err => {
    //     console.log(err);
    // });

    Product.findByPk(prodId)
    .then(product => {
        res.render('shop/product-details', {
            product: product,
            pageTitle: product.title,
            path: '/products'
        });
    })
    .catch(err => {
        console.log(err);
    });
}

exports.getIndex = (req, res, next) => {
    // productModel.fetchAll()
    // .then(([rows, fieldData]) => {
    //     res.render('shop/index', {
    //         prods: rows,
    //         pageTitle: 'Shop',
    //         path: '/',
    //     });
    // })
    // .catch(err => {
    //     console.log(err);
    // });

    productModel.findAll()
    .then((products) => {
        //console.log(products);
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
        });
    }).catch(err => {
        console.log(err);
    })
}

exports.getCart= (req, res, next) => {
    // Cart.getCart((cart) => {
    //     productModel.fetchAll(products => {
    //         const cartProducts = [];
    //         for(product of products) {
    //             const cartProductData = cart.products.find(prod => prod.id === product.id);
    //             if (cartProductData) {
    //                 cartProducts.push({ productData: product, qty: cartProductData.qty});
    //             }
    //         }
    //         res.render('shop/cart', {
    //             path: '/cart',
    //             pageTitle: 'Your cart',
    //             products: cartProducts
    //         });
    //     });
    // });

    req.user.getCart()
    .then(cart => {
        return cart.getProducts();
    })
    .then(products => {
        res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your cart',
            products: products
        });
    })
    .catch(err => {
        console.log(err);
    });
}

exports.postCart = (req, res, next) => {
   const prodId = req.body.productId;
   let fetchedCart, newQty = 1;;
   req.user.getCart()
   .then(cart => {
       fetchedCart = cart;
       return cart.getProducts({where: {id: prodId}})
   })
   .then(products => {
       let product;
       if(products.length > 0) {
        product = products[0];
       }
       if(product) {
           let oldQty = product.cartItem.quantity;
           newQty = oldQty + 1;
           return product;
       } else {
           return Product.findByPk(prodId);
       }
   })
   .then(product => {
    console.log(product);
    return fetchedCart.addProduct(product,
    {
        through: { quantity: newQty }
    });
   })
   .then( () => {
        res.redirect('/cart');
   })
   .catch(err => {
       console.log(err);
   })
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    // Product.findById(prodId, product => {
    //     Cart.deleteProduct(prodId, product.price);
    //     res.redirect('/cart');
    // });

    req.user.getCart()
    .then(cart => {
        return cart.getProducts({where: {id: prodId}});
    })
    .then(products => {
        const product = products[0];
        return product.cartItem.destroy();
    })
    .then(() => {
        res.redirect('/cart');
    })
    .catch(err => {
        console.log(err);
    })
}

exports.getOrders = (req, res, next) => {
    req.user.getOrders({include: ['products']})
    .then(orders => {
        res.render('shop/orders', {
            path: '/orders',
            pageTitle: 'Your cart',
            orders: orders
        });
    })
    .catch(err => {
        console.log(err);
    })
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Check out'
    });
}

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user.getCart()
    .then(cart => {
        fetchedCart = cart;
        return cart.getProducts();
    })
    .then(products => {
        return req.user.createOrder()
        .then(order => {
            return order.addProducts(
                products.map(product => {
                    product.orderItem = { quantity: product.cartItem.quantity };
                    return product;
                }
            ));
        })
        .catch(err => {
            console.log(err);
        });
    })
    .then( reuslt => {
        return fetchedCart.setProducts(null);
    })
    .then(() => {
        res.redirect('/orders');
    })
    .catch(err => {
        console.log(err);
    })
}