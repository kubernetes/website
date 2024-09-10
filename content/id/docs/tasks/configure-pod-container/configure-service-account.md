---
title: Mengatur ServiceAccount untuk Pod
content_type: task
weight: 90
---

<!-- overview -->
ServiceAccount menyediakan identitas untuk proses yang sedang berjalan dalam sebuah Pod.

{{< note >}}
Dokumen ini digunakan sebagai pengenalan untuk pengguna terhadap ServiceAccount dan menjelaskan bagaimana perilaku ServiceAccount dalam konfigurasi klaster seperti yang direkomendasikan Kubernetes. Pengubahan perilaku yang bisa saja dilakukan administrator klaster terhadap klaster tidak menjadi bagian pembahasan dokumentasi ini.
{{< /note >}}

Ketika kamu mengakses klaster (contohnya menggunakan `kubectl`), kamu terautentikasi oleh apiserver sebagai sebuah akun pengguna (untuk sekarang umumnya sebagai `admin`, kecuali jika administrator klustermu telah melakukan pengubahan). Berbagai proses yang ada di dalam kontainer dalam Pod juga dapat mengontak apiserver. Ketika itu terjadi, mereka akan diautentikasi sebagai sebuah ServiceAccount (contohnya sebagai `default`).




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Menggunakan Default ServiceAccount untuk Mengakses API server.

