---
title: Sertifikat
content_type: concept
weight: 20
---

<!-- overview -->

Saat menggunakan autentikasi sertifikat klien, kamu dapat membuat sertifikat
secara manual melalui `easyrsa`, `openssl` atau `cfssl`.




<!-- body -->

### easyrsa

**easyrsa** dapat digunakan untuk menghasilkan sertifikat klaster kamu secara manual.

1. Unduh, buka paket, dan inisialisasi versi tambal easyrsa3.

        curl -LO https://dl.k8s.io/easy-rsa/easy-rsa.tar.gz
        tar xzf easy-rsa.tar.gz
        cd easy-rsa-master/easyrsa3
        ./easyrsa init-pki
1. Hasilkan CA. (`--batch` untuk atur mode otomatis. `--req-cn` untuk menggunakan _default_ CN.)

        ./easyrsa --batch "--req-cn=${MASTER_IP}@`date +%s`" build-ca nopass
1. Hasilkan sertifikat dan kunci _server_.
    Argumen `--subject-alt-name` digunakan untuk mengatur alamat IP dan nama DNS yang dapat diakses
    oleh _server_ API. `MASTER_CLUSTER_IP` biasanya merupakan IP pertama dari CIDR _service cluster_
    yang diset dengan argumen `--service-cluster-ip-range` untuk _server_ API dan
    komponen manajer pengontrol. Argumen `--days` digunakan untuk mengatur jumlah hari
    masa berlaku sertifikat.
    Sampel di bawah ini juga mengasumsikan bahwa kamu menggunakan `cluster.local` sebagai nama
    _domain_ DNS _default_.

        ./easyrsa --subject-alt-name="IP:${MASTER_IP},"\
        "IP:${MASTER_CLUSTER_IP},"\
        "DNS:kubernetes,"\
        "DNS:kubernetes.default,"\
        "DNS:kubernetes.default.svc,"\
        "DNS:kubernetes.default.svc.cluster,"\
        "DNS:kubernetes.default.svc.cluster.local" \
        --days=10000 \
        build-server-full server nopass
1.  Salin `pki/ca.crt`, `pki/issued/server.crt`, dan `pki/private/server.key` ke direktori kamu.
1.  Isi dan tambahkan parameter berikut ke dalam parameter mulai _server_ API:

        --client-ca-file=/yourdirectory/ca.crt
        --tls-cert-file=/yourdirectory/server.crt
        --tls-private-key-file=/yourdirectory/server.key

### openssl

**openssl** secara manual dapat menghasilkan sertifikat untuk klaster kamu.

1.  Hasilkan ca.key dengan 2048bit:

        openssl genrsa -out ca.key 2048
1.  Hasilkan ca.crt berdasarkan ca.key (gunakan -days untuk mengatur waktu efektif sertifikat):

        openssl req -x509 -new -nodes -key ca.key -subj "/CN=${MASTER_IP}" -days 10000 -out ca.crt
1. Hasilkan server.key dengan 2048bit:

        openssl genrsa -out server.key 2048
1. Buat _file_ konfigurasi untuk menghasilkan _Certificate Signing Request_ (CSR).
    Pastikan untuk mengganti nilai yang ditandai dengan kurung sudut (mis. `<MASTER_IP>`)
    dengan nilai sebenarnya sebelum menyimpan ke _file_ (mis. `csr.conf`).
    Perhatikan bahwa nilai `MASTER_CLUSTER_IP` adalah layanan IP klaster untuk
    _server_ API seperti yang dijelaskan dalam subbagian sebelumnya.
    Sampel di bawah ini juga mengasumsikan bahwa kamu menggunakan `cluster.local`
    sebagai nama _domain_ DNS _default_.

        [ req ]
        default_bits = 2048
        prompt = no
        default_md = sha256
        req_extensions = req_ext
        distinguished_name = dn

        [ dn ]
        C = <country>
        ST = <state>
        L = <city>
        O = <organization>
        OU = <organization unit>
        CN = <MASTER_IP>

        [ req_ext ]
        subjectAltName = @alt_names

        [ alt_names ]
        DNS.1 = kubernetes
        DNS.2 = kubernetes.default
        DNS.3 = kubernetes.default.svc
        DNS.4 = kubernetes.default.svc.cluster
        DNS.5 = kubernetes.default.svc.cluster.local
        IP.1 = <MASTER_IP>
        IP.2 = <MASTER_CLUSTER_IP>

        [ v3_ext ]
        authorityKeyIdentifier=keyid,issuer:always
        basicConstraints=CA:FALSE
        keyUsage=keyEncipherment,dataEncipherment
        extendedKeyUsage=serverAuth,clientAuth
        subjectAltName=@alt_names
1. Hasilkan permintaan penandatanganan sertifikat berdasarkan _file_ konfigurasi:

        openssl req -new -key server.key -out server.csr -config csr.conf
1. Hasilkan sertifikat _server_ menggunakan ca.key, ca.crt dan server.csr:

        openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key \
        -CAcreateserial -out server.crt -days 10000 \
        -extensions v3_ext -extfile csr.conf -sha256
