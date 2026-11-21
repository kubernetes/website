---
title: Hello Minikube
content_type: tutorial
weight: 5
card:
  name: tutorials
  weight: 10
---

<!-- overview -->

Bu eğitim, minikube kullanarak Kubernetes üzerinde örnek bir uygulamayı nasıl çalıştıracağınızı gösterir.
Eğitim, tüm istekleri yansıtmak için NGINX kullanan bir konteyner imajı sağlar.

## {{% heading "objectives" %}}

* minikube'a örnek bir uygulama dağıtın.
* Uygulamayı çalıştırın.
* Uygulama günlüklerini görüntüleyin.

## {{% heading "prerequisites" %}}


Bu eğitim, `minikube`'u zaten kurmuş olduğunuzu varsayar.
Kurulum yönergeleri için [minikube start](https://minikube.sigs.k8s.io/docs/start/) sayfasındaki __1. Adım__'a bakın.
{{< note >}}
Yalnızca __1. Adım, Kurulum__'daki yönergeleri uygulayın. Geri kalanı bu sayfada ele alınmıştır.
{{< /note >}}

Ayrıca `kubectl`'i de kurmanız gerekir.
Kurulum yönergeleri için [Araçları kurun](/docs/tasks/tools/#kubectl) sayfasına bakın.


<!-- lessoncontent -->

## Bir minikube kümesi oluşturma

```shell
minikube start
```

## minikube kümesinin durumunu kontrol etme

Tüm bileşenlerin çalışır durumda olduğundan emin olmak için minikube kümesinin durumunu doğrulayın.

```shell
minikube status
```

Yukarıdaki komutun çıktısı, aşağıdaki örnek çıktıda gösterildiği gibi tüm bileşenlerin Running
veya Configured durumunda olduğunu göstermelidir:

```
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

## Panoyu Açma

Kubernetes panosunu açın. Bunu iki farklı şekilde yapabilirsiniz:

{{< tabs name="dashboard" >}}
{{% tab name="Bir tarayıcı başlat" %}}
**Yeni** bir terminal açın ve şunu çalıştırın:
```shell
# Yeni bir terminal başlatın ve bunu çalışır durumda bırakın.
minikube dashboard
```

Şimdi `minikube start` komutunu çalıştırdığınız terminale geri dönün.

{{< note >}}
`dashboard` komutu, pano eklentisini etkinleştirir ve proxy'yi varsayılan web tarayıcısında açar.
Panoda Dağıtım ve Hizmet gibi Kubernetes kaynakları oluşturabilirsiniz.

Tarayıcıyı doğrudan terminalden çağırmaktan kaçınma ve web panosu için bir URL alma hakkında
bilgi almak için "URL kopyala ve yapıştır" sekmesine bakın.

Varsayılan olarak panoya yalnızca dahili Kubernetes sanal ağından erişilebilir.
`dashboard` komutu, panoya Kubernetes sanal ağının dışından erişilebilir kılmak için geçici
bir proxy oluşturur.

Proxy'yi durdurmak için `Ctrl+C` tuşlarına basarak süreçten çıkın.
Komut çıktıktan sonra, pano Kubernetes kümesinde çalışmaya devam eder.
Panoya erişmek için başka bir proxy oluşturmak amacıyla `dashboard` komutunu yeniden çalıştırabilirsiniz.
{{< /note >}}

{{% /tab %}}
{{% tab name="URL kopyala ve yapıştır" %}}

minikube'un sizin için bir web tarayıcısı açmasını istemiyorsanız, `dashboard` alt komutunu
`--url` bayrağıyla çalıştırın. `minikube`, tercih ettiğiniz tarayıcıda açabileceğiniz bir URL üretir.

**Yeni** bir terminal açın ve şunu çalıştırın:
```shell
# Yeni bir terminal başlatın ve bunu çalışır durumda bırakın.
minikube dashboard --url
```

Şimdi bu URL'yi kullanabilir ve `minikube start` komutunu çalıştırdığınız terminale geri dönebilirsiniz.

{{% /tab %}}
{{< /tabs >}}

## Bir Dağıtım Oluşturma

Bir Kubernetes [*Pod'u*](/docs/concepts/workloads/pods/), yönetim ve ağ amacıyla birbirine bağlı
bir veya daha fazla Konteynerden oluşan bir gruptur. Bu eğitimdeki Pod yalnızca bir Konteyner içerir.
Bir Kubernetes [*Dağıtımı*](/docs/concepts/workloads/controllers/deployment/), Pod'unuzun sağlığını
kontrol eder ve Pod'un Konteyneri sonlanırsa onu yeniden başlatır. Dağıtımlar, Pod'ların oluşturulmasını
ve ölçeklendirilmesini yönetmek için önerilen yoldur.

1. Bir Pod'u yöneten bir Dağıtım oluşturmak için `kubectl create` komutunu kullanın. Pod,
   sağlanan Docker imajına dayalı bir Konteyner çalıştırır.

    ```shell
    # Web sunucusu içeren bir test konteyner imajı çalıştır
    kubectl create deployment hello-node --image=registry.k8s.io/e2e-test-images/agnhost:2.53 -- /agnhost netexec --http-port=8080
    ```

1. Dağıtımı görüntüleyin:

    ```shell
    kubectl get deployments
    ```

    Çıktı şuna benzer:

    ```
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1/1     1            1           1m
    ```

    (Pod'un kullanılabilir hale gelmesi biraz zaman alabilir. "0/1" görürseniz, birkaç saniye sonra tekrar deneyin.)

1. Pod'u görüntüleyin:

    ```shell
    kubectl get pods
    ```

    Çıktı şuna benzer:

    ```
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

1. Küme olaylarını görüntüleyin:

    ```shell
    kubectl get events
    ```

1. `kubectl` yapılandırmasını görüntüleyin:

    ```shell
    kubectl config view
    ```

1. Bir pod'daki konteyner için uygulama günlüklerini görüntüleyin (pod adını `kubectl get pods`'tan aldığınızla değiştirin).

   {{< note >}}
   `kubectl logs` komutundaki `hello-node-5f76cf6ccf-br9b5`'i `kubectl get pods` komut çıktısından gelen pod adıyla değiştirin.
   {{< /note >}}

   ```shell
   kubectl logs hello-node-5f76cf6ccf-br9b5
   ```

   Çıktı şuna benzer:

   ```
   I0911 09:19:26.677397       1 log.go:195] Started HTTP server on port 8080
   I0911 09:19:26.677586       1 log.go:195] Started UDP server on port  8081
   ```


{{< note >}}
`kubectl` komutları hakkında daha fazla bilgi için [kubectl genel bakış](/docs/reference/kubectl/) sayfasına bakın.
{{< /note >}}

## Bir Hizmet Oluşturma

Varsayılan olarak, Pod'a yalnızca Kubernetes kümesi içindeki dahili IP adresinden erişilebilir.
`hello-node` Konteyneri'ni Kubernetes sanal ağının dışından erişilebilir kılmak için, Pod'u bir
Kubernetes [*Hizmeti*](/docs/concepts/services-networking/service/) olarak açığa çıkarmanız gerekir.

{{< warning >}}
agnhost konteyneri, hata ayıklama için kullanışlı ancak genel internete açığa çıkarmak için
tehlikeli olan bir `/shell` uç noktasına sahiptir. Bunu internete açık bir kümede veya bir üretim
kümesinde çalıştırmayın.
{{< /warning >}}

1. `kubectl expose` komutunu kullanarak Pod'u genel internete açığa çıkarın:

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```

    `--type=LoadBalancer` bayrağı, Hizmetinizi kümenin dışına açığa çıkarmak istediğinizi belirtir.

    Test imajının içindeki uygulama kodu yalnızca TCP port 8080'i dinler. `kubectl expose`'u
    farklı bir port açığa çıkarmak için kullandıysanız, istemciler o diğer porta bağlanamaz.

2. Oluşturduğunuz Hizmeti görüntüleyin:

    ```shell
    kubectl get services
    ```

    Çıktı şuna benzer:

    ```
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

    Yük dengeleyicileri destekleyen bulut sağlayıcılarında, Hizmete erişmek için harici bir IP adresi
    sağlanır. minikube'da, `LoadBalancer` türü Hizmeti `minikube service` komutu aracılığıyla
    erişilebilir kılar.

3. Aşağıdaki komutu çalıştırın:

    ```shell
    minikube service hello-node
    ```

    Bu, uygulamanızı sunan ve uygulamanın yanıtını gösteren bir tarayıcı penceresi açar.

## Eklentileri etkinleştirme

minikube aracı, yerel Kubernetes ortamında etkinleştirilebilen, devre dışı bırakılabilen ve açılabilen
bir dizi yerleşik {{< glossary_tooltip text="eklenti" term_id="addons" >}} içerir.

1. Şu anda desteklenen eklentileri listeleyin:

    ```shell
    minikube addons list
    ```

    Çıktı şuna benzer:

    ```
    addon-manager: enabled
    dashboard: enabled
    default-storageclass: enabled
    efk: disabled
    freshpod: disabled
    gvisor: disabled
    helm-tiller: disabled
    ingress: disabled
    ingress-dns: disabled
    logviewer: disabled
    metrics-server: disabled
    nvidia-driver-installer: disabled
    nvidia-gpu-device-plugin: disabled
    registry: disabled
    registry-creds: disabled
    storage-provisioner: enabled
    storage-provisioner-gluster: disabled
    ```

1. Bir eklentiyi etkinleştirin, örneğin `metrics-server`:

    ```shell
    minikube addons enable metrics-server
    ```

    Çıktı şuna benzer:

    ```
    The 'metrics-server' addon is enabled
    ```

1. Bu eklentiyi kurarak oluşturduğunuz Pod ve Hizmeti görüntüleyin:

    ```shell
    kubectl get pod,svc -n kube-system
    ```

    Çıktı şuna benzer:

    ```
    NAME                                        READY     STATUS    RESTARTS   AGE
    pod/coredns-5644d7b6d9-mh9ll                1/1       Running   0          34m
    pod/coredns-5644d7b6d9-pqd2t                1/1       Running   0          34m
    pod/metrics-server-67fb648c5                1/1       Running   0          26s
    pod/etcd-minikube                           1/1       Running   0          34m
    pod/influxdb-grafana-b29w8                  2/2       Running   0          26s
    pod/kube-addon-manager-minikube             1/1       Running   0          34m
    pod/kube-apiserver-minikube                 1/1       Running   0          34m
    pod/kube-controller-manager-minikube        1/1       Running   0          34m
    pod/kube-proxy-rnlps                        1/1       Running   0          34m
    pod/kube-scheduler-minikube                 1/1       Running   0          34m
    pod/storage-provisioner                     1/1       Running   0          34m

    NAME                           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
    service/metrics-server         ClusterIP   10.96.241.45    <none>        80/TCP              26s
    service/kube-dns               ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP       34m
    service/monitoring-grafana     NodePort    10.99.24.54     <none>        80:30002/TCP        26s
    service/monitoring-influxdb    ClusterIP   10.111.169.94   <none>        8083/TCP,8086/TCP   26s
    ```

1. `metrics-server`'dan gelen çıktıyı kontrol edin:

    ```shell
    kubectl top pods
    ```

    Çıktı şuna benzer:

    ```
    NAME                         CPU(cores)   MEMORY(bytes)
    hello-node-ccf4b9788-4jn97   1m           6Mi
    ```

    Aşağıdaki mesajı görürseniz, bekleyin ve tekrar deneyin:

    ```
    error: Metrics API not available
    ```

1. `metrics-server`'ı devre dışı bırakın:

    ```shell
    minikube addons disable metrics-server
    ```

    Çıktı şuna benzer:

    ```
    metrics-server was successfully disabled
    ```

## Temizleme

Şimdi kümenizde oluşturduğunuz kaynakları temizleyebilirsiniz:

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

Minikube kümesini durdurun:

```shell
minikube stop
```

İsteğe bağlı olarak, Minikube VM'sini silin:

```shell
# İsteğe bağlı
minikube delete
```

Kubernetes hakkında daha fazla bilgi edinmek için minikube'u tekrar kullanmak isterseniz, silmenize gerek yoktur.

## Sonuç

Bu sayfa, bir minikube kümesinin nasıl çalıştırılacağına dair temel yönleri kapsadı. Artık uygulamaları dağıtmaya hazırsınız.

## {{% heading "whatsnext" %}}


* _[kubectl ile Kubernetes üzerinde ilk uygulamanızı dağıtma](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)_ eğitimi.
* [Dağıtım nesneleri](/docs/concepts/workloads/controllers/deployment/) hakkında daha fazla bilgi edinin.
* [Uygulamaları dağıtma](/docs/tasks/run-application/run-stateless-application-deployment/) hakkında daha fazla bilgi edinin.
* [Hizmet nesneleri](/docs/concepts/services-networking/service/) hakkında daha fazla bilgi edinin.
