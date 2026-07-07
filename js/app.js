const NAVER_NOTICE_BOARD_URL = "PLACEHOLDER";
const NAVER_ACTIVITY_BOARD_URL = "PLACEHOLDER";
const CONSULT_FORM_URL = "https://forms.gle/43E4x14eWB6X8oAF7";
const REPORT_FORM_URL = CONSULT_FORM_URL;

const sampleNoticeData = [
  { title: "Altibase 노동조합 홈페이지를 준비하고 있습니다", date: "2026-07-07", url: "https://cafe.naver.com/altibaseunion" },
  { title: "조합원 의견 수렴 창구 안내", date: "2026-07-03", url: "https://cafe.naver.com/altibaseunion" },
  { title: "정기 소통 일정 및 참여 방법 안내", date: "2026-06-28", url: "https://cafe.naver.com/altibaseunion" },
  { title: "노동조합 가입 및 문의 절차 안내", date: "2026-06-20", url: "https://cafe.naver.com/altibaseunion" },
  { title: "개인정보 보호와 상담 접수 원칙 안내", date: "2026-06-14", url: "https://cafe.naver.com/altibaseunion" }
];

const sampleActivityData = [
  { title: "조합원 소통 채널 정비 진행", date: "2026-07-05", url: "https://cafe.naver.com/altibaseunion" },
  { title: "근무환경 개선 의견 취합", date: "2026-06-30", url: "https://cafe.naver.com/altibaseunion" },
  { title: "상담 및 제보 접수 체계 검토", date: "2026-06-24", url: "https://cafe.naver.com/altibaseunion" },
  { title: "조합 운영 투명성 강화 방안 논의", date: "2026-06-18", url: "https://cafe.naver.com/altibaseunion" },
  { title: "대외 노동단체 자료 검토", date: "2026-06-10", url: "https://cafe.naver.com/altibaseunion" }
];

const quickLinks = [
  {
    title: "화섬식품노동조합 홈페이지",
    image: "./images/kctfu-symbol.png",
    url: "https://kctfu.org/"
  },
  {
    title: "화섬식품노조 YouTube",
    image: "./images/youtube.svg",
    url: "https://www.youtube.com/@kctfu"
  },
  {
    title: "법률 상담",
    icon: "scale",
    url: "https://kctfu.org/bbs/board.php?bo_table=law"
  },
  {
    title: "노사협의회 안건 수집",
    icon: "clipboard-list",
    url: "https://forms.gle/B3wFFgtCZ2phSn3b7"
  },
  {
    title: "상담 및 제보",
    icon: "message-circle",
    url: CONSULT_FORM_URL
  }
];

function createPlaceholderUrl(url) {
  return url === "PLACEHOLDER" ? "https://cafe.naver.com/altibaseunion" : url;
}

function renderPosts(containerId, posts, type) {
  const container = document.getElementById(containerId);

  if (!container) {
    return;
  }

  if (!Array.isArray(posts) || posts.length === 0) {
    container.innerHTML = `<p class="text-secondary mb-0">${type} 게시글을 불러오지 못했습니다. 네이버 카페에서 최신 내용을 확인해주세요.</p>`;
    return;
  }

  container.innerHTML = posts.slice(0, 5).map((post) => {
    const url = post.url || "https://cafe.naver.com/altibaseunion";
    const title = post.title || "제목 없음";
    const date = post.date || "";

    return `
      <a class="post-item" href="${url}" target="_blank" rel="noopener">
        <p class="post-title">${title}</p>
        <div class="post-meta">
          <span>${type}</span>
          <span aria-hidden="true">·</span>
          <time datetime="${date}">${date}</time>
        </div>
      </a>
    `;
  }).join("");
}

function renderQuickLinks() {
  const container = document.getElementById("quickLinksList");

  if (!container) {
    return;
  }

  container.innerHTML = quickLinks.map((link) => {
    const url = createPlaceholderUrl(link.url);
    const icon = link.icon || "external-link";
    const visual = link.image
      ? `<span class="quick-image-box"><img src="${link.image}" alt=""></span>`
      : `<span class="icon-box"><i data-lucide="${icon}" aria-hidden="true"></i></span>`;

    return `
      <a class="quick-link-card" href="${url}" target="_blank" rel="noopener">
        ${visual}
        <span>
          <h3>${link.title}</h3>
          <p>새 창에서 바로가기</p>
        </span>
      </a>
    `;
  }).join("");
}

async function fetchRecentPosts() {
  // TODO: 네이버 카페 게시글을 Google Apps Script JSON API로 중계한 뒤 이 함수에서 fetch로 연결합니다.
  // TODO: API 응답 형식은 [{ title, date, url }] 형태로 맞추면 renderPosts 함수를 그대로 사용할 수 있습니다.
  try {
    return {
      notices: sampleNoticeData,
      activities: sampleActivityData
    };
  } catch (error) {
    console.warn("게시글 API를 불러오지 못해 sample data를 표시합니다.", error);
    return {
      notices: sampleNoticeData,
      activities: sampleActivityData
    };
  }
}

function setupExternalLinks() {
  const noticeMoreLink = document.getElementById("noticeMoreLink");
  const activityMoreLink = document.getElementById("activityMoreLink");
  const consultButton = document.getElementById("consultButton");
  const reportButton = document.getElementById("reportButton");

  if (noticeMoreLink) {
    noticeMoreLink.href = createPlaceholderUrl(NAVER_NOTICE_BOARD_URL);
  }

  if (activityMoreLink) {
    activityMoreLink.href = createPlaceholderUrl(NAVER_ACTIVITY_BOARD_URL);
  }

  if (consultButton) {
    consultButton.href = createPlaceholderUrl(CONSULT_FORM_URL);
  }

  if (reportButton) {
    reportButton.href = createPlaceholderUrl(REPORT_FORM_URL);
  }
}

async function init() {
  setupExternalLinks();
  renderQuickLinks();

  const { notices, activities } = await fetchRecentPosts();
  renderPosts("noticeList", notices, "공지사항");
  renderPosts("activityList", activities, "활동보고");

  const year = document.getElementById("copyrightYear");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

document.addEventListener("DOMContentLoaded", init);
