export const siteConfig = {
  title: "Altibase 노동조합",
  description: "Altibase 노동조합 공식 포털. 조합원 권익 보호, 소통과 참여, 투명한 활동을 위한 안내와 소식.",
  email: "altibaseUnion@gmail.com",
  naverCafeUrl: "https://cafe.naver.com/altibaseunion",
  noticeBoardUrl: "https://cafe.naver.com/altibaseunion/menu/11",
  activityBoardUrl: "https://cafe.naver.com/altibaseunion",
  consultFormUrl: "https://forms.gle/43E4x14eWB6X8oAF7",
  reportFormUrl: "https://forms.gle/43E4x14eWB6X8oAF7",
  quickLinks: [
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

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);

export const sortPosts = <T extends { data: { date: Date; pinned: boolean } }>(posts: T[]) =>
  [...posts].sort((a, b) => {
    if (a.data.pinned !== b.data.pinned) {
      return a.data.pinned ? -1 : 1;
    }

    return b.data.date.getTime() - a.data.date.getTime();
  });
