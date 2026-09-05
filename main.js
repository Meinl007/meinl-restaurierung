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
  })();
