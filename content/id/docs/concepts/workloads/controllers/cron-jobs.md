---
reviewers:
- erictune
- soltysh
- janetkuo
title: CronJob
content_template: templates/concept
weight: 80
---

{{% capture overview %}}

Suatu _CronJob_ menciptakan [_Job_](/docs/concepts/workloads/controllers/jobs-run-to-completion/) yang dijadwalkan berdasarkan waktu tertentu.

Satu objek _CronJob_ sepadan dengan satu baris pada _file_ _crontab_ (_cron table_). _CronJob_ tersebut menjalankan suatu pekerjaan secara berkala
pada waktu tertentu, dituliskan dalam format [_Cron_](https://en.wikipedia.org/wiki/Cron).

{{< note >}}
Seluruh waktu `schedule:` pada _**CronJob**_ mengikuti zona waktu dari _master_ di mana _job_ diinisiasi.
{{< /note >}}

Untuk panduan dalam berkreasi dengan _cron job_, dan contoh _spec file_ untuk suatu _cron job_, lihat [Running automated tasks with cron jobs](/docs/tasks/job/automated-tasks-with-cron-jobs).

{{% /capture %}}


{{% capture body %}}

## Limitasi Cron Job

Suatu _cron job_ menciptakan _kurang lebih_ satu objek _job_ setiap penjadwalan. Istilah yang digunakan adalah "_kurang lebih_" karena
terdapat beberapa kasus yang menyebabkan dua _job_ terbuat, atau tidak ada _job_ sama sekali yang terbuat. Kemungkinan-kemungkinan
seperti itu memang diusahakan untuk tidak sering terjadi, tapi tidak ada jaminan kemungkinan-kemungkinan tersebut tidak akan pernah terjadi.
Oleh karena itu, _job_ sudah sepantasnya memiliki sifat idempoten.

Jika pengaturan `startingDeadlineSeconds` menggunakan nilai yang besar atau tidak diatur (menggunakan nilai _default_)
dan jika pengaturan `concurrencyPolicy` dijadikan `Allow`, _job_ yang terbuat akan dijalankan paling tidak satu kali.

_CronJob controller_ memeriksa berapa banyak jadwal yang terlewatkan sejak waktu terakhir eksekusi hingga saat ini. Jika terdapat lebih dari 100 jadwal yang terlewat, maka _CronJob controller_ tidak memulai _job_ dan mencatat kesalahan:

````
Cannot determine if job needs to be started. Too many missed start time (> 100). Set or decrease .spec.startingDeadlineSeconds or check clock skew.
````

Perlu diingat bahwa jika pengaturan `startingDeadlineSeconds` memiliki suatu nilai (bukan `nil`), _CronJob controller_ akan menghitung berapa banyak _job_ yang terlewatkan dari sejak `startingDeadlineSeconds` hingga sekarang dan bukan sejak waktu terakhir eksekusi. Misalnya: Jika `startingDeadlineSeconds` memiliki nilai `200`, _CronJob controller_ akan menghitung berapa banyak _job_ yang terlewatkan dalam 200 detik terakhir.

Suatu _CronJob_ dianggap terlewat jika ia gagal diciptakan pada waktu yang semestinya. Misalnya: Jika pengaturan `concurrencyPolicy` dijadikan `Forbid`
dan suatu _CronJob_ dicoba dijadwalkan saat masih ada penjadwalan sebelumnya yang masih berjalan, maka ia akan dianggap terlewat.

Contoh: Suatu _CronJob_ akan menjadwalkan _job_ baru tiap satu menit dimulai sejak `08:30:00`, dan `startingDeadlineSeconds` tidak diatur.
Jika _CronJob controller_ tidak aktif dari `08:29:00` sampai `10:21:00`, _job_ tidak akan dijalankan karena jumlah _job_ yang terlewat
sudah lebih dari 100.

Sebagai ilustrasi lebih lanjut, misalkan suatu _CronJob_ diatur untuk menjadwalkan _job_ baru setiap satu menit dimulai sejak `08:30:00`,
dan `startingDeadlineSeconds` memiliki nilai `200`. Jika _CronJob controller_ tidak aktif seperti pada contoh sebelumnya (`08:29:00` sampai `10:21:00`),
_job_ akan tetap dijalankan pada 10:22:00. Hal ini terjadi karena _CronJob controller_ memeriksa banyaknya jadwal yang terlewatkan pada 200 detik terakhir
(dalam kasus ini: 3 jadwal terlewat), dan bukan dari sejak waktu eksekusi terakhir.

_CronJob_ hanya bertanggung-jawab untuk menciptakan _job_ yang sesuai dengan jadwalnya sendiri,
dan _job_ tersebut bertanggung jawab terhadap pengelolaan _Pod_ yang direpresentasikan olehnya.

{{% /capture %}}