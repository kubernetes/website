---
title: Limit Volume yang Spesifik terhadap Node
content_template: templates/concept
---

{{% capture overview %}}

Laman ini menjelaskan soal jumlah volume maksimal yang dapat dihubungkan
ke sebuah Node untuk berbagai penyedia layanan cloud.

Penyedia layanan cloud seperti Google, Amazon, dan Microsoft pada umumnya memiliki
keterbatasan dalam jumlah volume yang bisa terhubung ke sebuah Node. Keterbatasn ini 
sangatlah penting untuk diketahui Kubernetes dalam menentukan keputusan. Jika tidak,
Pod-pod yang telah dijadwalkan pada sebuah Node akan macet dan menunggu terus-menerus
untuk terhubung pada volume.

{{% /capture %}}

{{% capture body %}}

## Limit _default_ pada Kubernetes

Kubernetes _scheduler_ memiliki limit _default_ untuk jumlah volume
yang dapat terhubung pada sebuah Node:

<table>
  <tr><th>Penyedia layanan cloud</th><th>Jumlah volume maksimal per Node</th></tr>
  <tr><td><a href="https://aws.amazon.com/ebs/">Amazon Elastic Block Store (EBS)</a></td><td>39</td></tr>
  <tr><td><a href="https://cloud.google.com/persistent-disk/">Google Persistent Disk</a></td><td>16</td></tr>
  <tr><td><a href="https://azure.microsoft.com/en-us/services/storage/main-disks/">Microsoft Azure Disk Storage</a></td><td>16</td></tr>
</table>

## Limit _custom_

Kamu dapat mengganti limit-limit ini dengan mengkonfigurasi nilai dari
variabel _environment_ `KUBE_MAX_PD_VOLS`, lalu menjalankan _scheduler_.

Berhati-hatilah jika kamu menerapkan limit yang lebih besar dari limit _default_.
Perhatikan dokumentasi penyedia layanan cloud untuk hal ini, dan pastikan Node
benar-benar dapat mendukung nilai limit yang kamu inginkan.

Limit ini diterapkan untuk seluruh kluster, jadi akan berdampak pada semua Node.

## Limit volume dinamis

{{< feature-state state="beta" for_k8s_version="v1.12" >}}

Sebagai fitur Alpha, Kubernetes 1.11 memperkenalkan dukungan untuk limit volume yang dinamis berdasarkan tipe Node.
Pada Kubernettes 1.12, fitur ini telah mendapat promosi ke Beta dan akan diaktifkan secara _default_.

Limit volume dinamis mendukung tipe-tipe volume berikut:

- Amazon EBS
- Google Persistent Disk
- Azure Disk
- CSI


Ketika fitur limit volume dinamis diaktifkan, Kubernetes secara otomatis
menentukan tipe Node dan menerapkan jumlah volume dengan tepat, berapa yang bisa
terhubung Node. Sebagai contoh:

* Pada
<a href="https://cloud.google.com/compute/">Google Compute Engine</a>,
maskimal 128 jumlah volumes dapat terhubung pada sebuah node, [tergantung dari
tipe node](https://cloud.google.com/compute/docs/disks/#pdnumberlimits).

* Untuk Amazon EBS disk pada tipe instans M5,C5,R5,T3 dan Z1D, Kubernetes hanya memperbolehkan 25
volume dapat terhubung pada sebuah Node. Untuk tipe instans lainnya pada
<a href="https://aws.amazon.com/ec2/">Amazon Elastic Compute Cloud (EC2)</a>,
Kubernetes memperbolehkan 39 jumlah volume dapat terhubung pada sebuah Node.

* Pada Azure, maksimal 64 jumlah disk dapat terhubung pada suatu node, tergantung dari tipe node. Untuk perinciannya
bisa dilihat pada [Ukuran mesin virtual (VM) di Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes).

* Untuk CSI, driver manapun yang memberitahukan (_advertise_) limit volume terhubung melalui spek CSI akan memiliki limit tersebut yang disediakan
  sebagai properti Node dan Scheduler tidak akan menjadwalkan Pod dengan volume pada Node manapun yang sudah penuh kapasitasnya. Untuk penjelasan lebih jauh
  lihat [spek CSI](https://github.com/container-storage-interface/spec/blob/master/spec.md#nodegetinfo).

{{% /capture %}}
