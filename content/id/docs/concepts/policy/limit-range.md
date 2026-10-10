---
title: LimitRange
content_type: concept
weight: 10
---

<!-- overview -->

Secara bawaan, Container berjalan dengan [sumber daya komputasi](/id/docs/user-guide/compute-resources) tanpa batas pada klaster Kubernetes.
Dengan ResourceQuota (kuota sumber daya), administrator klaster dapat membatasi konsumsi dan pembuatan sumber daya berbasis {{<glossary_tooltip text="Namespace" term_id="namespace">}}.
Di dalam Namespace, Pod atau Container dapat mengkonsumsi CPU dan memori sesuai dengan yang ditentukan oleh ResourceQuota pada Namespace tersebut. 
Ada kekhawatiran bahwa satu Pod atau Container dapat memonopoli semua sumber daya yang tersedia. 
LimitRange (Batas Rentang) adalah kebijakan untuk membatasi alokasi sumber daya (bagi Pod atau Container) pada Namespace.


<!-- body -->

LimitRange memberikan batasan (_limit_) yang dapat:

- Menerapkan penggunaan sumber daya komputasi minimum dan maksimum untuk setiap Pod atau Container dalam Namespace.
- Menerapkan permintaan (_request_) tempat penyimpanan minimum dan maksimum untuk setiap PersistentVolumeClaim dalam Namespace.
- Menerapkan rasio antara permintaan dan batas untuk sumber daya dalam Namespace.
- Menetapkan permintaan/batas bawaan untuk menghitung sumber daya dalam Namespace dan memasukkannya secara otomatis ke Container pada _runtime_.

## Mengaktifkan LimitRange

Dukungan LimitRange diaktifkan secara bawaan untuk banyak distribusi Kubernetes. Hal ini
diaktifkan ketika tanda `--enable-admission-plugins=` pada apiserver memiliki _admission controller_ `LimitRanger` sebagai
salah satu argumennya.

LimitRange diberlakukan pada Namespace tertentu ketika ada sebuah objek LimitRange pada Namespace tersebut.

Nama dari objek LimitRange harus merupakan sebuah [nama subdomain DNS](/id/docs/concepts/overview/working-with-objects/names#nama).

### Gambaran Umum LimitRange

- Administrator membuat sebuah LimitRange dalam sebuah Namespace.
- Pengguna membuat sumber daya seperti Pod, Container, dan PersistentVolumeClaim pada namespace.
- _Admission controller_ `LimitRanger` memberlakukan bawaan dan batas untuk semua Pod dan Container yang tidak menetapkan persyaratan sumber daya komputasi dan melacak penggunaannya untuk memastikan agar tidak melebihi minimum, maksimum dan rasio sumber daya yang ditentukan dalam LimitRange yang ada pada Namespace.
- Apabila permintaan membuat atau memperbarui sumber daya (Pod, Container, PersistentVolumeClaim) yang melanggar batasan LimitRange, maka permintaan ke server API akan gagal dengan kode status HTTP `403 FORBIDDEN` dan sebuah pesan yang menjelaskan batasan yang telah dilanggar.
- Apabila LimitRange diaktifkan pada Namespace untuk menghitung sumber daya seperti `cpu` dan `memory`, pengguna harus menentukan permintaan atau batasan untuk nilai-nilai itu. Jika tidak, sistem dapat menolak pembuatan Pod.
- Pelanggaran terhadap LimitRange hanya terjadi pada tahap penerimaan Pod, bukan pada saat Pod sedang berjalan.

Contoh dari kebijakan yang dapat dibuat dengan menggunakan LimitRange yaitu:

- Dalam klaster dua Node dengan kapasitas 8 GiB RAM dan 16 _core_, batasan Pod dalam Namespace meminta 100m untuk CPU dengan batas maksimum 500m untuk CPU dan minta 200Mi untuk Memori dengan batas maksimum 600Mi untuk Memori.
- Tetapkan batas bawaan dan permintaan pada 150m untuk CPU dan permintaan standar memori pada 300Mi untuk Container yang dimulai tanpa cpu dan permintaan memori dalam spesifikasi mereka.

Dalam kasus di mana batas total Namespace kurang dari jumlah batas Pod/Container,
mungkin akan ada perebutan untuk sumber daya. Dalam hal ini, maka Container atau Pod tidak akan dibuat.

Baik perebutan maupun perubahan pada LimitRange tidak akan mempengaruhi sumber daya yang sudah dibuat.


## {{% heading "whatsnext" %}}

Silahkan merujuk pada [Dokumen perancangan LimitRanger](https://git.k8s.io/community/contributors/design-proposals/resource-management/admission_control_limit_range.md) untuk informasi lebih lanjut.

Untuk contoh tentang penggunaan batas, lihatlah:

- [Bagaimana cara mengonfigurasi batasan CPU minimum dan maksimum untuk setiap Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/).
- [Bagaimana cara mengonfigurasi batasan memori minimum dan maksimum untuk setiap Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/).
- [Bagaimana cara mengonfigurasi permintaan dan batas bawaan CPU untuk setiap Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/).
- [Bagaimana cara mengonfigurasi permintaan dan batas bawaan memori untuk setiap Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/).
- [Bagaimana cara mengonfigurasi konsumsi tempat penyimpanan minimum dan maksimum untuk setiap Namespace](/docs/tasks/administer-cluster/limit-storage-consumption/#limitrange-to-limit-requests-for-storage).
- [Contoh terperinci tentang mengonfigurasi kuota untuk setiap Namespace](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/).

