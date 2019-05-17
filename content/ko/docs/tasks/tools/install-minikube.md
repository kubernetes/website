---
title: Minikube 설치
content_template: templates/task
weight: 20
card:
  name: tasks
  weight: 10
---

{{% capture overview %}}

이 페이지는 Minikube 설치 방법을 보여준다.

{{% /capture %}}

{{% capture prerequisites %}}

컴퓨터의 바이오스에서 VT-x 또는 AMD-v 가상화가 필수적으로 활성화되어 있어야 한다. 이를 확인하려면 리눅스 상에서 아래의 명령을 실행하고, 
출력이 비어있지 않은지 확인한다.
```shell	
egrep --color 'vmx|svm' /proc/cpuinfo	
```

{{% /capture %}}

{{% capture steps %}}

## 하이퍼바이저 설치

하이퍼바이저가 설치되어 있지 않다면, 운영체제에 적합한 하이퍼바이저를 지금 설치한다.

Operating system | Supported hypervisors
:----------------|:---------------------
macOS | [VirtualBox](https://www.virtualbox.org/wiki/Downloads), [VMware Fusion](https://www.vmware.com/products/fusion), [HyperKit](https://github.com/moby/hyperkit)
Linux | [VirtualBox](https://www.virtualbox.org/wiki/Downloads), [KVM](http://www.linux-kvm.org/)
Windows | [VirtualBox](https://www.virtualbox.org/wiki/Downloads), [Hyper-V](https://msdn.microsoft.com/en-us/virtualization/hyperv_on_windows/quick_start/walkthrough_install)

{{< note >}}
Minikube는 쿠버네티스 컴포넌트들이 VM 안에서가 아닌 호스트에서도 동작하도록 `--vm-driver=none` 옵션도 지원한다. 이 드라이버를 사용하기 위해서는 하이퍼바이저가 아닌 Docker와 linux 환경을 필요로 한다.
{{< /note >}}

## kubectl 설치

* [Install and Set Up kubectl](/docs/tasks/tools/install-kubectl/) 지침에 따라 kubectl을 설치한다.

## Minikube 설치

### macOS

macOS에 Minikube를 설치하는 가장 쉬운 방법은 [Homebrew](https://brew.sh)을 사용하는 것이다.

```shell
brew cask install minikube
```

정적 바이너리를 내려받아서 macOS에 설치할 수도 있다.

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64 \
  && chmod +x minikube
```

Minikube 실행 파일을 경로에 추가하는 쉬운 방법은 다음과 같다.

```shell
sudo mv minikube /usr/local/bin
```

### Linux

{{< note >}}
이 문서는 Minikube를 리눅스에 정적 바이너리를 사용해서 설치하는 방법을 설명한다. 리눅스에 설치하는 다른 방법은, 공식 Minikube GitHub 저장소의 [Other Ways to Install](https://github.com/kubernetes/minikube#other-ways-to-install)를 참조한다.
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

### Windows
 or [Hyper-V](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v). Hyper-V can be run on three versions of Windows 10: Windows 10 Enterprise, Windows 10 Professional, and Windows 10 Education. See the official Minikube GitHub repository for additional [installation information](https://github.com/kubernetes/minikube/#installation).

{{< note >}}
Minikube를 Windows에서 실행하려면, 우선 첫번째로 [VirtualBox](https://www.virtualbox.org/) 또는 [Hyper-V](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v)를 설치할 필요가 있다. Hyper-V는 Windows 10 Enterprise, Windows 10 Professional 과 Windows 10 Education 세 버전의 Windows 10에서 동작한다.  
{{< /note >}}

Windows에서 Minikube를 설치하는 가장 쉬운 방법은 [Chocolatey](https://chocolatey.org/)를 사용하는 것이다. (관리자 권한으로 실행)

```shell
choco install minikube kubernetes-cli
```

Minikube 설치를 마친 뒤에, 현재 CLI 세션을 닫고 재시작한다. Minikube가 경로에 자동으로 추가되어 있어야 정상이다.

#### Windows 수동 설치

Windows에 Minikube를 수동으로 설치하려면, [`minikube-windows-amd64`](https://github.com/kubernetes/minikube/releases/latest)를 내려받아서, 이름을 `minikube.exe`로 변경하고, 경로에 추가한다.

#### Windows 인스톨러

[Windows Installer](https://docs.microsoft.com/en-us/windows/desktop/msi/windows-installer-portal)를 사용해서 Windows에 Minikube를 수동으로 설치하려면 [`minikube-installer.exe`](https://github.com/kubernetes/minikube/releases/latest)를 내려받아서 인스톨러를 실행한다.

{{% /capture %}}

{{% capture whatsnext %}}

* [Minikube를 통해서 로컬에서 쿠버네티스 운영하기](/docs/getting-started-guides/minikube/)

{{% /capture %}}

## 새롭게 시작하기 위해 모두 정리하기

이전에 minikube를 설치한 적이 있다면, 실행한다.
```shell
minikube start
```

이 커맨드는 에러를 리턴한다.
```shell
machine does not exist
```

구성 파일을 삭제해야 한다.
```shell
rm -rf ~/.minikube
```
