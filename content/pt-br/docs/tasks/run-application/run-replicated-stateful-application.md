---
title: Execute uma Aplicação Com Estado e Replicada
content_type: tutorial
weight: 30
---

<!-- overview -->

Esta página mostra como executar uma aplicação com estado e replicada usando um
{{< glossary_tooltip term_id="statefulset" >}}.
Esta aplicação é um banco de dados MySQL replicado. A topologia de exemplo possui
um único servidor primário e múltiplas réplicas, utilizando replicação assíncrona
baseada em linhas.

{{< note >}}
**Esta não é uma configuração para produção**. As configurações do MySQL permanecem nos padrões inseguros
para manter o foco nos padrões gerais de execução de aplicações com estado no Kubernetes.
{{< /note >}}

## {{% heading "prerequisites" %}}

- {{< include "task-tutorial-prereqs.md" >}}
- {{< include "default-storage-class-prereqs.md" >}}
- Este tutorial assume que você está familiarizado com
  [PersistentVolumes](/docs/concepts/storage/persistent-volumes/)
  e [StatefulSets](/docs/concepts/workloads/controllers/statefulset/),
  assim como outros conceitos centrais como [Pods](/docs/concepts/workloads/pods/),
  [Services](/docs/concepts/services-networking/service/) e
  [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/).
- Algum conhecimento prévio de MySQL ajuda, mas este tutorial busca apresentar
  padrões gerais que devem ser úteis para outros sistemas.
- Você está utilizando o namespace padrão ou outro namespace que não contenha objetos conflitantes.
- Você precisa ter uma CPU compatível com AMD64.

## {{% heading "objectives" %}}

- Implantar uma topologia MySQL replicada com um StatefulSet.
- Enviar tráfego de cliente MySQL.
- Observar a resistência a indisponibilidades.
- Escalonar o StatefulSet para mais ou para menos réplicas.

<!-- lessoncontent -->

## Implantar o MySQL

A instalação de exemplo do MySQL consiste em um ConfigMap, dois Services
e um StatefulSet.

### Criar um ConfigMap {#configmap}

Crie o ConfigMap a partir do seguinte arquivo de configuração YAML:

{{% code_sample file="application/mysql/mysql-configmap.yaml" %}}

```shell
kubectl apply -f https://k8s.io/examples/application/mysql/mysql-configmap.yaml
```

Este ConfigMap fornece substituições para o `my.cnf` que permitem controlar independentemente
a configuração no servidor MySQL primário e em suas réplicas.
Neste caso, você deseja que o servidor primário possa disponibilizar logs de replicação para as réplicas
e que as réplicas rejeitem qualquer escrita que não venha por meio da replicação.

Não há nada de especial no próprio ConfigMap que faça com que diferentes
partes sejam aplicadas a diferentes Pods.
Cada Pod decide qual parte utilizar durante sua inicialização,
com base nas informações fornecidas pelo controlador StatefulSet.

### Criar Services {#services}

Crie os Services a partir do seguinte arquivo de configuração YAML:

{{% code_sample file="application/mysql/mysql-services.yaml" %}}

```shell
kubectl apply -f https://k8s.io/examples/application/mysql/mysql-services.yaml
```

O Service headless fornece um local para as entradas de DNS que o
{{< glossary_tooltip text="controlador" term_id="controller" >}} do StatefulSet cria para cada
Pod que faz parte do conjunto.
Como o Service headless se chama `mysql`, os Pods são acessíveis por meio da resolução de `<nome-do-pod>.mysql`
a partir de qualquer outro Pod no mesmo cluster e namespace do Kubernetes.

O Service de cliente, chamado `mysql-read`, é um Service normal com seu próprio IP de cluster,
que distribui as conexões entre todos os Pods MySQL que estejam prontos (Ready).
O conjunto de endpoints potenciais inclui o servidor MySQL primário e todas as réplicas.

Observe que apenas consultas de leitura podem utilizar o Service de cliente com balanceamento de carga.
Como existe apenas um servidor MySQL primário, os clientes devem se conectar diretamente
ao Pod MySQL primário (por meio de sua entrada DNS no Service headless) para executar operações de escrita.

### Criar o StatefulSet {#statefulset}

Por fim, crie o StatefulSet a partir do seguinte arquivo de configuração YAML:

{{% code_sample file="application/mysql/mysql-statefulset.yaml" %}}

