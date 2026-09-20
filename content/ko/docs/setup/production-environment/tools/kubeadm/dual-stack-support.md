---
title: kubeadm으로 이중 스택 지원하기
content_type: task
weight: 100
min-kubernetes-server-version: 1.21
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

쿠버네티스 클러스터는 [이중 스택](/docs/concepts/services-networking/dual-stack/)
네트워킹을 지원하며, 이는 클러스터 네트워킹에서 두 주소 패밀리 중 어느 것이든 사용할 수 있음을 의미한다.
클러스터에서 컨트롤 플레인은 하나의 {{< glossary_tooltip text="파드" term_id="pod" >}} 또는 {{< glossary_tooltip text="서비스" term_id="service" >}}에
IPv4 주소와 IPv6 주소를 모두 할당할 수 있다.

<!-- body -->

## {{% heading "prerequisites" %}}

[kubeadm 설치하기](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)의
단계에 따라 {{< glossary_tooltip text="kubeadm" term_id="kubeadm" >}} 도구를 설치해야 한다.

{{< glossary_tooltip text="노드" term_id="node" >}}로 사용하려는 각 서버에서
IPv6 포워딩이 허용되어 있는지 확인한다.

### IPv6 패킷 포워딩 활성화 {#prerequisite-ipv6-forwarding}

IPv6 패킷 포워딩이 활성화되어 있는지 확인하려면 다음을 실행한다.

```bash
sysctl net.ipv6.conf.all.forwarding
```
출력이 `net.ipv6.conf.all.forwarding = 1`이면 이미 활성화된 상태이다.
그렇지 않으면 아직 활성화되지 않은 상태이다.

IPv6 패킷 포워딩을 수동으로 활성화하려면 다음을 실행한다.

```bash
# 설정에 필요한 sysctl 파라미터이며, 재부팅 후에도 유지된다
cat <<EOF | sudo tee -a /etc/sysctl.d/k8s.conf
net.ipv6.conf.all.forwarding = 1
EOF

# 재부팅 없이 sysctl 파라미터를 적용한다
sudo sysctl --system
```


사용할 IPv4 및 IPv6 주소 범위가 필요하다. 클러스터 운영자는 일반적으로
IPv4에 사설 주소 범위를 사용한다. IPv6의 경우, 클러스터 운영자는 일반적으로 운영자에게
할당된 범위를 사용하여 `2000::/3` 내의 글로벌 유니캐스트(unicast) 주소 블록을 선택한다.
클러스터의 IP 주소 범위를 공용 인터넷으로 라우팅할 필요는 없다.

IP 주소 할당 크기는 실행하려는 파드와 서비스의 개수에
적합해야 한다.

{{< note >}}
`kubeadm upgrade` 명령으로 기존 클러스터를 업그레이드하는 경우,
`kubeadm`은 파드 IP 주소 범위("클러스터 CIDR") 또는
클러스터의 서비스 주소 범위("서비스 CIDR")에 대한 수정을 지원하지 않는다.
{{< /note >}}

### 이중 스택 클러스터 생성하기

`kubeadm init`으로 이중 스택 클러스터를 생성하려면 다음 예시와 유사한
명령줄 인자를 전달할 수 있다.

```shell
# 다음 주소 범위는 예시이다
kubeadm init --pod-network-cidr=10.244.0.0/16,2001:db8:42:0::/56 --service-cidr=10.96.0.0/16,2001:db8:42:1::/112
```

이해를 돕기 위해, 기본 이중 스택 컨트롤 플레인 노드를 위한 kubeadm
[구성 파일](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml`의 예시는 다음과 같다.

```yaml
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
networking:
  podSubnet: 10.244.0.0/16,2001:db8:42:0::/56
  serviceSubnet: 10.96.0.0/16,2001:db8:42:1::/112
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
localAPIEndpoint:
  advertiseAddress: "10.100.0.1"
  bindPort: 6443
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::2"
```

InitConfiguration의 `advertiseAddress`는 API 서버가
수신 대기 중임을 알릴 IP 주소를 지정한다. `advertiseAddress`의 값은
`kubeadm init`의 `--apiserver-advertise-address` 플래그와 동일하다.

kubeadm을 실행하여 이중 스택 컨트롤 플레인 노드를 초기화한다.

```shell
kubeadm init --config=kubeadm-config.yaml
```

kube-controller-manager 플래그 `--node-cidr-mask-size-ipv4|--node-cidr-mask-size-ipv6`는
기본값으로 설정된다. [IPv4/IPv6 이중 스택 구성](/docs/concepts/services-networking/dual-stack#ipv4-ipv6-이중-스택-구성)을 참고한다.

{{< note >}}
`--apiserver-advertise-address` 플래그는 이중 스택을 지원하지 않는다.
{{< /note >}}

### 이중 스택 클러스터에 노드 조인하기

노드를 조인하기 전에, 해당 노드에 IPv6 라우팅이 가능한 네트워크 인터페이스가 있고 IPv6 포워딩이 허용되어 있는지 확인한다.

다음은 워커 노드를 클러스터에 조인하기 위한 kubeadm [구성 파일](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml`의 예시이다.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
discovery:
  bootstrapToken:
    apiServerEndpoint: 10.100.0.1:6443
    token: "clvldh.vjjwg16ucnhp94qr"
    caCertHashes:
    - "sha256:a4863cde706cfc580a439f842cc65d5ef112b7b2be31628513a9881cf0d9fe0e"
    # 위 인증 정보를 클러스터의 실제 토큰과 CA 인증서 해시에 맞게 변경한다
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::3"
```

또한, 다음은 다른 컨트롤 플레인 노드를 클러스터에 조인하기 위한 kubeadm [구성 파일](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml`의 예시이다.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
controlPlane:
  localAPIEndpoint:
    advertiseAddress: "10.100.0.2"
    bindPort: 6443
discovery:
  bootstrapToken:
    apiServerEndpoint: 10.100.0.1:6443
    token: "clvldh.vjjwg16ucnhp94qr"
    caCertHashes:
    - "sha256:a4863cde706cfc580a439f842cc65d5ef112b7b2be31628513a9881cf0d9fe0e"
    # 위 인증 정보를 클러스터의 실제 토큰과 CA 인증서 해시에 맞게 변경한다
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::4"
```

JoinConfiguration.controlPlane의 `advertiseAddress`는
API 서버가 수신 대기 중임을 알릴 IP 주소를 지정한다. `advertiseAddress`의 값은
`kubeadm join`의 `--apiserver-advertise-address` 플래그와 동일하다.

```shell
kubeadm join --config=kubeadm-config.yaml
```

### 단일 스택 클러스터 생성하기

{{< note >}}
이중 스택 지원이 이중 스택 주소 지정을 반드시 사용해야 한다는 의미는 아니다.
이중 스택 네트워킹 기능이 활성화된 단일 스택 클러스터를 배포할 수도 있다.
{{< /note >}}

이해를 돕기 위해, 단일 스택 컨트롤 플레인 노드를 위한 kubeadm
[구성 파일](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml`의 예시는 다음과 같다.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
networking:
  podSubnet: 10.244.0.0/16
  serviceSubnet: 10.96.0.0/16
```

## {{% heading "whatsnext" %}}

* [IPv4/IPv6 이중 스택 검증](/docs/tasks/network/validate-dual-stack) 네트워킹
* [이중 스택](/docs/concepts/services-networking/dual-stack/) 클러스터 네트워킹에 대해 읽어본다.
* kubeadm [구성 형식](/docs/reference/config-api/kubeadm-config.v1beta4/)에 대해 더 알아본다.
