---
title: 쿠버네티스 컨트롤 플레인에 대한 메트릭
content_type: concept
weight: 60
aliases:
- controller-metrics.md
---

<!-- overview -->

시스템 컴포넌트 메트릭으로 내부에서 발생하는 상황을 더 잘 파악할 수 있다. 메트릭은 대시보드와 경고를 만드는 데 특히 유용하다.

쿠버네티스 컨트롤 플레인의 메트릭은 [프로메테우스 형식](https://prometheus.io/docs/instrumenting/exposition_formats/)으로 출력되며 사람이 읽기 쉽다.



<!-- body -->

## 쿠버네티스의 메트릭

대부분의 경우 메트릭은 HTTP 서버의 `/metrics` 엔드포인트에서 사용할 수 있다. 기본적으로 엔드포인트를 노출하지 않는 컴포넌트의 경우 `--bind-address` 플래그를 사용하여 활성화할 수 있다.

해당 컴포넌트의 예는 다음과 같다.

* {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
* {{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}}
* {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
* {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}
* {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}

프로덕션 환경에서는 이러한 메트릭을 주기적으로 수집하고 시계열 데이터베이스에서 사용할 수 있도록
[프로메테우스 서버](https://prometheus.io/) 또는 다른 메트릭 수집기(scraper)를 구성할 수 있다.

참고로 {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}도 `/metrics/cadvisor`, `/metrics/resource` 그리고 `/metrics/probes` 엔드포인트에서 메트릭을 노출한다. 이러한 메트릭은 동일한 라이프사이클을 가지지 않는다.

클러스터가 {{< glossary_tooltip term_id="rbac" text="RBAC" >}}을 사용하는 경우, 메트릭을 읽으려면 `/metrics` 에 접근을 허용하는 클러스터롤(ClusterRole)을 가지는 사용자, 그룹 또는 서비스어카운트(ServiceAccount)를 통한 권한이 필요하다.
예를 들면, 다음과 같다.
```
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

알파 메트릭 → 안정적인 메트릭 → 사용 중단된 메트릭 → 히든(hidden) 메트릭 → 삭제

알파 메트릭은 안정성을 보장하지 않는다. 따라서 언제든지 수정되거나 삭제될 수 있다.

안정적인 메트릭은 변경되지 않는다는 보장을 할 수 있다. 특히 안정성은 다음을 의미한다.

* 메트릭 자체는 삭제되거나 이름이 변경되지 않는다
* 메트릭 유형은 수정되지 않는다

사용 중단된 메트릭은 메트릭이 결국 삭제된다는 것을 나타낸다. 어떤 버전을 찾으려면, 해당 메트릭이 어떤 쿠버네티스 버전에서부터 사용 중단될 것인지를 고려하는 내용을 포함하는 어노테이션을 확인해야 한다.

사용 중단되기 전에는 아래와 같다.

```
# HELP some_counter this counts things
# TYPE some_counter counter
some_counter 0
```

사용 중단된 이후에는 아래와 같다.

```
# HELP some_counter (Deprecated since 1.15.0) this counts things
# TYPE some_counter counter
some_counter 0
```

메트릭이 일단 숨겨지면 기본적으로 메트릭은 수집용으로 게시되지 않는다. 히든 메트릭을 사용하려면, 관련 클러스터 컴포넌트의 구성을 오버라이드(override)해야 한다.

메트릭이 삭제되면, 메트릭이 게시되지 않는다. 오버라이드해서 이를 변경할 수 없다.


## 히든 메트릭 표시

위에서 설명한 것처럼, 관리자는 특정 바이너리의 커맨드 라인 플래그를 통해 히든 메트릭을 활성화할 수 있다. 관리자가 지난 릴리스에서 사용 중단된 메트릭의 마이그레이션을 놓친 경우 관리자를 위한 임시방편으로 사용된다.

`show-hidden-metrics-for-version` 플래그는 해당 릴리스에서 사용 중단된 메트릭을 보여주려는 버전을 사용한다. 버전은 xy로 표시되며, 여기서 x는 메이저(major) 버전이고, y는 마이너(minor) 버전이다. 패치 릴리스에서 메트릭이 사용 중단될 수 있지만, 패치 버전은 필요하지 않다. 그 이유는 메트릭 사용 중단 정책이 마이너 릴리스에 대해 실행되기 때문이다.

플래그는 그 값으로 이전의 마이너 버전만 사용할 수 있다. 관리자가 이전 버전을 `show-hidden-metrics-for-version` 에 설정하면 이전 버전의 모든 히든 메트릭이 생성된다. 사용 중단 메트릭 정책을 위반하기 때문에 너무 오래된 버전은 허용되지 않는다.

1.n 버전에서 사용 중단되었다고 가정한 메트릭 `A` 를 예로 들어보겠다. 메트릭 사용 중단 정책에 따르면, 다음과 같은 결론에 도달할 수 있다.

* `1.n` 릴리스에서는 메트릭이 사용 중단되었으며, 기본적으로 생성될 수 있다.
* `1.n+1` 릴리스에서는 기본적으로 메트릭이 숨겨져 있으며, `show-hidden-metrics-for-version=1.n` 커맨드 라인에 의해서 생성될 수 있다.
* `1.n+2` 릴리스에서는 코드베이스에서 메트릭이 제거되어야 한다. 더이상 임시방편은 존재하지 않는다.

릴리스 `1.12` 에서 `1.13` 으로 업그레이드 중이지만, `1.12` 에서 사용 중단된 메트릭 `A` 를 사용하고 있다면, 커맨드 라인에서 `--show-hidden-metrics=1.12` 플래그로 히든 메트릭을 설정해야 하고, `1.14` 로 업그레이드하기 전에 이 메트릭을 사용하지 않도록 의존성을 제거하는 것을 기억해야 한다.

## 컴포넌트 메트릭

### kube-controller-manager 메트릭

컨트롤러 관리자 메트릭은 컨트롤러 관리자의 성능과 상태에 대한 중요한 인사이트를 제공한다.
이러한 메트릭에는 go_routine 수와 같은 일반적인 Go 언어 런타임 메트릭과
etcd 요청 대기 시간 또는 Cloudprovider(AWS, GCE, OpenStack) API 대기 시간과 같은 컨트롤러 특정 메트릭이 포함되어
클러스터의 상태를 측정하는 데 사용할 수 있다.

쿠버네티스 1.7부터 GCE, AWS, Vsphere 및 OpenStack의 스토리지 운영에 대한 상세한 Cloudprovider 메트릭을 사용할 수 있다.
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



## {{% heading "whatsnext" %}}

* 메트릭에 대한 [프로메테우스 텍스트 형식](https://github.com/prometheus/docs/blob/master/content/docs/instrumenting/exposition_formats.md#text-based-format)에 대해 읽어본다
* [안정적인 쿠버네티스 메트릭](https://github.com/kubernetes/kubernetes/blob/master/test/instrumentation/testdata/stable-metrics-list.yaml) 목록을 참고한다
* [쿠버네티스 사용 중단 정책](/docs/reference/using-api/deprecation-policy/#deprecating-a-feature-or-behavior)에 대해 읽어본다
