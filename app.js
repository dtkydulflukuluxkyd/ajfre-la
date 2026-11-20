const $=s=>document.querySelector(s);
const home=$("#homeView"),detail=$("#detailView"),reader=$("#readerView"),admin=$("#adminView");
let db=null, stories=[], currentStory=null, currentChapter=null, activeGenre="All";
const configured=()=>window.AJFRE_SUPABASE_URL&&window.AJFRE_SUPABASE_ANON_KEY&&!window.AJFRE_SUPABASE_URL.includes("PASTE_")&&!window.AJFRE_SUPABASE_ANON_KEY.includes("PASTE_");
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.remove("hidden");setTimeout(()=>t.classList.add("hidden"),3200)}
function show(view){[home,detail,reader,admin].forEach(v=>v.classList.add("hidden"));view.classList.remove("hidden");window.scrollTo(0,0)}
function publicUrl(bucket,path){if(!path||!db)return "";return db.storage.from(bucket).getPublicUrl(path).data.publicUrl}
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
async function loadStories(){
 if(!db){$("#storyGrid").innerHTML='<p class="sub">Hubungkan Supabase dulu. Ikuti langkah di README V4.</p>';$("#storyCount").textContent="SETUP REQUIRED";return}
 const {data,error}=await db.from("manhwa").select("*").order("created_at",{ascending:false});
 if(error){$("#storyGrid").innerHTML='<p class="sub">Gagal memuat katalog. Periksa SQL dan koneksi Supabase.</p>';return}
 stories=data||[];renderStories();
}
function renderStories(){
 const q=$("#searchInput").value.toLowerCase();
 const list=stories.filter(s=>(activeGenre==="All"||s.genre===activeGenre)&&(`${s.title} ${s.genre}`.toLowerCase().includes(q)));
 $("#storyCount").textContent=`${stories.length} TITLES`;
 $("#storyGrid").innerHTML=list.map(s=>{const url=publicUrl("covers",s.cover_path);return `<article class="story-card" data-id="${s.id}"><div class="cover" ${url?`style="background-image:url('${url}')"`:""}>${url?"": "✦"}</div><div class="story-title">${escapeHtml(s.title)}</div><div class="story-meta">${escapeHtml(s.genre)} · ${escapeHtml(s.status)}</div></article>`}).join("")||'<p class="sub">Belum ada judul. Admin bisa menambahkan cerita pertama.</p>';
 $("#latestList").innerHTML=list.slice(0,5).map(s=>`<div class="latest-item" data-id="${s.id}"><div class="mini-cover" style="${s.cover_path?`background-image:url('${publicUrl("covers",s.cover_path)}')`:""}"></div><div class="latest-info"><b>${escapeHtml(s.title)}</b><span>${escapeHtml(s.status)} · ${escapeHtml(s.genre)}</span></div><span class="latest-chapter">Buka →</span></div>`).join("");
}
async function openDetail(id){
 currentStory=stories.find(s=>String(s.id)===String(id));if(!currentStory)return;
 show(detail);const s=currentStory,url=publicUrl("covers",s.cover_path);
 $("#detailContent").innerHTML=`<div class="detail-hero"><div class="detail-cover" ${url?`style="background-image:url('${url}')"`:""}></div><div><p class="eyebrow">STORY PROFILE</p><h1 class="detail-title">${escapeHtml(s.title)}</h1><div class="detail-tags"><span class="tag">${escapeHtml(s.genre)}</span><span class="tag">${escapeHtml(s.status)}</span></div></div></div><p class="eyebrow">SYNOPSIS</p><p class="detail-desc">${escapeHtml(s.synopsis)}</p><div class="chapter-head"><h3>Chapters</h3><span class="tiny-count" id="chapterCount">LOADING</span></div><div id="chapterList" class="sub">Memuat chapter...</div>`;
 const {data,error}=await db.from("chapters").select("*").eq("manhwa_id",s.id).order("chapter_number",{ascending:false});
 if(error){$("#chapterList").textContent="Gagal memuat daftar chapter.";return}
 $("#chapterCount").textContent=`${data.length} CHAPTERS`;
 $("#chapterList").innerHTML=data.map(c=>`<div class="chapter-row" data-chapter="${c.id}"><span>Chapter ${c.chapter_number}${c.chapter_title?" — "+escapeHtml(c.chapter_title):""}</span><span>Read →</span></div>`).join("")||"Belum ada chapter.";
 $("#chapterList").onclick=e=>{const row=e.target.closest("[data-chapter]");if(row)openReader(row.dataset.chapter)};
}
async function openReader(chapterId){
 const {data:c,error}=await db.from("chapters").select("*").eq("id",chapterId).single();
 if(error){toast("Tidak bisa membuka chapter.");return}
 currentChapter=c;show(reader);
 const pages=(c.page_paths||[]).map(p=>`<img loading="lazy" src="${publicUrl("chapter-pages",p)}" alt="Halaman chapter">`).join("");
 $("#readerContent").innerHTML=`<h1 class="reader-title">${escapeHtml(currentStory.title)}</h1><p class="reader-note">Chapter ${c.chapter_number}${c.chapter_title?" · "+escapeHtml(c.chapter_title):""}</p><div class="reader-pages">${pages||'<p class="sub">Chapter ini belum memiliki halaman.</p>'}</div><div class="reader-controls"><button id="prevChapter">← Previous</button><button id="chapterListBtn">Chapter list</button><button id="nextChapter">Next →</button></div>`;
 const {data:all}=await db.from("chapters").select("id,chapter_number").eq("manhwa_id",currentStory.id).order("chapter_number");
 const index=all.findIndex(x=>x.id===c.id);
 $("#prevChapter").disabled=index<=0;$("#nextChapter").disabled=index>=all.length-1;
 $("#prevChapter").onclick=()=>index>0&&openReader(all[index-1].id);
 $("#nextChapter").onclick=()=>index<all.length-1&&openReader(all[index+1].id);
 $("#chapterListBtn").onclick=()=>openDetail(currentStory.id);
}
function resetStoryForm(){["storyId","storyTitle","storySynopsis"].forEach(id=>$("#"+id).value="");$("#storyCover").value="";$("#formTitle").textContent="Tambah manhwa";$("#cancelEdit").classList.add("hidden")}
async function refreshAdmin(){
 const {data}=await db.from("manhwa").select("*").order("created_at",{ascending:false});
 const rows=data||[];
 $("#chapterStory").innerHTML=rows.map(s=>`<option value="${s.id}">${escapeHtml(s.title)}</option>`).join("");
 $("#adminStories").innerHTML=rows.map(s=>`<div class="admin-story"><div style="flex:1;min-width:0"><b>${escapeHtml(s.title)}</b><span class="hint">${escapeHtml(s.genre)} · ${escapeHtml(s.status)}</span></div><div class="actions"><button data-edit="${s.id}">Edit</button><button data-delete="${s.id}">Hapus</button></div></div>`).join("")||'<p class="hint">Belum ada judul.</p>';
 $("#adminStories").onclick=async e=>{
 const edit=e.target.closest("[data-edit]");if(edit){const s=rows.find(x=>String(x.id)===edit.dataset.edit);$("#storyId").value=s.id;$("#storyTitle").value=s.title;$("#storySynopsis").value=s.synopsis;$("#storyGenre").value=s.genre;$("#storyStatus").value=s.status;$("#formTitle").textContent="Edit manhwa";$("#cancelEdit").classList.remove("hidden");window.scrollTo(0,0)}
 const del=e.target.closest("[data-delete]");if(del&&confirm("Hapus judul ini beserta daftar chapternya?")){const {error}=await db.from("manhwa").delete().eq("id",del.dataset.delete);if(error)toast(error.message);else{toast("Judul dihapus.");await refreshAdmin();await loadStories()}}
 };
}
async function checkSession(){
 if(!db)return;
 const {data:{session}}=await db.auth.getSession();
 $("#loginPanel").classList.toggle("hidden",!!session);$("#dashboardPanel").classList.toggle("hidden",!session);
 if(session)await refreshAdmin();
}
$("#loginBtn").onclick=async()=>{const {error}=await db.auth.signInWithPassword({email:$("#loginEmail").value,password:$("#loginPassword").value});$("#loginMessage").textContent=error?error.message:"Login berhasil.";if(!error)await checkSession()};
$("#logoutBtn").onclick=async()=>{await db.auth.signOut();await checkSession();toast("Sudah logout.")};
$("#saveStory").onclick=async()=>{
 const id=$("#storyId").value,title=$("#storyTitle").value.trim();if(!title){toast("Isi judul dulu.");return}
 const msg=$("#storyMessage"),file=$("#storyCover").files[0];msg.textContent="Menyimpan...";
 let cover_path=null;
 if(file){const ext=(file.name.split(".").pop()||"jpg").toLowerCase();cover_path=`${crypto.randomUUID()}.${ext}`;const up=await db.storage.from("covers").upload(cover_path,file,{upsert:false,contentType:file.type});if(up.error){msg.textContent=up.error.message;return}}
 const payload={title,synopsis:$("#storySynopsis").value.trim(),genre:$("#storyGenre").value,status:$("#storyStatus").value};
 if(cover_path)payload.cover_path=cover_path;
 const result=id?await db.from("manhwa").update(payload).eq("id",id):await db.from("manhwa").insert(payload);
 if(result.error){msg.textContent=result.error.message;return}
 msg.textContent="Tersimpan!";resetStoryForm();await refreshAdmin();await loadStories();
};
$("#cancelEdit").onclick=resetStoryForm;
$("#saveChapter").onclick=async()=>{
 const storyId=$("#chapterStory").value,num=Number($("#chapterNumber").value),files=[...$("#chapterPages").files],msg=$("#chapterMessage");
 if(!storyId||!num||!files.length){msg.textContent="Pilih judul, nomor chapter, dan gambar halaman.";return}
 if(files.length>60){msg.textContent="Maksimal 60 gambar per sekali upload.";return}
 msg.textContent="Mengupload halaman...";
 const paths=[];
 for(let i=0;i<files.length;i++){const f=files[i],ext=(f.name.split(".").pop()||"jpg").toLowerCase(),path=`${storyId}/${num}/${String(i+1).padStart(3,"0")}-${crypto.randomUUID()}.${ext}`;const up=await db.storage.from("chapter-pages").upload(path,f,{contentType:f.type});if(up.error){msg.textContent=`Gagal di halaman ${i+1}: ${up.error.message}`;return}paths.push(path)}
 const {error}=await db.from("chapters").upsert({manhwa_id:Number(storyId),chapter_number:num,chapter_title:$("#chapterName").value.trim(),page_paths:paths},{onConflict:"manhwa_id,chapter_number"});
 msg.textContent=error?error.message:"Chapter berhasil diupload!";
 if(!error){$("#chapterNumber").value="";$("#chapterName").value="";$("#chapterPages").value="";await loadStories()}
};
$("#adminOpen").onclick=$("#navAdmin").onclick=async()=>{show(admin);await checkSession()};
$("#adminBack").onclick=()=>show(home);
$("#backHome").onclick=()=>show(home);
$("#backDetail").onclick=()=>openDetail(currentStory.id);
$("#readerHome").onclick=()=>show(home);
$("#homeLink").onclick=e=>{e.preventDefault();show(home)};
$("#navHome").onclick=e=>{e.preventDefault();show(home)};
$("#navExplore").onclick=e=>{e.preventDefault();show(home);$("#searchInput").focus()};
$("#searchToggle").onclick=()=>{$("#searchInput").focus();$("#searchArea").scrollIntoView({behavior:"smooth",block:"center"})};
$("#storyGrid").onclick=e=>{const card=e.target.closest("[data-id]");if(card)openDetail(card.dataset.id)};
$("#latestList").onclick=e=>{const card=e.target.closest("[data-id]");if(card)openDetail(card.dataset.id)};
$("#genreChips").onclick=e=>{const b=e.target.closest("[data-genre]");if(!b)return;activeGenre=b.dataset.genre;document.querySelectorAll(".chip").forEach(x=>x.classList.toggle("active",x===b));renderStories()};
$("#searchInput").oninput=renderStories;
async function init(){
 if(!configured()){await loadStories();return}
 db=window.supabase.createClient(window.AJFRE_SUPABASE_URL,window.AJFRE_SUPABASE_ANON_KEY);
 await loadStories();await checkSession();
 db.auth.onAuthStateChange(()=>checkSession());
}
init();
