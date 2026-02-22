---
## reviewers:
## - derekwaynecarr
title: 프로세스 ID 제한 및 예약
content_type: concept
weight: 40
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

쿠버네티스에서 {{< glossary_tooltip term_id="Pod" text="파드" >}}가 사용할 수 있는 프로세스 ID(PID)의 수를 
제한할 수 있다.
또한 (파드가 아닌) 운영체제와 데몬이 사용할 용도로 각 {{< glossary_tooltip term_id="node" text="노드" >}}에 대해 할당 가능한 
PID의 수를 미리 예약할 수 있다.

<!-- body -->

프로세스 ID(PID)는 노드에서 기본이 되는 리소스이다. 다른 종류의 리소스 상한(limit)을 초과하지 않고도, 
태스크의 상한을 초과하게 되는 상황은 일상적이며 사소해 보일 수 있다. 그러나, 이러한 상황은 호스트 머신의 
불안정성을 야기할 수 있다.

클러스터 관리자는 클러스터에서 실행 중인 파드가 
호스트 데몬(예를 들어, {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} 또는 
{{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} 그리고 
잠재적 컨테이너 런타임)이 실행되는 것을 방해하는 PID 소진이 
발생하지 않도록 하는 메커니즘이 필요하다.
추가적으로, PID가 동일한 노드의 다른 워크로드에 미치는 영향을 제한하려면 
파드 간에 PID를 제한하는 것이 중요하다.

{{< note >}}
특정 리눅스 설치에서는, 운영 체제가 PID 제한을 '32768'과 같은 
낮은 기본값으로 설정한다. `/proc/sys/kernel/pid_max`의 값을 높이는 것을 고려하길 바란다.
{{< /note >}}

지정된 파드가 사용할 수 있는 PID 수를 제한하도록 kubelet을 구성할 수 있다.
예를 들어, 노드의 호스트 OS가 최대 '262144' PID를 사용하도록 설정되어 있고 
'250' 미만의 파드를 호스팅할 것으로 예상되는 경우, 각 파드에 '1000' PID의 양을 할당하여 
해당 노드의 가용 PID의 수를 전부 소비해버리지 않도록 방지할 수 있다. 관리자는
몇 가지 추가 위험을 감수하여 CPU 또는 메모리와 유사한 PID를 오버 커밋할 수 있다.
어느 쪽이든 간에, 하나의 파드가 전체 시스템을 중단시키지는 않을 것이다.
이러한 종류의 리소스 제한은 단순 포크 폭탄(fork bomb)이 전체 클러스터의 작동에 영향을 
미치는 것을 방지하는 데 도움이 된다.

관리자는 파드별 PID 제한을 통해 각 파드를 서로에게서 보호할 수 있지만,
해당 호스트에 배정된 모든 파드가 노드 전체에 영향을 미치지 못함을 보장하진 않는다.
또한 파드별 제한은 노드 에이전트 자체를 PID 고갈로부터 보호하지 않는다.

또한 파드에 대한 할당과는 별도로, 노드 오버헤드를 위해 일정량의 PID를 
예약할 수 있다. 이는 파드와 해당 컨테이너 외부의 운영 체제 및 기타 장비에서 
사용하기 위해 CPU, 메모리 또는 기타 리소스를 예약하는 방식과 
유사하다.

PID 제한은 [컴퓨팅 리소스](/ko/docs/concepts/configuration/manage-resources-containers/)
요청 및 제한에서 중요한 개념이다.
하지만 다른 방식으로 명시한다. 파드의 '.spec'에
파드 리소스 제한을 정의하는 대신, kubelet 설정에서 
제한을 구성한다. 파드에서 정의하는 PID 제한은 현재 지원되지 않는다.

{{< caution >}}
파드가 배포된 위치에 따라 파드에 적용되는 제한이 
다를 수 있다. 간단히 하자면, 모든 노드에서 동일한 PID 리소스 제한 및 예약을 
사용하는 것이 가장 쉽다.
{{< /caution >}}

## 노드 PID 제한

쿠버네티스를 사용하면 시스템 사용을 위해 여러 프로세스 ID를 예약할 수 있다.
예약을 구성하려면 `--system-reserved` 및 `--kube-reserved` 명령줄 옵션에서 
`pid=<number>` 매개변수를 kubelet에 사용하면 된다.
지정한 값은 지정된 수의 프로세스 ID가 
시스템 전체와 Kubernetes 시스템 데몬에 각각 예약됨을 
선언한다.

{{< note >}}
쿠버네티스 1.20 버전 이전에서 노드 단위로 
PID 리소스 제한을 예약하려면 'SupportNodePidsLimit' 
[기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)가 작동하도록 
설정해야 한다.
{{< /note >}}

## 파드 PID 제한

쿠버네티스를 사용하면 파드에서 실행되는 프로세스 수를 제한할 수 있다.
이 제한을 특정 파드에 대한 리소스 제한으로 구성하는 대신 노드 수준에서 지정한다.
각각의 노드는 다른 PID 제한을 가질 수 있다.
제한을 구성하려면 kubelet에 커맨드라인 매개변수 `--pod-max-pids`를 
지정하거나, kubelet [구성 파일](/docs/tasks/administer-cluster/kubelet-config-file/)에서 
`PodPidsLimit`을 설정하면 된다.

{{< note >}}
쿠버네티스 1.20 버전 이전에서 파드에 대한 PID 리소스를 제한하려면
[기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/) 'SupportPodPidsLimit'이 
작동하도록 설정해야 한다.
{{< /note >}}

## PID 기반 축출(eviction)

파드가 오작동하고 비정상적인 양의 리소스를 사용할 때 파드를 종료하게끔 kubelet을 구성할 수 있다.
이 기능을 축출(eviction)이라고 한다. 다양한 
축출 신호에 대한 [리소스 부족 처리를 구성](/ko/docs/concepts/scheduling-eviction/node-pressure-eviction/)할 
수 있다.
`pid.available` 축출 신호를 사용하여 파드에서 사용하는 PID 수에 대한 임계값을 구성한다.
소프트(soft) 및 하드(hard) 축출 정책을 설정할 수 있다.
그러나 하드 축출 정책을 사용하더라도 PID 수가 매우 빠르게 증가하면, 
노드 PID 제한에 도달하여 노드가 여전히 불안정한 상태가 될 수 있다.
축출 신호 값은 주기적으로 계산되는 것이며 제한을 강제하지는 않는다.

PID 제한 - 각 파드와 각 노드는 하드 제한을 설정한다.
제한에 도달하게 되면, 새로운 PID를 가져오려고 할 때 워크로드에 오류가 발생할 것이다.
워크로드가 이러한 장애에 대응하는 방식과 파드에 대한 활성 및 준비성 프로브가 
어떻게 구성되었는지에 따라,
파드가 재배포(rescheduling)될 수도 있고 그렇지 않을 수도 있다. 그러나 제한이 올바르게 설정되었다면,
하나의 파드가 오작동할 때 다른 파드 워크로드 및 시스템 프로세스에 PID가 부족하지 않도록 
보장할 수 있다.

## {{% heading "whatsnext" %}}

- 자세한 내용은 [PID 제한 개선 문서](https://github.com/kubernetes/enhancements/blob/097b4d8276bc9564e56adf72505d43ce9bc5e9e8/keps/sig-node/20190129-pid-limiting.md)를 참고한다.
- 역사적인 맥락을 원한다면,
  [Kubernetes 1.14의 안정성 향상을 위한 프로세스 ID 제한](/blog/2019/04/15/process-id-limiting-for-stability-improvements-in-kubernetes-1.14/)을 참고한다.
- [컨테이너에 대한 리소스 관리](/ko/docs/concepts/configuration/manage-resources-containers/)를 읽는다.
- [리소스 부족 처리 구성](/ko/docs/concepts/scheduling-eviction/node-pressure-eviction/)을 배운다.
