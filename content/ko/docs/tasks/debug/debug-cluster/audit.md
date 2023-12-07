---
#reviewers:
#- soltysh
#- sttts
content_type: concept
title: 감사(auditing)
---

<!-- overview -->

쿠버네티스 _감사(auditing)_ 는 클러스터의 작업 순서를 문서화하는 보안 관련 시간별 레코드 세트를 제공한다.
클러스터는 사용자, 쿠버네티스 API를 사용하는 애플리케이션 및
컨트롤 플레인 자체에서 생성된 활동을 감사한다.

감사를 통해 클러스터 관리자는 다음 질문에 답할 수 있다.

 - 무슨 일이 일어났는지?
 - 언제 일어난 일인지?
 - 누가 시작했는지?
 - 어떤 일이 있었는지?
 - 어디서 관찰되었는지?
 - 어디서부터 시작되었는지?
 - 그래서 어디까지 갔는지?

<!-- body -->

감사 기록은 [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/) 
컴포넌트 내에서 수명주기를 시작한다.
실행의 각 단계에서 각 요청은 감사 이벤트를 생성하고, 
감사 이벤트는 특정 정책에 따라 사전 처리되고 백엔드에 기록된다.
정책은 기록된 내용을 결정하고 백엔드는 기록을 유지한다. 
현재 백엔드 구현에는 로그 파일 및
웹훅이 포함된다.

각 요청들은 연관된 _단계(stage)_ 와 함께 기록될 수 있다. 정의된 단계는 다음과 같다.

- `RequestReceived` - 감사 핸들러가 요청을 수신한 직후, 
  그리고 핸들러 체인으로 위임되기 전에
  생성되는 이벤트에 대한 단계이다.
- `ResponseStarted` - 응답 헤더는 전송되었지만, 
  응답 본문(body)은 전송되기 전인 단계이다.
  이 단계는 오래 실행되는 요청(예: watch)에 대해서만 생성된다.
- `ResponseComplete` - 응답 내용이 완료되었으며,
   더 이상 바이트가 전송되지 않을 때의 단계이다.
- `Panic` - 패닉이 발생했을 때 생성되는 이벤트이다.

