---
title: Hizmetleri Kullanarak Bir Ön Ucu Bir Arka Uca Bağlama
content_type: tutorial
weight: 70
---

<!-- overview -->

Bu görev, bir _ön uç_ ve bir _arka uç_ mikro hizmeti oluşturmayı gösterir. Arka uç 
mikro hizmeti bir merhaba selamlayıcısıdır. Ön uç, arka ucu nginx ve bir 
Kubernetes {{< glossary_tooltip term_id="service" >}} nesnesi kullanarak sunar.

## {{% heading "objectives" %}}

* Bir {{< glossary_tooltip term_id="deployment" >}} nesnesi kullanarak örnek bir `hello` arka uç mikro hizmeti oluşturun ve çalıştırın.
* Arka uç mikro hizmetinin birden çok kopyasına trafik göndermek için bir Hizmet nesnesi kullanın.
* Bir Dağıtım nesnesi kullanarak bir `nginx` ön uç mikro hizmeti oluşturun ve çalıştırın.
* Ön uç mikro hizmetini, arka uç mikro hizmetine trafik gönderecek şekilde yapılandırın.
* Ön uç mikro hizmetini küme dışına sunmak için `type=LoadBalancer` türünde bir Hizmet nesnesi kullanın.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Bu görev, desteklenen bir ortam gerektiren
[dış yük dengeleyicilere sahip Hizmetler](/docs/tasks/access-application-cluster/create-external-load-balancer/) kullanır. Ortamınız bunu desteklemiyorsa, bunun yerine
[NodePort türünde bir Hizmet](/docs/concepts/services-networking/service/#type-nodeport) kullanabilirsiniz.

<!-- lessoncontent -->

## Bir Dağıtım Kullanarak Arka Ucu Oluşturma

Arka uç, basit bir merhaba selamlayıcı mikro hizmetidir. İşte arka uç Dağıtımı için yapılandırma dosyası:

{{% code_sample file="service/access/backend-deployment.yaml" %}}

Arka uç Dağıtımını oluşturun:

```shell
kubectl apply -f https://k8s.io/examples/service/access/backend-deployment.yaml
```

Arka uç Dağıtımı hakkında bilgi görüntüleyin:

```shell
kubectl describe deployment backend
```

Çıktı şu şekilde benzer olacaktır:

```
Name:                           backend
Namespace:                      default
CreationTimestamp:              Mon, 24 Oct 2016 14:21:02 -0700
Labels:                         app=hello
                tier=backend
                track=stable
Annotations:                    deployment.kubernetes.io/revision=1
Selector:                       app=hello,tier=backend,track=stable
Replicas:                       3 desired | 3 updated | 3 total | 3 available | 0 unavailable
StrategyType:                   RollingUpdate
MinReadySeconds:                0
RollingUpdateStrategy:          1 max unavailable, 1 max surge
Pod Template:
  Labels:       app=hello
        tier=backend
        track=stable
  Containers:
   hello:
  Image:              "gcr.io/google-samples/hello-go-gke:1.0"
  Port:               80/TCP
  Environment:        <none>
  Mounts:             <none>
  Volumes:              <none>
Conditions:
  Type          Status  Reason
  ----          ------  ------
  Available     True    MinimumReplicasAvailable
  Progressing   True    NewReplicaSetAvailable
OldReplicaSets:                 <none>
NewReplicaSet:                  hello-3621623197 (3/3 replicas created)
Events:
...
```

## `hello` Hizmet Nesnesini Oluşturma

Bir ön uçtan bir arka uca istek göndermenin anahtarı, arka uç Hizmetidir. Bir Hizmet, kalıcı bir IP adresi ve DNS adı girişi oluşturur, böylece arka uç mikro hizmeti her zaman erişilebilir olur. Bir Hizmet, trafiği yönlendirdiği Pod'ları bulmak için {{< glossary_tooltip text="seçiciler" term_id="selector" >}} kullanır.

Öncelikle, Hizmet yapılandırma dosyasını inceleyin:

{{% code_sample file="service/access/backend-service.yaml" %}}

Yapılandırma dosyasında, `hello` adlı Hizmetin `app: hello` ve `tier: backend` etiketlerine sahip Pod'lara trafik yönlendirdiğini görebilirsiniz.

Arka uç Hizmetini oluşturun:

```shell
kubectl apply -f https://k8s.io/examples/service/access/backend-service.yaml
```

Bu noktada, `hello` uygulamanızın üç kopyasını çalıştıran bir `backend` Dağıtımınız ve onlara trafik yönlendirebilen bir Hizmetiniz var. Ancak, bu hizmet küme dışında ne erişilebilir ne de çözümlenebilir.

## Ön Ucu Oluşturma

Artık arka ucunuzu çalıştırdığınıza göre, küme dışından erişilebilir bir ön uç oluşturabilir ve istekleri ona proxy yaparak arka uca bağlayabilirsiniz.

Ön uç, arka uç Hizmetine verilen DNS adını kullanarak arka uç işçi Pod'larına istek gönderir. DNS adı, `examples/service/access/backend-service.yaml` yapılandırma dosyasındaki `name` alanının değeri olan `hello` dur.

Ön Uç Dağıtımındaki Pod'lar, `hello` arka uç Hizmetine istekleri proxy yapmak üzere yapılandırılmış bir nginx görüntüsü çalıştırır. İşte nginx yapılandırma dosyası:

{{% code_sample file="service/access/frontend-nginx.conf" %}}

Arka uç ile benzer şekilde, ön uç da bir Dağıtım ve bir Hizmete sahiptir. Arka uç ve ön uç hizmetleri arasındaki önemli bir fark, ön uç Hizmetinin yapılandırmasının `type: LoadBalancer` olmasıdır, bu da Hizmetin bulut sağlayıcınız tarafından sağlanan bir yük dengeleyici kullandığı ve küme dışından erişilebilir olacağı anlamına gelir.

{{% code_sample file="service/access/frontend-service.yaml" %}}

{{% code_sample file="service/access/frontend-deployment.yaml" %}}

Ön uç Dağıtımını ve Hizmetini oluşturun:

```shell
kubectl apply -f https://k8s.io/examples/service/access/frontend-deployment.yaml
kubectl apply -f https://k8s.io/examples/service/access/frontend-service.yaml
```

Çıktı, her iki kaynağın da oluşturulduğunu doğrular:

```
deployment.apps/frontend created
service/frontend created
```

{{< note >}}
nginx yapılandırması
[kapsayıcı görüntüsüne](/examples/service/access/Dockerfile) gömülüdür. Bunu yapmanın daha iyi bir yolu,
yapılandırmayı daha kolay değiştirebilmeniz için bir
[ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) kullanmaktır.
{{< /note >}}

## Ön Uç Hizmeti ile Etkileşim

Bir LoadBalancer türünde Hizmet oluşturduktan sonra, bu komutu kullanarak dış IP'yi bulabilirsiniz:

```shell
kubectl get service frontend --watch
```

Bu, `frontend` Hizmetinin yapılandırmasını görüntüler ve değişiklikleri izler. Başlangıçta, dış IP `<pending>` olarak listelenir:

```
NAME       TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)  AGE
frontend   LoadBalancer   10.51.252.116   <pending>     80/TCP   10s
```

Ancak, bir dış IP sağlanır sağlanmaz, yapılandırma `EXTERNAL-IP` başlığı altında yeni IP'yi içerecek şekilde güncellenir:

```
NAME       TYPE           CLUSTER-IP      EXTERNAL-IP        PORT(S)  AGE
frontend   LoadBalancer   10.51.252.116   XXX.XXX.XXX.XXX    80/TCP   1m
```

Bu IP artık küme dışından `frontend` hizmeti ile etkileşimde bulunmak için kullanılabilir.

## Trafiği Ön Uçtan Geçirin

Artık ön uç ve arka uç bağlı. Ön Uç Hizmetinizin dış IP'sini kullanarak curl komutunu kullanarak uç noktaya erişebilirsiniz.

```shell
curl http://${EXTERNAL_IP} # daha önce gördüğünüz EXTERNAL-IP ile değiştirin
```

Çıktı, arka uç tarafından oluşturulan mesajı gösterir:

```json
{"message":"Hello"}
```

## {{% heading "cleanup" %}}

Hizmetleri silmek için bu komutu girin:

```shell
kubectl delete services frontend backend
```

Arka uç ve ön uç uygulamalarını çalıştıran Dağıtımları, ReplicaSet'leri ve Pod'ları silmek için bu komutu girin:

```shell
kubectl delete deployment frontend backend
```

## {{% heading "whatsnext" %}}

* [Hizmetler](/docs/concepts/services-networking/service/) hakkında daha fazla bilgi edinin
* [ConfigMap'ler](/docs/tasks/configure-pod-container/configure-pod-configmap/) hakkında daha fazla bilgi edinin
* [Hizmetler ve Pod'lar için DNS](/docs/concepts/services-networking/dns-pod-service/) hakkında daha fazla bilgi edinin
