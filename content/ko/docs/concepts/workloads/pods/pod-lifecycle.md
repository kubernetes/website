---
title: 파드 라이프사이클
content_type: concept
weight: 30
math: true
---

<!-- overview -->

이 페이지에서는 파드의 라이프사이클을 설명한다. 파드는 정의된 라이프사이클을 따른다.
`Pending` [단계](#파드의-단계)에서 시작해서, 기본 컨테이너 중 적어도 하나
이상이 OK로 시작하면 `Running` 단계를 통과하고, 그런 다음 파드의 컨테이너가
실패로 종료되었는지 여부에 따라 `Succeeded` 또는 `Failed` 단계로 이동한다.

개별 애플리케이션 컨테이너와 마찬가지로, 파드는 비교적 
임시(영구적이지 않은) 엔티티로 간주된다. 파드가 생성되고, 고유 
ID([UID](/docs/concepts/overview/working-with-objects/names/#uids))가 할당되며, 
할당되고, 종료(재시작 정책에 따라) 또는 삭제될 때까지 남아있는 노드에
스케줄된다.
만약 {{< glossary_tooltip term_id="node" >}}가 종료되면, 해당 노드에 실행 중이거나 (실행되도록 
예약된) 파드는 [삭제 대상으로 표시](#pod-garbage-collection)된다. 컨트롤 
플레인은 타임아웃 기간이 지난 후 파드를 제거 대상으로 표시한다.

<!-- body -->

## 파드의 수명

파드가 실행 중인 동안 kubelet은 여러 종류의 오류를 처리하기 위해 
컨테이너를 재시작할 수 있다. 파드 내에서 쿠버네티스는 다양한 컨테이너 
[상태](#container-states)를 추적하고 파드를 다시 정상 상태로 만들기 위해 
어떤 조치를 취해야 하는지 결정한다.

쿠버네티스 API에서 파드는 스펙과 실제 상태를 모두 가지고 있다. 파드 
오브젝트의 상태는 [파드 조건](#pod-conditions) 집합으로 구성된다.
또한 애플리케이션에 유용한 경우 [사용자 지정 준비 정보](#pod-readiness-gate)를 
파드의 조건 데이터에 주입할 수 있다.

파드는 생애 동안 한 번만 [스케줄링](/docs/concepts/scheduling-eviction/)된다.
파드를 특정 노드에 할당하는 것을 _바인딩_ 이라고 하고, 사용할 노드를 선택하는 과정을
_스케줄링_ 이라고 한다.
파드가 스케줄링되어 노드에 바인딩되면 쿠버네티스는 
해당 파드를 해당 노드에서 실행하려고 시도한다. 파드는 해당 노드에서 중지되거나, 파드가 
[종료](#pod-termination)될 때까지 실행된다. 쿠버네티스가 
선택된 노드에서 파드를 시작할 수 없는 경우(예: 파드가 시작되기 전에 노드가 충돌하는 경우), 해당 파드는
시작되지 않는다.

[파드 스케줄링 준비 상태](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)를 사용하면
모든 _스케줄링 게이트_ 가 제거될 때까지 파드의 스케줄링을 지연시킬 수 있다. 예를 들어,
일련의 파드를 정의하되 모든 파드가 생성된 후에만 
스케줄링을 트리거하도록 설정할 수 있다.

### 파드와 장애 복구 {#pod-fault-recovery}

파드의 컨테이너 중 하나가 실패하면, 쿠버네티스는 해당
컨테이너를 재시작하려고 시도할 수 있다.
자세한 내용은 [파드가 컨테이너 문제를 처리하는 방법](#container-restarts)을 참고한다.

그러나 파드는 클러스터가 복구할 수 없는 방식으로 실패할 수 있으며, 이 경우
쿠버네티스는 파드를 더 이상 복구하려고 시도하지 않는다. 대신, 쿠버네티스는
파드를 삭제하고 다른 컴포넌트를 통해 자동 복구를 제공한다.

파드가 {{< glossary_tooltip text="노드" term_id="node" >}}에 스케줄링되었는데 해당
노드가 실패하면, 파드는 비정상으로 처리되며 쿠버네티스는 결과적으로 해당 파드를 삭제한다.
파드는 리소스 부족이나 노드 유지보수로 인한
{{< glossary_tooltip text="축출" term_id="eviction" >}}에서 살아남지 못한다.

쿠버네티스는 상대적으로 대체 가능한 파드 인스턴스를 관리하는 작업을 처리하는,
{{< glossary_tooltip term_id="controller" text="컨트롤러" >}}라 불리는
상위 수준의 추상화를 사용한다.

특정 파드(UID로 정의된)는 다른 노드로 "다시 스케줄링"되지 않는다. 대신,
해당 파드는 새로운, 거의 동일한 파드로 대체될 수 있다. 대체 파드를 만들면,
이전 파드와 동일한 이름(`.metadata.name`)을 가질 수도 있지만,
대체 파드는 이전 파드와 다른 `.metadata.uid`를 갖게 된다.

쿠버네티스는 기존 파드의 대체 파드가 교체 대상이었던 이전 파드와
동일한 노드에 스케줄링된다는 것을 보장하지 않는다.

### 연관된 라이프사이클

어떤 것이 파드와 동일한 라이프사이클을 가진다고 말할 때, 예를 들어
{{< glossary_tooltip term_id="volume" text="볼륨" >}}의 경우,
이는 해당 항목이 특정 파드(정확한 UID를 가진)가 존재하는 한 함께 존재한다는 것을
의미한다. 어떤 이유로든 해당 파드가 삭제되면, 동일한 대체 파드가
생성되더라도 관련된 것(이 예시에서는 볼륨)도 함께 삭제되고
새로 생성된다.

{{< figure src="/images/docs/pod.svg" title="그림 1." class="diagram-medium" caption="파일 풀러 [사이드카](/docs/concepts/workloads/pods/sidecar-containers/)와 웹 서버를 포함하는 멀티 컨테이너 파드. 이 파드는 컨테이너 간 공유 스토리지를 위해 [임시 `emptyDir` 볼륨](/docs/concepts/storage/volumes/#emptydir)을 사용한다." >}}

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
`Failed`    | 파드에 있는 모든 컨테이너가 종료되었고, 적어도 하나 이상의 컨테이너가 실패로 종료되었다. 즉, 해당 컨테이너는 non-zero 상태로 빠져나왔거나(exited) 시스템에 의해서 종료(terminated)되었고, 자동 재시작이 설정되어 있지 않다.
`Unknown`   | 어떤 이유에 의해서 파드의 상태를 얻을 수 없다. 이 단계는 일반적으로 파드가 실행되어야 하는 노드와의 통신 오류로 인해 발생한다.

{{< note >}}

파드가 반복적으로 시작에 실패하면, 일부 kubectl 커맨드의 `Status` 필드에 `CrashLoopBackOff`가 표시될 수 있다.
비슷하게, 파드가 삭제되는 중일 때 일부 kubectl 커맨드의 `Status` 필드에 `Terminating`이 표시될 수 있다.

사용자 직관을 위한 kubectl 표시 필드인 _Status_ 와 파드의 `phase`를 혼동하지 않도록 한다.
파드 phase는 쿠버네티스 데이터 모델과
[파드 API](/docs/reference/kubernetes-api/workload-resources/pod-v1/)의 명시적인 부분이다.

```
  NAMESPACE               NAME               READY   STATUS             RESTARTS   AGE
  alessandras-namespace   alessandras-pod    0/1     CrashLoopBackOff   200        2d9h
```

파드에는 정상 종료를 위한 기간이 부여되며, 기본값은 30초이다.
`--force` 플래그를 사용하여 [파드를 강제로 종료](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination-forced)할 수 있다.
{{< /note >}}

쿠버네티스 1.27부터, kubelet은 삭제된 파드를
[스태틱 파드](/docs/tasks/configure-pod-container/static-pod/)와
파이널라이저가 없는 [강제 삭제된 파드](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination-forced)를
제외하고, API 서버에서 삭제되기 전에 최종 단계(파드 컨테이너의
종료 상태에 따라 `Failed` 또는 `Succeeded`)로 전환한다.

노드가 종료되거나 클러스터의 나머지 부분과 연결이 끊어지면, 쿠버네티스는
손실된 노드에 있는 모든 파드의 `phase`를 Failed로 설정하는 정책을 적용한다.

## 컨테이너 상태

전체 파드의 [단계](#파드의-단계)뿐 아니라, 쿠버네티스는 파드 내부의
각 컨테이너 상태를 추적한다.
[컨테이너 라이프사이클 훅(hook)](/docs/concepts/containers/container-lifecycle-hooks/)을
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
사용하여 컨테이너가 `Running` 인 파드를 질의하면, 컨테이너가 `Running` 상태에 진입한 시기에 대한
정보도 볼 수 있다.

### `Terminated` {#container-state-terminated}

`Terminated` 상태의 컨테이너는 실행을 시작한 다음 완료될 때까지
실행되었거나 어떤 이유로 실패했다. `kubectl` 을 사용하여 컨테이너가 `Terminated` 인 파드를
질의하면, 이유와 종료 코드 그리고 해당 컨테이너의 실행 기간에 대한 시작과
종료 시간이 표시된다.

컨테이너에 구성된 `preStop` 훅이 있는 경우, 이 훅은 컨테이너가 
`Terminated` 상태에 들어가기 전에 실행된다.

## 파드가 컨테이너 문제를 처리하는 방법 {#container-restarts}

쿠버네티스는 파드 `spec`에 정의된 [`restartPolicy`](#restart-policy)를 사용하여
파드 내의 컨테이너 실패를 관리한다. 이 정책은 오류나 다른 이유로 컨테이너가 종료될 때
쿠버네티스가 어떻게 대응하는지를 결정하며, 다음과 같은 순서를 따른다.

1. **초기 크래시**: 쿠버네티스는 파드의 `restartPolicy`에 따라 즉시 재시작을 시도한다.
1. **반복 크래시**: 초기 크래시 이후 쿠버네티스는 [`restartPolicy`](#restart-policy)에
   설명된 대로 후속 재시작에 지수 백오프 지연을 적용한다.
   이는 빠르고 반복적인 재시작 시도가 시스템에 과부하를 주는 것을 방지한다.
1. **CrashLoopBackOff 상태**: 이는 크래시 루프에 빠져 반복적으로 실패하고 재시작하는
   특정 컨테이너에 대해 백오프 지연 메커니즘이 현재 적용 중임을 나타낸다.
1. **백오프 초기화**: 컨테이너가 특정 기간(예: 10분) 동안 성공적으로 실행되면,
   쿠버네티스는 백오프 지연을 초기화하여 새로운 크래시를 
   첫 번째 크래시로 취급한다.

실제로 `CrashLoopBackOff`는 파드 내의 컨테이너가 제대로 시작되지 못하고
계속해서 시도와 실패를 반복할 때, `kubectl` 커맨드로 파드를 조회하거나
목록을 확인하면 볼 수 있는 상태 또는 이벤트이다.

즉, 컨테이너가 크래시 루프에 진입하면 쿠버네티스는
[컨테이너 재시작 정책](#restart-policy)에서 언급한 지수 백오프 지연을 적용한다.
이 메커니즘은 결함이 있는 컨테이너가 지속적인 시작 실패 시도로
시스템에 과부하를 주는 것을 방지한다.

`CrashLoopBackOff`는 다음과 같은 문제로 인해 발생할 수 있다.

* 컨테이너가 종료되도록 하는 애플리케이션 오류.
* 잘못된 환경 변수나 누락된 구성 파일과 같은 
  구성 오류.
* 컨테이너가 제대로 시작하기에 
  충분한 메모리나 CPU가 없는 리소스 제약.
* 애플리케이션이 예상 시간 내에 서비스를 시작하지 않아
  헬스 체크가 실패하는 경우.
* [프로브 섹션](#container-probes)에서 언급한 것처럼 컨테이너 활성 프로브(liveness probe) 또는
  스타트업 프로브(startup probe)가 `Failure` 결과를 반환하는 경우.

`CrashLoopBackOff` 문제의 근본 원인을 조사하려면 다음을 수행할 수 있다.

1. **로그 확인**: `kubectl logs <name-of-pod>`를 사용하여 컨테이너의 로그를 확인한다.
   이는 크래시를 일으키는 문제를 진단하는 가장 직접적인 방법인 경우가 많다.
1. **이벤트 조사**: `kubectl describe pod <name-of-pod>`를 사용하여 파드의 이벤트를 확인한다.
   이를 통해 구성 또는 리소스 문제에 대한 힌트를 얻을 수 있다.
1. **구성 검토**: 환경 변수와 마운트된 볼륨을 포함한 파드 구성이 올바른지,
   필요한 모든 외부 리소스가 
   사용 가능한지 확인한다.
1. **리소스 제한 확인**: 컨테이너에 충분한 CPU와 
   메모리가 할당되어 있는지 확인한다. 때로는 파드 정의에서 리소스를 늘리면 
   문제가 해결될 수 있다.
1. **애플리케이션 디버그**: 애플리케이션 코드에 버그나 잘못된 구성이 존재할 수 있다.
   이 컨테이너 이미지를 로컬이나 개발 환경에서 실행하면 애플리케이션 관련
   문제를 진단하는 데 도움이 될 수 있다.

### 컨테이너 재시작 {#restart-policy}

파드의 컨테이너가 중지되거나 실패를 경험하면, 쿠버네티스는 이를 재시작할 수 있다.
재시작이 항상 적절한 것은 아니다. 예를 들어,
{{< glossary_tooltip text="초기화 컨테이너" term_id="init-container" >}}는 파드 시작 중에
(성공하면) 한 번만 실행된다.
모든 파드에 적용되는 정책으로 재시작을 구성하거나, 컨테이너 수준의 구성(예:
{{< glossary_tooltip text="사이드카 컨테이너" term_id="sidecar-container" >}}를 정의할 때)을 사용하거나 컨테이너 수준의 오버라이드를 정의할 수 있다.

#### 컨테이너 재시작과 복원력 {#container-restart-resilience}

쿠버네티스 프로젝트는 예고 없는 또는 임의의 재시작을 고려한 복원력 있는
설계를 포함하여 클라우드 네이티브 원칙을 따를 것을 권장한다. 파드를 실패시키고
자동 [교체](/docs/concepts/workloads/controllers/)에 의존하거나,
컨테이너 수준의 복원력을 설계할 수 있다.
어느 접근 방식이든 부분적인 실패에도 불구하고 전체 워크로드가
가용 상태를 유지하도록 하는 데 도움이 된다.

#### 파드 수준의 컨테이너 재시작 정책

파드의 `spec`에는 Always, OnFailure, Never 값을 가질 수 있는 `restartPolicy` 필드가 있다.
기본값은 Always이다.

파드의 `restartPolicy`는 파드 내의 {{< glossary_tooltip text="앱 컨테이너" term_id="app-container" >}}와
일반 [초기화 컨테이너](/docs/concepts/workloads/pods/init-containers/)에 적용된다.
[사이드카 컨테이너](/docs/concepts/workloads/pods/sidecar-containers/)는
파드 수준의 `restartPolicy` 필드를 무시한다. 쿠버네티스에서 사이드카는
`initContainers` 내의 항목 중 컨테이너 수준의 `restartPolicy`가 `Always`로 설정된 것으로 정의된다.
오류로 종료되는 초기화 컨테이너의 경우, 파드 수준의 `restartPolicy`가
`OnFailure` 또는 `Always`이면 kubelet이 초기화 컨테이너를 재시작한다.

* `Always`: 모든 종료 후 컨테이너를 자동으로 재시작한다.
* `OnFailure`: 컨테이너가 오류(0이 아닌 종료 상태)로 종료된 경우에만 재시작한다.
* `Never`: 종료된 컨테이너를 자동으로 재시작하지 않는다.

kubelet이 구성된 재시작 정책에 따라 컨테이너 재시작을 처리할 때,
이는 동일한 파드 내에서 동일한 노드에서 실행되는 대체 컨테이너를 만드는
재시작에만 적용된다. 파드 내의 컨테이너가 종료된 후, kubelet은
지수 백오프 지연(10초, 20초, 40초, …)으로 재시작하며, 
최대 300초(5분)로 제한된다. 컨테이너가 10분 동안 문제 없이 실행되면,
kubelet은 해당 컨테이너의 재시작 백오프 타이머를 초기화한다.
[사이드카 컨테이너와 파드 라이프사이클](/docs/concepts/workloads/pods/sidecar-containers/#sidecar-containers-and-pod-lifecycle)에서
`restartPolicy` 필드를 지정할 때의 `초기화 컨테이너`의 동작을 설명한다.

#### 개별 컨테이너 재시작 정책과 규칙 {#container-restart-rules}

{{< feature-state feature_gate_name="ContainerRestartRules" >}}

클러스터에서 `ContainerRestartRules` 기능 게이트가 활성화되어 있으면,
_개별 컨테이너_ 에 `restartPolicy`와 `restartPolicyRules`를 지정하여 파드 재시작 정책을
오버라이드할 수 있다. 컨테이너 재시작 정책과 규칙은 파드 내의 {{< glossary_tooltip text="앱 컨테이너" term_id="app-container" >}}와
일반 [초기화 컨테이너](/docs/concepts/workloads/pods/init-containers/)에 적용된다.

쿠버네티스 네이티브 [사이드카 컨테이너](/docs/concepts/workloads/pods/sidecar-containers/)는
컨테이너 수준의 `restartPolicy`가 `Always`로 설정되어 있다.

컨테이너 재시작은 위에서 설명한 파드 재시작 정책과 동일한 지수 백오프를 따른다.
지원되는 컨테이너 재시작 정책은 다음과 같다.

* `Always`: 모든 종료 후 컨테이너를 자동으로 재시작한다.
* `OnFailure`: 컨테이너가 오류(0이 아닌 종료 상태)로 종료된 경우에만 재시작한다.
* `Never`: 종료된 컨테이너를 자동으로 재시작하지 않는다.

추가로, _개별 컨테이너_ 는 `restartPolicyRules`를 지정할 수 있다. `restartPolicyRules`
필드가 지정된 경우, 컨테이너의 `restartPolicy`도 **반드시** 지정해야 한다. `restartPolicyRules`는
컨테이너 종료 시 적용할 규칙 목록을 정의한다. 각 규칙은 조건과 
액션으로 구성된다. 지원되는 조건은 `exitCodes`이며, 컨테이너의 종료 코드를 
주어진 값 목록과 비교한다. 지원되는 액션은 `Restart`이며, 컨테이너가 
재시작됨을 의미한다. 규칙은 순서대로 평가된다. 첫 번째 일치 시 해당 액션이 적용된다.
어떤 규칙의 조건도 일치하지 않으면, 쿠버네티스는 컨테이너에 구성된
`restartPolicy`로 폴백한다.

예를 들어, `try-once` 컨테이너가 있는 OnFailure 재시작 정책의 파드가 있다. 이를 통해
파드는 특정 컨테이너만 재시작할 수 있다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: on-failure-pod
spec:
  restartPolicy: OnFailure
  containers:
  - name: try-once-container    # 이 컨테이너는 restartPolicy가 Never이므로 한 번만 실행된다.
    image: registry.k8s.io/busybox:1.27.2
    command: ['sh', '-c', 'echo "Only running once" && sleep 10 && exit 1']
    restartPolicy: Never     
  - name: on-failure-container  # 이 컨테이너는 실패 시 재시작된다.
    image: registry.k8s.io/busybox:1.27.2
    command: ['sh', '-c', 'echo "Keep restarting" && sleep 1800 && exit 1']
```

한 번만 실행되는 초기화 컨테이너가 있는 `Always` 재시작 정책의 파드이다. 초기화
컨테이너가 실패하면 파드가 실패한다. 이를 통해 초기화가 실패하면 파드가 실패하도록 하되,
초기화가 성공하면 계속 실행되도록 할 수 있다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: fail-pod-if-init-fails
spec:
  restartPolicy: Always
  initContainers:
  - name: init-once      # 이 초기화 컨테이너는 한 번만 시도한다. 실패하면 파드가 실패한다.
    image: registry.k8s.io/busybox:1.27.2
    command: ['sh', '-c', 'echo "Failing initialization" && sleep 10 && exit 1']
    restartPolicy: Never
  containers:
  - name: main-container # 이 컨테이너는 초기화가 성공하면 항상 재시작된다.
    image: registry.k8s.io/busybox:1.27.2
    command: ['sh', '-c', 'sleep 1800 && exit 0']
```

특정 종료 코드에서 재시작하는 컨테이너가 있는 Never 재시작 정책의 파드이다.
이는 재시작 가능한 오류와 재시작 불가능한 오류를 구분하는 데 유용하다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: restart-on-exit-codes
spec:
  restartPolicy: Never
  containers:
  - name: restart-on-exit-codes
    image: registry.k8s.io/busybox:1.27.2
    command: ['sh', '-c', 'sleep 60 && exit 0']
    restartPolicy: Never     # 규칙이 지정된 경우 컨테이너 재시작 정책을 반드시 지정해야 한다
    restartPolicyRules:      # 종료 코드가 42인 경우에만 컨테이너를 재시작한다
    - action: Restart
      exitCodes:
        operator: In
        values: [42]
```

재시작 규칙은 더 많은 고급 라이프사이클 관리 시나리오에 사용할 수 있다. 참고로, 재시작 규칙은
일반 재시작 정책과 동일한 불일치의 영향을 받는다. kubelet 재시작, 컨테이너 
런타임 가비지 컬렉션, 컨트롤 플레인과의 간헐적 연결 문제로 인해 상태가 손실될 수 있으며,
컨테이너가 재시작되지 않을 것으로 예상하더라도 다시 실행될 수 있다.

#### 모든 컨테이너 재시작 {#restart-all-containers}

{{< feature-state feature_gate_name="RestartAllContainersOnContainerExits" >}}

클러스터에서 `RestartAllContainersOnContainerExits` 기능 게이트가 활성화되어 있으면,
컨테이너 수준의 `restartPolicyRules`에서 `RestartAllContainers`를 액션으로 지정할 수 있다. 컨테이너의 종료가 
이 액션이 있는 규칙과 일치하면, 전체 파드가 종료되고 인플레이스(in-place)로 재시작된다.

이 "in-place" 재시작은 전체 삭제 및 재생성에 비해 
파드의 상태를 초기화하는 더 효율적인 방법을 제공한다. 이는 배치 작업이나 AI/ML 훈련 작업과 같이 
재스케줄링 비용이 높은 워크로드에 특히 유용하다.

##### 인플레이스 파드 재시작의 작동 방식

`RestartAllContainers` 액션이 트리거되면, kubelet은 다음 단계를 수행한다.

1. **빠른 종료**: 파드 내의 모든 실행 중인 컨테이너가 종료된다.
   구성된 `terminationGracePeriodSeconds`는 준수되지 않으며, 구성된 `preStop` 훅도
   실행되지 않는다. 이를 통해 신속한 종료가 보장된다.
1. **파드 리소스 보존**: 파드의 필수 리소스가 보존된다.

   * 파드 UID, IP 주소 및 네트워크 네임스페이스
   * 파드 샌드박스 및 연결된 모든 장치
   * `emptyDir` 및 마운트된 볼륨을 포함한 모든 볼륨

1. **파드 상태 업데이트**: 파드의 상태가 `PodRestartInPlace` 컨디션이 `True`로 설정되어 업데이트된다.
   이를 통해 재시작 프로세스를 관찰할 수 있다.
1. **전체 재시작 시퀀스**: 모든 컨테이너가 종료되면, `PodRestartInPlace` 컨디션이
   `False`로 설정되고 파드는 표준 시작 프로세스를 시작한다.

   * **초기화 컨테이너가 순서대로 다시 실행된다.**
   * 사이드카 및 일반 컨테이너가 시작된다.

이 기능의 핵심은 이전에 성공적으로 완료되었거나 실패한 컨테이너를 포함하여
**모든** 컨테이너가 재시작된다는 것이다. `RestartAllContainers` 액션은
구성된 컨테이너 수준 또는 파드 수준의 `restartPolicy`를 오버라이드한다.

이 메커니즘은 모든 컨테이너에 대한 초기 상태가 필요한 시나리오에서 유용하다. 예를 들면 다음과 같다.

- `init` 컨테이너가 손상될 수 있는 환경을 설정하는 경우, 이 기능은
  설정 프로세스가 다시 실행되도록 보장한다.
- 사이드카 컨테이너가 메인 애플리케이션의 상태를 모니터링하고, 애플리케이션이
  복구 불가능한 상태에 진입하면 전체 파드 재시작을 트리거할 수 있다.

감시자(watcher) 사이드카가 오류를 만났을 때 알려진 정상 상태에서 메인 애플리케이션을
재시작하는 역할을 하는 워크로드를 고려해 보자. 감시자는 특정 코드로 종료하여
워커 파드의 전체 인플레이스 재시작을 트리거할 수 있다.

{{% code_sample file="pods/restart-policy/restart-all-containers.yaml" %}}

이 예시에서, 

- 파드의 전체 `restartPolicy`는 `Never`이다.
- `watcher-sidecar`가 커맨드를 실행한 후 코드 `88`로 종료한다.
- 종료 코드가 규칙과 일치하여 `RestartAllContainers` 액션이 트리거된다.
- `setup-environment` 초기화 컨테이너와 `main-application` 컨테이너를 포함한 전체 파드가
  인플레이스로 재시작된다. 파드는 UID, 샌드박스, IP, 볼륨을 유지한다.

### 컨테이너 재시작 지연 감소

{{< feature-state
feature_gate_name="ReduceDefaultCrashLoopBackOffDecay" >}}

알파 기능 게이트 `ReduceDefaultCrashLoopBackOffDecay`가 활성화되면,
클러스터 전체에서 컨테이너 시작 재시도가 1초부터 시작하도록 줄어들고(기존 10초 대신)
재시작할 때마다 2배씩 지수적으로 증가하여 최대 지연이
60초(기존 300초, 즉 5분 대신)가 된다.

이 기능을 알파 기능 `KubeletCrashLoopBackOffMax`(아래 설명)와
함께 사용하면, 개별 노드마다 
다른 최대 지연을 가질 수 있다.

### 구성 가능한 컨테이너 재시작 지연

{{< feature-state feature_gate_name="KubeletCrashLoopBackOffMax" >}}

기능 게이트 `KubeletCrashLoopBackOffMax`가 활성화되면, 
컨테이너 시작 재시도 간의
최대 지연을 기본값인 300초(5분)에서 재구성할 수 있다. 이 구성은 kubelet
구성을 사용하여 노드별로 설정된다. [kubelet 구성](/docs/tasks/administer-cluster/kubelet-config-file/)에서
`crashLoopBackOff` 아래에 `maxContainerRestartPeriod` 필드를 `"1s"`에서
`"300s"` 사이로 설정한다. 위의 [컨테이너 재시작 정책](#restart-policy)에서 설명한 대로,
해당 노드의 지연은 여전히 10초에서 시작하여 재시작할 때마다 2배씩 지수적으로 증가하지만,
이제 구성한 최대값으로 제한된다. 
구성한 `maxContainerRestartPeriod`가
기본 초기값인 10초보다 작으면, 초기 지연은 구성된 최대값으로 설정된다.

다음 kubelet 구성 예시를 참고한다.

```yaml
# 컨테이너 재시작 지연은 10초에서 시작하여
# 재시작할 때마다 2배씩 증가하며, 최대 100초까지 적용된다
kind: KubeletConfiguration
crashLoopBackOff:
    maxContainerRestartPeriod: "100s"
```

```yaml
# 컨테이너 재시작 간 지연은 항상 2초이다
kind: KubeletConfiguration
crashLoopBackOff:
    maxContainerRestartPeriod: "2s"
```

이 기능을 알파 기능
`ReduceDefaultCrashLoopBackOffDecay`(위에서 설명)와 함께 사용하면, 
초기 백오프와 최대 백오프의 클러스터 기본값이 더 이상 10초와 300초가 아닌 1초와
60초가 된다. 노드별 구성은 `ReduceDefaultCrashLoopBackOffDecay`에 의해
설정된 기본값보다 우선하며, 이로 인해 해당 노드가 클러스터의 다른 노드보다
더 긴 최대 백오프를 가지게 되더라도 마찬가지이다.

## 파드의 컨디션

파드는 하나의 PodStatus를 가지며,
그것은 파드가 통과했거나 통과하지 못한 
[PodConditions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podcondition-v1-core) 배열을 가진다. kubelet은 다음 
PodConditions를 관리한다.

* `PodScheduled`: 파드가 노드에 스케줄되었다.
* `PodReadyToStartContainers`: (베타 기능; [기본](#pod-has-network) 활성화) 파드
  샌드박스가 성공적으로 생성되고 네트워킹이 구성되었다.
* `ContainersReady`: 파드의 모든 컨테이너가 준비되었다.
* `Initialized`: 모든 [초기화 컨테이너](/docs/concepts/workloads/pods/init-containers/)가
  성공적으로 완료(completed)되었다.
* `Ready`: 파드는 요청을 처리할 수 있으며 일치하는 모든 서비스의 로드
  밸런싱 풀에 추가되어야 한다.
* `DisruptionTarget`: 파드가 중단(선점, 축출 또는 가비지 컬렉션 등)으로 인해 곧 종료될 예정이다.
* `PodResizePending`: 파드 리사이즈가 요청되었지만 적용할 수 없다. [파드 리사이즈 상태](/docs/tasks/configure-pod-container/resize-container-resources#pod-resize-status)를 참고한다.
* `PodResizeInProgress`: 파드가 리사이즈 중이다.
  [파드 리사이즈 상태](/docs/tasks/configure-pod-container/resize-container-resources#pod-resize-status)를 참고한다.

필드 이름              | 설명
:--------------------|:-----------
`type`               | 이 파드 컨디션의 이름이다.
`status`             | 가능한 값이 "`True`", "`False`", 또는 "`Unknown`"으로, 해당 컨디션이 적용 가능한지 여부를 나타낸다.
`lastProbeTime`      | 파드 컨디션이 마지막으로 프로브된 시간의 타임스탬프이다.
`lastTransitionTime` | 파드가 한 상태에서 다른 상태로 전환된 마지막 시간에 대한 타임스탬프이다.
`reason`             | 컨디션의 마지막 전환에 대한 이유를 나타내는 기계가 판독 가능한 UpperCamelCase 텍스트이다.
`message`            | 마지막 상태 전환에 대한 세부 정보를 나타내는 사람이 읽을 수 있는 메시지이다.

### 파드의 준비성(readiness) {#pod-readiness-gate}

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

추가하려는 파드 컨디션에는 쿠버네티스
[레이블 키 포맷](/docs/concepts/overview/working-with-objects/labels/#구문과-캐릭터-셋)을 충족하는 이름이 있어야 한다.

### 파드 준비성 상태 {#pod-readiness-status}

`kubectl patch` 명령어는 아직 오브젝트 상태 패치(patching)를 지원하지 않는다.
이러한 `status.conditions` 을 파드에 설정하려면 애플리케이션과
{{< glossary_tooltip term_id="operator-pattern" text="오퍼레이터">}}의
`PATCH` 액션을 필요로 한다.
[쿠버네티스 클라이언트 라이브러리](/docs/reference/using-api/client-libraries/)를
사용해서 파드 준비성에 대한 사용자 지정 파드 컨디션을 설정하는 코드를 작성할 수 있다.

사용자 지정 컨디션을 사용하는 파드의 경우, 다음 두 컨디션이 모두 적용되는
경우에 **만** 해당 파드가 준비된 것으로 평가된다.

* 파드 내의 모든 컨테이너들이 준비 상태이다.
* `readinessGates`에 지정된 모든 컨디션들이 `True` 이다.

파드의 컨테이너가 Ready 이나 적어도 한 개의 사용자 지정 컨디션이 빠졌거나 `False` 이면,
kubelet은 파드의 [컨디션](#파드의-컨디션)을 `ContainerReady` 로 설정한다.

### 파드 네트워크 준비성(readiness) {#pod-has-network}

{{< feature-state for_k8s_version="v1.29" state="beta" >}}

{{< note >}}
초기 개발 과정에서 이 컨디션은 `PodHasNetwork`로 명명되었다.
{{< /note >}}

파드가 노드에 스케줄링되면, kubelet이 이 파드를 승인해야 하고
필요한 스토리지 볼륨이 마운트되어야 한다. 이러한 단계가 완료되면,
kubelet은 
컨테이너 런타임({{< glossary_tooltip term_id="cri" >}} 사용)과
통신하여 런타임 샌드박스를 설정하고 파드에 대한 네트워킹을 구성한다. 만약
`PodReadyToStartContainersCondition`
[기능 게이트](/docs/reference/command-line-tools-reference/feature-gates/)가 활성화되면
(쿠버네티스 {{< skew currentVersion >}}에서는 기본적으로 활성화됨),
`PodReadyToStartContainers` 컨디션이 파드의 `status.conditions` 필드에 추가된다.

kubelet은 파드에 네트워킹이 구성된 런타임 샌드박스가 없음을 감지하면
`PodReadyToStartContainers` 컨디션을 `False`로 설정한다. 이것은 다음
시나리오에서 발생한다.

- 파드 라이프사이클 초기에, kubelet이 컨테이너 런타임을 사용하여 파드를 위한 샌드박스 
  생성을 아직 ​​시작하지 않은 때.
- 파드 라이프사이클 후기에, 파드 샌드박스가 다음중 하나의 이유로 
파괴되었을 때.
  - 파드 축출 없이, 노드가 재부팅된다
  - 격리를 위해 가상 머신을 사용하는 컨테이너 런타임을 사용하는 경우, 파드 
    샌드박스 가상 머신이 재부팅되며, 이후, 새로운 샌드박스 및 
    새로운 컨테이너 네트워크 구성 생성이 필요하다.

런타임 플러그인이 파드를 위한 샌드박스 생성 및 네트워크 구성을 성공적으로 완료하면 
kubelet이 `PodReadyToStartContainers` 컨디션을 `True`로 설정한다.
`PodReadyToStartContainers` 컨디션이 `True`로 설정되면 kubelet이 컨테이너 이미지를 풀링하고 컨테이너를 생성할 수 있다.

초기화 컨테이너가 있는 파드의 경우, kubelet은 초기화 컨테이너가
성공적으로 완료(런타임 플러그인에 의한 성공적인 샌드박스 생성 및 네트워크 구성이 완료되었음을 의미)된 후
`Initialized` 컨디션을 `True`로 설정한다.
초기화 컨테이너가 없는 파드의 경우, kubelet은 샌드박스 생성 및 네트워크 구성이
시작되기 전에 `Initialized` 컨디션을 `True`로 설정한다.

## 파드 리사이징 {#pod-resize}

{{< feature-state feature_gate_name="InPlacePodVerticalScaling" >}}

쿠버네티스는 파드가 생성된 후에도 파드에 할당된 CPU 및 메모리 리소스를
변경하는 것을 지원한다. (다른 인프라 리소스의 경우, 해당 리소스에 특화된
다른 기법을 사용해야 한다.) CPU 및 메모리 리사이징에는 
두 가지 주요 접근 방식이 있다.

### 인플레이스(in-place) 파드 리사이즈 {#pod-resize-inplace}

파드를 재생성하지 않고도 파드의 컨테이너 수준 CPU 및 메모리 리소스를 리사이즈할 수 있다.
이를 _인플레이스(in-place) 파드 수직 스케일링_ 이라고도 한다. 이를 통해 애플리케이션 중단을
최소화하면서 실행 중인 컨테이너의 리소스 할당을 조정할 수 있다.

인플레이스 리사이즈를 수행하려면, `/resize` 서브리소스를 사용하여 파드의 의도한 상태(desired state)를
업데이트한다. 그러면 kubelet이 실행 중인 컨테이너에 새로운 리소스 값을 적용하려고 시도한다.
파드 {{< glossary_tooltip text="컨디션" term_id="condition" >}}
`PodResizePending` 및 `PodResizeInProgress`([파드 컨디션](#pod-conditions)에서 설명)는
리사이즈 작업의 상태를 나타낸다. 리사이즈 상태에 대한 자세한 내용은
[컨테이너 리사이즈 상태](/docs/tasks/configure-pod-container/resize-container-resources/#container-resize-status)를 참고한다.

인플레이스 리사이즈의 주요 고려 사항은 다음과 같다.
- CPU 및 메모리 리소스만 인플레이스로 리사이즈할 수 있다.
- 파드의 [서비스 품질(QoS) 클래스](/docs/concepts/workloads/pods/pod-qos/)는
  생성 시 결정되며 리사이즈로 변경할 수 없다.
- 컨테이너 명세의 `resizePolicy`를 사용하여 리사이즈 시 컨테이너
  재시작이 필요한지 여부를 설정할 수 있다.

인플레이스 리사이즈 수행에 대한 자세한 지침은
[컨테이너에 할당된 CPU 및 메모리 리소스 리사이즈](/docs/tasks/configure-pod-container/resize-container-resources/)를 참고한다.

### 대체 파드를 실행하여 리사이즈 {#resizing-by-launching-replacement-pods}

파드의 리소스를 변경하는 보다 클라우드 네이티브한 접근 방식은 파드를 관리하는
워크로드 리소스(디플로이먼트(Deployment) 또는 스테이트풀셋(StatefulSet) 등)를
통하는 것이다. 파드 템플릿의 리소스 명세를 업데이트하면,
워크로드의 컨트롤러가 업데이트된 리소스로 새 파드를 생성하고
업데이트 전략에 따라 이전 파드를 종료한다.

이 접근 방식은 다음과 같은 특징이 있다.
- 모든 쿠버네티스 버전에서 동작한다.
- 리소스뿐만 아니라 모든 파드 명세를 변경할 수 있다.
- 파드가 교체되므로, [계획된 중단](/docs/concepts/workloads/pods/disruptions/)을
  처리할 수 있도록 워크로드를 설계해야 한다. 가용성을 제어하려면
  [PodDisruptionBudget](/docs/tasks/run-application/configure-pdb/) 사용을 고려한다.
- 파드가 워크로드 리소스에 의해 관리되어야 한다.

[VerticalPodAutoscaler](/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/)를
사용하여 파드 리소스 권장 사항 및 업데이트를 
자동으로 관리할 수도 있다.

## 컨테이너 프로브(probe)

_프로브_ 는 컨테이너에서 [kubelet](/docs/reference/command-line-tools-reference/kubelet/)에 의해
주기적으로 수행되는 진단(diagnostic)이다. 진단을 수행하기 위해서, kubelet은 컨테이너 안에서 코드를 실행하거나, 
또는 네트워크 요청을 전송한다.

### 체크 메커니즘 {#probe-check-methods}

프로브를 사용하여 컨테이너를 체크하는 방법에는 4가지가 있다.
각 프로브는 다음의 4가지 메커니즘 중 단 하나만을 정의해야 한다.

`exec`
: 컨테이너 내에서 지정된 명령어를 실행한다.
  명령어가 상태 코드 0으로 종료되면 진단이 성공한 것으로 간주한다.

`grpc`
: [gRPC](https://grpc.io/)를 사용하여 원격 프로시저 호출을 수행한다. 
  체크 대상이 
  [gRPC 헬스 체크](https://grpc.io/grpc/core/md_doc_health-checking.html)를 구현해야 한다. 
  응답의 `status` 가 `SERVING` 이면 
  진단이 성공했다고 간주한다. 

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

{{< caution >}}
다른 메커니즘과 달리, `exec` 프로브의 구현은 실행될 때마다
여러 프로세스를 생성/포크(fork)하는 것을 수반한다.
그 결과, 파드 밀도가 높고 `initialDelaySeconds`, `periodSeconds`의
간격이 짧은 클러스터의 경우, exec 메커니즘으로 프로브를 구성하면
노드의 CPU 사용량에 오버헤드가 발생할 수 있다.
이러한 시나리오에서는 오버헤드를 피하기 위해 대체 프로브 메커니즘 사용을 고려한다.
{{< /caution >}}

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

만약 컨테이너 속 프로세스가 어떠한 이슈에 직면하거나 건강하지 못한
상태(unhealthy)가 되는 등 프로세스 자체의 문제로 중단될 수 있더라도, 활성 프로브가
반드시 필요한 것은 아니다. 그 경우에는 kubelet이 파드의 `restartPolicy`에
따라서 올바른 대처를 자동적으로 수행할 것이다.

프로브가 실패한 후 컨테이너가 종료되거나 재시작되길 원한다면, 활성 프로브를
지정하고, `restartPolicy`를 항상(Always) 또는 실패 시(OnFailure)로 지정한다.

#### 언제 준비성 프로브를 사용해야 하는가?

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
파드가 삭제될 때 요청을 드레인(drain)하려는 경우, 반드시 준비성 프로브가
필요한 것은 아니다. 파드가 삭제되면 `EndpointSlice`의 해당 엔드포인트가
[conditions](/docs/concepts/services-networking/endpoint-slices/#conditions)를 업데이트한다.
엔드포인트의 `ready` 컨디션이 `false`로 설정되므로, 로드 밸런서는
해당 파드를 일반 트래픽에 사용하지 않는다. kubelet이 파드 삭제를 처리하는 방법에
대한 자세한 내용은 [파드의 종료](#pod-termination)를 참고한다.
{{< /note >}}

#### 언제 스타트업 프로브를 사용해야 하는가?

스타트업 프로브는 서비스를 시작하는 데 오랜 시간이 걸리는 컨테이너가 있는
파드에 유용하다. 긴 활성 간격을 설정하는 대신, 컨테이너가 시작될 때
프로브를 위한 별도의 구성을 설정하여, 활성 간격보다
긴 시간을 허용할 수 있다.

<!-- ensure front matter contains math: true -->
컨테이너가 보통
\\( initialDelaySeconds + failureThreshold \times  periodSeconds \\) 이후에
기동된다면, 스타트업 프로브가 활성화 프로브와 같은 엔드포인트를 확인하도록
지정해야 한다. `periodSeconds`의 기본값은 10s이다. 이때 활성화 프로브의
기본값을 변경하지 않고 컨테이너가 기동되도록 하려면, `failureThreshold`를
충분히 높게 설정해주어야 한다. 그래야 데드락을 방지하는데 도움이 된다.

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

일반적으로, 이러한 파드의 정상 종료 과정에서 kubelet은 컨테이너 런타임에
파드 내 컨테이너의 중지를 요청하는데, 먼저 각 컨테이너의 기본 프로세스에
유예 기간 타임아웃과 함께 TERM(일명 SIGTERM) 시그널을 전송한다.
컨테이너 중지 요청은 컨테이너 런타임에 의해 비동기적으로 처리된다.
이러한 요청의 처리 순서는 보장되지 않는다.
많은 컨테이너 런타임은 컨테이너 이미지에 정의된 `STOPSIGNAL` 값을 존중하며,
값이 다른 경우 TERM 대신 컨테이너 이미지에 설정된 STOPSIGNAL을 전송한다.
유예 기간이 만료되면, KILL 시그널이 나머지 프로세스로
전송되고, 그런 다음 파드는
{{< glossary_tooltip text="API 서버" term_id="kube-apiserver" >}}로부터 삭제된다. 프로세스가
종료될 때까지 기다리는 동안 kubelet 또는 컨테이너 런타임의 관리 서비스가 다시 시작되면, 클러스터는
전체 원래 유예 기간을 포함하여 처음부터 다시 시도한다.

### 중지 시그널 {#pod-termination-stop-signals}

컨테이너를 종료하는 데 사용되는 중지 시그널은 컨테이너 이미지에서 `STOPSIGNAL` 지시어로 정의할 수 있다.
이미지에 중지 시그널이 정의되지 않은 경우, 컨테이너 런타임의 기본 시그널
(containerd와 CRI-O 모두 SIGTERM)이 컨테이너를 종료하는 데 사용된다.

### 사용자 정의 중지 시그널 {#defining-custom-stop-signals}

{{< feature-state feature_gate_name="ContainerStopSignals" >}}

`ContainerStopSignals` 기능 게이트가 활성화된 경우, 컨테이너 라이프사이클에서
컨테이너에 대한 사용자 정의 중지 시그널을 설정할 수 있다. 컨테이너 라이프사이클에서
중지 시그널을 정의하려면 파드의 `spec.os.name` 필드가 반드시 존재해야 한다.
유효한 시그널 목록은 파드가 스케줄링되는 OS에 따라 다르다.
윈도우 노드에 스케줄링되는 파드의 경우, SIGTERM과 SIGKILL만 유효한 시그널로 지원된다.

다음은 사용자 정의 중지 시그널을 정의하는 파드 명세 예시이다.

```yaml
spec:
  os:
    name: linux
  containers:
    - name: my-container
      image: container-image:latest
      lifecycle:
        stopSignal: SIGUSR1
```

라이프사이클에 중지 시그널이 정의된 경우, 컨테이너 이미지에 정의된 시그널을 오버라이드한다.
컨테이너 명세에 중지 시그널이 정의되지 않은 경우, 컨테이너는 기본 동작으로 폴백한다.

### 파드 종료 흐름 {#pod-termination-flow}

파드 종료 흐름을 예시와 함께 설명한다.

1. 이 `kubectl` 도구를 사용하여 기본 유예 기간(30초)으로 특정 파드를 수동으로
   삭제한다.

1. API 서버의 파드는 유예 기간과 함께 파드가 "dead"로 간주되는
   시간으로 업데이트된다.
   `kubectl describe` 를 사용하여 삭제하려는 파드를 확인하면, 해당 파드가 "Terminating"으로 표시된다.
   파드가 실행 중인 노드에서, kubelet이 파드가 종료된 것(terminating)으로 표시되었음을
   확인하는 즉시(정상적인 종료 기간이 설정됨), kubelet은 로컬 파드의 
   종료 프로세스를 시작한다.

   1. 파드의 컨테이너 중 하나가 `preStop`
      [훅](/docs/concepts/containers/container-lifecycle-hooks)을 정의했고
      파드 명세의 `terminationGracePeriodSeconds`가 0으로 설정되지 않은 경우, kubelet은 컨테이너 내부에서 해당 훅을 실행한다.
      `terminationGracePeriodSeconds`의 기본 설정은 30초이다.

      유예 기간이 만료된 후 `preStop` 훅이 계속 실행되면, kubelet은 
      2초의 작은 일회성 유예 기간 연장을 요청한다.

   {{% note %}}
   `preStop` 훅을 완료하는 데 기본 유예 기간이 허용하는 것보다 오랜 시간이 필요한 경우,
   이에 맞게 `terminationGracePeriodSeconds`를 수정해야 한다.
   {{% /note %}}

   1. kubelet은 컨테이너 런타임을 트리거하여 각 컨테이너 내부의 프로세스 1에 TERM 시그널을
      보낸다.

      파드에 정의된 {{< glossary_tooltip text="사이드카 컨테이너" term_id="sidecar-container" >}}가
      있는 경우 [특수한 순서](#termination-with-sidecars)가 적용된다.
      그렇지 않으면, 파드의 컨테이너는 서로 다른 시간에 임의의 순서로 TERM 시그널을
      수신한다. 종료 순서가 중요한 경우, `preStop` 훅을 사용하여
      동기화하는 것이 좋다(또는 사이드카 컨테이너 사용으로 전환).

1. kubelet이 파드의 정상 종료를 시작하는 동시에, 컨트롤 플레인은
   구성된 {{< glossary_tooltip text="셀렉터" term_id="selector" >}}가 있는
   {{< glossary_tooltip term_id="service" text="서비스" >}}를 나타내는
   엔드포인트슬라이스(EndpointSlice) 오브젝트에서 종료 중인 파드를 제거할지 여부를 평가한다.
   {{< glossary_tooltip text="레플리카셋(ReplicaSet)" term_id="replica-set" >}}과 기타 워크로드 리소스는
   더 이상 종료 중인 파드를 유효한 서비스 내 복제본으로 취급하지 않는다.

   느리게 종료되는 파드는 일반 트래픽을 계속 제공해서는 안 되며,
   종료를 시작하고 열린 연결의 처리를 완료해야 한다. 일부 애플리케이션은
   열린 연결 완료를 넘어 세션 드레이닝 및 완료와 같은 보다 
   정상적인 종료가 필요하다.

   종료 중인 파드를 나타내는 엔드포인트는 엔드포인트슬라이스에서 즉시 제거되지 않으며,
   엔드포인트슬라이스 API에서 [종료 상태](/docs/concepts/services-networking/endpoint-slices/#conditions)를
   나타내는 상태가 노출된다.
   종료 중인 엔드포인트의 `ready` 상태는 항상 `false`이므로(1.26 이전 버전과의
   하위 호환성을 위해), 로드 밸런서는 해당 엔드포인트를 일반 트래픽에 사용하지 않는다.

   종료 중인 파드에서 트래픽 드레이닝이 필요한 경우, `serving` 컨디션으로
   실제 준비성을 확인할 수 있다. 연결 드레이닝 구현 방법에 대한 자세한 내용은
   [파드와 엔드포인트 종료 흐름](/docs/tutorials/services/pods-and-endpoint-termination-flow/) 튜토리얼에서 확인할 수 있다.

   <a id="pod-termination-beyond-grace-period" />

1. kubelet은 파드가 종료되고 완전히 중지되었는지 확인한다.

   1. 유예 기간이 만료되었을 때 파드에서 여전히 실행 중인 컨테이너가 있으면,
      kubelet은 강제 종료를 트리거한다.
      컨테이너 런타임은 파드의 모든 컨테이너에서 여전히 실행 중인 모든 프로세스에 `SIGKILL`을 전송한다.
      kubelet은 해당 컨테이너 런타임이 하나를 사용하는 경우 숨겨진 `pause` 컨테이너도 정리한다.
   1. kubelet은 파드를 터미널 페이즈(`Failed` 또는 `Succeeded`, 컨테이너의
      최종 상태에 따라 다름)로 전환한다.
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

kubectl를 사용하여 강제 삭제를 수행하려면 `--grace-period=0` 와 함께 
추가 플래그 `--force` 를 지정해야 한다.

강제 삭제가 수행되면, API 서버는 실행 중인 노드에서
파드가 종료되었다는 kubelet의 확인을 기다리지 않는다.
API에서 즉시 파드를 제거하므로 동일한 이름으로 새로운 파드를 생성할 수
있다. 노드에서 즉시 종료되도록 설정된 파드는 강제 종료되기 전에
작은 유예 기간이 계속 제공된다.

{{< caution >}}
즉시 제거는 실행 중인 자원이 정상적으로 종료되는 것을 보장하지 않는다. 
자원은 클러스터에서 영원히 회수되지 않을 수 있다.
{{< /caution >}}

스테이트풀셋(StatefulSet)의 일부인 파드를 강제 삭제해야 하는 경우,
[스테이트풀셋에서 파드를 삭제하기](/docs/tasks/run-application/force-delete-stateful-set-pod/)에 대한
태스크 문서를 참고한다.

### 파드 종료와 사이드카 컨테이너 {#termination-with-sidecars}

파드에 하나 이상의
[사이드카 컨테이너](/docs/concepts/workloads/pods/sidecar-containers/)
(`Always` 재시작 정책을 가진 초기화 컨테이너)가 포함된 경우, kubelet은 마지막 메인 컨테이너가
완전히 종료될 때까지 이러한 사이드카 컨테이너에 TERM 시그널 전송을 지연한다.
사이드카 컨테이너는 파드 명세에 정의된 역순으로 종료된다.
이를 통해 사이드카 컨테이너가 더 이상 필요하지 않을 때까지 파드의 다른 컨테이너에
계속 서비스를 제공할 수 있다.

이는 메인 컨테이너의 느린 종료가 사이드카 컨테이너의 종료도 지연시킨다는 것을 의미한다.
종료 프로세스가 완료되기 전에 유예 기간이 만료되면, 파드는 [강제 종료](#pod-termination-beyond-grace-period)에 진입할 수 있다.
이 경우, 파드의 나머지 모든 컨테이너는 짧은 유예 기간과 함께 동시에 종료된다.

마찬가지로, 파드에 종료 유예 기간을 초과하는 `preStop` 훅이 있으면 긴급 종료가 발생할 수 있다.
일반적으로, 사이드카 컨테이너 없이 종료 순서를 제어하기 위해 `preStop` 훅을 사용했다면,
이제 이를 제거하고 kubelet이 사이드카 종료를 자동으로 관리하도록 할 수 있다.

### 파드의 가비지 콜렉션 {#pod-garbage-collection}

실패한 파드의 경우, API 오브젝트는 사람이나
{{< glossary_tooltip term_id="controller" text="컨트롤러" >}} 프로세스가
명시적으로 파드를 제거할 때까지 클러스터의 API에 남아 있다.

컨트롤 플레인에서의 컨트롤러 역할인 파드 가비지 콜렉터(PodGC)는, 파드 수가 구성된 임계값(kube-controller-manager에서
`terminated-pod-gc-threshold` 에 의해 결정됨)을 초과할 때 종료된 파드(`Succeeded` 또는
`Failed` 단계 포함)를 정리한다.
이렇게 하면 시간이 지남에 따라 파드가 생성되고 종료될 때 리소스 유출이 방지된다.

추가적으로, PodGC는 다음과 같은 조건들 중 하나라도 만족하는 파드들을 정리한다.

1. 고아 파드 - 더 이상 존재하지 않는 노드에 종속되어있는 파드이거나,
1. 스케줄되지 않은 종료 중인 파드이거나,
1. [`node.kubernetes.io/out-of-service`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-out-of-service)
   테인트가 설정된 준비되지 않은 노드에 속한 종료 중인 파드인 경우.

PodGC는 파드를 정리하는 것 뿐만 아니라 해당 파드들이 non-terminal 단계에 있는 경우
실패했다고 표시하기도 한다. 또한, PodGC는 고아 파드를 정리할 때 파드 중단 조건을 추가한다.
자세한 내용은 [파드 중단 조건](/docs/concepts/workloads/pods/disruptions#pod-disruption-conditions)을
참고한다.

## kubelet 재시작 시 파드 동작 {#kubelet-restarts}

kubelet을 재시작하면, 파드(및 해당 컨테이너)는 재시작 중에도
계속 실행된다.
노드에 실행 중인 파드가 있을 때, 해당 노드에서 kubelet을 중지하거나
재시작하더라도 kubelet 자체가 중지되기 전에
모든 로컬 파드를 중지시키지는 **않는다**.
노드의 파드를 중지하려면 `kubectl drain`을 사용할 수 있다.

### kubelet 재시작 감지 {#detection-of-kubelet-restarts}

{{< feature-state feature_gate_name="ChangeContainerStatusOnKubeletRestart" >}}

kubelet이 시작되면, 이미 파드가 바인딩된 노드가 있는지 확인한다.
노드의 [`Ready` 컨디션](/docs/reference/node/node-status/#condition)이 변경되지 않은 경우,
즉 컨디션이 true에서 false로 전환되지 않은 경우, 쿠버네티스는 이를 _kubelet 재시작_ 으로 감지한다.
(다른 방식으로 kubelet을 재시작하는 것도 가능한데, 예를 들어 노드 버그를 수정하기 위한 경우이다.
이러한 경우 쿠버네티스는 안전한 옵션을 선택하여 kubelet을 중지한 후
나중에 다시 시작한 것처럼 처리한다.)

kubelet이 재시작되면, 기능 게이트 설정에 따라 컨테이너 상태가 다르게 관리된다.

* 기본적으로, kubelet은 재시작 후 컨테이너 상태를 변경하지 않는다.
  `ready: true` 상태였던 컨테이너는 ready 상태를 유지한다.

  kubelet을 충분히 오래 중지하여 일련의
  [노드 하트비트](/docs/concepts/architecture/leases/#node-heart-beats) 검사에 실패하게 한 다음,
  kubelet을 다시 시작하기 전에 대기하면, 쿠버네티스는 해당 노드에서 파드를 축출하기 시작할 수 있다.
  그러나, 파드 축출이 시작되더라도 쿠버네티스는 해당 파드의 개별 컨테이너를
  `ready: false`로 표시하지 않는다. 파드 수준의 축출은 컨트롤 플레인이
  (하트비트 실패로 인해) 노드를 `node.kubernetes.io/not-ready`로 테인트한 후에 발생한다.

* 쿠버네티스 {{< skew currentVersion >}}에서는 kubelet 재시작 후 컨테이너의 `ready` 값을
  항상 false로 변경하는 레거시 동작을 선택할 수 있다.

  이 레거시 동작은 오랫동안 기본값이었지만, 특히 대규모 배포에서
  쿠버네티스 사용자에게 문제를 일으켰다. 기능 게이트를 통해 이 레거시 동작으로
  일시적으로 되돌릴 수 있지만, 문제가 발생하면 버그 리포트를 제출하는 것이 권장된다.
  `ChangeContainerStatusOnKubeletRestart`
  [기능 게이트](/docs/reference/command-line-tools-reference/feature-gates/#ChangeContainerStatusOnKubeletRestart)는
  향후 제거될 예정이다.

## {{% heading "whatsnext" %}}

* [컨테이너 라이프사이클 이벤트에 핸들러를 연결](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/)하는
  핸즈온 연습을 해보자.

* [활성, 준비성 및 스타트업 프로브 설정](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)하는
  핸즈온 연습을 해보자.

* [컨테이너 라이프사이클 훅](/docs/concepts/containers/container-lifecycle-hooks/)에 대해 자세히 알아보자.

* [사이드카 컨테이너](/docs/concepts/workloads/pods/sidecar-containers/)에 대해 자세히 알아보자.

* API의 파드와 컨테이너 상태에 대한 자세한 내용은 
  파드의 [`status`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodStatus)에 대해 다루는 
  API 레퍼런스 문서를 참고한다.
