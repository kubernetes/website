---
title: Guia para Executar Contêineres Windows no Kubernetes
content_type: tutorial
weight: 75
---

<!-- visão geral -->

Esta página fornece um passo a passo para executar contêineres Windows usando o Kubernetes.
Esta página também destaca funcionalidades específicas do Windows dentro do Kubernetes.

É importante notar que criar e implantar serviços e cargas de trabalho no Kubernetes
comporta-se de forma muito semelhante para contêineres Linux e Windows.
Os [comandos kubectl](/pt-br/docs/reference/kubectl/) para interagir com o cluster são idênticos.
Os exemplos nesta página são fornecidos para iniciar sua experiência com contêineres Windows.

<!-- corpo -->

## Objetivos

Configurar um exemplo de implantação para executar contêineres Windows em um nó Windows.

## {{% heading "prerequisites" %}}

Você deve ter acesso a um cluster Kubernetes que inclua um
nó de trabalho executando Windows Server.

## Começando: Implantando uma Carga de Trabalho Windows

O exemplo de arquivo YAML abaixo implanta um aplicativo simples de servidor web executando dentro de um contêiner Windows.

Crie um manifesto chamado `win-webserver.yaml` com o conteúdo abaixo:

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: win-webserver
  labels:
    app: win-webserver
spec:
  ports:
    # a porta em que este serviço deve rodar
    - port: 80
      targetPort: 80
  selector:
    app: win-webserver
  type: NodePort
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: win-webserver
  name: win-webserver
spec:
  replicas: 2
  selector:
    matchLabels:
      app: win-webserver
  template:
    metadata:
      labels:
        app: win-webserver
      name: win-webserver
    spec:
     containers:
      - name: windowswebserver
        image: mcr.microsoft.com/windows/servercore:ltsc2019
        command:
        - powershell.exe
        - -command
        - "<# código retirado de https://gist.github.com/19WAS85/5424431# > ; $$listener = New-Object System.Net.HttpListener ; $$listener.Prefixes.Add('http://*:80/') ; $$listener.Start() ; $$callerCounts = @{} ; Write-Host('Listening at http://*:80/') ; while ($$listener.IsListening) { ;$$context = $$listener.GetContext() ;$$requestUrl = $$context.Request.Url ;$$clientIP = $$context.Request.RemoteEndPoint.Address ;$$response = $$context.Response ;Write-Host '' ;Write-Host('> {0}' -f $$requestUrl) ;  ;$$count = 1 ;$$k=$$callerCounts.Get_Item($$clientIP) ;if ($$k -ne $$null) { $$count += $$k } ;$$callerCounts.Set_Item($$clientIP, $$count) ;$$ip=(Get-NetAdapter | Get-NetIpAddress); $$header='<html><body><H1>Windows Container Web Server</H1>' ;$$callerCountsString='' ;$$callerCounts.Keys | % { $$callerCountsString+='<p>IP {0} callerCount {1} ' -f $$ip[1].IPAddress,$$callerCounts.Item($$_) } ;$$footer='</body></html>' ;$$content='{0}{1}{2}' -f $$header,$$callerCountsString,$$footer ;Write-Output $$content ;$$buffer = [System.Text.Encoding]::UTF8.GetBytes($$content) ;$$response.ContentLength64 = $$buffer.Length ;$$response.OutputStream.Write($$buffer, 0, $$buffer.Length) ;$$response.Close() ;$$responseStatus = $$response.StatusCode ;Write-Host('< {0}' -f $$responseStatus)  } ; "
     nodeSelector:
      kubernetes.io/os: windows
