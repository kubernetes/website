---
reviewers:
- erictune
title: Init Containers
content_type: concept
weight: 40
---

<!-- overview -->

Essa página provê uma visão geral de init containers: especializada nos containers que executam antes de app containers em um {{< glossary_tooltip text="Pod" term_id="pod" >}}. Init containers podem conter utilidades ou configurações que não estão presentes em uma imagem de um app.

Você pode especificar init containers em uma especificação de Pod ao longo de um array de `containers` (que descreve app containers).

<!-- body -->

## Entendendo init containers

Um {{< glossary_tooltip text="Pod" term_id="pod" >}} pode ter multiplos containers executando apps com ele, mas ele também pode ter um ou mais init containers, que são executados antes dos app containers serem iniciados.

Init containers são exatamente como containers regulares, exceto:

* Init containers executam sempre até completarem.
* Cada init container deve completar com sucesso antes de ir para o próximo início.

Se o Pod do init container falhar, o kubelet reinicia repetidamente aquele init container

Contudo, se o Pod tem um `restartPolicy` de Never e o container falha durante a inicialização daquele Pod, Kubernetes trata sobretudo como um Pod que falhou. 

Para especificar um init container para um Pod, adicione o campo `initContainers` dentro do [Pod specification](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec), como um array de items de `container` (similar com o campo de app `containers` e seu conteúdo).
Veja [Container](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container) na API de referência para mais detalhes.

### Diferenças entre containers regulares

