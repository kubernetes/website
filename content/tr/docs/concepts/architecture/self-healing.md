---
title: Kendi Kendini İyileştirme
weight: 20
feature:
  title: Kendi Kendini İyileştirme (Self-Healing)
  description: >
    Kubernetes çöken konteynerleri anında yeniden başlatır, yanıt vermeyen Pod'ları değiştirir ve kullanıcı tanımlı sağlık denetimlerini geçemeyen kapsayıcıları trafik alımından çıkarır.
---

## Kendi Kendini İyileştirme (Self-Healing)

Kubernetes mimarisi yüksek erişilebilirlik ve kendi kendini onarma (self-healing) ilkeleri üzerine kuruludur:

1. **Yeniden Başlatma:** Başarısız olan veya çöken kapsayıcılar restart ilkesine (restartPolicy) göre derhal yeniden başlatılır.
2. **Yeniden Zamanlama:** Bir düğüm (node) arızalandığında veya ağdan koptuğunda, üzerindeki Pod'lar sağlıklı diğer düğümlere otomatik olarak taşınır ve yeniden oluşturulur.
3. **Sağlık Denetimleri (Probes):** Liveness ve Readiness probları sayesinde yanıt vermeyen konteynerler sonlandırılır ve hazır olmayan kapsayıcılara istemci trafiği yönlendirilmez.
