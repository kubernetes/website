---



title: 시스템 로그
content_type: concept
weight: 60
---

<!-- overview -->

시스템 컴포넌트 로그는 클러스터에서 발생하는 이벤트를 기록하며, 이는 디버깅에 아주 유용하다.
더 많거나 적은 세부 정보를 표시하도록 다양하게 로그를 설정할 수 있다.
로그는 컴포넌트 내에서 오류를 표시하는 것 처럼 간단하거나, 이벤트의 단계적 추적(예: HTTP 엑세스 로그, 파드의 상태 변경, 컨트롤러 작업 또는 스케줄러의 결정)을 표시하는 것처럼 세밀할 수 있다.

<!-- body -->

## Klog

klog는 쿠버네티스의 로깅 라이브러리다. [klog](https://github.com/kubernetes/klog)는 
쿠버네티스 시스템 컴포넌트의 로그 메시지를 생성한다.

klog 설정에 대한 더 많은 정보는, [커맨드라인 툴](/ko/docs/reference/command-line-tools-reference/)을 참고한다.

쿠버네티스는 각 컴포넌트의 로깅을 간소화하는 중에 있다. 
다음 klog 명령줄 플래그는 쿠버네티스 1.23에서 
[사용 중단](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components)되었으며 
이후 릴리스에서 제거될 것이다.

- `--add-dir-header`
- `--alsologtostderr`
- `--log-backtrace-at`
- `--log-dir`
- `--log-file`
- `--log-file-max-size`
- `--logtostderr`
- `--one-output`
- `--skip-headers`
- `--skip-log-headers`
- `--stderrthreshold`

출력은 출력 형식에 관계없이 항상 표준 에러(stderr)에 기록될 것이다. 
출력 리다이렉션은 쿠버네티스 컴포넌트를 호출하는 컴포넌트가 담당할 것으로 기대된다. 
이는 POSIX 셸 또는 systemd와 같은 도구일 수 
있다.

배포판과 무관한(distroless) 컨테이너 또는 윈도우 시스템 서비스와 같은 몇몇 경우에서, 
위의 옵션은 사용할 수 없다. 
그런 경우 출력을 리다이렉트하기 위해 
[`kube-log-runner`](https://github.com/kubernetes/kubernetes/blob/d2a8a81639fcff8d1221b900f66d28361a170654/staging/src/k8s.io/component-base/logs/kube-log-runner/README.md) 
바이너리를 쿠버네티스 컴포넌트의 래퍼(wrapper)로 사용할 수 있다. 
미리 빌드된 바이너리가 몇몇 쿠버네티스 베이스 이미지에 기본 이름 `/go-runner` 와 
서버 및 노드 릴리스 아카이브에는 `kube-log-runner`라는 이름으로 포함되어 있다.

다음 표는 각 `kube-log-runner` 실행법이 어떤 셸 리다이렉션에 해당되는지 보여준다.

| 사용법                                    | POSIX 셸 (예:) bash) | `kube-log-runner <options> <cmd>`                           |
| -----------------------------------------|----------------------------|-------------------------------------------------------------|
| stderr와 stdout을 합치고, stdout으로 출력 | `2>&1`                     | `kube-log-runner` (기본 동작))                        |
| stderr와 stdout을 로그 파일에 기록              | `1>>/tmp/log 2>&1`         | `kube-log-runner -log-file=/tmp/log`                        |
| 로그 파일에 기록하면서 stdout으로 출력        | `2>&1 \| tee -a /tmp/log`  | `kube-log-runner -log-file=/tmp/log -also-stdout`           |
| stdout만 로그 파일에 기록      | `>/tmp/log`                | `kube-log-runner -log-file=/tmp/log -redirect-stderr=false` |

### Klog 출력

klog 네이티브 형식 예 : 
```
I1025 00:15:15.525108       1 httplog.go:79] GET /api/v1/namespaces/kube-system/pods/metrics-server-v0.3.1-57c75779f-9p8wg: (1.512ms) 200 [pod_nanny/v0.0.0 (linux/amd64) kubernetes/$Format 10.56.1.19:51756]
```

메시지 문자열은 줄바꿈을 포함하고 있을 수도 있다.
```
I1025 00:15:15.525108       1 example.go:79] This is a message
which has a line break.
```


### 구조화된 로깅

{{< feature-state for_k8s_version="v1.23" state="beta" >}}

{{< warning >}}
구조화된 로그메시지로 마이그레이션은 진행중인 작업이다. 이 버전에서는 모든 로그 메시지가 구조화되지 않는다. 로그 파일을 파싱할 때, 구조화되지 않은 로그 메시지도 처리해야 한다.

로그 형식 및 값 직렬화는 변경될 수 있다.
{{< /warning>}}

구조화된 로깅은 로그 메시지에 통일된 구조를 적용하여 정보를 쉽게 추출하고,
로그를 보다 쉽고 저렴하게 저장하고 처리하는 작업이다.
새로운 메시지 형식은 이전 버전과 호환되며 기본적으로 활성화 된다.

구조화된 로그 메시지의 기본 형식은 텍스트이며, 
기존 klog와 하위 호환되는 형식이다.

```ini
<klog header> "<message>" <key1>="<value1>" <key2>="<value2>" ...
```

예시:

