---
title: Traduzindo um Arquivo do Docker Compose Para Recursos Kubernetes
content_type: task
weight: 200
update_date: 2022-07-18
origin_version: 1.24
contributors: DonatoHorn
reviewers:
- cdrage
---

<!-- overview -->

O que é Kompose? É uma ferramenta de conversão de arquivos de especificações, (nomeados Docker Compose), para orquestradores de Contêineres (Kubernetes ou OpenShift).

Mais informações podem ser encontradas no site do Kompose em [http://kompose.io](http://kompose.io).

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Instale o Kompose

Temos várias maneiras de instalar o Kompose. Nosso método preferido é baixando do github o binário da última versão.

{{< tabs name="install_ways" >}}
{{% tab name="GitHub download" %}}

O Kompose é lançado via github em um ciclo de três semanas, você pode ver todos os releases atuais na [página de release do GitHub](https://github.com/kubernetes/kompose/releases).

```sh
# Linux
curl -L https://github.com/kubernetes/kompose/releases/download/v1.26.0/kompose-linux-amd64 -o kompose

# macOS
curl -L https://github.com/kubernetes/kompose/releases/download/v1.26.0/kompose-darwin-amd64 -o kompose

# Windows
curl -L https://github.com/kubernetes/kompose/releases/download/v1.26.0/kompose-windows-amd64.exe -o kompose.exe

chmod +x kompose
sudo mv ./kompose /usr/local/bin/kompose
```

Alternativamente, você pode baixar o [tarball](https://github.com/kubernetes/kompose/releases).

{{% /tab %}}
{{% tab name="Build from source" %}}

Instalação usando a busca `go get` da ramificação master com as últimas atualizações de desenvolvimento.

```sh
go get -u github.com/kubernetes/kompose
```

{{% /tab %}}
{{% tab name="CentOS package" %}}

O Kompose está no repositório do CentOS [EPEL](https://fedoraproject.org/wiki/EPEL).
Se você não tiver o repositório [EPEL](https://fedoraproject.org/wiki/EPEL) já instalado e habilitado, 
você precisa executar `sudo yum install epel-release`

Se você tem o [EPEL](https://fedoraproject.org/wiki/EPEL) habiliado em seu sistema, você pode instalar o Kompose como qualquer outro pacote.

```bash
sudo yum -y install kompose
```

{{% /tab %}}
{{% tab name="Fedora package" %}}

O Kompose está nos repositórios do Fedora 24, 25 e 26. Você pode instalá-lo como qualquer outro pacote.

```bash
sudo dnf -y install kompose
```

{{% /tab %}}
{{% tab name="Homebrew (macOS)" %}}

No macOS você pode instalar a última release via [Homebrew](https://brew.sh):

```bash
brew install kompose
```

{{% /tab %}}
{{< /tabs >}}

## Usando Kompose

Em alguns passos, vamos levá-lo do Docker Compose para o Kubernetes. Tudo
que você precisa é ter um arquivo `docker-compose.yml`.

1. Vá para o diretório que contém o seu arquivo `docker-compose.yml`. Se você não tem um, teste usando este.

   ```yaml
   version: "2"

   services:

     redis-master:
       image: k8s.gcr.io/redis:e2e
       ports:
         - "6379"

     redis-slave:
       image: gcr.io/google_samples/gb-redisslave:v3
       ports:
         - "6379"
       environment:
         - GET_HOSTS_FROM=dns

     frontend:
       image: gcr.io/google-samples/gb-frontend:v4
       ports:
         - "80:80"
       environment:
         - GET_HOSTS_FROM=dns
       labels:
         kompose.service.type: LoadBalancer
   ```

2. Para converter o arquivo `docker-compose.yml` para arquivos que você pode usar com o
   `kubectl`, execute `kompose convert` e então `kubectl apply -f <arquivo de saída>`.

   ```bash
   kompose convert
   ```

   A saída é semelhante a:

   ```none
   INFO Kubernetes file "frontend-service.yaml" created
      INFO Kubernetes file "frontend-service.yaml" created
   INFO Kubernetes file "frontend-service.yaml" created
   INFO Kubernetes file "redis-master-service.yaml" created
      INFO Kubernetes file "redis-master-service.yaml" created
   INFO Kubernetes file "redis-master-service.yaml" created
   INFO Kubernetes file "redis-slave-service.yaml" created
      INFO Kubernetes file "redis-slave-service.yaml" created
   INFO Kubernetes file "redis-slave-service.yaml" created
   INFO Kubernetes file "frontend-deployment.yaml" created
      INFO Kubernetes file "frontend-deployment.yaml" created
   INFO Kubernetes file "frontend-deployment.yaml" created
   INFO Kubernetes file "redis-master-deployment.yaml" created
      INFO Kubernetes file "redis-master-deployment.yaml" created
   INFO Kubernetes file "redis-master-deployment.yaml" created
   INFO Kubernetes file "redis-slave-deployment.yaml" created
      INFO Kubernetes file "redis-slave-deployment.yaml" created
   INFO Kubernetes file "redis-slave-deployment.yaml" created
   ```

   ```bash
    kubectl apply -f frontend-service.yaml,redis-master-service.yaml,redis-slave-service.yaml,frontend-deployment.yaml,redis-master-deployment.yaml,redis-slave-deployment.yaml
   ```

   A saída é semelhante a:

   ```none
   service/frontend created
   service/redis-master created
   service/redis-slave created
   deployment.apps/frontend created
   deployment.apps/redis-master created
   deployment.apps/redis-slave created
   ```

    Suas implantações estão em execução no Kubernetes.

3. Acesse sua aplicação.

   Se você já está usando `minikube` para o seu processo de desenvolvimento:

   ```bash
   minikube service frontend
   ```

   Caso contrário, vamos procurar qual IP seu serviço está usando!

   ```sh
   kubectl describe svc frontend
   ```

   ```none
   Name:                   frontend
   Namespace:              default
   Labels:                 service=frontend
   Selector:               service=frontend
   Type:                   LoadBalancer
   IP:                     10.0.0.183
   LoadBalancer Ingress:   192.0.2.89
   Port:                   80      80/TCP
   NodePort:               80      31144/TCP
   Endpoints:              172.17.0.4:80
   Session Affinity:       None
   No events.
   ```

   Se você está usando um provedor de nuvem, seu IP será listado após o `LoadBalancer Ingress`.

   ```sh
   curl http://192.0.2.89
   ```

<!-- discussion -->

## Guia do usuário

- CLI
  - [`Conversor kompose`](#kompose-convert)
- Documentação
  - [Conversões Alternativas](#alternative-conversions)
  - [Rótulos](#labels)
  - [Reiniciar](#restart)
  - [Versões do Docker Compose](#docker-compose-versions)

O Kompose tem suporte para dois provedores: OpenShift e Kubernetes.
Você pode escolher um provedor usando a opção global `--provider`. Se nenhum provedor for especificado, será definido o Kubernetes por padrão.

## `kompose convert`

O Kompose suporta conversão das versões V1, V2, e V3 de arquivos Docker Compose em objetos do Kubernetes e OpenShift.

### Exemplo de `kompose convert` Kubernetes

```shell
kompose --file docker-voting.yml convert
```

```none
WARN Unsupported key networks - ignoring
WARN Unsupported key build - ignoring
INFO Kubernetes file "worker-svc.yaml" created
INFO Kubernetes file "db-svc.yaml" created
INFO Kubernetes file "redis-svc.yaml" created
INFO Kubernetes file "result-svc.yaml" created
INFO Kubernetes file "vote-svc.yaml" created
INFO Kubernetes file "redis-deployment.yaml" created
INFO Kubernetes file "result-deployment.yaml" created
INFO Kubernetes file "vote-deployment.yaml" created
INFO Kubernetes file "worker-deployment.yaml" created
INFO Kubernetes file "db-deployment.yaml" created
```

```shell
ls
```

```none
db-deployment.yaml  docker-compose.yml         docker-gitlab.yml  redis-deployment.yaml  result-deployment.yaml  vote-deployment.yaml  worker-deployment.yaml
db-svc.yaml         docker-voting.yml          redis-svc.yaml     result-svc.yaml        vote-svc.yaml           worker-svc.yaml
```

Você também pode fornecer vários arquivos do Docker-Compose ao mesmo tempo:

```shell
kompose -f docker-compose.yml -f docker-guestbook.yml convert
```

```none
INFO Kubernetes file "frontend-service.yaml" created         
INFO Kubernetes file "mlbparks-service.yaml" created         
INFO Kubernetes file "mongodb-service.yaml" created          
INFO Kubernetes file "redis-master-service.yaml" created     
INFO Kubernetes file "redis-slave-service.yaml" created      
INFO Kubernetes file "frontend-deployment.yaml" created      
INFO Kubernetes file "mlbparks-deployment.yaml" created      
INFO Kubernetes file "mongodb-deployment.yaml" created       
INFO Kubernetes file "mongodb-claim0-persistentvolumeclaim.yaml" created
INFO Kubernetes file "redis-master-deployment.yaml" created  
INFO Kubernetes file "redis-slave-deployment.yaml" created   
```

```shell
ls
```

```none
mlbparks-deployment.yaml  mongodb-service.yaml                       redis-slave-service.jsonmlbparks-service.yaml  
frontend-deployment.yaml  mongodb-claim0-persistentvolumeclaim.yaml  redis-master-service.yaml
frontend-service.yaml     mongodb-deployment.yaml                    redis-slave-deployment.yaml
redis-master-deployment.yaml
```

Quando vários arquivos do Docker-Compose são fornecidos, a configuração é mesclada. Qualquer configuração em comum será sobreposta pelo arquivo subsequente.

### Exemplo de `kompose convert` OpenShift

```sh
kompose --provider openshift --file docker-voting.yml convert
```

```none
WARN [worker] Service cannot be created because of missing port.
INFO OpenShift file "vote-service.yaml" created             
INFO OpenShift file "db-service.yaml" created               
INFO OpenShift file "redis-service.yaml" created            
INFO OpenShift file "result-service.yaml" created           
INFO OpenShift file "vote-deploymentconfig.yaml" created    
INFO OpenShift file "vote-imagestream.yaml" created         
INFO OpenShift file "worker-deploymentconfig.yaml" created  
INFO OpenShift file "worker-imagestream.yaml" created       
INFO OpenShift file "db-deploymentconfig.yaml" created      
INFO OpenShift file "db-imagestream.yaml" created           
INFO OpenShift file "redis-deploymentconfig.yaml" created   
INFO OpenShift file "redis-imagestream.yaml" created        
INFO OpenShift file "result-deploymentconfig.yaml" created  
INFO OpenShift file "result-imagestream.yaml" created  
```

Ele também suporta a criação da diretiva `BuildConfig` para construir um serviço. Por padrão, 
ele usa o repositório remoto para a ramificação Git atual, como o repositório de origem, e a ramificação corrente como fonte da ramificação para a construção. 
Você pode especificar um repositótio e ramificação de origem diferente usando respectivamente as opções ``--build-repo`` e ``--build-branch``.

```sh
kompose --provider openshift --file buildconfig/docker-compose.yml convert
```

```none
WARN [foo] Service cannot be created because of missing port.
INFO OpenShift Buildconfig using git@github.com:rtnpro/kompose.git::master as source.
INFO OpenShift file "foo-deploymentconfig.yaml" created     
INFO OpenShift file "foo-imagestream.yaml" created          
INFO OpenShift file "foo-buildconfig.yaml" created
```

{{< note >}}
Se você está empurrando manualmente os artefatos do OpenShift usando ``oc create -f``, é preciso garantir que você empurre o artefato `imagestream` antes do artefato do `buildconfig`, para contornar esta questão do OpenShift: https://github.com/openshift/origin/issues/4518 .
{{< /note >}}

## Conversões alternativas

A transformação padrão do `kompose` vai gerar [Implantações](/docs/concepts/workloads/controllers/deployment/) Kubernetes e [Serviços](/docs/concepts/services-networking/service/), em formato yaml. Você tem uma opção alternativa para gerar JSON com `-j`. 
Além disso, você pode gerar alternativamente objetos [Controladores de Replicação](/docs/concepts/workloads/controllers/replicationcontroller/), [Daemon Sets](/docs/concepts/workloads/controllers/daemonset/), ou `charts` [Helm](https://github.com/helm/helm).

```sh
kompose convert -j
INFO Kubernetes file "redis-svc.json" created
INFO Kubernetes file "web-svc.json" created
INFO Kubernetes file "redis-deployment.json" created
INFO Kubernetes file "web-deployment.json" created
```

Os arquivos `*-deployment.json` contém os objetos de implantação.

```sh
kompose convert --replication-controller
INFO Kubernetes file "redis-svc.yaml" created
INFO Kubernetes file "web-svc.yaml" created
INFO Kubernetes file "redis-replicationcontroller.yaml" created
INFO Kubernetes file "web-replicationcontroller.yaml" created
```

O arquivo `*-replicationcontroller.yaml` contém os objetos do controlador de replicação. Se você deseja especificar o número de réplicas (o padrão é 1), use a flag `--replicas`: `kompose convert --replication-controller --replicas 3`

```shell
kompose convert --daemon-set
INFO Kubernetes file "redis-svc.yaml" created
INFO Kubernetes file "web-svc.yaml" created
INFO Kubernetes file "redis-daemonset.yaml" created
INFO Kubernetes file "web-daemonset.yaml" created
```

Os arquivos `*-daemonset.yaml` contém os objetos `DaemonSet`

Se você deseja gerar um `chart` para ser usado com [Helm](https://github.com/kubernetes/helm) execute:

```shell
kompose convert -c
```

```none
INFO Kubernetes file "web-svc.yaml" created
INFO Kubernetes file "redis-svc.yaml" created
INFO Kubernetes file "web-deployment.yaml" created
INFO Kubernetes file "redis-deployment.yaml" created
chart created in "./docker-compose/"
```

```shell
tree docker-compose/
```

```none
docker-compose
├── Chart.yaml
├── README.md
└── templates
    ├── redis-deployment.yaml
    ├── redis-svc.yaml
    ├── web-deployment.yaml
    └── web-svc.yaml
```

A estrutura do gráfico visa fornecer um esqueleto, para construir seus `charts` Helm.

## Rótulos

O `kompose` suporta rótulos específicos de kompose dentro do arquivo `docker-compose.yml`, para definir explicitamente o comportamento de um serviço após a conversão.

- `kompose.service.type` define o tipo de serviço a ser criado.

Por exemplo:

```yaml
version: "2"
services:
  nginx:
    image: nginx
    dockerfile: foobar
    build: ./foobar
    cap_add:
      - ALL
    container_name: foobar
    labels:
      kompose.service.type: nodeport
```

- O `kompose.service.expose` define se o serviço precisa ser acessível de fora do cluster ou não. Se o valor for definido como "true", o provedor define o endpoint automaticamente, e para qualquer outro valor, o valor é definido como o `hostname`. Se várias portas forem definidas em um serviço, a primeira será a escolhido para ser exposta.
  - Para o provedor de Kubernetes, um recurso de admissão é criado, assumindo que um controlador de admissão já esteja configurado.
  - Para o provedor OpenShift, uma rota é criada.

Por exemplo:

```yaml
version: "2"
services:
  web:
    image: tuna/docker-counter23
    ports:
     - "5000:5000"
    links:
     - redis
    labels:
      kompose.service.expose: "counter.example.com"
  redis:
    image: redis:3.0
    ports:
     - "6379"
```

As opções atualmente suportadas são:

| Key                  | Value                               |
|----------------------|-------------------------------------|
| kompose.service.type | nodeport / clusterip / loadbalancer |
| kompose.service.expose| true / hostname |

{{< note >}}
O rótulo `kompose.service.type` deve ser definido com somente `ports`, caso contrário o `kompose` irá falhar.
{{< /note >}}

## Reiniciando

Se você deseja criar Pods normais sem controladores, você pode usar a construção `restart` do docker-compose para definí-la. 
Siga a tabela abaixo para ver o que acontece no valor `restart`.

| `docker-compose` `restart` | object created    | Pod `restartPolicy` |
|----------------------------|-------------------|---------------------|
| `""`                       | controller object | `Always`            |
| `always`                   | controller object | `Always`            |
| `on-failure`               | Pod               | `OnFailure`         |
| `no`                       | Pod               | `Never`             |

{{< note >}}
O objeto do controlador pode ser `deployment` ou `replicationcontroller`.
{{< /note >}}

Por exemplo, o serviço `pival` vai se tornar o Pod abaixo. Este contêiner calcula o valor de `pi`.

```yaml
version: '2'

services:
  pival:
    image: perl
    command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
    restart: "on-failure"
```

### Aviso sobre configurações de implantação

Se o arquivo do docker compose tiver um volume especificado para um serviço, a implantação (Kubernetes) ou a estratégia `DeploymentConfig` (OpenShift) 
é trocada para "Recreate" em vez de "RollingUpdate" (padrão). Isso é feito para evitar que várias instâncias de um serviço acessem um volume ao mesmo tempo.

Se o arquivo do docker compose tiver nome de serviço com `_` (ex.`web_service`), então será substituído por `-` e o nome do serviço será renomeado de acordo (ex.`web-service`). 
O Kompose faz isso porque o "Kubernetes" não permite `_` no nome do objeto.

Observe que alterar o nome do serviço pode quebrar alguns arquivos `docker-compose`.

## Versões do Docker Compose

O Kompose suporta as versões Docker Compose: 1, 2 e 3. Temos suporte limitado em versões 2.1 e 3.2 devido à sua natureza experimental.

Uma lista completa sobre compatibilidade entre as três versões está listada em nosso [documento de conversão](https://github.com/kubernetes/kompose/blob/master/docs/conversion.md) incluindo uma lista de todas as chaves incompatíveis do docker compose.
