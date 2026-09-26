---
# reviewers:
# - sig-cluster-lifecycle
title: kubeadm을 사용하여 클러스터의 각 kubelet 구성하기
content_type: concept
weight: 80
---

<!-- overview -->

{{% dockershim-removal %}}

{{< feature-state for_k8s_version="v1.11" state="stable" >}}

kubeadm CLI 도구의 라이프사이클은 쿠버네티스 클러스터의 각 노드에서
데몬으로 동작하는 [kubelet](/docs/reference/command-line-tools-reference/kubelet)과 분리되어 있다.
사용자가 클러스터를 초기화하거나 업그레이드할 때 kubeadm CLI 도구가 실행되는 반면,
kubelet은 항상 백그라운드에서 실행된다.

kubelet은 데몬 프로세스이므로 init 시스템이나 서비스 관리자가 관리해야 한다.
DEB나 RPM 패키지로 kubelet을 설치하면
systemd가 kubelet을 관리하도록 설정된다. 다른 서비스 관리자를
대신 사용할 수도 있지만, 이 경우 사용자가 수동으로 설정해야 한다.

kubelet 설정 중에는 클러스터 내 모든 kubelet에 동일하게 적용해야 하는 항목도 있고,
머신의 환경(운영 체제, 스토리지, 네트워킹 등)에 맞추어
노드별로 다르게 설정해야 하는 항목도 있다. 이러한 설정을 수동으로 관리할 수도 있지만,
이제 kubeadm에서 제공하는 `KubeletConfiguration` API 타입을 활용하면
[중앙에서 여러 kubelet의 구성을 통합 관리](#kubeadm을-사용하여-kubelet-구성하기)할 수 있다.

<!-- body -->

## kubelet 구성 패턴

다음 섹션에서는 각 노드의 kubelet 구성을 수동으로 직접 관리하지 않고,
kubeadm을 활용하여 간소하게 구성하는 패턴을 살펴본다.

### 클러스터 수준 구성을 각 kubelet에 전파하기

`kubeadm init` 및 `kubeadm join` 명령 실행 시 kubelet이 참조할 기본값을 지정할 수 있다.
예를 들어 다른 컨테이너 런타임을 사용하도록 지정하거나,
서비스가 사용할 기본 서브넷을 변경하는 경우 등이 이에 해당한다.

서비스의 기본 서브넷으로 `10.96.0.0/12` 대역을 사용하려면,
kubeadm 실행 시 `--service-cidr` 파라미터를 다음과 같이 전달한다.

```bash
kubeadm init --service-cidr 10.96.0.0/12
```

이렇게 하면 서비스 가상 IP가 이 서브넷 대역에서 할당된다. 또한 `--cluster-dns` 플래그로
kubelet이 조회할 DNS 주소도 설정해야 한다. 이 설정은 클러스터 내 모든 매니저와
노드의 모든 kubelet에 동일하게 적용되어야 한다. kubelet은 대부분의 파라미터를 설정하고
클러스터에서 실행 중인 각 kubelet에 이 설정을 전파할 수 있도록 버전이 지정된 구조화된
API 오브젝트를 제공한다. 이 오브젝트를 바로
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)이라고 부른다.
사용자는 `KubeletConfiguration`을 통해 클러스터 DNS IP 주소와 같은 설정을
다음 예시처럼 카멜케이스 키에 값 목록 형태로 지정할 수 있다.

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
clusterDNS:
- 10.96.0.10
```

`KubeletConfiguration`에 대한 자세한 내용은 [이 섹션](#kubeadm을-사용하여-kubelet-구성하기)을 참고한다.

### 인스턴스별 구성 세부 정보 제공하기

하드웨어 사양, 운영 체제, 네트워크 환경 등 호스트마다 다른 특성으로 인해
노드에 따라 특정 kubelet 설정을 별도로 적용해야 하는 경우가 있다. 몇 가지 예시는 다음과 같다.

- `--resolv-conf` kubelet 설정 플래그로 지정하는 DNS 확인 파일 경로는
  운영 체제 종류나 `systemd-resolved` 사용 여부에 따라 다를 수 있다.
  이 경로가 잘못 지정되면 해당 노드의 kubelet에서
  도메인 이름 확인이 실패하게 된다.

- 클라우드 제공자 환경이 아니라면, 노드 API 오브젝트의 `.metadata.name`은
  기본적으로 머신의 호스트네임으로 지정된다. 호스트네임과 다른 노드 이름을 사용해야 한다면
  `--hostname-override` 플래그로 기본 동작을 재정의할 수 있다.

- 현재 kubelet은 컨테이너 런타임이 사용하는 cgroup 드라이버를 자동 감지하지 못하므로,
  kubelet이 안정적으로 구동되려면 `--cgroup-driver` 값이
  컨테이너 런타임의 cgroup 드라이버와 반드시 일치해야 한다.

- 사용할 컨테이너 런타임을 지정할 때는 `--container-runtime-endpoint=<path>`
  플래그로 해당 엔드포인트 경로를 명시해야 한다.

이처럼 호스트별로 다른 설정을 적용할 때는
[`KubeletConfiguration` 패치](/docs/setup/production-environment/tools/kubeadm/control-plane-flags#patches) 방식을 사용하는 것을 권장한다.

## kubeadm을 사용하여 kubelet 구성하기

`kubeadm ... --config some-config-file.yaml`과 같이 사용자 정의
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
API 오브젝트가 담긴 설정 파일을 전달하면, kubeadm이 구동할 kubelet을 원하는 대로 구성할 수 있다.

`kubeadm config print init-defaults --component-configs KubeletConfiguration` 명령을 실행하면
이 구조체에 정의된 모든 기본값을 확인할 수 있다.

또한 기본 `KubeletConfiguration` 위에 인스턴스별 패치를 덧씌워 적용하는 것도 가능하다.
자세한 내용은 [kubelet 사용자 정의하기](/docs/setup/production-environment/tools/kubeadm/control-plane-flags#customizing-the-kubelet)
문서를 참고한다.

### `kubeadm init` 사용 시 워크플로

`kubeadm init`을 실행하면 kubelet 설정이 로컬 디스크의
`/var/lib/kubelet/config.yaml` 파일로 저장되며, 클러스터의 `kube-system` 네임스페이스 내
`kubelet-config` 컨피그맵(ConfigMap)에도 함께 등록된다.
이와 함께 kubeadm 도구는 노드의 CRI 소켓을 감지하여 소켓 경로를 포함한 상세 정보를
로컬 설정 파일인 `/var/lib/kubelet/instance-config.yaml`에 기록한다.
또한 클러스터 내 모든 kubelet의 공통 기준 설정이 담긴 kubelet 설정 파일이
`/etc/kubernetes/kubelet.conf` 경로에 작성된다. 이 파일은 kubelet이
API 서버와 통신할 수 있도록 클라이언트 인증서 경로를 가리킨다. 이를 통해 앞서 살펴본
[클러스터 수준 구성을 각 kubelet에 전파하기](#클러스터-수준-구성을-각-kubelet에-전파하기)
요건을 만족하게 된다.

두 번째 패턴인
[인스턴스별 구성 세부 정보 제공하기](#인스턴스별-구성-세부-정보-제공하기)를 처리하기 위해,
kubeadm은 kubelet 시작 시 전달할 플래그 목록이 담긴 환경 변수 파일을
`/var/lib/kubelet/kubeadm-flags.env`에 생성한다. 플래그는 파일 안에 다음과 같이 기록된다.

```bash
KUBELET_KUBEADM_ARGS="--flag1=value1 --flag2=value2 ..."
```

kubelet 구동 플래그 외에도, 이 파일에는 cgroup 드라이버와 같은
동적 파라미터도 함께 포함된다.

이 두 파일을 디스크에 작성한 뒤, systemd를 사용하는 환경이라면
kubeadm은 다음 두 명령을 순서대로 실행한다.

```bash
systemctl daemon-reload && systemctl restart kubelet
```

리로드와 재시작이 정상적으로 완료되면, `kubeadm init`의 나머지 워크플로가 계속된다.

### `kubeadm join` 사용 시 워크플로

`kubeadm join`을 실행하면, kubeadm은 부트스트랩(Bootstrap) 토큰 자격증명을 사용해
TLS 부트스트랩을 수행한다. 이 과정에서 `kubelet-config` 컨피그맵을 다운로드하는 데 필요한
자격증명을 가져와 `/var/lib/kubelet/config.yaml` 파일로 저장한다.
마찬가지로 kubeadm 도구는 노드의 CRI 소켓을 감지하여 소켓 경로를 포함한 상세 정보를
로컬 설정 파일인 `/var/lib/kubelet/instance-config.yaml`에 기록한다.
동적 환경 변수 파일 역시 `kubeadm init`과 완전히 동일한 방식으로 생성된다.

이어서 `kubeadm`은 새 설정을 kubelet에 반영하기 위해 다음 두 명령을 실행한다.

```bash
systemctl daemon-reload && systemctl restart kubelet
```

kubelet이 새 설정을 불러오면, kubeadm은 CA 인증서와 부트스트랩 토큰이 포함된
`/etc/kubernetes/bootstrap-kubelet.conf` KubeConfig 파일을 생성한다.
kubelet은 이를 이용해 TLS 부트스트랩을 진행하고 고유 자격증명을 발급받아
`/etc/kubernetes/kubelet.conf` 파일에 저장한다.

`/etc/kubernetes/kubelet.conf` 파일이 정상적으로 작성되면 kubelet의 TLS 부트스트랩이 완료된 것이다.
부트스트랩이 끝나면 kubeadm은 임시로 쓰였던 `/etc/kubernetes/bootstrap-kubelet.conf` 파일을 삭제한다.

## systemd용 kubelet 드롭인 파일

`kubeadm` 패키지에는 systemd가 kubelet을 구동하는 데 필요한 기본 설정이 포함되어 있다.
참고로 `kubeadm` CLI 명령은 이 드롭인 파일을 직접 수정하지 않는다.

`kubeadm`
[패키지](https://github.com/kubernetes/release/blob/cd53840/cmd/krel/templates/latest/kubeadm/10-kubeadm.conf)를 설치하면 이 설정 파일이
`/usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf` 경로에 배치되어 systemd에서 사용된다.
이 파일은 systemd의 기본
[`kubelet.service`](https://github.com/kubernetes/release/blob/cd53840/cmd/krel/templates/latest/kubelet/kubelet.service) 유닛 설정을 보강하는 역할을 한다.

이 설정을 추가로 덮어쓰려면 `/usr/lib/systemd/system/kubelet.service.d/`가 아닌
`/etc/systemd/system/kubelet.service.d/` 디렉터리를 생성하고 그 안에 사용자 정의 설정 파일을 두면 된다.
예를 들어 `/etc/systemd/system/kubelet.service.d/local-overrides.conf` 파일을 새로 만들어
`kubeadm`이 구성한 유닛 설정을 원하는 대로 재정의할 수 있다.

`/usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf` 파일에는 대체로 다음과 같은 내용이 들어 있다.

{{< note >}}
아래 예시는 참고용 구성이다. 패키지 관리자를 사용하지 않는 환경이라면
([패키지 관리자 없이 설치](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#k8s-install-2)) 섹션에
안내된 절차를 따른다.
{{< /note >}}

```none
[Service]
Environment="KUBELET_KUBECONFIG_ARGS=--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf"
Environment="KUBELET_CONFIG_ARGS=--config=/var/lib/kubelet/config.yaml"
# This is a file that "kubeadm init" and "kubeadm join" generate at runtime, populating
# the KUBELET_KUBEADM_ARGS variable dynamically
EnvironmentFile=-/var/lib/kubelet/kubeadm-flags.env
# This is a file that the user can use for overrides of the kubelet args as a last resort. Preferably,
# the user should use the .NodeRegistration.KubeletExtraArgs object in the configuration files instead.
# KUBELET_EXTRA_ARGS should be sourced from this file.
EnvironmentFile=-/etc/default/kubelet
ExecStart=
ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_CONFIG_ARGS $KUBELET_KUBEADM_ARGS $KUBELET_EXTRA_ARGS
```

이 파일은 kubeadm이 kubelet을 관리하기 위해 사용하는 주요 파일들의 기본 위치를 지정한다.

- TLS 부트스트랩에 사용되는 KubeConfig 파일은 `/etc/kubernetes/bootstrap-kubelet.conf`이나,
  `/etc/kubernetes/kubelet.conf` 파일이 아직 생성되지 않은 경우에만 사용된다.
- kubelet 고유의 신원 정보가 담긴 KubeConfig 파일은 `/etc/kubernetes/kubelet.conf`이다.
- kubelet 컴포넌트 구성이 담긴 파일은 `/var/lib/kubelet/config.yaml`이다.
- `KUBELET_KUBEADM_ARGS` 변수가 정의된 동적 환경 파일은 `/var/lib/kubelet/kubeadm-flags.env`에서 불러온다.
- 사용자가 플래그를 재정의할 수 있는 `KUBELET_EXTRA_ARGS`는
  DEB의 경우 `/etc/default/kubelet`, RPM의 경우 `/etc/sysconfig/kubelet` 파일에서 읽어온다.
  `KUBELET_EXTRA_ARGS`는 플래그 체인의 가장 마지막에 위치하므로 충돌하는 설정이 있다면 최우선 적용된다.

## 쿠버네티스 바이너리 및 패키지 내용

쿠버네티스 릴리스에서 제공하는 DEB 및 RPM 패키지의 구성은 다음과 같다.

| 패키지 이름 | 설명 |
|--------------|-------------|
| `kubeadm` | `/usr/bin/kubeadm` CLI 도구와 kubelet용 [kubelet 드롭인 파일](#systemd용-kubelet-드롭인-파일)을 설치한다. |
| `kubelet` | `/usr/bin/kubelet` 바이너리를 설치한다. |
| `kubectl` | `/usr/bin/kubectl` 바이너리를 설치한다. |
| `cri-tools` | [cri-tools Git 리포지터리](https://github.com/kubernetes-sigs/cri-tools)의 `/usr/bin/crictl` 바이너리를 설치한다. |
| `kubernetes-cni` | [plugins Git 리포지터리](https://github.com/containernetworking/plugins)의 `/opt/cni/bin` 바이너리를 설치한다. |
