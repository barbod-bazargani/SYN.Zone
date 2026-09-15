(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- loading screen: flickering logo, hold 2s then fade out ---- */
  var loader = document.getElementById('loader');
  var loaderLogo = document.getElementById('loader-logo');
  if(loader){
    var flickerOn = !reduce;
    if(loaderLogo && flickerOn){
      var curOp = 1, targetOp = 1, nextChange = 0;
      function pickTarget(now){
        var r = Math.random();
        targetOp = r < 0.12 ? 0 : (r < 0.24 ? (0.25 + Math.random()*0.35) : 1);
        nextChange = now + 70 + Math.random()*260;
      }
      pickTarget(0);
      (function frame(now){
        if(!flickerOn) return;
        if(now >= nextChange) pickTarget(now);
        curOp += (targetOp - curOp) * 0.12;
        loaderLogo.style.opacity = curOp;
        requestAnimationFrame(frame);
      })(0);
    }
    setTimeout(function(){
      flickerOn = false;
      if(loaderLogo) loaderLogo.style.opacity = '1';
      loader.classList.add('hide');
      loader.addEventListener('transitionend', function(){ loader.remove(); }, {once:true});
      if(reduce) loader.remove();
    }, 2000);
  }

  requestAnimationFrame(function(){
    requestAnimationFrame(function(){ document.body.classList.add('revealed'); });
  });

  /* ---- countdown to release ---- */
  var RELEASE = new Date(2027, 0, 1, 0, 0, 0); // 01/01/27 (DD/MM/YY), 12:00 (local time)
  var elD = document.getElementById('cd-d'),
      elH = document.getElementById('cd-h'),
      elM = document.getElementById('cd-m'),
      elS = document.getElementById('cd-s');
  function pad(n){ return String(n).padStart(2,'0'); }
  function tick(){
    var diff = RELEASE.getTime() - Date.now();
    if(diff <= 0){
      elD.textContent = elH.textContent = elM.textContent = elS.textContent = '00';
      clearInterval(timer);
      return;
    }
    var totalSec = Math.floor(diff/1000);
    var days = Math.floor(totalSec / 86400);
    var hours = Math.floor((totalSec % 86400) / 3600);
    var mins = Math.floor((totalSec % 3600) / 60);
    var secs = totalSec % 60;
    elD.textContent = pad(days);
    elH.textContent = pad(hours);
    elM.textContent = pad(mins);
    elS.textContent = pad(secs);
  }
  tick();
  var timer = setInterval(tick, 1000);

  /* ---- remind me: download calendar event + browser notification ---- */
  var remindBtn = document.getElementById('remind');

  function pad2(n){ return String(n).padStart(2,'0'); }
  function toICSDate(d){
    return d.getUTCFullYear()+pad2(d.getUTCMonth()+1)+pad2(d.getUTCDate())+'T'+
           pad2(d.getUTCHours())+pad2(d.getUTCMinutes())+pad2(d.getUTCSeconds())+'Z';
  }
  function downloadICS(){
    var end = new Date(RELEASE.getTime() + 60*60*1000);
    var ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//SYN ZONE//Release Reminder//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      'UID:synzone-release-'+RELEASE.getTime()+'@synzone.zine',
      'DTSTAMP:'+toICSDate(new Date()),
      'DTSTART:'+toICSDate(RELEASE),
      'DTEND:'+toICSDate(end),
      'SUMMARY:SYN ZONE — Issue release',
      'DESCRIPTION:SYN ZONE drops today. Get your copy.',
      'BEGIN:VALARM',
      'TRIGGER:-PT1H',
      'ACTION:DISPLAY',
      'DESCRIPTION:SYN ZONE releases in 1 hour',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    var blob = new Blob([ics], {type:'text/calendar;charset=utf-8'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'syn-zone-release.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function(){ URL.revokeObjectURL(url); }, 2000);
  }

  function fireNotification(){
    if(location.protocol === 'file:'){ return; }
    if(!('Notification' in window)){ return; }
    var show = function(){
      try{
        new Notification('SYN ZONE', {
          body: 'Reminder added — issue drops 01/01/27, 12:00.'
        });
      }catch(e){}
    };
    if(Notification.permission === 'granted'){ show(); }
    else if(Notification.permission !== 'denied'){
      Notification.requestPermission().then(function(perm){
        if(perm === 'granted') show();
      });
    }
  }

  if(remindBtn){
    remindBtn.addEventListener('click', function(){
      downloadICS();
      remindBtn.classList.add('done');
      remindBtn.textContent = 'Added to calendar ✓';
      fireNotification();
    });
  }
})();
