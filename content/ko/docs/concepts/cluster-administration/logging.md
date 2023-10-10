---
# reviewers:
# - piosz
# - x13n
title: 로깅 아키텍처
content_type: concept
weight: 60
---

<!-- overview -->

애플리케이션 로그는 애플리케이션 내부에서 발생하는 상황을 이해하는 데 도움이 된다.
로그는 문제를 디버깅하고 클러스터 활동을 모니터링하는 데 특히 유용하다.
대부분의 최신 애플리케이션에는 일종의 로깅 메커니즘이 있다.
마찬가지로, 컨테이너 엔진들도 로깅을 지원하도록 설계되었다.
컨테이너화된 애플리케이션에 가장 쉽고 가장 널리 사용되는 로깅 방법은 표준 출력과 표준 에러 스트림에 작성하는 것이다.

그러나, 일반적으로 컨테이너 엔진이나 런타임에서 제공하는 기본 기능은
완전한 로깅 솔루션으로 충분하지 않다.

예를 들어, 컨테이너가 크래시되거나, 파드가 축출되거나, 노드가 종료된 경우에
애플리케이션의 로그에 접근하고 싶을 것이다.

클러스터에서 로그는 노드, 파드 또는 컨테이너와는 독립적으로
별도의 스토리지와 라이프사이클을 가져야 한다.
이 개념을 [클러스터-레벨 로깅](#cluster-level-logging-architectures)이라고 한다.  

클러스터-레벨 로깅은 로그를 저장, 분석, 쿼리하기 위해서는 별도의 백엔드가 필요하다.
쿠버네티스가 로그 데이터를 위한 네이티브 스토리지 솔루션을 제공하지는 않지만,
쿠버네티스에 통합될 수 있는 기존의 로깅 솔루션이 많이 있다.
아래 내용은 로그를 어떻게 처리하고 관리하는지 설명한다.

<!-- body -->

## 파드와 컨테이너 로그 {#basic-logging-in-kubernetes}

쿠버네티스는 실행중인 파드의 컨테이너에서 출력하는 로그를 감시한다.

아래 예시는, 초당 한 번씩 표준 출력에 텍스트를 기록하는
컨테이너를 포함하는 `파드` 매니페스트를 사용한다.

{{< codenew file="debug/counter-pod.yaml" >}}

이 파드를 실행하려면, 다음의 명령을 사용한다.

```shell
kubectl apply -f https://k8s.io/examples/debug/counter-pod.yaml
```

출력은 다음과 같다.

```console
pod/counter created
```

로그를 가져오려면, 다음과 같이 `kubectl logs` 명령을 사용한다.

```shell
kubectl logs counter
```

출력은 다음과 같다.

```console
0: Fri Apr  1 11:42:23 UTC 2022
1: Fri Apr  1 11:42:24 UTC 2022
2: Fri Apr  1 11:42:25 UTC 2022
```

`kubectl logs --previous` 를 사용해서 컨테이너의 이전 인스턴스에 대한 로그를 검색할 수 있다. 
파드에 여러 컨테이너가 있는 경우, 
다음과 같이 명령에 `-c` 플래그와 컨테이너 이름을 추가하여 접근하려는 컨테이너 로그를 지정해야 한다. 

```console
kubectl logs counter -c count
```

자세한 내용은 [`kubectl logs` 문서](/docs/reference/generated/kubectl/kubectl-commands#logs)를 참조한다.

### 노드가 컨테이너 로그를 처리하는 방법

![노드 레벨 로깅](/images/docs/user-guide/logging/logging-node-level.png)

컨테이너화된 애플리케이션의 `stdout(표준 출력)` 및 `stderr(표준 에러)` 스트림에 의해 생성된 모든 출력은 컨테이너 런타임이 처리하고 리디렉션 시킨다.
다양한 컨테이너 런타임들은 이를 각자 다른 방법으로 구현하였지만,
kubelet과의 호환성은 _CRI 로깅 포맷_ 으로 표준화되어 있다.

기본적으로 컨테이너가 재시작하는 경우, kubelet은 종료된 컨테이너 하나를 로그와 함께 유지한다.
파드가 노드에서 축출되면, 해당하는 모든 컨테이너와 로그가 함께 축출된다.

kubelet은 쿠버네티스의 특정 API를 통해 사용자들에게 로그를 공개하며,
일반적으로 `kubectl logs`를 통해 접근할 수 있다.

### 로그 로테이션

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

kubelet이 로그를 자동으로 로테이트하도록 설정할 수 있다.

로테이션을 구성해놓으면, kubelet은 컨테이너 로그를 로테이트하고 로깅 경로 구조를 관리한다.
kubelet은 이 정보를 컨테이너 런타임에 전송하고(CRI를 사용),
런타임은 지정된 위치에 컨테이너 로그를 기록한다.

[kubelet 설정 파일](/docs/tasks/administer-cluster/kubelet-config-file/)을 사용하여
두 개의 kubelet 파라미터
[`containerLogMaxSize` 및 `containerLogMaxFiles`](/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-KubeletConfiguration)를 설정 가능하다.
이러한 설정을 통해 각 로그 파일의 최대 크기와 각 컨테이너에 허용되는 최대 파일 수를 각각 구성할 수 있다.

기본 로깅 예제에서와 같이 [`kubectl logs`](/docs/reference/generated/kubectl/kubectl-commands#logs)를
실행하면, 노드의 kubelet이 요청을 처리하고 로그 파일에서 직접 읽는다.
kubelet은 로그 파일의 내용을 반환한다.


{{< note >}}
`kubectl logs`를 통해서는
최신 로그만 확인할 수 있다.

예를 들어, 파드가 40MiB 크기의 로그를 기록했고 kubelet이 10MiB 마다 로그를 로테이트하는 경우
`kubectl logs`는 최근의 10MiB 데이터만 반환한다.
{{< /note >}}

## 시스템 컴포넌트 로그

시스템 컴포넌트에는 두 가지 유형이 있는데, 컨테이너에서 실행되는 것과 실행 중인 컨테이너와 관련된 것이다.
예를 들면 다음과 같다.

* kubelet과 컨테이너 런타임은 컨테이너에서 실행되지 않는다.
  kubelet이 컨테이너({{< glossary_tooltip text="파드" term_id="pod" >}}와 그룹화된)를 실행시킨다.
* 쿠버네티스의 스케줄러, 컨트롤러 매니저, API 서버는
  파드(일반적으로 {{< glossary_tooltip text="스태틱 파드" term_id="static-pod" >}})로 실행된다.
  etcd는 컨트롤 플레인에서 실행되며, 대부분의 경우 역시 스태틱 파드로써 실행된다.
  클러스터가 kube-proxy를 사용하는 경우는 `데몬셋(DaemonSet)`으로써 실행된다.

### 로그의 위치 {#log-location-node}

kubelet과 컨테이너 런타임이 로그를 기록하는 방법은,
노드의 운영체제에 따라 다르다.

{{< tabs name="log_location_node_tabs" >}}
{{% tab name="리눅스" %}}

systemd를 사용하는 시스템에서는 kubelet과 컨테이너 런타임은 기본적으로 로그를 journald에 작성한다.
`journalctl`을 사용하여 이를 확인할 수 있다.
예를 들어 `journalctl -u kubelet`.

systemd를 사용하지 않는 시스템에서, kubelet과 컨테이너 런타임은 로그를 `/var/log` 디렉터리의 `.log` 파일에 작성한다.
다른 경로에 로그를 기록하고 싶은 경우에는, `kube-log-runner`를 통해
간접적으로 kubelet을 실행하여
kubelet의 로그를 지정한 디렉토리로 리디렉션할 수 있다.

kubelet을 실행할 때 `--log-dir` 인자를 통해 로그가 저장될 디렉토리를 지정할 수 있다.
그러나 해당 인자는 더 이상 지원되지 않으며(deprecated), kubelet은 항상 컨테이너 런타임으로 하여금
`/var/log/pods` 아래에 로그를 기록하도록 지시한다.

`kube-log-runner`에 대한 자세한 정보는 [시스템 로그](/ko/docs/concepts/cluster-administration/system-logs/#klog)를 확인한다.

{{% /tab %}}
{{% tab name="윈도우" %}}

kubelet은 기본적으로 `C:\var\logs` 아래에 로그를 기록한다
(`C:\var\log`가 아님에 주의한다).

`C:\var\log` 경로가 쿠버네티스에 설정된 기본값이지만,
몇몇 클러스터 배포 도구들은 윈도우 노드의 로그 경로로 `C:\var\log\kubelet`를 사용하기도 한다.

다른 경로에 로그를 기록하고 싶은 경우에는, `kube-log-runner`를 통해
간접적으로 kubelet을 실행하여
kubelet의 로그를 지정한 디렉토리로 리디렉션할 수 있다.

그러나, kubelet은 항상 컨테이너 런타임으로 하여금
`C:\var\log\pods` 아래에 로그를 기록하도록 지시한다.

`kube-log-runner`에 대한 자세한 정보는 [시스템 로그](/ko/docs/concepts/cluster-administration/system-logs/#klog)를 확인한다.
{{% /tab %}}
{{< /tabs >}}

<br /><!-- work around rendering nit -->

파드로 실행되는 쿠버네티스 컴포넌트의 경우,
기본 로깅 메커니즘을 따르지 않고 `/var/log` 아래에 로그를 기록한다
(즉, 해당 컴포넌트들은 systemd의 journal에 로그를 기록하지 않는다).
쿠버네티스의 저장 메커니즘을 사용하여, 컴포넌트를 실행하는 컨테이너에 영구적으로 사용 가능한 저장 공간을 연결할 수 있다.

etcd와 etcd의 로그를 기록하는 방식에 대한 자세한 정보는 [etcd 공식 문서](https://etcd.io/docs/)를 확인한다.
다시 언급하자면, 쿠버네티스의 저장 메커니즘을 사용하여
컴포넌트를 실행하는 컨테이너에 영구적으로 사용 가능한 저장 공간을 연결할 수 있다.

{{< note >}}
스케줄러와 같은 쿠버네티스 클러스터의 컴포넌트를 배포하여 상위 노드에서 공유된 볼륨에 로그를 기록하는 경우,
해당 로그들이 로테이트되는지 확인하고 관리해야 한다.
**쿠버네티스는 로그 로테이션을 관리하지 않는다**.

몇몇 로그 로테이션은 운영체제가 자동적으로 구현할 수도 있다.
예를 들어, 컴포넌트를 실행하는 스태틱 파드에 `/var/log` 디렉토리를 공유하여 로그를 기록하면,
노드-레벨 로그 로테이션은 해당 경로의 파일을
쿠버네티스 외부의 다른 컴포넌트들이 기록한 파일과 동일하게 취급한다.

몇몇 배포 도구들은 로그 로테이션을 자동화하지만,
나머지 도구들은 이를 사용자의 책임으로 둔다.
{{< /note >}}

## 클러스터-레벨 로깅 아키텍처 {#cluster-level-logging-architectures}

쿠버네티스는 클러스터-레벨 로깅을 위한 네이티브 솔루션을 제공하지 않지만, 고려해야 할 몇 가지 일반적인 접근 방법을 고려할 수 있다. 여기 몇 가지 옵션이 있다.

* 모든 노드에서 실행되는 노드-레벨 로깅 에이전트를 사용한다.
* 애플리케이션 파드에 로깅을 위한 전용 사이드카 컨테이너를 포함한다.
* 애플리케이션 내에서 로그를 백엔드로 직접 푸시한다.

### 노드 로깅 에이전트 사용

![노드 레벨 로깅 에이전트 사용](/images/docs/user-guide/logging/logging-with-node-agent.png)

각 노드에 _노드-레벨 로깅 에이전트_ 를 포함시켜 클러스터-레벨 로깅을 구현할 수 있다. 로깅 에이전트는 로그를 노출하거나 로그를 백엔드로 푸시하는 전용 도구이다. 일반적으로, 로깅 에이전트는 해당 노드의 모든 애플리케이션 컨테이너에서 로그 파일이 있는 디렉터리에 접근할 수 있는 컨테이너이다.

로깅 에이전트는 모든 노드에서 실행되어야 하므로, 에이전트를
`DaemonSet` 으로 동작시키는 것을 추천한다.

노드-레벨 로깅은 노드별 하나의 에이전트만 생성하며, 노드에서 실행되는 애플리케이션에 대한 변경은 필요로 하지 않는다.

컨테이너는 로그를 stdout과 stderr로 출력하며, 합의된 형식은 없다. 노드-레벨 에이전트는 이러한 로그를 수집하고 취합을 위해 전달한다.

### 로깅 에이전트와 함께 사이드카 컨테이너 사용 {#sidecar-container-with-logging-agent}

다음 중 한 가지 방법으로 사이드카 컨테이너를 사용할 수 있다.

* 사이드카 컨테이너는 애플리케이션 로그를 자체 `stdout` 으로 스트리밍한다.
* 사이드카 컨테이너는 로깅 에이전트를 실행하며, 애플리케이션 컨테이너에서 로그를 가져오도록 구성된다.

#### 사이드카 컨테이너 스트리밍

![스트리밍 컨테이너가 있는 사이드카 컨테이너](/images/docs/user-guide/logging/logging-with-streaming-sidecar.png)

사이드카 컨테이너가 자체 `stdout` 및 `stderr` 스트림으로
기록하도록 하면, 각 노드에서 이미 실행 중인 kubelet과 로깅 에이전트를
활용할 수 있다. 사이드카 컨테이너는 파일, 소켓 또는 journald에서 로그를 읽는다.
각 사이드카 컨테이너는 자체 `stdout` 또는 `stderr` 스트림에 로그를 출력한다.

이 방법을 사용하면 애플리케이션의 다른 부분에서 여러 로그 스트림을
분리할 수 있고, 이 중 일부는 `stdout` 또는 `stderr` 에
작성하기 위한 지원이 부족할 수 있다. 로그를 리디렉션하는 로직은
최소화되어 있기 때문에, 심각한 오버헤드가 아니다. 또한,
`stdout` 및 `stderr` 가 kubelet에서 처리되므로, `kubectl logs` 와 같은
빌트인 도구를 사용할 수 있다.

예를 들어, 파드는 단일 컨테이너를 실행하고, 컨테이너는
서로 다른 두 가지 형식을 사용하여 서로 다른 두 개의 로그 파일에 기록한다.
다음은 파드에 대한 매니페스트이다.

{{< codenew file="admin/logging/two-files-counter-pod.yaml" >}}

두 컴포넌트를 컨테이너의 `stdout` 스트림으로 리디렉션한 경우에도, 동일한 로그
스트림에 서로 다른 형식의 로그 항목을 작성하는 것은
추천하지 않는다. 대신, 두 개의 사이드카 컨테이너를 생성할 수 있다. 각 사이드카
컨테이너는 공유 볼륨에서 특정 로그 파일을 테일(tail)한 다음 로그를
자체 `stdout` 스트림으로 리디렉션할 수 있다.

다음은 사이드카 컨테이너가 두 개인 파드에 대한 매니페스트이다.

{{< codenew file="admin/logging/two-files-counter-pod-streaming-sidecar.yaml" >}}

이제 이 파드를 실행하면, 다음의 명령을 실행하여 각 로그 스트림에
개별적으로 접근할 수 있다.

```shell
kubectl logs counter count-log-1
```

출력은 다음과 같다.

```console
0: Fri Apr  1 11:42:26 UTC 2022
1: Fri Apr  1 11:42:27 UTC 2022
2: Fri Apr  1 11:42:28 UTC 2022
...
```

```shell
kubectl logs counter count-log-2
```

출력은 다음과 같다.

```console
Fri Apr  1 11:42:29 UTC 2022 INFO 0
Fri Apr  1 11:42:30 UTC 2022 INFO 0
Fri Apr  1 11:42:31 UTC 2022 INFO 0
...
```

클러스터에 노드-레벨 에이전트를 설치했다면, 에이전트는 추가적인 설정 없이도
자동으로 해당 로그 스트림을 선택한다. 원한다면, 소스 컨테이너에
따라 로그 라인을 파싱(parse)하도록 에이전트를 구성할 수도 있다.

CPU 및 메모리 사용량이 낮은(몇 밀리코어 수준의 CPU와 몇 메가바이트 수준의 메모리 요청) 파드라고 할지라도,
로그를 파일에 기록한 다음 `stdout` 으로 스트리밍하는 것은
노드가 필요로 하는 스토리지 양을 두 배로 늘릴 수 있다.
단일 파일에 로그를 기록하는 애플리케이션이 있는 경우,
일반적으로 스트리밍 사이드카 컨테이너 방식을 구현하는 대신
`/dev/stdout` 을 대상으로 설정하는 것을 추천한다.

사이드카 컨테이너를 사용하여
애플리케이션 자체에서 로테이션할 수 없는 로그 파일을 로테이션할 수도 있다.
이 방법의 예시는 정기적으로 `logrotate` 를 실행하는 작은 컨테이너를 두는 것이다.
그러나, `stdout` 및 `stderr` 을 직접 사용하고 로테이션과
유지 정책을 kubelet에 두는 것이 더욱 직관적이다.

#### 로깅 에이전트가 있는 사이드카 컨테이너

![로깅 에이전트가 있는 사이드카 컨테이너](/images/docs/user-guide/logging/logging-with-sidecar-agent.png)

노드-레벨 로깅 에이전트가 상황에 맞게 충분히 유연하지 않은 경우,
애플리케이션과 함께 실행하도록 특별히 구성된 별도의 로깅 에이전트를 사용하여
사이드카 컨테이너를 생성할 수 있다.

{{< note >}}
사이드카 컨테이너에서 로깅 에이전트를 사용하면
상당한 리소스 소비로 이어질 수 있다. 게다가, kubelet에 의해
제어되지 않기 때문에, `kubectl logs` 를 사용하여 해당 로그에
접근할 수 없다.
{{< /note >}}

아래는 로깅 에이전트가 포함된 사이드카 컨테이너를 구현하는 데 사용할 수 있는 두 가지 매니페스트이다.
첫 번째 매니페스트는 fluentd를 구성하는
[`컨피그맵(ConfigMap)`](/docs/tasks/configure-pod-container/configure-pod-configmap/)이 포함되어 있다.

{{< codenew file="admin/logging/fluentd-sidecar-config.yaml" >}}

{{< note >}}
예제 매니페스트에서, 꼭 fluentd가 아니더라도,
애플리케이션 컨테이너 내의 모든 소스에서 로그를 읽어올 수 있는 다른 로깅 에이전트를 사용할 수 있다.
{{< /note >}}

두 번째 매니페스트는 fluentd가 실행되는 사이드카 컨테이너가 있는 파드를 설명한다.
파드는 fluentd가 구성 데이터를 가져올 수 있는 볼륨을 마운트한다.

{{< codenew file="admin/logging/two-files-counter-pod-agent-sidecar.yaml" >}}

### 애플리케이션에서 직접 로그 노출

![애플리케이션에서 직접 로그 노출](/images/docs/user-guide/logging/logging-from-application.png)

애플리케이션에서 직접 로그를 노출하거나 푸시하는 클러스터-로깅은 쿠버네티스의 범위를 벗어난다.

## {{% heading "whatsnext" %}}

* [쿠버네티스 시스템 로그](/ko/docs/concepts/cluster-administration/system-logs/) 살펴보기.
* [쿠버네티스 시스템 컴포넌트에 대한 추적(trace)](/docs/concepts/cluster-administration/system-traces/) 살펴보기.
* 파드가 실패했을 때 쿠버네티스가 어떻게 로그를 남기는지에 대해, [종료 메시지를 사용자가 정의하는 방법](/ko/docs/tasks/debug/debug-application/determine-reason-pod-failure/#종료-메시지-사용자-정의하기) 살펴보기.