1. Lihat sertifikat:

        openssl x509  -noout -text -in ./server.crt

Terakhir, tambahkan parameter yang sama ke dalam parameter mulai _server_ API.

### cfssl

**cfssl** adalah alat lain untuk pembuatan sertifikat.

1.  Unduh, buka paket dan siapkan _command line tools_ seperti yang ditunjukkan di bawah ini.
    Perhatikan bahwa kamu mungkin perlu menyesuaikan contoh perintah berdasarkan arsitektur
    perangkat keras dan versi cfssl yang kamu gunakan.

        curl -L https://pkg.cfssl.org/R1.2/cfssl_linux-amd64 -o cfssl
        chmod +x cfssl
        curl -L https://pkg.cfssl.org/R1.2/cfssljson_linux-amd64 -o cfssljson
        chmod +x cfssljson
        curl -L https://pkg.cfssl.org/R1.2/cfssl-certinfo_linux-amd64 -o cfssl-certinfo
        chmod +x cfssl-certinfo
1.  Buat direktori untuk menyimpan _artifacts_ dan inisialisasi cfssl:

        mkdir cert
        cd cert
        ../cfssl print-defaults config > config.json
        ../cfssl print-defaults csr > csr.json
1.  Buat _file_ konfigurasi JSON untuk menghasilkan _file_ CA, misalnya, `ca-config.json`:

        {
          "signing": {
            "default": {
              "expiry": "8760h"
            },
            "profiles": {
              "kubernetes": {
                "usages": [
                  "signing",
                  "key encipherment",
                  "server auth",
                  "client auth"
                ],
                "expiry": "8760h"
              }
            }
          }
        }
1.  Buat _file_ konfigurasi JSON untuk CA _certificate signing request_ (CSR), misalnya,
    `ca-csr.json`. Pastikan untuk mengganti nilai yang ditandai dengan kurung sudut
    dengan nilai sebenarnya yang ingin kamu gunakan.

        {
          "CN": "kubernetes",
          "key": {
            "algo": "rsa",
            "size": 2048
          },
          "names":[{
            "C": "<country>",
            "ST": "<state>",
            "L": "<city>",
            "O": "<organization>",
            "OU": "<organization unit>"
          }]
        }
1.  Hasilkan kunci CA (`ca-key.pem`) dan sertifikat (`ca.pem`):

        ../cfssl gencert -initca ca-csr.json | ../cfssljson -bare ca
1.  Buat _file_ konfigurasi JSON untuk menghasilkan kunci dan sertifikat untuk API
    _server_, misalnya, `server-csr.json`. Pastikan untuk mengganti nilai dalam kurung sudut
    dengan nilai sebenarnya yang ingin kamu gunakan. `MASTER_CLUSTER_IP` adalah layanan
    klaster IP untuk _server_ API seperti yang dijelaskan dalam subbagian sebelumnya.
    Sampel di bawah ini juga mengasumsikan bahwa kamu menggunakan `cluster.local` sebagai
    nama _domain_ DNS _default_.

        {
          "CN": "kubernetes",
          "hosts": [
            "127.0.0.1",
            "<MASTER_IP>",
            "<MASTER_CLUSTER_IP>",
            "kubernetes",
            "kubernetes.default",
            "kubernetes.default.svc",
            "kubernetes.default.svc.cluster",
            "kubernetes.default.svc.cluster.local"
          ],
          "key": {
            "algo": "rsa",
            "size": 2048
          },
          "names": [{
            "C": "<country>",
            "ST": "<state>",
            "L": "<city>",
            "O": "<organization>",
            "OU": "<organization unit>"
          }]
        }
1.  Buat kunci dan sertifikat untuk server API, yang mana awalnya di
    simpan masing-masing ke dalam _file_ `server-key.pem` dan `server.pem`:

        ../cfssl gencert -ca=ca.pem -ca-key=ca-key.pem \
        --config=ca-config.json -profile=kubernetes \
        server-csr.json | ../cfssljson -bare server


## Distribusi Sertifikat _Self-Signed_ CA

_Node_ klien dapat menolak untuk mengakui sertifikat CA yang ditandatangani sendiri sebagai valid.
Untuk _deployment_ non-produksi, atau untuk _deployment_ yang berjalan di belakang _firewall_ perusahaan,
kamu dapat mendistribusikan sertifikat CA yang ditandatangani sendiri untuk semua klien dan _refresh_
daftar lokal untuk sertifikat yang valid.

Pada setiap klien, lakukan operasi berikut:

```bash
sudo cp ca.crt /usr/local/share/ca-certificates/kubernetes.crt
sudo update-ca-certificates
```

```
Updating certificates in /etc/ssl/certs...
1 added, 0 removed; done.
Running hooks in /etc/ca-certificates/update.d....
done.
```

## Sertifikat API

Kamu dapat menggunakan API `Certificate.k8s.io` untuk menyediakan
sertifikat x509 yang digunakan untuk autentikasi seperti yang didokumentasikan
[di sini](/id/docs/tasks/tls/managing-tls-in-a-cluster).


