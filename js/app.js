const config = {
  CONSULT_FORM_URL: "https://forms.gle/43E4x14eWB6X8oAF7",
  REPORT_FORM_URL: "https://forms.gle/43E4x14eWB6X8oAF7",
  NAVER_NOTICE_BOARD_URL: "https://cafe.naver.com/altibaseunion/menu/11",
  NAVER_ACTIVITY_BOARD_URL: "https://cafe.naver.com/altibaseunion",
  FALLBACK_POSTS_URL: "./data/posts.json",
  EMAIL: "altibaseUnion@gmail.com",
  NAVER_CAFE_URL: "https://cafe.naver.com/altibaseunion",
  COPYRIGHT: `Copyright © ${new Date().getFullYear()} Altibase 노동조합. All rights reserved.`,
  QUICK_LINKS: [
    {
      title: "화섬식품노동조합 홈페이지",
      icon: "building-2",
      url: "https://kctfu.org/"
    },
    {
      title: "화섬식품노조 YouTube",
      icon: "youtube",
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
      url: "https://forms.gle/43E4x14eWB6X8oAF7"
    }
  ]
};

const embeddedFallbackPosts = {
  notices: [
    { title: "Altibase 노동조합 홈페이지를 준비하고 있습니다", date: "2026-07-07", url: "https://cafe.naver.com/altibaseunion" },
    { title: "조합원 의견 수렴 창구 안내", date: "2026-07-03", url: "https://cafe.naver.com/altibaseunion" },
    { title: "정기 소통 일정 및 참여 방법 안내", date: "2026-06-28", url: "https://cafe.naver.com/altibaseunion" },
    { title: "노동조합 가입 및 문의 절차 안내", date: "2026-06-20", url: "https://cafe.naver.com/altibaseunion" },
    { title: "개인정보 보호와 상담 접수 원칙 안내", date: "2026-06-14", url: "https://cafe.naver.com/altibaseunion" }
  ],
  activities: [
    { title: "조합원 소통 채널 정비 진행", date: "2026-07-05", url: "https://cafe.naver.com/altibaseunion" },
    { title: "근무환경 개선 의견 취합", date: "2026-06-30", url: "https://cafe.naver.com/altibaseunion" },
    { title: "상담 및 제보 접수 체계 검토", date: "2026-06-24", url: "https://cafe.naver.com/altibaseunion" },
    { title: "조합 운영 투명성 강화 방안 논의", date: "2026-06-18", url: "https://cafe.naver.com/altibaseunion" },
    { title: "대외 노동단체 자료 검토", date: "2026-06-10", url: "https://cafe.naver.com/altibaseunion" }
  ]
};

function isPlaceholder(value) {
  return !value || value.includes("PLACEHOLDER");
}

function resolveUrl(value, fallback = "#") {
  return isPlaceholder(value) ? fallback : value;
}

function normalizeText(value) {
  return (value || "").replace(/\s+/g, " ").trim();
}

function toAbsoluteUrl(href, baseUrl) {
  try {
    return new URL(href, baseUrl).toString();
  } catch (error) {
    return baseUrl;
  }
}

function sanitizePost(post) {
  return {
    title: normalizeText(post.title) || "제목 없음",
    date: normalizeText(post.date),
    url: resolveUrl(post.url, config.NAVER_CAFE_URL)
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

async function loadFallbackPosts() {
  if (typeof fetch !== "function") {
    return embeddedFallbackPosts;
  }

  try {
    const response = await fetch(config.FALLBACK_POSTS_URL, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`fallback data HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn("fallback posts.json을 불러오지 못해 내장 샘플 데이터를 사용합니다.", error);
    return embeddedFallbackPosts;
  }
}

function extractDate(text) {
  const normalized = normalizeText(text);
  const fullDate = normalized.match(/\b(20\d{2})[.\-/](\d{1,2})[.\-/](\d{1,2})\b/);

  if (fullDate) {
    const [, year, month, day] = fullDate;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const shortDate = normalized.match(/\b(\d{1,2})[.](\d{1,2})\b/);

  if (shortDate) {
    const [, month, day] = shortDate;
    return `${new Date().getFullYear()}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  return "";
}

function parseNaverCafePosts(html, boardUrl) {
  if (typeof DOMParser !== "function") {
    throw new Error("DOMParser is not available in this browser context.");
  }

  const document = new DOMParser().parseFromString(html, "text/html");
  const selectors = [
    "a.article",
    "a[href*='ArticleRead']",
    "a[href*='articleid=']",
    "a[href*='menuid=']"
  ];
  const anchors = [...document.querySelectorAll(selectors.join(","))];
  const seen = new Set();

  return anchors.map((anchor) => {
    const title = normalizeText(anchor.textContent);
    const href = anchor.getAttribute("href");

    if (!title || !href || seen.has(href)) {
      return null;
    }

    seen.add(href);

    const row = anchor.closest("tr, li, .article-board, .article-list") || anchor.parentElement;
    const date = extractDate(row ? row.textContent : "");

    return {
      title,
      date,
      url: toAbsoluteUrl(href, boardUrl)
    };
  }).filter(Boolean).filter((post) => post.title.length > 1).slice(0, 5);
}

async function fetchNaverCafeNoticePosts() {
  if (typeof fetch !== "function") {
    throw new Error("fetch is not available in this browser context.");
  }

  const response = await fetch(config.NAVER_NOTICE_BOARD_URL, {
    credentials: "omit",
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Naver Cafe HTTP ${response.status}`);
  }

  const html = await response.text();
  const posts = parseNaverCafePosts(html, config.NAVER_NOTICE_BOARD_URL);

  if (posts.length === 0) {
    throw new Error("Naver Cafe response did not contain parseable article links.");
  }

  return posts;
}

async function fetchRecentPosts() {
  const fallbackPosts = await loadFallbackPosts();

  try {
    const notices = await fetchNaverCafeNoticePosts();

    return {
      notices,
      activities: fallbackPosts.activities || embeddedFallbackPosts.activities
    };
  } catch (error) {
    console.warn("네이버 카페 공지사항 자동 수집에 실패하여 fallback data를 표시합니다.", error);

    return {
      notices: fallbackPosts.notices || embeddedFallbackPosts.notices,
      activities: fallbackPosts.activities || embeddedFallbackPosts.activities
    };
  }
}

function setupExternalLinks() {
  const linkMap = {
    noticeMoreLink: resolveUrl(config.NAVER_NOTICE_BOARD_URL, config.NAVER_CAFE_URL),
    activityMoreLink: resolveUrl(config.NAVER_ACTIVITY_BOARD_URL, config.NAVER_CAFE_URL),
    consultButton: resolveUrl(config.CONSULT_FORM_URL, "#")
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
    emailLink.href = `mailto:${config.EMAIL}`;
    emailLink.textContent = config.EMAIL;
  }

  if (cafeLink) {
    cafeLink.href = resolveUrl(config.NAVER_CAFE_URL, config.NAVER_CAFE_URL);
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
