---
title: Селектори полів
content_type: concept
weight: 70
---

_Селектори полів_ дозволяють вам вибирати обʼєкти Kubernetes на основі значень одного або кількох полів ресурсу. Ось кілька прикладів запитань для селекторів полів:

* `metadata.name=my-service`
* `metadata.namespace!=default`
* `status.phase=Pending`

Ця команда `kubectl` вибирає всі Podʼи, для яких значення поля [`status.phase`](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) дорівнює `Running`:

```shell
kubectl get pods --field-selector status.phase=Running
```

{{< note >}}
Селектори полів, по суті, є _фільтрами_ ресурсів. Типово селектори/фільтри не застосовуються, а це означає, що вибрані всі ресурси вказаного типу. Це робить запити kubectl `kubectl get pods` та `kubectl get pods --field-selector ""` еквівалентними.
{{< /note >}}

## Підтримувані поля {#supported-fields}

Підтримувані селектори полів варіюються залежно від типу ресурсу Kubernetes. Усі типи ресурсів підтримують поля `metadata.name` та `metadata.namespace`. Використання селекторів до полів, що їх не підтримують, призводить до помилки. Наприклад:

```shell
kubectl get ingress --field-selector foo.bar=baz
```

```none
Error from server  (BadRequest): Unable to find "ingresses" that match label selector "", field selector "foo.bar=baz": "foo.bar" is not a known field selector: only "metadata.name", "metadata.namespace"
```

### Список підтримуваних полів {#list-of-supported-fields}

| Вид                       | Поля                                                                                                                                                                                                                                                            |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pod                       | `spec.nodeName`<br>`spec.restartPolicy`<br>`spec.schedulerName`<br>`spec.serviceAccountName`<br>`spec.hostNetwork`<br>`status.phase`<br>`status.podIP`<br>`status.podIPs`<br>`status.nominatedNodeName`                                                         |
| Event                     | `involvedObject.kind`<br>`involvedObject.namespace`<br>`involvedObject.name`<br>`involvedObject.uid`<br>`involvedObject.apiVersion`<br>`involvedObject.resourceVersion`<br>`involvedObject.fieldPath`<br>`reason`<br>`reportingComponent`<br>`source`<br>`type` |
| Secret                    | `type`                                                                                                                                                                                                                                                          |
| Namespace                 | `status.phase`                                                                                                                                                                                                                                                  |
| ReplicaSet                | `status.replicas`                                                                                                                                                                                                                                               |
| ReplicationController     | `status.replicas`                                                                                                                                                                                                                                               |
| Job                       | `status.successful`                                                                                                                                                                                                                                             |
| Node                      | `spec.unschedulable`                                                                                                                                                                                                                                            |
| CertificateSigningRequest | `spec.signerName`                                                                                                                                                                                                                                               |

### Поля власних ресурсів {#custom-resources-fields}

Усі власні типи ресурсів підтримують поля `metadata.name` та `metadata.namespace`.

Крім того, поле `spec.versions[*].selectableFields` у {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}} оголошує, які інші поля власного ресурсу можна використовувати у селекторах полів. Дивіться статтю [поля, які можна вибрати для власних ресурсів](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#crd-selectable-fields) або додаткові відомості про те, як використовувати селектори полів з CustomResourceDefinitions.

## Підтримувані оператори {#supported-operators}

Ви можете використовувати оператори `=`, `==` та `!=` з селекторами полів (`=` та `==` означають те саме). Наприклад, ця команда `kubectl` вибирає всі сервіси Kubernetes, які не знаходяться в просторі імен `default`:

```shell
kubectl get services  --all-namespaces --field-selector metadata.namespace!=default
```

{{< note >}}
[Оператори на основі множини](/docs/concepts/overview/working-with-objects/labels/#set-based-requirement)
(`in`, `notin`, `exists`) не підтримуються для селекторів полів.
{{< /note >}}

## Ланцюжки селекторів {#chained-selectors}

Як і з [мітками](/docs/concepts/overview/working-with-objects/labels) та іншими селекторами, селектори полів можна складати у список, розділений комами. Ця команда `kubectl` вибирає всі Podʼи, для яких значення `status.phase` не дорівнює `Running`, а поле `spec.restartPolicy` дорівнює `Always`:

```shell
kubectl get pods --field-selector=status.phase!=Running,spec.restartPolicy=Always
```

## Кілька типів ресурсів {#multiple-resource-types}

Ви можете використовувати селектори полів для кількох типів ресурсів. Ця команда `kubectl` вибирає всі Statefulsets та Services, які не знаходяться в просторі імен `default`:

```shell
kubectl get statefulsets,services --all-namespaces --field-selector metadata.namespace!=default
```
