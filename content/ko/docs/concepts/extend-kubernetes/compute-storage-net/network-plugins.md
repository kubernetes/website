---




title: 네트워크 플러그인
content_type: concept
weight: 10
---


<!-- overview -->

쿠버네티스 {{< skew currentVersion >}} 버전은 클러스터 네트워킹을 위해 [컨테이너 네트워크 인터페이스](https://github.com/containernetworking/cni)(CNI) 플러그인을 지원한다. 
클러스터와 호환되며 사용자의 요구 사항을 충족하는 CNI 플러그인을 사용해야 한다. 더 넓은 쿠버네티스 생태계에 다양한 플러그인이 존재한다(오픈소스 및 클로즈드 소스).

[v0.4.0](https://github.com/containernetworking/cni/blob/spec-v0.4.0/SPEC.md) 이상의 
CNI 스펙과 호환되는 CNI 플러그인을 사용해야 한다. 
쿠버네티스 플러그인은 
CNI 스펙 [v1.0.0](https://github.com/containernetworking/cni/blob/spec-v1.0.0/SPEC.md)과 호환되는 
플러그인의 사용을 권장한다(플러그인은 여러 스펙 버전과 호환 가능).

<!-- body -->

## 설치

CNI 플러그인은 [쿠버네티스 네트워크 모델](/ko/docs/concepts/services-networking/#쿠버네티스-네트워크-모델)을 구현해야 한다. CRI는 자체 CNI 플러그인을 관리한다. 플러그인 사용 시 명심해야 할 두 가지 Kubelet 커맨드라인 파라미터가 있다.

* `cni-bin-dir`: Kubelet은 시작할 때 플러그인에 대해 이 디렉터리를 검사한다.
* `network-plugin`: `cni-bin-dir` 에서 사용할 네트워크 플러그인. 플러그인 디렉터리에서 검색한 플러그인이 보고된 이름과 일치해야 한다. CNI 플러그인의 경우, 이는 "cni"이다.

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
추가하고, 바이너리가 CNI 실행 파일 디렉터리(기본값: `/opt/cni/bin`)에 포함되어 있는지 확인한다.

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

## 용법 요약

* `--network-plugin=cni` 는 `--cni-bin-dir`(기본값 `/opt/cni/bin`)에 있는 실제 CNI 플러그인 바이너리와 `--cni-conf-dir`(기본값 `/etc/cni/net.d`)에 있는 CNI 플러그인 구성과 함께 `cni` 네트워크 플러그인을 사용하도록 지정한다.

## {{% heading "whatsnext" %}}
