---
title: Configurando Liveness, Readiness e Startup Probes
content_type: task
weight: 110
---

<!-- overview -->

Esta página mostra como configurar _liveness_, _readiness_ e _startup probes_ para contêineres.

O [kubelet](/docs/reference/command-line-tools-reference/kubelet/) usa _liveness probes_ para saber quando reiniciar um contêiner. Por exemplo, 
os _liveness probes_ podem pegar um _deadlock_,
situação em que uma aplicação está em execução, mas está incapacitada de prosseguir. Reiniciar
um contêiner nesse estado, pode ajudar a tornar a aplicação mais disponível,
apesar das falhas.

Um padrão comum para _liveness probes_ é usar o mesmo endpoint HTTP de baixo custo também para _readiness probes_,
mas com um maior `failureThreshold`. Isto garante que o pod seja observado com não pronto, por algum tempo antes de ser encerrado.

O kubelet usa _readiness probes_ para saber quando o contêiner está pronto para 
começar a receber tráfego. Um Pod é considerado pronto, quando todos 
os seus contêineres estiverem prontos.
Um uso desse sinal é controlar quais Pods são usados para serviços de retaguarda.
Quando um Pod não está pronto, ele é removido dos balanceadores de carga de Services.

O Kubelet usa _startup probes_ para saber quando um aplicativo 
de contêiner foi iniciado.
Se esse teste estiver configurado, ele desabilita as verificações de _liveness_ e _readiness_ até
que seja bem-sucedido, garantindo que os demais testes não interfiram na inicialização do aplicativo.
Isso pode ser usado para adotar verificações de _liveness_ em contêineres 
de inicialização lenta, evitando serem encerrados pelo Kubelet antes 
de estarem executando.

{{< caution >}}
As _liveness probes_ podem ser um poderoso meio de recuperação de falhas de aplicações,
mas elas devem ser usadas com cuidado. As _liveness probes_ precisam ser configuradas cuidadosamente
para garantir que elas realmente estejam indicando falhas irrecuperáveis na aplicação, por exemplo um _deadlock_.
{{< /caution >}}

{{< note >}}
Implementações incorretas de _liveness probes_ podem levar a falhas em cascata. Isto resulta na 
reinicialização de contêiner com alta carga; falhas em requisições de clientes bem como sua aplicação se torna menos escalável;
e aumenta a carga de trabalho nos pods remanescentes devido à alguns pods com falha.
Entender a diferença entre _readiness_ e _liveness probes_ e quando aplicá-las para a sua app.
{{< /note >}}


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}



<!-- steps -->

## Defina um comando de _liveness_

Muitos aplicativos em execução por longos períodos de tempo acabam entrando em um estado de falha, e não são capazes de se recuperar, exceto após uma reinicialização. 
O Kubernetes fornece _liveness probes_ para detectar e remediar essas situações.

Neste exercício, você cria um Pod que executa um contêiner baseado na imagem 
`registry.k8s.io/busybox`. Aqui está o arquivo de configuração para o Pod:

{{< codenew file="pods/probe/exec-liveness.yaml" >}}

No arquivo de configuração, você pode ver que o Pod tem um único contêiner.
O campo `periodSeconds` especifica que o kubelet deve executar o _liveness probe_ 
a cada 5 segundos. O campo `initialDelaySeconds` diz ao kubelet que ele deve 
esperar 5 segundos antes de fazer o primeiro teste.
Para fazer o teste, o kubelet executa o comando `cat /tmp/healthy` no contêiner alvo. 
Se o comando for bem sucedido, ele retorna 0, e o kubelet considera que o contêiner está rodando 
e íntegro. Se o comando retornar um valor não zero, o kubelet encerra o contêiner e o reinicia.

Quando o contêiner inicializa, ele executa este comando:

```shell
/bin/sh -c "touch /tmp/healthy; sleep 30; rm -f /tmp/healthy; sleep 600"
```

Nos primeiros 30 segundos de execução do contêiner, existe um arquivo `/tmp/healthy`.
Assim, durante os primeiros 30 segundos, o comando `cat /tmp/healthy` retorna um código 
de sucesso. Depois dos 30 segundos, `cat /tmp/healthy` retorna um código de falha.

