---
title: Призначення пристроїв робочим навантаженням за допомогою DRA
content_type: task
min-kubernetes-server-version: v1.34
weight: 20
---
{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

<!-- overview -->

На цій сторінці показано, як призначати пристрої для ваших Podʼів за допомогою _динамічного розподілу ресурсів (DRA)_. Ці інструкції призначені для операторів робочих навантажень. Перед прочитанням цієї сторінки ознайомтеся з принципами роботи DRA та термінами, такими як {{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}} і {{< glossary_tooltip text="ResourceClaimTemplates" term_id="resourceclaimtemplate" >}}. Докладніше дивіться у розділі [Динамічний розподіл ресурсів (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/).

<!-- body -->

## Про призначення пристроїв з DRA {#about-device-allocation-dra}

Як оператор робочих навантажень, ви можете _запитувати_ пристрої для своїх навантажень, створюючи ResourceClaims або ResourceClaimTemplates. Під час розгортання навантаження Kubernetes і драйвери пристроїв знаходять доступні пристрої, призначають їх вашим Podʼам і розміщують Podʼи на вузлах, які мають доступ до цих пристроїв.

<!-- prerequisites -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* Переконайтеся, що адміністратор вашого кластера налаштував DRA, підключив пристрої та встановив драйвери. Докладніше дивіться у розділі [Налаштування DRA у кластері](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster).

<!-- steps -->

## Визначення пристроїв для подання заявок на них {#identify-devices}

Адміністратор вашого кластера або драйвери пристроїв створюють _{{< glossary_tooltip term_id="deviceclass" text="DeviceClasses" >}}_, які визначають категорії пристроїв. Ви можете отримувати пристрої, використовуючи {{< glossary_tooltip term_id="cel" >}} для фільтрації за конкретними властивостями пристроїв.

Отримайте список DeviceClasses у кластері:

```shell
kubectl get deviceclasses
```

Вивід буде схожим на наступний:

```console
NAME                 AGE
driver.example.com   16m
```

Якщо ви отримали помилку доступу, можливо, у вас немає прав для перегляду DeviceClasses. Зверніться до адміністратора кластера або постачальника драйверів щодо доступних властивостей пристроїв.

## Запитування ресурсів {#claim-resources}

Ви можете запитувати ресурси з DeviceClass за допомогою {{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}. Щоб створити ResourceClaim, виконайте одну з наступних дій:

* Створіть ResourceClaim вручну, якщо ви хочете, щоб декілька Podʼів мали спільний доступ до одних і тих самих пристроїв, або якщо ви хочете, щоб claim існував довше, ніж Pod.
* Використовуйте {{< glossary_tooltip text="ResourceClaimTemplate" term_id="resourceclaimtemplate" >}}, щоб Kubernetes генерував і керував ResourceClaims для кожного Podʼа. Створіть ResourceClaimTemplate, якщо ви хочете, щоб кожен Pod мав доступ до окремих пристроїв із подібними конфігураціями. Наприклад, це може знадобитися для одночасного доступу до пристроїв у Pod для Job, який використовує [паралельне виконання](/docs/concepts/workloads/controllers/job/#parallel-jobs).

Якщо ви безпосередньо посилаєтеся на конкретний ResourceClaim у Pod, цей ResourceClaim вже має існувати у кластері. Якщо зазначений ResourceClaim не існує, Pod залишатиметься у стані очікування, доки ResourceClaim не буде створено. Ви можете посилатися на автоматично створений ResourceClaim у Podʼі, але це не рекомендується, оскільки такі ResourceClaim прив'язані до часу життя Pod, який їх створив.

Щоб створити робоче навантаження, яке отримує ресурси, виберіть одну з наступних опцій:

{{< tabs name="claim-resources" >}}
{{% tab name="ResourceClaimTemplate" %}}

Ознайомтеся з наступним прикладом маніфесту:

{{% code_sample file="dra/resourceclaimtemplate.yaml" %}}

Цей маніфест створює ResourceClaimTemplate, який запитує пристрої у DeviceClass `example-device-class`, що відповідають обом наступним параметрам:

* Пристрої, які мають атрибут `driver.example.com/type` зі значенням `gpu`.
* Пристрої, які мають ємність `64Gi`.

Щоб створити ResourceClaimTemplate, виконайте наступну команду:

```shell
kubectl apply -f https://k8s.io/examples/dra/resourceclaimtemplate.yaml
```

{{% /tab %}}
{{% tab name="ResourceClaim" %}}

Ознайомтеся з наступним прикладом маніфесту:

{{% code_sample file="dra/resourceclaim.yaml" %}}

Цей маніфест створює ResourceClaim, який запитує пристрої у DeviceClass `example-device-class`, що відповідають обом наступним параметрам:

* Пристрої, які мають атрибут `driver.example.com/type` зі значенням `gpu`.
* Пристрої, які мають ємність `64Gi`.

Щоб створити ResourceClaim, виконайте наступну команду:

```shell
kubectl apply -f https://k8s.io/examples/dra/resourceclaim.yaml
```

{{% /tab %}}
{{< /tabs >}}

## Запит пристроїв у робочих навантаженнях за допомогою DRA {#request-devices-workloads}

Щоб запросити пристрій, вкажіть ResourceClaim або ResourceClaimTemplate у полі `resourceClaims` специфікації Podʼа. Потім запросіть конкретний claim за назвою у полі `resources.claims` контейнера цього Podʼа. Ви можете вказати декілька записів у полі `resourceClaims` та використовувати конкретні claims у різних контейнерах.

1. Ознайомтеся з наступним прикладом Job:

   {{% code_sample file="dra/dra-example-job.yaml" %}}

   Кожен Pod у цьому Job має наступні властивості:

   * Робить доступними для контейнерів ResourceClaimTemplate з назвою `separate-gpu-claim` та ResourceClaim з назвою `shared-gpu-claim`.
   * Запускає наступні контейнери:
       * `container0` запитує пристрої з ResourceClaimTemplate `separate-gpu-claim`.
       * `container1` та `container2` мають спільний доступ до пристроїв з ResourceClaim `shared-gpu-claim`.

2. Створіть Job:

   ```shell
   kubectl apply -f https://k8s.io/examples/dra/dra-example-job.yaml
   ```

Спробуйте наступні кроки для усунення неполадок:

1. Коли робоче навантаження не запускається, як очікувалося, перевірте обʼєкти на кожному рівні з `kubectl describe`, щоб дізнатися, чи є якісь поля статусу або події, які можуть пояснити, чому робоче навантаження не запускається.
1. Коли створення Pod не вдається з `must specify one of: resourceClaimName, resourceClaimTemplateName`, перевірте, що всі записи в `pod.spec.resourceClaims` мають точно одне з цих полів. Якщо так, то можливо, що в кластері встановлено модифікуючий веб-хук Podʼа, який був створений для API Kubernetes < 1.32. Попросіть адміністратора кластера перевірити це.

## Очищення {#clean-up}

Щоб видалити обʼєкти Kubernetes, створені у цьому завданні, виконайте наступні кроки:

1.  Видаліть приклад Job:

    ```shell
    kubectl delete -f https://k8s.io/examples/dra/dra-example-job.yaml
    ```

1.  Щоб видалити свої claims ресурсів, виконайте одну з наступних команд:

    * Видаліть ResourceClaimTemplate:

      ```shell
      kubectl delete -f https://k8s.io/examples/dra/resourceclaimtemplate.yaml
      ```

    * Видаліть ResourceClaim:

      ```shell
      kubectl delete -f https://k8s.io/examples/dra/resourceclaim.yaml
      ```

## {{% heading "whatsnext" %}}

* [Дізнайтеся більше про DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
