---
min-kubernetes-server-version: v1.29
title: Розширення діапазонів IP-адрес Service
content_type: task
weight: 20
---

<!-- overview -->

{{< feature-state feature_gate_name="MultiCIDRServiceAllocator" >}}

У цьому документі описано, як розширити наявний діапазон IP-адрес Service, призначений кластеру.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

{{< version-check >}}

{{< note >}}
Хоча цю можливість можна використовувати в раніших версіях, вона є GA й офіційно підтримується лише з v1.33.
{{< /note >}}

<!-- steps -->

## Розширення діапазонів IP-адрес Service {#extend-service-ip-ranges}

Панель управління забезпечує наявність спеціального обʼєкта ServiceCIDR із загальновідомою назвою `kubernetes`, який визначає діапазон IP-адрес на основі значення аргументу командного рядка `--service-cluster-ip-range` для kube-apiserver.

```sh
kubectl get servicecidr
```

```
NAME         CIDRS          AGE
kubernetes   10.96.0.0/28   17d
```

Загальновідомий Service `kubernetes`, який відкриває Podʼам доступ до точки доступу kube-apiserver, обчислює першу IP-адресу зі стандартного діапазону ServiceCIDR і використовує її як свою кластерну IP-адресу.

```sh
kubectl get service kubernetes
```

```
NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   17d
```

Стандартний Service у цьому випадку використовує ClusterIP 10.96.0.1, що має відповідний обʼєкт IPAddress.

```sh
kubectl get ipaddress 10.96.0.1
```

```
NAME        PARENTREF
10.96.0.1   services/default/kubernetes
```

ServiceCIDRs захищені {{<glossary_tooltip text="завершувачами" term_id="finalizer">}}, щоб ClusterIP у Service не лишалися без батьківського обʼєкта; завершувач вилучається лише тоді, коли існує інша підмережа з наявними IPAddresses або немає IPAddresses, що належать до цієї підмережі.

## Розширення кількості доступних IP-адрес для Services {#extend-the-number-of-available-ips-for-services}

Іноді користувачам потрібно збільшити кількість адрес, доступних для Services. Раніше збільшення діапазону Service було операцією з порушенням роботи, яка також могла спричинити втрату даних. Завдяки цій новій можливості користувачам достатньо додати новий ServiceCIDR, щоб збільшити кількість доступних адрес.

### Додавання нового ServiceCIDR {#adding-a-new-servicecidr}

У кластері з діапазоном 10.96.0.0/28 для Services доступно лише 2^(32-28) - 2 = 14 IP-адрес. Service `kubernetes.default` створюється завжди; у цьому прикладі лишається лише 13 можливих Services.

```sh
for i in $(seq 1 13); do kubectl create service clusterip "test-$i" --tcp 80 -o json | jq -r .spec.clusterIP; done
```

```
10.96.0.11
10.96.0.5
10.96.0.12
10.96.0.13
10.96.0.14
10.96.0.2
10.96.0.3
10.96.0.4
10.96.0.6
10.96.0.7
10.96.0.8
10.96.0.9
error: failed to create ClusterIP service: Internal error occurred: failed to allocate a serviceIP: range is full
```

Ви можете збільшити кількість IP-адрес, доступних для Services, створивши новий ServiceCIDR, який розширює наявні або додає нові діапазони IP-адрес.

```sh
cat <<EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: ServiceCIDR
metadata:
  name: newcidr1
spec:
  cidrs:
  - 10.96.0.0/24
EOF
```

```
servicecidr.networking.k8s.io/newcidr1 created
```

і це дозволить створювати нові Services з ClusterIP, вибраними з цього нового діапазону.

```sh
for i in $(seq 13 16); do kubectl create service clusterip "test-$i" --tcp 80 -o json | jq -r .spec.clusterIP; done
```

```
10.96.0.48
10.96.0.200
10.96.0.121
10.96.0.144
```

### Видалення ServiceCIDR {#deleting-a-servicecidr}

Ви не можете видалити ServiceCIDR, якщо є IPAddresses, які залежать від цього ServiceCIDR.

```sh
kubectl delete servicecidr newcidr1
```

```
servicecidr.networking.k8s.io "newcidr1" deleted
```

Kubernetes використовує завершувач на ServiceCIDR, щоб відстежувати цю залежність.

