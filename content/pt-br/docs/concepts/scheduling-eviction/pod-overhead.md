---
title: Sobrecarga de Pod 
content_type: concept
weight: 50
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

Quando você executa um Pod em um Nó, o próprio Pod usa uma quantidade de recursos do sistema. Estes
recursos são adicionais aos recursos necessários para executar o(s) contêiner(es) dentro do Pod.
No Kubernetes, a sobrecarga de Pod, do inglês _Pod Overhead_, é uma funcionalidade que serve para contabilizar os recursos consumidos pela
infraestrutura do Pod, além das solicitações e limites do contêiner.

<!-- body -->

No Kubernetes, a sobrecarga de Pods é definida durante a 
[admissão](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)
de acordo com a sobrecarga associada à
[RuntimeClass](/docs/concepts/containers/runtime-class/) do Pod.

A sobrecarga é adicionada à soma das solicitações de recursos do contêiner ao agendar um Pod. Da mesma forma, o _kubelet_
incluirá a sobrecarga do Pod ao dimensionar o `cgroup` do Pod, e ao
executar o ranking de prioridade de despejo do Pod.

## Configurando a sobrecarga de Pod {#set-up}

Você deve se certificar de usar um `RuntimeClass` que define o campo `overhead`.

## Exemplo de uso

Para usar a sobrecarga de Pod, deve existir uma RuntimeClass que define o campo `overhead`.
Como um exemplo, você poderia usar a definição da RuntimeClass abaixo com um contêiner runtime de virtualização,
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
usar a sobrecarga de memória e cpu em conta para os cálculos da quota de recursos, para o agendamento de nós,
bem como para o dimensionamento do cgroup do Pod.

Considere executar a seguinte carga de trabalho de exemplo, test-pod:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
spec:
  runtimeClassName: kata-fc
  containers:
  - name: busybox-ctr
    image: busybox:1.28
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

No tempo de admissão o [controlador de admissão](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/) RuntimeClass
atualiza o _PodSpec_ da carga de trabalho de forma a incluir o `overhead` como descrito na RuntimeClass. Se o _PodSpec_ já contiver este campo definido,
o Pod será rejeitado. No exemplo dado, como apenas o nome do RuntimeClass é especificado, o controlador de admissão muda o Pod de forma a
incluir um `overhead`.

Depois do controlador de admissão RuntimeClass ter feito as mudanças, você pode verificar o valor atualizado de sobrecarga:

```bash
kubectl get pod test-pod -o jsonpath='{.spec.overhead}'
```

A saída é:
```
map[cpu:250m memory:120Mi]
```

Se estiver definida uma [ResourceQuota](/docs/concepts/policy/resource-quotas/), a soma dos requisitos do Contêiner assim como 
o campo `overhead` são contados.

Quando o `kube-scheduler` está decidindo que nó deve executar um novo Pod, o agendador considera a sobrecarga do pod,
assim como a soma dos requisitos do contêiner para esse Pod. Para este exemplo, o agendador adiciona as requisições e a sobrecarga, depois procura por um nó com 2.25 CPU e 320 MiB de memória disponível.

Assim que um Pod é agendado para um nó, o kubelet nesse nó cria um novo {{< glossary_tooltip text="cgroup" term_id="cgroup" >}}
para o Pod. É dentro deste Pod que o contêiner Runtime subjacente vai criar os contêineres.

Se o recurso tiver um limite definido para cada contêiner (`QoS Guaranteed` ou `QoS Burstrable` com limites definidos),
o kubelet definirá um limite superior para o cgroup do Pod associado a esse recurso (cpu.cfs_quota_us para CPU
e memory.limit_in_bytes de memória). Este limite superior é baseado na soma dos limites do contêiner mais o `overhead`
definido no PodSpec.

Para CPU, se o Pod for `Guaranteed` ou `Burstrable` QoS, o kubelet vai definir `cpu.shares` baseado na soma dos
requisitos do contêiner mais o `overhead` definido no `PodSpec`.

Olhando para o nosso exemplo, verifique as requisições ao contêiner para a carga de trabalho:

```bash
kubectl get pod test-pod -o jsonpath='{.spec.containers[*].resources.limits}'
```

O total de requisições do contêiner são 2000m CPU e 200MiB de memória:

```
map[cpu: 500m memory:100Mi] map[cpu:1500m memory:100Mi]
```

Verifique isto, em vez de o que é observado pelo nó:

```bash
kubectl describe node | grep test-pod -B2
```

A saída mostra requisições de 2250m para CPU e 320MiB para memória. Os requisitos incluem a sobrecarga de Pod:

```
  Namespace                   Name                CPU Requests  CPU Limits   Memory Requests  Memory Limits  AGE
  ---------                   ----                ------------  ----------   ---------------  -------------  ---
  default                     test-pod            2250m (56%)   2250m (56%)  320Mi (1%)       320Mi (1%)     36m
```

## Verifique os limites do cgroup do Pod

Verifique os cgroups de memória do Pod no nó onde a carga de trabalho está em execução. No seguinte exemplo, [`crictl`](https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md)
é usado no nó, que fornece uma CLI para contêineres runtime CRI-compatíveis. Este é um
exemplo avançado para mostrar o comportamento da sobrecarga do Pod, e não é esperado que os usuários devam verificar
o `cgroups` diretamente no nó.

Primeiro, no nó em particular, determine o identificador do Pod:

```bash
# Execute no nó onde o Pod está agendado
POD_ID="$(sudo crictl pods --name test-pod -q)"
```

A partir disto, você pode determinar o caminho do cgroup para o Pod:

```bash
# Execute no nó onde o Pod está agendado
sudo crictl inspectp -o=json $POD_ID | grep cgroupsPath
```

O caminho do `cgroup` resultante inclui o contêiner `pause` do Pod. O `cgroup` de nível do Pod está um diretório acima.

```
  "cgroupsPath": "/kubepods/podd7f4b509-cf94-4951-9417-d1087c92a5b2/7ccf55aee35dd16aca4189c952d83487297f3cd760f1bbf09620e206e7d0c27a"
```

Neste caso especifico, o caminho do `cgroup` do Pod é `kubepods/podd7f4b509-cf94-4951-9417-d1087c92a5b2`. Verifique a configuração do cgroup de nível de Pod para memória:

```bash
# Execute no nó onde o Pod está agendado
# Mude também o nome do `cgroup` para combinar com o `cgroup` alocado ao seu Pod.
 cat /sys/fs/cgroup/memory/kubepods/podd7f4b509-cf94-4951-9417-d1087c92a5b2/memory.limit_in_bytes
```

Isto é 320 MiB, como esperado:

```
335544320
```

### Observabilidade

Uma métrica `kube_pod_overhead` está disponível em [kube-state-metrics](https://github.com/kubernetes/kube-state-metrics)
para ajudar a identificar quando a sobrecarga de Pod está sendo utilizada e para ajudar a observar a estabilidade das cargas de trabalho
em execução com uma sobrecarga definida.

## {{% heading "whatsnext" %}}

* Aprenda Mais Sobre [RuntimeClass](/docs/concepts/containers/runtime-class/)
* Leia a Proposta de Aprimoramento de [Desenho de sobrecarga de Pod](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/688-pod-overhead)
para um contexto extra