```ini
I1025 00:15:15.525108       1 controller_utils.go:116] "Pod status updated" pod="kube-system/kubedns" status="ready"
```

문자열은 따옴표로 감싸진다. 다른 값들은 
[`%+v`](https://pkg.go.dev/fmt#hdr-Printing)로 포맷팅되며, 이로 인해 
[데이터에 따라](https://github.com/kubernetes/kubernetes/issues/106428) 로그 메시지가 다음 줄로 이어질 수 있다.
```
I1025 00:15:15.525108       1 example.go:116] "Example" data="This is text with a line break\nand \"quotation marks\"." someInt=1 someFloat=0.1 someStruct={StringField: First line,
second line.}
```

### JSON 로그 형식

{{< feature-state for_k8s_version="v1.19" state="alpha" >}}

{{<warning >}}
JSON 출력은 많은 표준 klog 플래그를 지원하지 않는다. 지원하지 않는 klog 플래그 목록은, [커맨드라인 툴](/ko/docs/reference/command-line-tools-reference/)을 참고한다.

모든 로그가 JSON 형식으로 작성되는 것은 아니다(예: 프로세스 시작 중). 로그를 파싱하려는 경우 JSON 형식이 아닌 로그 행을 처리할 수 있는지 확인해야 한다.

필드 이름과 JSON 직렬화는 변경될 수 있다.
{{< /warning >}}

`--logging-format=json` 플래그는 로그 형식을 klog 기본 형식에서 JSON 형식으로 변경한다.
JSON 로그 형식 예시(보기좋게 출력된 형태)는 다음과 같다.
```json
{
   "ts": 1580306777.04728,
   "v": 4,
   "msg": "Pod status updated",
   "pod":{
      "name": "nginx-1",
      "namespace": "default"
   },
   "status": "ready"
}
```

특별한 의미가 있는 키: 
* `ts` - Unix 시간의 타임스탬프 (필수, 부동 소수점)
* `v` - 자세한 정도 (필수, 정수, 기본 값 0)
* `err` - 오류 문자열 (선택 사항, 문자열)
* `msg` - 메시지 (필수, 문자열)


현재  JSON 형식을 지원하는 컴포넌트 목록:
* {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
* {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
* {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}
* {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}

### 로그 정리(sanitization)

{{< feature-state for_k8s_version="v1.20" state="alpha" >}}

{{<warning >}}
로그 정리(sanitization)는 상당한 오버 헤드를 발생시킬 수 있으므로 프로덕션 환경에서는 사용하지 않아야한다.
{{< /warning >}}

 `--experimental-logging-sanitization` 플래그는 klog 정리(sanitization) 필터를 활성화한다.
활성화된 경우 모든 로그 인자에서 민감한 데이터(예: 비밀번호, 키, 토큰)가 표시된 필드를 검사하고 이러한 필드의 로깅이 방지된다.

현재 로그 정리(sanitization)를 지원하는 컴포넌트 목록:
* kube-controller-manager
* kube-apiserver
* kube-scheduler
* kubelet

{{< note >}}
로그 정리(sanitization) 필터는 사용자 작업 로그로부터 민감한 데이터가 유출되는 것을 방지할 수 없다.
{{< /note >}}

### 로그 상세 레벨(verbosity)

`-v` 플래그로 로그 상세 레벨(verbosity)을 제어한다. 값을 늘리면 기록된 이벤트 수가 증가한다. 값을 줄이면 기록된 이벤트 수가 줄어든다.
로그 상세 레벨(verbosity)를 높이면 점점 덜 심각한 이벤트가 기록된다. 로그 상세 레벨(verbosity)을 0으로 설정하면 중요한 이벤트만 기록된다.

### 로그 위치

시스템 컴포넌트에는 컨테이너에서 실행되는 것과 컨테이너에서 실행되지 않는 두 가지 유형이 있다.
예를 들면 다음과 같다.

* 쿠버네티스 스케줄러와 kube-proxy는 컨테이너에서 실행된다.
* kubelet과 {{<glossary_tooltip term_id="container-runtime" text="컨테이너 런타임">}}은 
  컨테이너에서 실행되지 않는다.

systemd를 사용하는 시스템에서는, kubelet과 컨테이너 런타임은 jounald에 기록한다.
그 외 시스템에서는, `/var/log` 디렉터리의 `.log` 파일에 기록한다.
컨테이너 내부의 시스템 컴포넌트들은 기본 로깅 메커니즘을 무시하고,
항상 `/var/log` 디렉터리의 `.log` 파일에 기록한다.
컨테이너 로그와 마찬가지로, `/var/log` 디렉터리의 시스템 컴포넌트 로그들은 로테이트해야 한다.
`kube-up.sh` 스크립트로 생성된 쿠버네티스 클러스터에서는, `logrotate` 도구로 로그가 로테이트되도록 설정된다.
`logrotate` 도구는 로그가 매일 또는 크기가 100MB 보다 클 때 로테이트된다.

## {{% heading "whatsnext" %}}

* [쿠버네티스 로깅 아키텍처](/ko/docs/concepts/cluster-administration/logging/) 알아보기
* [구조화된 로깅](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/1602-structured-logging) 알아보기
* [klog 플래그 사용 중단](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components) 알아보기
* [로깅 심각도(serverity) 규칙](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md) 알아보기
