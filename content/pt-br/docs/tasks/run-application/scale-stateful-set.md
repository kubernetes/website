---
title: Escalar um StatefulSet
content_type: task
weight: 50
---

<!-- overview -->

Esta tarefa mostra como escalar um StatefulSet. Escalar um StatefulSet refere-se a aumentar ou diminuir o número de réplicas.

## {{% heading "prerequisites" %}}

- Os StatefulSets estão disponíveis apenas no Kubernetes na versão 1.5 ou superior.
  Para verificar sua versão do Kubernetes, execute `kubectl version`.

- Nem todas as aplicações com estado escalam de forma adequada. Se você não tem certeza se deve escalar seus StatefulSets,
  consulte [Conceitos de StatefulSet](/docs/concepts/workloads/controllers/statefulset/)
  ou [Tutorial de StatefulSet](/docs/tutorials/stateful-application/basic-stateful-set/) para mais informações.

- Você deve realizar o redimensionamento apenas quando tiver certeza de que o cluster da sua aplicação com estado
  está completamente íntegro.

<!-- steps -->

## Escalando StatefulSets

### Use kubectl para escalar StatefulSets

Primeiro, encontre o StatefulSet que você deseja escalar:

```shell
kubectl get statefulsets <stateful-set-name>
```

Altere o número de réplicas do seu StatefulSet:

```shell
kubectl scale statefulsets <stateful-set-name> --replicas=<new-replicas>
```

### Faça atualizações in-place nos seus StatefulSets

Alternativamente, você pode fazer
[atualizações in-place](/docs/concepts/cluster-administration/manage-deployment/#in-place-updates-of-resources)
em seus StatefulSets.

Se o seu StatefulSet foi criado inicialmente com `kubectl apply`,
atualize o `.spec.replicas` dos manifestos do StatefulSet e, em seguida, execute um `kubectl apply`:

```shell
kubectl apply -f <stateful-set-file-updated>
```

Caso contrário, edite esse campo com `kubectl edit`:

```shell
kubectl edit statefulsets <stateful-set-name>
```

Ou use `kubectl patch`:

```shell
kubectl patch statefulsets <stateful-set-name> -p '{"spec":{"replicas":<new-replicas>}}'
```

## Solução de problemas

### Reduzir o número de réplicas não funciona corretamente

Você não pode reduzir o número de réplicas de um StatefulSet enquanto qualquer um dos Pods
com estado que ele gerencia não estiver íntegro. A redução do número de réplicas
só ocorre depois que esses Pods com estado estiverem em execução e prontos.

Se `spec.replicas` > 1, o Kubernetes não consegue determinar o motivo de um Pod com estado
não estar íntegro. Isso pode ser resultado de uma falha permanente ou de uma falha transitória.
Uma falha transitória pode ser causada por uma reinicialização necessária devido a uma atualização ou manutenção.

Se o Pod não estiver íntegro devido a uma falha permanente, redimensionar sem corrigir
a falha pode levar a um estado em que a quantidade de membros do StatefulSet fique abaixo
do número mínimo de réplicas necessário para funcionar corretamente.
Isso pode fazer com que seu StatefulSet se torne indisponível.

Se o Pod não estiver íntegro devido a uma falha transitória e o Pod possa voltar a ficar disponível,
o erro transitório pode interferir na sua operação de aumento ou redução do número de réplicas.
Alguns bancos de dados distribuídos apresentam problemas quando nós entram e saem ao mesmo tempo. Nesses casos,
é melhor analisar as operações de redimensionamento no nível da aplicação e realizar o ajuste apenas quando
você tiver certeza de que o cluster da sua aplicação com estado está completamente íntegro.

## {{% heading "whatsnext" %}}

- Saiba mais sobre [como deletar um StatefulSet](/docs/tasks/run-application/delete-stateful-set/).
