---
reviewers:
- freehan
title: 엔드 포인트 슬라이스
feature:
  title: 엔드 포인트 슬라이스
  description: >
    쿠버네티스 클러스터의 네트워크 엔드 포인트의 확장이 가능한 추적 방법

content_template: templates/concept
weight: 10
---


{{% capture overview %}}

{{< feature-state for_k8s_version="v1.16" state="alpha" >}}

_엔드 포인트 슬라이스_ 
쿠버네티스 클러스터 내에서 네트워크 엔드 포인트를 추적하는 간단한 방법을 제공합니다.
엔드 포인트에 대해 보다 확장 가능한 대안을 제공합니다.

{{% /capture %}}

{{% capture body %}}

## 엔드 포인트 슬라이스 리소스들 {#endpointslice-resource}


쿠버네티스에서 엔드 포인트 슬라이스에는 일련의 네트워크 엔드 포인트에 대한 참조가 포함됩니다. 선택 장치가 지정되면 엔드 포인트 슬라이스 컨트롤러가 쿠버네티스 서비스에 대한 엔드 포인트 슬라이스를 자동으로 생성합니다. 이 엔드 포인트 슬라이스에는 서비스 선택 장치와 일치하는 모든 포드에 대한 참조가 포함됩니다. 엔드 포인트 슬라이스는 고유한 서비스 및 포트 조합으로 네트워크 엔드 포인트를 그룹화합니다.

예를 들어,`example`은 쿠버네티스 서비스에 대한 샘플 앤드 포인트 슬라이스 리소스가 있습니다.

```yaml
apiVersion: discovery.k8s.io/v1alpha1
kind: EndpointSlice
metadata:
  name: example-abc
  labels:
    kubernetes.io/service-name: example
addressType: IP
ports:
  - name: http
    protocol: TCP
    port: 80
endpoints:
  - addresses:
    - "10.1.2.3"
    - "2001:db8::1234:5678"
    conditions:
      ready: true
    hostname: pod-1
    topology:
      kubernetes.io/hostname: node-1
      topology.kubernetes.io/zone: us-west2-a
```

기본적으로 엔드 포인트 슬라이스 컨트롤러가 관리하는 엔드 포인트 슬라이스는 각각 100개 이하의 엔드 포인트가 있습니다. 
이 스케일 아래에서 엔드 포인트 슬라이스는 엔드 포인트 및 서비스와 1 : 1을 매핑해야 하며 유사한 성능을 가져야합니다.

엔드 포인트 슬라이스는 내부 트래픽을 라우팅하는 방법에 있어 kube-proxy가 참인 소스 역할을 할 수 있습니다. 
활성화될 경우,엔드 포인트가 많은 서비스의 성능을 향상시켜야 합니다.

## 동기

엔드 포인트 API는 쿠버네티스에서 네트워크 엔드 포인트를 간단하고 복잡하지 않고 쉬운 추적을 할 수있는 방법을 제공했습니다. 
불행하게도 쿠버네티스 클러스터와 서비스가 커지면서 해당 API의 한계가 더욱 눈에 띄게되었습니다. 
특히 많은 수의 네트워크 엔드 포인트로 확장하는 것에 어려움이 있었습니다.

서비스의 모든 네트워크 엔드 포인트는 단일 엔드 포인트 리소스에 저장되었기 때문에 이러한 리소스가 상당히 커질 수 있습니다.
이는 쿠버네티스 구성 요소(특히 마스터의 제어면에서)의 성능에 영향을 미쳤으며 엔드 포인트가 변경될 때 상당한 양의 네트워크 트래픽 및 처리를 유발했습니다.
엔드 포인트 슬라이스는 이러한 문제를 완화하고 위상학적 라우팅과 같은 추가 기능을 위한 확장 가능한 플랫폼을 제공합니다.

{{% /capture %}}

{{% capture 다음에 할 사항 %}}

* [엔드 포인트 슬라이스 활성화](/docs/tasks/administer-cluster/enabling-endpoint-slices)
* [서비스와 응용 프로그램 연결](/docs/concepts/services-networking/connect-applications-service/)를 읽으시기 바랍니다.

{{% /capture %}}
