---
# reviewers:
# - jpbetz
title: 조정된 리더 선출
content_type: concept
weight: 200
---

<!-- overview -->

{{< feature-state feature_gate_name="CoordinatedLeaderElection" >}}

쿠버네티스 {{< skew currentVersion >}}에는 {{<
glossary_tooltip text="컨트롤 플레인" term_id="control-plane" >}} 컴포넌트가
_조정된 리더 선출_ 을 통해 결정론적(deterministically)으로 리더를 선택할 수 있는 베타 기능이 포함되어 있다.  
이 기능은 클러스터 업그레이드 중 쿠버네티스 버전 차이의 제약을 만족하는 데 유용하다.
현재 내장된 선택 전략은 `OldestEmulationVersion`뿐이며,
에뮬레이션 버전이 가장 낮은 리더를 우선하고, 
그 다음으로 바이너리 버전, 생성 타임스탬프 순서대로 따른다.

## 조정된 리더 선출 활성화

{{< glossary_tooltip text="API 서버"
term_id="kube-apiserver" >}}를 시작할 때  
`CoordinatedLeaderElection` [기능 게이트](/docs/reference/command-line-tools-reference/feature-gates/)가 
활성화되어 있는지 확인하고, `coordination.k8s.io/v1beta1` API 그룹이 활성화되어 있는지
확인해야 한다.

이는 `--feature-gates="CoordinatedLeaderElection=true"`와
`--runtime-config="coordination.k8s.io/v1beta1=true"` 플래그를 설정하여 수행할 수 있다.

## 컴포넌트 설정

`CoordinatedLeaderElection` 기능 게이트와 _함께_
`coordination.k8s.io/v1beta1` API 그룹을 활성화한 경우,  
호환되는 컨트롤 플레인 컴포넌트는 필요에 따라서 LeaseCandidate 및 Lease API를 자동으로 사용하여 
리더를 선출한다.

쿠버네티스 {{< skew currentVersion >}}에서는 두 개의 컨트롤 플레인 컴포넌트
(kube-controller-manager와 kube-scheduler)가 기능 게이트와 API 그룹이 활성화되었을 때
조정된 리더 선출을 자동으로 사용한다.