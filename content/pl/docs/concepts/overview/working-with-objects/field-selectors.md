---
title: Selektory pól
content_type: concept
weight: 70
---

Selektory pól (_Field selectors_) pozwalają na wybór {{< glossary_tooltip text="obiektów" term_id="object" >}}
Kubernetesa na podstawie wartości jednego lub kilku pól zasobów. Oto kilka przykładów zapytań z użyciem selektora pól:

* `metadata.name=my-service`
* `metadata.namespace!=default`
* `status.phase=Pending`

Polecenie `kubectl` wybiera wszystkie Pody, dla których wartość pola [`status.phase`](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) to `Running`:

```shell
kubectl get pods --field-selector status.phase=Running
```

{{< note >}}
Selektory pól to zasadniczo *filtry* zasobów. Domyślnie nie stosuje się żadnych selektorów/filtrów, co oznacza, że wszystkie zasoby określonego typu są wybierane. Dzięki temu zapytania `kubectl` `kubectl get pods` i `kubectl get pods --field-selector ""` są równoważne.
{{< /note >}}

## Obsługiwane pola {#supported-fields}

Obsługiwane selektory pól różnią się w zależności od typu zasobu Kubernetesa. Wszystkie typy zasobów obsługują pola `metadata.name` oraz `metadata.namespace`. Użycie nieobsługiwanych selektorów pól skutkuje błędem. Na przykład:

```shell
kubectl get ingress --field-selector foo.bar=baz
```
```
Error from server (BadRequest): Unable to find "ingresses" that match label selector "", field selector "foo.bar=baz": "foo.bar" is not a known field selector: only "metadata.name", "metadata.namespace"
```

### Lista obsługiwanych pól {#list-of-supported-fields}

| Rodzaj                    | Pola                                                                                                                                                                                                                                                            |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pod                       | `spec.nodeName`<br>`spec.restartPolicy`<br>`spec.schedulerName`<br>`spec.serviceAccountName`<br>`spec.hostNetwork`<br>`status.phase`<br>`status.podIP`<br>`status.podIPs`<br>`status.nominatedNodeName`                                                                            |
| Event                 | `involvedObject.kind`<br>`involvedObject.namespace`<br>`involvedObject.name`<br>`involvedObject.uid`<br>`involvedObject.apiVersion`<br>`involvedObject.resourceVersion`<br>`involvedObject.fieldPath`<br>`reason`<br>`reportingComponent`<br>`source`<br>`type` |
| Secret                    | `type`                                                                                                                                                                                                                                                          |
| Namespace           | `status.phase`                                                                                                                                                                                                                                                   |
| ReplicaSet                | `status.replicas`                                                                                                                                                                                                                                               |
| ReplicationController     | `status.replicas`                                                                                                                                                                                                                                               |
| Job                  | `status.successful`                                                                                                                                                                                                                                             |
| Node                     | `spec.unschedulable`                                                                                                                                                                                                                                            |
| CertificateSigningRequest | `spec.signerName`                                                                                                                                                                                                                                               |

### Pola zasobów niestandardowych {#custom-resources-fields}

Wszystkie niestandardowe typy zasobów obsługują pola `metadata.name` oraz `metadata.namespace`.

Dodatkowo, pole `spec.versions[*].selectableFields` w {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}} określa,
które inne pola w zasobie niestandardowym mogą być używane w selektorach pól. Zobacz
[selectable fields for custom resources](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#crd-selectable-fields) aby uzyskać więcej informacji o tym, jak używać selektorów pól z CustomResourceDefinitions.

## Obsługiwane operatory {#supported-operators}

Możesz używać operatorów `=`, `==` i `!=` z selektorami pól (`=` and `==` oznaczają to samo). Na przykład ta komenda `kubectl` wybiera wszystkie usługi Kubernetesa, które nie znajdują się w przestrzeni nazw `default`:

```shell
kubectl get services  --all-namespaces --field-selector metadata.namespace!=default
```
{{< note >}}
Operatory dla zbiorów ([Set-based operators](/docs/concepts/overview/working-with-objects/labels/#set-based-requirement)
) (`in`, `notin`, `exists`) nie są obsługiwane dla selektorów pól. 
{{< /note >}}

## Złożone selektory {#chained-selectors}

Podobnie jak [etykieta](/docs/concepts/overview/working-with-objects/labels) i inne selektory, selektory pól mogą być łączone w postaci listy rozdzielanej przecinkami. To polecenie `kubectl` wybiera wszystkie Pody, dla których `status.phase` nie jest równe `Running`, a pole `spec.restartPolicy` jest równe `Always`:

```shell
kubectl get pods --field-selector=status.phase!=Running,spec.restartPolicy=Always
```

## Wiele typów zasobów {#multiple-resource-types}

Możesz używać selektorów pól w różnych typach zasobów. To polecenie `kubectl` wybiera wszystkie obiekty typu Statefulset i Service, które nie znajdują się w przestrzeni nazw `default`:

```shell
kubectl get statefulsets,services --all-namespaces --field-selector metadata.namespace!=default
```
