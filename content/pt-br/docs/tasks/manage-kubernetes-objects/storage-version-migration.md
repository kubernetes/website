---
title: Migrar Objetos do Kubernetes Usando a Migração de Versão de Armazenamento
content_type: task
min-kubernetes-server-version: v1.30
weight: 60
---

<!-- overview -->

{{< feature-state feature_gate_name="StorageVersionMigrator" >}}

O Kubernetes depende da reescrita ativa dos dados da API para suportar algumas
atividades de manutenção relacionadas ao armazenamento em repouso. Dois exemplos
notáveis são o esquema versionado dos recursos armazenados (ou seja, o esquema de
armazenamento preferido mudando de v1 para v2 para um determinado recurso) e a
criptografia em repouso (ou seja, reescrever dados obsoletos com base em uma
mudança na forma como os dados devem ser criptografados).

Executar migrações de versão de armazenamento garante que todos os objetos de
um recurso foram migrados de uma versão de armazenamento obsoleta. O requisito
para executar uma migração de armazenamento é garantir que o recurso possua uma
versão de recurso inteira. Todos os recursos do Kubernetes e CRDs possuem essa
propriedade, mas a migração falhará se esse não for o caso, por exemplo, com
APIs agregadas.

## {{% heading "prerequisites" %}}

Instale o [`kubectl`](/docs/tasks/tools/#kubectl).

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Certifique-se de que seu cluster tenha o
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/#StorageVersionMigrator)
`StorageVersionMigrator` habilitado. Você precisará de acesso de administrador à
camada de gerenciamento para fazer essa alteração.

Habilite a API REST de migração de versão de armazenamento definindo a configuração
de agente de execução `storagemigration.k8s.io/v1beta1` como `true` para o servidor
de API. Para mais informações sobre como fazer isso, leia
[habilitar ou desabilitar uma API do Kubernetes](/docs/tasks/administer-cluster/enable-disable-api/).

<!-- steps -->

## Criptografar novamente os secrets do Kubernetes usando migração de versão de armazenamento

- Para começar, [configure o provedor KMS](/docs/tasks/administer-cluster/kms-provider/)
  para criptografar dados em repouso no etcd usando a seguinte configuração de criptografia.

  ```yaml
  kind: EncryptionConfiguration
  apiVersion: apiserver.config.k8s.io/v1
  resources:
  - resources:
    - secrets
    providers:
    - aescbc:
        keys:
        - name: key1
          secret: c2VjcmV0IGlzIHNlY3VyZQ==
  ```

  Certifique-se de habilitar o recarregamento automático do arquivo de configuração
  de criptografia definindo `--encryption-provider-config-automatic-reload` como true.

- Crie um Secret usando kubectl.

  ```shell
  kubectl create secret generic my-secret --from-literal=key1=supersecret
  ```

- [Verifique](/docs/tasks/administer-cluster/kms-provider/#verifying-that-the-data-is-encrypted)
  se os dados serializados desse objeto Secret possuem o prefixo `k8s:enc:aescbc:v1:key1`.

- Atualize o arquivo de configuração de criptografia conforme exemplo abaixo para rotacionar a chave de criptografia.

  ```yaml
  kind: EncryptionConfiguration
  apiVersion: apiserver.config.k8s.io/v1
  resources:
  - resources:
    - secrets
    providers:
    - aescbc:
        keys:
        - name: key2
          secret: c2VjcmV0IGlzIHNlY3VyZSwgaXMgaXQ/
    - aescbc:
        keys:
        - name: key1
          secret: c2VjcmV0IGlzIHNlY3VyZQ==
  ```

- Para garantir que o secret `my-secret` criado anteriormente seja criptografado novamente
  com a nova chave `key2`, você utilizará a _Migração de Versão de Armazenamento_.

- Crie um manifesto StorageVersionMigration chamado `migrate-secret.yaml` conforme exemplo abaixo:

  ```yaml
  kind: StorageVersionMigration
  apiVersion: storagemigration.k8s.io/v1beta1
  metadata:
    name: secrets-migration
  spec:
    resource:
      group: ""
      resource: secrets
  ```

  Crie o objeto usando `kubectl` conforme exemplo abaixo:

  ```shell
  kubectl apply -f migrate-secret.yaml
  ```

- Monitore a migração dos Secrets verificando o `.status` do StorageVersionMigration.
  Uma migração bem-sucedida deve ter sua condição
  `Succeeded` definida como true. Obtenha o objeto StorageVersionMigration conforme exemplo abaixo:

  ```shell
  kubectl wait --for=condition=Succeeded storageversionmigration.storagemigration.k8s.io/secrets-migration
  ```

  A saída é semelhante a:

  ```yaml
  kind: StorageVersionMigration
  apiVersion: storagemigration.k8s.io/v1beta1
  metadata:
    name: secrets-migration
    uid: 628f6922-a9cb-4514-b076-12d3c178967c
    resourceVersion: "90"
    creationTimestamp: "2024-03-12T20:29:45Z"
  spec:
    resource:
      group: ""
      resource: secrets
  status:
    conditions:
    - type: Running
      status: "False"
      lastUpdateTime: "2024-03-12T20:29:46Z"
      reason: StorageVersionMigrationInProgress
    - type: Succeeded
      status: "True"
      lastUpdateTime: "2024-03-12T20:29:46Z"
      reason: StorageVersionMigrationSucceeded
    resourceVersion: "84"
  ```

- [Verifique](/docs/tasks/administer-cluster/kms-provider/#verifying-that-the-data-is-encrypted)
  se o secret armazenado agora possui o prefixo `k8s:enc:aescbc:v1:key2`.

## Atualizar o esquema de armazenamento preferido de um CRD

Considere um cenário onde um {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}
(CRD) é criado para servir recursos personalizados (CRs) e é definido como o esquema de armazenamento preferido. Quando chega o momento
de introduzir a v2 do CRD, ela pode ser adicionada apenas para servir com um
webhook de conversão. Isso permite uma transição mais suave, onde os usuários podem criar CRs usando
o esquema v1 ou v2, com o webhook implementado para realizar a conversão
de esquema necessária entre eles. Antes de definir a v2 como a versão preferida do esquema de
armazenamento, é importante garantir que todos os CRs existentes armazenados como v1 sejam migrados para v2.
Essa migração pode ser realizada por meio da _Migração de Versão de Armazenamento_ para migrar todos os CRs de v1 para v2.

- Crie um manifesto para o CRD, chamado `test-crd.yaml`, conforme exemplo abaixo:

  ```yaml
  apiVersion: apiextensions.k8s.io/v1
  kind: CustomResourceDefinition
  metadata:
    name: selfierequests.example.com
  spec:
    group: example.com
    names:
      plural: selfierequests
      singular: selfierequest
      kind: SelfieRequest
      listKind: SelfieRequestList
    scope: Namespaced
    versions:
    - name: v1
      served: true
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            hostPort:
              type: string
    conversion:
      strategy: Webhook
      webhook:
        clientConfig:
          url: "https://127.0.0.1:9443/crdconvert"
          caBundle: <CABundle info>
      conversionReviewVersions:
      - v1
      - v2
  ```

  A versão armazenada neste ponto deve ser `v1`, confirme isso executando:
  ```shell
  kubectl get crd selfierequests.example.com -o jsonpath='{.spec.versions[?(@.storage==true)].name}'
  ```

  Crie o CRD usando kubectl:

  ```shell
  kubectl apply -f test-crd.yaml
  ```

- Crie um manifesto para um testcrd de exemplo. Nomeie o manifesto como `cr1.yaml` e use o seguinte conteúdo:

  ```yaml
  apiVersion: example.com/v1
  kind: SelfieRequest
  metadata:
    name: cr1
    namespace: default
  ```

  Crie o CR usando kubectl:

  ```shell
  kubectl apply -f cr1.yaml
  ```

- Verifique se o CR foi escrito e armazenado como v1 obtendo o objeto do etcd.

  ```shell
  ETCDCTL_API=3 etcdctl get /kubernetes.io/example.com/testcrds/default/cr1 [...] | hexdump -C
  ```

  onde `[...]` contém os argumentos adicionais para conexão com o servidor etcd.

- Atualize o CRD `test-crd.yaml` para incluir a versão v2 para servir e armazenar
  e v1 apenas para servir, conforme exemplo abaixo:

  ```yaml
  apiVersion: apiextensions.k8s.io/v1
  kind: CustomResourceDefinition
  metadata:
  name: selfierequests.example.com
  spec:
    group: example.com
    names:
      plural: selfierequests
      singular: selfierequest
      kind: SelfieRequest
      listKind: SelfieRequestList
    scope: Namespaced
    versions:
      - name: v2
        served: true
        storage: true
        schema:
          openAPIV3Schema:
            type: object
            properties:
              host:
                type: string
              port:
                type: string
      - name: v1
        served: true
        storage: false
        schema:
          openAPIV3Schema:
            type: object
            properties:
              hostPort:
                type: string
    conversion:
      strategy: Webhook
      webhook:
        clientConfig:
          url: "https://127.0.0.1:9443/crdconvert"
          caBundle: <CABundle info>
        conversionReviewVersions:
          - v1
          - v2
  ```

  A versão armazenada agora deve ser `v2`, confirme isso:
  ```shell
  kubectl get crd selfierequests.example.com -o jsonpath='{.spec.versions[?(@.storage==true)].name}'
  ```

  Atualize o CRD usando kubectl:

  ```shell
  kubectl apply -f test-crd.yaml
  ```

- Crie o arquivo de recurso CR com o nome `cr2.yaml` conforme exemplo abaixo:

  ```yaml
  apiVersion: example.com/v2
  kind: SelfieRequest
  metadata:
    name: cr2
    namespace: default
  ```

- Crie o CR usando kubectl:

  ```shell
  kubectl apply -f cr2.yaml
  ```

- Verifique se o CR foi escrito e armazenado como v2 obtendo o objeto do etcd.

  ```shell
  ETCDCTL_API=3 etcdctl get /kubernetes.io/example.com/testcrds/default/cr2 [...] | hexdump -C
  ```

  onde `[...]` contém os argumentos adicionais para conexão com o servidor etcd.

- Crie um manifesto StorageVersionMigration chamado `migrate-crd.yaml`, com o conteúdo conforme exemplo abaixo:

  ```yaml
  kind: StorageVersionMigration
  apiVersion: storagemigration.k8s.io/v1beta1
  metadata:
    name: crdsvm
  spec:
    resource:
      group: example.com
      resource: SelfieRequest
  ```

  Crie o objeto usando _kubectl_ conforme exemplo abaixo:

  ```shell
  kubectl apply -f migrate-crd.yaml
  ```

- Monitore a migração dos secrets usando o status. Uma migração bem-sucedida deve ter
  a condição `Succeeded` definida como "True" no campo de status. Obtenha o recurso de
  migração conforme exemplo abaixo:

  ```shell
  kubectl get storageversionmigration.storagemigration.k8s.io/crdsvm -o yaml
  ```

  A saída é semelhante a:

  ```yaml
  kind: StorageVersionMigration
  apiVersion: storagemigration.k8s.io/v1beta1
  metadata:
    name: crdsvm
    uid: 13062fe4-32d7-47cc-9528-5067fa0c6ac8
    resourceVersion: "111"
    creationTimestamp: "2024-03-12T22:40:01Z"
  spec:
    resource:
      group: example.com
      resource: testcrds
  status:
    conditions:
      - type: Running
        status: "False"
        lastUpdateTime: "2024-03-12T22:40:03Z"
        reason: StorageVersionMigrationInProgress
      - type: Succeeded
        status: "True"
        lastUpdateTime: "2024-03-12T22:40:03Z"
        reason: StorageVersionMigrationSucceeded
    resourceVersion: "106"
  ```

- Verifique se o cr1 criado anteriormente agora foi escrito e armazenado como v2 obtendo o objeto do etcd.

  ```shell
  ETCDCTL_API=3 etcdctl get /kubernetes.io/example.com/testcrds/default/cr1 [...] | hexdump -C
  ```

  onde `[...]` contém os argumentos adicionais para conexão com o servidor etcd.

- Verifique também se o status da versão armazenada do CRD agora é apenas v2:

  ```shell
  kubectl get crd testcrds.example.com -o yaml
  ```

  A saída é semelhante a:

  ```yaml
  kind: CustomResourceDefinition
  apiVersion: apiextensions.k8s.io/v1
  metadata:
    name: testcrds.example.com
  spec:
    group: example.com
    names:
      kind: TestCRD
      plural: testcrds
    scope: Namespaced
    versions:
      - name: v1
        served: true
        storage: false
      - name: v2
        served: true
        storage: true
  status:
    acceptedNames:
      kind: TestCRD
      plural: testcrds
    conditions:
      - type: Established
        status: "True"
    storedVersions:
      - v2
  ```