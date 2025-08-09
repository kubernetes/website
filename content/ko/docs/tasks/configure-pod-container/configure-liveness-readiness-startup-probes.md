---
title: 활성(Liveness), 준비성(Readiness), 시작(Startup) 프로브 구성
content_type: task
weight: 140
---

<!-- overview -->

이 페이지는 컨테이너에 대해 활성, 준비성, 시작 프로브를 구성하는 방법을 보여준다.

프로브에 대한 자세한 정보는 [활성, 준비성 그리고 시작 프로브](/docs/concepts/configuration/liveness-readiness-startup-probes)를 참고한다.

[kubelet](/docs/reference/command-line-tools-reference/kubelet/)은 활성 프로브를 사용해 컨테이너를
언제 재시작해야 할지를 판단한다. 예를 들어, 
애플리케이션이 실행 중이지만 진행이 불가능한 교착 상태(deadlock)에 빠진 경우 활성 
프로브가 이를 감지할 수 있다. 이런 상태에서 컨테이너를 재시작하면 버그가 있어도 
애플리케이션의 가용성을 높일 수 있다. 

활성 프로브의 일반적인 패턴은 준비성 프로브에서 사용되는 저비용 HTTP 엔드포인트를 동일하게 사용하되, 
failureThreshold를 더 높게 설정하는 것이다. 이렇게 하면 파드가 
실제로 강제 종료되기 전에 일정 시간 동안 준비되지 않은(not-ready) 상태로 관찰된다.

kubelet은 준비성 프로브를 사용해 컨테이너가 
트래픽을 받을 준비가 되었는지를 판단한다. 이 신호의 한 가지 사용 예시는 어떤 파드가 
서비스의 백엔드로 사용될지를 제어하는 것이다. 파드의 `Ready`[조건](/ko/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)이 
true일 때 해당 파드는 준비된 것으로 간주된다. 파드가 준비되지 않은 경우 서비스 로드 밸런서에서 제거된다.
파드의 `Ready` 상태는, 파드가 위치한 노드의 `Ready` 조건이 true가 아니거나,
파드의 `readinessGates` 중 하나가 false이거나, 컨테이너 중 하나 이상이 준비되지 않은 경우,
false가 된다.

kubelet은 시작 프로브를 사용해 컨테이너 애플리케이션이 시작되었는지를 판단한다. 
시작 프로브가 구성되어 있으면, 시작 프로브가 성공할 때까지 활성 및 준비성 프로브가 시작되지 않으므로 
해당 프로브들이 애플리케이션 시작을 방해하지 않는다. 
이는 느리게 시작하는 컨테이너에서 활성 검사를 채택하여, 시작되어 실행되기 전에 
kubelet에 의해 종료되는 것을 방지하는 데 사용할 수 있다.

{{< caution >}}
활성 프로브는 애플리케이션 장애에서 복구하는 강력한 방법이 될 수 있지만, 
신중하게 사용해야 한다. 활성 프로브는 교착 상태와 같은 복구 불가능한 애플리케이션 장애를 
정말로 나타내는지 확인할 수 있도록 신중하게 구성되어야 한다.
{{< /caution >}}

