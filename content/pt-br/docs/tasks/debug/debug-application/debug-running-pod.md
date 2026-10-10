---
title: Depuração de Pods em Execução
content_type: task
---

<!-- overview -->

Esta página explica como depurar Pods em execução (ou com falha) em um Nó.


## {{% heading "prerequisites" %}}


* Seu {{< glossary_tooltip text="Pod" term_id="pod" >}} já deve estar alocado e em execução.
  Se o seu Pod ainda não estiver em execução, comece com [Depuração de Pods](/docs/tasks/debug/debug-application/).
* Para algumas etapas avançadas de depuração, você precisa saber em qual Nó o Pod está sendo executado e ter acesso ao shell para executar comandos nesse Nó.
  No entanto, você não precisa desse acesso para executar as etapas padrão de depuração que utilizam `kubectl`.

## Usando `kubectl describe pod` para obter detalhes sobre os Pods

Neste exemplo, usaremos um Deployment para criar dois Pods, semelhante ao exemplo anterior.

{{% code_sample file="application/nginx-with-request.yaml" %}}

Crie o deployment executando o seguinte comando:

```shell
kubectl apply -f https://k8s.io/examples/application/nginx-with-request.yaml
```

```none
deployment.apps/nginx-deployment created
```

Verifique o status do Pod com o seguinte comando:

```shell
kubectl get pods
```

```none
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-67d4bdd6f5-cx2nz   1/1     Running   0          13s
nginx-deployment-67d4bdd6f5-w6kd7   1/1     Running   0          13s
```

Podemos obter muito mais informações sobre cada um desses Pods usando `kubectl describe pod`. Por exemplo:

```shell
kubectl describe pod nginx-deployment-67d4bdd6f5-w6kd7
```

```none
Name:         nginx-deployment-67d4bdd6f5-w6kd7
Namespace:    default
Priority:     0
Node:         kube-worker-1/192.168.0.113
Start Time:   Thu, 17 Feb 2022 16:51:01 -0500
Labels:       app=nginx
              pod-template-hash=67d4bdd6f5
Annotations:  <none>
Status:       Running
IP:           10.88.0.3
IPs:
  IP:           10.88.0.3
  IP:           2001:db8::1
Controlled By:  ReplicaSet/nginx-deployment-67d4bdd6f5
Containers:
  nginx:
    Container ID:   containerd://5403af59a2b46ee5a23fb0ae4b1e077f7ca5c5fb7af16e1ab21c00e0e616462a
    Image:          nginx
    Image ID:       docker.io/library/nginx@sha256:2834dc507516af02784808c5f48b7cbe38b8ed5d0f4837f16e78d00deb7e7767
    Port:           80/TCP
    Host Port:      0/TCP
    State:          Running
      Started:      Thu, 17 Feb 2022 16:51:05 -0500
    Ready:          True
    Restart Count:  0
    Limits:
      cpu:     500m
      memory:  128Mi
    Requests:
      cpu:        500m
      memory:     128Mi
    Environment:  <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-bgsgp (ro)
Conditions:
  Type              Status
  Initialized       True 
  Ready             True 
  ContainersReady   True 
  PodScheduled      True 
Volumes:
  kube-api-access-bgsgp:
    Type:                    Projected (a volume that contains injected data from multiple sources)
    TokenExpirationSeconds:  3607
    ConfigMapName:           kube-root-ca.crt
    ConfigMapOptional:       <nil>
    DownwardAPI:             true
QoS Class:                   Guaranteed
Node-Selectors:              <none>
Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  34s   default-scheduler  Successfully assigned default/nginx-deployment-67d4bdd6f5-w6kd7 to kube-worker-1
  Normal  Pulling    31s   kubelet            Pulling image "nginx"
  Normal  Pulled     30s   kubelet            Successfully pulled image "nginx" in 1.146417389s
  Normal  Created    30s   kubelet            Created container nginx
  Normal  Started    30s   kubelet            Started container nginx
```

Aqui você pode ver informações de configuração sobre o(s) contêiner(es) e o Pod (rótulos, requisitos de recursos, etc.), assim como informações de status sobre o(s) contêiner(es) e o Pod (estado, prontidão, contagem de reinicializações, eventos, etc.).

