---
title: 쿠버네티스 시스템 컴포넌트에 대한 메트릭
# reviewers:
# - brancz
# - logicalhan
# - RainbowMango
content_type: concept
weight: 70
---

<!-- overview -->

시스템 컴포넌트 메트릭으로 내부에서 발생하는 상황을 더 잘 파악할 수 있다. 메트릭은
대시보드와 경고를 만드는 데 특히 유용하다.

쿠버네티스 컴포넌트의 메트릭은 [프로메테우스 형식](https://prometheus.io/docs/instrumenting/exposition_formats/)으로 출력된다.
이 형식은 구조화된 평문으로 디자인되어 있으므로 사람과 기계 모두가 쉽게 읽을 수 있다.

<!-- body -->

## 쿠버네티스의 메트릭

대부분의 경우 메트릭은 HTTP 서버의 `/metrics` 엔드포인트에서 사용할 수 있다.
기본적으로 엔드포인트를 노출하지 않는 컴포넌트의 경우 `--bind-address` 플래그를 사용하여 활성화할 수 있다.

해당 컴포넌트의 예는 다음과 같다.

* {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
* {{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}}
* {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
* {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}
* {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}

프로덕션 환경에서는 이러한 메트릭을 주기적으로 수집하고
시계열 데이터베이스에서 사용할 수 있도록 [프로메테우스 서버](https://prometheus.io/) 또는
다른 메트릭 수집기(scraper)를 구성할 수 있다.

참고로 {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}도
`/metrics/cadvisor`, `/metrics/resource` 그리고 `/metrics/probes` 엔드포인트에서 메트릭을 노출한다.
이러한 메트릭은 동일한 라이프사이클을 가지지 않는다.

클러스터가 {{< glossary_tooltip term_id="rbac" text="RBAC" >}}을 사용하는 경우, 메트릭을 읽으려면
`/metrics` 에 접근을 허용하는 클러스터롤(ClusterRole)을 가지는 사용자, 그룹 또는 서비스어카운트(ServiceAccount)를 통한 권한이 필요하다.
예를 들면, 다음과 같다.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: prometheus
rules:
  - nonResourceURLs:
      - "/metrics"
    verbs:
      - get
```

## 메트릭 라이프사이클

알파(Alpha) 메트릭 → 안정적인(Stable) 메트릭 → 사용 중단된(Deprecated) 메트릭 → 히든(Hidden) 메트릭 → 삭제된(Deleted) 메트릭

알파 메트릭은 안정성을 보장하지 않는다. 따라서 언제든지 수정되거나 삭제될 수 있다.

안정적인 메트릭은 변경되지 않는다는 것을 보장한다. 이것은 다음을 의미한다.

* 사용 중단 표기가 없는 안정적인 메트릭은, 이름이 변경되거나 삭제되지 않는다.
* 안정적인 메트릭의 유형(type)은 수정되지 않는다.

사용 중단된 메트릭은 해당 메트릭이 결국 삭제된다는 것을 나타내지만, 아직은 사용 가능하다는 뜻이다.
이 메트릭은 어느 버전에서부터 사용 중단된 것인지를 표시하는 어노테이션을 포함한다.

예를 들면,

* 사용 중단 이전에는 다음과 같다.

```
# HELP some_counter this counts things
# TYPE some_counter counter
some_counter 0
```

* 사용 중단 이후에는 다음과 같다.

```
# HELP some_counter (Deprecated since 1.15.0) this counts things
# TYPE some_counter counter
some_counter 0
```

히든 메트릭은 깔끔함(scraping)을 위해 더 이상 게시되지는 않지만, 여전히 사용은 가능하다.
히든 메트릭을 사용하려면, [히든 메트릭 표시](#히든-메트릭-표시) 섹션을 참고한다.

삭제된 메트릭은 더 이상 게시되거나 사용할 수 없다.

## 히든 메트릭 표시

위에서 설명한 것처럼, 관리자는 특정 바이너리의 커맨드 라인 플래그를 통해 히든 메트릭을 활성화할 수 있다.
관리자가 지난 릴리스에서 사용 중단된 메트릭의 마이그레이션을 놓친 경우
관리자를 위한 임시방편으로 사용된다.

`show-hidden-metrics-for-version` 플래그는 해당 릴리스에서 사용 중단된 메트릭을 보여주려는
버전을 사용한다. 버전은 xy로 표시되며, 여기서 x는 메이저(major) 버전이고,
y는 마이너(minor) 버전이다. 패치 릴리스에서 메트릭이 사용 중단될 수 있지만, 패치 버전은 필요하지 않다.
그 이유는 메트릭 사용 중단 정책이 마이너 릴리스에 대해 실행되기 때문이다.

플래그는 그 값으로 이전의 마이너 버전만 사용할 수 있다. 관리자가 이전 버전을
`show-hidden-metrics-for-version` 에 설정하면 이전 버전의 모든 히든 메트릭이 생성된다.
사용 중단 메트릭 정책을 위반하기 때문에 너무 오래된 버전은 허용되지 않는다.

1.n 버전에서 사용 중단되었다고 가정한 메트릭 `A` 를 예로 들어보겠다.
메트릭 사용 중단 정책에 따르면, 다음과 같은 결론에 도달할 수 있다.

* `1.n` 릴리스에서는 메트릭이 사용 중단되었으며, 기본적으로 생성될 수 있다.
* `1.n+1` 릴리스에서는 기본적으로 메트릭이 숨겨져 있으며,
  `show-hidden-metrics-for-version=1.n` 커맨드 라인에 의해서 생성될 수 있다.
* `1.n+2` 릴리스에서는 코드베이스에서 메트릭이 제거되어야 한다. 더이상 임시방편은 존재하지 않는다.

릴리스 `1.12` 에서 `1.13` 으로 업그레이드 중이지만, `1.12` 에서 사용 중단된 메트릭 `A` 를 사용하고 있다면,
커맨드 라인에서 `--show-hidden-metrics=1.12` 플래그로 히든 메트릭을 설정해야 하고,
`1.14` 로 업그레이드하기 전에 이 메트릭을 사용하지 않도록 의존성을 제거하는 것을 기억해야 한다.

## 액셀러레이터 메트릭 비활성화

kubelet은 cAdvisor를 통해 액셀러레이터 메트릭을 수집한다. 이러한 메트릭을 수집하기 위해,
NVIDIA GPU와 같은 액셀러레이터의 경우, kubelet은 드라이버에 열린 핸들을 가진다.
이는 인프라 변경(예: 드라이버 업데이트)을 수행하기 위해,
클러스터 관리자가 kubelet 에이전트를 중지해야 함을 의미한다.

액셀러레이터 메트릭을 수집하는 책임은 이제 kubelet이 아닌 공급 업체에 있다.
공급 업체는 메트릭을 수집하여 메트릭 서비스(예: 프로메테우스)에 노출할
컨테이너를 제공해야 한다.

[`DisableAcceleratorUsageMetrics` 기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/#알파-또는-베타-기능을-위한-기능-게이트:~:text=DisableAcceleratorUsageMetrics,-false)는
[이 기능을 기본적으로 사용하도록 설정하는 타임라인](https://github.com/kubernetes/enhancements/tree/411e51027db842355bd489691af897afc1a41a5e/keps/sig-node/1867-disable-accelerator-usage-metrics#graduation-criteria)를
사용하여 kubelet에서 수집한 메트릭을 비활성화한다.

## 컴포넌트 메트릭

### kube-controller-manager 메트릭

컨트롤러 관리자 메트릭은 컨트롤러 관리자의 성능과 상태에 대한 중요한 인사이트를 제공한다.
이러한 메트릭에는 go_routine 수와 같은 일반적인 Go 언어 런타임 메트릭과
etcd 요청 대기 시간 또는 Cloudprovider(AWS, GCE, OpenStack) API 대기 시간과 같은 컨트롤러 특정 메트릭이 포함되어
클러스터의 상태를 측정하는 데 사용할 수 있다.

쿠버네티스 1.7부터 GCE, AWS, Vsphere 및 OpenStack의 스토리지 운영에 대한
상세한 Cloudprovider 메트릭을 사용할 수 있다.
이 메트릭은 퍼시스턴트 볼륨 동작의 상태를 모니터링하는 데 사용할 수 있다.

예를 들어, GCE의 경우 이러한 메트릭을 다음과 같이 호출한다.

```
cloudprovider_gce_api_request_duration_seconds { request = "instance_list"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_insert"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_delete"}
cloudprovider_gce_api_request_duration_seconds { request = "attach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "detach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "list_disk"}
```


### kube-scheduler 메트릭

{{< feature-state for_k8s_version="v1.21" state="beta" >}}

스케줄러는 실행 중인 모든 파드의 요청(request)된 리소스와 요구되는 제한(limit)을 보고하는 선택적 메트릭을 노출한다.
이러한 메트릭은 용량 계획(capacity planning) 대시보드를 구축하고,
현재 또는 과거 스케줄링 제한을 평가하고, 리소스 부족으로 스케줄할 수 없는 워크로드를 빠르게 식별하고,
실제 사용량을 파드의 요청과 비교하는 데 사용할 수 있다.

kube-scheduler는 각 파드에 대해 구성된 리소스 [요청과 제한](/ko/docs/concepts/configuration/manage-resources-containers/)을 식별한다.
요청 또는 제한이 0이 아닌 경우 kube-scheduler는 메트릭 시계열을 보고한다.
시계열에는 다음과 같은 레이블이 지정된다.

- 네임스페이스
- 파드 이름
- 파드가 스케줄된 노드 또는 아직 스케줄되지 않은 경우 빈 문자열
- 우선순위
- 해당 파드에 할당된 스케줄러
- 리소스 이름 (예: `cpu`)
- 알려진 경우 리소스 단위 (예: `cores`)

파드가 완료되면 (`Never` 또는 `OnFailure`의 `restartPolicy`가 있고
`Succeeded` 또는 `Failed` 파드 단계에 있거나, 삭제되고 모든 컨테이너가 종료된 상태에 있음)
스케줄러가 이제 다른 파드를 실행하도록 스케줄할 수 있으므로 시리즈가 더 이상 보고되지 않는다.
두 메트릭을 `kube_pod_resource_request` 및 `kube_pod_resource_limit` 라고 한다.

메트릭은 HTTP 엔드포인트 `/metrics/resources`에 노출되며
스케줄러의 `/metrics` 엔드포인트와 동일한 인증이 필요하다.
이러한 알파 수준의 메트릭을 노출시키려면 `--show-hidden-metrics-for-version=1.20` 플래그를 사용해야 한다.

## 메트릭 비활성화

커맨드 라인 플래그 `--disabled-metrics` 를 통해 메트릭을 명시적으로 끌 수 있다.
이 방법이 필요한 이유는 메트릭이 성능 문제를 일으키는 경우을 예로 들 수 있다.
입력값은 비활성화되는 메트릭 목록이다(예: `--disabled-metrics=metric1,metric2`).

## 메트릭 카디널리티(cardinality) 적용

제한되지 않은 차원의 메트릭은 계측하는 컴포넌트에서 메모리 문제를 일으킬 수 있다.
리소스 사용을 제한하려면, `--allow-label-value` 커맨드 라인 옵션을 사용하여
메트릭 항목에 대한 레이블 값의 허용 목록(allow-list)을 동적으로 구성한다.

알파 단계에서, 플래그는 메트릭 레이블 허용 목록으로 일련의 매핑만 가져올 수 있다.
각 매핑은 `<metric_name>,<label_name>=<allowed_labels>` 형식이다. 여기서
`<allowed_labels>` 는 허용되는 레이블 이름의 쉼표로 구분된 목록이다.

전체 형식은 다음과 같다.

```
--allow-label-value <metric_name>,<label_name>='<allow_value1>, <allow_value2>...', <metric_name2>,<label_name>='<allow_value1>, <allow_value2>...', ...
```

예시는 다음과 같다.

```none
--allow-label-value number_count_metric,odd_number='1,3,5', number_count_metric,even_number='2,4,6', date_gauge_metric,weekend='Saturday,Sunday'
```

## {{% heading "whatsnext" %}}

* 메트릭에 대한 [프로메테우스 텍스트 형식](https://github.com/prometheus/docs/blob/master/content/docs/instrumenting/exposition_formats.md#text-based-format)
  에 대해 읽어본다
* [안정 버전의 쿠버네티스 메트릭](https://github.com/kubernetes/kubernetes/blob/master/test/instrumentation/testdata/stable-metrics-list.yaml) 목록을 살펴본다
* [쿠버네티스 사용 중단 정책](/docs/reference/using-api/deprecation-policy/#deprecating-a-feature-or-behavior)에 대해 읽어본다