{{< note >}}
활성 프로브의 잘못된 구현은 연쇄적인 장애를 유발할 수 있다. 이는 높은 부하 하에서 컨테이너 재시작, 
애플리케이션의 확장성 저하로 인한 클라이언트 요청 실패, 일부 실패한 파드로 인한 
나머지 파드의 워크로드 증가를 초래한다. 
준비성 프로브와 활성 프로브의 차이점과 애플리케이션에 언제 적용해야 하는지 이해가 필요하다.
{{< /note >}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## 활성 명령어 정의

오랜 시간 실행되는 많은 애플리케이션은 결국 장애 상태로 전환되어 
재시작하지 않고는 복구할 수 없게 된다. 쿠버네티스는 이러한 상황을 
감지하고 해결하기 위해 활성 프로브를 제공한다.

이 실습에서는 `registry.k8s.io/busybox:1.27.2` 이미지를 기반으로 하는 
컨테이너를 실행하는 파드를 생성한다. 다음은 파드의 구성 파일이다.

{{% code_sample file="pods/probe/exec-liveness.yaml" %}}

구성 파일을 보면 파드에 단일 `Container`가 있다. 
`periodSeconds` 필드는 kubelet이 5초마다 
활성 프로브를 수행해야 함을 지정한다. `initialDelaySeconds` 필드는 
kubelet이 첫 번째 프로브를 수행하기 전에 5초를 기다려야 함을 알려준다. 프로브를 수행하기 위해 
kubelet은 대상 컨테이너에서 `cat /tmp/healthy` 명령을 실행한다. 명령이 성공하면 
0을 반환하고, kubelet은 컨테이너가 살아있고 
정상 동작 상태라고 간주한다. 명령이 0이 아닌 값을 반환하면 
kubelet은 컨테이너를 종료하고 재시작한다.

컨테이너가 시작될 때 다음 명령을 실행한다.

```shell
/bin/sh -c "touch /tmp/healthy; sleep 30; rm -f /tmp/healthy; sleep 600"
```

컨테이너 수명의 첫 30초 동안 `/tmp/healthy` 파일이 존재한다. 
따라서 첫 30초 동안 `cat /tmp/healthy` 명령은 
성공 코드를 반환한다. 30초 후에 `cat /tmp/healthy`는 실패 코드를 반환한다.

파드를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/exec-liveness.yaml
```

30초 내에 파드 이벤트를 확인한다.

```shell
kubectl describe pod liveness-exec
```

출력은 아직 활성 프로브가 실패하지 않았음을 나타낸다.

```none
Type    Reason     Age   From               Message
----    ------     ----  ----               -------
Normal  Scheduled  11s   default-scheduler  Successfully assigned default/liveness-exec to node01
Normal  Pulling    9s    kubelet, node01    Pulling image "registry.k8s.io/busybox:1.27.2"
Normal  Pulled     7s    kubelet, node01    Successfully pulled image "registry.k8s.io/busybox:1.27.2"
Normal  Created    7s    kubelet, node01    Created container liveness
Normal  Started    7s    kubelet, node01    Started container liveness
```

35초 후에 파드 이벤트를 다시 확인한다.

```shell
kubectl describe pod liveness-exec
```

출력 하단에 활성 프로브가 실패했고, 
실패한 컨테이너가 종료되고 재생성되었음을 나타내는 메시지가 있다.

```none
Type     Reason     Age                From               Message
----     ------     ----               ----               -------
Normal   Scheduled  57s                default-scheduler  Successfully assigned default/liveness-exec to node01
Normal   Pulling    55s                kubelet, node01    Pulling image "registry.k8s.io/busybox:1.27.2"
Normal   Pulled     53s                kubelet, node01    Successfully pulled image "registry.k8s.io/busybox:1.27.2"
Normal   Created    53s                kubelet, node01    Created container liveness
Normal   Started    53s                kubelet, node01    Started container liveness
Warning  Unhealthy  10s (x3 over 20s)  kubelet, node01    Liveness probe failed: cat: can't open '/tmp/healthy': No such file or directory
Normal   Killing    10s                kubelet, node01    Container liveness failed liveness probe, will be restarted
```

30초를 더 기다린 후 컨테이너가 재시작되었는지 확인한다.

```shell
kubectl get pod liveness-exec
```

출력은 `RESTARTS`가 증가했음을 보여준다. `RESTARTS` 카운터는 
실패한 컨테이너가 실행 상태로 돌아오자마자 증가한다는 점에 유의한다.

```none
NAME            READY     STATUS    RESTARTS   AGE
liveness-exec   1/1       Running   1          1m
```

## liveness HTTP 요청 정의

또 다른 종류의 활성 프로브는 HTTP GET 요청을 사용한다. 다음은 
`registry.k8s.io/e2e-test-images/agnhost` 이미지를 기반으로 하는 컨테이너를 실행하는 파드의 구성 파일이다.

{{% code_sample file="pods/probe/http-liveness.yaml" %}}

구성 파일을 보면 파드에 단일 컨테이너가 있다. 
`periodSeconds` 필드는 kubelet이 3초마다 활성 프로브를 
수행해야 함을 지정한다. `initialDelaySeconds` 필드는 kubelet이 
첫 번째 프로브를 수행하기 전에 3초를 기다려야 함을 알려준다. 프로브를 수행하기 위해 
kubelet은 컨테이너에서 실행되고 
포트 8080에서 수신하는 서버에 HTTP GET 요청을 보낸다. 서버의 `/healthz` 경로에 
대한 핸들러가 성공 코드를 반환하면 kubelet은 컨테이너가 살아있고 
`healthy` 상태라고 간주한다. 핸들러가 실패 코드를 반환하면 
kubelet은 컨테이너를 종료하고 재시작한다.

200 이상 400 미만의 모든 코드는 성공을 나타낸다. 다른 
모든 코드는 실패를 나타낸다.

[server.go](https://github.com/kubernetes/kubernetes/blob/master/test/images/agnhost/liveness/server.go)에서 
서버의 소스 코드를 확인할 수 있다.

컨테이너가 살아있는 첫 10초 동안 `/healthz` 핸들러는 
상태 200을 반환한다. 그 후 핸들러는 상태 500을 반환한다.

```go
http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
    duration := time.Now().Sub(started)
    if duration.Seconds() > 10 {
        w.WriteHeader(500)
        w.Write([]byte(fmt.Sprintf("error: %v", duration.Seconds())))
    } else {
        w.WriteHeader(200)
        w.Write([]byte("ok"))
    }
})
```

kubelet은 컨테이너 시작 3초 후에 상태 검사(health check)를 시작한다. 
따라서 처음 몇 번의 상태 검사는 성공한다. 하지만 10초 후에는 상태 검사가 
실패하고, kubelet이 컨테이너를 종료하고 재시작한다.

HTTP 활성 검사를 시도하려면 파드를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/http-liveness.yaml
```