```

{{< note >}}
Mapeamento de portas também é suportado, mas para simplicidade este exemplo expõe
a porta 80 do contêiner diretamente para o Service.
{{< /note >}}

1. Verifique se todos os nós estão íntegros:

    ```bash
    kubectl get nodes
    ```

2. Implante o serviço e monitore as atualizações do pod:

    ```bash
    kubectl apply -f win-webserver.yaml
    kubectl get pods -o wide -w
    ```

    Quando o serviço for implantado corretamente, ambos os Pods serão marcados como prontos. Para sair do comando de monitoramento, pressione Ctrl+C.

3. Verifique se a implantação foi bem-sucedida. Para verificar:

    * Vários pods listados a partir do nó de camada de gerenciamento Linux, use `kubectl get pods`
    * Comunicação de nó para pod através da rede, execute `curl` na porta 80 do IP do seu pod a partir do nó de plano de controle Linux para verificar uma resposta do servidor web
    * Comunicação entre pods, utilize ping entre pods (e através de hosts, se você tiver mais de um nó Windows) usando `kubectl exec`
    * Comunicação de serviço para pod, execute `curl` no IP virtual do serviço (visto em `kubectl get services`) a partir do nó de camada de gerenciamento Linux e de pods individuais
    * Descoberta de serviço, execute `curl` no nome do serviço com o [sufixo DNS padrão do Kubernetes](/docs/concepts/services-networking/dns-pod-service/#services)
    * Conectividade de entrada, execute `curl` no NodePort a partir do nó de plano de controle Linux ou máquinas fora do cluster
    * Conectividade de saída, execute `curl` em IPs externos de dentro do pod usando `kubectl exec`

{{< note >}}
Os hosts de contêiner Windows não conseguem acessar o IP de serviços alocados neles devido a limitações da pilha de rede do Windows.
Apenas pods Windows conseguem acessar IPs de serviço.
{{< /note >}}

## Observabilidade

### Capturando logs de cargas de trabalho

Os logs são um elemento importante da observabilidade; eles permitem que os usuários obtenham insights sobre o aspecto operacional das cargas de trabalho e são um componente essencial na solução de problemas. Como os contêineres Windows e as cargas de trabalho dentro de contêineres Windows se comportam de maneira diferente dos contêineres Linux, os usuários enfrentaram dificuldades na coleta de logs, limitando a visibilidade operacional. 
As cargas de trabalho Windows, por exemplo, geralmente são configuradas para registrar logs no ETW (Event Tracing for Windows) ou enviar entradas para o log de eventos de aplicativos. 
O [LogMonitor](https://github.com/microsoft/windows-container-tools/tree/master/LogMonitor), uma ferramenta de código aberto da Microsoft, é a maneira recomendada para monitorar as fontes de logs configuradas dentro de um contêiner Windows. O LogMonitor oferece suporte para monitorar logs de eventos, provedores ETW e logs personalizados de aplicativos, canalizando-os para o STDOUT para consumo pelo comando `kubectl logs <pod>`.

Siga as instruções na página do GitHub do LogMonitor para copiar seus binários e arquivos de configuração para todos os seus contêineres e adicionar os entrypoints necessários para que o LogMonitor envie seus logs para o STDOUT.


## Configurando usuários de contêiner

### Usando nomes de usuário configuráveis para Contêineres

Contêineres Windows podem ser configurados para executar seus entrypoints e processos
com nomes de usuário diferentes dos padrões da imagem.
Saiba mais sobre isso [aqui](/pt-br/docs/tasks/configure-pod-container/configure-runasusername/).

### Gerenciando Identidade de Carga de Trabalho com Contas de Serviço Gerenciadas por Grupo

As cargas de trabalho em contêineres Windows podem ser configuradas para usar Contas de Serviço Gerenciadas por Grupo (GMSA).
As GMSAs são um tipo específico de conta do Active Directory que fornece gerenciamento automático de senhas,
gerenciamento simplificado de nomes principais de serviço (SPN) e a capacidade de delegar o gerenciamento a outros administradores em vários servidores.
Contêineres configurados com uma GMSA podem acessar recursos de domínio do Active Directory externo enquanto mantêm a identidade configurada com a GMSA.
Saiba mais sobre como configurar e usar GMSA para contêineres Windows [aqui](/pt-br/docs/tasks/configure-pod-container/configure-gmsa/).

## Taints e tolerations

Os usuários precisam usar uma combinação de {{<glossary_tooltip text="taint" term_id="taint" >}} e selectors de nós para agendar cargas de trabalho Linux e Windows em seus respectivos nós específicos de sistema operacional. A abordagem recomendada está descrita abaixo, com o objetivo principal de não quebrar a compatibilidade com cargas de trabalho Linux existentes.

Você pode (e deve) definir `.spec.os.name` para cada Pod, para indicar o sistema operacional para o qual os contêineres nesse Pod foram projetados. Para Pods que executam contêineres Linux, defina `.spec.os.name` como `linux`. Para Pods que executam contêineres Windows, defina `.spec.os.name` como `windows`.

{{< note >}}
Se você estiver executando uma versão do Kubernetes anterior à 1.24, pode ser necessário habilitar o [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `IdentifyPodOS` para definir um valor para `.spec.pod.os`.
{{< /note >}}

O escalonador não utiliza o valor de `.spec.os.name` ao atribuir Pods a nós. Você deve usar os mecanismos normais do Kubernetes para [atribuir Pods a nós](/docs/concepts/scheduling-eviction/assign-pod-node/) para garantir que a camada de gerenciamento do seu cluster coloque os Pods em nós que estão executando o sistema operacional apropriado.

O valor de `.spec.os.name` não tem efeito na alocação dos Pods Windows, então taints e tolerations (ou selectors de nós) ainda são necessários para garantir que os Pods Windows sejam atribuídos aos nós Windows apropriados.

### Garantindo que cargas de trabalho específicas de SO sejam atribuídas ao host de contêiner apropriado

Os usuários podem garantir que contêineres Windows sejam agendados no host apropriado usando taints e tolerations. Todos os nós Kubernetes que executam o Kubernetes {{< skew currentVersion >}} têm os seguintes rótulos padrão:

* kubernetes.io/os = [windows|linux]
* kubernetes.io/arch = [amd64|arm64|...]

Se uma especificação de Pod não especificar um `nodeSelector`, como `"kubernetes.io/os": windows`, é possível que o Pod seja agendado em qualquer host, Windows ou Linux. Isso pode ser problemático, já que um contêiner Windows só pode ser executado em Windows e um contêiner Linux só pode ser executado em Linux. A prática recomendada para o Kubernetes {{< skew currentVersion >}} é usar um `nodeSelector`.

No entanto, em muitos casos, os usuários têm um grande número de implantações existentes para contêineres Linux, bem como um ecossistema de configurações prontas para uso, como chart do Helm da comunidade e casos de geração programática de Pods, como com operadores. Nessas situações, você pode hesitar em fazer a alteração de configuração para adicionar campos `nodeSelector` a todos os Pods e modelos de Pod. A alternativa é usar taints. Como o kubelet pode definir taints durante o registro, ele pode ser facilmente modificado para adicionar automaticamente um taint ao executar apenas em Windows.

Por exemplo: `--register-with-taints='os=windows:NoSchedule'`

Ao adicionar um taint a todos os nós Windows, nada será agendado neles (isso inclui Pods Linux existentes). Para que um Pod Windows seja alocação em um nó Windows, ele precisará tanto do `nodeSelector` quanto da toleration correspondente para escolher Windows.

```yaml
nodeSelector:
    kubernetes.io/os: windows
    node.kubernetes.io/windows-build: '10.0.17763'
