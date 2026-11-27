---
title: İşler (Jobs)
weight: 10
feature:
  title: Toplu İş Yürütme (Batch Execution)
  description: >
    Kubernetes, sürekli çalışan servislerin yanı sıra toplu işlem (batch) ve CI/CD iş yüklerinizi de yönetebilir; başarısız olan konteynerleri isteğe bağlı olarak otomatik olarak telafi eder.
---

## İşler (Jobs)

Bir **Job**, bir veya birden fazla Pod oluşturur ve belirtilen sayıda Pod başarıyla sonlanana kadar Pod'ların yürütülmesini izler.

Pod'lar başarıyla tamamlandığında İş tamamlanmış kabul edilir. Bir Job silindiğinde oluşturduğu Pod'lar da temizlenir. Toplu veri işleme, periyodik yedeklemeler ve makine öğrenimi model eğitimi gibi tek seferlik iş yükleri için idealdir.
