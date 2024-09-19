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

[멤버](/ko/docs/contribute/participate/roles-and-responsibilities/#멤버),
[리뷰어](/ko/docs/contribute/participate/roles-and-responsibilities/#리뷰어), 또는
[승인자](/ko/docs/contribute/participate/roles-and-responsibilities/#승인자)가 될 수 있다.
이런 역할은 변경을 승인하고 커밋할 수 있도록 보다 많은 접근 권한과 이에 상응하는 책임이 수반된다.
쿠버네티스 커뮤니티 내에서 멤버십이 운영되는 방식에 대한 보다 많은 정보를 확인하려면
[커뮤니티 멤버십](https://github.com/kubernetes/community/blob/master/community-membership.md)
문서를 확인한다.

문서의 나머지에서는 대외적으로 쿠버네티스를 가장 잘 드러내는 수단 중 하나인 쿠버네티스 웹사이트와
문서를 관리하는 책임을 가지는 SIG Docs에서,
이런 체계가 작동하는 특유의 방식에 대한 윤곽을 잡아보겠다.

<!-- body -->

## SIG Docs 의장

SIG Docs를 포함한 각 SIG는, 한 명 이상의 SIG 멤버가 의장 역할을 하도록 선정한다. 이들은 SIG Docs와
다른 쿠버네티스 조직 간 연락책(point of contact)이 된다. 이들은 쿠버네티스 프로젝트 전반의 조직과
그 안에서 SIG Docs가 어떻게 운영되는지에 대한 폭넓은 지식을 갖추어야한다.
현재 의장의 목록을 확인하려면
[리더십](https://github.com/kubernetes/community/tree/master/sig-docs#leadership)
문서를 참조한다.

## SIG Docs 팀과 자동화

SIG Docs의 자동화는 다음의 두 가지 메커니즘에 의존한다.
GitHub 팀과 OWNERS 파일이다.

### GitHub 팀

GitHub의 SIG Docs [팀]에는 두 분류가 있다.

- 승인자와 리더를 위한 `@sig-docs-{language}-owners`
- 리뷰어를 위한 `@sig-docs-{language}-reviews`

그룹의 전원과 의사소통하기 위해서
각각 GitHub 코멘트에서 그룹의 `@name`으로 참조할 수 있다.

가끔은 Prow와 GitHub 팀은 정확히 일치하지 않고 중복된다.
이슈, 풀 리퀘스트를 할당하고, PR 승인을 지원하기 위해서
자동화 시스템이 `OWNERS` 파일의 정보를 활용한다.

### OWNERS 파일과 전문(front-matter)

쿠버네티스 프로젝트는 GitHub 이슈와 풀 리퀘스트 자동화와 관련해서 prow라고 부르는 자동화 툴을 사용한다.
[쿠버네티스 웹사이트 리포지터리](https://github.com/kubernetes/website)는
다음의 두개의 [prow 플러그인](https://github.com/kubernetes-sigs/prow/tree/main/pkg/plugins)을
사용한다.

- blunderbuss
- approve

이 두 플러그인은 `kubernetes/website` GitHub 리포지터리 최상위 수준에 있는
[OWNERS](https://github.com/kubernetes/website/blob/main/OWNERS)와
[OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS_ALIASES)
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

풀 리퀘스트 요청이 콘텐츠를 발행하는데 사용하는 브랜치에 병합되면, 해당 콘텐츠는 https://kubernetes.io 에 공개된다.
게시된 콘텐츠의 품질을 높히기 위해 SIG Docs 승인자가 풀 리퀘스트를 병합하는 것을 제한한다.
작동 방식은 다음과 같다.

- 풀 리퀘스트에 `lgtm` 과 `approve` 레이블이 있고, `hold` 레이블이 없고,
  모든 테스트를 통과하면 풀 리퀘스트는 자동으로 병합된다.
- 쿠버네티스 조직의 멤버와 SIG Docs 승인자들은 지정된 풀 리퀘스트의
  자동 병합을 방지하기 위해 코멘트를 추가할 수 있다(코멘트에 `/hold` 추가 또는
  `/lgtm` 코멘트 보류).
- 모든 쿠버네티스 멤버는 코멘트에 `/lgtm` 을 추가해서 `lgtm` 레이블을 추가할 수 있다.
- SIG Docs 승인자들만이 코멘트에 `/approve` 를
  추가해서 풀 리퀘스트를 병합할 수 있다. 일부 승인자들은
  [PR Wrangler](/ko/docs/contribute/participate/pr-wranglers/) 또는 [SIG Docs 의장](#sig-docs-의장)과
  같은 특정 역할도 수행한다.



## {{% heading "whatsnext" %}}


쿠버네티스 문서화에 기여하는 일에 대한 보다 많은 정보는 다음 문서를 참고한다.

- [신규 콘텐츠 기여하기](/ko/docs/contribute/new-content/)
- [콘텐츠 검토하기](/ko/docs/contribute/review/reviewing-prs/)
- [문서 스타일 가이드](/ko/docs/contribute/style/)
