---
title: Metrik untuk Komponen Sistem Kubernetes
content_type: concept
weight: 60
---

<!-- overview -->

Metrik dari komponen sistem dapat memberikan gambaran yang lebih baik tentang apa 
yang sedang terjadi di dalam sistem. Metrik sangat berguna untuk membuat dasbor (_dashboard_) 
dan peringatan (_alert_).

Komponen Kubernetes mengekspos metrik dalam [format Prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/).
Format ini berupa teks biasa yang terstruktur, dirancang agar orang dan mesin dapat membacanya.

<!-- body -->

## Metrik-metrik dalam Kubernetes

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
atau pengambil metrik (_metrics scraper_) lainnya untuk mengumpulkan metrik-metrik ini secara berkala 
dan membuatnya tersedia dalam semacam pangkalan data deret waktu (_time series database_).

Perlu dicatat bahwa {{< glossary_tooltip term_id="kubelet" text="kubelet" >}} 
juga mengekspos metrik pada _endpoint-endpoint_ seperti `/metrics/cadvisor`, 
`/metrics/resource` dan `/metrics/probes`. Metrik-metrik tersebut tidak memiliki
siklus hidup yang sama.

Jika klastermu menggunakan {{< glossary_tooltip term_id="rbac" text="RBAC" >}}, 
maka membaca metrik memerlukan otorisasi melalui _user_, _group_, atau 
ServiceAccount dengan ClusterRole yang memperbolehkan untuk mengakses `/metrics`.

