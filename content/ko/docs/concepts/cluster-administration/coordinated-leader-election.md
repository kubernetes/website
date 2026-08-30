---
reviewers:
- jpbetz
title: 조정된 리더 선출
content_type: concept
weight: 200
---

<!-- overview -->

{{< feature-state feature_gate_name="CoordinatedLeaderElection" >}}

쿠버네티스 {{< skew currentVersion >}}에는 {{<
glossary_tooltip text="컨트롤 플레인" term_id="control-plane" >}} 컴포넌트가
_조정된 리더 선출_을 통해 결정론적으로 리더를 선택할 수 있도록 하는 베타 기능이 포함되어 있다.
이 기능은 클러스터 업그레이드 중 쿠버네티스 버전 차이 제약 조건을 충족하는 데 유용하다.
현재 내장된 선택 전략은 `OldestEmulationVersion`뿐이며,
에뮬레이션 버전이 가장 낮은 리더를 우선한 다음 바이너리
버전, 생성 타임스탬프 순으로 우선한다.

## 조정된 리더 선출 활성화

{{< glossary_tooltip text="API 서버" term_id="kube-apiserver" >}}를 시작할 때
`CoordinatedLeaderElection` [기능
게이트](/docs/reference/command-line-tools-reference/feature-gates/)가 활성화되어 있고,
`coordination.k8s.io/v1beta1` API 그룹도
활성화되어 있는지 확인한다.

플래그 `--feature-gates="CoordinatedLeaderElection=true"`와
`--runtime-config="coordination.k8s.io/v1beta1=true"`를 설정하면 된다.

## 컴포넌트 구성

`CoordinatedLeaderElection` 기능 게이트와  
`coordination.k8s.io/v1beta1` API 그룹을 모두 활성화하면, 호환되는 컨트롤 플레인  
컴포넌트는 필요에 따라 LeaseCandidate 및 Lease API를 사용하여 자동으로 리더를  
선출한다.  

쿠버네티스 {{< skew currentVersion >}}에서는 두 개의 컨트롤 플레인 컴포넌트  
(`kube-controller-manager`와 `kube-scheduler`)가 기능 게이트와 API 그룹이  
활성화된 경우 조정된 리더 선출을 자동으로 사용한다.

## 쿠버네티스 컴포넌트의 리더 선출

쿠버네티스는 고가용성 클러스터에서 `kube-controller-manager`나 `kube-scheduler`와 같은 동일한 컨트롤 플레인 컴포넌트의 여러 인스턴스 중 리더를 선출하기 위해 [Lease API](/docs/concepts/architecture/leases/)를 사용한다.

[Lease](/docs/concepts/architecture/leases/)는 [쿠버네티스 API 서버](/docs/reference/command-line-tools-reference/kube-apiserver/)에 저장되는 경량 분산 잠금 역할을 한다.
컴포넌트의 실행 중인 모든 인스턴스는 관련 Lease 오브젝트를 감시하거나 주기적으로 읽어
현재 어떤 인스턴스가 리더 역할을 하는지 확인한다.

[Lease API](/docs/reference/kubernetes-api/cluster-resources/lease-v1/)는 다음과 같은
필드를 정의한다.

`holderIdentity`
: 현재 리더의 신원(예: 파드 이름 또는 호스트 이름 기반 문자열)이다.

`acquireTime`
: 리더십을 획득한 시각의 타임스탬프이다.

`renewTime`
: 리더가 가장 최근에 갱신한 시각의 타임스탬프이다.

`leaseDurationSeconds`
: 리스의 유효 기간이다(후보는 만료된 리스를 획득하려고 시도하기 전에 이 기간에 짧은 유예 기간을 더한 만큼 기다려야 한다).

`leaseTransitions`
: 리더십이 이전된 횟수를 나타내는 카운터이다.

이 필드들은 어떤 인스턴스가 리더십을 보유하고 있으며 해당 리더십이 얼마나 오래 유효한지를 나타낸다.

[Lease](/docs/concepts/architecture/leases/)가 존재하지 않거나 만료된 경우(현재 시각 > `renewTime` + `leaseDurationSeconds`), 후보 인스턴스는 자신의 신원으로 Lease를 업데이트하려고 시도한다. 쿠버네티스는 오브젝트의 `resourceVersion`을 통한 _낙관적 동시성 제어_를 사용한다. 동시에 업데이트를 시도하면 버전 불일치로 인해 하나의 업데이트만 성공하며, 업데이트가 승인된 인스턴스가 _리더_가 된다.

쿠버네티스는 리더 선출을 관리하기 위해 [LeaseCandidate](/docs/reference/kubernetes-api/cluster-resources/lease-candidate-v1beta1/)
API를 사용한다. `kube-controller-manager`와 `kube-scheduler` 같은 컨트롤 플레인 컴포넌트는 LeaseCandidate 오브젝트를 생성하여 후보 역할을 등록한다. 이 오브젝트는 리더십을 두고 경쟁하는 모든 인스턴스를 추적하며 후보의 신원, 바이너리 버전, 에뮬레이션 버전 등의 메타데이터를 포함한다.

선출 중 후보들은 공유 [Lease](/docs/concepts/architecture/leases/)를 통해 조정한다.
쿠버네티스 컨트롤 플레인은 단 하나의 후보만 [Lease](/docs/concepts/architecture/leases/)를 획득하여 _리더_ 역할을 맡고, 나머지 후보는 모두 팔로워로 남도록 보장한다. 현재 _리더_가 지정된 제한 시간 안에 [Lease](/docs/concepts/architecture/leases/)를 갱신하지 못하면, 나머지 후보들이 리더십을 획득하기 위해 경쟁하여 새로운 _리더_를 선출한다.

선출된 리더는 `renewTime` 필드를 업데이트하여 주기적으로 Lease를 갱신한다.

(예를 들어, [Lease](/docs/concepts/architecture/leases/)가 만료되려 할 때 충돌을 방지하기 위해 `leaseDurationSeconds` ÷ 2마다 갱신한다.)
리스가 만료되기 전에 계속 갱신되는 한 현재 리더 인스턴스가 리더십을 유지한다.
리더가 충돌하거나 접근할 수 없게 되거나 Lease 갱신을 중단하면 해당 Lease가 만료된다. 다른 정상 인스턴스는 만료된 Lease를 감지하고 새로운 선출을 시도한다.

이 메커니즘을 통해 안정성과 복구를 위해 컴포넌트의 여러 레플리카가 실행되고 있더라도 _한 번에 하나의 인스턴스만 제어 작업을 능동적으로 수행_하며, 나머지 인스턴스는 Lease를 감시하면서 필요할 때 신속하게 인계할 수 있도록 대기 상태로 남는다.
