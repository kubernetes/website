---
title: NetworkPolicy
content_template: templates/concept
weight: 50
---

{{< toc >}}

{{% capture overview %}}
Sebuah NetworkPolicy adalah spesifikasi dari sekelompok Pod atau _endpoint_ yang diizinkan untuk saling berkomunikasi.

`NetworkPolicy` menggunakan label untuk memilih Pod serta mendefinisikan serangkaian _rule_ yang digunakan 
untuk mendefinisikan trafik yang diizinkan untuk suatu Pod tertentu.

{{% /capture %}}

{{% capture body %}}
## Prasyarat

NetworkPolicy diimplementasikan dengan menggunakan _plugin_ jaringan, 
dengan demikian kamu harus memiliki penyedia jaringan yang mendukung `NetworkPolicy` - 
membuat _resource_ tanpa adanya _controller_ tidak akan berdampak apa pun. 

## Pod yang terisolasi dan tidak terisolasi

Secara _default_, Pod bersifat tidak terisolasi; Pod-Pod tersebut 
menerima trafik dari _resource_ apa pun.

Pod menjadi terisolasi apabila terdapat `NetworkPolicy` yang dikenakan pada Pod-Pod tersebut. 
Apabila terdapat `NetworkPolicy` di dalam _namespace_ yang dikenakan pada suatu Pod, Pod tersebut 
akan menolak koneksi yang tidak diizinkan `NetworkPolicy`. (Pod lain dalam _namespace_ 
yang tidak dikenakan `NetworkPolicy` akan tetap menerima trafik dari semua _resource_.)

## _Resource_ `NetworkPolicy`

