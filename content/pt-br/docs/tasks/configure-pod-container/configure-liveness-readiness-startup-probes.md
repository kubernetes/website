---
title: Configurar Verificações de Operacionalidade, Prontidão e Inicialização
content_type: task
weight: 140
---

<!-- overview -->

Esta página mostra como configurar verificações de operacionalidade (_liveness_), prontidão (_readiness_)
e inicialização (_startup_) para contêineres.

Para mais informações sobre verificações, veja
[Verificações de Operacionalidade, Prontidão e Inicialização](/docs/concepts/workloads/pods/probes).

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Defina um comando de operacionalidade {#define-a-liveness-command}

Muitas aplicações que ficam em execução por longos períodos acabam entrando em
estados de falha, dos quais não conseguem se recuperar a não ser que sejam reiniciadas. O Kubernetes fornece
verificações de operacionalidade para detectar e corrigir essas situações.

Neste exercício, você cria um Pod que executa um contêiner baseado na imagem
`registry.k8s.io/busybox:1.27.2`. Este é o arquivo de configuração do Pod:

{{% code_sample file="pods/probe/exec-liveness.yaml" %}}

No arquivo de configuração, você pode ver que o Pod tem um único `Container`.
O campo `periodSeconds` especifica que o kubelet deve executar uma verificação de
operacionalidade a cada 5 segundos. O campo `initialDelaySeconds` informa ao kubelet que ele
deve aguardar 5 segundos antes de executar a primeira verificação. Para executar uma verificação, o
kubelet executa o comando `cat /tmp/healthy` no contêiner alvo. Se o
comando for bem-sucedido, ele retorna 0, e o kubelet considera o contêiner vivo e
saudável. Se o comando retornar um valor diferente de zero, o kubelet encerra o contêiner
e o reinicia.

Quando o contêiner inicia, ele executa este comando:

```shell
/bin/sh -c "touch /tmp/healthy; sleep 30; rm -f /tmp/healthy; sleep 600"
```

Durante os primeiros 30 segundos de vida do contêiner, existe um arquivo `/tmp/healthy`.
Portanto, durante os primeiros 30 segundos, o comando `cat /tmp/healthy` retorna um código
de sucesso. Após 30 segundos, `cat /tmp/healthy` retorna um código de falha.

Crie o Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/exec-liveness.yaml
```

Dentro de 30 segundos, veja os eventos do Pod:

```shell
kubectl describe pod liveness-exec
```

A saída indica que nenhuma verificação de operacionalidade falhou ainda:

```none
Type    Reason     Age   From               Message
----    ------     ----  ----               -------
Normal  Scheduled  11s   default-scheduler  Successfully assigned default/liveness-exec to node01
Normal  Pulling    9s    kubelet, node01    Pulling image "registry.k8s.io/busybox:1.27.2"
Normal  Pulled     7s    kubelet, node01    Successfully pulled image "registry.k8s.io/busybox:1.27.2"
Normal  Created    7s    kubelet, node01    Created container liveness
Normal  Started    7s    kubelet, node01    Started container liveness
```

Após 35 segundos, veja os eventos do Pod novamente:

```shell
kubectl describe pod liveness-exec
```

No final da saída, há mensagens indicando que as verificações de operacionalidade
falharam e que os contêineres com falha foram encerrados e recriados.

```none
Type     Reason     Age                From               Message
----     ------     ----               ----               -------
Normal   Scheduled  57s                default-scheduler  Successfully assigned default/liveness-exec to node01
Normal   Pulling    55s                kubelet, node01    Pulling image "registry.k8s.io/busybox:1.27.2"
Normal   Pulled     53s                kubelet, node01    Successfully pulled image "registry.k8s.io/busybox:1.27.2"
Normal   Created    53s                kubelet, node01    Created container liveness
Normal   Started    53s                kubelet, node01    Started container liveness
Warning  Unhealthy  10s (x3 over 20s)  kubelet, node01    Liveness probe failed: cat: can't open '/tmp/healthy': No such file or directory
Normal   Killing    10s                kubelet, node01    Container liveness failed liveness probe, will be restarted
```

Aguarde mais 30 segundos e verifique se o contêiner foi reiniciado:

```shell
kubectl get pod liveness-exec
```

A saída mostra que o valor de `RESTARTS` foi incrementado. Observe que o contador `RESTARTS`
é incrementado assim que um contêiner com falha volta ao estado de execução:

```none
NAME            READY     STATUS    RESTARTS   AGE
liveness-exec   1/1       Running   1          1m
```

## Defina uma requisição HTTP de operacionalidade {#define-a-liveness-http-request}

Outro tipo de verificação de operacionalidade usa uma requisição HTTP GET. Este é o arquivo
de configuração de um Pod que executa um contêiner baseado na imagem `registry.k8s.io/e2e-test-images/agnhost`.

{{% code_sample file="pods/probe/http-liveness.yaml" %}}

No arquivo de configuração, você pode ver que o Pod tem um único contêiner.
O campo `periodSeconds` especifica que o kubelet deve executar uma verificação de
operacionalidade a cada 3 segundos. O campo `initialDelaySeconds` informa ao kubelet que ele
deve aguardar 3 segundos antes de executar a primeira verificação. Para executar uma verificação, o
kubelet envia uma requisição HTTP GET para o servidor que está em execução no contêiner
e escutando na porta 8080. Se o handler do caminho `/healthz` do servidor
retornar um código de sucesso, o kubelet considera o contêiner vivo e
saudável. Se o handler retornar um código de falha, o kubelet encerra o contêiner
e o reinicia.

Qualquer código maior ou igual a 200 e menor que 400 indica sucesso. Qualquer
outro código indica falha.

Você pode ver o código-fonte do servidor em
[server.go](https://github.com/kubernetes/kubernetes/blob/master/test/images/agnhost/liveness/server.go).

Durante os primeiros 10 segundos em que o contêiner está vivo, o handler `/healthz`
retorna o status 200. Depois disso, o handler retorna o status 500.

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

O kubelet começa a executar as verificações de saúde 3 segundos após o contêiner iniciar.
Portanto, as primeiras verificações de saúde serão bem-sucedidas. Mas, após 10 segundos, as
verificações de saúde vão falhar, e o kubelet vai encerrar e reiniciar o contêiner.

Para testar a verificação de operacionalidade HTTP, crie um Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/http-liveness.yaml
```

Após 10 segundos, veja os eventos do Pod para confirmar que as verificações de operacionalidade falharam e
que o contêiner foi reiniciado:

```shell
kubectl describe pod liveness-http
```

Em versões posteriores à v1.13, as configurações de variáveis de ambiente de proxy HTTP locais não
afetam a verificação de operacionalidade HTTP.

### Use HTTP/2 sem criptografia (h2c) com verificações HTTP {#use-h2c-with-http-probes}

{{< feature-state feature_gate_name="H2CContainerProbe" >}}

Por padrão, o `kubelet` envia requisições HTTP/1.1 ao executar uma verificação HTTP.
Se a sua aplicação expõe endpoints de saúde apenas via HTTP/2 sem criptografia (h2c),
você pode adicionar o campo `protocol` ao campo `httpGet` na especificação da verificação e
definir o valor `HTTP2`. Isso exige que o [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`H2CContainerProbe` esteja habilitado tanto no `kube-apiserver` quanto no `kubelet`.

{{% code_sample file="pods/probe/h2c-liveness.yaml" %}}

Quando `protocol` está definido como `HTTP2`, o `kubelet` se conecta usando HTTP/2 sem criptografia
(h2c), ou seja, HTTP/2 sobre TCP puro, sem TLS. As seguintes configurações não são
suportadas:

*   `protocol: HTTP2` e `scheme: HTTPS`
*   `protocol: HTTP2` e um valor no campo `host`

Se o feature gate estiver desabilitado, o servidor de API remove o campo `protocol`
de Pods novos ou atualizados.

## Defina uma verificação de operacionalidade TCP {#define-a-tcp-liveness-probe}

Um terceiro tipo de verificação de operacionalidade usa um socket TCP. Com essa configuração, o
kubelet tentará abrir um socket para o seu contêiner na porta especificada.
Se conseguir estabelecer uma conexão, o contêiner é considerado saudável; se não
conseguir, isso é considerado uma falha.

{{% code_sample file="pods/probe/tcp-liveness-readiness.yaml" %}}

Como você pode ver, a configuração de uma verificação TCP é bastante parecida com a de uma verificação HTTP.
Este exemplo usa verificações de prontidão e de operacionalidade. O kubelet executará a
primeira verificação de operacionalidade 15 segundos após o contêiner iniciar. Ela tentará se
conectar ao contêiner `goproxy` na porta 8080. Se a verificação de operacionalidade falhar,
o contêiner será reiniciado. O kubelet continuará executando essa verificação
a cada 10 segundos.

Além da verificação de operacionalidade, essa configuração inclui uma verificação de
prontidão. O kubelet executará a primeira verificação de prontidão 15 segundos após o
contêiner iniciar. Assim como a verificação de operacionalidade, ela tentará se conectar ao
contêiner `goproxy` na porta 8080. Se a verificação for bem-sucedida, o Pod será
marcado como pronto e receberá tráfego dos Services. Se a verificação de prontidão
falhar, o Pod será marcado como não pronto e não receberá tráfego de nenhum
Service.

Para testar a verificação de operacionalidade TCP, crie um Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/tcp-liveness-readiness.yaml
```

Após 15 segundos, veja os eventos do Pod para conferir as verificações de operacionalidade:

```shell
kubectl describe pod goproxy
```

## Defina uma verificação de operacionalidade gRPC {#define-a-grpc-liveness-probe}

{{< feature-state for_k8s_version="v1.27" state="stable" >}}

Se a sua aplicação implementa o
[gRPC Health Checking Protocol](https://github.com/grpc/grpc/blob/master/doc/health-checking.md),
este exemplo mostra como configurar o Kubernetes para usá-lo nas verificações de operacionalidade da aplicação.
Da mesma forma, você pode configurar verificações de prontidão e de inicialização.

Este é um manifesto de exemplo:

{{% code_sample file="pods/probe/grpc-liveness.yaml" %}}

Para testar a verificação de operacionalidade gRPC, crie um Pod usando o comando abaixo.
No exemplo abaixo, o Pod do etcd está configurado para usar uma verificação de operacionalidade gRPC.

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/grpc-liveness.yaml
```

Após 15 segundos, veja os eventos do Pod para confirmar que a verificação de operacionalidade não falhou:

```shell
kubectl describe pod etcd-with-grpc
```

Ao usar uma verificação gRPC, há alguns detalhes técnicos que você precisa conhecer:

- As verificações são executadas contra o endereço IP ou o hostname do Pod.
  Certifique-se de configurar o seu endpoint gRPC para escutar no endereço IP do Pod.
- Por padrão, as verificações se conectam sem criptografia. Veja
  [Use TLS com verificações gRPC](#grpc-probe-tls) para saber como habilitar o TLS.
- Não há códigos de erro para as verificações embutidas. Todos os erros são considerados falhas da verificação.
- Se o feature gate `ExecProbeTimeout` estiver definido como `false`, o grpc-health-probe **não**
  respeita a configuração `timeoutSeconds` (cujo padrão é 1s), enquanto a verificação embutida falharia por timeout.

### Use TLS com verificações gRPC {#grpc-probe-tls}

{{< feature-state feature_gate_name="GRPCContainerProbeTLS" >}}

Por padrão, o `kubelet` se conecta aos endpoints de saúde gRPC sem criptografia. Se
a sua aplicação expõe gRPC apenas via TLS, você pode adicionar o campo `mode` ao
campo `grpc` na especificação da verificação e definir o valor `TLS`. Isso
exige que o [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`GRPCContainerProbeTLS` esteja habilitado tanto no `kube-apiserver` quanto no `kubelet`.

{{% code_sample file="pods/probe/grpc-tls-liveness.yaml" %}}

Quando `mode` está definido como `TLS`, o `kubelet` se conecta via TLS com
`InsecureSkipVerify` e não verifica o certificado do servidor. Esse é o mesmo
comportamento das verificações HTTPS. A verificação de certificado não é suportada.

Se o feature gate estiver desabilitado, o `kube-apiserver` remove o campo `mode`
de Pods novos ou atualizados.

## Use uma porta nomeada {#use-a-named-port}

Você pode usar uma [`port`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#ports) nomeada
para verificações HTTP e TCP. Verificações gRPC não suportam portas nomeadas.

Por exemplo:

```yaml
ports:
- name: liveness-port
  containerPort: 8080

livenessProbe:
  httpGet:
    path: /healthz
    port: liveness-port
```

## Proteja contêineres de inicialização lenta com verificações de inicialização {#define-startup-probes}

Às vezes, você precisa lidar com aplicações que exigem um tempo adicional de
inicialização na primeira vez que sobem. Nesses casos, pode ser complicado configurar
os parâmetros da verificação de operacionalidade sem comprometer a resposta rápida a deadlocks
que motivou o uso dessa verificação. A solução é configurar uma verificação de inicialização com o
mesmo comando, verificação HTTP ou TCP, com um `failureThreshold * periodSeconds` longo
o suficiente para cobrir o pior caso de tempo de inicialização.

Assim, o exemplo anterior ficaria:

```yaml
ports:
- name: liveness-port
  containerPort: 8080

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
(30 * 10 = 300s) para concluir a sua inicialização.
Depois que a verificação de inicialização for bem-sucedida uma vez, a verificação de operacionalidade assume
para fornecer uma resposta rápida a deadlocks do contêiner.
Se a verificação de inicialização nunca for bem-sucedida, o contêiner é encerrado após 300s e
fica sujeito à `restartPolicy` do Pod.

## Defina verificações de prontidão {#define-readiness-probes}

Às vezes, as aplicações ficam temporariamente incapazes de atender tráfego.
Por exemplo, uma aplicação pode precisar carregar grandes volumes de dados ou arquivos de configuração
durante a inicialização, ou depender de serviços externos após a inicialização.
Nesses casos, você não quer encerrar a aplicação,
mas também não quer enviar requisições para ela. O Kubernetes fornece
verificações de prontidão para detectar e mitigar essas situações. Um Pod com contêineres
informando que não estão prontos não recebe tráfego por meio dos Services do
Kubernetes.

{{< note >}}
As verificações de prontidão são executadas no contêiner durante todo o seu ciclo de vida.
{{< /note >}}

{{< caution >}}
As verificações de prontidão e de operacionalidade não dependem uma da outra para serem bem-sucedidas.
Se você quiser aguardar antes de executar uma verificação de prontidão, deve usar
`initialDelaySeconds` ou uma `startupProbe`.
{{< /caution >}}

As verificações de prontidão são configuradas de forma semelhante às verificações de operacionalidade. A única diferença
é que você usa o campo `readinessProbe` em vez do campo `livenessProbe`.

```yaml
readinessProbe:
  exec:
    command:
    - /bin/cat
    - /tmp/healthy
  initialDelaySeconds: 5
  periodSeconds: 5
```

A configuração de verificações de prontidão HTTP e TCP também permanece idêntica à das
verificações de operacionalidade.

As verificações de prontidão e de operacionalidade podem ser usadas em paralelo no mesmo contêiner.
Usar ambas garante que o tráfego não chegue a um contêiner que ainda não está pronto
para recebê-lo e que os contêineres sejam reiniciados quando falharem.

## {{% heading "whatsnext" %}}

* Saiba mais sobre
  [Verificações de Operacionalidade, Prontidão e Inicialização](/docs/concepts/workloads/pods/probes/).
* Para a especificação completa dos campos relacionados às verificações, veja a referência da API:
  [Pod](/docs/reference/kubernetes-api/workload-resources/pod-v1/),
  [Container](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container),
  [Probe](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Probe)
