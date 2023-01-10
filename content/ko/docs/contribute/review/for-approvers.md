---
title: 승인자와 리뷰어의 리뷰
linktitle: 승인자와 리뷰어용
slug: for-approvers
content_type: concept
weight: 20
---

<!-- overview -->

SIG Docs [리뷰어](/ko/docs/contribute/participate/roles-and-responsibilities/#리뷰어)와
[승인자](/ko/docs/contribute/participate/roles-and-responsibilities/#승인자)는 변경 사항을
리뷰할 때 몇 가지 추가 작업을 수행한다.

매주 특정 문서 승인자 역할의 지원자가
풀 리퀘스트를 심사하고 리뷰한다. 이
사람은 일주일 동안 "PR 랭글러(Wrangler)"이다. 자세한
정보는 [PR 랭글러 스케줄러](https://github.com/kubernetes/website/wiki/PR-Wranglers)를 참고한다. PR 랭글러가 되려면, 매주 SIG Docs 회의에 참석하고 자원한다. 이번 주에 해당 일정이 없는 경우에도, 아직 리뷰 중이 아닌
풀 리퀘스트(PR)를 여전히 리뷰할 수 있다.

로테이션 외에도, 봇은 영향을 받는 파일의 소유자를 기반으로
PR에 대한 리뷰어와 승인자를 할당한다.

<!-- body -->

## PR 리뷰

쿠버네티스의 문서는 [쿠버네티스의 코드 리뷰 프로세스](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md#the-code-review-process)를 따른다.

[풀 리퀘스트 리뷰](/ko/docs/contribute/review/reviewing-prs)에 설명된 모든 내용이 적용되지만, 리뷰어와 승인자도 다음을 수행해야 한다.

- `/assign` Prow 명령을 사용하여 필요에 따라 특정 리뷰어를 PR에 할당한다. 이는 코드 기여자에게
기술 리뷰를 요청할 때 특히 중요하다.

  {{< note >}}
  마크다운 파일 맨 위에 있는 헤더의 `reviewers` 필드를 보고 기술 리뷰를
  제공할 수 있는 사람을 확인한다.
  {{< /note >}}

- PR이 [콘텐츠](/docs/contribute/style/content-guide/)와 [스타일](/docs/contribute/style/style-guide/) 가이드를 따르는 지 확인한다. 그렇지 않은 경우 가이드의 관련 부분에 작성자를 연결한다.
- 적용이 가능한 경우 GitHub **Request Changes** 옵션을 사용하여 PR 작성자에게 변경을 제안한다.
- 제안한 사항이 구현된 경우, `/approve` 또는 `/lgtm` Prow 명령을 사용하여 GitHub에서 리뷰 상태를 변경한다.

## 다른 사람의 PR에 커밋

PR 코멘트를 남기는 것이 도움이 되지만, 대신 다른 사람의 PR에 커밋을
해야 하는 경우가 있다.

다른 사람이 명시적으로 요청하거나, 오랫동안
중단된 PR을 재개하려는 경우가 아니라면 다른 사람에게서 "가져오지" 마라. 단기적으로는
작업이 빠를 수 있지만, 그 사람이 기여할 기회를 박탈하게 된다.

사용할 프로세스는 이미 PR의 범위에 있는 파일을 편집해야
하는지, 또는 PR이 아직 다루지 않은 파일을 편집해야 하는지에 따라 다르다.

다음 중 하나에 해당하면 다른 사람의 PR에 커밋할 수
없다.

- PR 작성자가 브랜치를
  [https://github.com/kubernetes/website/](https://github.com/kubernetes/website/)
  리포지터리로 직접 푸시한 경우, 푸시 접근 권한이 있는 리뷰어만 다른 사용자의 PR에 커밋할 수 있다.

  {{< note >}}
  다음 번부터는 PR을 열기 전에 작성자가 브랜치를 자신의 포크로
  푸시하도록 권장한다.
  {{< /note >}}

- PR 작성자가 승인자의 수정을 명시적으로 허용하지 않는다.

## 리뷰를 위한 Prow 명령

[Prow](https://github.com/kubernetes/test-infra/blob/master/prow/README.md)는
풀 리퀘스트 (PR)에 대한 작업을 실행하는 쿠버네티스 기반 CI/CD 시스템이다. Prow는
챗봇 스타일 명령으로 쿠버네티스
조직 전체에서 [레이블 추가와 제거](#이슈-레이블-추가와-제거), 이슈 종료 및 승인자 할당과 같은 GitHub 작업을 처리할 수 있다. `/<command-name>` 형식을 사용하여 Prow 명령을 GitHub 코멘트로 입력한다.

리뷰어와 승인자가 사용하는 가장 일반적인 Prow 명령은 다음과 같다.

{{< table caption="리뷰를 위한 Prow 명령" >}}
Prow 명령     | 역할 제한           | 설명
:------------|:------------------|:-----------
`/lgtm` | 조직 멤버 | PR 리뷰를 마치고 변경 사항에 만족했음을 나타낸다.
`/approve` | 승인자 | PR을 병합(merge)하기 위해 승인한다.
`/assign` | 누구나 | PR을 리뷰하거나 승인할 사람을 지정한다.
`/close` | 조직 멤버 | 이슈 또는 PR을 닫는다.
`/hold` | 누구나 | 자동으로 병합할 수 없음을 나타내는 `do-not-merge/hold` 레이블을 추가한다.
`/hold cancel` | 누구나 | `do-not-merge/hold` 레이블을 제거한다.
{{< /table >}}

PR에서 사용할 수 있는 명령어들을 보려면
[Prow 명령 레퍼런스](https://prow.k8s.io/command-help?repo=kubernetes%2Fwebsite)를 참고한다.

## 이슈 심사와 분류


일반적으로, SIG Docs는 [쿠버네티스 이슈 심사](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md) 프로세스를 따르며 동일한 레이블을 사용한다.


이 GitHub 이슈 [필터](https://github.com/kubernetes/website/issues?q=is%3Aissue+is%3Aopen+-label%3Apriority%2Fbacklog+-label%3Apriority%2Fimportant-longterm+-label%3Apriority%2Fimportant-soon+-label%3Atriage%2Fneeds-information+-label%3Atriage%2Fsupport+sort%3Acreated-asc)는
심사가 필요한 이슈를 찾는다.

### 이슈 심사

1. 이슈 확인
  - 이슈가 website 문서에 관한 것인지 확인한다. 질문에 답하거나
    리소스에 리포터를 지정하면 일부 이슈를 신속하게 종결할 수 있다. 자세한 내용은
    [지원 요청 또는 코드 버그 리포트](#지원-요청-또는-코드-버그-리포트) 섹션을 참고한다.
  - 이슈가 가치가 있는지 평가한다.
  - 이슈의 내용에 실행할 수 있는 세부 사항이 충분하지 않거나 템플릿의 내용이
    제대로 작성되지 않은 경우 `triage/needs-information` 레이블을 추가한다.
  - `lifecycle/stale` 과 `triage/needs-information` 레이블이 모두 있으면 이슈를 닫는다.

2. 우선순위 레이블을
   추가한다([이슈 심사 가이드라인](https://github.com/kubernetes/community/blob/master/contributors/guide/issue-triage.md#define-priority)은 우선순위 레이블을 자세히 정의함).

  {{< table caption="이슈 레이블" >}}
  레이블 | 설명
  :------------|:------------------
  `priority/critical-urgent` | 이 작업을 지금 즉시 수행한다.
  `priority/important-soon` | 3개월 이내에 이 작업을 수행한다.
  `priority/important-longterm` | 6개월 이내에 이 작업을 수행한다.
  `priority/backlog` | 무기한 연기할 수 있다. 자원이 있을 때 수행한다.
  `priority/awaiting-more-evidence` | 잠재적으로 좋은 이슈에 대해 잊지 않도록 표시한다.
  `help` 또는 `good first issue` | 쿠버네티스나 SIG Docs 경험이 거의 없는 사람에게 적합하다. 자세한 내용은 [도움이 필요함 및 좋은 첫 번째 이슈 레이블](https://kubernetes.dev/docs/guide/help-wanted/)을 참고한다.

  {{< /table >}}

  재량에 따라, 이슈의 소유권을 가져와서 PR을
  제출한다(특히, 이미 수행 중인 작업과 관련이 있거나 빠르다면).

이슈 심사에 대해 질문이 있다면, 슬랙의 `#sig-docs` 채널이나
[kubernetes-sig-docs 메일링리스트](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)에 문의한다.

## 이슈 레이블 추가와 제거

레이블을 추가하려면, 다음의 형식 중 하나로 코멘트를 남긴다.

- `/<label-to-add>` (예: `/good-first-issue`)
- `/<label-category> <label-to-add>` (예: `/triage needs-information` 또는 `/language ko`)

레이블을 제거하려면, 다음의 형식 중 하나로 코멘트를 남긴다.

- `/remove-<label-to-remove>` (예: `/remove-help`)
- `/remove-<label-category> <label-to-remove>` (예: `/remove-triage needs-information`)

두 경우 모두, 사용하려는 레이블은 이미 존재하는 레이블이어야 한다. 존재하지 않는 레이블을 추가하려고 하면, 명령이
자동으로 무시된다.

모든 레이블 목록에 대해서는 [website 리포지터리의 레이블 섹션](https://github.com/kubernetes/website/labels)을 참고한다. SIG Docs에서 모든 레이블을 사용하는 것은 아니다.

### 이슈의 lifecycle 레이블

이슈는 일반적으로 신속하게 열리고 닫힌다.
그러나, 가끔씩은 이슈가 열린 후 비활성 상태로 있다.
어떤 경우에는 이슈가 90일 이상 열려 있을 수도 있다.

{{< table caption="이슈의 lifecycle 레이블" >}}
레이블 | 설명
:------------|:------------------
`lifecycle/stale` | 90일이 지나도 아무런 활동이 없는 이슈는 자동으로 오래된 것(stale)으로 표시된다. `/remove-lifecycle stale` 명령을 사용하여 라이프사이클을 수동으로 되돌리지 않으면 이슈가 자동으로 닫힌다.
`lifecycle/frozen` | 90일 동안 활동이 없어도 이 레이블의 이슈는 오래된 것(stale)으로 바뀌지 않는다. 사용자는 `priority/important-longterm` 레이블이 있는 이슈처럼 90일보다 훨씬 오래 열려 있어야 하는 이슈에 이 레이블을 수동으로 추가한다.
{{< /table >}}

## 특별한 이슈 유형의 처리

SIG Docs가 처리 방법을 문서화할 정도로 다음과 같은 유형의 이슈를
자주 경험하게 된다.

### 중복된 이슈

단일 문제에 대해 하나 이상의 이슈가 열려 있으면, 이를 단일 이슈로 합친다.
열린 상태를 유지할 이슈를 결정한 다음(또는
새로운 이슈를 열어야 함), 모든 관련 정보로 이동하여 관련 이슈를 연결해야 한다.
마지막으로, 동일한 문제를 설명하는 다른 모든 이슈에
`triage/duplicate` 레이블을 지정하고 닫는다. 하나의 이슈만 해결하는 것으로 혼동을 줄이고
같은 문제에 대한 중복 작업을 피할 수 있다.

### 깨진 링크 이슈

깨진 링크 이슈가 API 문서나 `kubectl` 문서에 있는 경우, 문제가 완전히 이해될 때까지 `/priority critical-urgent` 레이블을 할당한다. 다른 모든 깨진 링크 이슈는 수동으로 수정해야하므로, `/priority important-longterm` 를 할당한다.

### 블로그 이슈

[쿠버네티스 블로그](/blog/) 항목은 시간이 지남에 따라
구식이 될 것으로 예상한다. 따라서, 1년 미만의 블로그 항목만 유지 관리한다.
1년이 지난 블로그 항목과 관련된 이슈일 경우,
수정하지 않고 이슈를 닫는다.

### 지원 요청 또는 코드 버그 리포트

문서에 대한 일부 이슈는 실제로 기본 코드와 관련된 이슈이거나, 튜토리얼과
같은 무언가가 작동하지 않을 때 도움을 요청하는 것이다.
문서와 관련이 없는 이슈의 경우, `triage/support` 레이블과 함께 요청자에게 지원받을 수 있는 곳(슬랙, Stack Overflow)을
알려주며 이슈를 닫고, 기능 관련 버그에 대한 이슈인 경우,
관련 리포지터리를 코멘트로 남긴다(`kubernetes/kubernetes` 는
시작하기 좋은 곳이다).

지원 요청에 대한 샘플 응답은 다음과 같다.

```none
이 이슈는 지원 요청과 비슷하지만
문서 관련 이슈와는 관련이 없는 것 같습니다.
[쿠버네티스 슬랙](https://slack.k8s.io/)의
`#kubernetes-users` 채널에서 질문을 하시기 바랍니다. 또한,
[Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes)와
같은 리소스를 검색하여 유사한 질문에 대한 답변을
얻을 수도 있습니다.

https://github.com/kubernetes/kubernetes 에서
쿠버네티스 기능 관련 이슈를 열 수도 있습니다.

문서에 대한 이슈인 경우 이 이슈를 다시 여십시오.
```

샘플 코드 버그 리포트 응답은 다음과 같다.

```none
이 이슈는 문서에 대한 이슈보다 코드에 대한 이슈와
비슷합니다. https://github.com/kubernetes/kubernetes/issues 에서
이슈를 여십시오.

문서에 대한 이슈인 경우 이 이슈를 다시 여십시오.
```


