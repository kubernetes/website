---
title: Configurando Liveness, Readiness e Startup Probes
content_type: task
weight: 110
---

<!-- overview -->

Esta página mostra como configurar `liveness`, `readiness` e `startup probes` para contêneres.

O [kubelet](/docs/reference/command-line-tools-reference/kubelet/) usa testes de
vivacidade para saber quando reiniciar um contêiner. Por exemplo, 
os testes de vivacidade podem pegar um `deadlock`,
quando uma aplicação está em execução, mas está incapacitada de prosseguir. Reiniciando
o contêiner nesse estado, pode ajudar a tornar a aplicação mais disponível,
apesar das falhas.

O kubelet usa testes de prontidão para saber quando o contêiner está pronto para 
começar a receber tráfego. Um Pod é considerado pronto, quando todos 
os seus contêineres estiverem prontos.
Um uso desse sinal é controlar quais Pods são usados para serviços de retaguarda.
Quando um pod não está pronto, ele é removido do serviço dos balanceadores de carga.

O Kubelet usa testes de inicialização para saber quando um aplicativo 
de contêiner foi iniciado.
Se esse teste estiver configurado, desabilita as verificações de vivacidade e prontidão até
ser bem sucedido, garantindo que esses testes não interfiram na inicialização do aplicativo.
Isso pode ser usado para adotar verificações de vivacidade em contêineres 
de inicialização lenta, evitando serem encerrados pelo Kubelet antes 
de estarem de pé e executando.



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}



<!-- steps -->

## Defina um comando de vivacidade

Muitos aplicativos em execução por longos períodos de tempo acabam por fazer
a transição para o estado de falha, e não podem se recuperar, exceto por serem reiniciado. 
O Kubernetes fornece testes de vivacidade para detectar e remediar essas situações.

Neste exercício, você cria um Pod que executa um contêiner baseado na imagem 
`k8s.gcr.io/busybox`. Aqui está o arquivo de configuração para o Pod:

{{< codenew file="pods/probe/exec-liveness.yaml" >}}

No arquivo de configuração, você pode ver que o Pod tem um único `Contêiner`.
O campo `periodSeconds` especifica que o kubelet deve fazer um teste de vivacidade 
a cada 5 segundos. O campo `initialDelaySeconds` diz ao kubelet que ele deve 
esperar 5 segundos antes de fazer o primeiro teste.
Para fazer o teste, o kubelet executa o comando `cat /tmp/healthy` no contêiner alvo. 
Se o comando for bem sucedido, ele retorna 0, e o kubelet considera que o contêiner está vivo 
e saudável. Se o comando retornar um valor não zero, o kubelet mata o contêiner e o reinicia.

Quando o contêiner inicializa, ele executa este comando:

```shell
/bin/sh -c "touch /tmp/healthy; sleep 30; rm -f /tmp/healthy; sleep 600"
```

Para os primeiros 30 segundos de vida do contêiner, existe um arquivo `/tmp/healthy`.
Assim durante os primeiros 30 segundos, o comando `cat /tmp/healthy` retorna um código 
de sucesso. Depois dos 30 segundos, `cat /tmp/healthy` retorna um código de falha.

Crie o Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/exec-liveness.yaml
```

Dentro dos 30 segundos, veja os eventos do Pod:

```shell
kubectl describe pod liveness-exec
```

A saída indica que o teste de vivacidade ainda está falhando:

```
Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  11s   default-scheduler  Successfully assigned default/liveness-exec to node01
  Normal  Pulling    9s    kubelet, node01    Pulling image "k8s.gcr.io/busybox"
  Normal  Pulled     7s    kubelet, node01    Successfully pulled image "k8s.gcr.io/busybox"
  Normal  Created    7s    kubelet, node01    Created container liveness
  Normal  Started    7s    kubelet, node01    Started container liveness
