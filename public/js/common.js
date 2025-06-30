/* ============================
   공통 요소 - vh 단위 보정
============================ */
function setVhUnit() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

// 최초 실행
setVhUnit();

// resize 시 debounce 적용
let vhResizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(vhResizeTimeout);
  vhResizeTimeout = setTimeout(() => {
    setVhUnit();
  }, 200);
});

/* ============================
   AOS 초기화 및 반응형 대응
============================ */

// AOS 설정 함수 (중복 제거)
function initAOS() {
  AOS.init({
    once: false,
    offset: window.innerWidth <= 768 ? 100 : 400,
    duration: 1000,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  });
}

// 최초 실행
initAOS();

// resize 시 AOS 새로고침 (init 재실행 금지)
let aosResizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(aosResizeTimeout);
  aosResizeTimeout = setTimeout(() => {
    AOS.refreshHard(); // 더 강력한 위치 재계산
  }, 200);
});

/* ============================
   헤더 스크롤 제어
============================ */
let lastScrollTop = window.scrollY;

function handleHeaderScroll() {
  const scrollTop = window.scrollY;
  const header = document.querySelector("header");

  if (!header) return;

  // 배경 처리
  header.classList.toggle("scrolled", scrollTop > 10);

  // 스크롤 방향 따라 헤더 숨기기
  if (scrollTop > lastScrollTop) {
    header.style.transform = "translateY(-100%)";
  } else {
    header.style.transform = "translateY(0)";
  }

  lastScrollTop = scrollTop;
}

// 이벤트 바인딩
window.addEventListener("scroll", handleHeaderScroll);
