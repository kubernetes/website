---
reviewers:
- dchen1107
- egernst
- tallclair
title: Overhead Pod
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.16" state="alpha" >}}


Ketika Anda menjalankan Pod pada Node, Pod itu sendiri mengambil sejumlah sumber daya sistem. Sumber daya ini adalah tambahan untuk sumber daya yang diperlukan untuk menjalankan Container di dalam Pod.
_Pod Overhead_ adalah fitur yang berfungsi untuk menghitung sumber daya digunakan oleh infrastruktur pod atas permintaan container & limits.


{{% /capture %}}


{{% capture body %}}

## Overhead Pod

Di Kubernetes, overhead pod ditetapkan pada
[admission](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)
waktu sesuai dengan overhead yang terkait dengan pod
[RuntimeClass](/docs/concepts/containers/runtime-class/).

Ketika Overhead Pod diaktifkan, overhead dipertimbangkan selain jumlah container
permintaan sumber daya saat menjadwalkan pod. Demikian pula, Kubelet akan memasukkan overhead pod saat menentukan ukuran
pod cgroup, dan saat melakukan pemeringkatan yang perlu dihilangangkan pada pod.

### Yang perlu disiapkan

Kamu harus memastikan bahwa `PodOverhead`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) sudah diaktifkan (dinonaktifkan secara default)
di seluruh cluster Anda. Ini berarti:

- Di {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}
- Di {{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}}
- Di {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} pada setiap Node
- Di server API khusus apa pun yang menggunakan feature gates

{{< note >}}
Pengguna yang dapat menulis ke sumber daya RuntimeClass dapat memiliki dampak pada cluster-wide
kinerja workload. Anda dapat membatasi akses ke kemampuan ini menggunakan kontrol akses Kubernetes.
Lihat pada [Authorization Overview](/docs/reference/access-authn-authz/authorization/) Untuk detail lebih lengkapnya.
{{< /note >}}

{{% /capture %}}

{{% capture whatsnext %}}

* [RuntimeClass](/docs/concepts/containers/runtime-class/)
* [PodOverhead Design](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/20190226-pod-overhead.md)

{{% /capture %}}
