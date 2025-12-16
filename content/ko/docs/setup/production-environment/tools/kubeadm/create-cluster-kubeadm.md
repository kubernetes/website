---
# reviewers:
# - sig-cluster-lifecycle
title: kubeadm으로 클러스터 생성하기
content_type: task
weight: 30
---

<!-- overview -->

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>
`kubeadm`을 사용하면, 모범 사례를 준수하는 최소 작동 가능한 쿠버네티스 클러스터를 생성할 수 있다.
실제로 `kubeadm`을 사용하여 
[쿠버네티스 적합성 테스트](/blog/2017/10/software-conformance-certification/)를 통과하는 클러스터를 구성할 수 있다.
`kubeadm`은 [부트스트랩 토큰](/ko/docs/reference/access-authn-authz/bootstrap-tokens/) 및 
클러스터 업그레이드와 같은 다른 클러스터 수명 주기 기능도 지원한다.

`kubeadm` 도구는 다음과 같은 경우에 적합하다.

- 간단한 방법으로 쿠버네티스를 처음 시도해 보려는 경우
- 기존 사용자가 클러스터 설정을 자동화하고 애플리케이션을 테스트하려는 경우
- 더 큰 범위를 가진 다른 생태계 및/또는 설치 도구의 구성 요소로 사용하는 
  경우

노트북, 클라우드 서버 세트, 라즈베리 파이 등 다양한 머신에 
`kubeadm`을 설치하여 사용할 수 있다. 클라우드 또는 
온프레미스에 배포하든, `kubeadm`을 Ansible 또는 Terraform과 같은 
프로비저닝 시스템에 통합할 수 있다.

## {{% heading "prerequisites" %}}

이 가이드를 따르려면 다음이 필요하다.

- deb/rpm 호환 리눅스 OS를 실행하는 하나 이상의 머신(예: 우분투 또는 CentOS)
- 머신당 2GiB 이상의 RAM(이보다 적으면 앱을 위한 공간이 거의 남지 않음)
- 컨트롤 플레인 노드로 사용하는 머신에 최소 2개의 CPU
- 클러스터의 모든 머신 간 전체 네트워크 연결. 퍼블릭 또는 프라이빗 
  네트워크를 사용할 수 있다.

또한 새 클러스터에서 사용하려는 쿠버네티스 버전을 배포할 수 
있는 `kubeadm` 버전을 사용해야 한다.