Crie o Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/exec-liveness.yaml
```

Dentro dos 30 segundos, veja os eventos do Pod:

```shell
kubectl describe pod liveness-exec
```

A saída indica que nenhum _liveness probe_ falhou ainda:

```
Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  11s   default-scheduler  Successfully assigned default/liveness-exec to node01
  Normal  Pulling    9s    kubelet, node01    Pulling image "registry.k8s.io/busybox"
  Normal  Pulled     7s    kubelet, node01    Successfully pulled image "registry.k8s.io/busybox"
  Normal  Created    7s    kubelet, node01    Created container liveness
  Normal  Started    7s    kubelet, node01    Started container liveness
```

Após 35 segundos, veja os eventos do Pod novamente:

```shell
kubectl describe pod liveness-exec
```

Na parte inferior da saída, existem mensagens indicando que os _liveness probes_
falharam, e o contêiner foi encerrado e recriado.

```
  Type     Reason     Age                From               Message
  ----     ------     ----               ----               -------
  Normal   Scheduled  57s                default-scheduler  Successfully assigned default/liveness-exec to node01
  Normal   Pulling    55s                kubelet, node01    Pulling image "registry.k8s.io/busybox"
  Normal   Pulled     53s                kubelet, node01    Successfully pulled image "registry.k8s.io/busybox"
  Normal   Created    53s                kubelet, node01    Created container liveness
  Normal   Started    53s                kubelet, node01    Started container liveness
  Warning  Unhealthy  10s (x3 over 20s)  kubelet, node01    Liveness probe failed: cat: can't open '/tmp/healthy': No such file or directory
  Normal   Killing    10s                kubelet, node01    Container liveness failed liveness probe, will be restarted
```

Espere outros 30 segundos, e verifique que o contêiner foi reinicializado:

```shell
kubectl get pod liveness-exec
```

A saída mostra que `RESTARTS` foi incrementado: Note que o contador `RESTARTS` é incrementado assim que um contêiner que falhou retorne ao estado rodando:

```
NAME            READY     STATUS    RESTARTS   AGE
liveness-exec   1/1       Running   1          1m
```

## Defina uma requisição HTTP para _liveness_

Outra forma de _liveness probe_ utiliza a requisição HTTP GET. Aqui está 
o arquivo de configuração para um Pod que fica escutando em um contêiner baseado 
na imagem `registry.k8s.io/liveness`.

{{< codenew file="pods/probe/http-liveness.yaml" >}}

No arquivo de configuração, você pode ver que o Pod tem um único contêiner.
O campo `periodSeconds` especifica que o Kubelet deve executar uma _liveness probe_ a cada 3 segundos. O campo `initialDelaySeconds` diz ao Kubelet que ele
deve esperar 3 segundos antes de realizar a primeira verificação. Para realizar 
uma verificação, o Kubelet envia uma solicitação HTTP GET para o servidor que está 
em execução no contêiner e escutando na porta 8080. Se o Handler do servidor para o caminho `/healthz` retornar um código de sucesso, o Kubelet considera que o contêiner está rodando
e íntegro. Se o Handler retornar um código de falha, o Kubelet encerra o contêiner
e o reinicia.

Qualquer código maior ou igual a 200 e menor que 400 indica sucesso. 
Qualquer outro código indica falha.

Você pode ver o código fonte para o servidor em 
[server.go](https://github.com/kubernetes/kubernetes/blob/master/test/images/agnhost/liveness/server.go).

Para os primeiros 10 segundos que o contêirner está ativo, o handler 
`/healthz` retorna o status 200. Após isso, o handler retorna o status 500.

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
Assim o primeiro par de `health checks` terá sucesso. Mas após 10 segundos, os `health checks` vão falhar, e o kubelet encerrará e reiniciará o contêiner.

Para testar a checagem de _liveness_ HTTP, crie um Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/http-liveness.yaml
```

Após 10 segundos, veja os eventos do Pod para conferir que o _liveness probes_ falhou 
e o contêiner foi reiniciado:

```shell
kubectl describe pod liveness-http
```

Em versões anteriores à v1.13 (incluindo a v1.13), se a variável de ambiente
`http_proxy` (ou `HTTP_PROXY`) estiver atribuída no nó em que o Pod estiver executando,
o _liveness probe_ HTTP usará esse proxy.
Em versões após a v1.13, configurações de variáveis de ambiente HTTP proxy locais 
não afetam o _liveness probe_ HTTP. 

