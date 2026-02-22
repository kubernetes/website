---
title: Prioritas dan Kesetaraan API (API Priority and Fairness)
content_type: concept
min-kubernetes-server-version: v1.18
---

<!-- overview -->

{{< feature-state state="alpha"  for_k8s_version="v1.18" >}}

Mengontrol perilaku server API dari Kubernetes pada situasi beban berlebih
merupakan tugas utama dari administrator klaster. {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}} memiliki beberapa kontrol yang tersedia
(seperti opsi `--max-request-inflight` dan `--max-mutating-request-inflight`
pada baris perintah atau _command-line_) untuk membatasi jumlah pekerjaan luar biasa yang akan
diterima, untuk mencegah banjirnya permintaan masuk dari beban berlebih
yang berpotensi untuk menghancurkan server API. Namun opsi ini tidak cukup untuk memastikan
bahwa permintaan yang paling penting dapat diteruskan pada saat kondisi lalu lintas (_traffic_) yang cukup tinggi.

Fitur Prioritas dan Kesetaraan API atau _API Priority and Fairness_ (APF) adalah alternatif untuk meningkatkan
batasan _max-inflight_ seperti yang disebutkan di atas. APF mengklasifikasi
dan mengisolasi permintaan dengan cara yang lebih halus. Fitur ini juga memperkenalkan
jumlah antrian yang terbatas, sehingga tidak ada permintaan yang ditolak
pada saat terjadi lonjakan permintaan dalam waktu yang sangat singkat. Permintaan dibebaskan dari antrian dengan menggunakan
teknik antrian yang adil (_fair queuing_) sehingga, sebagai contoh, perilaku buruk dari satu
{{<glossary_tooltip text="controller" term_id="controller">}} tidak seharusnya
mengakibatkan _controller_ yang lain menderita (meskipun pada tingkat prioritas yang sama).

{{< caution >}}
Permintaan yang diklasifikasikan sebagai "long running" - terutama _watch_ - tidak
mengikuti filter prioritas dan kesetaraan API. Dimana ini juga berlaku pada
opsi `--max-request-inflight` tanpa mengaktifkan APF.

{{< /caution >}}



<!-- body -->

## Mengaktifkan prioritas dan kesetaraan API

Fitur APF dikontrol oleh sebuah gerbang fitur (_feature gate_)
dan fitur ini tidak diaktifkan secara bawaan. Silahkan lihat
[gerbang fitur](/docs/reference/command-line-tools-reference/feature-gates/)
untuk penjelasan umum tentang gerbang fitur dan bagaimana cara mengaktifkan dan menonaktifkannya.
Nama gerbang fitur untuk APF adalah "APIPriorityAndFairness".
Fitur ini melibatkan sebuah {{<glossary_tooltip term_id="api-group"
text="Grup API">}} yang harus juga diaktifkan. Kamu bisa melakukan ini dengan 
menambahkan opsi pada baris perintah berikut pada permintaan ke `kube-apiserver` kamu:

```shell
kube-apiserver \
--feature-gates=APIPriorityAndFairness=true \
--runtime-config=flowcontrol.apiserver.k8s.io/v1alpha1=true \
 # …dan opsi-opsi lainnya seperti biasa
```

Opsi pada baris perintah `--enable-priority-and-fairness=false` akan menonaktifkan fitur
APF, bahkan ketika opsi yang lain telah mengaktifkannya.

## Konsep
Ada beberapa fitur lainnya yang terlibat dalam fitur APF. Permintaan yang masuk diklasifikasikan berdasarkan atribut permintaan dengan menggunakan
FlowSchema, dan diserahkan ke tingkat prioritas. Tingkat prioritas menambahkan tingkat
isolasi dengan mempertahankan batas konkurensi yang terpisah, sehingga permintaan yang diserahkan
ke tingkat prioritas yang berbeda tidak dapat membuat satu sama lain menderita. Dalam sebuah tingkat prioritas,
algoritma _fair-queuing_ mencegah permintaan dari _flows_ yang berbeda akan memberikan penderitaan
kepada yang lainnya, dan memperbolehkan permintaan untuk dimasukkan ke dalam antrian untuk mencegah pelonjakan lalu lintas
yang akan menyebabkan gagalnya permintaan, walaupun pada saat beban rata-ratanya cukup rendah.

