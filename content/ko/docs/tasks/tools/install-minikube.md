---
title: Minikube 설치
content_template: templates/task
weight: 20
---

{{% capture overview %}}

이 페이지는 Minikube 설치 방법을 보여준다.

{{% /capture %}}

{{% capture prerequisites %}}

컴퓨터의 바이오스에서 VT-x 또는 AMD-v 가상화가 필수적으로 활성화되어 있어야 한다.

{{% /capture %}}

{{% capture steps %}}

## 하이퍼바이저 설치

하이퍼바이저가 설치되어 있지 않다면, 운영체제에 적합한 하이퍼바이저를 지금 설치한다.

* macOS: [VirtualBox](https://www.virtualbox.org/wiki/Downloads), 
[VMware Fusion](https://www.vmware.com/products/fusion), 또는 
[HyperKit](https://github.com/moby/hyperkit).

* Linux: [VirtualBox](https://www.virtualbox.org/wiki/Downloads) 또는 
[KVM](http://www.linux-kvm.org/).

  {{< note >}}
  Minikube는 쿠버네티스 컴포넌트들이 VM 안에서가 아닌 호스트에서도 동작하도록 `-\-vm-driver=none` 옵션도 지원한다. 이 드라이버를 사용하기 위해서는 하이퍼바이저가 아닌 Docker와 linux 환경을 필요로한다.
  {{< /note >}}

* Windows: [VirtualBox](https://www.virtualbox.org/wiki/Downloads) 또는 
[Hyper-V](https://msdn.microsoft.com/en-us/virtualization/hyperv_on_windows/quick_start/walkthrough_install).

## kubectl 설치

* [kubectl 설치 및 설정](/docs/tasks/tools/install-kubectl/)의 지침에 따라 kubectl을 설치한다.

## Minikube 설치

* [최신 릴리스](https://github.com/kubernetes/minikube/releases)의 지침에 따라 Minikube를 설치한다.

{{% /capture %}}

{{% capture whatsnext %}}

* [Minikube를 통해서 로컬에서 쿠버네티스 운영하기](/docs/getting-started-guides/minikube/)

{{% /capture %}}