tolerations:
    - key: "os"
      operator: "Equal"
      value: "windows"
      effect: "NoSchedule"
```

### Lidando com várias versões do Windows no mesmo cluster

A versão do Windows Server usada por cada Pod deve corresponder à do nó. Se você quiser usar várias versões do Windows Server no mesmo cluster, deverá definir rótulos adicionais de nó e campos `nodeSelector`.

O Kubernetes adiciona automaticamente um rótulo, [`node.kubernetes.io/windows-build`](/docs/reference/labels-annotations-taints/#nodekubernetesiowindows-build), para simplificar isso.

Este rótulo reflete o número principal, secundário e de build do Windows que precisam corresponder para compatibilidade. Aqui estão os valores usados para cada versão do Windows Server:

| Nome do Produto                     | Versão                |
|-------------------------------------|-----------------------|
| Windows Server 2019                 | 10.0.17763            |
| Windows Server 2022                 | 10.0.20348            |

### Simplificando com RuntimeClass

[RuntimeClass] pode ser usado para simplificar o processo de usar taints e tolerations. Um administrador de cluster pode criar um objeto `RuntimeClass`, que é usado para encapsular esses taints e tolerations.

1. Salve este arquivo como `runtimeClasses.yml`. Ele inclui o `nodeSelector` apropriado para o SO, arquitetura e versão do Windows.

   ```yaml
   ---
   apiVersion: node.k8s.io/v1
   kind: RuntimeClass
   metadata:
     name: windows-2019
   handler: example-container-runtime-handler
   scheduling:
     nodeSelector:
       kubernetes.io/os: 'windows'
       kubernetes.io/arch: 'amd64'
       node.kubernetes.io/windows-build: '10.0.17763'
     tolerations:
     - effect: NoSchedule
       key: os
       operator: Equal
       value: "windows"
   ```

2. Execute `kubectl create -f runtimeClasses.yml` como administrador do cluster.
3. Adicione `runtimeClassName: windows-2019` conforme apropriado às especificações de Pods.

   Por exemplo:

   ```yaml
   ---
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: iis-2019
     labels:
       app: iis-2019
   spec:
     replicas: 1
     template:
       metadata:
         name: iis-2019
         labels:
           app: iis-2019
       spec:
         runtimeClassName: windows-2019
         containers:
         - name: iis
           image: mcr.microsoft.com/windows/servercore/iis:windowsservercore-ltsc2019
           resources:
             limits:
               cpu: 1
               memory: 800Mi
             requests:
               cpu: .1
               memory: 300Mi
           ports:
             - containerPort: 80
    selector:
       matchLabels:
         app: iis-2019
   ---
   apiVersion: v1
   kind: Service
   metadata:
     name: iis
   spec:
     type: LoadBalancer
     ports:
     - protocol: TCP
       port: 80
     selector:
       app: iis-2019
   ```

[RuntimeClass]: /docs/concepts/containers/runtime-class/
