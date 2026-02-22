---
title: Menjalankan Aplikasi Stateless Menggunakan Deployment
min-kubernetes-server-version: v1.9
content_type: tutorial
weight: 10
---

<!-- overview -->

Dokumen ini menunjukkan cara bagaimana cara menjalankan sebuah aplikasi menggunakan objek Deployment Kubernetes.




## {{% heading "objectives" %}}


* Membuat sebuah Deployment Nginx.
* Menggunakan kubectl untuk mendapatkan informasi mengenai Deployment.
* Mengubah Deployment.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}




<!-- lessoncontent -->

## Membuat dan Menjelajahi Deployment Nginx

Kamu dapat menjalankan aplikasi dengan membuat sebuah objek Deployment Kubernetes, dan kamu
dapat mendeskripsikan sebuah Deployment di dalam berkas YAML. Sebagai contohnya, berkas
YAML berikut mendeskripsikan sebuah Deployment yang menjalankan _image_ Docker nginx:1.14.2:

{{% codenew file="application/deployment.yaml" %}}


1. Buatlah sebuah Deployment berdasarkan berkas YAML:

        kubectl apply -f https://k8s.io/examples/application/deployment.yaml

2. Tampilkan informasi dari Deployment:

        kubectl describe deployment nginx-deployment

    Keluaran dari perintah tersebut akan menyerupai:

        Name:     nginx-deployment
        Namespace:    default
        CreationTimestamp:  Tue, 30 Aug 2016 18:11:37 -0700
        Labels:     app=nginx
        Annotations:    deployment.kubernetes.io/revision=1
        Selector:   app=nginx
        Replicas:   2 desired | 2 updated | 2 total | 2 available | 0 unavailable
        StrategyType:   RollingUpdate
        MinReadySeconds:  0
        RollingUpdateStrategy:  1 max unavailable, 1 max surge
        Pod Template:
          Labels:       app=nginx
          Containers:
           nginx:
            Image:              nginx:1.14.2
            Port:               80/TCP
            Environment:        <none>
            Mounts:             <none>
          Volumes:              <none>
        Conditions:
          Type          Status  Reason
          ----          ------  ------
          Available     True    MinimumReplicasAvailable
          Progressing   True    NewReplicaSetAvailable
        OldReplicaSets:   <none>
        NewReplicaSet:    nginx-deployment-1771418926 (2/2 replicas created)
        No events.

3. Lihatlah daftar Pod-Pod yang dibuat oleh Deployment:

        kubectl get pods -l app=nginx

    Keluaran dari perintah tersebut akan menyerupai:

        NAME                                READY     STATUS    RESTARTS   AGE
        nginx-deployment-1771418926-7o5ns   1/1       Running   0          16h
        nginx-deployment-1771418926-r18az   1/1       Running   0          16h

4. Tampilkan informasi mengenai Pod:

        kubectl describe pod <nama-pod>

    dimana `<nama-pod>` merupakan nama dari Pod kamu.

## Mengubah Deployment

Kamu dapat mengubah Deployment dengan cara mengaplikasikan berkas YAML yang baru.
Berkas YAML ini memberikan spesifikasi Deployment untuk menggunakan Nginx versi 1.16.1.

{{% codenew file="application/deployment-update.yaml" %}}

1. Terapkan berkas YAML yang baru:

         kubectl apply -f https://k8s.io/examples/application/deployment-update.yaml

2. Perhatikan bahwa Deployment membuat Pod-Pod dengan nama baru dan menghapus Pod-Pod lama:

         kubectl get pods -l app=nginx

## Meningkatkan Jumlah Aplikasi dengan Meningkatkan Ukuran Replika

Kamu dapat meningkatkan jumlah Pod di dalam Deployment dengan menerapkan
berkas YAML baru. Berkas YAML ini akan meningkatkan jumlah replika menjadi 4,
yang nantinya memberikan spesifikasi agar Deployment memiliki 4 buah Pod.

{{% codenew file="application/deployment-scale.yaml" %}}

1. Terapkan berkas YAML:

        kubectl apply -f https://k8s.io/examples/application/deployment-scale.yaml

2. Verifikasi Deployment kamu saat ini yang memiliki empat Pod:

        kubectl get pods -l app=nginx

    Keluaran dari perintah tersebut akan menyerupai:

        NAME                               READY     STATUS    RESTARTS   AGE
        nginx-deployment-148880595-4zdqq   1/1       Running   0          25s
        nginx-deployment-148880595-6zgi1   1/1       Running   0          25s
        nginx-deployment-148880595-fxcez   1/1       Running   0          2m
        nginx-deployment-148880595-rwovn   1/1       Running   0          2m

## Menghapus Deployment

Menghapus Deployment dengan nama:

    kubectl delete deployment nginx-deployment

## Cara Lama Menggunakan: ReplicationController

Cara yang dianjurkan untuk membuat aplikasi dengan replika adalah dengan menggunakan Deployment,
yang nantinya akan menggunakan ReplicaSet. Sebelum Deployment dan ReplicaSet ditambahkan
ke Kubernetes, aplikasi dengan replika dikonfigurasi menggunakan [ReplicationController](/id/docs/concepts/workloads/controllers/replicationcontroller/).




## {{% heading "whatsnext" %}}


* Pelajari lebih lanjut mengenai [objek Deployment](/id/docs/concepts/workloads/controllers/deployment/).


