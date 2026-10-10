---
title: Селекторы полей
weight: 60
---

_Селекторы полей_ позволяют [выбирать ресурсы Kubernetes](/ru/docs/concepts/overview/working-with-objects/kubernetes-objects), исходя из значения одного или нескольких полей ресурсов. Ниже приведены несколько примеров запросов селекторов полей:

* `metadata.name=my-service`
* `metadata.namespace!=default`
* `status.phase=Pending`

Следующая команда `kubectl` выбирает все Pod-объекты, в которых значение поля [`status.phase`](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) равно `Running`:

```shell
kubectl get pods --field-selector status.phase=Running
```

{{< note >}}
По сути, селекторы полей являются *фильтрами* ресурсов. По умолчанию нет установленных селекторов/фильтров, поэтому выбираются ресурсы всех типов. Это означает, что два запроса `kubectl` ниже одинаковы:

```shell
kubectl get pods
kubectl get pods --field-selector ""
```
{{< /note >}}

## Поддерживаемые поля

Доступные селекторы полей зависят от типа ресурса Kubernetes. У всех типов ресурсов есть поля  `metadata.name` и `metadata.namespace`. При использовании несуществующего селекторов полей приведёт к возникновению ошибки. Например:

```shell
kubectl get ingress --field-selector foo.bar=baz
```

```
Error from server (BadRequest): Unable to find "ingresses" that match label selector "", field selector "foo.bar=baz": "foo.bar" is not a known field selector: only "metadata.name", "metadata.namespace"
```

## Поддерживаемые операторы

Можно использовать операторы `=`, `==` и `!=` в селекторах полей (`=` и `==` — синонимы). Например, следующая команда `kubectl` выбирает все сервисы Kubernetes, не принадлежавшие пространству имен `default`:

```shell
kubectl get services  --all-namespaces --field-selector metadata.namespace!=default
```

## Составные селекторы

Аналогично [метки](/ru/docs/concepts/overview/working-with-objects/labels) и другим селекторам, несколько селекторы полей могут быть объединены через запятую. Приведенная ниже команда `kubectl` выбирает все Pod-объекты, у которых значение поле `status.phase`, отличное от `Running`, а поле `spec.restartPolicy` имеет значение `Always`:

```shell
kubectl get pods --field-selector=status.phase!=Running,spec.restartPolicy=Always
```

## Множественные типы ресурсов

Можно использовать селекторы полей с несколькими типами ресурсов одновременно. Команда `kubectl` выбирает все объекты StatefulSet и Services, не включенные в пространство имен `default`:

```shell
kubectl get statefulsets,services --all-namespaces --field-selector metadata.namespace!=default
```
