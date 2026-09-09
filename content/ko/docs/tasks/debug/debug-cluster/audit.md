---
# reviewers:
# - soltysh
# - sttts
content_type: concept
title: 감사(auditing)
---

<!-- overview -->

쿠버네티스 _감사_ 는 클러스터에서 수행된 작업의 순서를 문서화하는,
보안 관련 기록을 시간순으로 제공한다. 클러스터는 사용자,
쿠버네티스 API를 사용하는 애플리케이션, 컨트롤 플레인 자체에서 발생한 활동을 감사한다.

감사를 통해 클러스터 관리자는 다음 질문에 답할 수 있다.

 - 무슨 일이 일어났는가?
 - 언제 일어났는가?
 - 누가 시작했는가?
 - 어떤 대상에 발생했는가?
 - 어디서 관찰되었는가?
 - 어디서 시작되었는가?
 - 어디로 향했는가?

<!-- body -->

감사 기록은
[kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/)
컴포넌트 내부에서 라이프사이클을 시작한다. 각 요청은 실행의 각 단계에서
감사 이벤트를 생성하며, 이 이벤트는 특정 정책에 따라 전처리한 후
백엔드에 기록한다. 정책은 기록할 내용을 결정하고,
백엔드는 기록을 영구 저장한다. 현재 백엔드 구현에는
로그 파일과 웹훅(webhook)이 포함된다.

각 요청은 연관된 _단계(stage)_ 와 함께 기록할 수 있다. 정의된 단계는 다음과 같다.

- `RequestReceived` - 감사 핸들러가 요청을 받은 직후,
  핸들러 체인의 다음 단계로 위임하기 전에 생성되는 이벤트의
  단계이다.
- `ResponseStarted` - 응답 헤더를 보냈지만 응답 본문을
  보내기 전의 단계이다. 이 단계는 오래 실행되는 요청
  (예: watch)에 대해서만 생성된다.
- `ResponseComplete` - 응답 본문 전송이 완료되어 더 이상 바이트를
  보내지 않는 단계이다.
- `Panic` - 패닉(panic)이 발생했을 때 생성되는 이벤트이다.

