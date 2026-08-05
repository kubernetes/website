---
title: 이슈 랭글러(Issue Wrangler)
content_type: concept
weight: 20
---

<!-- overview -->

[PR 랭글러](/ko/docs/contribute/participate/pr-wranglers)와 마찬가지로, 공식 승인자,
검토자 및 SIG Docs 구성원들은 리포지토리에 대해 
일주일 동안 교대로 
[이슈 심사와 분류](/ko/docs/contribute/review/for-approvers/#이슈-심사와-분류)를 수행한다.

<!-- body -->

## 의무

이슈 랭글러는 일주일 간 매일 다음의 일을 해야 한다.

- 새로운 이슈를 매일 분류하고 태깅한다. SIG Docs에서 
    메타데이터를 사용하는 방법에 대한 지침은 [이슈 심사](/ko/docs/contribute/review/for-approvers/#이슈-심사)
    를 참조한다.
- kubernetes/website 리포지토리 내 활동이 없거나(stale) 오래된(rotten) 이슈들을 주시한다.
- [이슈 보드](https://github.com/orgs/kubernetes/projects/72/views/1)를 관리한다.

## 요구사항

- 쿠버네티스 조직의 활동적인 멤버여야 한다.
- 쿠버네티스에 대한 최소 15개 이상의 [사소하지 않은](https://www.kubernetes.dev/docs/guide/pull-requests/#trivial-edits) 
    기여가 있어야 한다. (이 중 일정 부분은 kubernetes/website 리포지토리에 대한 기여여야 한다).
- 이미 비공식적으로 해당 역할을 수행하고 있어야 한다.

## 랭글러를 위한 유용한 Prow 명령어

다음은 이슈 랭글러가 자주 사용하는 명령어이다.

```bash
# 이슈 다시 열기
/reopen

# kubernetes/website에 맞지 않는 이슈를 다른 리포지토리로 이전
/transfer[-issue]

# rotten 이슈의 상태 변경
/remove-lifecycle rotten

# stale 이슈의 상태 변경
/remove-lifecycle stale

# 이슈에 SIG 할당
/sig <sig_name>

# 특정 영역 추가
/area <area_name>

# 초보자에게 적합한 이슈
/good-first-issue

# 도움이 필요한 이슈
/help wanted

# 지원 관련 이슈 태그 지정
/kind support

# 이슈 심사 수락
/triage accepted

# 작업하지 않거나 아직 해결되지 않은 이슈 닫기
/close not-planned
```

더 많은 Prow 명령어는 [Command Help](https://prow.k8s.io/command-help) 문서를 참조한다.

## 이슈를 종료하는 시점

오픈소스 프로젝트가 성공하려면 좋은 이슈 관리가 필수적이다.
그러나 리포지토리를 유지하고 기여자 및 작성자와 명확하게 소통하기 위해
이슈를 해결하는 것도 매우 중요하다.

다음과 같은 경우 이슈를 닫는다.

- 유사한 이슈가 여러 번 보고된 경우. 먼저 `/triage duplicate`
    로 태깅하고, 메인 이슈에 링크하고 해당 이슈를 닫는다. 작성자에게 원본 이슈로 안내하는 것이 좋다.
- 작성자가 제시한 이슈를 제공된 정보만으로 이해하고 해결하는 것이 매우 어려운 경우.
    그러나 작성자가 이슈를 재현할 수 있다면, 더 자세한 정보를 제공하거나 이슈를 재개하도록 권장한다.
- 동일한 기능이 다른 곳에 이미 구현되어 있는 경우. 이슈를 닫고 작성자를 적절한 곳으로 안내할 수 있다.
- 보고된 이슈가 현재 계획되어 있지 않거나 프로젝트 목표와 일치하지 않는 경우.
- 이슈가 스팸으로 보이며 명백히 관련이 없는 경우.
- 이슈가 외부 제한 사항이나 의존성과 관련되어 있으며 프로젝트의 통제 범위를 벗어난 경우.

이슈를 닫으려면, 이슈에 `/close` 코멘트를 남긴다.