[쿠버네티스 버전 및 버전 차이 지원 정책](/docs/setup/release/version-skew-policy/#supported-versions)
이 쿠버네티스 전체와 마찬가지로 `kubeadm`에도 적용된다.
해당 정책을 확인하여 지원되는 쿠버네티스 및 `kubeadm` 버전을 
알아보자. 이 페이지는 쿠버네티스 {{< param "version" >}}용으로 작성되었다.

`kubeadm` 도구의 전체 기능 상태는 일반 가용성(GA)이다. 일부 하위 기능은 
아직 활발히 개발 중이다. 도구가 발전함에 따라 클러스터 생성 구현이 약간 변경될 
수 있지만, 전체적인 구현은 꽤 안정적이어야 한다.

{{< note >}}
`kubeadm alpha` 아래의 모든 명령은 정의상 알파 수준에서 지원된다.
{{< /note >}}

<!-- steps -->

## 목표

* 단일 컨트롤 플레인 쿠버네티스 클러스터 설치
* 파드가 서로 통신할 수 있도록 클러스터에 파드 
  네트워크 설치

## 지침

### 호스트 준비

#### 구성 요소 설치

모든 호스트에 {{< glossary_tooltip term_id="container-runtime" text="컨테이너 런타임" >}}과 
kubeadm을 설치한다. 자세한 지침과 기타 전제 조건은 
[kubeadm 설치하기](/ko/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)를 참조한다.

{{< note >}}
이미 kubeadm을 설치한 경우, kubeadm 업그레이드 방법은 
[리눅스 노드 업그레이드](/ko/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes) 
문서의 처음 두 단계를 참조한다.

업그레이드할 때 kubelet은 kubeadm이 수행할 작업을 알려줄 때까지 크래시루프(crashloop)에서 
대기하면서 몇 초마다 재시작된다. 이 크래시루프는 예상되고 정상적인 동작이다. 
컨트롤 플레인을 초기화한 후 kubelet은 정상적으로 실행된다.
{{< /note >}}

#### 네트워크 설정

kubeadm은 다른 쿠버네티스 구성 요소와 마찬가지로 호스트의 
기본 게이트웨이와 연결된 네트워크 인터페이스에서 사용 가능한 IP를 찾으려고 시도한다. 그런 다음 
이 IP는 구성 요소가 수행하는 광고 및/또는 수신에 사용된다.

리눅스 호스트에서 이 IP가 무엇인지 확인하려면 다음을 사용할 수 있다.

```shell
ip route show # "default via"로 시작하는 줄을 찾는다
```

{{< note >}}
호스트에 둘 이상의 기본 게이트웨이가 있는 경우, 쿠버네티스 구성 요소는 
적합한 글로벌 유니캐스트 IP 주소를 가진 첫 번째 게이트웨이를 사용하려고 시도한다. 
이러한 선택을 할 때 게이트웨이의 정확한 순서는 
운영 체제와 커널 버전에 따라 다를 수 있다.
{{< /note >}}

쿠버네티스 구성 요소는 사용자 정의 네트워크 인터페이스를 옵션으로 허용하지 않으므로, 
이러한 사용자 정의 구성이 필요한 모든 구성 요소 인스턴스에 사용자 정의 IP 주소를 
플래그로 전달해야 한다.

{{< note >}}
호스트에 기본 게이트웨이가 없고 사용자 정의 IP 주소가 
쿠버네티스 구성 요소에 전달되지 않으면, 구성 요소가 오류와 함께 종료될 수 있다.
{{< /note >}}

`init`과 `join` 모두로 생성된 컨트롤 플레인 노드에 대한 API 서버 광고(advertise) 주소를 
구성하려면 `--apiserver-advertise-address` 플래그를 사용할 수 있다. 
선호하는 방법은 이 옵션을 [kubeadm API](/docs/reference/config-api/kubeadm-config.v1beta4)에서 
`InitConfiguration.localAPIEndpoint` 및 `JoinConfiguration.controlPlane.localAPIEndpoint`로 설정하는 것이다.

모든 노드의 kubelet의 경우, kubeadm 
구성 파일(`InitConfiguration` 또는 `JoinConfiguration`)내의 
`.nodeRegistration.kubeletExtraArgs`에서 `--node-ip` 옵션을 전달할 수 있다.

듀얼 스택의 경우
[kubeadm을 사용한 듀얼 스택 지원](/docs/setup/production-environment/tools/kubeadm/dual-stack-support)을 참조한다.

컨트롤 플레인 구성 요소에 할당하는 IP 주소는 X.509 인증서의 주체 
대체 이름 필드의 일부가 된다. 이러한 IP 주소를 변경하려면 
새 인증서에 서명하고 영향을 받는 구성 요소를 재시작하여 인증서 파일의 변경 
사항이 반영되도록 해야 한다. 이 주제에 대한 자세한 내용은 
[수동 인증서 갱신](/ko/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#manual-certificate-renewal)을 
참조한다.

{{< warning >}}
쿠버네티스 프로젝트는 이 접근 방식(사용자 정의 IP 주소로 모든 구성 요소 인스턴스를 구성)을 
권장하지 않는다. 대신 쿠버네티스 관리자는 기본 게이트웨이 IP가 쿠버네티스 구성 요소가 자동 감지하고 
사용하는 IP가 되도록 호스트 네트워크를 설정하는 것을 권장한다. 
리눅스 노드에서는 `ip route`와 같은 명령을 사용하여 네트워킹을 구성할 수 있으며, 운영 
체제에서 더 높은 수준의 네트워크 관리 도구를 제공할 수도 있다. 노드의 기본 게이트웨이가 
퍼블릭 IP 주소인 경우, 노드와 클러스터를 보호하는 패킷 필터링 또는 기타 
보안 조치를 구성해야 한다.
{{< /warning >}}

### 필요한 컨테이너 이미지 준비

이 단계는 선택 사항이며, 노드에서 인터넷 연결 없이 클러스터를 생성할 때 `kubeadm init` 및 `kubeadm join`이 
`registry.k8s.io`에 호스팅된 기본 컨테이너 이미지를 다운로드하지 않도록 하려는 경우에만 적용된다. 

kubeadm에는 인터넷 연결 없이 클러스터를 생성할 때 필요한 이미지를 
미리 가져오는 데 도움이 되는 명령이 있다. 
자세한 내용은 [인터넷 연결 없이 kubeadm 실행](/docs/reference/setup-tools/kubeadm/kubeadm-init#without-internet-connection)을 
참조한다.

kubeadm을 사용하면 필요한 이미지에 대해 사용자 정의 이미지 저장소를 사용할 수 있다. 자세한 내용은 
[사용자 정의 이미지 사용](/docs/reference/setup-tools/kubeadm/kubeadm-init#custom-images)을 
참조한다.

### 컨트롤 플레인 노드 초기화

컨트롤 플레인 노드는 {{< glossary_tooltip term_id="etcd" >}} 
(클러스터 데이터베이스) 및 
{{< glossary_tooltip text="API 서버" term_id="kube-apiserver" >}}
({{< glossary_tooltip text="kubectl" term_id="kubectl" >}} 명령줄 도구가 통신하는)를 
포함한 컨트롤 플레인 구성 요소가 실행되는 머신이다.

1. (권장) 이 단일 컨트롤 플레인 `kubeadm` 클러스터를 
  [고가용성](/docs/setup/production-environment/tools/kubeadm/high-availability/)으로 
  업그레이드할 계획이 있다면, 모든 컨트롤 플레인 노드에 대한 공유 엔드포인트를 설정하기 위해 `--control-plane-endpoint`를 지정해야 한다. 
  이러한 엔드포인트는 로드 밸런서의 DNS 이름 또는 IP 주소일 수 있다.
1. 파드 네트워크 애드온(add-on)을 선택하고, 
  `kubeadm init`에 전달해야 하는 인수가 있는지 확인한다. 선택한 
  서드파티 공급자에 따라 `--pod-network-cidr`을 
  공급자별 값으로 설정해야 할 수 있다. [파드 네트워크 애드온 설치](#pod-network)를 참조한다.
1. (선택 사항) `kubeadm`은 잘 알려진 엔드포인트 목록을 사용하여 컨테이너 런타임을 
  감지하려고 시도한다. 다른 컨테이너 런타임을 사용하거나 프로비저닝된 
  노드에 둘 이상이 설치된 경우 `kubeadm`에 `--cri-socket` 인수를 지정한다. 
  [런타임 설치](/ko/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime)를 참조한다.

컨트롤 플레인 노드를 초기화하려면 다음을 실행한다.

```bash
kubeadm init <args>
```

### apiserver-advertise-address 및 ControlPlaneEndpoint에 대한 고려 사항

`--apiserver-advertise-address`를 사용하여 이 특정 컨트롤 플레인 노드의 API 서버에 대한 광고 주소를 
설정할 수 있지만, `--control-plane-endpoint`를 사용하여 모든 컨트롤 플레인 노드에 대한 
공유 엔드포인트를 설정할 수 있다.

`--control-plane-endpoint`는 IP 주소와 IP 주소에 매핑할 수 있는 DNS 이름을 모두 허용한다.
이러한 매핑과 관련하여 가능한 솔루션을 평가하려면 네트워크 관리자에게 문의하는 것이 좋다.

다음은 매핑 예시이다.

```
192.168.0.102 cluster-endpoint
```

여기서 `192.168.0.102`는 이 노드의 IP 주소이고 `cluster-endpoint`는 이 IP에 매핑되는 사용자 정의 DNS 이름이다. 
이를 통해 `kubeadm init`에 `--control-plane-endpoint=cluster-endpoint`를 전달하고 `kubeadm join`에 동일한 DNS 
이름을 전달할 수 있다. 나중에 고가용성 시나리오에서 `cluster-endpoint`가 로드 밸런서 주소를 
가리키도록 수정할 수 있다.

`--control-plane-endpoint` 없이 생성된 단일 컨트롤 플레인 클러스터를 고가용성 클러스터로 전환하는 것은 
kubeadm에서 지원하지 않는다.

### 추가 정보

`kubeadm init` 인수에 대한 자세한 내용은 [kubeadm 참조 가이드](/ko/docs/reference/setup-tools/kubeadm/)를 참조한다.

구성 파일로 `kubeadm init`을 구성하려면 
[구성 파일과 함께 kubeadm init 사용](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file)을 참조한다.

컨트롤 플레인 구성 요소 및 etcd 서버에 대한 활성(liveness) 프로브에 선택적 IPv6 할당을 
포함하여 컨트롤 플레인 구성 요소를 사용자 정의하려면 
[사용자 정의 인수](/ko/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)에 문서화된 대로 각 구성 요소에 추가 인수를 제공한다.

이미 생성된 클러스터를 재구성하려면
[kubeadm 클러스터 재구성](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure)을 참조한다.

`kubeadm init`을 다시 실행하려면 먼저 [클러스터를 해체](#tear-down)해야 한다.

클러스터에 다른 아키텍처의 노드를 추가(join)하는 경우, 배포된 데몬셋이 
이 아키텍처에 대한 컨테이너 이미지를 지원하는지 확인한다.

`kubeadm init`은 먼저 머신이 쿠버네티스를 실행할 준비가 되었는지 확인하기 위해 일련의 
사전 검사를 실행한다. 이러한 사전 검사는 경고를 표시하고 오류가 발생하면 종료된다. 그런 다음 `kubeadm init`은 
클러스터 컨트롤 플레인 구성 요소를 다운로드하고 설치한다. 이 작업은 몇 분 정도 걸릴 수 있다. 
완료되면 다음이 표시된다.

```none
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a Pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  /docs/concepts/cluster-administration/addons/

You can now join any number of machines by running the following on each node
as root:

  kubeadm join <control-plane-host>:<control-plane-port> --token <token> --discovery-token-ca-cert-hash sha256:<hash>
```

루트(root)가 아닌 사용자가 kubectl을 사용할 수 있도록 하려면 
`kubeadm init` 출력의 일부이기도 한 다음 명령을 실행한다. 

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

또는 `root` 사용자인 경우 다음을 실행할 수 있다.

```bash
export KUBECONFIG=/etc/kubernetes/admin.conf
```

{{< warning >}}
`kubeadm init`이 생성하는 kubeconfig 파일 `admin.conf`에는 
`Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin` 인증서가 포함되어 있다. `kubeadm:cluster-admins` 그룹은 
내장 `cluster-admin` ClusterRole에 바인딩된다.
`admin.conf` 파일을 누구와도 공유하지 않는다.

`kubeadm init`은 `Subject: O = system:masters, CN = kubernetes-super-admin` 인증서가 
포함된 또 다른 kubeconfig 파일 `super-admin.conf`를 생성한다. 
`system:masters`는 권한 부여 계층(예: RBAC)을 우회하는 긴급 수퍼 사용자 그룹이다. 
`super-admin.conf` 파일을 누구와도 공유하지 않는다. 파일을 안전한 위치로 이동하는 것을 권장한다.

추가 사용자를 위한 kubeconfig 파일을 생성하기 위해 
`kubeadm kubeconfig user`를 사용하는 방법은 
[추가 사용자를 위한 kubeconfig 파일 생성](/ko/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#kubeconfig-additional-users)을 참조한다.
{{< /warning >}}

`kubeadm init`이 출력하는 `kubeadm join` 명령을 기록해 둔다. 
[클러스터에 노드를 추가](#join-nodes)하려면 이 명령이 필요하다.

토큰은 컨트롤 플레인 노드와 추가되는 노드 간의 상호 인증에 사용된다. 
여기에 포함된 토큰은 비밀(secret)이다. 이 토큰을 안전하게 보관한다. 이 토큰을 가진 사람은 누구나 
클러스터에 인증된 노드를 추가할 수 있기 때문이다. 이러한 토큰은 
`kubeadm token` 명령으로 나열, 생성 및 삭제할 수 있다. 
[kubeadm 참조 가이드](/docs/reference/setup-tools/kubeadm/kubeadm-token/)를 참조한다.

### 파드 네트워크 애드온 설치 {#pod-network}

{{< caution >}}
이 섹션에는 네트워킹 설정 및 배포 순서에 대한 중요한 
정보가 포함되어 있다.
진행하기 전에 이 모든 조언을 주의 깊게 읽어보자.

**파드가 서로 통신할 수 있도록 
{{< glossary_tooltip text="컨테이너 네트워크 인터페이스" term_id="cni" >}} 
(CNI) 기반 파드 네트워크 애드온을 배포해야 한다. 
네트워크가 설치되기 전에는 클러스터 DNS(CoreDNS)가 시작되지 않는다.**

- 파드 네트워크가 호스트 네트워크와 겹치지 않도록 
  주의한다. 겹치는 부분이 있으면 문제가 발생할 가능성이 높다.
  (네트워크 플러그인의 선호 파드 네트워크와 일부 호스트 
  네트워크 간에 충돌을 발견한 경우, 대신 사용할 적절한 
  CIDR 블록을 생각한 다음 `kubeadm init` 중에 
  `--pod-network-cidr`과 함께 사용하고 네트워크 플러그인의 YAML에서 대체해야 한다.)

- 기본적으로 `kubeadm`은 
  [RBAC](/docs/reference/access-authn-authz/rbac/)(역할 기반 액세스 
  제어) 사용을 설정하고 시행한다. 
  파드 네트워크 플러그인이 RBAC를 지원하는지, 그리고 배포에 사용하는 매니페스트도 
  지원하는지 확인한다.

- 클러스터에 IPv6(듀얼 스택 또는 단일 스택 IPv6 전용 네트워킹)를 
  사용하려면 파드 네트워크 플러그인이 
  IPv6를 지원하는지 확인한다. 
  IPv6 지원은 CNI [v0.6.0](https://github.com/containernetworking/cni/releases/tag/v0.6.0)에 추가되었다.

{{< /caution >}}

{{< note >}}
Kubeadm은 CNI에 구애받지 않아야 하며 CNI 공급자 검증은 현재 e2e 테스트 범위를 벗어난다.
CNI 플러그인과 관련된 문제를 발견하면 kubeadm 또는 쿠버네티스 이슈 
트래커가 아닌 해당 이슈 트래커에 티켓을 기록해야 한다. 
{{< /note >}}

여러 외부 프로젝트가 CNI를 사용하여 쿠버네티스 파드 네트워크를 제공하며, 그 중 일부는 
[네트워크 정책](/ko/docs/concepts/services-networking/network-policies/)도 지원한다.

[쿠버네티스 네트워킹 모델](/ko/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model)을 
구현하는 애드온 목록을 참조한다.

쿠버네티스에서 지원하는 네트워킹 애드온의 전체 목록은 아니지만 
[애드온 설치](/ko/docs/concepts/cluster-administration/addons/#networking-and-network-policy) 페이지를 참조한다. 
컨트롤 플레인 노드 또는 kubeconfig 자격 증명이 있는 노드에서 
다음 명령으로 파드 네트워크 애드온을 설치할 수 있다.

```bash
kubectl apply -f <add-on.yaml>
```

{{< note >}}
몇 가지 CNI 플러그인만 Windows를 지원한다. 자세한 내용과 설정 지침은 
[Windows 워커 노드 추가](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/#network-config)에서 확인할 수 있다.
{{< /note >}}

클러스터당 하나의 파드 네트워크만 설치할 수 있다.

파드 네트워크가 설치되면 `kubectl get pods --all-namespaces` 
출력에서 CoreDNS 파드가 `Running` 상태인지 확인하여 작동하는지 확인할 수 있다. 
CoreDNS 파드가 실행 중이면 노드 추가를 계속할 수 있다.

네트워크가 작동하지 않거나 CoreDNS가 `Running` 상태가 아닌 경우 `kubeadm`에 대한 
[문제 해결 가이드](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)를 
확인한다.

### 관리되는 노드 레이블

기본적으로 kubeadm은 노드 등록 시 kubelet이 자체 적용할 수 있는 레이블을 제한하는 
[NodeRestriction](/docs/reference/access-authn-authz/admission-controllers/#noderestriction) 어드미션 컨트롤러를 활성화한다. 
어드미션 컨트롤러 문서에서는 kubelet `--node-labels` 옵션과 함께 사용할 수 있는 레이블을 다룬다. 
`node-role.kubernetes.io/control-plane` 레이블은 이러한 제한된 레이블이며 kubeadm은 
노드가 생성된 후 권한 있는 클라이언트를 사용하여 수동으로 적용한다. 수동으로 수행하려면 `kubectl label`을 사용하고 
kubeadm이 관리하는 `/etc/kubernetes/admin.conf`와 같은 권한 있는 kubeconfig를 사용하는지 확인한다.

### 컨트롤 플레인 노드 격리

기본적으로 클러스터는 보안상의 이유로 컨트롤 플레인 노드에 파드를 스케줄하지 
않는다. 예를 들어 단일 머신 쿠버네티스 클러스터의 경우 컨트롤 플레인 노드에 
파드를 스케줄할 수 있도록 하려면 다음을 실행한다.

```bash
kubectl taint nodes --all node-role.kubernetes.io/control-plane-
```

출력은 다음과 같다.

```
node "test-01" untainted
...
```

이렇게 하면 컨트롤 플레인 노드를 포함하여 `node-role.kubernetes.io/control-plane:NoSchedule` 테인트(taint)가 
있는 모든 노드에서 해당 테인트가 제거되어 
스케줄러가 모든 곳에 파드를 스케줄할 수 있게 된다.

또한 다음 명령을 실행하여 컨트롤 플레인 노드에서 
[`node.kubernetes.io/exclude-from-external-load-balancers`](/ko/docs/reference/labels-annotations-taints/#node-kubernetes-io-exclude-from-external-load-balancers) 레이블을 
제거할 수 있다. 이 레이블은 해당 노드를 백엔드 서버 목록에서 제외한다. 

```bash
kubectl label nodes --all node.kubernetes.io/exclude-from-external-load-balancers-
```

### 더 많은 컨트롤 플레인 노드 추가

더 많은 컨트롤 플레인 노드를 추가하여 고가용성 kubeadm 클러스터를 생성하는 단계는 
[kubeadm으로 고가용성 클러스터 생성](/docs/setup/production-environment/tools/kubeadm/high-availability/)을 참조한다.

### 워커 노드 추가 {#join-nodes}

워커 노드는 워크로드가 실행되는 곳이다.

다음 페이지에서는 `kubeadm join` 명령을 사용하여 클러스터에 리눅스 및 Windows 
워커 노드를 추가하는 방법을 보여준다.

* [리눅스 워커 노드 추가](/docs/tasks/administer-cluster/kubeadm/adding-linux-nodes/)
* [Windows 워커 노드 추가](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/)

### (선택 사항) 컨트롤 플레인 노드가 아닌 머신에서 클러스터 제어 

다른 컴퓨터(예: 노트북)의 kubectl이 클러스터와 통신하도록 
하려면 다음과 같이 컨트롤 플레인 노드에서 관리자 kubeconfig 파일을 
워크스테이션으로 복사해야 한다.

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf get nodes
```

{{< note >}}
위의 예시는 루트에 대해 SSH 액세스가 활성화되어 있다고 가정한다. 그렇지 않은 경우 
`admin.conf` 파일을 다른 사용자가 액세스할 수 있도록 복사하고 대신 해당 사용자를 
사용하여 `scp`할 수 있다.

`admin.conf` 파일은 사용자에게 클러스터에 대한 _수퍼유저(superuser)_ 권한을 부여한다. 
이 파일은 드물게 사용해야 한다. 일반 사용자의 경우 권한을 부여할 
고유한 자격 증명을 생성하는 것이 좋다. 
`kubeadm kubeconfig user --client-name <CN>` 명령으로 이 작업을 수행할 수 있다. 
이 명령은 KubeConfig 파일을 STDOUT으로 출력하며, 
이를 파일에 저장하고 사용자에게 배포해야 한다. 그런 다음 
`kubectl create (cluster)rolebinding`을 사용하여 권한을 부여한다.
{{< /note >}}

### (선택 사항) API 서버를 localhost로 프록시

클러스터 외부에서 API 서버에 연결하려면 
`kubectl proxy`를 사용할 수 있다.

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf proxy
```

이제 `http://localhost:8001/api/v1`에서 로컬로 API 서버에 액세스할 수 있다.

## 정리 {#tear-down}

테스트용으로 클러스터에 일회용 서버를 사용한 경우, 전원을 
끄고 추가 정리를 수행하지 않을 수 있다. 
`kubectl config delete-cluster`를 사용하여 
클러스터에 대한 로컬 참조를 삭제할 수 있다. 

그러나 클러스터를 더 깔끔하게 프로비저닝 해제하려면 
먼저 [노드를 드레인(drain)](/docs/reference/generated/kubectl/kubectl-commands#drain)하고 
노드가 비어 있는지 확인한 다음 노드 구성을 해제해야 한다.

### 노드 제거

적절한 자격 증명으로 컨트롤 플레인 노드와 통신하여 다음을 실행한다.

```bash
kubectl drain <node name> --delete-emptydir-data --force --ignore-daemonsets
```

노드를 제거하기 전에 `kubeadm`이 설치한 상태를 재설정한다.

```bash
kubeadm reset
```

재설정 프로세스는 iptables 규칙이나 IPVS 테이블을 재설정하거나 정리하지 않는다. 
iptables를 재설정하려면 수동으로 수행해야 한다.

```bash
iptables -F && iptables -t nat -F && iptables -t mangle -F && iptables -X
```

IPVS 테이블을 재설정하려면 다음 명령을 실행해야 한다.

```bash
ipvsadm -C
```

이제 노드를 제거한다.

```bash
kubectl delete node <node name>
```

다시 시작하려면 적절한 인수와 함께 `kubeadm init` 또는 `kubeadm join`을 
실행한다.

### 컨트롤 플레인 정리

컨트롤 플레인 호스트에서 `kubeadm reset`을 사용하여 최선의 노력으로 
정리를 트리거할 수 있다.

이 하위 명령 및 해당 옵션에 대한 
자세한 내용은 [`kubeadm reset`](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) 
참조 문서를 확인한다.

## 버전 차이 정책 {#version-skew-policy}

kubeadm이 관리하는 일부 구성 요소에 대해 버전 차이를 허용하지만, kubeadm 버전을 
컨트롤 플레인 구성 요소, kube-proxy 및 kubelet의 버전과 일치시키는 것이 좋다.

### kubeadm과 쿠버네티스 버전 간의 차이

kubeadm은 kubeadm과 동일한 버전 또는 한 버전 이전의 쿠버네티스 구성 요소와 
함께 사용할 수 있다. 쿠버네티스 버전은 `kubeadm init`의 
`--kubernetes-version` 플래그 또는 `--config` 사용 시 
[`ClusterConfiguration.kubernetesVersion`](/docs/reference/config-api/kubeadm-config.v1beta4/) 
필드를 사용하여 kubeadm에 지정할 수 있다. 이 옵션은 
kube-apiserver, kube-controller-manager, kube-scheduler 및 kube-proxy의 버전을 제어한다.

예시:

* kubeadm이 {{< skew currentVersion >}}인 경우
* `kubernetesVersion`은 {{< skew currentVersion >}} 또는 {{< skew currentVersionAddMinor -1 >}}이어야 한다

### kubeadm과 kubelet 간의 차이

쿠버네티스 버전과 마찬가지로, kubeadm은 kubeadm과 동일한 버전 또는 
세 버전 이전의 kubelet 버전과 함께 사용할 수 있다.

예시:

* kubeadm이 {{< skew currentVersion >}}인 경우
* 호스트의 kubelet은 {{< skew currentVersion >}}, {{< skew currentVersionAddMinor -1 >}},
  {{< skew currentVersionAddMinor -2 >}} 또는 {{< skew currentVersionAddMinor -3 >}}이어야 한다

### kubeadm 간의 차이

kubeadm 명령이 kubeadm이 관리하는 기존 노드 또는 전체 클러스터에서 작동할 수 있는 방법에는 
특정 제한이 있다.

새 노드가 클러스터에 추가되는 경우, `kubeadm join`에 사용되는 kubeadm 바이너리는 
`kubeadm init`으로 클러스터를 생성하거나 `kubeadm upgrade`로 동일한 노드를 업그레이드하는 
데 사용된 kubeadm의 마지막 버전과 일치해야 한다. `kubeadm upgrade`를 제외한 나머지 kubeadm 명령에도 
유사한 규칙이 적용된다. 

`kubeadm join` 예시:

* kubeadm 버전 {{< skew currentVersion >}}을 사용하여 `kubeadm init`으로 클러스터를 생성한 경우
* 추가되는 노드는 {{< skew currentVersion >}} 버전의 kubeadm 바이너리를 사용해야 한다

업그레이드 중인 노드는 노드 관리에 사용된 kubeadm 버전과 동일한 MINOR 
버전 또는 하나 높은 MINOR 버전의 kubeadm을 사용해야 
한다.

`kubeadm upgrade` 예시:

* kubeadm 버전 {{< skew currentVersionAddMinor -1 >}}을 사용하여 노드를 생성하거나 업그레이드한 경우
* 노드 업그레이드에 사용되는 kubeadm 버전은 {{< skew currentVersionAddMinor -1 >}}
  또는 {{< skew currentVersion >}}이어야 한다

다른 쿠버네티스 구성 요소 간의 버전 차이에 대해 자세히 알아보려면 
[버전 차이 정책](/ko/releases/version-skew-policy/)을 참조한다.

## 제한사항 {#limitations}

### 클러스터 복원력(resilience) {#resilience}

여기서 생성된 클러스터에는 단일 etcd 데이터베이스가 실행되는 단일 컨트롤 플레인 
노드가 있다. 즉, 컨트롤 플레인 노드가 실패하면 클러스터가 데이터를 잃을 수 있으며 
처음부터 다시 생성해야 할 수 있다.

해결 방법:

* 정기적으로 [etcd를 백업](https://etcd.io/docs/v3.5/op-guide/recovery/)한다. 
  kubeadm이 구성한 etcd 데이터 디렉터리는 컨트롤 플레인 노드의 `/var/lib/etcd`에 있다.

* 여러 컨트롤 플레인 노드를 사용한다. 
  [고가용성](/docs/setup/production-environment/tools/kubeadm/high-availability/)을 제공하는 클러스터 
  토폴로지를 선택하려면 [고가용성 토폴로지 옵션](/ko/docs/setup/production-environment/tools/kubeadm/ha-topology/)을 읽을 수 있다.

### 플랫폼 호환성 {#multi-platform}

kubeadm deb/rpm 패키지와 바이너리는 
[멀티 플랫폼 제안](https://git.k8s.io/design-proposals-archive/multi-platform.md)에 따라 amd64, arm(32비트), arm64, ppc64le 및 s390x용으로 빌드된다.

컨트롤 플레인 및 애드온용 멀티 플랫폼 컨테이너 이미지도 v1.12부터 지원된다.

일부 네트워크 공급자만 모든 플랫폼에 대한 솔루션을 제공한다. 공급자가 
선택한 플랫폼을 지원하는지 확인하려면 위의 네트워크 공급자 목록이나 
각 공급자의 문서를 참조한다.

## 문제 해결 {#troubleshooting}

kubeadm에 문제가 발생하면 
[문제 해결 문서](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)를 참조한다.

<!-- discussion -->

## {{% heading "whatsnext" %}}

* [Sonobuoy](https://github.com/heptio/sonobuoy)로 클러스터가 제대로 실행되고 있는지 확인
* <a id="lifecycle" />`kubeadm`을 사용한 클러스터 업그레이드에 대한 자세한 내용은
  [kubeadm 클러스터 업그레이드](/ko/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)를 참조한다.
* [kubeadm 참조 문서](/ko/docs/reference/setup-tools/kubeadm/)에서 고급 `kubeadm` 사용법에 대해 알아보기
* 쿠버네티스 [개념](/ko/docs/concepts/) 및 [`kubectl`](/ko/docs/reference/kubectl/)에 대해 자세히 알아보기
* 파드 네트워크 애드온의 더 큰 목록은 [클러스터 네트워킹](/ko/docs/concepts/cluster-administration/networking/) 
  페이지를 참조한다.
* <a id="other-addons" />로깅, 모니터링, 네트워크 정책, 시각화 및 쿠버네티스 클러스터 제어를 위한 
  도구를 포함한 다른 애드온을 탐색하려면 
  [애드온 목록](/ko/docs/concepts/cluster-administration/addons/)을 참조한다.
* 클러스터 이벤트 및 파드에서 실행되는 애플리케이션의 로그를 
  클러스터가 처리하는 방법을 구성한다. 
  관련 사항에 대한 개요는 [로깅 아키텍처](/ko/docs/concepts/cluster-administration/logging/)를 
  참조한다.

### 피드백 {#feedback}

* 버그의 경우, [kubeadm GitHub 이슈 트래커](https://github.com/kubernetes/kubeadm/issues)를 방문한다
* 지원을 받으려면 
  [#kubeadm](https://kubernetes.slack.com/messages/kubeadm/) 슬랙 채널을 방문한다
* 일반 SIG 클러스터 수명 주기 개발 슬랙 채널: 
  [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
* SIG 클러스터 수명 주기 [SIG 정보](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle#readme)
* SIG 클러스터 수명 주기 메일링 리스트: 
  [kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)