Sebagai contoh:
```yaml
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

## Siklus hidup metrik

Metrik alfa (_alpha_) →  Metrik stabil →  Metrik usang (_deprecated_) →  Metrik tersembunyi → Metrik terhapus

Metrik alfa tidak memiliki jaminan stabilitas. Metrik ini 
dapat dimodifikasi atau dihapus kapan saja.

Metrik stabil dijamin tidak akan mengalami perubahan. Hal ini berarti:
* Metrik stabil tanpa penanda usang (_deprecated signature_) tidak akan dihapus ataupun diganti namanya
* Jenis metrik stabil tidak akan dimodifikasi

Metrik usang dijadwalkan untuk dihapus, tetapi masih tersedia untuk digunakan.
Metrik ini mencakup anotasi versi di mana metrik ini dianggap menjadi usang.

Sebagai contoh:

* Sebelum menjadi usang

  ```
  # HELP some_counter this counts things
  # TYPE some_counter counter
  some_counter 0
  ```

* Setelah menjadi usang

  ```
  # HELP some_counter (Deprecated since 1.15.0) this counts things
  # TYPE some_counter counter
  some_counter 0
  ```

Metrik tersembunyi tidak lagi dipublikasikan untuk pengambilan metrik (_scraping_), tetapi masih tersedia untuk digunakan. Untuk menggunakan metrik tersembunyi, lihat bagian [Menampilkan metrik tersembunyi](#menampilkan-metrik-tersembunyi).

Metrik yang terhapus tidak lagi dipublikasikan dan tidak dapat digunakan lagi.

## Menampilkan metrik tersembunyi

Seperti yang dijelaskan di atas, admin dapat mengaktifkan metrik tersembunyi melalui opsi baris perintah pada biner (program) tertentu. Ini dimaksudkan untuk digunakan sebagai jalan keluar bagi admin jika mereka melewatkan migrasi metrik usang dalam rilis terakhir.

Opsi `show-hidden-metrics-for-version` menerima input versi yang kamu inginkan untuk menampilkan metrik usang dalam rilis tersebut. Versi tersebut dinyatakan sebagai x.y, di mana x adalah versi mayor, y adalah versi minor. Versi _patch_ tidak diperlukan meskipun metrik dapat menjadi usang dalam rilis _patch_, alasannya adalah kebijakan penandaan metrik usang dijalankan terhadap rilis minor.

Opsi tersebut hanya dapat menerima input versi minor sebelumnya sebagai nilai. Semua metrik yang disembunyikan di versi sebelumnya akan dikeluarkan jika admin mengatur versi sebelumnya ke `show-hidden-metrics-for-version`. Versi yang terlalu lama tidak diperbolehkan karena melanggar kebijakan untuk metrik usang.

Ambil metrik `A` sebagai contoh, di sini diasumsikan bahwa `A` sudah menjadi usang di versi 1.n. Berdasarkan kebijakan metrik usang, kita dapat mencapai kesimpulan berikut:

* Pada rilis `1.n`, metrik menjadi usang, dan dapat dikeluarkan secara bawaan.
* Pada rilis `1.n+1`, metrik disembunyikan secara bawaan dan dapat dikeluarkan dengan baris perintah `show-hidden-metrics-for-version=1.n`.
* Pada rilis `1.n+2`, metrik harus dihapus dari _codebase_. Tidak ada jalan keluar lagi.

Jika kamu meningkatkan versi dari rilis `1.12` ke `1.13`, tetapi masih bergantung pada metrik `A` yang usang di `1.12`, kamu harus mengatur metrik tersembunyi melalui baris perintah: `--show-hidden-metrics = 1.12` dan ingatlah untuk menghapus ketergantungan terhadap metrik ini sebelum meningkatkan versi rilis ke `1.14`.

## Menonaktifkan metrik akselerator

kubelet mengumpulkan metrik akselerator melalui cAdvisor. Untuk mengumpulkan metrik ini, untuk akselerator seperti GPU NVIDIA, kubelet membuka koneksi dengan _driver_ GPU. Ini berarti untuk melakukan perubahan infrastruktur (misalnya, pemutakhiran _driver_), administrator klaster perlu menghentikan agen kubelet.

Pengumpulkan metrik akselerator sekarang menjadi tanggung jawab vendor dibandingkan kubelet. Vendor harus menyediakan sebuah kontainer untuk mengumpulkan metrik dan mengeksposnya ke layanan metrik (misalnya, Prometheus).

[Gerbang fitur `DisableAcceleratorUsageMetrics`](/docs/reference/command-line-tools-reference/feature-gates/) menonaktifkan metrik yang dikumpulkan oleh kubelet, dengan [lini masa (_timeline_) untuk mengaktifkan fitur ini secara bawaan](https://github.com/kubernetes/enhancements/tree/411e51027db842355bd489691af897afc1a41a5e/keps/sig-node/1867-disable-accelerator-usage-metrics#graduation-criteria).

## Metrik komponen

### Metrik kube-controller-manager

Metrik _controller manager_ memberikan gambaran penting 
tentang kinerja dan kesehatan _controller manager_. Metrik ini mencakup metrik 
_runtime_ bahasa Go yang umum seperti jumlah go_routine dan metrik khusus 
pengontrol seperti latensi permintaan etcd atau latensi API Cloudprovider
(AWS, GCE, OpenStack) yang dapat digunakan untuk mengukur kesehatan klaster.

Mulai dari Kubernetes 1.7, metrik Cloudprovider yang detail tersedia untuk 
operasi penyimpanan untuk GCE, AWS, Vsphere, dan OpenStack.
Metrik ini dapat digunakan untuk memantau kesehatan operasi _persistent volume_.

Misalnya, untuk GCE metrik-metrik berikut ini dipanggil:

```
cloudprovider_gce_api_request_duration_seconds { request = "instance_list"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_insert"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_delete"}
cloudprovider_gce_api_request_duration_seconds { request = "attach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "detach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "list_disk"}
```

### Metrik kube-scheduler

{{< feature-state for_k8s_version="v1.20" state="alpha" >}}

Penjadwal mengekspos metrik opsional yang melaporkan sumber daya yang diminta dan limit yang diinginkan dari semua pod yang berjalan. Metrik ini dapat digunakan untuk membangun dasbor perencanaan kapasitas, mengevaluasi limit penjadwalan yang digunakan saat ini atau secara historis, dengan cepat mengidentifikasi beban kerja yang tidak dapat dijadwalkan karena kurangnya sumber daya, dan membandingkan permintaan sumber daya oleh pod dengan penggunaannya yang aktual.

kube-scheduler mengidentifikasi [permintaan dan limit](/docs/concepts/configuration/manage-resources-containers/) sumber daya yang dikonfigurasi untuk setiap Pod; jika permintaan atau limit bukan nol, kube-scheduler akan melaporkan deret waktu (_timeseries_) metrik. Deret waktu diberi label dengan:
- namespace
- nama pod
- node di mana pod dijadwalkan atau _string_ kosong jika belum dijadwalkan
- prioritas
- penjadwal yang ditugaskan untuk pod itu
- nama dari sumber daya (misalnya, `cpu`)
- satuan dari sumber daya jika diketahui (misalnya, `cores`)

Setelah pod selesai (memiliki `restartPolicy` `Never` atau `OnFailure` dan berada dalam fase pod `Succeeded` atau `Failed`, atau telah dihapus dan semua kontainer dalam keadaan Terminated) deret metrik tidak lagi dilaporkan karena penjadwal sekarang sudah dibebaskan untuk menjadwalkan pod lain untuk dijalankan. Metrik yang dibahas pada bagian ini dikenal sebagai `kube_pod_resource_request` dan `kube_pod_resource_limit`.

Metrik diekspos melalui _endpoint_ HTTP `/metrics/resources` dan memerlukan otorisasi yang sama seperti endpoint `/metrics`
pada penjadwal. Kamu harus menggunakan opsi `--show-hidden-metrics-for-version=1.20` untuk mengekspos metrik-metrik stabilitas alfa ini.

## {{% heading "whatsnext" %}}

* Baca tentang [format teks Prometheus](https://github.com/prometheus/docs/blob/master/content/docs/instrumenting/exposition_formats.md#text-based-format) untuk berbagai metrik
* Baca tentang [kebijakan _deprecation_ Kubernetes](/docs/reference/using-api/deprecation-policy/#deprecating-a-feature-or-behavior)