10초 후에 파드 이벤트를 확인하여 활성 프로브가 실패하고 
컨테이너가 재시작되었는지 확인한다.

```shell
kubectl describe pod liveness-http
```

v1.13 이후 릴리스에서는 로컬 HTTP 프록시 환경 변수 설정이 
HTTP 활성 프로브에 영향을 주지 않는다.

## TCP 활성 프로브 정의

세 번째 유형의 활성 프로브는 TCP 소켓을 사용한다. 이 구성을 사용하면 
kubelet이 지정된 포트에서 컨테이너에 대한 소켓을 열려고 시도한다. 
연결을 설정할 수 있으면 컨테이너가 `healthy` 상태로 간주되고, 
그렇지 않으면 실패로 간주된다.

{{% code_sample file="pods/probe/tcp-liveness-readiness.yaml" %}}

보다시피 TCP 검사 구성은 HTTP 검사와 매우 유사하다. 
이 예제는 준비성 프로브와 활성 프로브를 모두 사용한다. kubelet은 
컨테이너가 시작된 후 15초 후에 첫 번째 활성 프로브를 실행한다. 이는 
포트 8080에서 `goproxy` 컨테이너에 연결을 시도한다. 활성 프로브가 실패하면 
컨테이너가 재시작된다. kubelet은 10초마다 이 검사를 
계속 실행한다.

활성 프로브 외에도 이 구성에는 준비성  
프로브가 포함된다. kubelet은 컨테이너가 시작된 후 15초 후에 
첫 번째 준비성 프로브를 실행한다. 활성 프로브와 마찬가지로 
포트 8080에서 `goproxy` 컨테이너에 연결을 시도한다. 프로브가 성공하면 파드가 
준비됨으로 표시되고 서비스에서 트래픽을 받는다. 준비성 프로브가 
실패하면 파드는 준비되지 않음으로 표시되고, 어떤 서비스에서도 
트래픽을 받지 않는다.