Lihat [`NetworkPolicy`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#networkpolicy-v1-networking-k8s-io) untuk definisi lengkap _resource_.

Sebuah contoh `NetworkPolicy` akan terlihat seperti berikut:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: test-network-policy
  namespace: default
spec:
  podSelector:
    matchLabels:
      role: db
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - ipBlock:
        cidr: 172.17.0.0/16
        except:
        - 172.17.1.0/24
    - namespaceSelector:
        matchLabels:
          project: myproject
    - podSelector:
        matchLabels:
          role: frontend
    ports:
    - protocol: TCP
      port: 6379
  egress:
  - to:
    - ipBlock:
        cidr: 10.0.0.0/24
    ports:
    - protocol: TCP
      port: 5978
```

Mengirimkan ini ke API server dengan metode POST tidak akan berdampak apa pun 
kecuali penyedia jaringan mendukung network policy.

**_Field-field_ yang bersifat wajib**: Sama dengan seluruh _config_ Kubernetes lainnya, sebuah `NetworkPolicy`
membutuhkan _field-field_ `apiVersion`, `kind`, dan `metadata`.  Informasi generik mengenai 
bagaimana bekerja dengan _file_ `config`, dapat dilihat di 
[Konfigurasi Kontainer menggunakan `ConfigMap`](/docs/tasks/configure-pod-container/configure-pod-configmap/),
serta [Manajemen Objek](/docs/concepts/overview/object-management-kubectl/overview/).

**spec**: `NetworkPolicy` [spec](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#spec-and-status) memiliki semua informasi yang harus diberikan untuk memberikan definisi _network policy_ yang ada pada _namespace_ tertentu.

**podSelector**: Setiap `NetworkPolicy` memiliki sebuah `podSelector` yang bertugas memfilter Pod-Pod yang dikenai _policy_ tersebut. Contoh yang ada memfilter Pod dengan label `"role=db"`. Sebuah `podSelector` yang empty akan memilih semua Pod yang ada di dalam _namespace_.

**policyTypes**: Setiap `NetworkPolicy` memiliki sebuah daftar `policyTypes` yang dapat berupa `Ingress`, `Egress`, atau keduanya. _Field_ `policyTypes` mengindikasikan apakah suatu _policy_ diberikan pada trafik _ingress_, _egress_, atau camputan _ingress_ dan _egress_ pada Pod tertentu. Jika tidak ada `policyTypes` tyang diberikan pada `NetworkPolicy` maka `Ingress` _default_ akan diterapkan dan `Egress` akan diterapkan apabila _policy_ tersebut memberikan spesifikasi _egress_.

**ingress**: Setiap `NetworkPolicy` bisa saja memberikan serangkaian whitelist _rule-rule_ `ingress`. Setiap _rule_ mengizinkan trafik yang sesuai dengan _section_ `from` dan `ports`. Contoh _policy_ yang diberikan memiliki sebuah _rule_, yang sesuai dengan trafik pada sebuah `port` _single_, bagian pertama dispesifikasikan melalui `ipBlock`, yang kedua melalui `namespaceSelector` dan yang ketiga melalui `podSelector`.

**egress**: Setiap `NetworkPolicy` bisa saja meliputi serangkaian _whitelist_ _rule-rule_ `egress`.  Setiap _rule_ mengizinkan trafik yang sesuai dengan _section_ `to` dan `ports`. Contoh _policy_ yang diberikan memiliki sebuah _rule_, yang sesuai dengan `port` _single_ pada destinasi `10.0.0.0/24`.

Pada contoh, `NetworkPolicy` melakukan hal berikut:

1. Mengisolasi Pod-Pod dengan label `"role=db"` pada _namespace_ `"default"` baik untuk `ingress` atau `egress`.
2. (_Rule_ `Ingress`) mengizinkan koneksi ke semua Pod pada _namespace_ `“default”` dengan label `“role=db”` untuk protokol TCP `port` `6379` dari:

   * semua Pod pada _namespace_ `"default"` dengan label `"role=frontend"`
   * semua Pod dalam sebuah _namespace_ dengan label `"project=myproject"`
   * alamat IP pada _range_ `172.17.0.0–172.17.0.255` dan `172.17.2.0–172.17.255.255` (yaitu, semua `172.17.0.0/16` kecuali `172.17.1.0/24`)
3. (_Rule_ Egress) mengizinkan koneksi dari semua Pod pada _namespace_ `"default"` dengan label `"role=db"` ke CIDR `10.0.0.0/24` untuk protokol TCP pada `port` `5978`

Lihat mekanisme [Deklarasi _Network Policy_](/docs/tasks/administer-cluster/declare-network-policy/) untuk penjelasan lebih mendalam.

## Perilaku selektor `to` dan `from`

Terdapat empat jenis selektor yang dapat dispesifikasikan dalam `section` `ingress` `from` atau `section` `egress` `to`:

**podSelector**: Ini digunakan untuk memfilter Pod tertentu pada _namespace_ dimana `NetworkPolicy` berada yang akan mengatur destinasi  _ingress_ atau _egress_.

**namespaceSelector**: Ini digunakan untuk memfilter _namespace_ tertentu dimana semua Pod diperbolehkan sebagai _source_ `ingress` atau destinasi `egress`.

**namespaceSelector** *and* **podSelector**: Sebuah entri `to`/`from` yang memberikan spesifikasi `namespaceSelector` dan `podSelector` serta memilih Pod-Pod tertentu yang ada di dalam _namespace_. Pastikan kamu menggunakan sintaks YAML yang tepat; `policy` ini:

```yaml
  ...
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          user: alice
      podSelector:
        matchLabels:
          role: client
  ...
```

mengandung sebuah elemen `from` yang mengizinkan koneksi dari Pod-Pod dengan label `role=client` di _namespace_ dengan label `user=alice`. Akan tetapi, _policy_ *ini*:

```yaml
  ...
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          user: alice
    - podSelector:
        matchLabels:
          role: client
  ...
```

mengandung dua elemen pada _array_ `from`, dan mengizinkan koneksi dari Pod pada Namespace lokal dengan label 
`role=client`, *atau* dari Pod di _namespace_ apa pun dengan label `user=alice`.

Ketika kamu merasa ragu, gunakan `kubectl describe` untuk melihat bagaimana Kubernetes 
menginterpretasikan _policy_ tersebut.

**ipBlock**: Ini digunakan untuk memilih _range_ IP CIDR tertentu untuk berperan sebagai 
_source_ _ingress_ atau destinasi _egress_. Alamat yang digunakan harus merupakan 
alamat IP eksternal kluster, karena alamat IP Pod bersifat _ephemeral_ dan tidak dapat ditebak. 

Mekanisme _ingress_ dan _egress_ kluster seringkali membutuhkan mekanisme _rewrite_ alamat IP _source_ dan destinasi 
paket. Pada kasus-kasus dimana hal ini, tidak dapat dipastikan bahwa apakah hal ini 
 terjadi sebelum atau setelah pemrosesan `NetworkPolicy`, dan perilaku yang ada mungkin saja berbeda 
 untuk kombinasi _plugin_ jaringan, penyedia layanan _cloud_, serta implementasi `Service` yang berbeda. 

Pada _ingress_, artinya bisa saja kamu melakukan _filter_ paket yang masuk berdasarkan `source IP`, 
sementara di kasus lain "source IP" yang digunakan oleh Network Policy adalah alamat IP `LoadBalancer`, 
_node_ dimana Pod berada, dsb.

Pada _egress_, bisa saja sebuah koneksi dari Pod ke IP `Service` di-_rewrite_ ke IP eksternal kluster 
atau bahkan tidak termasuk di dalam `ipBlock` _policy_.

## _Policy_ _Default_

Secara _default_, jika tidak ada _policy_ yang ada dalam suatu _namespace_, maka semua trafik _ingress_ dan _egress_ yang diizinkan ke atau dari Pod dalam _namespace_. 
Contoh di bawah ini akan memberikan gambaran bagaimana kamu dapat mengubah perilaku _default_ pada sebuah _namespace_.

### _Default_: tolak semua trafik _ingress_

Kamu dapat membuat _policy_ isolasi `"default"` untuk sebuah _namespace_ 
dengan membuat sebuah `NetworkPolicy` yang memilih semua Pod tapi tidak mengizinkan 
trafik _ingress_ masuk ke Pod-Pod tersebut.

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
spec:
  podSelector: {}
  policyTypes:
  - Ingress
```

Hal ini menjamin bahwa bahkan Pod yang tidak dipilih oleh `NetworkPolicy` lain masih terisolasi. 
_Policy_ ini tidak mengubah perilaku _default_ dari _egress_.

### _Default_: izinkan semua trafik _ingress_

Jika kamu ingin mengizinkan semua trafik _ingress_ pada semua Pod dalam sebuah _namespace_ 
(bahkan jika _policy_ ditambahkan dan menyebabkan beberapa Pod menjadi terisolasi), kamu 
dapat secara eksplisit mengizinkan semua trafik bagi _namespace_ tersebut.

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-all
spec:
  podSelector: {}
  ingress:
  - {}
  policyTypes:
  - Ingress
```

### _Default_: tolak semua trafik _egress_

Kamu dapat membuat _policy_ isolasi `"default"` untuk sebuah _namespace_ 
dengan membuat sebuah `NetworkPolicy` yang memilih semua Pod tapi tidak mengizinkan 
trafik _egress_ keluar dari Pod-Pod tersebut.

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
spec:
  podSelector: {}
  policyTypes:
  - Egress
```

Hal ini menjamin bahwa bahkan Pod yang tidak dipilih oleh `NetworkPolicy` lain masih terisolasi. 
_Policy_ ini tidak mengubah perilaku _default_ dari _ingress_.

### _Default_: izinkan semua trafik _egress_

Jika kamu ingin mengizinkan semua trafik _egress_ pada semua Pod dalam sebuah _namespace_ 
(bahkan jika _policy_ ditambahkan dan menyebabkan beberapa Pod menjadi terisolasi), kamu 
dapat secara eksplisit mengizinkan semua trafik bagi _namespace_ tersebut.

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-all
spec:
  podSelector: {}
  egress:
  - {}
  policyTypes:
  - Egress
```

### _Default_: tolak semua trafik _ingress_ dan _egress_

Kamu dapat membuat sebuah _policy_ _"default"_ jika kamu ingin menolak semua trafik _ingress_ maupun _egress_ pada semua Pod dalam sebuah _namespace_.

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
```

Hal ini menjamin bahwa bahkan Pod yang tidak dipilih oleh `NetworkPolicy` tidak akan mengizinkan trafik _ingress_ atau _egress_.

## Dukungan terhadap SCTP

{{< feature-state for_k8s_version="v1.12" state="alpha" >}}

Kubernetes mendukung SCTP sebagai _value_ `protocol` pada definisi `NetworkPolicy` sebagai fitur alpha. Untuk mengaktifkan fitur ini, administrator kluster harus mengaktifkan gerbang fitur `SCTPSupport` pada `apiserver`, contohnya `“--feature-gates=SCTPSupport=true,...”`. Ketika gerbang fitur ini diaktifkan, pengguna dapat menerapkan `value` dari _field_ `protocol` pada `NetworkPolicy` menjadi `SCTP`. Kubernetes akan mengatur jaringan sesuai dengan SCTP, seperti halnya koneksi TCP.

_Plugin_ CNI harus mendukung SCTP sebagai _value_ dari `protocol` pada `NetworkPolicy`.


{{% /capture %}}

{{% capture whatsnext %}}

- Lihat [Deklarasi _Network Policy_](/docs/tasks/administer-cluster/declare-network-policy/) untuk melihat lebih banyak contoh penggunaan.
- Baca lebih lanjut soal [panduan](https://github.com/ahmetb/kubernetes-network-policy-recipes) bagi skenario generik _resource_ `NetworkPolicy`.

{{% /capture %}}
