---
title: Chứng chỉ PKI và các yêu cầu
content_type: concept
weight: 50
---

<!-- overview -->

Kubernetes yêu cầu chứng chỉ PKI để xác thực qua TLS.
Nếu bạn cài đặt Kubernetes với [kubeadm](/docs/reference/setup-tools/kubeadm/), các chứng chỉ
mà cluster của bạn cần sẽ được tạo tự động.
Bạn cũng có thể tự tạo chứng chỉ của riêng mình -- ví dụ, để giữ các khóa riêng tư an toàn hơn
bằng cách không lưu trữ chúng trên API server.
Trang này giải thích các chứng chỉ mà cluster của bạn yêu cầu.

<!-- body -->

## Cách chứng chỉ được sử dụng bởi cluster của bạn

Kubernetes yêu cầu PKI cho các hoạt động sau:

### Chứng chỉ server

* Chứng chỉ server cho điểm truy cập API server
* Chứng chỉ server cho etcd server
* [Chứng chỉ server](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#client-and-serving-certificates)
  cho mỗi kubelet (mỗi {{< glossary_tooltip text="node" term_id="node" >}} chạy một kubelet)
* Chứng chỉ server tùy chọn cho [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)

### Chứng chỉ client

* Chứng chỉ client cho mỗi kubelet, được sử dụng để xác thực với API server với tư cách là client của
  Kubernetes API
* Chứng chỉ client cho mỗi API server, được sử dụng để xác thực với etcd
* Chứng chỉ client cho controller manager để giao tiếp an toàn với API server
* Chứng chỉ client cho scheduler để giao tiếp an toàn với API server
* Chứng chỉ client, một cho mỗi node, để kube-proxy xác thực với API server
* Chứng chỉ client tùy chọn cho quản trị viên của cluster để xác thực với API server
* Chứng chỉ client tùy chọn cho [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)

### Chứng chỉ server và client của kubelet

Để thiết lập kết nối an toàn và xác thực với kubelet, API Server cần một cặp chứng chỉ và khóa client.

Trong trường hợp này, có hai cách tiếp cận cho việc sử dụng chứng chỉ:

* Chứng chỉ dùng chung: kube-apiserver có thể sử dụng cùng một cặp chứng chỉ và khóa mà nó sử dụng để xác thực các client của mình. Điều này có nghĩa là các chứng chỉ hiện có như `apiserver.crt` và `apiserver.key` có thể được sử dụng để giao tiếp với các kubelet server.

* Chứng chỉ riêng biệt: Hoặc kube-apiserver có thể tạo một cặp chứng chỉ và khóa client mới để xác thực khi giao tiếp với các kubelet server. Trong trường hợp này, một chứng chỉ riêng biệt có tên `kubelet-client.crt` và khóa riêng tư tương ứng `kubelet-client.key` được tạo ra.

{{< note >}}
Chứng chỉ `front-proxy` chỉ được yêu cầu nếu bạn chạy kube-proxy để hỗ trợ
[một extension API server](/docs/tasks/extend-kubernetes/setup-extension-api-server/).
{{< /note >}}

etcd cũng triển khai TLS hai chiều để xác thực các client và các etcd peer (các node etcd khác trong cụm).

## Nơi lưu trữ chứng chỉ

Nếu bạn cài đặt Kubernetes với kubeadm, hầu hết các chứng chỉ được lưu trữ trong `/etc/kubernetes/pki`.
Tất cả các đường dẫn trong tài liệu này đều tương đối so với thư mục đó, ngoại trừ chứng chỉ tài khoản người dùng
mà kubeadm đặt trong `/etc/kubernetes`.

## Cấu hình chứng chỉ thủ công

Nếu bạn không muốn kubeadm tạo các chứng chỉ cần thiết, bạn có thể tạo chúng bằng
một CA gốc duy nhất hoặc bằng cách cung cấp tất cả các chứng chỉ. Xem [Chứng chỉ](/docs/tasks/administer-cluster/certificates/)
để biết chi tiết về cách tạo cơ quan chứng nhận riêng của bạn. Xem
[Quản lý chứng chỉ với kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)
để biết thêm về quản lý chứng chỉ.

### CA gốc duy nhất

Bạn có thể tạo một CA gốc duy nhất do quản trị viên kiểm soát. CA gốc này sau đó có thể tạo nhiều CA trung gian và ủy quyền tất cả việc tạo chứng chỉ tiếp theo cho Kubernetes.

Các CA bắt buộc:

| Đường dẫn               | CN mặc định               | Mô tả                           |
|------------------------|---------------------------|----------------------------------|
| ca.crt,key             | kubernetes-ca             | CA chung của Kubernetes          |
| etcd/ca.crt,key        | etcd-ca                   | Cho tất cả các chức năng liên quan đến etcd |
| front-proxy-ca.crt,key | kubernetes-front-proxy-ca | Cho [proxy front-end](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) |

Ngoài các CA trên, cũng cần có một cặp khóa công khai/riêng tư để quản lý tài khoản dịch vụ,
`sa.key` và `sa.pub`.
Ví dụ sau minh họa các tệp khóa và chứng chỉ CA được hiển thị trong bảng trước:

```
/etc/kubernetes/pki/ca.crt
/etc/kubernetes/pki/ca.key
/etc/kubernetes/pki/etcd/ca.crt
/etc/kubernetes/pki/etcd/ca.key
/etc/kubernetes/pki/front-proxy-ca.crt
/etc/kubernetes/pki/front-proxy-ca.key
```

### Tất cả chứng chỉ

Nếu bạn không muốn sao chép các khóa riêng tư CA vào cluster của mình, bạn có thể tự tạo tất cả các chứng chỉ.

Các chứng chỉ bắt buộc:

| CN mặc định                   | CA cha                    | O (trong Subject) | loại            | hosts (SAN)                                         |
|-------------------------------|---------------------------|-------------------|------------------|-----------------------------------------------------|
| kube-etcd                     | etcd-ca                   |                   | server, client   | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-peer                | etcd-ca                   |                   | server, client   | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-healthcheck-client  | etcd-ca                   |                   | client           |                                                     |
| kube-apiserver-etcd-client    | etcd-ca                   |                   | client           |                                                     |
| kube-apiserver                | kubernetes-ca             |                   | server           | `<hostname>`, `<Host_IP>`, `<advertise_IP>`[^1]     |
| kube-apiserver-kubelet-client | kubernetes-ca             | system:masters    | client           |                                                     |
| front-proxy-client            | kubernetes-front-proxy-ca |                   | client           |                                                     |

{{< note >}}
Thay vì sử dụng nhóm siêu người dùng `system:masters` cho `kube-apiserver-kubelet-client`,
một nhóm có ít đặc quyền hơn có thể được sử dụng. kubeadm sử dụng nhóm `kubeadm:cluster-admins`
cho mục đích đó.
{{< /note >}}

[^1]: bất kỳ IP hoặc tên DNS nào khác mà bạn liên hệ với cluster của mình (như được sử dụng bởi [kubeadm](/docs/reference/setup-tools/kubeadm/))
IP ổn định của bộ cân bằng tải và/hoặc tên DNS, `kubernetes`, `kubernetes.default`, `kubernetes.default.svc`,
`kubernetes.default.svc.cluster`, `kubernetes.default.svc.cluster.local`)

