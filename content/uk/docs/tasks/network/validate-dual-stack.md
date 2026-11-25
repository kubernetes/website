---
min-kubernetes-server-version: v1.23
title: Перевірка подвійного стека IPv4/IPv6
content_type: task
weight: 30
---

<!-- overview -->

У цьому документі описано, як перевірити кластери Kubernetes з увімкненим подвійним стеком IPv4/IPv6.

## {{% heading "prerequisites" %}} {#before-you-begin}

* Підтримка мереж із подвійним стеком з боку постачальника (хмарний провайдер або інший постачальник має забезпечити вузли Kubernetes маршрутизованими мережевими інтерфейсами IPv4/IPv6)
* [Мережевий втулок](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/), що підтримує мережі з подвійним стеком.
* Кластер з [увімкненим подвійним стеком](/docs/concepts/services-networking/dual-stack/)

{{< version-check >}}

{{< note >}}
Хоча перевірку можна виконати й на раніших версіях, ця можливість є GA й офіційно підтримується лише з v1.23.
{{< /note >}}

<!-- steps -->

## Перевірка адресації {#validate-addressing}

### Перевірка адресації вузлів {#validate-node-addressing}

Кожен вузол із подвійним стеком повинен мати виділений один блок IPv4 і один блок IPv6. Перевірте, що діапазони адрес Podʼів IPv4/IPv6 налаштовано, виконавши наведену нижче команду. Замініть назву вузла з прикладу на назву дійсного вузла з подвійним стеком у вашому кластері. У цьому прикладі назва вузла — `k8s-linuxpool1-34450317-0`:

```shell
kubectl get nodes k8s-linuxpool1-34450317-0 -o go-template --template='{{range .spec.podCIDRs}}{{printf "%s\n" .}}{{end}}'
```

```
10.244.1.0/24
2001:db8::/64
```

Має бути виділено один блок IPv4 та один блок IPv6.

Перевірте, що на вузлі виявлено інтерфейси IPv4 та IPv6. Замініть назву вузла на назву дійсного вузла з кластера. У цьому прикладі назва вузла — `k8s-linuxpool1-34450317-0`:

```shell
kubectl get nodes k8s-linuxpool1-34450317-0 -o go-template --template='{{range .status.addresses}}{{printf "%s: %s\n" .type .address}}{{end}}'
```

```
Hostname: k8s-linuxpool1-34450317-0
InternalIP: 10.0.0.5
InternalIP: 2001:db8:10::5
```

### Перевірка адресації Podʼів {#validate-pod-addressing}

Перевірте, що Podʼу призначено адреси IPv4 та IPv6. Замініть назву Podʼа на назву дійсного Podʼа у вашому кластері. У цьому прикладі назва Podʼа — `pod01`:

```shell
kubectl get pods pod01 -o go-template --template='{{range .status.podIPs}}{{printf "%s\n" .ip}}{{end}}'
```

```
10.244.1.4
2001:db8::4
```

Ви також можете перевірити IP-адреси Podʼа за допомогою Downward API через fieldPath `status.podIPs`. Наведений нижче фрагмент показує, як надати IP-адреси Podʼа контейнеру через змінну середовища `MY_POD_IPS`.

```yaml
        env:
        - name: MY_POD_IPS
          valueFrom:
            fieldRef:
              fieldPath: status.podIPs
```

Наведена нижче команда виводить значення змінної середовища `MY_POD_IPS` усередині контейнера. Значення — це список, розділений комами, який відповідає адресам IPv4 та IPv6 Podʼа.

```shell
kubectl exec -it pod01 -- set | grep MY_POD_IPS
```

```
MY_POD_IPS=10.244.1.4,2001:db8::4
```

IP-адреси Podʼа також записуються в `/etc/hosts` усередині контейнера. Наведена нижче команда виконує cat для `/etc/hosts` у Podʼі з подвійним стеком. З виводу можна перевірити адреси IPv4 та IPv6 Podʼа.

```shell
kubectl exec -it pod01 -- cat /etc/hosts
```

```
# Kubernetes-managed hosts file.
127.0.0.1    localhost
::1    localhost ip6-localhost ip6-loopback
fe00::0    ip6-localnet
fe00::0    ip6-mcastprefix
fe00::1    ip6-allnodes
fe00::2    ip6-allrouters
10.244.1.4    pod01
2001:db8::4    pod01
```

## Перевірка Services {#validate-services}

Створіть наведений нижче Service, який явно не визначає `.spec.ipFamilyPolicy`. Kubernetes призначить Service кластерний IP з першого налаштованого `service-cluster-ip-range` і встановить `.spec.ipFamilyPolicy` у `SingleStack`.

{{% code_sample file="service/networking/dual-stack-default-svc.yaml" %}}

