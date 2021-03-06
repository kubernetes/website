---
reviewers:
- femrtnz
- jcjesus
title: Sobrecarga de Pod 
content_type: concept
weight: 50
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

Quando executa um Pod num nó, o próprio Pod usa uma quantidade de recursos do sistema. Estes
recursos são adicionais aos recursos necessários para executar o(s) contêiner(s) dentro do Pod.
Sobrecarga de Pod, do inglês _Pod Overhead_, é uma funcionalidade que serve para contabilizar os recursos consumidos pela
infraestrutura do Pod para além das solicitações e limites do contêiner.





<!-- body -->

No Kubernetes, a sobrecarga de Pods é definido no tempo de
[admissão](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)
de acordo com a sobrecarga associada à
[RuntimeClass](/docs/concepts/containers/runtime-class/) do Pod.

Quando é ativada a Sobrecarga de Pod, a sobrecarga é considerada adicionalmente à soma das
solicitações de recursos do contêiner ao agendar um Pod. Semelhantemente, o _kubelet_
incluirá a sobrecarga do Pod ao dimensionar o cgroup do Pod e ao
executar a classificação de despejo do Pod.

## Possibilitando a Sobrecarga de Pod {#set-up}

Terá de garantir que o [portão de funcionalidade](/docs/reference/command-line-tools-reference/feature-gates/)
`PodOverhead` esteja ativo (está ativo por padrão a partir da versão 1.18)
em todo o cluster, e uma `RuntimeClass` utilizada que defina o campo `overhead`.

## Exemplo de uso

Para usar a funcionalidade PodOverhead, é necessário uma RuntimeClass que define o campo `overhead`.
Por exemplo, poderia usar a definição da RuntimeClass abaixo com um agente de execução de contêiner virtualizado
que use cerca de 120MiB por Pod para a máquina virtual e o sistema operacional convidado:

```yaml
---
kind: RuntimeClass
apiVersion: node.k8s.io/v1beta1
metadata:
    name: kata-fc
handler: kata-fc
overhead:
    podFixed:
        memory: "120Mi"
        cpu: "250m"
```

As cargas de trabalho que são criadas e que especificam o manipulador RuntimeClass `kata-fc` irão
usar a sobrecarga de memória e cpu em conta para os cálculos da quota de recursos, agendamento de nós,
assim como dimensionamento do cgroup do Pod.

Considere executar a seguinte carga de trabalho de exemplo, test-pod:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-Pod
spec:
  runtimeClassName: kata-fc
  containers:
  - name: busybox-ctr
    image: busybox
    stdin: true
    tty: true
    resources:
      limits:
        cpu: 500m
        memory: 100Mi
  - name: nginx-ctr
    image: nginx
    resources:
      limits:
        cpu: 1500m
        memory: 100Mi
