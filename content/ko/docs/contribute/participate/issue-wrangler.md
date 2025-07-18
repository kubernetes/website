---
title: 이슈 랭글러(Issue Wrangler)
content_type: concept
weight: 20
---

<!-- overview -->

[PR 랭글러](/docs/contribute/participate/pr-wranglers)와 더불어, 공식 승인자,
검토자 및 SIG Docs 팀원들은 리포지토리에 대해 
일주일 동안 교대로 
[이슈 심사](/docs/contribute/review/for-approvers/#이슈-심사)를 수행한다.

<!-- body -->

## 의무

이슈 랭글러는 일주일간 매일 다음을 담당한다:

- 매일 새로 들어오는 이슈를 심사한다. SIG Docs가 
    메타데이터를 사용하는 방법에 대한 지침은 [이슈 심사](/docs/contribute/review/for-approvers/#이슈-심사)
    를 참조한다.
- kubernetes/website 리포지토리 내의 오래되었거나 부패한 rotten 이슈들을 주시한다.
- [이슈 보드](https://github.com/orgs/kubernetes/projects/72/views/1)를 관리한다.

## 요구사항

- 쿠버네티스 조직의 활성 멤버여야 한다.
- 쿠버네티스에 최소 15개 이상의 [사소하지 않은](https://www.kubernetes.dev/docs/guide/pull-requests/#trivial-edits) 
    기여를 했어야 한다. (이 중 일정량은 kubernetes/website 리포지토리에 대한 기여여야 한다).
- 이미 비공식적으로 해당 역할을 수행하고 있어야 한다.

## 랭글러를 위한 유용한 Prow 명령어

다음은 이슈 랭글러가 자주 사용하는 명령어이다:

```bash
# 이슈 다시 열기
/reopen

# kubernetes/website에 맞지 않는 이슈를 다른 리포지토리로 이전
/transfer[-issue]

# rotten 이슈의 상태 변경
/remove-lifecycle rotten

# 오래된 이슈의 상태 변경
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

더 많은 Prow 명령어를 찾으려면, [명령어 도움말](https://prow.k8s.io/command-help) 문서를 참조한다.

## 이슈를 종료하는 시기

오픈소스 프로젝트가 성공하려면 좋은 이슈 관리가 중요하다.
하지만 리포지토리를 유지 관리하고 기여자 및 사용자와 명확하게 소통하기 위해서는
이슈를 해결하는 것 또한 중요하다.

이슈는 다음의 경우에 닫는다:

- 유사한 이슈가 두 번 이상 보고된 경우. 먼저 `/triage duplicate`;
    로 태그를 지정하고, 메인 이슈에 연결한 다음 닫아야 한다. 사용자에게 원본 이슈로 안내하는 것도 권장된다.
- 제공된 정보만으로는 작성자가 제시한 이슈를 이해하고 해결하기 매우 어려운 경우. 
    하지만 사용자에게 더 많은 세부 정보를 제공하거나 나중에 재현할 수 있다면 이슈를 다시 열도록 권장한다.
- 동일한 기능이 다른 곳에 이미 구현되어 있는 경우. 이슈를 닫고 사용자를 적절한 곳으로 안내할 수 있다.
- 보고된 이슈가 현재 계획되어 있지 않거나 프로젝트 목표와 일치하지 않는 경우.
- 이슈가 스팸으로 보이거나 명백히 관련 없는 경우.
- 이슈가 외부 제약 사항 또는 의존성과 관련되어 프로젝트의 통제 범위를 벗어나는 경우.

이슈를 닫으려면 이슈에 `/close`를 남긴다.