O estado do contêiner pode ser Waiting, Running ou Terminated. Dependendo do estado, informações adicionais serão fornecidas -- aqui você pode ver que, para um contêiner no estado Running, o sistema informa quando o contêiner foi iniciado.

Ready informa se o contêiner passou na última verificação de prontidão. (Neste caso, o contêiner não possui uma verificação de prontidão configurada; o contêiner é considerado pronto se nenhuma verificação de prontidão for configurada.)

Restart Count informa quantas vezes o contêiner foi reiniciado; essa informação pode ser útil para detectar loops de falha em contêineres configurados com a política de reinício 'Always'.

Atualmente, a única condição (campo Condition) associada a um Pod é a condição binária Ready, que indica se o Pod pode atender a solicitações e deve ser adicionado aos pools de balanceamento de carga de todos os serviços correspondentes.

Por fim, você verá um log dos eventos recentes relacionados ao seu Pod. "From" indica o componente que está registrando o evento. "Reason" e "Message" informam o que aconteceu.


## Exemplo: depuração de Pods em estado Pending

Um cenário comum que você pode detectar usando eventos é quando você criou um Pod que não pode ser alocado em nenhum Nó. Por exemplo, o Pod pode solicitar mais recursos do que estão disponíveis em qualquer Nó, ou pode especificar um seletor de rótulo que não corresponde a nenhum Nó.
Vamos supor que criamos a instalação anterior com 5 réplicas (em vez de 2) e solicitando 600 milicores em vez de 500, em um cluster de quatro Nós onde cada máquina (virtual) possui 1 CPU. Nesse caso, um dos Pods não conseguirá ser alocado. (Observe que, devido aos Pods de complemento do cluster, como fluentd, skydns, etc., que são executados em cada Nó, se solicitássemos 1000 milicores, nenhum dos Pods poderia ser alocado.)

```shell
kubectl get pods
```

```none
NAME                                READY     STATUS    RESTARTS   AGE
nginx-deployment-1006230814-6winp   1/1       Running   0          7m
nginx-deployment-1006230814-fmgu3   1/1       Running   0          7m
nginx-deployment-1370807587-6ekbw   1/1       Running   0          1m
nginx-deployment-1370807587-fg172   0/1       Pending   0          1m
nginx-deployment-1370807587-fz9sd   0/1       Pending   0          1m
```

Para descobrir por que o Pod nginx-deployment-1370807587-fz9sd não está em execução, podemos usar `kubectl describe pod` no Pod em estado Pending e verificar seus eventos:

```shell
kubectl describe pod nginx-deployment-1370807587-fz9sd
```

```none
  Name:		nginx-deployment-1370807587-fz9sd
  Namespace:	default
  Node:		/
  Labels:		app=nginx,pod-template-hash=1370807587
  Status:		Pending
  IP:
  Controllers:	ReplicaSet/nginx-deployment-1370807587
  Containers:
    nginx:
      Image:	nginx
      Port:	80/TCP
      QoS Tier:
        memory:	Guaranteed
        cpu:	Guaranteed
      Limits:
        cpu:	1
        memory:	128Mi
      Requests:
        cpu:	1
        memory:	128Mi
      Environment Variables:
  Volumes:
    default-token-4bcbi:
      Type:	Secret (a volume populated by a Secret)
      SecretName:	default-token-4bcbi
  Events:
    FirstSeen	LastSeen	Count	From			        SubobjectPath	Type		Reason			    Message
    ---------	--------	-----	----			        -------------	--------	------			    -------
    1m		    48s		    7	    {default-scheduler }			        Warning		FailedScheduling	pod (nginx-deployment-1370807587-fz9sd) failed to fit in any node
  fit failure on node (kubernetes-node-6ta5): Node didn't have enough resource: CPU, requested: 1000, used: 1420, capacity: 2000
  fit failure on node (kubernetes-node-wul5): Node didn't have enough resource: CPU, requested: 1000, used: 1100, capacity: 2000
```

Aqui você pode ver o evento gerado pelo escalonador informando que o Pod falhou ao ser alocado pelo motivo `FailedScheduling` (e possivelmente outros). A mensagem nos informa que não havia recursos suficientes para o Pod em nenhum dos Nós.

Para corrigir essa situação, você pode usar `kubectl scale` para atualizar seu Deployment e especificar quatro ou menos réplicas. (Ou você pode deixar um Pod em estado Pending, o que é inofensivo.)

