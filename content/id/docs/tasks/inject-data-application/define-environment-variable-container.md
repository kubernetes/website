---
title: Mendefinisikan Variabel Lingkungan untuk sebuah Kontainer
content_type: task
weight: 20
---

<!-- overview -->

Laman ini menunjukkan bagaimana cara untuk mendefinisikan variabel lingkungan (_environment variable_) untuk sebuah Container di dalam sebuah Pod Kubernetes.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}




<!-- steps -->

## Mendefinisikan sebuah variabel lingkungan untuk sebuah Container

Ketika kamu membuat sebuah Pod, kamu dapat mengatur variabel lingkungan untuk Container-Container yang berjalan di dalam sebuah Pod.
Untuk mengatur variabel lingkungan, sertakan bagian `env` atau `envFrom` pada berkas konfigurasi.

Dalam latihan ini, kamu membuat sebuah Pod yang menjalankan satu buah Container.
Berkas konfigurasi untuk Pod tersebut mendefinisikan sebuah variabel lingkungan dengan nama `DEMO_GREETING` yang bernilai `"Hello from the environment"`.
Berikut berkas konfigurasi untuk Pod tersebut:

{{% codenew file="pods/inject/envars.yaml" %}}

1. Buatlah sebuah Pod berdasarkan berkas konfigurasi YAML tersebut:

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/inject/envars.yaml
    ```

2. Tampilkan Pod-Pod yang sedang berjalan:

    ```shell
    kubectl get pods -l purpose=demonstrate-envars
    ```

    Keluarannya mirip seperti ini:

    ```
    NAME            READY     STATUS    RESTARTS   AGE
    envar-demo      1/1       Running   0          9s
    ```

3. Dapatkan sebuah _shell_ ke Container yang sedang berjalan di Pod kamu:

   ```shell
   kubectl exec -it envar-demo -- /bin/bash
   ```

4. Di _shell_ kamu, jalankan perintah `printenv` untuk melihat daftar variabel lingkungannya.

    ```shell
    root@envar-demo:/# printenv
    ```

    Keluarannya mirip seperti ini:

    ```
    NODE_VERSION=4.4.2
    EXAMPLE_SERVICE_PORT_8080_TCP_ADDR=10.3.245.237
    HOSTNAME=envar-demo
    ...
    DEMO_GREETING=Hello from the environment
    DEMO_FAREWELL=Such a sweet sorrow
    ```

5. Untuk keluar dari _shell_ tersebut, masukkan perintah `exit`.

{{< note >}}
Variabel-variabel lingkungan yang diatur menggunakan bagian `env` atau `envFrom` akan mengesampingkan
variabel-variabel lingkungan yang ditentukan di dalam _image_ kontainer.
{{< /note >}}

## Menggunakan variabel-variabel lingkungan di dalam konfigurasi kamu

Variabel-variabel lingkungan yang kamu definisikan di dalam sebuah konfigurasi Pod dapat digunakan di tempat lain dalam konfigurasi, contohnya di dalam perintah-perintah dan argumen-argumen yang kamu atur dalam Container-Container milik Pod.
Pada contoh konfigurasi berikut, variabel-variabel lingkungan `GREETING`, `HONORIFIC`, dan `NAME` disetel masing-masing menjadi `Warm greetings to`, `The Most Honorable`, dan `Kubernetes`.
Variabel-variabel lingkungan tersebut kemudian digunakan dalam argumen CLI yang diteruskan ke Container `env-print-demo`.

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

Setelah dibuat, perintah `echo Warm greetings to The Most Honorable Kubernetes` dijalankan di Container tersebut.



## {{% heading "whatsnext" %}}


* Pelajari lebih lanjut tentang [variabel lingkungan](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/).
* Pelajari tentang [menggunakan informasi rahasia sebagai variabel lingkungan](/docs/user-guide/secrets/#using-secrets-as-environment-variables).
* Lihat [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core).