{{< note >}}
[감사 이벤트 구성](/docs/reference/config-api/apiserver-audit.v1/#audit-k8s-io-v1-Event)의
구조는
[이벤트(Event)](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#event-v1-core)
API 오브젝트와
다르다.
{{< /note >}}

감사 로깅 기능은 감사에 필요한 일부 컨텍스트를 요청마다 저장하므로
API 서버의 메모리 사용량을 증가시킨다.
메모리 사용량은 감사 로깅 구성에 따라 달라진다.

## 감사 정책 {#audit-policy}

감사 정책은 어떤 이벤트를 기록하고 어떤 데이터를 포함할지에 대한
규칙을 정의한다. 감사 정책 오브젝트의 구조는
[`audit.k8s.io` API 그룹](/docs/reference/config-api/apiserver-audit.v1/#audit-k8s-io-v1-Policy)에 정의되어 있다.
이벤트를 처리할 때는
규칙 목록과 순서대로 비교한다. 처음 일치하는 규칙이 이벤트의
_감사 수준(audit level)_ 을 설정한다. 정의된 감사 수준은 다음과 같다.

- `None` - 이 규칙과 일치하는 이벤트를 기록하지 않는다.
- `Metadata` - 이벤트의 메타데이터(요청 사용자, 타임스탬프, 리소스,
  동사 등)를 기록하지만 요청이나 응답 본문은 기록하지 않는다.
- `Request` - 요청 메타데이터와 본문을 포함하여 이벤트를 기록하지만 응답 본문은 기록하지 않는다.
  리소스에 대한 요청이 아닌 경우에는 적용되지 않는다.
- `RequestResponse` - 요청 메타데이터, 요청 본문, 응답 본문을 포함하여 이벤트를 기록한다.
  리소스에 대한 요청이 아닌 경우에는 적용되지 않는다.

`--audit-policy-file` 플래그를 사용하여 정책 파일을
`kube-apiserver`에 전달할 수 있다. 이 플래그를 생략하면 이벤트를 기록하지 않는다.
감사 정책 파일에 `rules` 필드를 __반드시__ 제공해야 한다.
규칙이 없는(0개인) 정책은 유효하지 않은 것으로 간주한다.

다음은 감사 정책 파일의 예시이다.

{{% code_sample file="audit/audit-policy.yaml" %}}

최소한의 감사 정책 파일로 모든 요청을 `Metadata` 수준에서 기록할 수 있다.

```yaml
# Log all requests at the Metadata level.
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
- level: Metadata
```

자체 감사 프로필을 작성하는 경우 Google Container-Optimized OS의 감사 프로필을 출발점으로 사용할 수 있다. 감사 정책 파일을 생성하는
[configure-helper.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/gce/gci/configure-helper.sh)
스크립트를 확인한다. 스크립트를 직접 살펴보면 감사 정책 파일의 대부분을 확인할 수 있다.

정의된 필드에 대한 자세한 내용은 [`Policy` 구성 레퍼런스](/docs/reference/config-api/apiserver-audit.v1/#audit-k8s-io-v1-Policy)도
참고할 수 있다.

## 감사 백엔드 {#audit-backends}

감사 백엔드는 감사 이벤트를 외부 스토리지에 영구 저장한다.
kube-apiserver는 기본적으로 두 가지 백엔드를 제공한다.

- 이벤트를 파일시스템에 기록하는 로그 백엔드
- 이벤트를 외부 HTTP API로 보내는 웹훅 백엔드

모든 경우에 감사 이벤트는 쿠버네티스 API의
[`audit.k8s.io` API 그룹](/docs/reference/config-api/apiserver-audit.v1/#audit-k8s-io-v1-Event)에 정의된 구조를 따른다.

{{< note >}}
패치의 경우 요청 본문은 쿠버네티스 API 오브젝트에 해당하는 JSON 오브젝트가 아니라,
패치 작업을 포함한 JSON 배열이다. 예를 들어 다음 요청 본문은
`/apis/batch/v1/namespaces/some-namespace/jobs/some-job-name`에 대한 유효한 패치 요청이다.

```json
[
  {
    "op": "replace",
    "path": "/spec/parallelism",
    "value": 0
  },
  {
    "op": "remove",
    "path": "/spec/template/spec/containers/0/terminationMessagePolicy"
  }
]
```

{{< /note >}}

### 로그 백엔드 {#log-backend}

로그 백엔드는 감사 이벤트를 [JSONlines](https://jsonlines.org/) 형식으로 파일에 기록한다.
다음 `kube-apiserver` 플래그로 로그 감사 백엔드를 구성할 수 있다.

- `--audit-log-path`는 로그 백엔드가 감사 이벤트를 기록할 로그 파일 경로를
  지정한다. 이 플래그를 지정하지 않으면 로그 백엔드가 비활성화된다. `-`는 표준 출력을 의미한다.
- `--audit-log-maxage`는 오래된 감사 로그 파일을 보관할 최대 일수를 정의한다.
- `--audit-log-maxbackup`은 보관할 감사 로그 파일의 최대 개수를 정의한다.
- `--audit-log-maxsize`는 로그 로테이션 전 감사 로그 파일의 최대 크기를 메가바이트 단위로 정의한다.

클러스터의 컨트롤 플레인에서 kube-apiserver를 파드로 실행한다면, 감사 기록이 영구 저장되도록
정책 파일과 로그 파일 위치에 `hostPath`를 마운트해야 한다. 예시는 다음과 같다.

```yaml
  - --audit-policy-file=/etc/kubernetes/audit-policy.yaml
  - --audit-log-path=/var/log/kubernetes/audit/audit.log
```

그런 다음 볼륨을 마운트한다.

```yaml
...
volumeMounts:
  - mountPath: /etc/kubernetes/audit-policy.yaml
    name: audit
    readOnly: true
  - mountPath: /var/log/kubernetes/audit/
    name: audit-log
    readOnly: false
```
마지막으로 `hostPath`를 구성한다.

```yaml
...
volumes:
- name: audit
  hostPath:
    path: /etc/kubernetes/audit-policy.yaml
    type: File

- name: audit-log
  hostPath:
    path: /var/log/kubernetes/audit/
    type: DirectoryOrCreate
```

### 웹훅 백엔드 {#webhook-backend}

웹훅 감사 백엔드는 원격 웹 API로 감사 이벤트를 전송한다. 이 API는 인증 수단을
포함하여 쿠버네티스 API의 형태를 따른다고 가정한다. 다음 kube-apiserver
플래그로 웹훅 감사 백엔드를 구성할 수 있다.

- `--audit-webhook-config-file`은 웹훅 구성이 포함된 파일의 경로를
  지정한다. 웹훅 구성은 사실상 특정 용도에 맞춘
  [kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters)이다.
- `--audit-webhook-initial-backoff`는 첫 요청 실패 후 재시도까지
  대기할 시간을 지정한다. 이후 요청은 지수 백오프(exponential backoff)로 재시도한다.

웹훅 구성 파일은 kubeconfig 형식으로 서비스의 원격 주소와
서비스에 연결할 때 사용할 자격 증명을 지정한다.

## 이벤트 배치 처리 {#batching}

`log`와 `webhook` 백엔드는 모두 배치 처리를 지원한다. 아래는
각 백엔드에서 사용할 수 있는 플래그 목록이다.
기본적으로 배치 처리와 스로틀링(throttling)은 `webhook` 백엔드에서 **활성화** 되고, `log` 백엔드에서 **비활성화** 된다.

{{< tabs name="tab_with_md" >}}
{{% tab name="webhook" %}}
- `--audit-webhook-mode`는 버퍼링 전략을 정의한다. 다음 중 하나를 사용한다.
  - `batch` - 이벤트를 버퍼링하고 비동기적으로 배치 처리한다. `webhook` 백엔드의 기본 모드이다.
  - `blocking` - 각 개별 이벤트를 처리하는 동안 API 서버 응답을 차단한다.
  - `blocking-strict` - blocking과 같지만, RequestReceived 단계의 감사 로깅 중
    실패가 발생하면 kube-apiserver에 대한 전체 요청이 실패한다.

다음 플래그는 `batch` 모드에서만 사용한다.

- `--audit-webhook-batch-buffer-size`는 배치 처리 전에 버퍼링할 이벤트 수를 정의한다.
  수신 이벤트의 속도가 버퍼 용량을 초과하면 이벤트를 버린다. 기본값은 10000이다.
- `--audit-webhook-batch-max-size`는 한 배치의 최대 이벤트 수를 정의한다. 기본값은 400이다.
- `--audit-webhook-batch-max-wait`는 큐의 이벤트를 무조건 배치 처리하기 전까지
  대기할 수 있는 최대 시간을 정의한다. 기본값은 30초이다.
- `--audit-webhook-batch-throttle-enable`은 배치 스로틀링의 활성화 여부를 정의한다. 기본적으로 활성화된다.
- `--audit-webhook-batch-throttle-qps`는 초당 생성하는 배치 수의 최대 평균값을
  정의한다. 기본값은 10이다.
- `--audit-webhook-batch-throttle-burst`는 이전에 허용된 QPS를 충분히 사용하지 않은 경우,
  한 번에 생성할 수 있는 최대 배치 수를 정의한다. 기본값은 15이다.
{{% /tab %}}
{{% tab name="log" %}}
- `--audit-log-mode`는 버퍼링 전략을 정의한다. 다음 중 하나를 사용한다.
  - `batch` - 이벤트를 버퍼링하고 비동기적으로 배치 처리한다. `log` 백엔드에는 배치 처리를 권장하지 않는다.
  - `blocking` - 각 개별 이벤트를 처리하는 동안 API 서버 응답을 차단한다. `log` 백엔드의 기본 모드이다.
  - `blocking-strict` - blocking과 같지만, RequestReceived 단계의 감사 로깅 중
    실패가 발생하면 kube-apiserver에 대한 전체 요청이 실패한다.

다음 플래그는 `batch` 모드에서만 사용한다(`log` 백엔드의 배치 처리는 기본적으로 **비활성화** 되며, 비활성화된 경우 배치 관련 플래그를 모두 무시한다).

- `--audit-log-batch-buffer-size`는 배치 처리 전에 버퍼링할 이벤트 수를 정의한다.
  수신 이벤트의 속도가 버퍼 용량을 초과하면 이벤트를 버린다.
- `--audit-log-batch-max-size`는 한 배치의 최대 이벤트 수를 정의한다.
- `--audit-log-batch-max-wait`는 큐의 이벤트를 무조건 배치 처리하기 전까지
  대기할 수 있는 최대 시간을 정의한다.
- `--audit-log-batch-throttle-enable`은 배치 스로틀링의 활성화 여부를 정의한다.
- `--audit-log-batch-throttle-qps`는 초당 생성하는 배치 수의 최대 평균값을
  정의한다.
- `--audit-log-batch-throttle-burst`는 이전에 허용된 QPS를 충분히 사용하지 않은 경우,
  한 번에 생성할 수 있는 최대 배치 수를 정의한다.
{{% /tab %}}
{{< /tabs >}}

## 파라미터 조정 {#parameter-tuning}

파라미터는 API 서버의 부하를 감당할 수 있도록 설정해야 한다.

예를 들어 kube-apiserver가 초당 100개의 요청을 받고 각 요청을
`ResponseStarted`와 `ResponseComplete` 단계에서만 감사한다면, 초당 약 200개의 감사
이벤트가 생성됨을 고려해야 한다. 한 배치에 최대 100개의 이벤트가 있다고 가정하면,
스로틀링 수준을 최소 초당 2개의 쿼리로 설정해야 한다. 백엔드가 이벤트를 기록하는 데
최대 5초가 걸린다고 가정하면, 최대 5초 동안의 이벤트를 담도록 버퍼 크기를 설정해야 한다.
즉, 10개의 배치 또는 1000개의 이벤트이다.

그러나 대부분의 경우 기본 파라미터로 충분하므로 수동 설정을 걱정할 필요가 없다.
kube-apiserver가 노출하는 다음 프로메테우스 메트릭과 로그를 통해
감사 하위 시스템의 상태를 모니터링할 수 있다.

- `apiserver_audit_event_total` 메트릭은 내보낸 감사 이벤트의 총개수를 나타낸다.
- `apiserver_audit_error_total` 메트릭은 내보내기 중 발생한 오류로 버린 이벤트의
  총개수를 나타낸다.

### 로그 항목 자르기 {#truncate}

로그와 웹훅 백엔드는 모두 기록하는 이벤트의 크기를 제한할 수 있다.
예를 들어 로그 백엔드에서 사용할 수 있는 플래그 목록은 다음과 같다.

- `audit-log-truncate-enabled`: 이벤트와 배치 자르기의 활성화 여부.
- `audit-log-truncate-max-batch-size`: 하위 백엔드에 보내는 배치의 최대 크기(바이트).
- `audit-log-truncate-max-event-size`: 하위 백엔드에 보내는 감사 이벤트의 최대 크기(바이트).

자르기 기능은 `webhook`과 `log` 모두에서 기본적으로 비활성화되어 있다. 이 기능을 활성화하려면 클러스터 관리자가
`audit-log-truncate-enabled` 또는 `audit-webhook-truncate-enabled`를 설정해야 한다.

## {{% heading "whatsnext" %}}

* [변형 웹훅 감사 어노테이션](/docs/reference/access-authn-authz/extensible-admission-controllers/#mutating-webhook-auditing-annotations)에 대해 알아본다.
* 감사 구성 레퍼런스를 읽고
  [`Event`](/docs/reference/config-api/apiserver-audit.v1/#audit-k8s-io-v1-Event)와 [`Policy`](/docs/reference/config-api/apiserver-audit.v1/#audit-k8s-io-v1-Policy)
  리소스 타입에 대해 자세히 알아본다.

