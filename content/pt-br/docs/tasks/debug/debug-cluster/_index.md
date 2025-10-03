---
title: "Solução de problemas em Clusters"
description: Depurando problemas comuns em clusters.
weight: 20
no_list: true
---

<!-- overview -->

Esta documentação é sobre solução de problemas em clusters; assumimos que você já descartou sua aplicação como a causa raiz do
problema que está enfrentando. Consulte o [guia de solução de problemas em aplicações](/docs/tasks/debug/debug-application/) para
dicas sobre depuração de aplicações.
Você também pode visitar o [documento de visão geral de solução de problemas](/docs/tasks/debug/) para mais informações.

Para solução de problemas do {{<glossary_tooltip text="kubectl" term_id="kubectl">}}, consulte
[Solução de problemas do kubectl](/docs/tasks/debug/debug-cluster/troubleshoot-kubectl/).

<!-- body -->

## Listando seu cluster

A primeira coisa a depurar no seu cluster é se todos os seus nós estão registrados corretamente.

Execute o seguinte comando:

```shell
kubectl get nodes
```

E verifique se todos os nós que você espera ver estão presentes e se todos estão no estado `Ready`.

Para obter informações detalhadas sobre a integridade geral do seu cluster, você pode executar:

```shell
kubectl cluster-info dump
```

### Exemplo: depurando um nó indisponível/inacessível

Às vezes, durante a depuração, pode ser útil verificar o status de um nó -- por exemplo, porque
você notou um comportamento estranho de um Pod que está executando no nó, ou para descobrir por que um Pod
não será alocado no nó. Assim como com os Pods, você pode usar `kubectl describe node` e `kubectl get
node -o yaml` para recuperar informações detalhadas sobre os nós. Por exemplo, aqui está o que você verá se
um nó estiver indisponível (desconectado da rede, ou o kubelet morre e não reinicia, etc.). Observe
os eventos que mostram que o nó está `NotReady`, e também observe que os pods não estão mais em execução
(eles são removidos após cinco minutos de status `NotReady`).

```shell
kubectl get nodes
```

```none
NAME                     STATUS       ROLES     AGE     VERSION
kube-worker-1            NotReady     <none>    1h      v1.23.3
kubernetes-node-bols     Ready        <none>    1h      v1.23.3
kubernetes-node-st6x     Ready        <none>    1h      v1.23.3
kubernetes-node-unaj     Ready        <none>    1h      v1.23.3
```

```shell
kubectl describe node kube-worker-1
```

