---
title: Depuração de um StatefulSet
content_type: task
weight: 30
---

<!-- overview -->
Esta tarefa mostra como depurar um StatefulSet.

## {{% heading "prerequisites" %}}

* Você precisa ter um cluster Kubernetes e a ferramenta de linha de comando `kubectl`
  configurada para se comunicar com seu cluster.
* Você deve ter um StatefulSet em execução que deseja investigar.

<!-- steps -->

## Depuração de um StatefulSet

Para listar todos os Pods que pertencem a um StatefulSet e possuem o rótulo `app.kubernetes.io/name=MyApp` definido, você pode usar o seguinte comando:

```shell
kubectl get pods -l app.kubernetes.io/name=MyApp
```

Se você notar que algum dos Pods listados está no estado `Unknown` ou `Terminating` por um longo período, consulte a tarefa [Excluindo Pods de um StatefulSet](/docs/tasks/run-application/delete-stateful-set/) para obter instruções sobre como lidar com esses casos.
Você pode depurar Pods individuais em um StatefulSet utilizando o guia [Depuração de Pods](/docs/tasks/debug/debug-application/debug-pods/).

## {{% heading "whatsnext" %}}

Saiba mais sobre [depuração de um Init Container](/docs/tasks/debug/debug-application/debug-init-containers/).

