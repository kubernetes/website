---
title: Melakukan Rollback pada DaemonSet
content_type: task
weight: 20
min-kubernetes-server-version: 1.7
---

<!-- overview -->

Laman ini memperlihatkan bagaimana caranya untuk melakukan _rollback_ pada sebuah {{< glossary_tooltip term_id="daemonset" >}}.


## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Sebelum lanjut, alangkah baiknya jika kamu telah mengetahui cara
untuk [melakukan _rolling update_ pada sebuah DaemonSet](/docs/tasks/manage-daemon/update-daemon-set/).

<!-- steps -->

## Melakukan _rollback_ pada DaemonSet

### Langkah 1: Dapatkan nomor revisi DaemonSet yang ingin dikembalikan

Lompati langkah ini jika kamu hanya ingin kembali (_rollback_) ke revisi terakhir.

Perintah di bawah ini akan memperlihatkan daftar semua revisi dari DaemonSet:

```shell
kubectl rollout history daemonset <nama-daemonset>
```

Perintah tersebut akan menampilkan daftar revisi seperti di bawah:

```
daemonsets "<nama-daemonset>"
REVISION        CHANGE-CAUSE
1               ...
2               ...
...
```

* Alasan perubahan (_change cause_) kolom di atas merupakan salinan dari anotasi `kubernetes.io/change-cause` yang berkaitan dengan revisi pada DaemonSet. Kamu boleh menyetel _flag_ `--record=true` melalui `kubectl` untuk merekam perintah yang dijalankan akibat dari anotasi alasan perubahan.

Untuk melihat detail dari revisi tertentu, jalankan perintah di bawah ini:

```shell
kubectl rollout history daemonset <daemonset-name> --revision=1
```

Perintah tersebut memberikan detail soal nomor revisi tertentu:

```
daemonsets "<nama-daemonset>" with revision #1
Pod Template:
Labels:       foo=bar
Containers:
app:
 Image:        ...
 Port:         ...
 Environment:  ...
 Mounts:       ...
Volumes:      ...
```

### Langkah 2: _Rollback_ ke revisi tertentu

```shell
# Tentukan nomor revisi yang kamu dapatkan dari Langkah 1 melalui --to-revision
kubectl rollout undo daemonset <nama-daemonset> --to-revision=<nomor-revisi>
```

Jika telah berhasil, perintah tersebut akan memberikan keluaran berikut:

```
daemonset "<nama-daemonset>" rolled back
```

{{< note >}}
Jika _flag_ `--to-revision` tidak diberikan, maka kubectl akan memilihkan revisi yang terakhir.
{{< /note >}}

### Langkah 3: Lihat progres pada saat _rollback_ DaemonSet

Perintah `kubectl rollout undo daemonset` memberitahu server untuk memulai _rollback_ DaemonSet.
_Rollback_ sebenarnya terjadi secara _asynchronous_ di dalam klaster {{< glossary_tooltip term_id="control-plane" text="_control plane_" >}}.

Perintah di bawah ini dilakukan untuk melihat progres dari _rollback_:

```shell
kubectl rollout status ds/<nama-daemonset>
```

Ketika _rollback_ telah selesai dilakukan, keluaran di bawah akan ditampilkan:

```
daemonset "<nama-daemonset>" successfully rolled out
```


<!-- discussion -->

## Memahami revisi DaemonSet

Pada langkah `kubectl rollout history` sebelumnya, kamu telah mendapatkan
daftar revisi DaemonSet. Setiap revisi disimpan di dalam sumber daya bernama ControllerRevision.

Untuk melihat apa yang disimpan pada setiap revisi, dapatkan sumber daya mentah (_raw_) dari
revisi DaemonSet:

```shell
kubectl get controllerrevision -l <kunci-selektor-daemonset>=<nilai-selektor-daemonset>
```

Perintah di atas akan mengembalikan daftar ControllerRevision:

```
NAME                               CONTROLLER                     REVISION   AGE
<nama-daemonset>-<hash-revisi>   DaemonSet/<nama-daemonset>     1          1h
<nama-daemonset>-<hash-revisi>   DaemonSet/<nama-daemonset>     2          1h
```

Setiap ControllerRevision menyimpan anotasi dan templat dari sebuah revisi DaemonSet.

Perintah `kubectl rollout undo` mengambil ControllerRevision yang spesifik dan mengganti templat
DaemonSet dengan templat yang tersimpan pada ControllerRevision.
Perintah `kubectl rollout undo` sama seperti untuk memperbarui templat
DaemonSet ke revisi sebelumnya dengan menggunakan perintah lainnya, seperti `kubectl edit` atau `kubectl apply`.

{{< note >}}
Revisi DaemonSet hanya bisa _roll_ ke depan. Artinya, setelah _rollback_ selesai dilakukan,
nomor revisi dari ControllerRevision (_field_ `.revision`) yang sedang di-_rollback_ akan maju ke depan.
Misalnya, jika kamu memiliki revisi 1 dan 2 pada sistem, lalu _rollback_ dari revisi 2 ke revisi 1,
ControllerRevision dengan `.revision: 1` akan menjadi `.revision: 3`.
{{< /note >}}

## _Troubleshoot_

* Lihat cara untuk melakukan [_troubleshoot rolling update_ pada DaemonSet](/docs/tasks/manage-daemon/update-daemon-set/#troubleshooting).
