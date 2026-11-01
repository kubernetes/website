---
title: Persistent Volumes
api_metadata:
- apiVersion: "v1"
  kind: "PersistentVolume"
- apiVersion: "v1"
  kind: "PersistentVolumeClaim"
feature:
  title: Điều phối lưu trữ
  description: >
    Tự động mount hệ thống lưu trữ bạn chọn, cho dù là lưu trữ cục bộ, nhà cung cấp đám mây công cộng, hay hệ thống lưu trữ mạng như iSCSI hoặc NFS.
content_type: concept
weight: 20
---

<!-- overview -->

Tài liệu này mô tả _persistent volume_ trong Kubernetes. Bạn nên làm quen trước với
[volume](/docs/concepts/storage/volumes/), [StorageClass](/docs/concepts/storage/storage-classes/)
và [VolumeAttributesClass](/docs/concepts/storage/volume-attributes-classes/).

<!-- body -->

## Giới thiệu {#introduction}

Quản lý lưu trữ là một bài toán khác hẳn với quản lý các phiên bản tính toán.
Hệ thống con PersistentVolume cung cấp một API cho người dùng và quản trị viên,
giúp tách biệt chi tiết về cách lưu trữ được cung cấp khỏi cách nó được sử dụng.
Để làm điều này, chúng tôi giới thiệu hai tài nguyên API mới: PersistentVolume và PersistentVolumeClaim.

Một _PersistentVolume_ (PV) là một phần lưu trữ trong cluster, được quản trị viên
cấp phát hoặc được cấp phát động bằng
[Storage Class](/docs/concepts/storage/storage-classes/). Nó là một tài nguyên trong
cluster, giống như node là một tài nguyên của cluster. PV là các volume plugin giống như
Volume, nhưng có vòng đời độc lập với bất kỳ Pod riêng lẻ nào sử dụng PV đó.
Đối tượng API này nắm giữ các chi tiết về cách triển khai lưu trữ, dù đó là
NFS, iSCSI, hay một hệ thống lưu trữ riêng của nhà cung cấp đám mây.

