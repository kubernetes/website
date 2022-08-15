---
content_type: concept
title: K8s 문서에 기여하기
linktitle: 기여
main_menu: true
no_list: true
weight: 80
card:
  name: contribute
  weight: 10
  title: K8s에 기여 시작하기
---

<!-- overview -->

*쿠버네티스는 신규 및 숙련된 모든 기여자의 개선을 환영합니다!*

{{< note >}}
일반적인 쿠버네티스에 기여하는 방법에 대한 자세한 내용은
[기여자 문서](https://www.kubernetes.dev/docs/)를 참고한다.

또한, 쿠버네티스 기여에 대한 내용은
{{< glossary_tooltip text="CNCF" term_id="cncf" >}}
[문서](https://contribute.cncf.io/contributors/projects/#kubernetes)
를 참고한다.
{{< /note >}}

---

이 웹사이트는 [쿠버네티스 SIG Docs](/ko/docs/contribute/#sig-docs에-참여)에 의해서 관리됩니다.

쿠버네티스 문서 기여자들은

- 기존 콘텐츠를 개선합니다.
- 새 콘텐츠를 만듭니다.
- 문서를 번역합니다.
- 쿠버네티스 릴리스 주기에 맞추어 문서 부분을 관리하고 발행합니다.



<!-- body -->

## 시작하기

누구든지 문서에 대한 이슈를 오픈 또는 풀 리퀘스트(PR)를 사용해서
[`kubernetes/website` GitHub 리포지터리](https://github.com/kubernetes/website)에
변경하는 기여를 할 수 있습니다.
쿠버네티스 커뮤니티에 효과적으로 기여하려면
[git](https://git-scm.com/)과
[GitHub](https://lab.github.com/)에
익숙해야 합니다.

문서에 참여하려면

1. CNCF [Contributor License Agreement](https://github.com/kubernetes/community/blob/master/CLA.md)에 서명합니다.
2. [문서 리포지터리](https://github.com/kubernetes/website)와 웹사이트의
   [정적 사이트 생성기](https://gohugo.io)를 숙지합니다.
3. [풀 리퀘스트 열기](/ko/docs/contribute/new-content/open-a-pr/)와
   [변경 검토](/ko/docs/contribute/review/reviewing-prs/)의
   기본 프로세스를 이해하도록 합니다.

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart TB
subgraph third[PR 열기]
direction TB
U[ ] -.-
Q[컨텐츠 향상시키기] --- N[컨텐츠 생성하기]
N --- O[문서 번역하기]
O --- P[K8s 릴리스 사이클의 문서 파트<br>관리/퍼블리싱하기]

end

subgraph second[리뷰]
direction TB
   T[ ] -.-
   D[K8s/website<br>저장소 살펴보기] --- E[Hugo 정적 사이트<br>생성기 확인하기]
   E --- F[기본 GitHub 명령어<br>이해하기]
   F --- G[열려 있는 PR을 리뷰하기]
end

subgraph first[가입]
    direction TB
    S[ ] -.-
    B[CNCF<br>Contributor<br>License Agreement<br>서명하기] --- C[sig-docs 슬랙 채널<br>가입하기] 
    C --- V[kubernetes-sig-docs<br>메일링 리스트 가입하기]
    V --- M[주간<br>sig-docs 회의/<br>슬랙 미팅 참여하기]
end

A([fa:fa-user 신규<br>기여자]) --> first
A --> second
A --> third
A --> H[질문하세요!!!]


classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,C,D,E,F,G,H,M,Q,N,O,P,V grey
class S,T,U spacewhite
class first,second,third white
{{</ mermaid >}}
그림 1. 신규 기여자를 위한 시작 가이드.

그림 1은 신규 기여자를 위한 로드맵을 간략하게 보여줍니다. `가입` 및 `리뷰` 단계의 일부 또는 전체를 따를 수 있습니다. 이제 `PR 열기` 아래에 나열된 항목들을 수행하여 당신의 기여 목표를 달성할 수 있습니다. 다시 말하지만 질문은 언제나 환영입니다!

일부 작업에는 쿠버네티스 조직에서 더 많은 신뢰와 더 많은 접근이 필요할 수 있습니다.
역할과 권한에 대한 자세한 내용은
[SIG Docs 참여](/ko/docs/contribute/participate/)를 봅니다.

## 첫 번째 기여

몇 가지 단계를 미리 검토하여 첫 번째 기여를 준비할 수 있습니다. 그림 2는 각 단계를 설명하며, 그 다음에 세부 사항도 설명되어 있습니다.

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
    subgraph second[첫 기여]
    direction TB
    S[ ] -.-
    G[다른 K8s 멤버의 PR 리뷰하기] -->
    A[K8s/website 이슈 리스트에서<br>good first issue 확인하기] --> B[PR을 여세요!!]
    end
    subgraph first[추천 준비 사항]
    direction TB
       T[ ] -.-
       D[기여 개요 읽기] -->E[K8s 컨텐츠 및 <br>스타일 가이드 읽기]
       E --> F[Hugo 페이지 컨텐츠 종류와<br>shortcode 숙지하기]
    end
    

    first ----> second
     

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,D,E,F,G grey
class S,T spacewhite
class first,second white
{{</ mermaid >}}
그림 2. 첫 기여를 위한 준비.

- [기여 개요](/ko/docs/contribute/new-content/)를 읽고
  기여할 수 있는 다양한 방법에 대해 알아봅니다.
- [`kubernetes/website` 이슈 목록](https://github.com/kubernetes/website/issues/)을
  확인하여 좋은 진입점이 되는 이슈를 찾을 수 있습니다.
- 기존 문서에 대해 [GitHub을 사용해서 풀 리퀘스트 열거나](/ko/docs/contribute/new-content/open-a-pr/#github을-사용하여-변경하기)
  GitHub에서의 이슈 제기에 대해 자세히 알아봅니다.
- 정확성과 언어에 대해 다른 쿠버네티스 커뮤니티 맴버의
  [풀 리퀘스트 검토](/ko/docs/contribute/review/reviewing-prs/)를 합니다.
- 쿠버네티스 [콘텐츠](/docs/contribute/style/content-guide/)와
  [스타일 가이드](/docs/contribute/style/style-guide/)를 읽고 정보에 대한 코멘트를 남길 수 있습니다.
- [페이지 콘텐츠 유형](/docs/contribute/style/page-content-types/)과
  [휴고(Hugo) 단축코드(shortcodes)](/docs/contribute/style/hugo-shortcodes/)에 대해 배워봅니다.

## 다음 단계

- 리포지터리의 [로컬 복제본에서 작업](/ko/docs/contribute/new-content/open-a-pr/#fork-the-repo)하는
  방법을 배워봅니다.
- [릴리스된 기능](/docs/contribute/new-content/new-features/)을 문서화 합니다.
- [SIG Docs](/ko/docs/contribute/participate/)에 참여하고,
  [멤버 또는 검토자](/ko/docs/contribute/participate/roles-and-responsibilities/)가 되어봅니다.

- [현지화](/ko/docs/contribute/localization_ko/)를 시작하거나 도와줍니다.

## SIG Docs에 참여

[SIG Docs](/ko/docs/contribute/participate/)는 쿠버네티스 문서와 웹 사이트를 게시하고
관리하는 기여자 그룹입니다. SIG Docs에 참여하는 것은
쿠버네티스 기여자(기능 개발 및 다른 여러가지)가 쿠버네티스 프로젝트에 가장 큰 영향을
미칠 수 있는 좋은 방법입니다.

SIG Docs는 여러가지 방법으로 의견을 나누고 있습니다.

- [쿠버네티스 슬랙 인스턴스에서 `#sig-docs` 에 가입](https://slack.k8s.io/)하고,
  자신을 소개하세요!
- 더 광범위한 토론이 이루어지고 공식적인 결정이 기록이 되는
  [`kubernetes-sig-docs` 메일링 리스트에 가입](https://groups.google.com/forum/#!forum/kubernetes-sig-docs) 하세요.
- 2주마다 열리는 [SIG Docs 화상 회의](https://github.com/kubernetes/community/tree/master/sig-docs)에 참여하세요. 회의는 항상 `#sig-docs` 에 공지되며 [쿠버네티스 커뮤니티 회의 일정](https://calendar.google.com/calendar/embed?src=cgnt364vd8s86hr2phapfjc6uk%40group.calendar.google.com&ctz=America/Los_Angeles)에 추가됩니다. [줌(Zoom) 클라이언트](https://zoom.us/download)를 다운로드하거나 전화를 이용하여 전화 접속해야 합니다.
- 줌 화상 회의가 열리지 않은 경우, SIG Docs 비실시간 슬랙 스탠드업 회의에 참여하세요. 회의는 항상 `#sig-docs` 에 공지됩니다. 회의 공지 후 24시간까지 어느 스레드에나 기여할 수 있습니다.

## 다른 기여 방법들

- [쿠버네티스 커뮤니티 사이트](/ko/community/)를 방문하십시오. 트위터 또는 스택 오버플로우에 참여하고, 현지 쿠버네티스 모임과 이벤트 등에 대해 알아봅니다.
- [기여자 치트시트](https://www.kubernetes.dev/docs/contributor-cheatsheet/)를 읽고 쿠버네티스 기능 개발에 참여합니다.
- 쿠버네티스 기여자 사이트에서 [쿠버네티스 기여자](https://www.kubernetes.dev/)와 [추가적인 기여자 리소스](https://www.kubernetes.dev/resources/)에 대해 더 알아봅니다.
- [블로그 게시물 또는 사례 연구](/docs/contribute/new-content/blogs-case-studies/)를 제출합니다.