```none
Name:               kube-worker-1
Roles:              <none>
Labels:             beta.kubernetes.io/arch=amd64
                    beta.kubernetes.io/os=linux
                    kubernetes.io/arch=amd64
                    kubernetes.io/hostname=kube-worker-1
                    kubernetes.io/os=linux
                    node.alpha.kubernetes.io/ttl: 0
                    volumes.kubernetes.io/controller-managed-attach-detach: true
CreationTimestamp:  Thu, 17 Feb 2022 16:46:30 -0500
Taints:             node.kubernetes.io/unreachable:NoExecute
                    node.kubernetes.io/unreachable:NoSchedule
Unschedulable:      false
Lease:
  HolderIdentity:  kube-worker-1
  AcquireTime:     <unset>
  RenewTime:       Thu, 17 Feb 2022 17:13:09 -0500
Conditions:
  Type                 Status    LastHeartbeatTime                 LastTransitionTime                Reason              Message
  ----                 ------    -----------------                 ------------------                ------              -------
  NetworkUnavailable   False     Thu, 17 Feb 2022 17:09:13 -0500   Thu, 17 Feb 2022 17:09:13 -0500   WeaveIsUp           Weave pod has set this
  MemoryPressure       Unknown   Thu, 17 Feb 2022 17:12:40 -0500   Thu, 17 Feb 2022 17:13:52 -0500   NodeStatusUnknown   Kubelet stopped posting node status.
  DiskPressure         Unknown   Thu, 17 Feb 2022 17:12:40 -0500   Thu, 17 Feb 2022 17:13:52 -0500   NodeStatusUnknown   Kubelet stopped posting node status.
  PIDPressure          Unknown   Thu, 17 Feb 2022 17:12:40 -0500   Thu, 17 Feb 2022 17:13:52 -0500   NodeStatusUnknown   Kubelet stopped posting node status.
  Ready                Unknown   Thu, 17 Feb 2022 17:12:40 -0500   Thu, 17 Feb 2022 17:13:52 -0500   NodeStatusUnknown   Kubelet stopped posting node status.
Addresses:
  InternalIP:  192.168.0.113
  Hostname:    kube-worker-1
Capacity:
  cpu:                2
  ephemeral-storage:  15372232Ki
  hugepages-2Mi:      0
  memory:             2025188Ki
  pods:               110
Allocatable:
  cpu:                2
  ephemeral-storage:  14167048988
  hugepages-2Mi:      0
  memory:             1922788Ki
  pods:               110
System Info:
  Machine ID:                 9384e2927f544209b5d7b67474bbf92b
  System UUID:                aa829ca9-73d7-064d-9019-df07404ad448
  Boot ID:                    5a295a03-aaca-4340-af20-1327fa5dab5c
  Kernel Version:             5.13.0-28-generic
  OS Image:                   Ubuntu 21.10
  Operating System:           linux
  Architecture:               amd64
  Container Runtime Version:  containerd://1.5.9
  Kubelet Version:            v1.23.3
  Kube-Proxy Version:         v1.23.3
Non-terminated Pods:          (4 in total)
  Namespace                   Name                                 CPU Requests  CPU Limits  Memory Requests  Memory Limits  Age
  ---------                   ----                                 ------------  ----------  ---------------  -------------  ---
  default                     nginx-deployment-67d4bdd6f5-cx2nz    500m (25%)    500m (25%)  128Mi (6%)       128Mi (6%)     23m
  default                     nginx-deployment-67d4bdd6f5-w6kd7    500m (25%)    500m (25%)  128Mi (6%)       128Mi (6%)     23m
  kube-system                 kube-proxy-dnxbz                     0 (0%)        0 (0%)      0 (0%)           0 (0%)         28m
  kube-system                 weave-net-gjxxp                      100m (5%)     0 (0%)      200Mi (10%)      0 (0%)         28m
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  Resource           Requests     Limits
  --------           --------     ------
  cpu                1100m (55%)  1 (50%)
  memory             456Mi (24%)  256Mi (13%)
  ephemeral-storage  0 (0%)       0 (0%)
  hugepages-2Mi      0 (0%)       0 (0%)
Events:
...
```

```shell
kubectl get node kube-worker-1 -o yaml
```

