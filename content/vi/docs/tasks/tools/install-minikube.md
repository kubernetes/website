---
title: Cài đặt Minikube
content_type: task
weight: 20
card:
  name: tasks
  weight: 10
---

<!-- overview -->

Tài liệu này sẽ hướng dẫn các bạn cách cài đặt [Minikube](/docs/tutorials/hello-minikube), một công cụ chạy một Kubernetes cluster chỉ gồm một node trong một máy ảo (VM) trên máy tính của bạn.



## {{% heading "prerequisites" %}}


{{< tabs name="minikube_before_you_begin" >}}
{{% tab name="Linux" %}}
Để kiểm tra xem việc ảo hóa (virtualization) có được hỗ trợ trên Linux không, chạy lệnh sau và chắc chắn rằng kết quả trả về là non-empty:
```
grep -E --color 'vmx|svm' /proc/cpuinfo
```
{{% /tab %}}

{{% tab name="macOS" %}}
Để kiểm tra xem việc ảo hóa (virtualization) có được hỗ trợ trên macOS không, chạy lệnh sau trên terminal:
```
sysctl -a | grep -E --color 'machdep.cpu.features|VMX' 
```
Nếu bạn thấy `VMX` ở kết quả trả về (có màu), thì VT-x đã được hỗ trợ.
{{% /tab %}}

{{% tab name="Windows" %}}
Để kiểm tra xem việc ảo hóa (virtualization) có được hỗ trợ trên Windows 8 và các phiên bản Windows cao hơn không, chạy lệnh sau trên terminal của Windows hoặc command promt.
```
systeminfo
```
Nếu bạn thấy những thông tin sau, ảo hóa được hỗ trợ trên Windows.
```
Hyper-V Requirements:     VM Monitor Mode Extensions: Yes
                          Virtualization Enabled In Firmware: Yes
                          Second Level Address Translation: Yes
                          Data Execution Prevention Available: Yes
```

Nếu bạn thấy thông tin sau, thì hệ thống đã được cài đặt Hypervisor và bạn có thể bỏ qua bước tiếp theo.
```
Hyper-V Requirements:     A hypervisor has been detected. Features required for Hyper-V will not be displayed.
```


{{% /tab %}}
{{< /tabs >}}



<!-- steps -->

## Cài đặt minikube

{{< tabs name="tab_with_md" >}}
{{% tab name="Linux" %}}

### Cài đặt kubectl

