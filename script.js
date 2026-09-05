const products = [
  {name:"Example Wireless Earbuds",category:"Electronics",price:"₹999",rating:"⭐ 4.3",platform:"Amazon",emoji:"🎧",url:"https://www.amazon.in/"},
  {name:"Example Smart Watch",category:"Electronics",price:"₹1,499",rating:"⭐ 4.4",platform:"Flipkart",emoji:"⌚",url:"https://www.flipkart.com/"},
  {name:"Example Home Organizer",category:"Home",price:"₹399",rating:"⭐ 4.2",platform:"Amazon",emoji:"🏠",url:"https://www.amazon.in/"},
  {name:"Example Casual T-Shirt",category:"Fashion",price:"₹499",rating:"⭐ 4.1",platform:"Meesho",emoji:"👕",url:"https://www.meesho.com/"},
  {name:"Example Desk Lamp",category:"Home",price:"₹699",rating:"⭐ 4.5",platform:"Amazon",emoji:"💡",url:"https://www.amazon.in/"},
  {name:"Example Beauty Kit",category:"Beauty",price:"₹599",rating:"⭐ 4.3",platform:"Flipkart",emoji:"✨",url:"https://www.flipkart.com/"}
];
let currentCategory="All";

function renderProducts(){
  const q=document.getElementById("search").value.toLowerCase().trim();
  const filtered=products.filter(p=>(currentCategory==="All"||p.category===currentCategory)&&
    (p.name.toLowerCase().includes(q)||p.category.toLowerCase().includes(q)||p.platform.toLowerCase().includes(q)));
  document.getElementById("count").textContent=`${filtered.length} products`;
  const box=document.getElementById("products");
  if(!filtered.length){box.innerHTML='<div class="empty">No products found. Try another search.</div>';return;}
  box.innerHTML=filtered.map(p=>`
    <article class="card">
      <div class="pic"><div class="placeholder">${p.emoji}</div></div>
      <div class="info">
        <div class="platform">${p.platform}</div>
        <div class="name">${escapeHtml(p.name)}</div>
        <div class="price">${escapeHtml(p.price)}</div>
        <div class="rating">${escapeHtml(p.rating)}</div>
        <a class="buy" href="${p.url}" target="_blank" rel="nofollow sponsored noopener">BUY NOW →</a>
      </div>
    </article>`).join("");
}
function setCategory(cat){
  currentCategory=cat;
  document.querySelectorAll(".cat").forEach(b=>b.classList.toggle("active",b.dataset.category===cat));
  renderProducts();
}
function toggleMenu(){document.getElementById("nav").classList.toggle("show")}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
renderProducts();
