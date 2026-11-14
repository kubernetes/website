---
title: "스태틱(static) 파드"
content_type: concept
weight: 150
---

_스태틱 파드_ 는
{{< glossary_tooltip text="API 서버" term_id="kube-apiserver" >}}의 관찰 없이
특정 노드의 kubelet 데몬이 직접 관리한다.
컨트롤 플레인이 관리하는 파드(예를 들어,
{{< glossary_tooltip text="디플로이먼트" term_id="deployment" >}})와 달리,
kubelet은 각 스태틱 파드를 감시하며, 실패하면 재시작한다.

스태틱 파드는 항상 특정 노드에 있는 하나의 {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}에 바인딩된다.

스태틱 파드의 주요 용도는 자체 호스팅(self-hosted) 컨트롤 플레인을 실행하는 것이다. 즉,
kubelet을 사용하여 개별
[컨트롤 플레인 컴포넌트](/docs/concepts/overview/components/#컨트롤-플레인-컴포넌트)를 감독한다.
예를 들어, [kubeadm](/docs/reference/setup-tools/kubeadm/)은 스태틱 파드를 사용하여 컨트롤 플레인 노드에서
`kube-apiserver`, `kube-controller-manager`, `kube-scheduler`, `etcd`를 실행한다.

{{< note >}}
클러스터가 컨트롤 플레인 컴포넌트를 파드로 실행하고 있다면, 해당 파드는
스태틱 파드일 가능성이 높다. `kube-system` 네임스페이스에서
`kubernetes.io/config.mirror` 어노테이션을 통해 해당 미러 파드를 식별할 수 있다.
{{< /note >}}

## 미러 파드 {#mirror-pods}

kubelet은 각 스태틱 파드에 대해 쿠버네티스 API 서버에
{{< glossary_tooltip text="미러 파드" term_id="mirror-pod" >}}를
자동으로 생성하려고 시도한다.
이는 노드에서 실행 중인 파드가 API 서버에서 보이기는 하지만,
제어될 수는 없음을 의미한다.
파드 이름에는 하이픈으로 시작하는 노드 호스트명이 접미사로 추가된다.

kubelet은 스태틱 파드의 {{< glossary_tooltip text="레이블" term_id="label" >}}을
미러 파드로 전파한다.
{{< glossary_tooltip text="셀렉터" term_id="selector" >}}를 통해 이 레이블을 평소처럼 사용할 수 있다.

`kubectl` 을 사용하여 API 서버에서 미러 파드를 삭제하려고 해도,
kubelet은 스태틱 파드를 제거하지 _않는다_. kubelet은
미러 파드를 다시 생성한다.

## 제한 사항 {#limitations}

스태틱 파드의 명세는
{{< glossary_tooltip text="서비스어카운트" term_id="service-account" >}},
{{< glossary_tooltip text="컨피그맵" term_id="configmap" >}} 또는
{{< glossary_tooltip text="시크릿" term_id="secret" >}}과 같은 다른 API 오브젝트를 참조할 수 없다.

스태틱 파드는 [임시(ephemeral) 컨테이너](/docs/concepts/workloads/pods/ephemeral-containers/)를 지원하지 않는다.

## 스태틱 파드 vs 데몬셋 {#static-pods-vs-daemonsets}

<!-- Source: tasks/configure-pod-container/static-pod/ -->
클러스터로 구성된 쿠버네티스를 운영하면서 모든 노드에 파드를 실행하기 위해
스태틱 파드를 사용하고 있다면, 그 대신
{{< glossary_tooltip text="데몬셋" term_id="daemonset" >}}을 사용하는 것이 좋다.

스태틱 파드는 컨트롤 플레인이 관리하지 않으므로, 표준 쿠버네티스 메커니즘을 사용하여
롤아웃, 롤백 또는 스케일링될 수 없다. 데몬셋은 이러한 기능을 제공하며,
노드 수준 워크로드를 실행하는 데 권장되는 방식이다.

스태틱 파드는 API 서버가 사용 가능해지기 전에 kubelet에 의해 실행되므로,
컨트롤 플레인 컴포넌트를 부트스트랩하는 데 적합하다. 데몬셋은
컨트롤 플레인이 실행 중이어야 한다.

## {{% heading "whatsnext" %}}

- [스태틱 파드 생성](/docs/tasks/configure-pod-container/static-pod/) 방법에 대해 알아본다.
- [쿠버네티스 컴포넌트](/docs/concepts/overview/components/)와 컨트롤 플레인이 스태틱 파드를 사용하는 방법에 대해 알아본다.
- 스태틱 파드의 대안으로서 [데몬셋](/docs/concepts/workloads/controllers/daemonset/)에 대해 알아본다.
