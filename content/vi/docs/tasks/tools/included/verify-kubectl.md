---
title: "xác minh cài đặt lệnh kubectl"
description: "Cách kiểm tra lệnh kubectl đã được cài thành công"
headless: true
_build:
  list: never
  render: never
  publishResources: false
---
<!-- TODO: update kubeconfig link when it's translated -->
Để kubectl có thể tìm kiếm và truy cập vào Kubernetes cluster, nó cần một [tệp kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/), được tạo tự động khi chúng ta tạo một cluster bằng [kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh) hoặc khi triển khai thành công cluster Minikube.  
Mặc định, thông tin cấu hình của kubectl được định nghĩa trong `~/.kube/config`.

Chúng ta có thể kiểm tra xem kubectl đã được cấu hình đúng chưa bằng cách kiểm tra thông tin của cluster:

```shell
kubectl cluster-info
```

Nếu bạn thấy kết quả trả về là một đường dẫn, thì kubectl đã được cấu hình đúng để truy cập cluster của chúng ta.

Nếu bạn thấy thông báo tương tự như dưới đây, điều đó có nghĩa kubectl chưa được cấu hình đúng hoặc không thể kết nối tới Kubernetes cluster.

```plaintext
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

Thông báo trên, được kubectl trả về, mong bạn kiểm tra lại đường dẫn (bao host và port) tới cluster đã đúng hay chưa

Ví dụ, nếu bạn đang dự định tạo một Kubernetes cluster trên máy tính cá nhân, bạn sẽ cần cài đặt một công cụ như [Minikube](https://minikube.sigs.k8s.io/docs/start/) trước, sau đó chạy lại các lệnh đã nêu ở trên.

Nếu lệnh `kubectl cluster-info` trả về đường dẫn nhưng bạn vẫn không thể truy cập vào cluster, hãy kiểm tra cấu hình kỹ hơn bằng lệnh sau:

```shell
kubectl cluster-info dump
```

### Xử lý lỗi 'No Auth Provider Found' {#no-auth-provider-found}

Ở phiên bản 1.26 của Kubernetes, kubectl đã loại bỏ tính năng xác thực tích hợp sẵn cho các dịch vụ Kubernetes được quản lý bởi các nhà cung cấp đám mây dưới đây. Các nhà cung cấp này đã phát hành plugin kubectl để hỗ trợ xác thực dành riêng cho nền tảng của họ. Tham khảo tài liệu hướng dẫn của nhà cung cấp để biết thêm thông tin:

* Azure AKS: [kubelogin plugin](https://azure.github.io/kubelogin/)
* Google Kubernetes Engine: [gke-gcloud-auth-plugin](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl#install_plugin)

(Lưu ý: cùng một thông báo lỗi cũng có thể xuất hiện vì các lý do khác không liên quan đến sự thay đổi này.)