// overlay-engine/shared/animation-utils.js
// Zero-dependency animation utilities for OBS browser source

var AnimUtils = {
  easeOutCubic: function(t) { return 1 - Math.pow(1 - t, 3); },
  easeInOutCubic: function(t) { return t < 0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2; },
  easeOutElastic: function(t) {
    var c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10*t) * Math.sin((t*10-0.75)*c4) + 1;
  },
  animate: function(duration, easing, onUpdate, onComplete) {
    var start = performance.now();
    function tick(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var easedProgress = easing(progress);
      onUpdate(easedProgress);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else if (onComplete) {
        onComplete();
      }
    }
    requestAnimationFrame(tick);
  },
  fadeIn: function(el, duration) {
    duration = duration || 300;
    el.style.opacity = '0';
    el.style.display = '';
    AnimUtils.animate(duration, AnimUtils.easeOutCubic, function(p) {
      el.style.opacity = String(p);
    });
  },
  fadeOut: function(el, duration, onDone) {
    duration = duration || 300;
    AnimUtils.animate(duration, AnimUtils.easeOutCubic, function(p) {
      el.style.opacity = String(1 - p);
    }, function() {
      el.style.display = 'none';
      if (onDone) onDone();
    });
  },
  slideIn: function(el, direction, distance, duration) {
    duration = duration || 400;
    distance = distance || 100;
    var startVal = direction === 'left' ? -distance : direction === 'right' ? distance : 0;
    var startY = direction === 'top' ? -distance : direction === 'bottom' ? distance : 0;
    el.style.transform = 'translate(' + startVal + 'px, ' + startY + 'px)';
    el.style.opacity = '0';
    el.style.display = '';
    AnimUtils.animate(duration, AnimUtils.easeOutCubic, function(p) {
      var x = startVal * (1 - p);
      var y = startY * (1 - p);
      el.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
      el.style.opacity = String(p);
    });
  },
  slideOut: function(el, direction, distance, duration, onDone) {
    duration = duration || 400;
    distance = distance || 100;
    var endX = direction === 'left' ? -distance : direction === 'right' ? distance : 0;
    var endY = direction === 'top' ? -distance : direction === 'bottom' ? distance : 0;
    AnimUtils.animate(duration, AnimUtils.easeOutCubic, function(p) {
      var x = endX * p;
      var y = endY * p;
      el.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
      el.style.opacity = String(1 - p);
    }, function() {
      el.style.display = 'none';
      if (onDone) onDone();
    });
  }
};
