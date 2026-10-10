---
title: Seletores de Campos
weight: 60
---


Os _Seletores de Campos_ permitem que você [selecione recursos do Kubernetes](/docs/concepts/overview/working-with-objects/kubernetes-objects) baseado no valor de um ou mais campos de um recurso. Seguem alguns exemplos de buscas utilizando seletores de campos:

* `metadata.name=my-service`
* `metadata.namespace!=default`
* `status.phase=Pending`

O comando `kubectl`, mostrado a seguir, seleciona todos os Pods nos quais o valor do campo [`status.phase`](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) é `Running`:

```shell
kubectl get pods --field-selector status.phase=Running
```

{{< note >}}
Seletores de campos são essencialmente *filtros* de recursos. Por padrão, nenhum seletor/filtro é aplicado, de forma que todos os recursos do tipo especificado são selecionados. Isso faz com que as seguintes pesquisas utilizando `kubectl` sejam equivalentes: `kubectl get pods` e `kubectl get pods --field-selector ""`
{{< /note >}}

## Campos suportados

Os campos de seleção suportados variam dependendo do tipo de recurso Kubernetes. Todos os tipos de recursos suportam os campos `metadata.name` e `metadata.namespace`. Utilizar campos não suportados produz um erro. Como por exemplo:

```shell
kubectl get ingress --field-selector foo.bar=baz
```
```
Error from server (BadRequest): Unable to find "ingresses" that match label selector "", field selector "foo.bar=baz": "foo.bar" is not a known field selector: only "metadata.name", "metadata.namespace"
```

## Operadores suportados

Você pode utilizar os operadores `=`, `==` e `!=` com seletores de campos (`=` e `==` significam a mesma coisa). Por exemplo, o comando `kubectl` a seguir seleciona todos os Kubernetes Services que não estão no namespace `default`: 

```shell
kubectl get services  --all-namespaces --field-selector metadata.namespace!=default
```

## Seletores em cadeia

Assim como [label](/docs/concepts/overview/working-with-objects/labels) e outros tipos de seletores, podem ser utilizados em cadeia através de uma lista separada por vírgula. O comando `kubectl` a seguir seleciona todos os Pods nos quais `status.phase` não é igual a `Running` e `spec.restartPolicy` é igual a `Always`

```shell
kubectl get pods --field-selector=status.phase!=Running,spec.restartPolicy=Always
```

## Múltiplos tipos de recursos

Você pode utilizar seletores de campos através de múltiplos tipos de recursos. Por exemplo, o comando `kubectl` a seguir seleciona todos Statefulsets e Services que não estão presentes no namespace `default`.

```shell
kubectl get statefulsets,services --all-namespaces --field-selector metadata.namespace!=default
```
