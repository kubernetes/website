---
title: Anotasi
content_template: templates/concept
weight: 50
---

{{% capture overview %}}
Kamu dapat menggunakan fitur anotasi dari Kubernetes untuk menempelkan sembarang
metadata tanpa identitas pada suatu objek. Klien, seperti perangkat dan *library*,
dapat memperoleh metadata tersebut.
{{% /capture %}}

{{% capture body %}}
## Mengaitkan metadata pada objek

Kamu dapat menggunakan label maupun anotasi untuk menempelkan metadata pada suatu
objek Kubernetes. Label dapat digunakan untuk memilih objek dan mencari sekumpulan
objek yang memenuhi kondisi tertentu. Sebaliknya, anotasi tidak digunakan untuk
mengenali atau memilih objek. Metadata dalam sebuah anotasi bisa berukuran kecil atau besar,
terstruktur atau tidak terstruktur, dan dapat berisikan karakter-karakter yang tidak
diperbolehkan oleh label.

Anotasi, seperti label, merupakan pemetaan *key/value*:

```json
"metadata": {
  "annotations": {
    "key1" : "value1",
    "key2" : "value2"
  }
}
```

Berikut merupakan beberapa contoh informasi yang dapat dicatat dengan menggunakan anotasi:

* *Field-field* yang dikelola secara deklaratif oleh *layer* konfigurasi. Menempelkan
  *field-field* tersebut sebagai anotasi membedakan mereka dari nilai *default* yang
  ditetapkan oleh klien ataupun server, dari *field-field* yang otomatis di-*generate*, serta
  dari *field-field* yang ditetapkan oleh sistem *auto-sizing* atau *auto-scaling*.

* Informasi mengenai *build*, rilis, atau *image*, seperti *timestamp*, rilis ID, git *branch*,
  nomor PR, *hash* suatu *image*, dan alamat registri.

* Penanda untuk *logging*, *monitoring*, *analytics*, ataupun repositori audit.

* Informasi mengenai *library* klien atau perangkat yang dapat digunakan untuk *debugging*:
  misalnya, informasi nama, versi, dan *build*.

* Informasi yang berhubungan dengan pengguna atau perangkat/sistem, seperti URL objek yang terkait
  dengan komponen dari ekosistem lain.

* Metadata untuk perangkat *rollout* yang ringan (*lightweight*): contohnya, untuk 
  konfigurasi atau penanda (*checkpoint*).

* Nomor telepon atau *pager* dari orang yang bertanggung jawab, atau entri direktori
  yang berisi informasi lebih lanjut, seperti *website* sebuah tim.

* Arahan dari pengguna (*end-user*) untuk melakukan implementasi, perubahan perilaku, 
  ataupun untuk interaksi dengan fitur-fitur non-standar.

Tanpa menggunakan anotasi, kamu dapat saja menyimpan informasi-informasi dengan tipe
di atas pada suatu basis data atau direktori eksternal, namun hal ini sangat mempersulit
pembuatan *library* klien dan perangkat yang bisa digunakan sama-sama (*shared*) untuk melakukan
*deploy*, pengelolaan, introspeksi, dan semacamnya.

## Sintaksis dan sekumpulan karakter

Anotasi merupakan *key/value pair*. *Key* dari sebuah anotasi yang valid memiliki dua segmen: segmen prefiks yang opsional dan segmen nama, dipisahkan
oleh sebuah garis miring (`/`). Segmen nama bersifat wajib dan harus terdiri dari 63 karakter atau kurang, dimulai dan diakhiri dengan karakter alfanumerik (`[a-z0-9A-Z]`) dengan tanda minus (`-`), garis bawah (`_`), titik (`.`), dan alfanumerik di tengahnya. Jika terdapat prefiks,
prefiks haruslah berupa subdomain DNS: urutan dari label DNS yang dipisahkan oleh titik (`.`), totalnya tidak melebihi 253 karakter,
diikuti dengan garis miring (`/`).

Jika tidak terdapat prefiks, maka *key* dari anotasi diasumsikan hanya bisa dilihat oleh pengguna (privat). Komponen sistem otomasi
(seperti `kube-scheduler`, `kube-controller-manager`, `kube-apiserver`, `kubectl`, ataupun otomasi pihak ketiga) yang menambahkan anotasi
pada objek-objek pengguna harus memiliki sebuah prefiks.

Prefiks `kubernetes.io/` dan `k8s.io/` merupakan reservasi dari komponen inti Kubernetes.

{{% /capture %}}

{{% capture whatsnext %}}
Pelajari lebih lanjut tentang [Label dan Selektor](/docs/concepts/overview/working-with-objects/labels/).
{{% /capture %}}
