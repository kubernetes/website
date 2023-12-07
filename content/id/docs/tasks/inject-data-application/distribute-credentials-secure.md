---
title: Mendistribusikan Kredensial dengan Aman Menggunakan Secret
content_type: task
weight: 50
min-kubernetes-server-version: v1.6
---

<!-- overview -->
Laman ini menjelaskan bagaimana cara menginjeksi data sensitif, seperti kata sandi (_password_) dan kunci enkripsi, ke dalam Pod.


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}

### Mengubah data rahasia kamu ke dalam representasi Base64

Misalnya kamu mempunyai dua buah data rahasia: sebuah nama pengguna `my-app` dan kata sandi
`39528$vdg7Jb`. Pertama, gunakan alat penyandian Base64 untuk mengubah nama pengguna kamu dan kata sandi ke dalam representasi Base64. Berikut ini contoh menggunakan program Base64 yang umum digunakan:

```shell
echo -n 'my-app' | base64
echo -n '39528$vdg7Jb' | base64
```

Hasil keluaran menampilkan representasi Base64 dari nama pengguna kamu yaitu `bXktYXBw`,
dan representasi Base64 dari kata sandi kamu yaitu `Mzk1MjgkdmRnN0pi`.

{{< caution >}}
Gunakan alat yang telah dipercayai oleh OS kamu untuk menghindari risiko dari penggunaan alat eksternal.
{{< /caution >}}

<!-- steps -->

## Membuat Secret

Berikut ini adalah berkas konfigurasi yang dapat kamu gunakan untuk membuat Secret yang akan menampung nama pengguna dan kata sandi kamu:

{{% codenew file="pods/inject/secret.yaml" %}}

1. Membuat Secret

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/inject/secret.yaml
    ```

1. Melihat informasi dari Secret:

    ```shell
    kubectl get secret test-secret
    ```

    Hasil keluaran:

    ```
    NAME          TYPE      DATA      AGE
    test-secret   Opaque    2         1m
    ```

1. Melihat informasi detil dari Secret:

    ```shell
    kubectl describe secret test-secret
    ```

    Hasil keluaran:

    ```
    Name:       test-secret
    Namespace:  default
    Labels:     <none>
    Annotations:    <none>

    Type:   Opaque

    Data
    ====
    password:   13 bytes
    username:   7 bytes
    ```

### Membuat Secret langsung dengan kubectl

Jika kamu ingin melompati langkah penyandian dengan Base64, kamu dapat langsung membuat Secret yang sama dengan menggunakan perintah `kubectl create secret`. Contohnya:

```shell
kubectl create secret generic test-secret --from-literal='username=my-app' --from-literal='password=39528$vdg7Jb'
```

Tentu saja ini lebih mudah. Pendekatan yang mendetil setiap langkah di atas bertujuan untuk mendemonstrasikan apa yang sebenarnya terjadi pada setiap langkah.


## Membuat Pod yang memiliki akses ke data Secret melalui Volume

Berikut ini adalah berkas konfigurasi yang dapat kamu gunakan untuk membuat Pod:

{{% codenew file="pods/inject/secret-pod.yaml" %}}

1. Membuat Pod:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/secret-pod.yaml
   ```

1. Verifikasikan apakah Pod kamu sudah berjalan:

   ```shell
   kubectl get pod secret-test-pod
   ```

   Hasil keluaran:
   ```
   NAME              READY     STATUS    RESTARTS   AGE
   secret-test-pod   1/1       Running   0          42m
   ```

1. Gunakan _shell_ untuk masuk ke dalam Container yang berjalan di dalam Pod kamu:
   ```shell
   kubectl exec -i -t secret-test-pod -- /bin/bash
   ```

1. Data Secret terekspos ke Container melalui Volume yang dipasang (_mount_) pada
`/etc/secret-volume`.

   Di dalam _shell_ kamu, tampilkan berkas yang ada di dalam direktori `/etc/secret-volume`:
   ```shell
   # Jalankan ini di dalam shell dalam Container
   ls /etc/secret-volume
   ```
   Hasil keluaran menampilkan dua buah berkas, masing-masing untuk setiap data Secret:
   ```
   password username
   ```

