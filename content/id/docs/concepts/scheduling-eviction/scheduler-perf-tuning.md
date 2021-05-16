---
title: Penyetelan Kinerja Penjadwal
content_type: concept
weight: 70
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.14" state="beta" >}}

[kube-scheduler](/id/docs/concepts/scheduling-eviction/kube-scheduler/#kube-scheduler)
merupakan penjadwal (_scheduler_) Kubernetes bawaan yang bertanggung jawab
terhadap penempatan Pod-Pod pada seluruh Node di dalam sebuah klaster.

Node-Node di dalam klaster yang sesuai dengan syarat-syarat penjadwalan dari
sebuah Pod disebut sebagai Node-Node layak (_feasible_). Penjadwal mencari Node-Node
layak untuk sebuah Pod dan kemudian menjalankan fungsi-fungsi untuk menskor Node-Node tersebut, memilih sebuah Node dengan skor tertinggi di antara
Node-Node layak lainnya, di mana Pod akan dijalankan. Penjadwal kemudian memberitahu
API server soal keputusan ini melalui sebuah proses yang disebut _Binding_.

Laman ini menjelaskan optimasi penyetelan (_tuning_) kinerja yang relevan
untuk klaster Kubernetes berskala besar.



<!-- body -->

Pada klaster berskala besar, kamu bisa menyetel perilaku penjadwal
untuk menyeimbangkan hasil akhir penjadwalan antara latensi (seberapa cepat Pod-Pod baru ditempatkan)
dan akurasi (seberapa akurat penjadwal membuat keputusan penjadwalan yang tepat).

Kamu bisa mengonfigurasi setelan ini melalui pengaturan `percentageOfNodesToScore` pada kube-scheduler.
Pengaturan KubeSchedulerConfiguration ini menentukan sebuah ambang batas untuk
penjadwalan Node-Node di dalam klaster kamu.

### Pengaturan Ambang Batas

Opsi `percentageOfNodesToScore` menerima semua angka numerik antara 0 dan 100.
Angka 0 adalah angka khusus yang menandakan bahwa kube-scheduler harus menggunakan
nilai bawaan.
Jika kamu mengatur `percentageOfNodesToScore` dengan angka di atas 100, kube-scheduler
akan membulatkan ke bawah menjadi 100.

Untuk mengubah angkanya, sunting berkas konfigurasi kube-scheduler (biasanya `/etc/kubernetes/config/kube-scheduler.yaml`),
lalu _ulang kembali_ kube-scheduler.

Setelah kamu selesai menyunting, jalankan perintah
```bash
kubectl get componentstatuses
```
untuk memverifikasi komponen kube-scheduler berjalan dengan baik (_healthy_). Keluarannya kira-kira seperti ini:
```
NAME                 STATUS    MESSAGE             ERROR
controller-manager   Healthy   ok
scheduler            Healthy   ok
...
```

## Ambang Batas Penskoran Node {#persentase-penskoran-node}

Untuk meningkatan kinerja penjadwalan, kube-scheduler dapat berhenti mencari
Node-Node yang layak saat sudah berhasil menemukannya. Pada klaster berskala besar,
hal ini menghemat waktu dibandingkan dengan pendekatan awam yang mengecek setiap Node.

Kamu bisa mengatur ambang batas untuk menentukan berapa banyak jumlah Node minimal yang dibutuhkan, sebagai
persentase bagian dari seluruh Node di dalam klaster kamu. kube-scheduler akan mengubahnya menjadi
bilangan bulat berisi jumlah Node. Saat penjadwalan, jika kube-scheduler mengidentifikasi
cukup banyak Node-Node layak untuk melewati jumlah persentase yang diatur, maka kube-scheduler
akan berhenti mencari Node-Node layak dan lanjut ke [fase penskoran] (/id/docs/concepts/scheduling-eviction/kube-scheduler/#kube-scheduler-implementation).

[Bagaimana penjadwal mengecek Node](#bagaimana-penjadwal-mengecek-node) menjelaskan proses ini secara detail.

### Ambang Batas Bawaan

Jika kamu tidak mengatur sebuah ambang batas, maka Kubernetes akan
menghitung sebuah nilai menggunakan pendekatan linier, yaitu 50% untuk klaster dengan 100 Node,
serta 10% untuk klaster dengan 5000 Node.

Artinya, kube-scheduler selalu menskor paling tidak 5% dari klaster kamu, terlepas dari
seberapa besar klasternya, kecuali kamu secara eksplisit mengatur `percentageOfNodesToScore`
menjadi lebih kecil dari 5.

Jika kamu ingin penjadwal untuk memasukkan seluruh Node di dalam klaster ke dalam penskoran,
maka aturlah `percentageOfNodesToScore` menjadi 100.

## Contoh

Contoh konfigurasi di bawah ini mengatur `percentageOfNodesToScore` menjadi 50%.

```yaml
apiVersion: kubescheduler.config.k8s.io/v1alpha1
kind: KubeSchedulerConfiguration
algorithmSource:
  provider: DefaultProvider

...

percentageOfNodesToScore: 50
```


##  Menyetel percentageOfNodesToScore

`percentageOfNodesToScore` merupakan angka 1 sampai 100 dengan
nilai bawaan yang dihitung berdasarkan ukuran klaster. Di sini juga terdapat
batas bawah yang telah ditetapkan, yaitu 50 Node.

{{< note >}}Pada klaster dengan kurang dari 50 Node layak, penjadwal masih
terus memeriksa seluruh Node karena Node-Node layak belum mencukupi supaya
penjadwal dapat menghentikan proses pencarian lebih awal.

Pada klaster kecil, jika kamu mengatur `percentageOfNodesToScore` dengan angka kecil,
pengaturan ini hampir atau sama sekali tidak berpengaruh, karena alasan yang sama.

Jika klaster kamu punya ratusan Node, gunakan angka bawaan untuk opsi konfigurasi ini.
Mengubah angkanya kemungkinan besar tidak akan mengubah kinerja penjadwal secara berarti.
{{< /note >}}

Sebuah catatan penting yang perlu dipertimbangkan saat mengatur angka ini adalah
ketika klaster dengan jumlah Node sedikit diperiksa untuk kelayakan, beberapa Node
tidak dikirim untuk diskor bagi sebuah Pod. Hasilnya, sebuah Node yang mungkin memiliki
nilai lebih tinggi untuk menjalankan Pod tersebut bisa saja tidak diteruskan ke fase penskoran.
Hal ini berdampak pada penempatan Pod yang kurang ideal.

Kamu sebaiknya menghindari pengaturan `percentageOfNodesToScore` menjadi sangat rendah,
agar kube-scheduler tidak seringkali membuat keputusan penempatan Pod yang buruk.
Hindari pengaturan persentase di bawah 10%, kecuali _throughput_ penjadwal sangat penting
untuk aplikasi kamu dan skor dari Node tidak begitu penting. Dalam kata lain, kamu
memilih untuk menjalankan Pod pada Node manapun selama Node tersebut layak.

## Bagaimana Penjadwal Mengecek Node

Bagian ini ditujukan untuk kamu yang ingin mengerti bagaimana fitur ini bekerja secara internal.

Untuk memberikan semua Node di dalam klaster sebuah kesempatan yang adil untuk
dipertimbangkan dalam menjalankan Pod, penjadwal mengecek Node satu persatu
secara _round robin_. Kamu dapat membayangkan Node-Node ada di dalam sebuah array.
Penjadwal mulai dari indeks array pertama dan mengecek kelayakan dari Node sampai
jumlahnya telah mencukupi sesuai dengan `percentageOfNodesToScore`. Untuk Pod berikutnya,
penjadwal melanjutkan dari indeks array Node yang terhenti ketika memeriksa
kelayakan Node-Node untuk Pod sebelumnya.

Jika Node-Node berada di beberapa zona, maka penjadwal akan mengecek Node satu persatu
pada seluruh zona untuk memastikan bahwa Node-Node dari zona berbeda masuk dalam pertimbangan
kelayakan. Sebagai contoh, ada 6 Node di dalam 2 zona:

```
Zona 1: Node 1, Node 2, Node 3, Node 4
Zona 2: Node 5, Node 6
```

Penjadwal mempertimbangkan kelayakan dari Node-Node tersebut dengan urutan berikut:

```
Node 1, Node 5, Node 2, Node 6, Node 3, Node 4
```

Setelah semua Node telah dicek, penjadwal akan kembali pada Node 1.


