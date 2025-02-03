---
reviewers:
title: Pod
content_type: concept
weight: 20
---

<!-- overview -->

Pod adalah unit komputasi terkecil yang bisa di-_deploy_ dan dibuat serta dikelola dalam Kubernetes.




<!-- body -->

## Apa Itu Pod?

Sebuah Pod (seperti pod pada paus atau kacang polong) adalah sebuah kelompok yang
terdiri dari satu atau lebih {{< glossary_tooltip text="kontainer" term_id="container" >}} 
(misalnya kontainer Docker), dengan ruang penyimpanan ataupun jaringan yang dipakai bersama,
dan sebuah spesifikasi mengenai bagaimana menjalankan kontainer. Isi dari Pod akan
selalu diletakkan dan dijadwalkan bersama, serta berjalan dalam konteks yang sama.
Sebuah Pod memodelkan _"logical host"_ yang spesifik terhadap aplikasi. Ini mengandung
lebih dari satu kontainer aplikasi yang secara relatif saling terhubung erat. Sebelum 
masa kontainer, menjalankan aplikasi dalam mesin fisik atau _virtual_ berarti
menjalankan dalam _logical host_ yang sama.

Walaupun Kubernetes mendukung lebih banyak _runtime_ kontainer selain Docker, 
namun Docker adalah yang paling umum diketahui dan ini membantu dalam menjelaskan
Pod dengan istilah pada Docker.

Konteks bersama dalam sebuah Pod adalah kumpulan Linux namespace, cgroup dan 
kemungkinan segi isolasi lain, hal yang sama yang mengisolasi kontainer Docker.
Dalam sebuah konteks pada Pod, setiap aplikasi bisa menerapkan sub-isolasi lebih lanjut.

Semua kontainer dalam suatu Pod akan berbagi alamat IP dan _port_ yang sama, 
dan bisa saling berkomunikasi melalui `localhost`. Komunikasi tersebut mengunakan 
standar _inter-process communications_ (IPC) seperti SystemV semaphores 
atau POSIX shared memory. Kontainer pada Pod yang berbeda memiliki alamat IP 
yang berbeda dan tidak dapat berkomunikasi menggunakan IPC tanpa 
[pengaturan khusus](/id/docs/concepts/policy/pod-security-policy/). Kontainer ini
biasa berkomunikasi dengan yang lain menggunakan alamat IP setiap Pod.

Aplikasi dalam suatu Pod juga memiliki akses ke {{< glossary_tooltip text="ruang penyimpanan" term_id="volume" >}} bersama, 
yang didefinisikan sebagai bagian dari Pod dan dibuat bisa diikatkan ke masing-masing
_filesystem_ pada aplikasi.

