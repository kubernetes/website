---
# reviewers:
# - davidopp
# - lavalamp
title: 대규모 클러스터에 대한 고려 사항
weight: 10
---

클러스터는 {{< glossary_tooltip text="컨트롤 플레인" term_id="control-plane" >}}에 의해 관리되며
쿠버네티스 에이전트를 실행하는 {{< glossary_tooltip text="노드" term_id="node" >}}
(물리 또는 가상 머신)의 집합이다.
쿠버네티스 {{<param "version">}}는 최대 5,000개의 노드를 가진 클러스터를 지원한다. 더 구체적으로,
쿠버네티스는 다음 기준을 *모두* 충족하는 구성을 수용하도록 설계되었다.

* 노드당 파드 110개 이하
* 노드 5,000개 이하
* 총 파드 150,000개 이하
* 총 컨테이너 300,000개 이하

노드를 추가하거나 제거하여 클러스터를 스케일할 수 있다. 이를 수행하는 방법은
클러스터가 배포된 방법에 따라 다르다.

## 클라우드 프로바이더 리소스 쿼터 {#quota-issues}

여러 노드를 가진 클러스터를 생성할 때 클라우드 프로바이더 쿼터 문제에 부딪히는 것을 피하려면,
다음을 고려한다.
* 다음과 같은 클라우드 리소스에 대한 쿼터 증가를 요청
    * 컴퓨터 인스턴스
    * CPU
    * 스토리지 볼륨
    * 사용 중인 IP 주소
    * 패킷 필터링 규칙 집합
    * 로드 밸런서 개수
    * 네트워크 서브넷
    * 로그 스트림
* 일부 클라우드 프로바이더는 새 인스턴스 생성 속도를 제한하므로, 배치 사이에
  일시 중지를 두고 새 노드를 배치 단위로 가동하도록 클러스터 스케일링 작업을 제어

## 컨트롤 플레인 컴포넌트

대규모 클러스터의 경우, 충분한 컴퓨트 및 기타 리소스를 가진 컨트롤 플레인이
필요하다.

일반적으로 장애 영역당 한두 개의 컨트롤 플레인 인스턴스를 실행하고,
먼저 해당 인스턴스를 수직으로 스케일링한 다음 (수직) 스케일 효율이 떨어지는
지점에 도달한 후 수평으로 스케일링한다.

내결함성을 제공하려면 장애 영역당 최소 하나의 인스턴스를 실행해야 한다. 쿠버네티스
노드는 동일한 장애 영역에 있는 컨트롤 플레인 엔드포인트로 트래픽을
자동으로 유도하지 않는다. 그러나, 클라우드 프로바이더는 이를 수행하기 위한 자체 메커니즘을 가지고 있을 수 있다.

예를 들어 관리형 로드 밸런서를 사용해 장애 영역 _A_ 에 있는 kubelet 및 파드에서
발생하는 트래픽을 전송하고, 해당 트래픽을 역시 _A_ 영역에 있는 컨트롤 플레인 호스트로만
향하게 하도록 로드 밸런서를 구성한다. 장애 영역 _A_ 에 있는 단일 컨트롤 플레인 호스트 또는
엔드포인트가 오프라인이 되면, 이는 _A_ 영역의 노드에 대한 모든 컨트롤 플레인 트래픽이
이제 영역 간에 전송됨을 의미한다. 각 영역에서 여러 컨트롤 플레인 호스트를 실행하면
이러한 상황이 발생할 가능성을 줄일 수 있다.

### etcd 스토리지

대규모 클러스터의 성능을 향상시키기 위해, 별도의 전용 etcd 인스턴스에
이벤트(Event) 오브젝트를 저장할 수 있다.

클러스터 생성 할 때, (사용자 도구를 사용하여) 다음을 수행할 수 있다.

* 추가 etcd 인스턴스를 시작하고 구성
* 이벤트를 저장하는 데 사용하도록 {{< glossary_tooltip term_id="kube-apiserver" text="API 서버" >}}를 구성

대규모 클러스터를 위한 etcd 구성 및 관리에 대한 자세한 내용은
[쿠버네티스를 위한 etcd 클러스터 운영하기](/docs/tasks/administer-cluster/configure-upgrade-etcd/) 및
[kubeadm으로 고가용성 etcd 클러스터 설정하기](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)를 참조한다.

