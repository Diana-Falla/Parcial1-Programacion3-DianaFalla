import type { Product } from "../../../types/product";

const container = document.getElementById("cart")!;
const totalEl = document.getElementById("total")!;

type CartItem = Product & { quantity: number };

function getCart(): CartItem[] {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function renderCart() {
  const cart = getCart();

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p>El carrito está vacío</p>";
    totalEl.textContent = "";
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const div = document.createElement("div");

    const subtotal = item.precio * item.quantity;
    total += subtotal;

    div.innerHTML = `
      <h3>${item.nombre}</h3>
      <p>Precio: $${item.precio}</p>
      <p>Cantidad: ${item.quantity}</p>
      <p>Subtotal: $${subtotal}</p>

      <button class="incrementa" data-id="${item.id}">+</button>
      <button class="decrese" data-id="${item.id}">-</button>
      <button class="Eliminar" data-id="${item.id}">Eliminar</button>
    `;

    container.appendChild(div);
  });

  totalEl.textContent = `Total: $${total}`;
}

container.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  const idAttr = target.getAttribute("data-id");
   if (!idAttr) return;

  const id = Number(idAttr);

  let cart = getCart();

  if (target.classList.contains("incrementa")) {
    cart = cart.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
  }

  if (target.classList.contains("decrese")) {
    cart = cart.map(item =>
      item.id === id ? { ...item, quantity: item.quantity - 1 } : item
    ).filter(item => item.quantity > 0);
  }

  if (target.classList.contains("Eliminar")) {
    cart = cart.filter(item => item.id !== id);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
});

const clearBtn = document.getElementById("clearCart");

clearBtn?.addEventListener("click", () => {
  localStorage.removeItem("cart");
  renderCart();
});


renderCart();