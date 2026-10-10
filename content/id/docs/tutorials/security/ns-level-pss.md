---
title: Menerapkan Standar Keamanan Pod di Tingkat Namespace
content_type: tutorial
weight: 20
---

{{% alert title="Catatan" %}}
Tutorial ini hanya berlaku untuk klaster baru.
{{% /alert %}}

Pod Security Admission adalah pengendali penerimaan (admission controller) yang menerapkan 
[Standar Keamanan Pod](/docs/concepts/security/pod-security-standards/) 
saat pod dibuat. Fitur ini telah mencapai status GA di v1.25.
Dalam tutorial ini, Anda akan menerapkan Standar Keamanan Pod `baseline`,
satu namespace pada satu waktu.

Anda juga dapat menerapkan Standar Keamanan Pod ke beberapa namespace sekaligus di tingkat klaster. Untuk instruksi, lihat 
[Menerapkan Standar Keamanan Pod di tingkat klaster](/docs/tutorials/security/cluster-level-pss/).

## {{% heading "prerequisites" %}}

Pasang alat berikut di workstation Anda:

- [kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
- [kubectl](/docs/tasks/tools/)

## Membuat klaster

1. Buat klaster `kind` sebagai berikut:

   ```shell
   kind create cluster --name psa-ns-level
   ```

   Outputnya mirip dengan ini:

   ```
   Membuat klaster "psa-ns-level" ...
    ✓ Memastikan gambar node (kindest/node:v{{< skew currentPatchVersion >}}) 🖼 
    ✓ Menyiapkan node 📦  
    ✓ Menulis konfigurasi 📜 
    ✓ Memulai control-plane 🕹️ 
    ✓ Memasang CNI 🔌 
    ✓ Memasang StorageClass 💾 
   Atur konteks kubectl ke "kind-psa-ns-level"
   Anda sekarang dapat menggunakan klaster Anda dengan:
    
   kubectl cluster-info --context kind-psa-ns-level
    
   Tidak yakin apa yang harus dilakukan selanjutnya? 😅  Lihat https://kind.sigs.k8s.io/docs/user/quick-start/
   ```

1. Atur konteks kubectl ke klaster baru:

   ```shell
   kubectl cluster-info --context kind-psa-ns-level
   ```
   Outputnya mirip dengan ini:

   ```
   Control plane Kubernetes berjalan di https://127.0.0.1:50996
   CoreDNS berjalan di https://127.0.0.1:50996/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
    
   Untuk debug dan diagnosis masalah klaster lebih lanjut, gunakan 'kubectl cluster-info dump'.
   ```

## Membuat namespace

Buat namespace baru bernama `example`:

```shell
kubectl create ns example
```

Outputnya mirip dengan ini:

```
namespace/example created
```

## Mengaktifkan pemeriksaan Standar Keamanan Pod untuk namespace tersebut

1. Aktifkan Standar Keamanan Pod pada namespace ini menggunakan label yang didukung oleh
   Pod Security Admission bawaan. Dalam langkah ini Anda akan mengkonfigurasi pemeriksaan untuk
   memberikan peringatan pada Pod yang tidak memenuhi versi terbaru dari standar keamanan pod _baseline_.

   ```shell
   kubectl label --overwrite ns example \
      pod-security.kubernetes.io/warn=baseline \
      pod-security.kubernetes.io/warn-version=latest
   ```

2. Anda dapat mengonfigurasi beberapa pemeriksaan standar keamanan pod pada namespace mana pun, menggunakan label.
   Perintah berikut akan `enforce` Standar Keamanan Pod `baseline`, tetapi
   `warn` dan `audit` untuk Standar Keamanan Pod `restricted` sesuai dengan versi terbaru
   (nilai default)

   ```shell
   kubectl label --overwrite ns example \
     pod-security.kubernetes.io/enforce=baseline \
     pod-security.kubernetes.io/enforce-version=latest \
     pod-security.kubernetes.io/warn=restricted \
     pod-security.kubernetes.io/warn-version=latest \
     pod-security.kubernetes.io/audit=restricted \
     pod-security.kubernetes.io/audit-version=latest
   ```

## Memverifikasi penerapan Standar Keamanan Pod

1. Buat Pod baseline di namespace `example`:

   ```shell
   kubectl apply -n example -f https://k8s.io/examples/security/example-baseline-pod.yaml
   ```
   Pod berhasil dibuat; outputnya termasuk peringatan. Sebagai contoh:

   ```
   Warning: would violate PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container "nginx" must set securityContext.allowPrivilegeEscalation=false), unrestricted capabilities (container "nginx" must set securityContext.capabilities.drop=["ALL"]), runAsNonRoot != true (pod or container "nginx" must set securityContext.runAsNonRoot=true), seccompProfile (pod or container "nginx" must set securityContext.seccompProfile.type to "RuntimeDefault" or "Localhost")
   pod/nginx created
   ```

1. Buat Pod baseline di namespace `default`:

   ```shell
   kubectl apply -n default -f https://k8s.io/examples/security/example-baseline-pod.yaml
   ```
   Outputnya mirip dengan ini:

   ```
   pod/nginx created
   ```

Pengaturan penerapan dan peringatan Standar Keamanan Pod hanya diterapkan
ke namespace `example`. Anda dapat membuat Pod yang sama di namespace `default`
tanpa peringatan.

## Menghapus

Sekarang hapus klaster yang Anda buat di atas dengan menjalankan perintah berikut:

```shell
kind delete cluster --name psa-ns-level
```

## {{% heading "whatsnext" %}}

- Jalankan
  [skrip shell](/examples/security/kind-with-namespace-level-baseline-pod-security.sh)
  untuk melakukan semua langkah sebelumnya sekaligus.

  1. Membuat klaster kind
  2. Membuat namespace baru
  3. Menerapkan Standar Keamanan Pod `baseline` dalam mode `enforce` sambil menerapkan
     Standar Keamanan Pod `restricted` juga dalam mode `warn` dan `audit`.
  4. Membuat pod baru dengan standar keamanan pod berikut diterapkan

- [Pod Security Admission](/docs/concepts/security/pod-security-admission/)
- [Standar Keamanan Pod](/docs/concepts/security/pod-security-standards/)
- [Menerapkan Standar Keamanan Pod di tingkat klaster](/docs/tutorials/security/cluster-level-pss/)