## 애드온 리소스

쿠버네티스 [리소스 한도](/docs/concepts/configuration/manage-resources-containers/)은
파드와 컨테이너가 다른 컴포넌트에 영향을 미칠 수 있는 메모리 누수 및 기타 방식의 영향을
최소화하는 데 도움이 된다. 이러한 리소스 한도(limit)는 애플리케이션 워크로드에 적용되는 것과 마찬가지로
{{< glossary_tooltip text="애드온" term_id="addons" >}} 리소스에도 적용된다.

예를 들어, 로깅 컴포넌트에 대한 CPU 및 메모리 한도를 설정할 수 있다.

```yaml
  ...
  containers:
  - name: fluentd-cloud-logging
    image: fluent/fluentd-kubernetes-daemonset:v1
    resources:
      limits:
        cpu: 100m
        memory: 200Mi
```

애드온의 기본 한도는 일반적으로 각 애드온을 소규모 또는 중규모 쿠버네티스 클러스터에서
운영한 경험으로부터 수집된 데이터를 기반으로 한다. 대규모 클러스터에서
실행할 때, 애드온은 종종 일부 리소스를 기본 한도보다 더 많이 소비한다.
대규모 클러스터가 이러한 값을 조정하지 않고 배포될 경우, 애드온은
메모리 한도에 계속 도달하여 지속적으로 종료될 수 있다.
또는 애드온이 실행되긴 하지만 CPU 타임 슬라이스 제한으로 인해
성능이 저하될 수 있다.

여러 노드를 가지는 클러스터를 생성할 때 클러스터 애드온 리소스 문제에 부딪히는 것을 피하려면,
다음을 고려한다.

* 일부 애드온은 수직으로 스케일한다. 즉, 클러스터 또는 장애 영역 전체를
  서비스하는 애드온 레플리카가 하나만 존재한다. 이러한 애드온의 경우, 클러스터를 스케일 아웃함에 따라
  요청(request)과 한도를 늘려야 한다.
* 많은 애드온은 수평으로 스케일한다. 즉, 더 많은 파드를 실행하여 용량을 늘린다. 하지만
  초대규모 클러스터에서는 CPU 또는 메모리 한도를 약간 높여야 할 수도 있다.
  [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme)는 _recommender_ 모드로 실행되어 요청 및 한도에 대한
  권장 수치를 제공할 수 있다.
* 일부 애드온은 {{< glossary_tooltip text="데몬셋(DaemonSet)" term_id="daemonset" >}}에 의해 제어되어,
  노드당 하나의 복사본으로 실행된다.(예: 노드 수준 로그 수집기)
  수평으로 스케일된 애드온의 경우와 유사하게, CPU 또는 메모리 한도를
  약간 높여야 할 수도 있다.

## 클러스터 필수 컴포넌트 우선순위 지정

클러스터 필수 컴포넌트(CoreDNS, metrics-server 및 기타 중요 애드온)가 다른 워크로드보다 먼저 스케줄링되고 우선순위가 낮은 파드에 의해 선점되지 않도록 하려면, `system-cluster-critical` 또는 `system-node-critical`과 같은 시스템 [프라이어리티클래스(PriorityClass)](/docs/concepts/scheduling-eviction/pod-priority-preemption/)로 이를 실행한다.

## {{% heading "whatsnext" %}}

* `VerticalPodAutoscaler`는 파드에 대한 리소스 요청 및 한도를 관리하는 데 도움을 주기 위해
클러스터에 배포할 수 있는 사용자 정의 리소스이다.
[Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme)에 대해 자세히 알아보고,
이를 사용하여 클러스터 필수 애드온을 포함한 클러스터 컴포넌트를 스케일하는 방법에 대해
알아본다.

* [노드 오토스케일링](/docs/concepts/cluster-administration/node-autoscaling/)에 대해 읽어본다.

* [애드온 리사이저](https://github.com/kubernetes/autoscaler/tree/master/addon-resizer#readme)는
클러스터 스케일이 변경됨에 따라 애드온의 크기를 자동으로 조정하는 데 도움이 된다.