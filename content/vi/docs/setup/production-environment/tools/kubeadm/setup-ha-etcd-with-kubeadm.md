---
reviewers:
- sig-cluster-lifecycle
title: Thiết lập một cụm etcd có tính Sẵn sàng cao (High Availability) với kubeadm
content_type: task
weight: 70
---

<!-- overview -->


Mặc định, kubeadm chạy một instance etcd cục bộ trên từng node control plane.
Bạn cũng có thể thiết lập cụm etcd bên ngoài và cung cấp các etcd instance trên
các máy chủ riêng biệt. Những sự khác biệt giữa hai cách tiếp cận này được trình bày
trong trang 
[Các tùy chọn cho kiến trúc có tính Sẵn sàng cao](/docs/setup/production-environment/tools/kubeadm/ha-topology).

Tác vụ này hướng dẫn quy trình tạo một cụm etcd bên ngoài có tính sẵn sàng cao gồm 
ba member mà kubeadm có thể sử dụng trong quá trình tạo cụm.

## {{% heading "prerequisites" %}}

- Ba máy chủ có thể giao tiếp với nhau qua cổng TCP 2379 và 2380.
  Tài liệu này giả định các cổng mặc định này. Tuy nhiên, chúng có thể được cấu hình 
  thông qua tệp cấu hình kubeadm.
- Mỗi máy chủ phải có systemd và đã cài đặt một shell tương thích với bash.
- Mỗi máy chủ phải 
  [đã cài đặt một container runtime, kubelet, và kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).
- Mỗi máy chủ phải có quyền truy cập vào Kubernetes container image registry (`registry.k8s.io`) 
  hoặc list/pull image etcd cần thiết bằng lệnh `kubeadm config images list/pull`. Hướng dẫn này 
  sẽ cài đặt các etcd instance dạng
  [static pods](/docs/tasks/configure-pod-container/static-pod/) được quản lý bởi kubelet.
- Một số công cụ để sao chép các file giữa các máy chủ. Ví dụ `ssh` và `scp`
  có thể đáp ứng yêu cầu này.

<!-- steps -->

## Thiết lập cụm

Cách tiếp cận thông thường là tạo ra toàn bộ chứng chỉ trên một node và chỉ phân bổ 
những file _quan trọng_ tới các node khác.

{{< note >}}
kubeadm chứa tất cả các công cụ mã hóa cần thiết để tạo ra
các chứng chỉ được đề cập bên dưới; không cần các công cụ mã hóa nào khác cho ví dụ này.
{{< /note >}}

{{< note >}}
Ví dụ bên dưới sử dụng dịa chỉ IPv4 nhưng bạn cũng có thể cấu hình kubeadm, kubelet và etcd
sử dụng địa chỉ IPv6. Dual-stack được hỗ trợ bởi một vài tùy chọn của Kubernetes, nhưng 
không được etcd hỗ trợ. Xem thêm chi tiết về Kubernetes hỗ trợ dual-stack tại
[Hỗ trợ Dual-stack với kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support/).
{{< /note >}}

1. Cấu hình kubelet để trở thành trình quản lý dịch vụ cho etcd.

   {{< note >}}Bạn phải thực hiện điều này trên toàn bộ các máy chủ chạy etcd.{{< /note >}}
   Vì etcd sẽ được tạo ra trước tiên, bạn phải ghi đè độ ưu tiên dịch vụ bằng cách tạo ra một 
   unit file mới có độ ưu tiên cao hơn kubelet unit file mà kubeadm cung cấp.

   ```sh
   cat << EOF > /etc/systemd/system/kubelet.service.d/kubelet.conf
   # Thay thế "systemd" bằng giá trị cgroup driver của container runtime của bạn. Giá trị mặc định trong kubelet là "cgroupfs".
   # Thay thế giá trị của "containerRuntimeEndpoint" bằng một container runtime khác nếu cần.
   #
   apiVersion: kubelet.config.k8s.io/v1beta1
   kind: KubeletConfiguration
   authentication:
     anonymous:
       enabled: false
     webhook:
       enabled: false
   authorization:
     mode: AlwaysAllow
   cgroupDriver: systemd
   address: 127.0.0.1
   containerRuntimeEndpoint: unix:///var/run/containerd/containerd.sock
   staticPodPath: /etc/kubernetes/manifests
   EOF

   cat << EOF > /etc/systemd/system/kubelet.service.d/20-etcd-service-manager.conf
   [Service]
   ExecStart=
   ExecStart=/usr/bin/kubelet --config=/etc/systemd/system/kubelet.service.d/kubelet.conf
   Restart=always
   EOF

   systemctl daemon-reload
   systemctl restart kubelet
   ```

   Kiểm tra trạng thái kubelet để chắc chắn rằng nó đang chạy.

   ```sh
   systemctl status kubelet
   ```

