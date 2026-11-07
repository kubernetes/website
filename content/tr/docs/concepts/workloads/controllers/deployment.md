---
title: Dağıtımlar (Deployments)
weight: 10
feature:
  title: Otomatik Dağıtım ve Geri Alma
  description: >
    Kubernetes, uygulamanızdaki veya yapılandırmasındaki değişiklikleri aşamalı olarak hayata geçirirken, tüm örneklerin aynı anda kesintiye uğramamasını sağlamak için sistem sağlığını izler. Bir sorun oluştuğunda değişiklikleri otomatik olarak geri alır.
---

## Dağıtım (Deployment) Nedir?

Bir **Deployment**, Pod'lar ve ReplicaSet'ler için bildirimsel (declarative) güncellemeler sağlar.

Deployment nesnesinde *istenilen durumu (desired state)* tanımlarsınız ve Deployment Denetleyicisi (Deployment Controller), mevcut durumu kontrollü bir hızda istenilen duruma dönüştürür. Yeni ReplicaSet'ler oluşturmak veya mevcut olanları kaldırıp kaynaklarını yenilerine aktarmak için Deployment'lar tanımlayabilirsiniz.

### Temel Yetenekler
- **Kesintisiz Güncelleme (Rolling Update):** Uygulama örneklerini sırayla güncelleyerek sıfır kesinti süresi sağlar.
- **Otomatik Geri Alma (Rollback):** Hatalı bir imaj veya yapılandırma algılandığında tek bir komutla önceki kararlı sürüme dönülür.
- **Ölçeklendirme:** İş yükü ihtiyacına göre kopya sayısını artırır veya azaltır.
