const state = {
  sessionId: "",
  slug: "",
  title: "",
  converted: "",
  previewUrl: ""
};

const bootWarning = document.querySelector("#bootWarning");
const uploadForm = document.querySelector("#uploadForm");
const analyzeButton = document.querySelector("#analyzeButton");
const metadata = document.querySelector("#metadata");
const sourceText = document.querySelector("#sourceText");
const convertedText = document.querySelector("#convertedText");
const issues = document.querySelector("#issues");
const output = document.querySelector("#output");
const validateButton = document.querySelector("#validateButton");
const writeButton = document.querySelector("#writeButton");
const checkButton = document.querySelector("#checkButton");
const buildButton = document.querySelector("#buildButton");
const gitButton = document.querySelector("#gitButton");
const previewLink = document.querySelector("#previewLink");

if (bootWarning) {
  if (window.location.protocol.startsWith("http") && window.location.port === "4177") {
    bootWarning.hidden = true;
  } else {
    bootWarning.innerHTML =
      '관리 앱 주소가 아닐 수 있습니다. 프로젝트 폴더에서 <strong>npm run content:app</strong>을 실행한 뒤 <strong>http://localhost:4177</strong>로 접속해 주세요.';
  }
}

function setOutput(value) {
  output.textContent = typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

function renderMetadata(data) {
  metadata.classList.remove("empty");
  metadata.innerHTML = `
    <dl>
      <dt>제목</dt><dd>${data.title}</dd>
      <dt>날짜</dt><dd>${data.date}</dd>
      <dt>요약</dt><dd>${data.summary}</dd>
      <dt>태그</dt><dd>${data.tags.join(", ")}</dd>
      <dt>slug</dt><dd>${data.slug}</dd>
      <dt>원문 URL</dt><dd>${data.sourceUrl || "미입력"}</dd>
    </dl>
  `;
}

function renderIssues(items) {
  if (!items.length) {
    issues.innerHTML = '<li class="ok">검증 오류가 없습니다.</li>';
    return;
  }
  issues.innerHTML = items
    .map((item) => `<li class="${item.level}">[${item.level.toUpperCase()}] ${item.message}</li>`)
    .join("");
}

function showError(error) {
  const message = error instanceof Error ? error.message : String(error);
  renderIssues([{ level: "error", message }]);
  setOutput(message);
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(data.error || "요청에 실패했습니다.");
  return data;
}

async function analyzeSelectedFile() {
  try {
    const fileInput = document.querySelector("#fileInput");
    if (!fileInput.files.length) {
      throw new Error("먼저 Markdown 또는 Notion ZIP 파일을 선택해 주세요.");
    }
    setOutput("분석 중입니다...");
    analyzeButton.disabled = true;
    const formData = new FormData(uploadForm);
    const response = await fetch("/api/analyze", { method: "POST", body: formData });
    const data = await response.json();
    if (!response.ok || data.error) {
      throw new Error(data.error || "분석에 실패했습니다.");
    }

    state.sessionId = data.sessionId;
    state.slug = data.metadata.slug;
    state.title = data.metadata.title;
    state.converted = data.converted;
    state.previewUrl = data.previewUrl;
    sourceText.value = data.source;
    convertedText.value = data.converted;
    renderMetadata(data.metadata);
    renderIssues(data.issues);
    validateButton.disabled = false;
    writeButton.disabled = false;
    previewLink.href = data.previewUrl;
    previewLink.classList.remove("disabled");
    setOutput(`변환 완료: ${data.fileName}\n초안 slug: ${state.slug}`);
  } catch (error) {
    showError(error);
  } finally {
    analyzeButton.disabled = false;
  }
}

uploadForm.addEventListener("submit", (event) => {
  event.preventDefault();
  analyzeSelectedFile();
});

analyzeButton.addEventListener("click", analyzeSelectedFile);

validateButton.addEventListener("click", async () => {
  setOutput("검증 중입니다...");
  const data = await postJson("/api/validate", {
    markdown: convertedText.value,
    slug: state.slug
  });
  renderIssues(data.issues);
  setOutput("검증을 완료했습니다.");
});

writeButton.addEventListener("click", async () => {
  setOutput("활동보고 Markdown을 생성하는 중입니다...");
  const data = await postJson("/api/write", {
    sessionId: state.sessionId,
    slug: state.slug,
    markdown: convertedText.value
  });
  gitButton.disabled = false;
  setOutput(`생성 완료\nMarkdown: ${data.filePath}\n이미지 폴더: ${data.imageDir}\n\nAstro 개발 서버가 켜져 있으면 미리보기 링크를 열어 확인하세요.`);
});

checkButton.addEventListener("click", async () => {
  setOutput("npm run check 실행 중입니다...");
  const data = await postJson("/api/run", { script: "check" });
  setOutput(data.output || `종료 코드: ${data.code}`);
});

buildButton.addEventListener("click", async () => {
  setOutput("npm run build 실행 중입니다...");
  const data = await postJson("/api/run", { script: "build" });
  setOutput(data.output || `종료 코드: ${data.code}`);
});

gitButton.addEventListener("click", async () => {
  setOutput("콘텐츠 브랜치와 Draft PR을 준비하는 중입니다...");
  const data = await postJson("/api/git", {
    slug: state.slug,
    title: state.title
  });
  setOutput(data);
});
