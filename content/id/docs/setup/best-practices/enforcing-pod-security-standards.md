---
title: Memberlakukan Standar Keamanan Pod
weight: 40
---

<!-- overview -->

Laman ini memberikan sebuah gambaran umum tentang cara memberlakukan [Standar Keamanan Pod](/docs/concepts/security/pod-security-standards).

<!-- body -->

## Menggunakan Kontroler *Pod Security Admission* Bawaan

{{< feature-state for_k8s_version="v1.25" state="stable" >}}


[Kontroler *Pod Security Admission*](/docs/reference/access-authn-authz/admission-controllers/#podsecurity) bermaksud untuk menggantikan *PodSecurityPolicies* yang sudah tidak berlaku lagi (*deprecated*).

### Mengkonfigurasi semua Namespace di klaster

Namespace yang tidak memiliki konfigurasi apapun sebaiknya dianggap sebagai *gap* dalam model keamanan klaster kamu. Kami menyarankan agar mengambil waktu untuk menganalisis jenis-jenis beban kerja yang terjadi di setiap Namespace, dan dengan merujuk pada Standar Keamanan Pod, lalu tentukan tingkat yang sesuai pada setiap Namespace. Namespace yang tidak berlabel sebaiknya hanya menunjukkan bahwa Namespace tersebut belum dievaluasi.

Dalam skenario dimana semua beban kerja di semua Namespace memiliki persyaratan keamanan yang sama, Kami menyediakan sebuah [contoh](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/#applying-to-all-namespaces) yang mengilustrasikan bagaimana label *PodSecurity* dapat diterapkan secara massal.

### Mengikuti prinsip hak istimewa paling sedikit

Di dunia yang ideal, semua pod di semua Namespace akan memenuhi persyaratan dari kebijakan `terbatas` . Namun, hal ini tidak mungkin dan tidak praktis, karena beberapa beban kerja akan memerlukan hak istimewa lebih untuk alasan yang sah.

- Namespace memperbolehkan beban kerja yang  `memiliki hak istimewa` sebaiknya mendirikan dan memberlakukan kontrol akses yang sesuai.
- Untuk beban kerja yang berjalan di Namespace permisif, jagalah keunikan persyaratan keamanan dokumentasi tersebut. Jika memungkinkan, pertimbangkan bagaimana persyaratan tersebut dapat dibatasi lebih lanjut.

### Mengadopsi strategi multi mode

Mode `audit` dan `warn` pada kontroler *Pod Security Admission* memudahkan pengumpulan wawasan keamanan penting tentang pod tanpa mengganggu beban kerja yang sudah ada. 

Merupakan praktik yang baik untuk mengaktifkan mode-mode ini untuk semua Namespace, dan mengaturnya ke tingkat yang *diinginkan* dan versi yang akan kamu `enforce`. Notasi peringatan dan audit yang dihasilkan di fase ini bisa memandu kamu menuju keadaan yang diinginkan. Jika kamu mengharapkan pembuat beban kerja akan membuat perubahan untuk memenuhi tingkat yang diinginkan, maka aktifkan mode `warn`. Jika kamu berharap akan menggunakan log audit untuk memantau/mendorong perubahan untuk memenuhi tingkat yang diinginkan, maka aktifkan mode `audit`.

Ketika kamu memiliki mode `enforce` dipasang ke tingkat yang kamu inginkan, mode-mode ini masih dapat berguna dalam beberapa cara berbeda:

- Dengan menetapkan `warn` ke tingkat yang sama dengan `enforce`, maka klien akan menerima peringatan ketika mencoba membuat Pod-pod (atau sumber daya yang memiliki template Pod) yang tidak memenuhi validasi. Hal ini akan membantu mereka memperbarui sumber daya tersebut untuk menjadi patuh.
- Dalam Namespace yang menyematkan `enforce` ke spesifik versi yang tidak terbaru, menetapkan mode `audit` dan `warn` ke tingkat yang sama dengan `enforce`, tetapi ke versi `terakhir` akan memberikan visibilitas tentang pengaturan yang diperbolehkan oleh versi-versi sebelumnya namun tidak diperbolehkan per praktik terbaik saat ini.

## Alternatif Pihak Ketiga

{{% thirdparty-content %}}

Alternatif pihak ketiga untuk memberlakukan profil keamanan yang dibuat di ekosistem Kubernetes:

- [Kubewarden](https://github.com/kubewarden).
- [Kyverno](https://kyverno.io/policies/).
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper).

Keputusan untuk menggunakan solusi bawaan (misalnya Kontroler *PodSecurity Admission* ) dengan alat pihak ketiga sepenuhnya bergantung pada situasimu. Ketika mengevaluasi solusi apapun, kepercayaanmu terhadap rantai pasokmu adalah yang terpenting. Pada akhirnya, menggunakan *salah satu* dari pendekatan yang disebutkan akan lebih baik dari tidak menggunakan apapun.