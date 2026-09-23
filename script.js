const products = [
  {id:1, name:"New York Crochet Snapback", city:"NY", category:"NY", price:950.99, cls:""},
  {id:2, name:"Los Angeles Crochet Snapback", city:"LA", category:"LA", price:950.99, cls:"la"},
  {id:3, name:"Brooklyn Crochet Snapback", city:"BK", category:"Other", price:950.99, cls:"other"},
  {id:4, name:"NYC Classic Crochet Snapback", city:"NY", category:"NY", price:950.99, cls:""},
  {id:5, name:"LA Classic Crochet Snapback", city:"LA", category:"LA", price:950.99, cls:"la"},
  {id:6, name:"City Edition Crochet Snapback", city:"CITY", category:"Other", price:950.99, cls:"other"}
];

let currentFilter = "All";
let cart = JSON.parse(localStorage.getItem("249stitch-cart") || "[]");

function money(value){
  return "EGP " + value.toLocaleString("en-EG", {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

function renderProducts(){
  const grid = document.getElementById("product-grid");
  const search = (document.getElementById("search-input")?.value || "").toLowerCase();

  const filtered = products.filter(p =>
    (currentFilter === "All" || p.category === currentFilter) &&
    (p.name.toLowerCase().includes(search) || p.city.toLowerCase().includes(search))
  );

  grid.innerHTML = filtered.map(p => `
    <article class="product">
      <div class="product-image ${p.cls}">
        <span class="product-city">${p.city}</span>
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <div class="product-meta">
          <span>${money(p.price)}</span>
          <button class="add-btn" onclick="addToCart(${p.id})">Add to bag</button>
        </div>
      </div>
    </article>
  `).join("") || `<p>No products found.</p>`;
}

function setFilter(filter){
  currentFilter = filter;
  document.querySelectorAll(".filter").forEach(btn =>
    btn.classList.toggle("active", btn.dataset.filter === filter)
  );
  renderProducts();
  document.getElementById("shop").scrollIntoView({behavior:"smooth"});
}

function addToCart(id){
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);
  if(existing) existing.qty++;
  else cart.push({...product, qty:1});
  saveCart();
  openCart();
}

function removeFromCart(id){
  cart = cart.filter(item => item.id !== id);
  saveCart();
}

function changeQty(id, delta){
  const item = cart.find(p => p.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) removeFromCart(id);
  saveCart();
}

function saveCart(){
  localStorage.setItem("249stitch-cart", JSON.stringify(cart));
  renderCart();
}

function renderCart(){
  document.getElementById("cart-count").textContent = cart.reduce((sum,p)=>sum+p.qty,0);
  const box = document.getElementById("cart-items");
  const total = cart.reduce((sum,p)=>sum+p.price*p.qty,0);
  document.getElementById("cart-total").textContent = money(total);

  if(!cart.length){
    box.innerHTML = `<p style="color:#777;font-size:13px">Your bag is empty.</p>`;
    return;
  }

  box.innerHTML = cart.map(p => `
    <div class="cart-item">
      <div class="cart-thumb">${p.city}</div>
      <div>
        <strong style="font-size:12px">${p.name}</strong>
        <div style="font-size:11px;color:#777;margin-top:5px">${money(p.price)}</div>
        <div style="margin-top:8px;font-size:11px">
          <button onclick="changeQty(${p.id},-1)">−</button>
          ${p.qty}
          <button onclick="changeQty(${p.id},1)">+</button>
        </div>
      </div>
      <button onclick="removeFromCart(${p.id})" style="border:0;background:none">×</button>
    </div>
  `).join("");
}

function openCart(){
  document.getElementById("cart").classList.add("open");
  document.getElementById("overlay").classList.add("open");
}
function closeCart(){
  document.getElementById("cart").classList.remove("open");
  document.getElementById("overlay").classList.remove("open");
}
function toggleMenu(){
  const menu = document.getElementById("mobile-menu");
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}
function toggleSearch(){
  document.getElementById("search-bar").classList.toggle("open");
}
function checkout(){
  if(!cart.length){ alert("Your bag is empty."); return; }
  const lines = cart.map(p => `${p.name} x${p.qty} — ${money(p.price*p.qty)}`);
  const total = cart.reduce((sum,p)=>sum+p.price*p.qty,0);
  const message = encodeURIComponent(
    `Hi 249_stitch! I'd like to place an order:\n\n${lines.join("\n")}\n\nTotal: ${money(total)}`
  );
  alert("The order message is ready. Replace the WhatsApp number in the website code to activate WhatsApp checkout.");
  // Example once you have a number:
  // window.open("https://wa.me/YOUR_NUMBER?text=" + message, "_blank");
}
function subscribe(event){
  event.preventDefault();
  document.getElementById("subscribe-message").textContent = "You're on the list — welcome to 249_stitch.";
  document.getElementById("email").value = "";
}

renderProducts();
renderCart();
