---
title: Mengekspos Alamat IP Eksternal untuk Mengakses Aplikasi di dalam Klaster
content_type: tutorial
weight: 10
---

<!-- overview -->

Dokumen ini menjelaskan bagaimana cara membuat objek Service Kubernetes
yang mengekspos alamat IP eksternal.




## {{% heading "prerequisites" %}}


 * Instal [kubectl](/id/docs/tasks/tools/install-kubectl/).

 * Gunakan sebuah penyedia layanan cloud seperti Google Kubernetes Engine atau Amazon Web Services
 untuk membuat sebuah klaster Kubernetes. Tutorial ini membuat sebuah
 [_load balancer_ eksternal](/id/docs/tasks/access-application-cluster/create-external-load-balancer/),
 yang membutuhkan sebuah penyedia layanan cloud.

 * Konfigurasi `kubectl` agar dapat berkomunikasi dengan Kubernetes API Server kamu.
 Untuk informasi lebih lanjut, kamu dapat merujuk pada dokumentasi penyedia layanan cloud
 yang kamu gunakan.



## {{% heading "objectives" %}}

* Jalankan lima buah instans dari aplikasi Hello World.
* Buatlah sebuah objek Service yang mengekspos sebuah alamat IP eksternal.
* Gunakan sebuah objek Service untuk mengakses aplikasi yang sedang dijalankan.



<!-- lessoncontent -->

## Membuat sebuah objek Service untuk sebuah aplikasi yang dijalankan pada lima buah Pod

1. Jalankan sebuah aplikasi Hello World pada klaster kamu:

{{% codenew file="service/load-balancer-example.yaml" %}}

```shell
kubectl apply -f https://k8s.io/examples/service/load-balancer-example.yaml
```


Perintah di atas akan membuat sebuah
    objek [Deployment](/id/docs/concepts/workloads/controllers/deployment/)
    dan sebuah objek
    [ReplicaSet](/id/docs/concepts/workloads/controllers/replicaset/)
    yang diasosiasikan dengan Deployment yang dibuat. ReplicaSet memiliki lima buah
    [Pod](/id/docs/concepts/workloads/pods/pod/),
    yang masing-masing dari Pod tersebut menjalankan aplikasi Hello World.

1. Tampilkan informasi mengenai Deployment:

        kubectl get deployments hello-world
        kubectl describe deployments hello-world

1. Tampilkan informasi mengenai objek ReplicaSet:

        kubectl get replicasets
        kubectl describe replicasets

1. Buatlah sebuah objek Service yang mengekspos deployment:

        kubectl expose deployment hello-world --type=LoadBalancer --name=my-service

1. Tampilkan informasi mengenai Service:

        kubectl get services my-service

    Keluaran dari perintah di atas akan menyerupai tampilan berikut:

        NAME         TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)    AGE
        my-service   LoadBalancer   10.3.245.137   104.198.205.71   8080/TCP   54s

    {{< note >}}

    Service dengan `type=LoadBalancer` didukung oleh penyedia layanan cloud eksternal, yang tidak tercakup dalam contoh ini, silahkan merujuk pada [laman berikut](/id/docs/concepts/services-networking/service/#loadbalancer) untuk informasi lebih lanjut.

    {{< /note >}}

    {{< note >}}

    Jika sebuah alamat IP eksternal yang ditunjukkan dalam status \<pending\>, tunggulah hingga satu menit kemudian masukkan perintah yang sama lagi.

    {{< /note >}}

1. Tampilkan informasi detail mengenai Service:

        kubectl describe services my-service

    Perintah di atas akan menampilkan keluaran sebagai berikut:

        Name:           my-service
        Namespace:      default
        Labels:         app.kubernetes.io/name=load-balancer-example
        Annotations:    <none>
        Selector:       app.kubernetes.io/name=load-balancer-example
        Type:           LoadBalancer
        IP:             10.3.245.137
        LoadBalancer Ingress:   104.198.205.71
        Port:           <unset> 8080/TCP
        NodePort:       <unset> 32377/TCP
        Endpoints:      10.0.0.6:8080,10.0.1.6:8080,10.0.1.7:8080 + 2 more...
        Session Affinity:   None
        Events:         <none>

    Pastikan nilai dari alamat IP eksternal (`LoadBalancer Ingress`) diekspos
    pada Service yang kamu buat. Pada contoh ini, alamat IP eksternal yang diberikan adalah 104.198.205.71.
    Kemudian pastikan nilai dari `Port` dan `NodePort`. Pada contoh ini, `Port`
    yang digunakan adalah 8080 dan `NodePort` adalah 32377.

1. Pada keluaran perintah sebelumnya, kamu dapat melihat beberapa Service dengan beberapa endpoint:
   10.0.0.6:8080,10.0.1.6:8080,10.0.1.7:8080 + 2 lainnya. Berikut ini merupakan alamat IP dari Pod
   dimana aplikasi tersebut dijalankan. Untuk melakukan verifikasi alamat-alamat IP yang digunakan oleh Pod,
   masukkan perintah berikut:

        kubectl get pods --output=wide

    Keluaran yang diberikan akan menyerupai:

        NAME                         ...  IP         NODE
        hello-world-2895499144-1jaz9 ...  10.0.1.6   gke-cluster-1-default-pool-e0b8d269-1afc
        hello-world-2895499144-2e5uh ...  10.0.1.8   gke-cluster-1-default-pool-e0b8d269-1afc
        hello-world-2895499144-9m4h1 ...  10.0.0.6   gke-cluster-1-default-pool-e0b8d269-5v7a
        hello-world-2895499144-o4z13 ...  10.0.1.7   gke-cluster-1-default-pool-e0b8d269-1afc
        hello-world-2895499144-segjf ...  10.0.2.5   gke-cluster-1-default-pool-e0b8d269-cpuc

1. Gunakan alamat IP eksternal (`LoadBalancer Ingress`) untuk mengakses aplikasi Hello World:

        curl http://<external-ip>:<port>

    dimana `<external-ip>` adalah alamat IP eksternal (`LoadBalancer Ingress`)
    dari Service kamu, dan `<port>` adalah nilai dari `Port` dari deskripsi Service kamu.
    Jika kamu menggunakan minikube, menuliskan perintah `minikube service my-service` akan
    secara otomatis membuka aplikasi Hello World pada _browser_.

    Respons yang diberikan apabila permintaan ini berhasil adalah sebuah pesan sapaan:

        Hello Kubernetes!




## {{% heading "cleanup" %}}


Untuk menghapus Service, kamu dapat menggunakan perintah ini:

    kubectl delete services my-service

Untuk menghapus Deployment, ReplicaSet, dan Pod-Pod yang digunakan untuk
menjalankan aplikasi Hello World, kamu dapat memasukkan perintah berikut:

    kubectl delete deployment hello-world




## {{% heading "whatsnext" %}}


Pelajari lebih lanjut cara untuk
[menghubungkan aplikasi dengan berbagai Service](/id/docs/concepts/services-networking/connect-applications-service/).


