---
title: Obtendo uma Imagem de um Registro Privado
content_type: task
weight: 100
---

<!-- overview -->

Esta página mostra como criar uma Pod que usa uma 
{{< glossary_tooltip text="Secret" term_id="secret" >}} para puxar uma imagem
de um registro de imagens de contêiner privado ou de um repositório. Existem muitos registros privados em uso. 
Esta tarefa usa o [Docker Hub](https://www.docker.com/products/docker-hub)
como exemplo de registro.

{{% thirdparty-content single="true" %}}

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}}

* Para fazer este exercício, você precisa da ferramenta de linha de comando `docker`, e um
  [Docker ID](https://docs.docker.com/docker-id/) para o qual você conheça a senha.
* Se você estiver usando um registro de contêiner privado diferente, você precisa da 
ferramenta de linha de comando para esse registro e suas informações de login. 

<!-- steps -->

## Logar em Docker Hub

Em seu laptop, você deve autenticar-se em um registro para puxar uma imagem particular.

Use a ferramenta `docker` para logar-se no Docker Hub. Veja a seção _log in_ do
[Contas do Docker ID](https://docs.docker.com/docker-id/#log-in) para mais informações.

```shell
docker login
```

Quando solicitado, insira o seu Docker ID, e então a credencial que você deseja usar (token de acesso,
ou a senha para o seu Docker ID).

O processo de login cria ou atualiza um arquivo `config.json` que contém um token de autorização. Analise [como o Kubernetes interpreta esse arquivo](/docs/concepts/containers/images#config-json). 

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
Se você usar o armazenador de credenciais do Docker, você não vai ver essa entrada `auth`, mas sim uma `credsStore` com o nome do armazenador como valor.
{{< /note >}}

## Crie um segredo com base nas credenciais existentes {#registry-secret-existing-credentials}

Um cluster de Kubernetes usa o Segredo do tipo `kubernetes.io/dockerconfigjson` para autenticar com um registro de contêineres
para pegar uma imagem privada.

Se você já executou `docker login`, você pode copiar
essa credencial para o Kubernetes:

```shell
kubectl create secret generic regcred \
    --from-file=.dockerconfigjson=<path/to/.docker/config.json> \
    --type=kubernetes.io/dockerconfigjson
```

Se você precisar de mais controle (por exemplo, para definir um namespace ou um novo
segredo) então você pode personalizar o segredo antes de armazená-lo.
Tenha certeza de:

- definir o nome do item de dados como `.dockerconfigjson`
- codificar com base64 o arquivo de configuração do Docker e então colar essa String, inteira, 
como o valor para o campo `data[".dockerconfigjson"]`
- definir o `type` para `kubernetes.io/dockerconfigjson`

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

Se você receber a mensagem de erro `error: no objects passed to create`, isso pode significar que a sequência codificada com base64 é inválida.
Se você receber uma mensagem de erro como `Secret "myregistrykey" é inválida: data[.dockerconfigjson]: invalid value ...`, isso significa
que a string codificada com base64 nos dados foi decodificada com sucesso, mas não pôde ser analisada como um arquivo `.docker/config.json`.

## Crie um Segredo fornecendo credenciais pela linha de comando

Crie este Segredo, nomeando a `regcred`:

```shell
kubectl create secret docker-registry regcred --docker-server=<your-registry-server> --docker-username=<your-name> --docker-password=<your-pword> --docker-email=<your-email>
```

Onde:

* `<your-registry-server>` é o seu `Private Docker Registry FQDN`.
  Use `https://index.docker.io/v1/` para DockerHub.
* `<your-name>` é o seu nome de usuário do Docker.
* `<your-pword>` é a sua senha do Docker.
* `<your-email>` é o seu email do Docker.

Você definiu com sucesso as suas credenciais Docker no cluster como um Segredo chamado `regcred`.

{{< note >}}
Digitando segredos na linha de comando, pode armazená-los no histórico do seu shell, desprotegidos, e
esses segredos também podem ser visíveis para outros usuários em seu PC durante o tempo que `kubectl` estiver em execução.
{{< /note >}}


## Inspecione o Segredo `regcred`

Para entender o conteúdo do Segredo `regcred` que você criou, comece visualizando o Segredo em formato YAML:

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

O valor do campo `.dockerconfigjson` é uma representação em base64 das suas credenciais Docker.

Para entender o que está no campo `.dockerconfigjson`, e converter os dados secretos em um
formato legível:

```shell
kubectl get secret regcred --output="jsonpath={.data.\.dockerconfigjson}" | base64 --decode
```

A saída é semelhante a esta:

```json
{"auths":{"your.private.registry.example.com":{"username":"janedoe","password":"xxxxxxxxxxx","email":"jdoe@example.com","auth":"c3R...zE2"}}}
```

Para entender o que está no campo `auth`, converta o dado codificado em base64 para um formato legível:

```shell
echo "c3R...zE2" | base64 --decode
```

A saída, nome de usuário e senha concatenados com um `:`, é similar a esta:

```none
janedoe:xxxxxxxxxxx
```

Observe que os dados secretos contém o token de autorização semelhante ao seu arquivo local `~/.docker/config.json`.

Você definiu com sucesso suas credenciais do Docker como um segredo chamado `regcred` no cluster.

## Crie um Pod que use seu segredo

Aqui está um manifesto para um exemplo de Pod que precisa acessar as suas credenciais do Docker em `regcred`:

{{< codenew file="pods/private-reg-pod.yaml" >}}

Baixe o arquivo acima no seu computador:

```shell
curl -L -O my-private-reg-pod.yaml https://k8s.io/examples/pods/private-reg-pod.yaml
```

No arquivo `my-private-reg-pod.yaml`, altere `<your-private-image>` com o caminho para uma imagem em um registro privado, como:

```none
your.private.registry.example.com/janedoe/jdoe-private:v1
```

Para puxar a imagem do registro privado, o Kubernetes precisa das credencias.
O campo `imagePullSecrets` no arquivo de configuração especifica que
o Kubernetes deve obter as credenciais de um segredo nomeado `regcred`.

Crie um Pod que use o seu segredo e verifique se o pod está executando:

```shell
kubectl apply -f my-private-reg-pod.yaml
kubectl get pod private-reg
```

## {{% heading "whatsnext" %}}

* Aprenda mais sobre [Segredos](/docs/concepts/configuration/secret/)
  * ou leia a referência da API para {{< api-reference page="config-and-storage-resources/secret-v1" >}}
* Aprenda mais sobre [usando um registro privado](/docs/concepts/containers/images/#using-a-private-registry).
* Aprenda mais sobre [adicionando segredos para puxar imagens com uma conta de serviço](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account).
* Veja [kubectl criando segredos docker-registry](/docs/reference/generated/kubectl/kubectl-commands/#-em-secret-docker-registry-em-).
* Veja o campo `imagePullSecrets` dentro das [definições do contêiner](/docs/reference/kubernetes-api/workload-resources/pod-v1/#containers) de um Pod