1. Di dalam _shell_ kamu, tampilkan konten dari berkas `username` dan `password`:
   ```shell
   # Jalankan ini di dalam shell dalam Container
   echo "$( cat /etc/secret-volume/username )"
   echo "$( cat /etc/secret-volume/password )"
   ```
   Hasil keluarannya adalah nama pengguna dan kata sandi kamu:
   ```
   my-app
   39528$vdg7Jb
   ```

## Mendefinisikan variabel lingkungan Container menggunakan data Secret

### Mendefinisikan variabel lingkungan Container menggunakan data dari Secret tunggal

*  Definisikan variabel lingkungan sebagai pasangan _key-value_ pada Secret:

   ```shell
   kubectl create secret generic backend-user --from-literal=backend-username='backend-admin'
   ```

*  Tentukan nilai `backend-username` yang didefinisikan di Secret ke variabel lingkungan `SECRET_USERNAME` di dalam spesifikasi Pod.

   {{% codenew file="pods/inject/pod-single-secret-env-variable.yaml" %}}

*  Membuat Pod:

   ```shell
   kubectl create -f https://k8s.io/examples/pods/inject/pod-single-secret-env-variable.yaml
   ```

*  Di dalam _shell_ kamu, tampilkan konten dari variabel lingkungan `SECRET_USERNAME` dari Container

   ```shell
   kubectl exec -i -t env-single-secret -- /bin/sh -c 'echo $SECRET_USERNAME'
   ```

   Hasil keluarannya
   ```
   backend-admin
   ```

### Mendefinisikan variabel lingkungan Container dengan data dari multipel Secret

*  Seperti contoh sebelumnya, buat Secret terlebih dahulu.

   ```shell
   kubectl create secret generic backend-user --from-literal=backend-username='backend-admin'
   kubectl create secret generic db-user --from-literal=db-username='db-admin'
   ```

*  Definisikan variabel lingkungan di dalam spesifikasi Pod.

   {{% codenew file="pods/inject/pod-multiple-secret-env-variable.yaml" %}}

*  Membuat Pod:

   ```shell
   kubectl create -f https://k8s.io/examples/pods/inject/pod-multiple-secret-env-variable.yaml
   ```

*  Di dalam _shell_ kamu, tampilkan konten dari variabel lingkungan Container

   ```shell
   kubectl exec -i -t envvars-multiple-secrets -- /bin/sh -c 'env | grep _USERNAME'
   ```
   Hasil keluarannya
   ```
   DB_USERNAME=db-admin
   BACKEND_USERNAME=backend-admin
   ```


## Mengonfigurasi semua pasangan _key-value_ di dalam Secret sebagai variabel lingkungan Container

{{< note >}}
Fitur ini tersedia mulai dari Kubernetes v1.6 dan yang lebih baru.
{{< /note >}}

*  Membuat Secret yang berisi banyak pasangan _key-value_

   ```shell
   kubectl create secret generic test-secret --from-literal=username='my-app' --from-literal=password='39528$vdg7Jb'
   ```

*  Gunakan envFrom untuk mendefinisikan semua data Secret sebagai variabel lingkungan Container. _Key_ dari Secret akan mennjadi nama variabel lingkungan di dalam Pod.

    {{% codenew file="pods/inject/pod-secret-envFrom.yaml" %}}

*  Membuat Pod:

   ```shell
   kubectl create -f https://k8s.io/examples/pods/inject/pod-secret-envFrom.yaml
   ```

* Di dalam _shell_ kamu, tampilkan variabel lingkungan Container `username` dan `password`

  ```shell
  kubectl exec -i -t envfrom-secret -- /bin/sh -c 'echo "username: $username\npassword: $password\n"'
  ```

  Hasil keluarannya
  ```
  username: my-app
  password: 39528$vdg7Jb
  ```

### Referensi

* [Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core)
* [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core)
* [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)

## {{% heading "whatsnext" %}}

* Pelajari lebih lanjut [Secret](/id/docs/concepts/configuration/secret/).
* Pelajari lebih lanjut [Volume](/id/docs/concepts/storage/volumes/).
