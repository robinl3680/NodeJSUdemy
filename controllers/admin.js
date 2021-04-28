const Product = require('../models/product');
const productModel = require('../models/product');

exports.getAddProduct = (req, res, next) => {
// console.log("In second middleware");
    res.render('admin/edit-product', {
    pageTitle: 'Add product',
    path: '/admin/add-product',
    editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
//console.log(req.body);
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    // const product = new productModel(null, title, imageUrl, description, price);
    // product.save()
    // .then(() => {
    //     res.redirect('/');
    // })
    // .catch(err => {
    //     console.log(err);
    // });

    req.user.createProduct( {
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
    }).then((result)=>{
        //console.log(result);
        res.redirect('/');
    }).catch(err => {
        console.log(err);
    });


};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    // const updatedProduct = new productModel(prodId, updatedTitle, updatedImageUrl, updatedDescription, updatedPrice );
    // updatedProduct.save();
    
    Product.findByPk(prodId)
    .then(product => {
        product.title = updatedTitle;
        product.description = updatedDescription;
        product.imageUrl = updatedImageUrl;
        product.price = updatedPrice;
        return product.save();
    })
    .then(result => {
        //console.log(result);
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log(err);
    });
}

exports.getEditProduct = (req, res, next) => {
    // console.log("In second middleware");
    const editMode = req.query.edit;
    if(!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;

    // Product.findById(prodId, product => {
    //     if(!product) {
    //         return res.redirect('/');
    //     }
    //     res.render('admin/edit-product', {
    //         pageTitle: 'Edit product',
    //         path: '/admin/edit-product',
    //         editing: editMode,
    //         product: product
    //     });
    // });

    req.user.getProducts(({where: {id: prodId}}))
    .then((products) => {
        res.render('admin/edit-product', {
            pageTitle: 'Edit product',
            path: '/admin/edit-product',
            editing: editMode,
            product: products[0]
        });
    }).catch(err => {
        console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
    // productModel.fetchAll((products => {
    //     res.render('admin/products', {
    //         prods: products,
    //         pageTitle: 'Admin products',
    //         path: '/admin/products',
    //     });
    // }));

    // productModel.findAll()
    // .then((products) => {
    //     res.render('admin/products', {
    //         prods: products,
    //         pageTitle: 'Admin products',
    //         path: '/admin/products',
    //     });
    // })
    // .catch(err => {
    //     console.log(err);
    // })

    req.user.getProducts()
    .then((products) => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    })
    .catch(err => {
        console.log(err);
    });
    
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByPk(prodId)
    .then(product => {
        return product.destroy();
    })
    .then(result => {
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log(err);
    });
}

