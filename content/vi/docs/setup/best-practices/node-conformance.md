---
reviewers:
- Random-Liu
title: Xác thực thiết lập node
weight: 30
---

## Kiểm thử tuân thủ Node

*Kiểm thử tuân thủ Node* là một framework kiểm thử dạng container cung cấp
xác minh hệ thống và kiểm thử chức năng cho một node. Bài kiểm thử xác thực
liệu node có đáp ứng các yêu cầu tối thiểu cho Kubernetes hay không; một node
vượt qua bài kiểm thử thì đủ điều kiện tham gia một cụm Kubernetes.

## Điều kiện tiên quyết đối với Node

Để chạy kiểm thử tuân thủ Node, một node phải đáp ứng các điều kiện tiên quyết
giống như một node Kubernetes tiêu chuẩn. Tối thiểu, node cần cài đặt các
daemon sau:

* Các container runtime tương thích CRI như Docker, containerd và CRI-O
* kubelet

## Chạy kiểm thử tuân thủ Node

Để chạy kiểm thử tuân thủ Node, thực hiện các bước sau:

1. Xác định giá trị của tùy chọn `--kubeconfig` cho kubelet; ví dụ:
   `--kubeconfig=/var/lib/kubelet/config.yaml`.
    Vì framework kiểm thử khởi động một control plane cục bộ để kiểm thử kubelet,
    hãy dùng `http://localhost:8080` làm URL của API server.
    Có một số tham số dòng lệnh kubelet khác mà bạn có thể muốn dùng:
  
   * `--cloud-provider`: Nếu bạn đang dùng `--cloud-provider=gce`, bạn nên
     loại bỏ cờ này để chạy kiểm thử.

1. Chạy kiểm thử tuân thủ Node bằng lệnh:

   ```shell
   # $CONFIG_DIR is the pod manifest path of your kubelet.
   # $LOG_DIR is the test output path.
   sudo docker run -it --rm --privileged --net=host \
     -v /:/rootfs -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
     registry.k8s.io/node-test:0.2
   ```

## Chạy kiểm thử tuân thủ Node cho các kiến trúc khác

Kubernetes cũng cung cấp các Docker image kiểm thử tuân thủ Node cho các
kiến trúc khác:

|  Kiến trúc  |       Image       |
|--------|:-----------------:|
|  amd64 |  node-test-amd64  |
|  arm   |   node-test-arm   |
| arm64  |  node-test-arm64  |

## Chạy kiểm thử được chọn

Để chạy các kiểm thử cụ thể, ghi đè biến môi trường `FOCUS` bằng biểu thức
chính quy của các kiểm thử bạn muốn chạy.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e FOCUS=MirrorPod \ # Only run MirrorPod test
  registry.k8s.io/node-test:0.2
```

Để bỏ qua các kiểm thử cụ thể, ghi đè biến môi trường `SKIP` bằng biểu thức
chính quy của các kiểm thử bạn muốn bỏ qua.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e SKIP=MirrorPod \ # Run all conformance tests but skip MirrorPod test
  registry.k8s.io/node-test:0.2
```

Kiểm thử tuân thủ Node là phiên bản dạng container của
[kiểm thử e2e node](https://github.com/kubernetes/community/blob/main/contributors/devel/sig-node/e2e-node-tests.md).
Theo mặc định, nó chạy tất cả các kiểm thử tuân thủ.

Về mặt lý thuyết, bạn có thể chạy bất kỳ kiểm thử e2e node nào nếu bạn cấu
hình container và mount các volume cần thiết đúng cách. Nhưng **đặc biệt khuyến nghị chỉ nên chạy kiểm thử tuân thủ**,
vì cần cấu hình phức tạp hơn nhiều để chạy kiểm thử không tuân thủ.

## Lưu ý

* Bài kiểm thử để lại một số Docker image trên node, bao gồm image kiểm thử
  tuân thủ Node và image của các container được dùng trong kiểm thử
  chức năng.
* Bài kiểm thử để lại các container đã chết trên node. Những container này được tạo
  trong quá trình kiểm thử chức năng.