```

Após 35 segundos, veja os eventos do Pod novamente:

```shell
kubectl describe pod liveness-exec
```

Na parte inferior da saída, existem mensagens indicando que o teste de vivacidade
falhou, e o contêiner foi encerrado e recriado.

```
  Type     Reason     Age                From               Message
  ----     ------     ----               ----               -------
  Normal   Scheduled  57s                default-scheduler  Successfully assigned default/liveness-exec to node01
  Normal   Pulling    55s                kubelet, node01    Pulling image "k8s.gcr.io/busybox"
  Normal   Pulled     53s                kubelet, node01    Successfully pulled image "k8s.gcr.io/busybox"
  Normal   Created    53s                kubelet, node01    Created container liveness
  Normal   Started    53s                kubelet, node01    Started container liveness
  Warning  Unhealthy  10s (x3 over 20s)  kubelet, node01    Liveness probe failed: cat: can't open '/tmp/healthy': No such file or directory
  Normal   Killing    10s                kubelet, node01    Container liveness failed liveness probe, will be restarted
```

Espere outros 30 segundos, e verifique que o contêiner foi restartado:

```shell
kubectl get pod liveness-exec
```

A saída mostra que `RESTARTS` foi incrementado:

```
NAME            READY     STATUS    RESTARTS   AGE
liveness-exec   1/1       Running   1          1m
```

## Defina a requisição HTTP para vivacidade

Outra forma de teste de vivacidade, é usando a requisição HTTP GET. Aqui está 
o arquivo de configuração para um Pod que fica escutando em um contêiner baseado 
na imagem `k8s.gcr.io/liveness`.

{{< codenew file="pods/probe/http-liveness.yaml" >}}

No arquivo de configuração, você pode ver que o Pod tem um único contêiner.
O campo `periodSeconds` especifica que o Kubelet deve realizar uma verificação 
de vivacidade a cada 3 segundos. O campo `initialDelaySeconds` diz ao Kubelet que ele
deve esperar 3 segundos antes de realizar a primeira verificação. Para realizar 
uma verificação, o Kubelet envia uma solicitação HTTP para o servidor que está 
em execução no contêiner e escutando na porta 8080. Se o manipulador do servidor 
`/healthz` retorna um código de sucesso, o Kubelet considera o contêiner vivo 
e saudável. Se o manipulador retornar um código de falha, o Kubelet encerra o contêiner
e o reinicia.

Qualquer código maior ou igual a 200 e menor que 400 indica sucesso. 
Qualquer outro código indica falha.

Você pode ver o código fonte para o servidor em 
[server.go](https://github.com/kubernetes/kubernetes/blob/master/test/images/agnhost/liveness/server.go).

Para os primeiros 10 segundos que o contêirner está ativo, o manipulador 
`/healthz` retorna o status 200. Após isso, o manipulador retorna o status 500.

```go
http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
    duration := time.Now().Sub(started)
    if duration.Seconds() > 10 {
        w.WriteHeader(500)
        w.Write([]byte(fmt.Sprintf("error: %v", duration.Seconds())))
    } else {
        w.WriteHeader(200)
        w.Write([]byte("ok"))
    }
})
```

O kubelet inicia a execução dos `health checks` 3 segunds após o contêiner iniciar.
Assim o primeiro par de verificações de saúde terá sucesso. Mas após 10 segundos, as verificações de saúde vão falhar, e o kubelet matará e reiniciará o contêiner.

Para testar a checagem de vivacidade, crie um Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/http-liveness.yaml
```

Após 10 segundos, veja os eventos do Pod para conferir se o teste de vivacidade falhou 
e o contêiner foi reiniciado:

```shell
kubectl describe pod liveness-http
```

Em versões anteriores à v1.13 (incluindo a v1.13), se a variável de ambiente
`http_proxy` (ou `HTTP_PROXY`) estiver setada no nó em que o Pod estiver executando,
o teste de vivacidade HTTP usará esse proxy.
Em versões após a v1.13, configurações locais de variáveis de ambiente HTTP proxy 
não afetam a vivacidade HTTP. 

## Defina o teste de vivacidade TCP

O terceiro tipo de teste de vivacidade usa o socket TCP. Com essa configuração, 
o kubelet tentará abrir um socket para o seu contêiner na porta especificada.
Se ele conseguir estabelecer uma conexão, o contêiner é considerado saudável, 
se não conseguir é considerado como falho.

