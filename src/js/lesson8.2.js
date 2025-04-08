function Cart(goods = [], totalPrice = 0, count = 0) {
  this.goods = goods;
  this.totalPrice = totalPrice;
  this.count = count;

  this.calculateGoodsPrice = function () {
    this.totalPrice = this.goods.reduce((acc, item) => {
      return acc + item.price * item.productCount;
    }, 0);
  };

  this.addGoods = function (product, count = 1) {
    product.productCount = count;
    this.goods.push(product);
    this.increaseCount(count);
  };

  this.increaseCount = function (num) {
    this.count += num;
  };

  this.clear = function () {
    this.goods.length = 0;
    this.count = 0;
    this.totalPrice = 0;
  };

  this.print = function () {
    console.log(JSON.stringify(this.goods, null, 2));
    console.log(`Общая стоимость корзины: ${this.totalPrice}`);
  };

  this.getTotalPrice = function () {
    return this.totalPrice;
  };
}

function Goods(price, goodName, discount = 0) {
  this.goodName = goodName;
  this.originalPrice = price;
  this.discount = discount;
  this.price = price - (price * discount) / 100;
}

function FoodGoods(price, goodName, discount = 0, calories) {
  Goods.call(this, price, goodName, discount);
  this.calories = calories;
}

function СlothingGoods(price, goodName, discount = 0, material) {
  Goods.call(this, price, goodName, discount);
  this.material = material;
}

function TechnicsGoods(price, goodName, discount = 0, typeTechniques) {
  Goods.call(this, price, goodName, discount);
  this.typeTechniques = typeTechniques;
}

FoodGoods.prototype = Object.create(Goods.prototype);
FoodGoods.prototype.constructor = FoodGoods;

СlothingGoods.prototype = Object.create(Goods.prototype);
СlothingGoods.prototype.constructor = СlothingGoods;

TechnicsGoods.prototype = Object.create(Goods.prototype);
TechnicsGoods.prototype.constructor = TechnicsGoods;

const myCart = new Cart();
const milk = new FoodGoods(100, 'Молоко', 10, 300);
const jacket = new СlothingGoods(100, 'кожаная куртка', 0, 'кожа');
const phone = new TechnicsGoods(100, 'Нокиа', 0, 'Телефон');

myCart.addGoods(milk);
myCart.addGoods(jacket);
myCart.addGoods(phone);
myCart.calculateGoodsPrice();
myCart.print();
