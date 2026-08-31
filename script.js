const SIZE=10;
const types={
 house:{emoji:"🏠",xp:25,pop:4},
 farm:{emoji:"🌾",xp:20,pop:0},
 bakery:{emoji:"🏭",xp:45,pop:2},
 market:{emoji:"🏪",xp:60,pop:3},
 road:{emoji:"🛣️",xp:5,pop:0},
 tree:{emoji:"🌳",xp:3,pop:0}
};
let state={coins:500,xp:0,level:1,population:0,cells:Array(SIZE*SIZE).fill(null)};

const town=document.getElementById("town");
const toast=document.getElementById("toast");

function showToast(msg){
  toast.textContent=msg; toast.classList.add("show");
  clearTimeout(showToast.t); showToast.t=setTimeout(()=>toast.classList.remove("show"),1400);
}
function render(){
  town.innerHTML="";
  state.cells.forEach((item,i)=>{
    const c=document.createElement("div"); c.className="cell";
    if(item){
      const s=document.createElement("span"); s.className="building "+(item==="road"?"road":"");
      s.textContent=types[item].emoji; c.appendChild(s);
      c.title=types[item].emoji+" "+item;
    }
    c.onclick=()=>place(i);
    town.appendChild(c);
  });
  document.getElementById("coins").textContent=state.coins;
  document.getElementById("xp").textContent=state.xp;
  document.getElementById("level").textContent=state.level;
  document.getElementById("population").textContent=state.population;
  const need=state.level*100;
  document.getElementById("xpText").textContent=`${state.xp} / ${need} XP`;
  document.getElementById("xpFill").style.width=Math.min(100,state.xp/need*100)+"%";
}
function addXP(n){
  state.xp+=n;
  while(state.xp>=state.level*100){
    state.xp-=state.level*100; state.level++;
    state.coins+=100;
    showToast("🎉 Level Up! +100 🪙");
  }
}
function place(i){
  if(state.cells[i]){ showToast("Tap an empty tile to build."); return; }
  const selected=document.querySelector(".build.selected");
  if(!selected){showToast("Choose a building first.");return}
  const type=selected.dataset.type,cost=+selected.dataset.cost;
  if(state.coins<cost){showToast("Not enough coins.");return}
  state.coins-=cost; state.cells[i]=type;
  state.population+=types[type].pop; addXP(types[type].xp);
  document.querySelectorAll(".build").forEach(b=>b.classList.remove("selected"));
  save(false); render();
}
document.querySelectorAll(".build").forEach(b=>b.addEventListener("click",()=>{
  document.querySelectorAll(".build").forEach(x=>x.classList.remove("selected"));
  b.classList.add("selected"); showToast("Now tap an empty tile.");
}));
document.getElementById("collect").onclick=()=>{
  const buildings=state.cells.filter(Boolean).length;
  if(!buildings){showToast("Build something first.");return}
  const income=buildings*10+state.population*2;
  state.coins+=income; addXP(10); render(); save(false);
  showToast(`💰 +${income} coins`);
};
document.getElementById("sellBread").onclick=()=>{
  if(!state.cells.includes("bakery")){showToast("Build a Bakery first.");return}
  state.coins+=120; addXP(15); render(); save(false); showToast("🍞 Order completed! +120 🪙");
};
function save(manual=true){
  localStorage.setItem("gCitySave",JSON.stringify(state));
  if(manual)showToast("💾 Game saved!");
}
function load(){
  try{
    const s=JSON.parse(localStorage.getItem("gCitySave"));
    if(s&&Array.isArray(s.cells)) state=s;
  }catch(e){}
}
document.getElementById("save").onclick=()=>save(true);
document.getElementById("reset").onclick=()=>{
  if(confirm("Start a new G City game?")){
    localStorage.removeItem("gCitySave");
    state={coins:500,xp:0,level:1,population:0,cells:Array(SIZE*SIZE).fill(null)};
    render(); showToast("🔄 New town started!");
  }
};
load(); render();
