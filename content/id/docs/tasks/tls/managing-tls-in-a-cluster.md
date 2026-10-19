---
title: Kelola Sertifikat TLS Pada Klaster
content_type: task
---

<!-- overview -->

Kubernetes menyediakan API `certificates.k8s.io` yang memungkinkan kamu membuat sertifikat
TLS yang ditandatangani oleh Otoritas Sertifikat (CA) yang kamu kendalikan. CA dan sertifikat ini 
bisa digunakan oleh _workload_ untuk membangun kepercayaan.

API `certificates.k8s.io` menggunakan protokol yang mirip dengan [konsep ACME](https://github.com/ietf-wg-acme/acme/).

{{< note >}}
Sertifikat yang dibuat menggunakan API `certificates.k8s.io` ditandatangani oleh CA
khusus. Ini memungkinkan untuk mengkonfigurasi klaster kamu agar menggunakan CA _root_ klaster untuk tujuan ini,
namun jangan pernah mengandalkan ini. Jangan berasumsi bahwa sertifikat ini akan melakukan validasi
dengan CA _root_ klaster  
{{< /note >}}




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Mempercayai TLS dalam Klaster

Mempercayai CA khusus dari aplikasi yang berjalan sebagai Pod biasanya memerlukan
beberapa tambahan konfigurasi aplikasi. Kamu harus menambahkan bundel sertifikat CA 
ke daftar sertifikat CA yang dipercaya klien atau server TLS. 
Misalnya, kamu akan melakukan ini dengan konfigurasi TLS golang dengan mengurai rantai sertifikat 
dan menambahkan sertifikat yang diurai ke `RootCAs` di _struct_
[`tls.Config`](https://godoc.org/crypto/tls#Config).

Kamu bisa mendistribusikan sertifikat CA sebagai sebuah
[ConfigMap](/id/docs/tasks/configure-pod-container/configure-pod-configmap) yang bisa diakses oleh Pod kamu.

## Meminta Sertifikat

Bagian berikut mendemonstrasikan cara membuat sertifikat TLS untuk sebuah
Service kubernetes yang diakses melalui DNS.

{{< note >}}
Tutorial ini menggunakan CFSSL: PKI dan peralatan TLS dari Cloudflare [klik disini](https://blog.cloudflare.com/introducing-cfssl/) untuk mengetahui lebih jauh.
{{< /note >}}

## Unduh dan Pasang CFSSL

Contoh ini menggunakan cfssl yang dapat diunduh pada 
[https://github.com/cloudflare/cfssl/releases](https://github.com/cloudflare/cfssl/releases).

## Membuat CertificateSigningRequest

Buat kunci pribadi dan CertificateSigningRequest (CSR) dengan menggunakan perintah berikut:

```shell
cat <<EOF | cfssl genkey - | cfssljson -bare server
{
  "hosts": [
    "my-svc.my-namespace.svc.cluster.local",
    "my-pod.my-namespace.pod.cluster.local",
    "192.0.2.24",
    "10.0.34.2"
  ],
  "CN": "my-pod.my-namespace.pod.cluster.local",
  "key": {
    "algo": "ecdsa",
    "size": 256
  }
}
EOF
```

`192.0.2.24` adalah klaster IP Service,
`my-svc.my-namespace.svc.cluster.local` adalah nama DNS Service,
`10.0.34.2` adalah IP Pod dan `my-pod.my-namespace.pod.cluster.local`
adalah nama DNS Pod. Kamu akan melihat keluaran berikut:

```
2017/03/21 06:48:17 [INFO] generate received request
2017/03/21 06:48:17 [INFO] received CSR
2017/03/21 06:48:17 [INFO] generating key: ecdsa-256
2017/03/21 06:48:17 [INFO] encoded CSR
```

Perintah ini menghasilkan dua berkas; Ini menghasilkan `server.csr` yang berisi permintaan sertifikasi PEM
tersandi [pkcs#10](https://tools.ietf.org/html/rfc2986),
dan `server-key.pem` yang berisi PEM kunci yang tersandi untuk sertifikat yang
masih harus dibuat.

## Membuat objek CertificateSigningRequest untuk dikirim ke API Kubernetes
Buat sebuah yaml CSR dan kirim ke API Server dengan menggunakan perintah berikut:

```shell
cat <<EOF | kubectl apply -f -
apiVersion: certificates.k8s.io/v1beta1
kind: CertificateSigningRequest
metadata:
  name: my-svc.my-namespace
spec:
  request: $(cat server.csr | base64 | tr -d '\n')
  usages:
  - digital signature
  - key encipherment
  - server auth
EOF
```

Perhatikan bahwa berkas `server.csr` yang dibuat pada langkah 1 merupakan base64 tersandi
dan disimpan di _field_ `.spec.request`. Kami juga meminta
sertifikat dengan penggunaan kunci "_digital signature_", "_key enchiperment_", dan "_server
auth_". Kami mendukung semua penggunaan kunci dan penggunaan kunci yang diperpanjang yang terdaftar
[di sini](https://godoc.org/k8s.io/api/certificates/v1beta1#KeyUsage)
sehingga kamu dapat meminta sertifikat klien dan sertifikat lain menggunakan
API yang sama.

CSR semestinya bisa dilihat dari API pada status _Pending_. Kamu bisa melihatnya dengan menjalankan:

```shell
kubectl describe csr my-svc.my-namespace
```

```none
Name:                   my-svc.my-namespace
Labels:                 <none>
Annotations:            <none>
CreationTimestamp:      Tue, 21 Mar 2017 07:03:51 -0700
Requesting User:        yourname@example.com
Status:                 Pending
Subject:
        Common Name:    my-svc.my-namespace.svc.cluster.local
        Serial Number:
Subject Alternative Names:
        DNS Names:      my-svc.my-namespace.svc.cluster.local
        IP Addresses:   192.0.2.24
                        10.0.34.2
Events: <none>
```

## Mendapatkan Persetujuan CertificateSigningRequest

Penyetujuan CertificateSigningRequest dapat dilakukan dengan otomatis
atau dilakukan sekali oleh administrator klaster. Informasi lebih lanjut tentang 
apa yang terjadi dibahas dibawah ini.

## Unduh dan Gunakan Sertifikat

Setelah CSR ditandatangani dan disetujui, kamu akan melihat:

```shell
kubectl get csr
```

```none
NAME                  AGE       REQUESTOR               CONDITION
my-svc.my-namespace   10m       yourname@example.com    Approved,Issued
```

Kamu bisa mengundur sertifikat yang telah diterbitkan dan menyimpannya ke berkas 
`server.crt` dengan menggunakan perintah berikut:

```shell
kubectl get csr my-svc.my-namespace -o jsonpath='{.status.certificate}' \
    | base64 --decode > server.crt
```

Sekarang kamu bisa menggunakan `server.crt` dan `server-key.pem` sebagai pasangan 
kunci untuk memulai server HTTPS kamu.

## Penyetujuan CertificateSigningRequest

Administrator Kubernetes (dengan izin yang cukup) dapat menyetujui secara manual
(atau menolak) Certificate Signing Requests dengan menggunakan perintah `kubectl certificate
approve` dan `kubectl certificate deny`. Namun jika kamu bermaksud
untuk menggunakan API ini secara sering, kamu dapat mempertimbangkan untuk menulis
Certificate _controller_ otomatis.

Baik itu mesin atau manusia yang menggunakan kubectl seperti di atas, peran pemberi persetujuan adalah
untuk memverifikasi bahwa CSR memenuhi dua persyaratan:
1. Subjek CSR mengontrol kunci pribadi yang digunakan untuk menandatangani CSR. Ini
    mengatasi ancaman pihak ketiga yang menyamar sebagai subjek resmi.
    Pada contoh di atas, langkah ini adalah untuk memverifikasi bahwa Pod mengontrol
    kunci pribadi yang digunakan untuk menghasilkan CSR.
2. Subjek CSR berwenang untuk bertindak dalam konteks yang diminta. Ini
    mengatasi ancaman subjek yang tidak diinginkan bergabung dengan klaster. Dalam
    contoh di atas, langkah ini untuk memverifikasi bahwa Pod diizinkan
    berpartisipasi dalam Service yang diminta.   

Jika dan hanya jika kedua persyaratan ini dipenuhi, pemberi persetujuan harus menyetujui
CSR dan sebaliknya harus menolak CSR.

## Peringatan tentang Izin Persetujuan

Kemampuan untuk menyetujui CSR menentukan siapa yang mempercayai siapa di dalam lingkungan kamu. 
Kemampuan untuk menyetujui CSR tersebut seharusnya tidak diberikan secara luas.
Persyaratan tantangan yang disebutkan di bagian sebelumnya dan
dampak dari mengeluarkan sertifikat khusus, harus sepenuhnya dipahami
sebelum memberikan izin ini.

## Catatan Untuk Administrator Klaster

Tutorial ini mengasumsikan bahwa penanda tangan diatur untuk melayani API sertifikat. 
Kubernetes _controller manager_ menyediakan implementasi bawaan dari penanda tangan. Untuk
mengaktifkan, berikan parameter `--cluster-signed-cert-file` dan
`--cluster-signed-key-file` ke _controller manager_ dengan _path_ ke
pasangan kunci CA kamu.

