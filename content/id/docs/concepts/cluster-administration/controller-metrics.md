---
title: Metrik controller manager
content_template: templates/concept
weight: 100
---

{{% capture overview %}}
Metrik *controller manager* memberikan informasi penting tentang kinerja dan kesehatan dari *controller manager*.

{{% /capture %}}

{{% capture body %}}
## Tentang metrik *controller manager*

Metrik *controller manager* ini berfungsi untuk memberikan informasi penting tentang kinerja dan kesehatan dari *controller manager*.
Metrik ini juga berisi tentang metrik umum dari *runtime* bahasa pemrograman Go seperti jumlah *go_routine* dan metrik spesifik dari *controller* seperti
latensi dari etcd *request* atau latensi API dari penyedia layanan *cloud* (AWS, GCE, OpenStack) yang dapat digunakan untuk mengukur kesehatan dari kluster.

Mulai dari Kubernetes 1.7, metrik yang lebih mendetil tentang operasi penyimpanan dari penyedia layanan *cloud* juga telah tersedia.
Metrik-metrik ini dapat digunakan untuk memonitor kesehatan dari operasi *persistent volume*.

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

Pada sebuah kluster, informasi metrik *controller-manager* dapat diakses melalui `http://localhost:10252/metrics`
dari *host* tempat *controller-manager* dijalankan.

Metrik ini dikeluarkan dalam bentuk [format prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/) serta mudah untuk dibaca manusia.

Pada *environment* produksi, kamu mungkin juga ingin mengonfigurasi prometheus atau pengumpul metrik lainnya untuk mengumpulkan metrik-metrik ini secara berkala, serta mengumpulkan metrik ini dalam bentuk suatu basis data *time series* lainnya.

{{% /capture %}}
