---
title: 파드 라이프사이클
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

{{< comment >}}Updated: 4/14/2015{{< /comment >}}
{{< comment >}}Edited and moved to Concepts section: 2/2/17{{< /comment >}}

이 페이지는 파드의 라이프사이클을 설명한다.

{{% /capture %}}


{{% capture body %}}

## 파드의 단계(phase)

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

값 | 의미
:-----|:-----------
`Pending` | 파드가 쿠버네티스 시스템에 의해서 승인되었지만, 파드를 위한 하나 또는 하나 이상의 컨테이너 이미지 생성이 아직 완료되지 않았다. 여기에는 스케줄되기 이전까지의 시간 뿐만 아니라 오래 걸릴 수 있는 네트워크를 통한 이미지 다운로드 시간도 포함된다.
`Running` | 파드가 한 노드에 결합되었고, 모든 컨테이너들의 생성이 완료되었다. 적어도 하나의 컨테이너가 동작 중이거나, 시작 또는 재시작 중에 있다.
`Succeeded` | 파드에 있는 모든 컨테이너들이 성공으로 종료되었고, 재시작되지 않을 것이다.
`Failed` | 파드에 있는 모든 컨테이너들이 종료되었고, 적어도 하나 이상의 컨테이너가 실패로 종료되었다. 즉, 해당 컨테이너는 non-zero 상태로 빠져나왔거나(exited) 시스템에 의해서 종료(terminated)되었다.
`Unknown` | 어떤 이유에 의해서 파드의 상태를 얻을 수 없다. 일반적으로 파드 호스트와의 통신 오류에 의해서 발생한다.

## 파드의 조건(condition)

파드는 하나의 PodStatus를 가지며,
그것은 파드가 통과했거나 통과하지 못한 조건에 대한
[PodConditions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podcondition-v1-core) 배열을 가진다.
PodCondition 배열의 각 요소는 다음 여섯 가지 필드를 가질 수 있다.

* `lastProbeTime` 필드는
파드의 조건이 마지막으로 조사된 시점의 타임스탬프를 제공한다.

* `lastTransitionTime` 필드는
파드가 마지막으로 한 상태에서 다른 상태로 전환된 시점의 타임스탬프를 제공한다.

* `message` 필드는
전환에 대한 세부 정보를 표시한, 사람이 읽을 수 있는 메시지이다.

* `reason` 필드는 마지막으로 발생한 전환의 이유다. 이유는 유일하게, 한 단어로, 카멜 표기법(CamelCase)으로 표기된다.

* `status` 필드는 `True`", "`False`", 그리고 "`Unknown`"으로 지정될 수 있는 문자열이다.

* `type` 필드는 다음과 같은 가능한 값들의 문자열이다.

  * `PodScheduled`: 파드가 하나의 노드로 스케줄 완료되었음.
  * `Ready`: 파드는 요청들을 수행할 수 있으며
    모든 매칭 서비스들의 로드밸런싱 풀에 추가되어야 함.
  * `Initialized`: 모든 [초기화 컨테이너](/docs/concepts/workloads/pods/init-containers)가
    성공적으로 시작 완료되었음.
  * `Unschedulable`: 스케줄러가 자원의 부족이나 다른 제약 등에 의해서
    지금 당장은 파드를 스케줄할 수 없음.
  * `ContainersReady`: 파드 내의 모든 컨테이너가 준비 상태임.



## 컨테이너 프로브(probe)

