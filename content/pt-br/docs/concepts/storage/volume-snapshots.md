---
title: Volume Snapshots
content_type: concept
weight: 40
---

<!-- overview -->

No Kubernetes, um _VolumeSnapshot_ representa uma cópia de volume instantâneo em um sistema de armazenamento. Este documento pressupõe que você já esteja familiarizado com [volumes persistentes](/docs/concepts/storage/persistent-volumes/) do Kubernetes.




<!-- body -->

## Introdução

Semelhante à forma como os recursos de API `PersistentVolume` e `PersistentVolumeClaim` são usados ​​para provisionar volumes para usuários e administradores, os recursos de API `VolumeSnapshotContent` e `VolumeSnapshot` são fornecidos para criar cópias instantâneas de volume para usuários e administradores.

Um `VolumeSnapshotContent` é uma cópia instantânea obtida de um volume no cluster que foi provisionado por um administrador. É um recurso no cluster assim como um PersistentVolume é um recurso de cluster.

Um `VolumeSnapshot` é uma solicitação de cópia instantânea de um volume por um usuário. É semelhante a um PersistentVolumeClaim.

`VolumeSnapshotClass` permite que você especifique diferentes atributos pertencentes a um `VolumeSnapshot`. Esses atributos podem diferir entre cópias instantâneas tiradas do mesmo volume no sistema de armazenamento e, portanto, não podem ser expressos usando o mesmo `StorageClass` de um `PersistentVolumeClaim`.

As cópias instantâneas de volume fornecem aos usuários do Kubernetes uma maneira padronizada de copiar o conteúdo de um volume em um determinado momento sem criar um volume totalmente novo. Essa funcionalidade permite, por exemplo, que administradores de banco de dados façam backup de bancos de dados antes de editar ou excluir modificações.

Ao usar esse recurso, os usuários precisam estar cientes do seguinte :

