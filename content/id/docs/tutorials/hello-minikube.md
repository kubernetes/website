---
title: Halo Minikube
content_template: templates/tutorial
weight: 5
menu:
  main:
    title: "Mulai"
    weight: 10
    post: >
      <p>Siap untuk mengotori tanganmu? Yuk kita buat kluster Kubernetes sederhana yang menjalankan Node.js aplikasi "Halo Dunia".</p>
card: 
  name: tutorials
  weight: 10
---

{{% capture overview %}}

Tutorial ini menunjukkan bagaimana caranya menjalankan aplikasi sederhana Node.js Halo Dunia di Kubernetes, dengan [Minikube](/docs/getting-started-guides/minikube) dan Katacoda.
Katacoda menyediakan <i>environment</i> Kubernetes secara gratis di dalam browser.

{{< note >}}
Kamupun bisa mengikuti tutorial ini kalau sudah instalasi [Minikube di lokal](/docs/tasks/tools/install-minikube/) kamu.
{{< /note >}}

{{% /capture %}}

{{% capture objectives %}}

* Deploy aplikasi halo dunia pada Minikube.
* Jalankan aplikasinya.
* Melihat log aplikasi.

{{% /capture %}}

{{% capture prerequisites %}}

Tutorial ini menyediakan image Kontainer yang dibuat melalui barisan kode berikut:

{{< codenew language="js" file="minikube/server.js" >}}

{{< codenew language="conf" file="minikube/Dockerfile" >}}

