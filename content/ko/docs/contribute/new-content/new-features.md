---
title: 릴리스를 위한 기능 문서화 
linktitle: 릴리스 문서화 
content_type: concept 
main_menu: true 
weight: 20 
card: 
    name: contribute 
    weight: 45 
    title: 릴리스를 위한 기능 문서화
---
<!-- overview -->

쿠버네티스의 각 주요 릴리스에는 문서화가 필요한 새로운 기능이 도입된다. 
새 릴리스는 기존 기능 및 문서에 대한 업데이트 또한 포함한다.
(예: alpha에서 beta로의 기능 업그레이드)

일반적으로, 해당 기능을 담당하는 SIG는
해당 기능에 대한 초안 문서를 `kubernetes/website` 저장소의
적절한 개발 브랜치에 풀 리퀘스트 형태로 제출하며,
SIG Docs 팀의 구성원 중 누군가가 편집 피드백을 제공하거나 초안을 직접 편집한다.
이 섹션에서는 릴리스 중 두 그룹이 사용하는 브랜치 전략과 절차를 다룬다.

블로그에 기능을 발표하는 방법에 대해 알아보려면, 
[릴리스 후 공지](/docs/contribute/blog/release-comms/)을 읽어본다.

<!-- body -->

## 문서 기여자를 위한 안내

일반적으로, 문서 기여자는 릴리스를 위한 콘텐츠를 처음부터 작성하지는 않는다.
그 대신, 새로운 기능을 만드는 SIG와 협업하여 초안 문서를 
다듬고 릴리스에 적합한 형태로 정리한다.