## Defina o _liveness probe_ TCP

O terceiro tipo de _liveness probe_ usa o socket TCP. Com essa configuração, 
o kubelet tentará abrir um socket para o seu contêiner na porta especificada.
Se ele conseguir estabelecer uma conexão, o contêiner é considerado íntegro, 
se não conseguir é considerado como falho.

{{< codenew file="pods/probe/tcp-liveness-readiness.yaml" >}}

Como você pode ver, a configuração para uma verificação TCP é bastante semelhante 
a uma verificação HTTP.
Este exemplo usa ambos os testes, _readiness_ e _liveness_. O kubelet enviará o
primeiro teste de _readiness_ 5 segundos após o início do contêiner. Dessa forma tentará
conectar-se ao contêiner `GoProxy` na porta 8080. Se o teste for bem sucedido, o Pod
será marcado como pronto. O Kubelet continuará executando essa verificação a cada 10
segundos.

Conjuntamente com o teste de _readiness_, essa configuração inclui um teste de _liveness_.
O Kubelet executará a primeira verificação de _liveness_ 15 segundos após o contêiner
iniciar. Semelhante à verificação de _readiness_, ele tentará se conectar ao contêiner
`GoProxy` na porta 8080. Se a verificação de _liveness_ falhar, o contêiner
será reiniciado.
Para testar a verificação de _liveness_ TCP, crie um Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/tcp-liveness-readiness.yaml
```

Após 15 segundos, veja os eventos do Pod para verificar os _liveness probes_:

```shell
kubectl describe pod goproxy
```

## Defina uma _liveness probe_ gRPC

{{< feature-state for_k8s_version="v1.24" state="beta" >}}

Se a sua aplicação implementa o [Protocolo de verificação de integridade gRPC](https://github.com/grpc/grpc/blob/master/doc/health-checking.md),
este exemplo mostra como configurar o kubernetes para usar usá-la para a verificação de _liveness_ da aplicação.
Similarmente você pode configurar _readiness_ e _startup probes_.

Aqui está um exemplo de manifesto:

{{< codenew file="pods/probe/grpc-liveness.yaml" >}}

Para usar a verificação gRPC, uma `porta` precisa ser configurada. Se você quiser distinguir verificações de diferentes tipos e recursos você pode usar o campo `service`.
Você pode atribuir `service` ao valor `liveness` e fazer o seu `endpoint de Health Checking gRPC` responder a esta requisição diferentemente de quando ao campo `service` estiver atribuído `readiness`. 
Isto permite você usar o mesmo `endpoint` para diferentes tipos de verificações de integridade de contêiner (diferente de necessitar escutar em duas portas diferentes).
Se você precisar especificar seu nome de serviço personalizado e também especificar um tipo de verificação, o projeto kubernetes recomenda a você usar um nome que os concatene. Por exemplo: `myservice-liveness` (usando `-` como um separador).  

{{< note >}}
Diferentemente de verificações HTTP e TCP, portas nomeadas não podem ser usadas 
e host personalizado não pode ser configurado.
{{< /note >}}

Problemas de configuração (por exemplo: porta e serviço incorretos, 
protocolo de verificação de integridade não implementado) são considerados 
falhas de verificação, similarmente às verfificações HTTP e TCP.

Para testar verificações de _liveness_ gRPC, crie um Pod usando o seguinte comando.
No exemplo a seguir, o pod etcd está configurado para usar _liveness probe_ gRPC.

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/grpc-liveness.yaml
```

Após 15 segundos, veja os eventos do Pod para verificar que o teste de _liveness_ 
não falhou:

```shell
kubectl describe pod etcd-with-grpc
```