1. Tạo các file cấu hình cho kubeadm.

   Tạo một file cấu hình kubeadm cho từng máy chủ mà có etcd member chạy trên đó
   sử dụng tập lệnh dưới đây.

   ```sh
   # Thay đổi HOST0, HOST1 và HOST2 với các IP của các máy của bạn
   export HOST0=10.0.0.6
   export HOST1=10.0.0.7
   export HOST2=10.0.0.8

   # Thay đổi NAME0, NAME1 và NAME2 bằng hostnames của các máy của bạn
   export NAME0="infra0"
   export NAME1="infra1"
   export NAME2="infra2"

   # Tạo các thư mục tạm thời để lưu các file sẽ xuất hỉện trên các máy khác
   mkdir -p /tmp/${HOST0}/ /tmp/${HOST1}/ /tmp/${HOST2}/

   HOSTS=(${HOST0} ${HOST1} ${HOST2})
   NAMES=(${NAME0} ${NAME1} ${NAME2})

   for i in "${!HOSTS[@]}"; do
   HOST=${HOSTS[$i]}
   NAME=${NAMES[$i]}
   cat << EOF > /tmp/${HOST}/kubeadmcfg.yaml
   ---
   apiVersion: "kubeadm.k8s.io/v1beta4"
   kind: InitConfiguration
   nodeRegistration:
       name: ${NAME}
   localAPIEndpoint:
       advertiseAddress: ${HOST}
   ---
   apiVersion: "kubeadm.k8s.io/v1beta4"
   kind: ClusterConfiguration
   etcd:
       local:
           serverCertSANs:
           - "${HOST}"
           peerCertSANs:
           - "${HOST}"
           extraArgs:
           - name: initial-cluster
             value: ${NAMES[0]}=https://${HOSTS[0]}:2380,${NAMES[1]}=https://${HOSTS[1]}:2380,${NAMES[2]}=https://${HOSTS[2]}:2380
           - name: initial-cluster-state
             value: new
           - name: name
             value: ${NAME}
           - name: listen-peer-urls
             value: https://${HOST}:2380
           - name: listen-client-urls
             value: https://${HOST}:2379
           - name: advertise-client-urls
             value: https://${HOST}:2379
           - name: initial-advertise-peer-urls
             value: https://${HOST}:2380
   EOF
   done
   ```

1. Tạo cơ quan cấp chứng chỉ (CA).

   Nếu bạn đã có một CA, việc tiếp theo chỉ cần sao chép các file `crt` và
   `key` của CA tới `/etc/kubernetes/pki/etcd/ca.crt` và
   `/etc/kubernetes/pki/etcd/ca.key`. Sau khi các file đó được sao chép,
   tiến hành các bước tiếp theo, "Tạo các chứng chỉ cho từng member member".

   Nếu bạn chưa có CA nào, hãy chạy câu lệnh này trên `$HOST0` (nơi bạn
   tạo các file cấu hình cho kubeadm).

   ```
   kubeadm init phase certs etcd-ca
   ```

   Nó sẽ tạo ra hai file:

   - `/etc/kubernetes/pki/etcd/ca.crt`
   - `/etc/kubernetes/pki/etcd/ca.key`

1. Tạo các chứng chỉ cho từng member member.

   ```sh
   kubeadm init phase certs etcd-server --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST2}/kubeadmcfg.yaml
   cp -R /etc/kubernetes/pki /tmp/${HOST2}/
   # Dọn dẹp các chứng chỉ không sử dụng
   find /etc/kubernetes/pki -not -name ca.crt -not -name ca.key -type f -delete

   kubeadm init phase certs etcd-server --config=/tmp/${HOST1}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST1}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST1}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST1}/kubeadmcfg.yaml
   cp -R /etc/kubernetes/pki /tmp/${HOST1}/
   find /etc/kubernetes/pki -not -name ca.crt -not -name ca.key -type f -delete

   kubeadm init phase certs etcd-server --config=/tmp/${HOST0}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST0}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST0}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST0}/kubeadmcfg.yaml
   # Không cần phải di chuyển các chứng chỉ vì chúng dành cho HOST0

   # Dọn dẹp các chứng chỉ không nên sao chép khỏi máy chủ này
   find /tmp/${HOST2} -name ca.key -type f -delete
   find /tmp/${HOST1} -name ca.key -type f -delete
   ```

