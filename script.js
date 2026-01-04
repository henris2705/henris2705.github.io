// script.js - xử lý tabs và trigger animation nhẹ
document.addEventListener('DOMContentLoaded', function(){
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const panels = Array.from(document.querySelectorAll('.panel'));

  function activate(targetId){
    tabs.forEach(t=>{
      const isActive = t.dataset.target === targetId;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', isActive);
    });
    panels.forEach(p=>{
      const show = p.id === targetId;
      p.classList.toggle('active', show);
      p.hidden = !show;
      if(show){
        p.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'cubic-bezier(.2,.9,.3,1)'});
      }
    });
  }

  tabs.forEach(tab=>{
    tab.addEventListener('click', ()=> activate(tab.dataset.target));
    tab.addEventListener('keydown', (e)=>{
      if(e.key === 'ArrowRight' || e.key === 'ArrowLeft'){
        const idx = tabs.indexOf(tab);
        const next = e.key === 'ArrowRight' ? (idx+1)%tabs.length : (idx-1+tabs.length)%tabs.length;
        tabs[next].focus();
      }
      if(e.key === 'Enter' || e.key === ' ') activate(tab.dataset.target);
    });
  });

  // small playful animation: pulse profile on hover
  const profile = document.querySelector('.profile');
  if(profile){
    profile.addEventListener('mouseenter', ()=> profile.animate([{transform:'scale(1)'},{transform:'scale(1.03)'},{transform:'scale(1)'}],{duration:600}));
  }
  
  // Image modal handling
  const modal = document.getElementById('imgModal');
  const modalImg = modal && modal.querySelector('.modal-img');
  const modalCaption = modal && modal.querySelector('.modal-caption');
  const modalClose = modal && modal.querySelector('.modal-close');

  const clickables = Array.from(document.querySelectorAll('img.clickable'));
  let currentIndex = -1;

  function openModal(index){
    const el = clickables[index];
    if(!el) return;
    currentIndex = index;
    const src = el.dataset.full || el.src;
    modalImg.src = src;
    modalImg.alt = el.alt || '';
    modalCaption.textContent = el.alt || '';
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    modalImg.src = '';
    document.body.style.overflow = '';
    currentIndex = -1;
  }

  clickables.forEach((img, i)=>{
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', ()=> openModal(i));
  });

  if(modal){
    modal.addEventListener('click', (e)=>{
      if(e.target.classList.contains('modal-backdrop') || e.target.classList.contains('modal-close')) closeModal();
    });
    document.addEventListener('keydown', (e)=>{
      if(modal.getAttribute('aria-hidden') === 'false'){
        if(e.key === 'Escape') closeModal();
        if(e.key === 'ArrowRight') openModal((currentIndex+1) % clickables.length);
        if(e.key === 'ArrowLeft') openModal((currentIndex-1+clickables.length) % clickables.length);
      }
    });
  }

  // Hero canvas animation: pixel character + twinkling stars
  const canvas = document.getElementById('heroCanvas');
  if(canvas){
    const ctx = canvas.getContext('2d');
    function resize(){
      const rect = document.querySelector('.hero').getBoundingClientRect();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }
    window.addEventListener('resize', resize);
    resize();

    // stars
    const stars = Array.from({length:24}).map(()=>({
      x: Math.random()*canvas.width/devicePixelRatio,
      y: Math.random()*canvas.height/devicePixelRatio * 0.6,
      r: Math.random()*1.6 + 0.4,
      a: Math.random(),
      da: Math.random()*0.02 + 0.005
    }));

    // pixel character (simple blocky sprite)
    const player = {x:60,y: (canvas.height/devicePixelRatio)*0.55,dir:1,speed:40};

    let last = performance.now();
    function loop(now){
      const dt = (now-last)/1000; last = now;
      // clear
      ctx.clearRect(0,0,canvas.width/devicePixelRatio,canvas.height/devicePixelRatio);

      // draw stars
      stars.forEach(s=>{
        s.a += s.da*dt*60;
        if(s.a>1) s.a=0;
        ctx.fillStyle = `rgba(38,78,120,${0.85*s.a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r,0,Math.PI*2);
        ctx.fill();
      });

      // move player
      player.x += player.dir * player.speed * dt;
      const maxX = canvas.width/devicePixelRatio - 120;
      if(player.x > maxX || player.x < 40) player.dir *= -1;

      // draw ground
      ctx.fillStyle = 'rgba(10,30,60,0.6)';
      ctx.fillRect(0, (canvas.height/devicePixelRatio)*0.78, canvas.width/devicePixelRatio, 60);

      // draw pixel character as blocks
      function drawPixel(x,y,color){ ctx.fillStyle = color; ctx.fillRect(x,y,6,6); }
      const px = Math.round(player.x);
      const py = Math.round(player.y);
      // simple 8x8 block sprite (head, body, legs)
      const sprite = [
        [0,0,1,1,1,1,0,0],
        [0,1,1,2,2,1,1,0],
        [1,1,2,2,2,2,1,1],
        [1,2,2,3,3,2,2,1],
        [1,2,3,3,3,3,2,1],
        [0,1,2,2,2,2,1,0],
        [0,1,2,0,0,2,1,0],
        [0,1,2,0,0,2,1,0]
      ];
      const palette = {0:'transparent',1:'#ffd66b',2:'#ff8b6b',3:'#2b8cff'};
      for(let ry=0;ry<8;ry++){
        for(let rx=0;rx<8;rx++){
          const v = sprite[ry][rx];
          if(v>0) drawPixel(px + rx*6, py + ry*6, palette[v]);
        }
      }

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }
});
