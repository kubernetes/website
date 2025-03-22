---
title: Mengoperasikan klaster etcd untuk Kubernetes
content_type: task
---

<!-- overview -->

{{< glossary_definition term_id="etcd" length="all" prepend="etcd adalah ">}}




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Prerequisites

* Jalankan etcd sebagai klaster dimana anggotanya berjumlah ganjil.

* Etcd adalah sistem terdistribusi berbasis _leader_. Pastikan _leader_ secara berkala mengirimkan _heartbeat_ dengan tepat waktu ke semua pengikutnya untuk menjaga kestabilan klaster.

* Pastikan tidak terjadi kekurangan sumber daya.

  Kinerja dan stabilitas dari klaster sensitif terhadap jaringan dan _IO disk_. Kekurangan sumber daya apa pun dapat menyebabkan _timeout_ dari _heartbeat_, yang menyebabkan ketidakstabilan klaster. Etcd yang tidak stabil mengindikasikan bahwa tidak ada _leader_ yang terpilih. Dalam keadaan seperti itu, sebuah klaster tidak dapat membuat perubahan apa pun ke kondisi saat ini, yang menyebabkan tidak ada Pod baru yang dapat dijadwalkan.

* Menjaga kestabilan klaster etcd sangat penting untuk stabilitas klaster Kubernetes. Karenanya, jalankan klaster etcd pada mesin khusus atau lingkungan terisolasi untuk [persyaratan sumber daya terjamin](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/hardware.md#hardware-recommendations).

* Versi minimum yang disarankan untuk etcd yang dijalankan dalam lingkungan produksi adalah `3.2.10+`.

## Persyaratan sumber daya

Mengoperasikan etcd dengan sumber daya terbatas hanya cocok untuk tujuan pengujian. Untuk peluncuran dalam lingkungan produksi, diperlukan konfigurasi perangkat keras lanjutan. Sebelum meluncurkan etcd dalam produksi, lihat [dokumentasi referensi persyaratan sumber daya](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/hardware.md#example-hardware-configurations).

## Memulai Klaster etcd

Bagian ini mencakup bagaimana memulai klaster etcd dalam Node tunggal dan Node multipel.

### Klaster etcd dalam Node tunggal

Gunakan Klaster etcd Node tunggal hanya untuk tujuan pengujian

1. Jalankan perintah berikut ini:

    ```sh
    ./etcd --listen-client-urls=http://$PRIVATE_IP:2379 --advertise-client-urls=http://$PRIVATE_IP:2379
    ```

2. Start server API Kubernetes dengan _flag_ `--etcd-servers=$PRIVATE_IP:2379`.

    Ganti `PRIVATE_IP` dengan IP klien etcd kamu.

### Klaster etcd dengan Node multipel

Untuk daya tahan dan ketersediaan tinggi, jalankan etcd sebagai klaster dengan Node multipel dalam lingkungan produksi dan cadangkan secara berkala. Sebuah klaster dengan lima anggota direkomendasikan dalam lingkungan produksi. Untuk informasi lebih lanjut, lihat [Dokumentasi FAQ](https://github.com/coreos/etcd/blob/master/Documentation/faq.md#what-is-failure-tolerance).

Mengkonfigurasi klaster etcd baik dengan informasi anggota statis atau dengan penemuan dinamis. Untuk informasi lebih lanjut tentang pengklasteran, lihat [Dokumentasi pengklasteran etcd](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/clustering.md).

Sebagai contoh, tinjau sebuah klaster etcd dengan lima anggota yang berjalan dengan URL klien berikut: `http://$IP1:2379`, `http://$IP2:2379`, `http://$IP3:2379`, `http://$IP4:2379`, dan `http://$IP5:2379`. Untuk memulai server API Kubernetes:

1. Jalankan perintah berikut ini:

    ```sh
    ./etcd --listen-client-urls=http://$IP1:2379, http://$IP2:2379, http://$IP3:2379, http://$IP4:2379, http://$IP5:2379 --advertise-client-urls=http://$IP1:2379, http://$IP2:2379, http://$IP3:2379, http://$IP4:2379, http://$IP5:2379
    ```

2. Start server Kubernetes API dengan flag `--etcd-servers=$IP1:2379, $IP2:2379, $IP3:2379, $IP4:2379, $IP5:2379`.

    Ganti `IP` dengan alamat IP klien kamu.

###  Klaster etcd dengan Node multipel dengan load balancer

Untuk menjalankan penyeimbangan beban (_load balancing_) untuk klaster etcd:

1. Siapkan sebuah klaster etcd.
2. Konfigurasikan sebuah _load balancer_ di depan klaster etcd.
   Sebagai contoh, anggap saja alamat _load balancer_ adalah `$LB`.
3. Mulai Server API Kubernetes dengan _flag_ `--etcd-servers=$LB:2379`.

## Mengamankan klaster etcd

Akses ke etcd setara dengan izin root pada klaster sehingga idealnya hanya server API yang memiliki akses ke etcd. Dengan pertimbangan sensitivitas data, disarankan untuk memberikan izin hanya kepada Node-Node yang membutuhkan akses ke klaster etcd.

Untuk mengamankan etcd, tetapkan aturan _firewall_ atau gunakan fitur keamanan yang disediakan oleh etcd. Fitur keamanan etcd tergantung pada Infrastruktur Kunci Publik / _Public Key Infrastructure_ (PKI) x509. Untuk memulai, buat saluran komunikasi yang aman dengan menghasilkan pasangan kunci dan sertifikat. Sebagai contoh, gunakan pasangan kunci `peer.key` dan `peer.cert` untuk mengamankan komunikasi antara anggota etcd, dan `client.key` dan `client.cert` untuk mengamankan komunikasi antara etcd dan kliennya. Lihat [contoh skrip](https://github.com/coreos/etcd/tree/master/hack/tls-setup) yang disediakan oleh proyek etcd untuk menghasilkan pasangan kunci dan berkas CA untuk otentikasi klien.

### Mengamankan komunikasi

Untuk mengonfigurasi etcd dengan _secure peer communication_, tentukan _flag_ `--peer-key-file=peer.key` dan `--peer-cert-file=peer.cert`, dan gunakan https sebagai skema URL.

Demikian pula, untuk mengonfigurasi etcd dengan _secure client communication_, tentukan _flag_ `--key-file=k8sclient.key` dan `--cert-file=k8sclient.cert`, dan gunakan https sebagai skema URL.

### Membatasi akses klaster etcd

Setelah konfigurasi komunikasi aman, batasi akses klaster etcd hanya ke server API Kubernetes. Gunakan otentikasi TLS untuk melakukannya.

Sebagai contoh, anggap pasangan kunci `k8sclient.key` dan `k8sclient.cert` dipercaya oleh CA `etcd.ca`. Ketika etcd dikonfigurasi dengan `--client-cert-auth` bersama dengan TLS, etcd memverifikasi sertifikat dari klien dengan menggunakan CA dari sistem atau CA yang dilewati oleh _flag_ `--trusted-ca-file`. Menentukan _flag_ `--client-cert-auth=true` dan `--trusted-ca-file=etcd.ca` akan membatasi akses kepada klien yang mempunyai sertifikat `k8sclient.cert`.

Setelah etcd dikonfigurasi dengan benar, hanya klien dengan sertifikat yang valid dapat mengaksesnya. Untuk memberikan akses kepada server Kubernetes API, konfigurasikan dengan _flag_ `--etcd-certfile=k8sclient.cert`,`--etcd-keyfile=k8sclient.key` dan `--etcd-cafile=ca.cert`.

{{< note >}}
Otentikasi etcd saat ini tidak didukung oleh Kubernetes. Untuk informasi lebih lanjut, lihat masalah terkait [Mendukung Auth Dasar untuk Etcd v2](https://github.com/kubernetes/kubernetes/issues/23398).
{{< /note >}}

## Mengganti anggota etcd yang gagal

Etcd klaster mencapai ketersediaan tinggi dengan mentolerir kegagalan dari sebagian kecil anggota. Namun, untuk meningkatkan kesehatan keseluruhan dari klaster, segera ganti anggota yang gagal. Ketika banyak anggota yang gagal, gantilah satu per satu. Mengganti anggota yang gagal melibatkan dua langkah: menghapus anggota yang gagal dan menambahkan anggota baru.

Meskipun etcd menyimpan ID anggota unik secara internal, disarankan untuk menggunakan nama unik untuk setiap anggota untuk menghindari kesalahan manusia. Sebagai contoh, sebuah klaster etcd dengan tiga anggota. Jadikan URL-nya, member1=http://10.0.0.1, member2=http://10.0.0.2, and member3=http://10.0.0.3. Ketika member1 gagal, ganti dengan member4=http://10.0.0.4.

1. Dapatkan ID anggota yang gagal dari member1:

    `etcdctl --endpoints=http://10.0.0.2,http://10.0.0.3 member list`

      Akan tampil pesan berikut:

        8211f1d0f64f3269, started, member1, http://10.0.0.1:2380, http://10.0.0.1:2379
        91bc3c398fb3c146, started, member2, http://10.0.0.2:2380, http://10.0.0.2:2379
        fd422379fda50e48, started, member3, http://10.0.0.3:2380, http://10.0.0.3:2379

2. Hapus anggota yang gagal:

    `etcdctl member remove 8211f1d0f64f3269`

      Akan tampil pesan berikut:

       Removed member 8211f1d0f64f3269 from cluster

3. Tambahkan anggota baru:

    `./etcdctl member add member4 --peer-urls=http://10.0.0.4:2380`

     Akan tampil pesan berikut:

       Member 2be1eb8f84b7f63e added to cluster ef37ad9dc622a7c4

4. Jalankan anggota yang baru ditambahkan pada mesin dengan IP `10.0.0.4`:

        export ETCD_NAME="member4"
        export ETCD_INITIAL_CLUSTER="member2=http://10.0.0.2:2380,member3=http://10.0.0.3:2380,member4=http://10.0.0.4:2380"
        export ETCD_INITIAL_CLUSTER_STATE=existing
        etcd [flags]

5. Lakukan salah satu dari yang berikut:

   1. Perbarui _flag_ `--etcd-server` untuk membuat Kubernetes mengetahui perubahan konfigurasi, lalu start ulang server API Kubernetes.
   2. Perbarui konfigurasi _load balancer_ jika _load balancer_ digunakan dalam Deployment.

Untuk informasi lebih lanjut tentang konfigurasi ulang klaster, lihat [Dokumentasi Konfigurasi etcd](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/runtime-configuration.md#remove-a-member).

## Mencadangkan klaster etcd

Semua objek Kubernetes disimpan dalam etcd. Mencadangkan secara berkala data klaster etcd penting untuk memulihkan klaster Kubernetes di bawah skenario bencana, seperti kehilangan semua Node _control plane_. Berkas _snapshot_ berisi semua status Kubernetes dan informasi penting. Untuk menjaga data Kubernetes yang sensitif aman, enkripsi berkas _snapshot_.

Mencadangkan klaster etcd dapat dilakukan dengan dua cara: _snapshot_ etcd bawaan dan _snapshot_ volume.

### Snapshot bawaan

Fitur _snapshot_ didukung oleh etcd secara bawaan, jadi mencadangkan klaster etcd lebih mudah. _Snapshot_ dapat diambil dari anggota langsung dengan command `etcdctl snapshot save` atau dengan menyalin `member/snap/db` berkas dari etcd [direktori data](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/configuration.md#--data-dir) yang saat ini tidak digunakan oleh proses etcd. Mengambil _snapshot_ biasanya tidak akan mempengaruhi kinerja anggota.

Di bawah ini adalah contoh untuk mengambil _snapshot_ dari _keyspace_ yang dilayani oleh `$ENDPOINT` ke berkas `snapshotdb`:

```sh
ETCDCTL_API=3 etcdctl --endpoints $ENDPOINT snapshot save snapshotdb
# keluar 0

# memverifikasi hasil snapshot
ETCDCTL_API=3 etcdctl --write-out=table snapshot status snapshotdb
+----------+----------+------------+------------+
|   HASH   | REVISION | TOTAL KEYS | TOTAL SIZE |
+----------+----------+------------+------------+
| fe01cf57 |       10 |          7 | 2.1 MB     |
+----------+----------+------------+------------+
```

### Snapshot volume

Jika etcd berjalan pada volume penyimpanan yang mendukung cadangan, seperti Amazon Elastic Block Store, buat cadangan data etcd dengan mengambil _snapshot_ dari volume penyimpanan.

## Memperbesar skala dari klaster etcd

Peningkatan skala klaster etcd meningkatkan ketersediaan dengan menukarnya untuk kinerja. Penyekalaan tidak akan meningkatkan kinerja atau kemampuan klaster. Aturan umum adalah untuk tidak melakukan penyekalaan naik atau turun untuk klaster etcd. Jangan mengonfigurasi grup penyekalaan otomatis untuk klaster etcd. Sangat disarankan untuk selalu menjalankan klaster etcd statis dengan lima anggota untuk klaster produksi Kubernetes untuk setiap skala yang didukung secara resmi.

Penyekalaan yang wajar adalah untuk meningkatkan klaster dengan tiga anggota menjadi dengan lima anggota, ketika dibutuhkan lebih banyak keandalan. Lihat [Dokumentasi Rekonfigurasi etcd](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/runtime-configuration.md#remove-a-member) untuk informasi tentang cara menambahkan anggota ke klaster yang ada.

## Memulihkan klaster etcd

Etcd mendukung pemulihan dari _snapshot_ yang diambil dari proses etcd dari versi [major.minor](https://semver.org/). Memulihkan versi dari versi patch lain dari etcd juga didukung. Operasi pemulihan digunakan untuk memulihkan data klaster yang gagal.

Sebelum memulai operasi pemulihan, berkas _snapshot_ harus ada. Ini bisa berupa berkas _snapshot_ dari operasi pencadangan sebelumnya, atau dari sisa [direktori data](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/configuration.md#--data-dir). Untuk informasi dan contoh lebih lanjut tentang memulihkan klaster dari berkas _snapshot_, lihat [dokumentasi pemulihan bencana etcd](https://github.com/coreos/etcd/blob/master/Documentation/op-guide/recovery.md#restoring-a-cluster).

Jika akses URL dari klaster yang dipulihkan berubah dari klaster sebelumnya, maka server API Kubernetes harus dikonfigurasi ulang sesuai dengan URL tersebut. Pada kasus ini, start kembali server API Kubernetes dengan _flag_ `--etcd-servers=$NEW_ETCD_CLUSTER` bukan _flag_ `--etcd-servers=$OLD_ETCD_CLUSTER`. Ganti `$NEW_ETCD_CLUSTER` dan `$OLD_ETCD_CLUSTER` dengan alamat IP masing-masing. Jika _load balancer_ digunakan di depan klaster etcd, kamu mungkin hanya perlu memperbarui _load balancer_ sebagai gantinya.

Jika mayoritas anggota etcd telah gagal secara permanen, klaster etcd dianggap gagal. Dalam skenario ini, Kubernetes tidak dapat membuat perubahan apa pun ke kondisi saat ini. Meskipun Pod terjadwal mungkin terus berjalan, tidak ada Pod baru yang bisa dijadwalkan. Dalam kasus seperti itu, pulihkan klaster etcd dan kemungkinan juga untuk mengonfigurasi ulang server API Kubernetes untuk memperbaiki masalah ini.

## Memutakhirkan dan memutar balikan klaster etcd

Pada Kubernetes v1.13.0, etcd2 tidak lagi didukung sebagai _backend_ penyimpanan untuk klaster Kubernetes baru atau yang sudah ada. _Timeline_ untuk dukungan Kubernetes untuk etcd2 dan etcd3 adalah sebagai berikut:

- Kubernetes v1.0: hanya etcd2
- Kubernetes v1.5.1: dukungan etcd3 ditambahkan, standar klaster baru yang dibuat masih ke etcd2
- Kubernetes v1.6.0: standar klaster baru yang dibuat dengan `kube-up.sh` adalah etcd3,
                     dan `kube-apiserver` standarnya ke etcd3
- Kubernetes v1.9.0: pengumuman penghentian _backend_ penyimpanan etcd2 diumumkan
- Kubernetes v1.13.0: _backend_ penyimpanan etcd2 dihapus, `kube-apiserver` akan
                      menolak untuk start dengan `--storage-backend=etcd2`, dengan pesan 
                      `etcd2 is no longer a supported storage backend`

Sebelum memutakhirkan v1.12.x kube-apiserver menggunakan `--storage-backend=etcd2` ke
v1.13.x, data etcd v2 harus dimigrasikan ke _backend_ penyimpanan v3 dan
permintaan kube-apiserver harus diubah untuk menggunakan `--storage-backend=etcd3`.

Proses untuk bermigrasi dari etcd2 ke etcd3 sangat tergantung pada bagaimana
klaster etcd diluncurkan dan dikonfigurasi, serta bagaimana klaster Kubernetes diluncurkan dan dikonfigurasi. Kami menyarankan kamu berkonsultasi dengan dokumentasi penyedia kluster kamu untuk melihat apakah ada solusi yang telah ditentukan.

Jika klaster kamu dibuat melalui `kube-up.sh` dan masih menggunakan etcd2 sebagai penyimpanan _backend_, silakan baca [Kubernetes v1.12 etcd cluster upgrade docs](https://v1-12.docs.kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/#upgrading-and-rolling-back-etcd-clusters)

## Masalah umum:  penyeimbang klien etcd dengan _secure endpoint_

Klien etcd v3, dirilis pada etcd v3.3.13 atau sebelumnya, memiliki [_critical bug_](https://github.com/kubernetes/kubernetes/issues/72102) yang mempengaruhi kube-apiserver dan penyebaran HA. Pemindahan kegagalan (_failover_) penyeimbang klien etcd tidak bekerja dengan baik dengan _secure endpoint_. Sebagai hasilnya, server etcd boleh gagal atau terputus sesaat dari kube-apiserver. Hal ini mempengaruhi peluncuran HA dari kube-apiserver.

Perbaikan dibuat di [etcd v3.4](https://github.com/etcd-io/etcd/pull/10911) (dan di-backport ke v3.3.14 atau yang lebih baru): klien baru sekarang membuat bundel kredensial sendiri untuk menetapkan target otoritas dengan benar dalam fungsi dial.

Karena perbaikan tersebut memerlukan pemutakhiran dependensi dari gRPC (ke v1.23.0), _downstream_ Kubernetes [tidak mendukung upgrade etcd](https://github.com/kubernetes/kubernetes/issues/72102#issuecomment-526645978), yang berarti [perbaikan etcd di kube-apiserver](https://github.com/etcd-io/etcd/pull/10911/commits/db61ee106ca9363ba3f188ecf27d1a8843da33ab) hanya tersedia mulai Kubernetes 1.16.

Untuk segera memperbaiki celah keamanan (_bug_) ini untuk Kubernetes 1.15 atau sebelumnya, buat kube-apiserver khusus. kamu dapat membuat perubahan lokal ke [`vendor/google.golang.org/grpc/credentials/credentials.go`](https://github.com/kubernetes/kubernetes/blob/7b85be021cd2943167cd3d6b7020f44735d9d90b/vendor/google.golang.org/grpc/credentials/credentials.go#L135) dengan [etcd@db61ee106](https://github.com/etcd-io/etcd/pull/10911/commits/db61ee106ca9363ba3f188ecf27d1a8843da33ab).

Lihat ["kube-apiserver 1.13.x menolak untuk bekerja ketika server etcd pertama tidak tersedia"](https://github.com/kubernetes/kubernetes/issues/72102).


