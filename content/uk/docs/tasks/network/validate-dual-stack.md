---
min-kubernetes-server-version: v1.23
title: Перевірка наявності підтримки подвійного стеку IPv4/IPv6
content_type: task
weight: 30
---

<!-- overview -->

Цей документ розповідає, як перевірити підтримку dual-stack IPv4/IPv6 в увімкнених кластерах Kubernetes.

## {{% heading "prerequisites" %}}

* Підтримка постачальника для мереж з підтримкою подвійного стека (постачальник хмарних послуг або інший постачальник повинен забезпечити вузлам Kubernetes мережеві інтерфейси з маршрутними IPv4/IPv6)
* [Втулок мережі](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/), який підтримує dual-stack мережу.
* [Увімкнений подвійний стек](/docs/concepts/services-networking/dual-stack/) кластер

{{< version-check >}}

{{< note >}}
Хоча ви можете перевірити це за допомогою попередньої версії, функція доступна та офіційно підтримується лише починаючи з v1.23.
{{< /note >}}

<!-- steps -->

## Перевірка адресації {#validate-addressing}

### Перевірка адресування вузлів {#validate-node-addressing}

Кожен вузол з подвійним стеком має мати виділені один блок IPv4 та один блок IPv6. Перевірте, що діапазони адрес IPv4/IPv6 для Pod налаштовані за допомогою наступної команди. Замініть імʼя вузла з прикладу на наявний вузол з подвійним стеком у вашому кластері. У цьому прикладі імʼя вузла — `k8s-linuxpool1-34450317-0`:

```shell
kubectl get nodes k8s-linuxpool1-34450317-0 -o go-template --template='{{range .spec.podCIDRs}}{{printf "%s\n" .}}{{end}}'
```

```none
10.244.1.0/24
2001:db8::/64
```

Має бути виділено один блок IPv4 та один блок IPv6.

Перевірте, що на вузлі виявлено інтерфейс IPv4 та IPv6. Замініть імʼя вузла на дійсний вузол з кластера. У цьому прикладі імʼя вузла - `k8s-linuxpool1-34450317-0`:

```shell
kubectl get nodes k8s-linuxpool1-34450317-0 -o go-template --template='{{range .status.addresses}}{{printf "%s: %s\n" .type .address}}{{end}}'
```

```none
Hostname: k8s-linuxpool1-34450317-0
InternalIP: 10.0.0.5
InternalIP: 2001:db8:10::5
```

### Перевірка адресації Pod {#validate-pod-addressing}

Перевірте, що у Pod є призначена адреса IPv4 та IPv6. Замініть імʼя Pod на наявний Pod у вашому кластері. У цьому прикладі імʼя Pod - `pod01`:

```shell
kubectl get pods pod01 -o go-template --template='{{range .status.podIPs}}{{printf "%s\n" .ip}}{{end}}'
```

```none
10.244.1.4
2001:db8::4
```

Ви також можете перевірити IP-адреси Pod за допомогою Downward API через поле `.status.podIPs`. Наступний уривок показує, як ви можете використовувати IP-адреси Pod через змінну середовища з назвою `MY_POD_IPS` всередині контейнера.

```yaml
        env:
        - name: MY_POD_IPS
          valueFrom:
            fieldRef:
              fieldPath: status.podIPs
```

Наступна команда виводить значення змінної середовища `MY_POD_IPS` всередині контейнера. Значення — це кома, що розділяє список, який відповідає IPv4 та IPv6 адресам Pod.

```shell
kubectl exec -it pod01 -- set | grep MY_POD_IPS
```

```none
MY_POD_IPS=10.244.1.4,2001:db8::4
```

IP-адреси Pod також будуть записані в `/etc/hosts` всередині контейнера. Наступна команда виконує `cat` на `/etc/hosts` в Podʼі з подвійним стеком. З виводу ви можете перевірити як IPv4, так і IPv6 IP-адресу для Pod.

