---
no_issue: true
title: Persiapan
main_menu: true
weight: 30
content_type: concept
---

<!-- overview -->

Gunakan halaman ini untuk mencari solusi yang paling sesuai dengan kebutuhan kamu.

Menentukan dimana sebaiknya Kubernetes dijalankan sangat tergantung pada kapasitas yang kamu punya dan seberapa fleksibel klaster yang kamu inginkan.
Kamu dapat menjalankan Kubernetes hampir dimana saja, mulai dari laptop, VM di penyedia cloud, sampai pada rak-rak berisi server <i>baremetal</i>.
Kamu juga bisa menyiapkan klaster yang diatur sepenuhnya (<i>fully-managed</i>), dengan hanya menjalankan satu perintah, ataupun membuat klaster dengan solusi <i>custom</i> kamu sendiri pada server <i>baremetal</i>.



<!-- body -->

## Solusi pada Mesin Lokal

Memulai Kubernetes bisa dilakukan dengan mudah melalui solusi pada mesin lokal.
Kamu bisa membuat dan mengevaluasi klaster Kubernetes tanpa perlu takut menghabiskan <i>resource</i> dan kuota penyedia cloud.

Sebaiknya kamu memilih solusi lokal jika kamu ingin:

* Mulai belajar atau mencoba Kubernetes
* Mengembangkan dan melakukan evaluasi klaster secara lokal

Pilih [solusi lokal](/docs/setup/pick-right-solution/#local-machine-solutions).

## Solusi Tersediakan (<i>Hosted Solution</i>)

Solusi tersediakan adalah cara yang nyaman untuk membuat dan memelihara klaster Kubernetes. Kamu tidak perlu repot, karena para penyedia solusi mengatur dan mengoperasikan klaster milikmu.

Sebaiknya kamu memilih solusi tersediakan ini jika kamu:

* Ingin punya solusi yang diatur sepenuhnya
* Fokus pada pengembangan aplikasi atau servis saja
* Tidak mau punya tim SRE (<i>Site Reliability Engineering</i>) yang mendedikasikan waktunya untukmu, tapi ingin HA (<i>High Availability</i>)
* Tidak punya <i>resource</i> untuk menjalankan dan memonitor klaster.

Pilih [solusi tersediakan](/docs/setup/pick-right-solution/#hosted-solutions).

## Turnkey – Solusi Cloud

Solusi-solusi ini memudahkan kamu untuk mempunyai klaster Kubernetes hanya dengan beberapa perintah. Lalu, solusi-solusi ini juga masih terus berkembang dan memiliki pendukung komunitas yang aktif.
Mereka juga bisa berjalan pada berbagai macam penyedia Cloud IaaS, tapi mereka menawarkan kebebasan dan fleksibilitas sebagai pengganti dari usaha.

Sebaiknya kamu memilih solusi cloud <i>turnkey</i>, jika kamu:

* Ingin punya kontrol yang lebih daripada yang ditawarkan oleh solusi tersediakan (<i>hosted solution</i>)
* Ingin memiliki porsi dalam mengoperasikan klaster

Pilih [solusi cloud turnkey](/docs/setup/pick-right-solution/#turnkey-cloud-solutions)

## Turnkey – Solusi On-Premise

Solusi-solusi ini menyediakan cara untuk membuat klaster Kubernetes di dalam jaringan cloud internal kamu yang aman, hanya dengan beberapa perintah.

Sebaiknya kamu memilih solusi cloud on-premise turnkey, jika kamu:

* Ingin membuat klaster di jaringan cloud yang privat (<i>private cloud network</i>)
* Punya tim SRE yang mendedikasikan waktunya
* Punya <i>resource</i> untuk menjalankan dan memonitor klaster

Pilih [solusi cloud on-prem turnkey](/docs/setup/pick-right-solution/#on-premises-turnkey-cloud-solutions).

## Solusi <i>Custom</i>

Solusi <i>custom</i> adalah solusi yang paling memberikan kebebasan dalam menjalankan klaster kamu, tapi perlu keahlian.
Solusi-solusi ini cukup beragam, mulai dari bare-metal sampai ke penyedia cloud, berjalan pada sistem operasi yang berbeda-beda.

Pilih [solusi <i>custom</i>](/docs/setup/pick-right-solution/#custom-solutions).



## {{% heading "whatsnext" %}}

Lihat [Memilih Solusi Terbaik](/docs/setup/pick-right-solution/) untuk daftar solusi yang lengkap.

