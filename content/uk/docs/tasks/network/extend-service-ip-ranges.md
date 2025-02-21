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

<!-- steps -->

## API

Кластери Kubernetes з kube-apiservers, у яких увімкнено [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `MultiCIDRServiceAllocator` та API група `networking.k8s.io/v1beta1`, створюватимуть обʼєкт ServiceCIDR, який має відоме імʼя `kubernetes`, та визначатимуть діапазон IP-адрес, заснований на значенні аргументу командного рядка `--service-cluster-ip-range` для kube-apiserver.

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
apiVersion: networking.k8s.io/v1beta1
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
apiVersion: networking.k8s.io/v1beta1
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
