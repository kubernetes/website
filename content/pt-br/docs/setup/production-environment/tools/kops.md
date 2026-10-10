---
title: Instalando Kubernetes com kOps
content_type: task
weight: 20
---

<!-- overview -->

Este início rápido mostra como instalar facilmente um cluster Kubernetes na AWS usando uma ferramenta chamada [`kOps`](https://github.com/kubernetes/kops). 

`kOps` é um sistema de provisionamento automatizado:

* Instalação totalmente automatizada
* Usa DNS para identificar clusters
* Auto-recuperação: tudo é executado em grupos de Auto-Scaling
* Suporte de vários sistemas operacionais (Amazon Linux, Debian, Flatcar, RHEL, Rocky e Ubuntu) - veja em [imagens](https://github.com/kubernetes/kops/blob/master/docs/operations/images.md)
* Suporte a alta disponibilidade - consulte a [documentação sobre alta disponibilidade](https://github.com/kubernetes/kops/blob/master/docs/operations/high_availability.md)
* Pode provisionar diretamente ou gerar manifestos do terraform - veja a [documentação sobre como fazer isso com Terraform](https://github.com/kubernetes/kops/blob/master/docs/terraform.md)

## {{% heading "prerequisites" %}}

* Você deve ter o [kubectl](/docs/tasks/tools/) instalado.

* Você deve [instalar](https://github.com/kubernetes/kops#installing) `kops` em uma arquitetura de dispositivo de 64 bits (AMD64 e Intel 64).

* Você deve ter uma [conta da AWS](https://docs.aws.amazon.com/polly/latest/dg/setting-up.html), gerar as [chaves do IAM](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys) e [configurá-las](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html#cli-quick-configuration). O usuário do IAM precisará de [permissões adequadas](https://github.com/kubernetes/kops/blob/master/docs/getting_started/aws.md#setup-iam-user).

<!-- steps -->

## Como criar um cluster

### (1/5) Instalar kops

#### Instalação

Faça o download do kops na [página de downloads](https://github.com/kubernetes/kops/releases) (também é conveniente gerar um binário a partir do código-fonte):

{{< tabs name="kops_installation" >}}
{{% tab name="macOS" %}}

Baixe a versão mais recente com o comando:

```shell
curl -LO https://github.com/kubernetes/kops/releases/download/$(curl -s https://api.github.com/repos/kubernetes/kops/releases/latest | grep tag_name | cut -d '"' -f 4)/kops-darwin-amd64
```

Para baixar uma versão específica, substitua a seguinte parte do comando pela versão específica do kops.

```shell
$(curl -s https://api.github.com/repos/kubernetes/kops/releases/latest | grep tag_name | cut -d '"' -f 4)
```

Por exemplo, para baixar kops versão v1.20.0 digite:

```shell
curl -LO https://github.com/kubernetes/kops/releases/download/v1.20.0/kops-darwin-amd64
```

Dê a permissão de execução ao binário do kops.

```shell
chmod +x kops-darwin-amd64
```

Mova o binário do kops para o seu PATH.

```shell
sudo mv kops-darwin-amd64 /usr/local/bin/kops
```

Você também pode instalar kops usando [Homebrew](https://brew.sh/).

```shell
brew update && brew install kops
```
{{% /tab %}}
{{% tab name="Linux" %}}

Baixe a versão mais recente com o comando:

```shell
curl -LO https://github.com/kubernetes/kops/releases/download/$(curl -s https://api.github.com/repos/kubernetes/kops/releases/latest | grep tag_name | cut -d '"' -f 4)/kops-linux-amd64
```

Para baixar uma versão específica do kops, substitua a seguinte parte do comando pela versão específica do kops.

```shell
$(curl -s https://api.github.com/repos/kubernetes/kops/releases/latest | grep tag_name | cut -d '"' -f 4)
```

Por exemplo, para baixar kops versão v1.20.0 digite:

```shell
curl -LO https://github.com/kubernetes/kops/releases/download/v1.20.0/kops-linux-amd64
```

Dê a permissão de execução ao binário do kops

```shell
chmod +x kops-linux-amd64
```

Mova o binário do kops para o seu PATH.

```shell
sudo mv kops-linux-amd64 /usr/local/bin/kops
```

Você também pode instalar kops usando [Homebrew](https://docs.brew.sh/Homebrew-on-Linux).

```shell
brew update && brew install kops
```

{{% /tab %}}
{{< /tabs >}}

### (2/5) Crie um domínio route53 para seu cluster

O kops usa DNS para descoberta, tanto dentro do cluster quanto fora, para que você possa acessar o servidor da API do kubernetes a partir dos clientes.

kops tem uma opinião forte sobre o nome do cluster: deve ser um nome DNS válido. Ao fazer isso, você não confundirá mais seus clusters, poderá compartilhar clusters com seus colegas de forma inequívoca e alcançá-los sem ter de lembrar de um endereço IP.

Você pode e provavelmente deve usar subdomínios para dividir seus clusters. Como nosso exemplo usaremos
`useast1.dev.example.com`.  O endpoint do servidor de API será então `api.useast1.dev.example.com`.

Uma zona hospedada do Route53 pode servir subdomínios. Sua zona hospedada pode ser `useast1.dev.example.com`,
mas também `dev.example.com` ou até `example.com`.  kops funciona com qualquer um deles, então normalmente você escolhe por motivos de organização (por exemplo, você tem permissão para criar registros em `dev.example.com`,
mas não em `example.com`).

Vamos supor que você esteja usando `dev.example.com` como sua zona hospedada.  Você cria essa zona hospedada usando o [processo normal](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/CreatingNewSubdomain.html), ou
com um comando como `aws route53 create-hosted-zone --name dev.example.com --caller-reference 1`.

Você deve então configurar seus registros NS no domínio principal, para que os registros no domínio sejam resolvidos. Aqui, você criaria registros NS no `example.com` para `dev`.  Se for um nome de domínio raiz, você configuraria os registros NS em seu registrador de domínio (por exemplo `example.com`,  precisaria ser configurado onde você comprou `example.com`).

Verifique a configuração do seu domínio route53 (é a causa número 1 de problemas!). Você pode verificar novamente se seu cluster está configurado corretamente se tiver a ferramenta dig executando:

`dig NS dev.example.com`

Você deve ver os 4 registros NS que o Route53 atribuiu à sua zona hospedada.

### (3/5) Crie um bucket do S3 para armazenar o estado dos clusters

O kops permite que você gerencie seus clusters mesmo após a instalação. Para fazer isso, ele deve acompanhar os clusters que você criou, juntamente com suas configurações, as chaves que estão usando etc. Essas informações são armazenadas em um bucket do S3. As permissões do S3 são usadas para controlar o acesso ao bucket.

Vários clusters podem usar o mesmo bucket do S3 e você pode compartilhar um bucket do S3 entre seus colegas que administram os mesmos clusters - isso é muito mais fácil do que transmitir arquivos kubecfg. Mas qualquer pessoa com acesso ao bucket do S3 terá acesso administrativo a todos os seus clusters, portanto, você não deseja compartilhá-lo além da equipe de operações.

Portanto, normalmente você tem um bucket do S3 para cada equipe de operações (e geralmente o nome corresponderá ao nome da zona hospedada acima!)

Em nosso exemplo, escolhemos `dev.example.com` como nossa zona hospedada, então vamos escolher `clusters.dev.example.com` como o nome do bucket do S3.

* Exporte `AWS_PROFILE` (se precisar selecione um perfil para que a AWS CLI funcione)

* Crie o bucket do S3 usando `aws s3 mb s3://clusters.dev.example.com`

* Você pode rodar `export KOPS_STATE_STORE=s3://clusters.dev.example.com` e, em seguida, o kops usará esse local por padrão. Sugerimos colocar isso em seu perfil bash ou similar.

### (4/5) Crie sua configuração de cluster

Execute `kops create cluster` para criar sua configuração de cluster:

`kops create cluster --zones=us-east-1c useast1.dev.example.com`

kops criará a configuração para seu cluster. Observe que ele _apenas_ cria a configuração, na verdade não cria os recursos de nuvem - você fará isso na próxima etapa com um arquivo `kops update cluster`.  Isso lhe dá a oportunidade de revisar a configuração ou alterá-la.

Ele exibe comandos que você pode usar para explorar mais:

* Liste seus clusters com: `kops get cluster`
* Edite este cluster com: `kops edit cluster useast1.dev.example.com`
* Edite seu grupo de instâncias de nós: `kops edit ig --name=useast1.dev.example.com nodes`
* Edite seu grupo de instâncias principal: `kops edit ig --name=useast1.dev.example.com master-us-east-1c`

Se esta é sua primeira vez usando kops, gaste alguns minutos para experimentá-los! Um grupo de instâncias é um conjunto de instâncias que serão registradas como nós do kubernetes. Na AWS, isso é implementado por meio de grupos de auto-scaling.
Você pode ter vários grupos de instâncias, por exemplo, se quiser nós que sejam uma combinação de instâncias spot e sob demanda ou instâncias de GPU e não GPU.

### (5/5) Crie o cluster na AWS

Execute `kops update cluster` para criar seu cluster na AWS:

`kops update cluster useast1.dev.example.com --yes`

Isso leva alguns segundos para ser executado, mas seu cluster provavelmente levará alguns minutos para estar realmente pronto.
`kops update cluster` será a ferramenta que você usará sempre que alterar a configuração do seu cluster; ele aplica as alterações que você fez na configuração ao seu cluster - reconfigurando AWS ou kubernetes conforme necessário.

Por exemplo, depois de você executar `kops edit ig nodes`, em seguida execute `kops update cluster --yes` para aplicar sua configuração e, às vezes, você também precisará `kops rolling-update cluster` para implementar a configuração imediatamente.

Sem `--yes`, `kops update cluster` mostrará uma prévia do que ele fará. Isso é útil para clusters de produção!

### Explore outros complementos

Consulte a [lista de complementos](/pt-br/docs/concepts/cluster-administration/addons/) para explorar outros complementos, incluindo ferramentas para registro, monitoramento, política de rede, visualização e controle de seu cluster Kubernetes.

## Limpeza

* Para excluir seu cluster: `kops delete cluster useast1.dev.example.com --yes`

## {{% heading "whatsnext" %}}

* Saiba mais sobre os [conceitos do Kubernetes](/pt-br/docs/concepts/) e o [`kubectl`](/docs/reference/kubectl/).
* Saiba mais sobre o [uso avançado](https://kops.sigs.k8s.io/) do `kOps` para tutoriais, práticas recomendadas e opções de configuração avançada.
* Siga as discussões da comunidade do `kOps` no Slack: [discussões da comunidade](https://github.com/kubernetes/kops#other-ways-to-communicate-with-the-contributors).
* Contribua para o `kOps` endereçando ou levantando um problema [GitHub Issues](https://github.com/kubernetes/kops/issues).