Init containers suportam todos os campos e funcionalidades do app containers, incluindo recursos limitados, volumes e configuração de segurança. Contudo, a requisição do recurso e limites para um init container são tratadas de formas diferentes  como documentado em [Resources](#resources).

Init containers também não suportam `lifecycle`, `livenessProbe`, `readinessProbe`, ou `startupProbe` porque eles devem executar por completo antes do Pod estar pronto.

Se você especificar multiplos init containers para um Pod, kuberlet executa cada init container sequentially. Cada init container deve ter sucesso antes da póxima poder exewcutar. Quando todos os init containers terem executado por completo, kuberlet inicializa os containers para o Pod e executa eles normalmente.

## Usando init containers

Por conta dos init containers terem imagens separadas do app containers, eles têm algumas vantagens para relação do código de inicialização:

* Init containers podem conter utilitários ou configuração costumizada de código que não está presente na imagem do app. Por exemplo, não há a necessidade de fazer uma imagem `FROM` outra imagem apenas para usar uma ferramente como `sed`, `awk`, `python`, ou `dig` durante a configuração.
* A regra da imagem do construtor da aplicação e deployer podem trabalhar independentemente sem que precise conjuntamente construir uma única imagem de app.
* Init containers podem executar com uma view diferente do arquivo de sistema do que no app containers no mesmo Pod. Consequentemente eles podem dar acesso para {{< glossary_tooltip text="Secrets" term_id="secret" >}} que o app containers não tem acesso.
* Por conta dos init containers executarem por completo antes de qualquer app containers iniciarem, init containers oferecem um mecanismo de bloqueio ou espera do app container até que as definições de pré-condições sejam cumpridas. Uma vez que as pré-condições forem cumpridas, todos os app containers no Pod podem iniciar em paralelo.
*Init containers podem seguramente executar utilitários ou código costumizado que pode, por outro lado, fazer uma imagem de app container menos segura. Mantendo ferramentas separadas você pode limitar ataques de superfície da sua imagem de app de container. 

### Exemplos
Aqui estão algumas ideias de como usar init containers:

* Espere pelo {{< glossary_tooltip text="Service" term_id="service">}} para criar usando uma única linha de comando shell seguinte: 
  ```shell
  for i in {1..100}; do sleep 1; if dig myservice; then exit 0; fi; done; exit 1
  ```
* Registre esse Pod com um servidor remoto da API baixada com o comando seguinte:
  ```shell
  curl -X POST http://$MANAGEMENT_SERVICE_HOST:$MANAGEMENT_SERVICE_PORT/register -d 'instance=$(<POD_NAME>)&ip=$(<POD_IP>)'
  ```
* Clone um repositório Git na {{< glossary_tooltip text="Volume" term_id="volume" >}}

* Preencha valores dentro do arquivo de configuração e execute o a ferramenta de modelo para dinamicamente gerar um arquivo de configuração que mantem o app container. Por exemplo, preencha o valor `POD_IP` na configuração para gerar o arquivo do app de configuração principal usando Jinja.

### Init containers em uso

Esse exemplo define um Pod simples que tem dois init containers. O primeiro espera pelo `myservice`, e o segundo espera pelo `mydb`. Uma vez que ambos init containers terminam, o Pod executa pela seção `spec`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
spec:
  containers:
  - name: myapp-container
    image: busybox:1.28
    command: ['sh', '-c', 'echo The app is running! && sleep 3600']
  initContainers:
  - name: init-myservice
    image: busybox:1.28
    command: ['sh', '-c', "until nslookup myservice.$(cat /var/run/secrets/kubernetes.io/serviceaccount/namespace).svc.cluster.local; do echo waiting for myservice; sleep 2; done"]
  - name: init-mydb
    image: busybox:1.28
    command: ['sh', '-c', "until nslookup mydb.$(cat /var/run/secrets/kubernetes.io/serviceaccount/namespace).svc.cluster.local; do echo waiting for mydb; sleep 2; done"]
```

Você pode iniciar esse Pod executando:

```shell
kubectl apply -f myapp.yaml
```
A saída é similar a isso:
```
pod/myapp-pod created
```

E cheque o estado com:
```shell
kubectl get -f myapp.yaml
```
A saída deverá ser similar a isso:
```
NAME        READY     STATUS     RESTARTS   AGE
myapp-pod   0/1       Init:0/2   0          6m
```

ou para mais detalhes:
```shell
kubectl describe -f myapp.yaml
```
A saída deverá ser similar a isso:
```
Name:          myapp-pod
Namespace:     default
[...]
Labels:        app=myapp
Status:        Pending
[...]
Init Containers:
  init-myservice:
[...]
    State:         Running
[...]
  init-mydb:
[...]
    State:         Waiting
      Reason:      PodInitializing
    Ready:         False
[...]
Containers:
  myapp-container:
[...]
    State:         Waiting
      Reason:      PodInitializing
    Ready:         False
[...]
Events:
  FirstSeen    LastSeen    Count    From                      SubObjectPath                           Type          Reason        Message
  ---------    --------    -----    ----                      -------------                           --------      ------        -------
  16s          16s         1        {default-scheduler }                                              Normal        Scheduled     Successfully assigned myapp-pod to 172.17.4.201
  16s          16s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Pulling       pulling image "busybox"
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Pulled        Successfully pulled image "busybox"
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Created       Created container with docker id 5ced34a04634; Security:[seccomp=unconfined]
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Started       Started container with docker id 5ced34a04634
```
Para ver logs para os init containers nesse Pod, execute:
```shell
kubectl logs myapp-pod -c init-myservice # Inspect the first init container
kubectl logs myapp-pod -c init-mydb      # Inspect the second init container
```
Nesse ponto, esses init containers vão estar esperando para descobrir os serviços chamados `mydb` e `myservice`.

Aqui está a configuração que você pode usar para fazer esses Serviços aparecerem:

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: myservice
spec:
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
---
apiVersion: v1
kind: Service
metadata:
  name: mydb
spec:
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9377
```

Para criar o serviços `mydb` e `myservice`:

```shell
kubectl apply -f services.yaml
```
A saída deverá ser similar a isso:
```
service/myservice created
service/mydb created
```
Você então verá que esses init containers terminam, e que `myapp-pod` Pod vão para este estado de execução:

```shell
kubectl get -f myapp.yaml
```
A saída deverá ser similar a isso:
```
NAME        READY     STATUS    RESTARTS   AGE
myapp-pod   1/1       Running   0          9m
```
Esse simples exemplo deve provê alguma inspiração para você criar seus próprios init containers. [O que vem por ai](#what-s-next)contém um link para mais exemplos detalhados.

## Comportamento detalhado

Durante a inicialização do Pod, o kuberlet espera a execução dos init containers até que a conexão e armazenamento estejam prontos. Então o kuberlet executa os Pod's init containers na ordem que eles aparecem na especificação dos Pod's. 

Cada init container deve sair com sucesso antes do próximo container iniciar. Se um container falhar para iniciar devido a tempo de execução ou sair com falha, ele tenta novamente de acordo com o Pod `restartPolicy`. Contudo, se a Pod `restartPolicy` está configurada para Always, os init containers usam `restartPolicy` OnFailure.

Um Pod não pode estar `Ready` até que todos os init containers tenham sucesso. A porta no init container não são agregadas sob os Serviços. O Pod que está inicializando está no estado `Pending` mas deve ter a condição `Initialized` definida para falso.

Se o Pod [reiniciar](#pod-restart-reasons), ou ser reiniciado, todos os init containers devem executar novamente.

Mudanças na especificação do init container são limitadas para o campo da imagem do container.
Alterando o campo da imagem do init container é equivalente a reiniciar o Pod.

Por conta do init container poder ser reiniciado, tentado novamente, ou re-executado, código do init container pode ser idempontente. Em particular, código que escreve em arquivos no `EmptyDirs` devem estar preparados para a possibilidade do arquivo de sáida já existir.

Init container tem todos os campos de um app container. Contudo, Kubernets proibe `readinessProbe` de ser usado por conta que os init containers não consegue definir com prontidão distinta da conclusão.

Use `activeDeadlineSeconds` no Pod para prevenir os init containers de falharem para sempre.
A linha de conclusão ativa inclui os init containers.
Contudo é recomendado usar `activeDeadlineSeconds` apenas se o time deploy sua aplicação como um Job, por conta de `activeDeadlineSeconds` ter efeito mesmo depois do init container terminar.
O Pod que está pronto e executando corretamente deve ser morto pelo `activeDeadlineSeconds` se você definir.
O Nome de cada app e init container no Pod deve ser único; Um erro de validação é lançado por qualquer container compartilhado com o mesmo nome.

### Recursos

Dado a ordem de executação para os init containers, as seguintes regras para os recursos aplicados usados são:

* O mais alto de qualquer solicitação ou limite de recurso específico definido em todos os init
  containers é a *solicitação/limite de inicialização efetiva*. Se algum recurso não tiver
  limite de recursos especificado, este é considerado o limite mais alto.
* A *solicitação/limite efetivo* do pod para um recurso é o maior de:
  * a soma de todas as solicitações/limites de app containers para um recurso
  * a solicitação/limite de inicialização efetiva para um recurso
* O agendamento é feito com base em solicitações/limites efetivos, o que significa
  que init containers podem reservar recursos para inicialização que não são usados
  durante a vida do Pod.
* A camada de QoS (qualidade de serviço) da *camada de QoS efetiva* do Pod é a
  Camada de QoS para init containers e app containers.

A cota e os limites são aplicados com base na solicitação efetiva do Pod e
limite.

Os grupos de controle de nível de pod (cgroups) são baseados na solicitação efetiva de pod e
limite, o mesmo que o agendador.


### Razões do Pod reiniciar

Um pod pode reiniciar, causando a reexecução de contêineres init, para os seguintes
razões:

* O contêiner de infraestrutura do pod é reiniciado. Isso é incomum e seria
  tem que ser feito por alguém com acesso root aos nós.
* Todos os containers no Pod são terminado enquanto `restartPolicy` está definido para Always, forçando uma reinicialização e o registro de conclusão do init container foi perdido devido
  à coleta de lixo.

O Pod não irá ser reiniciado quando a imagem do  init container tiver mudado, ou o registro de conclusão do init container ter sido perdido devido ao lixo de coleção. Isso se aplica para o Kubernetes v1.20 ou superior. Se você está usando a versão mais recente do Kubernetes, consulte a documentação da versão que está usando.

## {{% heading "whatsnext" %}}

* Leia sobre [criando um pode que contém um init container](/docs/tasks/configure-pod-container/configure-pod-initialization/#create-a-pod-that-has-an-init-container)
* Aprenda como [debugue init containers](/docs/tasks/debug/debug-application/debug-init-containers/)