Використайте `kubectl`, щоб переглянути YAML цього Service.

```shell
kubectl get svc my-service -o yaml
```

Service має `.spec.ipFamilyPolicy` зі значенням `SingleStack` і `.spec.clusterIP` з адресою IPv4 із першого налаштованого діапазону, заданого прапорцем `--service-cluster-ip-range` у kube-controller-manager.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
  namespace: default
spec:
  clusterIP: 10.0.217.164
  clusterIPs:
  - 10.0.217.164
  ipFamilies:
  - IPv4
  ipFamilyPolicy: SingleStack
  ports:
  - port: 80
    protocol: TCP
    targetPort: 9376
  selector:
    app.kubernetes.io/name: MyApp
  sessionAffinity: None
  type: ClusterIP
status:
  loadBalancer: {}
```

Створіть наведений нижче Service, який явно визначає `IPv6` як перший елемент масиву `.spec.ipFamilies`. Kubernetes призначить Service кластерний IP із діапазону IPv6, налаштованого в `service-cluster-ip-range`, і встановить `.spec.ipFamilyPolicy` у `SingleStack`.

{{% code_sample file="service/networking/dual-stack-ipfamilies-ipv6.yaml" %}}

Використайте `kubectl`, щоб переглянути YAML цього Service.

```shell
kubectl get svc my-service -o yaml
```

Service має `.spec.ipFamilyPolicy` зі значенням `SingleStack` і `.spec.clusterIP` з адресою IPv6 із діапазону IPv6, заданого прапорцем `--service-cluster-ip-range` у kube-controller-manager.

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: MyApp
  name: my-service
spec:
  clusterIP: 2001:db8:fd00::5118
  clusterIPs:
  - 2001:db8:fd00::5118
  ipFamilies:
  - IPv6
  ipFamilyPolicy: SingleStack
  ports:
  - port: 80
    protocol: TCP
    targetPort: 80
  selector:
    app.kubernetes.io/name: MyApp
  sessionAffinity: None
  type: ClusterIP
status:
  loadBalancer: {}
```

Створіть наведений нижче Service, який явно визначає `PreferDualStack` у `.spec.ipFamilyPolicy`. Kubernetes призначить адреси IPv4 та IPv6 (оскільки в цьому кластері ввімкнено подвійний стек) і вибере `.spec.ClusterIP` зі списку `.spec.ClusterIPs` на основі сімейства адрес першого елемента масиву `.spec.ipFamilies`.

{{% code_sample file="service/networking/dual-stack-preferred-svc.yaml" %}}

{{< note >}}
Команда `kubectl get svc` показує лише основну IP-адресу в полі `CLUSTER-IP`.

```shell
kubectl get svc -l app.kubernetes.io/name=MyApp
```

```
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
my-service   ClusterIP   10.0.216.242   <none>        80/TCP    5s
```
{{< /note >}}

Перевірте за допомогою `kubectl describe`, що Service отримує кластерні IP з блоків адрес IPv4 та IPv6. Потім можна перевірити доступ до сервісу через IP-адреси й порти.

```shell
kubectl describe svc -l app.kubernetes.io/name=MyApp
```

```
Name:              my-service
Namespace:         default
Labels:            app.kubernetes.io/name=MyApp
Annotations:       <none>
Selector:          app.kubernetes.io/name=MyApp
Type:              ClusterIP
IP Family Policy:  PreferDualStack
IP Families:       IPv4,IPv6
IP:                10.0.216.242
IPs:               10.0.216.242,2001:db8:fd00::af55
Port:              <unset>  80/TCP
TargetPort:        9376/TCP
Endpoints:         <none>
Session Affinity:  None
Events:            <none>
```

### Створення Service з подвійним стеком і балансуванням навантаження {#create-a-dual-stack-load-balanced-service}

Якщо хмарний провайдер підтримує надання зовнішніх балансувальників навантаження з підтримкою IPv6, створіть наведений нижче Service із `PreferDualStack` у `.spec.ipFamilyPolicy`, `IPv6` як першим елементом масиву `.spec.ipFamilies` і полем `type` зі значенням `LoadBalancer`.

{{% code_sample file="service/networking/dual-stack-prefer-ipv6-lb-svc.yaml" %}}

Перевірте Service:

```shell
kubectl get svc -l app.kubernetes.io/name=MyApp
```

Перевірте, що Service отримує адресу `CLUSTER-IP` із блоку адрес IPv6 разом з `EXTERNAL-IP`. Потім можна перевірити доступ до сервісу через IP-адресу й порт.

```
NAME         TYPE           CLUSTER-IP            EXTERNAL-IP        PORT(S)        AGE
my-service   LoadBalancer   2001:db8:fd00::7ebc   2603:1030:805::5   80:30790/TCP   35s
```