Untuk info lebih lanjut tentang perintah `docker build`, baca [dokumentasi Docker](https://docs.docker.com/engine/reference/commandline/build/).

{{% /capture %}}

{{% capture lessoncontent %}}

## Membuat sebuah kluster Minikube

1. Tekan **Launch Terminal** 

    {{< kat-button >}}

    {{< note >}}Kalau kamu memilih instalasi Minikube secara lokal,  jalankan `minikube start`.{{< /note >}}

2. Buka dasbor Kubernetes di dalam browser:

    ```shell
    minikube dashboard
    ```

3. Hanya untuk <i>environment</i> Katacoda: Di layar terminal paling atas, tekan tombol plus, lalu lanjut tekan **Select port to view on Host 1**.

4. Hanya untuk <i>environment</i> Katacoda: Ketik `30000`, lalu lanjut tekan **Display Port**. 

## Membuat sebuah Deployment

Sebuah Kubernetes [*Pod*](/docs/concepts/workloads/pods/pod/) adalah kumpulan dari satu atau banyak Kontainer,
saling terhubung untuk kebutuhan administrasi dan jaringan. Pod dalam tutorial ini hanya punya satu Kontainer. Sebuah Kubernetes
[*Deployment*](/docs/concepts/workloads/controllers/deployment/) selalu memeriksa kesehatan
Pod kamu dan melakukan <i>restart</i> saat Kontainer di dalam Pod tersebut mati. Deployment adalah cara jitu untuk membuat dan mereplikasi Pod.

1. Gunakan perintah `kubectl create` untuk membuat Deployment yang dapat mengatur Pod.
Pod menjalankan Kontainer sesuai dengan image Docker yang telah diberikan. 

    ```shell
    kubectl create deployment hello-node --image=gcr.io/hello-minikube-zero-install/hello-node
    ```

2. Lihat Deployment:

    ```shell
    kubectl get deployments
    ```

    Keluaran:

    ```shell
    NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1         1         1            1           1m
    ```

3. Lihat Pod:

    ```shell
    kubectl get pods
    ```
    Keluaran:

    ```shell
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

4. Lihat <i>event</i> kluster:

    ```shell
    kubectl get events
    ```

5. Lihat konfigurasi `kubectl`:

    ```shell
    kubectl config view
    ```
  
    {{< note >}}Untuk info lebih lanjut tentang perintah `kubectl`, lihat [ringkasan kubectl](/docs/user-guide/kubectl-overview/).{{< /note >}}

## Membuat sebuah Servis

Secara <i>default</i>, Pod hanya bisa diakses melalui alamat IP internal di dalam kluster Kubernetes.
Supaya Kontainer `hello-node` bisa diakses dari luar jaringan virtual Kubernetes, kamu harus ekspos Pod sebagai [*Servis*](/docs/concepts/services-networking/service/) Kubernetes.

1. Ekspos Pod pada internet publik menggunakan perintah `kubectl expose`:

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```
    
    Tanda `--type=LoadBalancer` menunjukkan bahwa kamu ingin ekspos Servis keluar dari kluster.

2. Lihat Servis yang baru kamu buat:

    ```shell
    kubectl get services
    ```

    Keluaran:

    ```shell
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

    Untuk penyedia cloud yang memiliki <i>load balancer</i>, sebuah alamat IP eksternal akan disediakan untuk mengakses Servis tersebut. 
    Pada Minikube, tipe `LoadBalancer` membuat Servis tersebut dapat diakses melalui perintah `minikube service`.

3. Jalankan perintah berikut:

    ```shell
    minikube service hello-node
    ```

4. Hanya untuk <i>environment</i> Katacoda: Tekan tombol plus, lalu lanjut tekan **Select port to view on Host 1**.

5. Hanya untuk <i>environment</i> Katacoda: Ketik `30369` (lihat port di samping `8080` pada keluaran servis), lalu lanjut tekan

    Ini akan membuka jendela browser yang menjalankan aplikasimu dan memperlihatkan pesan "Halo Dunia".

## Aktifkan addons

Minikube punya beberapa <i>addons</i> yang bisa diaktifkan, dinon-aktifkan, maupun dibuka di dalam <i>environment</i> Kubernetes lokal.

1. Daftar <i>addons</i> yang ada saat ini:

    ```shell
    minikube addons list
    ```

    Keluaran:

    ```shell
    addon-manager: enabled
    coredns: disabled
    dashboard: enabled
    default-storageclass: enabled
    efk: disabled
    freshpod: disabled
    heapster: disabled
    ingress: disabled
    kube-dns: enabled
    metrics-server: disabled
    nvidia-driver-installer: disabled
    nvidia-gpu-device-plugin: disabled
    registry: disabled
    registry-creds: disabled
    storage-provisioner: enabled
    ```
   
2. Aktifkan sebuah <i>addon</i>, misalnya `heapster`:

    ```shell
    minikube addons enable heapster
    ```
  
    Keluaran:

    ```shell
    heapster was successfully enabled
    ```

3. Lihat Pod dan Servis yang baru saja kamu buat:

    ```shell
    kubectl get pod,svc -n kube-system
    ```

    Keluaran:

    ```shell
    NAME                                        READY     STATUS    RESTARTS   AGE
    pod/heapster-9jttx                          1/1       Running   0          26s
    pod/influxdb-grafana-b29w8                  2/2       Running   0          26s
    pod/kube-addon-manager-minikube             1/1       Running   0          34m
    pod/kube-dns-6dcb57bcc8-gv7mw               3/3       Running   0          34m
    pod/kubernetes-dashboard-5498ccf677-cgspw   1/1       Running   0          34m
    pod/storage-provisioner                     1/1       Running   0          34m

    NAME                           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
    service/heapster               ClusterIP   10.96.241.45    <none>        80/TCP              26s
    service/kube-dns               ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP       34m
    service/kubernetes-dashboard   NodePort    10.109.29.1     <none>        80:30000/TCP        34m
    service/monitoring-grafana     NodePort    10.99.24.54     <none>        80:30002/TCP        26s
    service/monitoring-influxdb    ClusterIP   10.111.169.94   <none>        8083/TCP,8086/TCP   26s
    ```

4. Non-aktifkan `heapster`:

    ```shell
    minikube addons disable heapster
    ```
  
    Keluaran:

    ```shell
    heapster was successfully disabled
    ```

## Bersih-bersih

Sekarang, mari kita bersihkan semua <i>resource</i> yang kamu buat di kluster:

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

Kamu juga boleh mematikan mesin virtual (VM) untuk Minikube:

```shell
minikube stop
```

Kamu juga boleh menghapus Minikube VM:

```shell
minikube delete
```

{{% /capture %}}

{{% capture whatsnext %}}

* Pelajari lebih lanjut tentang [Deployment](/docs/concepts/workloads/controllers/deployment/).
* Pelajari lebih lanjut tentang [Deploy aplikasi](/docs/user-guide/deploying-applications/).
* Pelajari lebih lanjut tentang [Servis](/docs/concepts/services-networking/service/).

{{% /capture %}}