```

Na altura de admissão o [controlador de admissão](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/) RuntimeClass
atualiza o _PodSpec_ da carga de trabalho de forma a incluir o `overhead` como descrito na RuntimeClass. Se o _PodSpec_ já tiver este campo definido
o Pod será rejeitado. No exemplo dado, como apenas o nome do RuntimeClass é especificado, o controlador de admissão muda o Pod de forma a
incluir um `overhead`.

Depois do controlador de admissão RuntimeClass, pode verificar o _PodSpec_ atualizado:

```bash
kubectl get pod test-pod -o jsonpath='{.spec.overhead}'
```

A saída é:
```
map[cpu:250m memory:120Mi]
```

Se for definido um _ResourceQuota_, a soma das requisições dos contêineres assim como o campo `overhead` são contados.

Quando o kube-scheduler está decidindo que nó deve executar um novo Pod, o agendador considera o `overhead` do pod,
assim como a soma de pedidos aos contêineres para esse _Pod_. Para este exemplo, o agendador adiciona as requisições e a sobrecarga, depois procura um nó com 2.25 CPU e 320 MiB de memória disponível.

Assim que um Pod é agendado a um nó, o kubelet nesse nó cria um novo {{< glossary_tooltip text="cgroup" term_id="cgroup" >}}
para o Pod. É dentro deste Pod que o agente de execução de contêiners subjacente vai criar contêineres.

Se o recurso tiver um limite definido para cada contêiner (_QoS_ garantida ou _Burstrable QoS_ com limites definidos),
o kubelet definirá um limite superior para o cgroup do Pod associado a esse recurso (cpu.cfs_quota_us para CPU
e memory.limit_in_bytes de memória). Este limite superior é baseado na soma dos limites do contêiner mais o `overhead`
definido no _PodSpec_.

Para CPU, se o Pod for QoS garantida ou _Burstrable QoS_, o kubelet vai definir `cpu.shares` baseado na soma dos
pedidos ao contêiner mais o `overhead` definido no _PodSpec_.

Olhando para o nosso exemplo, verifique as requisições ao contêiner para a carga de trabalho:
```bash
kubectl get pod test-pod -o jsonpath='{.spec.containers[*].resources.limits}'
```

O total de requisições ao contêiner são 2000m CPU e 200MiB de memória:
```
map[cpu: 500m memory:100Mi] map[cpu:1500m memory:100Mi]
```

Verifique isto comparado ao que é observado pelo nó:
```bash
kubectl describe node | grep test-pod -B2
```

A saída mostra que 2250m CPU e 320MiB de memória são solicitados, que inclui _PodOverhead_:
```
  Namespace                   Name                CPU Requests  CPU Limits   Memory Requests  Memory Limits  AGE
  ---------                   ----                ------------  ----------   ---------------  -------------  ---
  default                     test-pod            2250m (56%)   2250m (56%)  320Mi (1%)       320Mi (1%)     36m
```

## Verificar os limites cgroup do Pod

Verifique os cgroups de memória do Pod no nó onde a carga de trabalho está em execução. No seguinte exemplo, [`crictl`](https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md)
é usado no nó, que fornece uma CLI para agentes de execução compatíveis com CRI. Isto é um
exemplo avançado para mostrar o comportamento do _PodOverhead_, e não é esperado que os usuários precisem verificar
cgroups diretamente no nó.

Primeiro, no nó em particular, determine o identificador do Pod:

```bash
# Execute no nó onde o Pod está agendado
POD_ID="$(sudo crictl pods --name test-pod -q)"
```

A partir disto, pode determinar o caminho do cgroup para o _Pod_:
```bash
# Execute no nó onde o Pod está agendado
sudo crictl inspectp -o=json $POD_ID | grep cgroupsPath
```

O caminho do cgroup resultante inclui o contêiner `pause` do Pod. O cgroup no nível do Pod está um diretório acima.
```
        "cgroupsPath": "/kubepods/podd7f4b509-cf94-4951-9417-d1087c92a5b2/7ccf55aee35dd16aca4189c952d83487297f3cd760f1bbf09620e206e7d0c27a"
```

Neste caso especifico, o caminho do cgroup do Pod é `kubepods/podd7f4b509-cf94-4951-9417-d1087c92a5b2`. Verifique a configuração cgroup de nível do Pod para a memória:
```bash
# Execute no nó onde o Pod está agendado
# Mude também o nome do cgroup para combinar com o cgroup alocado ao Pod.
 cat /sys/fs/cgroup/memory/kubepods/podd7f4b509-cf94-4951-9417-d1087c92a5b2/memory.limit_in_bytes
```

Isto é 320 MiB, como esperado:
```
335544320
```

### Observabilidade

Uma métrica `kube_pod_overhead` está disponível em [kube-state-metrics](https://github.com/kubernetes/kube-state-metrics)
para ajudar a identificar quando o _PodOverhead_ está sendo utilizado e para ajudar a observar a estabilidade das cargas de trabalho
em execução com uma sobrecarga (_Overhead_) definida. Esta funcionalidade não está disponível na versão 1.9 do kube-state-metrics,
mas é esperado em uma próxima versão. Os usuários necessitarão entretanto construir o kube-state-metrics a partir da fonte.



## {{% heading "whatsnext" %}}


* [RuntimeClass](/docs/concepts/containers/runtime-class/)
* [PodOverhead Design](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/20190226-pod-overhead.md)