```shell
kubectl apply -f https://k8s.io/examples/application/mysql/mysql-statefulset.yaml
```

Você pode acompanhar o progresso da inicialização executando:

```shell
kubectl get pods -l app=mysql --watch
```

Após algum tempo, você deverá ver os 3 Pods com o status `Running`:

```
NAME      READY     STATUS    RESTARTS   AGE
mysql-0   2/2       Running   0          2m
mysql-1   2/2       Running   0          1m
mysql-2   2/2       Running   0          1m
```

Pressione **Ctrl+C** para cancelar o watch.

{{< note >}}
Se você não observar nenhum progresso, certifique-se de que há um provisionador dinâmico
de PersistentVolume habilitado, conforme mencionado nos [pré-requisitos](#antes-de-você-começar).
{{< /note >}}

Este manifesto utiliza diversas técnicas para gerenciar Pods com estado como parte de um StatefulSet.
A próxima seção destaca algumas dessas técnicas para explicar o que acontece à medida que o StatefulSet cria os Pods.

## Entendendo a inicialização de Pods com estado

O controlador de StatefulSet inicia os Pods um de cada vez, na ordem do seu índice ordinal.
Ele aguarda até que cada Pod reporte estar Ready antes de iniciar o próximo.

Além disso, o controlador atribui a cada Pod um nome único e estável no formato
`<nome-do-statefulset>-<índice-ordinal>`, o que resulta em Pods chamados `mysql-0`, `mysql-1` e `mysql-2`.

O template de Pod no manifesto do StatefulSet acima aproveita essas propriedades
para realizar a inicialização ordenada da replicação do MySQL.

### Gerando configuração

Antes de iniciar qualquer um dos contêineres especificados no Pod, o Pod executa primeiro todos os
[contêineres de inicialização](/docs/concepts/workloads/pods/init-containers/) na ordem definida.

O primeiro init container, chamado `init-mysql`, gera arquivos de configuração
especiais do MySQL com base no índice ordinal.

O script determina seu próprio índice ordinal extraindo-o do final do nome do Pod, que é retornado pelo comando `hostname`.
Em seguida, ele salva o ordinal (com um deslocamento numérico para evitar valores reservados)
em um arquivo chamado `server-id.cnf` no diretório `conf.d` do MySQL.
Isso traduz a identidade única e estável fornecida pelo StatefulSet
para o domínio dos IDs de servidor do MySQL, que exigem as mesmas propriedades.

O script no contêiner `init-mysql` também aplica `primary.cnf` ou
`replica.cnf` do ConfigMap, copiando o conteúdo para o diretório `conf.d`.
Como a topologia de exemplo consiste em um único servidor MySQL primário e qualquer número de réplicas,
o script atribui o ordinal `0` como o servidor primário, e todos os demais como réplicas.
Combinado com a [garantia de ordem de implantação](/docs/concepts/workloads/controllers/statefulset/#deployment-and-scaling-guarantees)
do controlador StatefulSet, isso garante que o servidor MySQL primário esteja Ready antes de criar as réplicas,
para que elas possam começar a replicar.

### Clonando dados existentes

De modo geral, quando um novo Pod entra no conjunto como réplica,
ele deve assumir que o servidor MySQL primário pode já conter dados.
Também deve considerar que os logs de replicação podem não cobrir todo o histórico desde o início.
Essas suposições conservadoras são fundamentais para permitir que um StatefulSet em execução
possa ser escalonado para mais ou para menos ao longo do tempo, em vez de ficar limitado ao seu tamanho inicial.

O segundo contêiner de inicialização, chamado `clone-mysql`, realiza uma operação de clonagem em um Pod réplica
na primeira vez que ele é iniciado em um PersistentVolume vazio.
Isso significa que ele copia todos os dados existentes de outro Pod em execução,
de modo que seu estado local fique consistente o suficiente para começar a replicar a partir do servidor primário.

O próprio MySQL não fornece um mecanismo para isso, então o exemplo utiliza uma ferramenta
open source popular chamada Percona XtraBackup.
Durante a clonagem, o servidor MySQL de origem pode sofrer redução de desempenho.
Para minimizar o impacto no servidor MySQL primário, o script instrui cada Pod a clonar a partir do Pod cujo índice ordinal é um a menos.
Isso funciona porque o controlador do StatefulSet sempre garante que o Pod `N` esteja Ready antes de iniciar o Pod `N+1`.

### Iniciando a replicação

Após a conclusão bem-sucedida dos contêineres de inicialização, os contêineres regulares são executados.
Os Pods MySQL consistem em um contêiner `mysql`, que executa o servidor `mysqld`,
e um contêiner `xtrabackup`, que atua como um [sidecar](/blog/2015/06/the-distributed-system-toolkit-patterns).

O sidecar `xtrabackup` analisa os arquivos de dados clonados e determina se
é necessário inicializar a replicação do MySQL na réplica.
Se for o caso, ele aguarda o `mysqld` estar pronto e então executa os comandos
`CHANGE MASTER TO` e `START SLAVE` com os parâmetros de replicação extraídos dos arquivos clonados pelo XtraBackup.

Assim que uma réplica inicia a replicação, ela memoriza seu servidor MySQL primário e
reconecta-se automaticamente caso o servidor reinicie ou a conexão seja perdida.
Além disso, como as réplicas procuram o servidor primário pelo seu nome DNS estável
(`mysql-0.mysql`), elas o encontram automaticamente mesmo que ele receba um novo
IP de Pod devido a um reagendamento.

Por fim, após iniciar a replicação, o contêiner `xtrabackup` fica aguardando conexões de outros
Pods que solicitam a clonagem de dados.
Esse servidor permanece ativo indefinidamente caso o StatefulSet seja escalonado para mais réplicas,
ou caso o próximo Pod perca seu PersistentVolumeClaim e precise refazer a clonagem.

## Enviando tráfego de cliente

Você pode enviar consultas de teste para o servidor MySQL primário (hostname `mysql-0.mysql`)
executando um contêiner temporário com a imagem `mysql:5.7` e utilizando o cliente `mysql`.

```shell
kubectl run mysql-client --image=mysql:5.7 -i --rm --restart=Never --\
  mysql -h mysql-0.mysql <<EOF
CREATE DATABASE test;
CREATE TABLE test.messages (message VARCHAR(250));
INSERT INTO test.messages VALUES ('hello');
EOF
```

Use o hostname `mysql-read` para enviar consultas de teste para qualquer servidor que esteja com o status Ready:

```shell
kubectl run mysql-client --image=mysql:5.7 -i -t --rm --restart=Never --\
  mysql -h mysql-read -e "SELECT * FROM test.messages"
```

Você deverá obter uma saída semelhante a esta:

```
Waiting for pod default/mysql-client to be running, status is Pending, pod ready: false
+---------+
| message |
+---------+
| hello   |
+---------+
pod "mysql-client" deleted
```

Para demonstrar que o Service `mysql-read` distribui as conexões entre os servidores, você pode executar `SELECT @@server_id` em um loop:

```shell
kubectl run mysql-client-loop --image=mysql:5.7 -i -t --rm --restart=Never --\
  bash -ic "while sleep 1; do mysql -h mysql-read -e 'SELECT @@server_id,NOW()'; done"
```

Você deverá ver o valor de `@@server_id` mudar aleatoriamente, pois um endpoint diferente pode ser selecionado a cada tentativa de conexão:

```
+-------------+---------------------+
| @@server_id | NOW()               |
+-------------+---------------------+
|         100 | 2006-01-02 15:04:05 |
+-------------+---------------------+
+-------------+---------------------+
| @@server_id | NOW()               |
+-------------+---------------------+
|         102 | 2006-01-02 15:04:06 |
+-------------+---------------------+
+-------------+---------------------+
| @@server_id | NOW()               |
+-------------+---------------------+
|         101 | 2006-01-02 15:04:07 |
+-------------+---------------------+
```

Você pode pressionar **Ctrl+C** quando quiser parar o loop, mas é útil mantê-lo rodando em
outra janela para que você possa observar os efeitos dos próximos passos.

## Simular falha de Pod e de Nó {#simulate-pod-and-node-downtime}

Para demonstrar a maior disponibilidade ao ler do pool de réplicas em vez de um único servidor,
mantenha o loop do `SELECT @@server_id` rodando enquanto você força um Pod a sair do estado Ready.

### Quebrar a verificação de prontidão

A [verificação de prontidão](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-readiness-probes)
do contêiner `mysql` executa o comando `mysql -h 127.0.0.1 -e 'SELECT 1'`
para garantir que o servidor está ativo e apto a executar consultas.

Uma forma de forçar essa verificação de prontidão a falhar é quebrar esse comando:

```shell
kubectl exec mysql-2 -c mysql -- mv /usr/bin/mysql /usr/bin/mysql.off
```

Esse comando acessa o sistema de arquivos do contêiner real do Pod `mysql-2` e renomeia o comando
`mysql` para que a verificação de prontidão não consiga encontrá-lo.
Após alguns segundos, o Pod deverá indicar que um de seus contêineres não está Ready,
o que você pode verificar executando:

```shell
kubectl get pod mysql-2
```

Procure por `1/2` na coluna `READY`:

```
NAME      READY     STATUS    RESTARTS   AGE
mysql-2   1/2       Running   0          3m
```

Neste momento, você deverá ver o loop do `SELECT @@server_id` continuar rodando, embora ele não mostre mais o valor `102`.
Lembre-se de que o script `init-mysql` definiu o `server-id` como `100 + $ordinal`, então o ID de servidor `102` corresponde ao Pod `mysql-2`.

Agora, repare o Pod e ele deverá voltar a aparecer na saída do loop após alguns segundos:

```shell
kubectl exec mysql-2 -c mysql -- mv /usr/bin/mysql.off /usr/bin/mysql
```

### Excluir Pods

O StatefulSet também recria Pods caso eles sejam excluídos, de forma semelhante ao que um ReplicaSet faz para Pods sem estado.

```shell
kubectl delete pod mysql-2
```

O controlador do StatefulSet percebe que o Pod `mysql-2` não existe mais e cria um novo com o mesmo nome,
vinculado ao mesmo PersistentVolumeClaim.
Você deverá ver o ID de servidor `102` desaparecer da saída do loop por um tempo e depois retornar automaticamente.

### Drenar um Nó

Se o seu cluster Kubernetes possui múltiplos Nós, você pode simular uma
indisponibilidade de Nó (como durante atualizações) utilizando o comando [drain](/docs/reference/generated/kubectl/kubectl-commands/#drain).

Primeiro, determine em qual Nó um dos Pods MySQL está localizado:

```shell
kubectl get pod mysql-2 -o wide
```

O nome do Nó deverá aparecer na última coluna:

```
NAME      READY     STATUS    RESTARTS   AGE       IP            NODE
mysql-2   2/2       Running   0          15m       10.244.5.27   kubernetes-node-9l2t
```

Em seguida, drene o Nó executando o comando abaixo, que irá isolá-lo para que nenhum novo Pod seja alocado nele e,
em seguida, irá remover quaisquer Pods existentes.
Substitua `<node-name>` pelo nome do Nó que você encontrou no passo anterior.

{{< caution >}}
Drenar um Nó pode impactar outras cargas de trabalho e aplicações
em execução no mesmo nó. Execute o passo a seguir apenas em um cluster de testes.
{{< /caution >}}

```shell
# Veja o aviso acima sobre o impacto em outras cargas de trabalho
kubectl drain <node-name> --force --delete-emptydir-data --ignore-daemonsets
```

Agora você pode observar o Pod sendo realocado em outro Nó:

```shell
kubectl get pod mysql-2 -o wide --watch
```

Deverá se parecer com isto:

```
NAME      READY   STATUS          RESTARTS   AGE       IP            NODE
mysql-2   2/2     Terminating     0          15m       10.244.1.56   kubernetes-node-9l2t
[...]
mysql-2   0/2     Pending         0          0s        <none>        kubernetes-node-fjlm
mysql-2   0/2     Init:0/2        0          0s        <none>        kubernetes-node-fjlm
mysql-2   0/2     Init:1/2        0          20s       10.244.5.32   kubernetes-node-fjlm
mysql-2   0/2     PodInitializing 0          21s       10.244.5.32   kubernetes-node-fjlm
mysql-2   1/2     Running         0          22s       10.244.5.32   kubernetes-node-fjlm
mysql-2   2/2     Running         0          30s       10.244.5.32   kubernetes-node-fjlm
```

E novamente, você deverá ver o ID de servidor `102` desaparecer da saída do loop do
`SELECT @@server_id` por um tempo e depois retornar.

Agora, remova o isolamento do Nó para retorná-lo ao estado normal:

```shell
kubectl uncordon <node-name>
```

## Escalonando o número de réplicas

Ao utilizar replicação MySQL, você pode aumentar a capacidade de consultas de leitura adicionando réplicas.
Para um StatefulSet, isso pode ser feito com um único comando:

```shell
kubectl scale statefulset mysql  --replicas=5
```

Acompanhe a criação dos novos Pods executando:

```shell
kubectl get pods -l app=mysql --watch
```

Assim que estiverem ativos, você deverá ver os IDs de servidor `103` e `104` começarem a
aparecer na saída do loop do `SELECT @@server_id`.

Você também pode verificar se esses novos servidores possuem os dados que você adicionou
antes de eles existirem:

```shell
kubectl run mysql-client --image=mysql:5.7 -i -t --rm --restart=Never --\
  mysql -h mysql-3.mysql -e "SELECT * FROM test.messages"
```

```
Waiting for pod default/mysql-client to be running, status is Pending, pod ready: false
+---------+
| message |
+---------+
| hello   |
+---------+
pod "mysql-client" deleted
```

Reduzir o número de réplicas também é um processo transparente:

```shell
kubectl scale statefulset mysql --replicas=3
```

{{< note >}}
Embora o escalonamento para cima crie novos PersistentVolumeClaims automaticamente,
o escalonamento para baixo não exclui esses PVCs automaticamente.

Isso lhe dá a opção de manter esses PVCs inicializados para tornar o escalonamento
para cima mais rápido, ou extrair os dados antes de excluí-los.
{{< /note >}}

Você pode ver isso executando:

```shell
kubectl get pvc -l app=mysql
```

O que mostra que todos os 5 PVCs ainda existem, apesar de o StatefulSet ter sido reduzido para 3 réplicas:

```
NAME           STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
data-mysql-0   Bound     pvc-8acbf5dc-b103-11e6-93fa-42010a800002   10Gi       RWO           20m
data-mysql-1   Bound     pvc-8ad39820-b103-11e6-93fa-42010a800002   10Gi       RWO           20m
data-mysql-2   Bound     pvc-8ad69a6d-b103-11e6-93fa-42010a800002   10Gi       RWO           20m
data-mysql-3   Bound     pvc-50043c45-b1c5-11e6-93fa-42010a800002   10Gi       RWO           2m
data-mysql-4   Bound     pvc-500a9957-b1c5-11e6-93fa-42010a800002   10Gi       RWO           2m
```

Se você não pretende reutilizar os PVCs extras, pode excluí-los:

```shell
kubectl delete pvc data-mysql-3
kubectl delete pvc data-mysql-4
```

## {{% heading "cleanup" %}}

1. Cancele o loop `SELECT @@server_id` pressionando **Ctrl+C** no terminal correspondente,
   ou executando o seguinte comando em outro terminal:

   ```shell
   kubectl delete pod mysql-client-loop --now
   ```

1. Exclua o StatefulSet. Isso também inicia a finalização dos Pods.

   ```shell
   kubectl delete statefulset mysql
   ```

1. Verifique se os Pods desapareceram.
   Eles podem levar algum tempo para serem finalizados.

   ```shell
   kubectl get pods -l app=mysql
   ```

   Você saberá que os Pods foram finalizados quando o comando acima retornar:

   ```
   No resources found.
   ```

1. Exclua o ConfigMap, os Services e os PersistentVolumeClaims.

   ```shell
   kubectl delete configmap,service,pvc -l app=mysql
   ```

1. Se você provisionou PersistentVolumes manualmente, também será necessário excluí-los manualmente, assim como liberar os recursos subjacentes.
   Se você utilizou um provisionador dinâmico, ele exclui automaticamente os PersistentVolumes ao detectar que você excluiu os PersistentVolumeClaims.
   Alguns provisionadores dinâmicos (como os de EBS e PD) também liberam os recursos subjacentes ao excluir os PersistentVolumes.

## {{% heading "whatsnext" %}}

- Saiba mais sobre [escalonar um StatefulSet](/docs/tasks/run-application/scale-stateful-set/).
- Saiba mais sobre [depurar um StatefulSet](/docs/tasks/debug/debug-application/debug-statefulset/).
- Saiba mais sobre [excluir um StatefulSet](/docs/tasks/run-application/delete-stateful-set/).
- Saiba mais sobre [forçar a exclusão de Pods de um StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/).
- Consulte o [repositório de Helm Charts](https://artifacthub.io/) para outros exemplos de aplicações com estado.