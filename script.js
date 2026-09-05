let products=[]; let currentCategory="All";
async function loadProducts(){
  try{
    const r=await fetch("products.json?v="+Date.now(),{cache:"no-store"});
    if(!r.ok) throw new Error("Could not load products");
    products=await r.json(); renderProducts();
  }catch(e){
    document.getElementById("products").innerHTML='<div class="empty">Products could not be loaded. Please try again later.</div>';
  }
}
function renderProducts(){
  const q=(document.getElementById("search")?.value||"").toLowerCase().trim();
  const filtered=products.filter(p=>(currentCategory==="All"||p.category===currentCategory)&&
    ((p.name||"").toLowerCase().includes(q)||(p.category||"").toLowerCase().includes(q)||(p.platform||"").toLowerCase().includes(q)));
  document.getElementById("count").textContent=`${filtered.length} products`;
  const box=document.getElementById("products");
  if(!filtered.length){box.innerHTML='<div class="empty">No products found. Try another search.</div>';return;}
  box.innerHTML=filtered.map(p=>{
    const pic=p.image?`<img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.name)}" loading="lazy">`:`<div class="placeholder">${escapeHtml(p.emoji||"🛍️")}</div>`;
    return `<article class="card"><div class="pic">${pic}</div><div class="info">
      <div class="platform">${escapeHtml(p.platform||"")}</div><div class="name">${escapeHtml(p.name||"")}</div>
      <div class="price">${escapeHtml(p.price||"")}</div><div class="rating">${escapeHtml(p.rating||"")}</div>
      <a class="buy" href="${escapeAttr(p.url||"#")}" target="_blank" rel="nofollow sponsored noopener">BUY NOW →</a>
    </div></article>`;
  }).join("");
}
function setCategory(cat){currentCategory=cat;document.querySelectorAll(".cat").forEach(b=>b.classList.toggle("active",b.dataset.category===cat));renderProducts();}
function toggleMenu(){document.getElementById("nav").classList.toggle("show")}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function escapeAttr(s){return escapeHtml(s)}
loadProducts();