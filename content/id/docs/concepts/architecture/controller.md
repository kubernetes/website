---
title: Controller
content_type: concept
weight: 30
---

<!-- overview -->

Dalam bidang robotika dan otomatisasi, _control loop_ atau kontrol tertutup adalah
lingkaran tertutup yang mengatur keadaan suatu sistem.

Berikut adalah salah satu contoh kontrol tertutup: termostat di sebuah ruangan.

Ketika kamu mengatur suhunya, itu mengisyaratkan ke termostat
tentang *keadaan yang kamu inginkan*. Sedangkan suhu kamar yang sebenarnya 
adalah *keadaan saat ini*. Termostat berfungsi untuk membawa keadaan saat ini
mendekati ke keadaan yang diinginkan, dengan menghidupkan atau mematikan 
perangkat.

Di Kubernetes, _controller_ adalah kontrol tertutup yang mengawasi keadaan klaster
{{< glossary_tooltip term_id="cluster" text="klaster" >}} kamu, lalu membuat atau meminta 
perubahan jika diperlukan. Setiap _controller_ mencoba untuk memindahkan status 
klaster saat ini mendekati keadaan yang diinginkan.

{{< glossary_definition term_id="controller" length="short">}}




<!-- body -->

## Pola _controller_ 

Sebuah _controller_ melacak sekurang-kurangnya satu jenis sumber daya dari 
Kubernetes.
[objek-objek](/id/docs/concepts/overview/working-with-objects/kubernetes-objects/) ini
memiliki *spec field* yang merepresentasikan keadaan yang diinginkan. Satu atau 
lebih _controller_ untuk *resource* tersebut bertanggung jawab untuk membuat 
keadaan sekarang mendekati keadaan yang diinginkan.

_Controller_ mungkin saja melakukan tindakan itu sendiri; namun secara umum, di 
Kubernetes, _controller_ akan mengirim pesan ke
{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}} yang 
mempunyai efek samping yang bermanfaat. Kamu bisa melihat contoh-contoh 
di bawah ini.

{{< comment >}}
Beberapa _controller_ bawaan, seperti _controller namespace_, bekerja pada objek
yang tidak memiliki *spec*. Agar lebih sederhana, halaman ini tidak 
menjelaskannya secara detail.
{{< /comment >}}

### Kontrol melalui server API

_Controller_ {{< glossary_tooltip term_id="job" >}} adalah contoh dari _controller_
bawaan dari Kubernetes. _Controller_ bawaan tersebut mengelola status melalui
interaksi dengan server API dari suatu klaster.

Job adalah sumber daya dalam Kubernetes yang menjalankan a
{{< glossary_tooltip term_id="pod" >}}, atau mungkin beberapa Pod sekaligus, 
untuk melakukan sebuah pekerjaan dan kemudian berhenti.

(Setelah [dijadwalkan](../../../../en/docs/concepts/scheduling-eviction/), objek Pod 
akan menjadi bagian dari keadaan yang diinginkan oleh kubelet).

Ketika _controller job_ melihat tugas baru, maka _controller_ itu memastikan bahwa, 
di suatu tempat pada klaster kamu, kubelet dalam sekumpulan Node menjalankan 
Pod-Pod dengan jumlah yang benar untuk menyelesaikan pekerjaan. _Controller job_ 
tidak menjalankan sejumlah Pod atau kontainer apa pun untuk dirinya sendiri. 
Namun, _controller job_ mengisyaratkan kepada server API untuk  membuat atau 
menghapus Pod. Komponen-komponen lain dalam
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}
bekerja berdasarkan informasi baru (adakah Pod-Pod baru untuk menjadwalkan dan 
menjalankan pekerjan), dan pada akhirnya pekerjaan itu selesai.

Setelah kamu membuat Job baru, status yang diharapkan adalah bagaimana 
pekerjaan itu bisa selesai. _Controller job_ membuat status pekerjaan saat ini 
agar mendekati dengan keadaan yang kamu inginkan: membuat Pod yang melakukan 
pekerjaan yang kamu inginkan untuk Job tersebut, sehingga Job hampir 
terselesaikan.

_Controller_ juga memperbarui objek yang mengkonfigurasinya. Misalnya: setelah 
pekerjaan dilakukan untuk Job tersebut, _controller job_ memperbarui objek Job 
dengan menandainya `Finished`.

(Ini hampir sama dengan bagaimana beberapa termostat mematikan lampu untuk 
mengindikasikan bahwa kamar kamu sekarang sudah berada pada suhu yang kamu 
inginkan).

### Kontrol Langsung

Berbeda dengan sebuah Job, beberapa dari _controller_ perlu melakukan perubahan
sesuatu di luar dari klaster kamu.

Sebagai contoh, jika kamu menggunakan kontrol tertutup untuk memastikan apakah 
cukup {{< glossary_tooltip text="Node" term_id="node" >}}
dalam kluster kamu, maka _controller_ memerlukan sesuatu di luar klaster saat ini 
untuk mengatur Node-Node baru apabila dibutuhkan.