TCP 활성 검사를 시도하려면 파드를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/tcp-liveness-readiness.yaml
```

15초 후에 파드 이벤트를 확인하여 활성 프로브를 확인한다.

```shell
kubectl describe pod goproxy
```

## gRPC liveness 프로브 정의

{{< feature-state for_k8s_version="v1.27" state="stable" >}}

애플리케이션이 
[gRPC Health Checking Protocol](https://github.com/grpc/grpc/blob/master/doc/health-checking.md)을 구현하는 경우, 
이 예제는 애플리케이션 활성 검사에 대해 쿠버네티스가 이를 사용하도록 구성하는 방법을 보여준다. 
마찬가지로 준비성 및 시작 프로브를 구성할 수 있다.

다음은 예제 매니페스트 파일이다.

{{% code_sample file="pods/probe/grpc-liveness.yaml" %}}

gRPC 프로브를 사용하려면 `port`를 구성해야 한다. 다른 유형의 프로브와 다른 기능에 대한 프로브를 구별하려면 
`service` 필드를 사용할 수 있다. 
`service`를 `liveness` 값으로 설정하고 gRPC Health Checking 엔드포인트가 
`service`를 `readiness`로 설정했을 때와 다르게 이 요청에 응답하도록 할 수 있다. 
이를 통해 두 개의 다른 포트에서 수신하는 대신 다양한 종류의 컨테이너 상태 확인에 
동일한 엔드포인트를 사용할 수 있다. 
자체 사용자 정의 서비스 이름을 지정하고 프로브 유형도 지정하려면, 
쿠버네티스 프로젝트에서 이들을 연결하는 이름을 사용하는 
것을 권장한다. 예시: `myservice-liveness`(`-`를 구분자로 사용).

{{< note >}}
HTTP 또는 TCP 프로브와 달리 이름으로 health check 포트를 지정할 수 없고 
사용자 정의 호스트명을 구성할 수도 없다.
{{< /note >}}

구성 문제(예: 잘못된 포트 또는 서비스, 구현되지 않은 health checking 프로토콜)는 
HTTP 및 TCP 프로브와 마찬가지로 프로브 실패로 간주된다.

gRPC 활성 검사를 시도하려면 아래 명령을 사용하여 파드를 생성한다. 
아래 예제에서 etcd 파드는 gRPC 활성 프로브를 사용하도록 구성된다.

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/grpc-liveness.yaml
```

15초 후에 파드 이벤트를 확인하여 활성 검사가 실패하지 않았는지 확인한다.

```shell
kubectl describe pod etcd-with-grpc
```

gRPC 프로브를 사용할 때 유의해야 할 몇 가지 기술적 세부 사항이 있다.

- 프로브는 파드 IP 주소 또는 호스트명에 대해 실행된다. 
  파드의 IP 주소에서 수신하도록 gRPC 엔드포인트를 구성해야 한다.
- 프로브는 인증 매개변수(`-tls`와 같은)를 지원하지 않는다.
- 내장 프로브에 대한 오류 코드는 없다. 모든 오류는 프로브 실패로 간주된다.
- `ExecProbeTimeout` 기능 게이트가 `false`로 설정되어 있으면, grpc-health-probe는
  `timeoutSeconds` 설정(기본값 1초)을 준수하지 **않지만**, 내장 프로브는 시간 초과 시 실패한다.

## 명명된 포트 사용