Dalam istilah konsep [Docker](https://www.docker.com/), sebuah Pod dimodelkan sebagai 
gabungan dari kontainer Docker yang berbagi _namespace_ dan ruang penyimpanan _filesystem_.

Layaknya aplikasi dengan kontainer, Pod dianggap sebagai entitas yang relatif tidak kekal 
(tidak bertahan lama). Seperti yang didiskusikan dalam 
[siklus hidup Pod](/id/docs/concepts/workloads/pods/pod-lifecycle/), Pod dibuat, diberikan
ID unik (UID), dan dijadwalkan pada suatu mesin dan akan tetap disana hingga dihentikan
(bergantung pada aturan _restart_) atau dihapus. Jika {{< glossary_tooltip text="mesin" term_id="node" >}}
mati, maka semua Pod pada mesin tersebut akan dijadwalkan untuk dihapus, namun setelah 
suatu batas waktu. Suatu Pod tertentu (sesuai dengan ID unik) tidak akan dijadwalkan ulang
ke mesin baru, namun akan digantikan oleh Pod yang identik, bahkan jika dibutuhkan bisa 
dengan nama yang sama, tapi dengan ID unik yang baru 
(baca [_replication controller_](/id/docs/concepts/workloads/controllers/replicationcontroller/) 
untuk info lebih lanjut)

Ketika sesuatu dikatakan memiliki umur yang sama dengan Pod, misalnya saja ruang penyimpanan,
maka itu berarti akan tetap ada selama Pod tersebut masih ada. Jika Pod dihapus dengan
alasan apapun, sekalipun Pod pengganti yang identik telah dibuat, semua yang berhubungan
(misalnya ruang penyimpanan) akan dihapus dan dibuat ulang.

{{< figure src="/images/docs/pod.svg" title="Pod diagram" width="50%" >}}

*Sebuah Pod dengan banyak kontainer, yaitu _File Puller_ dan _Web Server_ yang menggunakan
ruang penyimpanan persisten untuk berbagi ruang penyimpanan bersama antara kontainer.*

## Motivasi suatu Pods

### Pengelolaan

Pod adalah suatu model dari pola beberapa proses yang bekerja sama dan membentuk
suatu unit layanan yang kohesif. Menyederhanakan proses melakukan _deploy_ dan
pengelolaan aplikasi dengan menyediakan abstraksi tingkat yang lebih tinggi
daripada konstituen aplikasinya. Pod melayani sebagai unit dari _deployment_, 
penskalaan horizontal, dan replikasi. _Colocation_ (_co-scheduling_), berbagi nasib 
(misalnya dimatikan), replikasi terkoordinasi, berbagi sumber daya dan 
pengelolaan ketergantungan akan ditangani otomatis untuk kontainer dalam suatu Pod.

### Berbagi sumber daya dan komunikasi

Pod memungkinkan berbagi data dan komunikasi diantara konstituennya.

Semua aplikasi dalam suatu Pod menggunakan _namespace_ jaringan yang sama
(alamat IP dan _port_ yang sama), dan menjadikan bisa saling mencari dan berkomunikasi 
dengan menggunakan `localhost`. Oleh karena itu, aplikasi dalam Pod harus 
berkoordinasi mengenai penggunaan _port_. Setiap Pod memiliki alamat IP
dalam satu jaringan bersama yang bisa berkomunikasi dengan komputer lain
dan Pod lain dalam jaringan yang sama.

Kontainer dalam suatu Pod melihat _hostname_ sistem sebagai sesuatu yang sama
dengan konfigurasi `name` pada Pod. Informasi lebih lanjut terdapat dibagian
[jaringan](/id/docs/concepts/cluster-administration/networking/).

Sebagai tambahan dalam mendefinisikan kontainer aplikasi yang berjalan dalam Pod,
Pod memberikan sepaket sistem penyimpanan bersama. Sistem penyimpanan memungkinkan
data untuk bertahan saat kontainer dijalankan ulang dan dibagikan kepada semua
aplikasi dalam Pod tersebut.

## Penggunaan Pod

Pod dapat digunakan untuk menjalankan beberapa aplikasi yang terintegrasi
secara vertikal (misalnya LAMP), namun motivasi utamanya adalah untuk mendukung
berlokasi bersama, mengelola program pembantu, diantaranya adalah:

* sistem pengelolaan konten, pemuat berkas dan data, manajer _cache_ lokal, dll.
* catatan dan _checkpoint_ cadangan, kompresi, rotasi, dll.
* pengamat perubahan data, pengintip catatan, adapter pencatatan dan pemantauan,
penerbit peristiwa, dll.
* proksi, jembatan dan adaptor.
* pengontrol, manajer, konfigurasi dan pembaharu.

Secara umum, masing-masing Pod tidak dimaksudkan untuk menjalankan beberapa 
aplikasi yang sama.

Penjelasan lebih lengkap bisa melihat [The Distributed System ToolKit: Patterns for Composite Containers](https://kubernetes.io/blog/2015/06/the-distributed-system-toolkit-patterns).


## Alternatif pertimbangan

Kenapa tidak menjalankan banyak program dalam satu kontainer (Docker)?

1. Transparansi. Membuat kontainer dalam suatu Pod menjadi terlihat dari infrastruktur,
   memungkinkan infrastruktur menyediakan servis ke kontainer tersebut, misalnya saja
   pengelolaan proses dan pemantauan sumber daya. Ini memfasilitasi sejumlah 
   kenyamanan untuk pengguna.
1. Pemisahan ketergantungan perangkat lunak. Setiap kontainer mungkin memiliki 
   versi, dibuat dan dijalankan ulang secara independen. Kubernetes mungkin mendukung
   pembaharuan secara langsung terhadap suatu kontainer, suatu saat nanti.
1. Mudah digunakan. Penguna tidak diharuskan menjalankan manajer prosesnya sendiri,
   khawatir dengan sinyal dan propagasi _exit-code_, dan lain sebagainya.
1. Efisiensi. Karena infrastruktur memegang lebih banyak tanggung jawab, kontainer
   bisa lebih ringan.

Kenapa tidak mendukung penjadwalan kontainer berdasarkan _affinity_?

Cara itu bisa menyediakan lokasi yang sama, namun tidak memberikan banyak 
keuntungan dari Pod, misalnya saja berbagi sumber daya, IPC, jaminan berbagi nasib
dan kemudahan manajemen.

## Ketahanan suatu Pod (atau kekurangan)

Pod tidak dimaksudkan untuk diperlakukan sebagai entitas yang tahan lama. 
Mereka tidak akan bertahan dengan kegagalan penjadwalan, kegagalan mesin,
atau _eviction_ (pengusiran), misalnya karena kurangnya sumber daya atau dalam suatu
kasus mesin sedang dalam pemeliharaan.

Secara umum, pengguna tidak seharusnya butuh membuat Pod secara langsung. Mereka 
seharusnya selalu menggunakan pengontrol, sekalipun untuk yang tunggal, misalnya,
[_Deployment_](/id/docs/concepts/workloads/controllers/deployment/). Pengontrol
menyediakan penyembuhan diri dengan ruang lingkup kelompok, begitu juga dengan
pengelolaan replikasi dan penluncuran. 
Pengontrol seperti [_StatefulSet_](/id/docs/concepts/workloads/controllers/statefulset.md)
bisa memberikan dukungan terhadap Pod yang _stateful_.

Penggunaan API kolektif sebagai _user-facing primitive_ utama adalah hal yang
relatif umum diantara sistem penjadwalan kluster, seperti 

[Borg](https://research.google.com/pubs/pub43438.html), 
[Marathon](https://github.com/d2iq-archive/marathon), 
[Aurora](http://aurora.apache.org/documentation/latest/reference/configuration/#job-schema), dan
[Tupperware](https://www.slideshare.net/Docker/aravindnarayanan-facebook140613153626phpapp02-37588997).

Pod diekspose sebagai _primitive_ untuk memfasilitasi hal berikut:

* penjadwalan dan pengontrol sifat _pluggability_
* mendukung operasi pada level Pod tanpa perlu melakukan proksi melalui API pengontrol
* pemisahan antara umur suatu Pod dan pengontrol, seperti misalnya _bootstrapping_.
* pemisahan antara pengontrol dan servis, pengontrol _endpoint_ hanya memperhatikan Pod
* komposisi yang bersih antara fungsionalitas dilevel Kubelet dan klaster. Kubelet 
  secara efektif adalah pengontrol Pod.
* aplikasi dengan ketersediaan tinggi, yang akan mengharapkan Pod akan digantikan 
  sebelum dihentikan dan tentu saja sebelum dihapus, seperti dalam kasus penggusuran 
  yang direncanakan atau pengambilan gambar.

## Penghentian Pod

Karena Pod merepresentasikan proses yang berjalan pada mesin didalam klaster, sangat 
penting untuk memperbolehkan proses ini berhenti secara normal ketika sudah tidak 
dibutuhkan (dibandingkan dengan dihentikan paksa dengan sinyal KILL dan tidak memiliki
waktu untuk dibersihkan). Pengguna seharusnya dapat meminta untuk menghapus dan tahu
proses penghentiannya, serta dapat memastikan penghentian berjalan sempurna. Ketika 
pengguna meminta menghapus Pod, sistem akan mencatat masa tenggang untuk penghentian
secara normal sebelum Pod dipaksa untuk dihentikan, dan sinyal TERM akan dikirim ke
proses utama dalam setiap kontainer. Setelah masa tenggang terlewati, sinyal KILL 
akan dikirim ke setiap proses dan Pod akan dihapus dari API server. Jika Kubelet 
atau kontainer manajer dijalankan ulang ketika menunggu suatu proses dihentikan,
penghentian tersebut akan diulang dengan mengembalikan masa tenggang senilai semula.

Contohnya sebagai berikut:

1. Pengguna mengirim perintah untuk menghapus Pod, dengan masa tenggang (30 detik)
1. Pod dalam API server akan diperbarui dengan waktu dimana Pod dianggap "mati"
bersama dengan masa tenggang.
1. Pod ditampilkan dalam status "Terminating" ketika tercantum dalam perintah klien
1. (bersamaan dengan poin 3) Ketika Kubelet melihat Pod sudah ditandai sebagai 
"Terminating" karena waktu pada poin 2 sudah diatur, ini memulai proses penghentian Pod
	1. Jika salah satu kontainer pada Pod memiliki 
	[preStop _hook_](/id/docs/concepts/containers/container-lifecycle-hooks/#hook-details), 
	maka akan dipanggil di dalam kontainer. Jika `preStop` _hook_ masih berjalan
	setelah masa tenggang habis, langkah 2 akan dipanggil dengan tambahan masa tenggang
	yang sedikit, 2 detik.
	1. Semua kontainer akan diberikan sinyal TERM. Sebagai catatan, tidak semua kontainer 
	akan menerima sinyal TERM dalam waktu yang sama dan mungkin butuh waktu untuk 
	menjalankan `preStop` _hook_ jika bergantung pada urutan penghentiannya.
1. (bersamaan dengan poin 3) Pod akan dihapus dari daftar _endpoint_ untuk servis dan 
tidak lagi dianggap sebagai bagian dari Pod yang berjalan dalam _replication controllers_.
Pod yang dihentikan, secara perlahan tidak akan melayani permintaan karena load balancer 
(seperti servis proksi) menghapus mereka dari daftar rotasi.
1. Ketika masa tenggang sudah lewat, semua proses yang masih berjalan dalam Pod
akan dihentikan dengan sinyal SIGKILL.
1. Kubelet akan selesai menghapus Pod dalam API server dengan mengatur masa tenggang
menjadi 0 (langsung menghapus). Pod akan menghilang dari API dan tidak lagi terlihat
oleh klien.

Secara _default_, semua penghapusan akan berjalan normal selama 30 detik. Perintah
`kubectl delete` mendukung opsi `--grace-period=<waktu dalam detik>` yang akan
memperbolehkan pengguna untuk menimpa nilai awal dan memberikan nilai sesuai keinginan
pengguna. Nilai `0` akan membuat Pod
[dihapus paksa](/id/docs/concepts/workloads/pods/pod/#force-deletion-of-pods).
Kamu harus memberikan opsi tambahan `--force` bersamaan dengan `--grace-period=0`
untuk melakukan penghapusan paksa.

### Penghapusan paksa sebuah Pod

Penghapusan paksa dari sebuah Pod didefinisikan sebagai penghapusan Pod dari _state_ 
klaster dan etcd secara langsung. Ketika penghapusan paksa dilakukan, API server tidak
akan menunggu konfirmasi dari kubelet bahwa Pod sudah dihentikan pada mesin ia berjalan.
Ini menghapus Pod secara langsung dari API, sehingga Pod baru bisa dibuat dengan nama
yang sama. Dalam mesin, Pod yang dihentikan paksa akan tetap diberikan sedikit masa 
tenggang sebelum dihentikan paksa.

Penghentian paksa dapat menyebabkan hal berbahaya pada beberapa Pod dan seharusnya
dilakukan dengan perhatian lebih. Dalam kasus StatefulSet Pods, silakan melihat 
dokumentasi untuk [penghentian Pod dari StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/).

## Hak istimewa untuk kontainer pada Pod

Setiap kontainer dalam Pod dapat mengaktifkan hak istimewa (mode _privileged_), dengan menggunakan tanda
`privileged` pada [konteks keamanan](/id/docs/tasks/configure-pod-container/security-context/)
pada spesifikasi kontainer. Ini akan berguna untuk kontainer yang ingin menggunakan 
kapabilitas Linux seperti memanipulasi jaringan dan mengakses perangkat. Proses dalam
kontainer mendapatkan hak istimewa yang hampir sama dengan proses di luar kontainer.
Dengan hak istimerwa, seharusnya lebih mudah untuk menulis pada jaringan dan _plugin_ 
ruang penyimpanan sebagai Pod berbeda yang tidak perlu dikompilasi ke dalam kubelet.

{{< note >}}
_Runtime_ kontainer kamu harus mendukung konsep hak istimewa kontainer untuk membuat
pengaturan ini menjadi relevan.
{{< /note >}}

## API Object

Pod adalah sumber daya tingkat tinggi dalam Kubernetes REST API.
Definisi [Objek Pod API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core) menjelaskan mengenai objek secara lengkap.


