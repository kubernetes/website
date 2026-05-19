---
title: Arsitektur Logging
content_type: concept
weight: 60
---

<!-- overview -->

Log aplikasi dan sistem dapat membantu kamu untuk memahami apa yang terjadi di dalam klaster kamu. Log berguna untuk mengidentifikasi dan menyelesaikan masalah serta memonitor aktivitas klaster. Hampir semua aplikasi modern mempunyai sejenis mekanisme log sehingga hampir semua mesin kontainer didesain untuk mendukung suatu mekanisme _logging_. Metode _logging_ yang paling mudah untuk aplikasi dalam bentuk kontainer adalah menggunakan _standard output_ dan _standard error_.

Namun, fungsionalitas bawaan dari mesin kontainer atau _runtime_ biasanya tidak cukup memadai sebagai solusi log. Contohnya, jika sebuah kontainer gagal, sebuah pod dihapus, atau suatu _node_ mati, kamu biasanya tetap menginginkan untuk mengakses log dari aplikasimu. Oleh sebab itu, log sebaiknya berada pada penyimpanan dan _lifecyle_ yang terpisah dari node, pod, atau kontainer. Konsep ini dinamakan sebagai _logging_ pada level klaster. _Logging_ pada level klaster ini membutuhkan _backend_ yang terpisah untuk menyimpan, menganalisis, dan mengkueri log. Kubernetes tidak menyediakan solusi bawaan untuk penyimpanan data log, namun kamu dapat mengintegrasikan beragam solusi _logging_ yang telah ada ke dalam klaster Kubernetes kamu.




<!-- body -->

Arsitektur _logging_ pada level klaster yang akan dijelaskan berikut mengasumsikan bahwa sebuah _logging backend_ telah tersedia baik di dalam maupun di luar klastermu. Meskipun kamu tidak tertarik menggunakan _logging_ pada level klaster, penjelasan tentang bagaimana log disimpan dan ditangani pada node di bawah ini mungkin dapat berguna untukmu.

## Hal dasar _logging_ pada Kubernetes

Pada bagian ini, kamu dapat melihat contoh tentang dasar _logging_ pada Kubernetes yang mengeluarkan data pada _standard output_. Demonstrasi berikut ini menggunakan sebuah [spesifikasi pod](/examples/debug/counter-pod.yaml) dengan kontainer yang akan menuliskan beberapa teks ke _standard output_ tiap detik.

{{% codenew file="debug/counter-pod.yaml" %}}

Untuk menjalankan pod ini, gunakan perintah berikut:

```shell
kubectl apply -f https://k8s.io/examples/debug/counter-pod.yaml
```
Keluarannya adalah:
```
pod/counter created
```

Untuk mengambil log, gunakan perintah `kubectl logs` sebagai berikut:

```shell
kubectl logs counter
```
Keluarannya adalah:
```
0: Mon Jan  1 00:00:00 UTC 2001
1: Mon Jan  1 00:00:01 UTC 2001
2: Mon Jan  1 00:00:02 UTC 2001
...
```

