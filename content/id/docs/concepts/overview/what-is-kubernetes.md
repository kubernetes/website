---
title: Apa itu Kubernetes?
content_template: templates/concept
weight: 10
card: 
  name: concepts
  weight: 10
---

{{% capture overview %}}
Laman ini merupakan ikhtisar Kubernetes.
{{% /capture %}}

{{% capture body %}}
Kubernetes merupakan <i>platform open-source</i> yang digunakan untuk melakukan
manajemen <i>workloads</i> aplikasi yang dikontainerisasi, serta menyediakan 
konfigurasi dan otomatisasi secara deklaratif. Kubernetes berada di dalam ekosistem 
yang besar dan berkembang cepat. <i>Service</i>, <i>support</i>, dan perkakas 
Kubernetes tersedia secara meluas.

Google membuka Kubernetes sebagai proyek <i>open source</i> pada tahun 2014. 
Kubernetes dibangun berdasarkan [pengalaman Google selama satu setengah dekade dalam menjalankan workloads](https://research.google.com/pubs/pub43438.html) 
bersamaan dengan kontribusi berupa ide-ide terbaik yang diberikan oleh komunitas. 

## Mengapa Kubernetes dan hal apa saja yang dapat dilakukan oleh Kubernetes?

Kubernetes memiliki sejumlah fitur yang dapat dijabarkan sebagai berikut:

- <i>platform</i> kontainer
- <i>platform microservices</i>
- <i>platform cloud</i> yang tidak mudah dipindahkan 

Kubernetes menyediakan manajemen <i>environment</i> yang berpusat pada kontainer. 
Kubernetes melakukan orkestrasi terhadap <i>computing</i>, <i>networking</i>, 
dan inftrastruktur penyimpanan. Fitur inilah yang kemudian membuat konsep Platform as a Service (PaaS) 
menjadi lebih sederhana dilengkapi dengan fleksibilitas yang dimiliki oleh Infrastructure as a Service (IaaS).


## Lalu apa yang menyebabkan Kubernetes disebut sebagai sebuah platform? 

Meskipun Kubernetes menyediakan banyak fungsionalitas, selalu ada keadaan dimana 
hal tersebut membutuhkan fitur baru. <i>Workflow</i> spesifik yang terkait dengan 
proses pengembangan aplikasi dapat ditambahkan pada <i>streamline</i> untuk meningkatkan 
produktivitas developer. Orkestrasi ad-hoc yang dapat diterima biasanya membutuhkan desain 
otomatisasi yang kokoh agar bersifat <i>scalable</i>. Hal inilah yang membuat 
Kubernetes juga didesain sebagai <i>platform</i> untuk membangun ekosistem komponen dan 
dan perkakas untuk memudahkan proses <i>deployment</i>, <i>scale</i>, dan juga manajemen 
aplikasi. 

[Labels]() memudahkan pengguna mengkategorisasikan <i>resources</i> yang mereka miliki 
sesuai dengan kebutuhan. [Annotations]() memungkinkan pengguna untuk menambahkan informasi 
tambahan pada <i>resource</i> yang dimiliki. 

Selain itu, [Kubernetes control plane]() dibuat berdasarkan 
[API](/docs/reference/using-api/api-overview/) yang tersedia bagi pengguna dan developer. Pengguna 
dapat mengimplementasikan kontroler sesuai dengan kebutuhan mereka, contohnya adalah
[schedulers](https://github.com/kubernetes/community/blob/{{< param "githubbranch" >}}/contributors/devel/scheduler.md),
dengan [API kustom yang mereka miliki](), kontroler kustom ini kemudian dapat digunakan 
pada [command-line
tool]() generik yang ada.

[Desain](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md)
inilah yang memungkinkan beberapa sistem lain untuk dapat dibangun di atas Kubernetes. 

## Lalu hal apakah yang tidak termasuk di dalam Kubernetes?

Kubernetes bukanlah sebuah <i>PaaS (Platform as a
Service)</i> yang biasanya. Meskipun Kubernetes dijalankan pada tingkatan kontainer 
dan bukan pada tingkatan perangkat keras, Kubernetes menyediakan beberapa fitur 
yang biasanya disediakan oleh Paas, seperti <i>deployment</i>, <i>scaling</i>, 
<i>load balancing</i>, <i>logging</i>, dan <i>monitoring</i>. Akan tetapi, 
Kubernetes bukanlah sistem monolitik, melainkan suatu sistem yang bersifat sebagai 
<i>bulding block</i> dan <i>pluggable</i> yang dapat digunakan untuk membangun sebuah 
platform yang dibutuhkan oleh developer dengan tetap mengutamakan konsep fleksibilitas.

Kubernetes:

* Tidak melakukan limitasi terhadap aplikasi yang di-support. Kubernetes bertujuan 
  untuk mendukung berbagai variasi <i>workloads</i>, termasuk 
  <i>stateless</i>, <i>stateful</i>, dan <i>data-processing</i>. Jika sebuah 
  aplikasi dapat dijalankan di atas kontainer, maka aplikasi tersebut juga dapat 
  dijalankan di atas Kubernetes. 
* Tidak menyediakan mekanisme untuk melakukan <i>deploy</i> kode sumber 
  maupun mekanisme <i>build</i> sebuah aplikasi. <i>Continuous Integration, Delivery, and Deployment 
  (CI/CD) workflows</i> ditentukan oleh preferensi serta kebutuhan teknis organisasi.  
* Tidak menyediakan <i>application-level services</i>, seperti <i>middleware
  (e.g., message buses)</i>, <i>data-processing frameworks (for example,
  Spark)</i>, <i>databases (e.g., mysql)</i>, <i>caches</i>, maupun <i>cluster storage systems (e.g.,
  Ceph)</i> sebagai suatu <i>built-in services</i>. Komponen tersebut dapat dijalankan di atas Kubernetes, dan/atau
  dapat diakses oleh aplikasi yang dijalankan di atas Kubernetes melalui sebuah mekanisme tidak mudah dipindahkan 
  misalnya saja <i>Open Service Broker</i>.
* Tidak membatasi penyedia layanan <i>logging</i>, <i>monitoring</i>, maupun <i>alerting</i> yang digunakan. 
  Kubernetes menyediakan <i>proof of concept</i> dan mekanisme integrasi yang dapat digunakan 
  untuk mengumpulkan serta mengekspor metriks yang ada.
* Tidak menyediakan atau mengharuskan penggunaan <i>configuration language/system (e.g.,
  [jsonnet](https://github.com/google/jsonnet))</i>. Kubernetes menyediakan suatu API deklaratif 
  yang dapat digunakan oleh berbagai jenis spesifikasi deklaratif. 
* Tidak menyediakan atau mengadaptasi sebuah konfigurasi, <i>maintenance</i>, manajemen, atau 
  <i>self-healing</i> mesin dengan spesifikasi khusus. 

Sebagai tambahan, Kubernetes bukanlah sebuah *sitem orkestrasi biasa*. Bahkan pada kenyataannya,
Kubernetes menghilangkan kebutuhan untuk melakukan orkestrasi. Definisi teknis dari 
*orkestrasi* merupakan eksekusi dari sebuah workflow yang sudah didefinisikan sebelumnya: pertama kerjakan A, kemudian B, 
dan terakhir C. Sebaliknya, Kubernetes disusun oleh seperangkat 
proses kontrol yang dapat idekomposisi yang selalu menjalankan <i>state</i> yang ada 
saat ini hingga sesuai dengan <i>state</i> yang dinginkan. 
Kita tidak perlu peduli proses apa saja yang perlu dilakukan untuk melakukan A hingga C. 
Mekanisme kontrol yang tersentralisasi juga tidak dibutuhkan. Dengan demikian, sistem yang 
dihasilkan lebih mudah digunakan lebih kokoh, serta lebih <i>extensible</i>. 

## Mengapa kontainer?

Mencari alasan kenapa kita harus menggunakan kontainer? 

![Mengapa kontainer?](/images/docs/why_containers.svg)

*Cara Lama* untuk melakukan mekanisme <i>deploy</i> suatu aplikasi 
adalah dengan cara instalasi aplikasi tersebut pada sebuah mesin 
dengan menggunakan <i>package manager</i> yang dimiliki oleh sistem operasi 
mesin tersebut. Hal ini menciptakan suatu ketergantungan antara <i>executables</i>, 
konfigurasi, serta ketergantungan lain yang dibutuhkan aplikasi dengan sistem operasi 
yang digunakan oleh mesin. Untuk mengatasi hal ini, tentunya bisa saja kita melakukan 
mekanisme <i>build</i> suatu <i>image</i> VM yang <i>immutable</i> untuk mendapatkan 
mekanisme <i>rollouts</i> dan <i>rollback</i> yang dapat diprediksi. 
Meskipun demikian, VM masih dianggap "berat" dan tidak tidak mudah dipindahkan. 

*Cara Baru* adalah dengan melakukan mekanisme <i>deploy</i> kontainer pada tingkatan 
virtualisasi di level sistem operasi (OS) bukan pada tingkatan virtualisasi perangkat keras. 
Kontainer ini berada dalam lingkungan yang terisolasi satu sama lain serta terisolasi dengan 
mesin dimana kontainer ini berada. Kontainer ini memiliki <i>filesystems</i> masing-masing.
Selain itu, setiap kontainer tidak dapat "melihat" <i>process</i> yang sedang dijalankan di 
kontainer lain. Selain itu <i>resource</i> komputasi yang digunakan oleh kontainer 
ini juga dapat dibatasi. Kontainer juga dapat dengan lebih mudah di-<i>build</i> jika 
dibandingkan dengan VM, karena kontainer tidak bergantung pada <i>filesystem</i>
yang dimiliki mesin, serta dengan mudah dapat didistribusikan.

Karena kontainer ukurannya kecil dan lebih cepat, sebuah aplikasi dapat dibangun di setiap 
<i>image</i> kontainer. Mekanisme pemetaan satu-satu antara kontainer dan aplikasi 
inilah yang membuka keuntungan secara meyeluruh yang dapat diberikan oleh kontainer. 
Dengan menggunakan kontainer, <i>image</i> kontainer dapat dibuat diwaktu rilis aplikasi. 
Pembuatan <i>image</i> ini memungkinkan aplikasi secara konsisten dirilis pada 
<i>environment</i> <i>development</i> maupun <i>production</i>. Selain itu, 
kontainer juga memiliki transparasi yang lebih tinggi dibandingkan dengan VM. Maksudnya, 
infrastruktur punya tugas untuk mengatur lifecycle seluruh process yang ada di dalam kontainer. Ini bukanlah lagi tugas sebuah supervisor process yang tersembunyi di dalam kontainer.

Secara garis besar, penggunaan kontainer memiliki keuntungan sebagai berikut:

* **Mekanisme pembuatan aplikasi serta proses deployment yang lebih efektif**:
    Kontainer dapat meningkatkan kemudahan dan efisiensi jika dibandingkan dengan penggunaan VM.
* **Continuous development, integration, and deployment**:
    Digunakan untuk melakukan proses <i>build</i> dan <i>deploy</i> yang sering dilakukan 
    serta kemudahan mekanisme <i>rollback</i> karena image yang ada sifatnya <i>immutable</i>. 
* **Pemisahan kepentingan antara Dev dan Ops**:
    Pembuatan <i>image</i> container dilakukan pada saat rilis dan bukan pada saat <i>deploy</i> 
    mengurangi ketergantungan aplikasi dan infrastruktur.
* **Observabilitas**
    Tidak hanya informasi dan metriks pada level OS, tapi juga kesehatan aplikasi dan <i>signal</i> lain.
* **Konsistensi <i>environment</i> pada masa pengembangan , <i>testing</i>, dan <i>production</i>**:
    Memiliki perilaku yang sama baik ketika dijalankan di mesin lokal maupun penyedia layanan <i>cloud</i>.
* **Portabilitas antar penyedia layanan <i>cloud</i> maupun distribusi OS**:
    Dapat dijalankan pada Ubuntu, RHEL, CoreOS, on-prem, Google Kubernetes Engine, dan dimanapun.
* **Manajemen yang bersifat Aplikasi sentris**:
    Meningkatkan level abstraksi dari proses menjalankan OS pada perangkat keras virtual
    ke proses menjalankan aplikasi pada sebuah OS dengan menggunakan <i>resource</i> logis. 
* **[Mikroservis](https://martinfowler.com/articles/microservices.html) yang renggang (loosely coupled), terdistribusi, elastis, dan terliberasi**:
    Aplikasi dapat dipecah menjadi komponen yang lebih kecil yang independen dan dapat 
    di-<i>deploy</i> dan diatur secara dinamis -- bukan sebuah sistem monolitik yang dijalankan pada 
    sebuah mesin yang hanya punya satu tujuan.
* **Isolasi <i>resource</i>**:
    Performa aplikasi yang bisa diprediksi.
* **Utilisasi <i>resource</i>**:
    Efisiensi yang tinggi

## Apakah arti Kubernetes? K8s?

Nama **Kubernetes** berasal dari Bahasa Yunani, yang berarti *juru mudi* atau
*pilot*, dan merupakan asal kata *gubernur* dan
[cybernetic](http://www.etymonline.com/index.php?term=cybernetics). *K8s*
merupakan sebuah singkatan yang didapat dengan mengganti 8 huruf "ubernete" dengan
"8".

{{% /capture %}}

{{% capture whatsnext %}}
*   Siap untuk [memulai](/docs/setup/)?
*   Untuk penjelasan lebih rinci, silahkan lihat [Dokumentasi Kubernetes](/docs/home/).
{{% /capture %}}


