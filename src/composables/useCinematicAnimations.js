import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useCinematicAnimations() {
  const isDesktopExperience = ref(true)
  const isTabletExperience = ref(false)
  const isMobileExperience = ref(false)
  
  // التحقق من نوع الجهاز
  const checkDeviceType = () => {
    const width = window.innerWidth
    
    if (width >= 1025) {
      isDesktopExperience.value = true
      isTabletExperience.value = false
      isMobileExperience.value = false
    } else if (width >= 768 && width <= 1024) {
      isDesktopExperience.value = false
      isTabletExperience.value = true
      isMobileExperience.value = false
    } else {
      isDesktopExperience.value = false
      isTabletExperience.value = false
      isMobileExperience.value = true
    }
  }
  
  // تجربة الديسكتوب السينمائية (التلفاز + أنميشن كاملة)
  const setupDesktopCinematic = (tvContainer, videoSections, contentContainer) => {
    const sections = gsap.utils.toArray(videoSections)
    
    // تثبيت الحاوية الرئيسية
    const pinTrigger = ScrollTrigger.create({
      trigger: tvContainer,
      start: "top top",
      end: () => `+=${(sections.length - 1) * window.innerHeight}`,
      pin: true,
      scrub: 1.2,
      anticipatePin: 1,
      markers: false,
    })
    
    // أنيميشن كل قسم فيديو
    sections.forEach((section, index) => {
      const video = section.querySelector('video')
      const overlay = section.querySelector('.content')
      
      // إذا كان هذا هو التلفاز (الفيديو الأول)
      if (index === 0) {
        setupTVAnimations(video, overlay, pinTrigger, section)
      } else {
        setupVideoSectionAnimations(video, overlay, pinTrigger, section, index)
      }
    })
    
    return pinTrigger
  }
  
  // أنيميشن التلفاز الخاص بالفيديو الأول
  const setupTVAnimations = (video, content, pinTrigger, section) => {
    if (!video) return
    
    // أنيميشن دخول التلفاز
    gsap.fromTo(video.parentElement,
      {
        scale: 0.85,
        filter: 'brightness(0.6) blur(2px)',
        y: 100
      },
      {
        scale: 1,
        filter: 'brightness(1) blur(0px)',
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          containerAnimation: pinTrigger,
          start: "left left",
          end: "right left",
          scrub: 1,
        }
      }
    )
    
    // أنيميشن المحتوى
    if (content) {
      gsap.fromTo(content,
        {
          opacity: 0,
          y: 80,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            containerAnimation: pinTrigger,
            start: "left 60%",
            end: "left 30%",
            scrub: 0.8,
          }
        }
      )
    }
    
    // أنيميشن التحكم بالفيديو
    ScrollTrigger.create({
      trigger: section,
      containerAnimation: pinTrigger,
      start: "left left",
      end: "right left",
      onEnter: () => {
        if (video.paused && video.readyState >= 3) {
          video.play().catch(() => {})
        }
      },
      onLeaveBack: () => {
        video.pause()
        video.currentTime = 0
      }
    })
  }
  
  // أنيميشن أقسام الفيديو العادية
  const setupVideoSectionAnimations = (video, content, pinTrigger, section, index) => {
    if (!video) return
    
    // أنيميشن دخول الفيديو
    gsap.fromTo(video,
      {
        scale: 0.9,
        opacity: 0,
        filter: 'brightness(0.5)'
      },
      {
        scale: 1,
        opacity: 1,
        filter: 'brightness(1)',
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          containerAnimation: pinTrigger,
          start: "left left",
          end: "right left",
          scrub: 1,
        }
      }
    )
    
    // أنيميشن المحتوى مع تأخير حسب الترتيب
    if (content) {
      gsap.fromTo(content.children,
        {
          opacity: 0,
          y: 50
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            containerAnimation: pinTrigger,
            start: "left 50%",
            end: "left 30%",
            scrub: 0.7,
          }
        }
      )
    }
  }
  
  // تجربة التابلت المخففة (بدون تثبيت)
  const setupTabletExperience = (tvContainer, videoSections) => {
    const sections = gsap.utils.toArray(videoSections)
    
    sections.forEach((section, index) => {
      const video = section.querySelector('video')
      const content = section.querySelector('.content')
      
      // إضافة Snap للتابلت
      section.style.scrollSnapAlign = 'start'
      
      // أنيميشن الدخول
      gsap.fromTo([video, content],
        {
          opacity: 0,
          scale: 0.96,
          y: 30
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 30%",
            toggleActions: "play none none reverse"
          }
        }
      )
    })
    
    // إضافة Snap للحاوية
    const container = document.querySelector('.gallery-container')
    if (container) {
      container.style.scrollSnapType = 'y mandatory'
    }
  }
  
  // تجربة الموبايل البسيطة
  const setupMobileExperience = (videoSections) => {
    const sections = gsap.utils.toArray(videoSections)
    
    sections.forEach((section) => {
      const content = section.querySelector('.content')
      
      if (content) {
        gsap.fromTo(content,
          {
            opacity: 0,
            y: 40
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        )
      }
    })
  }
  
  // تهيئة الأنميشن حسب الجهاز
  const initCinematicExperience = (tvContainerSelector, sectionsSelector) => {
    checkDeviceType()
    
    const tvContainer = document.querySelector(tvContainerSelector)
    const sections = document.querySelectorAll(sectionsSelector)
    
    // تنظيف أي أنيميشن سابقة
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    
    if (isDesktopExperience.value && tvContainer && sections.length > 0) {
      return setupDesktopCinematic(tvContainer, sections, '.content')
    } else if (isTabletExperience.value && sections.length > 0) {
      return setupTabletExperience(tvContainer, sections)
    } else if (isMobileExperience.value && sections.length > 0) {
      return setupMobileExperience(sections)
    }
  }
  
  // إعادة الضبط عند تغيير الحجم
  const handleResize = () => {
    checkDeviceType()
    ScrollTrigger.refresh()
  }
  
  onMounted(() => {
    window.addEventListener('resize', handleResize)
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  })
  
  return {
    checkDeviceType,
    initCinematicExperience,
    isDesktopExperience,
    isTabletExperience,
    isMobileExperience
  }
}