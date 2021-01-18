---
title: 네트워크 플러그인
content_type: concept
weight: 10
---


<!-- overview -->

쿠버네티스의 네트워크 플러그인은 몇 가지 종류가 있다.

* CNI 플러그인: 상호 운용성을 위해 설계된 [컨테이너 네트워크 인터페이스](https://github.com/containernetworking/cni)(CNI) 명세를 준수한다.
* 쿠버네티스는 CNI 명세의 [v0.4.0](https://github.com/containernetworking/cni/blob/spec-v0.4.0/SPEC.md) 릴리스를 따른다.
* Kubenet 플러그인: `bridge` 와 `host-local` CNI 플러그인을 사용하여 기본 `cbr0` 구현한다.

<!-- body -->

## 설치

kubelet에는 단일 기본 네트워크 플러그인과 전체 클러스터에 공통된 기본 네트워크가 있다. 플러그인은 시작할 때 플러그인을 검색하고, 찾은 것을 기억하며, 파드 라이프사이클에서 적절한 시간에 선택한 플러그인을 실행한다(CRI는 자체 CNI 플러그인을 관리하므로 도커에만 해당됨). 플러그인 사용 시 명심해야 할 두 가지 Kubelet 커맨드라인 파라미터가 있다.

* `cni-bin-dir`: Kubelet은 시작할 때 플러그인에 대해 이 디렉터리를 검사한다.
* `network-plugin`: `cni-bin-dir` 에서 사용할 네트워크 플러그인. 플러그인 디렉터리에서 검색한 플러그인이 보고된 이름과 일치해야 한다. CNI 플러그인의 경우, 이는 단순히 "cni"이다.

## 네트워크 플러그인 요구 사항

파드 네트워킹을 구성하고 정리하기 위해 [`NetworkPlugin` 인터페이스](https://github.com/kubernetes/kubernetes/tree/{{< param "fullversion" >}}/pkg/kubelet/dockershim/network/plugins.go)를 제공하는 것 외에도, 플러그인은 kube-proxy에 대한 특정 지원이 필요할 수 있다. iptables 프록시는 분명히 iptables에 의존하며, 플러그인은 컨테이너 트래픽이 iptables에 사용 가능하도록 해야 한다. 예를 들어, 플러그인이 컨테이너를 리눅스 브릿지에 연결하는 경우, 플러그인은 `net/bridge/bridge-nf-call-iptables` sysctl을 `1` 로 설정하여 iptables 프록시가 올바르게 작동하는지 확인해야 한다. 플러그인이 리눅스 브리지를 사용하지 않는 경우(그러나 Open vSwitch나 다른 메커니즘과 같은 기능을 사용함) 컨테이너 트래픽이 프록시에 대해 적절하게 라우팅되도록 해야 한다.

kubelet 네트워크 플러그인이 지정되지 않은 경우, 기본적으로 `noop` 플러그인이 사용되며, `net/bridge/bridge-nf-call-iptables=1` 을 설정하여 간단한 구성(브릿지가 있는 도커 등)이 iptables 프록시에서 올바르게 작동하도록 한다.

### CNI

CNI 플러그인은 Kubelet에 `--network-plugin=cni` 커맨드라인 옵션을 전달하여 선택된다. Kubelet은 `--cni-conf-dir`(기본값은 `/etc/cni/net.d`)에서 파일을 읽고 해당 파일의 CNI 구성을 사용하여 각 파드의 네트워크를 설정한다. CNI 구성 파일은 [CNI 명세](https://github.com/containernetworking/cni/blob/master/SPEC.md#network-configuration)와 일치해야 하며, 구성에서 참조하는 필수 CNI 플러그인은 `--cni-bin-dir`(기본값은 `/opt/cni/bin`)에 있어야 한다.

디렉터리에 여러 CNI 구성 파일이 있는 경우, kubelet은 이름별 알파벳 순으로 구성 파일을 사용한다.

구성 파일에 지정된 CNI 플러그인 외에도, 쿠버네티스는 최소 0.2.0 버전의 표준 CNI [`lo`](https://github.com/containernetworking/plugins/blob/master/plugins/main/loopback/loopback.go) 플러그인이 필요하다.

#### hostPort 지원

CNI 네트워킹 플러그인은 `hostPort` 를 지원한다. CNI 플러그인 팀이 제공하는 공식 [포트맵(portmap)](https://github.com/containernetworking/plugins/tree/master/plugins/meta/portmap)
플러그인을 사용하거나 portMapping 기능이 있는 자체 플러그인을 사용할 수 있다.

`hostPort` 지원을 사용하려면, `cni-conf-dir` 에 `portMappings capability` 를 지정해야 한다.
예를 들면 다음과 같다.

```json
{
  "name": "k8s-pod-network",
  "cniVersion": "0.3.0",
  "plugins": [
    {
      "type": "calico",
      "log_level": "info",
      "datastore_type": "kubernetes",
      "nodename": "127.0.0.1",
      "ipam": {
        "type": "host-local",
        "subnet": "usePodCidr"
      },
      "policy": {
        "type": "k8s"
      },
      "kubernetes": {
        "kubeconfig": "/etc/cni/net.d/calico-kubeconfig"
      }
    },
    {
      "type": "portmap",
      "capabilities": {"portMappings": true}
    }
  ]
}
```

#### 트래픽 셰이핑 지원

**실험적인 기능입니다**

CNI 네트워킹 플러그인은 파드 수신 및 송신 트래픽 셰이핑도 지원한다. CNI 플러그인 팀에서 제공하는 공식 [대역폭(bandwidth)](https://github.com/containernetworking/plugins/tree/master/plugins/meta/bandwidth)
플러그인을 사용하거나 대역폭 제어 기능이 있는 자체 플러그인을 사용할 수 있다.

트래픽 셰이핑 지원을 활성화하려면, CNI 구성 파일 (기본값 `/etc/cni/net.d`)에 `bandwidth` 플러그인을
추가하고, 바이너리가 CNI 실행 파일 디렉터리(기본값: `/opt/cni/bin`)에 포함되어있는지 확인한다.

```json
{
  "name": "k8s-pod-network",
  "cniVersion": "0.3.0",
  "plugins": [
    {
      "type": "calico",
      "log_level": "info",
      "datastore_type": "kubernetes",
      "nodename": "127.0.0.1",
      "ipam": {
        "type": "host-local",
        "subnet": "usePodCidr"
      },
      "policy": {
        "type": "k8s"
      },
      "kubernetes": {
        "kubeconfig": "/etc/cni/net.d/calico-kubeconfig"
      }
    },
    {
      "type": "bandwidth",
      "capabilities": {"bandwidth": true}
    }
  ]
}
```

이제 파드에 `kubernetes.io/ingress-bandwidth` 와 `kubernetes.io/egress-bandwidth` 어노테이션을 추가할 수 있다.
예를 들면 다음과 같다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  annotations:
    kubernetes.io/ingress-bandwidth: 1M
    kubernetes.io/egress-bandwidth: 1M
...
```

### kubenet

Kubenet은 리눅스에서만 사용할 수 있는 매우 기본적이고, 간단한 네트워크 플러그인이다. 그 자체로는, 크로스-노드 네트워킹 또는 네트워크 정책과 같은 고급 기능을 구현하지 않는다. 일반적으로 노드 간, 또는 단일 노드 환경에서 통신을 위한 라우팅 규칙을 설정하는 클라우드 제공자와 함께 사용된다.

Kubenet은 `cbr0` 라는 리눅스 브리지를 만들고 각 쌍의 호스트 끝이 `cbr0` 에 연결된 각 파드에 대한 veth 쌍을 만든다. 쌍의 파드 끝에는 구성 또는 컨트롤러 관리자를 통해 노드에 할당된 범위 내에서 할당된 IP 주소가 지정된다. `cbr0` 에는 호스트에서 활성화된 일반 인터페이스의 가장 작은 MTU와 일치하는 MTU가 지정된다.

플러그인에는 몇 가지 사항이 필요하다.

* 표준 CNI `bridge`, `lo` 및 `host-local` 플러그인은 최소 0.2.0 버전이 필요하다. Kubenet은 먼저 `/opt/cni/bin` 에서 검색한다. 추가 검색 경로를 제공하려면 `cni-bin-dir` 을 지정한다. 처음 검색된 디렉터리가 적용된다.
* 플러그인을 활성화하려면 Kubelet을 `--network-plugin=kubenet` 인수와 함께 실행해야 한다.
* Kubelet은 `--non-masquerade-cidr=<clusterCidr>` 인수와 함께 실행하여 이 범위 밖 IP로의 트래픽이 IP 마스커레이드(masquerade)를 사용하도록 해야 한다.
* `--pod-cidr` kubelet 커맨드라인 옵션 또는 `--allocate-node-cidrs=true --cluster-cidr=<cidr>` 컨트롤러 관리자 커맨드라인 옵션을 통해 노드에 IP 서브넷을 할당해야 한다.

### MTU 사용자 정의 (kubenet 사용)

최상의 네트워킹 성능을 얻으려면 MTU를 항상 올바르게 구성해야 한다. 네트워크 플러그인은 일반적으로 합리적인 MTU를
유추하려고 시도하지만, 때로는 로직에 따라 최적의 MTU가 지정되지 않는다. 예를 들어,
도커 브리지나 다른 인터페이스에 작은 MTU가 지정되어 있으면, kubenet은 현재 해당 MTU를 선택한다. 또는
IPSEC 캡슐화를 사용하는 경우, MTU를 줄여야 하며, 이 계산은 대부분의
네트워크 플러그인에서 범위를 벗어난다.

필요한 경우, `network-plugin-mtu` kubelet 옵션을 사용하여 MTU를 명시 적으로 지정할 수 있다. 예를 들어,
AWS에서 `eth0` MTU는 일반적으로 9001이므로, `--network-plugin-mtu=9001` 을 지정할 수 있다. IPSEC를 사용하는 경우
캡슐화 오버헤드를 허용하도록 `--network-plugin-mtu=8873` 과 같이 IPSEC을 줄일 수 있다.

이 옵션은 네트워크 플러그인에 제공된다. 현재 **kubenet만 `network-plugin-mtu` 를 지원한다**.

## 용법 요약

* `--network-plugin=cni` 는 `--cni-bin-dir`(기본값 `/opt/cni/bin`)에 있는 실제 CNI 플러그인 바이너리와 `--cni-conf-dir`(기본값 `/etc/cni/net.d`)에 있는 CNI 플러그인 구성과 함께 `cni` 네트워크 플러그인을 사용하도록 지정한다.
* `--network-plugin=kubenet` 은 `/opt/cni/bin` 또는 `cni-bin-dir` 에 있는 CNI `bridge`, `lo` 및 `host-local` 플러그인과 함께 `kubenet` 네트워크 플러그인을 사용하도록 지정한다.
* 현재 kubenet 네트워크 플러그인에서만 사용하는 `--network-plugin-mtu=9001` 은 사용할 MTU를 지정한다.
