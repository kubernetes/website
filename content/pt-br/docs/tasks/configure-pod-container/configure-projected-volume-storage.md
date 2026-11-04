---
reviewers:
- jpeeler
- pmorie
title: Configurar um Pod para Usar um Volume Projetado para Armazenamento
content_type: task
weight: 100
---

<!-- overview -->
Esta página mostra como usar um Volume [`projected`](/docs/concepts/storage/volumes/#projected)
para montar várias fontes de volume existentes no mesmo diretório. Atualmente,
volumes `secret`, `configMap`, `downwardAPI` e `serviceAccountToken` podem ser
projetados.

{{< note >}}
`serviceAccountToken` não é um tipo de volume.
{{< /note >}}


## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


<!-- steps -->
## Configure um volume projetado para um Pod {#configure-a-projected-volume-for-a-pod}

Neste exercício, você cria {{< glossary_tooltip text="Secrets" term_id="secret" >}}
de nome de usuário e senha a partir de arquivos locais. Em seguida, você cria um
Pod que executa um contêiner e usa um Volume [`projected`](/docs/concepts/storage/volumes/#projected)
para montar os Secrets no mesmo diretório compartilhado.

Aqui está o arquivo de configuração do Pod:

{{% code_sample file="pods/storage/projected.yaml" %}}

1. Crie os Secrets:

    ```shell
    # Crie arquivos contendo o nome de usuário e a senha:
    echo -n "admin" > ./username.txt
    echo -n "1f2d1e2e67df" > ./password.txt

    # Empacote esses arquivos em Secrets:
    kubectl create secret generic user --from-file=./username.txt
    kubectl create secret generic pass --from-file=./password.txt
    ```
1. Crie o Pod:

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/storage/projected.yaml
    ```
1. Verifique se o contêiner do Pod está em execução e, em seguida, acompanhe as
mudanças no Pod:

    ```shell
    kubectl get --watch pod test-projected-volume
    ```
    A saída é semelhante a esta:
    ```
    NAME                    READY     STATUS    RESTARTS   AGE
    test-projected-volume   1/1       Running   0          14s
    ```
1. Em outro terminal, abra um shell no contêiner em execução:

    ```shell
    kubectl exec -it test-projected-volume -- /bin/sh
    ```
1. No seu shell, verifique se o diretório `projected-volume` contém as suas fontes projetadas:

    ```shell
    ls /projected-volume/
    ```

## Limpeza {#clean-up}

Exclua o Pod e os Secrets:

```shell
kubectl delete pod test-projected-volume
kubectl delete secret user pass
```



## {{% heading "whatsnext" %}}

* Saiba mais sobre volumes [`projected`](/docs/concepts/storage/volumes/#projected).
* Leia o documento de design do [volume tudo-em-um](https://git.k8s.io/design-proposals-archive/node/all-in-one-volume.md) (_all-in-one volume_).

