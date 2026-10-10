---
title: 쿠버네티스 API 헬스(health) 엔드포인트
# reviewers:
# - logicalhan
content_type: concept
weight: 50
---

<!-- overview -->
쿠버네티스 {{< glossary_tooltip term_id="kube-apiserver" text="API 서버" >}}는 현재 상태를 나타내는 API 엔드포인트를 제공한다.
이 페이지에서는 API 엔드포인트들에 대해 설명하고 이를 사용하는 방법을 다룬다.

<!-- body -->

## 헬스를 위한 API 엔드포인트

쿠버네티스 API 서버는 현재 상태를 나타내는 세 가지 API 엔드포인트(`healthz`, `livez` 와 `readyz`)를 제공한다.
`healthz` 엔드포인트는 사용 중단(deprecated)됐으며 (쿠버네티스  v1.16 버전 이후), 대신 보다 구체적인 `livez` 와 `readyz` 엔드포인트를 사용해야 한다.
`livez` 엔드포인트는 `--livez-grace-period` [플래그](/docs/reference/command-line-tools-reference/kube-apiserver) 옵션을 사용하여 시작 대기 시간을 지정할 수 있다.
`/readyz` 엔드포인트는 `--shutdown-delay-duration` [플래그](/docs/reference/command-line-tools-reference/kube-apiserver) 옵션을 사용하여 정상적(graceful)으로 셧다운할 수 있다.
API 서버의 `healthz`/`livez`/`readyz` 를 사용하는 머신은 HTTP 상태 코드에 의존해야 한다.
상태 코드 200은 호출된 엔드포인트에 따라 API 서버의 `healthy`/`live`/`ready` 상태를 나타낸다.
아래 표시된 더 자세한 옵션은 운영자가 클러스터를 디버깅하거나 특정 API 서버의 상태를 이해하는 데 사용할 수 있다.

다음의 예시는 헬스 API 엔드포인트와 상호 작용할 수 있는 방법을 보여준다.

모든 엔드포인트에 대해, `verbose` 파라미터를 사용하여 검사 항목과 상태를 출력할 수 있다.
이는 운영자가 머신 사용을 위한 것이 아닌, API 서버의 현재 상태를 디버깅하는데 유용하다.

```shell
curl -k https://localhost:6443/livez?verbose
```

인증을 사용하는 원격 호스트에서 사용할 경우에는 다음과 같이 수행한다.

```shell
kubectl get --raw='/readyz?verbose'
```

출력은 다음과 같다.

    [+]ping ok
    [+]log ok
    [+]etcd ok
    [+]poststarthook/start-kube-apiserver-admission-initializer ok
    [+]poststarthook/generic-apiserver-start-informers ok
    [+]poststarthook/start-apiextensions-informers ok
    [+]poststarthook/start-apiextensions-controllers ok
    [+]poststarthook/crd-informer-synced ok
    [+]poststarthook/bootstrap-controller ok
    [+]poststarthook/rbac/bootstrap-roles ok
    [+]poststarthook/scheduling/bootstrap-system-priority-classes ok
    [+]poststarthook/start-cluster-authentication-info-controller ok
    [+]poststarthook/start-kube-aggregator-informers ok
    [+]poststarthook/apiservice-registration-controller ok
    [+]poststarthook/apiservice-status-available-controller ok
    [+]poststarthook/kube-apiserver-autoregistration ok
    [+]autoregister-completion ok
    [+]poststarthook/apiservice-openapi-controller ok
    healthz check passed

또한 쿠버네티스 API 서버는 특정 체크를 제외할 수 있다.
쿼리 파라미터는 다음 예와 같이 조합될 수 있다.

```shell
curl -k 'https://localhost:6443/readyz?verbose&exclude=etcd'
```

출력에서 etcd 체크가 제외된 것을 보여준다.

    [+]ping ok
    [+]log ok
    [+]etcd excluded: ok
    [+]poststarthook/start-kube-apiserver-admission-initializer ok
    [+]poststarthook/generic-apiserver-start-informers ok
    [+]poststarthook/start-apiextensions-informers ok
    [+]poststarthook/start-apiextensions-controllers ok
    [+]poststarthook/crd-informer-synced ok
    [+]poststarthook/bootstrap-controller ok
    [+]poststarthook/rbac/bootstrap-roles ok
    [+]poststarthook/scheduling/bootstrap-system-priority-classes ok
    [+]poststarthook/start-cluster-authentication-info-controller ok
    [+]poststarthook/start-kube-aggregator-informers ok
    [+]poststarthook/apiservice-registration-controller ok
    [+]poststarthook/apiservice-status-available-controller ok
    [+]poststarthook/kube-apiserver-autoregistration ok
    [+]autoregister-completion ok
    [+]poststarthook/apiservice-openapi-controller ok
    [+]shutdown ok
    healthz check passed

## 개별 헬스 체크

{{< feature-state state="alpha" >}}

각 개별 헬스 체크는 HTTP 엔드포인트를 노출하며 개별적으로 체크할 수 있다.
개별 체크를 위한 스키마는 `/livez/<healthcheck-name>` 이고, 여기서 `livez` 와 `readyz` 는 API 서버의 활성 상태 또는 준비 상태인지를 확인할 때 사용한다.
`<healthcheck-name>` 경로 위에서 설명한 `verbose` 플래그를 사용해서 찾을 수 있고, `[+]` 와 `ok` 사이의 경로를 사용한다.
이러한 개별 헬스 체크는 머신에서 사용되서는 안되며, 운영자가 시스템의 현재 상태를 디버깅하는데 유용하다.

```shell
curl -k https://localhost:6443/livez/etcd
```