HTTP 및 TCP 프로브에 명명된 [`port`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#ports)를 
사용할 수 있다. gRPC 프로브는 명명된 포트를 지원하지 않는다.

예시:

```yaml
ports:
- name: liveness-port
  containerPort: 8080

livenessProbe:
  httpGet:
    path: /healthz
    port: liveness-port
```

## 시작 프로브로 느리게 시작하는 컨테이너 보호 {#define-startup-probes}

때로는 첫 번째 초기화에서 추가 시작 시간이 필요한 
애플리케이션을 다뤄야 하는 경우가 있다. 이런 경우 이러한 프로브를 
동기화한 교착 상태에 대한 빠른 응답을 손상시키지 않고 활성 프로브 매개변수를 설정하는 것이 
까다로울 수 있다. 해결책은 동일한 명령, 
HTTP 또는 TCP 검사로 시작 프로브를 설정하되, `failureThreshold * periodSeconds`가 
최악의 시작 시간을 커버할 수 있을 만큼 충분히 길게 설정하는 것이다.

따라서 이전 예제는 다음과 같이 된다.

```yaml
ports:
- name: liveness-port
  containerPort: 8080

livenessProbe:
  httpGet:
    path: /healthz
    port: liveness-port
  failureThreshold: 1
  periodSeconds: 10

startupProbe:
  httpGet:
    path: /healthz
    port: liveness-port
  failureThreshold: 30
  periodSeconds: 10
```

시작 프로브 덕분에 애플리케이션은 시작을 완료하기 위해 최대 5분
(30 * 10 = 300s)을 갖게 된다. 
시작 프로브가 한 번 성공하면 활성 프로브가 인계받아 
컨테이너 교착 상태에 대한 빠른 응답을 제공한다. 
시작 프로브가 계속 실패하면 컨테이너는 300초 후에 종료되고 
파드의 `restartPolicy`에 따라 처리된다.

## 준비성 프로브 정의

때로는 애플리케이션이 일시적으로 트래픽을 처리할 수 없다. 
예를 들어, 애플리케이션이 시작 중에 대용량 데이터나 구성 파일을 로드해야 하거나 
시작 후 외부 서비스에 의존해야 할 수 있다. 
이런 경우에는 애플리케이션을 종료하고 싶지도 않고 
요청을 보내고 싶지도 않다. 쿠버네티스는 이러한 
상황을 감지하고 완화하기 위해 준비성 프로브를 제공한다. 준비되지 않은 것으로 
보고하는 컨테이너가 있는 파드는 쿠버네티스 서비스를 통해 
트래픽을 받지 않는다.

{{< note >}}
준비성 프로브는 전체 수명 주기 동안 컨테이너에서 실행된다.
{{< /note >}}

{{< caution >}}
준비성 프로브와 활성 프로브는 성공하기 위해 서로 의존하지 않는다. 
준비성 프로브를 실행하기 전에 기다리려면 
`initialDelaySeconds` 또는 `startupProbe`를 사용해야 한다.
{{< /caution >}}

준비성 프로브는 활성 프로브와 유사하게 구성된다. 유일한 차이점은 
`livenessProbe` 필드 대신 `readinessProbe` 필드를 사용한다는 것이다.

```yaml
readinessProbe:
  exec:
    command:
    - cat
    - /tmp/healthy
  initialDelaySeconds: 5
  periodSeconds: 5
```

HTTP 및 TCP 준비성 프로브 구성도 활성 프로브와 
동일하게 유지된다.

준비성 프로브와 활성 프로브는 동일한 컨테이너에서 병렬로 사용할 수 있다. 
둘 다 사용하면 트래픽이 준비되지 않은 컨테이너에 도달하지 않고, 
컨테이너가 실패할 때 재시작되도록 보장할 수 있다.

## 프로브 구성

<!--Eventually, some of this section could be moved to a concept topic.-->

[Probes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#probe-v1-core)에는 
시작, 활성, 준비성 검사의 동작을 더 정확하게 제어하는 데 사용할 수 있는 
여러 필드가 있다.

* `initialDelaySeconds`: 컨테이너가 시작된 후 시작, 
  활성 또는 준비성 프로브가 시작되기까지의 초 수, 시작 프로브가 정의되어 있으면, 
  시작 프로브가 성공할 때까지 활성 및 준비성 프로브 지연이 시작되지 않는다. `periodSeconds` 값이 
  `initialDelaySeconds` 보다 크면 `initialDelaySeconds`는 
  무시된다. 기본값은 0초, 최솟값은 0이다.
* `periodSeconds`: 프로브를 수행하는 빈도(초). 기본값은 10초, 
  최솟값은 1이다. 
  컨테이너가 Ready 상태가 아닌 동안, `ReadinessProbe`는 
  구성된 `periodSeconds` 간격이 아닌 다른 시점에 실행될 수 있다. 이는 파드를 더 빠르게 준비 상태로 만들기 위함이다.
* `timeoutSeconds`: 프로브가 시간 초과되는 초 수. 
  기본값은 1초, 최솟값은 1이다.
* `successThreshold`: 실패 후 프로브가 성공한 것으로 간주되는 
  최소 연속 성공 횟수. 기본값은 1이다. 활성 및 시작 프로브의 경우 1이어야 한다. 
  최솟값은 1이다.
* `failureThreshold`: 프로브가 `failureThreshold`번 연속으로 실패한 후, 쿠버네티스는 
  전체 검사가 실패한 것으로 간주한다: 컨테이너가 준비되지 않음(not ready)/건강하지 않음(not healthy)/살아있지 않음(not live). 
  기본값은 3, 최솟값은 1이다. 
  시작 또는 활성 프로브의 경우, 최소 `failureThreshold`개의 프로브가 
  실패하면 쿠버네티스는 컨테이너를 건강하지 않은 것으로 취급하고 해당 특정 컨테이너에 대한 
  재시작을 트리거한다. kubelet은 해당 컨테이너에 대한 `terminationGracePeriodSeconds` 
  설정을 준수한다. 
  실패한 준비성 프로브의 경우, kubelet은 검사에 실패한 컨테이너를 계속 실행하고, 
  더 많은 프로브도 계속 실행한다; 검사가 실패했기 때문에 kubelet은 
  파드의 `Ready` [상태](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)를 
  `false`로 설정한다. 
* `terminationGracePeriodSeconds`: 실패한 컨테이너의 종료를 트리거하는 것과 
  컨테이너 런타임이 해당 컨테이너를 강제로 중지하는 것 사이에 kubelet이 
  대기할 유예 기간을 구성한다. 
  기본값은 파드 수준의 `terminationGracePeriodSeconds`값을 
  상속한다(지정되지 않은 경우 30초). 최솟값은 1이다. 
  자세한 내용은 [프로브 수준 `terminationGracePeriodSeconds`](#probe-level-terminationgraceperiodseconds)를 
  참조한다.

{{< caution >}}
준비성 프로브의 잘못된 구현은 컨테이너의 프로세스 수가 
계속 증가하고, 이를 방치하면 리소스 부족을 초래할 수 있다.
{{< /caution >}}

### HTTP 프로브

[HTTP 프로브](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#httpgetaction-v1-core)에는 
`httpGet`에서 설정할 수 있는 추가 필드가 있다:

* `host`: 연결할 호스트명, 기본값은 파드 IP이다. 대신 
  `httpHeaders`에서 "Host"를 설정하는 것이 좋다.
* `scheme`: 호스트에 연결하는 데 사용할 스키마(HTTP 또는 HTTPS)이다. 기본값은 "HTTP"이다.
* `path`: HTTP 서버에서 접근할 경로이다. 기본값은 "/"이다.
* `httpHeaders`: 요청에 설정할 사용자 정의 헤더이다. HTTP는 반복 헤더를 허용한다.
* `port`: 컨테이너에서 접근할 포트의 이름 또는 번호이다. 번호는 
  1부터 65535 범위여야 한다.

HTTP 프로브의 경우, kubelet은 
검사를 수행하기 위해 지정된 포트의 경로로 HTTP 요청을 보낸다. kubelet은 `httpGet`의 선택적 
`host` 필드로 주소가 재정의되지 않는 한 파드의 IP 주소로 프로브를 보낸다. `scheme` 필드가 
HTTPS로 설정되면, kubelet은 인증서 검증을 
건너뛰고 HTTPS 요청을 보낸다. 대부분의 시나리오에서는 `host` 필드를 설정하고 싶지 않을 것이다. 
다음은 설정하고 싶은 한 가지 시나리오이다. 컨테이너가 127.0.0.1에서 수신하고 
파드의 `hostNetwork` 필드가 true라고 가정한다. 그러면 `httpGet` 하위의 `host`는 
127.0.0.1로 설정되어야 한다. 파드가 가상 호스트에 의존한다면, 아마도 더 일반적인 
경우, `host`를 사용하지 말고 `httpHeaders`에서 `Host` 헤더를 설정해야 한다.

HTTP 프로브의 경우, kubelet은 필수 `Host` 헤더 외에 두 개의 요청 헤더를 보낸다.
- `User-Agent`: 기본값은 `kube-probe/{{< skew currentVersion >}}`이다. 
  여기서 `{{< skew currentVersion >}}`는 kubelet의 버전이다.
- `Accept`: 기본값은 `*/*`이다.

프로브에 대해 `httpHeaders`를 정의하여 기본 헤더를 재정의할 수 있다.
예시:

```yaml
livenessProbe:
  httpGet:
    httpHeaders:
      - name: Accept
        value: application/json

startupProbe:
  httpGet:
    httpHeaders:
      - name: User-Agent
        value: MyUserAgent
```

빈 값으로 정의하여 이 두 헤더를 제거할 수도 있다.

```yaml
livenessProbe:
  httpGet:
    httpHeaders:
      - name: Accept
        value: ""

startupProbe:
  httpGet:
    httpHeaders:
      - name: User-Agent
        value: ""
```

{{< note >}}
kubelet이 HTTP를 사용하여 파드를 프로브할 때, 리디렉션이 
동일한 호스트에 대한 것인 경우에만 리디렉션을 따른다. kubelet이 프로빙 중에 11개 이상의 리디렉션을 받으면 프로브는 성공한 것으로 간주되고 
관련 이벤트가 생성된다.

```none
Events:
  Type     Reason        Age                     From               Message
  ----     ------        ----                    ----               -------
  Normal   Scheduled     29m                     default-scheduler  Successfully assigned default/httpbin-7b8bc9cb85-bjzwn to daocloud
  Normal   Pulling       29m                     kubelet            Pulling image "docker.io/kennethreitz/httpbin"
  Normal   Pulled        24m                     kubelet            Successfully pulled image "docker.io/kennethreitz/httpbin" in 5m12.402735213s
  Normal   Created       24m                     kubelet            Created container httpbin
  Normal   Started       24m                     kubelet            Started container httpbin
 Warning  ProbeWarning  4m11s (x1197 over 24m)  kubelet            Readiness probe warning: Probe terminated redirects
```

kubelet이 요청과 다른 호스트명으로의 리디렉션을 받으면, 프로브의 결과는 성공한 것으로 취급되고 kubelet은 리디렉션 실패를 보고하는 이벤트를 생성한다.
{{< /note >}}

### TCP 프로브

TCP 프로브의 경우, kubelet은 파드가 아닌 노드에서 프로브 연결을 만들기 때문에 
kubelet이 해결할 수 없으므로 `host` 매개변수에서 서비스 이름을 
사용할 수 없다.

### 프로브 수준 `terminationGracePeriodSeconds`

{{< feature-state for_k8s_version="v1.28" state="stable" >}}

1.25 이상에서는 사용자가 프로브 사양의 일부로 프로브 수준 `terminationGracePeriodSeconds`를 
지정할 수 있다. 파드 수준과 프로브 수준 
`terminationGracePeriodSeconds`가 모두 설정되면, kubelet은 프로브 수준 값을 사용한다.

`terminationGracePeriodSeconds`를 설정할 때 다음 사항에 유의한다.

* kubelet은 파드에 있는 경우 항상 프로브 수준 `terminationGracePeriodSeconds` 필드를 
  준수한다.

* `terminationGracePeriodSeconds` 필드가 설정된 기존 파드가 있고 
  더 이상 프로브별 종료 유예 기간을 사용하지 않으려면, 
  해당 기존 파드를 삭제해야 한다.

예시:

```yaml
spec:
  terminationGracePeriodSeconds: 3600  # 파드 수준 
  containers:
  - name: test
    image: ...

    ports:
    - name: liveness-port
      containerPort: 8080

    livenessProbe:
      httpGet:
        path: /healthz
        port: liveness-port
      failureThreshold: 1
      periodSeconds: 60
      # 파드 수준 terminationGracePeriodSeconds 재정의 #
      terminationGracePeriodSeconds: 60
```

프로브 수준 `terminationGracePeriodSeconds`는 준비성 프로브에 대해 설정할 수 없다. 
API 서버에서 거부된다.

## {{% heading "whatsnext" %}}

* [컨테이너 프로브](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)에 대해 
  자세히 알아본다.

API 참조 또한 읽어볼 수 있다.

* [파드](/docs/reference/kubernetes-api/workload-resources/pod-v1/), 그리고 구체적으로:
  * [컨테이너(들)](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)
  * [프로브(들)](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Probe)

