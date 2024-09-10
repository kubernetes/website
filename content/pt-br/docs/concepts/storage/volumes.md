---
title: Volumes
content_type: conceito
weight: 10
---

<!-- Visão Geral -->

Os arquivos em disco em um contêiner são efêmeros, o que apresenta alguns problemas para 
aplicações não triviais quando executadas em contêineres. Um problema é a perda de arquivos 
quando um contêiner quebra. O kubelet reinicia o contêiner, mas em um estado limpo. Um segundo 
problema ocorre ao compartilhar arquivos entre contêineres que são executados juntos em 
um `Pod`. A abstração de {{< glossary_tooltip text="volume" term_id="volume" >}} 
do Kubernetes resolve ambos os problemas. Sugere-se familiaridade com [Pods](/docs/concepts/workloads/pods/) .

<!-- body -->
## Contexto

Docker tem um conceito de [volumes](https://docs.docker.com/storage/), embora seja um pouco mais 
simples e menos gerenciado. Um volume Docker é um diretório em disco ou em outro contêiner. 
O Docker oferece drivers de volume, mas a funcionalidade é um pouco limitada.

O Kubernetes suporta muitos tipos de volumes. Um {{< glossary_tooltip term_id="pod" text="Pod" >}} é capaz de utilizar qualquer quantidade de tipos de volumes simultaneamente. Os tipos de volume efêmeros têm a mesma vida útil do pod, mas os volumes persistentes existem além da vida útil de um pod. Quando um pod deixa de existir, o Kubernetes destrói volumes efêmeros; no entanto, o Kubernetes não destrói volumes persistentes. Para qualquer tipo de volume em um determinado pod, os dados são preservados entre as reinicializações do contêiner.

Em sua essência, um volume é um diretório, eventualmente com alguns dados dentro dele, que é acessível aos contêineres de um Pod. Como esse diretório vem a ser, o meio que o suporta e o conteúdo do mesmo são determinados pelo tipo particular de volume utilizado.

Para utilizar um volume, especifique os volumes que serão disponibilizados para o Pod em `.spec.volumes` e declare onde montar esses volumes dentro dos contêineres em `.spec.containers[*].volumeMounts`. Um processo em um contêiner enxerga uma visualização do sistema de arquivos composta pelo do conteúdo inicial da {{< glossary_tooltip text="imagem do contêiner" term_id="image" >}} mais os volumes (se definidos) montados dentro do contêiner. O processo enxerga um sistema de arquivos raiz que inicialmente corresponde ao conteúdo da imagem do contêiner. Qualquer gravação dentro dessa hierarquia do sistema de arquivos, se permitida, afetará o que esse processo enxerga quando ele executa um acesso subsequente ao sistema de arquivos. Os volumes são montados nos [caminhos especificados](#using-subpath) dentro da imagem. Para cada contêiner definido em um Pod, você deve especificar independentemente onde montar cada volume utilizado pelo contêiner.

Volumes não podem ser montados dentro de outros volumes (mas você pode consultar [Utilizando subPath](#using-subpath) para um mecanismo relacionado). Além disso, um volume não pode conter um link físico para qualquer outro dado em um volume diferente.

## Tipos de Volumes {#volume-types}

Kubernetes suporta vários tipos de volumes.

### awsElasticBlockStore (descontinuado) {#awselasticblockstore}

Um volume `awsElasticBlockStore` monta um [volume EBS](https://aws.amazon.com/ebs/) da Amazon Web Services (AWS) em seu pod. Ao contrário do `emptyDir`que é apagado quando um pod é removido, o conteúdo de um volume EBS é preservado e o volume é desmontado. Isto significa que um volume EBS pode ser previamente populado com dados e que os dados podem ser compartilhados entre Pods.

{{< note >}}
Você precisa criar um volume EBS usando `aws ec2 create-volume` ou pela API da AWS antes que você consiga utilizá-lo. 
{{< /note >}}

Existem algumas restrições ao utilizar um volume `awsElasticBlockStore`:

* Os nós nos quais os Pods estão sendo executados devem ser instâncias AWS EC2
* Estas instâncias devem estar na mesma região e na mesma zona de disponibilidade que o volume EBS
* O EBS suporta montar um volume em apenas uma única instância EC2

#### Criando um volume AWS EBS

Antes de poder utilizar um volume EBS com um pod, precisa criá-lo.

```shell
aws ec2 create-volume --availability-zone=eu-west-1a --size=10 --volume-type=gp2
```

Certifique-se de que a zona corresponde à mesma zona em que criou o cluster. Verifique se o tamanho e o tipo de volume EBS são adequados para a sua utilização.

#### Exemplo de configuração do AWS EBS

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-ebs
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-ebs
      name: test-volume
  volumes:
  - name: test-volume
    # Esse volume AWS EBS já deve existir.
    awsElasticBlockStore:
      volumeID: "<volume id>"
      fsType: ext4
```

Se o volume EBS estiver particionado, é possível informar o campo opcional `partition: "<partition em number>"` para especificar em que partição deve ser montado.

#### Migração de CSI do AWS EBS

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

Quando o recurso `CSIMigration` para `awsElasticBlockStore` está habilitado, todas as operações de plugin do tipo in-tree são redirecionadas para o driver Cointainer Storage Interface (CSI) `ebs.csi.aws.com`. Para usar esse recurso, o [driver CSI AWS EBS](https://github.com/kubernetes-sigs/aws-ebs-csi-driver) deve estar instalado no cluster.

#### Migração CSI AWS EBS concluída

{{< feature-state for_k8s_version="v1.17" state="alpha" >}}

Para desabilitar o carregamento do plugin de armazenamento `awsElasticBlockStore` pelo gerenciador de controladores e pelo kubelet, defina a flag `InTreePluginAWSUnregister` como `true`.

### azureDisk (descontinuado) {#azuredisk}

{{< feature-state for_k8s_version="v1.19" state="deprecated" >}}

O tipo de volume `azureDisk` monta um [Disco de Dados](https://docs.microsoft.com/en-us/azure/aks/csi-storage-drivers) Microsoft Azure em um pod.

Para obter mais detalhes, consulte [plugin de volume `azureDisk`](https://github.com/kubernetes/examples/tree/master/staging/volumes/azure_disk/README.md).

#### Migração de CSI do azureDisk

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Quando o recurso `CSIMigration` para `azureDisk` está habilitado, todas as operações de plugin do tipo in-tree são redirecionadas para o Driver de Cointêiner Storage Interface (CSI) `disk.csi.azure.com`. Para utilizar este recurso, o [Driver CSI Azure Disk](https://github.com/kubernetes-sigs/azuredisk-csi-driver) deve estar instalado no cluster.

#### Migração CSI azureDisk concluída

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

Para desabilitar o carregamento do plugin de armazenamento `azureDisk` pelo gerenciador de controladores e pelo kubelet, defina a flag `InTreePluginAzureDiskUnregister` como `true`.

### azureFile (descontinuado) {#azurefile}

{{< feature-state for_k8s_version="v1.21" state="deprecated" >}}

O tipo de volume `azureFile` monta um volume de arquivo Microsoft Azure (SMB 2.1 e 3.0) em um pod.

Para obter mais detalhes, consulte [plugin de volume `azureFile`](https://github.com/kubernetes/examples/tree/master/staging/volumes/azure_file/README.md).

#### Migração de CSI azureFile

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

Quando o recurso `CSIMigration` para `azureFile` está habilitado, todas as operações de plugin do tipo in-tree são redirecionadas para o Driver de Cointainer Storage Interface (CSI) `file.csi.azure.com`. Para utilizar este recurso, o [Driver CSI do Azure Disk](https://github.com/kubernetes-sigs/azurefile-csi-driver) deve estar instalado no cluster e as [feature gates](/docs/reference/command-line-tools-reference/feature-gates/) `CSIMigration` e `CSIMigrationAzureFile` devem estar habilitadas.

O driver de CSI do Azure File não oferece suporte ao uso do mesmo volume por fsgroups diferentes, se a migração de CSI Azurefile estiver habilitada, o uso do mesmo volume por fsgroups diferentes não será suportado.

#### Migração do CSI azureFile concluída

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

Para desabilitar o carregamento do plugin de armazenamento `azureFile` pelo gerenciador de controladores e pelo kubelet, defina a flag `InTreePluginAzureFileUnregister` como `true`.

### cephfs

Um volume `cephfs` permite que um volume CephFS existente seja montado no seu Pod. Ao contrário do `emptyDir` que é apagado quando um pod é removido, o conteúdo de um volume `cephfs` é preservado e o volume é simplesmente desmontado. Isto significa que um volume `cephfs` pode ser previamente populado com dados e que os dados podem ser compartilhados entre os Pods. O volume `cephfs` pode ser montado por vários gravadores simultaneamente.

{{< note >}} Você deve ter seu próprio servidor Ceph funcionando com o compartilhamento acessível antes de poder utilizá-lo. {{< /note >}}

Consulte o [ exemplo CephFS](https://github.com/kubernetes/examples/tree/master/volumes/cephfs/) para mais detalhes.

### cinder (descontinuado)

{{< feature-state for_k8s_version="v1.18" state="deprecated" >}}

{{< note >}} O Kubernetes deve ser configurado com o provedor de nuvem OpenStack. {{< /note >}}

O tipo de volume `cinder` é utilizado para montar o volume do OpenStack Cinder no seu pod.

#### Exemplo de configuração de volume Cinder

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-cinder
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-cinder-container
    volumeMounts:
    - mountPath: /test-cinder
      name: test-volume
  volumes:
  - name: test-volume
    # Esse volume OpenStack já deve existir.
    cinder:
      volumeID: "<volume id>"
      fsType: ext4
```

#### Migração de CSI OpenStack

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

O recurso `CSIMigration` para o Cinder é ativado por padrão no Kubernetes 1.21. Ele redireciona todas as operações de plugin do tipo in-tree para o Driver de Cointainer Storage Interface (CSI) `cinder.csi.openstack.org`. O [Driver CSI OpenStack Cinder](https://github.com/kubernetes/cloud-provider-openstack/blob/master/docs/cinder-csi-plugin/using-cinder-csi-plugin.md) tem de estar instalado no cluster. Você pode desativar a migração Cinder CSI para o seu cluster definindo a [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `CSIMigrationOpenStack` como `false`. Se você desativar o recurso `CSIMigrationOpenStack`, o plugin de volume in-tree do Cinder assume a responsabilidade por todos os aspectos do gerenciamento de armazenamento de volume do Cinder.

### configMap

Um [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) oferece uma forma de injetar dados de configuração em Pods. Os dados armazenados em um ConfigMap podem ser referenciados em um volume de tipo `configMap` e depois consumidos por aplicações conteinerizadas executadas em um pod.

Ao referenciar um ConfigMap, você informa o nome do ConfigMap no volume. Pode personalizar o caminho utilizado para uma entrada específica no ConfigMap. A seguinte configuração mostra como montar o `log-config` do ConfigMap em um Pod chamado `configmap-pod`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: configmap-pod
spec:
  containers:
    - name: test
      image: busybox:1.28
      command: ['sh', '-c', 'echo "The app is running!" && tail -f /dev/null']
      volumeMounts:
        - name: config-vol
          mountPath: /etc/config
  volumes:
    - name: config-vol
      configMap:
        name: log-config
        items:
          - key: log_level
            path: log_level
```

O ConfigMap `log-config` é montado como um volume e todos os conteúdos armazenados em sua entrada `log_level` são montados no Pod através do caminho `/etc/config/log_level`. Observe que esse caminho é derivado do volume `mountPath`e do `path` configurado com `log_level`.

{{< note >}}

* É preciso criar um [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) antes de usá-lo.
* Um ConfigMap é sempre montado como `readOnly`.

* Um contêiner que utiliza ConfigMap através de um ponto de montagem com a propriedade [`subPath`](#using-subpath) não receberá atualizações deste ConfigMap.

* Os dados de texto são expostos como arquivos utilizando a codificação de caracteres UTF-8. Para outras codificações de caracteres, use `binaryData`. {{< /note >}}

### downwardAPI {#downwardapi}

Um volume `downwardAPI` disponibiliza dados da downward API para as aplicações. Ele monta um diretório e grava os dados solicitados em arquivos de texto sem formatação.

{{< note >}} Um contêiner que utiliza downward API através de um ponto de montagem com a propriedade [`subPath`](#using-subpath) não receberá atualizações desta downward API. {{< /note >}}

Consulte [o exemplo de downward API](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/) para obter mais detalhes.

### emptyDir {#emptydir}

Um volume `emptyDir` é criado pela primeira vez quando um Pod é atribuído a um nó e existe enquanto esse Pod estiver sendo executado nesse nó. Como o nome diz, o volume `emptyDir` está inicialmente vazio. Todos os contêineres no Pod podem ler e gravar os mesmos arquivos no volume `emptyDir`, embora esse volume possa ser montado no mesmo caminho ou em caminhos diferentes em cada contêiner. Quando um Pod é removido de um nó por qualquer motivo, os dados no `emptyDir` são eliminados permanentemente.

{{< note >}} A falha de um contêiner *não* remove um Pod de um nó. Os dados em um volume `emptyDir` são mantidos em caso de falha do contêiner. {{< /note >}}

Alguns usos para um `emptyDir` são:

* espaço temporário, como para uma merge sort baseado em disco
* ponto de verificação de um processamento longo para recuperação de falhas
* manter arquivos que um contêiner gerenciador de conteúdo busca enquanto um contêiner de webserver entrega os dados

Dependendo do seu ambiente, os volumes `emptyDir` são armazenados em qualquer mídia que componha o nó, como disco ou SSD, ou armazenamento de rede. No entanto, se você definir o campo `emptyDir.medium` como `"Memory"`, o Kubernetes monta um tmpfs (sistema de arquivos com suporte de RAM) para você. Embora o tmpfs seja muito rápido, tenha em atenção que, ao contrário dos discos, o tmpfs é limpo na reinicialização do nó e quaisquer arquivos que grave consomem o limite de memória do seu contêiner.

{{< note >}} Se a [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `SizeMemoryBackedVolumes` estiver habilitada, é possível especificar um tamanho para volumes mantidos em memória.  Se nenhum tamanho for especificado, os volumes mantidos em memória são dimensionados para 50% da memória em um host Linux. {{< /note>}}

#### Exemplo de configuração emptyDir

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /cache
      name: cache-volume
  volumes:
  - name: cache-volume
    emptyDir: {}
      sizeLimit: 500Mi
```

### fc (fibre channel) {#fc}

Um tipo de volume `fc` permite que um volume de armazenamento de fibre channel existente seja montado em um Pod. Você pode especificar um ou vários WWNs usando o parâmetro `targetWWNs` em sua configuração de volume. Se forem especificados vários WWNs, o targetWWNs espera que esses WWNs sejam de conexões multipath.

{{< note >}} Para que os hosts Kubernetes possam acessá-los, é necessário configurar o zoneamento FC SAN para alocar e mascarar essas LUNs (volumes) para os WWNs de destino. {{< /note >}}

Consulte [o exemplo de fibre channel](https://github.com/kubernetes/examples/tree/master/staging/volumes/fibre_channel) para obter mais detalhes.

### flocker (descontinuado) {#flocker}

[Flocker](https://github.com/ClusterHQ/flocker) é um gerenciador de volumes de dados de contêineres em cluster de código aberto. O Flocker oferece gerenciamento e orquestração de volumes de dados suportados por uma variedade de backends de armazenamento.

Um volume `flocker` permite que um conjunto de dados Flocker seja montado em um Pod. Se o conjunto de dados ainda não existir no Flocker, ele precisará ser criado primeiro com o CLI do Flocker ou usando a API do Flocker. Se o conjunto de dados já existir, ele será anexado pelo Flocker ao nó que o pod está escalonado. Isto significa que os dados podem ser compartilhados entre os Pods, conforme necessário.

{{< note >}} Antes de poder utilizá-lo, é necessário ter a sua própria instalação do Flocker em execução. {{< /note >}}

Consulte [exemplo do Flocker](https://github.com/kubernetes/examples/tree/master/staging/volumes/flocker) para obter mais detalhes.

### gcePersistentDisk (descontinuado)
{{< feature-state for_k8s_version="v1.17" state="deprecated" >}}

Um volume `gcePersistentDisk` monta um [disco persistente](https://cloud.google.com/compute/docs/disks) (PD) do Google Compute Engine (GCE) no seu Pod. Ao contrário do `emptyDir` que é apagado quando um pod é removido, o conteúdo de um PD é preservado e o volume é simplesmente desmontado. Isto significa que um PD pode ser previamente populado com dados e que os dados podem ser compartilhados entre os Pods.

{{< note >}} Você dever criar um PD utilizando `gcloud`, ou via GCE API ou via UI antes de poder utilizá-lo. {{< /note >}}

Existem algumas restrições ao utilizar um `gcePersistentDisk`:

* Os nós nos quais os Pods estão sendo executados devem ser VMs GCE
* Essas VMs precisam estar no mesmo projeto e zona GCE que o disco persistente

Uma característica do disco persistente GCE é o acesso simultâneo somente leitura a um disco persistente. Um volume `gcePersistentDisk` permite que vários consumidores montem simultaneamente um disco persistente como somente leitura. Isto significa que é possível alimentar previamente um PD com o seu conjunto de dados e, em seguida, disponibilizá-lo em paralelo a quantos Pods necessitar. Infelizmente, os PDs só podem ser montados por um único consumidor no modo de leitura e escrita. Não são permitidos gravadores simultâneos.

O uso de um disco persistente GCE com um Pod controlado por um ReplicaSet falhará, a menos que o PD seja somente leitura ou a contagem de réplica seja 0 ou 1.

#### Criando um disco persistente GCE {#gce-create-persistent-disk}

Antes de poder utilizar um disco persistente GCE com um Pod, é necessário criá-lo.

```shell
gcloud compute disks create --size=500GB --zone=us-central1-a my-data-disk
```

#### Exemplo de configuração de disco persistente GCE

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-pd
      name: test-volume
  volumes:
  - name: test-volume
    # Esse Disco Persistente (PD) GCE já deve existir.
    gcePersistentDisk:
      pdName: my-data-disk
      fsType: ext4
```

#### Discos persistentes regionais

O recurso de [Discos persistentes regionais](https://cloud.google.com/compute/docs/disks/#repds) permite a criação de discos persistentes que estão disponíveis em duas zonas dentro da mesma região. Para usar esse recurso, o volume deve ser provisionado como PersistentVolume; referenciar o volume diretamente a partir de um pod não é uma configuração suportada.

#### Provisionar manualmente um PersistentVolume PD Regional

O provisionamento dinâmico é possível usando [uma StorageClass para GCE PD](/docs/concepts/storage/storage-classes/#gce-pd). Antes de criar um PersistentVolume, você deve criar o disco persistente:

```shell
gcloud compute disks create --size=500GB my-data-disk
  --region us-central1
  --replica-zones us-central1-a,us-central1-b
```

#### Exemplo de configuração de disco persistente regional

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: test-volume
spec:
  capacity:
    storage: 400Gi
  accessModes:
  - ReadWriteOnce
  gcePersistentDisk:
    pdName: my-data-disk
    fsType: ext4
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        # failure-domain.beta.kubernetes.io/zone deve ser usado para versões anteriores à 1.21
        - key: topology.kubernetes.io/zone
          operator: In
          values:
          - us-central1-a
          - us-central1-b
```

#### Migração do CSI GCE

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

Quando o recurso `CSIMigration` para o GCE PD é habilitado, todas as operações de plugin do plugin in-tree existente são redirecionadas para o Driver de Cointainer Storage Interface (CSI) `pd.csi.storage.gke.io`. Para utilizar este recurso, o [Driver CSI GCE PD](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver) deve ser instalado no cluster e os recursos beta `CSIMigration` e `CSIMigrationGCE` devem estar habilitados.

#### Migração de CSI GCE concluída

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

Para desabilitar o carregamento do plugin de armazenamento `gcePersistentDisk` pelo gerenciador de controladores e pelo kubelet, defina a flag `InTreePluginGCEUnregister` como `true`.

### gitRepo (descontinuado) {#gitrepo}

{{< warning >}}O tipo de volume `gitRepo` foi descontinuado. Para provisionar um contêiner com um repositório git , monte um [EmptyDir](#emptydir) em um InitContainer que clone o repositório usando git, depois monte [o EmptyDir](#emptydir) no contêiner do Pod. {{< /warning >}}

Um volume `gitRepo` é um exemplo de um plugin de volume. Este plugin monta um diretório vazio e clona um repositório git neste diretório para que seu Pod utilize.

Aqui está um exemplo de um volume `gitRepo`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: server
spec:
  containers:
  - image: nginx
    name: nginx
    volumeMounts:
    - mountPath: /mypath
      name: git-volume
  volumes:
  - name: git-volume
    gitRepo:
      repository: "git@somewhere:me/my-git-repository.git"
      revision: "22f1d8406d464b0c0874075539c1f2e96c253775"
```

### glusterfs (removido)

O Kubernetes 1.27 não inclui um tipo de volume `glusterfs`.

O driver de armazenamento in-tree GlusterFS foi descontinuado na versão v1.25 do Kubernetes e, em seguida, removido totalmente na versão v1.26.

### hostPath {#hostpath}

{{< warning >}} Os volumes HostPath apresentam muitos riscos de segurança e é uma prática recomendada evitar o uso de HostPaths quando possível. Quando um volume HostPath precisa ser usado, ele deve ser definido com escopo apenas para o arquivo ou diretório necessário e montado como ReadOnly.

Se você restringir o acesso do HostPath a diretórios específicos através da AdmissionPolicy, a propriedade `volumeMounts` DEVE obrigatoriamente usar pontos de montagem `readOnly` para que a política seja eficaz. {{< /warning >}}

Um volume `hostPath` monta um arquivo ou diretório do sistema de arquivos do nó do host em seu Pod. Isto não é algo de que a maioria dos Pods irá precisar, mas oferece uma poderosa alternativa de escape para algumas aplicações.

Por exemplo, alguns usos para um `hostPath` são:

* Executar um contêiner que necessita de acesso aos documentos internos do Docker; utilizar um `hostPath` apontando para `/var/lib/docker`
* Executando o cAdvisor em um contêiner; use um `hostPath` apontando para `/sys`
* Permitir que um Pod especifique se um dado `hostPath` deve existir antes de o Pod ser executado, se deve ser criado e como deve existir

Além da propriedade obrigatória `path` , você pode opcionalmente definir um `type` para um volume `hostPath`.

Os valores suportados para o campo `type` são:

| Valor| Comportamento|
|:----------|:----------|
| | A string vazia (padrão) é para compatibilidade com versões anteriores, o que significa que nenhuma verificação será executada antes de montar o volume hostPath.|
| `DirectoryOrCreate`| Se nada existir no caminho indicado, um diretório vazio será criado lá, conforme necessário, com permissão definida para 0755, tendo o mesmo grupo e propriedade com a Kubelet.|
| `Directory`| Um diretório deve existir no caminho indicado|
| `FileOrCreate`| Se não houver nada no caminho indicado, um arquivo vazio será criado lá, conforme necessário, com permissão definida para 0644, tendo o mesmo grupo e propriedade com Kubelet.|
| `File`| Um arquivo deve existir no caminho indicado|
| `Socket`| Um socket UNIX deve existir no caminho indicado|
| `CharDevice`| Deve existir um dispositivo de caracteres no caminho indicado|
| `BlockDevice`| Deve existir um dispositivo de bloco no caminho indicado|

Tenha cuidado ao utilizar este tipo de volume, porque:

* Os HostPaths podem expor as credenciais privilegiadas do sistema (como para o Kubelet) ou APIs privilegiadas (como o container runtime socket), que podem ser usadas para o explorar vulnerabilidades de escape do contêiner ou para atacar outras partes do cluster.
* Os Pods com configuração idêntica (como criado a partir de um PodTemplate) podem se comportar de forma diferente em nós diferentes devido a arquivos diferentes nos nós
* Os arquivos ou diretórios criados nos hosts subjacentes são graváveis apenas pelo root. Você precisa executar seu processo como root em um [contêiner privilegiado](/docs/tasks/configure-pod-container/security-context/) ou modificar as permissões de arquivo no host para poder gravar em um volume `hostPath`

#### Exemplo de configuração do hostPath

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-pd
      name: test-volume
  volumes:
  - name: test-volume
    hostPath:
      # localização do diretório no host
      path: /data
      # este campo é opcional
      type: Directory
```

{{< caution >}} O modo `FileOrCreate` não cria o diretório onde ficará arquivo. Se o caminho de diretório do arquivo montado não existir, o pod não será iniciado. Para garantir que esse modo funcione, você pode tentar montar diretórios e arquivos separadamente, como mostrado em [configuração `FileOrCreate`](#hostpath-fileorcreate-example). {{< /caution >}}

#### Exemplo de configuração FileOrCreate do hostPath {#hostpath-fileorcreate-example}

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-webserver
spec:
  containers:
  - name: test-webserver
    image: registry.k8s.io/test-webserver:latest
    volumeMounts:
    - mountPath: /var/local/aaa
      name: mydir
    - mountPath: /var/local/aaa/1.txt
      name: myfile
  volumes:
  - name: mydir
    hostPath:
      # Certifique-se de que o diretório foi criado.
      path: /var/local/aaa
      type: DirectoryOrCreate
  - name: myfile
    hostPath:
      path: /var/local/aaa/1.txt
      type: FileOrCreate
```

### iscsi

Um volume `iscsi` permite que um volume iSCSI (SCSI sobre IP) existente seja montado no seu Pod. Ao contrário do `emptyDir` que é apagado quando um Pod é removido, o conteúdo de um volume `iscsi` é preservado e o volume é simplesmente desmontado. Isto significa que um volume iscsi pode ser previamente populado com dados e que os dados podem ser compartilhados entre os Pods.

{{< note >}} Você deve ter seu próprio servidor iSCSI rodando com o volume criado antes de poder utilizá-lo. {{< /note >}}

Uma característica do iSCSI é que ele pode ser montado como somente leitura por vários consumidores simultaneamente. Isto significa que um volume pode ser previamente populado com seu conjunto de dados e, em seguida, ser disponibilizado em paralelo para tantos Pods quanto necessitar. Infelizmente, os volumes iSCSI só podem ser montados por um único consumidor no modo de leitura-escrita. Não são permitidos gravadores simultâneos.

Consulte o [exemplo iSCSI](https://github.com/kubernetes/examples/tree/master/volumes/iscsi) para obter mais detalhes.

### local

Um volume `local` representa um dispositivo de armazenamento local montado, como um disco, partição ou diretório.

Os volumes locais só podem ser usados como um PersistentVolume criado estaticamente. O provisionamento dinâmico não é suportado.

Em comparação com volumes `hostPath`, os volumes `local` são usados de forma durável e portátil, sem escalonamento manual dos Pods para os nós. O sistema está ciente das restrições de nós do volume, observando a afinidade do nó com o PersistentVolume.

No entanto, os volumes `local` estão sujeitos à disponibilidade do nó que o comporta e não são adequados para todas as aplicações. Se um nó não está íntegro, então o volume `local` torna-se inacessível pelo pod. O pod que utiliza este volume não consegue ser executado. Os aplicativos que usam volumes `local` devem ser capazes de tolerar essa disponibilidade reduzida, bem como uma possível perda de dados, dependendo das caraterísticas de durabilidade do disco subjacente.

O exemplo a seguir mostra um PersistentVolume usando um volume `local` e `nodeAffinity`:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: example-pv
spec:
  capacity:
    storage: 100Gi
  volumeMode: Filesystem
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Delete
  storageClassName: local-storage
  local:
    path: /mnt/disks/ssd1
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - example-node
```

É preciso definir a propriedade `nodeAffinity` do PersistentVolume ao utilizar volumes `local`. O escalonador do Kubernetes usa o PersistentVolume `nodeAffinity` para escalonar esses pods para o nó correto.

A propriedade `volumeMode` do PersistentVolume pode ser definida como "Block" (ao invés do valor padrão "Filesystem") para expor o volume local como um dispositivo de bloco bruto.

Ao usar volumes locais, é recomendável criar uma StorageClass com a propriedade `volumeBindingMode` definida como `WaitForFirstConsumer`. Para obter mais detalhes, consulte o exemplo local [StorageClass](/docs/concepts/storage/storage-classes/#local). A postergação da vinculação do volume garante que a decisão de vinculação da PersistentVolumeClaim também será avaliada com quaisquer outras restrições de nós que o Pod possa ter, tais como requisitos de recursos de nós, seletores de nós, afinidade do Pod e anti afinidade do Pod.

Um provisionador estático externo pode ser executado separadamente para uma melhor gestão do ciclo de vida do volume local. Observe que este provisionador ainda não suporta o provisionamento dinâmico. Para um exemplo sobre como executar um provisionador local externo, veja o [manual do usuário do provisionador local do volume](https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner).

{{< note >}} O PersistentVolume local exige que o usuário faça limpeza e remoção manual se o provisionador estático externo não for utilizado para gerenciar o ciclo de vida do volume. {{< /note >}}

### nfs

Um volume `nfs` permite que um compartilhamento NFS (Network File System) existente seja montado em um Pod. Ao contrário do `emptyDir` que é apagado quando um Pod é removido, o conteúdo de um volume `nfs` é preservado e o volume é simplesmente desmontado. Isto significa que um volume NFS pode ser previamente populado com dados e que os dados podem ser compartilhados entre os Pods. O NFS pode ser montado por vários gravadores simultaneamente.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /my-nfs-data
      name: test-volume
  volumes:
  - name: test-volume
    nfs:
      server: my-nfs-server.example.com
      path: /my-nfs-volume
      readOnly: true
```

{{< note >}} Você deve ter seu próprio servidor NFS rodando com o compartilhamento acessível antes de poder utilizá-lo. 

Note também que você não pode especificar opções de montagem NFS em uma especificação de pod. Você pode definir as opções de montagem do lado do servidor ou usar [/etc/nfsmount.conf](https://man7.org/linux/man-pages/man5/nfsmount.conf.5.html). Você também pode montar volumes NFS por meio de PersistentVolumes, que permitem definir opções de montagem.
{{< /note >}}

Consulte o [exemplo NFS](https://github.com/kubernetes/examples/tree/master/staging/volumes/nfs) para obter mais detalhes.

### persistentVolumeClaim {#persistentvolumeclaim}

Um volume `persistentVolumeClaim` é usado para montar um [PersistentVolume](/pt-br/docs/concepts/storage/persistent-volumes/) em um Pod. PersistentVolumeClaims são uma forma de os usuários "solicitarem" armazenamento durável (como um GCE PersistentDisk ou um volume iSCSI) sem conhecerem os detalhes do ambiente de nuvem em particular.

Consulte as informações sobre [PersistentVolumes](/pt-br/docs/concepts/storage/persistent-volumes/) para obter mais detalhes.

### portworxVolume (descontinuado) {#portworxvolume}

Um `portworxVolume` é uma camada de armazenamento em bloco extensível que funciona hiperconvergente com Kubernetes. O [Portworx](https://portworx.com/use-case/kubernetes-storage/) tira as impressões digitais de um armazenamento em um servidor, organiza com base nas capacidades e agrega capacidade em múltiplos servidores. Portworx funciona em máquinas virtuais ou em nós Linux bare-metal.

Um `portworxVolume` pode ser criado dinamicamente através do Kubernetes ou também pode ser previamente provisionado e referenciado dentro de um Pod. Aqui está um exemplo de um Pod referenciando um volume Portworx pré-provisionado:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-portworx-volume-pod
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /mnt
      name: pxvol
  volumes:
  - name: pxvol
    # Este volume Portworx já deve existir.
    portworxVolume:
      volumeID: "pxvol"
      fsType: "<fs-type>"
```

{{< note >}} Certifique-se de ter um PortworxVolume com o nome `pxvol` antes de usá-lo no Pod. {{< /note >}}

Para obter mais detalhes, consulte os exemplos de [volume Portworx](https://github.com/kubernetes/examples/tree/master/staging/volumes/portworx/README.md) .

### projetado

Um volume projetado mapeia várias fontes de volume existentes dentro do mesmo diretório. Para obter mais detalhes, consulte [Volumes projetados](/docs/concepts/storage/projected-volumes/).

### quobyte (descontinuado) {#quobyte}

Um Volume `quobyte` permite que um volume [Quobyte](https://www.quobyte.com) existente seja montado no seu Pod.

{{< note >}} Você deve ter seu próprio Quobyte configurado e funcionando com os volumes criados antes de poder utilizá-lo. {{< /note >}}

Quobyte oferece suporte para o {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}}. CSI é o plugin recomendado para usar volumes Quobyte dentro de Kubernetes. O projeto GitHub da Quobyte tem [instruções](https://github.com/quobyte/quobyte-csi#quobyte-csi) para implantar o Quobyte usando o CSI, acompanhado de exemplos.

### rbd

Um volume `rbd` permite que um volume [Rados Block Device](https://docs.ceph.com/en/latest/rbd/) (RBD) seja montado em seu Pod. Ao contrário do `emptyDir` que é apagado quando um pod é removido, o conteúdo de um volume `rbd` é preservado e o volume é desmontado. Isto significa que um volume RBD pode ser previamente populado com dados e que os dados podem ser compartilhados entre os Pods.

{{< note >}} Você deve ter uma instalação Ceph em funcionamento antes de poder usar o RBD. {{< /note >}}

Uma caraterística do RBD é que ele pode ser montado como somente leitura por vários consumidores simultaneamente. Isto significa que um volume pode ser previamente populado com seu conjunto de dados e, em seguida, ser disponibilizado em paralelo para tantos pods quanto necessitar. Infelizmente, os volumes RBD só podem ser montados por um único consumidor no modo de leitura-escrita. Não são permitidos gravadores simultâneos.

Consulte o [exemplo RBD](https://github.com/kubernetes/examples/tree/master/volumes/rbd) para obter mais detalhes.

#### Migração de CSI RBD {#rbd-csi-migration}

{{< feature-state for_k8s_version="v1.23" state="alpha" >}}

Quando o recurso `CSIMigration` do `RBD` está ativado, redireciona todas as operações do plugin in-tree existente para o driver {{< glossary_tooltip text="CSI" term_id="csi" >}} `rbd.csi.ceph.com`. Para utilizar este recurso, o [driver Ceph CSI](https://github.com/ceph/ceph-csi) deve estar instalado no cluster e as [feature gates](/docs/reference/command-line-tools-reference/feature-gates/) `CSIMigration` e `csiMigrationRBD` devem estar habilitadas.

{{< note >}}

Como operador do cluster Kubernetes que administra o armazenamento, aqui estão os pré-requisitos que você deve atender antes de tentar a migração para o driver CSI RBD:

* Você deve instalar o driver Ceph CSI (`rbd.csi.ceph.com`), v3.5.0 ou superior, no cluster Kubernetes.
* Considerando que o campo `clusterID` é um parâmetro necessário para o driver CSI e sua operação , mas o campo in-tree StorageClass tem o parâmetro obrigatório `monitors`, um administrador de armazenamento Kubernetes precisa criar um clusterID baseado no hash dos monitores (ex.:`#echo -n '<monitors_string>' | md5sum`) no mapa de configuração do CSI e manter os monitores sob esta configuração de clusterID.
* Além disso, se o valor de `adminId` no Storageclass in-tree for diferente de `admin`, o `adminSecretName` mencionado no Storageclass in-tree tem que ser corrigido com o valor base64 do valor do parâmetro `adminId`, caso contrário esta etapa pode ser ignorada. {{< /note >}}

### secret

Um volume `secret` é usado para passar informações sensíveis, tais como senhas, para Pods. Você pode armazenar segredos na API Kubernetes e montá-los como arquivos para serem usados por pods sem necessidade de vinculação direta ao Kubernetes. Volumes `secret` são mantidos pelo tmpfs (um sistema de arquivos com baseado em memória RAM) para que nunca sejam gravados em armazenamento não volátil.

{{< note >}}
* Você deve criar um Secret na API Kubernetes antes de poder utilizá-lo.
* Um secret é sempre montado como `readOnly`.
* Um contêiner que utiliza um Secret como ponto de montagem para a propriedade [`subPath`](#using-subpath) não receberá atualizações deste Secret. {{< /note >}}

Para obter mais detalhes, consulte [Configurando Secrets](/pt-br/docs/concepts/configuration/secret/).

### storageOS (descontinuado) {#storageos}

Um volume `storageos` permite que um volume [StorageOS](https://www.storageos.com) existente seja montado em seu Pod.

O StorageOS funciona como um contêiner dentro de seu ambiente Kubernetes, tornando o armazenamento local ou anexado acessível a partir de qualquer nó dentro do cluster Kubernetes. Os dados podem ser replicados para a proteção contra falhas do nó. O provisionamento e a compressão podem melhorar a utilização e reduzir os custos.

Em sua essência, o StorageOS fornece armazenamento em bloco para containers, acessível a partir de um sistema de arquivo.

O Conteiner StorageOS requer Linux de 64 bits e não possui dependências adicionais. Uma licença para desenvolvedores está disponível gratuitamente.

{{< caution >}} Você deve executar o container StorageOS em cada nó que deseja acessar os volumes do StorageOS ou que contribuirá com a capacidade de armazenamento para o pool. Para obter instruções de instalação, consulte a [documentação do StorageOS](https://docs.storageos.com). {{< /caution >}}

O exemplo a seguir é uma configuração do Pod com StorageOS:

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    name: redis
    role: master
  name: test-storageos-redis
spec:
  containers:
    - name: master
      image: kubernetes/redis:v1
      env:
        - name: MASTER
          value: "true"
      ports:
        - containerPort: 6379
      volumeMounts:
        - mountPath: /redis-master-data
          name: redis-data
  volumes:
    - name: redis-data
      storageos:
        # O volume `redis-vol01` já deve existir dentro do StorageOS no namespace `default`.
        volumeName: redis-vol01
        fsType: ext4
```

Para obter mais informações sobre StorageOS, provisionamento dinâmico e PersistentVolumeClaims, consulte os [exemplos do StorageOS](https://github.com/kubernetes/examples/blob/master/volumes/storageos).

### vsphereVolume (descontinuado) {#vspherevolume}

{{< note >}}Recomendamos usar o driver out-of-tree do vSphere CSI.{{< /note >}}

Um `vsphereVolume` é usado para montar um volume VMDK do vSphere em seu Pod. O conteúdo de um volume é preservado quando é desmontado. Ele suporta sistemas de armazenamento de dados tanto do tipo VMFS quanto do tipo VSAN.

Para obter mais informações, consulte os exemplos [vSphere volume](https://github.com/kubernetes/examples/tree/master/staging/volumes/vsphere)

#### Criar um volume VMDK (descontinuado) {#creating-vmdk-volume}

Escolha um dos seguintes métodos para criar um VMDK.

{{< tabs name="tabs_volumes" >}}
{{% tab name="Criar usando vmkfstools" %}} 
Primeiro acesse o ESX via ssh, depois use o seguinte comando para criar um VMDK:

```shell
vmkfstools -c 2G /vmfs/volumes/DatastoreName/volumes/myDisk.vmdk
```

{{% /tab %}}
{{% tab name="Criar usando vmware-vdiskmanager" %}}
Utilize o seguinte comando para criar um VMDK:

```shell
vmware-vdiskmanager -c -t 0 -s 40GB -a lsilogic myDisk.vmdk
```

{{% /tab %}}

{{< /tabs >}}

#### Exemplo de configuração do VMDK no vSphere {#vsphere-vmdk-configuration}

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-vmdk
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-vmdk
      name: test-volume
  volumes:
  - name: test-volume
    # This VMDK volume must already exist.
    vsphereVolume:
      volumePath: "[DatastoreName] volumes/myDisk"
      fsType: ext4
```

Para obter mais informações, consulte os exemplos de [volume do vSphere](https://github.com/kubernetes/examples/tree/master/staging/volumes/vsphere) .

#### Migração de CSI vSphere {#vsphere-csi-migration}

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

No Kubernetes 1.27, todas as operações para o tipo `vsphereVolume` in-tree são redirecionadas para o driver CSI `csi.vsphere.vmware.com`.

O driver [vSphere CSI](https://github.com/kubernetes-sigs/vsphere-csi-driver) deve ser instalado no cluster. Você pode encontrar conteúdos adicionais sobre como migrar o `vsphereVolume` in-tree na página de documentação do VMware [Migrating In-Tree vSphere Volumes to vSphere Container Storage plug-in](https://docs.vmware.com/en/VMware-vSphere-Container-Storage-Plug-in/2.0/vmware-vsphere-csp-getting-started/GUID-968D421F-D464-4E22-8127-6CB9FF54423F.html). Se o vSphere CSI Driver não estiver instalado, as operações de volume não poderão ser executadas no PV criado com o tipo `vsphereVolume` in-tree.

Você deve executar o vSphere 7.0u2 ou posterior para migrar para o driver vSphere CSI.

Se você estiver executando uma versão do Kubernetes diferente da v1.27, consulte a documentação dessa versão do Kubernetes.

{{< note >}} Os seguintes parâmetros da StorageClass do plugin integrado `vsphereVolume` não são suportados pelo driver CSI do vSphere:

* `diskformat`
* `hostfailurestotolerate`
* `forceprovisioning`
* `cachereservation`
* `diskstripes`
* `objectspacereservation`
* `iopslimit`

Os volumes existentes criados usando esses parâmetros serão migrados para o driver CSI do vSphere, mas novos volumes criados pelo driver de CSI do vSphere não estarão respeitando esses parâmetros. {{< /note >}}

#### Migração do CSI do vSphere foi concluída {#vsphere-csi-migration-complete}

{{< feature-state for_k8s_version="v1.19" state="beta" >}}

Para desativar o carregamento do plugin de armazenamento `vsphereVolume` pelo gerenciador de controladores e pelo kubelet, defina a flag `InTreePluginvSphereUnregister` como `true`. Você precisa instalar o driver `csi.vsphere.vmware.com` {{< glossary_tooltip text="CSI" term_id="csi" >}} em todos os nós de processamento.

#### Migração de driver CSI do Portworx

{{< feature-state for_k8s_version="v1.25" state="beta" >}}

O recurso `CSIMigration` para Portworx foi adicionado, mas desativado por padrão no Kubernetes 1.23 visto que está no estado alfa. Ele redireciona todas as operações de plugin do tipo in-tree para o Driver de Cointainer Storage Interface (CSI) `pxd.portworx.com`. [O driver CSI Portworx](https://docs.portworx.com/portworx-enterprise/operations/operate-kubernetes/storage-operations/csi) deve ser instalado no cluster. Para ativar o recurso, defina `CSIMigrationPortworx=true` no kube-controller-manager e no kubelet.

## Utilizando subPath {#using-subpath}

Às vezes, é útil compartilhar um volume para múltiplos usos em um único pod. A propriedade `volumeMounts[*].subPath` especifica um sub caminho dentro do volume referenciado em vez de sua raiz.

O exemplo a seguir mostra como configurar um Pod com um ambiente LAMP (Linux, Apache, MySQL e PHP) usando um único volume compartilhado. Esta exemplo de configuração `subPath` não é recomendada para uso em produção.

O código e os ativos da aplicação PHP mapeiam para a pasta do volume `html` e o banco de dados MySQL é armazenado na pasta do volume `mysql` . Por exemplo:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-lamp-site
spec:
    containers:
    - name: mysql
      image: mysql
      env:
      - name: MYSQL_ROOT_PASSWORD
        value: "rootpasswd"
      volumeMounts:
      - mountPath: /var/lib/mysql
        name: site-data
        subPath: mysql
    - name: php
      image: php:7.0-apache
      volumeMounts:
      - mountPath: /var/www/html
        name: site-data
        subPath: html
    volumes:
    - name: site-data
      persistentVolumeClaim:
        claimName: my-lamp-site-data
```

### Usando subPath com variáveis de ambiente expandidas {#using-subpath-expanded-environment}

{{< feature-state for_k8s_version="v1.17" state="stable" >}}

Use o campo `subPathExpr` para construir nomes de diretório `subPath` a partir de variáveis de ambiente da downward API. As propriedades `subPath` e `subPathExpr` são mutuamente exclusivas.

Neste exemplo, um `Pod` usa `subPathExpr` para criar um diretório `pod1` dentro do volume `hostPath` `/var/log/pods`. O volume `hostPath`recebe o nome `Pod` do `downwardAPI`. O diretório `/var/log/pods/pod1` do host é montado em `/logs` no contêiner.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod1
spec:
  containers:
  - name: container1
    env:
    - name: POD_NAME
      valueFrom:
        fieldRef:
          apiVersion: v1
          fieldPath: metadata.name
    image: busybox:1.28
    command: [ "sh", "-c", "while [ true ]; do echo 'Hello'; sleep 10; done | tee -a /logs/hello.txt" ]
    volumeMounts:
    - name: workdir1
      mountPath: /logs
      # A expansão de variáveis usa parênteses (não chaves).
      subPathExpr: $(POD_NAME)
  restartPolicy: Never
  volumes:
  - name: workdir1
    hostPath:
      path: /var/log/pods
```

## Recursos

A mídia de armazenamento(como Disco ou SSD) de um volume `emptyDir` é determinada por meio do sistema de arquivos que mantém o diretório raiz do kubelet (normalmente `/var/lib/kubelet`). Não há limite para quanto espaço um volume `emptyDir` ou `hostPath` podem consumir, e não há isolamento entre contêineres ou entre pods.

Para saber mais sobre como solicitar espaço usando uma especificação de recursos, consulte [como gerenciar recursos](/pt-br/docs/concepts/configuration/manage-resources-containers/).

## Plugins de volume out-of-tree

Os plugins de volume out-of-tree incluem o {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} (CSI) e também o FlexVolume (que foi descontinuado). Esses plugins permitem que os fornecedores de armazenamento criem plugins de armazenamento personalizados sem adicionar seu código-fonte do plugin ao repositório Kubernetes.

Anteriormente, todos os plugins de volume eram "in-tree". Os plugins "in-tree" eram construídos, vinculados, compilados e distribuídos com o código principal dos binários do Kubernetes. Isto significava que a adição de um novo sistema de armazenamento ao Kubernetes (um plugin de volume) exigia uma validação do código no repositório central de código Kubernetes.

Tanto o CSI quanto o FlexVolume permitem que os plugins de volume sejam desenvolvidos independentemente da base de código Kubernetes e implantados (instalados) nos clusters Kubernetes como extensões.

Para fornecedores de armazenamento que procuram criar um plugin de volume out-of-tree, consulte as [Perguntas mais frequentes sobre plugins de volume](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md).

### csi

O [Cointainer Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md) (CSI) define uma interface padrão para sistemas de orquestração de contêineres (como Kubernetes) para expor sistemas de armazenamento arbitrários a suas cargas de trabalho de contêiner.

Leia a [proposta de design CSI](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/container-storage-interface.md) para obter mais informações.

{{< note >}} O suporte para as versões 0.2 e 0.3 da especificação CSI foi descontinuado no Kubernetes v1.13 e será removido em uma versão futura. {{< /note >}}

{{< note >}} Os controladores CSI podem não ser compatíveis em todas as versões do Kubernetes. Consulte a documentação específica do driver CSI para ver as etapas de implantação suportadas para cada versão do Kubernetes e uma matriz de compatibilidade. {{< /note >}}

Uma vez que um driver de volume compatível com CSI seja implantado em um cluster Kubernetes, os usuários podem usar o tipo de volume `csi` para anexar ou montar os volumes expostos pelo driver CSI.

Um volume `csi` pode ser utilizado em um Pod de três formas diferentes:

* Através de uma referência a [PersistentVolumeClaim](#persistentvolumeclaim)
* com um [volume efêmero genérico](/docs/concepts/storage/ephemeral-volumes/#generic-ephemeral-volumes) (recurso alfa)
* com [volume efêmero de CSI](/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes) se o driver suportar esse (recurso beta)

Os seguintes campos estão disponíveis para administradores de armazenamento configurarem um volume persistente de CSI:

* `driver`: Um valor do tipo string que especifica o nome do driver de volume a ser usado. Este valor deve corresponder ao valor retornado no `GetPluginInfoResponse` pelo driver CSI, conforme definido na [especificação CSI](https://github.com/container-storage-interface/spec/blob/master/spec.md#getplugininfo). Ele é usado pelo Kubernetes para identificar qual driver CSI chamar, e pelos componentes do driver CSI para identificar quais objetos PV pertencem ao driver CSI.
* `volumeHandle`: Um valor do tipo string que identifica exclusivamente o volume. Este valor deve corresponder ao valor retornado no campo `volume.id` em `CreateVolumeResponse` pelo driver CSI, conforme definido na [especificação CSI](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume). O valor é passado como `volume_id` em todas as chamadas para o driver de volume CSI quando se faz referência ao volume.
* `readOnly`: Um valor booleano opcional que indica se o volume deve ser "ControllerPublished" (anexado) como somente leitura. O valor padrão é false. Este valor é passado para o driver CSI através do campo `readonly` em `ControllerPublishVolumeRequest`.
* `fsType`: Se o `VolumeMode` do PV for `Filesystem` então este campo pode ser usado para especificar o sistema de arquivos que deve ser usado para montar o volume. Se o volume não tiver sido formatado e a formatação for suportada, este valor será utilizado para formatar o volume. Este valor é passado para o driver CSI através do campo `VolumeCapability` nas propriedades `ControllerPublishVolumeRequest`, `NodeStageVolumeRequest` e `NodePublishVolumeRequest`.
* `volumeAttributes`: Um mapa de valores do tipo string para string que especifica propriedades estáticas de um volume. Este mapa deve corresponder ao mapa retornado no campo `volume.attributes` do `CreateVolumeResponse` pelo driver CSI, conforme definido na [especificação CSI](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume). O mapa é passado para o driver CSI através do campo `volume_context` nas propriedades `ControllerPublishVolumeRequest`, `NodeStageVolumeRequest`, e `NodePublishVolumeRequest`.
* `controllerPublishSecretRef`: Uma referência ao objeto Secret que contém informações confidenciais para passar ao driver CSI para completar as chamadas CSI `ControllerPublishVolume` e `ControllerUnpublishVolume`. Este campo é opcional e pode estar vazio se não for necessário nenhum segredo. Se o Secret contiver mais de um segredo, todos os segredos serão passados.
* `nodeStageSecretRef`: Uma referência ao objeto Secret que contém informações confidenciais para passar ao driver de CSI para completar a chamada de CSI do `NodeStageVolume`. Este campo é opcional e pode estar vazio se não for necessário nenhum segredo. Se o Secret contiver mais de um segredo, todos os segredos serão passados.
* `nodePublishSecretRef`: Uma referência ao objeto Secret que contém informações confidenciais para passar ao driver de CSI para completar a chamada de CSI do `NodePublishVolume`. Este campo é opcional e pode estar vazio se não for necessário nenhum segredo. Se o objeto Secret contiver mais de um segredo, todos os segredos serão passados.

#### Suporte CSI para volume de bloco bruto

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

Os fornecedores com drivers CSI externos podem implementar o suporte de volume de blocos brutos nas cargas de trabalho Kubernetes.

Você pode configurar o [PersistentVolume/PersistentVolumeClaim com suporte de volume de bloco bruto](/pt-br/docs/concepts/storage/persistent-volumes/#suporte-a-volume-de-bloco-bruto) , como habitualmente, sem quaisquer alterações específicas de CSI.

#### Volumes efêmeros de CSI

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

É possível configurar diretamente volumes CSI dentro da especificação do Pod. Os volumes especificados desta forma são efêmeros e não persistem nas reinicializações do pod. Consulte [Volumes efêmeros](/docs/concepts/storage/ephemeral-volumes/#csi-ephemeral-volumes) para obter mais informações.

Para obter mais informações sobre como desenvolver um driver CSI, consulte a [documentação kubernetes-csi](https://kubernetes-csi.github.io/docs/)

#### Migrando para drivers CSI a partir de plugins in-tree

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

Quando o recurso `CSIMigration` está habilitado, direciona operações relacionadas a plugins in-tree existentes para plugins CSI correspondentes (que devem ser instalados e configurados). Como resultado, os operadores não precisam fazer nenhuma alteração de configuração para Storage Classes, PersistentVolumes ou PersistentVolumeClaims existentes (referindo-se aos plugins in-tree) quando a transição para um driver CSI que substitui um plugin in-tree.

As operações e características que são suportadas incluem: provisionamento/exclusão, anexação/remoção, montargem/desmontagem e redimensionamento de volumes.

Plugins in-tree que suportam `CSIMigration` e têm um driver CSI correspondente implementado são listados [em tipos de volumes](#volume-types).
Os seguintes plug-ins in-tree suportam armazenamento persistente em nós do Windows:

* [`awsElasticBlockStore`](#awselasticblockstore)
* [`azureDisk`](#azuredisk)
* [`azureFile`](#azurefile)
* [`gcePersistentDisk`](#gcepersistentdisk)
* [`vsphereVolume`](#vspherevolume)

### flexVolume (descontinuado)

{{< feature-state for_k8s_version="v1.23" state="deprecated" >}}

O FlexVolume é uma interface de plugin out-of-tree que usa um modelo baseado em execução para fazer interface com drivers de armazenamento. Os binários do driver FlexVolume devem ser instalados em um caminho de plugin de volume predefinido em cada nó e, em alguns casos, também nos nós da camada de gerenciamento.

Os Pods interagem com os drivers do FlexVolume através do plugin de volume in-tree `flexVolume`. Para obter mais detalhes, consulte o documento [README](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md#readme) do FlexVolume.

{{< note >}} O FlexVolume foi descontinuado. Usar um driver CSI out-of-tree é a maneira recomendada de integrar o armazenamento externo com Kubernetes.

Os mantenedores do driver FlexVolume devem implementar um driver CSI e ajudar a migrar usuários de drivers FlexVolume para CSI. Os usuários do FlexVolume devem mover suas cargas de trabalho para usar o driver CSI equivalente. {{< /note >}}

## Propagação de montagem

A propagação de montagem permite compartilhar volumes montados por um contêiner para outros contêineres no mesmo pod, ou mesmo para outros pods no mesmo nó.

A propagação de montagem de um volume é controlada pelo campo `mountPropagation` na propriedade `containers[*].volumeMounts`. Os seus valores são:

* `None` - Este volume de montagem não receberá do host nenhuma montagem posterior que seja montada para este volume ou qualquer um de seus subdiretórios. De forma semelhante, nenhum ponto de montagem criado pelo contêiner será visível no host. Este é o modo padrão.
  
  Este modo é igual à propagação de montagem `private` conforme descrito na [documentação do kernel Linux](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)

* `HostToContainer` - Este volume de montagem receberá todas as montagens posteriores que forem montadas para este volume ou qualquer um de seus subdiretórios.
  
  Em outras palavras, se o host montar qualquer coisa dentro do volume de montagem, o container o visualizará montado ali.
  
  Da mesma forma, se qualquer Pod com propagação de montagem `Bidirectional` para o mesmo volume montar qualquer coisa lá, o contêiner com propagação de montagem `HostToContainer` o reconhecerá.
  
  Este modo é igual à propagação de montagem `rslave` conforme descrito na [documentação do kernel Linux](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)

* `Bidirectional` - Esta montagem de volume se comporta da mesma forma que a montagem de volume `HostToContainer`. Além disso, todas as montagens de volume criadas pelo contêiner serão propagadas de volta ao host e a todos os contêineres de todas os pods que utilizam o mesmo volume.
  
  Um caso de uso típico para este modo é um Pod com um driver FlexVolume ou CSI ou um Pod que precisa montar algo no host utilizando um volume `hostPath`.
  
  Este modo é igual à propagação de montagem `rshared` conforme descrito na [documentação do kernel Linux](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)
  
  {{< warning >}} A propagação de montagem `Bidirectional` pode ser perigosa. Ela pode danificar o sistema operacional do host e, portanto, ela só é permitida em contêineres privilegiados. A familiaridade com o comportamento do kernel Linux é fortemente recomendada. Além disso, quaisquer montagens de volume criadas por contêineres em pods devem ser destruídas ( desmontadas) pelos contêineres ao final. {{< /warning >}}

### Configuração

Antes que a propagação da montagem possa funcionar corretamente em algumas distribuições (CoreOS, RedHat/Centos, Ubuntu), o compartilhamento de montagem deve ser configurado corretamente no Docker como mostrado abaixo.

Edite seu arquivo de serviços `systemd` do Docker. Configure a propriedade `MountFlags` da seguinte forma:

```shell
MountFlags=shared
```

Ou, se a propriedade `MountFlags=slave`existir, remova-a. Em seguida, reinicie o daemon Docker:

```shell
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## {{% heading "whatsnext" %}}

Siga um exemplo de [implantação do WordPress e MySQL com volumes persistentes](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/).
