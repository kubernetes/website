---
title: Penyediaan Volume Dinamis
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

Penyediaan volume dinamis memungkinkan volume penyimpanan untuk dibuat sesuai permintaan (_on-demand_).
Tanpa adanya penyediaan dinamis (_dynamic provisioning_), untuk membuat volume penyimpanan baru, admin kluster secara manual harus
memanggil penyedia layanan cloud atau layanan penyimpanan, dan kemudian membuat [objek PersistentVolume](/docs/concepts/storage/persistent-volumes/)
sebagai representasi di Kubernetes. Fitur penyediaan dinamis menghilangkan kebutuhan admin kluster untuk menyediakan
penyimpanan sebelumnya (_pre-provision_). Dengan demikian, penyimpanan akan tersedia secara otomatis
ketika diminta oleh pengguna.

{{% /capture %}}


{{% capture body %}}

## Latar Belakang

Penyediaan volume dinamis diimplementasi berdasarkan objek API StorageClass dari
grup API `storage.k8s.io`. Seorang admin kluster dapat mendefinisikan berbagai macam
objek StorageClass sesuai kebutuhan, masing-masing menentukan *plugin volume* (disebut
juga *provisioner*) yang menyediakan sebuah volume beserta kumpulan parameter untuk
diteruskan oleh _provisioner_ ketika proses penyediaan.

Seorang kluster admin dapat mendefinisikan dan mengekspos berbagai templat penyimpanan
(dari sistem penyimpanan yang sama maupun berbeda) di dalam kluster, masing-masing dengan
kumpulan parameter tertentu. Desain ini memastikan bahwa pengguna tidak perlu khawatir betapa
rumitnya mekanisme penyediaan penyimpanan, tapi tetap memiliki kemampuan untuk
memilih berbagai macam pilihan penyimpanan.

Info lebih lanjut mengenai _storage class_ dapat dilihat [di sini](/docs/concepts/storage/storage-classes/).

## Mengaktifkan Penyediaan Dinamis (_Dynamic Provisioning_)

Untuk mengaktifkan penyediaan dinamis, seorang admin kluster perlu untuk
terlebih dahulu membuat (_pre-create_) satu atau beberapa objek StorageClass
untuk pengguna.
Objek StorageClass mendefinisikan _provisioner_ mana yang seharusnya digunakan
dan parameter apa yang seharusnya diberikan pada _provisioner_ tersebut saat
penyediaan dinamis dipanggil.
Manifestasi berikut ini membuat sebuah StorageClass "slow" yang
menyediakan _persistent_ disk standar.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: slow
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-standard
```

Manifestasi berikut ini membuat sebuah StorageClass "fast" yang menyediakan
SSD _persistent_ disk.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-ssd
```

## Menggunakan Penyediaan Dinamis

Pengguna dapat melakukan permintaan untuk penyediaan penyimpanan dinamis dengan
memasukkan StorageClass di dalam PersistentVolumeClaim. Sebelum Kubernetes v1.6,
ini dapat dilakukan melalui anotasi `volume.beta.kubernetes.io/storage-class`.
Hanya saja, anotasi ini sudah usang sejak v1.6. Pengguna sekarang dapat dan seharusnya
menggunakan _field_ `storageClassName` dari objek PersistentVolumeClaim. Nilai
dari _field_ ini haruslah sesuai dengan nama StorageClass yang dikonfigurasi oleh
admin (lihat bagian [di bawah](#enabling-dynamic-provisioning)).

Untuk memilih StorageClass "fast", sebagai contoh, pengguna dapat membuat
PersistentVolumeClaim seperti ini:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: claim1
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: fast
  resources:
    requests:
      storage: 30Gi
```

Klaim ini menghasilkan _persistent_ disk SSD yang disediakan secara otomatis.
Ketika klaim dihilangkan, volume akan musnah.

## Perilaku _Default_

Penyediaan dinamis dapat diaktifkan pada setiap kluster supaya semua klaim
dapat disediakan secara dinamis jika tidak ada StorageClass yang dispesifikasikan.
Seorang kluster admin dapat mengaktifkan perilaku ini dengan cara:

- Menandai satu objek StorageClass sebagai _default_;
- Memastikan bahwa [_admission controller_ `DefaultStorageClass`](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)
  telah aktif pada API server.

Seorang admin dapat menandai StorageClass yang spesifik sebagai _default_ dengan menambahkan
anotasi `storageclass.kubernetes.io/is-default-class`.
Ketika StorageClass default tersebut ada pada kluster dan pengguna membuat PersistentVolumeClaim
tanpa menspesifikasikan `storageClassName`, _admission controller_ `DefaultStorageClass` secara
otomatis menambahkan _field_ `storageClassName` dengan StorageClass _default_.

Perhatikan bahwa hanya bisa ada satu _default_ StorageClass pada sebuah kluster,
atau PersistentVolumeClaim tanpa menspesifikasikan `storageClassName` secara eksplisit
tidak bisa terbuat.

## Kesadaran (_Awareness_) Topologi

Pada kluster [Multi-Zona](/docs/setup/multiple-zones), Pod dapat tersebar di banyak Zona
pada sebuah Region. Penyimpanan dengan *backend* Zona-Tunggal seharusnya disediakan pada
Zona-Zona dimana Pod dijalankan. Hal ini dapat dicapai dengan mengatur 
[Mode Volume Binding](/docs/concepts/storage/storage-classes/#volume-binding-mode).

{{% /capture %}}
