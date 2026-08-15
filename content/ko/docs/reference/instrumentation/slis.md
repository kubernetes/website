---
# reviewers:
# - logicalhan
title: 쿠버네티스 컴포넌트 SLI 메트릭
linkTitle: 서비스 수준 지표(SLI) 메트릭
content_type: reference
weight: 20
description: >-
  쿠버네티스 컴포넌트의 신뢰성과 성능을 측정하기 위한 상위 수준 지표.
---

<!-- overview -->

{{< feature-state feature_gate_name="ComponentSLIs" >}}

기본적으로 쿠버네티스 {{< skew currentVersion >}}는 각 쿠버네티스 컴포넌트 바이너리에 대한
서비스 수준 지표(Service Level Indicator, SLI) 메트릭을 제공한다. 이 메트릭 엔드포인트는
각 컴포넌트가 서비스를 제공하는 HTTPS 포트의 `/metrics/slis` 경로에 노출된다.
`ComponentSLIs` [기능 게이트](/docs/reference/command-line-tools-reference/feature-gates/)는
쿠버네티스 v1.27부터 각 컴포넌트에서 기본적으로 활성화되어 있다.

<!-- body -->

## SLI 메트릭

SLI 메트릭이 활성화되면 각 쿠버네티스 컴포넌트는 헬스 체크별로 레이블이 지정된
두 가지 메트릭을 노출한다.

- 현재 헬스 체크 상태를 나타내는 게이지(gauge)
- 각 헬스 체크 상태에서 관찰된 누적 횟수를 기록하는 카운터(counter)

메트릭 정보를 사용하여 컴포넌트별 가용성 통계를 계산할 수 있다.
예를 들어 API 서버는 etcd의 상태를 확인한다. etcd의 클라이언트인 API 서버가 보고한 값을 토대로
etcd가 얼마나 가용했는지 또는 가용하지 않았는지 계산하고 보고할 수 있다.


프로메테우스 게이지 데이터는 다음과 같다.

```
# HELP kubernetes_healthcheck [ALPHA] This metric records the result of a single healthcheck.
# TYPE kubernetes_healthcheck gauge
kubernetes_healthcheck{name="autoregister-completion",type="healthz"} 1
kubernetes_healthcheck{name="autoregister-completion",type="readyz"} 1
kubernetes_healthcheck{name="etcd",type="healthz"} 1
kubernetes_healthcheck{name="etcd",type="readyz"} 1
kubernetes_healthcheck{name="etcd-readiness",type="readyz"} 1
kubernetes_healthcheck{name="informer-sync",type="readyz"} 1
kubernetes_healthcheck{name="log",type="healthz"} 1
kubernetes_healthcheck{name="log",type="readyz"} 1
kubernetes_healthcheck{name="ping",type="healthz"} 1
kubernetes_healthcheck{name="ping",type="readyz"} 1
```

카운터 데이터는 다음과 같다.

```
# HELP kubernetes_healthchecks_total [ALPHA] This metric records the results of all healthcheck.
# TYPE kubernetes_healthchecks_total counter
kubernetes_healthchecks_total{name="autoregister-completion",status="error",type="readyz"} 1
kubernetes_healthchecks_total{name="autoregister-completion",status="success",type="healthz"} 15
kubernetes_healthchecks_total{name="autoregister-completion",status="success",type="readyz"} 14
kubernetes_healthchecks_total{name="etcd",status="success",type="healthz"} 15
kubernetes_healthchecks_total{name="etcd",status="success",type="readyz"} 15
kubernetes_healthchecks_total{name="etcd-readiness",status="success",type="readyz"} 15
kubernetes_healthchecks_total{name="informer-sync",status="error",type="readyz"} 1
kubernetes_healthchecks_total{name="informer-sync",status="success",type="readyz"} 14
kubernetes_healthchecks_total{name="log",status="success",type="healthz"} 15
kubernetes_healthchecks_total{name="log",status="success",type="readyz"} 15
kubernetes_healthchecks_total{name="ping",status="success",type="healthz"} 15
kubernetes_healthchecks_total{name="ping",status="success",type="readyz"} 15
```

## 이 데이터 사용하기

컴포넌트 SLI 메트릭 엔드포인트는 높은 빈도로 스크래핑되도록 설계되었다. 높은 빈도로
스크래핑하면 게이지 신호를 더 세밀하게 확인할 수 있으며, 이 신호를 사용하여 SLO를
계산할 수 있다. `/metrics/slis` 엔드포인트는 각 쿠버네티스 컴포넌트의 가용성 SLO를
계산하는 데 필요한 원시 데이터를 제공한다.
