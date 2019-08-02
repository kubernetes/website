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

{{< tabs name="minikube_before_you_begin" >}}
{{% tab name="리눅스" %}}
리눅스에서 가상화 지원 여부를 확인하려면, 아래의 명령을 실행하고 출력이 비어있지 않은지 확인한다.
```shell
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

다음의 출력을 확인할 수 있다면, 이미 하이퍼바이저가 설치되어 있는 것으로 다음 단계를 건너 뛸 수 있다.
```
Hyper-V Requirements:     A hypervisor has been detected. Features required for Hyper-V will not be displayed.
```


{{% /tab %}}
{{< /tabs >}}

{{% /capture %}}

{{% capture steps %}}

# minikube 설치하기

{{< tabs name="tab_with_md" >}}
{{% tab name="리눅스" %}}

### kubectl 설치

kubectl이 설치되었는지 확인한다. kubectl은 [kubectl 설치하고 설정하기](/docs/tasks/tools/install-kubectl/#install-kubectl-on-linux)의 요령을 따라서 설치할 수 있다.

## 하이퍼바이저(hypervisor) 설치

하이퍼바이저를 설치하지 않다면, 운영체제에 적합한 하이퍼바이저를 지금 설치한다.

• [KVM](https://www.linux-kvm.org/), 또한 QEMU를 사용한다

• [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

{{< note >}}
Minikube는 쿠버네티스 컴포넌트를 VM이 아닌 호스트에서도 동작하도록 `--vm-driver=none` 옵션도 지원한다. 이 드라이버를 사용하기 위해서는 하이퍼바이저가 아닌 [도커](https://www.docker.com/products/docker-desktop)와 리눅스 환경을 필요로 한다.
{{< /note >}}

### 패키지를 이용하여 Minikube 설치

Minikube를 위한 *실험적인* 패키지가 있다.
리눅스 (AMD64) 패키지는 GitHub의 Minikube의 [릴리스](https://github.com/kubernetes/minikube/releases)에서 찾을 수 있다.

적절한 패키지를 설치하기 위해 리눅스 배포판의 패키지 도구를 사용한다.

### Minikube를 직접 다운로드하여 설치

패키지를 통해 설치하지 못하였다면,
바이너리 자체를 다운로드 받고 사용할 수 있다.

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 \
  && chmod +x minikube
```

Minikube 실행 파일을 사용자 실행 경로에 추가하는 가장 쉬운 방법은 다음과 같다.

```shell
sudo install minikube /usr/local/bin
```

{{% /tab %}}
{{% tab name="맥OS" %}}
### kubectl 설치

kubectl이 설치되었는지 확인한다. kubectl은 [kubectl 설치하고 설정하기](/docs/tasks/tools/install-kubectl/#install-kubectl-on-macos)의 요령을 따라서 설치할 수 있다.

### 하이퍼바이저(hypervisor) 설치

하이퍼바이저를 설치하지 않았다면, 다음 중 하나를 지금 설치한다.

• [HyperKit](https://github.com/moby/hyperkit)

• [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

• [VMware Fusion](https://www.vmware.com/products/fusion)

### Minikube 설치
가장 쉽게 맥OS에 Minikube를 설치하는 방법은 [Homebrew](https://brew.sh)를 이용하는 것이다.

```shell
brew cask install minikube
```

실행 바이너리를 다운로드 받아서 맥OS에 설치할 수도 있다.

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64 \
  && chmod +x minikube
```

Minikube 실행 파일을 사용자 실행 경로에 추가하는 가장 쉬운 방법은 다음과 같다.

```shell
sudo mv minikube /usr/local/bin
```

{{% /tab %}}
{{% tab name="Windows" %}}
### kubectl 설치하기

kubectl이 설치되었는지 확인한다. kubectl은 [kubectl 설치하고 설정하기](/docs/tasks/tools/install-kubectl/#install-kubectl-on-windows)의 요령을 따라서 설치할 수 있다.

### 하이퍼바이저(hypervisor) 설치하기

하이퍼바이저가 설치 안 되어 있다면 아래중 하나를 지금 설치한다.

• [Hyper-V](https://msdn.microsoft.com/en-us/virtualization/hyperv_on_windows/quick_start/walkthrough_install)

• [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

{{< note >}}
Hyper-V는 다음 세 버전의 윈도우 10에서 실행할 수 있다. Windows 10 Enterprise, Windows 10 Professional, Windows 10 Education.
{{< /note >}}

### Chocolatey를 이용한 Minikube 설치

윈도우에서 Minikube를 설치하는 가장 쉬운 방법은 [Chocolatey](https://chocolatey.org/)를 사용하는 것이다(관리자 권한으로 실행).

```shell
choco install minikube kubernetes-cli
```

Minikube 설치를 마친 후, 현재 CLI 세션을 닫고 재시작한다. Minikube 실행 파일의 경로는 실행 경로(path)에 자동으로 추가된다.

### 인스톨러 실행파일을 통한 Minikube 설치

윈도우에서 수동으로 [Windows 인스톨러](https://docs.microsoft.com/en-us/windows/desktop/msi/windows-installer-portal)로 설치하려면, [`minikube-installer.exe`](https://github.com/kubernetes/minikube/releases/latest/minikube-installer.exe)를 다운로드 받고, 이 인스톨러를 실행한다.

### 직접 다운로드하여 Minikube 설치

윈도우에서 Minikube를 수동으로 설치하려면, [`minikube-windows-amd64`](https://github.com/kubernetes/minikube/releases/latest)를 다운로드 받아서, 파일 이름을 `minikube.exe`로 변경하고, 실행 경로에 추가한다.

{{% /tab %}}
{{< /tabs >}}


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
minikube delete
```