trong đó `loại` ánh xạ đến một hoặc nhiều mục đích sử dụng khóa x509, cũng được ghi trong
`.spec.usages` của một [CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1#CertificateSigningRequest):

| loại   | Mục đích sử dụng khóa                                                    |
|--------|--------------------------------------------------------------------------|
| server | chữ ký số, mã hóa khóa, xác thực server                                   |
| client | chữ ký số, mã hóa khóa, xác thực client                                   |

{{< note >}}
Hosts/SAN được liệt kê ở trên là những khuyến nghị để có một cluster hoạt động; nếu cần thiết cho
một thiết lập cụ thể, có thể thêm SAN bổ sung vào tất cả các chứng chỉ server.
{{< /note >}}

{{< note >}}
Chỉ dành cho người dùng kubeadm:

* Kịch bản khi bạn sao chép chứng chỉ CA vào cluster mà không có khóa riêng tư được gọi là CA bên ngoài trong tài liệu kubeadm.
* Nếu bạn so sánh danh sách trên với PKI được tạo bởi kubeadm, lưu ý rằng các chứng chỉ `kube-etcd`, `kube-etcd-peer` và `kube-etcd-healthcheck-client` không được tạo trong trường hợp sử dụng etcd bên ngoài.
{{< /note >}}

### Đường dẫn chứng chỉ

Chứng chỉ nên được đặt trong đường dẫn được khuyến nghị (như được sử dụng bởi [kubeadm](/docs/reference/setup-tools/kubeadm/)).
Đường dẫn nên được chỉ định bằng đối số đã cho bất kể vị trí.

| DefaultCN | recommendedkeypath | recommendedcertpath | command | keyargument | certargument |
| --------- | ------------------ | ------------------- | ------- | ----------- | ------------ |
| etcd-ca | etcd/ca.key | etcd/ca.crt | kube-apiserver | | --etcd-cafile |
| kube-apiserver-etcd-client | apiserver-etcd-client.key | apiserver-etcd-client.crt | kube-apiserver | --etcd-keyfile | --etcd-certfile |
| kubernetes-ca | ca.key | ca.crt | kube-apiserver | | --client-ca-file |
| kubernetes-ca | ca.key | ca.crt | kube-controller-manager | --cluster-signing-key-file | --client-ca-file,--root-ca-file,--cluster-signing-cert-file |
| kube-apiserver | apiserver.key | apiserver.crt| kube-apiserver | --tls-private-key-file | --tls-cert-file |
| kube-apiserver-kubelet-client | apiserver-kubelet-client.key | apiserver-kubelet-client.crt | kube-apiserver | --kubelet-client-key | --kubelet-client-certificate |
| front-proxy-ca | front-proxy-ca.key | front-proxy-ca.crt | kube-apiserver | | --requestheader-client-ca-file |
| front-proxy-ca | front-proxy-ca.key | front-proxy-ca.crt | kube-controller-manager | | --requestheader-client-ca-file |
| front-proxy-client | front-proxy-client.key | front-proxy-client.crt | kube-apiserver | --proxy-client-key-file | --proxy-client-cert-file |
| etcd-ca | etcd/ca.key | etcd/ca.crt | etcd | | --trusted-ca-file,--peer-trusted-ca-file |
| kube-etcd | etcd/server.key | etcd/server.crt | etcd | --key-file | --cert-file |
| kube-etcd-peer | etcd/peer.key | etcd/peer.crt | etcd | --peer-key-file | --peer-cert-file |
| etcd-ca| | etcd/ca.crt | etcdctl | | --cacert |
| kube-etcd-healthcheck-client | etcd/healthcheck-client.key | etcd/healthcheck-client.crt | etcdctl | --key | --cert |

Các cân nhắc tương tự áp dụng cho cặp khóa tài khoản dịch vụ:

| đường dẫn khóa riêng tư | đường dẫn khóa công khai | command                 | argument                             |
|-------------------|------------------|-------------------------|--------------------------------------|
|  sa.key           |                  | kube-controller-manager | --service-account-private-key-file   |
|                   | sa.pub           | kube-apiserver          | --service-account-key-file           |

Ví dụ sau minh họa đường dẫn tệp [từ các bảng trước](#certificate-paths)
mà bạn cần cung cấp nếu bạn đang tạo tất cả các khóa và chứng chỉ của riêng mình:

```
/etc/kubernetes/pki/etcd/ca.key
/etc/kubernetes/pki/etcd/ca.crt
/etc/kubernetes/pki/apiserver-etcd-client.key
/etc/kubernetes/pki/apiserver-etcd-client.crt
/etc/kubernetes/pki/ca.key
/etc/kubernetes/pki/ca.crt
/etc/kubernetes/pki/apiserver.key
/etc/kubernetes/pki/apiserver.crt
/etc/kubernetes/pki/apiserver-kubelet-client.key
/etc/kubernetes/pki/apiserver-kubelet-client.crt
/etc/kubernetes/pki/front-proxy-ca.key
/etc/kubernetes/pki/front-proxy-ca.crt
/etc/kubernetes/pki/front-proxy-client.key
/etc/kubernetes/pki/front-proxy-client.crt
/etc/kubernetes/pki/etcd/server.key
/etc/kubernetes/pki/etcd/server.crt
/etc/kubernetes/pki/etcd/peer.key
/etc/kubernetes/pki/etcd/peer.crt
/etc/kubernetes/pki/etcd/healthcheck-client.key
/etc/kubernetes/pki/etcd/healthcheck-client.crt
/etc/kubernetes/pki/sa.key
/etc/kubernetes/pki/sa.pub
```

## Cấu hình chứng chỉ cho tài khoản người dùng

Bạn phải cấu hình thủ công các tài khoản quản trị viên và tài khoản dịch vụ này:

| Tên tệp                | Tên thông tin xác thực     | CN mặc định                        | O (trong Subject)      |
|-------------------------|----------------------------|-------------------------------------|------------------------|
| admin.conf              | default-admin              | kubernetes-admin                    | `<admin-group>`        |
| super-admin.conf        | default-super-admin        | kubernetes-super-admin              | system:masters         |
| kubelet.conf            | default-auth               | system:node:`<nodeName>` (xem ghi chú) | system:nodes        |
| controller-manager.conf | default-controller-manager | system:kube-controller-manager      |                        |
| scheduler.conf          | default-scheduler          | system:kube-scheduler               |                        |

{{< note >}}
Giá trị của `<nodeName>` cho `kubelet.conf` **phải** khớp chính xác với giá trị của tên node
được cung cấp bởi kubelet khi nó đăng ký với apiserver. Để biết thêm chi tiết, hãy đọc
[Node Authorization](/docs/reference/access-authn-authz/node/).
{{< /note >}}

{{< note >}}
Trong ví dụ trên, `<admin-group>` là đặc thù cho triển khai. Một số công cụ ký
chứng chỉ trong `admin.conf` mặc định để là một phần của nhóm `system:masters`.
`system:masters` là một nhóm siêu người dùng khẩn cấp có thể bỏ qua lớp ủy quyền
của Kubernetes, chẳng hạn như RBAC. Ngoài ra, một số công cụ không tạo ra
`super-admin.conf` riêng biệt với chứng chỉ ràng buộc với nhóm siêu người dùng này.

kubeadm tạo hai chứng chỉ quản trị viên riêng biệt trong các tệp kubeconfig.
Một là trong `admin.conf` và có `Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`.
`kubeadm:cluster-admins` là một nhóm tùy chỉnh ràng buộc với ClusterRole `cluster-admin`.
Tệp này được tạo trên tất cả các máy control plane được quản lý bởi kubeadm.

Một tệp khác là `super-admin.conf` có `Subject: O = system:masters, CN = kubernetes-super-admin`.
Tệp này chỉ được tạo trên node nơi `kubeadm init` được gọi.
{{< /note >}}

1. Đối với mỗi cấu hình, tạo một cặp chứng chỉ/khóa x509 với
   Common Name (CN) và Organization (O) đã cho.

1. Chạy `kubectl` như sau cho mỗi cấu hình:

   ```
   KUBECONFIG=<filename> kubectl config set-cluster default-cluster --server=https://<host ip>:6443 --certificate-authority <path-to-kubernetes-ca> --embed-certs
   KUBECONFIG=<filename> kubectl config set-credentials <credential-name> --client-key <path-to-key>.pem --client-certificate <path-to-cert>.pem --embed-certs
   KUBECONFIG=<filename> kubectl config set-context default-system --cluster default-cluster --user <credential-name>
   KUBECONFIG=<filename> kubectl config use-context default-system
   ```

Các tệp này được sử dụng như sau:

| Tên tệp                | Command                 | Ghi chú                                                               |
|-------------------------|-------------------------|-----------------------------------------------------------------------|
| admin.conf              | kubectl                 | Cấu hình người dùng quản trị cho cluster                              |
| super-admin.conf        | kubectl                 | Cấu hình người dùng siêu quản trị cho cluster                         |
| kubelet.conf            | kubelet                 | Một tệp được yêu cầu cho mỗi node trong cluster.                      |
| controller-manager.conf | kube-controller-manager | Phải được thêm vào manifest trong `manifests/kube-controller-manager.yaml` |
| scheduler.conf          | kube-scheduler          | Phải được thêm vào manifest trong `manifests/kube-scheduler.yaml`      |

Các tệp sau minh họa đường dẫn đầy đủ đến các tệp được liệt kê trong bảng trước:

```
/etc/kubernetes/admin.conf
/etc/kubernetes/super-admin.conf
/etc/kubernetes/kubelet.conf
/etc/kubernetes/controller-manager.conf
/etc/kubernetes/scheduler.conf
```
