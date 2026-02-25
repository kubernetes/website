---
title: "Налаштування DRA у кластері"
content_type: task
min-kubernetes-server-version: v1.34
weight: 10
---
{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

<!-- overview -->

На цій сторінці показано, як налаштувати _динамічне виділення ресурсів (DRA)_ у кластері Kubernetes шляхом активації груп API та налаштування класів пристроїв. Ці інструкції призначені для адміністраторів кластерів.

<!-- body -->

## Про DRA {#about-dra}

{{< glossary_definition term_id="dra" length="all" >}}

Переконайтеся, що ви ознайомлені з принципом роботи DRA та термінологією DRA, такою як {{< glossary_tooltip text="DeviceClasses" term_id="deviceclass" >}}, {{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}} і {{< glossary_tooltip text="ResourceClaimTemplates" term_id="resourceclaimtemplate" >}}. Детальніше дивіться [Динамічне виділення ресурсів (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/).

<!-- prerequisites -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* Підключіть пристрої до вашого кластера безпосередньо або опосередковано. Щоб уникнути можливих проблем із драйверами, дочекайтеся налаштування функції DRA для вашого кластера перед встановленням драйверів.

<!-- steps -->

## Опціонально: увімкніть додаткові групи API DRA {#enable-dra}

Загалом DRA є стабільною функцією в Kubernetes, проте деякі її аспекти можуть бути ще в стадії альфа- або бета-тестування. Якщо ви хочете використовувати будь-який аспект DRA, який ще не є стабільним, а повʼязана з ним функція залежить від спеціального типу API,
тоді ви повинні увімкнути відповідні групи альфа- або бета-API.

Деякі старі драйвери або робочі навантаження DRA можуть все ще потребувати API v1beta1 з Kubernetes 1.30 або v1beta2 з Kubernetes 1.32. Тільки якщо потрібна підтримка цих версій, увімкніть наступні {{< glossary_tooltip text="групи API" term_id="api-group" >}}:

* `resource.k8s.io/v1beta1`
* `resource.k8s.io/v1beta2`

Функції Alpha з окремими типами API потребують:

* `resource.k8s.io/v1alpha3`

Для отримання додаткової інформації дивіться [Увімкнення або вимкнення груп API](/docs/reference/using-api/#enabling-or-disabling).

## Перевірте, що DRA увімкнено {#verify}

Щоб перевірити правильність налаштування кластера, спробуйте вивести список DeviceClasses:

```shell
kubectl get deviceclasses
```

Якщо конфігурація компонентів була правильною, ви побачите подібний результат:

```console
No resources found
```

Якщо DRA налаштовано неправильно, результат буде схожий на:

```console
error: the server doesn't have a resource type "deviceclasses"
```

Наприклад, це може статися, коли група API resource.k8s.io була вимкнена. Аналогічна перевірка застосовується до типів верхнього рівня якості альфа або бета.

Спробуйте наступні кроки для усунення несправностей:

1. Переконфігуруйте та перезапустіть компонент `kube-apiserver`.

1. Якщо повне поле `.spec.resourceClaims` видаляється з Podʼів, або якщо Podʼи плануються без урахування ResourceClaims, перевірте, чи не вимкнено [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `DynamicResourceAllocation` для kube-apiserver, kube-controller-manager, kube-scheduler або kubelet.

## Встановіть драйвери пристроїв {#install-drivers}

Після активації DRA для вашого кластера ви можете встановити драйвери для підключених пристроїв. Інструкції шукайте у документації виробника пристрою або проєкту, що підтримує драйвери. Встановлені драйвери мають бути сумісні з DRA.

Щоб перевірити роботу встановлених драйверів, виведіть список ResourceSlices у кластері:

```shell
kubectl get resourceslices
```

Вивід буде схожий на:

```console
NAME                                                  NODE                DRIVER               POOL                             AGE
cluster-1-device-pool-1-driver.example.com-lqx8x      cluster-1-node-1    driver.example.com   cluster-1-device-pool-1-r1gc     7s
cluster-1-device-pool-2-driver.example.com-29t7b      cluster-1-node-2    driver.example.com   cluster-1-device-pool-2-446z     8s
```

Спробуйте наступні кроки для усунення несправностей:

1. Перевірте стан драйвера DRA та шукайте повідомлення про помилки щодо публікації ResourceSlices у виводі його журналу. Постачальник драйвера може надати додаткові інструкції щодо встановлення та усунення несправностей.

## Створіть DeviceClasses {#create-deviceclasses}

Ви можете визначити категорії пристроїв, які оператори ваших застосунків можуть використовувати у робочих навантаженнях, створюючи {{< glossary_tooltip text="DeviceClasses" term_id="deviceclass" >}}. Деякі постачальники драйверів також можуть рекомендувати створити DeviceClasses під час встановлення драйверів.

ResourceSlices, які публікує ваш драйвер, містять інформацію про пристрої, якими керує драйвер, такі як ємність, метадані та атрибути. Ви можете використовувати {{< glossary_tooltip term_id="cel" >}} для фільтрації властивостей у DeviceClasses, що спрощує пошук пристроїв для операторів навантажень.

1. Щоб знайти властивості пристрою, які можна вибирати у DeviceClasses за допомогою виразів CEL, отримайте специфікацію ResourceSlice:

    ```shell
    kubectl get resourceslice <resourceslice-name> -o yaml
    ```

    Вивід буде схожий на:

    ```yaml
    apiVersion: resource.k8s.io/v1
    kind: ResourceSlice
    # lines omitted for clarity
    spec:
      devices:
      - attributes:
          type:
            string: gpu
        capacity:
          memory:
            value: 64Gi
        name: gpu-0
      - attributes:
          type:
            string: gpu
        capacity:
          memory:
            value: 64Gi
        name: gpu-1
      driver: driver.example.com
      nodeName: cluster-1-node-1
    # lines omitted for clarity
    ```

    Ви також можете переглянути документацію постачальника драйверів для доступних властивостей і значень.

2. Ознайомтеся з прикладом маніфесту DeviceClass, який вибирає будь-який пристрій, керований драйвером `driver.example.com`:

    {{% code_sample file="dra/deviceclass.yaml" %}}

3. Створіть DeviceClass у вашому кластері:

    ```shell
    kubectl apply -f https://k8s.io/examples/dra/deviceclass.yaml
    ```

## очищення {#clean-up}

Щоб видалити DeviceClass, створений у цьому завданні, виконайте команду:

```shell
kubectl delete -f https://k8s.io/examples/dra/deviceclass.yaml
```

## {{% heading "whatsnext" %}}

* [Дізнайтеся більше про DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
* [Виділення пристроїв для навантажень за допомогою DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra)