Một _PersistentVolumeClaim_ (PVC) là một yêu cầu lưu trữ của người dùng. Nó tương tự
như một Pod. Pod tiêu thụ tài nguyên của node, còn PVC tiêu thụ tài nguyên của PV. Pod có thể
yêu cầu các mức tài nguyên cụ thể (CPU và bộ nhớ). Claim có thể yêu cầu kích thước
và chế độ truy cập (access mode) cụ thể (ví dụ: có thể được mount ở chế độ ReadWriteOnce, ReadOnlyMany,
ReadWriteMany, hoặc ReadWriteOncePod, xem [AccessModes](#access-modes)).

Mặc dù PersistentVolumeClaim cho phép người dùng tiêu thụ tài nguyên lưu trữ trừu tượng,
người dùng thường cần các PersistentVolume với những thuộc tính khác nhau, chẳng hạn như
hiệu năng, cho các bài toán khác nhau. Quản trị viên cluster cần có khả năng
cung cấp nhiều loại PersistentVolume khác nhau không chỉ về kích thước và chế độ
truy cập, mà không để người dùng phải tiếp xúc với chi tiết về cách các volume đó được triển khai.
Để đáp ứng những nhu cầu này, có tài nguyên _StorageClass_.

Xem [hướng dẫn chi tiết kèm các ví dụ hoạt động được](/docs/tutorials/configuration/configure-persistent-volume-storage).

## Vòng đời của volume và claim {#lifecycle-of-a-volume-and-claim}

PV là các tài nguyên trong cluster. PVC là các yêu cầu đối với những tài nguyên đó và cũng đóng vai trò
như phiếu nhận tài nguyên. Tương tác giữa PV và PVC tuân theo vòng đời sau:

### Cấp phát (provisioning) {#provisioning}

Có hai cách để cấp phát PV: tĩnh hoặc động.

#### Tĩnh {#static}

Quản trị viên cluster tạo một số PV. Chúng chứa thông tin chi tiết về
lưu trữ thực, sẵn sàng cho người dùng cluster sử dụng. Chúng tồn tại trong
Kubernetes API và sẵn sàng để được tiêu thụ.

#### Động {#dynamic}

Khi không có PV tĩnh nào do quản trị viên tạo khớp với PersistentVolumeClaim của người dùng,
cluster có thể thử cấp phát động một volume dành riêng cho PVC đó.
Việc cấp phát này dựa trên StorageClass: PVC phải yêu cầu một
[storage class](/docs/concepts/storage/storage-classes/) và
quản trị viên phải đã tạo và cấu hình class đó thì việc cấp phát động
mới diễn ra. Các claim yêu cầu class `""` thực chất đã tắt
cấp phát động cho chính chúng.

Để bật cấp phát lưu trữ động dựa trên storage class, quản trị viên cluster
cần bật [admission controller](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)
`DefaultStorageClass`
trên API server. Ví dụ, có thể làm điều này bằng cách đảm bảo `DefaultStorageClass` nằm
trong danh sách giá trị có thứ tự, phân tách bằng dấu phẩy, của cờ `--enable-admission-plugins` của
thành phần API server. Để biết thêm thông tin về các cờ dòng lệnh của API server,
hãy xem tài liệu về [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/).

### Gắn kết (binding) {#binding}

Người dùng tạo, hoặc trong trường hợp cấp phát động thì đã tạo sẵn,
một PersistentVolumeClaim với một lượng lưu trữ cụ thể được yêu cầu và với
một số chế độ truy cập nhất định. Một vòng điều khiển trong control plane theo dõi các PVC mới, tìm
một PV phù hợp (nếu có thể), và gắn chúng với nhau. Nếu một PV được cấp phát động
cho một PVC mới, vòng điều khiển sẽ luôn gắn PV đó với PVC. Ngược lại,
người dùng sẽ luôn nhận được ít nhất những gì họ yêu cầu, nhưng volume có thể
lớn hơn mức được yêu cầu. Một khi đã được gắn, việc gắn kết PersistentVolumeClaim là độc quyền,
bất kể chúng được gắn theo cách nào. Việc gắn kết PVC với PV là ánh xạ một-một,
sử dụng ClaimRef, là một liên kết hai chiều giữa PersistentVolume
và PersistentVolumeClaim.

Claim sẽ ở trạng thái chưa được gắn vô thời hạn nếu không tồn tại volume phù hợp.
Claim sẽ được gắn khi có volume phù hợp. Ví dụ, một
cluster được cấp phát nhiều PV 50Gi sẽ không khớp với một PVC yêu cầu 100Gi.
PVC có thể được gắn khi một PV 100Gi được thêm vào cluster.

### Sử dụng {#using}

Pod sử dụng claim như volume. Cluster kiểm tra claim để tìm volume
đã được gắn và mount volume đó cho Pod. Với các volume hỗ trợ nhiều
chế độ truy cập, người dùng chỉ định chế độ mong muốn khi sử dụng claim của họ
làm volume trong Pod.

Khi người dùng có một claim và claim đó đã được gắn, PV đã gắn thuộc về
người dùng trong suốt thời gian họ cần. Người dùng lập lịch Pod và truy cập các PV
đã claim bằng cách thêm phần `persistentVolumeClaim` vào khối `volumes` của Pod.
Xem [Claim dưới dạng volume](#claims-as-volumes) để biết thêm chi tiết.

### Bảo vệ đối tượng lưu trữ đang được sử dụng {#storage-object-in-use-protection}

Mục đích của tính năng Bảo vệ đối tượng lưu trữ đang được sử dụng (Storage Object in Use Protection) là đảm bảo rằng
các PersistentVolumeClaim (PVC) đang được Pod sử dụng và các PersistentVolume (PV)
đã được gắn với PVC không bị xóa khỏi hệ thống, vì điều này có thể dẫn đến mất dữ liệu.

{{< note >}}
PVC được coi là đang được Pod sử dụng khi tồn tại một đối tượng Pod đang dùng PVC đó.
{{< /note >}}

Nếu người dùng xóa một PVC đang được Pod sử dụng, PVC sẽ không bị xóa ngay lập tức.
Việc xóa PVC được hoãn lại cho đến khi PVC không còn được Pod nào sử dụng. Tương tự,
nếu quản trị viên xóa một PV đã được gắn với một PVC, PV sẽ không bị xóa ngay lập tức.
Việc xóa PV được hoãn lại cho đến khi PV không còn được gắn với PVC nào.

Bạn có thể thấy một PVC đang được bảo vệ khi trạng thái của PVC là `Terminating` và
danh sách `Finalizers` có chứa `kubernetes.io/pvc-protection`:

```shell
kubectl describe pvc hostpath
Name:          hostpath
Namespace:     default
StorageClass:  example-hostpath
Status:        Terminating
Volume:
Labels:        <none>
Annotations:   volume.beta.kubernetes.io/storage-class=example-hostpath
               volume.beta.kubernetes.io/storage-provisioner=example.com/hostpath
Finalizers:    [kubernetes.io/pvc-protection]
...
```

Tương tự, bạn có thể thấy một PV đang được bảo vệ khi trạng thái của PV là `Terminating` và
danh sách `Finalizers` có chứa `kubernetes.io/pv-protection`:

```shell
kubectl describe pv task-pv-volume
Name:            task-pv-volume
Labels:          type=local
Annotations:     <none>
Finalizers:      [kubernetes.io/pv-protection]
StorageClass:    standard
Status:          Terminating
Claim:
Reclaim Policy:  Delete
Access Modes:    RWO
Capacity:        1Gi
Message:
Source:
    Type:          HostPath (bare host directory volume)
    Path:          /tmp/data
    HostPathType:
Events:            <none>
```

### Thu hồi (reclaiming) {#reclaiming}

Khi người dùng không còn cần volume, họ có thể xóa các đối tượng PVC khỏi
API để cho phép thu hồi tài nguyên. Chính sách thu hồi (reclaim policy) của một PersistentVolume
cho cluster biết phải làm gì với volume sau khi nó được giải phóng khỏi claim.
Hiện tại, volume có thể được giữ lại (Retain), tái chế (Recycle), hoặc xóa (Delete).

#### Retain {#retain}

Chính sách thu hồi `Retain` cho phép thu hồi tài nguyên thủ công.
Khi PersistentVolumeClaim bị xóa, PersistentVolume vẫn tồn tại
và volume được coi là "đã giải phóng" (released). Nhưng nó chưa sẵn sàng cho
một claim khác vì dữ liệu của claim trước đó vẫn còn trên volume.
Quản trị viên có thể thu hồi volume thủ công theo các bước sau.

1. Xóa PersistentVolume. Tài nguyên lưu trữ liên quan trong hạ tầng bên ngoài
   vẫn tồn tại sau khi PV bị xóa.
1. Dọn dẹp thủ công dữ liệu trên tài nguyên lưu trữ liên quan cho phù hợp.
1. Xóa thủ công tài nguyên lưu trữ liên quan.

Nếu bạn muốn tái sử dụng cùng một tài nguyên lưu trữ, hãy tạo một PersistentVolume mới với
cùng định nghĩa tài nguyên lưu trữ đó.

#### Delete {#delete}

Với các volume plugin hỗ trợ chính sách thu hồi `Delete`, việc xóa sẽ loại bỏ
cả đối tượng PersistentVolume khỏi Kubernetes, lẫn tài nguyên lưu trữ
liên quan trong hạ tầng bên ngoài. Các volume được cấp phát động
kế thừa [chính sách thu hồi của StorageClass tương ứng](#reclaim-policy), mà
mặc định là `Delete`. Quản trị viên nên cấu hình StorageClass
theo mong đợi của người dùng; nếu không, PV phải được chỉnh sửa hoặc
patch sau khi được tạo. Xem
[Thay đổi chính sách thu hồi của một PersistentVolume](/docs/tasks/administer-cluster/change-pv-reclaim-policy/).

#### Recycle {#recycle}

{{< warning >}}
Chính sách thu hồi `Recycle` không còn được hỗ trợ. Thay vào đó, cách được khuyến nghị
là sử dụng cấp phát động.
{{< /warning >}}

Nếu volume plugin bên dưới hỗ trợ, chính sách thu hồi `Recycle` sẽ thực hiện
một thao tác xóa cơ bản (`rm -rf /thevolume/*`) trên volume và làm cho nó sẵn sàng trở lại cho một claim mới.

Tuy nhiên, quản trị viên có thể cấu hình một bản mẫu (template) Pod tái chế tùy chỉnh bằng
các đối số dòng lệnh của Kubernetes controller manager như được mô tả trong
[tài liệu tham khảo](/docs/reference/command-line-tools-reference/kube-controller-manager/).
Bản mẫu Pod tái chế tùy chỉnh phải chứa đặc tả `volumes`, như
trong ví dụ dưới đây:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pv-recycler
  namespace: default
spec:
  restartPolicy: Never
  volumes:
  - name: vol
    hostPath:
      path: /any/path/it/will/be/replaced
  containers:
  - name: pv-recycler
    image: "registry.k8s.io/busybox"
    command: ["/bin/sh", "-c", "test -e /scrub && rm -rf /scrub/..?* /scrub/.[!.]* /scrub/*  && test -z \"$(ls -A /scrub)\" || exit 1"]
    volumeMounts:
    - name: vol
      mountPath: /scrub
```

Tuy nhiên, đường dẫn cụ thể được chỉ định trong phần `volumes` của bản mẫu Pod tái chế tùy chỉnh
sẽ được thay thế bằng đường dẫn cụ thể của volume đang được tái chế.

### Finalizer bảo vệ việc xóa PersistentVolume {#persistentvolume-deletion-protection-finalizer}
{{< feature-state feature_gate_name="HonorPVReclaimPolicy" >}}

Có thể thêm finalizer vào PersistentVolume để đảm bảo rằng các PersistentVolume
có chính sách thu hồi `Delete` chỉ bị xóa sau khi lưu trữ bên dưới đã bị xóa.

Finalizer `external-provisioner.volume.kubernetes.io/finalizer` (được giới thiệu
trong v1.31) được thêm vào cả các CSI volume được cấp phát động lẫn
được cấp phát tĩnh.

Finalizer `kubernetes.io/pv-controller` (được giới thiệu trong v1.31) được thêm vào
các volume in-tree plugin được cấp phát động và được bỏ qua với các volume
in-tree plugin được cấp phát tĩnh.

Sau đây là ví dụ về một volume in-tree plugin được cấp phát động:

```shell
kubectl describe pv pvc-74a498d6-3929-47e8-8c02-078c1ece4d78
Name:            pvc-74a498d6-3929-47e8-8c02-078c1ece4d78
Labels:          <none>
Annotations:     kubernetes.io/createdby: vsphere-volume-dynamic-provisioner
                 pv.kubernetes.io/bound-by-controller: yes
                 pv.kubernetes.io/provisioned-by: kubernetes.io/vsphere-volume
Finalizers:      [kubernetes.io/pv-protection kubernetes.io/pv-controller]
StorageClass:    vcp-sc
Status:          Bound
Claim:           default/vcp-pvc-1
Reclaim Policy:  Delete
Access Modes:    RWO
VolumeMode:      Filesystem
Capacity:        1Gi
Node Affinity:   <none>
Message:
Source:
    Type:               vSphereVolume (a Persistent Disk resource in vSphere)
    VolumePath:         [vsanDatastore] d49c4a62-166f-ce12-c464-020077ba5d46/kubernetes-dynamic-pvc-74a498d6-3929-47e8-8c02-078c1ece4d78.vmdk
    FSType:             ext4
    StoragePolicyName:  vSAN Default Storage Policy
Events:                 <none>
```

Finalizer `external-provisioner.volume.kubernetes.io/finalizer` được thêm vào cho các CSI volume.
Sau đây là một ví dụ:

```shell
Name:            pvc-2f0bab97-85a8-4552-8044-eb8be45cf48d
Labels:          <none>
Annotations:     pv.kubernetes.io/provisioned-by: csi.vsphere.vmware.com
Finalizers:      [kubernetes.io/pv-protection external-provisioner.volume.kubernetes.io/finalizer]
StorageClass:    fast
Status:          Bound
Claim:           demo-app/nginx-logs
Reclaim Policy:  Delete
Access Modes:    RWO
VolumeMode:      Filesystem
Capacity:        200Mi
Node Affinity:   <none>
Message:
Source:
    Type:              CSI (a Container Storage Interface (CSI) volume source)
    Driver:            csi.vsphere.vmware.com
    FSType:            ext4
    VolumeHandle:      44830fa8-79b4-406b-8b58-621ba25353fd
    ReadOnly:          false
    VolumeAttributes:      storage.kubernetes.io/csiProvisionerIdentity=1648442357185-8081-csi.vsphere.vmware.com
                           type=vSphere CNS Block Volume
Events:                <none>
```

Khi cờ tính năng `CSIMigration{provider}` được bật cho một in-tree volume plugin cụ thể,
finalizer `kubernetes.io/pv-controller` sẽ được thay thế bằng finalizer
`external-provisioner.volume.kubernetes.io/finalizer`.

Các finalizer đảm bảo rằng đối tượng PV chỉ bị xóa sau khi volume đã bị xóa
khỏi backend lưu trữ, với điều kiện chính sách thu hồi của PV là `Delete`. Điều này
cũng đảm bảo rằng volume bị xóa khỏi backend lưu trữ bất kể
thứ tự xóa PV và PVC.

### Đặt trước một PersistentVolume {#reserving-a-persistentvolume}

Control plane có thể [gắn các PersistentVolumeClaim với các PersistentVolume phù hợp](#binding)
trong cluster. Tuy nhiên, nếu bạn muốn một PVC gắn với một PV cụ thể, bạn cần gắn trước chúng.

Bằng cách chỉ định một PersistentVolume trong một PersistentVolumeClaim, bạn khai báo việc gắn kết
giữa PV và PVC cụ thể đó. Nếu PersistentVolume tồn tại và chưa đặt trước
PersistentVolumeClaim nào thông qua trường `claimRef` của nó, thì PersistentVolume và
PersistentVolumeClaim sẽ được gắn với nhau.

Việc gắn kết diễn ra bất kể một số tiêu chí khớp volume, bao gồm cả node affinity.
Control plane vẫn kiểm tra rằng [storage class](/docs/concepts/storage/storage-classes/),
chế độ truy cập và kích thước lưu trữ được yêu cầu là hợp lệ.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: foo-pvc
  namespace: foo
spec:
  storageClassName: "" # Phải đặt chuỗi rỗng một cách tường minh, nếu không StorageClass mặc định sẽ được đặt
  volumeName: foo-pv
  ...
```

Phương pháp này không đảm bảo bất kỳ quyền ưu tiên gắn kết nào đối với PersistentVolume.
Nếu các PersistentVolumeClaim khác có thể sử dụng PV mà bạn chỉ định, trước tiên bạn
cần đặt trước volume lưu trữ đó. Hãy chỉ định PersistentVolumeClaim liên quan
trong trường `claimRef` của PV để các PVC khác không thể gắn với nó.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: foo-pv
spec:
  storageClassName: ""
  claimRef:
    name: foo-pvc
    namespace: foo
  ...
```

Điều này hữu ích nếu bạn muốn sử dụng các PersistentVolume có `persistentVolumeReclaimPolicy` được đặt
thành `Retain`, bao gồm cả trường hợp bạn đang tái sử dụng một PV có sẵn.

### Mở rộng Persistent Volume Claim {#expanding-persistent-volumes-claims}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Hỗ trợ mở rộng PersistentVolumeClaim (PVC) được bật theo mặc định. Bạn có thể mở rộng
các loại volume sau:

* {{< glossary_tooltip text="csi" term_id="csi" >}} (bao gồm một số loại volume
đã được di chuyển sang CSI)
* flexVolume (không còn được hỗ trợ)
* portworxVolume (không còn được hỗ trợ)

Bạn chỉ có thể mở rộng một PVC nếu trường `allowVolumeExpansion` của storage class tương ứng được đặt thành true.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: example-vol-default
provisioner: vendor-name.example/magicstorage
parameters:
  resturl: "http://192.168.10.100:8080"
  restuser: ""
  secretNamespace: ""
  secretName: ""
allowVolumeExpansion: true
```

Để yêu cầu một volume lớn hơn cho PVC, hãy chỉnh sửa đối tượng PVC và chỉ định một kích thước
lớn hơn. Việc này kích hoạt mở rộng volume nằm dưới PersistentVolume tương ứng. Một
PersistentVolume mới không bao giờ được tạo để đáp ứng claim. Thay vào đó, volume hiện có sẽ được thay đổi kích thước.

{{< warning >}}
Chỉnh sửa trực tiếp kích thước của một PersistentVolume có thể ngăn việc tự động thay đổi kích thước của volume đó.
Nếu bạn chỉnh sửa dung lượng của một PersistentVolume, rồi chỉnh sửa `.spec` của
PersistentVolumeClaim tương ứng để kích thước của PersistentVolumeClaim khớp với PersistentVolume,
thì sẽ không có việc thay đổi kích thước lưu trữ nào xảy ra.
Control plane của Kubernetes sẽ thấy rằng trạng thái mong muốn của cả hai tài nguyên đã khớp nhau,
kết luận rằng kích thước volume bên dưới đã được tăng thủ công
và không cần thay đổi kích thước.
{{< /warning >}}

#### Mở rộng CSI volume {#csi-volume-expansion}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Hỗ trợ mở rộng CSI volume được bật theo mặc định, nhưng nó cũng yêu cầu
CSI driver cụ thể phải hỗ trợ mở rộng volume. Hãy tham khảo tài liệu của
CSI driver cụ thể đó để biết thêm thông tin.

#### Thay đổi kích thước volume chứa hệ thống file {#resizing-a-volume-containing-a-file-system}

Bạn chỉ có thể thay đổi kích thước các volume chứa hệ thống file nếu hệ thống file đó là XFS, Ext3, hoặc Ext4.

Khi một volume chứa hệ thống file, hệ thống file chỉ được thay đổi kích thước khi một Pod mới sử dụng
PersistentVolumeClaim ở chế độ `ReadWrite`. Việc mở rộng hệ thống file được thực hiện khi Pod đang khởi động,
hoặc khi Pod đang chạy và hệ thống file bên dưới hỗ trợ mở rộng trực tuyến.

FlexVolume (không còn được hỗ trợ kể từ Kubernetes v1.23) cho phép thay đổi kích thước nếu driver được cấu hình với
khả năng `RequiresFSResize` là `true`. FlexVolume có thể được thay đổi kích thước khi Pod khởi động lại.

#### Thay đổi kích thước PersistentVolumeClaim đang được sử dụng {#resizing-an-in-use-persistentvolumeclaim}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Trong trường hợp này, bạn không cần xóa và tạo lại Pod hoặc deployment đang sử dụng PVC hiện có.
Mọi PVC đang được sử dụng sẽ tự động sẵn sàng cho Pod của nó ngay khi hệ thống file của nó đã được mở rộng.
Tính năng này không có tác dụng với các PVC không được Pod hoặc deployment nào sử dụng. Bạn phải tạo một Pod
sử dụng PVC trước khi việc mở rộng có thể hoàn tất.

Tương tự như các loại volume khác - volume FlexVolume cũng có thể được mở rộng khi đang được Pod sử dụng.

{{< note >}}
Chỉ có thể thay đổi kích thước FlexVolume khi driver bên dưới hỗ trợ thay đổi kích thước.
{{< /note >}}

#### Khôi phục khi mở rộng volume thất bại {#recovering-from-failure-when-expanding-volumes}

Nếu người dùng chỉ định một kích thước mới quá lớn mà hệ thống lưu trữ bên dưới
không thể đáp ứng, việc mở rộng PVC sẽ được thử lại liên tục cho đến khi người dùng hoặc
quản trị viên cluster thực hiện hành động nào đó. Điều này có thể không mong muốn, vì vậy
Kubernetes cung cấp các phương pháp sau để khôi phục từ những lỗi như vậy.

{{< tabs name="recovery_methods" >}}
{{% tab name="Thủ công với quyền quản trị viên cluster" %}}

Nếu việc mở rộng lưu trữ bên dưới thất bại, quản trị viên cluster có thể khôi phục thủ công
trạng thái của Persistent Volume Claim (PVC) và hủy các yêu cầu thay đổi kích thước.
Nếu không, các yêu cầu thay đổi kích thước sẽ được controller thử lại liên tục mà không cần
sự can thiệp của quản trị viên.

1. Đánh dấu PersistentVolume (PV) đã được gắn với PersistentVolumeClaim (PVC)
   bằng chính sách thu hồi `Retain`.
2. Xóa PVC. Vì PV có chính sách thu hồi `Retain` nên chúng ta sẽ không mất dữ liệu
   khi tạo lại PVC.
3. Xóa mục `claimRef` khỏi đặc tả của PV để PVC mới có thể gắn với nó.
   Việc này sẽ làm cho PV trở thành `Available`.
4. Tạo lại PVC với kích thước nhỏ hơn PV và đặt trường `volumeName` của
   PVC thành tên của PV. Việc này sẽ gắn PVC mới với PV hiện có.
5. Đừng quên khôi phục chính sách thu hồi của PV.

{{% /tab %}}
{{% tab name="Bằng cách yêu cầu mở rộng với kích thước nhỏ hơn" %}}

Nếu việc mở rộng một PVC thất bại, bạn có thể thử mở rộng lại với
kích thước nhỏ hơn giá trị đã yêu cầu trước đó. Để yêu cầu một lần mở rộng mới với
kích thước đề xuất nhỏ hơn, hãy chỉnh sửa `.spec.resources` của PVC đó và chọn một giá trị nhỏ hơn
giá trị bạn đã thử trước đó.
Điều này hữu ích nếu việc mở rộng lên giá trị cao hơn không thành công do giới hạn dung lượng.
Nếu điều đó đã xảy ra, hoặc bạn nghi ngờ rằng nó có thể đã xảy ra, bạn có thể thử mở rộng lại bằng cách chỉ định một
kích thước nằm trong giới hạn dung lượng của nhà cung cấp lưu trữ bên dưới. Bạn có thể theo dõi trạng thái của
thao tác thay đổi kích thước bằng cách theo dõi `.status.allocatedResourceStatuses` và các sự kiện trên PVC.

Lưu ý rằng,
mặc dù bạn có thể chỉ định lượng lưu trữ thấp hơn mức đã yêu cầu trước đó,
giá trị mới vẫn phải cao hơn `.status.capacity`.
Kubernetes không hỗ trợ thu nhỏ một PVC xuống dưới kích thước hiện tại của nó.
{{% /tab %}}
{{% /tabs %}}

## Các loại Persistent Volume {#types-of-persistent-volumes}

Các loại PersistentVolume được triển khai dưới dạng plugin. Kubernetes hiện hỗ trợ các plugin sau:

* [`csi`](/docs/concepts/storage/volumes/#csi) - Container Storage Interface (CSI)
* [`fc`](/docs/concepts/storage/volumes/#fc) - Lưu trữ Fibre Channel (FC)
* [`hostPath`](/docs/concepts/storage/volumes/#hostpath) - Volume HostPath
  (chỉ dùng để kiểm thử trên một node; SẼ KHÔNG HOẠT ĐỘNG trong cluster nhiều node;
  hãy cân nhắc sử dụng volume `local` thay thế)
* [`iscsi`](/docs/concepts/storage/volumes/#iscsi) - Lưu trữ iSCSI (SCSI over IP)
* [`local`](/docs/concepts/storage/volumes/#local) - các thiết bị lưu trữ cục bộ
  được mount trên node.
* [`nfs`](/docs/concepts/storage/volumes/#nfs) - Lưu trữ Network File System (NFS)

Các loại PersistentVolume sau không còn được hỗ trợ nhưng vẫn khả dụng.
Nếu bạn đang sử dụng các loại volume này, ngoại trừ `flexVolume`, `cephfs` và `rbd`,
hãy cài đặt các CSI driver tương ứng.

* [`awsElasticBlockStore`](/docs/concepts/storage/volumes/#awselasticblockstore) - AWS Elastic Block Store (EBS)
  (**di chuyển được bật theo mặc định** kể từ v1.23)
* [`azureDisk`](/docs/concepts/storage/volumes/#azuredisk) - Azure Disk
  (**di chuyển được bật theo mặc định** kể từ v1.23)
* [`azureFile`](/docs/concepts/storage/volumes/#azurefile) - Azure File
  (**di chuyển được bật theo mặc định** kể từ v1.24)
* [`cinder`](/docs/concepts/storage/volumes/#cinder) - Cinder (lưu trữ khối của OpenStack)
  (**di chuyển được bật theo mặc định** kể từ v1.21)
* [`flexVolume`](/docs/concepts/storage/volumes/#flexvolume) - FlexVolume
  (**không còn được hỗ trợ** kể từ v1.23, không có kế hoạch di chuyển và không có kế hoạch loại bỏ hỗ trợ)
* [`gcePersistentDisk`](/docs/concepts/storage/volumes/#gcePersistentDisk) - GCE Persistent Disk
  (**di chuyển được bật theo mặc định** kể từ v1.23)
* [`portworxVolume`](/docs/concepts/storage/volumes/#portworxvolume) - Volume Portworx
  (**di chuyển được bật theo mặc định** kể từ v1.31)
* [`vsphereVolume`](/docs/concepts/storage/volumes/#vspherevolume) - Volume vSphere VMDK
  (**di chuyển được bật theo mặc định** kể từ v1.25)

Các phiên bản Kubernetes cũ hơn cũng từng hỗ trợ các loại PersistentVolume in-tree sau:

* [`cephfs`](/docs/concepts/storage/volumes/#cephfs)
  (**không khả dụng** kể từ v1.31)
* `flocker` - Lưu trữ Flocker.
  (**không khả dụng** kể từ v1.25)
* `glusterfs` - Lưu trữ GlusterFS.
  (**không khả dụng** kể từ v1.26)
* `photonPersistentDisk` - Ổ đĩa persistent của Photon controller.
  (**không khả dụng** kể từ v1.15)
* `quobyte` - Volume Quobyte.
  (**không khả dụng** kể từ v1.25)
* [`rbd`](/docs/concepts/storage/volumes/#rbd) - Volume Rados Block Device (RBD)
  (**không khả dụng** kể từ v1.31)
* `scaleIO` - Volume ScaleIO.
  (**không khả dụng** kể từ v1.21)
* `storageos` - Volume StorageOS.
  (**không khả dụng** kể từ v1.25)

## Persistent Volume {#persistent-volumes}

Mỗi PV chứa một spec và một status, tức là đặc tả và trạng thái của volume.
Tên của một đối tượng PersistentVolume phải là một
[tên DNS subdomain](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) hợp lệ.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv0003
spec:
  capacity:
    storage: 5Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Recycle
  storageClassName: slow
  mountOptions:
    - hard
    - nfsvers=4.1
  nfs:
    path: /tmp
    server: 172.17.0.2
```

{{< note >}}
Có thể cần các chương trình hỗ trợ liên quan đến loại volume để sử dụng
một PersistentVolume trong cluster. Trong ví dụ này, PersistentVolume
thuộc loại NFS và cần chương trình hỗ trợ /sbin/mount.nfs để hỗ trợ
việc mount hệ thống file NFS.
{{< /note >}}

### Dung lượng {#capacity}

Thông thường, một PV sẽ có một dung lượng lưu trữ cụ thể. Dung lượng này được đặt bằng thuộc tính
`capacity` của PV, là một giá trị {{< glossary_tooltip term_id="quantity" >}}.

Hiện tại, kích thước lưu trữ là tài nguyên duy nhất có thể được đặt hoặc yêu cầu.
Các thuộc tính trong tương lai có thể bao gồm IOPS, thông lượng, v.v.

### Chế độ volume {#volume-mode}

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

Kubernetes hỗ trợ hai `volumeModes` cho PersistentVolume: `Filesystem` và `Block`.

`volumeMode` là một tham số API tùy chọn.
`Filesystem` là chế độ mặc định được dùng khi bỏ qua tham số `volumeMode`.

Một volume với `volumeMode: Filesystem` được *mount* vào một thư mục trong Pod. Nếu volume
dựa trên một thiết bị khối (block device) và thiết bị đó trống, Kubernetes sẽ tạo một hệ thống file
trên thiết bị trước khi mount nó lần đầu tiên.

Bạn có thể đặt giá trị của `volumeMode` thành `Block` để sử dụng volume như một thiết bị khối thô (raw block device).
Volume như vậy được trình bày trong Pod dưới dạng một thiết bị khối, không có hệ thống file nào trên đó.
Chế độ này hữu ích để cung cấp cho Pod cách nhanh nhất có thể để truy cập volume, mà không có
lớp hệ thống file nào giữa Pod và volume. Mặt khác, ứng dụng
chạy trong Pod phải biết cách xử lý một thiết bị khối thô.
Xem [Hỗ trợ raw block volume](#raw-block-volume-support)
để biết ví dụ về cách sử dụng volume với `volumeMode: Block` trong Pod.

### Chế độ truy cập {#access-modes}

Một PersistentVolume có thể được mount trên một host theo bất kỳ cách nào mà nhà cung cấp
tài nguyên hỗ trợ. Như trong bảng dưới đây, các nhà cung cấp sẽ có những khả năng khác nhau
và chế độ truy cập của mỗi PV được đặt theo các chế độ cụ thể mà volume đó
hỗ trợ. Ví dụ, NFS có thể hỗ trợ nhiều client đọc/ghi, nhưng một
PV NFS cụ thể có thể được export trên server ở chế độ chỉ đọc. Mỗi PV có tập hợp
chế độ truy cập riêng mô tả khả năng của chính PV đó.

Các chế độ truy cập gồm:

`ReadWriteOnce`
: volume có thể được mount ở chế độ đọc-ghi bởi một node duy nhất. Chế độ truy cập ReadWriteOnce
  vẫn có thể cho phép nhiều pod truy cập (đọc hoặc ghi) volume đó khi các pod
  chạy trên cùng một node. Để chỉ một pod truy cập, hãy xem ReadWriteOncePod.

`ReadOnlyMany`
: volume có thể được mount ở chế độ chỉ đọc bởi nhiều node.

`ReadWriteMany`
: volume có thể được mount ở chế độ đọc-ghi bởi nhiều node.

 `ReadWriteOncePod`
: {{< feature-state for_k8s_version="v1.29" state="stable" >}}
  volume có thể được mount ở chế độ đọc-ghi bởi một Pod duy nhất. Hãy dùng chế độ truy cập
  ReadWriteOncePod nếu bạn muốn đảm bảo rằng chỉ một pod trong toàn bộ cluster có thể
  đọc hoặc ghi vào PVC đó.

{{< note >}}
Chế độ truy cập `ReadWriteOncePod` chỉ được hỗ trợ cho
các {{< glossary_tooltip text="CSI" term_id="csi" >}} volume và Kubernetes phiên bản
1.22 trở lên. Để sử dụng tính năng này, bạn cần cập nhật các
[CSI sidecar](https://kubernetes-csi.github.io/docs/sidecar-containers.html) sau
lên các phiên bản này hoặc mới hơn:

* [csi-provisioner:v3.0.0+](https://github.com/kubernetes-csi/external-provisioner/releases/tag/v3.0.0)
* [csi-attacher:v3.3.0+](https://github.com/kubernetes-csi/external-attacher/releases/tag/v3.3.0)
* [csi-resizer:v1.3.0+](https://github.com/kubernetes-csi/external-resizer/releases/tag/v1.3.0)
{{< /note >}}

Trong CLI, các chế độ truy cập được viết tắt như sau:

* RWO - ReadWriteOnce
* ROX - ReadOnlyMany
* RWX - ReadWriteMany
* RWOP - ReadWriteOncePod

{{< note >}}
Kubernetes sử dụng chế độ truy cập của volume để khớp PersistentVolumeClaim với PersistentVolume.
Trong một số trường hợp, chế độ truy cập của volume cũng giới hạn nơi PersistentVolume có thể được mount.
Chế độ truy cập của volume **không** áp đặt cơ chế chống ghi sau khi lưu trữ đã được mount.
Ngay cả khi chế độ truy cập được chỉ định là ReadWriteOnce, ReadOnlyMany, hoặc ReadWriteMany,
chúng không đặt ra bất kỳ ràng buộc nào lên volume. Ví dụ, ngay cả khi một PersistentVolume được
tạo với ReadOnlyMany, không có gì đảm bảo rằng nó sẽ ở chế độ chỉ đọc. Nếu chế độ truy cập
được chỉ định là ReadWriteOncePod, volume sẽ bị ràng buộc và chỉ có thể được mount trên một Pod duy nhất.
{{< /note >}}

> __Quan trọng!__ Một volume chỉ có thể được mount bằng một chế độ truy cập tại một thời điểm,
> ngay cả khi nó hỗ trợ nhiều chế độ.

| Volume Plugin        | ReadWriteOnce          | ReadOnlyMany          | ReadWriteMany | ReadWriteOncePod       |
| :---                 | :---:                  | :---:                 | :---:         | -                      |
| AzureFile            | &#x2713;               | &#x2713;              | &#x2713;      | -                      |
| CephFS               | &#x2713;               | &#x2713;              | &#x2713;      | -                      |
| CSI                  | tùy thuộc vào driver   | tùy thuộc vào driver  | tùy thuộc vào driver | tùy thuộc vào driver |
| FC                   | &#x2713;               | &#x2713;              | -             | -                      |
| FlexVolume           | &#x2713;               | &#x2713;              | tùy thuộc vào driver | -               |
| HostPath             | &#x2713;               | -                     | -             | -                      |
| iSCSI                | &#x2713;               | &#x2713;              | -             | -                      |
| NFS                  | &#x2713;               | &#x2713;              | &#x2713;      | -                      |
| RBD                  | &#x2713;               | &#x2713;              | -             | -                      |
| VsphereVolume        | &#x2713;               | -                     | - (hoạt động khi các Pod được đặt cùng chỗ) | - |
| PortworxVolume       | &#x2713;               | -                     | &#x2713;      | -                  | - |

### Class {#class}

Một PV có thể có một class, được chỉ định bằng cách đặt
thuộc tính `storageClassName` thành tên của một
[StorageClass](/docs/concepts/storage/storage-classes/).
Một PV thuộc một class cụ thể chỉ có thể được gắn với các PVC yêu cầu
class đó. Một PV không có `storageClassName` thì không có class và chỉ có thể được gắn
với các PVC không yêu cầu class cụ thể nào.

Trước đây, annotation `volume.beta.kubernetes.io/storage-class` được dùng thay
cho thuộc tính `storageClassName`. Annotation này vẫn hoạt động; tuy nhiên,
nó sẽ hoàn toàn không còn được hỗ trợ trong một bản phát hành Kubernetes tương lai.

### Chính sách thu hồi {#reclaim-policy}

Các chính sách thu hồi hiện tại gồm:

* Retain -- thu hồi thủ công
* Recycle -- xóa cơ bản (`rm -rf /thevolume/*`)
* Delete -- xóa volume

Với Kubernetes {{< skew currentVersion >}}, chỉ các loại volume `nfs` và `hostPath` hỗ trợ tái chế.

### Tùy chọn mount {#mount-options}

Quản trị viên Kubernetes có thể chỉ định các tùy chọn mount bổ sung khi một
Persistent Volume được mount trên một node.

{{< note >}}
Không phải loại Persistent Volume nào cũng hỗ trợ tùy chọn mount.
{{< /note >}}

Các loại volume sau hỗ trợ tùy chọn mount:

* `csi` (bao gồm các loại volume đã được di chuyển sang CSI)
* `iscsi`
* `nfs`

Tùy chọn mount không được xác thực. Nếu một tùy chọn mount không hợp lệ, việc mount sẽ thất bại.

Trước đây, annotation `volume.beta.kubernetes.io/mount-options` được dùng thay
cho thuộc tính `mountOptions`. Annotation này vẫn hoạt động; tuy nhiên,
nó sẽ hoàn toàn không còn được hỗ trợ trong một bản phát hành Kubernetes tương lai.

### Node affinity {#node-affinity}

{{< note >}}
Với hầu hết các loại volume, bạn không cần đặt trường này.
Bạn cần đặt trường này một cách tường minh cho các volume [local](/docs/concepts/storage/volumes/#local).
{{< /note >}}

Một PV có thể chỉ định node affinity để xác định các ràng buộc giới hạn những node nào
có thể truy cập volume này. Các Pod sử dụng một PV sẽ chỉ được lập lịch lên các node
được node affinity chọn. Để chỉ định node affinity, hãy đặt
`nodeAffinity` trong `.spec` của PV. Tài liệu tham khảo API
[PersistentVolume](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-v1/#PersistentVolumeSpec)
có thêm chi tiết về trường này.

#### Cập nhật node affinity {#updates-to-node-affinity}

{{< feature-state feature_gate_name="MutablePVNodeAffinity" >}}

Nếu [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `MutablePVNodeAffinity` được bật trong cluster của bạn,
trường `.spec.nodeAffinity` của một PersistentVolume có thể thay đổi được.
Điều này cho phép quản trị viên cluster hoặc controller lưu trữ bên ngoài cập nhật node affinity của một PersistentVolume khi dữ liệu được di chuyển,
mà không làm gián đoạn các pod đang chạy.

Khi cập nhật node affinity, bạn nên đảm bảo rằng node affinity mới vẫn khớp với các node mà volume hiện đang được sử dụng.
Với các pod vi phạm affinity mới, nếu pod đã đang chạy thì nó có thể tiếp tục chạy. Nhưng Kubernetes không hỗ trợ cấu hình này.
Bạn nên sớm chấm dứt các pod vi phạm.
Do cơ chế cache trong bộ nhớ, các pod được tạo sau khi cập nhật vẫn có thể được lập lịch theo node affinity cũ trong một khoảng thời gian ngắn.

Để sử dụng tính năng này, bạn nên bật feature gate `MutablePVNodeAffinity` trên các thành phần sau:

- `kube-apiserver`
- `kubelet`

### Giai đoạn {#phase}

Một PersistentVolume sẽ ở một trong các giai đoạn (phase) sau:

`Available`
: một tài nguyên rảnh, chưa được gắn với claim nào

`Bound`
: volume đã được gắn với một claim

`Released`
: claim đã bị xóa, nhưng tài nguyên lưu trữ liên quan chưa được cluster thu hồi

`Failed`
: volume đã thất bại trong quá trình thu hồi (tự động)

Bạn có thể xem tên của PVC được gắn với PV bằng lệnh `kubectl describe persistentvolume <name>`.

#### Dấu thời gian chuyển giai đoạn {#phase-transition-timestamp}

{{< feature-state feature_gate_name="PersistentVolumeLastPhaseTransitionTime" >}}

Trường `.status` của một PersistentVolume có thể bao gồm trường alpha `lastPhaseTransitionTime`. Trường này ghi lại
dấu thời gian của lần cuối cùng volume chuyển giai đoạn. Với các volume
mới được tạo, giai đoạn được đặt là `Pending` và `lastPhaseTransitionTime` được đặt là
thời điểm hiện tại.

## PersistentVolumeClaim {#persistentvolumeclaims}

Mỗi PVC chứa một spec và một status, tức là đặc tả và trạng thái của claim.
Tên của một đối tượng PersistentVolumeClaim phải là một
[tên DNS subdomain](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) hợp lệ.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: myclaim
spec:
  accessModes:
    - ReadWriteOnce
  volumeMode: Filesystem
  resources:
    requests:
      storage: 8Gi
  storageClassName: slow
  selector:
    matchLabels:
      release: "stable"
    matchExpressions:
      - {key: environment, operator: In, values: [dev]}
```

### Chế độ truy cập {#access-modes-1}

Claim sử dụng [cùng quy ước như volume](#access-modes) khi yêu cầu
lưu trữ với các chế độ truy cập cụ thể.

### Chế độ volume {#volume-modes}

Claim sử dụng [cùng quy ước như volume](#volume-mode) để cho biết
volume được sử dụng dưới dạng hệ thống file hay thiết bị khối.

### Tên volume {#volume-name}

Claim có thể sử dụng trường `volumeName` để gắn một cách tường minh với một PersistentVolume cụ thể. Bạn cũng có thể để
`volumeName` trống, cho biết rằng bạn muốn Kubernetes thiết lập một PersistentVolume mới
khớp với claim.
Nếu PV được chỉ định đã được gắn với một PVC khác, việc gắn kết sẽ bị kẹt
ở trạng thái chờ (pending).

### Tài nguyên {#resources}

Giống như Pod, claim có thể yêu cầu một lượng tài nguyên cụ thể. Trong trường hợp này,
yêu cầu là dành cho lưu trữ. Cùng một
[mô hình tài nguyên](https://git.k8s.io/design-proposals-archive/scheduling/resources.md)
áp dụng cho cả volume và claim.

{{< note >}}
Với các volume `Filesystem`, yêu cầu lưu trữ đề cập đến kích thước volume "bên ngoài"
(tức là kích thước được cấp phát từ backend lưu trữ).
Điều này có nghĩa là kích thước có thể ghi được có thể thấp hơn một chút đối với các nhà cung cấp
xây dựng hệ thống file trên một thiết bị khối, do chi phí phụ trội của hệ thống file.
Điều này đặc biệt dễ thấy với XFS, nơi nhiều tính năng siêu dữ liệu (metadata) được bật theo mặc định.
{{< /note >}}

### Selector {#selector}

Claim có thể chỉ định một
[label selector](/docs/concepts/overview/working-with-objects/labels/#label-selectors)
để lọc thêm tập hợp các volume.
Chỉ những volume có label khớp với selector mới có thể được gắn với claim.
Selector có thể gồm hai trường:

* `matchLabels` - volume phải có một label với giá trị này
* `matchExpressions` - một danh sách các yêu cầu được tạo bằng cách chỉ định key, danh sách giá trị,
  và toán tử liên hệ giữa key và các giá trị.
  Các toán tử hợp lệ gồm `In`, `NotIn`, `Exists` và `DoesNotExist`.

Tất cả các yêu cầu, từ cả `matchLabels` và `matchExpressions`, được
kết hợp bằng phép AND – tất cả đều phải được thỏa mãn thì mới khớp.

### Class {#class-1}

Một claim có thể yêu cầu một class cụ thể bằng cách chỉ định tên của một
[StorageClass](/docs/concepts/storage/storage-classes/)
qua thuộc tính `storageClassName`.
Chỉ những PV thuộc class được yêu cầu, tức là những PV có cùng `storageClassName` với PVC,
mới có thể được gắn với PVC.

PVC không nhất thiết phải yêu cầu một class. Một PVC có `storageClassName` được đặt
bằng `""` luôn được hiểu là đang yêu cầu một PV không có class, do đó nó
chỉ có thể được gắn với các PV không có class (không có annotation hoặc annotation được đặt bằng `""`).
Một PVC không có `storageClassName` thì không hoàn toàn giống vậy và được cluster
xử lý khác đi, tùy thuộc vào việc
[admission plugin `DefaultStorageClass`](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)
có được bật hay không.

* Nếu admission plugin được bật, quản trị viên có thể chỉ định một StorageClass mặc định.
  Tất cả các PVC không có `storageClassName` chỉ có thể được gắn với các PV thuộc class mặc định đó.
  Việc chỉ định StorageClass mặc định được thực hiện bằng cách đặt annotation
  `storageclass.kubernetes.io/is-default-class` bằng `true` trong một đối tượng StorageClass.
  Nếu quản trị viên không chỉ định class mặc định, cluster sẽ phản hồi việc tạo PVC
  như thể admission plugin đã bị tắt.
  Nếu có nhiều hơn một StorageClass mặc định được chỉ định, class mặc định mới nhất sẽ được dùng khi
  PVC được cấp phát động.
* Nếu admission plugin bị tắt, sẽ không có khái niệm StorageClass mặc định.
  Tất cả các PVC có `storageClassName` được đặt thành `""` chỉ có thể được gắn với các PV
  cũng có `storageClassName` được đặt thành `""`.
  Tuy nhiên, các PVC thiếu `storageClassName` có thể được cập nhật sau khi StorageClass mặc định khả dụng.
  Nếu PVC được cập nhật, nó sẽ không còn gắn với các PV có `storageClassName` cũng được đặt thành `""`.

Xem [gán StorageClass mặc định hồi tố](#retroactive-default-storageclass-assignment) để biết thêm chi tiết.

Tùy thuộc vào phương thức cài đặt, một StorageClass mặc định có thể được addon manager triển khai
vào cluster Kubernetes trong quá trình cài đặt.

Khi một PVC chỉ định một `selector` ngoài việc yêu cầu một StorageClass,
các yêu cầu được kết hợp bằng phép AND: chỉ một PV thuộc class được yêu cầu và có
các label được yêu cầu mới có thể được gắn với PVC.

{{< note >}}
Hiện tại, một PVC có `selector` không rỗng không thể được cấp phát động một PV.
{{< /note >}}

Trước đây, annotation `volume.beta.kubernetes.io/storage-class` được dùng thay
cho thuộc tính `storageClassName`. Annotation này vẫn hoạt động; tuy nhiên,
nó sẽ không được hỗ trợ trong một bản phát hành Kubernetes tương lai.

#### Gán StorageClass mặc định hồi tố {#retroactive-default-storageclass-assignment}

{{< feature-state for_k8s_version="v1.28" state="stable" >}}

Bạn có thể tạo một PersistentVolumeClaim mà không chỉ định `storageClassName`
cho PVC mới, và bạn có thể làm vậy ngay cả khi không có StorageClass mặc định nào tồn tại
trong cluster của bạn. Trong trường hợp này, PVC mới được tạo đúng như bạn đã định nghĩa, và
`storageClassName` của PVC đó vẫn chưa được đặt cho đến khi có class mặc định.

Khi một StorageClass mặc định trở nên khả dụng, control plane sẽ xác định mọi
PVC hiện có không có `storageClassName`. Với các PVC có giá trị rỗng
cho `storageClassName` hoặc không có key này, control plane sau đó sẽ
cập nhật các PVC đó để đặt `storageClassName` khớp với StorageClass mặc định mới.
Nếu bạn có một PVC hiện có với `storageClassName` là `""`, và bạn cấu hình
một StorageClass mặc định, thì PVC này sẽ không được cập nhật.

Để tiếp tục gắn với các PV có `storageClassName` được đặt thành `""`
(trong khi có một StorageClass mặc định), bạn cần đặt `storageClassName`
của PVC liên quan thành `""`.

Hành vi này giúp quản trị viên thay đổi StorageClass mặc định bằng cách xóa
class cũ trước rồi tạo hoặc đặt một class khác. Khoảng thời gian ngắn
không có class mặc định này khiến các PVC không có `storageClassName` được tạo vào lúc đó
không có class mặc định nào, nhưng nhờ việc gán StorageClass mặc định
hồi tố, cách thay đổi class mặc định này là an toàn.

### Theo dõi PVC không được sử dụng {#unused-pvc-tracking}

{{< feature-state feature_gate_name="PersistentVolumeClaimUnusedSinceTime" >}}

Khi được bật, PVC protection controller sẽ thêm một
[condition](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions) `Unused` vào mỗi
PersistentVolumeClaim để cho biết liệu nó hiện có đang được tham chiếu bởi
Pod nào chưa ở trạng thái kết thúc (non-terminal) hay không.

Condition này có hai trạng thái:

`Unused` với status `"True"` (reason `NoPodsUsingPVC`)
: Không có Pod chưa kết thúc nào tham chiếu đến PVC này. `lastTransitionTime` ghi lại thời điểm
  PVC trở nên không được sử dụng.

`Unused` với status `"False"` (reason `PodUsingPVC`)
: Có ít nhất một Pod chưa kết thúc hiện đang tham chiếu đến PVC này.
  `lastTransitionTime` ghi lại thời điểm PVC bắt đầu được sử dụng.

Một Pod được coi là chưa kết thúc nếu giai đoạn của nó không phải là `Succeeded` hoặc `Failed`.
Điều này có nghĩa là một Pod ở trạng thái Pending (kể cả Pod chưa được lập lịch) cũng được tính
là đang sử dụng PVC.

`lastTransitionTime` của condition `Unused` có thể được quản trị viên cluster,
các công cụ giám sát và các controller bên ngoài sử dụng để xác định những PVC
đã không được sử dụng trong thời gian dài. Ví dụ, để tìm tất cả các PVC đã
không được sử dụng hơn 30 ngày, bạn có thể truy vấn các PVC có condition `Unused`
với `status: "True"` và `lastTransitionTime` cũ hơn 30 ngày.

{{< note >}}
Khoảng thời gian không sử dụng mà condition này cho biết có thể ngắn hơn thời gian
không sử dụng thực tế do độ trễ xử lý trong controller hoặc do
tính năng được bật sau khi PVC đã không được sử dụng. Condition này không được
cập nhật khi PVC có `deletionTimestamp` được đặt (tức là các PVC đang bị xóa).
{{< /note >}}

## Claim dưới dạng volume {#claims-as-volumes}

Pod truy cập lưu trữ bằng cách sử dụng claim như một volume. Claim phải tồn tại trong
cùng namespace với Pod sử dụng claim đó. Cluster tìm claim trong
namespace của Pod và sử dụng nó để lấy PersistentVolume nằm dưới claim.
Sau đó volume được mount vào host và vào Pod.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
    - name: myfrontend
      image: nginx
      volumeMounts:
      - mountPath: "/var/www/html"
        name: mypd
  volumes:
    - name: mypd
      persistentVolumeClaim:
        claimName: myclaim
```

### Lưu ý về namespace {#a-note-on-namespaces}

Việc gắn kết PersistentVolume là độc quyền, và vì PersistentVolumeClaim là
các đối tượng thuộc namespace, việc mount claim với các chế độ "Many" (`ROX`, `RWX`) chỉ
có thể thực hiện trong phạm vi một namespace.

### PersistentVolume loại `hostPath` {#persistentvolumes-typed-hostpath}

Một PersistentVolume `hostPath` sử dụng một file hoặc thư mục trên Node để mô phỏng
lưu trữ gắn qua mạng. Xem
[ví dụ về volume loại `hostPath`](/docs/tutorials/configuration/configure-persistent-volume-storage/#create-a-persistentvolume).


## Hỗ trợ raw block volume {#raw-block-volume-support}

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

Các volume plugin sau hỗ trợ raw block volume, bao gồm cả cấp phát động khi
có thể áp dụng:

* CSI (bao gồm một số loại volume đã được di chuyển sang CSI)
* FC (Fibre Channel)
* iSCSI
* Local volume

### PersistentVolume sử dụng raw block volume {#persistent-volume-using-a-raw-block-volume}

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: block-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  volumeMode: Block
  persistentVolumeReclaimPolicy: Retain
  fc:
    targetWWNs: ["50060e801049cfd1"]
    lun: 0
    readOnly: false
```

### PersistentVolumeClaim yêu cầu raw block volume {#persistent-volume-claim-requesting-a-raw-block-volume}

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: block-pvc
spec:
  accessModes:
    - ReadWriteOnce
  volumeMode: Block
  resources:
    requests:
      storage: 10Gi
```

### Đặc tả Pod thêm đường dẫn raw block device trong container {#pod-specification-adding-raw-block-device-path-in-container}

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-block-volume
spec:
  containers:
    - name: fc-container
      image: fedora:26
      command: ["/bin/sh", "-c"]
      args: [ "tail -f /dev/null" ]
      volumeDevices:
        - name: data
          devicePath: /dev/xvda
  volumes:
    - name: data
      persistentVolumeClaim:
        claimName: block-pvc
```

{{< note >}}
Khi thêm một raw block device cho Pod, bạn chỉ định đường dẫn thiết bị trong
container thay vì đường dẫn mount.
{{< /note >}}

### Gắn kết block volume {#binding-block-volumes}

Nếu người dùng yêu cầu một raw block volume bằng cách chỉ định điều này qua trường `volumeMode`
trong đặc tả PersistentVolumeClaim, các quy tắc gắn kết sẽ hơi khác so với
các bản phát hành trước, vốn không coi chế độ này là một phần của đặc tả.
Dưới đây là bảng các tổ hợp mà người dùng và quản trị viên có thể chỉ định khi
yêu cầu một raw block device. Bảng cho biết volume có được gắn hay
không với từng tổ hợp: Ma trận gắn kết volume cho các volume được cấp phát tĩnh:

| PV volumeMode | PVC volumeMode  | Kết quả          |
| --------------|:---------------:| ----------------:|
|   không chỉ định | không chỉ định | GẮN KẾT       |
|   không chỉ định | Block        | KHÔNG GẮN KẾT    |
|   không chỉ định | Filesystem   | GẮN KẾT          |
|   Block       | không chỉ định  | KHÔNG GẮN KẾT    |
|   Block       | Block           | GẮN KẾT          |
|   Block       | Filesystem      | KHÔNG GẮN KẾT    |
|   Filesystem  | Filesystem      | GẮN KẾT          |
|   Filesystem  | Block           | KHÔNG GẮN KẾT    |
|   Filesystem  | không chỉ định  | GẮN KẾT          |

{{< note >}}
Chỉ các volume được cấp phát tĩnh mới được hỗ trợ trong bản phát hành alpha. Quản trị viên
nên cân nhắc kỹ các giá trị này khi làm việc với raw block device.
{{< /note >}}

## Hỗ trợ volume snapshot và khôi phục volume từ snapshot {#volume-snapshot-and-restore-volume-from-snapshot-support}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

Volume snapshot chỉ hỗ trợ các CSI volume plugin out-of-tree.
Để biết chi tiết, xem [Volume Snapshot](/docs/concepts/storage/volume-snapshots/).
Các in-tree volume plugin không còn được hỗ trợ. Bạn có thể đọc về các volume plugin
không còn được hỗ trợ trong
[Câu hỏi thường gặp về Volume Plugin](https://github.com/kubernetes/community/blob/main/sig-storage/volume-plugin-faq.md).

### Tạo PersistentVolumeClaim từ volume snapshot {#create-persistent-volume-claim-from-volume-snapshot}

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: restore-pvc
spec:
  storageClassName: csi-hostpath-sc
  dataSource:
    name: new-snapshot-test
    kind: VolumeSnapshot
    apiGroup: snapshot.storage.k8s.io
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

## Nhân bản volume {#volume-cloning}

[Nhân bản volume (volume cloning)](/docs/concepts/storage/volume-pvc-datasource/)
chỉ khả dụng cho các CSI volume plugin.

### Tạo PersistentVolumeClaim từ một PVC có sẵn {#create-persistent-volume-claim-from-an-existing-pvc}

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: cloned-pvc
spec:
  storageClassName: my-csi-plugin
  dataSource:
    name: existing-src-pvc-name
    kind: PersistentVolumeClaim
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

## Volume populator và nguồn dữ liệu {#volume-populators-and-data-sources}

[Nhân bản volume](#volume-cloning) và
[khôi phục snapshot](#volume-snapshot-and-restore-volume-from-snapshot-support) điền sẵn dữ liệu
cho một volume mới từ một _nguồn dữ liệu_ (data source) có sẵn. _Volume populator_ mở rộng cơ chế này để
một PersistentVolumeClaim có thể được điền sẵn dữ liệu từ các loại nguồn khác (một custom resource),
được tham chiếu thông qua trường `dataSourceRef` của nó:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: populated-pvc
spec:
  dataSourceRef:
    name: example-name
    kind: ExampleDataSource
    apiGroup: example.storage.k8s.io
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

Để biết chi tiết, bao gồm cả nguồn dữ liệu xuyên namespace, xem
[Volume Populator và nguồn dữ liệu](/docs/concepts/storage/volume-populators-and-data-sources/).

## Viết cấu hình di động {#writing-portable-configuration}

Nếu bạn đang viết các bản mẫu cấu hình hoặc ví dụ chạy trên nhiều loại cluster khác nhau
và cần lưu trữ persistent, bạn nên sử dụng mô hình sau:

- Đưa các đối tượng PersistentVolumeClaim vào gói cấu hình của bạn (cùng với
  Deployment, ConfigMap, v.v.).
- Không đưa các đối tượng PersistentVolume vào cấu hình, vì người dùng khởi tạo
  cấu hình có thể không có quyền tạo PersistentVolume.
- Cho người dùng tùy chọn cung cấp tên storage class khi khởi tạo
  bản mẫu.
  - Nếu người dùng cung cấp tên storage class, hãy đặt giá trị đó vào
    trường `persistentVolumeClaim.storageClassName`.
    Điều này sẽ khiến PVC khớp với storage class
    phù hợp nếu cluster có StorageClass được quản trị viên bật.
  - Nếu người dùng không cung cấp tên storage class, hãy để trường
    `persistentVolumeClaim.storageClassName` là nil. Điều này sẽ khiến một
    PV được tự động cấp phát cho người dùng với StorageClass mặc định
    trong cluster. Nhiều môi trường cluster có cài đặt sẵn một StorageClass mặc định,
    hoặc quản trị viên có thể tạo StorageClass mặc định của riêng họ.
- Trong công cụ của bạn, hãy theo dõi các PVC không được gắn sau một khoảng thời gian
  và thông báo điều này cho người dùng, vì điều này có thể cho thấy cluster không có
  hỗ trợ lưu trữ động (trong trường hợp đó người dùng nên tạo một PV phù hợp)
  hoặc cluster không có hệ thống lưu trữ (trong trường hợp đó người dùng không thể triển khai
  cấu hình yêu cầu PVC).

## {{% heading "whatsnext" %}}

* Tìm hiểu thêm về [Tạo một PersistentVolume](/docs/tutorials/configuration/configure-persistent-volume-storage/#create-a-persistentvolume).
* Tìm hiểu thêm về [Tạo một PersistentVolumeClaim](/docs/tutorials/configuration/configure-persistent-volume-storage/#create-a-persistentvolumeclaim).
* Đọc [tài liệu thiết kế Persistent Storage](https://git.k8s.io/design-proposals-archive/storage/persistent-storage.md).

### Tài liệu tham khảo API {#reference}

Đọc về các API được mô tả trong trang này:

* [`PersistentVolume`](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-v1/)
* [`PersistentVolumeClaim`](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-claim-v1/)