_controller_ yang berinteraksi dengan keadaan eksternal dapat menemukan keadaan 
yang diinginkannya melalui server API, dan kemudian berkomunikasi langsung 
dengan sistem eksternal untuk membawa keadaan saat ini mendekat keadaan yang 
diinginkan.

(Sebenarnya ada sebuah [_controller_](https://github.com/kubernetes/autoscaler/) yang melakukan penskalaan node secara 
horizontal dalam klaster kamu.

## Status sekarang berbanding status yang diinginkan {#sekarang-banding-diinginkan}

Kubernetes mengambil pandangan sistem secara _cloud-native_, dan mampu menangani
perubahan yang konstan.

Klaster kamu dapat mengalami perubahan kapan saja pada saat pekerjaan sedang 
berlangsung dan kontrol tertutup secara otomatis memperbaiki setiap kegagalan.
Hal ini berarti bahwa, secara potensi, klaster kamu tidak akan pernah mencapai 
kondisi stabil.

Selama _controller_ dari klaster kamu berjalan dan mampu membuat perubahan yang 
bermanfaat, tidak masalah apabila keadaan keseluruhan stabil atau tidak.

## Perancangan

Sebagai prinsip dasar perancangan, Kubernetes menggunakan banyak _controller_ yang 
masing-masing mengelola aspek tertentu dari keadaan klaster. Yang paling umum, 
kontrol tertutup tertentu menggunakan salah satu jenis sumber daya 
sebagai suatu keadaan yang diinginkan, dan memiliki jenis sumber daya yang 
berbeda untuk dikelola dalam rangka membuat keadaan yang diinginkan terjadi.

Sangat penting untuk memiliki beberapa _controller_ sederhana daripada hanya satu 
_controller_ saja, dimana satu kumpulan monolitik kontrol tertutup saling 
berkaitan satu sama lain. Karena _controller_ bisa saja gagal, sehingga Kubernetes
dirancang untuk memungkinkan hal tersebut.

Misalnya: _controller_ pekerjaan melacak objek pekerjaan (untuk menemukan
adanya pekerjaan baru) dan objek Pod (untuk menjalankan pekerjaan tersebut dan 
kemudian melihat lagi ketika pekerjaan itu sudah selesai). Dalam hal ini yang 
lain membuat pekerjaan, sedangkan _controller_ pekerjaan membuat Pod-Pod.

{{< note >}}
Ada kemungkinan beberapa _controller_ membuat atau memperbarui jenis objek yang 
sama. Namun di belakang layar, _controller_ Kubernetes memastikan bahwa mereka 
hanya memperhatikan sumbr daya yang terkait dengan sumber daya yang mereka 
kendalikan.

Misalnya, kamu dapat memiliki Deployment dan Job; dimana keduanya akan membuat 
Pod. _Controller Job_ tidak akan menghapus Pod yang dibuat oleh Deployment kamu,
karena ada informasi ({{< glossary_tooltip term_id="label" text="labels" >}})
yang dapat oleh _controller_ untuk membedakan Pod-Pod tersebut.
{{< /note >}}

## Berbagai cara menjalankan beberapa _controller_ {#menjalankan-_controller_}

Kubernetes hadir dengan seperangkat _controller_ bawaan yang berjalan di dalam
{{< glossary_tooltip term_id="kube-controller-manager" >}}. Beberapa _controller_
bawaan memberikan perilaku inti yang sangat penting.

_Controller Deployment_ dan _controller Job_ adalah contoh dari _controller_ yang
hadir sebagai bagian dari Kubernetes itu sendiri (_controller_ "bawaan").
Kubernetes memungkinkan kamu menjalankan _control plane_ yang tangguh, sehingga 
jika ada _controller_ bawaan yang gagal, maka bagian lain dari _control plane_ akan 
mengambil alih pekerjaan.

Kamu juga dapat menemukan pengontrol yang berjalan di luar _control plane_, untuk 
mengembangkan lebih jauh Kubernetes. Atau, jika mau, kamu bisa membuat 
_controller_ baru sendiri. Kamu dapat menjalankan _controller_ kamu sendiri sebagai
satu kumpulan dari beberapa Pod, atau bisa juga sebagai bagian eksternal dari 
Kubernetes. Manakah yang paling sesuai akan tergantung pada apa yang _controller_
khusus itu lakukan.



## {{% heading "whatsnext" %}}

* Silahkan baca tentang [_control plane_ Kubernetes](/docs/concepts/#kubernetes-control-plane)
* Temukan beberapa dasar tentang [objek-objek Kubernetes](/docs/concepts/#kubernetes-objects)
* Pelajari lebih lanjut tentang [Kubernetes API](/id/docs/concepts/overview/kubernetes-api/)
* Apabila kamu ingin membuat _controller_ sendiri, silakan lihat [pola perluasan](/id/docs/concepts/extend-kubernetes/extend-cluster/#extension-patterns) dalam memperluas Kubernetes.

