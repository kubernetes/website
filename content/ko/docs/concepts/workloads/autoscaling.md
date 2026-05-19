---
title: 오토스케일링 워크로드
description: >-
  오토스케일링을 사용하면, 워크로드를 자동으로 여러 방식으로 업데이트를 할 수 있다. 이것은 클러스터가 리소스 요청에 좀 더 유연하고 효율적으로 반응하게 해준다.
content_type: concept
weight: 40
---

<!-- overview -->

쿠버네티스에서는 현재 리소스 수요에 따라 워크로드를 _스케일링_ 할 수 있다.
이를 통해 클러스터가 리소스 수요 변화에 보다 탄력적이고 효율적으로 대응할 수 있다.

워크로드를 스케일링할 때는, 워크로드가 관리하는 레플리카 수를 늘리거나 줄일 수 있고, 혹은 레플리카 수는 그대로 둔 채 할당된
리소스를 조정할 수 있다.

첫 번째 방법을 _수평 스케일링(horizontal scaling)_ , 두 번째 방법을 _수직 스케일링(vertical scaling)_ 
이라고 부른다.

워크로드 스케일링은 사용 사례에 따라 수동 또는 자동으로 수행할 수 있다.

<!-- body -->

## 수동 워크로드 스케일링

쿠버네티스는 워크로드의 _수동 스케일링(manual scaling)_ 을 제공한다. 수평 스케일링은
`kubectl` CLI을 사용해 수행할 수 있다.
수직 스케일링의 경우, 워크로드의 리소스 정의를 _패치_ 해야한다.

아래는 두 방식의 예시이다.

- **수평 스케일링**: [복수의 앱 인스턴스를 구동하기](/ko/docs/tutorials/kubernetes-basics/scale/scale-intro/)
- **수직 스케일링**: [컨테이너에 할당된 CPU와 메모리 리소스 크기 조정하기](/docs/tasks/configure-pod-container/resize-container-resources)

## 자동 워크로드 스케일링

쿠버네티스는 워크로드의 _자동 스케일링(automatic scaling)_ 도 제공하는데, 이 페이지는 이를 중점적으로 다룬다.

쿠버네티스에서 _오토스케일링_ 라는 개념은 여러개의 파드를 관리하는 오브젝트를(예를 들어, 
{{< glossary_tooltip text="디플로이먼트" term_id="deployment" >}}) 
자동으로 업데이트하는 것을 말한다.

### 수평 워크로드 스케일링

쿠버네티스에서, _HorizontalPodAutoscaler_(HPA)을 이용하여 워크로드를 수평으로 자동 스케일링할 수 있다.

이것은 쿠버네티스 API 리소스와 {{< glossary_tooltip text="컨트롤러" term_id="controller" >}}로
구현되어있고, 주기적으로 워크로드의 {{< glossary_tooltip text="레플리카" term_id="replica" >}}의 수를 조정하여
CPU나 메모리 사용량과 같은 관측된 리소스 사용률에 맞춘다.

[HorizontalPodAutoscaler 연습](/ko/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough)에서 디플로이먼트의 HorizontalPodAutoscaler를 구성해볼 수 있다.

### 수직 워크로드 스케일링

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