Kamu dapat menambahkan parameter `--previous` pada perintah `kubectl logs` untuk mengambil log dari kontainer sebelumnya yang gagal atau _crash_. Jika pod kamu memiliki banyak kontainer, kamu harus menspesifikasikan kontainer mana yang kamu ingin akses lognya dengan menambahkan nama kontainer pada perintah tersebut. Lihat [dokumentasi `kubectl logs`](/docs/reference/generated/kubectl/kubectl-commands#logs) untuk informasi lebih lanjut.

## Node-level _logging_

![Node-level _logging_](/images/docs/user-guide/logging/logging-node-level.png)

Semua hal yang ditulis oleh aplikasi dalam kontainer ke `stdout` dan `stderr` akan ditangani dan diarahkan ke suatu tempat oleh mesin atau _engine_ kontainer. Contohnya,mesin kontainer Docker akan mengarahkan kedua aliran tersebut ke [suatu _logging driver_](https://docs.docker.com/engine/admin/logging/overview), yang akan dikonfigurasi pada Kubernetes untuk menuliskan ke dalam berkas dalam format json.

{{< note >}}
_Logging driver_ json dari Docker memperlakukan tiap baris sebagai pesan yang terpisah. Saat menggunakan _logging driver_ Docker, tidak ada dukungan untuk menangani pesan _multi-line_. Kamu harus menangani pesan _multi-line_ pada level agen log atau yang lebih tinggi.
{{< /note >}}

Secara _default_, jika suatu kontainer _restart_, kubelet akan menjaga kontainer yang mati tersebut beserta lognya. Namun jika suatu pod dibuang dari _node_, maka semua hal dari kontainernya juga akan dibuang, termasuk lognya.

Hal lain yang perlu diperhatikan dalam _logging_ pada level _node_ adalah implementasi rotasi log, sehingga log tidak menghabiskan semua penyimpanan yang tersedia pada _node._ Kubernetes saat ini tidak bertanggung jawab dalam melakukan rotasi log, namun _deployment tool_ seharusnya memberikan solusi terhadap masalah tersebut.
Contohnya, pada klaster Kubernetes, yang di _deployed_ menggunakan `kube-up.sh`, terdapat alat bernama [`logrotate`](https://linux.die.net/man/8/logrotate) yang dikonfigurasi untuk berjalan tiap jamnya. Kamu juga dapat menggunakan _runtime_ kontainer untuk melakukan rotasi log otomatis, misalnya menggunakan `log-opt` Docker.
Pada `kube-up.sh`, metode terakhir digunakan untuk COS _image_ pada GCP, sedangkan metode pertama digunakan untuk lingkungan lainnya. Pada kedua metode, secara _default_ akan dilakukan rotasi pada saat berkas log melewati 10MB.

Sebagai contoh, kamu dapat melihat informasi lebih rinci tentang bagaimana `kube-up.sh` mengatur _logging_ untuk COS _image_ pada GCP yang terkait dengan [_script_][cosConfigureHelper].

Saat kamu menjalankan perintah [`kubectl logs`](/docs/reference/generated/kubectl/kubectl-commands#logs) seperti pada contoh tadi, kubelet di _node_ tersebut akan menangani permintaan untuk membaca langsung isi berkas log sebagai respon.

{{< note >}}
Saat ini, jika suatu sistem eksternal telah melakukan rotasi, hanya konten dari berkas log terbaru yang akan tersedia melalui perintah `kubectl logs`. Contoh, jika terdapat sebuah berkas 10MB, `logrotate` akan melakukan rotasi sehingga akan ada dua buah berkas, satu dengan ukuran 10MB, dan satu berkas lainnya yang kosong. Maka `kubectl logs` akan mengembalikan respon kosong.
{{< /note >}}

[cosConfigureHelper]: https://github.com/kubernetes/kubernetes/blob/{{< param "githubbranch" >}}/cluster/gce/gci/configure-helper.sh

### Komponen sistem log

Terdapat dua jenis komponen sistem: yaitu yang berjalan di dalam kontainer dan komponen lain yang tidak berjalan di dalam kontainer. Sebagai contoh:

* Kubernetes _scheduler_ dan kube-proxy berjalan di dalam kontainer.
* Kubelet dan _runtime_ kontainer, contohnya Docker, tidak berjalan di dalam kontainer.

Pada mesin yang menggunakan systemd, kubelet dan runtime _runtime_ menulis ke journald. Jika systemd tidak tersedia, keduanya akan menulis ke berkas `.log` pada folder `/var/log`.
Komponen sistem di dalam kontainer akan selalu menuliskan ke folder `/var/log`, melewati mekanisme _default logging_. Mereka akan menggunakan _logging library_ [klog][klog].
Kamu dapat menemukan konvensi tentang tingkat kegawatan _logging_ untuk komponen-komponen tersebut pada [dokumentasi _development logging_](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md).

Seperti halnya pada log kontainer, komponen sistem yang menuliskan log pada folder  `/var/log` juga harus melakukan rotasi log. Pada klaster Kubernetes yang menggunakan `kube-up.sh`, log tersebut telah dikonfigurasi dan akan dirotasi oleh `logrotate` secara harian atau saat ukuran log melebihi 100MB.

[klog]: https://github.com/kubernetes/klog

## Arsitektur klaster-level _logging_

Meskipun Kubernetes tidak menyediakan solusi bawaan untuk _logging_ level klaster, ada beberapa pendekatan yang dapat kamu pertimbangkan. Berikut beberapa diantaranya:

* Menggunakan agen _logging_ pada level _node_ yang berjalan pada setiap _node_.
* Menggunakan kontainer _sidecar_ khusus untuk _logging_ aplikasi di dalam pod.
* Mengeluarkan log langsung ke _backend_ dari dalam aplikasi

### Menggunakan agen node-level _logging_

![Menggunakan agen node-level _logging_](/images/docs/user-guide/logging/logging-with-node-agent.png)

Kamu dapat mengimplementasikan klaster-level _logging_ dengan menggunakan agen yang berjalan pada setiap _node_. Agen _logging_ merupakan perangkat khusus yang akan mengekspos log atau mengeluarkan log ke _backend_. Umumnya agen _logging_ merupakan kontainer yang memiliki akses langsung ke direktori tempat berkas log berada dari semua kontainer aplikasi yang berjalan pada _node_ tersebut.

Karena agen _logging_ harus berjalan pada setiap _node_, umumnya dilakukan dengan menggunakan replika DaemonSet, _manifest_ pod, atau menjalankan proses khusus pada _node_. Namun dua cara terakhir sudah dideprekasi dan sangat tidak disarankan.

Menggunakan agen _logging_ pada level _node_ merupakan cara yang paling umum dan disarankan untuk klaster Kubernetes. Hal ini karena hanya dibutuhkan satu agen tiap node dan tidak membutuhkan perubahan apapun dari sisi aplikasi yang berjalan pada _node_. Namun, node-level _logging_ hanya dapat dilakukan untuk aplikasi yang menggunakan _standard output_ dan _standard error_.

Kubernetes tidak menspesifikasikan khusus suatu agen _logging_, namun ada dua agen _logging_ yang dimasukkan dalam rilis Kubernetes: [Stackdriver Logging](/docs/user-guide/logging/stackdriver) untuk digunakan pada Google Cloud Platform, dan [Elasticsearch](/docs/user-guide/logging/elasticsearch). Kamu dapat melihat informasi dan instruksi pada masing-masing dokumentasi. Keduanya menggunakan [fluentd](http://www.fluentd.org/) dengan konfigurasi kustom sebagai agen pada _node_.

### Menggunakan kontainer _sidecar_ dengan agen _logging_

Kamu dapat menggunakan kontainer _sidecar_ dengan salah satu cara berikut:

* Kontainer _sidecar_ mengeluarkan log aplikasi ke `stdout` miliknya sendiri.
* Kontainer _sidecar_ menjalankan agen _logging_ yang dikonfigurasi untuk mengambil log dari aplikasi kontainer.

#### Kontainer _streaming_ _sidecar_

![Kontainer _sidecar_ dengan kontainer _streaming_](/images/docs/user-guide/logging/logging-with-streaming-sidecar.png)

Kamu dapat memanfaatkan kubelet dan agen _logging_ yang telah berjalan pada tiap _node_ dengan menggunakan kontainer _sidecar_. Kontainer _sidecar_ dapat membaca log dari sebuah berkas, _socket_ atau journald. Tiap kontainer _sidecar_ menuliskan log ke `stdout` atau `stderr` mereka sendiri.

Dengan menggunakan cara ini kamu dapat memisahkan aliran log dari bagian-bagian yang berbeda dari aplikasimu, yang beberapa mungkin tidak mendukung log ke `stdout` dan `stderr`. Perubahan logika aplikasimu dengan menggunakan cara ini cukup kecil, sehingga hampir tidak ada _overhead_. Selain itu, karena `stdout` dan `stderr` ditangani oleh kubelet, kamu juga dapat menggunakan alat bawaan seperti `kubectl logs`.

Sebagai contoh, sebuah pod berjalan pada satu kontainer tunggal, dan kontainer menuliskan ke dua berkas log yang berbeda, dengan dua format yang berbeda pula. Berikut ini _file_ konfigurasi untuk Pod:

{{% codenew file="admin/logging/two-files-counter-pod.yaml" %}}

Hal ini akan menyulitkan untuk mengeluarkan log dalam format yang berbeda pada aliran log yang sama, meskipun kamu dapat me-_redirect_ keduanya ke `stdout` dari kontainer.  Sebagai gantinya, kamu dapat menggunakan dua buah kontainer _sidecar_. Tiap kontainer _sidecar_ dapat membaca suatu berkas log tertentu dari _shared volume_ kemudian mengarahkan log ke `stdout`-nya sendiri.

Berikut _file_ konfigurasi untuk pod yang memiliki dua buah kontainer _sidecard_:

{{% codenew file="admin/logging/two-files-counter-pod-streaming-sidecar.yaml" %}}

Saat kamu menjalankan pod ini, kamu dapat mengakses tiap aliran log secara terpisah dengan menjalankan perintah berikut:

```shell
kubectl logs counter count-log-1
```
```
0: Mon Jan  1 00:00:00 UTC 2001
1: Mon Jan  1 00:00:01 UTC 2001
2: Mon Jan  1 00:00:02 UTC 2001
...
```

```shell
kubectl logs counter count-log-2
```
```
Mon Jan  1 00:00:00 UTC 2001 INFO 0
Mon Jan  1 00:00:01 UTC 2001 INFO 1
Mon Jan  1 00:00:02 UTC 2001 INFO 2
...
```

Agen node-level yang terpasang di klastermu akan mengambil aliran log tersebut secara otomatis tanpa perlu melakukan konfigurasi tambahan. Bahkan jika kamu mau, kamu dapat mengonfigurasi agen untuk melakukan _parse_ baris log tergantung dari kontainer sumber awalnya.

Sedikit catatan, meskipun menggunakan memori dan CPU yang cukup rendah (sekitar beberapa milicore untuk CPU dan beberapa megabytes untuk memori), penulisan log ke _file_ kemudian mengalirkannya ke `stdout` dapat berakibat penggunaan disk yang lebih besar. Jika kamu memiliki aplikasi yang menuliskan ke _file_ tunggal, umumnya lebih baik menggunakan `/dev/stdout` sebagai tujuan daripada menggunakan pendekatan dengan kontainer _sidecar_.

Kontainer _sidecar_ juga dapat digunakan untuk melakukan rotasi berkas log yang tidak dapat dirotasi oleh aplikasi itu sendiri. Contoh dari pendekatan ini adalah sebuah kontainer kecil yang menjalankan rotasi log secara periodik. Namun, direkomendasikan untuk menggunakan `stdout` dan `stderr` secara langsung dan menyerahkan kebijakan rotasi dan retensi pada kubelet.

#### Kontainer _sidecar_ dengan agen _logging_

![Kontainer _sidecar_ dengan agen _logging_](/images/docs/user-guide/logging/logging-with-sidecar-agent.png)

Jika agen node-level _logging_ tidak cukup fleksible untuk kebutuhanmu, kamu dapat membuat kontainer _sidecar_ dengan agen _logging_ yang terpisah, yang kamu konfigurasi spesifik untuk berjalan dengan aplikasimu.

{{< note >}}
Menggunakan agen _logging_ di dalam kontainer _sidecar_ dapat berakibat penggunaan _resource_ yang signifikan. Selain itu, kamu tidak dapat mengakses log itu dengan menggunakan perintah `kubectl logs`, karena mereka tidak dikontrol oleh kubelet.
{{< /note >}}

Sebagai contoh, kamu dapat menggunakan [Stackdriver](/docs/tasks/debug-application-cluster/logging-stackdriver/),
yang menggunakan fluentd sebagai agen _logging_. Berikut ini dua _file_ konfigurasi yang dapat kamu pakai untuk mengimplementasikan cara ini. _File_ yang pertama berisi sebuah [ConfigMap](/id/docs/tasks/configure-pod-container/configure-pod-configmap/) untuk mengonfigurasi fluentd.

{{% codenew file="admin/logging/fluentd-sidecar-config.yaml" %}}

{{< note >}}
Konfigurasi fluentd berada diluar cakupan artikel ini. Untuk informasi lebih lanjut tentang cara mengonfigurasi fluentd, silakan lihat [dokumentasi resmi fluentd ](http://docs.fluentd.org/).
{{< /note >}}

_File_ yang kedua mendeskripsikan sebuah pod yang memiliki kontainer _sidecar_ yang menjalankan fluentd. Pod ini melakukan _mount_ sebuah volume yang akan digunakan fluentd untuk mengambil data konfigurasinya.

{{% codenew file="admin/logging/two-files-counter-pod-agent-sidecar.yaml" %}}

Setelah beberapa saat, kamu akan mendapati pesan log pada _interface_ Stackdriver.

Ingat, ini hanya contoh saja dan kamu dapat mengganti fluentd dengan agen _logging_ lainnya, yang dapat membaca sumber apa saja dari dalam kontainer aplikasi.

### Mengekspos log langsung dari aplikasi

![Mengekspos log langsung dari aplikasi](/images/docs/user-guide/logging/logging-from-application.png)

Kamu dapat mengimplementasikan klaster-level _logging_ dengan mengekspos atau mengeluarkan log langsung dari tiap aplikasi; namun cara implementasi mekanisme _logging_ tersebut diluar cakupan dari Kubernetes.


