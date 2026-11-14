---
title: Baixar uma Imagem de um Registro Privado
weight: 130
---

<!-- overview -->

Esta página mostra como criar um Pod que usa um
{{< glossary_tooltip text="Secret" term_id="secret" >}} para baixar uma imagem
de um registro ou repositório privado de imagens de contêiner. Existem muitos
registros privados em uso. Esta tarefa usa o [Docker Hub](https://www.docker.com/products/docker-hub)
como registro de exemplo.

{{% thirdparty-content single="true" %}}

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}}

* Para fazer este exercício, você precisa da ferramenta de linha de comando `docker` e de um
  [Docker ID](https://docs.docker.com/docker-id/) cuja senha você conheça.
* Se você estiver usando um registro de contêineres privado diferente, você precisa da ferramenta
  de linha de comando desse registro e das informações de login dele.

<!-- steps -->

## Faça login no Docker Hub {#log-in-to-docker-hub}

No seu computador, você precisa se autenticar em um registro para baixar uma imagem privada.

Use a ferramenta `docker` para fazer login no Docker Hub. Veja a seção _log in_ de
[Docker ID accounts](https://docs.docker.com/docker-id/#log-in) para mais informações.

```shell
docker login
```

Quando solicitado, informe o seu Docker ID e, em seguida, a credencial que você quer usar (um token
de acesso ou a senha do seu Docker ID).

O processo de login cria ou atualiza um arquivo `config.json` que contém um token de autorização.
Veja [como o Kubernetes interpreta esse arquivo](/docs/concepts/containers/images#config-json).

Veja o arquivo `config.json`:

```shell
cat ~/.docker/config.json
```

A saída contém uma seção semelhante a esta:

```json
{
    "auths": {
        "https://index.docker.io/v1/": {
            "auth": "c3R...zE2"
        }
    }
}
```

{{< note >}}
Se você usa um armazenamento de credenciais do Docker, você não verá essa entrada `auth`, e sim uma entrada `credsStore` com o nome do armazenamento como valor.
Nesse caso, você pode criar um Secret diretamente.
Veja [Crie um Secret informando as credenciais na linha de comando](#create-a-secret-by-providing-credentials-on-the-command-line).
{{< /note >}}

## Crie um Secret com base em credenciais existentes {#registry-secret-existing-credentials}

Um cluster Kubernetes usa o Secret do tipo `kubernetes.io/dockerconfigjson` para se autenticar
em um registro de contêineres e baixar uma imagem privada.

Se você já executou `docker login`, pode copiar
essa credencial para o Kubernetes:

```shell
kubectl create secret generic regcred \
    --from-file=.dockerconfigjson=<path/to/.docker/config.json> \
    --type=kubernetes.io/dockerconfigjson
```

Se você precisar de mais controle (por exemplo, para definir um namespace ou um label no novo
Secret), você pode personalizar o Secret antes de armazená-lo.
Certifique-se de:

- definir o nome do item de dados como `.dockerconfigjson`
- codificar o arquivo de configuração do Docker em base64 e colar essa string, sem quebras,
  como valor do campo `data[".dockerconfigjson"]`
- definir `type` como `kubernetes.io/dockerconfigjson`

Exemplo:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: myregistrykey
  namespace: awesomeapps
data:
  .dockerconfigjson: UmVhbGx5IHJlYWxseSByZWVlZWVlZWVlZWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGx5eXl5eXl5eXl5eXl5eXl5eXl5eSBsbGxsbGxsbGxsbGxsbG9vb29vb29vb29vb29vb29vb29vb29vb29vb25ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubmdnZ2dnZ2dnZ2dnZ2dnZ2dnZ2cgYXV0aCBrZXlzCg==
type: kubernetes.io/dockerconfigjson
```

Se você receber a mensagem de erro `error: no objects passed to create`, isso pode significar que a string codificada em base64 é inválida.
Se você receber uma mensagem de erro como `Secret "myregistrykey" is invalid: data[.dockerconfigjson]: invalid value ...`, isso significa que
a string codificada em base64 nos dados foi decodificada com sucesso, mas não pôde ser interpretada como um arquivo `.docker/config.json`.

## Crie um Secret informando as credenciais na linha de comando {#create-a-secret-by-providing-credentials-on-the-command-line}

Crie este Secret, com o nome `regcred`:

```shell
kubectl create secret docker-registry regcred --docker-server=<your-registry-server> --docker-username=<your-name> --docker-password=<your-pword> --docker-email=<your-email>
```

onde:

* `<your-registry-server>` é o FQDN do seu registro Docker privado.
  Use `https://index.docker.io/v1/` para o DockerHub.
* `<your-name>` é o seu nome de usuário do Docker.
* `<your-pword>` é a sua senha do Docker.
* `<your-email>` é o seu e-mail do Docker.

Você definiu com sucesso as suas credenciais do Docker no cluster como um Secret chamado `regcred`.

{{< note >}}
Digitar segredos na linha de comando pode armazená-los sem proteção no histórico do seu shell, e
esses segredos também podem ficar visíveis para outros usuários do seu computador enquanto o
`kubectl` estiver em execução.
{{< /note >}}


## Inspecionando o Secret `regcred` {#inspecting-the-secret-regcred}

Para entender o conteúdo do Secret `regcred` que você criou, comece visualizando o Secret no formato YAML:

```shell
kubectl get secret regcred --output=yaml
```

A saída é semelhante a esta:

```yaml
apiVersion: v1
kind: Secret
metadata:
  ...
  name: regcred
  ...
data:
  .dockerconfigjson: eyJodHRwczovL2luZGV4L ... J0QUl6RTIifX0=
type: kubernetes.io/dockerconfigjson
```

O valor do campo `.dockerconfigjson` é uma representação em base64 das suas credenciais do Docker.

Para entender o que há no campo `.dockerconfigjson`, converta os dados do Secret para um
formato legível:

```shell
kubectl get secret regcred --output="jsonpath={.data.\.dockerconfigjson}" | base64 --decode
```

A saída é semelhante a esta:

```json
{"auths":{"your.private.registry.example.com":{"username":"janedoe","password":"xxxxxxxxxxx","email":"jdoe@example.com","auth":"c3R...zE2"}}}
```

Para entender o que há no campo `auth`, converta os dados codificados em base64 para um formato legível:

```shell
echo "c3R...zE2" | base64 --decode
```

A saída, com o nome de usuário e a senha concatenados por um `:`, é semelhante a esta:

```none
janedoe:xxxxxxxxxxx
```

Observe que os dados do Secret contêm o token de autorização, semelhante ao do seu arquivo local `~/.docker/config.json`.

Você definiu com sucesso as suas credenciais do Docker como um Secret chamado `regcred` no cluster.

## Crie um Pod que usa o seu Secret {#create-a-pod-that-uses-your-secret}

Este é o manifesto de um Pod de exemplo que precisa de acesso às suas credenciais do Docker em `regcred`:

{{% code_sample file="pods/private-reg-pod.yaml" %}}

Baixe o arquivo acima para o seu computador:

```shell
curl -L -o my-private-reg-pod.yaml https://k8s.io/examples/pods/private-reg-pod.yaml
```

No arquivo `my-private-reg-pod.yaml`, substitua `<your-private-image>` pelo caminho de uma imagem em um registro privado, como:

```none
your.private.registry.example.com/janedoe/jdoe-private:v1
```

Para baixar a imagem do registro privado, o Kubernetes precisa de credenciais.
O campo `imagePullSecrets` do arquivo de configuração especifica que
o Kubernetes deve obter as credenciais de um Secret chamado `regcred`.

Crie um Pod que usa o seu Secret e verifique se o Pod está em execução:

```shell
kubectl apply -f my-private-reg-pod.yaml
kubectl get pod private-reg
```

{{< note >}}
Para usar Secrets de download de imagem em um Pod (ou em um Deployment, ou em outro objeto
que tenha um modelo de Pod que você esteja usando), você precisa garantir que o Secret
apropriado exista no namespace correto. O namespace a ser usado é o mesmo
namespace em que você definiu o Pod.
{{< /note >}}

Além disso, caso o Pod não consiga iniciar e fique com o status `ImagePullBackOff`, veja os eventos do Pod:

```shell
kubectl describe pod private-reg
```

Se você encontrar um evento com o motivo `FailedToRetrieveImagePullSecret`,
o Kubernetes não consegue encontrar um Secret com o nome informado (`regcred`, neste exemplo).

Verifique se o Secret que você especificou existe e se o nome dele está escrito corretamente.
```shell
Events:
  ...  Reason                           ...  Message
       ------                                -------
  ...  FailedToRetrieveImagePullSecret  ...  Unable to retrieve some image pull secrets (<regcred>); attempting to pull the image may not succeed.
```

## Usando imagens de vários registros {#using-images-from-multiple-registries}

Um Pod pode ter vários contêineres, e a imagem de cada contêiner pode vir de um registro diferente.
Você pode usar vários `imagePullSecrets` em um Pod, e cada um pode conter várias credenciais.

O download da imagem será tentado com cada credencial que corresponda ao registro.
Se nenhuma credencial corresponder ao registro, o download da imagem será tentado sem autorização ou usando uma configuração personalizada específica do agente de execução.

## {{% heading "whatsnext" %}}

* Saiba mais sobre [Secrets](/docs/concepts/configuration/secret/)
  * ou leia a referência da API de {{< api-reference page="core/secret-v1" >}}
* Saiba mais sobre [como usar um registro privado](/docs/concepts/containers/images/#usando-um-registro-privado).
* Saiba mais sobre [como adicionar Secrets de download de imagem a uma conta de serviço](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account).
* Veja [kubectl create secret docker-registry](/docs/reference/generated/kubectl/kubectl-commands/#-em-secret-docker-registry-em-).
* Veja o campo `imagePullSecrets` nas [definições de contêiner](/docs/reference/kubernetes-api/workload-resources/pod-v1/#containers) de um Pod
