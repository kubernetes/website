---
title: Конфігурування Redis за допомогою ConfigMap
content_type: tutorial
weight: 30
---

<!-- overview -->

Ця сторінка надає реальний приклад конфігурування Redis за допомогою ConfigMap і базується на завданні [Конфігурування Pod для використання ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/).

## {{% heading "objectives" %}}

* Створити ConfigMap з конфігураційними значеннями Redis
* Створити Pod з Redis, який монтує та використовує створений ConfigMap
* Перевірити, що конфігурація була правильно застосована.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* Приклад, показаний на цій сторінці, працює з `kubectl` версії 1.14 і вище.
* Розуміння [Конфігурування Pod для використання ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/).

<!-- lessoncontent -->

## Реальний приклад: Конфігурування Redis за допомогою ConfigMap {#real-world-example-configuring-redis-using-a-configmap}

Виконайте наведені нижче кроки для конфігурування кешу Redis за допомогою даних, збережених у ConfigMap.

Спершу створіть ConfigMap з порожнім блоком конфігурації:

```shell
cat <<EOF >./example-redis-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: example-redis-config
data:
  redis-config: ""
EOF
```

Застосуйте створений вище ConfigMap разом з маніфестом Podʼа Redis:

```shell
kubectl apply -f example-redis-config.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
```

Перегляньте вміст маніфесту Podʼа Redis і зверніть увагу на наступне:

* Том `config` створено за допомогою `spec.volumes[1]`
* Пара `key` і `path` у `spec.volumes[1].configMap.items[0]` експонує ключ `redis-config` з  `example-redis-config` ConfigMap як файл з назвою `redis.conf` у томі `config`.
* Том `config` потім монтується в `/redis-master` за допомогою `spec.containers[0].volumeMounts[1]`.

Це має загальний ефект експозиції даних з `data.redis-config` з `example-redis-config` ConfigMap як `/redis-master/redis.conf` всередині Pod.

{{% code_sample file="pods/config/redis-pod.yaml" %}}

Перегляньте створені обʼєкти:

```shell
kubectl get pod/redis configmap/example-redis-config
```

Ви повинні побачити наступний вивід:

```none
NAME        READY   STATUS    RESTARTS   AGE
pod/redis   1/1     Running   0          8s

NAME                             DATA   AGE
configmap/example-redis-config   1      14s
```

Нагадаємо, що ми залишили ключ `redis-config` у `example-redis-config` ConfigMap порожнім:

```shell
kubectl describe configmap/example-redis-config
```

Ви повинні побачити порожній ключ `redis-config`:

```shell
Name:         example-redis-config
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
redis-config:
```

Використовуйте `kubectl exec`, щоб увійти в Pod і запустити інструмент `redis-cli`, щоб перевірити поточну конфігурацію:

```shell
kubectl exec -it pod/redis -- redis-cli
```

Перевірте `maxmemory`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

Він має показати типове значення 0:

```shell
1) "maxmemory"
2) "0"
```

Аналогічно, перевірте `maxmemory-policy`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

Що також повинно показати типове значення `noeviction`:

```shell
1) "maxmemory-policy"
2) "noeviction"
```

Тепер додамо деякі конфігураційні значення до `example-redis-config` ConfigMap:

{{% code_sample file="pods/config/example-redis-config.yaml" %}}

Застосуйте оновлений ConfigMap:

```shell
kubectl apply -f example-redis-config.yaml
```

Перевірте, що ConfigMap був оновлений:

```shell
kubectl describe configmap/example-redis-config
```

Ви повинні побачити конфігураційні значення, які ми щойно додали:

```shell
Name:         example-redis-config
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
redis-config:
----
maxmemory 2mb
maxmemory-policy allkeys-lru
```

Ще раз перевірте Pod Redis за допомогою `redis-cli` через `kubectl exec`, щоб побачити, чи конфігурація була застосована:

```shell
kubectl exec -it pod/redis -- redis-cli
```

Перевірте `maxmemory`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

Він залишається з типовим значенням 0:

```shell
1) "maxmemory"
2) "0"
```

Аналогічно, `maxmemory-policy` залишається з типовими налаштуваннями `noeviction`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

Повертає:

```shell
1) "maxmemory-policy"
2) "noeviction"
```

Конфігураційні значення не змінилися, оскільки Pod необхідно перезапустити, щоб отримати оновлені значення з асоційованих ConfigMap. Видалимо та заново створимо Pod:

```shell
kubectl delete pod redis
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
```

Тепер ще раз перевірте конфігураційні значення:

```shell
kubectl exec -it pod/redis -- redis-cli
```

Перевірте `maxmemory`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

Тепер він має показати оновлене значення 2097152:

```shell
1) "maxmemory"
2) "2097152"
```

Аналогічно, `maxmemory-policy` також було оновлено:

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

Він тепер показує бажане значення `allkeys-lru`:

```shell
1) "maxmemory-policy"
2) "allkeys-lru"
```

Очистіть свою роботу, видаливши створені ресурси:

```shell
kubectl delete pod/redis configmap/example-redis-config
```

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/).
* Ознайомтеся з прикладом [Оновлення конфігурації через ConfigMap](/docs/tutorials/configuration/updating-configuration-via-a-configmap/).