### Tingkat prioritas (_Priority Level_)
Tanpa pengaktifan APF, keseluruhan konkurensi dalam
server API dibatasi oleh opsi pada `kube-apiserver` 
`--max-request-inflight` dan `--max-mutating-request-inflight`. Dengan pengaktifan APF, 
batas konkurensi yang ditentukan oleh opsi ini akan dijumlahkan dan kemudian jumlah tersebut dibagikan
untuk sekumpulan tingkat prioritas (_priority level_) yang dapat dikonfigurasi. Setiap permintaan masuk diserahkan
ke sebuah tingkat prioritas, dan setiap tingkat prioritas hanya akan meneruskan sebanyak mungkin
permintaan secara bersamaan sesuai dengan yang diijinkan dalam konfigurasi.

Konfigurasi bawaan, misalnya, sudah mencakup tingkat prioritas terpisah untuk
permintaan dalam rangka pemilihan pemimpin (_leader-election_), permintaan dari _controller_ bawaan, dan permintaan dari
Pod. Hal ini berarti bahwa Pod yang berperilaku buruk, yang bisa membanjiri server API
dengan permintaan, tidak akan mampu mencegah kesuksesan pemilihan pemimpin atau tindakan yang dilakukan oleh _controller_ bawaan.

### Antrian (_Queuing_)

Bahkan dalam sebuah tingkat prioritas mungkin akan ada sumber lalu lintas yang berbeda dalam jumlah besar. 
Dalam situasi beban berlebih, sangat penting untuk mencegah satu aliran
permintaan dari penderitaan karena aliran yang lainnya (khususnya, dalam kasus yang relatif umum dari sebuah
klien tunggal bermasalah (_buggy_) yang dapat membanjiri _kube-apiserver_ dengan permintaan, klien bermasalah itu
idealnya tidak memiliki banyak dampak yang bisa diukur terhadap klien yang lainnya). Hal ini 
ditangani dengan menggunakan algoritma _fair-queuing_ untuk memproses permintaan yang diserahkan
oleh tingkat prioritas yang sama. Setiap permintaan diserahkan ke sebuah _flow_, yang diidentifikasi berdasarkan
nama FlowSchema yang sesuai, ditambah dengan _flow distinguisher_ - yang
bisa saja didasarkan pada pengguna yang meminta, sumber daya Namespace dari target, atau tidak sama sekali - dan
sistem mencoba untuk memberikan bobot yang hampir sama untuk permintaan dalam _flow_ yang berbeda dengan tingkat prioritas yang sama.

Setelah mengklasifikasikan permintaan ke dalam sebuah _flow_, fitur APF kemudian 
dapat menyerahkan permintaan ke dalam sebuah antrian. Penyerahan ini menggunakan
teknik yang dikenal sebagai {{<glossary_tooltip term_id="shuffle-sharding"
text="_shuffle sharding_">}}, yang membuat penggunaan antrian yang relatif efisien
untuk mengisolasi _flow_ dengan intensitas rendah dari _flow_ dengan intensitas tinggi.

Detail dari algoritma antrian dapat disesuaikan untuk setiap tingkat prioritas, dan
memperbolehkan administrator untuk menukar (_trade off_) dengan penggunaan memori, kesetaraan (properti dimana
_flow_ yang independen akan membuat semua kemajuan ketika total dari lalu lintas sudah melebihi kapasitas),
toleransi untuk lonjakan lalu lintas, dan penambahan latensi yang dihasilkan oleh antrian.

### Permintaan yang dikecualikan (_Exempt Request_)
Beberapa permintaan dianggap cukup penting sehingga mereka tidak akan mengikuti
salah satu batasan yang diberlakukan oleh fitur ini. Pengecualian ini untuk mencegah
konfigurasi _flow control_ yang tidak terkonfigurasi dengan baik sehingga tidak benar-benar menonaktifkan server API.

