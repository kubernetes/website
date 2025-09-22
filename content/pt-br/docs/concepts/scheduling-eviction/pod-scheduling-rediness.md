---
title: Prontidão de Escalonamento de Pod
content_type: concept
weight: 40
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.30" state="stable" >}}

Os Pods eram considerados prontos para escalonamento assim que eram criados. O escalonador do Kubernetes faz sua devida verificação para encontrar Nós onde alocar todos os Pods pendentes. No entanto, em cenários do mundo real, alguns Pods podem permanecer em um estado de "recursos-essenciais-ausentes" por um longo período. Esses Pods acabam sobrecarregando o escalonador (e integradores como o Cluster AutoScaler) de forma desnecessária.

Ao especificar/remover o campo `.spec.schedulingGates` de um Pod, você pode controlar quando ele estará pronto para ser considerado no escalonamento.

<!-- body -->

## Configurando schedulingGates em Pods

O campo `schedulingGates` contém uma lista de strings, e cada string literal é interpretada como um critério que o Pod deve satisfazer antes de ser considerado escalonável. Esse campo só pode ser inicializado quando o Pod é criado (seja pelo cliente ou por mutação durante a admissão). Após a criação, cada schedulingGate pode ser removido em qualquer ordem, mas a adição de um novo schedulingGate não é permitida.

{{< figure src="/docs/images/podSchedulingGates.svg" alt="pod-scheduling-gates-diagram" caption="Figure. Pod SchedulingGates" class="diagram-large" link="https://mermaid.live/edit#pako:eNplkktTwyAUhf8KgzuHWpukaYszutGlK3caFxQuCVMCGSDVTKf_XfKyPlhxz4HDB9wT5lYAptgHFuBRsdKxenFMClMYFIdfUdRYgbiD6ItJTEbR8wpEq5UpUfnDTf-5cbPoJjcbXdcaE61RVJIiqJvQ_Y30D-OCt-t3tFjcR5wZayiVnIGmkv4NiEfX9jijKTmmRH5jf0sRugOP0HyHUc1m6KGMFP27cM28fwSJDluPpNKaXqVJzmFNfHD2APRKSjnNFx9KhIpmzSfhVls3eHdTRrwG8QnxKfEZUUNeYTDBNbiaKRF_5dSfX-BQQQ0FpnEqQLJWhwIX5hyXsjbYl85wTINrgeC2EZd_xFQy7b_VJ6GCdd-itkxALE84dE3fAqXyIUZya6Qqe711OspVCI2ny2Vv35QqVO3-htt66ZWomAvVcZcv8yTfsiSFfJOydZoKvl_ttjLJVlJsblcJw-czwQ0zr9ZeqGDgeR77b2jD8xdtjtDn" >}}
## Exemplo de uso

Para marcar um Pod como não pronto para escalonamento, você pode criá-lo com um ou mais schedulingGates assim:

{{% code_sample file="pods/pod-with-scheduling-gates.yaml" %}}

Após a criação do Pod, você pode verificar seu estado com:

```bash
kubectl get pod test-pod
```

A saída mostra que ele está no estado `SchedulingGated`:

```none
NAME       READY   STATUS            RESTARTS   AGE
test-pod   0/1     SchedulingGated   0          7s
```

Você também pode verificar o campo `schedulingGates` executando:

```bash
kubectl get pod test-pod -o jsonpath='{.spec.schedulingGates}'
```

A saída será:

```none
[{"name":"example.com/foo"},{"name":"example.com/bar"}]
```

Para informar ao escalonador que este Pod está pronto para ser escalonado, você pode remover completamente o campo `schedulingGates` reaplicando um manifesto modificado:

{{% code_sample file="pods/pod-without-scheduling-gates.yaml" %}}

Você pode confirmar se o campo `schedulingGates` foi limpo executando:

```bash
kubectl get pod test-pod -o jsonpath='{.spec.schedulingGates}'
```

A saída deve estar vazia. E você pode verificar o status mais recente do Pod com:

```bash
kubectl get pod test-pod -o wide
```

Como o test-pod não solicita recursos de CPU/memória, espera-se que seu estado transite de `SchedulingGated` para `Running`:

```none
NAME       READY   STATUS    RESTARTS   AGE   IP         NODE
test-pod   1/1     Running   0          15s   10.0.0.4   node-2
```

## Observabilidade

A métrica `scheduler_pending_pods` agora possui um novo rótulo `"gated"`, que distingue se um Pod foi tentado para escalonamento mas considerado não escalonável, ou se foi explicitamente marcado como não pronto para escalonamento.
Você pode usar `scheduler_pending_pods{queue="gated"}` para verificar o resultado da métrica.

## Diretivas mutáveis de escalonamento de Pods

Você pode alterar as diretivas de escalonamento de Pods enquanto eles tiverem portas de escalonamento, com certas restrições. Em um nível mais alto, você só pode restringir as diretivas de escalonamento de um Pod. Em outras palavras, as diretivas atualizadas fariam com que os Pods só pudessem ser escalonados em um subconjunto dos nós aos quais correspondiam anteriormente. Mais concretamente, as regras para atualizar as diretivas de escalonamento de um Pod são as seguintes:

1. Para `.spec.nodeSelector`, apenas adições são permitidas. Se ausente, será permitido defini-lo.

2. Para `spec.affinity.nodeAffinity`, se for nil, então é permitido definir qualquer coisa.

3. Se `NodeSelectorTerms` estiver vazio, será permitido defini-lo. Se não estiver vazio, então apenas são permitidas adições de `NodeSelectorRequirements` a `matchExpressions` ou `fieldExpressions`, e não serão permitidas alterações às `matchExpressions` e `fieldExpressions` já existentes. Isso ocorre porque os termos em `.requiredDuringSchedulingIgnoredDuringExecution.NodeSelectorTerms` são combinados com OR, enquanto as expressões em `nodeSelectorTerms[].matchExpressions` e `nodeSelectorTerms[].fieldExpressions` são combinadas com AND.

4. Para `.preferredDuringSchedulingIgnoredDuringExecution`, todas as atualizações são permitidas. Isso porque termos preferenciais não são autoritativos, e, portanto, controladores de políticas não validam esses termos.


## {{% heading "whatsnext" %}}

* Leia o [KEP do PodSchedulingReadiness](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/3521-pod-scheduling-readiness) para mais detalhes
