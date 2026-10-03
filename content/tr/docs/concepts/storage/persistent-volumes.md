---
title: Kalıcı Hacimler (Persistent Volumes)
weight: 10
feature:
  title: Depolama Orkestrasyonu
  description: >
    İster yerel depolama, ister genel bulut sağlayıcıları, ister iSCSI veya NFS gibi ağ depolama sistemleri olsun; tercih ettiğiniz depolama sistemini kapsayıcılarınıza otomatik olarak bağlar.
---

## Depolama Orkestrasyonu

Depolama yönetimi, bilgi işlem örneklerini yönetmekten ayrı bir konudur. **PersistentVolume (PV)** alt sistemi, kullanıcılara ve yöneticilere depolamanın nasıl sağlandığı ve nasıl tüketildiği konusunda soyutlama sunan bir API sağlar.

### Temel Kavramlar
- **PersistentVolume (PV):** Bir yönetici tarafından veya Depolama Sınıfları (StorageClasses) kullanılarak dinamik olarak sağlanan kümedeki bir depolama parçasıdır.
- **PersistentVolumeClaim (PVC):** Bir kullanıcı tarafından yapılan depolama talebidir. Pod'ların düğüm kaynaklarını talep etmesine benzer şekilde, PVC'ler de PV kaynaklarını talep eder.
