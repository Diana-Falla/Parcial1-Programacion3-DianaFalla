import { PRODUCTS, getCategories } from "../../../data/data";
import type { Product } from "../../../types/product";

const container = document.getElementById("products")!;
const searchInput = document.getElementById("search") as HTMLInputElement;
const categoriesContainer = document.getElementById("categories")!;

function renderProducts(list: Product[]) {
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p>No se encontraron productos</p>";
    return;
  }

  list.forEach(product => {
    const div = document.createElement("div");

    div.innerHTML = `
      <h3>${product.nombre}</h3>
      <p>Precio: $${product.precio}</p>
      <img src="/src/assets/${product.imagen}" width="120" />
      <button data-id="${product.id}">Agregar</button>
    `;

    container.appendChild(div);
  });
}

function addToCart(product: Product) {
  const cart: (Product & { quantity: number })[] =
  JSON.parse(localStorage.getItem("cart") || "[]");

  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Producto agregado al carrito");
}

container.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;

  if (target.tagName === "BUTTON") {
    const id = Number(target.getAttribute("data-id"));
    const product = PRODUCTS.find(p => p.id === id);

    if (product) {
      addToCart(product);
    }
  }
})

searchInput.addEventListener("input", () => {
  const text = searchInput.value.toLowerCase();

  const filtered = PRODUCTS.filter(p =>
    p.nombre.toLowerCase().includes(text)
  );

  renderProducts(filtered);
})

function renderCategories() {
  const categories = getCategories();

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat.nombre;

    btn.onclick = () => {
      const filtered = PRODUCTS.filter(p =>
        p.categorias.some(c => c.id === cat.id)
      );

      renderProducts(filtered);
    };

    categoriesContainer.appendChild(btn);
  });

  // botón "todos"
  const allBtn = document.createElement("button");
  allBtn.textContent = "Todos";

  allBtn.onclick = () => renderProducts(PRODUCTS);

  categoriesContainer.appendChild(allBtn);
}

renderProducts(PRODUCTS);
renderCategories();