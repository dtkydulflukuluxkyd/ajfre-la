const stories=[
{id:1,title:"The Azure Chronicle",genre:"Fantasy",status:"Ongoing",chapters:12,updated:"Chapter 12",symbol:"✦",desc:"Di sebuah kerajaan yang menyimpan rahasia langit, seorang pengelana muda menemukan bahwa cahaya biru yang selalu mengikutinya bukanlah kebetulan.",tone:"c1"},
{id:2,title:"A Promise in Spring",genre:"Romance",status:"Ongoing",chapters:8,updated:"Chapter 8",symbol:"❀",desc:"Dua teman lama bertemu kembali saat musim semi. Di antara kenangan dan kesempatan baru, mereka belajar memahami arti sebuah janji.",tone:"c2"},
{id:3,title:"Beyond the Last Gate",genre:"Action",status:"Hiatus",chapters:21,updated:"Chapter 21",symbol:"◇",desc:"Gerbang terakhir menjadi batas antara dunia yang dikenal dan wilayah penuh misteri. Perjalanan dimulai ketika batas itu terbuka.",tone:"c3"},
{id:4,title:"Midnight Letters",genre:"Mystery",status:"Ongoing",chapters:6,updated:"Chapter 6",symbol:"✉",desc:"Surat tanpa nama tiba setiap tengah malam. Setiap pesan membawa petunjuk baru tentang rahasia sebuah kota kecil.",tone:"c4"},
{id:5,title:"The Little Star Café",genre:"Drama",status:"Completed",chapters:16,updated:"Chapter 16",symbol:"☕",desc:"Sebuah kafe mungil menjadi tempat singgah bagi orang-orang dengan cerita yang belum selesai.",tone:"c5"},
{id:6,title:"The Silent Orbit",genre:"Fantasy",status:"Ongoing",chapters:10,updated:"Chapter 10",symbol:"☾",desc:"Di antara bintang-bintang yang sunyi, seorang penjaga muda mencari rumah yang hilang dari peta galaksi.",tone:"c6"},
{id:7,title:"Moonlit Kingdom",genre:"Action",status:"Ongoing",chapters:14,updated:"Chapter 14",symbol:"♜",desc:"Pewaris kerajaan malam harus memilih antara takhta dan kebenaran yang selama ini disembunyikan.",tone:"c7"},
{id:8,title:"A Second Chance",genre:"Romance",status:"Ongoing",chapters:4,updated:"Chapter 4",symbol:"♡",desc:"Kesempatan kedua datang dari arah yang tak terduga. Kali ini, mereka ingin memulai dengan lebih jujur.",tone:"c8"}
];
let activeGenre="All", currentStory=null, currentChapter=1;
const $=s=>document.querySelector(s);
const home=$("#homeView"),detail=$("#detailView"),reader=$("#readerView");
function cover(s,small=false){return `<div class="${small?'mini-cover':'cover '+s.tone}">${small?'':`<span class="cover-symbol">${s.symbol}</span><span class="cover-title">${s.title}</span>`}</div>`}
function renderStories(){
 const q=$("#searchInput").value.toLowerCase();
 const list=stories.filter(s=>(activeGenre==="All"||s.genre===activeGenre)&&(s.title.toLowerCase().includes(q)||s.genre.toLowerCase().includes(q)));
 $("#storyGrid").innerHTML=list.map(s=>`<article class="story-card" data-id="${s.id}">${cover(s)}<div class="story-title">${s.title}</div><div class="story-meta">${s.genre} · ${s.chapters} ch</div></article>`).join("")||'<p class="sub">Belum ada judul yang cocok.</p>';
 $("#latestList").innerHTML=stories.slice(0,5).map(s=>`<div class="latest-item" data-id="${s.id}">${cover(s,true)}<div class="latest-info"><b>${s.title}</b><span>${s.status} · update terbaru</span></div><span class="latest-chapter">${s.updated} →</span></div>`).join("");
}
function showHome(){home.classList.remove("hidden");detail.classList.add("hidden");reader.classList.add("hidden");window.scrollTo(0,0)}
function openDetail(id){currentStory=stories.find(s=>s.id===Number(id));if(!currentStory)return;home.classList.add("hidden");reader.classList.add("hidden");detail.classList.remove("hidden");const s=currentStory;
 $("#detailContent").innerHTML=`<div class="detail-hero"><div class="detail-cover">${s.symbol}</div><div><p class="eyebrow">STORY PROFILE</p><h1 class="detail-title">${s.title}</h1><div class="detail-tags"><span class="tag">${s.genre}</span><span class="tag">${s.status}</span><span class="tag">${s.chapters} chapters</span></div><button class="primary-btn" id="startReading">▶ &nbsp; Start reading</button></div></div><p class="eyebrow">SYNOPSIS</p><p class="detail-desc">${s.desc}</p><div class="chapter-head"><h3>Chapters</h3><span class="tiny-count">${s.chapters} TOTAL</span></div><div id="chapterList">${Array.from({length:s.chapters},(_,i)=>s.chapters-i).map(n=>`<div class="chapter-row" data-chapter="${n}"><span>Chapter ${n}</span><span>${n===s.chapters?'Latest update':'Read chapter'}　›</span></div>`).join("")}</div>`;
 $("#startReading").onclick=()=>openReader(1);$("#chapterList").onclick=e=>{const row=e.target.closest("[data-chapter]");if(row)openReader(Number(row.dataset.chapter))};window.scrollTo(0,0);
}
function openReader(ch){currentChapter=ch;home.classList.add("hidden");detail.classList.add("hidden");reader.classList.remove("hidden");renderReader();window.scrollTo(0,0)}
function renderReader(){const s=currentStory;$("#readerContent").innerHTML=`<h1 class="reader-title">${s.title}</h1><p class="reader-note">Chapter ${currentChapter} · Contoh tampilan reader Ajfre.la</p><div class="reader-page"><span class="star">✦</span><h3>${s.title}</h3><p>Chapter ${currentChapter}</p><p>Ini adalah halaman contoh untuk menguji tampilan membaca. Konten cerita dan gambar chapter milikmu sendiri dapat ditambahkan setelah fitur penyimpanan dan upload disiapkan.</p><p>Selamat membaca.</p></div><div class="reader-controls"><button id="prevChapter" ${currentChapter<=1?'disabled':''}>← Previous</button><button id="chapterListBtn">Chapter list</button><button id="nextChapter" ${currentChapter>=s.chapters?'disabled':''}>Next →</button></div>`;
 $("#prevChapter").onclick=()=>{if(currentChapter>1)openReader(currentChapter-1)};$("#nextChapter").onclick=()=>{if(currentChapter<s.chapters)openReader(currentChapter+1)};$("#chapterListBtn").onclick=()=>openDetail(s.id)}
