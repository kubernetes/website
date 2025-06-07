---
title: Kümedeki Uygulamalara Erişmek İçin Port Yönlendirme Kullanma
content_type: task
weight: 40
min-kubernetes-server-version: v1.10
---

<!-- overview -->

Bu sayfa, bir Kubernetes kümesinde çalışan bir MongoDB sunucusuna bağlanmak için `kubectl port-forward` kullanımını gösterir. Bu tür bir bağlantı, veritabanı hata ayıklaması için yararlı olabilir.

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
* [MongoDB Shell](https://www.mongodb.com/try/download/shell)'i yükleyin.

<!-- steps -->

## MongoDB dağıtımı ve servisi oluşturma

1. MongoDB çalıştıran bir Dağıtım oluşturun:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mongodb/mongo-deployment.yaml
   ```

   Başarılı bir komutun çıktısı, dağıtımın oluşturulduğunu doğrular:

   ```
   deployment.apps/mongo created
   ```

   Pod durumunu kontrol ederek hazır olduğunu kontrol edin:

   ```shell
   kubectl get pods
   ```

   Çıktı oluşturulan pod'u gösterir:

   ```
   NAME                     READY   STATUS    RESTARTS   AGE
   mongo-75f59d57f4-4nd6q   1/1     Running   0          2m4s
   ```

   Dağıtımın durumunu görüntüleyin:

   ```shell
   kubectl get deployment
   ```

   Çıktı, Dağıtımın oluşturulduğunu gösterir:

   ```
   NAME    READY   UP-TO-DATE   AVAILABLE   AGE
   mongo   1/1     1            1           2m21s
   ```

   Dağıtım, bir ReplicaSet'i otomatik olarak yönetir.
   ReplicaSet durumunu görüntülemek için:

   ```shell
   kubectl get replicaset
   ```

   Çıktı, ReplicaSet'in oluşturulduğunu gösterir:

   ```
   NAME               DESIRED   CURRENT   READY   AGE
   mongo-75f59d57f4   1         1         1       3m12s
   ```

2. MongoDB'yi ağda açığa çıkarmak için bir Servis oluşturun:

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mongodb/mongo-service.yaml
   ```

   Başarılı bir komutun çıktısı, Servisin oluşturulduğunu doğrular:

   ```
   service/mongo created
   ```

   Oluşturulan Servisi kontrol edin:

   ```shell
   kubectl get service mongo
   ```

   Çıktı, oluşturulan servisi gösterir:

   ```
   NAME    TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)     AGE
   mongo   ClusterIP   10.96.41.183   <none>        27017/TCP   11s
   ```

3. MongoDB sunucusunun Pod'da çalıştığını ve 27017 numaralı portu dinlediğini doğrulayın:

   ```shell
   # mongo-75f59d57f4-4nd6q'yi Pod'un adıyla değiştirin
   kubectl get pod mongo-75f59d57f4-4nd6q --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
   ```

   Çıktı, o Pod'daki MongoDB için portu gösterir:

   ```
   27017
   ```

   27017, MongoDB için resmi TCP portudur.

## Yerel bir portu Pod'daki bir porta yönlendirme

1. `kubectl port-forward`, bir pod adı gibi kaynak adını kullanarak eşleşen bir pod'u seçip bu pod'a port yönlendirme yapmanıza olanak tanır.

   ```shell
   # mongo-75f59d57f4-4nd6q'yi Pod'un adıyla değiştirin
   kubectl port-forward mongo-75f59d57f4-4nd6q 28015:27017
   ```

   bu aynı zamanda

   ```shell
   kubectl port-forward pods/mongo-75f59d57f4-4nd6q 28015:27017
   ```

   veya

   ```shell
   kubectl port-forward deployment/mongo 28015:27017
   ```

   veya

   ```shell
   kubectl port-forward replicaset/mongo-75f59d57f4 28015:27017
   ```

   veya

   ```shell
   kubectl port-forward service/mongo 28015:27017
   ```

   Yukarıdaki komutlardan herhangi biri çalışır. Çıktı buna benzer:

   ```
   Forwarding from 127.0.0.1:28015 -> 27017
   Forwarding from [::1]:28015 -> 27017
   ```

   {{< note >}}
   `kubectl port-forward` dönmez. Egzersizlere devam etmek için başka bir terminal açmanız gerekecek.
   {{< /note >}}

2. MongoDB komut satırı arayüzünü başlatın:

   ```shell
   mongosh --port 28015
   ```

3. MongoDB komut satırı isteminde, `ping` komutunu girin:

   ```
   db.runCommand( { ping: 1 } )
   ```

   Başarılı bir ping isteği şu şekilde döner:

   ```
   { ok: 1 }
   ```

### Yerel portu _kubectl_'in seçmesine izin verme {#let-kubectl-choose-local-port}

Belirli bir yerel porta ihtiyacınız yoksa, `kubectl`'in yerel portu seçmesine ve tahsis etmesine izin verebilir ve böylece yerel port çakışmalarını yönetmekten kurtulabilirsiniz, biraz daha basit bir sözdizimi ile:

```shell
kubectl port-forward deployment/mongo :27017
```

`kubectl` aracı, kullanılmayan bir yerel port numarası bulur (diğer uygulamalar tarafından kullanılabilecek düşük port numaralarından kaçınır). Çıktı buna benzer:

```
Forwarding from 127.0.0.1:63753 -> 27017
Forwarding from [::1]:63753 -> 27017
```

<!-- discussion -->

## Tartışma

Yerel port 28015'e yapılan bağlantılar, MongoDB sunucusunu çalıştıran Pod'un 27017 numaralı portuna yönlendirilir. Bu bağlantı kurulduğunda, Pod'da çalışan veritabanını hata ayıklamak için yerel iş istasyonunuzu kullanabilirsiniz.

{{< note >}}
`kubectl port-forward` yalnızca TCP portları için uygulanmıştır.
UDP protokolü desteği [issue 47862](https://github.com/kubernetes/kubernetes/issues/47862) ile takip edilmektedir.
{{< /note >}}

## {{% heading "whatsnext" %}}

[kubectl port-forward](/docs/reference/generated/kubectl/kubectl-commands/#port-forward) hakkında daha fazla bilgi edinin.
