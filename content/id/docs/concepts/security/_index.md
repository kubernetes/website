---
title: "Keamanan"
weight: 85
description: >
  Konsep-konsep untuk menjaga *cloud-native workload* tetap aman.
simple_list: true
---

Bagian dokumentasi Kubernetes ini memiliki tujuan untuk membantu anda
menjalankan *workloads* lebih aman, dan aspek-aspek mendasar dalam menjaga
klaster Kubernetes tetap aman.

Kubernetes berbasiskan arsitektur *cloud-native* dan mengambil saran dari
{{< glossary_tooltip text="CNCF" term_id="cncf" >}} mengenai praktik yang baik dari *cloud native information security*.

Baca [Cloud Native Security and Kubernetes](/docs/concepts/security/cloud-native-security/)
untuk konteks yang lebih luas mengenai bagaimana cara mengamankan klaster anda
dan aplikasi yang berjalan di atasnya.

## Mekanisme keamanan Kubernetes {#security-mechanisms}

### Proteksi *control plane*

Kunci penting pada apapun varian klaster Kubernetes adalah
[kontrol akses ke Kubernetes API](/docs/concepts/security/controlling-access).

Kubernetes menyarankan anda untuk mengkonfigurasi dan menggunakan TLS dalam menyediakan
[enkripsi data saat transit](/docs/tasks/tls/managing-tls-in-a-cluster/)
di dalam *control plane*, dan di antara *control plane* dengan *client*.
Anda juga bisa mengaktifkan [encryption at rest](/docs/tasks/administer-cluster/encrypt-data/)
untuk data yang tersimpan di dalam Kubernetes control plane; hal ini terpisah dari
menggunanakan *encryption at rest* untuk data anda di workload.

### Secrets

[Secret](/docs/concepts/configuration/secret/) API menyediakan perlindungan dasar untuk variabel konfigurasi yang konfidensial.

### Perlindungan Workload

Terapkan [Pod security standards](/docs/concepts/security/pod-security-standards/) untuk memastikan Pods dan containers terisolasi dengan baik.
Anda juga dapat menggunakan [RuntimeClasses](/docs/concepts/containers/runtime-class) untuk mendefinisikan isolasi *custom* jika dibutuhkan.

[Network policies](/docs/concepts/services-networking/network-policies/) memungkinkan anda mengendalikan
trafik jaringan di antara Pods, atau antara Pods dengan jaringan di luar klaster.

Anda dapat men-deploy security controls dari ekosistem yang lebih besar untuk mengimplementasikan kontrol pencegahan
atau pendeteksian di sekitar Pods, kontainer dan images yang berjalan.

### Audit

Kubernetes [audit logging](/docs/tasks/debug/debug-cluster/audit/)  menyediakan
sebuah set catatan yang berurutan terkait dengan keamanan, mendokumentasikan
urutan aktivitas dalam suatu cluster. Aktivitas *cluster audit* dihasilkan
oleh pengguna, aplikasi yang menggunakan Kubernetes API dan control plane.

## Keamanan penyedia cloud

{{% thirdparty-content vendor="true" %}}

Jika anda menjalankan klaster Kubernetes pada perangkat keras anda sendiri atau
pada penyedia layanan komputasi awan, silakan kunjungi halaman dokumentasi untuk melihat saran/tips dalam keamanan.
Berikut ini beberapa tautan ke halaman dokumentasi keamanan dari beberapa
penyedia jasa komputasi awan:

{{< table caption="Keamanan cloud provider" >}}

Penyedia IaaS | Tautan |
-------------------- | ------------ |
Alibaba Cloud | https://www.alibabacloud.com/trust-center |
Amazon Web Services | https://aws.amazon.com/security |
Google Cloud Platform | https://cloud.google.com/security |
Huawei Cloud | https://www.huaweicloud.com/intl/en-us/securecenter/overallsafety |
IBM Cloud | https://www.ibm.com/cloud/security |
Microsoft Azure | https://docs.microsoft.com/en-us/azure/security/azure-security |
Oracle Cloud Infrastructure | https://www.oracle.com/security |
Tencent Cloud | https://www.tencentcloud.com/solutions/data-security-and-information-protection |
VMware vSphere | https://www.vmware.com/solutions/security/hardening-guides |

{{< /table >}}

## Policies

Anda dapat mendefinisikan *security policies* menggunakan mekanisme *Kubernetes-native* seperti [NetworkPolicy](/docs/concepts/services-networking/network-policies/) (kontrol deklaratif atas network packet filtering) atau [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/)
(larangan deklaratif atas perubahan apa yang bisa dibuat seseorang menggunakan Kubernetes API).

Bagaimanapun juga, anda dapat mengandalkan dari implementasi *policy* dari
ekosistem yang lebih besar di sekitar Kubernetes. Kubernetes menyediakan
mekanisme ekstensi untuk membiarkan ekosistem proyek tersebut mengimplementasikan
*policy controls* mereka pada peninjauan kode sumber, persetujuan image container,
akses kontrol API, jaringan dan lain-lain.

Untuk informasi lebih lanjut mengenai mekanisme *policy* dan Kubernetes, silakan
baca  [Policies](/docs/concepts/policy/).

## {{% heading "whatsnext" %}}

Pelajari lebih lanjut topik terkait keamanan Kubernetes:

* [Securing your cluster](/docs/tasks/administer-cluster/securing-a-cluster/)
* [Known vulnerabilities](/docs/reference/issues-security/official-cve-feed/)
  in Kubernetes (dan tautan untuk informasi lebih lanjut)
* [Data encryption in transit](/docs/tasks/tls/managing-tls-in-a-cluster/) untuk *control plane*
* [Data encryption at rest](/docs/tasks/administer-cluster/encrypt-data/)
* [Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access)
* [Network policies](/docs/concepts/services-networking/network-policies/) untuk Pods
* [Secrets in Kubernetes](/docs/concepts/configuration/secret/)
* [Pod security standards](/docs/concepts/security/pod-security-standards/)
* [RuntimeClasses](/docs/concepts/containers/runtime-class)

Pelajari konteks:

* [Cloud Native Security and Kubernetes](/docs/concepts/security/cloud-native-security/)

Ambil sertifikasi:

* [Certified Kubernetes Security Specialist](https://training.linuxfoundation.org/certification/certified-kubernetes-security-specialist/)
  sertifikasi dan kursus pelatihan resmi.

Baca lebih lanjut dalam bagian ini: