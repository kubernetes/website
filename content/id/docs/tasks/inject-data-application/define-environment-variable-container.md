---
title: Mendefinisikan Variable-variabel Lingkungan untuk sebuah Kontainer
content_template: templates/task
weight: 20
---

{{% capture overview %}}

Halaman ini menunjukkan bagaimana cara untuk mendefinisikan variabel-variabel lingkungan untuk sebuah kontainer di sebuah Pod Kubernetes.

{{% /capture %}}


{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}


{{% capture steps %}}

## Mendefinisikan sebuah variabel lingkungan untuk sebuah kontainer

Ketika kamu membuat sebuah Pod, kamu dapat mengatur variabel lingkungan untuk kontainer yang berjalan dalam sebuah Pod.
Untuk mengatur variabel lingkungan, sertakan bagian `env` atau `envFrom` pada berkas konfigurasi.

Dalam latihan ini, anda membuat sebuah Pod yang menjalankan satu kontainer.
Berkas konfigurasi untuk Pod mendefinisikan sebuah variabel lingkungan dengan nama `DEMO_GREETING` yang bernilai `"Hello from the environment"`.
Berikut adalah berkas konfigurasi untuk Pod:

{{< codenew file="pods/inject/envars.yaml" >}}

1. Membuat sebuah Pod berdasarkan berkas konfigurasi YAML:

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/inject/envars.yaml
    ```

2. Daftar Pod-pod yang sedang berjalan:

    ```shell
    kubectl get pods -l purpose=demonstrate-envars
    ```

    Keluarannya mirip seperti berikut:

    ```
    NAME            READY     STATUS    RESTARTS   AGE
    envar-demo      1/1       Running   0          9s
    ```

3. Dapatkan _shell_ yang berjalan di Pod kamu:

   ```shell
   kubectl exec -it envar-demo -- /bin/bash
   ```

4. Di _shell_ kamu, jalankan perintah `printenv` untuk melihat daftar variabel-variabel lingkungan.

    ```shell
    root@envar-demo:/# printenv
    ```

    The output is similar to this:

    ```
    NODE_VERSION=4.4.2
    EXAMPLE_SERVICE_PORT_8080_TCP_ADDR=10.3.245.237
    HOSTNAME=envar-demo
    ...
    DEMO_GREETING=Hello from the environment
    DEMO_FAREWELL=Such a sweet sorrow
    ```

5. Untuk keluar dari _shell_, masukkan perintah `exit`.

{{< note >}}
Variabel-variabel lingkungan yang diatur menggunakan bagian `env` atau `envFrom` akan mengesampingkan
variabel-variabel lingkungan yang ditentukan dalam _image_ kontainer.
{{< /note >}}

## Menggunakan variabel-variabel lingkungan di dalam konfigurasi kamu

Variabel-variabel lingkungan yang kamu definisikan di sebuah konfigurasi Pod dapat digunakan di tempat lain dalam konfigurasi, contohnya dalam perintah-perintah dan argumen yang kamu atur dalam kontainer-kontainer Pod.
Pada contoh konfigurasi berikut, variabel-variabel lingkungan `GREETING`, `HONORIFIC`, dan `NAME` diatur ke `Warm greetings to`, `The Most Honorable`, dan `Kubernetes`.
Variabel-variabel lingkungan tersebut kemudian digunakan dalam argumen CLI yang diteruskan ke kontainer `env-print-demo`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: print-greeting
spec:
  containers:
  - name: env-print-demo
    image: bash
    env:
    - name: GREETING
      value: "Warm greetings to"
    - name: HONORIFIC
      value: "The Most Honorable"
    - name: NAME
      value: "Kubernetes"
    command: ["echo"]
    args: ["$(GREETING) $(HONORIFIC) $(NAME)"]
```

Setelah dibuat, perintah `echo Warm greetings to The Most Honorable Kubernetes` dijalankan di kontainer.

{{% /capture %}}

{{% capture whatsnext %}}

* Pelajari lebih lanjut tentang [variabel lingkungan](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/).
* Pelajari tentang [menggunakan informasi rahasia sebagai variabel lingkungan](/docs/user-guide/secrets/#using-secrets-as-environment-variables).
* Lihat [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core).

{{% /capture %}}
