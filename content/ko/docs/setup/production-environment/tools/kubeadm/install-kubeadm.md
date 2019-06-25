---
title: kubeadm 설치
content_template: templates/task
weight: 20
card:
  name: 설치
  weight: 20
  title: kubeadm 셋업 도구 설치
---

{{% capture overview %}}

<img src="https://raw.githubusercontent.com/cncf/artwork/master/kubernetes/certified-kubernetes/versionless/color/certified-kubernetes-color.png" align="right" width="150px">이 페이지는 `kubeadm` 도구상자를 설치하는 방법을 보여준다.
이 설치 프로세스를 수행 한 후에 kubeadm을 사용하여 클러스터를 만드는 방법에 대한 정보는,
 [Using kubeadm to Create a Cluster](/docs/setup/independent/create-cluster-kubeadm/) 페이지를 참조하라.

{{% /capture %}}

{{% capture prerequisites %}}

* 다음 중 하나에서 한개 혹은 그 이상의 머신:
  - Ubuntu 16.04+
  - Debian 9
  - CentOS 7
  - RHEL 7
  - Fedora 25/26 (best-effort)
  - HypriotOS v1.0.1+
  - Container Linux (tested with 1800.6.0)
* 머신 당 2 GB 혹은 그 이상의 RAM (앱을 위해 약간의 여분의 공간을 마련해야 함)
* 2 CPUs 혹은 그 이상
* 클러스터 내의  (공용 혹은 사설 네트워크 둘 다 가능)
* 모든 노드의 고유의 호스트네임, 맥 어드레스, 그리고 제품 uuid.  자세한 내용은 [여기](#verify-the-mac-address-and-product-uuid-are-unique-for-every-node)를 확인하라.
* 특정 포트가 머신에서 열려있어야 한다. 자세한 내용은 [여기](#check-required-ports)를 확인하라.
* 스왑 비활성화. kubelet을 정상동작시키기 위해 스왑이 비활성화 되어야만 한다(**MUST**).

{{% /capture %}}

{{% capture steps %}}

## 모든 노드에 대해 MAC 주소와 product_uuid가 고유한지 검증

* 다음의 `ip link` 혹은 `ifconfig -a` 명령을 사용하여 네트워크 인터페이스의 MAC 주소를 얻을 수 있다.

* `sudo cat /sys/class/dmi/id/product_uuid` 명령을 사용하여 product_uuid를 확인할 수 있다.

일부 가상 시스템은 동일한 값을 가질 수 있지만 하드웨어 장치는 고유한 주소를 가질 가능성이 높다. 쿠버네티스는 이러한 값을 사용하여 클러스터의 노드를 고유하게 식별한다. 이 값이 각 노드마다 고유하지 않으면 설치 프로세스가 실패 할 수 있다 (https://github.com/kubernetes/kubeadm/issues/31).

## 네트워크 아답터 확인

네트워크 어댑터가 둘 이상이고 기본 경로에서 쿠버네티스 구성요소에 연결할 수 없는 경우 쿠버네티스 클러스터 주소가 적절한 어댑터를 통과하도록 IP 경로를 추가하는 것이 좋다.

## 필요한 포트 확인

### 마스터 노드(들)

| Protocol | Direction | Port Range | Purpose                 | Used By                   |
|----------|-----------|------------|-------------------------|---------------------------|
| TCP      | Inbound   | 6443*      | Kubernetes API server   | All                       |
| TCP      | Inbound   | 2379-2380  | etcd server client API  | kube-apiserver, etcd      |
| TCP      | Inbound   | 10250      | Kubelet API             | Self, Control plane       |
| TCP      | Inbound   | 10251      | kube-scheduler          | Self                      |
| TCP      | Inbound   | 10252      | kube-controller-manager | Self                      |

### 워커 노드(들)

| Protocol | Direction | Port Range  | Purpose               | Used By                 |
|----------|-----------|-------------|-----------------------|-------------------------|
| TCP      | Inbound   | 10250       | Kubelet API           | Self, Control plane     |
| TCP      | Inbound   | 30000-32767 | NodePort Services**   | All                     |

** [NodePort Services](/docs/concepts/services-networking/service/) 의 기본 포트 범위.

* 로 표시된 포트 번호는 재정의 가능하므로 제공하는 사용자 지정 포트도 모두 열려 있는지 확인하라.

etcd 포트는 마스터 노드에 포함되지만 외부 또는 사용자 지정 포트에서 자신의 etd 클러스터를 호스트할 수도 있다.

사용하는 포드 네트워크 플러그인(아래 참조)에도 특정 포트가 열려 있어야 할 수 있다. 이는 각 포드 네트워크 플러그인과 다르므로 플러그인에 필요한 포트에 대한 설명서를 참조라.


## 런타임 설치 {#installing-runtime}

v1.6.0 이후 쿠버네티스는 기본적으로 컨테이너 런타임 인터페이스인 CRI를 사용할 수 있도록 했다.

v1.14.0 이후, Kubeadm은 잘 알려진 도메인 소켓 목록을 검색하여 Linux 노드에서 컨테이너 런타임을 자동으로 탐지하려고 시도할 것이다. 검출 가능한 런타임과 사용되는 소켓 경로는 아래 표에서 확인할 수 있다.

| Runtime    | Domain Socket                    |
|------------|----------------------------------|
| Docker     | /var/run/docker.sock             |
| containerd | /run/containerd/containerd.sock  |
| CRI-O      | /var/run/crio/crio.sock          |

도커와 컨테이너d가 함께 검출되면 도커가 우선한다. 이것은 컨테이너d와 둘 다 있는 Docker 18.09 선박들이 탐지 가능하기 때문에 필요하다. 다른 두 개 이상의 런타임이 감지되면 kubeadm은 적절한 오류 메시지와 함께 종료된다.

비-리눅스 노드에서 기본적으로 사용되는 컨테이너 런타임은 Docker이다.

컨테이너 런타임이 도커일 경우, `kubelet` 내부에 내장된 `dockershim` CRI 구현을 통해 사용된다.

다른 CRI 기반의 런타임들이 포함하는 것들이다.

- [containerd](https://github.com/containerd/cri) (containerd에 내장된 CRI 플러그인)
- [cri-o](https://github.com/kubernetes-incubator/cri-o)
- [frakti](https://github.com/kubernetes/frakti)

더 자세한 정보를 위해 [CRI installation instructions](/docs/setup/cri) 를 참조하라.

## kubeadm, kubelet 와 kubectl 설치

모든 머신에 이 패키지들을 설치해야 한다.

* `kubeadm`: 클러스터를 부트스트랩하기 위한 커맨드.

* `kubelet`: 클러스터의 모든 시스템에서 실행되고 포드 및 컨테이너 시작과 같은 작업을 수행하는 컴포넌트.

* `kubectl`: 클러스터와 대화하는 데 사용되는 커맨드라인.

kubeadm은 `kubelet` 이나 `kubectl` 을 설치하거나 관리하지 **않으므로** kubeadm이 설치하기를 원하는 쿠버네티스 컨트롤러의 버전과 일치하는지 확인해야 한다. 그렇지 않으면 버전 왜곡이 발생할 위험이 있으며, 이로 인해 예기치 않은 버그가 발생할 수 있다. 그러나 _하나_ 의 작은 버전은 다음과 같이 왜곡된다.
kubelet과 컨트롤패널이 지원되지만 kubelet 버전은 API 서버 버전을 초과할 수 없다. 예를 들어, 1.7.0을 실행하는 kubelet은 1.8.0 API 서버와 완전히 호환되어야 하지만, 그 반대의 경우도 없어야 한다.

{{< warning >}}
These instructions exclude all Kubernetes packages from any system upgrades.
This is because kubeadm and Kubernetes require
[special attention to upgrade](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-14/).
{{</ warning >}}

For more information on version skews, see:

* Kubernetes [version and version-skew policy](/docs/setup/version-skew-policy/)
* Kubeadm-specific [version skew policy](/docs/setup/independent/create-cluster-kubeadm/#version-skew-policy)

{{< tabs name="k8s_install" >}}
{{% tab name="Ubuntu, Debian or HypriotOS" %}}
```bash
apt-get update && apt-get install -y apt-transport-https curl
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb https://apt.kubernetes.io/ kubernetes-xenial main
EOF
apt-get update
apt-get install -y kubelet kubeadm kubectl
apt-mark hold kubelet kubeadm kubectl
```
{{% /tab %}}
{{% tab name="CentOS, RHEL or Fedora" %}}
```bash
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
exclude=kube*
EOF

# Set SELinux in permissive mode (effectively disabling it)
setenforce 0
sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config

yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes

systemctl enable --now kubelet
```

  **Note:**

  - Setting SELinux in permissive mode by running `setenforce 0` and `sed ...` effectively disables it.
    This is required to allow containers to access the host filesystem, which is needed by pod networks for example.
    You have to do this until SELinux support is improved in the kubelet.
  - Some users on RHEL/CentOS 7 have reported issues with traffic being routed incorrectly due to iptables being bypassed. You should ensure
    `net.bridge.bridge-nf-call-iptables` is set to 1 in your `sysctl` config, e.g.

    ```bash
    cat <<EOF >  /etc/sysctl.d/k8s.conf
    net.bridge.bridge-nf-call-ip6tables = 1
    net.bridge.bridge-nf-call-iptables = 1
    EOF
    sysctl --system
    ```
  - Make sure that the `br_netfilter` module is loaded before this step. This can be done by running `lsmod | grep br_netfilter`. To load it explicitly call `modprobe br_netfilter`.
{{% /tab %}}
{{% tab name="Container Linux" %}}
Install CNI plugins (required for most pod network):

```bash
CNI_VERSION="v0.6.0"
mkdir -p /opt/cni/bin
curl -L "https://github.com/containernetworking/plugins/releases/download/${CNI_VERSION}/cni-plugins-amd64-${CNI_VERSION}.tgz" | tar -C /opt/cni/bin -xz
```

Install crictl (required for kubeadm / Kubelet Container Runtime Interface (CRI))

```bash
CRICTL_VERSION="v1.11.1"
mkdir -p /opt/bin
curl -L "https://github.com/kubernetes-incubator/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-amd64.tar.gz" | tar -C /opt/bin -xz
```

Install `kubeadm`, `kubelet`, `kubectl` and add a `kubelet` systemd service:

```bash
RELEASE="$(curl -sSL https://dl.k8s.io/release/stable.txt)"

mkdir -p /opt/bin
cd /opt/bin
curl -L --remote-name-all https://storage.googleapis.com/kubernetes-release/release/${RELEASE}/bin/linux/amd64/{kubeadm,kubelet,kubectl}
chmod +x {kubeadm,kubelet,kubectl}

curl -sSL "https://raw.githubusercontent.com/kubernetes/kubernetes/${RELEASE}/build/debs/kubelet.service" | sed "s:/usr/bin:/opt/bin:g" > /etc/systemd/system/kubelet.service
mkdir -p /etc/systemd/system/kubelet.service.d
curl -sSL "https://raw.githubusercontent.com/kubernetes/kubernetes/${RELEASE}/build/debs/10-kubeadm.conf" | sed "s:/usr/bin:/opt/bin:g" > /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
```

Enable and start `kubelet`:

```bash
systemctl enable --now kubelet
```
{{% /tab %}}
{{< /tabs >}}


The kubelet is now restarting every few seconds, as it waits in a crashloop for
kubeadm to tell it what to do.

## Configure cgroup driver used by kubelet on Master Node

When using Docker, kubeadm will automatically detect the cgroup driver for the kubelet
and set it in the `/var/lib/kubelet/kubeadm-flags.env` file during runtime.

If you are using a different CRI, you have to modify the file
`/etc/default/kubelet` with your `cgroup-driver` value, like so:

```bash
KUBELET_EXTRA_ARGS=--cgroup-driver=<value>
```

This file will be used by `kubeadm init` and `kubeadm join` to source extra
user defined arguments for the kubelet.

Please mind, that you **only** have to do that if the cgroup driver of your CRI
is not `cgroupfs`, because that is the default value in the kubelet already.

kubelet 재시작 요구됨:

```bash
systemctl daemon-reload
systemctl restart kubelet
```

## 문제해결

kubeadm으로 어려움을 겪고 있다면, [문제해결 문서](/docs/setup/independent/troubleshooting-kubeadm/) 를 통해 조언을 받아보라.

{{% capture whatsnext %}}

* [Using kubeadm to Create a Cluster](/docs/setup/independent/create-cluster-kubeadm/)

{{% /capture %}}
