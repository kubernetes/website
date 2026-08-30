---
title: Chứng chỉ PKI và các yêu cầu
reviewers:
- sig-cluster-lifecycle
content_type: concept
weight: 50
---

<!-- overview -->

Kubernetes yêu cầu chứng chỉ PKI để xác thực qua TLS.
Nếu bạn cài đặt Kubernetes bằng [kubeadm](/docs/reference/setup-tools/kubeadm/), các chứng chỉ
mà cụm của bạn yêu cầu sẽ được tự động tạo ra.
Bạn cũng có thể tự tạo chứng chỉ của riêng mình -- ví dụ, để giữ khóa riêng tư an toàn hơn
bằng cách không lưu trữ chúng trên API server.
Trang này giải thích các chứng chỉ mà cụm của bạn yêu cầu.

<!-- body -->

## Cách cụm của bạn sử dụng chứng chỉ

Kubernetes yêu cầu PKI cho các hoạt động sau:

### Chứng chỉ máy chủ (Server certificates)

* Chứng chỉ máy chủ cho API server endpoint
* Chứng chỉ máy chủ cho etcd server
* [Chứng chỉ máy chủ](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#client-and-serving-certificates)
  cho mỗi kubelet (mỗi {{< glossary_tooltip text="node" term_id="node" >}} chạy một kubelet)
* Chứng chỉ máy chủ tùy chọn cho [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)

### Chứng chỉ máy khách (Client certificates)

* Chứng chỉ máy khách cho mỗi kubelet, được dùng để xác thực với API server với vai trò là máy khách của
  Kubernetes API
* Chứng chỉ máy khách cho mỗi API server, được dùng để xác thực với etcd
* Chứng chỉ máy khách cho controller manager để giao tiếp an toàn với API server
* Chứng chỉ máy khách cho scheduler để giao tiếp an toàn với API server
* Chứng chỉ máy khách, một cho mỗi node, để kube-proxy xác thực với API server
* Chứng chỉ máy khách tùy chọn cho quản trị viên của cụm để xác thực với API server
* Chứng chỉ máy khách tùy chọn cho [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)

### Chứng chỉ máy chủ và máy khách của Kubelet

Để thiết lập kết nối an toàn và tự xác thực với kubelet, API Server
yêu cầu một cặp chứng chỉ và khóa máy khách.

Trong kịch bản này, có hai cách tiếp cận để sử dụng chứng chỉ:

* Chứng chỉ dùng chung: kube-apiserver có thể sử dụng cùng một cặp chứng chỉ và khóa mà nó dùng
  để xác thực các máy khách của mình. Điều này có nghĩa là các chứng chỉ hiện có, chẳng hạn như `apiserver.crt`
  và `apiserver.key`, có thể được dùng để giao tiếp với các kubelet server.

* Chứng chỉ riêng biệt: Ngoài ra, kube-apiserver có thể tạo một cặp chứng chỉ và khóa máy khách mới
  để xác thực giao tiếp của nó với các kubelet server. Trong trường hợp này,
  một chứng chỉ riêng biệt có tên `kubelet-client.crt` và khóa riêng tư tương ứng của nó,
  `kubelet-client.key`, được tạo ra.

{{< note >}}
Chứng chỉ `front-proxy` chỉ được yêu cầu nếu bạn chạy kube-proxy để hỗ trợ
[một extension API server](/docs/tasks/extend-kubernetes/setup-extension-api-server/).
{{< /note >}}

etcd cũng triển khai mutual TLS để xác thực máy khách và các peer.

## Nơi lưu trữ chứng chỉ

Nếu bạn cài đặt Kubernetes bằng kubeadm, hầu hết chứng chỉ được lưu trữ trong `/etc/kubernetes/pki`.
Tất cả các đường dẫn trong tài liệu này được tính tương đối so với thư mục đó, ngoại trừ chứng chỉ
tài khoản người dùng mà kubeadm đặt trong `/etc/kubernetes`.

## Cấu hình chứng chỉ thủ công

Nếu bạn không muốn kubeadm tạo các chứng chỉ cần thiết, bạn có thể tạo chúng bằng cách sử dụng
một root CA duy nhất hoặc bằng cách cung cấp tất cả chứng chỉ. Xem [Chứng chỉ](/docs/tasks/administer-cluster/certificates/)
để biết chi tiết về việc tạo certificate authority của riêng bạn. Xem
[Quản lý chứng chỉ với kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)
để biết thêm về cách quản lý chứng chỉ.

### Root CA duy nhất

Bạn có thể tạo một root CA duy nhất, do quản trị viên kiểm soát. Root CA này sau đó có thể tạo
nhiều intermediate CA và ủy quyền tất cả các bước tạo tiếp theo cho chính Kubernetes.

Các CA bắt buộc:

| Đường dẫn                 | CN mặc định                | Mô tả                           |
|---------------------------|----------------------------|---------------------------------|
| ca.crt,key                | kubernetes-ca              | Kubernetes general CA           |
| etcd/ca.crt,key           | etcd-ca                    | Cho tất cả các chức năng liên quan đến etcd |
| front-proxy-ca.crt,key    | kubernetes-front-proxy-ca  | Cho [front-end proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) |

Ngoài các CA trên, cũng cần có một cặp khóa công khai/riêng tư để quản lý service account,
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

Nếu bạn không muốn sao chép các khóa riêng tư CA vào cụm của mình, bạn có thể tự tạo tất cả chứng chỉ.

Các chứng chỉ bắt buộc:

| CN mặc định                   | CA cha                     | O (trong Subject) | kind             | hosts (SAN)                                         |
|-------------------------------|----------------------------|-------------------|------------------|-----------------------------------------------------|
| kube-etcd                     | etcd-ca                    |                   | server, client   | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-peer                | etcd-ca                    |                   | server, client   | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-healthcheck-client  | etcd-ca                    |                   | client           |                                                     |
| kube-apiserver-etcd-client    | etcd-ca                    |                   | client           |                                                     |
| kube-apiserver                | kubernetes-ca              |                   | server           | `<hostname>`, `<Host_IP>`, `<advertise_IP>`[^1]     |
| kube-apiserver-kubelet-client | kubernetes-ca              | system:masters    | client           |                                                     |
| front-proxy-client            | kubernetes-front-proxy-ca  |                   | client           |                                                     |

{{< note >}}
Thay vì sử dụng nhóm siêu người dùng `system:masters` cho `kube-apiserver-kubelet-client`,
có thể sử dụng một nhóm có ít đặc quyền hơn. kubeadm sử dụng nhóm `kubeadm:cluster-admins` cho
mục đích đó.
{{< /note >}}

[^1]: bất kỳ IP hoặc DNS name nào khác mà bạn liên hệ với cụm của mình (như được sử dụng bởi [kubeadm](/docs/reference/setup-tools/kubeadm/)
địa chỉ IP ổn định của load balancer và/hoặc DNS name, `kubernetes`, `kubernetes.default`, `kubernetes.default.svc`,
`kubernetes.default.svc.cluster`, `kubernetes.default.svc.cluster.local`)

trong đó `kind` ánh xạ tới một hoặc nhiều x509 key usage, cũng được ghi trong
`.spec.usages` của một loại [CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1#CertificateSigningRequest):

| kind   | Key usage                                                                        |
|--------|----------------------------------------------------------------------------------|
| server | digital signature, key encipherment, server auth                                 |
| client | digital signature, key encipherment, client auth                                 |

{{< note >}}
Hosts/SAN được liệt kê ở trên là các giá trị được khuyến nghị để có một cụm hoạt động; nếu được yêu cầu bởi
một thiết lập cụ thể, bạn có thể thêm các SAN bổ sung trên tất cả các chứng chỉ máy chủ.
{{< /note >}}

{{< note >}}
Chỉ dành cho người dùng kubeadm:

* Kịch bản bạn sao chép chứng chỉ CA vào cụm mà không có khóa riêng tư được
  gọi là external CA trong tài liệu kubeadm.
* Nếu bạn so sánh danh sách trên với một PKI do kubeadm tạo, hãy lưu ý rằng
  các chứng chỉ `kube-etcd`, `kube-etcd-peer` và `kube-etcd-healthcheck-client` không được tạo
  trong trường hợp sử dụng etcd bên ngoài.

{{< /note >}}

### Đường dẫn chứng chỉ

Chứng chỉ nên được đặt ở một đường dẫn được khuyến nghị (như được sử dụng bởi [kubeadm](/docs/reference/setup-tools/kubeadm/)).
Các đường dẫn nên được chỉ định bằng đối số đã cho bất kể vị trí.

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

Các cân nhắc tương tự cũng áp dụng cho cặp khóa service account:

| đường dẫn khóa riêng tư | đường dẫn khóa công khai | command              | argument                         |
|--------------------------|--------------------------|----------------------|----------------------------------|
|  sa.key                  |                          | kube-controller-manager | --service-account-private-key-file |
|                          | sa.pub                   | kube-apiserver       | --service-account-key-file       |

Ví dụ sau minh họa các đường dẫn tệp [từ các bảng trước](#certificate-paths)
bạn cần cung cấp nếu bạn đang tự tạo tất cả các khóa và chứng chỉ của mình:

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

Bạn phải tự cấu hình thủ công các tài khoản quản trị viên và service account sau:

| Filename                | Tên thông tin xác thực | CN mặc định                        | O (trong Subject)         |
|-------------------------|------------------------|------------------------------------|---------------------------|
| admin.conf              | default-admin          | kubernetes-admin                   | `<admin-group>`           |
| super-admin.conf        | default-super-admin    | kubernetes-super-admin             | system:masters            |
| kubelet.conf            | default-auth           | system:node:`<nodeName>` (xem ghi chú) | system:nodes             |
| controller-manager.conf | default-controller-manager | system:kube-controller-manager |                           |
| scheduler.conf          | default-scheduler      | system:kube-scheduler              |                           |

{{< note >}}
Giá trị của `<nodeName>` cho `kubelet.conf` **phải** khớp chính xác với giá trị tên node
được cung cấp bởi kubelet khi nó đăng ký với apiserver. Để biết thêm chi tiết, hãy đọc
[Node Authorization](/docs/reference/access-authn-authz/node/).
{{< /note >}}

{{< note >}}
Trong ví dụ trên, `<admin-group>` phụ thuộc vào cách triển khai cụ thể. Một số công cụ ký
chứng chỉ trong `admin.conf` mặc định để thuộc nhóm `system:masters`.
`system:masters` là một nhóm siêu người dùng đặc quyền (break-glass) có thể bỏ qua lớp phân quyền
của Kubernetes, chẳng hạn như RBAC. Ngoài ra, một số công cụ không tạo một tệp
`super-admin.conf` riêng biệt với chứng chỉ được gắn vào nhóm siêu người dùng này.

kubeadm tạo ra hai chứng chỉ quản trị viên riêng biệt trong các tệp kubeconfig.
Một tệp nằm trong `admin.conf` và có `Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`.
`kubeadm:cluster-admins` là một nhóm tùy chỉnh được gắn với ClusterRole `cluster-admin`.
Tệp này được tạo trên tất cả các máy control plane do kubeadm quản lý.

Một tệp khác nằm trong `super-admin.conf` có `Subject: O = system:masters, CN = kubernetes-super-admin`.
Tệp này chỉ được tạo trên node nơi gọi `kubeadm init`.
{{< /note >}}

1. Đối với mỗi cấu hình, hãy tạo một cặp chứng chỉ/khóa x509 với
   Common Name (CN) và Organization (O) đã cho.

1. Chạy `kubectl` như sau cho mỗi cấu hình:

   ```
   KUBECONFIG=<filename> kubectl config set-cluster default-cluster --server=https://<host ip>:6443 --certificate-authority <path-to-kubernetes-ca> --embed-certs
   KUBECONFIG=<filename> kubectl config set-credentials <credential-name> --client-key <path-to-key>.pem --client-certificate <path-to-cert>.pem --embed-certs
   KUBECONFIG=<filename> kubectl config set-context default-system --cluster default-cluster --user <credential-name>
   KUBECONFIG=<filename> kubectl config use-context default-system
   ```

Các tệp này được sử dụng như sau:

| Filename                | Command                 | Comment                                                               |
|-------------------------|-------------------------|-----------------------------------------------------------------------|
| admin.conf              | kubectl                 | Cấu hình người dùng quản trị viên cho cụm                             |
| super-admin.conf        | kubectl                 | Cấu hình người dùng siêu quản trị viên cho cụm                        |
| kubelet.conf            | kubelet                 | Bắt buộc một tệp cho mỗi node trong cụm.                              |
| controller-manager.conf | kube-controller-manager | Phải được thêm vào manifest trong `manifests/kube-controller-manager.yaml` |
| scheduler.conf          | kube-scheduler          | Phải được thêm vào manifest trong `manifests/kube-scheduler.yaml`     |

Các tệp sau minh họa các đường dẫn đầy đủ đến các tệp được liệt kê trong bảng trước:

```
/etc/kubernetes/admin.conf
/etc/kubernetes/super-admin.conf
/etc/kubernetes/kubelet.conf
/etc/kubernetes/controller-manager.conf
/etc/kubernetes/scheduler.conf
```