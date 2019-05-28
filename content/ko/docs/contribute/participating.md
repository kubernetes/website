---
title: SIG Docs에 참여하기
content_template: templates/concept
card:
  name: contribute
  weight: 40
---

{{% capture overview %}}

SIG Docs는 쿠버네티스 프로젝트의
[분과회(special interest group)](https://github.com/kubernetes/community/blob/master/sig-list.md)
중 하나로, 쿠버네티스 전반에 대한 문서를 작성하고, 업데이트하며 유지보수하는 일을 주로 수행한다.
분과회에 대한 보다 자세한 정보는
[커뮤니티 GitHub 저장소 내 SIG Docs](https://github.com/kubernetes/community/tree/master/sig-docs)
를 참조한다.

SIG Docs는 모든 컨트리뷰터의 콘텐츠와 리뷰를 환영한다.
누구나 풀 리퀘스트(PR)를 요청할 수 있고,
누구나 콘텐츠에 대해 이슈를 등록하거나 진행 중인 풀 리퀘스트에 코멘트를 등록할 수 있다.

SIG Docs 내에서, [멤버](#멤버), [리뷰어](#리뷰어), 또는 [승인자](#승인자)가 될 수도 있다.
이런 역할은 변경을 승인하고 커밋할 수 있도록 보다 많은 접근 권한과 이에 상응하는 책임이 수반된다.
쿠버네티스 커뮤니티 내에서 멤버십이 운영되는 방식에 대한 보다 많은 정보를 확인하려면
[커뮤니티 멤버십](https://github.com/kubernetes/community/blob/master/community-membership.md)
문서를 확인한다.
문서의 나머지에서는 대외적으로 쿠버네티스를 가장 잘 드러내는 수단 중 하나인 쿠버네티스 웹사이트와
문서를 관리하는 책임을 가지는 SIG Docs에서,
이런 체계가 작동하는 특유의 방식에 대한 윤곽을 잡아보겠다.

{{% /capture %}}

{{% capture body %}}

## 역할과 책임

풀 리퀘스트가 콘텐츠를 게재하는데 사용되는 브랜치(현재는 `master`)에 머지되면, 해당 콘텐츠가 세상에
발행되어 널리 읽힐 수 있게 된다. 발행된 콘텐츠가 높은 품질을 유지하도록,
SIG Docs 승인자만 풀 리퀘스트를 머지할 수 있도록 제한한다.
다음과 같이 진행된다.

- 풀 리퀘스트에 `lgtm`과 `approve` 레이블이 부여되고 `hold` 레이블이 없는 경우에, 해당
  풀 리퀘스트가 자동으로 머지된다.
- 쿠버네티스 조직 멤버와 SIG Docs 승인자는 코멘트를 추가해서(`/hold` 코멘트를 추가하거나
  `/lgtm` 코멘트를 달지 않아서) 주어진 풀 리퀘스트가
  자동으로 머지되는 것을 막을 수 있다.
- 쿠버네티스 멤버 누구나 `/lgtm` 코멘트를 달아서 `lgtm` 레이블을 추가할 수 있다.
- `/approve` 코멘트를 달아서 풀 리퀘스트를 머지할 수 있는 SIG Docs 멤버는 승인자 뿐이다.
  일부 승인자는 추가로 [PR Wrangler](#pr-wrangler) 또는
  [SIG Docs chairperson](#sig-docs-chairperson) 같이
  특화된 역할을 수행한다.

쿠버네티스 조직 멤버와 SIG Docs 승인자 역할 사이의 기대와 차이에 대한 보다 많은 정보는
[컨트리뷰터 유형](/docs/contribute#types-of-contributor) 문서를 참고한다.
다음 섹션에서는 이런 역할과 SIG Docs에서
이들이 작동하는 방식에 대해
보다 상세한 내용을 다룬다.

### 모든 사람

문서를 포함해서, 쿠버네티스의 모든 부분에 대해서 누구나 이슈를 제기할 수 있다.

CLA에 서명한 누구나 풀 리퀘스트를 제출할 수 있다. CLA에 서명할 수 없다면,
쿠버네티스 프로젝트는 컨트리뷰션을 수용할 수 없다.

### 멤버

[쿠버네티스 조직](https://github.com/kubernetes)의 모든 멤버가 풀 리퀘스트를 리뷰할 수 있고,
기술적 정확도를 기하기 위해 SIG Docs 팀 멤버가 다른 분과회 멤버의 리뷰를 요청하는 일도 자주
발생한다.
SIG Docs는 쿠버네티스 조직의 멤버십 상태와 상관없이 보내주는 리뷰와 피드백 또한 환영한다.
풀 리퀘스트에 `/lgtm` 코멘트를 달아서 찬성 의사를 표시할 수 있다.
쿠버네티스 조직의 멤버가 아니라면,
`/lgtm` 코멘트는 자동화 시스템에 유효하지는 않다.

쿠버네티스 조직의 모든 멤버는 `/hold` 코멘트를 달아서 풀 리퀘스트가 머지되는 것을 막을 수 있다.
또한 모든 멤버가 `/hold` 코멘트를 삭제해서 PR이 머지될 수 있도록 할 수도 있다.
해당 PR이 이미 적임자로부터
`/lgtm`과 `/approve`를 받은 경우라면 말이다.

#### 멤버 되기

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

어떤 이유에서 멤버십 요청이 즉시 수용되지 않는 경우,
멤버십 위원회에서 재지원 전에
필요한 정보나 단계를 알려준다.

### 리뷰어

리뷰어는
[@kubernetes/sig-docs-pr-reviews](https://github.com/orgs/kubernetes/teams/sig-docs-pr-reviews)
GitHub 그룹의 멤버이다. [SIG Docs의 팀과 그룹](#teams-and-groups-within-sig-docs) 문서를 참고한다.

리뷰어는 문서 풀 리퀘스트를 리뷰하고
제안받은 변경에 대한 피드백을 제공한다.

자동화 시스템은 풀 리퀘스트에 대해 리뷰어를 할당하고, 컨트리뷰터는 해당 풀 리퀘스트에
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

SIG Docs 리뷰어가 되는 방법과
수반되는 책임과 시간 할애에 대한 보다 많은 정보는
[리뷰어나 승인자 되기](#리뷰어나-승인자-되기) 문서를 참조한다.

#### 리뷰어 되기

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

### 승인자

승인자는
[@kubernetes/sig-docs-maintainers](https://github.com/orgs/kubernetes/teams/sig-docs-maintainers)
GitHub 그룹의 멤버이다. [SIG Docs의 팀과 그룹](#teams-and-groups-within-sig-docs) 문서를 참조한다.

승인자는 PR을 머지할 수 있으므로, 쿠버네티스 웹사이트에 콘텐츠를 게재할 수 있다.
PR을 승인하려면, 승인자는 `/approve` 코멘트를 해당 PR에 남긴다.
승인자가 아닌 누군가가 승인 코멘트를 남기더라도,
자동화 시스템은 이를 무시한다.

PR이 이미 `/lgtm`을 받았거나, 승인자가 `/lgtm`을 포함한 코멘트를 남긴 경우에는
해당 PR이 자동으로 머지된다. SIG Docs 승인자는 추가적인 기술 리뷰가 필요하지 않은 변경에 대해서만
`/lgtm`을 남겨야한다.

SIG Docs 승인자가 되는 방법과
수반되는 책임과 시간 할애에 대한 보다 많은 정보는
[리뷰어나 승인자 되기](#리뷰어나-승인자-되기) 문서를 참조한다.

#### 승인자 되기

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

#### 웹사이트 관리자 되기

`kubernetes-website-admins` GitHub 그룹의 멤버는 GitHub 그룹의 멤버십을 관리할 수 있고
리포지터리를 세팅하거나 웹훅(webhook)을 추가, 삭제하고 트러블슈팅하는 것을 포함한
모든 관리 권한을 가질 수 있다.
모든 SIG Docs 승인자가 이 수준의 액세스를 할 필요는 없다.

만약 이 수준의 접근 권한이 필요하다면, 현재 웹사이트 관리자나
[쿠버네티스 Slack](https://kubernetes.slack.com) #sig-docs 채널에서 말한다.

#### PR Wrangler

SIG Docs 승인자는
[PR Wrangler 로테이션 스케줄러](https://github.com/kubernetes/website/wiki/PR-Wranglers)에
올라서 주 단위로 돌아가며 역할을 수행한다.
모든 SIG Docs 승인자는 이 로테이션에 참여하게 된다. 보다 자세한 내용은
[일주일 간 PR Wrangler 되기](/docs/contribute/advanced#be-the-pr-wrangler-for-a-week)
문서를 참고한다.

#### SIG Docs chairperson

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
다음의 두개의 [prow 플러그인](https://github.com/kubernetes/test-infra/blob/master/prow/plugins.yaml#L210)을
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

{{% /capture %}}

{{% capture whatsnext %}}

쿠버네티스 문서화에 기여하는 일에 대한 보다 많은 정보는 다음 문서를 참고한다.

- [기여 시작하기](/docs/contribute/start/)
- [문서 스타일](/docs/contribute/style/)

{{% /capture %}}


