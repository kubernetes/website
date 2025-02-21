---
title: Harici Bir Yük Dengeleyici Oluşturma
content_type: task
weight: 80
---

<!-- overview -->

Bu sayfa, harici bir yük dengeleyici oluşturmayı gösterir.

Bir {{< glossary_tooltip text="Servis" term_id="service" >}} oluştururken, otomatik olarak bir bulut yük dengeleyici oluşturma seçeneğiniz vardır. Bu, küme düğümlerinizdeki doğru porta trafik gönderen harici olarak erişilebilir bir IP adresi sağlar,
_ kümenizin desteklenen bir ortamda çalışması ve doğru bulut yük dengeleyici sağlayıcı paketiyle yapılandırılmış olması koşuluyla_.

Servis yerine bir {{< glossary_tooltip term_id="ingress" >}} de kullanabilirsiniz.
Daha fazla bilgi için [Ingress](/docs/concepts/services-networking/ingress/) belgelerine bakın.

## {{% heading "önkoşullar" %}}

{{< include "task-tutorial-prereqs.md" >}}

Kümeniz, harici yük dengeleyicileri yapılandırmayı zaten destekleyen bir bulut veya başka bir ortamda çalışıyor olmalıdır.

<!-- steps -->

## Bir Servis Oluşturma

### Bir manifestten Servis oluşturma

Harici bir yük dengeleyici oluşturmak için, Servis manifestinize aşağıdaki satırı ekleyin:

```yaml
  type: LoadBalancer
```

Manifestiniz şu şekilde görünebilir:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: example-service
spec:
  selector:
  app: example
  ports:
  - port: 8765
    targetPort: 9376
  type: LoadBalancer
```

### kubectl kullanarak bir Servis oluşturma

Alternatif olarak, `kubectl expose` komutunu ve `--type=LoadBalancer` bayrağını kullanarak servisi oluşturabilirsiniz:

```bash
kubectl expose deployment example --port=8765 --target-port=9376 \
    --name=example-service --type=LoadBalancer
```

Bu komut, referans verilen kaynağın (yukarıdaki örnekte `example` adlı bir
{{< glossary_tooltip text="Deployment" term_id="deployment" >}}) ile aynı seçicileri kullanarak yeni bir Servis oluşturur.

Daha fazla bilgi ve isteğe bağlı bayraklar için [`kubectl expose` referansına](/docs/reference/generated/kubectl/kubectl-commands/#expose) bakın.

## IP adresinizi bulma

Servisiniz için oluşturulan IP adresini `kubectl` aracılığıyla servis bilgilerini alarak bulabilirsiniz:

```bash
kubectl describe services example-service
```

bu, aşağıdakine benzer bir çıktı üretmelidir:

```
Name:                     example-service
Namespace:                default
Labels:                   app=example
Annotations:              <none>
Selector:                 app=example
Type:                     LoadBalancer
IP Families:              <none>
IP:                       10.3.22.96
IPs:                      10.3.22.96
LoadBalancer Ingress:     192.0.2.89
Port:                     <unset>  8765/TCP
TargetPort:               9376/TCP
NodePort:                 <unset>  30593/TCP
Endpoints:                172.17.0.3:9376
Session Affinity:         None
External Traffic Policy:  Cluster
Events:                   <none>
```

Yük dengeleyicinin IP adresi `LoadBalancer Ingress` yanında listelenmiştir.

{{< note >}}
Servisinizi Minikube üzerinde çalıştırıyorsanız, atanan IP adresini ve portu şu komutla bulabilirsiniz:

```bash
minikube service example-service --url
```
{{< /note >}}

## İstemci kaynak IP'sini koruma

Varsayılan olarak, hedef kapsayıcıda görülen kaynak IP, istemcinin *orijinal kaynak IP'si değildir*. İstemci IP'sinin korunmasını etkinleştirmek için, Servis'in `.spec` alanında aşağıdaki alanlar yapılandırılabilir:

* `.spec.externalTrafficPolicy` - bu Servisin dış trafiği düğüm yerel veya küme genelindeki uç noktalara yönlendirmek isteyip istemediğini belirtir. İki seçenek vardır: `Cluster` (varsayılan) ve `Local`. `Cluster`, istemci kaynak IP'sini gizler ve başka bir düğüme ikinci bir sıçrama yapabilir, ancak genel olarak iyi bir yük dağılımına sahip olmalıdır. `Local`, istemci kaynak IP'sini korur ve LoadBalancer ve NodePort türü Servisler için ikinci bir sıçramayı önler, ancak potansiyel olarak dengesiz trafik dağılımı riski taşır.
* `.spec.healthCheckNodePort` - servis için sağlık kontrolü düğüm portunu (sayısal port numarası) belirtir. `healthCheckNodePort` belirtmezseniz, servis denetleyicisi kümenizin NodePort aralığından bir port tahsis eder. Bu aralığı, bir API sunucusu komut satırı seçeneği olan `--service-node-port-range` ayarlayarak yapılandırabilirsiniz. Servis `type` LoadBalancer olarak ayarlandığında ve `externalTrafficPolicy` Local olarak ayarlandığında, Servis kullanıcı tarafından belirtilen `healthCheckNodePort` değerini kullanır.

Servis manifestinde `externalTrafficPolicy`'yi Local olarak ayarlamak bu özelliği etkinleştirir. Örneğin:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: example-service
spec:
  selector:
  app: example
  ports:
  - port: 8765
    targetPort: 9376
  externalTrafficPolicy: Local
  type: LoadBalancer
```

