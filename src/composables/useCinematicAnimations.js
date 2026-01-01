import { onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useCinematicScroll() {
  onMounted(() => {
    ScrollTrigger.matchMedia({
      // Desktop: تجربة سينمائية كاملة (Pin + Scrub)
      "(min-width: 1280px)": () => {
        gsap.utils.toArray('.gallery-item').forEach((section, index) => {
          const video = section.querySelector('video');
          const overlay = section.querySelector('.content-overlay');

          // Pin القسم
          ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "bottom top",
            pin: true,
            pinSpacing: false,
            anticipatePin: 1,
          });

          // أنيميشن الفيديو (Scale + Brightness + Opacity)
          gsap.fromTo(section.querySelector('.tv-container'), {
            scale: 0.88,
            opacity: 0.7,
            filter: "brightness(0.7)",
            y: 80
          }, {
            scale: 1,
            opacity: 1,
            filter: "brightness(1)",
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "top top",
              scrub: 1,
            }
          });

          // Fade-in للـ overlay (المحتوى)
          gsap.fromTo(overlay, {
            opacity: 0,
            y: 50
          }, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 100%",
              toggleActions: "play none none reverse"
            }
          });

          // تشغيل/إيقاف الفيديو
          if (video) {
            ScrollTrigger.create({
              trigger: section,
              start: "top 50%",
              onEnter: () => video.play().catch(() => {}),
              onLeave: () => video.pause(),
              onEnterBack: () => video.play().catch(() => {}),
              onLeaveBack: () => video.pause(),
            });
          }
        });
      },

      // Tablet: بدون Pin، انتقالات خفيفة
      "(min-width: 768px) and (max-width: 1279px)": () => {
        gsap.utils.toArray('.gallery-item').forEach((section) => {
          const container = section.querySelector('.tv-container');
          const overlay = section.querySelector('.content-overlay');
          const video = section.querySelector('video');

          gsap.fromTo(container, {
            opacity: 0,
            scale: 0.96,
            y: 40
          }, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          });

          gsap.fromTo(overlay, {
            opacity: 0,
            y: 30
          }, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: 0.3,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          });

          if (video) {
            ScrollTrigger.create({
              trigger: section,
              start: "top center",
              end: "bottom center",
              onEnter: () => video.play().catch(() => {}),
              onLeave: () => video.pause(),
              onEnterBack: () => video.play().catch(() => {}),
              onLeaveBack: () => video.pause(),
            });
          }
        });
      },

      // Mobile: أداء أولوية، لا autoplay
      "(max-width: 767px)": () => {
        gsap.utils.toArray('.gallery-item').forEach((section) => {
          const container = section.querySelector('.tv-container');
          const overlay = section.querySelector('.content-overlay');

          gsap.fromTo(container, {
            opacity: 0,
            y: 50
          }, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            scrollTrigger: {
              trigger: section,
              start: "top 90%"
            }
          });

          gsap.fromTo(overlay, {
            opacity: 0,
            y: 20
          }, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: 0.2,
            scrollTrigger: {
              trigger: section,
              start: "top 90%"
            }
          });

          // لا autoplay على الموبايل، poster فقط
          const video = section.querySelector('video');
          if (video) video.pause();
        });
      }
    });

    ScrollTrigger.refresh();
  });

  onUnmounted(() => {
    ScrollTrigger.getAll().forEach(st => st.kill());
  });
}