---
title: Metrik controller manager
content_template: templates/concept
weight: 100
---

{{% capture overview %}}
Metrik _controller manager_ memberikan informasi penting tentang kinerja dan kesehatan dari _controller manager_.

{{% /capture %}}

{{% capture body %}}
## Tentang metrik _controller manager_

Metrik _controller manager_ ini berfungsi untuk memberikan informasi penting tentang kinerja dan kesehatan dari _controller manager_.
Metrik ini juga berisi tentang metrik umum dari _runtime_ bahasa pemrograman Go seperti jumlah _go_routine_ dan metrik spesifik dari _controller_ seperti
latensi dari etcd _request_ atau latensi API dari penyedia layanan _cloud_ (AWS, GCE, OpenStack) yang dapat digunakan untuk mengukur kesehatan dari kluster.

Mulai dari Kubernetes 1.7, metrik yang lebih mendetil tentang operasi penyimpanan dari penyedia layanan _cloud_ juga telah tersedia.
Metrik-metrik ini dapat digunakan untuk memonitor kesehatan dari operasi _persistent volume_.

Berikut merupakan contoh nama metrik yang disediakan GCE:

```
cloudprovider_gce_api_request_duration_seconds { request = "instance_list"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_insert"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_delete"}
cloudprovider_gce_api_request_duration_seconds { request = "attach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "detach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "list_disk"}
```

## Konfigurasi

Pada sebuah kluster, informasi metrik _controller manager_ dapat diakses melalui `http://localhost:10252/metrics`
dari _host_ tempat _controller manager_ dijalankan.

Metrik ini dikeluarkan dalam bentuk [format prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/) serta mudah untuk dibaca manusia.

Pada _environment_ produksi, kamu mungkin juga ingin mengonfigurasi prometheus atau pengumpul metrik lainnya untuk mengumpulkan metrik-metrik ini secara berkala dalam bentuk basis data _time series_.

{{% /capture %}}
