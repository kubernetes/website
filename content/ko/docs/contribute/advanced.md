---
title: 고급 기여
slug: advanced
content_type: concept
weight: 98
---

<!-- overview -->

이 페이지에서는 당신이
[새로운 콘텐츠에 기여](/ko/docs/contribute/new-content/overview)하고
[다른 사람의 작업을 리뷰](/ko/docs/contribute/review/reviewing-prs/)하는 방법을
이해한다고 가정한다. 또한 기여하기 위한 더 많은 방법에 대해 배울 준비가 되었다고 가정한다. 이러한
작업 중 일부에는 Git 커맨드 라인 클라이언트와 다른 도구를 사용해야 한다.



<!-- body -->

## 일주일 동안 PR 랭글러(Wrangler) 되기

SIG Docs [승인자](/ko/docs/contribute/participating/#승인자)는 리포지터리에 대해 1주일 정도씩 [PR을 조정(wrangling)](https://github.com/kubernetes/website/wiki/PR-Wranglers)하는 역할을 맡는다.

PR 랭글러의 임무는 다음과 같다.

- [스타일](/docs/contribute/style/style-guide/)과 [콘텐츠](/docs/contribute/style/content-guide/) 가이드를 준수하는지에 대해 [열린(open) 풀 리퀘스트](https://github.com/kubernetes/website/pulls)를 매일 리뷰한다.
  - 가장 작은 PR(`size/XS`)을 먼저 리뷰한 다음, 가장 큰(`size/XXL`) PR까지 옮겨가며 리뷰를 반복한다.
  - 가능한 한 많은 PR을 리뷰한다.
- 각 기여자가 CLA에 서명했는지 확인한다.
  - 새로운 기여자가 [CLA](https://github.com/kubernetes/community/blob/master/CLA.md)에 서명하도록 도와준다.
  - CLA에 서명하지 않은 기여자에게 CLA에 서명하도록 자동으로 알리려면 [이](https://github.com/zparnold/k8s-docs-pr-botherer) 스크립트를 사용한다.
- 제안된 변경 사항에 대한 피드백을 제공하고 다른 SIG의 멤버로부터의 기술 리뷰가 잘 진행되게 조율한다.
  - 제안된 콘텐츠 변경에 대해 PR에 인라인 제안(inline suggestion)을 제공한다.
  - 내용을 확인해야 하는 경우, PR에 코멘트를 달고 자세한 내용을 요청한다.
  - 관련 `sig/` 레이블을 할당한다.
  - 필요한 경우, 파일의 머리말(front matter)에 있는 `reviewers:` 블록의 리뷰어를 할당한다.
  - PR의 리뷰 상태를 표시하기 위해 `Docs Review` 와 `Tech Review` 레이블을 할당한다.
  - 아직 리뷰되지 않은 PR에 `Needs Doc Review` 나 `Needs Tech Review` 를 할당한다.
  - 리뷰가 진행되었고, 병합하기 전에 추가 입력이나 조치가 필요한 PR에 `Doc Review: Open Issues` 나 `Tech Review: Open Issues` 를 할당한다.
  - 병합할 수 있는 PR에 `/lgtm` 과 `/approve` 를 할당한다.
- PR이 준비가 되면 병합하거나, 수락해서는 안되는 PR을 닫는다.
  - 콘텐츠가 문서의 [스타일 가이드라인](/docs/contribute/style/style-guide/) 중 일부만 충족하더라도 정확한 기술 콘텐츠를 수락하는 것이 좋다. 스타일 문제를 해결하기 위해 `good first issue` 라는 레이블로 새로운 이슈를 연다.
- 새로운 이슈를 매일 심사하고 태그를 지정한다. SIG Docs가 메타데이터를 사용하는 방법에 대한 지침은 [이슈 심사 및 분류](/ko/docs/contribute/review/for-approvers/#이슈-심사와-분류)를 참고한다.

## 랭글러에게 유용한 GitHub 쿼리

다음의 쿼리는 랭글러에게 도움이 된다. 이 쿼리들을 수행하여 작업한 후에는, 리뷰할 나머지 PR 목록은
일반적으로 작다. 이 쿼리들은 특히 현지화 PR을 제외하고, `master` 브랜치만 포함한다(마지막 쿼리는 제외).

- [CLA 서명 없음, 병합할 수 없음](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+label%3A%22cncf-cla%3A+no%22+-label%3Ado-not-merge+label%3Alanguage%2Fen):
  CLA에 서명하도록 기여자에게 상기시킨다. 봇과 사람이 이미 알렸다면, PR을 닫고
  CLA에 서명한 후 PR을 열 수 있음을 알린다.
  **작성자가 CLA에 서명하지 않은 PR은 리뷰하지 않는다!**
- [LGTM 필요](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Aopen+is%3Apr+-label%3Ado-not-merge+label%3Alanguage%2Fen+-label%3Algtm+):
  기술 리뷰가 필요한 경우, 봇이 제안한 리뷰어 중 한 명을 지정한다. 문서 리뷰나
  교정이 필요한 경우, 변경 사항을 제안하거나 교정하는 커밋을 PR에 추가하여 진행한다.
- [LGTM 보유, 문서 승인 필요](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+-label%3Ado-not-merge+label%3Alanguage%2Fen+label%3Algtm):
  PR을 병합하기 위해 추가 변경이나 업데이트가 필요한지 여부를 결정한다. PR을 병합할 준비가 되었다고 생각되면, `/approve` 코멘트를 남긴다.
- [퀵윈(Quick Wins)](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aopen+base%3Amaster+-label%3A%22do-not-merge%2Fwork-in-progress%22+-label%3A%22do-not-merge%2Fhold%22+label%3A%22cncf-cla%3A+yes%22+label%3A%22size%2FXS%22+label%3A%22language%2Fen%22+): 명확한 결격 사유가 없는 master에 대한 작은 PR인 경우. ([XS, S, M, L, XL, XXL] 크기의 PR을 작업할 때 크기 레이블에서 "XS"를 변경한다)
- [master 이외의 브랜치에 대한 PR](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Aopen+is%3Apr+-label%3Ado-not-merge+label%3Alanguage%2Fen+-base%3Amaster): `dev-` 브랜치에 대한 것일 경우, 곧 출시될 예정인 릴리스이다. `/assign @<meister's_github-username>` 을 코멘트로 추가하여 [릴리스 마이스터](https://github.com/kubernetes/sig-release/tree/master/release-team)가 그것에 대해 알고 있는지 확인한다. 오래된 브랜치에 대한 PR인 경우, PR 작성자가 가장 적합한 브랜치를 대상으로 하고 있는지 여부를 파악할 수 있도록 도와준다.

### 풀 리퀘스트를 종료하는 시기

리뷰와 승인은 PR 대기열을 최신 상태로 유지하는 도구 중 하나이다. 또 다른 도구는 종료(closure)이다.

- CLA가 2주 동안 서명되지 않은 모든 PR을 닫는다.
PR 작성자는 CLA에 서명한 후 PR을 다시 열 수 있으므로, 이는 어떤 것도 CLA 서명없이 병합되지 않게 하는 위험이 적은 방법이다.

- 작성자가 2주 이상 동안 코멘트나 피드백에 응답하지 않은 모든 PR을 닫는다.

풀 리퀘스트를 닫는 것을 두려워하지 말자. 기여자는 진행 중인 작업을 쉽게 다시 열고 다시 시작할 수 있다. 종종 종료 통지는 작성자가 기여를 재개하고 끝내도록 자극하는 것이다.

풀 리퀘스트를 닫으려면, PR에 `/close` 코멘트를 남긴다.

{{< note >}}

[`fejta-bot`](https://github.com/fejta-bot)이라는 자동화 서비스는 90일 동안 활동이 없으면 자동으로 이슈를 오래된 것으로 표시한 다음, 그 상태에서 추가로 30일 동안 활동이 없으면 종료한다. PR 랭글러는 14-30일 동안 활동이 없으면 이슈를 닫아야 한다.

{{< /note >}}

## 개선 제안

SIG Docs [멤버](/ko/docs/contribute/participating/#멤버)는 개선을 제안할 수 있다.

한 동안 쿠버네티스 문서에 기여한 후에,
[스타일 가이드](/docs/contribute/style/style-guide/),
[컨텐츠 가이드](/docs/contribute/style/content-guide/), 문서 작성에 사용되는 툴체인,
website 스타일, 풀 리퀘스트 리뷰와 병합
프로세스 또는 문서 작성의 다른 측면을 개선하기 위한 아이디어가 있을 수 있다. 투명성을 극대화하려면,
이러한 유형의 제안을 SIG Docs 회의나
[kubernetes-sig-docs 메일링리스트](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)에서 논의해야 한다.
또한, 현재의 작업 방식과 과거의 결정이 왜 획기적인 변경을
제안하기 전에 결정되었는지에 대한 맥락을 이해하는 데 실제로
도움이 될 수 있다. 현재의 문서 작업이 어떻게 진행되는지에 대한 질문의
답변을 얻는 가장 빠른 방법은 [kubernetes.slack.com](https://kubernetes.slack.com)의
`#sig-docs` 슬랙 채널에 문의하는 것이다.

토론이 진행되고 원하는 결과에 SIG가 동의한
후에는, 제안한 변경 사항과 가장 적합한 방식으로
작업할 수 있다. 예를 들어, 스타일 가이드나 website의
기능을 업데이트하려면, sig-testing과 함께 작업이 필요할 수 있는
문서 테스트와 관련된 변경에 대해 풀 리퀘스트를 열어야 할 수 있다.

## 쿠버네티스 릴리스를 위한 문서 조정

SIG Docs [승인자](/ko/docs/contribute/participating/#승인자)는 쿠버네티스
릴리스에 대한 문서를 조정할 수 있다.

각 쿠버네티스 릴리스는 sig-release SIG(Special Interest Group)에 참여하는
사람들의 팀에 의해 조정된다. 특정 릴리스에 대한 릴리스 팀의 다른 구성원에는
전체 릴리스 리드와 sig-pm, sig-testing 및 기타 담당자가
포함된다. 쿠버네티스 릴리스 프로세스에 대한 자세한 내용은
[https://github.com/kubernetes/sig-release](https://github.com/kubernetes/sig-release)를
참고한다.

특정 릴리스의 SIG Docs 담당자는 다음 작업을 조정한다.

- 문서에 영향을 미치는 새로운 기능이나 변경된 기능이 있는지 기능-추적 스프레드시트를
  모니터링한다. 특정 기능에 대한 문서가 릴리스를 위해 준비가
  되지 않은 경우, 해당 기능이 릴리스 되지 않을 수 있다.
- sig-release 미팅에 정기적으로 참석하고 릴리스에 대한 문서의
  상태를 업데이트한다.
- 기능 구현을 담당하는 SIG가 작성한 기능 문서를
  리뷰하고 교정한다.
- 릴리스 관련 풀 리퀘스트를 병합하고 릴리스에 대한 Git 기능 브랜치를
  유지 보수한다.
- 앞으로 이 역할을 수행하는 방법을 배우려는 다른 SIG Docs 기여자들을
  멘토링한다. 이것을 "섀도잉"이라고 한다.
- 릴리스에 대한 산출물이 공개될 때 릴리스와 관련된 문서 변경
  사항을 공개한다.

릴리스 조정은 일반적으로 3-4개월의 책임이며, SIG Docs 승인자
사이에서 의무가 순환된다.

## 새로운 기여자 홍보대사로 봉사

SIG Docs [승인자](/ko/docs/contribute/participating/#승인자)는 새로운 기여자
홍보대사로 활동할 수 있다.

새로운 기여자 홍보대사는 SIG-Docs에 기여한 새 기여자를 환영하고,
새 기여자에게 PR을 제안하고, 첫 몇 번의 PR 제출을 통해
새 기여자를 멘토링한다.

새로운 기여자 홍보대사의 책임은 다음과 같다.

- [#sig-docs 슬랙 채널](https://kubernetes.slack.com)에서 새로운 기여자의 질문을 모니터링한다.
- PR 랭글러와 협력하여 새로운 기여자에게 좋은 첫 이슈를 파악한다.
- 문서 리포지터리에 대한 처음 몇 번의 PR을 통해 새로운 기여자를 멘토링한다.
- 새로운 기여자가 쿠버네티스 멤버가 되기 위해 필요한 보다 복잡한 PR을 작성하도록 지원한다.
- 쿠버네티스 멤버 가입을 위해 [기여자를 후원](/ko/docs/contribute/advanced/#새로운-기여자-후원)한다.

현재 새로운 기여자 홍보대사는 각 SIG-Docs 회의와 [쿠버네티스 #sig-docs 채널](https://kubernetes.slack.com)에서 발표된다.

## 새로운 기여자 후원

SIG Docs [리뷰어](/ko/docs/contribute/participating/#리뷰어)는 새로운 기여자를
후원할 수 있다.

새로운 기여자가 하나 이상의 쿠버네티스 리포지터리에 5개의
실질적인 풀 리퀘스트를 성공적으로 제출한 후에는
쿠버네티스 조직의 [멤버십](/ko/docs/contribute/participating#멤버)을
신청할 수 있다. 기여자의 멤버십은 이미 리뷰어인 두 명의 스폰서가
후원해야 한다.

새로운 문서 기여자는 [쿠버네티스 슬랙 인스턴스](https://kubernetes.slack.com)의 #sig-docs
채널이나 [SIG Docs 메일링리스트](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)에서
스폰서를 요청할 수 있다.
신청자의 작업에 대해 확신이 있다면, 리뷰어는 신청자를 후원한다.
신청자가 멤버십 신청서를 제출할 때, 신청서에 "+1"로 코멘트를 남기고
신청자가 쿠버네티스 조직의 멤버십에
적합한 이유에 대한 세부 정보를 포함한다.

## SIG 공동 의장으로 봉사

SIG Docs [승인자](/ko/docs/contribute/participating/#승인자)는 SIG Docs의 공동 의장 역할을 할 수 있다.

### 전제 조건

승인자는 공동 의장이 되려면 다음의 요구 사항을 충족해야 한다.

- 6개월 이상 SIG Docs 승인자로 활동한다.
- [쿠버네티스 문서 릴리스 주도](/ko/docs/contribute/advanced/#쿠버네티스-릴리스를-위한-문서-조정) 또는 두 개의 릴리스에서 섀도잉을 수행한다.
- SIG Docs 워크플로와 툴링을 이해한다(git, Hugo, 현지화, 블로그 하위 프로젝트).
- [k/org의 팀](https://github.com/kubernetes/org/blob/master/config/kubernetes/sig-docs/teams.yaml), [k/community의 프로세스](https://github.com/kubernetes/community/tree/master/sig-docs), [k/test-infra](https://github.com/kubernetes/test-infra/)의 플러그인 및 [SIG 아키텍처](https://github.com/kubernetes/community/tree/master/sig-architecture)의 역할을 포함하여 다른 쿠버네티스 SIG와 리포지터리가 SIG Docs 워크플로에 미치는 영향을 이해한다.
- 최소 6개월 동안 일주일에 5시간 이상(대부분 더)을 역할에 책임진다.

### 책임

공동 의장의 역할은 서비스 중 하나이다. 공동 의장은 기여자 역량 확보, 프로세스와 정책 처리, 회의 예약과 진행, PR 랭글러 스케줄링, 쿠버네티스 커뮤니티의 문서에 대한 지지, 쿠버네티스 릴리스 주기에서 성공적으로 문서화되는지 확인하고, SIG Docs를 효과적인 우선순위에 놓이도록 집중한다.

다음과 같은 책임을 가진다.

- SIG Docs가 우수한 문서화를 통해 개발자의 행복을 극대화하는 데 집중한다.
- 스스로가 [커뮤니티 행동 강령](https://github.com/cncf/foundation/blob/master/code-of-conduct-languages/ko.md)을 준수하여 예를 보이고, SIG 멤버들이 지킬 수 있도록 책임을 진다.
- 기여에 대한 새로운 지침을 확인하여 SIG에 대한 모범 사례를 배우고 설정한다.
- SIG 회의를 예약하고 진행한다. 주간 상태 업데이트, 브랜치별 회고/기획 세션과 필요에 따라 그 외 세션을 진행한다.
- KubeCon 이벤트 및 기타 컨퍼런스에서 문서 스프린트를 스케줄링하고 진행한다.
- {{< glossary_tooltip text="CNCF" term_id="cncf" >}}와 플래티넘 파트너인 Google, Oracle, Azure, IBM 및 Huawei를 통해 SIG Docs를 대신하여 채용과 지지를 보낸다.
- SIG를 원활하게 운영한다.

### 효과적인 회의 운영

효과적으로 회의를 예약하고 진행하기 위해, 이 지침은 수행할 작업, 수행 방법과 이유를 보여준다.

**[커뮤니티 행동 강령](https://github.com/cncf/foundation/blob/master/code-of-conduct-languages/ko.md)을 지킨다**.

- 정중함을 유지하고, 포괄적인 언어로, 정중하고 포괄적인 토론을 한다.

**명확한 안건을 설정한다**.

- 주제의 명확한 안건을 설정한다.
- 안건을 미리 게시한다.

주간 회의의 경우, 지난 주 회의록을 회의록의 "지난 회의" 섹션에 복사하여 붙여 넣는다.

**정확한 회의록에 대해 공동 작업한다**.

- 회의의 토론 내용을 기록한다.
- 회의록 작성자의 역할을 위임한다.

**조치 항목을 명확하고 정확하게 지정한다**.

- 조치 항목, 조치 항목에 할당된 멤버 그리고 예상 완료 날짜를 기록한다.

**필요에 따라 완급을 조절한다**.

- 토론이 안건에서 벗어난 경우, 참가자의 초점을 현재의 주제로 다시 맞춘다.
- 토론에 집중하고 사람들의 시간을 존중하면서 다양한 토론 스타일을 위한 공간을 확보한다.

**사람들의 시간을 존중한다**.

정시에 회의를 시작하고 끝낸다.

**줌(Zoom)을 효과적으로 사용한다**.

- [쿠버네티스에 대한 줌 가이드라인](https://github.com/kubernetes/community/blob/master/communication/zoom-guidelines.md)에 익숙해진다.
- 호스트 키를 입력하여 로그인할 때 호스트 역할을 선택한다.

<img src="/images/docs/contribute/claim-host.png" width="75%" alt="줌에서 호스트 역할 신청" />

### 줌에서 회의 녹화

녹화를 시작할 준비가 되면, Record to Cloud를 클릭한다.

녹화를 중지하려면, Stop을 클릭한다.

비디오가 자동으로 유튜브에 업로드된다.


