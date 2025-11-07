---
min-kubernetes-server-version: v1.29
title: Розширення діапазонів IP Service
content_type: task
weight: 20
---

<!-- overview -->

{{< feature-state feature_gate_name="MultiCIDRServiceAllocator" >}}

У цьому документі описано, як розширити наявний діапазон IP-адрес, призначених Serviceʼу в кластері.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

{{< version-check >}}

{{< note >}}
Хоча ви можете використовувати цю функцію в більш ранніх версіях, вона доступна лише в GA і офіційно підтримується починаючи з версії 1.33.
{{< /note >}}

<!-- steps -->

## Розширені діапазони Service IP {#extend-service-ip-ranges}

Кластери Kubernetes з kube-apiservers, у яких увімкнено [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `MultiCIDRServiceAllocator` та API група `networking.k8s.io/v1`, створюватимуть обʼєкт ServiceCIDR, який має відоме імʼя `kubernetes`, та визначатимуть діапазон IP-адрес, заснований на значенні аргументу командного рядка `--service-cluster-ip-range` для kube-apiserver.

```shell
kubectl get servicecidr
```

```none
NAME         CIDRS          AGE
kubernetes   10.96.0.0/28   17d
```

Відомий сервіс `kubernetes`, який використовується для відкриття точки доступу kube-apiserver для Podʼів, обчислює першу IP-адресу зі стандартного діапазону ServiceCIDR та використовує цю IP-адресу як свою кластерну IP-адресу.

```sh
kubectl get service kubernetes
```

```none
NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   17d
```

Стандартний Service у цьому випадку використовує ClusterIP 10.96.0.1, що має відповідний обʼєкт IPAddress.

```sh
kubectl get ipaddress 10.96.0.1
```

```none
NAME        PARENTREF
10.96.0.1   services/default/kubernetes
```

ServiceCIDRs захищені за допомогою {{<glossary_tooltip text="завершувачів" term_id="finalizer">}}, щоб уникнути залишання Service ClusterIPs сиріт; завершувач видаляється лише в разі, якщо існує інша підмережа, яка містить наявні IP-адреси або немає IP-адрес, що належать до підмережі.

## Розширення кількості доступних IP для Service {#extend-the-number-of-available-ips-for-services}

Існують випадки, коли користувачам потрібно збільшити кількість доступних адрес для Serviceʼів; раніше, збільшення діапазону Service було руйнівною операцією, яка також може призвести до втрати даних. З цією новою функцією користувачам потрібно лише додати новий ServiceCIDR, щоб збільшити кількість доступних адрес.

### Додавання нового ServiceCIDR {#adding-a-new-servicecidr}

У кластері з діапазоном 10.96.0.0/28 для Serviceʼів доступно лише 2^(32-28) - 2 = 14 IP-адрес. Service `kubernetes.default` завжди створюється; для цього прикладу у вас залишається лише 13 можливих Serviceʼів.

```shell
for i in $(seq 1 13); do kubectl create service clusterip "test-$i" --tcp 80 -o json | jq -r .spec.clusterIP; done
```

```none
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

Ви можете збільшити кількість IP-адрес, доступних для Serviceʼів, створивши новий ServiceCIDR, який розширює або додає нові діапазони IP-адрес.

```shell
cat <EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: ServiceCIDR
metadata:
  name: newcidr1
spec:
  cidrs:
  - 10.96.0.0/24
EOF
```

```none
servicecidr.networking.k8s.io/newcidr1 created
```

це дозволить вам створювати нові Service з ClusterIP, які будуть вибрані з цього нового діапазону.

```shell
for i in $(seq 13 16); do kubectl create service clusterip "test-$i" --tcp 80 -o json | jq -r .spec.clusterIP; done
```

```none
10.96.0.48
10.96.0.200
10.96.0.121
10.96.0.144
```

### Видалення ServiceCIDR {#deleting-a-servicecidr}

Ви не можете видалити ServiceCIDR, якщо існують IP-адреси, які залежать від ServiceCIDR.

```shell
kubectl delete servicecidr newcidr1
```

```none
servicecidr.networking.k8s.io "newcidr1" deleted
```

Kubernetes використовує завершувач на ServiceCIDR для відстеження цього залежного відношення.

```shell
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

Видаляючи Serviceʼи, що містять IP-адреси, які блокують видалення ServiceCIDR

```sh
for i in $(seq 13 16); do kubectl delete service "test-$i" ; done
```

```none
service "test-13" deleted
service "test-14" deleted
service "test-15" deleted
service "test-16" deleted
```

панель управління помічає видалення. Панель управління потім видаляє свій завершувач, так що ServiceCIDR, який був у черзі на видалення, фактично буде видалено.

```shell
kubectl get servicecidr newcidr1
```

```none
Error from server (NotFound): servicecidrs.networking.k8s.io "newcidr1" not found
```

## Політики Kubernetes Service CIDR {#kubernetes-service-cidr-policies}

Адміністратори кластера можуть застосовувати політики для керування створенням і зміною ресурсів ServiceCIDR у кластері. Це дозволяє централізовано керувати діапазонами IP-адрес, які використовуються для Services, і допомагає запобігти ненавмисним або конфліктним конфігураціям. Kubernetes надає такі механізми, як Validating Admission Policies (Перевірка політик допуску) для забезпечення дотримання цих правил.

### Запобігання несанкціонованому створенню/оновленню ServiceCIDR з використанням політики перевірки допуску {#preventing-unauthorized-servicecidr-creation-update-using-validating-admission-policy}

Бувають ситуації, коли адміністратори кластера хочуть обмежити діапазони, які можна дозволити, або повністю заборонити будь-які зміни в діапазонах IP-адрес Service кластера.

{{< note >}}
Стандартний ServiceCIDR "kubernetes" створюється kube-apiserver для забезпечення узгодженості у кластері і є необхідним для роботи кластера, тому він завжди має бути дозволений. Ви можете переконатися, що ваша `ValidatingAdmissionPolicy` не обмежує стандартно ServiceCIDR, додавши цей пункт:

```yaml
  matchConditions:
  - name: 'exclude-default-servicecidr'
    expression: "object.metadata.name != 'kubernetes'"
```

як в прикладі нижче.
{{</ note >}}

#### Обмеження діапазонів Service CIDR конкретними діапазонами {#restrict-service-cidr-ranges-to-some-specific-ranges}

Нижче наведено приклад політики `ValidatingAdmissionPolicy`, яка дозволяє створювати ServiceCIDR, тільки якщо вони є піддіапазонами заданих `allowed` діапазонів. (Таким чином, у прикладі політики буде дозволено створення ServiceCIDR з `cidrs: ['10.96.1.0/24']` або `cidrs: ['2001:db8:0:0:ffff::/80', '10.96.0.0/20']` але не дозволить ServiceCIDR з `cidrs: ['172.20.0.0/16']`.) Ви можете скопіювати цю політику і змінити значення `allowed` на відповідне для вашого кластера.

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "servicecidrs.default"
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups:   ["networking.k8s.io"]
      apiVersions: ["v1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["servicecidrs"]
  matchConditions:
  - name: 'exclude-default-servicecidr'
    expression: "object.metadata.name != 'kubernetes'"
  variables:
  - name: allowed
    expression: "['10.96.0.0/16','2001:db8::/64']"
  validations:
  - expression: "object.spec.cidrs.all(newCIDR, variables.allowed.exists(allowedCIDR, cidr(allowedCIDR).containsCIDR(newCIDR)))"
  # Для всіх CIDR (newCIDR), перерахованих в spec.cidrs переданого обʼєкту ServiceCIDR
  # перевірити, чи існує хоча б один CIDR (allowedCIDR) у списку `allowed`.
  # списку VAP такий, що allowedCIDR повністю містить newCIDR.
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: "servicecidrs-binding"
spec:
  policyName: "servicecidrs.default"
  validationActions: [Deny,Audit]
```

Зверніться до [документації CEL](/docs/reference/using-api/cel/), щоб дізнатися більше про CEL, якщо ви хочете написати власний валідаційний `expression`.

#### Обмеження будь-якого використання API ServiceCIDR {#restrict-any-usage-of-the-servicecidr-api}

Наступний приклад демонструє, як використовувати `ValidatingAdmissionPolicy` та її привʼязку для обмеження створення будь-яких нових діапазонів Service CIDR, окрім стандартного ServiceCIDR "kubernetes":

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "servicecidrs.deny"
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups:   ["networking.k8s.io"]
      apiVersions: ["v1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["servicecidrs"]
  validations:
  - expression: "object.metadata.name == 'kubernetes'"
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: "servicecidrs-deny-binding"
spec:
  policyName: "servicecidrs.deny"
  validationActions: [Deny,Audit]
```
