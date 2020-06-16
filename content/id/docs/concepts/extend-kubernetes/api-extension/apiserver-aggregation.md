---
title: Memperluas Kubernetes API dengan Lapisan Agregasi
content_type: concept
weight: 10
---

<!-- overview -->

Lapisan agregasi memungkinkan Kubernetes untuk diperluas dengan API tambahan, selain dari yang ditawarkan oleh API inti Kubernetes.



<!-- body -->

## Ikhtisar
Lapisan agregasi memungkinkan instalasi tambahan beragam API _Kubernetes-style_ di kluster kamu. Tambahan-tambahan ini dapat berupa solusi-solusi yang sudah dibangun (_prebuilt_) oleh pihak ke-3 yang sudah ada, seperti [_service-catalog_](https://github.com/kubernetes-incubator/service-catalog/blob/master/README.md), atau API yang dibuat oleh pengguna seperti [apiserver-builder](https://github.com/kubernetes-incubator/apiserver-builder/blob/master/README.md), yang dapat membantu kamu memulainya.

Lapisan agregasi berjalan di dalam proses bersama dengan kube-apiserver. Hingga sebuah sumber daya ekstensi terdaftar, lapisan agregasi tidak akan melakukan apapun. Untuk mendaftarkan sebuah API, pengguna harus menambahkan sebuah objek _APIService_, yang "mengklaim" jalur URL di API Kubernetes. Pada titik tersebut, lapisan agregasi akan mem-_proxy_ apapun yang dikirim ke jalur API tersebut (misalnya /apis/myextension.mycompany.io/v1/…) ke _APIService_ yang terdaftar. 

Biasanya, _APIService_ akan diimplementasikan oleh sebuah ekstensi-apiserver di dalam sebuah Pod yang berjalan di kluster. Ekstensi-apiserver ini biasanya perlu di pasangkan dengan satu atau lebih _controller_ apabila manajemen aktif dari sumber daya tambahan diperlukan. Sebagai hasilnya, apiserver-builder sebenarnya akan memberikan kerangka untuk keduanya. Sebagai contoh lain, ketika service-catalog diinstal, ia menyediakan ekstensi-apiserver dan _controller_ untuk layanan-layanan yang disediakannya.

Ekstensi-apiserver harus memiliki latensi koneksi yang rendah dari dan ke kube-apiserver.
Secara Khusus, permintaan pencarian diperlukan untuk bolak-balik dari kube-apiserver dalam 5 detik atau kurang.
Jika implementasi kamu tidak dapat menyanggupinya, kamu harus mempertimbangkan cara mengubahnya. Untuk sekarang, menyetel
_feature-gate_ `EnableAggregatedDiscoveryTimeout=false` di kube-apiserver
akan menonaktifkan batasan waktu tersebut. Fitur ini akan dihapus dalam rilis mendatang.



## {{% heading "whatsnext" %}}


* Untuk mengaktifkan agregator di lingkungan kamu, aktifkan[konfigurasi lapisan agregasi](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/).
* Kemudian, [siapkan ekstensi api-server](/docs/tasks/access-kubernetes-api/setup-extension-api-server/) untuk bekerja dengan lapisan agregasi.
* Selain itu, pelajari caranya [mengembangkan API Kubernetes menggunakan _Custom Resource Definition_](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/).

