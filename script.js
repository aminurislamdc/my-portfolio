
/* ===================== LOADER ===================== */
window.addEventListener('load',()=>{
  setTimeout(()=>{
    document.getElementById('loader').classList.add('gone');
  },1600);
});

/* ===================== CURSOR ===================== */
const cur=document.getElementById('cur');
const curt=document.getElementById('curt');
let mx=0,my=0,tx=0,ty=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
document.addEventListener('mousedown',()=>cur.classList.add('click'));
document.addEventListener('mouseup',()=>cur.classList.remove('click'));
(function animC(){
  cur.style.left=mx+'px';cur.style.top=my+'px';
  tx+=(mx-tx)*.1;ty+=(my-ty)*.1;
  curt.style.left=tx+'px';curt.style.top=ty+'px';
  requestAnimationFrame(animC);
})();
document.querySelectorAll('a,button,.pc,.exp-card,.sk-block,.edu-card,.cert,.pub').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cur.classList.add('hov');curt.classList.add('hov');});
  el.addEventListener('mouseleave',()=>{cur.classList.remove('hov');curt.classList.remove('hov');});
});

/* ===================== SCROLL PROGRESS ===================== */
const prog=document.getElementById('progress');
window.addEventListener('scroll',()=>{
  const s=document.documentElement.scrollTop;
  const h=document.documentElement.scrollHeight-window.innerHeight;
  prog.style.width=(s/h*100)+'%';
});

/* ===================== HEADER STUCK ===================== */
const hdr=document.getElementById('hdr');
window.addEventListener('scroll',()=>{
  hdr.classList.toggle('stuck',window.scrollY>60);
  updateNav();
});

/* ===================== MOBILE MENU ===================== */
const menuBtn=document.getElementById('menuBtn');
const navEl=document.getElementById('nav');
menuBtn.addEventListener('click',()=>{
  navEl.classList.toggle('open');
  menuBtn.innerHTML=navEl.classList.contains('open')
    ?'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
    :'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
});
document.querySelectorAll('.nav-link').forEach(l=>l.addEventListener('click',()=>{
  navEl.classList.remove('open');
  menuBtn.innerHTML='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
}));

/* ===================== SMOOTH SCROLL ===================== */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=a.getAttribute('href');
    if(t==='#')return;
    e.preventDefault();
    const el=document.querySelector(t);
    if(el) window.scrollTo({top:el.offsetTop-72,behavior:'smooth'});
  });
});

/* ===================== ACTIVE NAV ===================== */
function updateNav(){
  const secs=document.querySelectorAll('section[id]');
  const pos=window.scrollY+160;
  secs.forEach(s=>{
    if(pos>=s.offsetTop&&pos<s.offsetTop+s.offsetHeight){
      document.querySelectorAll('.nav-link').forEach(l=>{
        l.classList.toggle('on',l.getAttribute('href')==='#'+s.id);
      });
    }
  });
}

/* ===================== INTERSECTION OBSERVER ===================== */
const revObs=new IntersectionObserver((entries)=>{
  entries.forEach((entry,i)=>{
    if(!entry.isIntersecting)return;
    const el=entry.target;
    // stagger siblings
    const siblings=Array.from(el.parentNode.querySelectorAll('[data-rev]'));
    const idx=siblings.indexOf(el);
    setTimeout(()=>{
      el.classList.add('vis');
      // bars
      el.querySelectorAll('.sk-fill,.sk-sfill').forEach(b=>{
        b.style.width=b.dataset.w+'%';
        setTimeout(()=>b.classList.add('done'),1400);
      });
    },idx*90);
    revObs.unobserve(el);
  });
},{threshold:0.12});

document.querySelectorAll('[data-rev]').forEach(el=>revObs.observe(el));

// lang bars inside skills-top (triggered by parent)
const langObs=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    entry.target.querySelectorAll('.sk-fill').forEach((b,i)=>{
      setTimeout(()=>{b.style.width=b.dataset.w+'%';},i*150);
    });
    langObs.unobserve(entry.target);
  });
},{threshold:.2});
document.querySelectorAll('.skills-top').forEach(el=>langObs.observe(el));

/* ===================== HERO STATS COUNT-UP ===================== */
document.querySelectorAll('.hst-n[data-count]').forEach(n=>{
  const o=new IntersectionObserver(entries=>{
    if(!entries[0].isIntersecting)return;
    countUp(n,+n.dataset.count);
    o.unobserve(n);
  },{threshold:.8});
  o.observe(n);
});
function countUp(el,target){
  let v=0;
  const step=()=>{
    v=Math.min(v+Math.ceil(target/18),target);
    el.textContent=v+(target>=10?'+':'');
    if(v<target)requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ===================== CANVAS — PARTICLE MESH ===================== */
(function(){
  const cvs=document.getElementById('cvs1');
  if(!cvs)return;
  const ctx=cvs.getContext('2d');
  function resize(){cvs.width=cvs.offsetWidth;cvs.height=cvs.offsetHeight;}
  resize();
  const ro=new ResizeObserver(resize);ro.observe(cvs);
  const pts=Array.from({length:32},()=>({
    x:Math.random()*cvs.width,y:Math.random()*cvs.height,
    vx:(Math.random()-.5)*.55,vy:(Math.random()-.5)*.55,
    r:Math.random()*1.5+1.5
  }));
  function draw(){
    ctx.clearRect(0,0,cvs.width,cvs.height);
    ctx.fillStyle='#edeae3';
    ctx.fillRect(0,0,cvs.width,cvs.height);
    pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>cvs.width)p.vx*=-1;if(p.y<0||p.y>cvs.height)p.vy*=-1;});
    for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
      const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);
      if(d<95){
        ctx.strokeStyle=`rgba(26,86,255,${.18*(1-d/95)})`;
        ctx.lineWidth=.8;
        ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.stroke();
      }
    }
    pts.forEach(p=>{
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle='rgba(26,86,255,.55)';ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ===================== MAGNETIC BUTTONS ===================== */
document.querySelectorAll('.btn-fill,.btn-outline,.btn-sub,.socbtn').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{
    const r=btn.getBoundingClientRect();
    const x=e.clientX-r.left-r.width/2;
    const y=e.clientY-r.top-r.height/2;
    btn.style.transform=`translate(${x*.18}px,${y*.18}px) translateY(-3px)`;
  });
  btn.addEventListener('mouseleave',()=>{
    btn.style.transform='';
  });
});

/* ===================== CONTACT FORM ===================== */
document.getElementById('submitBtn').addEventListener('click',()=>{
  const name=document.getElementById('cf-name').value.trim();
  const email=document.getElementById('cf-email').value.trim();
  const msg=document.getElementById('cf-msg').value.trim();
  if(!name||!email||!msg){showNotif('Please fill in all required fields.');return;}
  showNotif(`Thanks ${name}! I'll reply to ${email} soon.`);
  ['cf-name','cf-email','cf-subj','cf-msg'].forEach(id=>{document.getElementById(id).value='';});
});
function showNotif(txt){
  const n=document.getElementById('notif');
  document.getElementById('notif-msg').textContent=txt;
  n.classList.add('show');
  setTimeout(()=>n.classList.remove('show'),4500);
}
