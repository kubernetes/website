---
title: Kubespray로 쿠버네티스 설치하기
content_type: concept
weight: 30
---

<!-- overview -->

이 가이드는 [Kubespray](https://github.com/kubernetes-sigs/kubespray)를 이용하여 GCE, Azure, OpenStack, AWS, vSphere, Equinix Metal(전 Packet), Oracle Cloud infrastructure(실험적) 또는 베어메탈 등에서 운영되는 쿠버네티스 클러스터를 설치하는 과정을 보여준다.

Kubespray는 [Ansible](https://docs.ansible.com/) 플레이북, [인벤토리](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/ansible.md#inventory), 프로비저닝 도구와 일반적인 운영체제, 쿠버네티스 클러스터의 설정 관리 작업에 대한 도메인 지식의 결합으로 만들어졌다. Kubespray는 아래와 같은 기능을 제공한다.

Kubespray 지원 사항
* 고가용성을 지닌 클러스터
* 구성 가능 (인스턴스를 위한 네트워크 플러그인 선택)
* 대부분의 인기있는 리눅스 배포판들에 대한 지원
  - Flatcar Container Linux by Kinvolk
  - Debian Bullseye, Buster, Jessie, Stretch
  - Ubuntu 16.04, 18.04, 20.04, 22.04
  - CentOS/RHEL 7, 8, 9
  - Fedora 35, 36
  - Fedora CoreOS
  - openSUSE Leap 15.x/Tumbleweed
  - Oracle Linux 7, 8, 9
  - Alma Linux 8, 9
  - Rocky Linux 8, 9
  - Kylin Linux Advanced Server V10
  - Amazon Linux 2
* 지속적인 통합 (CI) 테스트

클러스터를 설치해 줄 도구로 유스케이스와 가장 잘 맞는 것을 고르고 싶다면, kubespray를 [kubeadm](/ko/docs/reference/setup-tools/kubeadm/), [kops](/ko/docs/setup/production-environment/tools/kops/)와 [비교한 글](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/comparisons.md)을 읽어보자.

<!-- body -->

## 클러스터 생성하기


### (1/5) 아래의 요건 충족하기

언더레이(underlay) [요건](https://github.com/kubernetes-sigs/kubespray#requirements)을 만족하는 프로비전 한다.

* **쿠버네티스는 최소한 v1.22 이상의 버전이 필요하다.**
* **Ansible의 명령어를 실행하기 위해 Ansible v2.11+, Jinja 2.11+와 Python netaddr 라이브러리가 머신에 설치되어 있어야 한다**.
* 타겟 서버들은 docker 이미지를 풀(pull) 하기 위해 반드시 **인터넷에 접속**할 수 있어야 한다. 아니라면, 추가적인 설정을 해야 한다 ([오프라인 환경 확인하기](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/offline-environment.md))
* 타겟 서버들의 **IPv4 포워딩**이 활성화되어야 한다.
* 파드와 서비스에서 IPv6를 이용한다면, 대상 서버도 **IPv6 포워딩**이 활성화되어야 한다.
* **방화벽은 kubespray가 관리하지 않는다**. 사용자는 기존 방식으로 자신의 규칙을 구현해야 한다. 배포 중에 만날 문제를 예방하려면 방화벽을 비활성화해야 한다.
* 만약 kubespray가 루트가 아닌 사용자 계정에서 실행되었다면, 타겟 서버에서 알맞은 권한 상승 방법이 설정되어야 한다. 그 후에 `ansible_become` 플래그나 커맨드 파라미터들, `--become` 또는 `-b` 가 명시되어야 한다

Kubespray는 환경에 맞는 프로비저닝을 돕기 위해 아래와 같은 서비스를 제공한다:

* 아래 클라우드 제공 업체를 위한 [Terraform](https://www.terraform.io/) 스크립트:
  * [AWS](https://github.com/kubernetes-sigs/kubespray/tree/master/contrib/terraform/aws)
  * [OpenStack](https://github.com/kubernetes-sigs/kubespray/tree/master/contrib/terraform/openstack)
  * [Equinix Metal](https://github.com/kubernetes-sigs/kubespray/tree/master/contrib/terraform/metal)

### (2/5) 인벤토리 파일 구성하기

서버들을 프로비저닝 한 후, [Ansible의 인벤토리 파일](https://docs.ansible.com/ansible/latest/network/getting_started/first_inventory.html)을 만들어야 한다. 수동으로 만들 수도 있고, 동적인 인벤토리 스크립트를 통해 만들 수도 있다. 더 많이 알고싶다면 " [나만의 인벤토리 만들기](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/getting-started.md#building-your-own-inventory)" 글을 확인하자.

### (3/5) 클러스터 디플로이먼트 계획하기

Kubespray에서는 디플로이먼트의 많은 속성들을 사용자가 정의(customize)할 수 있다:

* 디플로이먼트 모드의 선택: kubeadm 또는 그 외
* CNI(네트워킹) 플러그인
* DNS 설정
* 컨트롤 플레인 선택: 네이티브/바이너리 또는 컨테이너화 된 것
* 컴포넌트 버전
* Calico 라우터 리플렉터
* 컴포넌트 런타임 옵션
  * {{< glossary_tooltip term_id="docker" >}}
  * {{< glossary_tooltip term_id="containerd" >}}
  * {{< glossary_tooltip term_id="cri-o" >}}
* 인증서 생성 방법

Kubespray의 [변수 파일들](https://docs.ansible.com/ansible/latest/user_guide/playbooks_variables.html)을 사용자가 정의할 수 있다. 만약 Kubespray를 처음 접하는 경우, kubespray의 기본 설정값을 이용해 클러스터를 배포하고 Kubernetes를 탐색하는 것이 좋다.

### (4/5) 클러스터 배포하기

다음으로, 클러스터를 배포한다.

[Ansible-플레이북](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/getting-started.md#starting-custom-deployment)을 이용한 클러스터 디플로이먼트

```shell
ansible-playbook -i your/inventory/inventory.ini cluster.yml -b -v \
  --private-key=~/.ssh/private_key
```

규모가 큰 디플로이먼트는 (100개 이상의 노드) 최적의 결과를 얻기 위해 [특정한 조정](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/large-deployments.md)을 필요로 할 수도 있다.

### (5/5) 디플로이먼트 검증하기

Kubespray는 Netchecker를 사용하여 파드 사이의 연결성과 DNS 해석을 검증할 방법을 제공한다. Netchecker는 netchecker-agents 파드들이 DNS 요청을 해석하고 기본(default) 네임스페이스 내부에서 서로에게 ping을 보낼 수 있도록 보장한다. 그 파드들은 나머지 워크로드의 유사한 동작을 모방하고 클러스터의 상태 표시기 역할을 한다.

## 클러스터 동작

Kubespray는 클러스터를 관리하기 위한 추가적인 플레이북, _scale_ 과 _upgrade_ 를 제공한다.

### 클러스터 스케일링하기

scale 플레이북을 실행해 클러스터에 워커 노드를 추가할 수 있다. 더 자세히 알고 싶다면, "[노드 추가하기](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/getting-started.md#adding-nodes)" 문서를 확인하자.
remove-node 플레이북을 실행하면 클러스터로부터 워커 노드를 제거할 수 있다. 더 알고 싶다면 "[노드 제거하기](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/getting-started.md#remove-nodes)" 문서를 확인하자.

### 클러스터 업그레이드 하기

upgrade-cluster 플레이북을 실행해 클러스터를 업그레이드 할 수 있다. 더 자세히 알고 싶다면 "[업그레이드](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/upgrades.md)" 문서를 확인하자.

## 클린업

[reset 플레이북](https://github.com/kubernetes-sigs/kubespray/blob/master/reset.yml)을 이용하여 노드들을 리셋하고 Kubespray로 설치된 모든 구성요소를 삭제할 수 있다.

{{< caution >}}
reset 플레이북을 실행할 때, 실수로 프로덕션 클러스터를 타겟으로 삼지 않도록 해야 한다!
{{< /caution >}}

## 피드백

* Slack 채널: [#kubespray](https://kubernetes.slack.com/messages/kubespray/) ([이 곳](https://slack.k8s.io/)에서 초대를 받을 수 있다)
* [GitHub Issues](https://github.com/kubernetes-sigs/kubespray/issues)

## {{% heading "whatsnext" %}}

* Kubespray의 [로드맵](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/roadmap.md)에서 계획중인 작업을 확인해보자.
* [Kubespray](https://github.com/kubernetes-sigs/kubespray)를 더 알아보자.