{{< codenew file="pods/probe/tcp-liveness-readiness.yaml" >}}

Como você pode ver, a configuração para uma verificação TCP é bastante semelhante 
a uma verificação HTTP.
Este exemplo usa ambos os testes, prontidão e vivacidade. O kubelet enviará o
primeiro teste de prontidão 5 segundos após o início do contêiner. Dessa forma tentará
conectar-se ao contêiner `GoProxy` na porta 8080. Se o teste for bem sucedido, o Pod
será marcado como pronto. O Kubelet continuará executando essa verificação a cada 10
segundos.

Conjuntamente com o teste de prontidão, essa configuração inclui um teste de vivacidade.
O Kubelet executará a primeira verificação de vivacidade 15 segundos após o contêiner
iniciar. Semelhante à verificação de prontidão, ele tentará se conectar ao contêiner
`GoProxy` na porta 8080. Se a verificação de vivacidade falhar, o contêiner
será reiniciado.
Para testar a verificação de vivacidade TCP, crie um Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/tcp-liveness-readiness.yaml
```

Após 15 segundos, veja os eventos do Pod para verificar os testes de vivacidade:

```shell
kubectl describe pod goproxy
```

## Defina uma verificação vivacidade gRPC

{{< feature-state for_k8s_version="v1.24" state="beta" >}}

Se a sua aplicação implementa o
[Protocolo de verificação de saúde gRPC](https://github.com/grpc/grpc/blob/master/doc/health-checking.md),
o kubelet pode ser configurado para usar a verificação de vivacidade da aplicação.
Você precisa habilitar a `GRPCContainerProbe` no
[portal de funcionalidades](/docs/reference/command-line-tools-reference/feature-gates/)
para configurar verificações que dependem de gRPC.

Aqui está um exemplo de manifesto:

{{< codenew file="pods/probe/grpc-liveness.yaml" >}}

Para usar a verificação gRPC, uma `porta` precisa ser configurada. 
Se o `endpoint` do `health` estiver configurado em um serviço não padrão, 
você precisa também especificar um `service`.

{{< note >}}
Diferentemente de verificações HTTP e TCP, portas nomeadas não podem ser usadas 
e host personalizado não pode ser configurado.
{{< /note >}}

Problemas de configuração (por exemplo: porta e serviço incorretos, 
protocolo de verificação de saúde não implementado) são considerados 
falhas de verificação, similarmente às verfificações HTTP e TCP.

Para testar verificações de vivacidade gRPC, crie um Pod usando o seguinte comando.
No exemplo a seguir, o pod etcd está configurado para usar verificação de vivacidade gRPC.

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/grpc-liveness.yaml
```

Após 15 segundos, veja os eventos do Pod para verificar se o teste de vivacidade 
não falhou:

```shell
kubectl describe pod etcd-with-grpc
```

