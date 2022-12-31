---
title: 파드 라이프사이클
content_type: concept
weight: 30
---

<!-- overview -->

이 페이지에서는 파드의 라이프사이클을 설명한다. 파드는 정의된 라이프사이클을 따른다.
`Pending` [단계](#파드의-단계)에서 시작해서, 기본 컨테이너 중 적어도 하나
이상이 OK로 시작하면 `Running` 단계를 통과하고, 그런 다음 파드의 컨테이너가
실패로 종료되었는지 여부에 따라 `Succeeded` 또는 `Failed` 단계로 이동한다.

파드가 실행되는 동안, kubelet은 일종의 오류를 처리하기 위해 컨테이너를 다시
시작할 수 있다. 파드 내에서, 쿠버네티스는 다양한 컨테이너
[상태](#컨테이너-상태)를 추적하고 파드를 다시 정상 상태로 만들기 위해 취할 조치를
결정한다.

쿠버네티스 API에서 파드는 명세와 실제 상태를 모두 가진다.
파드 오브젝트의 상태는 일련의 [파드 컨디션](#파드의-컨디션)으로 구성된다.
사용자의 애플리케이션에 유용한 경우, 파드의 컨디션 데이터에
[사용자 정의 준비성 정보](#pod-readiness-gate)를 삽입할 수도 있다.

파드는 파드의 수명 중 한 번만 [스케줄](/ko/docs/concepts/scheduling-eviction/)된다.
파드가 노드에 스케줄(할당)되면, 파드는 중지되거나 [종료](#pod-termination)될 때까지
해당 노드에서 실행된다.

<!-- body -->

## 파드의 수명

개별 애플리케이션 컨테이너와 마찬가지로, 파드는 비교적
임시(계속 이어지는 것이 아닌) 엔티티로 간주된다. 파드가 생성되고, 고유
ID([UID](/ko/docs/concepts/overview/working-with-objects/names/#uids))가
할당되고, 종료(재시작 정책에 따라) 또는 삭제될 때까지 남아있는 노드에
스케줄된다.
만약 {{< glossary_tooltip term_id="node" text="노드" >}}가 종료되면, 해당 노드에 스케줄된 파드는
타임아웃 기간 후에 [삭제되도록 스케줄된다](#pod-garbage-collection).

파드는 자체적으로 자가 치유되지 않는다. 파드가
{{< glossary_tooltip text="노드" term_id="node" >}}에 스케줄된 후에 해당 노드가 실패하면, 파드는 삭제된다. 마찬가지로, 파드는
리소스 부족 또는 노드 유지 관리 작업으로 인한 축출에서 살아남지 못한다. 쿠버네티스는
{{< glossary_tooltip term_id="controller" text="컨트롤러" >}}라
부르는 하이-레벨 추상화를 사용하여
상대적으로 일회용인 파드 인스턴스를 관리하는 작업을 처리한다.

UID로 정의된 특정 파드는 다른 노드로 절대 "다시 스케줄"되지 않는다. 대신,
해당 파드는 사용자가 원한다면 이름은 같지만, UID가 다른, 거의 동일한 새 파드로
대체될 수 있다.

{{< glossary_tooltip term_id="volume" text="볼륨" >}}과
같은 어떤 것이 파드와 동일한 수명을 갖는다는 것은,
특정 파드(정확한 UID 포함)가 존재하는 한 그것이 존재함을
의미한다. 어떤 이유로든 해당 파드가 삭제되고, 동일한 대체 파드가
생성되더라도, 관련된 그것(이 예에서는 볼륨)도 폐기되고
새로 생성된다.

{{< figure src="/images/docs/pod.svg" title="Pod diagram" class="diagram-medium" >}}

*컨테이너 간의 공유 스토리지에 퍼시스턴트 볼륨을 사용하는 웹 서버와
파일 풀러(puller)가 포함된 다중 컨테이너 파드이다.*

## 파드의 단계

파드의 `status` 필드는
`phase` 필드를 포함하는
[PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core) 오브젝트로 정의된다.

파드의 phase는 파드가 라이프사이클 중 어느 단계에 해당하는지 표현하는 간단한
고수준의 요약이다. Phase는 컨테이너나 파드의 관측 정보에 대한 포괄적인
롤업이나, 포괄적인 상태 머신을 표현하도록 의도되지는 않았다.

파드 phase 값에서 숫자와 의미는 엄격하게 지켜진다.
여기에 문서화된 내용 이외에는, 파드와 파드에 주어진 `phase` 값에 대해서
어떤 사항도 가정되어서는 안 된다.

`phase`에 가능한 값은 다음과 같다.

값          | 의미
:-----------|:-----------
`Pending`   | 파드가 쿠버네티스 클러스터에서 승인되었지만, 하나 이상의 컨테이너가 설정되지 않았고 실행할 준비가 되지 않았다. 여기에는 파드가 스케줄되기 이전까지의 시간 뿐만 아니라 네트워크를 통한 컨테이너 이미지 다운로드 시간도 포함된다.
`Running`   | 파드가 노드에 바인딩되었고, 모든 컨테이너가 생성되었다. 적어도 하나의 컨테이너가 아직 실행 중이거나, 시작 또는 재시작 중에 있다.
`Succeeded` | 파드에 있는 모든 컨테이너들이 성공적으로 종료되었고, 재시작되지 않을 것이다.
`Failed`    | 파드에 있는 모든 컨테이너가 종료되었고, 적어도 하나 이상의 컨테이너가 실패로 종료되었다. 즉, 해당 컨테이너는 non-zero 상태로 빠져나왔거나(exited) 시스템에 의해서 종료(terminated)되었다.
`Unknown`   | 어떤 이유에 의해서 파드의 상태를 얻을 수 없다. 이 단계는 일반적으로 파드가 실행되어야 하는 노드와의 통신 오류로 인해 발생한다.

{{< note >}}
파드가 삭제될 때, 일부 kubectl 커맨드에서 `Terminating` 이 표시된다.
이 `Terminating` 상태는 파드의 단계에 해당하지 않는다.
파드에는 그레이스풀하게(gracefully) 종료되도록 기간이 부여되며, 그 기본값은 30초이다.
[강제로 파드를 종료](/ko/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination-forced)하려면 `--force` 플래그를 설정하면 된다.
{{< /note >}}

노드가 죽거나 클러스터의 나머지와의 연결이 끊어지면, 쿠버네티스는
손실된 노드의 모든 파드의 `phase` 를 Failed로 설정하는 정책을 적용한다.

## 컨테이너 상태

전체 파드의 [단계](#파드의-단계)뿐 아니라, 쿠버네티스는 파드 내부의
각 컨테이너 상태를 추적한다.
[컨테이너 라이프사이클 훅(hook)](/ko/docs/concepts/containers/container-lifecycle-hooks/)을
사용하여 컨테이너 라이프사이클의 특정 지점에서 실행할 이벤트를 트리거할 수 있다.

일단 {{< glossary_tooltip text="스케줄러" term_id="kube-scheduler" >}}가
노드에 파드를 할당하면, kubelet은 {{< glossary_tooltip text="컨테이너 런타임" term_id="container-runtime" >}}을
사용하여 해당 파드에 대한 컨테이너 생성을 시작한다.
표시될 수 있는 세 가지 컨테이너 상태는 `Waiting`, `Running` 그리고 `Terminated` 이다.

파드의 컨테이너 상태를 확인하려면, `kubectl describe pod <name-of-pod>` 를
사용할 수 있다. 출력 결과는 해당 파드 내의 각 컨테이너 상태가
표시된다.

각 상태에는 특정한 의미가 있다.

### `Waiting` {#container-state-waiting}

만약 컨테이너가 `Running` 또는 `Terminated` 상태가 아니면, `Waiting` 상태이다.
`Waiting` 상태의 컨테이너는 시작을 완료하는 데 필요한
작업(예를 들어, 컨테이너 이미지 레지스트리에서 컨테이너 이미지 가져오거나,
{{< glossary_tooltip text="시크릿(Secret)" term_id="secret" >}} 데이터를 적용하는 작업)을
계속 실행하고 있는 중이다.
`kubectl` 을 사용하여 컨테이너가 `Waiting` 인 파드를 쿼리하면, 컨테이너가
해당 상태에 있는 이유를 요약하는 Reason 필드도 표시된다.

### `Running` {#container-state-running}

`Running` 상태는 컨테이너가 문제없이 실행되고 있음을 나타낸다. `postStart` 훅이
구성되어 있었다면, 이미 실행되고 완료되었다. `kubectl` 을
사용하여 컨테이너가 `Running` 인 파드를 쿼리하면, 컨테이너가 `Running` 상태에 진입한 시기에 대한
정보도 볼 수 있다.

### `Terminated` {#container-state-terminated}

`Terminated` 상태의 컨테이너는 실행을 시작한 다음 완료될 때까지
실행되었거나 어떤 이유로 실패했다. `kubectl` 을 사용하여 컨테이너가 `Terminated` 인 파드를
쿼리하면, 이유와 종료 코드 그리고 해당 컨테이너의 실행 기간에 대한 시작과
종료 시간이 표시된다.

컨테이너에 구성된 `preStop` 훅이 있는 경우, 
이 혹은 컨테이너가 `Terminated` 상태에 들어가기 전에 실행된다.

## 컨테이너 재시작 정책 {#restart-policy}

파드의 `spec` 에는 `restartPolicy` 필드가 있다. 사용 가능한 값은 Always, OnFailure 그리고
Never이다. 기본값은 Always이다.

`restartPolicy` 는 파드의 모든 컨테이너에 적용된다. `restartPolicy` 는
동일한 노드에서 kubelet에 의한 컨테이너 재시작만을 의미한다. 파드의 컨테이너가
종료된 후, kubelet은 5분으로 제한되는 지수 백오프 지연(10초, 20초, 40초, …)으로
컨테이너를 재시작한다. 컨테이너가 10분 동안 아무런 문제없이 실행되면,
kubelet은 해당 컨테이너의 재시작 백오프 타이머를 재설정한다.

## 파드의 컨디션

파드는 하나의 PodStatus를 가지며,
그것은 파드가 통과했거나 통과하지 못한 
[PodConditions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podcondition-v1-core) 배열을 가진다. kubelet은 다음 
PodConditions를 관리한다.

* `PodScheduled`: 파드가 노드에 스케줄되었다.
* `PodHasNetwork`: (알파 기능; 반드시 [명시적으로 활성화](#pod-has-network)해야 함)
샌드박스가 성공적으로 생성되고 네트워킹이 구성되었다.
* `ContainersReady`: 파드의 모든 컨테이너가 준비되었다.
* `Initialized`: 모든 [초기화 컨테이너](/ko/docs/concepts/workloads/pods/init-containers/)가
  성공적으로 완료(completed)되었다.
* `Ready`: 파드는 요청을 처리할 수 있으며 일치하는 모든 서비스의 로드
  밸런싱 풀에 추가되어야 한다.

필드 이름              | 설명
:--------------------|:-----------
`type`               | 이 파드 컨디션의 이름이다.
`status`             | 가능한 값이 "`True`", "`False`", 또는 "`Unknown`"으로, 해당 컨디션이 적용 가능한지 여부를 나타낸다.
`lastProbeTime`      | 파드 컨디션이 마지막으로 프로브된 시간의 타임스탬프이다.
`lastTransitionTime` | 파드가 한 상태에서 다른 상태로 전환된 마지막 시간에 대한 타임스탬프이다.
`reason`             | 컨디션의 마지막 전환에 대한 이유를 나타내는 기계가 판독 가능한 UpperCamelCase 텍스트이다.
`message`            | 마지막 상태 전환에 대한 세부 정보를 나타내는 사람이 읽을 수 있는 메시지이다.


## 파드의 준비성(readiness) {#pod-readiness-gate}

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

애플리케이션은 추가 피드백 또는 신호를 PodStatus: _Pod readiness_
와 같이 주입할 수 있다. 이를 사용하기 위해, kubelet이 파드의 준비성을 평가하기
위한 추가적인 컨디션들을 파드의 `spec` 내 `readinessGate` 필드를 통해서 지정할 수 있다.

준비성 게이트는 파드에 대한 `status.condition` 필드의 현재
상태에 따라 결정된다. 만약 쿠버네티스가 `status.conditions` 필드에서 해당하는
컨디션을 찾지 못한다면, 그 컨디션의 상태는
기본 값인 "`False`"가 된다.

여기 예제가 있다.

```yaml
kind: Pod
...
spec:
  readinessGates:
    - conditionType: "www.example.com/feature-1"
status:
  conditions:
    - type: Ready                              # 내장된 PodCondition이다
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
    - type: "www.example.com/feature-1"        # 추가적인 PodCondition
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
  containerStatuses:
    - containerID: docker://abcd...
      ready: true
...
```

추가하는 파드 상태에는 쿠버네티스 [레이블 키 포맷](/ko/docs/concepts/overview/working-with-objects/labels/#구문과-캐릭터-셋)을 충족하는 이름이 있어야 한다.


### 파드 준비성 상태 {#pod-readiness-status}

`kubectl patch` 명령어는 아직 오브젝트 상태 패치(patching)를 지원하지 않는다.
이러한 `status.conditions` 을 파드에 설정하려면 애플리케이션과
{{< glossary_tooltip term_id="operator-pattern" text="오퍼레이터">}}의
`PATCH` 액션을 필요로 한다.
[쿠버네티스 클라이언트 라이브러리](/ko/docs/reference/using-api/client-libraries/)를
사용해서 파드 준비성에 대한 사용자 지정 파드 컨디션을 설정하는 코드를 작성할 수 있다.

사용자 지정 컨디션을 사용하는 파드의 경우, 다음 두 컨디션이 모두 적용되는
경우에 **만** 해당 파드가 준비된 것으로 평가된다.

* 파드 내의 모든 컨테이너들이 준비 상태이다.
* `readinessGates`에 지정된 모든 컨디션들이 `True` 이다.

파드의 컨테이너가 Ready 이나 적어도 한 개의 사용자 지정 컨디션이 빠졌거나 `False` 이면,
kubelet은 파드의 [컨디션](#파드의-컨디션)을 `ContainerReady` 로 설정한다.

### 파드 네트워크 준비성(readiness) {#pod-has-network}

{{< feature-state for_k8s_version="v1.25" state="alpha" >}}

파드가 노드에 스케줄링되면, kubelet이 이 파드를 승인해야 하고
모든 볼륨이 마운트되어야 한다. 이러한 단계가 완료되면 kubelet은 
({{< glossary_tooltip term_id="cri" >}}를 사용하여) 컨테이너 런타임과 
통신하여 런타임 샌드박스를 설정하고 파드에 대한 네트워킹을 구성한다. 만약
`PodHasNetworkCondition` [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)가 활성화되면,
Kubelet은 파드의 `status.conditions` 필드에 있는 `PodHasNetwork` 컨디션을 통해 
파드가 초기화 마일스톤에 도달했는지 여부를 보고한다.

Kubelet이 파드에 네트워킹이 구성된 런타임 샌드박스가 
없음을 탐지했을 때 `PodHasNetwork` 컨디션은 `False`로 설정된다. 이것은 다음
시나리오에서 발생한다.
* 파드 라이프사이클 초기에, kubelet이 컨테이너 런타임을 사용하여 파드를 위한 샌드박스 생성을 아직 ​​시작하지 않은 때.
* 파드 라이프사이클 후기에, 파드 샌드박스가 다음중 하나의 이유로 
파괴되었을 때.
  * 파드 축출 없이, 노드가 재부팅됨
  * 격리를 위해 가상 머신을 사용하는 컨테이너 런타임을 사용하는 경우, 
    파드 샌드박스 가상 머신이 재부팅됨(이후, 새로운 샌드박스 및 새로운 컨테이너 네트워크 구성 생성이 필요함)

런타임 플러그인이 파드를 위한 샌드박스 생성 및 네트워크 구성을 성공적으로 완료하면 
kubelet이 `PodHasNetwork` 컨디션을 `True`로 설정한다. 
`PodHasNetwork` 컨디션이 `True`로 설정되면
kubelet이 컨테이너 이미지를 풀링하고 컨테이너를 생성할 수 있다.

초기화 컨테이너가 있는 파드의 경우, kubelet은 초기화 컨테이너가
성공적으로 완료(런타임 플러그인에 의한 성공적인 샌드박스 생성 및 네트워크 구성이 완료되었음을 의미)된 후
`Initialized` 컨디션을 `True`로 설정한다.
초기화 컨테이너가 없는 파드의 경우, kubelet은 샌드박스 생성 및 네트워크 구성이
시작되기 전에 `Initialized` 컨디션을 `True`로 설정한다.


## 컨테이너 프로브(probe)

_프로브_ 는
컨테이너에서 [kubelet](/docs/reference/command-line-tools-reference/kubelet/)에 의해
주기적으로 수행되는 진단(diagnostic)이다.
진단을 수행하기 위해서,
kubelet은 컨테이너 안에서 코드를 실행하거나, 
또는 네트워크 요청을 전송한다.

### 체크 메커니즘 {#probe-check-methods}

프로브를 사용하여 컨테이너를 체크하는 방법에는 4가지가 있다.
각 프로브는 다음의 4가지 메커니즘 중 단 하나만을 정의해야 한다.

`exec`
: 컨테이너 내에서 지정된 명령어를 실행한다.
  명령어가 상태 코드 0으로 종료되면 진단이 성공한 것으로 간주한다.

`grpc`
: [gRPC](https://grpc.io/)를 사용하여 
  원격 프로시저 호출을 수행한다. 
  체크 대상이 [gRPC 헬스 체크](https://grpc.io/grpc/core/md_doc_health-checking.html)를 구현해야 한다. 
  응답의 `status` 가 `SERVING` 이면 
  진단이 성공했다고 간주한다. 
  gRPC 프로브는 알파 기능이며 
  `GRPCContainerProbe` [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)를 
  활성화해야 사용할 수 있다.

`httpGet`
: 지정한 포트 및 경로에서 컨테이너의 IP주소에 대한
  HTTP `GET` 요청을 수행한다. 
  응답의 상태 코드가 200 이상 400 미만이면
  진단이 성공한 것으로 간주한다.

`tcpSocket`
: 지정된 포트에서 컨테이너의 IP주소에 대해 TCP 검사를 수행한다.
  포트가 활성화되어 있다면 진단이 성공한 것으로 간주한다. 
  원격 시스템(컨테이너)가 연결을 연 이후 즉시 닫는다면, 
  이 또한 진단이 성공한 것으로 간주한다.

### 프로브 결과

각 probe는 다음 세 가지 결과 중 하나를 가진다.

`Success`
: 컨테이너가 진단을 통과함.

`Failure`
: 컨테이너가 진단에 실패함.

`Unknown`
: 진단 자체가 실패함(아무런 조치를 수행해서는 안 되며, kubelet이 
  추가 체크를 수행할 것이다)

### 프로브 종류

kubelet은 실행 중인 컨테이너들에 대해서 선택적으로 세 가지 종류의 프로브를 수행하고
그에 반응할 수 있다.

`livenessProbe`
: 컨테이너가 동작 중인지 여부를 나타낸다. 만약
  활성 프로브(liveness probe)에 실패한다면, kubelet은 컨테이너를 죽이고, 해당 컨테이너는
  [재시작 정책](#restart-policy)의 대상이 된다. 만약 컨테이너가
  활성 프로브를 제공하지 않는 경우, 기본 상태는 `Success` 이다.

`readinessProbe`
: 컨테이너가 요청을 처리할 준비가 되었는지 여부를 나타낸다.
  만약 준비성 프로브(readiness probe)가 실패한다면, 엔드포인트 컨트롤러는
  파드에 연관된 모든 서비스들의 엔드포인트에서 파드의 IP주소를 제거한다. 준비성 프로브의
  초기 지연 이전의 기본 상태는 `Failure` 이다. 만약 컨테이너가 준비성 프로브를
  지원하지 않는다면, 기본 상태는 `Success` 이다.

`startupProbe`
: 컨테이너 내의 애플리케이션이 시작되었는지를 나타낸다.
  스타트업 프로브(startup probe)가 주어진 경우, 성공할 때까지 다른 나머지 프로브는
  활성화되지 않는다. 만약 스타트업 프로브가 실패하면, kubelet이 컨테이너를 죽이고,
  컨테이너는 [재시작 정책](#restart-policy)에 따라 처리된다. 컨테이너에 스타트업
  프로브가 없는 경우, 기본 상태는 `Success` 이다.

활성, 준비성 및 스타트업 프로브를 설정하는 방법에 대한 추가적인 정보는,
[활성, 준비성 및 스타트업 프로브 설정하기](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)를 참조하면 된다.

#### 언제 활성 프로브를 사용해야 하는가?

{{< feature-state for_k8s_version="v1.0" state="stable" >}}

만약 컨테이너 속 프로세스가 어떠한 이슈에 직면하거나 건강하지 못한
상태(unhealthy)가 되는 등 프로세스 자체의 문제로 중단될 수 있더라도, 활성 프로브가
반드시 필요한 것은 아니다. 그 경우에는 kubelet이 파드의 `restartPolicy`에
따라서 올바른 대처를 자동적으로 수행할 것이다.

프로브가 실패한 후 컨테이너가 종료되거나 재시작되길 원한다면, 활성 프로브를
지정하고, `restartPolicy`를 항상(Always) 또는 실패 시(OnFailure)로 지정한다.

#### 언제 준비성 프로브를 사용해야 하는가?

{{< feature-state for_k8s_version="v1.0" state="stable" >}}

프로브가 성공한 경우에만 파드에 트래픽 전송을 시작하려고 한다면,
준비성 프로브를 지정하길 바란다. 이 경우에서는, 준비성 프로브가 활성 프로브와 유사해
보일 수도 있지만, 스팩에 준비성 프로브가 존재한다는 것은 파드가
트래픽을 받지 않는 상태에서 시작되고 프로브가 성공하기 시작한 이후에만
트래픽을 받는다는 뜻이다.

만약 컨테이너가 유지 관리를 위해서 자체 중단되게 하려면,
준비성 프로브를 지정하길 바란다.
준비성 프로브는 활성 프로브와는 다르게 준비성에 특정된 엔드포인트를 확인한다.

만약 애플리케이션이 백엔드 서비스에 엄격한 의존성이 있다면,
활성 프로브와 준비성 프로브 모두 활용할 수도 있다. 활성 프로브는 애플리케이션 스스로가 건강한 상태면
통과하지만, 준비성 프로브는 추가적으로 요구되는 각 백-엔드 서비스가 가용한지 확인한다. 이를 이용하여,
오류 메시지만 응답하는 파드로
트래픽이 가는 것을 막을 수 있다.

만약 컨테이너가 시동 시 대량 데이터의 로딩, 구성 파일, 또는
마이그레이션에 대한 작업을
수행해야 한다면, [스타트업 프로브](#언제-스타트업-프로브를-사용해야-하는가)를 사용하면 된다. 그러나, 만약
failed 애플리케이션과 시동 중에 아직 데이터를 처리하고 있는 애플리케이션을 구분하여 탐지하고
싶다면, 준비성 프로브를 사용하는 것이 더 적합할 것이다.

{{< note >}}
파드가 삭제될 때 요청들을 흘려 보내기(drain) 위해
준비성 프로브가 꼭 필요한 것은 아니다. 삭제 시에, 파드는
프로브의 존재 여부와 무관하게 자동으로 스스로를 준비되지 않은 상태(unready)로 변경한다.
파드는 파드 내의 모든 컨테이너들이 중지될 때까지 준비되지 않은 상태로
남아 있다.
{{< /note >}}

#### 언제 스타트업 프로브를 사용해야 하는가?

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

스타트업 프로브는 서비스를 시작하는 데 오랜 시간이 걸리는 컨테이너가 있는
파드에 유용하다. 긴 활성 간격을 설정하는 대신, 컨테이너가 시작될 때
프로브를 위한 별도의 구성을 설정하여, 활성 간격보다
긴 시간을 허용할 수 있다.

컨테이너가 보통 `initialDelaySeconds + failureThreshold × periodSeconds`
이후에 기동된다면, 스타트업 프로브가
활성화 프로브와 같은 엔드포인트를 확인하도록 지정해야 한다.
`periodSeconds`의 기본값은 10s 이다. 이 때 컨테이너가 활성화 프로브의
기본값 변경 없이 기동되도록 하려면, `failureThreshold` 를 충분히 높게 설정해주어야
한다. 그래야 데드락(deadlocks)을 방지하는데 도움이 된다.

## 파드의 종료 {#pod-termination}

파드는 클러스터의 노드에서 실행되는 프로세스를 나타내므로, 해당 프로세스가
더 이상 필요하지 않을 때 정상적으로 종료되도록 하는 것이 중요하다(`KILL`
시그널로 갑자기 중지되고 정리할 기회가 없는 것 보다).

디자인 목표는 삭제를 요청하고 프로세스가 종료되는 시기를 알 수
있을 뿐만 아니라, 삭제가 결국 완료되도록 하는 것이다.
사용자가 파드의 삭제를 요청하면, 클러스터는 파드가 강제로 종료되기 전에
의도한 유예 기간을 기록하고 추적한다. 강제 종료 추적이
적용되면, {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}은 정상
종료를 시도한다.

일반적으로, 컨테이너 런타임은 각 컨테이너의 기본 프로세스에 TERM 신호를
전송한다. 많은 컨테이너 런타임은 컨테이너 이미지에 정의된 `STOPSIGNAL` 값을 존중하며
TERM 대신 이 값을 보낸다.
일단 유예 기간이 만료되면, KILL 시그널이 나머지 프로세스로
전송되고, 그런 다음 파드는
{{< glossary_tooltip text="API 서버" term_id="kube-apiserver" >}}로부터 삭제된다. 프로세스가
종료될 때까지 기다리는 동안 kubelet 또는 컨테이너 런타임의 관리 서비스가 다시 시작되면, 클러스터는
전체 원래 유예 기간을 포함하여 처음부터 다시 시도한다.

플로우의 예는 다음과 같다.

1. 이 `kubectl` 도구를 사용하여 기본 유예 기간(30초)으로 특정 파드를 수동으로
   삭제한다.
1. API 서버의 파드는 유예 기간과 함께 파드가 "dead"로 간주되는
   시간으로 업데이트된다.
   `kubectl describe` 를 사용하여 삭제하려는 파드를 확인하면, 해당 파드가 "Terminating"으로
   표시된다.
   파드가 실행 중인 노드에서, kubelet이 파드가 종료된 것(terminating)으로 표시되었음을
   확인하는 즉시(정상적인 종료 기간이 설정됨), kubelet은 로컬 파드의 종료
   프로세스를 시작한다.
   1. 파드의 컨테이너 중 하나가 `preStop`
      [훅](/ko/docs/concepts/containers/container-lifecycle-hooks)을 정의한 경우, kubelet은
      컨테이너 내부에서 해당 훅을 실행한다. 유예 기간이 만료된 후 `preStop` 훅이
      계속 실행되면, kubelet은 2초의 작은 일회성 유예 기간 연장을
      요청한다.
      {{< note >}}
      `preStop` 훅을 완료하는 데 기본 유예 기간이 허용하는 것보다 오랜 시간이 필요한 경우,
      이에 맞게 `terminationGracePeriodSeconds` 를 수정해야 한다.
      {{< /note >}}
   1. kubelet은 컨테이너 런타임을 트리거하여 각 컨테이너 내부의 프로세스 1에 TERM 시그널을
      보낸다.
      {{< note >}}
      파드의 컨테이너는 서로 다른 시간에 임의의 순서로 TERM 시그널을
      수신한다. 종료 순서가 중요한 경우, `preStop` 훅을 사용하여 동기화하는 것이 좋다.
      {{< /note >}}
1. kubelet이 정상 종료를 시작하는 동시에, 컨트롤 플레인은
   구성된 {{< glossary_tooltip text="셀렉터" term_id="selector" >}}가 있는
   {{< glossary_tooltip term_id="service" text="서비스" >}}를 나타내는
   엔드포인트슬라이스(EndpointSplice)(그리고 엔드포인트) 오브젝트에서 종료된 파드를 제거한다.
   {{< glossary_tooltip text="레플리카셋(ReplicaSet)" term_id="replica-set" >}}과 기타 워크로드 리소스는
   더 이상 종료된 파드를 유효한 서비스 내 복제본으로 취급하지 않는다. 로드 밸런서(서비스 프록시와 같은)가
   종료 유예 기간이 _시작되는_ 즉시 엔드포인트 목록에서 파드를 제거하므로 느리게 종료되는
   파드는 트래픽을 계속 제공할 수 없다.
1. 유예 기간이 만료되면, kubelet은 강제 종료를 트리거한다. 컨테이너 런타임은
   `SIGKILL` 을 파드의 모든 컨테이너에서 여전히 실행 중인 모든 프로세스로 전송한다.
   kubelet은 해당 컨테이너 런타임이 하나를 사용하는 경우 숨겨진 `pause` 컨테이너도 정리한다.
1. kubelet은 유예 기간을 0(즉시 삭제)으로 설정하여, API 서버에서 파드 오브젝트의
   강제 삭제를 트리거한다.
1. API 서버가 파드의 API 오브젝트를 삭제하면, 더 이상 클라이언트에서 볼 수 없다.

### 강제 파드 종료 {#pod-termination-forced}

{{< caution >}}
강제 삭제는 일부 워크로드와 해당 파드에 대해서 잠재적으로 중단될 수 있다.
{{< /caution >}}

기본적으로, 모든 삭제는 30초 이내에는 정상적으로 수행된다. `kubectl delete` 명령은
기본값을 재정의하고 사용자의 고유한 값을 지정할 수 있는 `--grace-period=<seconds>` 옵션을
지원한다.

유예 기간을 `0` 로 강제로 즉시 설정하면 API 서버에서 파드가
삭제된다. 파드가 노드에서 계속 실행 중인 경우, 강제 삭제는 kubelet을 트리거하여
즉시 정리를 시작한다.

{{< note >}}
강제 삭제를 수행하려면 `--grace-period=0` 와 함께 추가 플래그 `--force` 를 지정해야 한다.
{{< /note >}}

강제 삭제가 수행되면, API 서버는 실행 중인 노드에서
파드가 종료되었다는 kubelet의 확인을 기다리지 않는다.
API에서 즉시 파드를 제거하므로 동일한 이름으로 새로운 파드를 생성할 수
있다. 노드에서 즉시 종료되도록 설정된 파드는 강제 종료되기 전에
작은 유예 기간이 계속 제공된다.

{{< caution >}}
즉시 제거는 실행 중인 자원이 정상적으로 종료되는 것을 보장하지 않는다. 자원은 클러스터에서 영원히 회수되지 않을 수 있다.
{{< /caution >}}

스테이트풀셋(StatefulSet)의 일부인 파드를 강제 삭제해야 하는 경우,
[스테이트풀셋에서 파드를 삭제하기](/ko/docs/tasks/run-application/force-delete-stateful-set-pod/)에 대한
태스크 문서를 참고한다.

### 파드의 가비지 콜렉션 {#pod-garbage-collection}

실패한 파드의 경우, API 오브젝트는 사람이나
{{< glossary_tooltip term_id="controller" text="컨트롤러" >}} 프로세스가
명시적으로 파드를 제거할 때까지 클러스터의 API에 남아 있다.

컨트롤 플레인에서의 컨트롤러 역할인 파드 가비지 콜렉터(PodGC)는, 파드 수가 구성된 임계값(kube-controller-manager에서
`terminated-pod-gc-threshold` 에 의해 결정됨)을 초과할 때 종료된 파드(`Succeeded` 또는
`Failed` 단계 포함)를 정리한다.
이렇게 하면 시간이 지남에 따라 파드가 생성되고 종료될 때 리소스 유출이 방지된다.

추가적으로 PodGC는 다음과 같은 조건들 중 하나라도 만족하는 파드들을 정리한다.
1. 고아 파드 - 더 이상 존재하지 않는 노드에 종속되어있는 파드이거나,
2. 스케줄되지 않은 종료 중인 파드이거나,
3. `NodeOutOfServiceVolumeDetach` 기능 게이트가 활성화되어 있을 때, [`node.kubernetes.io/out-of-service`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-out-of-service)에 테인트된 준비되지 않은 노드에 속한 종료 중인 파드인 경우에 적용된다.

`PodDisruptionConditions` 기능 게이트가 활성화된 경우, PodGC는
파드를 정리하는 것 뿐만 아니라 해당 파드들이 non-terminal 단계에 있는 경우
그들을 실패했다고 표시하기도 한다.
또한, PodGC는 고아 파드를 정리할 때 파드 중단 조건을 추가하기도 한다.
(자세한 내용은 [파드 중단 조건](/ko/docs/concepts/workloads/pods/disruptions#pod-disruption-conditions)을 확인한다.)

## {{% heading "whatsnext" %}}

* [컨테이너 라이프사이클 이벤트에 핸들러를 연결](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/)하는
  핸즈온 연습을 해보자.

* [활성, 준비성 및 스타트업 프로브 설정](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)하는
  핸즈온 연습을 해보자.

* [컨테이너 라이프사이클 훅](/ko/docs/concepts/containers/container-lifecycle-hooks/)에 대해 자세히 알아보자.

* API의 파드와 컨테이너 상태에 대한 자세한 내용은 
  파드의 [`.status`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodStatus)에 대해 다루는 
  API 레퍼런스 문서를 참고한다.
