---
title: Về cgroup v2
content_type: concept
weight: 50
---

<!-- overview -->

Trên Linux, {{< glossary_tooltip text="control groups" term_id="cgroup" >}}
giới hạn các tài nguyên được phân bổ cho các tiến trình.

{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} và
container runtime bên dưới cần giao tiếp với cgroups để thực thi
[quản lý tài nguyên cho pod và container](/docs/concepts/configuration/manage-resources-containers/) bao gồm
các yêu cầu và giới hạn cpu/memory cho các workload được container hóa.

Có hai phiên bản cgroups trong Linux: cgroup v1 và cgroup v2. cgroup v2 là
thế hệ mới của API `cgroup`.

<!-- body -->

## cgroup v2 là gì? {#cgroup-v2}
{{< feature-state for_k8s_version="v1.25" state="stable" >}}

cgroup v2 là phiên bản tiếp theo của API Linux `cgroup`. cgroup v2 cung cấp một
hệ thống điều khiển thống nhất với khả năng quản lý tài nguyên
được cải tiến.

cgroup v2 mang lại một số cải tiến so với cgroup v1, chẳng hạn như:

- Thiết kế phân cấp thống nhất duy nhất trong API
- Ủy quyền cây con (sub-tree delegation) an toàn hơn cho các container
- Các tính năng mới hơn như [Pressure Stall Information](https://www.kernel.org/doc/html/latest/accounting/psi.html)
- Quản lý phân bổ tài nguyên và cách ly được cải tiến trên nhiều tài nguyên
  - Theo dõi thống nhất cho các loại phân bổ bộ nhớ khác nhau (network memory, kernel memory, v.v.)
  - Theo dõi các thay đổi tài nguyên không tức thì như page cache write backs

Một số tính năng Kubernetes sử dụng độc quyền cgroup v2 để quản lý tài nguyên
và cách ly được cải tiến. Ví dụ, tính năng
[MemoryQoS](/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2) cải thiện memory QoS
và dựa vào các nguyên tắc cơ bản của cgroup v2.

## Sử dụng cgroup v2 {#using-cgroupv2}

Cách được khuyến nghị để sử dụng cgroup v2 là sử dụng một bản phân phối Linux
kích hoạt và sử dụng cgroup v2 theo mặc định.

Để kiểm tra xem bản phân phối của bạn có sử dụng cgroup v2 hay không, hãy tham khảo [Xác định phiên bản cgroup trên các node Linux](#check-cgroup-version).

### Yêu cầu

cgroup v2 có các yêu cầu sau:

* Bản phân phối OS kích hoạt cgroup v2
* Phiên bản Linux Kernel là 5.8 hoặc mới hơn
* Container runtime hỗ trợ cgroup v2. Ví dụ:
  * [containerd](https://containerd.io/) v1.4 và mới hơn
  * [cri-o](https://cri-o.io/) v1.20 và mới hơn
* kubelet và container runtime được cấu hình để sử dụng [systemd cgroup driver](/docs/setup/production-environment/container-runtimes#systemd-cgroup-driver)

### Hỗ trợ cgroup v2 của bản phân phối Linux

Để xem danh sách các bản phân phối Linux sử dụng cgroup v2, hãy tham khảo [tài liệu cgroup v2](https://github.com/opencontainers/runc/blob/main/docs/cgroup-v2.md)

<!-- the list should be kept in sync with https://github.com/opencontainers/runc/blob/main/docs/cgroup-v2.md -->
* Container Optimized OS (từ M97)
* Ubuntu (từ 21.10, khuyến nghị 22.04+)
* Debian GNU/Linux (từ Debian 11 bullseye)
* Fedora (từ 31)
* Arch Linux (từ tháng 4 năm 2021)
* RHEL và các bản phân phối giống RHEL (từ 9)

Để kiểm tra xem bản phân phối của bạn có đang sử dụng cgroup v2 hay không, hãy tham khảo
tài liệu của bản phân phối hoặc làm theo hướng dẫn trong [Xác định phiên bản cgroup trên các node Linux](#check-cgroup-version).

Bạn cũng có thể kích hoạt cgroup v2 thủ công trên bản phân phối Linux của mình bằng cách sửa đổi
các tham số khởi động kernel cmdline. Nếu bản phân phối của bạn sử dụng GRUB,
`systemd.unified_cgroup_hierarchy=1` nên được thêm vào `GRUB_CMDLINE_LINUX`
trong `/etc/default/grub`, sau đó chạy `sudo update-grub`. Tuy nhiên,
cách tiếp cận được khuyến nghị là sử dụng một bản phân phối đã kích hoạt cgroup v2 theo
mặc định.

### Migrate sang cgroup v2 {#migrating-cgroupv2}

Để migrate sang cgroup v2, hãy đảm bảo rằng bạn đáp ứng các [yêu cầu](#requirements), sau đó nâng cấp
lên phiên bản kernel kích hoạt cgroup v2 theo mặc định.

kubelet tự động phát hiện rằng OS đang chạy trên cgroup v2 và
hoạt động tương ứng mà không cần cấu hình bổ sung.

Không nên có sự khác biệt đáng chú ý nào trong trải nghiệm người dùng khi
chuyển sang cgroup v2, trừ khi người dùng đang truy cập hệ thống file cgroup
trực tiếp, hoặc trên node hoặc từ bên trong các container.

cgroup v2 sử dụng API khác với cgroup v1, vì vậy nếu có bất kỳ
ứng dụng nào truy cập trực tiếp vào hệ thống file cgroup, chúng cần được
cập nhật lên các phiên bản mới hơn hỗ trợ cgroup v2. Ví dụ:

* Một số agent giám sát và bảo mật của bên thứ ba có thể phụ thuộc vào hệ thống file cgroup.
 Cập nhật các agent này lên các phiên bản hỗ trợ cgroup v2.
* Nếu bạn chạy [cAdvisor](https://github.com/google/cadvisor) như một
 DaemonSet độc lập để giám sát pod và container, hãy cập nhật nó lên v0.43.0 hoặc mới hơn.
* Nếu bạn triển khai các ứng dụng Java, ưu tiên sử dụng các phiên bản hỗ trợ đầy đủ cgroup v2:
    * [OpenJDK / HotSpot](https://bugs.openjdk.org/browse/JDK-8230305): jdk8u372, 11.0.16, 15 và mới hơn
    * [IBM Semeru Runtimes](https://www.ibm.com/support/pages/apar/IJ46681): 8.0.382.0, 11.0.20.0, 17.0.8.0, và mới hơn
    * [IBM Java](https://www.ibm.com/support/pages/apar/IJ46681): 8.0.8.6 và mới hơn
* Nếu bạn đang sử dụng package [uber-go/automaxprocs](https://github.com/uber-go/automaxprocs), hãy đảm bảo
  phiên bản bạn sử dụng là v1.5.1 hoặc cao hơn.

## Xác định phiên bản cgroup trên các node Linux {#check-cgroup-version}

Phiên bản cgroup phụ thuộc vào bản phân phối Linux được sử dụng và
phiên bản cgroup mặc định được cấu hình trên OS. Để kiểm tra phiên bản cgroup nào mà
bản phân phối của bạn sử dụng, hãy chạy lệnh `stat -fc %T /sys/fs/cgroup/` trên
node:

```shell
stat -fc %T /sys/fs/cgroup/
```

Đối với cgroup v2, đầu ra là `cgroup2fs`.

Đối với cgroup v1, đầu ra là `tmpfs.`

## {{% heading "whatsnext" %}}

- Tìm hiểu thêm về [cgroups](https://man7.org/linux/man-pages/man7/cgroups.7.html)
- Tìm hiểu thêm về [container runtime](/docs/concepts/architecture/cri)
- Tìm hiểu thêm về [cgroup drivers](/docs/setup/production-environment/container-runtimes#cgroup-drivers)