문서화하거나 협력하고 싶은 기능을 선택한 후에는,
`#sig-docs` 슬랙 채널이나 매주 열리는 SIG Docs 회의, 또는 해당 기능을 만든 SIG가 올린 PR에 직접 질문을 남겨본다.
승인을 받으면, [다른 사람의 PR에 커밋하기](/docs/contribute/review/for-approvers/#commit-into-another-person-s-pr)에서 
설명한 방법 중 하나를 사용해
해당 PR에 직접 편집할 수 있다.

### 향후 기능 알아보기

향후 기능에 대해 알아보려면, 매주 열리는 
SIG Release 회의에 참석한다 (다가오는 회의 일정은 [커뮤니티](/community) 페이지에서 확인할 수 있다)
또한 릴리스 전용 문서는
[kubernetes/sig-release](https://github.com/kubernetes/sig-release/)
저장소에서 확인할 수 있다. 각 릴리스는
[/sig-release/tree/master/releases/](https://github.com/kubernetes/sig-release/tree/master/releases)
디렉토리 아래에 하위 디렉토리를 가지고 있다. 이 하위 디렉토리에는 릴리스 일정, 릴리스 노트 초안
그리고 릴리스 팀 구성원 명단이 담긴 문서가 포함되어 있다.

릴리스 일정 문서에는
해당 릴리스와 관련된 다른 모든 문서, 회의, 회의록,
그리고 마일스톤에 대한 링크가 포함되어 있다. 또한, 릴리스의 목표와 일정,
그리고 이번 릴리스에 적용되는 특별 운영 절차에 대한 정보도 포함되어 있다. 문서 하단에는
여러 릴리스 관련 용어들이 정의되어 있다.

이 문서에는 **기능 추적 시트**에 대한 링크 또한 포함되어 있으며, 이는
이번 릴리스에 포함될 예정인 모든 신규 기능을
공식적으로 확인할 수 있는 방법이다.

릴리스 팀 문서에는 각 릴리스 역할을 누가 담당하는지 정리되어 있다. 만약
특정 기능이나 궁금한 점에 대해 누구에게 문의해야 할지 확실하지 않다면,
릴리스 회의에 참석해 질문하거나, 릴리스 리드에게 연락하면
그들이 적절한 담당자에게 연결해 줄 수 있다.

릴리스 노트 초안은 특정 기능, 변경사항, 사용 중단 예정 항목 등 
이번 릴리스에 대한 내용을 파악하기에 좋은 자료이다. 다만, 
이 내용은 릴리스 주기의 후반까지 확정되지 않으므로 참고 시 주의가 필요하다.

### 기능 추적 시트

[쿠버네티스 릴리스](https://github.com/kubernetes/sig-release/tree/master/releases) 기능 추적 시트에는
해당 릴리스에 포함될 예정인 각 기능이 나열되어 있다.
각 항목에는 기능 이름, 기능의 GitHub 이슈 링크,
안정성 단계(Alpha, Beta, Stable),
기능을 구현할 담당 SIG와 개인,
문서가 필요한지 여부, 해당 기능에 대한 릴리스 노트 초안,
그리고 병합 여부가 포함된다. 다음 사항을 고려한다:

- Beta 및 Stable 기능은 일반적으로 Alpha 기능보다 문서화 
    우선순위가 높다.
- 아직 병합되지 않았거나, PR 상에서 최소한 기능이 완성된 것으로 간주되지 않은 기능은 테스트하기 어렵고, 
    따라서 문서화도 어렵다.
- 기능이 문서화가 필요한지 여부는 수동으로 판단해야 한다. 문서화 필요 여부로 표시되지 않은 기능이라 
    하더라도 문서화가 필요할 수 있다.

## 개발자 또는 다른 SIG 구성원을 위한 안내

이 섹션은, 릴리스를 위해 신규 기능을 문서화하려는 
쿠버네티스의 다른 SIG 구성원들을 위한 정보이다.

쿠버네티스용 새로운 기능을 개발 중인 SIG의 구성원이라면,
해당 기능이 릴리스에 맞춰 문서화될 수 있도록
SIG Docs 팀과 협업해야 한다. 
[기능 추적 스프레드시트](https://github.com/kubernetes/sig-release/tree/master/releases)를 확인하거나,
쿠버네티스 Slack의 `#sig-release` 채널에 
문의하여 일정 및 마감일을 확인한다.

### 임시 PR 열기

1. `kubernetes/website` 저장소의
    `dev-{{< skew nextMinorVersion >}}` 브랜치를 대상으로
    나중에 수정할 예정인 간단한 커밋을 포함한 초안 PR을 연다. 초안 PR을 생성하려면,
    **Create Pull Request** 드롭다운 메뉴에서 **Create Draft Pull Request**를 선택한 다음,
    **Draft Pull Request** 버튼을 클릭한다.
1. PR 설명란에 [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) 
    Pull Request와 [kubernetes/enhancements](https://github.com/kubernetes/enhancements) 이슈에 대한 링크를 추가한다.
1. 관련 [kubernetes/enhancements](https://github.com/kubernetes/enhancements) 
    이슈에 해당 PR 링크를 포함한 댓글을 남겨, 이 릴리스를 관리하는
    문서 담당자에게 기능 문서가 작성될 예정이며 릴리스에 포함되어야 함을 알린다.

기능에 대해 문서 변경이 필요하지 않다면, `#sig-release Slack` 채널에 해당 내용을 알려
sig-release 팀이 이를 인지할 수 있도록 한다. 기능에 문서화가 
필요하지만 PR이 생성되지 않은 경우, 해당 기능은 마일스톤에서 제외될 수 있다.

### 리뷰를 위한 PR 준비

준비가 되면, 임시 PR에 기능 문서를 채워 넣고, PR의 상태를
초안(draft)에서 **ready for review** 상태로 변경한다. Pull request를 
검토 가능 상태로 표시하려면, merge 박스로 이동한 후 **Ready for review** 버튼을 클릭한다.

당신의 기능이 무엇이고 어떻게 사용하는지 최대한 잘 설명한다.
문서 구조를 어떻게 잡아야 할지 도움이 필요하다면, `#sig-docs` Slack 채널에 질문한다.

콘텐츠 작성을 마치면, 해당 기능에 배정된 문서 담당자가 이를 검토한다.
기술적인 정확성을 보장하기 위해, 해당 기능을 담당하는 SIG에서 기술 검토가 추가로 필요할 수도 있다.
리뷰어의 피드백을 반영하여 콘텐츠를 릴리스 가능한 상태로 완성한다.

기능에 문서화가 필요한데 초안 콘텐츠가 
제출되지 않은 경우, 해당 기능은 마일스톤에서 제외될 수 있다.

#### 기능 게이트 {#ready-for-review-feature-gates}

기능이 Alpha 또는 Beta 단계이며 기능 게이트를 통해 활성화되는 경우,
해당 기능에 대한 기능 게이트 파일을
`content/en/docs/reference/command-line-tools-reference/feature-gates/` 디렉토리 안에 추가해야 한다.
파일 이름은 해당 기능 게이트의 이름에 `.md` 확장자를 붙인 형태여야 한다.
같은 디렉토리에 이미 존재하는 다른 파일들을 참고하여, 자신의 파일이 어떤 형태여야 할지 감을 잡을 수 있다.
대개는 단락 하나 정도면 충분하며, 설명이 길어지는 경우에는
다른 곳에 문서를 작성하고 그 문서에 대한 링크를 포함한다.

또한, 당신의 기능 게이트가 
[Alpha/Beta 기능 게이트](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features) 
표에 표시되도록 하려면, 당신의 마크다운 설명 파일의
[front matter (문서 헤더)](https://gohugo.io/content-management/front-matter/)에
다음 정보를 포함해야 한다:

```yaml
stages:
  - stage: <alpha/beta/stable/deprecated>  # 기능 게이트의 개발 단계를 지정하세요
    defaultValue: <true or false>          # 기본적으로 활성화되어 있다면 true, 아니라면 false로 설정하세요
    fromVersion: <Version>                 # 기능 게이트가 사용 가능한 최소 버전을 입력하세요
    toVersion: <Version>                   # (선택 사항) 기능 게이트가 사용 가능한 마지막 버전을 입력하세요
```

새로운 기능 게이트를 추가하는 경우, 해당 기능 게이트에 대한 별도의 설명도 필요하다.
`content/en/docs/reference/command-line-tools-reference/feature-gates/` 디렉토리 안에 새로운 마크다운 파일을 생성한다
(다른 파일들의 템플릿을 참고하면 된다).

기능 게이트를 비활성화 상태에서 활성화 상태로 변경하는 경우,
(기능 게이트 목록뿐만 아니라) 다른 문서들도 함께 
수정해야 할 수 있다. "`exampleSetting` 필드는 베타 단계이며 기본적으로 비활성화되어 있다." 와 같은 문구가 문서에 남아 있는지 주의 깊게 살펴본다.
이 기능은 `ProcessExampleThings` 기능 게이트를 
활성화하면 사용할 수 있다."

기능이 일반 공개(GA'ed) 되었거나 사용 중단(deprecated)된 경우, 설명 파일의 
`stages` 블록에 추가적인 `stage` 항목을 포함힌다.
Alpha 및 Beta 단계는 그대로 유지되어야 한다. 이 단계는 
해당 기능 게이트를
[Alpha/Beta 기능 게이트](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features) 표에서
[일반 공개 또는 사용 중단된 기능 게이트](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-graduated-or-deprecated-features) 표로
이동시키는 역할을 한다. 예를 들면 다음과 같다:

{{< highlight yaml "linenos=false,hl_lines=10-17" >}}
stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.12"
    toVersion: "1.12"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.13"
  # 이전 단계에 `toVersion` 항목을 추가함
    toVersion: "1.18"
  # 기존 단계에 'stable' 단계 블록을 추가함
  - stage: stable
    defaultValue: true
    fromVersion: "1.19"
    toVersion: "1.27"
{{< / highlight >}}

궁극적으로 쿠버네티스는 해당 기능 게이트 자체를 아예 포함하지 않게 될 것이다.
기능 게이트가 제거되었음을 명시하려면, 해당 설명 파일의 
front matter(문서 헤더)에 `removed: true`를 추가한다.
이렇게 변경하면 해당 기능 게이트 정보는 
[일반 공개 또는 사용 중단된 기능 게이트](/docs/reference/command-line-tools-reference/feature-gates-removed/#feature-gates-that-are-removed) 
섹션에서
[제거된 기능 게이트](/docs/reference/command-line-tools-reference/feature-gates-removed/)라는
별도의 페이지로 이동하며, 그 설명도 함께 포함된다.

### 모든 PR이 리뷰 완료되고 머지 준비가 된 상태

릴리스 마감 기한까지 당신의 PR이 아직 `dev-{{< skew nextMinorVersion >}}` 
브랜치에 병합되지 않았다면, 이번 릴리스를 관리하는 문서 담당자와 협력하여
마감 기한 내에 병합될 수 있도록 한다. 기능에 문서화가 필요한데
문서가 준비되지 않은 경우, 해당 기능은 마일스톤에서 제외될 수 있다.
