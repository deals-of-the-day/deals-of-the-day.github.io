let products=[]; let editIndex=-1;
const $=id=>document.getElementById(id);
function settings(){return {owner:$("owner").value.trim(),repo:$("repo").value.trim(),branch:$("branch").value.trim()||"main",token:$("token").value.trim()};}
function loadSettings(){try{const s=JSON.parse(localStorage.getItem("deals_admin")||"{}");["owner","repo","branch","token"].forEach(k=>{if(s[k]) $(k).value=s[k]});}catch{}}
function saveSettings(){const s=settings();localStorage.setItem("deals_admin",JSON.stringify(s));$("status").textContent="Connection saved on this device."; $("status").className="status ok";}
function clearSettings(){localStorage.removeItem("deals_admin");["owner","repo","branch","token"].forEach(k=>$(k).value="");$("branch").value="main";setStatus("Saved connection cleared.","");}
function setStatus(t,c=""){ $("status").textContent=t; $("status").className="status "+c;}
async function api(path,opts={}){const s=settings(); if(!s.owner||!s.repo||!s.token) throw new Error("Enter GitHub username, repository and token first."); const r=await fetch("https://api.github.com/repos/"+encodeURIComponent(s.owner)+"/"+encodeURIComponent(s.repo)+"/contents/"+path,{...opts,headers:{"Accept":"application/vnd.github+json","Authorization":"Bearer "+s.token,"X-GitHub-Api-Version":"2022-11-28",...(opts.headers||{})}}); if(!r.ok) throw new Error((await r.text()).slice(0,300)); return r.json();}
function b64(s){return btoa(unescape(encodeURIComponent(s)))} function unb64(s){return decodeURIComponent(escape(atob(s.replace(/\n/g,""))))}
async function load(){loadSettings();try{const d=await api("products.json?ref="+encodeURIComponent(settings().branch));products=JSON.parse(unb64(d.content));render();setStatus("Products loaded.","ok");}catch(e){setStatus("Could not load products: "+e.message,"err");}}
function render(){const box=$("editor");box.innerHTML=products.map((p,i)=>`
<div class="product-editor">
<div class="editor-top"><strong>${esc(p.name||"Untitled")}</strong><div><button onclick="editProduct(${i})">Edit</button><button class="danger" onclick="deleteProduct(${i})">Delete</button></div></div>
<div class="mini">${esc(p.platform||"")} · ${esc(p.category||"")} · ${esc(p.price||"")}</div>
</div>`).join("")||'<p class="muted">No products yet.</p>';}
function newProduct(){editIndex=-1;showForm({name:"",category:"Electronics",price:"",rating:"⭐ 4.5",platform:"Amazon",emoji:"🛍️",image:"",url:""});}
function editProduct(i){editIndex=i;showForm(products[i]);}
function showForm(p){$("editor").innerHTML=`<div class="product-form">
<div class="form-grid"><label>Product name<input id="f_name" value="${esc(p.name)}"></label>
<label>Category<select id="f_category">${["Electronics","Home","Fashion","Beauty"].map(x=>`<option ${x===p.category?"selected":""}>${x}</option>`).join("")}</select></label>
<label>Price<input id="f_price" value="${esc(p.price)}" placeholder="₹999"></label><label>Rating<input id="f_rating" value="${esc(p.rating)}" placeholder="⭐ 4.5"></label>
<label>Platform<input id="f_platform" value="${esc(p.platform)}" placeholder="Amazon"></label><label>Emoji fallback<input id="f_emoji" value="${esc(p.emoji||"🛍️")}"></label>
<label class="full">Product image URL<input id="f_image" value="${esc(p.image||"")}" placeholder="https://..."></label>
<label class="full">Amazon / affiliate URL<input id="f_url" value="${esc(p.url)}" placeholder="Paste your Amazon Associates link here"></label></div>
<div class="actions"><button class="primary" onclick="saveProduct()">Save product</button><button onclick="render()">Cancel</button></div></div>`;}
function val(id){return $(id).value.trim()}
function saveProduct(){const p={name:val("f_name"),category:val("f_category"),price:val("f_price"),rating:val("f_rating"),platform:val("f_platform"),emoji:val("f_emoji"),image:val("f_image"),url:val("f_url")};if(!p.name||!p.url){alert("Product name and affiliate URL are required.");return;}if(editIndex<0)products.push(p);else products[editIndex]=p;render();publish();}
function deleteProduct(i){if(confirm("Delete this product?")){products.splice(i,1);render();publish();}}
async function publish(){try{const old=await api("products.json?ref="+encodeURIComponent(settings().branch));const body={message:"Update products",content:b64(JSON.stringify(products,null,2)+"\n"),sha:old.sha,branch:settings().branch};await api("products.json",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});setStatus("Published successfully. Your website will update shortly.","ok");}catch(e){setStatus("Saved on screen, but GitHub publish failed: "+e.message,"err");}}
function esc(s){return String(s??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
load();