---
title: Menggunakan Calico untuk NetworkPolicy
content_type: task
weight: 10
---

<!-- overview -->
Laman ini menunjukkan beberapa cara cepat untuk membuat klaster Calico pada Kubernetes.


## {{% heading "prerequisites" %}}

Putuskan apakah kamu ingin menggelar (_deploy_) sebuah klaster di [_cloud_](#membuat-klaster-calico-menggunakan-google-kubernetes-engine-gke) atau di [lokal](#membuat-klaster-calico-dengan-kubeadm).


<!-- steps -->
## Membuat klaster Calico dengan menggunakan _Google Kubernetes Engine_ (GKE) {#membuat-klaster-calico-menggunakan-google-kubernetes-engine-gke}

**Prasyarat**: [gcloud](https://cloud.google.com/sdk/docs/quickstarts).

1.  Untuk meluncurkan klaster GKE dengan Calico, cukup sertakan opsi `--enable-network-policy`.

    **Sintaksis**
    ```shell
    gcloud container clusters create [CLUSTER_NAME] --enable-network-policy
    ```

    **Contoh**
    ```shell
    gcloud container clusters create my-calico-cluster --enable-network-policy
    ```

2.  Untuk memverifikasi penggelaran, gunakanlah perintah berikut ini.

    ```shell
    kubectl get pods --namespace=kube-system
    ```

    Pod Calico dimulai dengan kata `calico`. Periksa untuk memastikan bahwa statusnya `Running`.

## Membuat klaster lokal Calico dengan kubeadm {#membuat-klaster-calico-dengan-kubeadm}

Untuk membuat satu klaster Calico dengan hos tunggal dalam waktu lima belas menit dengan menggunakan kubeadm, silakan merujuk pada

[Memulai cepat Calico](https://projectcalico.docs.tigera.io/getting-started/kubernetes/).


## {{% heading "whatsnext" %}}

Setelah klaster kamu berjalan, kamu dapat mengikuti [Mendeklarasikan Kebijakan Jaringan](/id/docs/tasks/administer-cluster/declare-network-policy/) untuk mencoba NetworkPolicy Kubernetes.