Antes da versão 1.23 do Kubernetes, verificações de integridade gRPC foram frequentemente 
implementadas usando [grpc-health-probe](https://github.com/grpc-ecosystem/grpc-health-probe/),
como descrito no post do blog [verificação de integridade gRPC em servidores no Kubernetes](/blog/2018/10/01/health-checking-grpc-servers-on-kubernetes/).
O comportamento de verificação gRPC interno é semelhante 
ao implementado pelo `grpc-healthh-probe`.
Ao migrar de `grpc-health-probe` para verificações incorporadas, lembre-se 
das seguintes diferenças:
- Verificações incorporadas executam contra o endereço IP do pod, 
  diferente do `grpc-health-probe` que executa no ip local `127.0.0.1`.
  Certifique-se de configurar seu `endpoint` gRPC para escutar no endereço IP do Pod.
- As verificações incorporadas não suportam nenhum parâmetro de autenticação (como `-tls`).
- Não há códigos de erro para verficações incorporadas. 
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

## Proteja contêineres de lenta inicialização com _startup probes_ {#define-startup-probes}

As vezes, você precisa lidar com aplicativos legados, que possam exigir um tempo 
de inicialização adicional na primeira inicialização.
Nesses casos, pode ser complicado configurar parâmetros de verificação de _liveness_ 
sem comprometer a resposta rápida a `deadlocks` que motivaram essa verificação.
O truque é configurar uma verificação de inicialização com o mesmo comando, 
verificação de HTTP ou TCP, com um `failureThRreshold * periodSeconds` com tempo 
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

Graças à _startup probe_, a aplicação terá no máximo 5 minutos 
(30 * 10 = 300s) para finalizar sua inicialização.
Uma vez que a _startup probe_ tenha sucesso, a _liveness probe_ assume para fornecer uma resposta rápida 
aos `deadlocks` do contêiner.
Se a _startup probe_ nunca for bem sucedida, o contêiner será encerrado 
após 300s e sujeitado ao `Restartpolicy` do Pod.

## Defina _readiness probes_

As vezes, as aplicações estão temporariamente incapacitadas de atender ao tráfego.
Por exemplo, uma aplicação pode precisar carregar uma grande quantidade de dados 
ou arquivos de configurações durante a inicialização, ou depende de serviços externos 
após a inicialização.
Nesses casos, você não quer encerrar a aplicação, mas você também não deseja enviar 
solicitações. O Kubernetes fornece _readiness probes_ para detectar 
e mitigar essas situações. Um Pod com contêineres relatando que eles 
não estão prontos para receber tráfego através de serviços Kubernetes.

{{< note >}}
As _readiness probes_ executam no contêiner durante todo o seu ciclo-de-vida.
{{< /note >}}

{{< caution >}}
As _liveness probes_ *não* esperam pelas _readiness probes_ serem 
bem sucedidas. Se você quiser esperar antes de executar uma _liveness probe_, 
use o `initialDelaySeconds` ou um `startupProbe`.
{{< /caution >}}

AS _readiness probes_ são configuradas da mesma forma que as _liveness probes_. 
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

A configuração para _readiness probes_ HTTP e TCP também permanecem idênticas 
a _liveness probe_.
As _readiness probes_ e _liveness probes_ podem ser usadas em paralelo para o mesmo contêiner.
Usar os dois pode garantir que o tráfego não atinja um contêiner que não esteja pronto
para isso, e que os contêineres são reiniciados quando falharem.

## Configure verificações

{{< caution >}}
Eventualmente, parte desta seção pode ser movida para um tópico conceitual.
{{< /caution >}}

[Verificações](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#probe-v1-core)
 tem um número de campos que você pode usar para ter um contrôle mais preciso sobre 
 o comportamento das _startup probes_, _liveness probes_ e _readiness probes_:

* `initialDelaySeconds`: Número de segundos após o contêiner ser inciado antes 
  das _startup probes_, _liveness probes_ ou _readiness probes_ serem iniciadas. Padrão é 0 segundos. 
  Valor mínimo é 0.
* `periodSeconds`: Quanto (em segundos) para executar a verificação. Padrão é 10
  segundos. Valor mínimo é 1.
* `timeoutSeconds`: Número de segundos após o qual a verificação retorna tempo esgotado. 
  Padrão é 1 segundo. Valor mínimo é 1.
* `successThreshold`: Mínimo de verificações consecutivas bem sucedidas para 
  a verificação ser bem sucedida após ter havido uma falha. Padrão é 1. 
  Precisa ser 1 para _liveness probe_ e _startup probe_. Valor mínimo é 1.
* `failureThreshold`: Após uma verificação falhar `failureThreshold` vezes, o kubernetes considera que todas as verificações falharam: o contêiner _não_ está pronto / íntegro / rodando. 
  Para o caso de _startup_ ou _liveness probe_, se ao menos a verificação de `failureThreshold` falhou, 
  o Kubernetes tratará o contêiner como não íntegro e dispara a reinicialização do contêiner específico.
  O kubelet leva em consideração `terminationGracePeriodSeconds` atribuído ao contêiner.
  Para uma falha de _readiness probe_, o kubelet continua rodando o contêiner que falhou, 
  e também continua rodando mais verificações; devido à verficação ter falhado, 
  o kubelet atribui `false` a [condição](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)
  no Pod.
* `terminationGracePeriodSeconds`: configura um período de graça para que o kubelet espere antes de disparar o desligamento do contêiner falho, 
  então força o gerenciador de contêiner a parar este contêiner. 
  O padrão é herdar o valor `Pod-level` para `terminationGracePeriodSeconds` 
  (30 segundos se não especificado), e o valor mínimo é 1.
  Veja [_probe-level_ `terminationGracePeriodSeconds`](#probe-level-terminationgraceperiodseconds) para mais detalhes.
 
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
de execução no cluster estiverem com um valor atribuído para `timeoutSeconds`.
Se você tem Pods que são impactados pelo padrão de tempo de 1 segundo,
você deve atualizar o tempo limite de verificação para que esteja pronto para a
eventual remoção desse portal de funcionalidades.

Com a correção dessa falha, para verificações de execução, no Kubernetes `1.20+` 
com o contêiner runtime `dockershim`, o processo dentro do contêiner pode continuar 
rodando mesmo após a falha de verificação por causa do `timeout`.
{{< /note >}}

{{< caution >}}
Implementações incorretas de _readiness probes_ podem resultar em um número sempre 
crescente de processos no contêiner e escassez de recursos se isso for deixado desmarcado.
{{< /caution >}}

### verificações HTTP

[Verificações HTTP](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#httpgetaction-v1-core)
têm campos adicionais que podem ser setados em `httpGet`:

* `host`: Nome do host para se conectar, por padrão é o IP do Pod. Você provávelmente vai quer
  definir "Host" em `httpHeaders` ao invés de deixar o valor padrão.
* `scheme`: Esquema usado para conectar ao host (HTTP ou HTTPS). O padrão é HTTP.
* `path`: Caminho para o acesso ao servidor HTTP. Padrão é /.
* `httpHeaders`: Cabeçalhos customizados para setar nas requisições. HTTP aceita cabeçalhos repetidos.
* `port`: Nome ou número da porta para acessar o contêiner. Número precisa estar no intervalo 1 até 65535.

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
era usado para terminar um contêiner que falhou em suas _liveness probes_ 
ou _startup probes_. Este acoplamento não foi intencional e pode ter resultado 
em contêineres com falha, tomando um tempo não usual muito longo 
para reiniciar, quando um Pod `terminaçãoGracePeriodSeconds` fosse configurado.

Na versão 1.25 e posteriores, usuários podem especificar um nível de verificação `terminationGracePeriodSeconds` 
como parte das especificações de verificações. Quando ambos um pod e um nível de verificações `terminationGracePeriodSeconds` estão definidos, 
o kubelet usará o valor de nível de verificação.

{{< note >}}
Começando no Kubernetes 1.25, a funcionalidade `ProbeTerminationGracePeriod` está habilitada por padrão. 
Para usuários escolhendo desabilitar esta funcionalidade, por favor notem o seguinte:

* A funcionalidade `ProbeTerminationGracePeriod` somente está disponível no Servidor de API. O kubelet sempre honra o campo nível de verificação
  `terminationGracePeriodSeconds` se ele estiver presente em um Pod.

* Se você tem Pods existentes onde o campo `terminationGracePeriodSeconds` 
  está configurado e você não deseja mais usar verificações por períodos de carência de encerramento, 
  você precisa apagar estes Pods existentes.

* Quando você (ou o `control plane`, ou algum outro componente) criar substituições 
de Pods, e o portal de funcionalidade `ProbeTerminationGracePeriod` 
está desabilitado, então o servidor de API ignora o campo nível de verificação do Pod 
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

O nível de verficação `terminationGracePeriodSeconds` não pode ser setado para _readiness probes_.
Será rejeitado pelo servidor de API.

## {{% heading "whatsnext" %}}

* Aprenda mais sobre
[Verificações de Container](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes).

Você também pode ler referências de API para:

* [Pod](/docs/reference/kubernetes-api/workload-resources/pod-v1/), e especificamente:
  * [contêiner(es)](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)
  * [Verificação(ôes)](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Probe)
