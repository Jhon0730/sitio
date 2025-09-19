document.getElementById('view-cart').addEventListener('click', function () {
    window.location.href = 'carrito.html';
});

document.getElementById('reserve-btn').addEventListener('click', function () {
    window.location.href = 'reservas.html';
});


document.addEventListener("DOMContentLoaded", function () {
    // Menú hamburguesa
    const navToggle = document.getElementById("nav-toggle");
    const mainNav = document.getElementById("main-nav");

    navToggle.addEventListener("click", function () {
        mainNav.classList.toggle("active");
        const expanded = navToggle.getAttribute("aria-expanded") === "true";
        navToggle.setAttribute("aria-expanded", !expanded);
    });

    // Carrito
    const cartIcon = document.getElementById("cart-icon");
    const cartDropdown = document.getElementById("cart-dropdown");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartCounter = document.getElementById("cart-count");
    const cartNotification = document.getElementById("cart-notification");

    let cart = JSON.parse(localStorage.getItem('barberCart')) || [];

    const cartUtils = {
        saveCart: () => {
            localStorage.setItem('barberCart', JSON.stringify(cart));
            updateCartUI(); 
        },

        showNotification: () => {
            cartNotification.style.display = 'block';
            setTimeout(() => {
                cartNotification.style.display = 'none';
            }, 2000);
        },

        animateCartIcon: () => {
            cartIcon.classList.add('animate');
            setTimeout(() => {
                cartIcon.classList.remove('animate');
            }, 500);
        },

        addToCart: (item) => {
            cart.push(item);
            cartUtils.saveCart();
            cartUtils.showNotification();
            cartUtils.animateCartIcon();
        }
    };

    // Botón para eliminar todo el carrito
    document.getElementById("clear-cart").addEventListener("click", function () {
        if (cart.length === 0) {
            alert("El carrito ya está vacío.");
            return;
        }

        if (confirm("¿Estás seguro de que deseas eliminar todos los productos del carrito?")) {
            cart = [];
            cartUtils.saveCart();
            cartDropdown.classList.remove("active"); // Cierra el dropdown
        }
    });

    // Mostrar/ocultar carrito
    cartIcon.addEventListener("click", function (e) {
        e.stopPropagation();
        cartDropdown.classList.toggle("active");
    });

    document.addEventListener("click", function (e) {
        if (!cartDropdown.contains(e.target) && !cartIcon.contains(e.target)) {
            cartDropdown.classList.remove("active");
        }
    });

  

    // Añadir al carrito desde botón
    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.stopPropagation(); // Evita que el clic cierre el dropdown
            const productCard = btn.closest(".product-card");
            const name = productCard.querySelector(".product-name").textContent;
            const price = productCard.querySelector(".product-price").textContent;
            const imgSrc = productCard.querySelector("img").src;

            cartUtils.addToCart({ name, price, imgSrc });
        });
    });

    // Drag and drop
    document.querySelectorAll(".product-card img").forEach(img => {
        img.addEventListener("dragstart", function (e) {
            e.dataTransfer.setData("text/plain", JSON.stringify({
                name: img.dataset.name,
                price: img.dataset.price,
                imgSrc: img.src
            }));
        });
    });

    cartIcon.addEventListener("dragover", function (e) {
        e.preventDefault();
    });

    cartIcon.addEventListener("drop", function (e) {
        e.preventDefault();
        e.stopPropagation(); // Evita que el evento cierre el dropdown
        const data = JSON.parse(e.dataTransfer.getData("text/plain"));
        cartUtils.addToCart(data);
    });

    // Actualizar UI del carrito
    function updateCartUI() {
        cartItemsContainer.innerHTML = "";

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>🛒 Carrito vacío</p>';
            document.getElementById("cart-actions").style.display = "none";
        } else {
            cart.forEach((item, index) => {
                const div = document.createElement("div");
                div.className = "cart-item";
                div.innerHTML = `
                    <img src="${item.imgSrc}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;" />
                    <span>${item.name} - ${item.price}</span>
                    <button class="remove-btn" data-index="${index}">✕</button>
                `;
                cartItemsContainer.appendChild(div);
            });
            document.getElementById("cart-actions").style.display = "flex";
        }

        cartCounter.textContent = cart.length;

        document.querySelectorAll(".remove-btn").forEach(btn => {
            btn.addEventListener("click", function (e) {
                e.stopPropagation(); // Evita que el clic cierre el dropdown
                const index = parseInt(this.dataset.index);
                cart.splice(index, 1);
                cartUtils.saveCart();
            });
        });
    }

    // Búsqueda
    document.getElementById("search-input").addEventListener("input", function () {
        const query = this.value.toLowerCase();
        document.querySelectorAll(".product-card").forEach(card => {
            const name = card.querySelector(".product-name").textContent.toLowerCase();
            card.style.display = name.includes(query) ? "block" : "none";
        });
    });

    // Formulario de suscripción
    document.getElementById("subscription-form").addEventListener("submit", function (e) {
        e.preventDefault();
        this.style.display = "none";
        document.getElementById("subscription-message").classList.add("show");
    });

    // Inicializar UI
    updateCartUI();
});