### Kaynak IP'leri korurken dikkat edilmesi gerekenler ve sınırlamalar

Bazı bulut sağlayıcılarından yük dengeleme hizmetleri, her hedef için farklı ağırlıklar yapılandırmanıza izin vermez.

Her hedefe eşit ağırlık verilmesi durumunda, düğümlere trafik gönderme açısından dış trafik farklı Pod'lar arasında eşit olarak yük dengelenmez. Harici yük dengeleyici, hedef olarak kullanılan her düğümdeki Pod sayısını bilmez.

`NumServicePods << NumNodes` veya `NumServicePods >> NumNodes` durumunda, ağırlıklar olmadan bile oldukça eşit bir dağılım görülecektir.

Pod'dan pod'a iç trafik, tüm pod'lar arasında eşit olasılıkla ClusterIP servislerine benzer şekilde davranmalıdır.

## Yük dengeleyicileri çöp toplama

{{< feature-state for_k8s_version="v1.17" state="stable" >}}

Genel durumda, bulut sağlayıcısındaki ilgili yük dengeleyici kaynakları, bir LoadBalancer türü Servis silindikten kısa bir süre sonra temizlenmelidir. Ancak, ilişkili Servis silindikten sonra bulut kaynaklarının yetim kaldığı çeşitli köşe durumlarının olduğu bilinmektedir. Bu durumun önlenmesi için Servis Yük Dengeleyicileri için Sonlandırıcı Koruması tanıtıldı. Sonlandırıcılar kullanılarak, ilgili yük dengeleyici kaynakları da silinene kadar bir Servis kaynağı asla silinmeyecektir.

Özellikle, bir Servis `type` LoadBalancer ise, servis denetleyicisi `service.kubernetes.io/load-balancer-cleanup` adlı bir sonlandırıcı ekleyecektir.
Sonlandırıcı, yalnızca yük dengeleyici kaynağı temizlendikten sonra kaldırılacaktır.
Bu, servis denetleyicisinin çökmesi gibi köşe durumlarında bile yük dengeleyici kaynaklarının asılı kalmasını önler.

## Harici yük dengeleyici sağlayıcılar

Bu işlevsellik için veri yolu, Kubernetes kümesinin dışındaki bir yük dengeleyici tarafından sağlanır.

Servis `type` LoadBalancer olarak ayarlandığında, Kubernetes, küme içindeki pod'lar için `type` eşittir ClusterIP'ye eşdeğer işlevsellik sağlar ve bunu ilgili Kubernetes pod'larını barındıran düğümler için girişler ile (Kubernetes dışındaki) yük dengeleyiciyi programlayarak genişletir. Kubernetes kontrol düzlemi, harici yük dengeleyicinin oluşturulmasını, sağlık kontrollerini (gerekirse) ve paket filtreleme kurallarını (gerekirse) otomatikleştirir. Bulut sağlayıcısı yük dengeleyici için bir IP adresi tahsis ettiğinde, kontrol düzlemi bu harici IP adresini arar ve Servis nesnesine doldurur.

## {{% heading "sonraki adımlar" %}}

* [Uygulamaları Servislerle Bağlama](/docs/tutorials/services/connect-applications-service/) öğreticisini takip edin
* [Servis](/docs/concepts/services-networking/service/) hakkında okuyun
* [Ingress](/docs/concepts/services-networking/ingress/) hakkında okuyun
