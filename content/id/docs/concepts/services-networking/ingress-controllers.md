---
title: Kontroler Ingress
content_type: concept
weight: 40
---

<!-- overview -->

Agar Ingress dapat bekerja sebagaimana mestinya,
sebuah klaster harus memiliki paling tidak sebuah kontroler Ingress.

Berbeda dengan kontroler-kontroler lainnya yang dijalankan
sebagai bagian dari *binary* `kube-controller-manager`, kontroler Ingress
tidak secara otomatis dijalankan di dalam klaster. Kamu bisa menggunakan
laman ini untuk memilih implementasi kontroler Ingress yang kamu pikir
paling sesuai dengan kebutuhan kamu.

Kubernetes sebagai sebuah proyek, saat ini, mendukung dan memaintain kontroler-kontroler [GCE](https://git.k8s.io/ingress-gce/README.md) dan
  [nginx](https://git.k8s.io/ingress-nginx/README.md).



<!-- body -->

## Kontroler-kontroler lainnya

* [Ambassador](https://www.getambassador.io/) *API Gateway* merupakan ingress berbasis [Envoy](https://www.envoyproxy.io)
  kontroler dengan dukungan [komunitas](https://www.getambassador.io/docs) atau
  [komersial](https://www.getambassador.io/pro/) dari [Datawire](https://www.datawire.io/).
* [AppsCode Inc.](https://appscode.com) menawarkan dukungan dan pemeliharaan untuk ingress berbasis [HAProxy](http://www.haproxy.org/), [Voyager](https://voyagermesh.com).
* [Contour](https://projectcontour.io/) merupakan ingress berbasis [Envoy](https://www.envoyproxy.io/)
  yang disediakan dan didukung oleh VMware.
* Citrix menyediakan sebuah [kontroler Ingress](https://github.com/citrix/citrix-k8s-ingress-controller) untuk perangkat keras (MPX), virtualisasi (VPX) dan [kontainerisasi cuma-cuma (CPX) ADC](https://www.citrix.com/products/citrix-adc/cpx-express.html) untuk mesin [*baremetal*](https://github.com/citrix/citrix-k8s-ingress-controller/tree/master/deployment/baremetal) dan penyedia layanan [*cloud*](https://github.com/citrix/citrix-k8s-ingress-controller/tree/master/deployment) deployments.
* F5 Networks menyediakan [dukungan dan pemeliharaan](https://support.f5.com/csp/article/K86859508)
  untuk [kontroler F5 BIG-IP bagi Kubernetes](http://clouddocs.f5.com/products/connectors/k8s-bigip-ctlr/latest).
* [Gloo](https://gloo.solo.io) adalah sebuah proyek kontroler Ingress *open source* berbasis [Envoy](https://www.envoyproxy.io) yang menawarkan fungsionalitas *API Gateway* dengan dukungan *enterprise* dari [solo.io](https://www.solo.io).
* Kontroler Ingress berbasis [HAProxy](http://www.haproxy.org/)
  [jcmoraisjr/haproxy-ingress](https://github.com/jcmoraisjr/haproxy-ingress) yang disebutkan di dalam artikel
  [HAProxy Ingress Controller for Kubernetes](https://www.haproxy.com/blog/haproxy_ingress_controller_for_kubernetes/).
  [HAProxy Technologies](https://www.haproxy.com/) menawarkan dukungan dan pemeliharaan bagi HAProxy Enterprise dan
  Ingress kontroler [jcmoraisjr/haproxy-ingress](https://github.com/jcmoraisjr/haproxy-ingress).
* Kontroler Ingress berbasis [Istio](https://istio.io/)
  [Control Ingress Traffic](https://istio.io/docs/tasks/traffic-management/ingress/).
* [Kong](https://konghq.com/) menawarkan dukungan dan pemeliharaan [komunitas](https://discuss.konghq.com/c/kubernetes) atau
  [komersial](https://konghq.com/kong-enterprise/)
  [Kontroler Ingress untuk Kubernetes](https://github.com/Kong/kubernetes-ingress-controller).
* [NGINX, Inc.](https://www.nginx.com/) menawarkan dukungan dan pemeliharaan [Kontroler Ingress NGINX untuk Kubernetes](https://www.nginx.com/products/nginx/kubernetes-ingress-controller).
* [Traefik](https://github.com/containous/traefik) adalah sebuah kontroler Ingress yang menyediakan semua fitur secara lengkap (fully featured)
  ([Let's Encrypt](https://letsencrypt.org), *secrets*, *http2*, *websocket*), dengan tambahan dukungan
  komersial oleh [Containous](https://containo.us/services).

## Menggunakan beberapa jenis kontroler Ingress sekaligus

Kamu dapat melakukan *deploy* [berapa pun banyaknya kontroler Ingress](https://git.k8s.io/ingress-nginx/docs/user-guide/multiple-ingress.md#multiple-ingress-controllers)
dalam sebuah klaster. Jika kamu ingin membuat Ingress, kamu tinggal memberikan anotasi setiap Ingress sesuai dengan
[`ingress.class`](https://git.k8s.io/ingress-gce/docs/faq/README.md#how-do-i-run-multiple-ingress-controllers-in-the-same-cluster)
yang sesuai untuk menandai kontroler Ingress mana yang digunakan jika terdapat lebih dari satu kontroler Ingress yang ada di
klaster kamu.

Apabila kamu tidak mendefinisikan `class` yang dipakai, penyedia layanan *cloud* kamu akan menggunakan kontroler Ingress *default* yang mereka miliki.

Idealnya, semua ingress harus memenuhi spesifikasi ini, tetapi berbagai jenis
kontroler Ingress bisa saja memiliki sedikit perbedaan cara kerja.

{{< note >}}
Pastikan kamu sudah terlebih dahulu memahami dokumentasi kontroler Ingress yang akan kamu pakai sebelum memutuskan untuk memakai kontroler tersebut.
{{< /note >}}



## {{% heading "whatsnext" %}}


* Pelajari [Ingress](/id/docs/concepts/services-networking/ingress/) lebih lanjut.
* [Melakukan konfigurasi Ingress pada Minikube dengan kontroler NGINX](/docs/tasks/access-application-cluster/ingress-minikube)