[프로브](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#probe-v1-core)는
컨테이너에서 [kubelet](/docs/admin/kubelet/)에 의해 주기적으로 수행되는 진단(diagnostic)이다.
진단을 수행하기 위해서,
kubelet은 컨테이너에 의해서 구현된
[핸들러](https://godoc.org/k8s.io/kubernetes/pkg/api/v1#Handler)를 호출한다.
핸들러에는 다음과 같이 세 가지 타입이 있다.

* [ExecAction](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#execaction-v1-core)
  은 컨테이너 내에서 지정된 명령어를 실행한다.
  명령어가 상태 코드 0으로 종료되면 진단이 성공한 것으로 간주한다.

* [TCPSocketAction](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#tcpsocketaction-v1-core)
  은 지정된 포트에서 컨테이너의 IP주소에 대해 TCP 검사를 수행한다.
  포트가 활성화되어 있다면 진단이 성공한 것으로 간주한다.

* [HTTPGetAction](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#httpgetaction-v1-core)
  은 지정한 포트 및 경로에서 컨테이너의 IP주소에
  대한 HTTP Get 요청을 수행한다. 응답의 상태 코드가 200보다 크고 400보다 작으면
  진단이 성공한 것으로 간주한다.

각 probe는 다음 세 가지 결과 중 하나를 가진다.

* Success: 컨테이너가 진단을 통과함.
* Failure: 컨테이너가 진단에 실패함.
* Unknown: 진단 자체가 실패하였으므로 아무런 액션도 수행되면 안됨.

kubelet은 실행 중인 컨테이너들에 대해서 선택적으로 두 가지 종류의 프로브를 수행하고
그에 반응할 수 있다.

* `livenessProbe`는 컨테이너가 동작 중인지 여부를 나타낸다. 만약
   활성 프로브(liveness probe)에 실패한다면, kubelet은 컨테이너를 죽이고, 해당 컨테이너는
   [재시작 정책](#재시작-정책)의 대상이 된다. 만약 컨테이너가
   활성 프로브를 제공하지 않는 경우, 기본 상태는 `Success`이다.

* `readinessProbe`는 컨테이너가 요청을 처리할 준비가 되었는지 여부를 나타낸다.
   만약 준비성 프로브(readiness probe)가 실패한다면, 엔드포인트 컨트롤러는
   파드에 연관된 모든 서비스들의 엔드포인트에서 파드의 IP주소를 제거한다. 준비성 프로브의
   초기 지연 이전의 기본 상태는 `Failure`이다. 만약 컨테이너가 준비성 프로브를
   지원하지 않는다면, 기본 상태는 `Success`이다.

### 언제 활성 또는 준비성 프로브를 사용해야 하는가?

만약 컨테이너 속 프로세스가 어떠한 이슈에 직면하거나 건강하지 못한
상태(unhealthy)가 되는 등 프로세스 자체의 문제로 중단될 수 있더라도, 활성 프로브가
반드시 필요한 것은 아니다. 그 경우에는 kubelet이 파드의 `restartPolicy`에
따라서 올바른 대처를 자동적으로 수행할 것이다.

프로브가 실패한 후 컨테이너가 종료되거나 재시작되길 원한다면, 활성 프로브를
지정하고, `restartPolicy`를 항상(Always) 또는 실패 시(OnFailure)로 지정한다.

프로브가 성공한 경우에만 파드에 트래픽 전송을 시작하려고 한다면, 준비성 프로브를 지정하길 바란다.
이 경우에서는, 준비성 프로브가 활성 프로브와 유사해 보일 수도 있지만,
스팩에 준비성 프로브가 존재한다는 것은 파드가 트래픽을 받지 않는 상태에서
시작되고 프로브가 성공하기 시작한 이후에만 트래픽을 받는다는 뜻이다.
만약 컨테이너가 대량의 데이터, 설정 파일들,
또는 시동 중 마그레이션을 처리해야 한다면, 준비성 프로브를 지정하길 바란다.

만약 당신의 컨테이너가 유지 관리를 위해서 자체 중단되게 하려면,
준비성 프로브를 지정하길 바란다.
준비성 프로브는 활성 프로브와는 다르게 준비성에 특정된 엔드포인트를 확인한다.

파드가 삭제될 때 단지 요청들이 흘려 보낼(drain) 목적으로,
준비성 프로브가 필요하지는 않다는 점을 유념해야한다. 삭제 시에, 파드는
프로브의 존재 여부와 무관하게 자동으로 스스로를 준비되지 않은 상태(unready)로 변경한다.
파드는 파드 내의 모든 컨테이너들이 중지될 때까지 준비되지 않은 상태로
남아있는다.

활성 프로브 및 준비성 프로브를 설정하는 방법에 대한 추가적인 정보는,
[활성 프로브 및 준비성 프로브 설정하기](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)를 참조하면 된다.

## 파드 및 컨테이너 상태

파드 및 컨테이너 상태에 대한 자세한 정보는,
[PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core) 및
[ContainerStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#containerstatus-v1-core)를 참조하면 된다.
파드의 상태로서 보고되는 정보는
현재의 [ContainerState](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#containerstatus-v1-core)에
의존적이라는 점에 유의하길 바란다.

## 컨테이너 상태

일단 스케줄러가 파드를 노드에 할당하면, kubelet이 컨테이너 런타임으로 컨테이너를 만들기 시작한다. 컨테이너에 세 가지 상태가 있는데, Waiting, Running, 그리고 Terminated이다. 컨테이너의 상태를 체크하려면 `kubectl describe pod [POD_NAME]` 명령을 사용할 수 있다. 상태는 파드 안에 있는 컨테이너 각각에 대해 출력된다.

* `Waiting`: 컨테이너의 기본 상태이다. 컨테이너가 Running 이나 Terminated 상태가 아닌 경우, Waiting 상태이다. Waiting 상태의 컨테이너는 이미지를 내려받거나(pull), 시크릿을 적용하는 등의 필요한 오퍼레이션이 수행 중인 상태이다. 이 상태와 더불어서, 더 자세한 정보를 제공하기 위해 상태에 대한 메시지와 이유가 출력된다.

    ```yaml
   ...
      State:          Waiting
       Reason:       ErrImagePull
	  ...
   ```

* `Running`: 컨테이너가 이슈 없이 구동된다는 뜻이다. 컨테이너가 Running 상태가 되면, `postStart` 훅이 (존재한다면) 실행된다. 이 상태는 컨테이너가 언제 Running 상태에 돌입한 시간도 함께 출력된다.

   ```yaml
   ...
      State:          Running
       Started:      Wed, 30 Jan 2019 16:46:38 +0530
   ...
   ```

* `Terminated`:  컨테이너가 실행이 완료되어 구동을 멈추었다는 뜻이다. 컨테이너가 성공적으로 작업을 완료했을 때나 어떤 이유에서 실패했을 때 이 상태가 된다. 원인과 종료 코드(exit code)가 컨테이너의 시작과 종료 시간과 함께 무조건 출력된다.
  컨테이너가 Terminated 상태가 되기 전에, `preStop` 훅이 (존재한다면) 실행된다.

   ```yaml
   ...
      State:          Terminated
        Reason:       Completed
        Exit Code:    0
        Started:      Wed, 30 Jan 2019 11:45:26 +0530
        Finished:     Wed, 30 Jan 2019 11:45:26 +0530
    ...
   ```

## 파드의 준비성 게이트(readiness gate)

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

파드의 준비성에 대한 확장성을 추가하기 위해서
추가적인 피드백이나 신호를 `PodStatus`에 주입하는 방법인,
[파드 준비++](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/0007-pod-ready%2B%2B.md)라는 특징이 쿠버네티스 1.11에서 소개되었다.
파드의 준비성을 평가하기 위한 추가적인 조건들을 `PodSpec` 내의 새로운 `ReadinessGate` 필드를
통해서 지정할 수 있다. 만약 쿠버네티스가 `status.conditions` 필드에서 해당하는
조건을 찾지 못한다면, 그 조건의 상태는
기본 값인 "`False`"가 된다. 아래는 한 예제를 보여준다.

```yaml
Kind: Pod
...
spec:
  readinessGates:
    - conditionType: "www.example.com/feature-1"
status:
  conditions:
    - type: Ready  # 이것은 내장된 PodCondition이다
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
    - type: "www.example.com/feature-1"   # 추가적인 PodCondition
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
  containerStatuses:
    - containerID: docker://abcd...
      ready: true
...
```

파드의 새로운 조건들은
쿠버네티스의 [레이블 키 포멧](/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set)을 준수해야 한다.
`kubectl patch` 명령어가 오브젝트 상태 패치(patching)를 아직 제공하지 않기 때문에,
새로운 파드 조건들은 [KubeClient 라이브러리](/docs/reference/using-api/client-libraries/)를 통한 `PATCH` 액션을 통해서 주입되어야 한다.

새로운 파드 조건들이 적용된 경우, 파드는 **오직**
다음 두 문장이 모두 참일 때만 준비 상태로 평가된다.

* 파드 내의 모든 컨테이너들이 준비 상태이다.
* `ReadinessGates`에 지정된 모든 조건들이 "`True`"이다.

파드 준비성 평가에 대한 변경을 촉진하기 위해서,
이전 파드 조건인 `Ready`를 포착하기 위한 새로운 파드 조건 `ContainersReady`가 소개되었다.

K8s 1.11에서, 알파 특징으로서, "파드 준비++" 특징을 사용하기 위해서는
[특징 게이트](/docs/reference/command-line-tools-reference/feature-gates/)의 `PodReadinessGates`를
참으로 설정함으로써 명시적으로 활성화해야 한다.

K8s 1.12에서는, 해당 특징이 기본으로 활성화되어 있다.

## 재시작 정책

PodSpec은 항상(Always), 실패 시(OnFailure), 절대 안 함(Never) 값으로 설정 가능한 `restartPolicy` 필드를 가지고 있다.
기본 값은 항상(Always)이다.
`restartPolicy`는 파드 내의 모든 컨테이너들에 적용된다. `restartPolicy`는
같은 노드에 있는 kubelet에 의한 컨테이너들의 재시작에만 관련되어 있다.
kubelet에 의해서 재시작되는 종료된 컨테이너는
5분으로 제한된 지수 백-오프 지연(10초, 20초, 40초 ...)을 기준으로 재시작되며,
10분의 성공적 실행 후에 재설정된다.
[파드 문서](/docs/user-guide/pods/#durability-of-pods-or-lack-thereof)에서 의논된 바와 같이,
파드는 일단 한 노드에 바운드되고 나면, 다른 노드에 다시 바운드되지 않는다.


## 파드의 일생(lifetime)

일반적으로, 파드는 누군가 파드를 파괴할 때까지 사라지지 않는다.
그것은 주로 사람이나 컨트롤러에 의해서 일어난다.
이 법칙에 대한 유일한 예외는 일정 기간(마스터의 `terminated-pod-gc-threshold`에 의해 결정되는)
이상 파드의 `phase`가 Succeeded 또는 Failed라서 파드가 만료되고 자동적으로 파괴되는 경우이다.

세 가지 유형의 컨트롤러를 사용할 수 있다.

- 배치 연산과 같이, 종료가 예상되는 파드를 위해서는 [잡](/docs/concepts/jobs/run-to-completion-finite-workloads/)을
  사용하길 바란다. 잡은 `restartPolicy`가 실패 시(OnFailure) 또는 절대 안 함(Never)으로
  지정된 경우에 적합하다.

- 웹 서버와 같이, 종료가 예상되지 않는 파드에 대해서는
  [레플리케이션 컨트롤러](/docs/concepts/workloads/controllers/replicationcontroller/),
  [레플리카 셋](/docs/concepts/workloads/controllers/replicaset/), 또는
  [디플로이먼트](/docs/concepts/workloads/controllers/deployment/)를 사용하길 바란다.
  레플리케이션 컨트롤러는 `restartPolicy`가 항상(Always)으로 지정된
  경우에만 적합하다.

- 머신 당 하나씩 실행해야하는 파드를 위해서는 [데몬 셋](/docs/concepts/workloads/controllers/daemonset/)을 사용하길
  바란다. 왜냐하면 데몬 셋은 특정 머신 전용 시스템 서비스(machine-specific system service)를 제공하기 때문이다.

세 가지 모든 컨트롤러 유형은 PodTemplate을 가지고 있다. 파드를
직접적으로 생성하는 것 보다는, 적절한 컨트롤러를 생성하고 컨트롤러가 파드를
생성하도록 하는 것이 추천된다. 그 이유는 파드
혼자서는 머신의 실패에 탄력적(resilient)이지 않지만, 컨트롤러는 탄력적이기 때문이다.

만약 노드가 죽거나 다른 클러스터의 다른 노드들로부터 연결이 끊기면, 쿠버네티스는
잃어버린 노드에 있는 모든 파드의 `phase`를 실패된(Failed)으로 설정하는 정책을 적용한다.

## 예제

### 고급 활성 프로브 예제

활성 프로브는 kubelet에 의해서 실행된다. 따라서 모든 요청은
kubelet 네트워크 네임스페이스에서 이루어진다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    test: liveness
  name: liveness-http
spec:
  containers:
  - args:
    - /server
    image: k8s.gcr.io/liveness
    livenessProbe:
      httpGet:
        # "host"가 정의되지 않은 경우, "PodIP" 가 사용될 것이다.
        # host: my-host
        # "scheme"이 정의되지 않은 경우, "HTTP" 스키마가 사용될 것이다. "HTTP"와 "HTTPS"만 허용된다.
        # scheme: HTTPS
        path: /healthz
        port: 8080
        httpHeaders:
        - name: X-Custom-Header
          value: Awesome
      initialDelaySeconds: 15
      timeoutSeconds: 1
    name: liveness
```

### 상태 예제

   * 파드가 동작 중이고 하나의 컨테이너를 가지고 있다. 컨테이너는 성공으로 종료됐다.
     * 완료 이벤트를 기록한다.
     * 만약 `restartPolicy`가 :
       * 항상(Always)이면: 컨테이너는 재시작되고, 파드의 `phase`는 Running으로 유지된다.
       * 실패 시(OnFailure)이면: 파드의 `phase`는 Succeeded가 된다.
       * 절대 안 함(Never)이면: 파드의 `phase`는 Succeeded가 된다.

   * 파드가 동작 중이고 하나의 컨테이너를 가지고 있다. 컨테이너는 실패로 종료됐다.
     * 실패 이벤트를 기록한다.
     * 만약 `restartPolicy`가 :
       * 항상(Always)이면: 컨테이너는 재시작되고, 파드의 `phase`는 Running으로 유지된다.
       * 실패 시(OnFailure)이면: 컨테이너는 재시작되고, 파드의 `phase`는 Running으로 유지된다.
       * 절대 안 함(Never)이면: 파드의 `phase`는 Failed가 된다.

   * 파드가 동작 중이고 두 개의 컨테이너를 가지고 있다. 컨테이너 1이 실패로 종료됐다.
     * 실패 이벤트를 기록한다.
     * 만약 `restartPolicy`가 :
       * 항상(Always)이면: 컨테이너는 재시작되고, 파드의 `phase`는 Running으로 유지된다.
       * 실패 시(OnFailure)이면: 컨테이너는 재시작되고, 파드의 `phase`는 Running으로 유지된다.
       * 절대 안 함(Never)이면: 컨테이너는 재시작되지 않고, 파드의 `phase`는 Running으로 유지된다.
     * 만약 컨테이너 1이 동작 중이 아니고, 컨테이너 2가 종료됐다면 :
       * 실패 이벤트를 기록한다.
       * 만약 `restartPolicy`가 :
         * 항상(Always)이면: 컨테이너는 재시작되고, 파드의 `phase`는 Running으로 유지된다.
         * 실패 시(OnFailure)이면: 컨테이너는 재시작되고, 파드의 `phase`는 Running으로 유지된다.
         * 절대 안 함(Never)이면: 파드의 `phase`는 Failed가 된다.

   * 파드는 동작 중이고 하나의 컨테이너를 가지고 있다. 컨테이너의 메모리가 부족하다.
     * 컨테이너는 실패로 종료된다.
     * 메모리 부족(OOM) 이벤트를 기록한다.
     * 만약 `restartPolicy`가 :
       * 항상(Always)이면: 컨테이너는 재시작되고, 파드의 `phase`는 Running으로 유지된다.
       * 실패 시(OnFailure)이면: 컨테이너는 재시작되고, 파드의 `phase`는 Running으로 유지된다.
       * 절대 안 함(Never)이면: 로그 실패 이벤트가 발생되고, 파드의 `phase`는 Failed가 된다.

   * 파드 동작 중에, 디스크가 죽었다.
     * 모든 컨테이너들을 죽인다.
     * 적절한 이벤트를 기록한다.
     * 파드의 `phase`는 Failed가 된다.
     * 만약 컨트롤러로 실행되었다면, 파드는 어딘가에서 재생성된다.

   * 파드 동작 중에, 파드가 있는 노드가 세그먼티드 아웃되었다.
     * 노드 컨트롤러가 타임아웃을 기다린다.
     * 노드 컨트롤러가 파드의 `phase`를 Failed로 설정한다.
     * 만약 컨트롤러로 실행되었다면, 파드는 어딘가에서 재생성된다.

{{% /capture %}}


{{% capture whatsnext %}}

* Hands-on 경험하기
  [컨테이너 라이프사이클 이벤트에 핸들러 부착하기](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).

* Hands-on 경험하기
  [활성 및 준비성 프로브 설정하기](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/).

* [컨테이너 라이프사이클 후크(hook)](/docs/concepts/containers/container-lifecycle-hooks/)에 대해 더 배우기.

{{% /capture %}}



