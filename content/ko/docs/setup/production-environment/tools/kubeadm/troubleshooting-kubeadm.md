---
title: kubeadm 문제 해결
content_type: concept
weight: 20
---

<!-- overview -->

다른 프로그램과 마찬가지로, kubeadm을 설치하거나 실행하는 중에 오류가 발생할 수 있다.
이 페이지에는 일반적인 실패 시나리오를 나열하고 문제를 이해하고 해결하는 데 도움을 줄 수 있는 단계를 제공한다.

아래에 문제가 언급되어 있지 않다면 다음 단계를 따르도록 한다.

- 문제가 kubeadm의 버그라고 생각되는 경우:
  - [github.com/kubernetes/kubeadm](https://github.com/kubernetes/kubeadm/issues)으로 이동하여 기존 이슈를 검색한다.
  - 이슈가 없으면 [새로운 이슈를 열고](https://github.com/kubernetes/kubeadm/issues/new) 이슈 템플릿을 따른다.

- kubeadm 작동 방식이 확실하지 않은 경우, [슬랙](https://slack.k8s.io/)의 `#kubeadm`에서 질문하거나,
  [스택오버플로우](https://stackoverflow.com/questions/tagged/kubernetes)에 질문을 올릴 수 있다. 사람들이 도움을 줄 수 
  있도록 `#kubernetes` 및 `#kubeadm`과 같은 관련 태그를 포함한다.

<!-- body -->

## RBAC 누락으로 인해 v1.18 노드를 v1.17 클러스터에 참여할 수 없음

v1.18 kubeadm은 같은 이름의 노드가 이미 존재하는 경우 클러스터에 노드가 참여하는 것을 방지하는 기능을 추가했다.
이를 위해 bootstrap-token 사용자가 노드 객체를 GET할 수 있도록 RBAC를 추가해야 했다.

그러나 이로 인해 v1.18의 `kubeadm join`이 kubeadm 1.17로 생성된 클러스터에 참여할 수 없는 문제가 발생한다.

이 문제를 해결하기 위한 두 가지 옵션이 있다.

kubeadm v1.18을 사용하여 컨트롤 플레인 노드에서 `kubeadm init phase bootstrap-token`을 실행한다. 
이렇게 하면 나머지 bootstrap-token 권한도 활성화된다는 점에 유의한다.

또는

`kubectl apply -f ...`를 사용하여 다음 RBAC를 수동으로 적용한다.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kubeadm:get-nodes
rules:
  - apiGroups:
      - ""
    resources:
      - nodes
    verbs:
      - get
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: kubeadm:get-nodes
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: kubeadm:get-nodes
subjects:
  - apiGroup: rbac.authorization.k8s.io
    kind: Group
    name: system:bootstrappers:kubeadm:default-node-token
```

## 설치 중 `ebtables` 또는 유사한 실행 파일을 찾을 수 없음

`kubeadm init`을 실행하는 동안 다음과 같은 경고 메시지가 출력된다면

```console
[preflight] WARNING: ebtables not found in system path
[preflight] WARNING: ethtool not found in system path
```

노드에 `ebtables`, `ethtool` 또는 유사한 실행 파일이 누락되었을 수 있다.
다음 명령으로 설치할 수 있다.

- 우분투/데비안 사용자의 경우, `apt install ebtables ethtool`을 실행한다.
- CentOS/페도라 사용자의 경우, `yum install ebtables ethtool`을 실행한다.

## 설치 중 kubeadm이 컨트롤 플레인을 기다리다가 진행되지 않음 (block)

`kubeadm init`이 다음 줄을 출력한 후 중단되는 경우

```console
[apiclient] Created API client, waiting for the control plane to become ready
```

이는 여러 문제로 인해 발생할 수 있다. 가장 일반적인 원인은

- 네트워크 연결 문제: 계속하기 전에 머신에 완전한 네트워크 연결이 있는지 확인한다.
- 컨테이너 런타임의 cgroup 드라이버가 kubelet과 다름. 올바르게 
  구성하는 방법은 [cgroup 드라이버 구성](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/)을 참조한다.
- 컨트롤 플레인 컨테이너가 크래시 루프에 있거나 중단됨. `docker ps`를 실행하고 
  `docker logs`를 실행하여 각 컨테이너를 조사할 수 있다. 다른 컨테이너 런타임의 경우 
  [crictl로 쿠버네티스 노드 디버깅하기](/ko/docs/tasks/debug/debug-cluster/crictl/)를 참조한다.

## 관리되는 컨테이너를 제거할 때 kubeadm이 멈춤

컨테이너 런타임이 중단되고 쿠버네티스가 관리하는 컨테이너를 제거하지 않으면 
다음과 같은 일이 발생할 수 있다. 

```shell
sudo kubeadm reset
```

```console
[preflight] Running pre-flight checks
[reset] Stopping the kubelet service
[reset] Unmounting mounted directories in "/var/lib/kubelet"
[reset] Removing kubernetes-managed containers
(block)
```

가능한 해결 방안은 컨테이너 런타임을 재시작한 뒤 `kubeadm reset`을 다시 실행하는 것이다.
또한 `crictl`을 사용하여 컨테이너 런타임의 상태를 디버그할 수도 있다. 
[crictl로 쿠버네티스 노드 디버깅하기](/ko/docs/tasks/debug/debug-cluster/crictl/)를 참조한다.

## `RunContainerError`, `CrashLoopBackOff` 또는 `Error` 상태의 파드

`kubeadm init` 직후에는 이러한 상태의 파드가 없어야 한다.

- `kubeadm init` _직후_ 에 이러한 상태의 파드가 있다면 
  kubeadm 저장소에 이슈를 열자. `coredns`(또는 `kube-dns`)는 
  네트워크 애드온을 배포하기 전까지는 `Pending` 상태여야 한다.
- 네트워크 애드온을 배포한 이후에도 `RunContainerError`, `CrashLoopBackOff` 또는 `Error` 상태의 
  파드가 보이고 `coredns`(또는 `kube-dns`)에 아무 일도 일어나지 않는다면, 
  설치한 파드 네트워크 애드온이 어떤 식으로든 손상되었을 가능성이 높다. 
  더 많은 RBAC 권한을 부여하거나 최신 버전을 사용해야 할 수 있다. 파드 
  네트워크 공급자의 이슈 트래커에 이슈를 제출하고 분류를 받자.

## `coredns`가 `Pending` 상태에 멈춤 

이는 **예상된** 동작이며 설계의 일부다. kubeadm은 네트워크 공급자에 구애받지 않으므로 관리자가 
선택한 [파드 네트워크 애드온을 설치](/ko/docs/concepts/cluster-administration/addons/)해야 
한다. CoreDNS가 완전히 배포되기 
전에 파드 네트워크를 설치해야 한다. 따라서 네트워크가 설정되기 전까지 `Pending` 상태가 된다.

## `HostPort` 서비스가 동작하지 않음 

`HostPort`와 `HostIP` 기능의 지원 여부는 파드 네트워크 공급자에 따라
달라진다. `HostPort` 및 `HostIP` 기능을 사용할 수 있는지 알아보려면 파드 네트워크 애드온 
작성자에게 문의한다.

Calico, Canal 및 Flannel CNI 공급자는 HostPort를 지원하는 것으로 확인되었다.

자세한 내용은 
[CNI portmap 문서](https://github.com/containernetworking/plugins/blob/master/plugins/meta/portmap/README.md)를 참조한다.

네트워크 공급자가 portmap CNI 플러그인을 지원하지 않는 경우, 
[서비스의 NodePort 기능](/ko/docs/concepts/services-networking/service/#type-nodeport)을 
사용하거나 `HostNetwork=true`를 사용해야 할 수 있다.

## 파드가 서비스 IP를 통해 액세스할 수 없음

- 많은 네트워크 애드온이 아직 파드가 서비스 IP를 통해 자신에 액세스할 수 있도록 하는 [헤어핀 모드](/ko/docs/tasks/debug/debug-application/debug-service/#a-pod-fails-to-reach-itself-via-the-service-ip)
  를 활성화하지 않는다. 이는 
  [CNI](https://github.com/containernetworking/cni/issues/476)와 관련된 문제다. 헤어핀 모드 지원의 
  최신 상태를 확인하려면 네트워크 애드온 공급자에게 문의한다.

- VirtualBox를 사용하는 경우(직접 또는 Vagrant를 통해) 
  `hostname -i`가 라우팅 가능한 IP 주소를 반환하는지 확인해야 한다. 기본적으로 첫 번째 
  인터페이스는 라우팅할 수 없는 호스트 전용 네트워크에 연결된다. 해결 방법은 
  `/etc/hosts`를 수정하는 것이다. 예시는 이 
  [Vagrantfile](https://github.com/errordeveloper/k8s-playground/blob/22dd39dfc06111235620e6c4404a96ae146f26fd/Vagrantfile#L11)을 
  참조한다.

## TLS 인증서 오류

다음 오류는 인증서 불일치 가능성을 나타낸다.

```none
# kubectl get pods
Unable to connect to the server: x509: certificate signed by unknown authority (possibly because of "crypto/rsa: verification error" while trying to verify candidate authority certificate "kubernetes")
```

- `$HOME/.kube/config` 파일에 유효한 인증서가 포함되어 있는지 확인하고 필요한 경우 
  인증서를 재생성한다. kubeconfig 파일의 인증서는 base64로 
  인코딩되어 있다. `base64 --decode` 명령을 사용하여 인증서를 디코딩하고 
  `openssl x509 -text -noout`을 사용하여 인증서 정보를 볼 수 있다. 

- 다음을 사용하여 `KUBECONFIG` 환경 변수를 해제한다.

  ```sh
  unset KUBECONFIG
  ```

  또는 기본 `KUBECONFIG` 위치로 설정한다. 

  ```sh
  export KUBECONFIG=/etc/kubernetes/admin.conf
  ```

- 또 다른 해결 방법은 "admin" 사용자의 기존 `kubeconfig`를 덮어쓰는 것이다.

  ```sh
  mv $HOME/.kube $HOME/.kube.bak
  mkdir $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
  ```

## Kubelet 클라이언트 인증서 갱신 실패 {#kubelet-client-cert}

기본적으로 kubeadm은 `/etc/kubernetes/kubelet.conf`에 지정된 `/var/lib/kubelet/pki/kubelet-client-current.pem` 
심볼릭 링크를 사용하여 kubelet 클라이언트 인증서가 자동 갱신되도록 구성한다. 
이 갱신 프로세스가 실패하면 kube-apiserver 로그에 `x509: certificate has expired or is not yet valid`와 
같은 오류가 표시될 수 있다. 이 문제를 해결하려면 다음 단계를 따라야 한다.

1. 실패한 노드에서 `/etc/kubernetes/kubelet.conf` 및 `/var/lib/kubelet/pki/kubelet-client*`를 백업하고 삭제한다.
1. `/etc/kubernetes/pki/ca.key`가 있는 클러스터의 작동 중인 컨트롤 플레인 노드에서 
   `kubeadm kubeconfig user --org system:nodes --client-name system:node:$NODE > kubelet.conf`를 실행한다. 
   `$NODE`는 클러스터에서 기존에 실패한 노드 이름으로 설정해야 한다. 
   결과 `kubelet.conf`를 수동으로 수정하여 클러스터 이름과 서버 엔드포인트를 조정하거나 
   `kubeconfig user --config`를 전달한다([추가 사용자를 위한 kubeconfig 파일 생성](/ko/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubeconfig-additional-users) 참조). 클러스터에 
   `ca.key`가 없으면 `kubelet.conf`에 포함된 인증서에 외부에서 서명해야 한다. 
1. 결과 `kubelet.conf`를 실패한 노드의 `/etc/kubernetes/kubelet.conf`에 복사한다.
1. 실패한 노드에서 kubelet을 재시작(`systemctl restart kubelet`)하고 
   `/var/lib/kubelet/pki/kubelet-client-current.pem`이 재생성될 때까지 기다린다.
1. `kubelet.conf`를 수동으로 편집하여 갱신된 kubelet 클라이언트 인증서를 가리키도록 한다.  
   `client-certificate-data` 및 `client-key-data`를 다음으로 교체한다.

   ```yaml
   client-certificate: /var/lib/kubelet/pki/kubelet-client-current.pem
   client-key: /var/lib/kubelet/pki/kubelet-client-current.pem
   ```

1. kubelet을 재시작한다.
1. 노드가 `Ready`가 되었는지 확인한다.

## Vagrant에서 flannel을 파드 네트워크로 사용할 때 기본 NIC

다음 오류는 파드 네트워크에 문제가 있음을 나타낼 수 있다.

```sh
Error from server (NotFound): the server could not find the requested resource
```

- Vagrant 내에서 파드 네트워크로 flannel을 사용하는 경우, flannel의 
  기본 인터페이스 이름을 지정해야 한다. 
  
  Vagrant는 일반적으로 모든 VM에 두 개의 인터페이스를 할당한다. 첫 번째는 모든 호스트에 
  `10.0.2.15` IP 주소가 할당되며, NAT 처리되는 외부 트래픽을 위한 것이다.
  
  이는 호스트의 첫 번째 인터페이스를 기본값으로 하는 flannel에 문제를 일으킬 수 있다. 
  이로 인해 모든 호스트가 동일한 공용 IP 주소를 가지고 있다고 생각하게 된다. 이를 방지하려면 
  flannel에 `--iface eth1` 플래그를 전달하여 두 번째 인터페이스가 선택하도록 한다.

## 컨테이너에 공용이 아닌 IP가 사용됨

정상적으로 작동하는 클러스터에서 `kubectl logs` 및 `kubectl run` 명령이 
다음 오류와 함께 반환될 수 있다.

```console
Error from server: Get https://10.19.0.41:10250/containerLogs/default/mysql-ddc65b868-glc5m/mysql: dial tcp 10.19.0.41:10250: getsockopt: no route to host
```

- 이는 쿠버네티스에서 머신 공급자의 정책에 따라, 겉보기에는 동일한 서브넷에 있는 다른 IP와 
  통신할 수 없는 IP를 사용하는 쿠버네티스 (환경) 때문일 수 있다.
- DigitalOcean은 `eth0`에 공용 IP와 플로팅 IP 기능의 앵커로 내부적으로 
  사용되는 프라이빗 IP를 할당하지만, `kubelet`은 공용 IP 대신 후자를 노드의 
  `InternalIP`로 선택한다. 

  `ifconfig`는 문제가 되는 별칭 IP 주소를 표시하지 않으므로 이 시나리오를 확인하려면 
  `ifconfig` 대신 `ip addr show`를 사용한다. 또는 DigitalOcean에 특정한 API 엔드포인트를 
  사용하여 드롭릿(droplet)에서 앵커 IP를 쿼리할 수 있다.

  ```sh
  curl http://169.254.169.254/metadata/v1/interfaces/public/0/anchor_ipv4/address
  ```

  해결 방법은 `--node-ip`를 사용하여 `kubelet`에 사용할 IP를 알려주는 것이다.
  DigitalOcean을 사용하는 경우, 공용 IP(`eth0`에 할당됨) 또는 
  선택적 프라이빗 네트워크를 사용하려는 경우 프라이빗 IP(`eth1`에 할당됨)가 
  될 수 있다. kubeadm 
  [`NodeRegistrationOptions` 구조](/docs/reference/config-api/kubeadm-config.v1beta4/#kubeadm-k8s-io-v1beta4-NodeRegistrationOptions)의 
  `kubeletExtraArgs` 섹션을 이에 사용할 수 있다.
  
  그런 다음 `kubelet`을 재시작한다.

  ```sh
  systemctl daemon-reload
  systemctl restart kubelet
  ```

## `coredns` 파드가 `CrashLoopBackOff` 또는 `Error` 상태

이전 버전의 Docker와 함께 SELinux를 실행하는 노드가 있는 경우, `coredns` 파드가 시작되지 않는 시나리오가 
발생할 수 있다. 이를 해결하려면 다음 옵션 중 하나를 시도할 수 있다.

- [최신 버전의 Docker](/ko/docs/setup/production-environment/container-runtimes/#docker)로 업그레이드

- [SELinux 비활성화](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/security-enhanced_linux/sect-security-enhanced_linux-enabling_and_disabling_selinux-disabling_selinux).

- `coredns` 배포를 수정하여 `allowPrivilegeEscalation`을 `true`로 설정

```bash
kubectl -n kube-system get deployment coredns -o yaml | \
  sed 's/allowPrivilegeEscalation: false/allowPrivilegeEscalation: true/g' | \
  kubectl apply -f -
```

CoreDNS가 `CrashLoopBackOff`를 가지는 또 다른 원인은 쿠버네티스에 배포된 CoreDNS 파드가 루프를 감지하는 경우다. 
CoreDNS가 루프를 감지하고 종료할 때마다 쿠버네티스가 CoreDNS 파드를 재시작하지 않도록 
[여러 해결 방법](https://github.com/coredns/coredns/tree/master/plugin/loop#troubleshooting-loops-in-kubernetes-clusters)을 사용할 수 있다.

{{< warning >}}
SELinux를 비활성화하거나 `allowPrivilegeEscalation`을 `true`로 설정하면 
클러스터의 보안이 손상될 수 있다.
{{< /warning >}}

## etcd 파드가 지속적으로 재시작됨

다음 오류가 발생하는 경우

```
rpc error: code = 2 desc = oci runtime error: exec failed: container_linux.go:247: starting container process caused "process_linux.go:110: decoding init error from pipe caused \"read parent: connection reset by peer\""
```

이 문제는 Docker 1.13.1.84와 함께 CentOS 7을 실행하는 경우 나타난다.
이 버전의 Docker는 kubelet이 etcd 컨테이너로 실행되는 것을 방지할 수 있다.

이 문제를 해결하려면 다음 옵션 중 하나를 선택한다. 

- 1.13.1-75와 같은 이전 버전의 Docker로 롤백

  ```
  yum downgrade docker-1.13.1-75.git8633870.el7.centos.x86_64 docker-client-1.13.1-75.git8633870.el7.centos.x86_64 docker-common-1.13.1-75.git8633870.el7.centos.x86_64
  ```

- 18.06과 같은 최신 권장 버전 중 하나를 설치

  ```bash
  sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
  yum install docker-ce-18.06.1.ce-3.el7.x86_64
  ```

## `--component-extra-args` 플래그 내부의 인수에 쉼표로 구분된 값 목록을 전달할 수 없음

`--component-extra-args`와 같은 `kubeadm init` 플래그를 사용하면 kube-apiserver와 같은 컨트롤 플레인 
구성 요소에 사용자 정의 인수를 전달할 수 있다. 그러나 이 메커니즘은 값을 구문 분석하는 데 사용되는 
기본 유형(`mapStringString`)으로 인해 제한된다.

`--apiserver-extra-args "enable-admission-plugins=LimitRanger,NamespaceExists"`와 같이 
여러 쉼표로 구분된 값을 지원하는 인수를 전달하기로 결정한 경우, 이 플래그는 
`flag: malformed pair, expect string=string`으로 실패한다. 이는 `--apiserver-extra-args`의 
인수 목록이 `key=value` 쌍을 예상하고 이 경우 `NamespacesExists`가 값이 없는 키로 
간주되기 때문이다.

대안으로 `key=value` 쌍을 다음과 같이 분리할 수 있다.
`--apiserver-extra-args "enable-admission-plugins=LimitRanger,enable-admission-plugins=NamespaceExists"`
그러나 이는 `enable-admission-plugins` 키가 `NamespaceExists` 값만 가지게 된다.

알려진 해결 방법은 kubeadm [구성 파일](/docs/reference/config-api/kubeadm-config.v1beta4/)을 사용하는 것이다.

## cloud-controller-manager가 노드를 초기화하기 전에 kube-proxy가 스케줄됨

클라우드 공급자 시나리오에서 kube-proxy는 cloud-controller-manager가 노드 주소를 
초기화하기 전에 새 워커 노드에 스케줄될 수 있다. 이로 인해 kube-proxy가 
노드의 IP 주소를 제대로 가져오지 못하고 로드 밸런서를 관리하는 프록시 기능에 연쇄적인 
영향을 미친다.

kube-proxy 파드에서 다음 오류를 볼 수 있다.

```
server.go:610] Failed to retrieve node IP: host IP unknown; known addresses: []
proxier.go:340] invalid nodeIP, initializing kube-proxy with 127.0.0.1 as nodeIP
```

알려진 해결 방법은 kube-proxy DaemonSet을 패치하여 조건에 관계없이 컨트롤 플레인 노드에 
스케줄할 수 있도록 하고, 초기 보호 조건이 완화될 때까지 다른 노드에서 
제외하는 것이다.

```
kubectl -n kube-system patch ds kube-proxy -p='{
  "spec": {
    "template": {
      "spec": {
        "tolerations": [
          {
            "key": "CriticalAddonsOnly",
            "operator": "Exists"
          },
          {
            "effect": "NoSchedule",
            "key": "node-role.kubernetes.io/control-plane"
          }
        ]
      }
    }
  }
}'
```

이 문제에 대한 추적 이슈는 [여기](https://github.com/kubernetes/kubeadm/issues/1027)에 있다.

## 노드에서 `/usr`이 읽기 전용으로 마운트됨 {#usr-mounted-read-only}

Fedora CoreOS 또는 Flatcar Container Linux와 같은 리눅스 배포판에서는 `/usr` 디렉터리가 읽기 전용 파일시스템으로 마운트된다. 
[flex-volume 지원](https://github.com/kubernetes/community/blob/ab55d85/contributors/devel/sig-storage/flexvolume.md)을 위해
kubelet 및 kube-controller-manager와 같은 쿠버네티스 구성 요소는
`/usr/libexec/kubernetes/kubelet-plugins/volume/exec/`의 기본 경로를 사용하지만, flex-volume 디렉터리는 기능이 
작동하려면 _쓰기 가능해야 한다._

{{< note >}}
FlexVolume은 쿠버네티스 v1.23 릴리스에서 사용 중단되었다.
{{< /note >}}

이 문제를 해결하려면 kubeadm [구성 파일](/docs/reference/config-api/kubeadm-config.v1beta4/)을  
사용하여 flex-volume 디렉터리를 구성할 수 있다.

기본 컨트롤 플레인 노드(`kubeadm init`을 사용하여 생성)에서 
`--config`를 사용하여 다음 파일을 전달한다.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
nodeRegistration:
  kubeletExtraArgs:
  - name: "volume-plugin-dir"
    value: "/opt/libexec/kubernetes/kubelet-plugins/volume/exec/"
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
controllerManager:
  extraArgs:
  - name: "flex-volume-plugin-dir"
    value: "/opt/libexec/kubernetes/kubelet-plugins/volume/exec/"
```

참여하는 노드에서

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
nodeRegistration:
  kubeletExtraArgs:
  - name: "volume-plugin-dir"
    value: "/opt/libexec/kubernetes/kubelet-plugins/volume/exec/"
```

또는 `/etc/fstab`를 수정하여 `/usr` 마운트를 쓰기 가능하게 만들 수 있지만,
이는 리눅스 배포판의 설계 원칙을 수정하는 것임을 유의한다.

## `kubeadm upgrade plan`이 `context deadline exceeded` 오류 메시지 출력

이 오류 메시지는 외부 etcd를 실행하는 경우 `kubeadm`으로 쿠버네티스 클러스터를 
업그레이드할 때 표시된다. 이는 중요한 버그가 아니며 이전 버전의 kubeadm이 
외부 etcd 클러스터에서 버전 검사를 수행하기 때문에 발생한다.
`kubeadm upgrade apply ...`를 계속 진행할 수 있다.

이 문제는 버전 1.19부터 수정되었다.

## `kubeadm reset`이 `/var/lib/kubelet`을 언마운트함

`/var/lib/kubelet`이 마운트되어 있는 경우, `kubeadm reset`을 수행하면 효과적으로 언마운트된다.

이 문제를 해결하려면 `kubeadm reset` 작업을 수행한 후 `/var/lib/kubelet` 디렉터리를 다시 마운트한다.

이는 kubeadm 1.15에서 도입된 회귀 버그다. 이 문제는 1.20에서 수정되었다.

## kubeadm 클러스터에서 metrics-server를 안전하게 사용할 수 없음

kubeadm 클러스터에서 [metrics-server](https://github.com/kubernetes-sigs/metrics-server)는 
`--kubelet-insecure-tls`를 전달하여 안전하지 않게 사용할 수 있다. 이는 프로덕션 클러스터에는  권장되지 않는다.

metrics-server와 kubelet 간에 TLS를 사용하려는 경우 문제가 있다.
kubeadm이 kubelet에 대해 자체 서명된 서빙 인증서를 배포하기 때문이다. 이로 인해 
metrics-server 측에서 다음 오류가 발생할 수 있다.

```
x509: certificate signed by unknown authority
x509: certificate is valid for IP-foo not IP-bar
```

kubeadm 클러스터에서 kubelet이 올바르게 서명된 서빙 인증서를 갖도록 구성하는 방법을 이해하려면 
[서명된 kubelet 서빙 인증서 활성화](/ko/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubelet-serving-certs)를 참조한다.

또는 [metrics-server를 안전하게 실행하는 방법](https://github.com/kubernetes-sigs/metrics-server/blob/master/FAQ.md#how-to-run-metrics-server-securely)을 참조한다.

## etcd 해시가 변경되지 않아 업그레이드 실패

노드가 현재 kubeadm 버전 v1.28.0, v1.28.1 또는 v1.28.2로 관리되는 경우
kubeadm 바이너리 v1.28.3 이상으로 컨트롤 플레인 노드를 업그레이드하는 경우에만 해당된다.

발생할 수 있는 오류 메시지는 다음과 같다.

```
[upgrade/etcd] Failed to upgrade etcd: couldn't upgrade control plane. kubeadm has tried to recover everything into the earlier state. Errors faced: static Pod hash for component etcd on Node kinder-upgrade-control-plane-1 did not change after 5m0s: timed out waiting for the condition
[upgrade/etcd] Waiting for previous etcd to become available
I0907 10:10:09.109104    3704 etcd.go:588] [etcd] attempting to see if all cluster endpoints ([https://172.17.0.6:2379/ https://172.17.0.4:2379/ https://172.17.0.3:2379/]) are available 1/10
[upgrade/etcd] Etcd was rolled back and is now available
static Pod hash for component etcd on Node kinder-upgrade-control-plane-1 did not change after 5m0s: timed out waiting for the condition
couldn't upgrade control plane. kubeadm has tried to recover everything into the earlier state. Errors faced
k8s.io/kubernetes/cmd/kubeadm/app/phases/upgrade.rollbackOldManifests
	cmd/kubeadm/app/phases/upgrade/staticpods.go:525
k8s.io/kubernetes/cmd/kubeadm/app/phases/upgrade.upgradeComponent
	cmd/kubeadm/app/phases/upgrade/staticpods.go:254
k8s.io/kubernetes/cmd/kubeadm/app/phases/upgrade.performEtcdStaticPodUpgrade
	cmd/kubeadm/app/phases/upgrade/staticpods.go:338
...
```

이 실패의 이유는 영향을 받는 버전이 PodSpec에 원하지 않는 기본값을 사용하여
etcd 매니페스트 파일을 생성하기 때문이다. 이로 인해 매니페스트 비교에서 차이가 발생하고
kubeadm은 파드 해시의 변경을 기대하지만 kubelet은 해시를 업데이트하지 않는다.

클러스터에서 이 문제가 표시되는 경우 이를 해결하는 두 가지 방법이 있다.

- 영향을 받는 버전과 v1.28.3(또는 이후 버전) 사이에서 etcd 업그레이드를 건너뛸 수 있다.

  ```shell
  kubeadm upgrade {apply|node} [version] --etcd-upgrade=false
  ```

  이는 나중의 v1.28 패치 버전에서 새 etcd 버전이 도입된 경우 권장되지 않는다.

- 업그레이드하기 전에 etcd 정적 파드의 매니페스트를 패치하여 문제가 있는 기본 속성을 제거한다.

  ```patch
  diff --git a/etc/kubernetes/manifests/etcd_defaults.yaml b/etc/kubernetes/manifests/etcd_origin.yaml
  index d807ccbe0aa..46b35f00e15 100644
  --- a/etc/kubernetes/manifests/etcd_defaults.yaml
  +++ b/etc/kubernetes/manifests/etcd_origin.yaml
  @@ -43,7 +43,6 @@ spec:
          scheme: HTTP
        initialDelaySeconds: 10
        periodSeconds: 10
  -      successThreshold: 1
        timeoutSeconds: 15
      name: etcd
      resources:
  @@ -59,26 +58,18 @@ spec:
          scheme: HTTP
        initialDelaySeconds: 10
        periodSeconds: 10
  -      successThreshold: 1
        timeoutSeconds: 15
  -    terminationMessagePath: /dev/termination-log
  -    terminationMessagePolicy: File
      volumeMounts:
      - mountPath: /var/lib/etcd
        name: etcd-data
      - mountPath: /etc/kubernetes/pki/etcd
        name: etcd-certs
  -  dnsPolicy: ClusterFirst
  -  enableServiceLinks: true
    hostNetwork: true
    priority: 2000001000
    priorityClassName: system-node-critical
  -  restartPolicy: Always
  -  schedulerName: default-scheduler
    securityContext:
      seccompProfile:
        type: RuntimeDefault
  -  terminationGracePeriodSeconds: 30
    volumes:
    - hostPath:
        path: /etc/kubernetes/pki/etcd
  ```

이 버그에 대한 자세한 정보는 
[추적 이슈](https://github.com/kubernetes/kubeadm/issues/2927)에서 찾을 수 있다.
