---
# reviewers:
# - gjtempleton
# - jonathan-innis
# - maciekpytel
title: 노드 오토스케일링
linkTitle: Node Autoscaling
description: >-
  클러스터의 노드를 자동으로 프로비저닝하고 통합하여 수요 변화에 대응하고 비용을 최적화한다.
content_type: concept
weight: 15
---

클러스터의 워크로드를 실행하기 위해,
{{< glossary_tooltip text="노드" term_id="node" >}}가 필요하다. 클러스터의 노드는 _오토스케일링_될 수 있고, 
동적으로 [_프로비저닝_](#provisioning)되거나, [_통합_](#consolidation)되어 비용을 최적화하면서도 
필요한 용량을 제공한다. 오토스케일링은 노드 [_오토스케일러_](#autoscalers)에 의해 수행된다.

## 노드 프로비저닝 {#provisioning}

만약 클러스터 내 기존 노드에 스케줄링될 수 없는 파드가 있다면, 새 노드를 
자동으로 클러스터에 추가(즉, 프로비저닝)하여 그 파드를 수용한다. 이는 특히 
시간이 지나면서 파드의 개수가 바뀔 때 유용한데,[수평 워크로드를 노드 오토스케일링과 결합](#horizontal-workload-autoscaling)한 결과와 
같은 예가 있다.

오토스케일링은 노드를 프로비저닝하기 위해, 이를 뒷받침하는 클라우드 제공자 리소스를 생성하거나 삭제한다. 가장 일반적으로 노드를 뒷받침하는 리소스는 
가상 머신이다.

프로비저닝의 주요 목표는 모든 파드가 스케줄링할 수 있도록 만드는 것이다. 
이 목표는 다양한 제한 사항으로 인해 항상 달성할 수 있는 것은 아닌데, 설정된 프로비저닝 한도에 도달한 경우, 특정 파드 집합과 프로비저닝 구성이 
호환되지 않는 경우, 또는 클라우드 제공자의 용량 부족 등이 그러한 제한 
사항이다. 프로비저닝 과정에서 노드 오토스케일러는 종종 추가적인 목표(예를 
들어 프로비저닝 된 노드의 비용 최소화, 장애 도메인 간 노드 수 균형 유지)를 
달성하려 시도한다.

노드 오토스케일러가 프로비저닝 할 노드를 결정할 때는 두 가지 주요 입력값이 있는데, 
[파드 스케줄링 제약 조건](#provisioning-pod-constraints)과 
[오토스케일러 설정으로 부과되는 노드 제약 조건](#provisioning-node-constraints)이다.

오토스케일러 설정에는 다른 노드 프로비저닝 트리거(예: 노드 수가 설정된 최소 
한도 아래로 떨어지는 경우)도 포함될 수 있다.

{{< note >}}
프로비저닝은 과거 클러스터 오토스케일러에서 _스케일-업(scale-up)_ 이라고 불렸다.
{{< /note >}}

### 파드 스케줄링 제약 조건 {#provisioning-pod-constraints}

파드는 [스케줄링 제약조건](/docs/concepts/scheduling-eviction/assign-pod-node/)으로 스케줄링될 수 있는 노드의 유형을 제한할 수 
있다. 노드 오토스케일러는 이런 제약조건을 고려하여 Pending 파드를 
프로비저닝 된 노드에 스케줄링할 수 있도록 한다.

가장 일반적인 스케줄링 제약조건은 파드 컨테이너의 리소스 요청을 지정하는 
것이다. 오토스케일러는 프로비저닝 된 노드가 해당 요구를 충족할 충분한 
리소스를 가지도록 보장한다. 하지만, 파드가 실행된 이후의 실제 리소스 
사용량은 직접적으로 고려하지 않는다. 실제 워크로드의 리소스 사용량에 
기반하여 노드를 오토스케일링하기 위해, [수평 워크로드 오토스케일링](#horizontal-workload-autoscaling)을 노드 오토스케일링과 결합할 
수 있다.

그 외 일반적인 파드 스케줄링 제약조건은 
[노드 어피니티](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)와 
[파드 간 어피니티](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity),
특정 [스토리지 볼륨](/docs/concepts/storage/volumes/) 요구사항이 있다.

### 오토스케일 설정으로 부과되는 노드 제약 조건 {#provisioning-node-constraints}

프로비저닝 된 노드의 세부 사항(예: 리소스의 양, 특정 라벨의 존재 여부)은 
오토스케일러 설정에 따라 달라진다. 오토스케일러는 미리 정의된 노드 설정 
집합에서 선택하거나, [자동-프로비저닝](#autoprovisioning)을 사용할 수 있다.

### 자동-프로비저닝 {#autoprovisioning}

노드 자동-프로비저닝은 프로비저닝될 노드의 세부 사항 설정을 완전하게 하지 않아도 
되는 프로비저닝 모드이다. 대신, 오토스케일러는 Pending 파드와 미리 설정된 
제약 조건(예: 최소 리소스 양 또는 특정 라벨 필요 여부)을 기반으로 노드 설정을 
동적으로 고른다.

## 노드 통합 {#consolidation}

클러스터를 운영할 때 가장 중요한 고려 사항은, 스케줄 가능한 모든 파드가 
실행되도록 하면서 클러스터 비용을 가능한 한 낮게 유지하는 것이다. 이를 
달성하려면 파드의 리소스 요청이 노드의 리소스를 최대한 활용하도록 설정되어야 한다. 이런 관점에서, 클러스터 내 전체 노드 사용률은 클러스터의 비용 
효율성을 보여주는 지표로 활용될 수 있다.

{{< note >}}
파드의 리소스 요청을 정확하게 설정하는 것은 노드 사용률을 최적화하는 것만큼 
클러스터 비용 효율성에 중요하다. 노드 오토스케일링을 
[수직 워크로드 오토스케일링](#vertical-workload-autoscaling)과 결합하는 것이 
도움이 될 수 있다.
{{< /note >}}

클러스터의 노드는 전체 노드 사용률과 비용 효율성을 높이기 위해 자동으로 _통합_ 
될 수 있다. 통합은 활용도가 낮은 노드 집합을 클러스터에서 제거함으로써 
이루어진다. 선택적으로, 이를 대체하기 위해 다른 노드를 
[프로비저닝](#provisioning)할 수도 있다.

통합은 프로비저닝과 마찬가지로 실제 리소스 사용량이 아니라 파드의 리소스 요청만 
고려한다.

통합을 위해, 노드에는 DaemonSet과 스태틱(static) 파드만 실행 중이라면 
해당 노드를 _비어 있는_ 노드로 간주한다. 통합 시 비어 있는 노드를 제거하는 것이 
비어 있지 않은 노드를 제거하는 것보다 훨씬 단순하며, 오토스케일러는 일반적으로 비어 있는 노드 통합에 특화된 최적화를 갖추고 있다.

비어 있지 않은 노드를 통합 과정에서 제거하면 중단(disruption)이 발생한다. 
그 노드에서 재생 중인 파드가 종료되고 다시 생성되어야(예: Deployment에 
의해) 하기 때문이다. 그러나 이렇게 재생성된 모든 파드는 클러스터 내 기존 
노드나 통합 과정에서 프로비저닝 된 대체 노드에 스케줄링될 수 있어야 한다. 
_통합으로 인해 파드가 pending 상태에 머무르는 일은 정상적으로는 없어야 한다._

{{< note >}}
오토스케일러는 노드가 프로비저닝되거나 통합된 후 재생성된 파드가 어떻게 
스케줄링될지를 예측할 수는 있지만, 실제 스케줄링을 제어하지는 않는다. 이 때문에 
통합 후에 일부 파드가 Pending 상태가 될 수 있다. 그 예로 통합 도중에 완전히 
새로운 파드가 나타나는 경우가 그러하다.
{{< /note >}}

오토스케일러 설정에 따라, 다른 조건(예: 노드 생성 후 경과 시간)을 기준으로 
통합이 트리거되도록 할 수도 있으며, 이를 통해 다른 속성(예: 클러스터 내 노드의 
최대 수명)을 최적화할 수 있다.

통합이 실제로 어떻게 수행되는지는 해당 오토스케일러의 설정에 따라 달라진다.

{{< note >}}
통합은 과거 클러스터 오토스케일러에서 _스케일 다운(scale-down)_ 이라고 불렸다.
{{< /note >}}

## 오토스케일러 {#autoscalers}

이전 섹션에서 설명된 기능들은 노드 _오토스케일러_ 에 의해 제공된다. 
오토스케일러는 Kubernetes API뿐만 아니라 클라우드 제공자 API와도 
상호작용하여 노드를 프로비저닝하고 통합해야 한다. 이는 오토스케일러가 지원되는 
각 클라우드 제공자와 명시적으로 통합되어야 함을 의미한다. 특정 오토스케일러의 
성능과 기능 집합은 클라우드 제공자 통합 방식에 따라 달라질 수 있다.

{{< mermaid >}}
graph TD
    na[노드 오토스케일러]
    k8s[쿠버네티스]
    cp[클라우드 제공자]

    k8s --> |파드/노드 조회|na
    na --> |노드 드레인|k8s
    na --> |노드를 지원하는 리소스 생성/제거|cp
    cp --> |노드를 지원하는 리소스 조회|na

    classDef white_on_blue fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef blue_on_white fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class na blue_on_white;
    class k8s,cp white_on_blue;
{{</ mermaid >}}

### 오토스케일러 구현

[클러스터 오토스케일러](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler)와 
[Karpenter](https://github.com/kubernetes-sigs/karpenter)는 
현재 [SIG Autoscaling](https://github.com/kubernetes/community/tree/master/sig-autoscaling)에서 관리하는 두 가지 노드 오토스케일러이다.

클러스터 사용자의 관점에서 두 오토스케일러는 유사한 노드 오토스케일링 경험을 
제공해야 한다. 둘 다 스케줄할 수 없는 파드를 위해 새로운 노드를 프로비저닝하고, 
더 이상 최적으로 활용되지 않는 노드를 통합한다.

또한 일부 오토스케일러는 이 페이지에서 설명하는 노드 오토스케일링 범위를 
넘어서는 기능을 제공하기도 하며, 이러한 추가 기능은 오토스케일러마다 다를 수 있다.

아래 섹션과 각 오토스케일러의 연결된 문서를 참고하여, 어떤 오토스케일러가 
사용자의 활용 사례에 더 적합한지 결정하자.

#### 클러스터 오토스케일러

클러스터 오토스케일러는 미리 구성된 _노드 그룹(Node Groups)_ 에 노드를 
추가하거나 제거한다. 노드 그룹은 일반적으로 클라우드 제공자의 리소스 그룹(가장 
흔하게는 가장 머신 그룹)에 맵핑된다. 클러스터 오토스케일러의 단일 인스턴스는 
여러 노드 그룹을 동시에 관리할 수 있다. 프로비저닝할 때, 클러스터 오토스케일러는 
Pending 파드의 요청에 가장 적합한 그룹에 노드를 추가한다. 통합할 때, 클러스터 
오토스케일러는 항상 제거할 특정 노드를 선택하는데, 단순히 클라우드 제공자의 리소스그룹 크기를 조정하는 것과 대조된다.

추가 자료:

* [문서 개요](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/README.md)
* [클라우드 제공자 통합](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/README.md#faqdocumentation)
* [클러스터 오토스케일러 FAQ](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md)
* [문의](https://github.com/kubernetes/community/tree/master/sig-autoscaling#contact)

#### Karpenter

Karpenter는 클러스터 제공자가 제공한 [NodePool](https://karpenter.sh/docs/concepts/nodepools/) 설정을 기반으로 노드를 자동 
프로비저닝한다. Karpenter는 단순히 오토스케일링하는 것을 넘어, 모든 노드의 
수명 주기의 모든 측면을 관리한다. 여기에는 노드가 특정 수명에 도달했을 때 
자동으로 갱신하거나, 새로운 워커 노드 이미지가 릴리스되면 노드를 자동 
업그레이드하는 기능이 포함된다. Karpenter는 클라우드 제공자의 개별 리소스
(가장 흔하게는 개별 가상 머신)와 직접 작동하며, 클라우드 제공자 리소스 그룹에 의존하지 않는다.

추가 자료:

* [문서](https://karpenter.sh/)
* [클라우드 제공자 통합](https://github.com/kubernetes-sigs/karpenter?tab=readme-ov-file#karpenter-implementations)
* [Karpenter FAQ](https://karpenter.sh/docs/faq/)
* [문의](https://github.com/kubernetes-sigs/karpenter#community-discussion-contribution-and-support)

#### 구현 비교

클러스터 오토스케일러와 Karpenter의 주요 차이점은 다음과 같다:

* 클러스터 오토스케일러는 노드 오토스케일링과 관련된 기능만 제공한다. 반면, Karpenter는 더 넓은 
  범위를 다루며, 노드 수명 주기 전체를 관리하기 위한 기능도 제공한다(예: 
  노드가 특정 수명에 도달하면 중단(disruption)을 활용해 자동으로 노드를 재생성하거나, 새로운 버전으로 
  자동 업그레이드).
* 클러스터 오토스케일러는 자동 프로비저닝을 지원하지 않으며, 프로비저닝할 수 있는 노드 그룹은 
  사전에 구성되어야 한다. Karpenter는 자동 프로비저닝을 지원하므로, 사용자는 동질적인 그룹을 완전히 구성할 필요 없이, 프로비저닝 된 노드에 대한 
  제약 조건만 설정하면 된다.
* 클러스터 오토스케일러는 클라우드 제공자 통합을 직접 제공하며, 이는 쿠버네티스 프로젝트의 
  일부라는 의미다. Karpenter의 경우, 쿠버네티스 프로젝트는 Karpenter를 
  라이브러리 형태로 배포하고, 클라우드 제공자가 이를 통합해 노드 오토스케일러를 구축한다.
* 클러스터 오토스케일러는 규모가 작거나 덜 알려진 제공자를 포함해 다양한 클라우드 
  제공자와 통합을 지원한다. Karpenter와 통합하는 클라우드 제공자는 더 적으며, 
  [AWS](https://github.com/aws/karpenter-provider-aws)와 
  [Azure](https://github.com/Azure/karpenter-provider-azure)를 포함한다.

## 워크로드와 노드 오토스케일링 결합하기

### 수평 워크로드 오토스케일링 {#horizontal-workload-autoscaling}

노드 오토스케일링은 보통 파드에 반응하여 동작한다. 스케줄링할 수 없는 파드를 수용하기 
위해 새로운 노드를 프로비저닝하고, 필요하지 않게 되면 노드를 통합한다.

[수평 워크로드 오토스케일링](/docs/concepts/workloads/autoscaling#scaling-workloads-horizontally)은 
워크로드 레플리카 간의 원하는 평균 리소스 사용률을 유지하기 위해 레플리카의 수를 
자동으로 조정한다. 즉, 애플리케이션 부하에 따라 새로운 파드를 자동으로 생성하고, 
부하가 줄어들면 파드를 제거한다.

노드 오토스케일링과 수평 워크로드 오토스케일링을 함께 사용하면, 파드의 평균 실제 리소스 
사용률을 기반으로 클러스터 내 노드를 자동으로 스케일링할 수 있다.

애플리케이션 부하가 증가하면, 파드의 평균 사용률도 증가할 것이고, 
워크로드 오토스케일링이 새로운 파드를 생성하도록 한다. 이어서 노드 오토스케일링이 
새로운 파드를 수용하기 위해 새로운 노드를 프로비저닝하게 된다.

애플리케이션 부하가 줄어들면, 워크로드 오토스케일링이 불필요한 파드를 제거하게 된다. 
그에 따라, 노드 오토스케일링이 더 이상 필요하지 않은 노드를 통합하게 된다.

올바르게 구성된 경우, 이 패턴은 애플리케이션이 필요한 시점에 부하 급증을 처리할 수 있는 노드 용량을 
항상 확보하게 하면서, 필요하지 않을 때는 그 용량에 대한 비용을 지불하지 않아도 되도록 보장한다.

### 수직 워크로드 오토스케일링 {#vertical-workload-autoscaling}

노드 오토스케일링을 사용할 때는 파드의 리소스 요청을 정확하게 설정하는 것이 중요하다. 특정 파드의 요청이 
너무 낮으면, 새로운 노드를 프로비저닝하더라도 해당 파드가 실제로 실행되는 데 도움이 되지 않을 수 있다. 
반대로 요청이 너무 높으면, 해당 노드의 통합을 정확하지 않게 방해할 수 있다.

[수직 워크로드 오토스케일링](/docs/concepts/workloads/autoscaling#scaling-workloads-vertically)은 
파드의 과거 리소스 사용량에 따라 파드의 리소스 요청을 자동으로 조정한다.

노드 오토스케일링과 수직 워크로드 오토스케일링을 함께 사용하면, 클러스터의 노드 
오토스케일링 기능을 유지하면서 파드의 리소스 요청을 조정할 수 있다.

{{< caution >}}
노드 오토스케일링을 사용할 때는 DaemonSet 파드에 대해 수직 워크로드 오토스케일링을 
설정하는 것은 권장되지 않는다. 오토스케일러는 새로운 노드에서 DaemonSet 파드가 어떤 모습일지를 예측해야 
노드의 사용 가능한 리소스를 예측할 수 있다. 수직 워크로드 오토스케일링은 이러한 예측을 
신뢰할 수 없게 만들고, 잘못된 스케일링 결정을 초래할 수 있다.
{{</ caution >}}

## 관련 컴포넌트

이 섹션에서는 노드 오토스케일링과 관련된 기능을 제공하는 컴포넌트를 설명한다.

### Descheduler

[descheduler](https://github.com/kubernetes-sigs/descheduler)는 
사용자 정의 정책에 기반한 노드 통합 기능을 제공하며, 그 외에도 
노드와 파드를 최적화하기 위한 다양한 기능(예: 자주 재시작되는 파드 삭제)을 제공한다.

### 클러스터 크기에 기반한 워크로드 오토스케일러

[클러스터 비례 오토스케일러](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler)와 
[클러스터 비례 수직 오토스케일러](https://github.com/kubernetes-sigs/cluster-proportional-vertical-autoscaler)는 
클러스터 내 노드 수에 기반하여 수평 및 수직 워크로드 오토스케일링을 제공한다. 
자세한 내용은 
[클러스터 크기에 기반한 오토스케일링](/docs/concepts/workloads/autoscaling#autoscaling-based-on-cluster-size)
을 참고하자.

## {{% heading "whatsnext" %}}

- [워크로드 수준 오토스케일링](/docs/concepts/workloads/autoscaling/)에 대해 읽어보기
