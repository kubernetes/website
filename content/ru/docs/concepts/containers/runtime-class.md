---
reviewers:
title: RuntimeClass
content_type: concept
weight: 20
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

На этой странице описывается ресурс RuntimeClass и механизм выбора исполняемой среды.

RuntimeClass позволяет выбрать конфигурацию исполняемой среды для контейнеров. Используется для настройки исполняемой среды в Pod'е.

<!-- body -->

## Мотивация

Разным Pod'ам можно назначать различные RuntimeClass'ы, соблюдая баланс между производительностью и безопасностью. Например, если часть рабочей нагрузки требует высокого уровня информационной безопасности, связанные с ней Pod'ы можно запланировать так, чтобы они использовали исполняемую среду для контейнеров на основе аппаратной виртуализации. Это обеспечит повышенную изоляцию, но потребует дополнительных издержек.

Также можно использовать RuntimeClass для запуска различных Pod'ов с одинаковой исполняемой средой, но с разными настройками.

## Подготовка

1. Настройте реализацию CRI на узлах (зависит от используемой исполняемой среды);
2. Создайте соответствующие ресурсы RuntimeClass.

### 1. Настройте реализацию CRI на узлах

Конфигурации, доступные с помощью RuntimeClass, зависят от реализации Container Runtime Interface (CRI). Для настройки определенной реализации CRI обратитесь к соответствующему разделу документации ([ниже](#cri-configuration)).

{{< note >}}
По умолчанию RuntimeClass предполагает однородную конфигурацию узлов в кластере (то есть все узлы настроены одинаково в плане исполняемой среды для контейнеров). Для гетерогенных конфигураций узлов см. раздел [Scheduling](#scheduling) ниже.
{{< /note >}}

Каждой конфигурации соответствует обработчик, на который ссылается RuntimeClass. Имя обработчика должно соответствовать [синтаксису для меток DNS](/docs/concepts/overview/working-with-objects/names/#dns-label-names).

### 2. Создайте соответствующие ресурсы RuntimeClass

К каждой конфигурации, настроенной на шаге 1, должно быть привязано имя обработчика (`handler`), которое ее идентифицирует. Для каждого обработчика создайте соответствующий объект RuntimeClass.

На данный момент у ресурса RuntimeClass есть только 2 значимых поля: имя RuntimeClass (`metadata.name`) и обработчик (`handler`). Определение объекта выглядит следующим образом:

```yaml
# RuntimeClass определен в API-группе node.k8s.io
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  # Имя, которое ссылается на RuntimeClass
  # ресурс RuntimeClass не включается в пространство имен
  name: myclass 
# Имя соответствующей конфигурации CRI
handler: myconfiguration 
```

Имя объекта RuntimeClass должно удовлетворять [синтаксису для поддоменных имен DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

{{< note >}}
Рекомендуется ограничить доступ к операциям записи RuntimeClass (create/update/patch/delete) администратором кластера. Обычно это сделано по умолчанию. Более подробную информацию см. в разделе [Общая информация об авторизации](/docs/reference/access-authn-authz/authorization/).
{{< /note >}}

## Использование

После того как RuntimeClasses настроены для кластера, использовать их очень просто. Достаточно указать `runtimeClassName` в спецификации Pod'а. Например:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  runtimeClassName: myclass
  # ...
```

kubelet будет использовать указанный RuntimeClass для запуска этого Pod'а. Если указанный RuntimeClass не существует или CRI не может запустить соответствующий обработчик, Pod войдет в [фазу завершения работы](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) `Failed`. Полное сообщение об ошибке можно получить, обратившись к соответствующему [событию](/docs/tasks/debug/debug-application/debug-running-pod/) (event).

Если имя `runtimeClassName` не указано, будет использоваться RuntimeHandler по умолчанию (что эквивалентно поведению, когда функция RuntimeClass отключена).

### Настройка CRI

Для получения более подробной информации о настройке исполняемых сред CRI обратитесь к разделу [Установка CRI](/docs/setup/production-environment/container-runtimes/).

#### {{< glossary_tooltip term_id="containerd" >}}

Обработчики исполняемой среды настраиваются в конфигурации containerd в файле `/etc/containerd/config.toml`. Допустимые обработчики прописываются в разделе runtimes:

```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.${HANDLER_NAME}]
```

Дополнительная информация доступна в [документации по конфигурации containerd](https://github.com/containerd/cri/blob/master/docs/config.md).

#### {{< glossary_tooltip term_id="cri-o" >}}

Обработчики исполняемой среды настраиваются в файле конфигурации CRI-O (`/etc/crio/crio.conf`). Допустимые обработчики прописываются в [таблице crio.runtime](https://github.com/cri-o/cri-o/blob/master/docs/crio.conf.5.md#crioruntime-table):

```
[crio.runtime.runtimes.${HANDLER_NAME}]
  runtime_path = "${PATH_TO_BINARY}"
```

Более подробную информацию см. в [документации по конфигурации CRI-O](https://github.com/cri-o/cri-o/blob/master/docs/crio.conf.5.md).

## Scheduling

{{< feature-state for_k8s_version="v1.16" state="beta" >}}

Поле `scheduling` в RuntimeClass позволяет наложить определенные ограничения, гарантировав, что Pod'ы с определенным RuntimeClass'ом будут планироваться на узлы, которые его поддерживают. Если параметр `scheduling` не установлен, предполагается, что данный RuntimeClass поддерживается всеми узлами.

Чтобы гарантировать, что Pod'ы попадают на узлы, поддерживающие определенный RuntimeClass, эти узлы должны быть связаны общей меткой, которая затем выбирается полем `runtimeclass.scheduling.nodeSelector`. nodeSelector RuntimeClass'а объединяется с nodeSelector'ом admission-контроллера, на выходе образуя пересечение подмножеств узлов, выбранных каждым из селекторов. Если возникает конфликт, Pod отклоняется.

Если поддерживаемые узлы объединены неким taint'ом, чтобы предотвратить запуск на них Pod'ов с другими RuntimeClass'ами, можно к нужному RuntimeClass'у добавить `tolerations`. Как и в случае с `nodeSelector`, tolerations объединяются с tolerations Pod'а admission-контроллера, фактически образуя объединение двух подмножеств узлов с соответствующими tolerations.

Чтобы узнать больше о настройке селектора узлов и tolerations, см. раздел [Назначаем Pod'ы на узлы](/docs/concepts/scheduling-eviction/assign-pod-node/).

### Pod Overhead

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Можно указать _overhead_-ресурсы, необходимые для работы Pod'а. Это позволит кластеру (и планировщику) учитывать их при принятии решений о Pod'ах и управлении ресурсами.

В RuntimeClass дополнительные ресурсы, потребляемые Pod'ом, указываются в поле `overhead`. С помощью этого поля можно указать ресурсы, необходимые Pod'ам с данным RuntimeClass'ом, и гарантировать их учет в Kubernetes.

## {{% heading "whatsnext" %}}

- Описание [RuntimeClass](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/585-runtime-class/README.md);
- Описание [RuntimeClass Scheduling](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/585-runtime-class/README.md#runtimeclass-scheduling);
- Концепция [Pod Overhead](/docs/concepts/scheduling-eviction/pod-overhead/);
- Описание функции [PodOverhead](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/688-pod-overhead).