$("#storyGrid").addEventListener("click",e=>{const card=e.target.closest("[data-id]");if(card)openDetail(card.dataset.id)});
$("#latestList").addEventListener("click",e=>{const item=e.target.closest("[data-id]");if(item)openDetail(item.dataset.id)});
$("#genreChips").addEventListener("click",e=>{const b=e.target.closest("[data-genre]");if(!b)return;activeGenre=b.dataset.genre;document.querySelectorAll(".chip").forEach(x=>x.classList.toggle("active",x===b));renderStories()});
$("#searchInput").addEventListener("input",renderStories);
$("#backHome").onclick=showHome;$("#backDetail").onclick=()=>openDetail(currentStory.id);$("#readerTopHome").onclick=showHome;$("#homeLink").onclick=e=>{e.preventDefault();showHome()};$("#navHome").onclick=e=>{e.preventDefault();showHome()};$("#navExplore").onclick=e=>{e.preventDefault();showHome();$("#searchInput").focus();window.scrollTo(0,250)};
$("#navSupport").onclick=()=>$("#supportModal").classList.remove("hidden");$("#closeSupport").onclick=()=>$("#supportModal").classList.add("hidden");$("#supportModal").onclick=e=>{if(e.target.id==="supportModal")$("#supportModal").classList.add("hidden")};
$("#searchToggle").onclick=()=>{showHome();$("#searchInput").focus();$("#searchArea").scrollIntoView({behavior:"smooth",block:"center"})};
renderStories();
