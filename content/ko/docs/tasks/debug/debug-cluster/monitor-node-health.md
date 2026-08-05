---
title: 노드 헬스 모니터링하기
content_type: task
# reviewers:
# - Random-Liu
# - dchen1107
weight: 20
---

<!-- overview -->

*노드 문제 감지기(Node Problem Detector)* 는 노드의 헬스에 대해 모니터링 및 보고하는 데몬이다.
노드 문제 감지기를 `데몬셋(DaemonSet)` 혹은 스탠드얼론 데몬(standalone daemon)으로 실행할 수 있다.
노드 문제 감지기는 다양한 데몬으로부터 노드의 문제에 관한 정보를 다양한 데몬으로부터 수집하고,
이러한 컨디션들을 [노드컨디션(NodeCondition)](/docs/concepts/architecture/nodes/#condition) 및
[이벤트(Event)](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#event-v1-core)형태로 API 서버에 보고한다.

노드 문제 감지기 설치 및 사용 방법을 보려면,
[노드 문제 감지기 프로젝트 문서](https://github.com/kubernetes/node-problem-detector)를 참조하자.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## 제약 사항

* 노드 문제 감지기는 파일 기반의 커널 로그만 지원한다.
  `journald` 와 같은 로그 도구는 지원하지 않는다.

* 노드 문제 감지기는 커널 로그 형식을 사용하여 커널 이슈를 보고한다.
  커널 로그 형식을 확장하는 방법을 배우려면 [기타 로그 형식 지원 추가](#support-other-log-format)를 살펴보자.

## 노드 문제 감지기 활성화하기

일부 클라우드 사업자는 노드 문제 감지기를 {{< glossary_tooltip text="애드온" term_id="addons" >}} 으로서 제공한다.
또한, `kubectl`을 이용하거나 애드온 파드를 생성하여 노드 문제 감지기를 활성화할 수도 있다.

### kubectl를 이용하여 노드 문제 감지기 활성화하기 {#using-kubectl}

`kubectl`은 노드 문제 감지기를 관리하는 가장 유연한 방법이다.
현재 환경에 맞게 조정하거나 사용자 정의 노드 문제를 탐지하기 위해
기본 설정값을 덮어쓸 수 있다. 예를 들면 아래와 같다.

1. `node-problem-detector.yaml`와 유사하게 노드 문제 감지기 구성을 생성한다:

   {{< codenew file="debug/node-problem-detector.yaml" >}}

   {{< note >}}
   현재 운영 체제 배포판의 시스템 로그 디렉토리와 일치하도록 기재했는지 확인해야 한다.
   {{< /note >}}

1. `kubectl`을 이용하여 노드 문제 감지기를 시작한다.

   ```shell
   kubectl apply -f https://k8s.io/examples/debug/node-problem-detector.yaml
   ```

### 애드온 파드를 이용하여 노드 문제 감지기 활성화하기 {#using-addon-pod}

만약 커스텀 클러스터 부트스트랩 솔루션을 사용중이고
기본 설정값을 덮어쓸 필요가 없다면,
디플로이먼트를 추가로 자동화하기 위해 애드온 파드를 활용할 수 있다.

`node-problem-detector.yaml`를 생성하고,
컨트롤 플레인 노드의 애드온 파드의 디렉토리 `/etc/kubernetes/addons/node-problem-detector`에 설정을 저장한다.

## 설정 덮어쓰기

노드 문제 감지기를 빌드할 때,
[기본 설정](https://github.com/kubernetes/node-problem-detector/tree/v0.1/config)이 포함되어 있다.

하지만 [`컨피그맵(ConfigMap)`](/docs/tasks/configure-pod-container/configure-pod-configmap/)을 이용해
설정을 덮어쓸 수 있다.

1. `config/` 내의 설정 파일을 변경한다.
1. `node-problem-detector-config` `컨피그맵(ConfigMap)`을 생성한다.

   ```shell
   kubectl create configmap node-problem-detector-config --from-file=config/
   ```

1. `컨피그맵(ConfigMap)`을 사용하도록 `node-problem-detector.yaml`을 변경한다.

   {{< codenew file="debug/node-problem-detector-configmap.yaml" >}}

4. 새로운 설정 파일을 사용하여 노드 문제 감지기를 재생성한다.

   ```shell
   # 만약 노드 문제 감지기가 동작하고 있다면, 재생성 전 삭제한다
   kubectl delete -f https://k8s.io/examples/debug/node-problem-detector.yaml
   kubectl apply -f https://k8s.io/examples/debug/node-problem-detector-configmap.yaml
   ```

{{< note >}}
이 접근법은 노드 문제 감지기를 `kubectl`로 시작했을 때에만 적용된다.
{{< /note >}}

만약 노드 문제 감지기가 클러스터 애드온으로 실행된 경우, 설정 덮어쓰기가 지원되지 않는다.
애드온 매니저는 `컨피그맵(ConfigMap)`을 지원하지 않는다.

## 커널 모니터

*커널 모니터*는 노드 문제 감지기에서 지원하는 시스템 로그 모니터링 데몬이다.
커널 모니터는 커널 로그를 감시하며, 미리 설정된 규칙에 따라 알려진 커널 이슈를 감지한다.

커널 모니터는 [`config/kernel-monitor.json`](https://github.com/kubernetes/node-problem-detector/blob/v0.1/config/kernel-monitor.json)에
미리 설정된 규칙 모음과 커널 이슈를 매칭한다.
규칙 리스트는 확장 가능하다. 설정을 덮어쓰기 해 규칙 리스트를 확장할 수 있다.

### 신규 노드컨디션(NodeConditions) 추가하기

신규 `NodeCondition`를 지원하려면, `config/kernel-monitor.json`의 `conditions`필드 내 조건 정의를 생성해야한다.
예를 들면 아래와 같다.

```json
{
  "type": "NodeConditionType",
  "reason": "CamelCaseDefaultNodeConditionReason",
  "message": "arbitrary default node condition message"
}
```

### 신규 문제 감지하기

신규 문제를 감지하려면 `config/kernel-monitor.json`의 `rules`필드를
신규 규칙 정의로 확장하면 된다.

```json
{
  "type": "temporary/permanent",
  "condition": "NodeConditionOfPermanentIssue",
  "reason": "CamelCaseShortReason",
  "message": "regexp matching the issue in the kernel log"
}
```

### 커널 로그 장치를 위한 경로 설정하기 {#kernel-log-device-path}

운영 체제 (OS) 배포판의 커널 로그 경로를 확인한다.
리눅스 커널 [로그 장치(log device)](https://www.kernel.org/doc/Documentation/ABI/testing/dev-kmsg)는 보통 `/dev/kmsg`와 같이 표시된다. 하지만, 로그 경로 장소는 OS 배포판마다 상이하다.
`config/kernel-monitor.json` 의 `log` 필드는 컨테이너 내부의 로그 경로를 나타낸다.
`log` 필드를 노드 문제 감지기가 감시하는 장치 경로와 일치하도록 구성하면 된다.

### 기타 로그 포맷 지원 추가하기 {#support-other-log-format}

커널 모니터는 커널 로그의 내부 데이터 구조를 해석하기 위해
[`Translator`](https://github.com/kubernetes/node-problem-detector/blob/v0.1/pkg/kernelmonitor/translator/translator.go) 플러그인을 사용한다.
신규 로그 포맷을 사용하기 위해 신규 해석기를 구현할 수 있다.

<!-- discussion -->

## 권장 사항 및 제약 사항

노드 헬스를 모니터링하기 위해 클러스터에 노드 문제 탐지기를 실행할 것을 권장한다.
노드 문제 감지기를 실행할 때, 각 노드에 추가 리소스 오버헤드가 발생할 수 있다.
다음과 같은 이유 때문에 일반적으로는 문제가 없다.

* 커널 로그는 비교적 천천히 늘어난다.
* 노드 문제 감지기에는 리소스 제한이 설정되어 있다.
* 높은 부하가 걸리더라도, 리소스 사용량은 허용 가능한 수준이다. 추가 정보를 위해 노드 문제 감지기의
[벤치마크 결과](https://github.com/kubernetes/node-problem-detector/issues/2#issuecomment-220255629)를 살펴보자.
