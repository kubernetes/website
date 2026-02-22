---
# reviewers:
# - sftim
# - thockin
title: 서비스 클러스터IP 할당
content_type: concept
weight: 120
---


<!-- overview -->

쿠버네티스에서 [서비스](/ko/docs/concepts/services-networking/service/)는 파드 집합에서
실행되는 애플리케이션을 노출하는 추상적인 방법이다. 서비스는
(`type: ClusterIP`인 서비스를 통해) 클러스터-범위의 가상 IP 주소를 가진다.
클라이언트는 해당 가상 IP 주소로 접속할 수 있으며, 쿠버네티스는 해당 서비스를 거치는 트래픽을
서비스 뒷단의 파드들에게 로드 밸런싱한다.

<!-- body -->

## 어떻게 서비스 클러스터IP가 할당되는가?

쿠버네티스가 서비스에 가상 IP를 할당해야 할 때,
해당 요청분에는 두가지 방법 중 하나가 수행된다.

_동적 할당_
: 클러스터의 컨트롤 플레인이 자동으로 `type: ClusterIP` 서비스의 설정된 IP 범위 내에서 가용 IP 주소를 선택한다.

_정적 할당_
: 서비스용으로 설정된 IP 범위 내에서 사용자가 IP 주소를 선택한다.

클러스터 전체에 걸쳐, 모든 서비스의 `ClusterIP`는 항상 고유해야 한다.
이미 할당된 특정 `ClusterIP`로 서비스를 생성하려고 하면
에러가 발생한다.

## 왜 서비스 클러스터 IP를 예약해야 하는가?

때로는 클러스터의 다른 컴포넌트들이나 사용자들이 사용할 수 있도록 이미 알려진 IP 주소를 통해
서비스를 실행하고 싶을 것이다.

가장 좋은 방법은 클러스터의 DNS 서비스이다.
가벼운 관례로 일부 쿠버네티스 설치 관리자들은 DNS 서비스의 10번째 주소를 서비스 IP 범위로 지정한다.
클러스터의 서비스 IP 범위가 10.96.0.0/16 인 상황에서 DNS 서비스 IP를 10.96.0.10 으로 지정하고 싶다면,
아래와 같이 서비스를 생성해야 할 것이다.

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    k8s-app: kube-dns
    kubernetes.io/cluster-service: "true"
    kubernetes.io/name: CoreDNS
  name: kube-dns
  namespace: kube-system
spec:
  clusterIP: 10.96.0.10
  ports:
  - name: dns
    port: 53
    protocol: UDP
    targetPort: 53
  - name: dns-tcp
    port: 53
    protocol: TCP
    targetPort: 53
  selector:
    k8s-app: kube-dns
  type: ClusterIP
```

하지만 이전에도 설명했듯이, IP 주소 10.96.0.10는 예약된 상태가 아니다. 만약 다른 서비스들이
그 전에 동적 할당으로 생성되었거나, 동시에 생성되었다면, 해당 서비스들이 IP를 할당받았을 수도 있다.
따라서, 충돌 에러로 인해 DNS 서비스를 생성하지 못할 것이다.

## 어떻게 하면 서비스 클러스터IP 충돌을 피할 수 있는가? {#avoid-ClusterIP-conflict} 

쿠버네티스에 구현된 할당 전략은
서비스에 클러스터IP 할당의 충돌 위험을 줄여준다.

`ClusterIP` 범위는 16 이상 256 미만의 단계적인 차수를 나타내는
`min(max(16, cidrSize / 16), 256)` 공식을 기반으로 나누어져 있다.

동적 IP 할당은 기본값으로 위쪽 밴드를 사용한다. 위쪽 범위가 모두 소진되었다면 아래쪽 밴드를
사용할 것이다. 이것은 사용자로 하여금 아래쪽 밴드의 정적 할당을 낮은 충돌 확률로 수행할 수 있게
해준다. 

## 예시 {#allocation-examples}

### 예시 1 {#allocation-example-1}

아래 예시는 서비스 IP 주소들로 10.96.0.0/24 (CIDR 표기법) IP 주소 범위를
사용한다.

범위 크기: 2<sup>8</sup> - 2 = 254  
밴드 오프셋: `min(max(16, 256/16), 256)` = `min(16, 256)` = 16  
정적 밴드 시작점: 10.96.0.1  
정적 밴드 끝점: 10.96.0.16  
범위 끝점: 10.96.0.254   

{{< mermaid >}}
pie showData
    title 10.96.0.0/24
    "정적" : 16
    "동적" : 238
{{< /mermaid >}}

### 예시 2 {#allocation-example-2}

아래 예시는 서비스 IP 주소들로 10.96.0.0/20 (CIDR 표기법) IP 주소 범위를
사용한다.

범위 크기: 2<sup>12</sup> - 2 = 4094  
밴드 오프셋: `min(max(16, 4096/16), 256)` = `min(256, 256)` = 256  
정적 밴드 시작점: 10.96.0.1  
정적 밴드 끝점: 10.96.1.0  
범위 끝점: 10.96.15.254  

{{< mermaid >}}
pie showData
    title 10.96.0.0/20
    "정적" : 256
    "동적" : 3838
{{< /mermaid >}}

### 예시 3 {#allocation-example-3}

아래 예시는 서비스 IP 주소들로 10.96.0.0/16 (CIDR 표기법) IP 주소 범위를
사용한다.

범위 크기: 2<sup>16</sup> - 2 = 65534  
밴드 오프셋: `min(max(16, 65536/16), 256)` = `min(4096, 256)` = 256  
정적 밴드 시작점: 10.96.0.1  
정적 밴드 끝점: 10.96.1.0  
범위 끝점: 10.96.255.254  

{{< mermaid >}}
pie showData
    title 10.96.0.0/16
    "정적" : 256
    "동적" : 65278
{{< /mermaid >}}

## {{% heading "whatsnext" %}}

* [클라이언트 소스 IP 보존하기](/ko/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)에 대해 알아보기
* [서비스와 애플리케이션 연결하기](/ko/docs/tutorials/services/connect-applications-service/)에 대해 알아보기
* [서비스](/ko/docs/concepts/services-networking/service/)에 대해 알아보기