```shell
kubectl exec -it pod01 -- cat /etc/hosts
```

```none
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

### Перевірка Serviceʼів {#validate-services}

Створіть наступний Service, який не визначає явно `.spec.ipFamilyPolicy`. Kubernetes призначить кластерний IP для Service з першого налаштованого `service-cluster-ip-range` і встановить `.spec.ipFamilyPolicy` на `SingleStack`.

{{% code_sample file="service/networking/dual-stack-default-svc.yaml" %}}

Використовуйте `kubectl`, щоб переглянути YAML для Service.

```shell
kubectl get svc my-service -o yaml
```

У Service `.spec.ipFamilyPolicy` встановлено на `SingleStack`, а `.spec.clusterIP` встановлено на IPv4-адрес з першого налаштованого діапазону, встановленого за допомогою прапорця `--service-cluster-ip-range` на kube-controller-manager.

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

Створіть наступний Service, який явно визначає `IPv6` як перший елемент масиву в `.spec.ipFamilies`. Kubernetes призначить кластерний IP для Service з діапазону IPv6, налаштованого в `service-cluster-ip-range`, і встановить `.spec.ipFamilyPolicy` на `SingleStack`.

{{% code_sample file="service/networking/dual-stack-ipfamilies-ipv6.yaml" %}}

Використовуйте `kubectl`, щоб переглянути YAML для Service.

```shell
kubectl get svc my-service -o yaml
```

У Service `.spec.ipFamilyPolicy` встановлено на `SingleStack`, а `.spec.clusterIP` встановлено на IPv6-адрес з діапазону IPv6, налаштованого за допомогою прапорця `--service-cluster-ip-range` у kube-controller-manager.

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

Створіть наступний Service, який явно визначає `PreferDualStack` в `.spec.ipFamilyPolicy`. Kubernetes призначить як IPv4, так і IPv6 адреси кластера (оскільки в цьому кластері ввімкнено подвійний стек) і вибере `.spec.ClusterIP` зі списку `.spec.ClusterIPs` на основі сімʼї адрес, що вказана в першому елементі масиву `.spec.ipFamilies`.

{{% code_sample file="service/networking/dual-stack-preferred-svc.yaml" %}}

{{< note >}}
Команда `kubectl get svc` покаже лише основну IP-адресу в полі `CLUSTER-IP`.

```shell
kubectl get svc -l app.kubernetes.io/name=MyApp

NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
my-service   ClusterIP   10.0.216.242   <none>        80/TCP    5s
```

{{< /note >}}

Перевірте, що Service отримує кластерні IP з діапазонів IPv4 та IPv6, використовуючи `kubectl describe`. Потім ви можете перевірити доступ до Service за допомогою IP та портів.

```shell
kubectl describe svc -l app.kubernetes.io/name=MyApp
```

```none
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

### Створення Service з подвійним стеком для балансування навантаження

Якщо постачальник хмарних послуг підтримує надання зовнішніх балансувальників навантаження з підтримкою IPv6, створіть наступний Service з `PreferDualStack` в `.spec.ipFamilyPolicy`, `IPv6` як перший елемент масиву `.spec.ipFamilies`, а також встановіть поле `type` на `LoadBalancer`.

{{% code_sample file="service/networking/dual-stack-prefer-ipv6-lb-svc.yaml" %}}

Перевірка Service:

```shell
kubectl get svc -l app.kubernetes.io/name=MyApp
```

Перевірте, що Service отримує `CLUSTER-IP` адресу з блоку адрес IPv6 разом із `EXTERNAL-IP`. Потім ви можете перевірити доступ до Service за допомогою IP та портів.

```none
NAME         TYPE           CLUSTER-IP            EXTERNAL-IP        PORT(S)        AGE
my-service   LoadBalancer   2001:db8:fd00::7ebc   2603:1030:805::5   80:30790/TCP   35s
```
