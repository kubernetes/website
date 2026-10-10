---
title: Deletar um StatefulSet
content_type: task
weight: 60
---

<!-- overview -->

Esta tarefa mostra como deletar um {{< glossary_tooltip term_id="StatefulSet" >}}.

## {{% heading "prerequisites" %}}

- Esta tarefa assume que você tem uma aplicação em execução no seu cluster representada por um StatefulSet.

<!-- steps -->

## Deletando um StatefulSet

Você pode deletar um StatefulSet da mesma forma que deleta outros recursos no Kubernetes:
use o comando `kubectl delete` e especifique o StatefulSet pelo arquivo ou pelo nome.

```shell
kubectl delete -f <file.yaml>
```

```shell
kubectl delete statefulsets <statefulset-name>
```

Pode ser necessário deletar o serviço headless associado separadamente após o próprio StatefulSet ser deletado.

```shell
kubectl delete service <service-name>
```

Ao deletar um StatefulSet usando o `kubectl`, o StatefulSet é escalonado para 0.
Todos os Pods que fazem parte dessa carga de trabalho também são deletados.
Se você quiser deletar apenas o StatefulSet e não os Pods, use `--cascade=orphan`. Por exemplo:

```shell
kubectl delete -f <file.yaml> --cascade=orphan
```

Ao passar `--cascade=orphan` para o `kubectl delete`, os Pods gerenciados pelo StatefulSet permanecem mesmo após o objeto StatefulSet ser deletado.
Se os Pods tiverem o rótulo `app.kubernetes.io/name=MyApp`, você pode deletá-los da seguinte forma:

```shell
kubectl delete pods -l app.kubernetes.io/name=MyApp
```

### Volumes Persistentes

Deletar os Pods em um StatefulSet não deleta os volumes associados.
Isso garante que você tenha a chance de copiar os dados do volume antes de deletá-lo.
Deletar o PVC após os pods terem sido finalizados pode acionar a exclusão dos Volumes Persistentes de suporte, dependendo da classe de
armazenamento e da política de retenção.
Você nunca deve assumir que será possível acessar um volume após a exclusão da requisição (claim).

{{< note >}}
Tenha cautela ao deletar um PVC, pois isso pode levar à perda de dados.
{{< /note >}}

### Exclusão completa de um StatefulSet

Para deletar tudo em um StatefulSet, incluindo os pods associados,
você pode executar uma série de comandos semelhantes aos seguintes:

```shell
grace=$(kubectl get pods <stateful-set-pod> --template '{{.spec.terminationGracePeriodSeconds}}')
kubectl delete statefulset -l app.kubernetes.io/name=MyApp
sleep $grace
kubectl delete pvc -l app.kubernetes.io/name=MyApp

```

No exemplo acima, os Pods possuem o rótulo `app.kubernetes.io/name=MyApp`;
substitua pelo seu próprio rótulo, conforme apropriado.

### Forçar a exclusão de pods de um StatefulSet

Se você perceber que alguns pods no seu StatefulSet estão presos nos estados 'Terminating' ou 'Unknown' por um longo período de tempo, pode ser
necessário intervir manualmente para forçar a exclusão dos pods do servidor de API.
Esta é uma tarefa potencialmente perigosa. Consulte [Forçar a exclusão de pods de um StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/) para mais detalhes.

## {{% heading "whatsnext" %}}

Saiba mais sobre [como forçar a exclusão de pods de um StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/).
