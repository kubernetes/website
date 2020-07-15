---
title: SIG Docs에 참여하기
content_type: concept
weight: 60
card:
  name: contribute
  weight: 60
---

<!-- overview -->

SIG Docs는 쿠버네티스 프로젝트의
[분과회(special interest group)](https://github.com/kubernetes/community/blob/master/sig-list.md)
중 하나로, 쿠버네티스 전반에 대한 문서를 작성하고, 업데이트하며 유지보수하는 일을 주로 수행한다.
분과회에 대한 보다 자세한 정보는
[커뮤니티 GitHub 저장소 내 SIG Docs](https://github.com/kubernetes/community/tree/master/sig-docs)
를 참조한다.

SIG Docs는 모든 컨트리뷰터의 콘텐츠와 리뷰를 환영한다.
누구나 풀 리퀘스트(PR)를 요청할 수 있고,
누구나 콘텐츠에 대해 이슈를 등록하거나 진행 중인 풀 리퀘스트에 코멘트를 등록할 수 있다.

[멤버](#멤버), [리뷰어](#리뷰어), 또는 [승인자](#승인자)가 될 수 있다.
이런 역할은 변경을 승인하고 커밋할 수 있도록 보다 많은 접근 권한과 이에 상응하는 책임이 수반된다.
쿠버네티스 커뮤니티 내에서 멤버십이 운영되는 방식에 대한 보다 많은 정보를 확인하려면
[커뮤니티 멤버십](https://github.com/kubernetes/community/blob/master/community-membership.md)
문서를 확인한다.

문서의 나머지에서는 대외적으로 쿠버네티스를 가장 잘 드러내는 수단 중 하나인 쿠버네티스 웹사이트와
문서를 관리하는 책임을 가지는 SIG Docs에서,
이런 체계가 작동하는 특유의 방식에 대한 윤곽을 잡아보겠다.



<!-- body -->

## 역할과 책임

- **모든 사람** 은 쿠버네티스 문서에 기여할 수 있다. 기여 시 [CLA에 서명](/ko/docs/contribute/new-content/overview/#sign-the-cla)하고 GitHub 계정을 가지고 있어야 한다.
- 쿠버네티스 조직의 **멤버** 는 쿠버네티스 프로젝트에 시간과 노력을 투자한 기여자이다. 일반적으로 승인되는 변경이 되는 풀 리퀘스트를 연다. 멤버십 기준은 [커뮤니티 멤버십](https://github.com/kubernetes/community/blob/master/community-membership.md)을 참조한다.
- SIG Docs의 **리뷰어** 는 쿠버네티스 조직의 일원으로
  문서 풀 리퀘스트에 관심을 표명했고, SIG Docs 승인자에
  의해 GitHub 리포지터리에 있는 GitHub
  그룹과 `OWNER` 파일에 추가되었다.
- SIG Docs의 **승인자** 는 프로젝트에 대한 지속적인 헌신을 보여준
  좋은 멤버이다. 승인자는 쿠버네티스 조직을 대신해서
  풀 리퀘스트를 병합하고 컨텐츠를 게시할 수 있다.
  또한 승인자는 더 큰 쿠버네티스 커뮤니티의 SIG Docs를 대표할 수 있다.
  릴리즈 조정과 같은 SIG Docs 승인자의 일부 의무에는
  상당한 시간 투입이 필요하다.

## 모든 사람

누구나 다음 작업을 할 수 있다.

- 문서를 포함한 쿠버네티스의 모든 부분에 대해 GitHub 이슈 열기.
- 풀 리퀘스트에 대한 구속력 없는 피드백 제공
- 기존 컨텐츠를 현지화하는데 도움주는 것
- [슬랙](http://slack.k8s.io/) 또는 [SIG docs 메일링 리스트](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)에 개선할 아이디어를 제시한다.
- `/lgtm` Prow 명령 ("looks good to me" 의 줄임말)을 사용해서 병합을 위한 풀 리퀘스트의 변경을 추천한다.
  {{< note >}}
  만약 쿠버네티스 조직의 멤버가 아니라면, `/lgtm` 을 사용하는 것은 자동화된 시스템에 아무런 영향을 주지 않는다.
  {{< /note >}}

[CLA에 서명](/ko/docs/contribute/new-content/overview/#sign-the-cla) 후에 누구나 다음을 할 수 있다.
- 기존 콘텐츠를 개선하거나, 새 콘텐츠를 추가하거나, 블로그 게시물 또는 사례연구 작성을 위해 풀 리퀘스트를 연다.

## 멤버

멤버는 [멤버 기준](https://github.com/kubernetes/community/blob/master/community-membership.md#member)을 충족하는 쿠버네티스 프로젝트에 기여한 사람들이다. SIG Docs는 쿠버네티스 커뮤니티의 모든 멤버로부터 기여를 환경하며,
기술적 정확성에 대한 다른 SIG 멤버들의 검토를 수시로 요청한다.

쿠버네티스 조직의 모든 멤버는 다음 작업을 할 수 있다.

- [모든 사람](#모든-사람) 하위에 나열된 모든 것
- 풀 리퀘스트 코멘트에 `/lgtm` 을 사용해서 LGTM(looks good to me) 레이블을 붙일 수 있다.
- 풀 리퀘스트에 이미 LGTM 과 승인 레이블이 있는 경우에 풀 리퀘스트가 병합되지 않도록 코멘트에 `/hold` 를 사용할 수 있다.
- 코멘트에 `/assign` 을 사용해서 풀 리퀘스트에 리뷰어를 배정한다.

### 멤버 되기

최소 5개의 실질적인 풀 리퀘스트를 성공적으로 제출한 경우, 쿠버네티스 조직의
[멤버십](https://github.com/kubernetes/community/blob/master/community-membership.md#member)을
요청할 수 있다. 다음의 단계를 따른다.

1.  멤버십을 [후원](/docs/contribute/advanced#sponsor-a-new-contributor)해 줄 두 명의 리뷰어 또는 승인자를
    찾는다.

      [쿠버네티스 Slack 인스턴스의 #sig-docs 채널](https://kubernetes.slack.com) 또는
      [SIG Docs 메일링 리스트](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)에서
      후원을 요청한다.

      {{< note >}}
      SIG Docs 멤버 개인에게 직접 email을 보내거나
      Slack 다이렉트 메시지를 보내지 않는다.
      {{< /note >}}

2.  `kubernetes/org` 리포지터리에 멤버십을 요청하는 GitHub 이슈를 등록한다.
    [커뮤니티 멤버십](https://github.com/kubernetes/community/blob/master/community-membership.md)
    문서의 가이드라인을 따라서 양식을 채운다.

3.  해당 GitHub 이슈에 후원자를 at-mentioning(`@<GitHub-username>`을 포함한 코멘트를 추가)하거나
    링크를 직접 보내주어서
    후원자가 해당 GitHub 이슈를 확인하고 `+1` 표를 줄 수 있도록 한다.

4.  멤버십이 승인되면, 요청에 할당된 GitHub 관리자 팀 멤버가 승인되었음을 업데이트해주고
    해당 GitHub 이슈를 종료한다.
    축하한다, 이제 멤버가 되었다!

만약 멤버십 요청이 받아들여지지 않으면,
멤버십 위원회에서 재지원 전에
필요한 정보나 단계를 알려준다.

## 리뷰어

리뷰어는
[@kubernetes/sig-docs-pr-reviews](https://github.com/orgs/kubernetes/teams/sig-docs-pr-reviews)
GitHub 그룹의 멤버이다. 리뷰어는 문서 풀 리퀘스트를 리뷰하고 제안받은 변경에 대한 피드백을
제공한다. 리뷰어는 다음 작업을 수행할 수 있다.

- [모든 사람](#모든-사람)과 [멤버](#멤버)에 나열된 모든 것을 수행
- 새 기능의 문서화
- 이슈 해결 및 분류
- 풀 리퀘스트 리뷰와 구속력있는 피드백 제공
- 다이어그램, 그래픽 자산과 포함가능한 스크린샷과 비디오를 생성
- 코드에서 사용자 화면 문자열 편집
- 코드 코멘트 개선

### 풀 리퀘스트에 대한 리뷰어 할당

자동화 시스템은 풀 리퀘스트에 대해 리뷰어를 할당하고, 사용자는 해당 풀 리퀘스트에
`/assign [@_github_handle]` 코멘트를 남겨서 특정 리뷰어에게 리뷰를 요청할 수 있다.
풀 리퀘스트가 기술적으로 정확하고 더 변경이 필요하지 않다는 의미로,
리뷰어는 `/lgtm` 코멘트를
해당 풀 리퀘스트에 추가할 수 있다.

할당된 리뷰어가 내용을 아직 리뷰하지 않은 경우,
다른 리뷰어가 나설 수 있다. 추가로, 기술 리뷰어를
할당해서 그들이 `/lgtm`을 주기를 기다릴 수도 있다.

사소한 변경이나 기술적 리뷰가 필요한 PR의 경우, SIG Docs [승인자](#승인자)가 `/lgtm`을 줄
수도 있다.

리뷰어의 `/approve` 코멘트는 자동화 시스템에서 무시된다.

### 리뷰어 되기

[요건](https://github.com/kubernetes/community/blob/master/community-membership.md#reviewer)을
충족하면, SIG Docs 리뷰어가 될 수 있다.
다른 SIG의 리뷰어는 SIG Docs의 리뷰어 자격에
반드시 별도로 지원해야 한다.

지원하려면, `kubernetes/website` 저장소의
[최상위 OWNERS 파일](https://github.com/kubernetes/website/blob/master/OWNERS)
내 `reviewers` 섹션에 자신을 추가하는 풀 리퀘스트를 연다. PR을 한 명 이상의 현재 SIG Docs
승인자에게 할당한다.

풀 리퀘스트가 승인되면, 이제 SIG Docs 리뷰어가 된다.
[K8s-ci-robot](https://github.com/kubernetes/test-infra/tree/master/prow#bots-home)이
새로운 풀 리퀘스트에 대한 리뷰어로 당신을 추천하게 된다.

일단 승인되면, 현재 SIG Docs 승인자가
[@kubernetes/sig-docs-pr-reviews](https://github.com/orgs/kubernetes/teams/sig-docs-pr-reviews)
GitHub 그룹에 당신을 추가하기를 요청한다. `kubernetes-website-admins` GitHub 그룹의
멤버만이 신규 멤버를 GitHub 그룹에 추가할 수 있다.

## 승인자

승인자는
[@kubernetes/sig-docs-maintainers](https://github.com/orgs/kubernetes/teams/sig-docs-maintainers)
GitHub 그룹의 멤버이다. [SIG Docs 팀과 자동화](#sig-docs-팀과-자동화) 문서를 참조한다.

승인자는 다음의 작업을 할 수 있다.

- [모든 사람](#모든-사람), [멤버](#멤버) 그리고 [리뷰어](#리뷰어) 하위의 모든 목록을 할 수 있다.
- 코멘트에 `/approve` 를 사용해서 풀 리퀘스트를 승인하고, 병합해서 기여자의 컨텐츠를 게시한다.
  만약 승인자가 아닌 사람이 코멘트에 승인을 남기면 자동화 시스템에서 이를 무시한다.
- 쿠버네티스 릴리즈팀에 문서 담당자로 참여
- 스타일 가이드 개선 제안
- 문서 테스트 개선 제안
- 쿠버네티스 웹사이트 또는 다른 도구 개선 제안

PR이 이미 `/lgtm`을 받았거나, 승인자가 `/lgtm`을 포함한 코멘트를 남긴 경우에는
해당 PR이 자동으로 머지된다. SIG Docs 승인자는 추가적인 기술 리뷰가 필요하지 않은 변경에 대해서만
`/lgtm`을 남겨야한다.

### 승인자 되기

[요건](https://github.com/kubernetes/community/blob/master/community-membership.md#approver)을
충족하면, SIG Docs 승인자가 될 수 있다.
다른 SIG의 승인자는 SIG Docs의 승인자 자격에
반드시 별도로 지원해야 한다.

지원하려면, `kubernetes/website` 저장소의
[최상위 OWNERS 파일](https://github.com/kubernetes/website/blob/master/OWNERS)
내 `approvers` 섹션에 자신을 추가하는 풀 리퀘스트를 연다. PR을 한 명 이상의 현재 SIG Docs
승인자에게 할당한다.

풀 리퀘스트가 승인되면, 이제 SIG Docs 승인자가 된다.
[K8s-ci-robot](https://github.com/kubernetes/test-infra/tree/master/prow#bots-home)이
새로운 풀 리퀘스트에 대한 리뷰어로 당신을 추천하게 된다.

일단 승인되면, 현재 SIG Docs 승인자가
[@kubernetes/sig-docs-maintainers](https://github.com/orgs/kubernetes/teams/sig-docs-maintainers)
GitHub 그룹에 당신을 추가하기를 요청한다. `kubernetes-website-admins` GitHub 그룹의
멤버만이 신규 멤버를 GitHub 그룹에 추가할 수 있다.

### 승인자의 책임

승인자는 리뷰와 풀리퀘스트를 웹사이트 리포지터리에 머지하여 문서를 개선한다. 이 역할에는 추가적인 권한이 필요하므로, 승인자에게는 별도의 책임이 부여된다.

- 승인자는 PR들을 리포에 머지하는 `/approve` 명령을 사용할 수 있다.

    부주의한 머지로 인해 사이트를 파괴할 수 있으므로, 머지할 때에 그 의미를 확인해야 한다.

- 제안된 변경이 [컨트리뷰션 가이드 라인](/docs/contribute/style/content-guide/#contributing-content)에 적합한지 확인한다.

    질문이 생기거나 확실하지 않다면 자유롭게 추가 리뷰를 요청한다.

- PR을 `/approve` 하기 전에 Netlify 테스트 결과를 검토한다.

    <img src="/images/docs/contribute/netlify-pass.png" width="75%" alt="승인 전에 반드시 Netlify 테스트를 통과해야 한다" />

- 승인 전에 PR에 대한 Netlify 프리뷰 페이지를 방문하여, 제대로 보이는지 확인한다.

- 주간 로테이션을 위해 [PR Wrangler 로테이션 스케줄](https://github.com/kubernetes/website/wiki/PR-Wranglers)에 참여한다. SIG Docs는 모든 승인자들이 이 로테이션에 참여할
것으로 기대한다. [일주일 간 PR Wrangler 되기](/ko/docs/contribute/advanced/#일주일-동안-pr-랭글러-wrangler-되기)
문서를 참고한다.

## SIG Docs 의장

SIG Docs를 포함한 각 SIG는, 한 명 이상의 SIG 멤버가 의장 역할을 하도록 선정한다. 이들은 SIG Docs와
다른 쿠버네티스 조직 간 연락책(point of contact)이 된다. 이들은 쿠버네티스 프로젝트 전반의 조직과
그 안에서 SIG Docs가 어떻게 운영되는지에 대한 폭넓은 지식을 갖추어야한다.
현재 의장의 목록을 확인하려면
[리더십](https://github.com/kubernetes/community/tree/master/sig-docs#leadership)
문서를 참조한다.

## SIG Docs 팀과 자동화

SIG Docs의 자동화는 다음의 두 가지 자동화 메커니즘에 의존한다.
GitHub 그룹과 OWNERS 파일이다.

### GitHub 그룹

GitHub의 SIG Docs 그룹은 두 팀을 정의한다.

 - [@kubernetes/sig-docs-maintainers](https://github.com/orgs/kubernetes/teams/sig-docs-maintainers)
 - [@kubernetes/sig-docs-pr-reviews](https://github.com/orgs/kubernetes/teams/sig-docs-pr-reviews)

그룹의 전원과 의사소통하기 위해서
각각 GitHub 코멘트에서 그룹의 `@name`으로 참조할 수 있다.

이 팀은 중복되지만, 정확히 일치하지는 않으며, 이 그룹은 자동화 툴에서 사용된다.
이슈, 풀 리퀘스트를 할당하고,
PR 승인을 지원하기 위해서 자동화 시스템이 OWNERS 파일의 정보를 활용한다.

### OWNERS 파일과 전문(front-matter)

쿠버네티스 프로젝트는 GitHub 이슈와 풀 리퀘스트 자동화와 관련해서 prow라고 부르는 자동화 툴을 사용한다.
[쿠버네티스 웹사이트 리포지터리](https://github.com/kubernetes/website)는
다음의 두개의 [prow 플러그인](https://github.com/kubernetes/test-infra/tree/master/prow/plugins)을
사용한다.

- blunderbuss
- approve

이 두 플러그인은 `kubernetes/website` GitHub 리포지터리 최상위 수준에 있는
[OWNERS](https://github.com/kubernetes/website/blob/master/OWNERS)와
[OWNERS_ALIASES](https://github.com/kubernetes/website/blob/master/OWNERS_ALIASES)
파일을 사용해서
해당 리포지터리에 대해 prow가 작동하는 방식을 제어한다.

OWNERS 파일은 SIG Docs 리뷰어와 승인자의 목록을 포함한다. OWNERS 파일은 하위 디렉터리에 있을 수
있고, 해당 하위 디렉터리와 그 이하의 파일에 대해 리뷰어와 승인자 역할을 수행할 사람을 새로 지정할 수 있다.
일반적인 OWNERS 파일에 대한 보다 많은 정보는
[OWNERS](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md)
문서를 참고한다.

추가로, 개별 마크다운(Markdown) 파일 내 전문에
리뷰어와 승인자를 개별 GitHub 사용자 이름이나 GitHub 그룹으로 열거할 수 있다.

OWNERS 파일과 마크다운 파일 내 전문의 조합은
자동화 시스템이 누구에게 기술적, 편집적 리뷰를 요청해야 할지를
PR 소유자에게 조언하는데 활용된다.

## 병합 작업 방식

풀 리퀘스트 요청이 콘텐츠(현재 `master`)를 발행하는데 사용하는
브랜치에 병합되면 그 내용이 전 세계에 공개된다. 게시된 콘텐츠의
품질을 높히기 위해 SIG Docs 승인자가 풀 리퀘스트를 병합하는 것을 제한한다.
작동 방식은 다음과 같다.

- 풀 리퀘스트에 `lgtm` 과 `approve` 레이블이 있고, `hold` 레이블이 없고,
  모든 테스트를 통과하면 풀 리퀘스트는 자동으로 병합된다.
- 쿠버네티스 조직의 멤버와 SIG Docs 승인자들은 지정된 풀 리퀘스트의
  자동 병합을 방지하기 위해 코멘트를 추가할 수 있다(코멘트에 `/hold` 추가 또는
  `/lgtm` 코멘트 보류).
- 모든 쿠버네티스 멤버는 코멘트에 `/lgtm` 을 추가해서 `lgtm` 레이블을 추가할 수 있다.
- SIG Docs 승인자들만이 코멘트에 `/approve` 를
  추가해서 풀 리퀘스트를 병합할 수 있다. 일부 승인자들은
  [PR Wrangler](/ko/docs/contribute/advanced/#일주일-동안-pr-랭글러-wrangler-되기) 또는 [SIG Docs 의장](#sig-docs-의장)과
  같은 특정 역할도 수행한다.



## {{% heading "whatsnext" %}}


쿠버네티스 문서화에 기여하는 일에 대한 보다 많은 정보는 다음 문서를 참고한다.

- [신규 콘텐츠 기여하기](/ko/docs/contribute/new-content/overview/)
- [콘텐츠 검토하기](/ko/docs/contribute/review/reviewing-prs/)
- [문서 스타일 가이드](/ko/docs/contribute/style/)
