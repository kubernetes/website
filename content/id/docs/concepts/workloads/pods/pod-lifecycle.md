---
title: Siklus Hidup Pod
content_type: concept
weight: 30
---

<!-- overview -->

{{< comment >}}Pembaruan: 4/14/2015{{< /comment >}}
{{< comment >}}Diubah dan dipindahkan ke bagian konsep: 2/2/17{{< /comment >}}

Halaman ini menjelaskan siklus hidup sebuah Pod




<!-- body -->

## Fase Pod

_Field_ `status` dari sebuah Pod merupakan sebuah objek [PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core), yang memiliki sebuah _field_ `phase`.

Fase dari sebuah Pod adalah sesuatu yang sederhana, ringkasan yang lebih tinggi tentang Pod dalam siklus hidupnya. Fase ini tidak ditujukan sebagai sebuah kesimpulan yang luas dari observasi suatu kontainer atau _state_ suatu Pod, serta tidak ditujukan sebagai _state machine_ yang luas.

Jumlah dan arti dari nilai-nilai fase Pod dijaga ketat. Selain yang ada dalam dokumentasi ini, tidak perlu berasumsi mengenai Pod telah diberikan nilai `phase`.

Berikut adalah nilai yang mungkin diberikan untuk suatu `phase`:

Nilai | Deskripsi
:-----|:-----------
`Pending` | Pod telah disetujui oleh sistem Kubernetes, tapi ada satu atau lebih _image_ kontainer yang belum terbuat. Ini termasuk saat sebelum dijadwalkan dan juga saat mengunduh _image_ melalui jaringan, yang mungkin butuh beberapa waktu.
`Running` | Pod telah terikat ke suatu node, dan semua kontainer telah terbuat. Setidaknya ada 1 kontainer yang masih berjalan, atau dalam proses memulai atau _restart_.
`Succeeded` | Semua kontainer di dalam Pod sudah berhasil dihentikan, dan tidak akan dilakukan _restart_.
`Failed` | Semua kontainer dalan suatu Pod telah dihentikan, dan setidaknya ada satu kontainer yang terhenti karena kegagalan. Itu merupakan kontainer yang keluar dengan kode status bukan 0 atau dihentikan oleh sistem.
`Unknown` | _State_ suatu Pod tidak dapat diperoleh karena suatu alasan, biasanya karena kesalahan dalam komunikasi dengan _host_ yang digunakan Pod tersebut.

## Kondisi Pod

Suatu Pod memiliki sebuah PodStatus, yang merupakan _array_ dari [PodConditions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podcondition-v1-core) yang telah atau belum dilewati oleh Pod. Setiap elemen dari _array_ PodConditions mungkin memiliki enam _field_ berikut:

* _Field_ `lastProbeTime` memberikan nilai _timestamp_ yang menandakan kapan terakhir kali kondisi kondisi Pod diperiksa.

* _Field_ `lastTransitionTime` memberikan nilai _timestamp_ yang menandakan kapan terakhir kali Pod berubah status ke status lain.

* _Field_ `message` adalah pesan yang bisa dibaca manusia yang mengidikasikan detail dari suatu transisi.

* _Field_ `reason` adalah suatu alasan yang unik, satu kata, ditulis secara _CamelCase_ untuk kondisi transisi terakhir.

* _Field_ `status` adalah sebuah kata dengan kemungkinan nilainya berupa "`True`", "`False`", dan "`Unknown`".

* _Field_ `type` adalah sebuah kata yang memiliki kemungkinan nilai sebagai berikut:

  * `PodScheduled`: Pod telah dijadwalkan masuk ke node;
  * `Ready`: Pod sudah mampu menerima _request_ masuk dan seharusnya sudah ditambahkan ke daftar pembagian beban kerja untuk servis yang sama;
  * `Initialized`:  Semua [init containers](/id/docs/concepts/workloads/pods/init-containers) telah berjalan sempurna.
  * `Unschedulable`: _scheduler_ belum dapat menjadwalkan Pod saat ini, sebagai contoh karena kekurangan _resources_ atau ada batasan-batasan lain.
  * `ContainersReady`: Semua kontainer di dalam Pod telah siap.


## Pemeriksaan Kontainer