```yaml
apiVersion: v1
kind: Node
metadata:
  annotations:
    node.alpha.kubernetes.io/ttl: "0"
    volumes.kubernetes.io/controller-managed-attach-detach: "true"
  creationTimestamp: "2022-02-17T21:46:30Z"
  labels:
    beta.kubernetes.io/arch: amd64
    beta.kubernetes.io/os: linux
    kubernetes.io/arch: amd64
    kubernetes.io/hostname: kube-worker-1
    kubernetes.io/os: linux
  name: kube-worker-1
  resourceVersion: "4026"
  uid: 98efe7cb-2978-4a0b-842a-1a7bf12c05f8
spec: {}
status:
  addresses:
  - address: 192.168.0.113
    type: InternalIP
  - address: kube-worker-1
    type: Hostname
  allocatable:
    cpu: "2"
    ephemeral-storage: "14167048988"
    hugepages-2Mi: "0"
    memory: 1922788Ki
    pods: "110"
  capacity:
    cpu: "2"
    ephemeral-storage: 15372232Ki
    hugepages-2Mi: "0"
    memory: 2025188Ki
    pods: "110"
  conditions:
  - lastHeartbeatTime: "2022-02-17T22:20:32Z"
    lastTransitionTime: "2022-02-17T22:20:32Z"
    message: Weave pod has set this
    reason: WeaveIsUp
    status: "False"
    type: NetworkUnavailable
  - lastHeartbeatTime: "2022-02-17T22:20:15Z"
    lastTransitionTime: "2022-02-17T22:13:25Z"
    message: kubelet has sufficient memory available
    reason: KubeletHasSufficientMemory
    status: "False"
    type: MemoryPressure
  - lastHeartbeatTime: "2022-02-17T22:20:15Z"
    lastTransitionTime: "2022-02-17T22:13:25Z"
    message: kubelet has no disk pressure
    reason: KubeletHasNoDiskPressure
    status: "False"
    type: DiskPressure
  - lastHeartbeatTime: "2022-02-17T22:20:15Z"
    lastTransitionTime: "2022-02-17T22:13:25Z"
    message: kubelet has sufficient PID available
    reason: KubeletHasSufficientPID
    status: "False"
    type: PIDPressure
  - lastHeartbeatTime: "2022-02-17T22:20:15Z"
    lastTransitionTime: "2022-02-17T22:15:15Z"
    message: kubelet is posting ready status
    reason: KubeletReady
    status: "True"
    type: Ready
  daemonEndpoints:
    kubeletEndpoint:
      Port: 10250
  nodeInfo:
    architecture: amd64
    bootID: 22333234-7a6b-44d4-9ce1-67e31dc7e369
    containerRuntimeVersion: containerd://1.5.9
    kernelVersion: 5.13.0-28-generic
    kubeProxyVersion: v1.23.3
    kubeletVersion: v1.23.3
    machineID: 9384e2927f544209b5d7b67474bbf92b
    operatingSystem: linux
    osImage: Ubuntu 21.10
    systemUUID: aa829ca9-73d7-064d-9019-df07404ad448
```


## Examinando logs

Por enquanto, investigar mais profundamente o cluster requer fazer login nas máquinas relevantes. Veja abaixo as localizações
dos arquivos de log relevantes. Em sistemas baseados em systemd, você pode precisar usar `journalctl` ao invés de examinar arquivos de log.

### Nós da camada de gerenciamento

* `/var/log/kube-apiserver.log` - Servidor de API, responsável por servir a API
* `/var/log/kube-scheduler.log` - Agendador, responsável por tomar decisões de alocação
* `/var/log/kube-controller-manager.log` - um componente que executa a maioria dos
  {{<glossary_tooltip text="controladores" term_id="controller">}} embutidos do Kubernetes, com a notável exceção da alocação
  (o kube-scheduler lida com a alocação).

### Nós de carga de trabalho

* `/var/log/kubelet.log` - logs do kubelet, responsável por executar contêineres no nó
* `/var/log/kube-proxy.log` - logs do `kube-proxy`, que é responsável por direcionar tráfego para endpoints de Service

## Modos de falha do cluster

Esta é uma lista incompleta de coisas que podem dar errado e como ajustar a configuração do seu cluster para mitigar os problemas.

### Causas contribuintes

- Desligamento de VM(s)
- Partição de rede dentro do cluster, ou entre cluster e usuários
- Falhas no software do Kubernetes
- Perda de dados ou indisponibilidade de armazenamento persistente (por exemplo, volume GCE PD ou AWS EBS)
- Erro do operador, por exemplo, software do Kubernetes ou software de aplicação mal configurados

### Cenários específicos

- Desligamento de VM do servidor de API ou falha do servidor de API
  - Resultados
    - incapaz de parar, atualizar ou iniciar novos pods, services, replication controller
    - pods e services existentes devem continuar funcionando normalmente, a menos que dependam da API do Kubernetes
