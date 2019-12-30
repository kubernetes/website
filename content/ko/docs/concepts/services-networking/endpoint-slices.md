---
title: 엔드포인트 슬라이스
feature:
  title: 엔드포인트 슬라이스
  description: >
    쿠버네티스 클러스터에서 확장 가능한 네트워크 엔드포인트 추적.

content_template: templates/concept
weight: 10
---


{{% capture overview %}}

{{< feature-state for_k8s_version="v1.17" state="beta" >}}

_엔드포인트 슬라이스_ 는 쿠버네티스 클러스터 내의 네트워크 엔드포인트를
추적하는 간단한 방법을 제공한다. 이것은 엔드포인트를 더 확장하고, 확장 가능한
대안을 제안한다.

{{% /capture %}}

{{% capture body %}}

## 엔드포인트 슬라이스 리소스 {#endpointslice-resource}

쿠버네티스에서 EndpointSlice는 일련의 네트워크 엔드 포인트에 대한
참조를 포함한다. 쿠버네티스 서비스에 셀렉터가 지정되면 EndpointSlice
컨트롤러는 자동으로 엔드포인트 슬라이스를 생성한다. 이 엔드포인트 슬라이스는
서비스 셀렉터와 매치되는 모든 파드들을 포함하고 참조한다. 엔드포인트
슬라이스는 고유한 서비스와 포트 조합을 통해 네트워크 엔드포인트를 그룹화 한다.

예를 들어, 여기에 `example` 쿠버네티스 서비스를 위한 EndpointSlice
리소스 샘플이 있다.

```yaml
apiVersion: discovery.k8s.io/v1beta1
kind: EndpointSlice
metadata:
  name: example-abc
  labels:
    kubernetes.io/service-name: example
addressType: IPv4
ports:
  - name: http
    protocol: TCP
    port: 80
endpoints:
  - addresses:
    - "10.1.2.3"
    conditions:
      ready: true
    hostname: pod-1
    topology:
      kubernetes.io/hostname: node-1
      topology.kubernetes.io/zone: us-west2-a
```

기본적으로, EndpointSlice 컨트롤러가 관리하는 엔드포인트 슬라이스에는
각각 100개 이하의 엔드포인트를 가지고 있다. 이 스케일 아래에서 엔드포인트 슬라이스는
엔드포인트 및 서비스와 1:1로 매핑해야하며, 유사한 성능을 가져야 한다.

엔드포인트 슬라이스는 내부 트래픽을 라우트하는 방법에 대해 kube-proxy에
신뢰할 수 있는 소스로 역할을 할 수 있다. 이를 활성화 하면, 많은 수의 엔드포인트를 가지는
서비스에 대해 성능 향상을 제공해야 한다.

## 주소 유형

EndpointSlice는 다음 주소 유형을 지원한다.

* IPv4
* IPv6
* FQDN (Fully Qualified Domain Name)

## 사용동기

엔드포인트 API는 쿠버네티스에서 네트워크 엔드포인트를 추적하는
간단하고 직접적인 방법을 제공한다. 불행하게도 쿠버네티스 클러스터와
서비스가 점점 더 커짐에 따라, 이 API의 한계가 더욱 눈에 띄게 되었다.
특히나, 많은 수의 네트워크 엔드포인트로 확장하는 것에
어려움이 있었다.

이후로 서비스에 대한 모든 네트워크 엔드포인트가 단일 엔드포인트
리소스에 저장되기 때문에 엔드포인트 리소스가 상당히 커질 수 있다. 이것은 쿠버네티스
구성요소 (특히 마스터 컨트롤 플레인)의 성능에 영향을 미쳤고
엔드포인트가 변경될 때 상당한 양의 네트워크 트래픽과 처리를 초래했다.
엔드포인트 슬라이스는 이러한 문제를 완화하고 토폴로지 라우팅과
같은 추가 기능을 위한 확장 가능한 플랫폼을 제공한다.

{{% /capture %}}

{{% capture whatsnext %}}

* [엔드포인트 슬라이스 활성화하기](/docs/tasks/administer-cluster/enabling-endpoint-slices)
* [애플리케이션을 서비스와 함께 연결하기](/docs/concepts/services-networking/connect-applications-service/) 를 읽는다.

{{% /capture %}}
