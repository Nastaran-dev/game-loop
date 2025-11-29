let score = 0;
const _score = document.getElementById("score");
const basket = document.getElementById("basket");
const _Ok = document.getElementById("okAlert");
const lozer_ok = document.getElementById('lozer');
let gemestop = true;

const audioBubbles = document.getElementById('Bubbles');
const audioBomb = document.getElementById('Bomb');
const audioWinner = document.getElementById('Winner');
const audioLozer = document.getElementById('Lozer');

let arr_IceCream = [
  "img/ice1.png","img/ice2.png","img/ice3.png","img/ice4.png","img/ice5.png",
  "img/ice6.png","img/ice7.png","img/ice8.png","img/ice5.png",
  "img/bomb.png","img/bomb.png","img/bomb.png"
];

function Myrand() {
  let RandW = Math.floor(Math.random() * (window.innerWidth - 100));
  let img_ice = document.createElement("img");
  img_ice.src = arr_IceCream[Math.floor(Math.random() * arr_IceCream.length)];
  img_ice.classList.add("img-IceCream");
  img_ice.style.top = "-50px";
  img_ice.style.left = RandW + "px";
  // img_ice.draggable = false;
  img_ice.dataset.eaten = "false";
  document.body.appendChild(img_ice);
  MoveDownIce(img_ice);
}

for(let i=0;i<15;i++){
  Myrand();
}

function MoveDownIce(ice){

  let speed = Math.random() * 4 + 1.2;

  if(window.innerWidth <= 768){
    speed = Math.random() * 2 + 1; 
  }

  const maxFall = window.innerHeight*0.8; // سقوط محدود تا 100vh

  function fall(){
    if(!gemestop) return;

    let top = ice.computedStyleMap().get('top').value;
    ice.style.top = top + speed + "px";

    // محدودیت دقیق سقوط (100vh)
    if(top > maxFall){
      ice.style.top = "-50px";
      ice.style.left = Math.random() * (window.innerWidth - 100) + "px"; 

      speed = Math.random() * 4 + 1;
      if(window.innerWidth <= 768){
        speed = Math.random() * 2 + 0.8;
      }

      ice.dataset.eaten = "false";
    }

    requestAnimationFrame(fall);
  }

  fall();
}



function eatice(_eatice){
  _eatice.style.transition = "0.25s ease-out";
  _eatice.style.transform = "scale(1.5)";
  _eatice.style.opacity = "0";
  _eatice.dataset.eaten = "true"; 

  setTimeout(()=>{
    resetIce(_eatice);
  }, 250);
}
function resetIce(_eatice){
  _eatice.style.transition = "none";
  _eatice.style.opacity = "1";
  _eatice.style.transform = "scale(1)";
  _eatice.style.top = "-60px";
  _eatice.style.left = Math.random() * (window.innerWidth - 100) + "px";
  _eatice.dataset.eaten = "false";
}


function check(){
  if(!gemestop) return;
  let basketrect = basket.getBoundingClientRect();
   let ice = document.querySelectorAll(".img-IceCream")
  
   ice.forEach(ic=>{
    if(ic.dataset.eaten === "true") return;
    let icerect = ic.getBoundingClientRect();
    if(
      basketrect.left < icerect.right &&
      basketrect.right > icerect.left &&
      basketrect.top < icerect.bottom &&
      basketrect.bottom > icerect.top
    ){
      if(ic.src.includes('bomb.png')){
        audioBomb.play();
        lozer();
        audioLozer.play();
        style_lozer(ic);
        return;
      }
      score++;
      _score.innerText = score;
      audioBubbles.play();
      eatice(ic);
      if(score === 15){
        audioWinner.play();
        showalert();
      }
    }
  });
}


window.addEventListener("keyup",(e)=>{
  if(!gemestop) return;
  switch (e.code) {
        case "ArrowLeft":
          _left();
          break;
        case "ArrowRight":
          _Right();
          break;
      }
  check();
});

function _left(){
  let x = basket.offsetLeft - 50;
  if(x<0) x=0;
  basket.style.left = x + "px";
}

function _Right(){
  let x = basket.offsetLeft + 50;
  let max = window.innerWidth - basket.offsetWidth;
  if(x>max) x=max;
  basket.style.left = x + "px";
}


function showalert(){
  document.getElementById("Myalert").style.display = "flex";
  basket.style.display='none';
  gemestop=false;
}

function lozer(){
  document.getElementById("lozer1").style.display = "flex";
  basket.style.display='none';
  gemestop=false;
}

_Ok.addEventListener('click',()=>{
  document.getElementById("Myalert").style.display="none";
  window.location.reload();
});

lozer_ok.addEventListener('click',()=>{
  document.getElementById("lozer1").style.display="none";
  window.location.reload();
});

function style_lozer(bomb){
  bomb.style.transition="0.2s";
  bomb.style.transform="scale(3)";
  bomb.style.opacity="0";
}

// touch
let isDragging=false, startX=0, initialX=0;
basket.addEventListener("touchstart",(e)=>{
  if(!gemestop) return;
  isDragging=true;
  startX = e.touches[0].clientX;
  initialX = basket.getBoundingClientRect().left;
  basket.style.transition="none";
},{passive:false});

document.addEventListener("touchmove",(e)=>{
  if(!isDragging || !gemestop) return;
  e.preventDefault();
  let dx = e.touches[0].clientX - startX;
  let pos = initialX + dx;
  if(pos<0) pos=0;
  if(pos>window.innerWidth - basket.offsetWidth) pos = window.innerWidth - basket.offsetWidth;
  basket.style.left = pos + "px";
  check();
},{passive:false});

document.addEventListener("touchend",()=>{
  isDragging=false;
  basket.style.transition="";
});