Eventos como os que você viu no final de `kubectl describe pod` são armazenados no etcd e fornecem informações de alto nível sobre o que está acontecendo no cluster. Para listar todos os eventos, você pode usar

```shell
kubectl get events
```

mas você deve lembrar que os eventos são associados a namespaces. Isso significa que, se você estiver interessado em eventos de um objeto dentro de um namespace específico (por exemplo, o que aconteceu com os Pods no namespace `my-namespace`), você precisa fornecer explicitamente um namespace ao comando:

```shell
kubectl get events --namespace=my-namespace
```

Para ver eventos de todos os namespaces, você pode usar o argumento `--all-namespaces`.

Além de `kubectl describe pod`, outra maneira de obter informações adicionais sobre um Pod (além do que é fornecido por `kubectl get pod`) é usar a opção de formato de saída `-o yaml` com `kubectl get pod`. Isso fornecerá, no formato YAML, ainda mais informações do que `kubectl describe pod` — essencialmente, todas as informações que o sistema possui sobre o Pod.
Aqui, você verá itens como anotações (que são metadados no formato chave-valor sem as restrições dos rótulos, utilizadas internamente pelos componentes do sistema Kubernetes), política de reinício, portas e volumes.

```shell
kubectl get pod nginx-deployment-1006230814-6winp -o yaml
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: "2022-02-17T21:51:01Z"
  generateName: nginx-deployment-67d4bdd6f5-
  labels:
    app: nginx
    pod-template-hash: 67d4bdd6f5
  name: nginx-deployment-67d4bdd6f5-w6kd7
  namespace: default
  ownerReferences:
  - apiVersion: apps/v1
    blockOwnerDeletion: true
    controller: true
    kind: ReplicaSet
    name: nginx-deployment-67d4bdd6f5
    uid: 7d41dfd4-84c0-4be4-88ab-cedbe626ad82
  resourceVersion: "1364"
  uid: a6501da1-0447-4262-98eb-c03d4002222e
spec:
  containers:
  - image: nginx
    imagePullPolicy: Always
    name: nginx
    ports:
    - containerPort: 80
      protocol: TCP
    resources:
      limits:
        cpu: 500m
        memory: 128Mi
      requests:
        cpu: 500m
        memory: 128Mi
    terminationMessagePath: /dev/termination-log
    terminationMessagePolicy: File
    volumeMounts:
    - mountPath: /var/run/secrets/kubernetes.io/serviceaccount
      name: kube-api-access-bgsgp
      readOnly: true
  dnsPolicy: ClusterFirst
  enableServiceLinks: true
  nodeName: kube-worker-1
  preemptionPolicy: PreemptLowerPriority
  priority: 0
  restartPolicy: Always
  schedulerName: default-scheduler
  securityContext: {}
  serviceAccount: default
  serviceAccountName: default
  terminationGracePeriodSeconds: 30
  tolerations:
  - effect: NoExecute
    key: node.kubernetes.io/not-ready
    operator: Exists
    tolerationSeconds: 300
  - effect: NoExecute
    key: node.kubernetes.io/unreachable
    operator: Exists
    tolerationSeconds: 300
  volumes:
  - name: kube-api-access-bgsgp
    projected:
      defaultMode: 420
      sources:
      - serviceAccountToken:
          expirationSeconds: 3607
          path: token
      - configMap:
          items:
          - key: ca.crt
            path: ca.crt
          name: kube-root-ca.crt
      - downwardAPI:
          items:
          - fieldRef:
              apiVersion: v1
              fieldPath: metadata.namespace
            path: namespace
status:
  conditions:
  - lastProbeTime: null
    lastTransitionTime: "2022-02-17T21:51:01Z"
    status: "True"
    type: Initialized
  - lastProbeTime: null
    lastTransitionTime: "2022-02-17T21:51:06Z"
    status: "True"
    type: Ready
  - lastProbeTime: null
    lastTransitionTime: "2022-02-17T21:51:06Z"
    status: "True"
    type: ContainersReady
  - lastProbeTime: null
    lastTransitionTime: "2022-02-17T21:51:01Z"
    status: "True"
    type: PodScheduled
  containerStatuses:
  - containerID: containerd://5403af59a2b46ee5a23fb0ae4b1e077f7ca5c5fb7af16e1ab21c00e0e616462a
    image: docker.io/library/nginx:latest
    imageID: docker.io/library/nginx@sha256:2834dc507516af02784808c5f48b7cbe38b8ed5d0f4837f16e78d00deb7e7767
    lastState: {}
    name: nginx
    ready: true
    restartCount: 0
    started: true
    state:
      running:
        startedAt: "2022-02-17T21:51:05Z"
  hostIP: 192.168.0.113
  phase: Running
  podIP: 10.88.0.3
  podIPs:
  - ip: 10.88.0.3
  - ip: 2001:db8::1
  qosClass: Guaranteed
  startTime: "2022-02-17T21:51:01Z"
```

