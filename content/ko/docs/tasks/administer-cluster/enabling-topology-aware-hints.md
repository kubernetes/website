---
title: 토폴로지 인지 힌트 활성화하기
content_type: task
min-kubernetes-server-version: 1.21
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

_토폴로지 인지 힌트_ 는 {{< glossary_tooltip text="엔드포인트슬라이스(EndpointSlices)" term_id="endpoint-slice" >}}에 포함되어 있는 
토폴로지 정보를 이용해 토폴로지 인지 라우팅을 가능하게 한다.
이 방법은 트래픽을 해당 트래픽이 시작된 곳과 최대한 근접하도록 라우팅하는데,
이를 통해 비용을 줄이거나 네트워크 성능을 향상시킬 수 있다.

## {{% heading "prerequisites" %}}

  {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

토폴로지 인지 힌트를 활성화하기 위해서는 다음의 필수 구성 요소가 필요하다.

* {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}가 
  iptables 모드 혹은 IPVS 모드로 동작하도록 설정
* 엔드포인트슬라이스가 비활성화되지 않았는지 확인

## 토폴로지 인지 힌트 활성화하기

서비스 토폴로지 힌트를 활성화하기 위해서는 kube-apiserver, kube-controller-manager, kube-proxy에 대해
`TopologyAwareHints` [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)를
활성화한다.

```
--feature-gates="TopologyAwareHints=true"
```

## {{% heading "whatsnext" %}}

* 서비스 항목 아래의 [토폴로지 인지 힌트](/docs/concepts/services-networking/topology-aware-hints)를 참고
* [서비스와 애플리케이션 연결하기](/ko/docs/concepts/services-networking/connect-applications-service/)를 참고