Antes da versão 1.23 do Kubernetes, verificações de saúde gRPC foram frequentemente 
implementadas usando [grpc-health-probe](https://github.com/grpc-ecosystem/grpc-health-probe/),
como descrito no post do blog [verificação de saúde GRPC em servidores no Kubernetes]
(/blog/2018/10/01/health-checking-grpc-servers-on-kubernetes/).
O comportamento de verificação gRPC interno é semelhante 
ao implementado pelo `GRPC-HEALTH-PROBE`.
Ao migrar de `GRPC-Health-probe` para verificações embutidas, lembre-se 
das seguintes diferenças:
- Verificações embutidas executam fora do endereço IP do pod, 
  diferente do `grpc-health-probe` que executa no ip local `127.0.0.1`.
  Certifique-se de configurar seu `endpoint` GRPC para escutar no endereço IP do Pod.
- As verificações que vem embutidas, não suportam nenhum parâmetros de autenticação (como `-tls`).
- Não há códigos de erro para verficações internas. 
  Todos os erros são considerados falhas de verfificação.
- Se o recurso `ExecProbeTimeout` estiver definido como `false`, grpc-health-probe 
  **não** respeitará a configuração `timeoutSeconds` (que por padrão é de 1s),
  enquanto a verficação embutida falharia com um `timeout`.

## Use uma porta nomeada

Você pode usar [`portas`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#ports)
 nomeadas para verificações HTTP e TCP. (gRPC não suporta verificações em portas nomeadas).

Por exemplo:

```yaml
ports:
- name: liveness-port
  containerPort: 8080
  hostPort: 8080

livenessProbe:
  httpGet:
    path: /healthz
    port: liveness-port
```

## Proteja contêineres com inicialização lenta com verificações de inicialização 
{#define-startup-probes}

As vezes, você precisa lidar com aplicativos legados, que possam exigir um tempo 
de inicialização adicional na primeira inicialização.
Nesses casos, pode ser complicado configurar parâmetros de verificação de vivacidade 
sem comprometer a resposta rápida a `deadlocks` que motivaram essa verificação.
O truque é configurar uma verificação de inicialização com o mesmo comando, 
verificação de http ou tcp, com um `failureThRreshold * periodSeconds` com tempo 
suficiente para cobrir o pior caso de tempo de inicialização.

Então, o exemplo anterior se tornaria:

```yaml
ports:
- name: liveness-port
  containerPort: 8080
  hostPort: 8080

livenessProbe:
  httpGet:
    path: /healthz
    port: liveness-port
  failureThreshold: 1
  periodSeconds: 10

startupProbe:
  httpGet:
    path: /healthz
    port: liveness-port
  failureThreshold: 30
  periodSeconds: 10
```

Graças à verificação de inicialização, a aplicação terá no máximo 5 minutos 
(30 * 10 = 300s) para finalizar sua inicialização.
Uma vez que a verificação de inicialização forneça uma resposta rápida 
aos `deadlocks` do contêiner.
Se a verficação de inicialização nunca for bem sucedida, o contêiner será encerrado 
após 300s e sujeitado ao `Restartpolicy` do Pod.

## Defina verficações de prontidão

As vezes, as aplicações estão temporariamente incapacitadas de atender ao tráfego.
Por exemplo, uma aplicação pode precisar carregar uma grande quantidade de dados 
ou arquivos de configurações durante a inicialização, ou depende de serviços externos 
após a inicialização.
Nesses casos, você não quer encerrar a aplicação, mas você também não deseja enviar 
solicitações. O Kubernetes fornece verficações de prontidão para detectar 
e mitigar essas situações. Um Pod com contêineres relatando que eles 
não estão prontos para receber tráfego através de serviços Kubernetes.

{{< note >}}
Verificações de prontidão executam no contêiner durante todo o seu ciclo-de-vida.
{{< /note >}}

{{< caution >}}
Verificações de vivacidade *não* esperam pelas verificações de prontidão serem 
bem sucedidas. Se você quiser esperar antes de executar uma verificação de vivacidade, 
use o `initialDelaySeconds` ou um `startupProbe`.
{{< /caution >}}

Verificações de prontidão são configuradas da mesma forma que as verificações de vivacidade. 
A única diferença é que você usa o campo `readinessProbe` em vez de `livenessProbe`.

```yaml
readinessProbe:
  exec:
    command:
    - cat
    - /tmp/healthy
  initialDelaySeconds: 5
  periodSeconds: 5
```

A configuração para verificações de prontidão HTTP e TCP também permanecem idênticas 
a verificações de vivacidade.
Verificações de prontidão e vivacidade podem ser usadas em paralelo para o mesmo contêiner.
Usar os dois pode garantir que o tráfego não atinja um contêiner que não esteja pronto
para isso, e que os contêineres são reiniciados quando falharem.

## Configure verificações

{{< caution >}}
Eventualmente, parte desta seção pode ser movida para um tópico conceitual.
{{< /caution >}}

[Verificações](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#probe-v1-core)
 tem um número de campos que você pode usar para ter um contrôle mais preciso sobre 
 o comportamento das verificações de vivacidade e prontidão:

* `initialDelaySeconds`: Número de segundos após o contêiner ser inciado antes 
  das verificações de vivacidade ou prontidão serem iniciadas. Padrão é 0 segundos. 
  Valor mínimo é 0.
* `periodSeconds`: Quanto (em segundos) para executar a verificação. Padrão é 10
  segundos. Valor mínimo é 1.
* `timeoutSeconds`: Número de segundos após o qual a verificação retorna tempo esgotado. 
  Padrão é 1 segundo. Valor mínimo é 1.
* `successThreshold`: Mínimo de verificações consecutivas bem sucedidas para 
  a verificação ser bem sucedida, após ter havido uma falha. Padrão é 1. 
  Precisa ser 1 para verificações de vivacidade de inicialização. Valor mínimo é 1.
* `failureThreshold`: Quando uma verificação falha, o Kubernetes tentará 
  `failureThreshold` vezes antes de desistir. Desistir em caso de verificação de
  vivacidade significa reiniciar o contêiner. Em caso de verificação de prontidão, 
  o Pod será marcado como não pronto. Padrão é 3. Valor mínimo é 1.

{{< note >}}
Nas versões anteriores ao Kubernetes 1.20, o campo `timeoutSeconds` 
não era respeitado por verificações de execução:
verificações continuavam executando indefinidamente, até além do prazo final configurado,
até que um resultado fosse devolvido.

Essa falha foi corrigida na versão Kubernetes v1.20. Você pode estar confiando 
no comportamento anterior, mesmo sem perceber, pois o tempo limite padrão é de 1 segundo. 
Como administrador de cluster, você pode desabilitar o [portal de funcionalidades]
(/docs/reference/command-line-tools-reference/feature-gates/) `ExecProbeTimeout` 
(setando ela para `false`) em cada kubelet para restaurar o comportamento de versões 
mais antigas, então remova essa substituição uma vez que todas as verficações 
de execução no cluster tiverem um valor atribuído para `timeoutSeconds`.
Se você tem Pods que são impactados pelo padrão de tempo de 1 segundo,
você deve atualizar o tempo limite de verificação para que esteja pronto para a
eventual remoção desse portal de funcionalidades.

Com a correção dessa falha, para verificações de execução, no Kubernetes `1.20+` 
com o contêiner runtime `dockershim`, o processo dentro do contêiner pode continuar 
funcionando mesmo após a falha de verificação por causa do `timeout`.
{{< /note >}}

{{< caution >}}
Implementações incorretas de verificações de prontidão podem resultar em um número sempre 
crescente de processos no contêiner e escassez de recursos, se isso for deixado desmarcado.
{{< /caution >}}

### verificações HTTP

[Verificações HTTP](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#httpgetaction-v1-core)
têm campos adicionais que podem ser setados em `httpGet`:

* `host`: Nome do host para se conectar, por padrão é o IP do Pod. Você provávelmente quer
definir "Host" em `httpHeaders` ao invés de deixar o valor padrão.
* `scheme`: Esquema usado para conectar ao host (HTTP ou HTTPS). O padrão é HTTP.
* `path`: Caminho para o acesso ao servidor HTTP. Padrão é /.
* `httpHeaders`: Cabeçalhos customizados para setar nas requisições. HTTP habilita cabeçalhos repetidos.
* `port`: Nome ou número da porta para acessar o contêiner. Número deve estar no intervalo 1 até 65535.

Para uma verificação HTTP, o kubelet envia uma requisição HTTP para o caminho e porta especificado para realizar a verificação. O kubelet envia verificações ao endereço IP do pod,
a menos que o endereço seja substituído pelo campo opcional `host` no `httpGet`. Se o campo
`scheme` estiver configurado para `HTTPS`, o kubelet envia requisições HTTPS pulando a
verificação do certificado. Na maioria dos cenários, você não deseja definir o campo `host`.
Aqui está um cenário em que você o definiria. Suponha que o contêiner escute no IP 127.0.0.1
e o campo do Pod `hostNetwork` é `true`. Então `host`, abaixo do `httpGet`, deve ser definido
para 127.0.0.1. Se o seu pod depende de hosts virtuais, o que é provávelmente o caso mais comum, 
você não deve usar `host`, mas sim definir o cabeçalho `Host` em `httpHeaders`.

Para uma verificação HTTP, o kubelet envia dois cabeçalhos em adição ao cabeçalho obrigatório `Host`:
`User-Agent`, e `Accept`. Os valores padrão para estes cabeçalhos são `kube-probe/{{< skew currentVersion >}}`
(onde `{{< skew currentVersion >}}` é a versão do kubelet ), e `*/*` respectivamente.

Você pode substituir os cabeçalhos padrão definindo `.httpHeaders` para as verificações; por exemplo

```yaml
livenessProbe:
  httpGet:
    httpHeaders:
      - name: Accept
        value: application/json

startupProbe:
  httpGet:
    httpHeaders:
      - name: User-Agent
        value: MyUserAgent
```

Você também pode remover esses dois cabeçalhos, definindo-os com um valor vazio.

```yaml
livenessProbe:
  httpGet:
    httpHeaders:
      - name: Accept
        value: ""

startupProbe:
  httpGet:
    httpHeaders:
      - name: User-Agent
        value: ""
```

### Verificações TCP

Para uma verificação TCP, o kubelet faz a conexão de verificação no nó, não no Pod, o que
significa que você não pode usar um nome de serviço no parâmetro `host`, já que o kubelet não consegue
resolvê-lo.

### Nível de verificação `terminationGracePeriodSeconds`

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

Nas versões anteriores à release 1.21, o nível de Pod `terminationGracePeriodSeconds` 
era usado para terminar um contêiner que falha em suas verificações de vivacidade 
ou inicialização. Este acoplamento não foi intencional e pode ter resultado 
em contêineres com falha na reinicialização, tomando um tempo muito longo 
para reiniciar, quando um Pod `terminaçãoGracePeriodSeconds` fosse configurado.

Na versão 1.21 e posteriores, quando a funcionalidade `ProbeTerminationGracePeriod` do portal de funcionalidades
está habilitada, usuários podem especificar um nível de verificação `terminationGracePeriodSeconds` 
como parte da especificação de verificação. Quando o portal de funcionalidades está habilitado, 
e ambos o Pod e nível de verificação `terminationGracePeriodSeconds` são configurados, 
o kubelet irá utilizar o valor do nível de verificação.

{{< note >}}
Como no Kubernetes 1.22, a funcionalidade `ProbeTerminationGracePeriod` do portal de funcionalidades 
somente está disponível no Servidor de API. O kubelet sempre honra o campo nível de verificação
`terminationGracePeriodSeconds` se ele estiver presente em um Pod.

Se você tem Pods existentes onde o campo `terminationGracePeriodSeconds` 
está configurado, e você não deseja mais usar períodos de carência de encerramento 
por verificação, você precisa apagar estes Pods existentes.

Quando você (ou o `control plane`, ou algum outro componente) criar substituições 
de Pods e o portal de funcionalidade `ProbeTerminationGracePeriod` 
está desabilitado, então o servidor de API ignora o campo nível do Pod 
`terminationGracePeriodSeconds`, mesmo se um Pod ou um `template` de pod especificá-lo.
{{< /note >}}

Por exemplo,

```yaml
spec:
  terminationGracePeriodSeconds: 3600  # pod-level
  containers:
  - name: test
    image: ...

    ports:
    - name: liveness-port
      containerPort: 8080
      hostPort: 8080

    livenessProbe:
      httpGet:
        path: /healthz
        port: liveness-port
      failureThreshold: 1
      periodSeconds: 60
      # Override pod-level terminationGracePeriodSeconds #
      terminationGracePeriodSeconds: 60
```

O nível de verficação `terminationGracePeriodSeconds` não pode ser setado para verificações 
de prontidão.
Será rejeitado pelo servidor de API.

## {{% heading "whatsnext" %}}

* Aprenda mais sobre
[Verificações de Container](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes).

Você também pode ler referências de API para:

* [Pod](/docs/reference/kubernetes-api/workload-resources/pod-v1/), e especificamente:
  * [contêiner(es)](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)
  * [Verificação(ôes)](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Probe)