Đảm bảo bạn đã cài đặt kubectl. Bạn có thể cài đặt kubectl theo hướng dẫn sau tại [Install and Set Up kubectl](/docs/tasks/tools/install-kubectl/#install-kubectl-on-linux).

### Cài đặt Hypervisor

Nếu bạn chưa cài đặt Hypervisor, hãy cài đặt một trong những phần mềm sau đây:

• [KVM](https://www.linux-kvm.org/), sử dụng QEMU

• [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

{{< note >}}
Minikube cũng hỗ trợ tùy chọn `--vm-driver=none` để chạy các thành phần của Kubernetes ngay trên máy chủ chứ không phải trong một VM. Sử dụng driver này yêu cầu [Docker](https://www.docker.com/products/docker-desktop) và môi trường Linux chứ không phải một Hypervisor. Bạn nên sử dụng cài đặt apt của docker từ [Docker](https://www.docker.com/products/docker-desktop) khi sử dụng non driver. Cài đặt snap của docker không hoạt động với minikube.
{{< /note >}}

### Cài đặt Minikube sử dụng package

Có các gói *thử nghiệm* cho Minikube có sẵn; bạn có thể tìm thấy các gói Linux (AMD64) từ trang [phát hành](https://github.com/kubernetes/minikube/releases) của Minikube trên Github.

Sử dụng các package tool của bản phân phối Linux của bạn để cài đặt package phù hợp.

### Cài đặt Minikube thông qua tải xuống trực tiếp

Nếu bạn không cài đặt qua package, bạn có thể tải xuống bản binary và sử dụng.

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 \
  && chmod +x minikube
```

Đây là một cách dễ dàng để thêm Minikube vào biến môi trường path của bạn:

```shell
sudo mkdir -p /usr/local/bin/
sudo install minikube /usr/local/bin/
```

### Cài đặt Minikube sử dụng Homebrew

Một lựa chọn khác là bạn có thể cài đặt Minikube bằng cách sử dụng Linux [Homebrew](https://docs.brew.sh/Homebrew-on-Linux):

```shell
brew install minikube
```

{{% /tab %}}
{{% tab name="macOS" %}}
### Cài đặt kubectl

Đảm bảo bạn đã cài đặt kubectl. Bạn có thể cài đặt kubectl theo hướng dẫn sau tại [Install and Set Up kubectl](/docs/tasks/tools/install-kubectl/#install-kubectl-on-macos).

### Cài đặt Hypervisor

Nếu bạn chưa cài đặt Hypervisor, hãy cài đặt một trong những phần mềm sau đây:

• [HyperKit](https://github.com/moby/hyperkit)

• [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

• [VMware Fusion](https://www.vmware.com/products/fusion)

### Cài đặt Minikube
Cách đơn giản nhất để cài đặt Minikube trên macOS là sử dụng [Homebrew](https://brew.sh):

```shell
brew install minikube
```

Bạn cũng có thể cài đặt trên macOS bằng việc tải xuống bản binary:

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64 \
  && chmod +x minikube
```

Đây là một cách dễ dàng để thêm Minikube vào biến môi trường path của bạn:

```shell
sudo mv minikube /usr/local/bin
```

{{% /tab %}}
{{% tab name="Windows" %}}
### Cài đặt kubectl

Đảm bảo bạn đã cài đặt kubectl. Bạn có thể cài đặt kubectl theo hướng dẫn sau tại [Install and Set Up kubectl](/docs/tasks/tools/install-kubectl/#install-kubectl-on-windows).

### Cài đặt Hypervisor

Nếu bạn chưa cài đặt Hypervisor, hãy cài đặt một trong những phần mềm sau đây:

• [Hyper-V](https://msdn.microsoft.com/en-us/virtualization/hyperv_on_windows/quick_start/walkthrough_install)

• [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

{{< note >}}
Hyper-V có thể chạy trên 3 phiên bản khác nhau của Windows 10: Windows 10 Enterprise, Windows 10 Professional, và Windows 10 Education.
{{< /note >}}

### Cài đặt Minikube sử dụng Chocolatey

Cách đơn giản nhất để cài đặt Minikube trên Windows là sử dụng [Chocolatey](https://chocolatey.org/) (chạy với quyền admin):

```shell
choco install minikube
```

Sau khi Minikube hoàn tất việc cài đặt, hãy đóng CLI hiện tại và khởi động lại. Minikube sẽ được tự động thêm vào biến môi trường path của bạn.

### Cài đặt Minikube sử dụng gói cài đặt thực thi

Để cài đặt Minikube thủ công trên Windows sử dụng [Windows Installer](https://docs.microsoft.com/en-us/windows/desktop/msi/windows-installer-portal), tải về [`minikube-installer.exe`](https://github.com/kubernetes/minikube/releases/latest/download/minikube-installer.exe) và chạy bản cài đặt đó.

### Cài đặt Minikube thông qua tải về trực tiếp

Để cài đặt Minikube thủ công trên Windows, tải về [`minikube-windows-amd64`](https://github.com/kubernetes/minikube/releases/latest), đổi tên nó thành `minikube.exe`, và thêm nó vào biến môi trường path.

{{% /tab %}}
{{< /tabs >}}




## Dọn dẹp local state {#cleanup-local-state}

Nếu bạn đã cài Minikube trước đó, và chạy:
```shell
minikube start
```

và tiếp đó `minikube start` trả về lỗi:
```
machine does not exist
```

thì tiếp theo bạn cần xóa bỏ local state của minikube:
```shell
minikube delete
```

## {{% heading "whatsnext" %}}


* [Chạy Kubernetes trên local thông qua Minikube](/docs/setup/learning-environment/minikube/)

