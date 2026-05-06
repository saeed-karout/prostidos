// utils/performance-optimizations.js

// دالة لإيقاف الفيديوهات غير المرئية
export const manageVideoPlayback = () => {
  const videos = document.querySelectorAll('video');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      
      if (entry.isIntersecting) {
        // تأخير بسيط قبل التشغيل
        setTimeout(() => {
          if (video.paused) {
            video.play().catch(e => console.log('Video autoplay prevented:', e));
          }
        }, 300);
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.1 });
  
  videos.forEach(video => observer.observe(video));
  
  return () => {
    videos.forEach(video => observer.unobserve(video));
  };
};

// دالة للتحميل المتأخر للصور والفيديوهات
export const lazyLoadMedia = () => {
  if ('IntersectionObserver' in window) {
    const lazyMedia = document.querySelectorAll('[data-src]');
    
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          
          if (element.tagName === 'IMG') {
            element.src = element.dataset.src;
          } else if (element.tagName === 'VIDEO') {
            const source = element.querySelector('source');
            if (source) {
              source.src = source.dataset.src;
              element.load();
            }
          }
          
          lazyObserver.unobserve(element);
        }
      });
    }, { rootMargin: '50px 0px' });
    
    lazyMedia.forEach(media => lazyObserver.observe(media));
  }
};

// دالة لتقليل استخدام الذاكرة
export const optimizeMemoryUsage = () => {
  // تنظيف الـ observers عند الانتقال بين الصفحات
  window.addEventListener('beforeunload', () => {
    // إيقاف جميع الفيديوهات
    document.querySelectorAll('video').forEach(video => {
      video.pause();
      video.currentTime = 0;
      video.removeAttribute('src');
      video.load();
    });
  });
};

// دالة لتحسين الـ FPS
export const throttleRAF = (callback) => {
  let requestId = null;
  
  return (...args) => {
    if (requestId === null) {
      requestId = requestAnimationFrame(() => {
        callback(...args);
        requestId = null;
      });
    }
  };
};