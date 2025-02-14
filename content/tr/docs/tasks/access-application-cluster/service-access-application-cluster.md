---
title: Kümedeki Bir Uygulamaya Erişmek İçin Bir Servis Kullanma
content_type: tutorial
weight: 60
---

<!-- overview -->

Bu sayfa, bir kümede çalışan bir uygulamaya erişmek için harici
istemcilerin kullanabileceği bir Kubernetes Servis nesnesi oluşturmayı gösterir. Servis,
iki çalışan instance'a sahip bir uygulama için yük dengeleme sağlar.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

## {{% heading "objectives" %}}

- İki instance Hello World uygulaması çalıştırın.
- Bir node portu açığa çıkaran bir Servis nesnesi oluşturun.
- Çalışan uygulamaya erişmek için Servis nesnesini kullanın.

<!-- lessoncontent -->

## İki podda çalışan bir uygulama için bir servis oluşturma

İşte uygulama Dağıtımı için yapılandırma dosyası:

{{% code_sample file="service/access/hello-application.yaml" %}}

1. Kümenizde bir Hello World uygulaması çalıştırın:
   Yukarıdaki dosyayı kullanarak uygulama Dağıtımını oluşturun:

   ```shell
   kubectl apply -f https://k8s.io/examples/service/access/hello-application.yaml
   ```

   Önceki komut bir
   {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
   ve ilişkili bir
   {{< glossary_tooltip term_id="replica-set" text="ReplicaSet" >}}
   oluşturur. ReplicaSet, her biri Hello World uygulamasını çalıştıran iki
   {{< glossary_tooltip text="Pods" term_id="pod" >}}
   içerir.

1. Dağıtım hakkında bilgi görüntüleyin:

   ```shell
   kubectl get deployments hello-world
   kubectl describe deployments hello-world
   ```

1. ReplicaSet nesneleriniz hakkında bilgi görüntüleyin:

   ```shell
   kubectl get replicasets
   kubectl describe replicasets
   ```

1. Dağıtımı açığa çıkaran bir Servis nesnesi oluşturun:

   ```shell
   kubectl expose deployment hello-world --type=NodePort --name=example-service
   ```

1. Servis hakkında bilgi görüntüleyin:

   ```shell
   kubectl describe services example-service
   ```

   Çıktı buna benzer:

   ```none
   Name:                   example-service
   Namespace:              default
   Labels:                 run=load-balancer-example
   Annotations:            <none>
   Selector:               run=load-balancer-example
   Type:                   NodePort
   IP:                     10.32.0.16
   Port:                   <unset> 8080/TCP
   TargetPort:             8080/TCP
   NodePort:               <unset> 31496/TCP
   Endpoints:              10.200.1.4:8080,10.200.2.5:8080
   Session Affinity:       None
   Events:                 <none>
   ```

   Servis için NodePort değerini not edin. Örneğin,
   önceki çıktıda, NodePort değeri 31496'dır.

1. Hello World uygulamasını çalıştıran podları listeleyin:

   ```shell
   kubectl get pods --selector="run=load-balancer-example" --output=wide
   ```

   Çıktı buna benzer:

   ```none
   NAME                           READY   STATUS    ...  IP           NODE
   hello-world-2895499144-bsbk5   1/1     Running   ...  10.200.1.4   worker1
   hello-world-2895499144-m1pwt   1/1     Running   ...  10.200.2.5   worker2
   ```

1. Hello World podunu çalıştıran düğümlerinizden birinin genel IP adresini alın. Bu adresi nasıl alacağınız, kümenizi nasıl kurduğunuza bağlıdır. Örneğin, Minikube kullanıyorsanız, düğüm adresini `kubectl cluster-info` komutunu çalıştırarak görebilirsiniz. Google Compute Engine örneklerini kullanıyorsanız, düğümlerinizin genel adreslerini görmek için `gcloud compute instances list` komutunu kullanabilirsiniz.

1. Seçtiğiniz düğümde, düğüm portunuzda TCP trafiğine izin veren bir güvenlik duvarı kuralı oluşturun. Örneğin, Servisinizin NodePort değeri 31568 ise, 31568 numaralı portta TCP trafiğine izin veren bir güvenlik duvarı kuralı oluşturun. Farklı bulut sağlayıcıları, güvenlik duvarı kurallarını yapılandırmanın farklı yollarını sunar.

1. Hello World uygulamasına erişmek için düğüm adresini ve düğüm portunu kullanın:

   ```shell
   curl http://<public-node-ip>:<node-port>
   ```

   burada `<public-node-ip>` düğümünüzün genel IP adresi,
   ve `<node-port>` servisinizin NodePort değeridir. Başarılı bir isteğin yanıtı bir hello mesajıdır:

   ```none
   Hello, world!
   Version: 2.0.0
   Hostname: hello-world-cdd4458f4-m47c8
   ```

## Bir servis yapılandırma dosyası kullanma

`kubectl expose` kullanmaya alternatif olarak, bir
[servis yapılandırma dosyası](/docs/concepts/services-networking/service/)
kullanarak bir Servis oluşturabilirsiniz.

## {{% heading "cleanup" %}}

Servisi silmek için bu komutu girin:

    kubectl delete services example-service

Hello World uygulamasını çalıştıran Dağıtımı, ReplicaSet'i ve Podları silmek için bu komutu girin:

    kubectl delete deployment hello-world

## {{% heading "whatsnext" %}}

[Uygulamaları Servislerle Bağlama](/docs/tutorials/services/connect-applications-service/)
eğitimini takip edin.
