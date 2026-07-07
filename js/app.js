const config = {
  CONSULT_FORM_URL: "CONSULT_FORM_URL_PLACEHOLDER",
  REPORT_FORM_URL: "REPORT_FORM_URL_PLACEHOLDER",
  NAVER_NOTICE_BOARD_URL: "NAVER_NOTICE_BOARD_URL_PLACEHOLDER",
  NAVER_ACTIVITY_BOARD_URL: "NAVER_ACTIVITY_BOARD_URL_PLACEHOLDER",
  EMAIL: "EMAIL_PLACEHOLDER",
  NAVER_CAFE_URL: "NAVER_CAFE_URL_PLACEHOLDER",
  COPYRIGHT: "COPYRIGHT_PLACEHOLDER",
  QUICK_LINKS: [
    {
      title: "화섬식품노조 홈페이지",
      icon: "building-2",
      url: "KCTFU_URL_PLACEHOLDER"
    },
    {
      title: "화섬식품노조 YouTube",
      icon: "youtube",
      url: "KCTFU_YOUTUBE_URL_PLACEHOLDER"
    },
    {
      title: "Altibase Union 네이버 카페",
      icon: "messages-square",
      url: "NAVER_CAFE_URL_PLACEHOLDER"
    }
  ]
};

const fallbackLinks = {
  cafe: "https://cafe.naver.com/altibaseunion",
  form: "#"
};

const sampleNoticeData = [
  { title: "Altibase 노동조합 홈페이지를 준비하고 있습니다", date: "2026-07-07", url: fallbackLinks.cafe },
  { title: "조합원 의견 수렴 창구 안내", date: "2026-07-03", url: fallbackLinks.cafe },
  { title: "정기 소통 일정 및 참여 방법 안내", date: "2026-06-28", url: fallbackLinks.cafe },
  { title: "노동조합 가입 및 문의 절차 안내", date: "2026-06-20", url: fallbackLinks.cafe },
  { title: "개인정보 보호와 상담 접수 원칙 안내", date: "2026-06-14", url: fallbackLinks.cafe }
];

const sampleActivityData = [
  { title: "조합원 소통 채널 정비 진행", date: "2026-07-05", url: fallbackLinks.cafe },
  { title: "근무환경 개선 의견 취합", date: "2026-06-30", url: fallbackLinks.cafe },
  { title: "상담 및 제보 접수 체계 검토", date: "2026-06-24", url: fallbackLinks.cafe },
  { title: "조합 운영 투명성 강화 방안 논의", date: "2026-06-18", url: fallbackLinks.cafe },
  { title: "대외 노동단체 자료 검토", date: "2026-06-10", url: fallbackLinks.cafe }
];

function isPlaceholder(value) {
  return !value || value.includes("PLACEHOLDER");
}

function resolveUrl(value, fallback = "#") {
  return isPlaceholder(value) ? fallback : value;
}

function sanitizePost(post) {
  return {
    title: post.title || "제목 없음",
    date: post.date || "",
    url: resolveUrl(post.url, fallbackLinks.cafe)
  };
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

  container.innerHTML = posts.slice(0, 5).map((rawPost) => {
    const post = sanitizePost(rawPost);

    return `
      <a class="post-item" href="${post.url}" target="_blank" rel="noopener">
        <p class="post-title">${post.title}</p>
        <div class="post-meta">
          <span>${type}</span>
          <span aria-hidden="true">·</span>
          <time datetime="${post.date}">${post.date}</time>
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

  container.innerHTML = config.QUICK_LINKS.map((link) => `
    <a class="quick-link-card" href="${resolveUrl(link.url, "#")}" target="_blank" rel="noopener">
      <span class="icon-box"><i data-lucide="${link.icon || "external-link"}" aria-hidden="true"></i></span>
      <span>
        <h4>${link.title}</h4>
        <p>새 창에서 바로가기</p>
      </span>
    </a>
  `).join("");
}

async function fetchRecentPosts() {
  // TODO: 네이버 카페 게시글을 Google Apps Script JSON API로 중계한 뒤 이 함수에서 fetch로 연결합니다.
  // TODO: API 응답은 { notices: [{ title, date, url }], activities: [{ title, date, url }] } 형태를 권장합니다.
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
  const linkMap = {
    noticeMoreLink: resolveUrl(config.NAVER_NOTICE_BOARD_URL, fallbackLinks.cafe),
    activityMoreLink: resolveUrl(config.NAVER_ACTIVITY_BOARD_URL, fallbackLinks.cafe),
    consultButton: resolveUrl(config.CONSULT_FORM_URL, fallbackLinks.form)
  };

  Object.entries(linkMap).forEach(([id, url]) => {
    const element = document.getElementById(id);
    if (element) {
      element.href = url;
    }
  });
}

function setupFooter() {
  const emailLink = document.getElementById("footerEmailLink");
  const cafeLink = document.getElementById("footerCafeLink");
  const copyrightText = document.getElementById("copyrightText");

  if (emailLink) {
    emailLink.href = isPlaceholder(config.EMAIL) ? "#" : `mailto:${config.EMAIL}`;
    emailLink.textContent = config.EMAIL;
  }

  if (cafeLink) {
    cafeLink.href = resolveUrl(config.NAVER_CAFE_URL, "#");
  }

  if (copyrightText) {
    copyrightText.textContent = config.COPYRIGHT;
  }
}

async function init() {
  setupExternalLinks();
  setupFooter();
  renderQuickLinks();

  const { notices, activities } = await fetchRecentPosts();
  renderPosts("noticeList", notices, "공지사항");
  renderPosts("activityList", activities, "활동보고");

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

document.addEventListener("DOMContentLoaded", init);