1. Sao chép các chứng chỉ và các cấu hình kubeadm.

   Các chứng chỉ này đã được tạo ra và bây giờ chúng cần được đưa tới từng máy chủ
   tương ứng.

   ```sh
   USER=ubuntu
   HOST=${HOST1}
   scp -r /tmp/${HOST}/* ${USER}@${HOST}:
   ssh ${USER}@${HOST}
   USER@HOST $ sudo -Es
   root@HOST $ chown -R root:root pki
   root@HOST $ mv pki /etc/kubernetes/
   ```

1. Đảm bảo đã có đủ toàn bộ các file cần thiết.

   Danh sách đầy đủ các file cần thiết trên `$HOST0` gồm:

   ```
   /tmp/${HOST0}
   └── kubeadmcfg.yaml
   ---
   /etc/kubernetes/pki
   ├── apiserver-etcd-client.crt
   ├── apiserver-etcd-client.keyt
   └── etcd
       ├── ca.crt
       ├── ca.key
       ├── healthcheck-client.crt
       ├── healthcheck-client.key
       ├── peer.crt
       ├── peer.key
       ├── server.crt
       └── server.key
   ```

   Trên `$HOST1`:

   ```
   $HOME
   └── kubeadmcfg.yaml
   ---
   /etc/kubernetes/pki
   ├── apiserver-etcd-client.crt
   ├── apiserver-etcd-client.key
   └── etcd
       ├── ca.crt
       ├── healthcheck-client.crt
       ├── healthcheck-client.key
       ├── peer.crt
       ├── peer.key
       ├── server.crt
       └── server.key
   ```

   Trên `$HOST2`:

   ```
   $HOME
   └── kubeadmcfg.yaml
   ---
   /etc/kubernetes/pki
   ├── apiserver-etcd-client.crt
   ├── apiserver-etcd-client.key
   └── etcd
       ├── ca.crt
       ├── healthcheck-client.crt
       ├── healthcheck-client.key
       ├── peer.crt
       ├── peer.key
       ├── server.crt
       └── server.key
   ```

1. Tạo các manifest cho static pod.

   Bây giờ các chứng chỉ và cấu hình đã có, đã đến lúc tạo các manifest.
   Trên mỗi máy chủ, hãy chạy lệnh `kubeadm` để tạo static manifest
   cho etcd.

   ```sh
   root@HOST0 $ kubeadm init phase etcd local --config=/tmp/${HOST0}/kubeadmcfg.yaml
   root@HOST1 $ kubeadm init phase etcd local --config=$HOME/kubeadmcfg.yaml
   root@HOST2 $ kubeadm init phase etcd local --config=$HOME/kubeadmcfg.yaml
   ```

1. Tùy chọn: Kiểm tra sức khỏe cụm.

    Nếu `etcdctl` không có sẵn, bạn có thể chạy công cụ này trong một container image.
    Bạn sẽ thực hiện điều đó trực tiếp với container runtime của mình bằng cách sử dụng 
    một công cụ như `crictl run` và không thông qua Kubernetes.

    ```sh
    ETCDCTL_API=3 etcdctl \
    --cert /etc/kubernetes/pki/etcd/peer.crt \
    --key /etc/kubernetes/pki/etcd/peer.key \
    --cacert /etc/kubernetes/pki/etcd/ca.crt \
    --endpoints https://${HOST0}:2379 endpoint health
    ...
    https://[HOST0 IP]:2379 is healthy: successfully committed proposal: took = 16.283339ms
    https://[HOST1 IP]:2379 is healthy: successfully committed proposal: took = 19.44402ms
    https://[HOST2 IP]:2379 is healthy: successfully committed proposal: took = 35.926451ms
    ```

    - Đặt `${HOST0}` bằng địa chỉ IP của máy chủ bạn đang kiểm tra.


## {{% heading "whatsnext" %}}

Một khi bạn đã có một cụm etcd với 3 member đang chạy, bạn có thể tiếp tục thiết lập
một control plane có tính sẵn sàng cao bằng
[phương pháp etcd bên ngoài với kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/).
