---
title: Gizli Bilgiler (Secrets)
weight: 10
feature:
  title: Gizli Bilgi ve Yapılandırma Yönetimi
  description: >
    Konteyner imajınızı yeniden derlemeye gerek kalmadan ve gizli anahtarlarınızı yapılandırma dosyalarında açığa çıkarmadan parolaları, tokenları ve yapılandırmaları güvenle dağıtıp güncelleyin.
---

## Gizli Bilgiler (Secrets)

Bir **Secret**, parola, belirteç (token) veya anahtar gibi az miktarda hassas veriyi depolamak için kullanılan bir Kubernetes nesnesidir.

Bu tür bilgileri bir Pod spesifikasyonuna veya kapsayıcı imajına doğrudan yazmak yerine bir Secret içine koymak, hassas verilerin nasıl kullanıldığı üzerinde daha fazla denetim sağlar ve verilerin açığa çıkma riskini en aza indirir.
