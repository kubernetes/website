---
title: Yatay Pod Otomatik Ölçekleme (HPA)
weight: 10
feature:
  title: Yatay Ölçeklendirme
  description: >
    İş yüklerinizi basit bir komutla, yönetim arayüzüyle veya CPU ve bellek kullanımına dayalı özel metriklerle otomatik olarak ölçeklendirin.
---

## Yatay Pod Otomatik Ölçekleme (HPA)

Kubernetes'te bir **HorizontalPodAutoscaler**, iş yükü gereksinimlerini karşılamak için iş yükü kaynağını (Deployment veya StatefulSet gibi) otomatik olarak günceller.

Yatay ölçekleme; daha fazla kaynak tahsis etmek yerine, artan yükü karşılamak için daha fazla Pod örneği dağıtılması (ölçek büyütme - scale out) veya yük azaldığında Pod sayısının düşürülmesi (ölçek küçültme - scale in) anlamına gelir.
