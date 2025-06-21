---
title: Kümelerde Çalışan Servislere Erişim
content_type: task
weight: 140
---

<!-- overview -->
Bu sayfa, Kubernetes kümesinde çalışan servislere nasıl bağlanılacağını gösterir.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Kümede çalışan servislere erişim

Kubernetes'te, [düğümler](/docs/concepts/architecture/nodes/),
[podlar](/docs/concepts/workloads/pods/) ve [servisler](/docs/concepts/services-networking/service/) kendi IP'lerine sahiptir.
Birçok durumda, kümedeki düğüm IP'leri, pod IP'leri ve bazı servis IP'leri yönlendirilemez olacak,
bu nedenle küme dışındaki bir makineden, örneğin masaüstü bilgisayarınızdan erişilemez olacaklardır.

### Bağlanma yolları

Küme dışından düğümlere, podlara ve servislere bağlanmak için birkaç seçeneğiniz vardır:

- Servislere genel IP'ler aracılığıyla erişin.
  - Servisi küme dışından erişilebilir hale getirmek için `NodePort` veya `LoadBalancer` türünde bir servis kullanın.
    [servisler](/docs/concepts/services-networking/service/) ve
    [kubectl expose](/docs/reference/generated/kubectl/kubectl-commands/#expose) belgelerine bakın.
  - Küme ortamınıza bağlı olarak, bu yalnızca servisi kurumsal ağınıza açabilir
    veya internete açabilir. Açılan servisin güvenli olup olmadığını düşünün.
    Kendi kimlik doğrulamasını yapıyor mu?
  - Podları servislerin arkasına yerleştirin. Bir dizi replika arasından belirli bir poda erişmek için,
    pod üzerine benzersiz bir etiket yerleştirin ve bu etiketi seçen yeni bir servis oluşturun.
  - Çoğu durumda, uygulama geliştiricisinin düğümlere doğrudan nodeIP'leri aracılığıyla erişmesi gerekli olmamalıdır.
- Proxy Fiilini kullanarak servislere, düğümlere veya podlara erişin.
  - Uzak servise erişmeden önce apiserver kimlik doğrulaması ve yetkilendirmesi yapar.
    Servisler internete açılacak kadar güvenli değilse veya düğüm IP'sindeki portlara erişmek
    veya hata ayıklamak için bunu kullanın.
  - Proxy'ler bazı web uygulamaları için sorunlara neden olabilir.
  - Yalnızca HTTP/HTTPS için çalışır.
  - [burada](#manually-constructing-apiserver-proxy-urls) açıklanmıştır.
- Kümedeki bir düğümden veya poddan erişim sağlayın.
  - Bir pod çalıştırın ve ardından [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec) kullanarak
    içinde bir kabuğa bağlanın. Bu kabuktan diğer düğümlere, podlara ve servislere bağlanın.
  - Bazı kümeler, kümedeki bir düğüme ssh ile bağlanmanıza izin verebilir. Oradan küme servislerine erişebilirsiniz.
    Bu standart olmayan bir yöntemdir ve bazı kümelerde çalışır, bazılarında çalışmaz.
    Tarayıcılar ve diğer araçlar yüklü olabilir veya olmayabilir. Küme DNS'i çalışmayabilir.

### Yerleşik servisleri keşfetme

Genellikle, kube-system tarafından bir kümede başlatılan birkaç servis vardır. Bu servislerin listesini
`kubectl cluster-info` komutuyla alın:

```shell
kubectl cluster-info
```

Çıktı buna benzer:

```
Kubernetes master is running at https://192.0.2.1
elasticsearch-logging is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy
kibana-logging is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/kibana-logging/proxy
kube-dns is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/kube-dns/proxy
grafana is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/monitoring-grafana/proxy
heapster is running at https://192.0.2.1/api/v1/namespaces/kube-system/services/monitoring-heapster/proxy
```

Bu, her servise erişmek için proxy-fiil URL'sini gösterir.
Örneğin, bu kümede küme düzeyinde günlük kaydı etkinleştirilmiştir (Elasticsearch kullanarak),
uygun kimlik bilgileri sağlanırsa `https://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/`
adresinden veya bir kubectl proxy aracılığıyla, örneğin:
`http://localhost:8080/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/` adresinden erişilebilir.

{{< note >}}
Kimlik bilgilerini nasıl geçeceğinizi veya kubectl proxy kullanmayı öğrenmek için
[Kubernetes API'sini Kullanarak Kümelere Erişim](/docs/tasks/administer-cluster/access-cluster-api/#accessing-the-kubernetes-api)
sayfasına bakın.
{{< /note >}}

#### Apiserver proxy URL'lerini manuel olarak oluşturma

Yukarıda belirtildiği gibi, servisin proxy URL'sini almak için `kubectl cluster-info` komutunu kullanırsınız.
Servis uç noktalarını, son eklerini ve parametrelerini içeren proxy URL'leri oluşturmak için servisin proxy URL'sine ekleyin:
`http://`*`kubernetes_master_address`*`/api/v1/namespaces/`*`namespace_name`*`/services/`*`[https:]service_name[:port_name]`*`/proxy`

Portunuz için bir ad belirtmediyseniz, URL'de *port_name* belirtmenize gerek yoktur. Ayrıca,
hem adlandırılmış hem de adlandırılmamış portlar için port numarasını *port_name* yerine kullanabilirsiniz.

Varsayılan olarak, API sunucusu servisinize HTTP kullanarak proxy yapar. HTTPS kullanmak için, servis adının önüne `https:` ekleyin:
`http://<kubernetes_master_address>/api/v1/namespaces/<namespace_name>/services/<service_name>/proxy`

URL'nin `<service_name>` segmenti için desteklenen formatlar şunlardır:

* `<service_name>` - varsayılan veya adlandırılmamış porta http kullanarak proxy yapar
* `<service_name>:<port_name>` - belirtilen port adı veya port numarasına http kullanarak proxy yapar
* `https:<service_name>:` - varsayılan veya adlandırılmamış porta https kullanarak proxy yapar (sondaki iki nokta üst üste işaretine dikkat edin)
* `https:<service_name>:<port_name>` - belirtilen port adı veya port numarasına https kullanarak proxy yapar

##### Örnekler

* Elasticsearch servis uç noktasına `_search?q=user:kimchy` erişmek için şunu kullanırsınız:

  ```
  http://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_search?q=user:kimchy
  ```

* Elasticsearch küme sağlık bilgilerine `_cluster/health?pretty=true` erişmek için şunu kullanırsınız:

  ```
  https://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_cluster/health?pretty=true
  ```

  Sağlık bilgileri buna benzer:

  ```json
  {
    "cluster_name" : "kubernetes_logging",
    "status" : "yellow",
    "timed_out" : false,
    "number_of_nodes" : 1,
    "number_of_data_nodes" : 1,
    "active_primary_shards" : 5,
    "active_shards" : 5,
    "relocating_shards" : 0,
    "initializing_shards" : 0,
    "unassigned_shards" : 5
  }
  ```

* *https* Elasticsearch servis sağlık bilgilerine `_cluster/health?pretty=true` erişmek için şunu kullanırsınız:

  ```
  https://192.0.2.1/api/v1/namespaces/kube-system/services/https:elasticsearch-logging:/proxy/_cluster/health?pretty=true
  ```

#### Kümede çalışan servislere web tarayıcıları kullanarak erişme

Apiserver proxy URL'sini bir tarayıcının adres çubuğuna koyabilirsiniz. Ancak:

- Web tarayıcıları genellikle token geçemez, bu nedenle temel (şifre) kimlik doğrulamasını kullanmanız gerekebilir.
  Apiserver temel kimlik doğrulamasını kabul edecek şekilde yapılandırılabilir,
  ancak kümeniz temel kimlik doğrulamasını kabul edecek şekilde yapılandırılmamış olabilir.
- Bazı web uygulamaları çalışmayabilir, özellikle proxy yol öneki hakkında bilgi sahibi olmayan
  URL'ler oluşturan istemci tarafı javascript içerenler.
