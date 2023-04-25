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
[projetado](/docs/concepts/storage/volumes/#projetado) para montar diversas 
fontes de volumes existentes no mesmo diretório. Atualmente, volumes `secret`, 
`configMap`, `downwardAPI`, e `serviceAccountToken` podem ser projetados.

{{< note >}}
`serviceAccountToken` não é um tipo de volume.
{{< /note >}}


## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


<!-- steps -->
## Configure um volume projetado em um pod

Neste exercício, você cria o nome de usuário e senha 
{{< glossary_tooltip text="Secrets" term_id="secret" >}} a partir de arquivos locais. 
Você então cria um Pod que executa um contêiner, usando um volume
[projetado](pt-br/docs/concepts/storage/volumes/#projetado) 
para montar os objetos Secret dentro do mesmo diretório compartilhado.

Aqui está o arquivo de configuração para o Pod:

{{< codenew file="pods/storage/projected.yaml" >}}

1. Crie os Secrets:

    ```shell
    # Crie arquivos contendo o usuário e senha:
    echo -n "admin" > ./username.txt
    echo -n "1f2d1e2e67df" > ./password.txt

    # Empacote esses arquivos em objetos do tipo Secret:
    kubectl create secret generic user --from-file=./username.txt
    kubectl create secret generic pass --from-file=./password.txt
    ```

1. Crie o Pod:

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/storage/projected.yaml
    ```

1. Verifique se o contêiner do Pod está em execução e, em seguida, 
observe as alterações no pod:

    ```shell
    kubectl get --watch pod test-projected-volume
    ```

    A saída se parece com o seguinte:
    ```
    
    NAME                    READY     STATUS    RESTARTS   AGE
    test-projected-volume   1/1       Running   0          14s
    ```

1. Em outro terminal, inicie um shell para executar o contêiner:

    ```shell
    kubectl exec -it test-projected-volume -- /bin/sh
    ```

1. No seu shell, verifique se o diretório `projected-volume` 
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

* Aprensa mais sobre volumes [projetados](pt-br/docs/concepts/storage/volumes/#projetado).
* Leia o documento de design de [volume tudo-em-um](https://git.k8s.io/design-proposals-archive/node/all-in-one-volume.md).

