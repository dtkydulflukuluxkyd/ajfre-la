const stories = [
  {title:"The Azure Chronicle",chapter:"Chapter 12",genre:"Fantasy",tag:"FEATURED",c1:"#2768a5",c2:"#171b4b",trend:"Popular"},
  {title:"A Promise in Spring",chapter:"Chapter 08",genre:"Romance",tag:"ROMANCE",c1:"#bd7cae",c2:"#47315f",trend:"Popular"},
  {title:"Beyond the Last Gate",chapter:"Chapter 21",genre:"Action",tag:"ACTION",c1:"#c16d4c",c2:"#38264f",trend:"Popular"},
  {title:"Midnight Letters",chapter:"Chapter 05",genre:"Drama",tag:"DRAMA",c1:"#5a789d",c2:"#202b48",trend:"Popular"},
  {title:"The Little Star Café",chapter:"Chapter 14",genre:"Comedy",tag:"COMEDY",c1:"#d39a65",c2:"#735078",trend:"New"}
];
const trendingGrid=document.querySelector("#trendingGrid");
const latestList=document.querySelector("#latestList");
const detailDialog=document.querySelector("#detailDialog");
const detailContent=document.querySelector("#detailContent");
function render(list=stories){
  trendingGrid.innerHTML="";
  list.slice(0,4).forEach((s)=>{
    const card=document.createElement("article");
    card.className="story-card";
    card.innerHTML=`<div class="cover" style="--c1:${s.c1};--c2:${s.c2}"><div class="cover-art"></div><span class="cover-label">${s.tag}</span></div><div class="story-meta"><strong>${s.title}</strong><span>${s.chapter} · ${s.genre}</span></div>`;
    card.addEventListener("click",()=>openDetail(s));
    trendingGrid.append(card);
  });
  latestList.innerHTML="";
  list.slice().reverse().forEach((s,i)=>{
    const row=document.createElement("div");row.className="latest-item";
    row.innerHTML=`<div class="mini-cover" style="--c1:${s.c1};--c2:${s.c2}"></div><div class="latest-info"><strong>${s.title}</strong><span>${s.chapter} · ${s.genre}</span></div><span class="updated">${i+1}d ago&nbsp; ›</span>`;
    row.addEventListener("click",()=>openDetail(s));latestList.append(row);
  });
}
function openDetail(s){
  detailContent.innerHTML=`<div class="cover" style="height:180px;--c1:${s.c1};--c2:${s.c2}"><div class="cover-art"></div><span class="cover-label">${s.tag}</span></div><span class="eyebrow">${s.genre.toUpperCase()}</span><h2>${s.title}</h2><p class="muted">Ini adalah judul contoh untuk preview Ajfre.la. Informasi cerita dan chapter dapat diisi melalui sistem admin pada tahap berikutnya.</p><p><strong>${s.chapter}</strong></p><button class="primary-button" id="demoRead">Baca preview →</button>`;
  detailDialog.showModal();
  document.querySelector("#demoRead").addEventListener("click",()=>{detailContent.innerHTML=`<h2>Preview reader</h2><p class="muted">Halaman baca akan diaktifkan setelah database dan konten resmi ditambahkan.</p><button class="primary-button" onclick="document.querySelector('#detailDialog').close()">Tutup</button>`});
}
render();
document.querySelector("#searchInput").addEventListener("input",e=>{
  const q=e.target.value.toLowerCase();
  render(stories.filter(s=>(s.title+" "+s.genre).toLowerCase().includes(q)));
});
document.querySelector("#clearSearch").addEventListener("click",()=>{document.querySelector("#searchInput").value="";render()});
document.querySelector("#focusSearch").addEventListener("click",()=>document.querySelector("#searchInput").focus());
document.querySelectorAll(".genre-chip").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".genre-chip").forEach(b=>b.classList.remove("selected"));btn.classList.add("selected");
  render(btn.dataset.genre==="All"?stories:stories.filter(s=>s.genre===btn.dataset.genre));
}));
document.querySelectorAll("[data-close]").forEach(btn=>btn.addEventListener("click",()=>document.getElementById(btn.dataset.close).close()));
const donateDialog=document.querySelector("#donateDialog");
function showDonate(){donateDialog.showModal()}
document.querySelector("#donateOpen").addEventListener("click",showDonate);
document.querySelector("#mobileDonate").addEventListener("click",showDonate);
document.querySelectorAll("[data-amount]").forEach(btn=>btn.addEventListener("click",()=>{
  const amount=btn.dataset.amount;
  document.querySelector("#donateMessage").textContent=amount==="custom"?"Nominal bebas akan tersedia setelah metode pembayaran dikonfigurasi.":`Pilihan dukungan: Rp${Number(amount).toLocaleString("id-ID")}. Nomor DANA belum diatur.`;
}));
document.querySelector("#menuToggle").addEventListener("click",()=>document.querySelector("#genres").scrollIntoView({behavior:"smooth"}));
document.querySelector("#year").textContent=new Date().getFullYear();
