---
# reviewers:
# - dcbw
# - freehan
# - thockin
title: 네트워크 플러그인
content_type: concept
weight: 10
---


<!-- overview -->

쿠버네티스는 1.3 버전부터 최신 {{< skew latestVersion >}} 버전까지 클러스터 네트워킹을 위해
[컨테이너 네트워크 인터페이스](https://github.com/containernetworking/cni)(CNI)
플러그인을 지원한다. (향후 버전에서도 계속 지원할 가능성이 높다.)
사용 중인 클러스터와 호환되며 사용자의 요구 사항을 충족하는 CNI 플러그인을 사용해야 한다.
더 넓은 쿠버네티스 생태계에 다양한 플러그인이 (오픈 소스와 클로즈드 소스로) 존재한다.

CNI 플러그인은
[쿠버네티스 네트워크 모델](/docs/concepts/services-networking/#쿠버네티스-네트워크-모델)을 구현해야 한다.

[v0.4.0](https://github.com/containernetworking/cni/blob/spec-v0.4.0/SPEC.md) 이상의
CNI 명세와 호환되는 CNI 플러그인을 사용해야 한다.
쿠버네티스 프로젝트는
CNI 명세 [v1.0.0](https://github.com/containernetworking/cni/blob/spec-v1.0.0/SPEC.md)와
호환되는 플러그인의 사용을 권장한다(플러그인은 여러 사양 버전과 호환될 수 있다).

<!-- body -->

## 설치

네트워킹 컨텍스트에서 컨테이너 런타임은 kubelet을 위한 CRI 서비스를 제공하도록 구성된
노드의 데몬이다. 특히, 컨테이너 런타임은 쿠버네티스 네트워크 모델을 구현하는 데 필요한
CNI 플러그인을 로드하도록 구성되어야 한다.

{{< note >}}
쿠버네티스 1.24 이전까지는 `cni-bin-dir`과 `network-plugin` 커맨드라인 파라미터를
사용해 kubelet이 CNI 플러그인을 관리하게 할 수도 있었다.
이 커맨드라인 파라미터들은 쿠버네티스 1.24에서 제거되었으며, CNI 관리는
더 이상 kubelet의 역할에 포함되지 않는다.

도커심 제거 후 문제가 발생하는 경우
[CNI 플러그인 관련 오류 문제 해결](/docs/tasks/administer-cluster/migrating-from-dockershim/troubleshooting-cni-plugin-related-errors/)을 참조하자.
{{< /note >}}

컨테이너 런타임에서 CNI 플러그인을 관리하는 방법에 관한 자세한 내용은 아래 예시와 같은
컨테이너 런타임에 대한 문서를 참조하자.

- [containerd](https://github.com/containerd/containerd/blob/main/script/setup/install-cni)
- [CRI-O](https://github.com/cri-o/cri-o/blob/main/contrib/cni/README.md)

CNI 플러그인을 설치하고 관리하는 방법에 관한 자세한 내용은 해당 플러그인 또는
[네트워킹 프로바이더](/docs/concepts/cluster-administration/networking/#쿠버네티스-네트워크-모델의-구현-방법) 문서를 참조하자.

## 네트워크 플러그인 요구 사항

### 루프백(loopback) CNI

쿠버네티스 네트워크 모델을 구현하기 위해 노드에 설치된 CNI 플러그인 외에도,
쿠버네티스는 각 샌드박스(파드 샌드박스, VM 샌드박스 등)에 사용되는 루프백 인터페이스
`lo`를 제공하기 위한 컨테이너 런타임도 요구한다.
루프백 인터페이스 구현은
[CNI 루프백 플러그인](https://github.com/containernetworking/plugins/blob/master/plugins/main/loopback/loopback.go)을
재사용하거나 자체 코드를 개발하여 수행할 수 있다.
([CRI-O 예시 참조](https://github.com/cri-o/ocicni/blob/release-1.24/pkg/ocicni/util_linux.go#L91))

### hostPort 지원

CNI 네트워킹 플러그인은 `hostPort` 를 지원한다. CNI 플러그인 팀이 제공하는 공식
[포트맵(portmap)](https://github.com/containernetworking/plugins/tree/master/plugins/meta/portmap)
플러그인을 사용하거나 portMapping 기능이 있는 자체 플러그인을 사용할 수 있다.

`hostPort` 지원을 사용하려면, `cni-conf-dir` 에 `portMappings capability` 를 지정해야 한다.
예를 들면 다음과 같다.

```json
{
  "name": "k8s-pod-network",
  "cniVersion": "0.4.0",
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
      "capabilities": {"portMappings": true},
      "externalSetMarkChain": "KUBE-MARK-MASQ"
    }
  ]
}
```

### 트래픽 셰이핑(shaping) 지원

**실험적인 기능입니다**

CNI 네트워킹 플러그인은 파드 수신 및 송신 트래픽 셰이핑도 지원한다. CNI 플러그인 팀에서 제공하는
공식 [대역폭(bandwidth)](https://github.com/containernetworking/plugins/tree/master/plugins/meta/bandwidth)
플러그인을 사용하거나 대역폭 제어 기능이 있는 자체 플러그인을 사용할 수 있다.

트래픽 셰이핑 지원을 사용하려면, CNI 구성 파일 (기본값 `/etc/cni/net.d`)에
`bandwidth` 플러그인을 추가해야 하고, 바이너리가 CNI 실행 파일 디렉터리(기본값 `/opt/cni/bin`)에
포함되어 있는지 확인해야 한다.

```json
{
  "name": "k8s-pod-network",
  "cniVersion": "0.4.0",
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

## {{% heading "whatsnext" %}}

- [클러스터 네트워킹](/docs/concepts/cluster-administration/networking/)에 대해 더 알아보기
- [네트워크 정책](/docs/concepts/services-networking/network-policies/)에 대해 더 알아보기
- [CNI 플러그인 관련 오류 문제 해결](/docs/tasks/administer-cluster/migrating-from-dockershim/troubleshooting-cni-plugin-related-errors/)에 대해 알아보기