## Bawaan (_Default_)

Fitur APF dikirimkan dengan konfigurasi yang disarankan
dimana konfigurasi itu seharusnya cukup untuk bereksperimen; jika klaster kamu cenderung
mengalami beban berat maka kamu harus mempertimbangkan konfigurasi apa yang akan bekerja paling baik. 
Kelompok konfigurasi yang disarankan untuk semua permintaan terbagi dalam lima prioritas
kelas:

* Tingkat prioritas `system` diperuntukkan bagi permintaan dari grup `system:nodes`,
  mis. Kubelet, yang harus bisa menghubungi server API agar
  mendapatkan _workload_ untuk dijadwalkan.

* Tingkat prioritas `leader-election` diperuntukkan bagi permintaan dalam pemilihan pemimpin (_leader election_)
  dari _controller_ bawaan (khususnya, permintaan untuk `endpoint`, `configmaps`,
  atau `leases` yang berasal dari `system:kube-controller-manager` atau pengguna
  `system:kube-scheduler` dan akun Service di Namespace `kube-system`). Hal ini 
  penting untuk mengisolasi permintaan ini dari lalu lintas yang lain karena 
  kegagalan dalam pemilihan pemimpin menyebabkan _controller_ akan gagal dan memulai kembali (_restart_), 
  yang pada akhirnya menyebabkan lalu lintas yang lebih mahal karena _controller_ 
  yang baru perlu menyinkronkan para informannya.

* Tingkat prioritas `workload-high` diperuntukkan bagi permintaan yang lain dari _controller_ bawaan.
  
* Tingkat prioritas `workload-low` diperuntukkan bagi permintaan dari akun Service yang lain,
  yang biasanya mencakup semua permintaan dari _controller_ yang bekerja didalam Pod.
  
* Tingkat prioritas `global-default` menangani semua lalu lintas lainnya, mis.
  perintah interaktif `kubectl` yang dijalankan oleh pengguna yang tidak memiliki hak khusus.

Kemudian, ada dua PriorityLevelConfiguration dan dua FlowSchema yang telah
dibangun dan tidak mungkin ditimpa ulang:

* Tingkat prioritas khusus `exempt` diperuntukkan bagi permintaan yang tidak akan dikenakan
  _flow control_ sama sekali: permintaan itu akan selalu diteruskan sesegera mungkin.
  FlowSchema `exempt` khusus mengklasifikasikan semua permintaan dari kelompok `system:masters`
  ke dalam tingkat prioritas khusus ini. Kamu juga dapat menentukan FlowSchema lain yang mengarahkan
  permintaan lain ke tingkat prioritas ini juga, apabila permintaan tersebut sesuai.
  
* Tingkat prioritas khusus `catch-all` digunakan secara kombinasi dengan spesial
  FlowSchema `catch-all` untuk memastikan bahwa setiap permintaan mendapatkan proses
  klasifikasi. Biasanya kamu tidak harus bergantung pada konfigurasi _catch-all_ ini,
  dan kamu seharusnya membuat FlowSchema _catch-all_ dan PriorityLevelConfiguration kamu sendiri
  (atau gunakan konfigurasi `global-default` yang sudah diinstal secara bawaan) secara benar.
  Untuk membantu menemukan kesalahan konfigurasi yang akan melewatkan beberapa klasifikasi
  permintaan, maka tingkat prioritas `catch-all` hanya wajib mengijinkan satu konkurensi
  bersama dan tidak melakukan memasukkan permintaan dalam antrian, sehingga membuat lalu lintas
  yang secara relatif hanya sesuai dengan FlowSchema `catch-all` akan ditolak dengan kode kesalahan HTTP 429.

