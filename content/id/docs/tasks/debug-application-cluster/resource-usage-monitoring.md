---
content_type: concept
title: Perangkat untuk Memantau Sumber Daya
---

<!-- overview -->

Untuk melukan penyekalaan aplikasi dan memberikan Service yang handal, kamu perlu
memahami bagaimana aplikasi berperilaku ketika aplikasi tersebut digelar (_deploy_). Kamu bisa memeriksa
kinerja aplikasi dalam klaster Kubernetes dengan memeriksa Container,
[Pod](/docs/user-guide/pods), [Service](/docs/user-guide/services), dan
karakteristik klaster secara keseluruhan. Kubernetes memberikan detail
informasi tentang penggunaan sumber daya dari aplikasi pada setiap level ini.
Informasi ini memungkinkan kamu untuk mengevaluasi kinerja aplikasi kamu dan
mengevaluasi di mana kemacetan dapat dihilangkan untuk meningkatkan kinerja secara keseluruhan.



<!-- body -->

Di Kubernetes, pemantauan aplikasi tidak bergantung pada satu solusi pemantauan saja. Pada klaster baru, kamu bisa menggunakan _pipeline_ [metrik sumber daya](#pipeline-metrik-sumber-daya) atau _pipeline_ [metrik penuh](#pipeline-metrik-penuh) untuk mengumpulkan statistik pemantauan.

## _Pipeline_ Metrik Sumber Daya

_Pipeline_ metrik sumber daya menyediakan sekumpulan metrik terbatas yang terkait dengan
komponen-komponen klaster seperti _controller_ [HorizontalPodAutoscaler](/id/docs/tasks/run-application/horizontal-pod-autoscaler), begitu juga dengan utilitas `kubectl top`.
Metrik ini dikumpulkan oleh memori yang ringan, jangka pendek, dalam
[_metrics-server_](https://github.com/kubernetes-incubator/metrics-server) dan
diekspos ke API `metrics.k8s.io`. 

_Metrics-server_ menemukan semua Node dalam klaster dan
bertanya ke setiap 
[kubelet](/docs/reference/command-line-tools-reference/kubelet) dari Node tentang penggunaan CPU dan
memori. Kubelet bertindak sebagai jembatan antara _control plane_ Kubernetes dan
Node, mengelola Pod dan Container yang berjalan pada sebuah mesin. Kubelet
menerjemahkan setiap Pod ke Container yang menyusunnya dan mengambil masing-masing
statistik penggunaan untuk setiap Container dari _runtime_ Container melalui
antarmuka _runtime_ Container. Kubelet mengambil informasi ini dari cAdvisor yang terintegrasi
untuk pengintegrasian Docker yang lama. Hal ini yang kemudian memperlihatkan
statistik penggunaan sumber daya dari kumpulan Pod melalui API sumber daya _metrics-server_.
API ini disediakan pada `/metrics/resource/v1beta1` pada kubelet yang terautentikasi dan
porta _read-only_.

## _Pipeline_ Metrik Penuh

_Pipeline_ metrik penuh memberi kamu akses ke metrik yang lebih banyak. Kubernetes bisa
menanggapi metrik ini secara otomatis dengan mengubah skala atau mengadaptasi klaster
berdasarkan kondisi saat ini, dengan menggunakan mekanisme seperti HorizontalPodAutoscaler.
_Pipeline_ pemantauan mengambil metrik dari kubelet dan
kemudian memgekspos ke Kubernetes melalui adaptor dengan mengimplementasikan salah satu dari API
`custom.metrics.k8s.io` atau API `external.metrics.k8s.io`.
 

[Prometheus](https://prometheus.io), sebuah proyek CNCF, yang dapat secara alami memonitor Kubernetes, Node, dan Prometheus itu sendiri.
Proyek _pipeline_ metrik penuh yang bukan merupakan bagian dari CNCF berada di luar ruang lingkup dari dokumentasi Kubernetes.