## Examinando logs do Pod {#examine-pod-logs}

Primeiro, veja os logs do contêiner afetado:

```shell
kubectl logs ${POD_NAME} ${CONTAINER_NAME}
```

Se o seu contêiner tiver falhado anteriormente, você pode acessar o log da falha do contêiner anterior com:

```shell
kubectl logs --previous ${POD_NAME} ${CONTAINER_NAME}
```

## Depuração com execução dentro do contêiner {#container-exec}

Se a {{< glossary_tooltip text="imagem do contêiner" term_id="image" >}} incluir ferramentas de depuração, como é o caso de imagens baseadas nos sistemas operacionais Linux e Windows, você pode executar comandos dentro de um contêiner específico usando `kubectl exec`:

```shell
kubectl exec ${POD_NAME} -c ${CONTAINER_NAME} -- ${CMD} ${ARG1} ${ARG2} ... ${ARGN}
```

{{< note >}}
`-c ${CONTAINER_NAME}` é opcional. Você pode omití-lo para Pods que contêm apenas um único contêiner.
{{< /note >}}

Como exemplo, para visualizar os logs de um pod Cassandra em execução, você pode executar:

```shell
kubectl exec cassandra -- cat /var/log/cassandra/system.log
```

Você pode executar um shell conectado ao seu terminal usando os argumentos `-i` e `-t` com `kubectl exec`, por exemplo:

```shell
kubectl exec -it cassandra -- sh
```

Para mais detalhes, veja [Obter um Shell em um Contêiner em Execução](/docs/tasks/debug/debug-application/get-shell-running-container/).

## Depurando com um contêiner de depuração efêmero {#ephemeral-container}

{{< feature-state state="stable" for_k8s_version="v1.25" >}}

