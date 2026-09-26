---
# reviewers:
# - sig-cluster-lifecycle
title: kubeadm으로 고가용성 클러스터 생성하기
content_type: task
weight: 60
---

<!-- overview -->

이 페이지는 kubeadm으로 고가용성(HA) 쿠버네티스 클러스터를 구성하는 서로 다른 두 가지
방식을 다음과 같이 설명한다.

- 중첩된(stacked) 컨트롤 플레인 노드를 사용하는 방식. 이 방식은 인프라스트럭처가 더 적게 필요하다. etcd 멤버와
  컨트롤 플레인 노드가 같은 곳에 배치된다.
- 외부 etcd 클러스터를 사용하는 방식. 이 방식은 인프라스트럭처가 더 많이 필요하다.
  컨트롤 플레인 노드와 etcd 멤버가 분리된다.

진행하기 전에 어느 방식이 애플리케이션과 환경의 요구에 가장 잘 맞는지 신중하게
고려해야 한다. [고가용성 토폴로지 선택](/docs/setup/production-environment/tools/kubeadm/ha-topology/)이
각 방식의 장단점을 정리한다.

HA 클러스터를 구성하는 중에 문제가 생기면 kubeadm
[이슈 트래커](https://github.com/kubernetes/kubeadm/issues/new)에 이를 보고한다.

[업그레이드 문서](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)도 참고한다.

{{< caution >}}
이 페이지는 클라우드 공급자에서 클러스터를 실행하는 것은 다루지 않는다. 클라우드
환경에서는 여기에 문서화된 두 방식 모두 LoadBalancer 타입의 서비스 오브젝트나
동적 퍼시스턴트볼륨(PersistentVolume)과 함께 동작하지 않는다.
{{< /caution >}}

## {{% heading "prerequisites" %}}

전제 조건은 클러스터의 컨트롤 플레인에 어떤 토폴로지를 선택했는지에 따라
달라진다.

{{< tabs name="prerequisite_tabs" >}}
{{% tab name="중첩된 etcd" %}}
<!--
    note to reviewers: these prerequisites should match the start of the
    external etc tab
-->

다음이 필요하다.

- [kubeadm의 최소 요구 사항](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#시작하기-전에)을 충족하는
  컨트롤 플레인 노드용 머신 3대 이상. 컨트롤 플레인 노드의 수를 홀수로 두면 머신이나
  존(zone)에 장애가 생겼을 때 리더 선출에 도움이 될 수 있다.
  - 이미 설정되어 동작 중인 {{< glossary_tooltip text="컨테이너 런타임" term_id="container-runtime" >}} 포함
- [kubeadm의 최소 요구 사항](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#시작하기-전에)을
  충족하는 워커용 머신 3대 이상
  - 이미 설정되어 동작 중인 컨테이너 런타임 포함
- 클러스터 내 모든 머신 사이의 완전한 네트워크 연결(퍼블릭 또는
  프라이빗 네트워크)
- 모든 머신에서 `sudo`를 사용하는 슈퍼유저 권한
  - 다른 도구를 사용해도 된다. 이 가이드의 예시에서는 `sudo`를 사용한다.
- 한 장치에서 시스템의 모든 노드에 대한 SSH 접근
- 모든 머신에 이미 설치된 `kubeadm`과 `kubelet`.

_맥락은 [중첩된 etcd 토폴로지](/docs/setup/production-environment/tools/kubeadm/ha-topology/#중첩된-etcd-토폴로지)를 참고한다._

{{% /tab %}}
{{% tab name="외부 etcd" %}}
<!--
    note to reviewers: these prerequisites should match the start of the
    stacked etc tab
-->
다음이 필요하다.

- [kubeadm의 최소 요구 사항](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#시작하기-전에)을 충족하는
  컨트롤 플레인 노드용 머신 3대 이상. 컨트롤 플레인 노드의 수를 홀수로 두면 머신이나
  존(zone)에 장애가 생겼을 때 리더 선출에 도움이 될 수 있다.
  - 이미 설정되어 동작 중인 {{< glossary_tooltip text="컨테이너 런타임" term_id="container-runtime" >}} 포함
- [kubeadm의 최소 요구 사항](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#시작하기-전에)을
  충족하는 워커용 머신 3대 이상
  - 이미 설정되어 동작 중인 컨테이너 런타임 포함
- 클러스터 내 모든 머신 사이의 완전한 네트워크 연결(퍼블릭 또는
  프라이빗 네트워크)
- 모든 머신에서 `sudo`를 사용하는 슈퍼유저 권한
  - 다른 도구를 사용해도 된다. 이 가이드의 예시에서는 `sudo`를 사용한다.
- 한 장치에서 시스템의 모든 노드에 대한 SSH 접근
- 모든 머신에 이미 설치된 `kubeadm`과 `kubelet`.

<!-- end of shared prerequisites -->

그리고 다음도 필요하다.

- etcd 클러스터 멤버가 될 추가 머신 3대 이상.
  etcd 클러스터의 멤버 수를 홀수로 두는 것은 최적의 투표 쿼럼(quorum)을
  확보하기 위한 요구 사항이다.
  - 이 머신에도 `kubeadm`과 `kubelet`이 설치되어 있어야 한다.
  - 이 머신에도 이미 설정되어 동작 중인 컨테이너 런타임이 필요하다.

_맥락은 [외부 etcd 토폴로지](/docs/setup/production-environment/tools/kubeadm/ha-topology/#외부-etcd-토폴로지)를 참고한다._
{{% /tab %}}
{{< /tabs >}}

### 컨테이너 이미지

각 호스트는 쿠버네티스 컨테이너 이미지 레지스트리인 `registry.k8s.io`에서 이미지를 읽고
가져올 수 있어야 한다. 호스트가 이미지를 내려받을 수 없는 고가용성 클러스터를
배포하려는 경우에도 가능하다. 올바른 컨테이너 이미지가 해당 호스트에 이미 준비되어 있도록
다른 수단으로 보장해야 한다.

### 커맨드라인 인터페이스 {#kubectl}

클러스터를 구성한 뒤 쿠버네티스를 관리하려면 PC에
[kubectl을 설치](/docs/tasks/tools/#kubectl)해야 한다. 각 컨트롤 플레인 노드에도
`kubectl` 도구를 설치하면 유용한데, 문제를 해결할 때
도움이 될 수 있기 때문이다.

<!-- steps -->

## 두 방법의 첫 단계

### kube-apiserver용 로드 밸런서 생성

{{< note >}}
로드 밸런서 구성은 여러 가지다. 다음 예시는 한 가지 선택지일
뿐이다. 클러스터 요구 사항에 따라 다른 구성이 필요할 수 있다.
{{< /note >}}

1. DNS로 확인되는 이름의 kube-apiserver 로드 밸런서를 생성한다.

   - 클라우드 환경에서는 컨트롤 플레인 노드를 TCP 포워딩 로드 밸런서
     뒤에 두어야 한다. 이 로드 밸런서는 대상 목록에 있는 정상 상태의
     모든 컨트롤 플레인 노드로 트래픽을 분산한다. apiserver의 헬스 체크는
     kube-apiserver가 수신 대기하는 포트에 대한 TCP 체크이다
     (기본값 `:6443`).

   - 클라우드 환경에서 IP 주소를 직접 사용하는 것은 권장하지 않는다.

   - 로드 밸런서는 apiserver 포트로 모든 컨트롤 플레인 노드와
     통신할 수 있어야 한다. 또한 그 수신 대기 포트로 들어오는 트래픽을
     허용해야 한다.

   - 로드 밸런서의 주소가 kubeadm의 `ControlPlaneEndpoint` 주소와
     항상 일치하는지 확인한다.

   - 자세한 내용은 [소프트웨어 로드 밸런싱 옵션](https://git.k8s.io/kubeadm/docs/ha-considerations.md#options-for-software-load-balancing)
     가이드를 읽는다.

1. 첫 번째 컨트롤 플레인 노드를 로드 밸런서에 추가하고 연결을
   테스트한다.

   ```shell
   nc -zv -w 2 <LOAD_BALANCER_IP> <PORT>
   ```

   API 서버가 아직 실행 중이 아니므로 연결이 거부되는 오류는
   예상된 것이다. 그러나 타임아웃은 로드 밸런서가 컨트롤 플레인
   노드와 통신하지 못한다는 뜻이다. 타임아웃이 발생하면 컨트롤 플레인
   노드와 통신할 수 있도록 로드 밸런서를 다시 구성한다.

1. 나머지 컨트롤 플레인 노드를 로드 밸런서의 대상 그룹(target group)에 추가한다.

## 중첩된 컨트롤 플레인과 etcd 노드

### 첫 번째 컨트롤 플레인 노드 단계

1. 컨트롤 플레인을 초기화한다.

   ```sh
   sudo kubeadm init --control-plane-endpoint "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT" --upload-certs
   ```

   - `--kubernetes-version` 플래그로 사용할 쿠버네티스 버전을 설정할 수 있다.
     kubeadm, kubelet, kubectl, 쿠버네티스의 버전을 일치시키는 것을 권장한다.
   - `--control-plane-endpoint` 플래그는 로드 밸런서의 주소 또는 DNS와 포트로 설정해야 한다.

   - `--upload-certs` 플래그는 모든 컨트롤 플레인 인스턴스가 공유해야 하는 인증서를
     클러스터에 업로드하는 데 사용한다. 그렇게 하지 않고 컨트롤 플레인 노드 사이에 인증서를
     수동으로 또는 자동화 도구로 복사하려면, 이 플래그를 제거하고 아래 [인증서 수동
     배포](#manual-certs) 절을 참고한다.

   {{< note >}}
   `kubeadm init`의 `--config`와 `--certificate-key` 플래그는 함께 쓸 수 없으므로,
   [kubeadm 구성](/docs/reference/config-api/kubeadm-config.v1beta4/)을 사용하려면
   적절한 구성 위치(`InitConfiguration`과 `JoinConfiguration: controlPlane` 아래)에
   `certificateKey` 필드를 추가해야 한다.
   {{< /note >}}

   {{< note >}}
   일부 CNI 네트워크 플러그인은 파드 IP CIDR 지정 같은 추가 구성이 필요하고, 그렇지 않은 플러그인도 있다.
   [CNI 네트워크 문서](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network)를 참고한다.
   파드 CIDR을 추가하려면 `--pod-network-cidr` 플래그를 전달하거나, kubeadm 구성 파일을 사용한다면
   `ClusterConfiguration`의 `networking` 오브젝트 아래에 `podSubnet` 필드를 설정한다.
   {{< /note >}}

   출력은 다음과 비슷하다.

   ```sh
   ...
   You can now join any number of control-plane node by running the following command on each as a root:
       kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07

   Please note that the certificate-key gives access to cluster sensitive data, keep it secret!
   As a safeguard, uploaded-certs will be deleted in two hours; If necessary, you can use kubeadm init phase upload-certs to reload certs afterward.

   Then you can join any number of worker nodes by running the following on each as root:
       kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
   ```

   - 이 출력을 텍스트 파일에 복사해 둔다. 나중에 컨트롤 플레인 노드와 워커 노드를 클러스터에
     추가할 때 필요하다.
   - `kubeadm init`에 `--upload-certs`를 사용하면, 기본 컨트롤 플레인의 인증서가
     암호화되어 `kubeadm-certs` 시크릿(Secret)에 업로드된다.
   - 인증서를 다시 업로드하고 새 복호화 키를 생성하려면, 이미 클러스터에
     추가된 컨트롤 플레인
     노드에서 다음 명령을 사용한다.

     ```sh
     sudo kubeadm init phase upload-certs --upload-certs
     ```

   - `init` 중에 나중에 `join`에서 사용할 수 있는 사용자 정의 `--certificate-key`를 지정할 수도 있다.
     그런 키를 생성하려면 다음 명령을 사용할 수 있다.

     ```sh
     kubeadm certs certificate-key
     ```

   인증서 키는 32바이트 크기의 AES 키인 16진수 인코딩 문자열이다.

   {{< note >}}
   `kubeadm-certs` 시크릿과 복호화 키는 두 시간 뒤에 만료된다.
   {{< /note >}}

   {{< caution >}}
   명령 출력에 적힌 대로, 인증서 키는 클러스터의 민감한 데이터에 접근할 수 있게 한다. 비밀로 유지한다!
   {{< /caution >}}

1. 선택한 CNI 플러그인을 적용한다.
   CNI 공급자를 설치하려면 [다음 지침](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network)을
   따른다. (해당한다면) kubeadm 구성 파일에 지정한 파드 CIDR과 구성이
   일치하는지 확인한다.

   {{< note >}}
   유스케이스에 맞는 네트워크 플러그인을 골라 다음 단계로 넘어가기 전에 배포해야 한다.
   그렇게 하지 않으면 클러스터를 제대로 시작할 수 없다.
   {{< /note >}}

1. 다음을 입력하고 컨트롤 플레인 컴포넌트의 파드가 시작되는 것을 지켜본다.

   ```sh
   kubectl get pod -n kube-system -w
   ```

### 나머지 컨트롤 플레인 노드 단계

추가하는 각 컨트롤 플레인 노드에서 다음을 수행해야 한다.

1. 첫 번째 노드의 `kubeadm init` 출력으로 앞서 받은 join 명령을 실행한다.
   다음과 비슷한 모습일 것이다.

   ```sh
   sudo kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07
   ```

   - `--control-plane` 플래그는 `kubeadm join`이 새 컨트롤 플레인을 생성하도록 지시한다.
   - `--certificate-key ...`는 클러스터의 `kubeadm-certs` 시크릿에서 컨트롤 플레인
     인증서를 내려받아 주어진 키로 복호화하도록 한다.


{{< note >}}
클러스터 노드는 보통 순차적으로 초기화되므로, CoreDNS 파드가 모두 첫 번째 컨트롤 플레인
노드에서 실행될 가능성이 높다. 가용성을 더 높이려면, 새 노드가 하나 이상 추가된 뒤에
`kubectl -n kube-system rollout restart deployment coredns`로 CoreDNS 파드를 재분배한다.
{{< /note >}}

## 외부 etcd 노드

외부 etcd 노드로 클러스터를 구성하는 것은 중첩된 etcd에 쓰는 절차와 비슷하지만
etcd를 먼저 설정해야 하고, kubeadm 구성 파일에 etcd 정보를
전달해야 한다는 점이 다르다.

### etcd 클러스터 설정

1. etcd 클러스터를 설정하려면 다음 [지침](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)을 따른다.

1. [여기](#manual-certs)에 설명된 대로 SSH를 설정한다.

1. 클러스터의 어떤 etcd 노드에서든 첫 번째 컨트롤 플레인 노드로 다음 파일을 복사한다.

   ```sh
   export CONTROL_PLANE="ubuntu@10.0.0.7"
   scp /etc/kubernetes/pki/etcd/ca.crt "${CONTROL_PLANE}":
   scp /etc/kubernetes/pki/apiserver-etcd-client.crt "${CONTROL_PLANE}":
   scp /etc/kubernetes/pki/apiserver-etcd-client.key "${CONTROL_PLANE}":
   ```

   - `CONTROL_PLANE`의 값을 첫 번째 컨트롤 플레인 노드의 `user@host`로 바꾼다.

### 첫 번째 컨트롤 플레인 노드 설정

1. 다음 내용으로 `kubeadm-config.yaml`이라는 파일을 만든다.

   ```yaml
   ---
   apiVersion: kubeadm.k8s.io/v1beta4
   kind: ClusterConfiguration
   kubernetesVersion: stable
   controlPlaneEndpoint: "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT" # change this (see below)
   etcd:
     external:
       endpoints:
         - https://ETCD_0_IP:2379 # change ETCD_0_IP appropriately
         - https://ETCD_1_IP:2379 # change ETCD_1_IP appropriately
         - https://ETCD_2_IP:2379 # change ETCD_2_IP appropriately
       caFile: /etc/kubernetes/pki/etcd/ca.crt
       certFile: /etc/kubernetes/pki/apiserver-etcd-client.crt
       keyFile: /etc/kubernetes/pki/apiserver-etcd-client.key
   ```

   {{< note >}}
   여기서 중첩된 etcd와 외부 etcd의 차이는 외부 etcd 설정에는 `etcd`의 `external` 오브젝트
   아래에 etcd 엔드포인트가 있는 구성 파일이 필요하다는 점이다.
   중첩된 etcd 토폴로지의 경우, 이는 자동으로 관리된다.
   {{< /note >}}

   - 구성 템플릿의 다음 변수를 클러스터에 맞는 값으로 바꾼다.

     - `LOAD_BALANCER_DNS`
     - `LOAD_BALANCER_PORT`
     - `ETCD_0_IP`
     - `ETCD_1_IP`
     - `ETCD_2_IP`

다음 단계는 중첩된 etcd 설정과 비슷하다.

1. 이 노드에서 `sudo kubeadm init --config kubeadm-config.yaml --upload-certs`를 실행한다.

1. 출력으로 반환된 join 명령을 나중에 쓸 수 있도록 텍스트 파일에 적어 둔다.

1. 선택한 CNI 플러그인을 적용한다.

   {{< note >}}
   유스케이스에 맞는 네트워크 플러그인을 골라 다음 단계로 넘어가기 전에 배포해야 한다.
   그렇게 하지 않으면 클러스터를 제대로 시작할 수 없다.
   {{< /note >}}

### 나머지 컨트롤 플레인 노드 단계

단계는 중첩된 etcd 설정과 같다.

- 첫 번째 컨트롤 플레인 노드가 완전히 초기화되었는지 확인한다.
- 텍스트 파일에 저장해 둔 join 명령으로 각 컨트롤 플레인 노드를 추가한다. 컨트롤 플레인
  노드는 한 번에 하나씩 추가하는 것을 권장한다.
- `--certificate-key`의 복호화 키가 기본적으로 두 시간 뒤에 만료된다는 점을 잊지 않는다.

## 컨트롤 플레인 부트스트랩 이후의 공통 작업

### 워커 설치

워커 노드는 `kubeadm init` 명령의 출력으로 앞서 저장해 둔 명령을 사용해
클러스터에 추가할 수 있다.

```sh
sudo kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
```

## 인증서 수동 배포 {#manual-certs}

`kubeadm init`에 `--upload-certs` 플래그를 사용하지 않기로 했다면
기본 컨트롤 플레인 노드에서 추가되는
컨트롤 플레인 노드로 인증서를 수동으로 복사해야 한다.

이렇게 하는 방법은 여러 가지다. 다음 예시는 `ssh`와 `scp`를 사용한다.

한 대의 머신에서 모든 노드를 제어하려면 SSH가 필요하다.

1. 시스템의 다른 모든 노드에 접근할 수 있는 주 장치에서 ssh-agent를
   활성화한다.

   ```shell
   eval $(ssh-agent)
   ```

1. 세션에 SSH 아이덴티티를 추가한다.

   ```shell
   ssh-add ~/.ssh/path_to_private_key
   ```

1. 노드 사이를 SSH로 접속해 연결이 제대로 동작하는지 확인한다.

   - 어떤 노드로든 SSH 접속할 때는 `-A` 플래그를 추가한다. 이 플래그는 SSH로 로그인한
     노드가 PC의 SSH 에이전트에 접근할 수 있게 한다. 노드의 사용자 세션 보안을
     온전히 신뢰하지 못한다면 다른 방법을 고려한다.

     ```shell
     ssh -A 10.0.0.7
     ```

   - 어떤 노드에서든 sudo를 사용할 때는 SSH 포워딩이 동작하도록 환경을
     보존해야 한다.

     ```shell
     sudo -E -s
     ```

1. 모든 노드에 SSH를 구성한 뒤 `kubeadm init`을 실행하고 나서 첫 번째 컨트롤 플레인
   노드에서 다음 스크립트를 실행해야 한다. 이 스크립트는 첫 번째 컨트롤 플레인
   노드에서 다른 컨트롤 플레인 노드로 인증서를 복사한다.

   다음 예시에서 `CONTROL_PLANE_IPS`를 다른 컨트롤 플레인 노드의 IP 주소로
   바꾼다.

   ```sh
   USER=ubuntu # customizable
   CONTROL_PLANE_IPS="10.0.0.7 10.0.0.8"
   for host in ${CONTROL_PLANE_IPS}; do
       scp /etc/kubernetes/pki/ca.crt "${USER}"@$host:
       scp /etc/kubernetes/pki/ca.key "${USER}"@$host:
       scp /etc/kubernetes/pki/sa.key "${USER}"@$host:
       scp /etc/kubernetes/pki/sa.pub "${USER}"@$host:
       scp /etc/kubernetes/pki/front-proxy-ca.crt "${USER}"@$host:
       scp /etc/kubernetes/pki/front-proxy-ca.key "${USER}"@$host:
       scp /etc/kubernetes/pki/etcd/ca.crt "${USER}"@$host:etcd-ca.crt
       # Skip the next line if you are using external etcd
       scp /etc/kubernetes/pki/etcd/ca.key "${USER}"@$host:etcd-ca.key
   done
   ```

   {{< caution >}}
   위 목록에 있는 인증서만 복사한다. 나머지 인증서는 추가되는 컨트롤 플레인 인스턴스에
   필요한 SAN을 담아 kubeadm이 생성한다. 실수로 모든 인증서를 복사하면,
   필요한 SAN이 없어 추가 노드 생성이 실패할 수 있다.
   {{< /caution >}}

1. 그런 다음 추가되는 각 컨트롤 플레인 노드에서 `kubeadm join`을 실행하기 전에 다음 스크립트를 실행해야 한다.
   이 스크립트는 앞서 복사한 인증서를 홈 디렉터리에서 `/etc/kubernetes/pki`로 옮긴다.

   ```sh
   USER=ubuntu # customizable
   mkdir -p /etc/kubernetes/pki/etcd
   mv /home/${USER}/ca.crt /etc/kubernetes/pki/
   mv /home/${USER}/ca.key /etc/kubernetes/pki/
   mv /home/${USER}/sa.pub /etc/kubernetes/pki/
   mv /home/${USER}/sa.key /etc/kubernetes/pki/
   mv /home/${USER}/front-proxy-ca.crt /etc/kubernetes/pki/
   mv /home/${USER}/front-proxy-ca.key /etc/kubernetes/pki/
   mv /home/${USER}/etcd-ca.crt /etc/kubernetes/pki/etcd/ca.crt
   # Skip the next line if you are using external etcd
   mv /home/${USER}/etcd-ca.key /etc/kubernetes/pki/etcd/ca.key
   ```
