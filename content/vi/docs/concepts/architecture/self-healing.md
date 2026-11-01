---
title: Kubernetes - Khả năng tự phục hồi (Self-Healing)
content_type: concept  
weight: 50  
feature:
  title: Tự phục hồi
  anchor: Phục hồi tự động từ lỗi
  description: >
    Kubernetes khởi động lại các container bị crash, thay thế toàn bộ Pod khi cần thiết,
    kết nối lại storage khi xảy ra các sự cố nghiêm trọng hơn, và có thể tích hợp với
    node autoscaler để tự phục hồi ngay cả ở cấp độ node.
---
<!-- overview -->

Kubernetes được thiết kế với khả năng tự phục hồi giúp duy trì tình trạng khỏe mạnh và tính khả dụng của các workload. 
Nó tự động thay thế các container bị lỗi, lập lịch lại các workload khi node trở nên không khả dụng, và đảm bảo rằng trạng thái mong muốn của hệ thống được duy trì.

<!-- body -->

## Khả năng tự phục hồi {#self-healing-capabilities} 

- **Khởi động lại ở cấp độ container:** Nếu một container bên trong Pod bị lỗi, Kubernetes sẽ khởi động lại nó dựa trên [`restartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy).

- **Thay thế replica:** Nếu một Pod trong [Deployment](/docs/concepts/workloads/controllers/deployment/) hoặc [StatefulSet](/docs/concepts/workloads/controllers/statefulset/) bị lỗi, Kubernetes sẽ tạo một Pod thay thế để duy trì số lượng replica được chỉ định.
  Nếu một Pod thuộc [DaemonSet](/docs/concepts/workloads/controllers/daemonset/) bị lỗi, control plane sẽ
  tạo một Pod thay thế để chạy trên cùng node đó.
  
- **Phục hồi persistent storage:** Nếu một node đang chạy Pod với PersistentVolume (PV) được gắn kết, và node đó bị lỗi, Kubernetes có thể gắn lại volume vào Pod mới trên node khác.

- **Cân bằng tải cho Service:** Nếu một Pod đằng sau [Service](/docs/concepts/services-networking/service/) bị lỗi, Kubernetes sẽ tự động loại bỏ nó khỏi endpoint của Service để chỉ định tuyến traffic đến các Pod khỏe mạnh.

Dưới đây là một số thành phần chính cung cấp khả năng tự phục hồi của Kubernetes:

- **[kubelet](/docs/concepts/architecture/#kubelet):** Đảm bảo rằng các container đang chạy, và khởi động lại những container bị lỗi.

- **ReplicaSet, StatefulSet và DaemonSet controller:** Duy trì số lượng replica Pod mong muốn.

- **PersistentVolume controller:** Quản lý việc gắn kết và tháo gỡ volume cho các stateful workload.

## Những điều cần cân nhắc {#considerations} 

- **Lỗi Storage:** Nếu một persistent volume trở nên không khả dụng, có thể cần các bước phục hồi thủ công.

- **Lỗi Ứng dụng:** Kubernetes có thể khởi động lại container, nhưng các vấn đề ứng dụng cơ bản phải được giải quyết riêng biệt.

## {{% heading "whatsnext" %}} 

- Đọc thêm về [Pod](/docs/concepts/workloads/pods/)
- Tìm hiểu về [Kubernetes Controller](/docs/concepts/architecture/controller/)
- Khám phá [PersistentVolume](/docs/concepts/storage/persistent-volumes/)
- Đọc về [node autoscaling](/docs/concepts/cluster-administration/node-autoscaling/). Node autoscaling
  cũng cung cấp khả năng tự phục hồi tự động nếu hoặc khi các node bị lỗi trong cluster của bạn.