_VerticalPodAutoscaler_ (VPA)를 이용하여 워크로드를 수직으로 자동 스케일링할 수 있다.
HPA와 달리, VPA는 쿠버네티스에서 기본적으로 제공하지는 않지만, 별도의 
[Github 프로젝트](https://github.com/kubernetes/autoscaler/tree/9f87b78df0f1d6e142234bb32e8acbd71295585a/vertical-pod-autoscaler)에서 확인할 수 있다.

설치 후에는, {{< glossary_tooltip text="CustomResourceDefinitions" term_id="customresourcedefinition" >}}(CRDs) 을 생성하여,
워크로드가 관리하는 레플리카들의 리소스를 _어떻게_, _언제_ 스케일링 할 것인지를 정의한다.

{{< note >}}
VPA를 사용하려면 클러스터에
[Metrics Server](https://github.com/kubernetes-sigs/metrics-server)를 설치해야한다.
{{< /note >}}

현재, VPA는 다음 네 가지 모드로 작동된다.

{{< table caption="Different modes of the VPA" >}}
모드 | 설명
:----|:-----------
`Auto` | 현재는 `Recreate`모드와 동일하다. 향후에 인플레이스(in-place) 업데이트로 변경될 수 있다.
`Recreate` | VPA는 파드가 생성될 때 리소스 요청(resource request)를 할당하며, 기존 파드의 리소스 요청이 새로운 권장 값과 상당히 다르다면, 파드를 축출(evitct)하여 이를 업데이트한다.  
`Initial` | VPA는 파드가 생성될 때만 리소스 요청을 할당하고, 이후에는 변경하지 않는다.
`Off` | VPA가 파드의 리소스 요청 값을 자동으로 바꾸지 않는다. 권장 값은 계산되며 VPA 오브젝트에서 확인할 수 있다.
{{< /table >}}

### 수직 인플레이스(In-place) 파드 스케일링

{{< feature-state feature_gate_name="InPlacePodVerticalScaling" >}}

쿠버네티스 {{< skew currentVersion >}} 버전에서는 인플레이스로 파드를 리사이징하는 기능은 지원하지 않지만,
현재 통합이 진행 중이다.
수동으로 파드를 인플레이스 리사이징 하려면, [컨테이너 리소스 인플레이스 리사이즈](/docs/tasks/configure-pod-container/resize-container-resources/)를 참고하자.

### 클러스터 크기 기반 오토스케일링

클러스터의 크기에 따라 스케일링이 필요한 워크로드(예: `cluster-dns`또는 시스템 컴포넌트)의 경우,
[_Cluster Proportional Autoscaler_](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler)를
사용할 수 있다.
VPA와 마찬가지로, 쿠버네티스 코어에 포함되지 않으나,
Github의 별도 프로젝트에서 호스팅된다.

Cluster Proportional Autoscaler는 스케줄 가능한 {{< glossary_tooltip text="노드" term_id="node" >}}의 수와 코어 수를 감시하고,
이에 맞춰 대상 워크로드의 레플리카의 수를 스케일링한다.

만약 레플리카의 수는 그대로 유지하면서, 클러스터의 크기에 따라 워크로드를 수직으로 스케일링하고자 한다면, 
[_Cluster Proportional Vertical Autoscaler_](https://github.com/kubernetes-sigs/cluster-proportional-vertical-autoscaler)를 사용할 수 있다.
이 프로젝트는 **현재 베타**상태이고, Github에서 확인할 수 있다.

Cluster Proportional Autoscaler가 워크로드의 레플리카 수를 스케일링한다면,
Cluster Proportional Vertical Autoscaler는 워크로드
(예: 디플로이먼트나 데몬셋)의 리소스 요청을 클러스터의 노드 수 및/또는 코어 수를 기반으로 조정한다. 

### 이벤트 기반 오토스케일링

워크로드를 이벤트를 기반으로 스케일링할 수 있는데, 그 예로
[_Kubernetes Event Driven Autoscaler_ (**KEDA**)](https://keda.sh/)가 있다.

KEDA는 CNCF-graduated 프로젝트이고 처리해야 할 이벤트의 수(예: 큐에 존재하는 메세지의 양)를
기반으로 워크로드를 스케일링할 수 있게 한다. 다양한
이벤트 소스에 대응할 수 있는 폭넓은 어댑터들이 제공된다.

### 스케줄 기반 오토스케일링

워크로드를 스케일링하는 또 다른 전략은 스케일링을 수행하는 **스케줄**을 설정하는 것인데, 예를 들어
비혼잡 시간대에 리소스 사용량을 줄이기 위해 사용할 수 있다.

이벤트 기반 오토스케일링과 비슷하게, 이 기능도 KEDA와 [`Cron` scaler](https://keda.sh/docs/latest/scalers/cron/)를
함께 사용하여 구현할 수 있다.
`Cron` scaler는 워크로드를 확장하거나 축소할 시각(과 시간대)을 정의할 수 있다.

## 클러스터 인프라 스케일링

만약 워크로드 스케일링만으로 충분하지 않다면, 클러스터 인프라 자체를 스케일링할 수 있다.

클러스터 인프라를 스케일링하는 것은 일반적으로 {{< glossary_tooltip text="노드" term_id="node" >}}를 추가하거나 삭제하는 것을 의미한다.
자세한 내용은 [노드 오토스케일링](/docs/concepts/cluster-administration/node-autoscaling/)를
참고하자.

## {{% heading "whatsnext" %}}

- 수평 스케일링에 대해 더 알아보기
  - [스테이트풀셋(StatefulSet) 확장하기](/ko/docs/tasks/run-application/scale-stateful-set/)
  - [HorizontalPodAutoscaler 연습](/ko/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)
- [컨테이너 리소스 인플레이스 리사이즈](/docs/tasks/configure-pod-container/resize-container-resources/)
- [클러스터에서 DNS 서비스 오토스케일](/ko/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)
- [노드 오토스케일링](/docs/concepts/cluster-administration/node-autoscaling/) 알아보기
