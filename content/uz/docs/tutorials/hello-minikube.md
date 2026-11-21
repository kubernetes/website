---
title: Hello Minikube
content_type: tutorial
weight: 5
card:
  name: tutorials
  weight: 10
---

<!-- overview -->

Ushbu qoʻllanma minikube yordamida Kubernetesda namunaviy ilovani qanday ishga tushirishni koʻrsatadi.
Qoʻllanma barcha soʻrovlarni qaytarib berish uchun NGINXʼdan foydalanadigan konteyner obrazini beradi.

## {{% heading "objectives" %}} {#objectives}

* Namunaviy ilovani minikubeʼga joylashtirish.
* Ilovani ishga tushirish.
* Ilova jurnallarini koʻrish.

## {{% heading "prerequisites" %}} {#before-you-begin}


Ushbu qoʻllanma `minikube` allaqachon sozlangan deb hisoblaydi.
Oʻrnatish boʻyicha koʻrsatmalar uchun [minikube start](https://minikube.sigs.k8s.io/docs/start/) sahifasidagi __Step 1__ ga qarang.
{{< alert color="info" title="Eslatma" >}}
Faqat __Step 1, Installation__ boʻlimidagi koʻrsatmalarni bajaring. Qolgan qismi ushbu sahifada yoritiladi.
{{< /alert >}}

`kubectl` ni ham oʻrnatishingiz kerak.
Oʻrnatish boʻyicha koʻrsatmalar uchun [Vositalarni oʻrnatish](/docs/tasks/tools/#kubectl) sahifasiga qarang.


<!-- lessoncontent -->

## minikube klasterini yaratish {#create-a-minikube-cluster}

```shell
minikube start
```

{{< alert color="info" title="Eslatma" >}}
`minikube start` buyrugʻi bitta Nodeʼli klaster yaratadi. Bu Node ham boshqaruv tekisligi, ham ishchi Node vazifasini bajaradi. Bu koʻpchilik ishlab chiqarish Kubernetes klasterlaridan farq qiladi: ularda boshqaruv tekisligi Nodeʼlari odatda ishchi Nodeʼdan
[taintlar](/docs/concepts/scheduling-eviction/taint-and-toleration/) yordamida ajratiladi yoki foydalanuvchiga umuman koʻrinmaydi.
{{< /alert >}}

## minikube klasteri holatini tekshirish {#check-the-status-of-the-minikube-cluster}

Barcha komponentlar ishlayotgan holatda ekaniga ishonch hosil qilish uchun minikube klasteri holatini tekshiring.

```shell
minikube status
```
Yuqoridagi buyruq chiqishi barcha komponentlarni Running yoki Configured holatida koʻrsatishi kerak. Quyida namunaviy chiqish keltirilgan:

```
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

## Dashboardʼni ochish {#open-the-dashboard}

Kubernetes Dashboardʼini oching. Buni ikki xil usulda qilish mumkin:

{{< tabs name="dashboard" >}}
{{% tab name="Brauzerni ochish" %}}
**Yangi** terminal oching va quyidagini bajaring:
```shell
# Start a new terminal, and leave this running.
minikube dashboard
```

Endi `minikube start` ni bajargan terminalga qayting.

{{< alert color="info" title="Eslatma" >}}
`dashboard` buyrugʻi dashboard qoʻshimchasini yoqadi va proksini odatiy veb-brauzerda ochadi.
Dashboardʼda Deployment va Service kabi Kubernetes resurslarini yaratishingiz mumkin.

Brauzerni terminaldan bevosita chaqirmaslik va veb-dashboard uchun URL olish usulini bilish uchun «URLni nusxalash va qoʻyish» yorligʻiga qarang.

Odatiy holda dashboard faqat ichki Kubernetes virtual tarmogʻidan ochiladi.
`dashboard` buyrugʻi dashboardʼni Kubernetes virtual tarmogʻidan tashqarida ochish uchun vaqtinchalik proksi yaratadi.

Proksini toʻxtatish uchun jarayondan chiqishga `Ctrl+C` ni bajaring.
Buyruq tugagach, dashboard Kubernetes klasterida ishlashda davom etadi.
Dashboardʼga kirish uchun yana bir proksi yaratishga `dashboard` buyrugʻini qayta bajaring.
{{< /alert >}}

{{% /tab %}}
{{% tab name="URLni nusxalash va qoʻyish" %}}

minikube siz uchun veb-brauzer ochmasligini istasangiz, `dashboard` quyi buyrugʻini
`--url` bayrogʻi bilan bajaring. `minikube` siz xohlagan brauzerda ochishingiz mumkin boʻlgan URL chiqaradi.

**Yangi** terminal oching va quyidagini bajaring:
```shell
# Start a new terminal, and leave this running.
minikube dashboard --url
```

Endi shu URLdan foydalanib, `minikube start` ni bajargan terminalga qaytishingiz mumkin.

{{% /tab %}}
{{< /tabs >}}

## Deployment yaratish {#create-a-deployment}

Kubernetes [*Pod*](/docs/concepts/workloads/pods/)i — boshqaruv va tarmoq maqsadida bir-biriga
bogʻlangan bir yoki bir nechta konteyner guruhi. Ushbu qoʻllanmadagi Podʼda faqat bitta
konteyner bor. Kubernetes [*Deployment*](/docs/concepts/workloads/controllers/deployment/)i
Podʼingiz sogʻligʻini tekshiradi va Pod konteyneri tugasa, uni qayta ishga tushiradi.
Deploymentʼlar Podʼlarni yaratish va masshtablashni boshqarishning tavsiya etilgan usulidir.

1. Podʼni boshqaradigan Deployment yaratish uchun `kubectl create` buyrugʻidan foydalaning.
   Pod berilgan Docker obraziga asoslangan konteynerni ishga tushiradi.

    ```shell
    # Run a test container image that includes a webserver
    kubectl create deployment hello-node --image=registry.k8s.io/e2e-test-images/agnhost:2.53 -- /agnhost netexec --http-port=8080
    ```

1. Deploymentʼni koʻring:

    ```shell
    kubectl get deployments
    ```

    Chiqish shunga oʻxshash:

    ```
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1/1     1            1           1m
    ```

    (Pod mavjud boʻlishi biroz vaqt olishi mumkin. Agar «0/1» ni koʻrsangiz, bir necha soniyadan soʻng yana urinib koʻring.)

1. Podʼni koʻring:

    ```shell
    kubectl get pods
    ```

    Chiqish shunga oʻxshash:

    ```
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

1. Klaster hodisalarini koʻring:

    ```shell
    kubectl get events
    ```

1. `kubectl` konfiguratsiyasini koʻring:

    ```shell
    kubectl config view
    ```

1. Pod ichidagi konteynerning ilova jurnallarini koʻring (Pod nomini `kubectl get pods` dan olgan nom bilan almashtiring).

   {{< alert color="info" title="Eslatma" >}}
   `kubectl logs` buyrugʻidagi `hello-node-5f76cf6ccf-br9b5` ni `kubectl get pods` buyrugʻi chiqishidagi Pod nomi bilan almashtiring.
   {{< /alert >}}

   ```shell
   kubectl logs hello-node-5f76cf6ccf-br9b5
   ```

   Chiqish shunga oʻxshash:

   ```
   I0911 09:19:26.677397       1 log.go:195] Started HTTP server on port 8080
   I0911 09:19:26.677586       1 log.go:195] Started UDP server on port  8081
   ```


{{< alert color="info" title="Eslatma" >}}
`kubectl` buyruqlari haqida batafsil maʼlumot uchun [kubectl sharhi](/docs/reference/kubectl/) ga qarang.
{{< /alert >}}

## Service yaratish {#create-a-service}

Odatiy holda Pod faqat Kubernetes klasteri ichidagi ichki IP manzili orqali ochiladi.
`hello-node` konteynerini Kubernetes virtual tarmogʻidan tashqarida ochish uchun Podʼni
Kubernetes [*Service*](/docs/concepts/services-networking/service/)i sifatida ochishingiz kerak.

{{< alert color="danger" title="Ogohlantirish" >}}
agnhost konteynerida nosozliklarni aniqlash uchun foydali, lekin ommaviy internetga
ochish xavfli boʻlgan `/shell` nuqtasi bor. Buni internetga qaragan klasterda yoki
ishlab chiqarish klasterida ishga tushirmang.
{{< /alert >}}

1. Podʼni ommaviy internetga ochish uchun `kubectl expose` buyrugʻidan foydalaning:

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```

    `--type=LoadBalancer` bayrogʻi Serviceʼingizni klaster tashqarisiga ochmoqchi ekaningizni bildiradi.

    Sinov obrazi ichidagi ilova kodi faqat TCP 8080-portini tinglaydi. Agar boshqa portni ochish uchun
    `kubectl expose` dan foydalangan boʻlsangiz, mijozlar oʻsha boshqa portga ulana olmas edi.

2. Yaratgan Serviceʼingizni koʻring:

    ```shell
    kubectl get services
    ```

    Chiqish shunga oʻxshash:

    ```
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

    Yuk taqsimlovchilarni qoʻllab-quvvatlaydigan bulut provayderlarida
    Serviceʼga kirish uchun tashqi IP manzil ajratiladi. minikubeʼda
    `LoadBalancer` turi Serviceʼni `minikube service` buyrugʻi orqali ochadi.

3. Quyidagi buyruqni bajaring:

    ```shell
    minikube service hello-node
    ```

    Bu ilovangizni koʻrsatadigan va ilova javobini chiqaradigan brauzer oynasini ochadi.

## Qoʻshimchalarni yoqish {#enable-addons}

minikube vositasida mahalliy Kubernetes muhitida yoqish, oʻchirish va ochish mumkin boʻlgan oʻrnatilgan {{< glossary_tooltip text="qoʻshimchalar" term_id="addons" >}} toʻplami bor.

1. Hozir qoʻllab-quvvatlanadigan qoʻshimchalarni roʻyxatlang:

    ```shell
    minikube addons list
    ```

    Chiqish shunga oʻxshash:

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

1. Qoʻshimchani yoqing, masalan `metrics-server`:

    ```shell
    minikube addons enable metrics-server
    ```

    Chiqish shunga oʻxshash:

    ```
    The 'metrics-server' addon is enabled
    ```

1. Shu qoʻshimchani oʻrnatish orqali yaratgan Pod va Serviceʼingizni koʻring:

    ```shell
    kubectl get pod,svc -n kube-system
    ```

    Chiqish shunga oʻxshash:

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

1. `metrics-server` chiqishini tekshiring:

    ```shell
    kubectl top pods
    ```

    Chiqish shunga oʻxshash:

    ```
    NAME                         CPU(cores)   MEMORY(bytes)
    hello-node-ccf4b9788-4jn97   1m           6Mi
    ```

    Agar quyidagi xabarni koʻrsangiz, kuting va yana urinib koʻring:

    ```
    error: Metrics API not available
    ```

1. `metrics-server` ni oʻchiring:

    ```shell
    minikube addons disable metrics-server
    ```

    Chiqish shunga oʻxshash:

    ```
    metrics-server was successfully disabled
    ```

## Tozalash {#clean-up}

Endi klasteringizda yaratgan resurslarni tozalashingiz mumkin:

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

Minikube klasterini toʻxtating

```shell
minikube stop
```

Ixtiyoriy ravishda Minikube virtual mashinasini oʻchiring:

```shell
# Optional
minikube delete
```

Agar Kubernetes haqida koʻproq oʻrganish uchun minikubeʼdan yana foydalanmoqchi boʻlsangiz, uni oʻchirish shart emas.

## Xulosa {#conclusion}

Ushbu sahifa minikube klasterini ishga tushirishning asosiy jihatlarini qamrab oldi. Endi ilovalarni joylashtirishga tayyorsiz.

## {{% heading "whatsnext" %}} {#what-s-next}


* _[kubectl yordamida Kubernetesda birinchi ilovangizni joylashtirish](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)_ qoʻllanmasi.
* [Deployment obyektlari](/docs/concepts/workloads/controllers/deployment/) haqida batafsil.
* [Ilovalarni joylashtirish](/docs/tasks/run-application/run-stateless-application-deployment/) haqida batafsil.
* [Service obyektlari](/docs/concepts/services-networking/service/) haqida batafsil.
