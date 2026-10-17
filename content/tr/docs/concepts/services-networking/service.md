---
title: Servis (Service)
weight: 10
feature:
  title: Servis Keşfi ve Yük Dengeleme
  description: >
    Uygulamanızı alışık olmadığınız bir servis keşif mekanizması için değiştirmenize gerek yoktur. Kubernetes, Pod'lara kendi IP adreslerini ve bir Pod grubu için tek bir DNS adı atayarak aralarında otomatik yük dengelemesi gerçekleştirebilir.
---

## Kubernetes Servisi Nedir?

Kubernetes'te bir **Servis (Service)**, bir grup Pod üzerinde çalışan bir uygulamayı ağ servisi olarak sunmanın soyut bir yoludur.

Kubernetes ile servis keşfi için uygulamanızı değiştirmeniz gerekmez. Kubernetes, Pod'lara kendi IP adreslerini ve bir dizi Pod için tek bir DNS adı sağlar ve bunlar arasında yük dengelemesi yapabilir.

### Pod Ağ Bağlantısı ve Kararsızlık

Kubernetes Pod'ları geçicidir (ephemeral). Çöktüklerinde veya yerleri değiştirildiğinde yeni IP adresleriyle yeniden oluşturulurlar. Bu durum doğrudan Pod IP'lerine güvenmeyi imkansız hale getirir. Bir Kubernetes Servisi, arka uçtaki Pod'lar değişse bile istemcilerin kararlı bir IP adresi veya DNS ismi üzerinden servise kesintisiz erişmesini sağlar.
