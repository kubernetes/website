---
title: Configurando um Pod Para Usar um Volume Projetado Para Armazenamento
content_type: task
weight: 70
reviewers:
- jpeeler
- pmorie
---

<!-- overview -->
Esta página mostra como usar um Volume
[`projected`](/docs/concepts/storage/volumes/#projected) para montar diversas 
fontes de volumes existententes no mesmo diretório. Atualmente, volumes `secret`, 
`configMap`, `downwardAPI`, e `serviceAccountToken` podem ser projetados.

{{< note >}}
`serviceAccountToken` não é um tipo de volume.
{{< /note >}}


## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


<!-- steps -->
## Configure um volume projetado para um pod

Neste exercício, você cria o nome de usuário e senha 
{{< glossary_tooltip text="Secrets" term_id="secret" >}} a partir de arquivos locais. 
Você então cria um Pod que executa um contêiner, usando um volume
[`projected`](/docs/concepts/storage/volumes/#projected) 
para montar as `Secrets` dentro do mesmo diretório compartilhado.

Aqui está o arquivo de configuração para o Pod:

{{< codenew file="pods/storage/projected.yaml" >}}

1. Crie os segredos:

    ```shell
    # Crie arquivos contendo o username e password:
    echo -n "admin" > ./username.txt
    echo -n "1f2d1e2e67df" > ./password.txt

    # Empacote esses arquivos em `secrets`:
    kubectl create secret generic user --from-file=./username.txt
    kubectl create secret generic pass --from-file=./password.txt
    ```

1. Crie o Pod:

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/storage/projected.yaml
    ```

1. Verifique se o contêiner do pod está em execução e, em seguida, 
observe as alterações no pod:

    ```shell
    kubectl get --watch pod test-projected-volume
    ```

    A saída se parece com o seguinte:
    ```
    
    NAME                    READY     STATUS    RESTARTS   AGE
    test-projected-volume   1/1       Running   0          14s
    ```

1. Em outro terminal, pegue um shell para executar o contêiner:

    ```shell
    kubectl exec -it test-projected-volume -- /bin/sh
    ```

1. No seu shell, verifique se o diretótio `projected-volume` 
contém suas fontes projetadas:

    ```shell
    ls /projected-volume/
    ```

## Limpeza

Delete o Pod e o Secret:

```shell
kubectl delete pod test-projected-volume
kubectl delete secret user pass
```



## {{% heading "whatsnext" %}}

* Aprensa mais sobre volume [`projetado`](/docs/concepts/storage/volumes/#projected).
* Leia o documento de desenho de [volume tudo-em-um](https://git.k8s.io/design-proposals-archive/node/all-in-one-volume.md).