```sh
kubectl get servicecidr newcidr1 -o yaml
```

```yaml
apiVersion: networking.k8s.io/v1
kind: ServiceCIDR
metadata:
  creationTimestamp: "2023-10-12T15:11:07Z"
  deletionGracePeriodSeconds: 0
  deletionTimestamp: "2023-10-12T15:12:45Z"
  finalizers:
  - networking.k8s.io/service-cidr-finalizer
  name: newcidr1
  resourceVersion: "1133"
  uid: 5ffd8afe-c78f-4e60-ae76-cec448a8af40
spec:
  cidrs:
  - 10.96.0.0/24
status:
  conditions:
  - lastTransitionTime: "2023-10-12T15:12:45Z"
    message: There are still IPAddresses referencing the ServiceCIDR, please remove
      them or create a new ServiceCIDR
    reason: OrphanIPAddress
    status: "False"
    type: Ready
```

Видаляючи Services з IP-адресами, які блокують видалення ServiceCIDR,

```sh
for i in $(seq 13 16); do kubectl delete service "test-$i" ; done
```

```
service "test-13" deleted
service "test-14" deleted
service "test-15" deleted
service "test-16" deleted
```

панель управління помічає це видалення. Потім панель управління вилучає свій завершувач, і ServiceCIDR, що очікував на видалення, справді буде видалено.

```sh
kubectl get servicecidr newcidr1
```

```
Error from server (NotFound): servicecidrs.networking.k8s.io "newcidr1" not found
```

## Політики Service CIDR у Kubernetes {#kubernetes-service-cidr-policies}

Адміністратори кластера можуть застосовувати політики для контролю створення й зміни ресурсів ServiceCIDR у кластері. Це дає змогу централізовано керувати діапазонами IP-адрес, які використовуються для Services, і запобігає ненавмисним або конфліктним конфігураціям. Kubernetes надає для застосування цих правил такі механізми, як валідаційні політики допуску (Validating Admission Policies).

### Запобігання несанкціонованому створенню й оновленню ServiceCIDR за допомогою валідаційної політики допуску {#preventing-unauthorized-servicecidr-creation-update-using-validating-admission-policy}

Іноді адміністратори кластера хочуть обмежити дозволені діапазони або повністю заборонити будь-які зміни діапазонів IP-адрес Service кластера.

{{< note >}}
Стандартний ServiceCIDR "kubernetes" створюється kube-apiserver для забезпечення узгодженості в кластері й потрібен для роботи кластера, тому його завжди потрібно дозволяти. Щоб `ValidatingAdmissionPolicy` не обмежувала стандартний ServiceCIDR, додайте таку умову:

```yaml
  matchConditions:
  - name: 'exclude-default-servicecidr'
    expression: "object.metadata.name != 'kubernetes'"
```

як у наведених нижче прикладах.
{{</ note >}}

#### Обмеження діапазонів Service CIDR конкретними діапазонами {#restrict-service-cidr-ranges-to-some-specific-ranges}

Нижче наведено приклад `ValidatingAdmissionPolicy`, яка дозволяє створювати ServiceCIDR, лише якщо вони є піддіапазонами заданих діапазонів `allowed`. (Отже, ця політика дозволить ServiceCIDR з `cidrs: ['10.96.1.0/24']` або `cidrs: ['2001:db8:0:0:ffff::/80', '10.96.0.0/20']`, але не дозволить ServiceCIDR з `cidrs: ['172.20.0.0/16']`.) Ви можете скопіювати цю політику й змінити значення `allowed` на відповідне для вашого кластера.

{{% code_sample file="service/networking/vap-servicecidr-default.yaml" %}}

Щоб дізнатися більше про CEL і написати власний `expression` для валідації, дивіться [документацію CEL](https://kubernetes.io/docs/reference/using-api/cel/).

#### Обмеження будь-якого використання API ServiceCIDR {#restrict-any-usage-of-the-servicecidr-api}

Наведений нижче приклад показує, як використовувати `ValidatingAdmissionPolicy` та її привʼязку, щоб обмежити створення будь-яких нових діапазонів Service CIDR, окрім стандартного ServiceCIDR "kubernetes":

{{% code_sample file="service/networking/vap-servicecidr-deny.yaml" %}}
