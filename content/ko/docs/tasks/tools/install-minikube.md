---
title: Minikube 설치
content_template: templates/task
weight: 20
card:
  name: tasks
  weight: 10
---

{{% capture overview %}}

이 페이지는 단일 노드 쿠버네티스 클러스터를 노트북의 가상 머신에서 구동하는 도구인 [Minikube](/docs/tutorials/hello-minikube)의 설치 방법을 설명한다.

{{% /capture %}}

{{% capture prerequisites %}}

컴퓨터의 바이오스(BIOS)에서 VT-x 또는 AMD-v 가상화는 필수적으로 활성화되어 있어야 한다.

{{< tabs name="minikube_before_you_begin" >}}
{{% tab name="리눅스" %}}
리눅스에서 가상화 지원 여부를 확인하려면, 아래의 명령을 실행하고 출력이 비어있지 않은지 확인한다.
```
egrep --color 'vmx|svm' /proc/cpuinfo
```
{{% /tab %}}
{{% tab name="맥OS" %}}
맥OS에서 가상화 지원 여부를 확인하려면, 아래 명령어를 터미널에서 실행한다.
```
sysctl -a | grep machdep.cpu.features
```
만약 출력 중에 `VMX`를 볼 수 있다면 VT-x 기능을 운영체제에서 지원한다.
{{% /tab %}}
{{% tab name="윈도우" %}}
윈도우 8 이후 버전에서 가상화 지원 여부를 확인하려면, 다음 명령어를 윈도우 터미널이나 명령 프롬프트에서 실행한다.
```
systeminfo
```
아래와 같은 내용을 볼 수 있다면, 윈도우에서 가상화를 지원한다.
```
Hyper-V Requirements:     VM Monitor Mode Extensions: Yes
                          Virtualization Enabled In Firmware: Yes
                          Second Level Address Translation: Yes
                          Data Execution Prevention Available: Yes
```

{{% /tab %}}
{{< /tabs >}}

{{% /capture %}}

{{% capture steps %}}

## 하이퍼바이저(hypervisor) 설치 {#install-a-hypervisor}

하이퍼바이저를 설치하지 않다면, 운영체제에 적합한 하이퍼바이저를 지금 설치한다.

운영체제 | 지원하는 하이퍼바이저
:----------------|:---------------------
맥OS | [VirtualBox](https://www.virtualbox.org/wiki/Downloads), [VMware Fusion](https://www.vmware.com/products/fusion), [HyperKit](https://github.com/moby/hyperkit)
리눅스 | [VirtualBox](https://www.virtualbox.org/wiki/Downloads), [KVM](http://www.linux-kvm.org/)
윈도우 | [VirtualBox](https://www.virtualbox.org/wiki/Downloads), [Hyper-V](https://msdn.microsoft.com/en-us/virtualization/hyperv_on_windows/quick_start/walkthrough_install)

{{< note >}}
Minikube는 쿠버네티스 컴포넌트를 VM이 아닌 호스트에서도 동작하도록 `--vm-driver=none` 옵션도 지원한다. 이 드라이버를 사용하기 위해서는 하이퍼바이저가 아닌 Docker와 리눅스 환경을 필요로 한다.
{{< /note >}}

## kubectl 설치

* [kubectl 설치하고 설정하기](/docs/tasks/tools/install-kubectl/) 지침에 따라 kubectl을 설치한다.

## Minikube 설치 {#install-minikube}

### 맥OS {#macos}

맥OS에 Minikube를 설치하는 가장 쉬운 방법은 [Homebrew](https://brew.sh)을 사용하는 것이다.

```shell
brew cask install minikube
```

정적 바이너리를 내려받아서 맥OS에 설치할 수도 있다.

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64 \
  && chmod +x minikube
```

Minikube 실행 파일을 경로에 추가하는 쉬운 방법은 다음과 같다.

```shell
sudo mv minikube /usr/local/bin
```

### 리눅스 {#linux}

{{< note >}}
이 문서는 Minikube를 리눅스에 정적 바이너리를 사용해서 설치하는 방법을 설명한다. 리눅스에 설치에 다른 방법은 공식 Minikube GitHub 저장소의 [다른 방법으로 설치하기](https://github.com/kubernetes/minikube#other-ways-to-install)를 참조한다.
{{< /note >}}

정적 바이너리를 내려받아서 리눅스에 Minikube를 설치할 수 있다.

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 \
  && chmod +x minikube
```

Minikube 실행 파일을 경로에 추가하는 쉬운 방법은 다음과 같다.

```shell
sudo cp minikube /usr/local/bin && rm minikube
```

### 윈도우 {#windows}

{{< note >}}
Minikube를 윈도우에서 실행하려면, 먼저 [VirtualBox](https://www.virtualbox.org/) 또는 [Hyper-V](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v)를 설치해야 한다. Hyper-V는 Windows 10 엔터프라이즈, Windows 10 프로페셔널, Windows 10 에듀케이션 세 버전의 Windows 10에서 동작한다. Minikube 공식 GitHub 레포지토리에 추가적인 [설치 방법](https://github.com/kubernetes/minikube/#installation)을 확인한다.
{{< /note >}}

윈도우에서 Minikube를 설치하는 가장 쉬운 방법은 [Chocolatey](https://chocolatey.org/)를 사용하는 것이다. (관리자 권한으로 실행)

```shell
choco install minikube kubernetes-cli
```

Minikube 설치를 마친 후, 현재 CLI 세션을 닫고 재시작한다. Minikube가 실행 경로에 자동으로 추가되어 있어야 한다.

#### 윈도우 수동 설치 {#windows-manual-installation}

윈도우에서 Minikube를 수동으로 설치하려면, [`minikube-windows-amd64`](https://github.com/kubernetes/minikube/releases/latest)를 내려받아서 이름을 `minikube.exe`로 변경하고, 실행 경로에 추가한다.

#### 윈도우 인스톨러 {#windows-installer}

[Windows 인스톨러](https://docs.microsoft.com/en-us/windows/desktop/msi/windows-installer-portal)으로 윈도우에서 Minikube를 수동으로 설치하려면 [`minikube-installer.exe`](https://github.com/kubernetes/minikube/releases/latest)를 내려받아서 인스톨러를 실행한다.

{{% /capture %}}

{{% capture whatsnext %}}

* [Minikube로 로컬에서 쿠버네티스 실행하기](/docs/setup/minikube/)

{{% /capture %}}

## 새롭게 시작하기 위해 모두 정리하기

이전에 minikube를 설치했었다면, 다음을 실행한다.
```shell
minikube start
```

그리고 이 명령은 에러를 보여준다.
```shell
machine does not exist
```

구성 파일을 삭제해야 한다.
```shell
rm -rf ~/.minikube
```
