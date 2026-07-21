---
title: Доступ до метаданих пристроїв DRA
content_type: task
min-kubernetes-server-version: v1.36
weight: 30
---

{{< feature-state state="alpha" for_k8s_version="v1.36" >}}

<!-- overview -->

Ця сторінка показує, як отримати доступ до [метаданих пристроїв](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-metadata) з контейнерів, які використовують _динамічний розподіл ресурсів (DRA)_. Метадані пристроїв дозволяють робочим навантаженням дізнаватися інформацію про виділені пристрої, такі як атрибути пристроїв або деталі мережевого інтерфейсу, шляхом читання JSON-файлів за відомими шляхами всередині контейнера.

Перед тим як ознайомитися з цією сторінкою, перегляньте інформацію про [Динамічний розподіл ресурсів (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) та про те, як [виділяти пристрої для робочих навантажень](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/).

<!-- body -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* Переконайтесь, що адміністратор вашого кластера налаштував DRA, підключив пристрої та встановив драйвери. Для отримання додаткової інформації дивіться [Налаштування DRA в кластері](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster).
* Переконайтесь, що драйвер DRA, розгорнутий у вашому кластері, підтримує метадані пристроїв. Драйвери, які використовують [втулок kubelet DRA](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin), активують параметри `EnableDeviceMetadata` та `MetadataVersions` під час запуску втулка. Перевірте документацію драйвера для отримання деталей.

## Доступ до метаданих ресурсів за допомогою ResourceClaim {#access-metadata-resourceclaim}

Коли ви використовуєте безпосередньо вказаний ResourceClaim для виділення пристроїв, файли метаданих пристроїв зʼявляються всередині контейнера за адресою:

```none
/var/run/kubernetes.io/dra-device-attributes/resourceclaims/<claimName>/<requestName>/<driverName>-metadata.json
```

1. Перегляньте наступний приклад маніфесту:

   {{% code_sample file="dra/dra-device-metadata-pod.yaml" %}}

   Цей маніфест створює ResourceClaim з назвою `gpu-claim`, який запитує пристрій з DeviceClass `gpu.example.com`, та Pod, який читає метадані пристрою.

1. Створіть ResourceClaim та Pod:

   ```shell
   kubectl apply -f https://k8s.io/examples/dra/dra-device-metadata-pod.yaml
   ```

1. Після запуску Podʼа перегляньте журнали контейнера, щоб побачити метадані:

   ```shell
   kubectl logs gpu-metadata-reader
   ```

   Вивід буде схожий на:

   ```none
   === DRA device metadata ===
   /var/run/kubernetes.io/dra-device-attributes/resourceclaims/gpu-claim/gpu/gpu.example.com-metadata.json
   {
     "kind": "DeviceMetadata",
     "apiVersion": "metadata.resource.k8s.io/v1alpha1",
     ...
   }
   ```

1. Щоб переглянути повний файл метаданих, виконайте команду `exec` у контейнері:

   ```shell
   kubectl exec gpu-metadata-reader -- \
     cat /var/run/kubernetes.io/dra-device-attributes/resourceclaims/gpu-claim/gpu/gpu.example.com-metadata.json
   ```

   Вивід буде JSON-обʼєктом, що містить атрибути пристрою, такі як модель, версія драйвера та UUID пристрою. Дивіться [схему метаданих](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-metadata-schema) для деталей структури JSON.

## Доступ до метаданих ресурсів за допомогою ResourceClaimTemplate {#access-metadata-template}

Коли ви використовуєте ResourceClaimTemplate, Kubernetes генерує ResourceClaim для кожного Podʼа. Оскільки згенерована назва заявки непередбачувана, файли метаданих зʼявляються за шляхом, який використовує імʼя посилання на заявку Podʼа:

```none
/var/run/kubernetes.io/dra-device-attributes/resourceclaimtemplates/<podClaimName>/<requestName>/<driverName>-metadata.json
```

Поле `<podClaimName>` відповідає полю `name` у записі `spec.resourceClaims[]` Podʼа. JSON-метадані також включають поле `podClaimName`, яке фіксує це зіставлення.

1. Перегляньте наступний приклад маніфесту:

   {{% code_sample file="dra/dra-device-metadata-template-pod.yaml" %}}

   Цей маніфест створює ResourceClaimTemplate та Pod. Кожен Pod отримує власний згенерований ResourceClaim. Шлях до метаданих використовує імʼя посилання на заявку Podʼа `my-gpu`.

1. Створіть ResourceClaimTemplate та Pod:

   ```shell
   kubectl apply -f https://k8s.io/examples/dra/dra-device-metadata-template-pod.yaml
   ```

1. Після запуску Podʼа перегляньте метадані:

   ```shell
   kubectl exec gpu-metadata-template-reader -- \
     cat /var/run/kubernetes.io/dra-device-attributes/resourceclaimtemplates/my-gpu/gpu/gpu.example.com-metadata.json
   ```

## Читання метаданих у вашому застосунку {#read-metadata-application}

### Go застосунки {#go-applications}

Пакунок `k8s.io/dynamic-resource-allocation/devicemetadata` надає готові функції для читання файлів метаданих. Ці функції автоматично обробляють узгодження версій, декодують потік метаданих і перетворюють його на внутрішні типи, щоб ваш код працював з різними версіями схеми без ручної перевірки версій.

Для безпосередньо вказаної ResourceClaim:

```go
import "k8s.io/dynamic-resource-allocation/devicemetadata"

dm, err := devicemetadata.ReadResourceClaimMetadata("gpu-claim", "gpu")
```

Для заявки, створеної з шаблону, (використовуючи імʼя посилання на заявку Pod):

```go
dm, err := devicemetadata.ReadResourceClaimTemplateMetadata("my-gpu", "gpu")
```

Якщо ви знаєте конкретне імʼя драйвера, ви можете прочитати файл метаданих одного драйвера:

```go
dm, err := devicemetadata.ReadResourceClaimMetadataWithDriverName("gpu.example.com", "gpu-claim", "gpu")
```

Отриманий `*metadata.DeviceMetadata` містить метадані заявки, запити та атрибути кожного пристрою.

Застосунки іншими мовами можуть безпосередньо читати JSON-файл і перевіряти поле `apiVersion`, щоб визначити версію схеми перед розбором.

## Очищення {#clean-up}

Видаліть створені ресурси:

```shell
kubectl delete -f https://k8s.io/examples/dra/dra-device-metadata-pod.yaml
kubectl delete -f https://k8s.io/examples/dra/dra-device-metadata-template-pod.yaml
```

## {{% heading "whatsnext" %}}

* [Дізнайтеся більше про метадані пристроїв DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-metadata)
* [Призначення пристроїв робочим навантаженням за допомогою DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/)
* Для отримання додаткової інформації про дизайн див. [KEP-5304](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/5304-dra-attributes-downward-api).