{{< glossary_tooltip text="Contêineres efêmeros" term_id="ephemeral-container" >}} são úteis para uma solução de problemas
interativa quando `kubectl exec` não é suficiente, como no caso de um contêiner que falhou ou uma imagem de contêiner
que não inclui ferramentas de depuração, como ocorre com [imagens distroless](https://github.com/GoogleContainerTools/distroless).

### Exemplo de depuração usando contêineres efêmeros {#ephemeral-container-example}

Você pode usar o comando `kubectl debug` para adicionar contêineres efêmeros a um Pod em execução.
Primeiro, crie um Pod para o exemplo:

```shell
kubectl run ephemeral-demo --image=registry.k8s.io/pause:3.1 --restart=Never
```

Os exemplos nesta seção usam a imagem do contêiner `pause` porque ela não contém ferramentas de depuração, mas esse método funciona com todas as imagens de contêiner.

Se você tentar usar `kubectl exec` para criar um shell, verá um erro, pois não há um shell nesta imagem de contêiner.

```shell
kubectl exec -it ephemeral-demo -- sh
```

```
OCI runtime exec failed: exec failed: container_linux.go:346: starting container process caused "exec: \"sh\": executable file not found in $PATH": unknown
```

Em vez disso, você pode adicionar um contêiner de depuração usando `kubectl debug`.
Se você especificar o argumento `-i`/`--interactive`, o `kubectl` conectará automaticamente ao console do Contêiner Efêmero.

```shell
kubectl debug -it ephemeral-demo --image=busybox:1.28 --target=ephemeral-demo
```

```
Defaulting debug container name to debugger-8xzrl.
If you don't see a command prompt, try pressing enter.
/ #
```

Este comando adiciona um novo contêiner `busybox` e o anexa. O parâmetro `--target` define o namespace de processo de outro contêiner.
Ele é necessário aqui porque `kubectl run` não habilita o [compartilhamento do namespace de processo](/docs/tasks/configure-pod-container/share-process-namespace/) no Pod que ele cria.

{{< note >}}
O parâmetro `--target` deve ser suportado pelo {{< glossary_tooltip text="Agente de execução do Contêiner" term_id="container-runtime" >}}. Quando não for suportado, o Contêiner Efêmero pode não ser iniciado ou pode ser iniciado com um namespace de processo isolado, de modo que `ps` não revelará processos em outros contêineres.
{{< /note >}}

Você pode visualizar o estado do contêiner efêmero recém-criado usando `kubectl describe`:

```shell
kubectl describe pod ephemeral-demo
```

```
...
Ephemeral Containers:
  debugger-8xzrl:
    Container ID:   docker://b888f9adfd15bd5739fefaa39e1df4dd3c617b9902082b1cfdc29c4028ffb2eb
    Image:          busybox
    Image ID:       docker-pullable://busybox@sha256:1828edd60c5efd34b2bf5dd3282ec0cc04d47b2ff9caa0b6d4f07a21d1c08084
    Port:           <none>
    Host Port:      <none>
    State:          Running
      Started:      Wed, 12 Feb 2020 14:25:42 +0100
    Ready:          False
    Restart Count:  0
    Environment:    <none>
    Mounts:         <none>
...
```

Use `kubectl delete` para remover o Pod quando terminar:

```shell
kubectl delete pod ephemeral-demo
```

## Depuração usando uma cópia do Pod

Às vezes, as opções de configuração do Pod dificultam a solução de problemas em determinadas situações.
Por exemplo, você não pode executar `kubectl exec` para depurar seu contêiner se a imagem do contêiner
não incluir um shell ou se sua aplicação falhar na inicialização.
Nesses casos, você pode usar `kubectl debug` para criar uma cópia do Pod com valores de configuração
modificados para facilitar a depuração.

### Copiando um Pod enquanto adiciona um novo contêiner

Adicionar um novo contêiner pode ser útil quando sua aplicação está em execução,
mas não se comporta como esperado e você deseja adicionar ferramentas adicionais
de depuração ao Pod.

Por exemplo, talvez as imagens do contêiner da sua aplicação sejam baseadas em `busybox`, mas você precise de ferramentas de depuração que não estão incluídas no `busybox`.
Você pode simular esse cenário usando `kubectl run`:

```shell
kubectl run myapp --image=busybox:1.28 --restart=Never -- sleep 1d
```

Execute este comando para criar uma cópia de `myapp` chamada `myapp-debug`, adicionando um novo contêiner Ubuntu para depuração:

```shell
kubectl debug myapp -it --image=ubuntu --share-processes --copy-to=myapp-debug
```

```
Defaulting debug container name to debugger-w7xmf.
If you don't see a command prompt, try pressing enter.
root@myapp-debug:/#
```

{{< note >}}
* `kubectl debug` gera automaticamente um nome para o contêiner caso você não escolha um usando a opção `--container`.
* A opção `-i` faz com que `kubectl debug` anexe ao novo contêiner por padrão.
  Você pode impedir isso especificando `--attach=false`. Se sua sessão for desconectada, você pode se reconectar usando `kubectl attach`.
* A opção `--share-processes` permite que os contêineres deste Pod visualizem processos
  de outros contêineres no mesmo Pod. Para mais informações sobre como isso funciona, veja [Compartilhar o Namespace de Processos entre Contêineres em um Pod](/docs/tasks/configure-pod-container/share-process-namespace/).
{{< /note >}}

Não se esqueça de limpar o Pod de depuração quando terminar de usá-lo:

```shell
kubectl delete pod myapp myapp-debug
```

### Copiando um Pod enquanto altera seu comando

Às vezes, é útil alterar o comando de um contêiner, por exemplo, para adicionar uma opção de depuração ou porque a aplicação está falhando.
Para simular uma aplicação com falha, use `kubectl run` para criar um contêiner que termine imediatamente:

```
kubectl run --image=busybox:1.28 myapp -- false
```

Você pode ver, usando `kubectl describe pod myapp`, que este contêiner está falhando:

```
Containers:
  myapp:
    Image:         busybox
    ...
    Args:
      false
    State:          Waiting
      Reason:       CrashLoopBackOff
    Last State:     Terminated
      Reason:       Error
      Exit Code:    1
```

Você pode usar `kubectl debug` para criar uma cópia deste Pod com o comando alterado para um shell interativo:

```
kubectl debug myapp -it --copy-to=myapp-debug --container=myapp -- sh
```

```
If you don't see a command prompt, try pressing enter.
/ #
```

Agora você tem um shell interativo que pode usar para realizar tarefas como verificar caminhos do sistema de arquivos ou executar manualmente o comando do contêiner.

{{< note >}}
* Para alterar o comando de um contêiner específico, você deve
  especificar seu nome usando `--container`, caso contrário, `kubectl debug`
  criará um novo contêiner para executar o comando especificado.
* A opção `-i` faz com que `kubectl debug` anexe ao contêiner por padrão.
  Você pode impedir isso especificando `--attach=false`. Se sua sessão for
  desconectada, você pode se reconectar usando `kubectl attach`.
{{< /note >}}

Não se esqueça de limpar o Pod de depuração quando terminar de usá-lo:

```shell
kubectl delete pod myapp myapp-debug
```

### Copiando um Pod enquanto altera as imagens do contêiner

Em algumas situações, pode ser necessário alterar um Pod com comportamento inesperado, substituindo suas imagens de contêiner de produção por uma imagem contendo uma versão de depuração ou utilitários adicionais.

Como exemplo, crie um Pod usando `kubectl run`:

```
kubectl run myapp --image=busybox:1.28 --restart=Never -- sleep 1d
```

Agora use `kubectl debug` para criar uma cópia e alterar a imagem do contêiner para `ubuntu`:

```
kubectl debug myapp --copy-to=myapp-debug --set-image=*=ubuntu
```

A sintaxe de `--set-image` usa o mesmo formato `container_name=image` que `kubectl set image`.
`*=ubuntu` significa alterar a imagem de todos os contêineres para `ubuntu`.

Não se esqueça de limpar o Pod de depuração quando terminar de usá-lo:

```shell
kubectl delete pod myapp myapp-debug
```

## Depuração via shell no Nó {#node-shell-session}

Se nenhuma dessas abordagens funcionar, você pode identificar o Nó onde o Pod está sendo executado e criar um Pod nesse Nó.
Para criar um shell interativo em um Nó usando `kubectl debug`, execute:

```shell
kubectl debug node/mynode -it --image=ubuntu
```

```
Creating debugging pod node-debugger-mynode-pdx84 with container debugger on node mynode.
If you don't see a command prompt, try pressing enter.
root@ek8s:/#
```

Ao criar uma sessão de depuração em um Nó, tenha em mente que:

* `kubectl debug` gera automaticamente o nome do novo Pod com base no nome do Nó.
* O sistema de arquivos raiz do Nó será montado em `/host`.
* O contêiner é executado nos namespaces de IPC, Rede e PID do host,
  embora o Pod não seja privilegiado, então a leitura de algumas informações de
  processos pode falhar, e `chroot /host` pode não funcionar.
* Se você precisar de um Pod privilegiado, crie-o manualmente ou use a opção `--profile=sysadmin`.

Não se esqueça de limpar o Pod de depuração quando terminar de usá-lo:

```shell
kubectl delete pod node-debugger-mynode-pdx84
```

## Depuração de um Pod ou Nó aplicando um perfil {#debugging-profiles}

Ao usar `kubectl debug` para depurar um Nó por meio de um Pod de depuração, um Pod por meio de um Contêiner Efêmero ou um Pod copiado, você pode aplicar um perfil a eles.
Ao aplicar um perfil, propriedades específicas, como [securityContext](/docs/tasks/configure-pod-container/security-context/), são definidas, permitindo a adaptação a diferentes cenários.
Existem dois tipos de perfis: perfil estático e perfil personalizado.

### Aplicando um Perfil Estático {#static-profile}

Um perfil estático é um conjunto de propriedades predefinidas que podem ser aplicadas usando a opção `--profile`.
Os perfis disponíveis são os seguintes:

| Profile      | Description                                                     |
| ------------ | --------------------------------------------------------------- |
| legacy       | Um conjunto de propriedades para retrocompatibilidade com o comportamento da versão 1.22 |
| general      | Um conjunto razoável de propriedades genéricas para cada processo de depuração |
| baseline     | Um conjunto de propriedades compatível com [PodSecurityStandard baseline policy](/docs/concepts/security/pod-security-standards/#baseline) |
| restricted   | Um conjunto de propriedades compatível com [PodSecurityStandard restricted policy](/docs/concepts/security/pod-security-standards/#restricted) |
| netadmin     | Um conjunto de propriedades incluindo privilégios de Administrador de Rede |
| sysadmin     | Um conjunto de propriedades incluindo privilégios de Administrador do Sistema (root) |


{{< note >}}
Se você não especificar `--profile`, o perfil `legacy` será usado por padrão, mas há planos para sua descontinuação em um futuro próximo.
Portanto, é recomendável usar outros perfis, como `general`.
{{< /note >}}


Suponha que você crie um Pod e queira depurá-lo.
Primeiro, crie um Pod chamado `myapp` como exemplo:

```shell
kubectl run myapp --image=busybox:1.28 --restart=Never -- sleep 1d
```

Em seguida, depure o Pod usando um Contêiner Efêmero.
Se o Contêiner Efêmero precisar de privilégios, você pode usar o perfil `sysadmin`:

```shell
kubectl debug -it myapp --image=busybox:1.28 --target=myapp --profile=sysadmin
```

```
Targeting container "myapp". If you don't see processes from this container it may be because the container runtime doesn't support this feature.
Defaulting debug container name to debugger-6kg4x.
If you don't see a command prompt, try pressing enter.
/ #
```

Verifique as capacidades do processo do Contêiner Efêmero executando o seguinte comando dentro do contêiner:

```shell
/ # grep Cap /proc/$$/status
```

```
...
CapPrm:	000001ffffffffff
CapEff:	000001ffffffffff
...
```

Isso significa que o processo do contêiner recebeu todas as capacidades de um contêiner privilegiado ao aplicar o perfil `sysadmin`.
Veja mais detalhes sobre [capacidades](/docs/tasks/configure-pod-container/security-context/#set-capabilities-for-a-container).

Você também pode verificar que o Contêiner Efêmero foi criado como um contêiner privilegiado:

```shell
kubectl get pod myapp -o jsonpath='{.spec.ephemeralContainers[0].securityContext}'
```

```
{"privileged":true}
```

Remova o Pod quando terminar de usá-lo:

```shell
kubectl delete pod myapp
```

### Aplicando um Perfil Personalizado {#custom-profile}

{{< feature-state for_k8s_version="v1.32" state="stable" >}}

Você pode definir uma especificação parcial de contêiner para depuração como um perfil personalizado,
em formato YAML ou JSON, e aplicá-lo usando a opção `--custom`.

{{< note >}}
O perfil personalizado suporta apenas a modificação da especificação do contêiner,
mas não permite alterações nos campos `name`, `image`, `command`, `lifecycle` e `volumeDevices` da especificação do contêiner.
Ele também não suporta a modificação da especificação do Pod.
{{< /note >}}

Crie um Pod chamado myapp como exemplo:

```shell
kubectl run myapp --image=busybox:1.28 --restart=Never -- sleep 1d
```

Crie um perfil personalizado no formato YAML ou JSON.
Aqui, crie um arquivo no formato YAML chamado `custom-profile.yaml`:

```yaml
env:
- name: ENV_VAR_1
  value: value_1
- name: ENV_VAR_2
  value: value_2
securityContext:
  capabilities:
    add:
    - NET_ADMIN
    - SYS_TIME

```

Execute este comando para depurar o Pod usando um Contêiner Efêmero com o perfil personalizado:

```shell
kubectl debug -it myapp --image=busybox:1.28 --target=myapp --profile=general --custom=custom-profile.yaml
```

Você pode verificar que o Contêiner Efêmero foi adicionado ao Pod de destino com o perfil personalizado aplicado:

```shell
kubectl get pod myapp -o jsonpath='{.spec.ephemeralContainers[0].env}'
```

```
[{"name":"ENV_VAR_1","value":"value_1"},{"name":"ENV_VAR_2","value":"value_2"}]
```

```shell
kubectl get pod myapp -o jsonpath='{.spec.ephemeralContainers[0].securityContext}'
```

```
{"capabilities":{"add":["NET_ADMIN","SYS_TIME"]}}
```

Remova o Pod quando terminar de usá-lo:

```shell
kubectl delete pod myapp
```