- Armazenamento de apoio do servidor de API perdido
  - Resultados
    - o componente kube-apiserver falha ao iniciar com sucesso e se tornar íntegro
    - kubelets não conseguirão alcançá-lo, mas continuarão a executar os mesmos pods e fornecer o mesmo proxy de serviço
    - recuperação manual ou recriação do estado do servidor de API necessária antes que o servidor de API seja reiniciado
- Desligamento ou falha de VM dos serviços de apoio (controlador de nó, gerenciador de replication controller, agendador, etc)
  - atualmente eles estão localizados junto com o servidor de API, e sua indisponibilidade tem consequências similares ao servidor de API
  - no futuro, estes serão replicados também e podem não estar localizados juntos
  - eles não têm seu próprio estado persistente
- Nó individual (VM ou máquina física) desliga
  - Resultados
    - pods nesse nó param de executar
- Partição de rede
  - Resultados
    - partição A pensa que os nós na partição B estão inativos; partição B pensa que o servidor de API está inativo.
      (Assumindo que a VM principal fique na partição A.)
- Falha de software do Kubelet
  - Resultados
    - kubelet com falha não consegue iniciar novos pods no nó
    - kubelet pode deletar os pods ou não
    - nó marcado como não íntegro
    - replication controllers iniciam novos pods em outros lugares
- Erro do operador do cluster
  - Resultados
    - perda de pods, services, etc
    - perda do armazenamento de apoio do servidor de API
    - usuários incapazes de ler a API
    - etc.

### Mitigações

- Ação: Use a funcionalidade de reinicialização automática de VM do provedor IaaS para VMs IaaS
  - Mitiga: Desligamento de VM do servidor de API ou falha do servidor de API
  - Mitiga: Desligamento de VM de serviços de apoio ou falhas

- Ação: Use armazenamento confiável de provedores IaaS (por exemplo, GCE PD ou volume AWS EBS) para VMs com servidor de API + etcd
  - Mitiga: Armazenamento de apoio do servidor de API perdido

- Ação: Use configuração de [alta disponibilidade](/docs/setup/production-environment/tools/kubeadm/high-availability/)
  - Mitiga: Desligamento de nó da camada de gerenciamento ou falha de componentes da camada de gerenciamento (agendador, servidor de API, controller-manager)
    - Tolerará uma ou mais falhas simultâneas de nó ou componente
  - Mitiga: Armazenamento de apoio do servidor de API (ou seja, diretório de dados do etcd) perdido
    - Assume configuração de etcd HA (alta disponibilidade)

- Ação: Fazer snapshot de PDs/volumes EBS do servidor de API periodicamente
  - Mitiga: Armazenamento de apoio do servidor de API perdido
  - Mitiga: Alguns casos de erro do operador
  - Mitiga: Alguns casos de falha de software do Kubernetes

- Ação: usar replication controller e services na frente dos pods
  - Mitiga: Desligamento de nó
  - Mitiga: Falha de software do Kubelet

- Ação: aplicações (contêineres) projetadas para tolerar reinicializações inesperadas
  - Mitiga: Desligamento de nó
  - Mitiga: Falha de software do Kubelet


## {{% heading "whatsnext" %}}

* Aprenda sobre as métricas disponíveis no
  [Pipeline de Métricas de Recursos](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/)
* Descubra ferramentas adicionais para
  [monitoramento de uso de recursos](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
* Use o Node Problem Detector para
  [monitorar a integridade do nó](/docs/tasks/debug/debug-cluster/monitor-node-health/)
* Use `kubectl debug node` para [depurar nós do Kubernetes](/docs/tasks/debug/debug-cluster/kubectl-node-debug)
* Use `crictl` para [depurar nós do Kubernetes](/docs/tasks/debug/debug-cluster/crictl/)
* Obtenha mais informações sobre [auditoria do Kubernetes](/docs/tasks/debug/debug-cluster/audit/)
* Use `telepresence` para [desenvolver e depurar serviços localmente](/docs/tasks/debug/debug-cluster/local-debugging/)
