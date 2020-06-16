---
title: Metrik-Metrik untuk Control Plane Kubernetes 
content_type: concept
weight: 60
aliases:
- controller-metrics.md
---

<!-- overview -->

Metrik dari komponen sistem dapat memberikan pandangan yang lebih baik tentang apa 
yang sedang terjadi di dalam sistem. Metrik sangat berguna untuk membuat dasbor (_dashboard_) 
dan peringatan (_alert_).

Metrik di dalam _control plane_ Kubernetes disajikan dalam [format prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/) 
dan dapat terbaca oleh manusia.



<!-- body -->

## Metrik-Metrik pada Kubernetes

Dalam kebanyakan kasus, metrik tersedia pada _endpoint_ `/metrics` dari server HTTP.
Untuk komponen yang tidak mengekspos _endpoint_ secara bawaan, _endpoint_ tersebut dapat diaktifkan 
dengan menggunakan opsi `--bind-address`.

Contoh-contoh untuk komponen tersebut adalah:

* {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
* {{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}}
* {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
* {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}
* {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}

Di dalam lingkungan produksi, kamu mungkin ingin mengonfigurasi [Server Prometheus](https://prometheus.io/)
atau _scraper_ metrik (pengambil metrik) lainnya untuk mengumpulkan metrik-metrik ini secara berkala 
dan membuatnya tersedia dalam semacam basis data yang _time series_.

Perlu dicatat bahwa {{< glossary_tooltip term_id="kubelet" text="kubelet" >}} 
juga mengekspos metrik pada _endpoint-endpoint_ seperti `/metrics/cadvisor`, 
`/metrics/resource` dan `/metrics/probes`. Metrik-metrik tersebut tidak memiliki
siklus hidup yang sama.

Jika klaster kamu menggunakan {{< glossary_tooltip term_id="rbac" text="RBAC" >}}, 
untuk membaca metrik memerlukan otorisasi melalui sebuah User, Group, atau 
ServiceAccount dengan ClusterRole yang memperbolehkan mengakses `/metrics`.

Sebagai contoh:

```
apiVersion: rbac.authorization.k8s.io/v1	
kind: ClusterRole	
metadata:	
  name: prometheus	
rules:	
  - nonResourceURLs:	
      - "/metrics"	
    verbs:	
      - get
```

## Siklus Hidup (_Lifecycle_) Metrik

Alpha metric →  Stable metric →  Deprecated metric →  Hidden metric → Deletion

Metrik-metrik _Alpha_ tidak memiliki jaminan stabilitas; dengan demikian mereka 
dapat dimodifikasi atau dihapus kapan saja.

Metrik-metrik _Stable_ dijamin tidak berubah (dijamin stabilitasnya); Secara khusus, stabilitas berarti:

* metrik itu sendiri tidak akan dihapus (atau diganti namanya)
* jenis metrik tidak akan dimodifikasi

Metrik _Deprecated_ memberi penanda bahwa metrik tersebut suatu saat akan dihapus; untuk 
menemukan versi yang mana, kamu perlu memeriksa anotasi, yang mencakup dari versi 
Kubernetes mana yang metrik tersebut akan dianggap _deprecated_.

Sebelum _deprecation_:

```
# HELP some_counter this counts things
# TYPE some_counter counter
some_counter 0
```

Sesudah _deprecation_:

```
# HELP some_counter (Deprecated since 1.15.0) this counts things
# TYPE some_counter counter
some_counter 0
```

Setelah metrik disembunyikan maka secara bawaan metrik tidak dipublikasikan 
untuk _scraping_ (pengambilan metrik). Untuk menggunakan metrik yang tersembunyi, kamu perlu mengganti (_override_)
konfigurasi untuk komponen klaster yang relevan.

Setelah metrik dihapus, metrik tidak dipublikasikan. Kamu tidak dapat mengubah 
metrik tersebut dengan menggunakan _override_.

## Melihat Metrik tersembunyi

Seperti dijelaskan di atas, para admin dapat mengaktifkan metrik tersembunyi 
melalui opsi pada baris perintah (_command line_) untuk _binary_ (program) tertentu. Ini ditujukan untuk 
digunakan sebagai solusi bagi para admin apabila mereka gagal memigrasi 
metrik yang sudah _deprecated_ dalam rilis terakhir.

Opsi `show-hidden-metrics-for-version` menunjukkan versi yang ingin kamu tampilkan 
metrik yang sudah _deprecated_ dalam rilis tersebut. Versi ini ditampilkan dalam bentuk x.y, 
di mana x adalah versi _major_, y ​​adalah versi minor. Versi _patch_ tidak 
diperlukan meskipun metrik dapat di_-deprecate_ dalam rilis _patch_, hal ini
adalah karena kebijakan _deprecation_ untuk metrik hanya berlaku terhadap rilis minor.

Opsi tersebut hanya dapat menggunakan versi minor sebelumnya sebagai parameternya. Semua 
metrik yang disembunyikan di versi sebelumnya akan dikeluarkan jika para admin 
mengatur versi sebelumnya ke `show-hidden-metrics-for-version`. Versi yang 
terlalu lama tidak diizinkan karena hal ini melanggar kebijakan untuk metrik yang
sudah _deprecated_.

Ambil metrik `A` sebagai contoh, di sini diasumsikan bahwa `A` sudah _deprecated_ 
pada rilis 1.n. Menurut kebijakan metrik yang sudah _deprecated_, kita dapat mencapai kesimpulan 
sebagai berikut:

* Pada rilis `1.n`, metrik sudah di_-deprecated_, dan dapat diperlihatkan secara bawaan.
* Pada rilis `1.n + 1`, metrik disembunyikan secara bawaan dan dapat 
  diperlihatkan dengan baris perintah `show-hidden-metrics-for-version=1.n`.
* Pada rilis `1.n + 2`, metrik harus dihapus dari _codebase_. Tidak ada jalan 
  keluar lagi.

Jika kamu meng-_upgrade_ dari rilis `1.12` ke` 1.13`, tetapi masih bergantung pada
metrik `A` yang di-_deprecate_ dalam` 1.12`, kamu harus mengatur metrik 
tersembunyi melalui baris perintah: `--show-hidden-metrics=1.12` dan ingatlah 
untuk menghapus ketergantungan terhadap metrik ini sebelum meng-_upgrade_ ke `1.14`.

## Metrik komponen

### Metrik kube-controller-manager

Metrik Controller Manager memberikan pandangan penting 
tentang kinerja dan kesehatan Controller Manager. Metrik ini mencakup metrik 
_runtime_ berbahasa Go yang umum seperti jumlah _go_routine_ dan metrik khusus 
pengontrol seperti latensi _request etcd_ atau latensi API dari Cloud provider
(AWS, GCE, OpenStack) yang dapat digunakan untuk mengukur kesehatan klaster.

Mulai dari Kubernetes 1.7, metrik Cloud provider yang detail tersedia untuk 
operasi penyimpanan untuk GCE, AWS, Vsphere, dan OpenStack.
Metrik ini dapat digunakan untuk memantau kesehatan operasi PersistentVolume.

Misalnya, untuk GCE metrik tersebut adalah:

```
cloudprovider_gce_api_request_duration_seconds { request = "instance_list"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_insert"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_delete"}
cloudprovider_gce_api_request_duration_seconds { request = "attach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "detach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "list_disk"}
```



## {{% heading "whatsnext" %}}

* Baca tentang [format teks Prometheus](https://github.com/prometheus/docs/blob/master/content/docs/instrumenting/exposition_formats.md#text-based-format) untuk berbagai metrik
* Lihat daftar [metrik Kubernetes yang _stable_](https://github.com/kubernetes/kubernetes/blob/master/test/instrumentation/testdata/stable-metrics-list.yaml)
* Baca tentang [kebijakan _deprecation_ Kubernetes](https://kubernetes.io/docs/reference/using-api/deprecation-policy/#deprecating-a-feature-or-behavior )