Ketika kamu membuat sebuah Pod, jika kamu tidak menentukan sebuah ServiceAccount, maka ia akan otomatis ditetapkan sebagai ServiceAccount`default` di Namespace yang sama. Jika kamu mendapatkan json atau yaml mentah untuk sebuah Pod yang telah kamu buat (contohnya menggunakan `kubectl get pods/<podname> -o yaml`), kamu akan melihat _field_ `spec.serviceAccountName` yang telah secara [otomatis ditentukan](/docs/user-guide/working-with-resources/#resources-are-automatically-modified).

Kamu dapat mengakses API dari dalam Pod menggunakan kredensial ServiceAccount yang ditambahkan secara otomatis seperti yang dijelaskan dalam [Mengakses Klaster](/docs/user-guide/accessing-the-cluster/#accessing-the-api-from-a-pod).
Hak akses API dari ServiceAccount menyesuaikan dengan [kebijakan dan plugin otorisasi](/docs/reference/access-authn-authz/authorization/#authorization-modules) yang sedang digunakan.

Di versi 1.6+, kamu dapat tidak memilih _automounting_ kredensial API dari sebuah ServiceAccount dengan mengatur `automountServiceAccountToken: false` pada ServiceAccount:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot
automountServiceAccountToken: false
...
```

Di versi 1.6+, kamu juga dapat tidak memilih _automounting_ kredensial API dari suatu Pod tertentu:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  serviceAccountName: build-robot
  automountServiceAccountToken: false
  ...
```

Pengaturan dari spesifikasi Pod didahulukan dibanding ServiceAccount jika keduanya menentukan nilai dari `automountServiceAccountToken`.

## Menggunakan Beberapa ServiceAccount.

Setiap Namespace memiliki sumber daya ServiceAccount standar `default`.
Kamu dapat melihatnya dan sumber daya serviceAccount lainnya di Namespace tersebut dengan perintah:

```shell
kubectl get serviceaccounts
```
Keluarannya akan serupa dengan:

```
NAME      SECRETS    AGE
default   1          1d
```

Kamu dapat membuat objek ServiceAccount tambahan seperti ini:

```shell
kubectl apply -f - <<EOF
apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot
EOF
```

Nama dari objek ServiceAccount haruslah sebuah [nama subdomain DNS](/id/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) yang valid.

Jika kamu mendapatkan objek ServiceAccount secara komplit, seperti ini:

```shell
kubectl get serviceaccounts/build-robot -o yaml
```
Keluarannya akan serupa dengan:

```
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2015-06-16T00:12:59Z
  name: build-robot
  namespace: default
  resourceVersion: "272500"
  uid: 721ab723-13bc-11e5-aec2-42010af0021e
secrets:
- name: build-robot-token-bvbk5
```

maka kamu dapat melihat bahwa _token_ telah dibuat secara otomatis dan dirujuk oleh ServiceAccount.

Kamu dapat menggunakan _plugin_ otorisasi untuk [mengatur hak akses dari ServiceAccount](/id/docs/reference/access-authn-authz/rbac/#service-account-permissions).

Untuk menggunakan ServiceAccount selain nilai standar, atur _field_ `spec.serviceAccountName` dari Pod menjadi nama dari ServiceAccount yang hendak kamu gunakan.

_Service account_ harus ada ketika Pod dibuat, jika tidak maka akan ditolak.

Kamu tidak dapat memperbarui ServiceAccount dari Pod yang telah dibuat.

Kamu dapat menghapus ServiceAccount dari contoh seperti ini:

```shell
kubectl delete serviceaccount/build-robot
```

## Membuat token API ServiceAccount secara manual.

Asumsikan kita memiliki ServiceAccount dengan nama "build-robot" seperti yang disebukan di atas, dan kita membuat Secret secara manual.

```shell
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: build-robot-secret
  annotations:
    kubernetes.io/service-account.name: build-robot
type: kubernetes.io/service-account-token
EOF
```

Sekarang kamu dapat mengonfirmasi bahwa Secret yang baru saja dibuat diisi dengan _token_ API dari ServiceAccount "build-robot".

Setiap _token_ dari ServiceAccount yang tidak ada akan dihapus oleh _token controller_.

```shell
kubectl describe secrets/build-robot-secret
```
Keluarannya akan serupa dengan:

```
Name:           build-robot-secret
Namespace:      default
Labels:         <none>
Annotations:    kubernetes.io/service-account.name: build-robot
                kubernetes.io/service-account.uid: da68f9c6-9d26-11e7-b84e-002dc52800da

Type:   kubernetes.io/service-account-token

Data
====
ca.crt:         1338 bytes
namespace:      7 bytes
token:          ...
```

{{< note >}}
Isi dari `token` tidak dirinci di sini.
{{< /note >}}

## Menambahkan ImagePullSecret ke ServiceAccount.

### Membuat imagePullSecret

- Membuat sebuah imagePullSecret, seperti yang dijelaskan pada [Menentukan ImagePullSecret pada Pod](/id/docs/concepts/containers/images/#tentukan-imagepullsecrets-pada-sebuah-pod).

    ```shell
    kubectl create secret docker-registry myregistrykey --docker-server=<registry name> \
            --docker-username=DUMMY_USERNAME --docker-password=DUMMY_DOCKER_PASSWORD \
            --docker-email=DUMMY_DOCKER_EMAIL
    ```

- Memastikan bahwa Secret telah terbuat.
   ```shell
   kubectl get secrets myregistrykey
   ```

    Keluarannya akan serupa dengan:

    ```
    NAME             TYPE                              DATA    AGE
    myregistrykey    kubernetes.io/.dockerconfigjson   1       1d
    ```

### Menambahkan imagePullSecret ke ServiceAccount

Selanjutnya, modifikasi ServiceAccount standar dari Namespace untuk menggunakan Secret ini sebagai imagePullSecret.


```shell
kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "myregistrykey"}]}'
```

Sebagai gantinya kamu dapat menggunakan `kubectl edit`, atau melakukan pengubahan secara manual manifes YAML seperti di bawah ini:

```shell
kubectl get serviceaccounts default -o yaml > ./sa.yaml
```

Keluaran dari berkas `sa.yaml` akan serupa dengan:

```shell
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2015-08-07T22:02:39Z
  name: default
  namespace: default
  resourceVersion: "243024"
  uid: 052fb0f4-3d50-11e5-b066-42010af0d7b6
secrets:
- name: default-token-uudge
```

Menggunakan _editor_ pilihanmu (misalnya `vi`), buka berkas `sa.yaml`, hapus baris dengan key `resourceVersion`, tambahkan baris dengan `imagePullSecrets:` dan simpan.

Keluaran dari berkas `sa.yaml` akan serupa dengan:

```shell
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2015-08-07T22:02:39Z
  name: default
  namespace: default
  uid: 052fb0f4-3d50-11e5-b066-42010af0d7b6
secrets:
- name: default-token-uudge
imagePullSecrets:
- name: myregistrykey
```

Terakhir ganti serviceaccount dengan berkas `sa.yaml` yang telah diperbarui.

```shell
kubectl replace serviceaccount default -f ./sa.yaml
```

### Memverifikasi imagePullSecrets sudah ditambahkan ke spesifikasi Pod

Ketika Pod baru dibuat dalam Namespace yang sedang aktif dan menggunakan ServiceAccount, Pod baru akan memiliki _field_ `spec.imagePullSecrets` yang ditentukan secara otomatis:

```shell
kubectl run nginx --image=<registry name>/nginx --restart=Never
kubectl get pod nginx -o=jsonpath='{.spec.imagePullSecrets[0].name}{"\n"}'
```

Keluarannya adalah:

```
myregistrykey
```

<!--## Menambahkan Secrets ke sebuah ServiceAccount.

TODO: Tes dan jelaskan bagaimana cara menambahkan Secret tambahan non-K8s dengan ServiceAccount yang sudah ada.
-->

## ServiceAccountTokenVolumeProjection

{{< feature-state for_k8s_version="v1.12" state="beta" >}}

{{< note >}}
ServiceAccountTokenVolumeProjection masih dalam tahap __beta__ untuk versi 1.12 dan diaktifkan dengan memberikan _flag_ berikut ini ke API server:

* `--service-account-issuer`
* `--service-account-signing-key-file`
* `--service-account-api-audiences`

{{< /note >}}

Kubelet juga dapat memproyeksikan _token_ ServiceAccount ke Pod. Kamu dapat menentukan properti yang diinginkan dari _token_ seperti target pengguna dan durasi validitas. Properti tersebut tidak dapat diubah pada _token_ ServiceAccount standar. _Token_ ServiceAccount juga akan menjadi tidak valid terhadap API ketika Pod atau ServiceAccount dihapus.

Perilaku ini diatur pada PodSpec menggunakan tipe ProjectedVolume yaitu [ServiceAccountToken](/id/docs/concepts/storage/volumes/#projected). Untuk memungkinkan Pod dengan _token_ dengan pengguna bertipe _"vault"_ dan durasi validitas selama dua jam, kamu harus mengubah bagian ini pada PodSpec:

{{% codenew file="pods/pod-projected-svc-token.yaml" %}}

Buat Pod:

```shell
kubectl create -f https://k8s.io/examples/pods/pod-projected-svc-token.yaml
```

_Token_ yang mewakili Pod akan diminta dan disimpan kubelet, lalu kubelet akan membuat _token_ yang dapat diakses oleh Pod pada _file path_ yang ditentukan, dan melakukan _refresh_ _token_ ketika telah mendekati waktu berakhir. _Token_ akan diganti oleh kubelet jika _token_ telah melewati 80% dari total TTL, atau jika _token_ telah melebihi waktu 24 jam.

Aplikasi bertanggung jawab untuk memuat ulang _token_ ketika terjadi penggantian. Pemuatan ulang teratur (misalnya sekali setiap 5 menit) cukup untuk mencakup kebanyakan kasus. 

## ServiceAccountIssuerDiscovery

{{< feature-state for_k8s_version="v1.18" state="alpha" >}}

Fitur ServiceAccountIssuerDiscovery diaktifkan dengan mengaktifkan [gerbang fitur](/docs/reference/command-line-tools-reference/feature-gate) `ServiceAccountIssuerDiscovery` dan mengaktifkan fitur _Service Account Token Volume Projection_ seperti yang telah dijelaskan [di atas](#service-account-token-volume-projection).

{{< note >}}
URL _issuer_ harus sesuai dengan _[OIDC Discovery Spec](https://openid.net/specs/openid-connect-discovery-1_0.html)_. Pada implementasinya, hal ini berarti URL harus menggunakan skema `https` dan harus menyediakan konfigurasi penyedia OpenID pada `{service-account-issuer}/.well-known/openid-configuration`.

Jika URL tidak sesuai dengan aturan, _endpoint_ `ServiceAccountIssuerDiscovery` tidak akan didaftarkan meskipun fitur telah diaktifkan.
{{< /note >}}

Fitur _Service Account Issuer Discovery_ memungkinkan federasi dari berbagai _token_ ServiceAccount Kubernetes yang dibuat oleh sebuah klaster (penyedia identitas) dan sistem eksternal.

Ketika diaktifkan, server API Kubernetes menyediakan dokumen OpenID Provider Configuration pada `/.well-known/openid-configuration` dan JSON Web Key Set (JWKS) terkait pada `/openid/v1/jwks`. OpenID Provider Configuration terkadang disebut juga dengan sebutan _discovery document_.

Ketika diaktifkan, klaster juga dikonfigurasi dengan RBAC ClusterRole standar yaitu `system:service-account-issuer-discovery`. _Role binding_ tidak disediakan secara _default_. Administrator dimungkinkan untuk, sebagai contoh, menentukan apakah peran akan disematkan ke `system:authenticated` atau `system:unauthenticated` tergantung terhadap kebutuhan keamanan dan sistem eksternal yang direncakanan untuk diintegrasikan.

{{< note >}}
Respons yang disediakan pada `/.well-known/openid-configuration` dan`/openid/v1/jwks` dirancang untuk kompatibel dengan OIDC, tetapi tidak sepenuhnya sesuai dengan ketentuan OIDC. Dokumen tersebut hanya berisi parameter yang dibutuhkan untuk melakukan validasi terhadap _token_ ServiceAccount Kubernetes.
{{< /note >}}

Respons JWKS memuat kunci publik yang dapat digunakan oleh sistem eksternal untuk melakukan validasi _token_ ServiceAccount Kubernetes. Awalnya sistem eksternal akan mengkueri OpenID Provider Configuration, dan selanjutnya dapat menggunakan _field_ `jwks_uri` pada respons kueri untuk mendapatkan JWKS.

Pada banyak kasus, server API Kubernetes tidak tersedia di internet publik, namun _endpoint_ publik yang menyediakan respons hasil _cache_ dari server API dapat dibuat menjadi tersedia oleh pengguna atau penyedia servis. Pada kasus ini, dimungkinkan untuk mengganti `jwks_uri` pada OpenID Provider Configuration untuk diarahkan ke _endpoint_ publik sebagai ganti alamat server API dengan memberikan _flag_ `--service-account-jwks-uri` ke API server. serupa dengan URL _issuer_, URI JWKS diharuskan untuk menggunakan skema `https`.


## {{% heading "whatsnext" %}}


Lihat juga:

- [Panduan Admin Kluster mengenai ServiceAccount](/docs/reference/access-authn-authz/service-accounts-admin/)
- [ServiceAccount Signing Key Retrieval KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/20190730-oidc-discovery.md)
- [OIDC Discovery Spec](https://openid.net/specs/openid-connect-discovery-1_0.html)


