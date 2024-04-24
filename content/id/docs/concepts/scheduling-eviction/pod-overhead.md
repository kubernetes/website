---
title: Overhead Pod
content_type: concept
weight: 20
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.16" state="alpha" >}}


Ketika kamu menjalankan Pod pada Node, Pod itu akan mengambil sejumlah sumber daya sistem. Sumber daya ini adalah tambahan terhadap sumber daya yang diperlukan untuk menjalankan Container di dalam Pod (_overhead_).
_Pod Overhead_ adalah fitur yang berfungsi untuk menghitung sumber daya digunakan oleh infrastruktur Pod selain permintaan dan limit Container.





<!-- body -->

## Overhead Pod

Pada Kubernetes, Overhead Pod ditentukan pada
[saat admisi](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks) sesuai dengan Overhead yang ditentukan di dalam
[RuntimeClass](/id/docs/concepts/containers/runtime-class/) milik Pod.

Ketika Overhead Pod diaktifkan, Overhead akan dipertimbangkan sebagai tambahan terhadap jumlah permintaan sumber daya Container
saat menjadwalkan Pod. Begitu pula Kubelet, yang akan memasukkan Overhead Pod saat menentukan ukuran
cgroup milik Pod, dan saat melakukan pemeringkatan pengusiran (_eviction_) Pod.

### Yang perlu disiapkan

Kamu harus memastikan bahwa
[_feature gate_](/docs/reference/command-line-tools-reference/feature-gates/) `PodOverhead` telah diaktifkan (secara bawaan dinonaktifkan)
di seluruh klaster kamu, yang berarti:

- Pada {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}
- Pada {{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}}
- Pada {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} di setiap Node
- Pada peladen API khusus (_custom_) apa pun yang menggunakan _feature gate_

{{< note >}}
Pengguna yang dapat mengubah sumber daya RuntimeClass dapat memengaruhi kinerja beban kerja klaster secara keseluruhan. Kamu dapat membatasi akses terhadap kemampuan ini dengan kontrol akses Kubernetes.
Lihat [Ringkasan Otorisasi](/docs/reference/access-authn-authz/authorization/) untuk lebih lanjut.
{{< /note >}}



## {{% heading "whatsnext" %}}


* [RuntimeClass](/id/docs/concepts/containers/runtime-class/)
* [Desain PodOverhead](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/20190226-pod-overhead.md)


