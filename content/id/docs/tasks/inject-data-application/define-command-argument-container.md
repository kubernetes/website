---
title: Mendefinisikan Perintah dan Argumen untuk sebuah Kontainer
content_template: templates/task
weight: 10
---

{{% capture overview %}}

Halaman ini menunjukkan bagaimana cara mendefinisikan perintah-perintah
dan argumen-argumen saat kamu menjalankan sebuah kontainer
dalam sebuah {{< glossary_tooltip term_id="Pod" >}}.

{{% /capture %}}


{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}


{{% capture steps %}}

## Mendefinisikan sebuah perintah dan argument-argumen saat kamu membuat sebuah Pod

Saat kamu membuat sebuah Pod, kamu dapat mendefinisikan sebuah perintah dan argumen-argumen untuk
kontainer-kontainer yang berjalan di dalam Pod. Untuk mendefinisikan sebuah perintah, sertakan
bidang `command` di dalam berkas konfigurasi. Untuk mendefinisikan argumen-argumen untuk perintah, sertakan
bidang `args` di berkas konfigurasi. Perintah dan argumen-argumen yang telah
kamu definisikan tidak dapat diganti setelah Pod terbuat.

Perintah dan argumen-argumen yang kamu definisikan di berkas konfigurasi
membatalkan perintah dan argumen-argumen standar (default) yang disediakan oleh _image_ kontainer.
Jika kamu mendefinisikan argumen-argumen, tetapi tidak mendefinisikan sebuah perintah, perintah standar digunakan
dengan argumen-argumen baru kamu.

{{< note >}}
Bidang `command` menyerupai `entrypoint` di beberapa _runtime_ kontainer.
Merujuk pada [catatan](#catatan) di bawah.
{{< /note >}}

Di latihan ini, kamu akan membuat sebuah Pod baru yang menjalankan sebuah kontainer. Berkas konfigurasi
untuk Pod mendefinisikan sebuah perintah dan dua argumen:

{{< codenew file="pods/commands.yaml" >}}

1. Buat sebuah Pod dengan berkas konfigurasi YAML:

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/commands.yaml
    ```

2. Daftar Pod yang sedang berjalan

    ```shell
    kubectl get pods
    ```

    Keluaran menunjukkan bahwa kontainer yang berjalan di Pod command-demo
    telah selesai.

3. Untuk melihat keluaran dari perintah yang berjalan di kontainer, lihat _log_
dari Pod tersebut:

    ```shell
    kubectl logs command-demo
    ```

    Keluaran menunjukan nilai dari variabel lingkungan HOSTNAME dan KUBERNETES_PORT:

    ```
    command-demo
    tcp://10.3.240.1:443
    ```

## Menggunakan variabel lingkungan untuk mendefinisikan argumen

Dalam contoh sebelumnya, kamu mendefinisikan langsung argumen-argumen dengan
menyediakan _string_. Sebagai sebuah alternatif untuk menyediakan _string_ secara langsung,
kamu dapat mendefinisikan argumen-argumen dengan menggunakan variabel lingkungan:

```yaml
env:
- name: MESSAGE
  value: "hello world"
command: ["/bin/echo"]
args: ["$(MESSAGE)"]
```

Ini berarti kamu dapat mendefinisikan sebuah argumen untuk sebuah Pod menggunakan
salah satu teknik yang tersedia untuk mendefinisikan variabel-variabel lingkungan, termasuk
[ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/)
dan
[Secrets](/docs/concepts/configuration/secret/).

{{< note >}}
Variabel lingkugan muncul dalam tanda kurung, `"$(VAR)"`. Ini
dibutuhkan untuk variabel yang akan diperuluas di bidang `command` atau `args`.
{{< /note >}}

## Menjalankan sebuah perintah di sebuah shell

Di beberapa kasus, kamu butuh perintah untuk menjalankan sebuah _shell_. Contohnya, 
perintah kamu mungkin terdiri dari beberapa perintah yang disatukan, atau  mungkin berupa
skrip _shell_. Untuk menjalankan perintah kamu di sebuah _shell_, bungkus seperti ini:

```shell
command: ["/bin/sh"]
args: ["-c", "while true; do echo hello; sleep 10;done"]
```

## Catatan

Tabel ini merangkum nama-nama bidang yang digunakan oleh Docker dan Kubernetes.

|              Deskripsi                    |    Nama bidang pada Docker   | Nama bidang pada Kubernetes |
|-------------------------------------------|------------------------------|-----------------------------|
|  Perintah yang dijalankan oleh kontainer  |         Entrypoint           |            command          |
|  Argumen diteruskan ke perintah           |            Cmd               |             args            |

Saat kamu mengesampingkan Entrypoint dan Cmd standar, 
When you override the default Entrypoint and Cmd, aturan-aturan ini berlaku:

* Jika kamu tidak menyediakan `command` atau `args` untuk sebuah Kontainer,
akan digunakan yang telah didefinisikan di _image_ Docker.

* Jika kamu menyediakan `command` tetapi tidak menyediakan `args` untuk sebuah kontainer, akan digunakan
`command` yang disediakan. Entrypoint dan Cmd standar yang didefinisikan dalam 
_image_ Docker diabaikan.

* Jika kamu hanya menyediakan `args` untuk sebuah kontainer, Entrypoint standar yang didefinisikan di
_image_ Docker dijalakan dengan `args` yang kamu sediakan.

* Jika kamu menyediakan `command` dan `args`, Entrypoint dan Cmd standar yang didefinisikan
di _image_ Docker diabaikan. `command` kamu akan dijalankan dengan `args` kamu.

Berikut ini beberapa contoh:

| Image Entrypoint   |    Image Cmd     | Container command   |  Container args    |    Command run   |
|--------------------|------------------|---------------------|--------------------|------------------|
|     `[/ep-1]`      |   `[foo bar]`    |   &lt;not set&gt;   |   &lt;not set&gt;  | `[ep-1 foo bar]` |
|     `[/ep-1]`      |   `[foo bar]`    |      `[/ep-2]`      |   &lt;not set&gt;  |     `[ep-2]`     |
|     `[/ep-1]`      |   `[foo bar]`    |   &lt;not set&gt;   |     `[zoo boo]`    | `[ep-1 zoo boo]` |
|     `[/ep-1]`      |   `[foo bar]`    |   `[/ep-2]`         |     `[zoo boo]`    | `[ep-2 zoo boo]` |


{{% /capture %}}

{{% capture whatsnext %}}

* Pelajari lebih lanjut tentang [menkonfigurasi Pod and kontainer](/docs/tasks/).
* Pelajari lebih lanjut tentang [menjalankan perintah dalam sebuah kontainer](/docs/tasks/debug-application-cluster/get-shell-running-container/).
* Lihat [Kontainer](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core).

{{% /capture %}}
