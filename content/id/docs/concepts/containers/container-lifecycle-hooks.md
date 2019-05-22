---
title: Lifecyle Hook pada Kontainer
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

Laman ini menjelaskan bagaimana semua Kontainer yang diatur kubelet menggunakan *framework lifecycle hook*
untuk menjalankan kode yang di-*trigger* oleh *event* selama *lifecycle* berlangsung.

{{% /capture %}}


{{% capture body %}}

## Ikhtisar

Kubernetes menyediakan *hook* untuk *lifecycle* Kontainer. Hal ini sejalan dengan *framework* bahasa 
pemrograman pada umumnya yang memiliki *hook* untuk *lifecycle* komponen, seperti Angular contohnya.
*Hook* tersebut digunakan Kontainer untuk selalu siap menerima *event* selama *lifecycle* dan
menjalankan kode yang diimplementasi pada suatu *handler*, ketika *hook lifecycle* terkait telah dieksekusi.

## Jenis-jenis *hook* pada Kontainer

Ada dua jenis *hook* yang diekspos pada Kontainer:

`PostStart`

*Hook* ini dijalankan segera setelah suatu kontainer dibuat.
Hanya saja, tidak ada jaminan bahwa *hook* akan tereksekusi sebelum `ENTRYPOINT` dari kontainer.
Tidak ada parameter yang diberikan pada *handler*.

`PreStop`

*Hook* ini akan dipanggil sesaat sebelum kontainer dimatikan, karena suatu *request* API atau *event* pengaturan,
contohnya kegagalan pada *liveness probe*, *preemption*, perebutan *resource*, dan lainnya.
Sebuah panggilan untuk *hook* `PreStop` akan gagal jika kontainer tersebut telah ada pada *state terminate* atau *complete*.
Hal ini bersifat *blocking*, yang artinya panggilan bersifat sinkron (*synchronous*), harus menunggu eksekusi selesai, sebelum melakukan panggilan
untuk menghapus kontainer tersebut.
Tidak ada parameter yang diberikan pada *handler*.

Penjelasan yang lebih rinci tentang proses terminasi dapat dilihat pada [Terminasi Pod](/docs/concepts/workloads/pods/pod/#termination-of-pods).

### Implementasi *handler* untuk *hook*

Kontainer dapat mengakses sebuah *hook* melalui implementasi dan registrasi sebuah *handler* untuk *hook* tersebut.
Ada dua jenis *handler* untuk *hook* yang dapat diimplementasikan untuk Kontainer:

* Exec - Mengeksekusi sebuah perintah tertentu, contohnya `pre-stop.sh`, di dalam cgroups dan *namespace* suatu Kontainer. *Resource* yang dikonsumsi oleh perintah tersebut dianggap sebagai bagian dari Kontainer.
* HTTP - Mengeksekusi sebuah *request* HTTP untuk *endpoint* tertentu pada Kontainer tersebut.

### Eksekusi *handler* untuk *hook*

Ketika manajemen *hook* untuk suatu *lifecycle* Kontainer dipanggil, sistem manajemen internal pada Kubernetes
akan mengeksekusi *handler* di dalam Kontainer yang terdaftar untuk *hook* tersebut.

Panggilan *handler* untuk *hook* semuanya bersifat *synchronous* di dalam konteks Pod yang
memiliki Kontainer tersebut. Artinya, untuk *hook* `PostStart`, Kontainer `ENTRYPOINT`
dan *hook* dieksekusi secara *asyncrhonous*. Akan tetapi, jika *hook* mengambil waktu terlalu lama,
atau *hang*, Kontainer tersebut tidak bisa sampai ke *state* `running`.

Perilaku ini mirip dengan yang terjadi pada *hook* `PreStop`.
Jika *hook* terlalu lama atau *hang* saat dieksekusi, Pod tersebut tetap ada pada *state* `Terminating`
dan akan dimatikan setelah `terminationGracePeriodSeconds` Pod selesai. 
Jika sebuah *hook* `PostStart` atau `PreStop` gagal dieksekusi, Kontainer akan dimatikan.

Para pengguna sangat disarankan membuat *handler* untuk *hook* seringan mungkin (*lightweight*).
Biar bagaimanapun, ada beberapa kasus yang memang membutuhkan waktu lama untuk mengeksekusi
suatu perintah, misalnya saat proses penyimpanan *state* sebelum Kontainer dimatikan.

### Jaminan pengiriman *hook*

Proses pengiriman *hook* akan dilakukan **paling tidak satu kali**.
Artinya suatu *hook* boleh dipanggil beberapa kali untuk *event* yang sama, 
seperti dalam `PostStart` atau`PreStop`.
Namun begitu, implementasi *hook* masing-masing harus memastikan bagaimana
menangani kasus ini dengan benar.

Pada umumnya, hanya terjadi satu proses pengiriman.
Jika misalnya sebuah penerima HTTP *hook* mati atau tidak bisa menerima trafik,
maka tidak ada usaha untuk mengirimkan kembali.
Namun demikian, bisa saja terjadi dua kali proses pengiriman untuk kasus tertentu.
Contohnya, jika kubelet *restart* saat di tengah proses pengiriman *hook*,
*hook* tersebut akan dikirimkan kembali saat kubelet sudah hidup kembali.

### Melakukan *debug* *handler* untuk *hook*

*Log* untuk suatu *handler hook* tidak terekspos pada *event* Pod.
Jika *handler* gagal dieksekusi untuk alasan tertentu, *handler* akan melakukan *broadcast* sebuah *event*.
Untuk `PostStart`, akan dilakukan *broadcast event* `FailedPostStartHook`,
dan untuk `PreStop`, akan dilakukan *broadcast event* `FailedPreStopHook`.
Kamu dapat melihat *event-event* ini dengan menjalankan perintah `kubectl describe pod <pod_name>`.
Berikut merupakan contoh keluaran *event-event* setelah perintah tersebut dijalankan.

```
Events:
  FirstSeen  LastSeen  Count  From                                                   SubobjectPath          Type      Reason               Message
  ---------  --------  -----  ----                                                   -------------          --------  ------               -------
  1m         1m        1      {default-scheduler }                                                          Normal    Scheduled            Successfully assigned test-1730497541-cq1d2 to gke-test-cluster-default-pool-a07e5d30-siqd
  1m         1m        1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Pulling              pulling image "test:1.0"
  1m         1m        1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Created              Created container with docker id 5c6a256a2567; Security:[seccomp=unconfined]
  1m         1m        1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Pulled               Successfully pulled image "test:1.0"
  1m         1m        1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Started              Started container with docker id 5c6a256a2567
  38s        38s       1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Killing              Killing container with docker id 5c6a256a2567: PostStart handler: Error executing in Docker Container: 1
  37s        37s       1      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Normal    Killing              Killing container with docker id 8df9fdfd7054: PostStart handler: Error executing in Docker Container: 1
  38s        37s       2      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}                         Warning   FailedSync           Error syncing pod, skipping: failed to "StartContainer" for "main" with RunContainerError: "PostStart handler: Error executing in Docker Container: 1"
  1m         22s       2      {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}  spec.containers{main}  Warning   FailedPostStartHook
```

{{% /capture %}}

{{% capture whatsnext %}}

* Pelajari lebih lanjut tentang [*environment* Kontainer](/docs/concepts/containers/container-environment-variables/).
* Pelajari bagaimana caranya
  [melakukan *attach handler* pada *event lifecycle* sebuah Kontainer](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).

{{% /capture %}}
