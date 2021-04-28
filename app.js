// const http = require('http');

const adminRouter = require('./routes/admin');

const shopsRouter = require('./routes/shop');

const express = require('express');

const expressHbs = require('express-handlebars');

const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const app = express();


//app.engine('hbs', expressHbs({layoutsDir: 'views/layout/', defaultLayout: 'main-layout', extname: 'hbs'}));

// app.set('view engine', 'pug');



//app.set('view engine', 'hbs');


app.set('view engine', 'ejs');

app.set('views', 'views');

const path = require('path');

// app.use((req, res, next) => {
//     console.log("In middleware");
//     next();
// });

// app.use('/app-product', (req, res, next) => {
//     // console.log("In second middleware");
//     res.send('<form action="/product" method="POST"><input type="text" name="title"> <button > Submit </button><form>');
// });


// app.get("/product", (req, res, next) => {
//     res.send('<h1>Get request<h1>');
// });

// app.post("/product", (req, res, next)=>{
//     console.log(req.body);
//     res.redirect('/');
// });


// app.use('/', (req, res, next) => {
//     // console.log("In second middleware");
//     res.send('<h1>Hello from express<h1>')
// });

// const server = http.createServer(app);
// server.listen(3000);

const sequelize = require('./utils/database');

const Product = require('./models/product');

const User = require('./models/user');

const Cart = require('./models/cart');

const CartItem = require('./models/cart-item');

const Order = require('./models/order');

const OrderItem = require('./models/order-item');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded());


app.use((req, res, next) => {
    User.findByPk(1)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => {
        console.log(err);
    });
});

app.use('/admin',adminRouter.routes);

app.use(shopsRouter);

app.use(errorController.get404);



Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});

sequelize.sync()
.then( result => {
    //console.log(result);
    return User.findByPk(1)
})
.then(user => {
    if(!user) {
        return User.create({name: 'Robin', email: 'robinl3680@gmail.com'});
    }
    return user;
})
.then(user => {
    //console.log(user);
    return user.createCart();
})
.then(cart => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});