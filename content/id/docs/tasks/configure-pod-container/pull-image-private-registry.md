---
title: Menarik Image dari Register Pribadi
content_type: task
weight: 100
---

<!-- overview -->

Laman ini menunjukkan cara membuat Pod dengan menggunakan Secret untuk menarik _image_ dari sebuah
register atau repositori pribadi untuk Docker.


## {{% heading "prerequisites" %}}


* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* Untuk melakukan latihan ini, kamu memerlukan sebuah
[nama pengguna (ID) Docker](https://docs.docker.com/docker-id/) dan kata sandi (_password_).


<!-- steps -->

## Masuk (_login_) ke Docker {#masuk-ke-docker}

Pada laptop kamu, kamu harus melakukan autentikasi dengan register untuk menarik _image_ pribadi:

```shell
docker login
```

Ketika diminta, masukkan nama pengguna dan kata sandi Docker kamu.

Proses _login_ membuat atau memperbarui berkas `config.json` yang menyimpan sebuah _token_ otorisasi.

Lihatlah berkas `config.json`:


```shell
cat ~/.docker/config.json
```

Keluaran berisi bagian yang serupa dengan ini:

```json
{
    "auths": {
        "https://index.docker.io/v1/": {
            "auth": "c3R...zE2"
        }
    }
}
```

{{< note >}}
Jika kamu menggunakan tempat penyimpanan kredensial (_credential_) untuk Docker, maka kamu tidak akan melihat entri `auth` tetapi entri `credsStore` dengan nama tempat penyimpanan sebagai nilainya.
{{< /note >}}

## Membuat Secret berdasarkan kredensial Docker yang sudah ada {#register-secret-kredensial-yang-ada}

Klaster Kubernetes menggunakan Secret dari tipe `docker-registry` untuk melakukan autentikasi dengan
register Container untuk menarik _image_ pribadi.

Jika kamu sudah menjalankan `docker login`, kamu dapat menyalin kredensial itu ke Kubernetes:

```shell
kubectl create secret generic regcred \
    --from-file=.dockerconfigjson=<path/to/.docker/config.json> \
    --type=kubernetes.io/dockerconfigjson
```

Jika kamu memerlukan lebih banyak kontrol (misalnya, untuk mengatur Namespace atau label baru pada Secret) 
maka kamu dapat menyesuaikan Secret tersebut sebelum menyimpannya.
Pastikan untuk:


- Mengatur nama dari pokok (_item_) data menjadi `.dockerconfigjson`
- Melakukan enkode secara _base64_ dari Dockerfile (berkas Docker) dan memindahkan urutan huruf (_string_) tersebut, secara tidak terputus sebagai nilai untuk bidang `data[".dockerconfigjson"]`
- Mengatur `type` menjadi `kubernetes.io/dockerconfigjson`

Sebagai contoh:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: myregistrykey
  namespace: awesomeapps
data:
  .dockerconfigjson: UmVhbGx5IHJlYWxseSByZWVlZWVlZWVlZWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGx5eXl5eXl5eXl5eXl5eXl5eXl5eSBsbGxsbGxsbGxsbGxsbG9vb29vb29vb29vb29vb29vb29vb29vb29vb25ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubmdnZ2dnZ2dnZ2dnZ2dnZ2dnZ2cgYXV0aCBrZXlzCg==
type: kubernetes.io/dockerconfigjson
```

Jika kamu mendapat pesan kesalahan `error: no objects passed to create`, ini berarti pengkodean _base64_ dari urutan huruf tersebut tidak valid.
Jika kamu mendapat pesan kesalahan seperti `Secret "myregistrykey" is invalid: data[.dockerconfigjson]: invalid value ...`, ini berarti
enkode _base64_ dari urutan huruf dalam data tersebut sukses didekodekan, tetapi tidak bisa diuraikan menjadi berkas `.docker/config.json`.

## Membuat Secret dengan memberikan kredensial pada baris perintah

Buatlah Secret ini, dan berilah nama `regcred`:

```shell
kubectl create secret docker-registry regcred --docker-server=<your-registry-server> --docker-username=<your-name> --docker-password=<your-pword> --docker-email=<your-email>
```

dimana:

* `<your-registry-server>` merupakan FQDN dari register privat Docker kamu. (https://index.docker.io/v1/ untuk DockerHub)
* `<your-name>` adalah nama pengguna Docker kamu.
* `<your-pword>` adalah kata sandi Docker kamu.
* `<your-email>` adalah alamat email Docker kamu.

Kamu telah berhasil mengatur kredensial untuk Docker kamu pada klaster sebagai sebuah Secret yang dipanggil dengan nama `regcred`.

{{< note >}}

Mengetik Secret pada baris perintah dapat menyimpannya dalam riwayat (_history_) dari _shell_ kamu tanpa perlindungan, dan
Secret tersebut mungkin juga terlihat oleh pengguna lain dalam PC kamu selama perintah `kubectl` sedang berjalan.
{{< /note >}}


## Menginspeksi Secret `regcred` {#menginspeksi-secret-regcred}

Untuk memahami isi Secret `regcred` yang baru saja kamu buat, mulailah dengan melihat Secret dalam format YAML:

```shell
kubectl get secret regcred --output=yaml
```
Keluarannya akan seperti ini:

```yaml
apiVersion: v1
kind: Secret
metadata:
  ...
  name: regcred
  ...
data:
  .dockerconfigjson: eyJodHRwczovL2luZGV4L ... J0QUl6RTIifX0=
type: kubernetes.io/dockerconfigjson
```

Nilai dari bidang `.dockerconfigjson` merupakan representasi dalam _base64_ dari kredensial Docker kamu.

Untuk memahami apa yang ada dalam bidang `.dockerconfigjson`, ubahlah data Secret menjadi format yang bisa terbaca:

```shell
kubectl get secret regcred --output="jsonpath={.data.\.dockerconfigjson}" | base64 --decode
```

Keluarannya akan seperti ini:

```json
{"auths":{"your.private.registry.example.com":{"username":"janedoe","password":"xxxxxxxxxxx","email":"jdoe@example.com","auth":"c3R...zE2"}}}
```

Untuk memahami apa yang ada dalam bidang `auth`, ubahlah data Secret menjadi format yang bisa terbaca:

```shell
echo "c3R...zE2" | base64 --decode
```

Keluarannya, nama pengguna dan kata sandi yang digabungkan dengan tanda `:`, seperti dibawah ini:

```none
janedoe:xxxxxxxxxxx
```

Perhatikan bahwa data Secret berisi token otorisasi yang serupa dengan berkas `~/.docker/config.json` lokal kamu.

Kamu telah berhasil menetapkan kredensial Docker kamu sebagai sebuah Secret yang dipanggil dengan `regcred` pada klaster.


## Membuat Pod yang menggunakan Secret kamu


Berikut ini adalah berkas konfigurasi untuk Pod yang memerlukan akses ke kredensial Docker kamu pada `regcred`:

{{% codenew file="pods/private-reg-pod.yaml" %}}

Unduh berkas diatas:

```shell
wget -O my-private-reg-pod.yaml https://k8s.io/examples/pods/private-reg-pod.yaml
```

Dalam berkas `my-private-reg-pod.yaml`, ubah `<your-private-image>` dengan tautan ke _image_ dalam register pribadi seperti ini:

```none
your.private.registry.example.com/janedoe/jdoe-private:v1
```

Untuk menarik _image_ dari register pribadi, Kubernetes memerlukan kredensial.
Bidang `imagePullSecrets` dalam berkas konfigurasi menentukan bahwa Kubernetes harus mendapatkan kredensial dari Secret yang bernama `regcred`.

Buatlah Pod yang menggunakan Secret kamu, dan verifikasi bahwa Pod tersebut berjalan:

```shell
kubectl apply -f my-private-reg-pod.yaml
kubectl get pod private-reg
```


## {{% heading "whatsnext" %}}


* Pelajari lebih lanjut tentang [Secret](/id/docs/concepts/configuration/secret/).
* Pelajari lebih lanjut tentang [menggunakan register pribadi](/id/docs/concepts/containers/images/#menggunakan-register-privat).
* Pelajari lebih lanjut tentang [menambahkan Secret untuk menarik _image_ ke dalam sebuah akun service](/id/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account).
* Lihatlah [kubectl create secret docker-registry](/docs/reference/generated/kubectl/kubectl-commands/#-em-secret-docker-registry-em-).
* Lihatlah [Secret](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#secret-v1-core).
* Lihatlah bidang `imagePullSecrets` dari [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core).
