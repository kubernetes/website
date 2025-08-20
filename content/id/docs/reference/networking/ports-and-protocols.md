---
title: Port dan Protokol
content_type: reference
weight: 40
---

Ketika menjalankan Kubernetes di lingkungan dengan jaringan yang terbatas dan ketat, seperti pada *on-premises data center* dengan *firewall* fisik pada jaringan tersebut atau jaringan virtual di *public cloud*, akan sangat berguna apabila kita mengetahui *port* dan protokol yang digunakan oleh komponen Kubernetes

## Panel Kontrol

| Protokol | Arah | Rentang Port | Tujuan                | Digunakan oleh           |
|----------|-----------|------------|-------------------------|---------------------------|
| TCP      | Inbound   | 6443       | Kubernetes API server   | All                       |
| TCP      | Inbound   | 2379-2380  | etcd server client API  | kube-apiserver, etcd      |
| TCP      | Inbound   | 10250      | Kubelet API             | Self, Control plane       |
| TCP      | Inbound   | 10259      | kube-scheduler          | Self                      |
| TCP      | Inbound   | 10257      | kube-controller-manager | Self                      |

Meskipun *port* Etcd termasuk dalam bagian panel kontrol diatas (sebagai bawaan dari instalasi klaster Kubernetes itu sendiri), Anda dapat membangun klaster Etcd Anda sendiri di luar Kubernetes atau melalui *port* kustom.

## Worker node(s) {#node}

| Protokol | Arah | Rentang Port  | Tujuan               | Digunakan oleh          |
|----------|-----------|-------------|-----------------------|-------------------------|
| TCP      | Inbound   | 10250       | Kubelet API           | Self, Control plane     |
| TCP      | Inbound   | 10256       | kube-proxy            | Self, Load balancers    |
| TCP      | Inbound   | 30000-32767 | NodePort Services†    | All                     |
| UDP      | Inbound   | 30000-32767 | NodePort Services†    | All                     |

† Rentang *port* bawaan untuk [Service berbasis NodePort](/docs/concepts/services-networking/service/).

Semua nomor *port* bawaan dapat ditimpa dengan nomor lainnya. Ketika *port* kustom dipilih, *port* tersebut harus dibuka dan dapat diakses oleh komponen Kubernetes lainnya.

Salah satu contoh yang umum adalah *port* API *server* yang terkadang diganti ke 443. Sebagai alternatif, *port* bawaan tetap digunakan dan API *server* tersebut ditempatkan di belakang *load balancer* yang dapat diakses melalui *port* 443. Kemudian, *request* yang diterima diteruskan ke API *server* melalui *port* bawaannya.
