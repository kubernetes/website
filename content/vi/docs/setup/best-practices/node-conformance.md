---
title: Xác thực cấu hình node
weight: 30
---

## Kiểm tra tính tương thích của Node

*Kiểm tra tính tương thích của Node* là một framework kiểm tra được đóng gói trong container, cung cấp khả năng xác thực hệ thống và kiểm tra chức năng cho node. Bài kiểm tra này xác nhận xem node có đáp ứng các yêu cầu tối thiểu của Kubernetes hay không; một node vượt qua bài kiểm tra này sẽ đủ điều kiện để tham gia vào một cluster Kubernetes.

## Điều kiện tiên quyết của Node

Để chạy kiểm tra tính tương thích của node, một node phải đáp ứng các điều kiện tiên quyết giống như một node Kubernetes tiêu chuẩn. Tối thiểu, node cần có các daemon sau được cài đặt:

* Container runtime tương thích với CRI như Docker, containerd và CRI-O
* kubelet

## Chạy kiểm tra tính tương thích của Node

Để chạy kiểm tra tính tương thích của node, thực hiện các bước sau:

1. Xác định giá trị của tùy chọn `--kubeconfig` cho kubelet; ví dụ:
   `--kubeconfig=/var/lib/kubelet/config.yaml`.
    Do framework kiểm tra sẽ khởi động một control plane cục bộ để kiểm tra kubelet,
    hãy sử dụng `http://localhost:8080` làm URL của API server.
    Có một số tham số dòng lệnh khác của kubelet mà bạn có thể muốn sử dụng:
  
   * `--cloud-provider`: Nếu bạn đang sử dụng `--cloud-provider=gce`, bạn cần
     gỡ bỏ cờ này để chạy bài kiểm tra.

1. Chạy kiểm tra tính tương thích của node với lệnh:

   ```shell
   # $CONFIG_DIR là đường dẫn manifest của pod cho kubelet của bạn.
   # $LOG_DIR là đường dẫn lưu kết quả kiểm tra.
   sudo docker run -it --rm --privileged --net=host \
     -v /:/rootfs -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
     registry.k8s.io/node-test:0.2
   ```

## Chạy kiểm tra tính tương thích của Node cho các kiến trúc khác

Kubernetes cũng cung cấp các image docker để kiểm tra tính tương thích của node cho các kiến trúc khác:

|  Kiến trúc  |       Image       |
|-------------|:-----------------:|
|  amd64      |  node-test-amd64  |
|  arm        |   node-test-arm   |
| arm64       |  node-test-arm64  |

## Chạy bài kiểm tra được chọn

Để chạy các bài kiểm tra cụ thể, hãy ghi đè biến môi trường `FOCUS` với biểu thức chính quy của các bài kiểm tra bạn muốn chạy.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e FOCUS=MirrorPod \ # Chỉ chạy bài kiểm tra MirrorPod
  registry.k8s.io/node-test:0.2
```

Để bỏ qua các bài kiểm tra cụ thể, hãy ghi đè biến môi trường `SKIP` với biểu thức chính quy của các bài kiểm tra bạn muốn bỏ qua.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e SKIP=MirrorPod \ # Chạy tất cả các bài kiểm tra tương thích nhưng bỏ qua bài kiểm tra MirrorPod
  registry.k8s.io/node-test:0.2
```

Kiểm tra tính tương thích của node là phiên bản được đóng gói trong container của [bài kiểm tra node e2e](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/e2e-node-tests.md). Mặc định, nó sẽ chạy tất cả các bài kiểm tra tương thích.

Về mặt lý thuyết, bạn có thể chạy bất kỳ bài kiểm tra node e2e nào nếu bạn cấu hình container và gắn kết các volume cần thiết một cách chính xác. Tuy nhiên, **chúng tôi đặc biệt khuyến nghị chỉ chạy bài kiểm tra tương thích**, vì việc chạy các bài kiểm tra không tương thích đòi hỏi cấu hình phức tạp hơn nhiều.

## Lưu ý

* Bài kiểm tra sẽ để lại một số image docker trên node, bao gồm image kiểm tra tính tương thích của node và các image của container được sử dụng trong bài kiểm tra chức năng.
* Bài kiểm tra sẽ để lại các container đã dừng trên node. Các container này được tạo ra trong quá trình kiểm tra chức năng.
