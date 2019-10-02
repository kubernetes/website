---
title: CronJob
content_template: templates/concept
weight: 80
---

{{% capture overview %}}

Suatu CronJob menciptakan [Job](/docs/concepts/workloads/controllers/jobs-run-to-completion/) yang dijadwalkan berdasarkan waktu tertentu.

Satu objek CronJob sepadan dengan satu baris pada _file_ _crontab_ (_cron table_). CronJob tersebut menjalankan suatu pekerjaan secara berkala
pada waktu tertentu, dituliskan dalam format [Cron](https://en.wikipedia.org/wiki/Cron).

{{< note >}}
Seluruh waktu `schedule:` pada _**CronJob**_ mengikuti zona waktu dari _master_ di mana Job diinisiasi.
{{< /note >}}

Untuk panduan dalam berkreasi dengan _cron job_, dan contoh _spec file_ untuk suatu _cron job_, lihat [Menjalankan otomasi _task_ dengan _cron job_](/docs/tasks/job/automated-tasks-with-cron-jobs).

{{% /capture %}}


{{% capture body %}}

## Limitasi _Cron Job_

Suatu _cron job_ menciptakan _kurang lebih_ satu objek Job setiap penjadwalan. Istilah yang digunakan adalah "_kurang lebih_" karena
terdapat beberapa kasus yang menyebabkan dua Job terbuat, atau tidak ada Job sama sekali yang terbuat. Kemungkinan-kemungkinan
seperti itu memang diusahakan untuk tidak sering terjadi, tapi tidak ada jaminan kemungkinan-kemungkinan tersebut tidak akan pernah terjadi.
Oleh karena itu, Job sudah sepantasnya memiliki sifat idempoten.

Jika pengaturan `startingDeadlineSeconds` menggunakan nilai yang besar atau tidak diatur (menggunakan nilai _default_)
dan jika pengaturan `concurrencyPolicy` dijadikan `Allow`, Job yang terbuat akan dijalankan paling tidak satu kali.

CronJob _controller_ memeriksa berapa banyak jadwal yang terlewatkan sejak waktu terakhir eksekusi hingga saat ini. Jika terdapat lebih dari 100 jadwal yang terlewat, maka CronJob _controller_ tidak memulai Job dan mencatat kesalahan:

````
Cannot determine if job needs to be started. Too many missed start time (> 100). Set or decrease .spec.startingDeadlineSeconds or check clock skew.
````

Perlu diingat bahwa jika pengaturan `startingDeadlineSeconds` memiliki suatu nilai (bukan `nil`), CronJob _controller_ akan menghitung berapa banyak Job yang terlewatkan dari sejak `startingDeadlineSeconds` hingga sekarang dan bukan sejak waktu terakhir eksekusi. Misalnya: Jika `startingDeadlineSeconds` memiliki nilai `200`, CronJob _controller_ akan menghitung berapa banyak Job yang terlewatkan dalam 200 detik terakhir.

Suatu CronJob dianggap terlewat jika ia gagal diciptakan pada waktu yang semestinya. Misalnya: Jika pengaturan `concurrencyPolicy` dijadikan `Forbid`
dan suatu CronJob dicoba dijadwalkan saat masih ada penjadwalan sebelumnya yang masih berjalan, maka ia akan dianggap terlewat.

Contoh: Suatu CronJob akan menjadwalkan Job baru tiap satu menit dimulai sejak `08:30:00`, dan `startingDeadlineSeconds` tidak diatur.
Jika CronJob _controller_ tidak aktif dari `08:29:00` sampai `10:21:00`, Job tidak akan dijalankan karena jumlah Job yang terlewat
sudah lebih dari 100.

Sebagai ilustrasi lebih lanjut, misalkan suatu CronJob diatur untuk menjadwalkan Job baru setiap satu menit dimulai sejak `08:30:00`,
dan `startingDeadlineSeconds` memiliki nilai `200`. Jika CronJob _controller_ tidak aktif seperti pada contoh sebelumnya (`08:29:00` sampai `10:21:00`),
Job akan tetap dijalankan pada 10:22:00. Hal ini terjadi karena CronJob _controller_ memeriksa banyaknya jadwal yang terlewatkan pada 200 detik terakhir
(dalam kasus ini: 3 jadwal terlewat), dan bukan dari sejak waktu eksekusi terakhir.

CronJob hanya bertanggung-jawab untuk menciptakan Job yang sesuai dengan jadwalnya sendiri,
dan Job tersebut bertanggung jawab terhadap pengelolaan Pod yang direpresentasikan olehnya.

{{% /capture %}}