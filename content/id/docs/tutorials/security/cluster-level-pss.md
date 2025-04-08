---
title: Menerapkan Standar Keamanan Pod di Tingkat Kluster
content_type: tutorial
weight: 10
---

{{% alert title="Catatan" %}}
Tutorial ini hanya berlaku untuk klaster baru.
{{% /alert %}}

Keamanan Pod adalah pengendali penerimaan (admission controller) yang melakukan pemeriksaan terhadap [Standar Keamanan Pod](/docs/concepts/security/pod-security-standards/) Kubernetes saat pod baru dibuat. Fitur ini telah mencapai status GA di v1.25. Tutorial ini menunjukkan cara menerapkan Standar Keamanan Pod `baseline` di tingkat klaster, yang menerapkan konfigurasi standar ke semua namespace dalam klaster.

Untuk menerapkan Standar Keamanan Pod ke namespace tertentu, lihat [Menerapkan Standar Keamanan Pod di tingkat namespace](/docs/tutorials/security/ns-level-pss).

Jika kamu menggunakan versi Kubernetes selain v{{< skew currentVersion >}}, periksa dokumentasi untuk versi tersebut.

## {{% heading "prerequisites" %}}

Pasang alat berikut di workstation kamu:

- [kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
- [kubectl](/docs/tasks/tools/)

Tutorial ini menunjukkan apa yang dapat kamu konfigurasikan untuk klaster Kubernetes yang sepenuhnya kamu kendalikan. Jika kamu sedang mempelajari cara mengonfigurasi Pod Security Admission untuk klaster terkelola di mana kamu tidak dapat mengonfigurasi control plane, baca [Menerapkan Standar Keamanan Pod di tingkat namespace](/docs/tutorials/security/ns-level-pss).

## Pilih Standar Keamanan Pod yang Tepat untuk Diterapkan

[Pod Security Admission](/docs/concepts/security/pod-security-admission/) memungkinkan kamu menerapkan [Standar Keamanan Pod](/docs/concepts/security/pod-security-standards/) bawaan dengan mode berikut: `enforce`, `audit`, dan `warn`.

Untuk mengumpulkan informasi yang membantu kamu memilih Standar Keamanan Pod yang paling sesuai untuk konfigurasi kamu, lakukan langkah-langkah berikut:

1. Buat klaster tanpa Standar Keamanan Pod yang diterapkan:

   ```shell
   kind create cluster --name psa-wo-cluster-pss
   ```
   Outputnya akan serupa dengan:
   ```
   Creating cluster "psa-wo-cluster-pss" ...
   ✓ Ensuring node image (kindest/node:v{{< skew currentPatchVersion >}}) 🖼
   ✓ Preparing nodes 📦
   ✓ Writing configuration 📜
   ✓ Starting control-plane 🕹️
   ✓ Installing CNI 🔌
   ✓ Installing StorageClass 💾
   Set kubectl context to "kind-psa-wo-cluster-pss"
   You can now use your cluster with:

   kubectl cluster-info --context kind-psa-wo-cluster-pss

   Thanks for using kind! 😊
   ```

1. Setel konteks kubectl ke klaster baru:

   ```shell
   kubectl cluster-info --context kind-psa-wo-cluster-pss
   ```
   Outputnya akan serupa dengan ini:

   ```
   Kubernetes control plane is running at https://127.0.0.1:61350

   CoreDNS is running at https://127.0.0.1:61350/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

   To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
   ```

1. Dapatkan daftar namespace di klaster:

   ```shell
   kubectl get ns
   ```
   Outputnya akan serupa dengan ini:
   ```
   NAME                 STATUS   AGE
   default              Active   9m30s
   kube-node-lease      Active   9m32s
   kube-public          Active   9m32s
   kube-system          Active   9m32s
   local-path-storage   Active   9m26s
   ```

1. Gunakan `--dry-run=server` untuk memahami apa yang terjadi saat Standar Keamanan Pod yang berbeda diterapkan:

   1. Privileged
      ```shell
      kubectl label --dry-run=server --overwrite ns --all \
      pod-security.kubernetes.io/enforce=privileged
      ```

      Outputnya akan serupa dengan:
      ```
      namespace/default labeled
      namespace/kube-node-lease labeled
      namespace/kube-public labeled
      namespace/kube-system labeled
      namespace/local-path-storage labeled
      ```
   2. Baseline
      ```shell
      kubectl label --dry-run=server --overwrite ns --all \
      pod-security.kubernetes.io/enforce=baseline
      ```

      Outputnya akan serupa dengan:
      ```
      namespace/default labeled
      namespace/kube-node-lease labeled
      namespace/kube-public labeled
      Warning: existing pods in namespace "kube-system" violate the new PodSecurity enforce level "baseline:latest"
      Warning: etcd-psa-wo-cluster-pss-control-plane (and 3 other pods): host namespaces, hostPath volumes
      Warning: kindnet-vzj42: non-default capabilities, host namespaces, hostPath volumes
      Warning: kube-proxy-m6hwf: host namespaces, hostPath volumes, privileged
      namespace/kube-system labeled
      namespace/local-path-storage labeled
      ```

   3. Restricted
      ```shell
      kubectl label --dry-run=server --overwrite ns --all \
      pod-security.kubernetes.io/enforce=restricted
      ```

      Outputnya akan serupa dengan:
      ```
      namespace/default labeled
      namespace/kube-node-lease labeled
      namespace/kube-public labeled
      Warning: existing pods in namespace "kube-system" violate the new PodSecurity enforce level "restricted:latest"
      Warning: coredns-7bb9c7b568-hsptc (and 1 other pod): unrestricted capabilities, runAsNonRoot != true, seccompProfile
      Warning: etcd-psa-wo-cluster-pss-control-plane (and 3 other pods): host namespaces, hostPath volumes, allowPrivilegeEscalation != false, unrestricted capabilities, restricted volume types, runAsNonRoot != true
      Warning: kindnet-vzj42: non-default capabilities, host namespaces, hostPath volumes, allowPrivilegeEscalation != false, unrestricted capabilities, restricted volume types, runAsNonRoot != true, seccompProfile
      Warning: kube-proxy-m6hwf: host namespaces, hostPath volumes, privileged, allowPrivilegeEscalation != false, unrestricted capabilities, restricted volume types, runAsNonRoot != true, seccompProfile
      namespace/kube-system labeled
      Warning: existing pods in namespace "local-path-storage" violate the new PodSecurity enforce level "restricted:latest"
      Warning: local-path-provisioner-d6d9f7ffc-lw9lh: allowPrivilegeEscalation != false, unrestricted capabilities, runAsNonRoot != true, seccompProfile
      namespace/local-path-storage labeled
      ```

Dari output sebelumnya, kamu akan melihat bahwa menerapkan Standar Keamanan Pod `privileged` tidak menunjukkan peringatan untuk namespace mana pun. Namun, standar `baseline` dan `restricted` keduanya memiliki peringatan, khususnya di namespace `kube-system`.

## Setel mode, versi, dan standar

Di bagian ini, kamu menerapkan Standar Keamanan Pod berikut ke versi `latest`:

* Standar `baseline` dalam mode `enforce`.
* Standar `restricted` dalam mode `warn` dan `audit`.

Standar Keamanan Pod `baseline` menyediakan titik tengah yang nyaman yang memungkinkan daftar pengecualian tetap pendek dan mencegah eskalasi hak istimewa yang diketahui.

Selain itu, untuk mencegah pod gagal di `kube-system`, kamu akan mengecualikan namespace dari penerapan Standar Keamanan Pod.

Saat kamu menerapkan Pod Security Admission di lingkungan kamu sendiri, pertimbangkan hal-hal berikut:

1. Berdasarkan postur risiko yang diterapkan pada klaster, Standar Keamanan Pod yang lebih ketat seperti `restricted` mungkin merupakan pilihan yang lebih baik.
1. Mengecualikan namespace `kube-system` memungkinkan pod berjalan sebagai `privileged` di namespace ini. Untuk penggunaan di dunia nyata, proyek Kubernetes sangat menyarankan agar kamu menerapkan kebijakan RBAC yang ketat yang membatasi akses ke `kube-system`, mengikuti prinsip hak istimewa paling sedikit.
   Untuk menerapkan standar sebelumnya, lakukan langkah-langkah berikut:
1. Buat file konfigurasi yang dapat dikonsumsi oleh Pod Security Admission Controller untuk menerapkan Standar Keamanan Pod ini:

   ```
   mkdir -p /tmp/pss
   cat <<EOF > /tmp/pss/cluster-level-pss.yaml
   apiVersion: apiserver.config.k8s.io/v1
   kind: AdmissionConfiguration
   plugins:
   - name: PodSecurity
     configuration:
       apiVersion: pod-security.admission.config.k8s.io/v1
       kind: PodSecurityConfiguration
       defaults:
         enforce: "baseline"
         enforce-version: "latest"
         audit: "restricted"
         audit-version: "latest"
         warn: "restricted"
         warn-version: "latest"
       exemptions:
         usernames: []
         runtimeClasses: []
         namespaces: [kube-system]
   EOF
   ```

   {{< note >}}
   Konfigurasi `pod-security.admission.config.k8s.io/v1` mensyaratkan v1.25+
   Untuk v1.23 dan v1.24, gunakan [v1beta1](https://v1-24.docs.kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-admission-controller/).
   Untuk v1.22, gunakan [v1alpha1](https://v1-22.docs.kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-admission-controller/).
   {{< /note >}}


1. Konfigurasikan API server untuk mengonsumsi file ini selama pembuatan klaster:

   ```
   cat <<EOF > /tmp/pss/cluster-config.yaml
   kind: Cluster
   apiVersion: kind.x-k8s.io/v1alpha4
   nodes:
   - role: control-plane
     kubeadmConfigPatches:
     - |
       kind: ClusterConfiguration
       apiServer:
           extraArgs:
             admission-control-config-file: /etc/config/cluster-level-pss.yaml
           extraVolumes:
             - name: accf
               hostPath: /etc/config
               mountPath: /etc/config
               readOnly: false
               pathType: "DirectoryOrCreate"
     extraMounts:
     - hostPath: /tmp/pss
       containerPath: /etc/config
       # optional: if set, the mount is read-only.
       # default false
       readOnly: false
       # optional: if set, the mount needs SELinux relabeling.
       # default false
       selinuxRelabel: false
       # optional: set propagation mode (None, HostToContainer or Bidirectional)
       # see https://kubernetes.io/docs/concepts/storage/volumes/#mount-propagation
       # default None
       propagation: None
   EOF
   ```

   {{<note>}}
   Jika kamu menggunakan Docker Desktop dengan *kind* di macOS, kamu dapat
   menambahkan `/tmp` sebagai Direktori Bersama di bawah menu
   **Preferences > Resources > File Sharing**.
   {{</note>}}

1. Buat klaster yang menggunakan Pod Security Admission untuk menerapkan
   Standar Keamanan Pod ini:

   ```shell
   kind create cluster --name psa-with-cluster-pss --config /tmp/pss/cluster-config.yaml
   ```
   Outputnya akan serupa dengan ini:
   ```
   Creating cluster "psa-with-cluster-pss" ...
    ✓ Ensuring node image (kindest/node:v{{< skew currentPatchVersion >}}) 🖼
    ✓ Preparing nodes 📦
    ✓ Writing configuration 📜
    ✓ Starting control-plane 🕹️
    ✓ Installing CNI 🔌
    ✓ Installing StorageClass 💾
   Set kubectl context to "kind-psa-with-cluster-pss"
   You can now use your cluster with:

   kubectl cluster-info --context kind-psa-with-cluster-pss

   Have a question, bug, or feature request? Let us know! https://kind.sigs.k8s.io/#community 🙂
   ```

1. Arahkan kubectl ke klaster:
   ```shell
   kubectl cluster-info --context kind-psa-with-cluster-pss
   ```
   Outputnya akan serupa dengan ini:
   ```
   Kubernetes control plane is running at https://127.0.0.1:63855
   CoreDNS is running at https://127.0.0.1:63855/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

   To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
   ```

1. Buat Pod di namespace default:

    {{% code_sample file="security/example-baseline-pod.yaml" %}}

   ```shell
   kubectl apply -f https://k8s.io/examples/security/example-baseline-pod.yaml
   ```

   Pod akan dimulai secara normal, tetapi outputnya menyertakan peringatan:
   ```
   Warning: would violate PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container "nginx" must set securityContext.allowPrivilegeEscalation=false), unrestricted capabilities (container "nginx" must set securityContext.capabilities.drop=["ALL"]), runAsNonRoot != true (pod or container "nginx" must set securityContext.runAsNonRoot=true), seccompProfile (pod or container "nginx" must set securityContext.seccompProfile.type to "RuntimeDefault" or "Localhost")
   pod/nginx created
   ```

## Bersihkan

Sekarang hapus klaster yang kamu buat di atas dengan menjalankan perintah berikut:

```shell
kind delete cluster --name psa-with-cluster-pss
```
```shell
kind delete cluster --name psa-wo-cluster-pss
```

## {{% heading "whatsnext" %}}

- Jalankan [skrip shell](/examples/security/kind-with-cluster-level-baseline-pod-security.sh) untuk melakukan semua langkah sebelumnya sekaligus:
  1. Buat Konfigurasi tingkat klaster berbasis Standar Keamanan Pod
  2. Buat file untuk membiarkan API server mengonsumsi konfigurasi ini
  3. Buat klaster yang membuat API server dengan konfigurasi ini
  4. Setel konteks kubectl ke klaster baru ini
  5. Buat file yaml pod minimal
  6. Terapkan file ini untuk membuat Pod di klaster baru
- [Pod Security Admission](/docs/concepts/security/pod-security-admission/)
- [Pod Security Standards](/docs/concepts/security/pod-security-standards/)
- [Menerapkan Standar Keamanan Pod di tingkat namespace](/docs/tutorials/security/ns-level-pss/)