Sebuah [Probe](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#probe-v1-core) adalah sebuah diagnosa yang dilakukan secara berkala oleh [kubelet](/docs/admin/kubelet/) dalam suatu kontainer. Untuk melakukan diagnosa, kubelet memanggil sebuah [Handler](https://godoc.org/k8s.io/kubernetes/pkg/api/v1#Handler) yang diimplementasikan oleh kontainer. Ada 3 tipe _Handler_ yang tersedia, yaitu:

* [ExecAction](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#execaction-v1-core): Mengeksekusi perintah tertentu di dalam kontainer. Diagnosa dikatakan berhasil jika perintah selesai dengan kode status 0.

* [TCPSocketAction](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#tcpsocketaction-v1-core): Melakukan pengecekan TCP terhadap alamat IP kontainer dengan _port_ tertentu. Diagnosa dikatakan berhasil jika _port_ tersebut terbuka.

* [HTTPGetAction](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#httpgetaction-v1-core): Melakukan sebuah _request_ HTTP Get terhadap alamat IP kontainer dengan _port_ dan _path_ tertentu. Diagnosa dikatakan berhasil jika responnya memiliki kode status lebih besar atau sama dengan 200 dan kurang dari 400.

Setiap pemeriksaan akan menghasilkan salah satu dari tiga hasil berikut:

* _Success_: Kontainer berhasil melakukan diagnosa.
* _Failure_: Kontainer gagal melakukan diagnosa.
* _Unknown_: Gagal melakukan diagnosa, sehingga tidak ada aksi yang harus dilakukan.

_Kubelet_ dapat secara optimal melakukan dan bereaksi terhadap dua jenis pemeriksaan yang sedang berjalan pada kontainer, yaitu:

* `livenessProbe`: Ini menunjukkan apakah kontainer sedang berjalan. Jika tidak berhasil melakukan pemeriksaan terhadap _liveness_ dari kontainer, maka kubelet akan mematikan kontainer, dan kontainer akan mengikuti aturan dari [_restart policy_](#restart-policy). Jika kontainer tidak menyediakan pemeriksaan terhadap _liveness_, maka nilai dari _state_ adalah `Success`.

* `readinessProbe`: Ini menunjukan apakah kontainer sudah siap melayani _request_. Jika tidak berhasil melakukan pemeriksaan terhadap kesiapan dari kontainer, maka _endpoints controller_ akan menghapus alamat IP Pod dari daftar semua _endpoint_ untuk servis yang sama dengan Pod. Nilai awal _state_ sebelum jeda awal adalah `Failure`. Jika kontainer tidak menyediakan pemeriksaan terhadap _readiness_, maka nilai awal _state_ adalah `Success`.

### Kapan sebaiknya menggunakan pemeriksaan terhadap _liveness_ atau _readiness_?

Jika proses dalam kontainer mungkin gagal yang dikarenakan menghadapi suatu masalah
atau menjadi tidak sehat, maka pemeriksaan terhadap _liveness_ tidak diperlukan.
Kubelet akan secara otomatis melakukan aksi yang tepat mengikuti `restartPolicy` dari Pod.

Jika kamu ingin kontainer bisa dimatikan dan dijalankan ulang ketika gagal melakukan
pemeriksaan, maka tentukan pemeriksaan _liveness_ dan tentukan nilai `restartPolicy` sebagai `Always` atau `OnFailure`.

Jika kamu ingin mulai mengirim _traffic_ ke Pod hanya ketika pemeriksaan berhasil,
maka tentukan pemeriksaan _readiness_. Dalam kasus ini, pemeriksaan _readiness_ mungkin
akan sama dengan pemeriksaan _liveness_, tapi keberadaan pemeriksaan _readiness_ dalam
_spec_ berarti Pod akan tetap dijalankan tanpa menerima _traffic_ apapun dan akan
mulai menerima _traffic_ ketika pemeriksaan yang dilakukan mulai berhasil.
Jika kontainermu dibutuhkan untuk tetap berjalan ketika _loading_ data yang besar,
_file_ konfigurasi, atau melakukan migrasi ketika _startup_, maka tentukanlah pemeriksaan _readiness_.

Jika kamu ingin kontainermu dalam mematikan dirinya sendiri, kamu dapat menentukan
suatu pemeriksaan _readiness_ yang melakukan pengecekan terhadap _endpoint_ untuk _readiness_.
_endpoint_ tersebut berbeda dengan _endpoint_ untuk pengecekan _liveness_.

Perlu dicatat, jika kamu hanya ingin bisa menutup _request_ ketika Pod sedang dihapus
maka kamu tidak perlu menggunakan pemeriksaan _readiness_. Dalam penghapusan, Pod akan
secara otomatis mengubah _state_ dirinya menjadi _unready_ tanpa peduli apakah terdapat
pemeriksaan _readiness_ atau tidak. Pod tetap ada pada _state unready_ selama menunggu
kontainer dalam Pod berhenti.

Untuk informasi lebih lanjut mengenai pengaturan pemeriksaan _liveness_ atau _readiness_, lihat bagian
[Konfigurasi _Liveness_ dan _Readiness_ _Probe_](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/).

## Status Pod dan Kontainer

Untuk informasi lebih mendalam mengenai status Pod dan kontainer, silakan lihat
[PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core)
dan
[ContainerStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#containerstatus-v1-core).
Mohon diperhatikan, informasi tentang status Pod bergantung pada
[ContainerState](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#containerstatus-v1-core).

## State Kontainer

Ketika Pod sudah ditempatkan pada suatu node oleh scheduler, kubelet mulai membuat kontainer menggunakan _runtime_ kontainer.
Ada tiga kemungkinan _state_ untuk suatu kontainer, yaitu Waiting, Running, dan Terminated.
Untuk mengecek _state_ suatu kontainer, kamu bisa menggunakan perintah `kubectl describe pod [NAMA_POD]`.
_State_ akan ditampilkan untuk masing-masing kontainer dalam Pod tersebut.

* `Waiting`: Merupakan _state_ default dari kontainer. Jika _state_ kontainer bukan Running atau Terminated, berarti dalam _Wating state_.
Suatu kontainer dalam Waiting _state_ akan tetap menjalan operasi-operasi yang dibutuhkan, misalnya mengunduh _images_, mengaplikasikan Secrets, dsb.
Bersamaan dengan _state_ ini, sebuah pesan dan alasan tentang _state_ akan ditampilkan untuk memberi informasi lebih.

    ```yaml
   ...
      State:          Waiting
       Reason:       ErrImagePull
	  ...
   ```

* `Running`: Menandakan kontainer telah berjalan tanpa masalah. Setelah kontainer masuk ke _state_ Running, jika terdapat _hook_ `postStart` maka akan dijalankan. _State_ ini juga menampilkan waktu ketika kontainer masuk ke _state_ Running.

   ```yaml
   ...
      State:          Running
       Started:      Wed, 30 Jan 2019 16:46:38 +0530
   ...
   ```

* `Terminated`:  Menandakan kontainer telah menyelesaikan "tugasnya". Kontainer akan menjadi _state_ ini ketika telah menyelesaikan eksekusi atau terjadi kesalahan. Terlepas dari itu, sebuah alasan dan _exit code_ akan ditampilkan, bersama dengan waktu kontainer mulai dijalankan dan waktu berhenti. Sebelum kontainer masuk ke _state_ Terminated, jika terdapat `preStop` _hook_ maka akan dijalankan.

   ```yaml
   ...
      State:          Terminated
        Reason:       Completed
        Exit Code:    0
        Started:      Wed, 30 Jan 2019 11:45:26 +0530
        Finished:     Wed, 30 Jan 2019 11:45:26 +0530
    ...
   ```

## Pod readiness gate

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

Dalam rangka menambahkan ekstensibilitas terhadap kesiapan Pod dengan menggunakan
injeksi umpan balik tambahan atau sinyal ke dalam `PodStatus`,
Kubernetes 1.11 memperkenalkan sebuah fitur bernama [Pod ready++](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/0007-pod-ready%2B%2B.md).
Kamu dapat menggunakan _field_ baru `ReadinessGate` dalam sebuah `PodSpec` untuk
menunjukan kondisi tambahan yang akan dievaluasi untuk kesiapan Pod. Jika Kubernetes
tidak dapat menemukan kondisi pada _field_ `status.conditions` dalam suatu Pod,
maka statusnya akan secara otomatis menjadi `False`. Berikut adalah contoh pemakaiannya:

```yaml
Kind: Pod
...
spec:
  readinessGates:
    - conditionType: "www.example.com/feature-1"
status:
  conditions:
    - type: Ready  # ini adalah PodCondition yang telah tersedia
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
    - type: "www.example.com/feature-1"   # sebuah PodCondition tambahan
      status: "False"
      lastProbeTime: null
      lastTransitionTime: 2018-01-01T00:00:00Z
  containerStatuses:
    - containerID: docker://abcd...
      ready: true
...
```

Kondisi Pod yang baru harus memenuhi [format label](/id/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set) pada Kubernetes.
Sejak perintah `kubectl patch` belum mendukung perubahan status objek, kondisi Pod yang baru harus mengubah melalui aksi `PATCH` dengan menggunakan
salah satu dari [KubeClient _libraries_](/docs/reference/using-api/client-libraries/).

Dengan diperkenalkannya kondisi Pod yang baru, sebuah Pod akan dianggap siap hanya jika memenuhi dua syarat berikut:

* Semua kontainer dalam Pod telah siap.
* Semua kontainer yang diatur dalam `ReadinessGates` bernilai "`True`".


Untuk memfasilitasi perubahan tersebut terhadap evaluasi kesiapan Pod, dibuatkan sebuah kondisi Pod baru yaitu `ContainerReady`,
untuk dapat menangani kondisi Pod `Ready` yang sudah ada.

Dalam K8s 1.11, sebagai fitur _alpha_, fitur "Pod Ready++" harus diaktifkan melalui pengaturan
 [fitur _gate_ pada `PodReadinessGates`](/docs/reference/command-line-tools-reference/feature-gates/).

Dalam K8s 1.12, fitur tersebut sudah diaktifkan dari awal.


## Aturan Menjalankan Ulang

Sebuah PodSpec memiliki _field_ `restartPolicy` dengan kemungkinan nilai berupa Always, OnFailure, dan Never.
Nilai awalnya berupa Always. `restartPolicy` akan berlaku untuk semua kontainer dalam Pod.
Kontainer yang mati dan dijalankan ulang oleh kubelet akan dijalankan ulang dengan jeda waktu yang ekponensial (10s, 20s, 40s, ...)
dengan batas atas senilai lima menit. Jeda waktu ini akan diatur ulang setelah sukses berjalan selama 10 menit.
Sesuai dengan diskusi pada [dokumen Pod](/docs/user-guide/pods/#durability-of-pods-or-lack-thereof),
setelah masuk ke suatu node, sebuah Pod tidak akan pindah ke node lain.

## Umur Pod

Secara umum, Pod tidak hilang sampai ada yang menghapusnya. Ini mungkin dihapus oleh orang atau pengontrol.
Satu pengecualian untuk aturan ini adalah Pod dengan `phase` bernilai Succeeded atau Failed untuk waktu
beberapa lama yang akan berakhir dan secara otomatis akan dihapus.
(diatur dalam `terminated-pod-gc-threshold` pada master)

Tiga tipe pengontrol yang tersedia yaitu:

- Menggunakan sebuah [Job](/docs/concepts/jobs/run-to-completion-finite-workloads/) untuk Pod yang diharapkan akan berakhir,
  sebagai contoh, penghitungan dalam jumlah banyak. Jobs hanyak cocok untuk Pod dengan `restartPolicy` yang
  bernilai OnFailure atau Never.

- Menggunakan sebuah [ReplicationController](/id/docs/concepts/workloads/controllers/replicationcontroller/),
  [ReplicaSet](/id/docs/concepts/workloads/controllers/replicaset/), atau
  [Deployment](/id/docs/concepts/workloads/controllers/deployment/) untuk Pod yang tidak diharapkan untuk berakhir,
  sebagai contoh, _web servers_. ReplicationControllers hanya cocok digunakan pada Pod dengan `restartPolicy`
  yang bernilai Always.

- Menggunakan sebuah [DaemonSet](/id/docs/concepts/workloads/controllers/daemonset/) untuk Pod yang akan berjalan
  hanya satu untuk setiap mesin, karena menyediakan servis yang spesifik untuk suatu mesin.


Ketiga tipe pengontrol ini memiliki sebuah PodTemplate. Direkomdasikan untuk membuat
pengontrol yang sesuai dan membiarkan ini membuat Pod, daripada membuat Pod sendiri secara langsung.
Karena Pod itu sendiri tidak tahan terhadap gagalnya suatu mesin, namun pengontrol tahan.

Jika node mati atau sambungannya terputus dari klaster, Kubernetes mengatur
`phase` dari semua Pod pada node yang mati untuk menjadi Failed.

## Contoh

### Contoh _Liveness Probe_ tingkat lanjut

_Liveness probe_ dieksekusi oleh kubelet, jadi semua permintaan akan dilakukan
di dalam _namespace_ jaringan kubelet.


```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    test: liveness
  name: liveness-http
spec:
  containers:
  - args:
    - liveness
    image: registry.k8s.io/e2e-test-images/agnhost:2.40
    livenessProbe:
      httpGet:
        # ketika "host" tidak ditentukan, "PodIP" akan digunakan
        # host: my-host
        # ketika "scheme" tidak ditentukan, _scheme_ "HTTP" akan digunakan. Hanya "HTTP" and "HTTPS" yang diperbolehkan
        # scheme: HTTPS
        path: /healthz
        port: 8080
        httpHeaders:
        - name: X-Custom-Header
          value: Awesome
      initialDelaySeconds: 15
      timeoutSeconds: 1
    name: liveness
```

### Contoh _State_


  * Pod sedang berjalan dan memiliki sebuah kontainer. Kontainer berhenti dengan sukses.
    * Mencatat _event_ penyelesaian.
    * Jika nilai `restartPolicy` adalah:
      * Always: Jalankan ulang kontainer; nilai `phase` Pod akan tetap Running.
	  * OnFailure: nilai `phase` Pod akan berubah menjadi Succeeded.
	  * Never: nilai `phase` Pod akan berubah menjadi Succeeded.

  * Pod sedang berjalan dan memiliki sebuah kontainer. Kontainer berhenti dengan kegagalan.
    * Mencatat _event_ kegagalan.
    * Jika nilai `restartPolicy` adalah:
	  * Always: Jalankan ulang kontainer, nilai `phase` Pod akan tetap Running.
	  * OnFailure: Jalankan ulang kontainer, nilai `phase` Pod akan tetap Running.			
	  * Never: nilai `phase` Pod akan menjadi Failed.

  * Pod sedang berjalan dan memiliki dua kontainer. Kontainer pertama berhenti dengan kegagalan.
    * Mencatat _event_ kegagalan.
	* Jika nilai `restartPolicy` adalah:
	  * Always: Jalankan ulang kontainer, nilai `phase` Pod akan tetap Running.
	  * OnFailure: Jalankan ulang kontainer, nilai `phase` Pod akan tetap Running.
	  * Never: Tidak akan menjalankan ulang kontainer, nilai `phase` Pod akan tetap Running.
	* Jika kontainer pertama tidak berjalan dan kontainer kedua berhenti:
	  * Mencatat _event_ kegagalan.
	  * Jika nilai `restartPolicy` adalah:
	    * Always: Jalankan ulang kontainer, nilai `phase` Pod akan tetap Running.
		* OnFailure: Jalankan ulang kontainer, nilai `phase` Pod akan tetap Running.
		* Never: nilai `phase` Pod akan menjadi Failed.

  * Pod sedang berjalan dan memiliki satu kontainer. Kontainer berhenti karena kehabisan _memory_.
    * Kontainer diberhentikan dengan kegagalan.
	* Mencatat kejadian kehabisan _memory_ (OOM)
	* Jika nilai `restartPolicy` adalah:
	  * Always: Jalankan ulang kontainer, nilai `phase` Pod akan tetap Running.
	  * OnFailure: Jalankan ulang kontainer, nilai `phase` Pod akan tetap Running.
	  * Never: Mencatat kejadian kegagalan, nilai `phase` Pod akan menjadi Failed.

  * Pod sedang berjalan dan sebuah _disk_ mati.
    * Menghentikan semua kontainer.
	* Mencatat kejadian yang sesuai.
	* Nilai `phase` Pod menjadi Failed.
	* Jika berjalan menggunakan pengontrol, maka Pod akan dibuat ulang di tempat lain.

  * Pod sedang berjalan, dan node mengalami _segmented out_.
    * Node pengontrol menunggu sampai suatu batas waktu.
	* Node pengontrol mengisi nilai `phase` Pod menjadi Failed.
	* Jika berjalan menggunakan pengontrol, maka Pod akan dibuat ulang di tempat lain.




## {{% heading "whatsnext" %}}


* Dapatkan pengalaman langsung mengenai
  [penambahan _handlers_ pada kontainer _lifecycle events_](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).

* Dapatkan pengalaman langsung mengenai
  [pengaturan _liveness_ dan _readiness probes_](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/).

* Pelajari lebih lanjut mengenai [_lifecycle hooks_ pada kontainer](/id/docs/concepts/containers/container-lifecycle-hooks/).





