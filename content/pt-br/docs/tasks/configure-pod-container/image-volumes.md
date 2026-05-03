---
title: Usar um Volume de Imagem com um Pod
reviewers:
content_type: task
weight: 210
min-kubernetes-server-version: v1.31
---

<!-- overview -->

{{< feature-state feature_gate_name="ImageVolume" >}}

Esta página mostra como configurar um pod usando volumes de imagem. Isso permite que você
monte conteúdo de registros OCI dentro de contêineres.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

- O agente de execução de contêiner precisa suportar a funcionalidade de volumes de imagem
- Você precisa executar comandos no host
- Você precisa ser capaz de executar comandos dentro dos pods

<!-- steps -->

## Executar um Pod que usa um volume de imagem {#create-pod}

Um volume de imagem para um pod é habilitado definindo o campo `volumes[*].image` de `.spec`
como uma referência válida e consumindo-o nos `volumeMounts` do contêiner. Por exemplo:

{{% code_sample file="pods/image-volumes.yaml" %}}

1. Crie o pod no seu cluster:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/image-volumes.yaml
   ```

1. Acesse o contêiner:

   ```shell
   kubectl exec image-volume -it -- bash
   ```

1. Verifique o conteúdo de um arquivo no volume:

   ```shell
   cat /volume/dir/file
   ```

   A saída é semelhante a:

   ```none
   1
   ```

   Você também pode verificar outro arquivo em um caminho diferente:

   ```shell
   cat /volume/file
   ```

   A saída é semelhante a:

   ```none
   2
   ```

## Usar `subPath` (ou `subPathExpr`)

É possível utilizar
[`subPath`](/docs/concepts/storage/volumes/#using-subpath) ou
[`subPathExpr`](/docs/concepts/storage/volumes/#using-subpath-expanded-environment)
a partir do Kubernetes v1.33 ao usar a funcionalidade de volumes de imagem.

{{% code_sample file="pods/image-volumes-subpath.yaml" %}}

1. Crie o pod no seu cluster:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/image-volumes-subpath.yaml
   ```

1. Acesse o contêiner:

   ```shell
   kubectl exec image-volume -it -- bash
   ```

1. Verifique o conteúdo do arquivo a partir do subdiretório `dir` no volume:

   ```shell
   cat /volume/file
   ```

   A saída é semelhante a:

   ```none
   1
   ```

## Leitura adicional

- [`image` volumes](/docs/concepts/storage/volumes/#image)