* Objetos de API `VolumeSnapshot`, `VolumeSnapshotContent` e `VolumeSnapshotClass` são {{< glossary_tooltip term_id="CustomResourceDefinition" text="CRDs" >}}, não fazem parte da API principal.
* O suporte a `VolumeSnapshot` só está disponível para drivers CSI.
* Como parte do processo de implantação do `VolumeSnapshot`, a equipe do Kubernetes fornece um controlador de instantâneo para ser implantado no plano de controle e um contêiner auxiliar de sidecar, chamado csi-snapshotter, para ser implantado junto com o driver CSI. O controlador de instantâneo observa os objetos `VolumeSnapshot` e `VolumeSnapshotContent` e é responsável pela criação e exclusão do objeto `VolumeSnapshotContent`. O sidecar csi-snapshotter observa objetos `VolumeSnapshotContent` e aciona as operações `CreateSnapshot` e `DeleteSnapshot` em um endpoint CSI.
* Há também um servidor webhook de validação que fornece validação restrita em objetos de cópias instantâneas. Isso deve ser instalado pelas distribuições do Kubernetes junto com o controlador de instantâneo e os CRDs, não os drivers CSI. Ele deve ser instalado em todos os clusters do Kubernetes que tenham o recurso de cópia instantânea ativado.
* Os drivers CSI podem ou não ter implementado a funcionalidade de cópia instantânea de volume. Os drivers CSI que forneceram suporte para cópia instantânea de volume provavelmente usarão o csi-snapshotter. Consulte [documentação do driver CSI](https://kubernetes-csi.github.io/docs/) para obter detalhes.
* As instalações dos CRDs e do controlador de snapshot são de responsabilidade da distribuição do Kubernetes.

## Ciclo de vida de cópias de volume instantâneo e seu conteúdo

`VolumeSnapshotContents` são recursos no cluster. `VolumeSnapshots` são solicitações para esses recursos. A interação entre `VolumeSnapshotContents` e `VolumeSnapshots` segue este ciclo de vida:

### Provisionando cópias de volume instantâneo

Há duas maneiras pelas quais os instantâneos podem ser provisionados: pré-provisionados ou provisionados dinamicamente.

#### Pré-provisionado {#static}
Um administrador de cluster cria vários `VolumeSnapshotContents`. Eles carregam os detalhes da cópia instantânea do volume real no sistema de armazenamento que está disponível para uso pelos usuários do cluster. Eles existem na API do Kubernetes e estão disponíveis para consumo.

#### Dinâmica
Em vez de usar uma cópia instantânea pré-existente, você pode solicitar que um instantâneo seja obtido dinamicamente de um PersistentVolumeClaim. O [VolumeSnapshotClass](/docs/concepts/storage/volume-snapshot-classes/) especifica parâmetros específicos do provedor de armazenamento a serem usados ao tirar um instantâneo.

### Binding

O controlador de instantâneo lida com a associação de um objeto `VolumeSnapshot` com um objeto `VolumeSnapshotContent` apropriado, tanto em cenários pré-provisionados como dinamicamente provisionados. A ligação é um mapeamento um-para-um.

No caso de associação pré-provisionada, o VolumeSnapshot permanecerá desvinculado até que o objeto `VolumeSnapshotContent` solicitado seja criado.

### Reivindicação de volume persistente como proteção de origem de volume instantâneo

O objetivo desta proteção é garantir que em uso
{{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}} objetos de API não são removidos do sistema enquanto uma cópia instantânea está sendo tirada dele (pois isso pode resultar em perda de dados).

Enquanto uma cópia está sendo tirada de um `PersistentVolumeClaim`, esse `PersistentVolumeClaim` está em uso. Se você excluir um objeto de API `PersistentVolumeClaim` em uso ativo como fonte de cópia instantânea, o objeto `PersistentVolumeClaim` não será removido imediatamente. Em vez disso, a remoção do objeto é adiada até que a cópia seja readyToUse ou abortado.

### Exclusão

A exclusão é acionada pela exclusão do objeto `VolumeSnapshot`, e a `DeletionPolicy` será seguida. Se o `DeletionPolicy` for `Delete`, a cópia instantânea de armazenamento subjacente será excluída junto com o objeto `VolumeSnapshotContent`. Se o `DeletionPolicy` for `Retain`, tanto o snapshot subjacente quanto o `VolumeSnapshotContent` permanecerão.

## VolumeSnapshots

Cada VolumeSnapshot contém uma especificação e um status.

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: new-snapshot-test
spec:
  volumeSnapshotClassName: csi-hostpath-snapclass
  source:
    persistentVolumeClaimName: pvc-test
```

`persistentVolumeClaimName` é o nome da fonte de dados `PersistentVolumeClaim` para o instantâneo. Este campo é obrigatório para provisionar dinamicamente uma cópia instantânea.

Uma cópia instantânea de volume pode solicitar uma classe específica, especificando o nome de um
[VolumeSnapshotClass](/docs/concepts/storage/volume-snapshot-classes/) e usando o atributo `volumeSnapshotClassName`. Se nada for definido, a classe padrão será usada, se disponível.

Para cópias pré-provisionadas, você precisa especificar um `volumeSnapshotContentName` como a origem da cópia instantânea, conforme mostrado no exemplo a seguir. O campo de origem `volumeSnapshotContentName` é obrigatório para cópias pré-provisionadas.

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: test-snapshot
spec:
  source:
    volumeSnapshotContentName: test-content
```

## Conteúdo de cópias de volumes instantâneos

Cada `VolumeSnapshotContent` contém uma especificação e um status. No provisionamento dinâmico, o controlador comum de instantâneo cria objetos `VolumeSnapshotContent`. Como por exemplo:

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotContent
metadata:
  name: snapcontent-72d9a349-aacd-42d2-a240-d775650d2455
spec:
  deletionPolicy: Delete
  driver: hostpath.csi.k8s.io
  source:
    volumeHandle: ee0cfb94-f8d4-11e9-b2d8-0242ac110002
  volumeSnapshotClassName: csi-hostpath-snapclass
  volumeSnapshotRef:
    name: new-snapshot-test
    namespace: default
    uid: 72d9a349-aacd-42d2-a240-d775650d2455
```

`volumeHandle` é o identificador exclusivo do volume criado no back-end de armazenamento e retornado pelo driver CSI durante a criação do volume. Este campo é obrigatório para provisionar dinamicamente uma cópia instantânea. Ele especifica a origem do volume da cópia.

Para cópias pré-provisionadas, você (como administrador do cluster) é responsável por criar o objeto `VolumeSnapshotContent` da seguinte forma:

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotContent
metadata:
  name: new-snapshot-content-test
spec:
  deletionPolicy: Delete
  driver: hostpath.csi.k8s.io
  source:
    snapshotHandle: 7bdd0de3-aaeb-11e8-9aae-0242ac110002
  volumeSnapshotRef:
    name: new-snapshot-test
    namespace: default
```

`snapshotHandle` é o identificador exclusivo da cópia instantânea de volume criado no back-end de armazenamento. Este campo é obrigatório para as cópias pré-provisionadas. Ele especifica o ID da cópia CSI no sistema de armazenamento que este `VolumeSnapshotContent` representa.

## Provisionando volumes de cópias instantâneas

Você pode provisionar um novo volume, pré-preenchido com dados de uma cópia instantânea, usando
o campo *dataSource* no objeto `PersistentVolumeClaim`.

Para mais detalhes, veja [Cópia instantânea de volume e restaurando volume de uma cópia instantânea](/docs/concepts/storage/persistent-volumes/#volume-snapshot-and-restore-volume-from-snapshot-support).
