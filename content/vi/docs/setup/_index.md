---
no_issue: true
title: Bắt đầu với Kubernetes
main_menu: true
weight: 20
content_type: concept
no_list: true
card:
  name: setup
  weight: 20
---

<!-- overview -->

Ở mục này chúng ta sẽ liệt kê ra những cách khác nhau để cài đặt và sử dụng Kubernetes. Khi cài đặt Kubernetes, bạn hãy lựa chọn cách thức dựa trên theo những yếu tố như: dễ dàng bảo trì, tính bảo mật, mức độ kiểm soát, tài nguyên sẵn có, cũng như trình độ chuyên môn cần thiết để vận hành và quản lý cluster.

Để triển khai (deploy) Kubernetes cluster ở máy local, trên dịch vụ điện toán đám mây (cloud) hay ở trung tâm dữ liệu của riêng bạn, hãy tải Kubernetes xuống [ở đây](/releases/download/).

Một số [components]((/docs/concepts/overview/components/)) của Kubernetes như {{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}} hoặc {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} có thể được triển khai dưới dạng container images ở trong cluster.

Chúng tôi khuyến khích bạn thực thi components dưới dạng những container images, Kubernetes sẽ quản lý những components đó. Lưu ý, không bao gồm những components có sử dụng container (đặc biệt là kubelet).

Trong trường hợp bạn không muốn tự quản lý Kubernetes cluster, bạn có thể chọn một service quản lý, bao gồm [certified platforms](/docs/setup/production-environment/turnkey-solutions/). Ngoài ra còn có các giải pháp tiêu chuẩn và tùy chỉnh khác trên nhiều môi trường điện toán đám mây (cloud), hay môi trường một máy chủ (bare metal environment) khác nhau.

<!-- body -->

## Môi trường học tập

Nếu bạn đang ở trong giai đoạn học Kubernetes, bạn có thể sử dụng những công cụ (tools) được hỗ trợ bởi cộng đồng Kubernetes, hoặc những công cụ trong hệ sinh thái để cài đặt Kubernetes cluster trên máy của bạn. [Xem thêm](/docs/tasks/tools/).

## Môi trường production

Khi đánh giá một giải pháp dành cho [môi trường production](/docs/setup/production-environment/),
bạn cần xem xét những khía cạnh về việc vận hành Kubernetes cluster (hoặc khái niệm trừu trượng của nó) mà bạn muốn tự quản lý, 
hoặc những phần nào bạn muốn để cho nhà cung cấp quản lý.

Với cluster bạn tự quản lý, công cụ hỗ trợ chính thức để triển khai (deploy) Kubernetes là [kubeadm](/docs/setup/production-environment/tools/kubeadm/).

{{% heading "whatsnext" %}}

- [Tải Kubernetes](/releases/download/)
- Tải và cài đặt công cụ (tools) bao gồm `kubectl`
- Lựa chọn [container runtime](/docs/setup/production-environment/container-runtimes/) cho cluster của bạn
- Tìm hiểu [một số cách thức cài đặt tốt](/vi/docs/setup/best-practices/) cho  cluster
