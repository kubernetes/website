---
title: Label yang Disarankan
content_type: concept
---

<!-- overview -->
Kamu dapat melakukan visualisasi dan mengatur objek Kubernetes dengan lebih banyak _tools_ 
dibandingkan dengan perintah kubectl dan dasbor. Sekumpulan label mengizinkan _tools_ 
untuk bekerja dengan interoperabilitas, mendeskripsikan objek dengan cara yang umum yang dapat 
dipahami semua _tools_.

Sebagai tambahan bagi _tooling_ tambahan, label yang disarankan ini mendeskripsikan 
aplikasi sehingga informasi yang ada diapat di-_query_.


<!-- body -->
Metadata ini diorganisasi berbasis konsep dari sebuah  aplikasi. Kubernetes bukan merupakan 
sebuah platform sebagai sebuah _service_ (_platform as a service_/PaaS) dan tidak 
mewajibkan sebuah gagasan formal dari sebuah aplikasi.
Sebagai gantinya, aplikasi merupakan suatu hal informal yang dideskripsikan melalui metadata. 
Definisi yang dimiliki oleh sebuah aplikasi merupakan sebuah hal yang cukup longgar.

{{< note >}}
Berikut merupakan label yang disarankan. Label ini mempermudah 
proses manajemen aplikasi tetapi tidak dibutuhkan untuk _tooling_ utama apa pun.
{{< /note >}}

Label yang digunakan secara umum serta anotasi memiliki prefiks yang serupa: `app.kubernetes.io`. Label
tanpa sebuah prefiks bersifat privat khusus pengguna saja. Prefiks yang digunakan secara umum tadi
menjamin bahwa label tadi tidak akan mengganggu label _custom_ yang diberikan oleh pengguna.

## Label

Untuk mendapatkan keuntungan menyeluruh dari penggunaan label ini, 
label harus digunakan pada seluruh objek sumber daya.

| _Key_                               | Deskripsi             | Contoh   | Tipe |
| ----------------------------------- | --------------------- | -------- | ---- |
| `app.kubernetes.io/name`            | Nama aplikasi | `mysql` | string |
| `app.kubernetes.io/instance`        | Nama unik yang bersifat sebagai pengidentifikasi dari sebuah instans aplikasi | `wordpress-abcxzy` | string |
| `app.kubernetes.io/version`         | Versi saat ini dari aplikasi (misalnya sebuah versi semantik, hash revisi, etc.) | `5.7.21` | string |
| `app.kubernetes.io/component`       | Komponen yang ada pada arsitektur | `database` | string |
| `app.kubernetes.io/part-of`         | Nama dari komponen lebih tinggi dari aplikasi yang mencakup bagian ini | `wordpress` | string |
| `app.kubernetes.io/managed-by`  | Alat yang digunakan untuk mengatur operasi pada aplikasi | `helm` | string |

Untuk memberikan ilustrasi dari penggunaan label, bayangkan sebuah objek StatefulSet yang didefinisikan sebagai berikut:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: wordpress-abcxzy
    app.kubernetes.io/version: "5.7.21"
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
    app.kubernetes.io/managed-by: helm
```

## Aplikasi dan Instans Aplikasi

Sebuah aplikasi dapat diinstal sekali atau beberapa kali di dalam klaster Kubernetes dan, 
pada beberapa kasus, di dalam sebuah _namespace_ yang sama. Misalnya, wordpress dapat 
diinstal lebih dari satu kali dimana situs web yang berbeda merupakan hasil instalasi yang berbeda.

Nama dari sebuah aplikasi dan nama instans akan dicatat secara terpisah. Sebagai contoh,
WordPress memiliki `wordpress` sebagai nilai dari `app.kubernetes.io/name` dimana 
nama instans yang digunakan adalah `wordpress-abcxzy` yang merupakan nilai dari `app.kubernetes.io/instance`.
Hal ini memungkinkan aplikasi dan instans aplikasi untuk dapat diidentifikasi. Setiap instans dari aplikasi 
haruslah memiliki nama yang unik.

## Contoh

Untuk memberikan ilustrasi dengan cara yang berbeda pada penggunaan label, contoh di bawah ini 
memiliki tingkat kompleksitas yang cukup beragam.

### Sebuah Aplikasi _Stateless_ Sederhana

Bayangkan sebuah kasus dimana sebuah aplikasi _stateless_ di-_deploy_
menggunakan Deployment dan Service. Di bawah ini merupakan 
contoh kutipan yang merepresentasikan bagaimana 
label dapat digunakan secara sederhana.

Deployment digunakan untuk memastikan Pod dijalankan untuk aplikasi itu sendiri.
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxzy
...
```

Service digunakan untuk mengekspos aplikasi.
```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxzy
...
```

### Sebuah Aplikasi Web dengan Basis Data

Bayangkan sebuah aplikasi yang lebih kompleks: sebuah aplikasi web (WordPress)
yang menggunakan basis data (MySQL), yang diinstal menggunakan Helm. 
Kutipan berikut merepresentasikan objek yang di-_deploy_ untuk aplikasi ini.

Berikut merupakan konfigurasi Deployment yang digunakan untuk WordPress:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: wordpress
    app.kubernetes.io/instance: wordpress-abcxzy
    app.kubernetes.io/version: "4.9.4"
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: server
    app.kubernetes.io/part-of: wordpress
...
```

Service yang digunakan untuk mengekspos WordPress:

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: wordpress
    app.kubernetes.io/instance: wordpress-abcxzy
    app.kubernetes.io/version: "4.9.4"
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: server
    app.kubernetes.io/part-of: wordpress
...
```

MySQL diekspos sebagai StatefulSet dengan metadata yang digunakan untuk StatefulSet tersebut serta aplikasi yang menggunakannya:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: mysql-abcxzy
    app.kubernetes.io/version: "5.7.21"
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
...
```

Service yang digunakan untuk mengekspos MySQL sebagai bagian dari WordPress:

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: mysql-abcxzy
    app.kubernetes.io/version: "5.7.21"
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
...
```

Dengan StatefulSet MySQL dan Service kamu dapat mengetahui informasi yang ada pada MySQL dan Wordpress.


