document.addEventListener("DOMContentLoaded", () => {
  // ✅ 초기 요소

  const intro = document.querySelector(".intro");
  const logo = intro?.querySelector("img");
  const mainDark = document.querySelector("main.dark");
  const title = document.querySelector(".title");

  if (!intro || !logo || !mainDark || !title) {
    console.warn("필수 요소 누락: intro / logo / mainDark / title");
    return;
  }

  const introTL = gsap.timeline();

  // ✅ 로고 축소 애니메이션
  introTL.to(logo, {
    scale: 1,
    duration: 1.2,
    ease: "power2.inOut",
  });

  // ✅ intro → main 전환
  introTL.add(() => {
    mainDark.style.opacity = 1;
    intro.style.transition = "opacity 0.2s ease";
    intro.style.opacity = 0;

    setTimeout(() => {
      intro.style.display = "none";

      requestAnimationFrame(() => {
        gsap.fromTo(
          title,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power2.out",
            delay: 0.1,
          }
        );
      });
    }, 600);
  }, "+=0.2");

  // ✅ jQuery & Scroll 관련
  $(function () {
    // ✅ 차별점 카드 애니메이션
    $(".differentiation .card").each(function (index, element) {
      gsap.fromTo(
        element,
        {
          rotateY: 115,
          opacity: 0,
          yPercent: 10,
        },
        {
          scrollTrigger: {
            trigger: element,
            start: "top 60%",
            toggleActions: "play none none none",
          },
          rotateY: 0,
          opacity: 2,
          yPercent: 0,
          duration: 1,
          delay: index * 0.5,
        }
      );
    });

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: ".differentiation",
      start: "top 20%", // 화면의 60%에 섹션이 닿으면
      toggleClass: { targets: ".differentiation", className: "active" },
      once: true, // 한 번만 작동 (반복 원하면 제거)
    });

    // ✅ 문제 슬라이드 애니메이션
    $(window).on("load", function () {
      const $slidesWrapper = $(".slidegroup");
      const $slide = $(".slidebox");
      const slideWidth = $slide.outerWidth(true);
      const slideCount = $slide.length;

      $slidesWrapper.find(".clone").remove();
      for (let i = 0; i < slideCount; i++) {
        const clone = $slide.eq(i).clone();
        clone.addClass("clone");
        $slidesWrapper.append(clone);
      }

      const totalSlides = $slidesWrapper.find(".slidebox").length;
      const totalWidth = slideWidth * totalSlides;

      $slidesWrapper.css("width", totalWidth + "px");

      gsap.to($slidesWrapper, {
        x: `-=${slideWidth * slideCount}`,
        duration: 40,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => {
            const maxShift = slideWidth * slideCount;
            return parseFloat(x) % maxShift;
          }),
        },
      });
    });

    // ✅ method 탭 버튼
    $(".btnbox .six").on("click", function () {
      const tabId = $(this).data("tab");
      $(".btnbox .six").removeClass("active");
      $(this).addClass("active");

      $(".tab-content").removeClass("active").hide();
      $("#" + tabId)
        .addClass("active")
        .fadeIn(200);
    });

    $(".tab-content").hide();
    const firstTabId = $(".btnbox .six.active").data("tab");
    $("#" + firstTabId)
      .addClass("active")
      .show();

    // ✅ GSAP ScrollTrigger 등록
    gsap.registerPlugin(ScrollTrigger);

    // ✅ 초기 상태 설정
    gsap.set(".stickbox", { yPercent: 100, opacity: 1 });
    gsap.set(".graph.dark .ani", { opacity: 0, y: 0 });

    // ✅ 그래프 타임라인
    const graphTL = gsap.timeline({
      scrollTrigger: {
        trigger: ".graph.dark",
        start: "top 70%",
        toggleActions: "play none none none",
      },
    });

    graphTL.to(".stickbox", {
      yPercent: 0,
      opacity: 1,
      duration: 1.5,
      stagger: 0.5,
      ease: "power2.out",
    });

    graphTL.to(
      ".graph.dark .ani",
      {
        opacity: 1,
        duration: 0.8,
        ease: "power1.out",
        onComplete: function () {
          gsap.to(".graph.dark .ani", {
            y: -8,
            duration: 0.7,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        },
      },
      "+=0.1"
    );
  });

  // ✅ AOS 리프레시용 ScrollTrigger 추가 (아래 코드 그대로 삽입)
  ScrollTrigger.create({
    trigger: ".graph.dark",
    start: "top center",
    once: true,
    onEnter: () => {
      setTimeout(() => {
        AOS.refreshHard();
      }, 300);
    },
  });

  // ✅ solution 탭

  const buttons = document.querySelectorAll(".solution .button");
  const contents = document.querySelectorAll(".solution .leftbox");
  const images = document.querySelectorAll(".solution .rightbox img");
  const indicator = document.querySelector(".solution .indicator");
  const dots = document.querySelectorAll(".underline-dots li");
  const downbox = document.querySelector(".solution .downbox");

  let currentIndex = 0;

  // 공통 탭 활성화 함수
  function activateTab(index) {
    const target = buttons[index].dataset.tab;

    // 버튼 active 처리
    buttons.forEach((b) => b.classList.remove("active"));
    buttons[index].classList.add("active");

    // 텍스트 show/hide
    contents.forEach((box) => {
      box.style.display = box.dataset.tab === target ? "flex" : "none";
    });

    // 이미지 show/hide
    images.forEach((img) => {
      img.style.display = img.dataset.tab === target ? "block" : "none";
    });

    // 인디케이터 위치 이동
    if (indicator) {
      const buttonWidth = 100 / buttons.length;
      indicator.style.left = `${buttonWidth * index}%`;
      indicator.style.width = `${buttonWidth}%`;
    }

    // 불릿 active 처리
    dots.forEach((dot) => dot.classList.remove("active"));
    if (dots[index]) dots[index].classList.add("active");

    // 현재 인덱스 저장
    currentIndex = index;
  }

  // 초기 상태 세팅
  activateTab(0);

  // 버튼 클릭 이벤트
  buttons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      activateTab(index);
    });
  });

  // 불릿 클릭 이벤트
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      activateTab(index);
    });
  });

  // 모바일 터치 슬라이드 이벤트
  let startX = 0;

  downbox.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  downbox.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < buttons.length - 1) {
        activateTab(currentIndex + 1);
      } else if (diff < 0 && currentIndex > 0) {
        activateTab(currentIndex - 1);
      }
    }
  });

  // ✅ 리뷰 Swiper
  const swiperReview = new Swiper(".review_slide", {
    slidesPerView: 1,
    spaceBetween: 60,
    speed: 800,
    loop: true,
    navigation: {
      nextEl: ".review button.next",
    },
    scrollbar: {
      el: ".review .swiper-scrollbar",
      hide: false,
      draggable: true,
    },
    breakpoints: {
      1440: {
        slidesPerView: "auto",
        spaceBetween: 24,
      },
      768: {
        slidesPerView: "auto",
        spaceBetween: 20,
      },
      480: {
        slidesPerView: 1,
        spaceBetween: 80,
      },
    },
    on: {
      init() {
        console.log("Swiper 리뷰 초기화 완료");
      },
      slideChange() {
        console.log("슬라이드 변경됨");
      },
    },
  });

  // View
  let view_swiper = new Swiper(".view_slide", {
    effect: "coverflow",
    grabCursor: true,
    initialSlide: 0,
    centeredSlides: true,
    loop: true,
    slidesPerView: "auto",
    spaceBetween: 220,
    speed: 700,
    coverflowEffect: {
      rotate: 40,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    navigation: {
      nextEl: ".view .next",
      prevEl: ".view .prev",
    },
    pagination: {
      el: ".view .swiper-pagination",
      type: "fraction",
    },
    watchSlidesProgress: true,
    breakpoints: {
      1920: {
        spaceBetween: 220,
      },
      1440: {
        spaceBetween: 200,
      },
      1080: {
        spaceBetween: 100,
      },
    },
  });
});
