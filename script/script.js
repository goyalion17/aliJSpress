//DOMContentLoaded отслеживает полную загрузку содержимого страницы в браузере и затем запускает js-скрипты
document.addEventListener("DOMContentLoaded", () => {
  //сначала пишутся константы, затем переменные, затем функции и затем обработчики событий
  const search = document.querySelector(".search");
  const goodsWrapper = document.querySelector(".goods-wrapper");
  const cartBtn = document.getElementById("cart");
  const wishlistBtn = document.getElementById("wishlist");
  const cart = document.querySelector(".cart");
  const category = document.querySelector(".category");

  //создаём функцию создания карточки товаров
  const createCardGoods = (id, title, price, img) => {
    //создаём элемент <div> для карточки товара
    const card = document.createElement("div");

    //присваиваем класс этому <div>
    card.className = "card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3";

    //добавляем содержимое карточки
    card.innerHTML = `
    <div class="card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3">
      <div class="card">
        <div class="card-img-wrapper">
          <img class="card-img-top" src="${img}" alt="">
          <button class="card-add-wishlist" data-goods-id='${id}'></button>
        </div>

        <div class="card-body justify-content-between">
          <a href="#" class="card-title">${title}</a>
          <div class="card-price">${price} ₽</div>
          <div>
            <button class="card-add-cart" data-goods-id='${id}'>Добавить в корзину</button>
          </div>
        </div>
      </div>
  </div>
  `;

    return card;
  };

  //добавляем корзине товаров стиль '' для закрытия модального окна при условии...
  const closeCart = event => {
    const target = event.target;

    //...target идентичен корзине, поэтому всё, что кликается мимо - не target, и окно будет закрыто; или target содержит класс для закрытия(крестик) модального окна; или обработка события кнопки ESC(27) клавиатуры
    if (
      target === cart ||
      target.classList.contains("cart-close") ||
      event.keyCode === 27
    ) {
      cart.style.display = "";
      document.removeEventListener("keyup", closeCart);
    }
  };

  //добавляем корзине товаров стиль flex для открытия модального окна
  const openCart = event => {
    //запрещает перезагрузку страницы или переход по ссылке
    event.preventDefault();

    cart.style.display = "flex";
    document.addEventListener("keyup", closeCart);
  };

  const renderCard = goods => {
    goodsWrapper.textContent = "";
    goods.forEach(({ id, title, price, imgMin }) => {
      goodsWrapper.append(createCardGoods(id, title, price, imgMin));
    });
  };

  const getGoods = (handler, filter) => {
    fetch("./db/db.json")
      .then(response => response.json())
      .then(filter)
      .then(handler);
  };

  //рандомный вывод товаров на страницу
  const randomSort = item => {
    return item.sort(() => Math.random() - 0.5);
  };

  const choiceCategory = event => {
    event.preventDefault();
    const target = event.target;

    if (target.classList.contains("category-item")) {
      const category = target.dataset.category;
      getGoods(renderCard, goods =>
        goods.filter(item => item.category.includes(category))
      );
    }
  };

  //подвешиваем слушатель событий для кнопки корзины, чтобы при клике срабатывала функция openCart(выше: которая открывает модальное окно с содержимым корзины)
  cartBtn.addEventListener("click", openCart);

  cart.addEventListener("click", closeCart);
  category.addEventListener("click", choiceCategory);

  getGoods(renderCard, randomSort);
});