## Sumber daya (_Resource_)
_Flow control_ API melibatkan dua jenis sumber daya.
[PriorityLevelConfiguration](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#prioritylevelconfiguration-v1alpha1-flowcontrol-apiserver-k8s-io) 
yang menentukan kelas isolasi yang tersedia, bagian dari konkurensi anggaran yang tersedia 
yang masing-masing dapat menangani bagian tersebut, dan memperbolehkan untuk melakukan _fine-tuning_ terhadap perilaku antrian.
[FlowSchema](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#flowschema-v1alpha1-flowcontrol-apiserver-k8s-io)
yang digunakan untuk mengklasifikasikan permintaan individu yang masuk, mencocokkan masing-masing dengan setiap 
PriorityLevelConfiguration.

### PriorityLevelConfiguration
Sebuah PriorityLevelConfiguration merepresentasikan sebuah kelas isolasi tunggal. Setiap
PriorityLevelConfiguration memiliki batas independensi dalam hal jumlah
permintaan yang belum diselesaikan, dan batasan dalam hal jumlah permintaan yang mengantri.

Batas konkurensi untuk PriorityLevelConfiguration tidak disebutkan dalam
jumlah permintaan secara mutlak, melainkan dalam "concurrency shares." Total batas konkurensi
untuk server API didistribusikan di antara PriorityLevelConfiguration yang ada 
secara proporsional dengan "concurrency shares" tersebut. Ini mengizinkan seorang
administrator klaster untuk meningkatkan atau menurunkan jumlah total lalu lintas ke sebuah
server dengan memulai kembali `kube-apiserver` dengan nilai opsi
`--max-request-inflight` (atau `--max-mutating-request-inflight`) yang berbeda, dan semua
PriorityLevelConfiguration akan melihat konkurensi maksimum yang diizinkan kepadanya untuk menaikkan (atau
menurunkan) dalam fraksi yang sama.

{{< caution >}}
Dengan fitur Prioritas dan Kesetaraan yang diaktifkan, batas total konkurensi untuk
server diatur pada nilai penjumlahan dari `--max-request-inflight` dan
`--max-mutating-request-inflight`. Tidak akan ada lagi perbedaan
antara permintaan yang bermutasi dan permintaan yang tidak bermutasi; jika kamu ingin melayaninya
secara terpisah untuk suatu sumber daya yang ada, maka perlu membuat FlowSchema terpisah yang sesuai dengan
masing-masing kata kerja dari permintaan yang bermutasi dan yang tidak bermutasi tersebut.
{{< /caution >}}

Ketika jumlah permintaan masuk yang diserahkan kepada sebuah
PriorityLevelConfiguration melebihi dari tingkat konkurensi yang diizinkan, 
bagian `type` dari spesifikasinya menentukan apa yang akan terjadi pada permintaan selanjutnya.
Tipe `Reject` berarti bahwa kelebihan lalu lintas akan segera ditolak
dengan kode kesalahan HTTP 429 (yang artinya terlalu banyak permintaan). Tipe `Queue` berarti permintaan
di atas batas tersebut akan mengantri, dengan teknik _sharding shuffle_ dan _fair queuing_ yang digunakan
untuk menyelaraskan kemajuan antara _flow_ permintaan.

Konfigurasi antrian memungkinkan mengatur algoritma _fair queuing_ untuk sebuah
tingkat prioritas. Detail algoritma dapat dibaca di [proposal pembaharuan](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1040-priority-and-fairness), namun secara singkat:

* Meningkatkan `queue` (antrian) berarti mengurangi tingkat tabrakan antara _flow_ yang berbeda, 
  sehingga berakibat pada biaya untuk meningkatkan penggunaan memori. Nilai 1 di sini secara 
  efektif menonaktifkan logika _fair-queuing_, tetapi masih mengizinkan permintaan untuk 
  dimasukkan kedalam antrian.

* Meningkatkan `queueLengthLimit` berarti memperbolehkan lonjakan yang lebih besar dari lalu lintas 
  untuk berkelanjutan tanpa menggagalkan permintaan apa pun, dengan konsekuensi akan meningkatkan
  latensi dan penggunaan memori.

* Mengubah `handSize` berarti memperbolehkan kamu untuk menyesuaikan probabilitas tabrakan antara
   _flow_ yang berbeda dan keseluruhan konkurensi yang tersedia untuk satu _flow_ tunggal 
   dalam situasi beban berlebih.
  
    {{< note >}}
     `HandSize` yang lebih besar membuat dua _flow_ individual berpeluang kecil untuk bertabrakan
     (dan dimana _flow_ yang satu bisa membuat _flow_ yang lain menderita), tetapi akan lebih memungkinkan
     bahwa _flow_ dalam jumlah kecil akan dapat mendominasi apiserver. `HandSize` yang lebih besar juga
     berpotensi meningkatkan jumlah latensi yang diakibatkan oleh satu _flow_ lalu lintas tunggal 
     yang tinggi. Jumlah maksimum permintaan dalam antrian yang diijinkan dari sebuah _flow_ tunggal 
     adalah `handSize * queueLengthLimit`.
    {{< /note >}}

Berikut ini adalah tabel yang menunjukkan koleksi konfigurasi _shuffle sharding_ 
yang menarik, dimana setiap probabilitas _mouse_ (_flow_ dengan intensitas rendah) 
yang diberikan akan dimampatkan oleh _elephant_ (_flow_ dengan intensitas tinggi) dalam sebuah koleksi ilustratif 
dari jumlah _elephant_ yang berbeda. Silahkan lihat pada
https://play.golang.org/p/Gi0PLgVHiUg, yang digunakan untuk menghitung nilai-nilai dalam tabel ini.

{{< table caption="Contoh Konfigurasi Shuffle Sharding" >}}
|HandSize|     Queues|	1 elephant|		4 elephants|		16 elephants|
|--------|-----------|------------|----------------|--------------------|
|      12|         32|	4.428838398950118e-09|	0.11431348830099144|	0.9935089607656024|
|      10|         32|	1.550093439632541e-08|	0.0626479840223545|	0.9753101519027554|
|      10|         64|	6.601827268370426e-12|	0.00045571320990370776|	0.49999929150089345|
|       9|         64|	3.6310049976037345e-11|	0.00045501212304112273|	0.4282314876454858|
|       8|         64|	2.25929199850899e-10|	0.0004886697053040446|	0.35935114681123076|
|       8|        128|	6.994461389026097e-13|	3.4055790161620863e-06|	0.02746173137155063|
|       7|        128|	1.0579122850901972e-11|	6.960839379258192e-06|	0.02406157386340147|
|       7|        256|	7.597695465552631e-14|	6.728547142019406e-08|	0.0006709661542533682|
|       6|        256|	2.7134626662687968e-12|	2.9516464018476436e-07|	0.0008895654642000348|
|       6|        512|	4.116062922897309e-14|	4.982983350480894e-09|	2.26025764343413e-05|
|       6|       1024|	6.337324016514285e-16|	8.09060164312957e-11|	4.517408062903668e-07|
{{< /table >}}

### FlowSchema

FlowSchema mencocokkan beberapa permintaan yang masuk dan menetapkan permintaan ke dalam sebuah
tingkat prioritas. Setiap permintaan masuk diuji dengan setiap
FlowSchema secara bergiliran, dimulai dari yang terendah secara numerik ---
yang kita anggap sebagai yang tertinggi secara logis --- `matchingPrecedence` dan
begitu seterusnya. FlowSchema yang cocok pertama kali akan menang.

{{< caution >}}
Hanya FlowSchema yang pertama kali cocok untuk permintaan yang diberikan yang akan dianggap penting. Jika ada banyak
FlowSchema yang cocok dengan sebuah permintaan masuk, maka akan ditetapkan berdasarkan salah satu
yang mempunyai `matchingPrecedence` tertinggi. Jika ada beberapa FlowSchema dengan nilai
`matchingPrecedence` yang sama dan cocok dengan permintaan yang sama juga, permintaan dengan leksikografis
`name` yang lebih kecil akan menang, tetapi akan lebih baik untuk tidak mengandalkan metode ini, dan sebaiknya
perlu memastikan bahwa tidak ada dua FlowSchema yang memiliki `matchingPrecedence` yang sama.
{{< /caution >}}

Sebuah FlowSchema dianggap cocok dengan sebuah permintaan yang diberikan jika setidaknya salah satu dari `rules` nya
ada yang cocok. Sebuah aturan (_rule_) cocok jika setidaknya satu dari `subject` *dan*
ada salah satu dari `resourceRules` atau `nonResourceRules` (tergantung dari apakah permintaan 
yang masuk adalah untuk URL sumber daya atau non-sumber daya) yang cocok dengan permintaan tersebut.

Untuk bagian `name` dalam subjek, dan bagian `verbs`, `apiGroups`, `resources`,
`namespaces`, dan `nonResourceURLs` dalam aturan sumber daya dan non-sumber daya,
_wildcard_ `*` mungkin bisa ditetapkan untuk mencocokkan semua nilai pada bagian yang diberikan,
sehingga secara efektif menghapusnya dari pertimbangan.

Sebuah `DistinguisherMethod.type` dari FlowSchema menentukan bagaimana permintaan 
yang cocok dengan Skema itu akan dipisahkan menjadi _flow_. Nilai tipe itu bisa jadi `ByUser`, dalam 
hal ini satu pengguna yang meminta tidak akan bisa menghabiskan kapasitas dari pengguna lain, 
atau bisa juga `ByNamespace`, dalam hal ini permintaan sumber daya
di salah satu Namespace tidak akan bisa menyebabkan penderitaan bagi permintaan akan sumber daya 
dalam kapasitas Namespace yang lain, atau bisa juga kosong (atau `distinguisherMethod` 
dihilangkan seluruhnya), dalam hal ini semua permintaan yang cocok dengan FlowSchema ini akan
dianggap sebagai bagian dari sebuah _flow_ tunggal. Pilihan yang tepat untuk FlowSchema yang diberikan
akan bergantung pada sumber daya dan lingkungan khusus kamu.

## Diagnosis
Setiap respons HTTP dari server API dengan fitur prioritas dan kesetaraan
yang diaktifkan memiliki dua _header_ tambahan: `X-Kubernetes-PF-FlowSchema-UID` dan
`X-Kubernetes-PF-PriorityLevel-UID`, yang mencatat skema _flow_ yang cocok dengan permintaan
dan tingkat prioritas masing-masing. Name Objek API tidak termasuk dalam _header_ ini jika pengguna peminta tidak
memiliki izin untuk melihatnya, jadi ketika melakukan _debugging_ kamu dapat menggunakan perintah seperti ini

```shell
kubectl get flowschema -o custom-columns="uid:{metadata.uid},name:{metadata.name}"
kubectl get prioritylevelconfiguration -o custom-columns="uid:{metadata.uid},name:{metadata.name}"
```

untuk mendapatkan pemetaan UID ke names baik untuk FlowSchema maupun PriorityLevelConfiguration.

## Observabilitas
Saat kamu mengaktifkan fitur Prioritas dan Kesetaraan API atau APF, kube-apiserver
akan mengeluarkan metrik tambahan. Dengan memantau metrik ini dapat membantu kamu untuk menentukan apakah
konfigurasi kamu tidak tepat dalam membatasi lalu lintas yang penting, atau menemukan
beban kerja yang berperilaku buruk yang dapat membahayakan kesehatan dari sistem.

* `apiserver_flowcontrol_rejected_requests_total` menghitung permintaan yang
  ditolak, mengelompokkannya berdasarkan nama dari tingkat prioritas yang ditetapkan,
  nama FlowSchema yang ditetapkan, dan alasan penolakan tersebut.
  Alasan penolakan akan mengambil dari salah satu alasan-alasan berikut:
    * `queue-full`, yang mengindikasikan bahwa sudah terlalu banyak permintaan 
       yang menunggu dalam antrian,
    * `concurrency-limit`, yang mengindikasikan bahwa PriorityLevelConfiguration 
       telah dikonfigurasi untuk menolak, bukan untuk memasukan permintaan berlebih ke 
       dalam antrian, atau
    * `time-out`, yang mengindikasikan bahwa permintaan masih dalam antrian
       ketika batas waktu antriannya telah berakhir.

* `apiserver_flowcontrol_dispatched_requests_total` menghitung permintaan
   yang sudah mulai dieksekusi, mengelompokkannya berdasarkan nama dari tingkat 
   prioritas yang ditetapkan, dan nama dari FlowSchema yang ditetapkan.

* `apiserver_flowcontrol_current_inqueue_requests` memberikan
   jumlah total sesaat secara instan dari permintaan dalam antrian (bukan yang dieksekusi),
   dan mengelompokkannya berdasarkan tingkat prioritas dan FlowSchema.

* `apiserver_flowcontrol_current_executing_requests` memberikan
   jumlah total yang instan dari permintaan yang dieksekusi, dan mengelompokkannya 
   berdasarkan tingkat prioritas dan FlowSchema.

* `apiserver_flowcontrol_request_queue_length_after_enqueue` memberikan
   histogram dari panjang antrian untuk semua antrian yang ada, mengelompokkannya berdasarkan 
   tingkat prioritas dan FlowSchema, berdasarkan pengambilan sampel oleh permintaan 
   _enqueued_. Setiap permintaan yang mendapatkan antrian berkontribusi ke satu sampel 
   dalam histogramnya, pelaporan panjang antrian dilakukan setelah permintaan yang 
   mengantri tersebut ditambahkan. Perlu dicatat bahwa ini akan menghasilkan statistik 
   yang berbeda dengan survei yang tidak bias.
    {{< note >}}
    Nilai asing atau tidak biasa dalam histogram akan berarti ada kemungkinan sebuah _flow_ 
    (misalnya, permintaan oleh satu pengguna atau untuk satu _namespace_, tergantung pada 
    konfigurasinya) telah membanjiri server API, dan sedang dicekik. Sebaliknya, jika 
    histogram dari satu tingkat prioritas menunjukkan bahwa semua antrian dalam prioritas 
    level itu lebih panjang daripada level prioritas yang lainnya, mungkin akan sesuai
    untuk meningkatkan _concurrency shares_ dari PriorityLevelConfiguration itu.
    {{< /note >}}

* `apiserver_flowcontrol_request_concurrency_limit` memberikan hasil perhitungan
   batas konkurensi (berdasarkan pada batas konkurensi total dari server API dan 
   _concurrency share_ dari PriorityLevelConfiguration) untuk setiap 
   PriorityLevelConfiguration.

* `apiserver_flowcontrol_request_wait_duration_seconds` memberikan histogram tentang bagaimana
   permintaan yang panjang dihabiskan dalam antrian, mengelompokkannya berdasarkan FlowSchema 
   yang cocok dengan permintaan, tingkat prioritas yang ditetapkan, dan apakah permintaan 
   tersebut berhasil dieksekusi atau tidak.
    {{< note >}}
    Karena setiap FlowSchema selalu memberikan permintaan untuk satu
    PriorityLevelConfiguration, kamu dapat menambahkan histogram untuk semua
    FlowSchema dalam satu tingkat prioritas untuk mendapatkan histogram yang efektif
    dari permintaan yang ditetapkan ke tingkat prioritas tersebut.
    {{< /note >}}

* `apiserver_flowcontrol_request_execution_seconds` memberikan histogram tentang bagaimana 
   caranya permintaan yang panjang diambil untuk benar-benar dieksekusi, mengelompokkannya 
   berdasarkan FlowSchema yang cocok dengan permintaan dan tingkat prioritas yang ditetapkan pada
   permintaan tersebut.



## {{% heading "whatsnext" %}}


Untuk latar belakang informasi mengenai detail desain dari prioritas dan kesetaraan API, silahkan lihat
[proposal pembaharuan](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1040-priority-and-fairness).
Kamu juga dapat membuat saran dan permintaan akan fitur melalui [SIG API
Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery).


