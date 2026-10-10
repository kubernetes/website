---
title: Pod'lar
description: >
  Pod'lar, Kubernetes'te oluşturabileceğiniz ve yönetebileceğiniz en küçük dağıtılabilir bilgi işlem birimleridir.
weight: 20
---

*Pod*, paylaşılan depolama ve ağ kaynaklarına sahip bir veya daha fazla konteynerden oluşan bir gruptur ve bu konteynerlerin nasıl çalıştırılacağına ilişkin bir spesifikasyon içerir.

Bir Pod'un içeriği her zaman birlikte konumlandırılır, birlikte planlanır ve paylaşılan bir bağlamda çalıştırılır. Bir Pod, uygulamaya özgü bir "mantıksal ana bilgisayarı" modeller: göreceli olarak sıkı şekilde bağlanmış bir veya daha fazla uygulama konteyneri barındırır.

## Pod Nedir?

Kubernetes kümesindeki bir Pod iki ana şekilde kullanılabilir:

- **Tek bir konteyner çalıştıran Pod'lar:** "Konteyner başına bir Pod" modeli en yaygın Kubernetes kullanım senaryosudur; bu durumda Pod'u tek bir konteynerin etrafındaki bir sarmalayıcı (wrapper) olarak düşünebilirsiniz.
- **Birlikte çalışması gereken birden çok konteyneri çalıştıran Pod'lar:** Bir Pod, sıkı şekilde bağlı olan ve kaynakları paylaşması gereken birden çok konteynerden oluşan bir uygulamayı kapsayabilir. Bu birlikte konumlandırılmış konteynerler tek bir uyumlu hizmet birimi oluşturur.

Her Pod benzersiz bir IP adresi alır. Bir Pod içindeki her konteyner, IP adresi ve ağ bağlantı noktaları (portlar) dahil olmak üzere ağ ad alanını (network namespace) paylaşır. Pod içindeki konteynerler `localhost` kullanarak birbirleriyle iletişim kurabilir.
