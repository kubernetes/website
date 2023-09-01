---
title: Configurando um Pod Para Usar um Volume Persistente Para armazenamento
content_type: task
weight: 60
---

<!-- overview -->

Esta página mostra como configurar um Pod para usar um 
{{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}
para armazenamento.
Aqui está o resumo do processo:

1. Você, como administrador do cluster, faz a criação de um Volume Persistente suportado por armazenamento físico. Você não associa o volume a nenhum Pod.

1. Você, agora assumindo o papel de desenvolvedor/usuário do cluster, faz a criação 
de um PersistentVolumeClaim que é automaticamente vinculado ao Volume Persistente adequado.

1. Você cria um Pod que usa o PersistentVolumeClaim acima para armazenamento.



## {{% heading "prerequisites" %}}


* Você precisa ter um cluster Kubernetes que tenha apenas um nó, e a ferramenta de linha de comando
{{< glossary_tooltip text="kubectl" term_id="kubectl" >}} configurada para se comunicar com seu cluster. Se você
ainda não tem um cluster de um único nó, você pode criar um usando o
[Minikube](https://minikube.sigs.k8s.io/docs/).

* Familiarize-se com o material em
[Volumes persistentes](/pt-br/docs/concepts/storage/persistent-volumes/).

<!-- steps -->

## Criando um arquivo index.html no seu nó
Abra um shell no único nó do seu cluster. A maneira de abrir um shell vai depender de como 
você inicializou seu cluster. Por exemplo, se você estiver usando o Minikube, 
você pode abrir um shell para o seu nó digitando `minikube ssh`.

No seu shell desse nó, crie um diretótio `/mnt/data`:

```shell
# Assumindo que o seu nó use "sudo" para executar comandos 
# como superusuário
sudo mkdir /mnt/data
```

content/pt-br/docs/tasks/configure-pod-container/configure-service-account.md
No diretório `/mnt/data`, crie o arquivo `index.html`:

```shell
# Novamente assumindo que seu nó use "sudo" para executar comandos
# como superusuário
sudo sh -c "echo 'Hello from Kubernetes storage' > /mnt/data/index.html"
```

{{< note >}}
Se o seu nó usa uma ferramenta para acesso como superusuário que não `sudo`, você pode
geralmente fazer isso funcionar substituindo `sudo` pelo nome da outra ferramenta.
{{< /note >}}

Teste se o arquivo `index.html` existe:

```shell
cat /mnt/data/index.html
```

A saída deve ser:
```
Hello from Kubernetes storage
```

Você agora pode fechar o shell do seu nó.

## Crie um Volume Persistente

Neste exercício, você cria um Volume Persistente *hostPath*. O Kubernetes suporta
`hostPath` para desenvolvimento e teste em um cluster com apenas um nó. Um Volume Persistente 
`hostPath` usa um arquivo ou diretório no nó, para emular um armazenamento conectado pela rede.

Em um cluster de produção, você não usaria `hostPath`. Em vez disso um administrador 
de cluster provisionaria um recurso de rede, como um disco persistente do 
Google Compute Engine, um NFS compartilhado, ou um volume do 
Amazon Elastic Block Store. Administradores podem também usar [classes de armazenamento](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#storageclass-v1-storage)
para incializar [provisionamento dinâmico](https://kubernetes.io/blog/2016/10/dynamic-provisioning-and-storage-in-kubernetes).

Aqui está o arquivo de configuração para o Volume Persistente `hostPath`:

{{% codenew file="pods/storage/pv-volume.yaml" %}}

O arquivo de configuração especifica que o volume está no diretório `/mnt/data` do nó do cluster. 
A configuração também especifica um tamanho de 10 gibibytes e um modo de acesso 
`ReadWriteOnce`, o que significa que o volume pode ser montado como leitura-escrita 
pelo único nó. Define o [nome da classe de armazenamento](/pt-br/docs/concepts/storage/persistent-volumes/#classe)
`manual` para o Volume Persistente, que será usado para vincular requisições 
`PersistentVolumeClaim` à esse Volume Persistente.

Crie o Volume Persistente:

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-volume.yaml
```

Veja informações do Volume Persistente:

```shell
kubectl get pv task-pv-volume
```

A saída mostra que o Volume Persistente tem um `STATUS` de `Available`. Isto
significa que ainda não foi vinculado a um `PersistentVolumeClaim`.

    NAME             CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS      CLAIM     STORAGECLASS   REASON    AGE
    task-pv-volume   10Gi       RWO           Retain          Available             manual                   4s

## Crie um `PersistentVolumeClaim`

O próximo passo é criar um `PersistentVolumeClaim`. Pods usam `PersistentVolumeClaims` 
para requisitar armazenamento físico. Neste exercício, você vai criar 
um `PersistentVolumeClaim` que requisita um volume com pelo menos três 
gibibytes, com acesso de leitura-escrita para pelo menos um nó.

Aqui está o arquivo de configuração para o`PersistentVolumeClaim`:

{{% codenew file="pods/storage/pv-claim.yaml" %}}

Crie o `PersistentVolumeClaim`:

    kubectl apply -f https://k8s.io/examples/pods/storage/pv-claim.yaml

Após criar o `PersistentVolumeClaim`, o Kubernetes `control plane` procura por um 
Volume Persistente que satisfaça os requerimentos reivindicados. Se o `control plane` 
encontrar um Volume Persistente adequado, com a mesma classe de armazenamento, 
ele liga o volume requisitado.

Olhe novamente o Volume Persistente:

```shell
kubectl get pv task-pv-volume
```

Agora a saída mostra um `STATUS` de `Bound`.

    NAME             CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS    CLAIM                   STORAGECLASS   REASON    AGE
    task-pv-volume   10Gi       RWO           Retain          Bound     default/task-pv-claim   manual                   2m

Olhe para o `PersistentVolumeClaim`:

```shell
kubectl get pvc task-pv-claim
```

A saída mostra que o`PersistentVolumeClaim` está vinculado ao seu Volume Persistente,
`task-pv-volume`.

    NAME            STATUS    VOLUME           CAPACITY   ACCESSMODES   STORAGECLASS   AGE
    task-pv-claim   Bound     task-pv-volume   10Gi       RWO           manual         30s

## Crie um Pod

O próximo passo é criar um Pod que usa o seu `PersistentVolumeClaim` como um volume.

Aqui está o arquivo de configuração para o Pod:

{{% codenew file="pods/storage/pv-pod.yaml" %}}

Note que o arquivo de configuração do Pod especifica um `PersistentVolumeClaim`, mas não 
especifica um Volume Persistente. Do ponto de vista do Pod, a reivindicação é de um volume.

Crie o Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-pod.yaml
```

Verifique se o contêiner no Pod está executando;

```shell
kubectl get pod task-pv-pod
```

Abra o shell do contêiner, executando no seu Pod:

```shell
kubectl exec -it task-pv-pod -- /bin/bash
```

No seu shell, verifique se o nginx está servindo o arquivo `index.html` do volume 
do `hostPath`:

```shell
# Certifique-se de executar esses 3 comandos dentro do shell, na raiz que vem da
# execução "kubectl exec" do passo anterior
apt update
apt install curl
curl http://localhost/
```

A saída mostra o texto que você escreveu no arquivo `index.html` no volume do
`hostPath`:

    Hello from Kubernetes storage


Se você vir essa mensagem, configurou com sucesso um pod para
usar o armazenamento de um `PersistentVolumeClaim`.

## Limpeza

Exclua o Pod, o `PersistentVolumeClaim` e o Volume Persistente:

```shell
kubectl delete pod task-pv-pod
kubectl delete pvc task-pv-claim
kubectl delete pv task-pv-volume
```

Se você ainda não tem um shell aberto no nó em seu cluster,
Abra um novo shell da mesma maneira que você fez antes.
No shell do seu nó, remova o arquivo e o diretório que você criou:

```shell
# Pressupondo que seu nó usa "sudo" para executar comandos
# como superusuário
sudo rm /mnt/data/index.html
sudo rmdir /mnt/data
```

Você pode agora fechar o shell do seu nó.

## Montando o mesmo Volume Persistente em dois lugares

{{% codenew file="pods/storage/pv-duplicate.yaml" %}}

Você pode realizar a montagem de 2 volumes no seu contêiner nginx:

`/usr/share/nginx/html` para o website estático
`/etc/nginx/nginx.conf` para a configuração padrão

<!-- discussion -->

## Controle de accesso

Armazenamento configurado com um `group ID` (GID) possibilita a escrita somente pelos 
Pods usando a mesma GID. GIDs incompatíveis ou perdidos causam erros de negação 
de permissão. Para reduzir a necessidade de coordenação de usuários, um administrador 
pode anotar um Volume Persistente com uma GID. Então a GID é automaticamente 
adicionada a qualquer Pod que use um Volume Persistente.

Use a anotação `pv.beta.kubernetes.io/gid` como a seguir:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv1
  annotations:
    pv.beta.kubernetes.io/gid: "1234"
```
Quando um Pod consome um Volume Persistente que tem uma anotação GID, o GID anotado 
é aplicado à todos os contêiners no Pod, da mesma forma que as GIDs especificadas no
contexto de segurança em que o Pod está. Cada GID, se é originário de uma anotação 
de Volume Persistente ou da especificação do Pod, 
é aplicada ao primeiro processo executando em cada contêiner.

{{< note >}}
Quando um Pod consome um Volume Persistente, os GIDs associados ao Volume Persistente 
não estiverem presentes no próprio recurso do Pod.
{{< /note >}}




## {{% heading "whatsnext" %}}


* Aprenda mais sobre [Volumes Persistentes](/docs/concepts/storage/persistent-volumes/).
* Leia o [Documento de design de armazenamento persistente](https://git.k8s.io/design-proposals-archive/storage/persistent-storage.md).

### Referência

* [Volume Persistente](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolume-v1-core)
* [`PersistentVolumeSpec`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumespec-v1-core)
* [`PersistentVolumeClaim`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaim-v1-core)
* [`PersistentVolumeClaimSpec`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaimspec-v1-core)