{{< note >}}
[Audit Event configuration](/docs/reference/config-api/apiserver-audit.v1/#audit-k8s-io-v1-Event)
의 구성은
[Event](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#event-v1-core)
API 오브젝트와는 
다르다.
{{< /note >}}

감사 로깅 기능은 감사에 필요한 일부 컨텍스트가 요청마다 
저장되기 때문에 API 서버의 메모리 사용량을 증가시킨다. 
메모리 소비량은 감사 로깅 구성에 따라 다르다.

## 감사 정책

감사 정책은 기록해야 하는 이벤트와 포함해야 하는 
데이터에 대한 규칙을 정의한다. 감사 정책 오브젝트 구조는
[`audit.k8s.io` API 그룹](/docs/reference/config-api/apiserver-audit.v1/#audit-k8s-io-v1-Policy)에 정의되어 있다.
이벤트가 처리되면 규칙 목록과 순서대로 비교된다.
첫번째 일치 규칙은 이벤트의 _감사 수준(audit level)_ 을 설정한다. 
정의된 감사 수준은 다음과 같다.

- `None` - 이 규칙에 해당되는 이벤트는 로깅하지 않는다.
- `Metadata` - 요청 메타데이터(요청하는 사용자, 타임스탬프, 리소스, 동사(verb) 등)는 로깅하지만
  요청/응답 본문은 로깅하지 않는다.
- `Request` - 이벤트 메타데이터 및 요청 본문을 로깅하지만 응답 본문은 로깅하지 않는다.
  리소스 외의 요청에는 적용되지 않는다.
- `RequestResponse` - 이벤트 메타데이터 및 요청/응답 본문을 로깅한다.
  리소스 외의 요청에는 적용되지 않는다.

`--audit-policy-file` 플래그를 사용하여 정책이 포함된 파일을 
`kube-apiserver`에 전달할 수 있다. 플래그를 생략하면 이벤트가 기록되지 않는다. 
감사 정책 파일에 `rules` 필드 **반드시** 가 제공되어야 한다.
규칙이 없는(0개인) 정책은 적절하지 않은(illegal) 것으로 간주된다.

다음은 감사 정책 파일의 예이다.

{{< codenew file="audit/audit-policy.yaml" >}}

최소 감사 정책 파일을 사용하여 `Metadata` 수준에서 모든 요청을 기록할 수 있다.

```yaml
# Log all requests at the Metadata level.
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
- level: Metadata
```

자체 감사 프로필을 만드는 경우 Google Container-Optimized OS에 대한 감사 프로필을 시작점으로 사용할 수 있다.
감사 정책 파일을 생성하는 [configure-helper.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/gce/gci/configure-helper.sh) 
스크립트를 확인하면 된다. 스크립트로 대부분의 감사 정책 파일을 볼 수 있다.

정의된 필드에 대한 자세한 내용은 [`Policy` configuration reference](/docs/reference/config-api/apiserver-audit.v1/#audit-k8s-io-v1-Policy)를
참조할 수도 있다.

## 감사 백엔드

감사 백엔드는 감사 이벤트를 외부 저장소에 유지한다. 
기본적으로 kube-apiserver는 두 가지 백엔드를 제공한다.

- 이벤트를 파일 시스템에 기록하는 로그 백엔드
- 이벤트를 외부 HTTP API로 보내는 Webhook 백엔드

모든 경우에 감사 이벤트는 쿠버네티스 API의 
[`audit.k8s.io` API 그룹](/docs/reference/config-api/apiserver-audit.v1/#audit-k8s-io-v1-Event)에서 정의한 구조를 따른다.

{{< note >}}
패치의 경우 요청 내용은 적절한 쿠버네티스 API 오브젝트를 포함하는 JSON 오브젝트가 아니라
패치 작업을 포함하는 JSON 배열이다. 예를 들어 다음 요청 내용은
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

### 로그 백엔드

로그 백엔드는 감사이벤트를 [JSONlines](https://jsonlines.org/) 형식으로 파일에 기록한다.
다음의 `kube-apiserver` 플래그를 사용하여 로그 감사 백엔드를 구성할 수 있다.

- `--audit-log-path` 는 로그 백엔드가 감사 이벤트를 쓰는 데 사용하는 로그 파일 경로를 지정한다. 
  이 플래그를 지정하지 않으면 로그 백엔드가 비활성화된다. `-` 는 표준 출력을 의미한다.
- `--audit-log-maxage` 는 오래된 감사 로그 파일을 보관할 최대 일수를 정의한다.
- `--audit-log-maxbackup` 은 보관할 감사 로그 파일의 최대 수를 정의한다.
- `--audit-log-maxsize` 는 감사 로그 파일이 로테이트 되기 전의 최대 크기(MB)를 정의한다.

클러스터의 컨트롤 플레인이 kube-apiserver를 파드로 실행하는 경우 감사 레코드가 지속되도록 
정책 파일 및 로그 파일의 위치에 `hostPath` 를 마운트 해야한다. 예를 들면
```shell
    --audit-policy-file=/etc/kubernetes/audit-policy.yaml \
    --audit-log-path=/var/log/kubernetes/audit/audit.log
```
그런 다음 볼륨을 마운트 한다.

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
그리고 마지막으로 `hostPath` 를 구성한다.

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

### 웹훅 백엔드

웹훅 감사 백엔드는 원격 웹 API로 감사 이벤트를 전송하는데, 이는 인증 수단을 포함하여
쿠버네티스 API의 한 형태로 간주된다. 
다음 kube-apiserver 플래그를 사용하여 웹훅 감사 백엔드를 구성할 수 있다.

- `--audit-webhook-config-file` 은 웹훅 구성이 있는 파일의 경로를 지정한다. 
  웹훅 구성은 효과적으로 전문화된
  [kubeconfig](/ko/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)이다.
- `--audit-webhook-initial-backoff` 는 첫 번째 실패한 요청 후 다시 시도하기 전에 대기할 시간을 지정한다.
  이후 요청은 지수의 백오프로 재시도 된다.

웹훅 구성 파일은 kubeconfig 형식을 사용하여 
서비스의 원격 주소와 서비스에 연결하는 데 사용되는 자격 증명을 지정한다.

## 이벤트 배치 {#배치}

로그 및 웹 훅 백엔드는 모두 배치를 지원한다. 웹훅 사용을 예로 들면, 다음은 사용 가능한 플래그 목록이다. 
로그 백엔드에 대해 동일한 플래그를 가져오려면 플래그 이름에 있는 `webhook` 을 `log` 로 바꾼다.
기본적으로 배치 기능은 `webhook` 에서 활성화되고 `log` 에서 비활성화된다. 마찬가지로, 기본적으로
쓰로틀링은 `webhook` 에서는 활성화되고 `log` 에서는 비활성화된다.

- `--audit-webhook-mode` 은 버퍼링 전략을 정의한다. 다음 중 하나이다.
  - `batch` - 이벤트를 버퍼링하고 비동기식으로 배치한다. 이것이 기본값이다.
  - `blocking` - 각 개별 이벤트를 처리할 때 API 서버 응답을 차단한다.
  - `blocking-strict` - `blocking`과 동일하지만, RequestReceived 단계에서 감사 로깅 중에 오류가 발생하면 
    kube-apiserver에 대한 전체 요청이 실패한다.

다음 플래그는 `batch` 모드에서만 사용된다.

- `--audit-webhook-batch-buffer-size` 는 배치하기 전에 버퍼링할 이벤트 수를 정의한다.
  들어오는 이벤트의 비율이 버퍼를 초과하면 이벤트가 삭제된다.
- `--audit-webhook-batch-max-size` 는 한 배치의 최대 이벤트 수를 정의한다.
- `--audit-webhook-batch-max-wait` 는 대기열에서 이벤트를 무조건 배치하기 전에 
  대기할 최대 시간을 정의한다.
- `--audit-webhook-batch-throttle-qps` 는 초당 생성되는 최대 평균 배치 수를
  정의한다.
- `--audit-webhook-batch-throttle-burst` 는 허용된 QPS가 이전에 충분히 활용되지 않은 경우
  동시에 생성되는 최대 배치 수를 정의한다.

## 파라미터 튜닝

파라미터는 API 서버의 로드를 수용할 수 있도록 설정해야 한다.

예를 들어 kube-apiserver가 초당 100건의 요청을 수신하고 각 요청이 
`ResponseStarted` 와 `ResponseComplete` 단계에서만 감사되는 경우 초당 생성되는 ≅200건의 감사 이벤트를 고려해야 한다.
일괄적으로 최대 100개의 이벤트가 있다고 가정할 때 
초당 최소 2개의 쿼리 조절 수준을 설정해야 한다.
백엔드가 이벤트를 쓰는 데 최대 5초가 걸릴 수 있다고 가정하면 버퍼크기를 최대 5초의 이벤트를 보유하도록 설정해야 한다.
즉, 10개의 배치 또는 100개의 이벤트이다.

그러나 대부분의 경우 기본 매개 변수만 있으면 충분하며 수동으로 설정할 필요가 없다.
kube-apiserver에서 노출된 다음과 같은 프로메테우스 메트릭과 로그에서
감사 하위 시스템의 상태를 모니터링할 수 있다.

- `apiserver_audit_event_total` 의 메트릭에는 내보낸 감사 이벤트의 총 수가 포함된다.
- `apiserver_audit_error_total` 의 메트릭에는 내보내기 중 오류로 인해 삭제된 총 이벤트
  수가 포함된다.

### 로그 항목 자르기 {#truncate}

로그 및 웹훅 백엔드는 모두 로깅되는 이벤트의 크기 제한을 지원한다. 
예를 들어 로그 백엔드에 사용할 수 있는 플래그 목록은 다음과 같다.

- `audit-log-truncate-enabled` 는 이벤트 및 자르기 배치가 활성화 되었는지 여부를 나타낸다.
- `audit-log-truncate-max-batch-size` 는 기본 백엔드로 전송되는 배치의 바이트 단위의 최대 크기이다.
- `audit-log-truncate-max-event-size` 는 기본 백엔드로 전송된 감사 이벤트의 바이트 단위의 최대 크기이다.

기본적으로 `webhook` 과 `log` 모두에서 자르기 기능이 비활성화되어 있으므로 이 기능을 활성화 하기 위해
클러스터 관리자는 `audit-log-truncate-enabled` 또는 `audit-webhook-truncate-enabled` 를 설정해야 한다.

## {{% heading "whatsnext" %}}

* [Mutating webhook auditing annotations](/docs/reference/access-authn-authz/extensible-admission-controllers/#mutating-webhook-auditing-annotations) 에 대해 알아보기.
* [`Event`](/docs/reference/config-api/apiserver-audit.v1/#audit-k8s-io-v1-Event) 에 대해 알아보고
  감사 구성 참조를 읽고 [`Policy`](/docs/reference/config-api/apiserver-audit.v1/#audit-k8s-io-v1-Policy)
  리소스 유형 확인하기.

