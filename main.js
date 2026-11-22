(function(){
    var nav=document.getElementById('nav');
    var hero=document.querySelector('.hero');
    function onScroll(){
      var y=window.scrollY||document.documentElement.scrollTop;
      if(y>60){nav.classList.add('solid');}else{nav.classList.remove('solid');}
    }
    window.addEventListener('scroll',onScroll,{passive:true});
    onScroll();

    var burger=document.getElementById('burger');
    var menu=document.getElementById('mobileMenu');
    function closeMenu(){menu.classList.remove('open');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Menü öffnen');document.body.style.overflow='';}
    burger.addEventListener('click',function(){
      var open=menu.classList.toggle('open');
      burger.setAttribute('aria-expanded',open?'true':'false');
      burger.setAttribute('aria-label',open?'Menü schließen':'Menü öffnen');
      document.body.style.overflow=open?'hidden':'';
    });
    menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeMenu);});

    var y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();

    /* Datenschutz-Hinweis: nur die Bestätigung wird lokal gespeichert (technisch notwendig, kein Cookie) */
    var notice=document.getElementById('notice');
    if(notice){
    try{ if(!localStorage.getItem('mr-notice')) notice.classList.add('show'); }catch(e){ notice.classList.add('show'); }
    document.getElementById('noticeOk').addEventListener('click',function(){ try{localStorage.setItem('mr-notice','1');}catch(e){} notice.classList.remove('show'); });
    }

    /* Prototyp: Anfrage öffnet das Mailprogramm. Auf Wix ersetzt ein echtes Formular diesen Schritt. */
    var form=document.getElementById('anfrage');
    if(form) form.addEventListener('submit',function(e){
      e.preventDefault();
      var v=function(id){return (document.getElementById(id).value||'').trim();};
      if(!document.getElementById('f-consent').checked){document.getElementById('f-consent').focus();return;}
      if(!v('f-name')||!v('f-mail')||!v('f-msg')){
        var missing=[];
        if(!v('f-name'))missing.push('f-name');
        if(!v('f-mail'))missing.push('f-mail');
        if(!v('f-msg'))missing.push('f-msg');
        document.getElementById(missing[0]).focus();
        return;
      }
      var body='Name: '+v('f-name')+'\nE-Mail: '+v('f-mail')+'\nObjekt & Ort: '+v('f-objekt')+'\n\n'+v('f-msg');
      window.location.href='mailto:meinlinformation@gmail.com?subject='+encodeURIComponent('Anfrage über die Website – '+(v('f-objekt')||v('f-name')))+'&body='+encodeURIComponent(body);
    });

    /* Lehrfilme: Start per Klick auf das Vorschaubild; der laufende Film steht auf breiten Bildschirmen groß über der Reihe,
       Steuerleiste erst nach dem Start, immer nur ein Film gleichzeitig */
    var films=[].slice.call(document.querySelectorAll('.film'));
    films.forEach(function(f){
      var v=f.querySelector('video'), b=f.querySelector('.film-play'), c=f.querySelector('.film-close');
      if(!v||!b) return;
      v.controls=false;
      f._stop=function(){ if(!f.classList.contains('is-playing')) return; v.pause(); f.classList.remove('is-playing'); v.controls=false; if(c) c.hidden=true; v.load(); if(f._teaser) f._teaser(f._seen); };
      b.addEventListener('click',function(){
        films.forEach(function(o){ if(o!==f&&o._stop) o._stop(); });
        if(f._teaser) f._teaser(false);
        f.classList.add('is-playing'); v.controls=true; if(c) c.hidden=false;
        var p=v.play(); if(p&&p.catch) p.catch(function(){});
        if(f.scrollIntoView){ try{ f.scrollIntoView({behavior:'smooth',block:'start'}); }catch(e){ f.scrollIntoView(); } }
      });
      if(c) c.addEventListener('click',function(){ f._stop(); b.focus(); });
      v.addEventListener('ended',function(){ f._stop(); });
    });

    /* Vorschau-Schleifen der Lehrfilme: stumm, erst laden wenn die Karte sichtbar wird, außerhalb des Sichtfelds anhalten;
       bei reduzierter Bewegung oder Datensparmodus bleibt das Standbild */
    var calm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var net=navigator.connection||{};
    var thrifty=net.saveData||/(^|[^\d])2g/.test(net.effectiveType||'');
    if(!calm&&!thrifty&&'IntersectionObserver' in window){
      var teaserIO=new IntersectionObserver(function(es){
        es.forEach(function(e){ var f=e.target._film; f._seen=e.isIntersecting; f._teaser(e.isIntersecting); });
      },{threshold:0.4});
      films.forEach(function(f){
        var t=f.querySelector('.film-teaser'), m=f.querySelector('.film-media');
        if(!t||!m) return;
        f._seen=false;
        f._teaser=function(on){
          if(on&&!f.classList.contains('is-playing')){
            if(!t.getAttribute('src')){ t.muted=true; t.setAttribute('src',t.getAttribute('data-src')); }
            var p=t.play(); if(p&&p.catch) p.catch(function(){});
          } else if(!t.paused){ t.pause(); }
        };
        m._film=f; teaserIO.observe(m);
      });
    }

    /* Video-Intro: Quelle je nach Gerät wählen, sanft einblenden, außerhalb des Sichtfelds pausieren */
    var video=document.getElementById('heroVideo');
    if(video&&hero){
      var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var conn=navigator.connection||{};
      var slow=conn.saveData||/(^|[^\d])2g/.test(conn.effectiveType||'');
      var mp4=video.canPlayType&&video.canPlayType('video/mp4; codecs="avc1.640028"');
      var webm=video.canPlayType&&video.canPlayType('video/webm; codecs="vp9"');
      if(!reduce&&!slow&&(mp4||webm)){
        var small=Math.max(window.innerWidth,window.innerHeight)<=1024||(window.devicePixelRatio||1)*window.innerWidth<=1400;
        video.src=mp4?(small?'video/schloss-schoenberg-720.mp4':'video/schloss-schoenberg-1080.mp4'):'video/schloss-schoenberg-1080.webm';
        var shown=false;
        var show=function(){ if(!shown){shown=true;hero.classList.add('video-on');} };
        video.addEventListener('playing',show);
        video.addEventListener('timeupdate',function(){ if(video.currentTime>0.05) show(); });
        var tryPlay=function(){ var p=video.play(); if(p&&p.catch) p.catch(function(){}); };
        video.addEventListener('canplay',tryPlay,{once:true});
        video.load();
        if('IntersectionObserver' in window){
          new IntersectionObserver(function(es){
            es.forEach(function(e){ if(e.isIntersecting){ if(video.paused) tryPlay(); } else if(!video.paused){ video.pause(); } });
          },{threshold:0.05}).observe(hero);
        }
      }
      /* Parallax: Video langsamer als die Seite, Inhalt blendet aus */
      if(!reduce){
        var media=hero.querySelector('.hero-media');
        var inner=hero.querySelector('.hero-inner');
        var hint=hero.querySelector('.scroll-hint');
        var cap=hero.querySelector('.hero-caption');
        var ticking=false;
        var update=function(){
          ticking=false;
          var y=window.scrollY||document.documentElement.scrollTop;
          var h=hero.offsetHeight||1;
          if(y>h){return;}
          var f=Math.min(1,y/(h*0.75));
          var g=Math.max(0,1-y/(h*0.28));
          media.style.transform='translate3d(0,'+(y*0.28).toFixed(1)+'px,0)';
          inner.style.transform='translate3d(0,'+(y*0.10).toFixed(1)+'px,0)';
          inner.style.opacity=Math.max(0,1-f*1.15).toFixed(3);
          if(hint){hint.style.opacity=g.toFixed(3);hint.style.visibility=g?'':'hidden';}
          if(cap){cap.style.opacity=g.toFixed(3);}
        };
        window.addEventListener('scroll',function(){ if(!ticking){ticking=true;requestAnimationFrame(update);} },{passive:true});
        update();
      }
    }
  })();
