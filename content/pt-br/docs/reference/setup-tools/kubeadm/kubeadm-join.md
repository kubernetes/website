---
title: kubeadm join
content_type: concept
weight: 30
---
<!-- overview -->
Este comando inicializa um nó de processamento do Kubernetes e o associa ao
cluster.

<!-- body -->
{{< include "generated/kubeadm_join.md" >}}

### Fluxo do comando `join` {#join-workflow}

O comando `kubeadm join` inicializa um nó de processamento ou um nó da camada
de gerenciamento e o adiciona ao cluster. Esta ação consiste nos seguintes passos
para nós de processamento:

1. O kubeadm baixa as informações necessárias do cluster através servidor da API.
   Por padrão, o token de autoinicialização e o _hash_ da chave da autoridade de
   certificação (CA) são utilizados para verificar a autenticidade dos dados
   baixados. O certificado raiz também pode ser descoberto diretamente através
   de um arquivo ou URL.

1. Uma vez que as informações do cluster são conhecidas, o kubelet pode começar
   o processo de inicialização TLS.

   A inicialização TLS utiliza o token compartilhado para autenticar
   temporariamente com o servidor da API do Kubernetes a fim de submeter uma
   requisição de assinatura de certificado (_certificate signing request_, ou
   CSR); por padrão, a camada de gerenciamento assina essa requisição CSR
   automaticamente.

1. Por fim, o kubeadm configura o kubelet local para conectar no servidor da API
   com a identidade definitiva atribuída ao nó.

Para nós da camada de gerenciamento, passos adicionais são executados:

1. O download de certificados compartilhados por todos os nós da camada de
   gerenciamento (quando explicitamente solicitado pelo usuário).

1. Geração de manifestos, certificados e arquivo kubeconfig para os componentes
   da camada de gerenciamento.

1. Adição de um novo membro local do etcd.

### Utilizando fases de associação com o kubeadm {#join-phases}

O kubeadm permite que você associe um nó a um cluster em fases utilizando
`kubeadm join phase`.

Para visualizar a lista ordenada de fases e subfases disponíveis, você pode
executar o comando `kubeadm join --help`. A lista estará localizada no topo da
tela da ajuda e cada fase terá uma descrição ao lado. Note que ao chamar
`kubeadm join` todas as fases e subfases serão executadas nesta ordem exata.

Algumas fases possuem opções únicas, portanto, se você desejar ver uma lista das
opções disponíveis, adicione a _flag_ `--help`. Por exemplo:

```shell
kubeadm join phase kubelet-start --help
```

De forma semelhante ao comando
[`kubeadm init phase`](/pt-br/docs/reference/setup-tools/kubeadm/kubeadm-init/#init-phases),
`kubeadm join phase` permite que você ignore uma lista de fases utilizando a
opção `--skip-phases`.

Por exemplo:

```shell
sudo kubeadm join --skip-phases=preflight --config=config.yaml
```

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

Alternativamente, você pode utilizar o campo `skipPhases` no manifesto
`JoinConfiguration`.

### Descobrindo em qual autoridade de certificação (CA) do cluster confiar

A descoberta do kubeadm tem diversas opções, cada uma com suas próprias
contrapartidas de segurança. O método correto para o seu ambiente depende de
como você aprovisiona seus nós e as expectativas de segurança que você tem a
respeito da rede e ciclo de vida dos seus nós.

#### Descoberta baseada em token com fixação da autoridade de certificação (CA)

Este é o modo padrão do kubeadm. Neste modo, o kubeadm baixa a configuração do
cluster (incluindo a CA raiz) e a valida, utilizando o token, além de verificar
que a chave pública da CA raiz corresponda ao _hash_ fornecido e que o
certificado do servidor da API seja válido sob a CA raiz.

O _hash_ da chave pública da CA tem o formato `sha256:<hash_codificado_em_hexa>`.
Por padrão, o valor do _hash_ é retornado no comando `kubeadm join` impresso ao
final da execução de `kubeadm init` ou na saída do comando
`kubeadm token create --print-join-command`. Este _hash_ é gerado em um formato
padronizado (veja a [RFC7469](https://tools.ietf.org/html/rfc7469#section-2.4))
e pode também ser calculado com ferramentas de terceiros ou sistemas de
provisionamento. Por exemplo, caso deseje utilizar a ferramenta de linha de
comando do OpenSSL:

```shell
openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | openssl dgst -sha256 -hex | sed 's/^.* //'
```

**Exemplos de comandos `kubeadm join`:**

Para nós de processamento:

```shell
kubeadm join --discovery-token abcdef.1234567890abcdef --discovery-token-ca-cert-hash sha256:1234..cdef 1.2.3.4:6443
```

Para nós da camada de gerenciamento:

```shell
kubeadm join --discovery-token abcdef.1234567890abcdef --discovery-token-ca-cert-hash sha256:1234..cdef --control-plane 1.2.3.4:6443
```

Você também pode executar o comando `join` para um nó da camada de gerenciamento
com a opção `--certificate-key` para copiar certificados para este nó, caso o
comando `kubeadm init` tenha sido executado com a opção `--upload-certs`.

**Vantagens:**

- Permite à inicialização dos nós descobrir uma raiz de confiança para a camada
  de gerenciamento mesmo que outros nós de processamento ou a rede estejam
  comprometidos.

- É conveniente para ser executado manualmente pois toda a informação requerida
  cabe num único comando `kubeadm join`.

**Desvantagens:**

- O _hash_ da autoridade de certificação normalmente não está disponível até que
  a camada de gerenciamento seja aprovisionada, o que pode tornar mais difícil
  a criação de ferramentas de aprovisionamento automatizadas que utilizem o
  kubeadm. Uma alternativa para evitar esta limitação é gerar sua autoridade de
  certificação de antemão.

#### Descoberta baseada em token sem fixação da autoridade de certificação (CA)

Este modo depende apenas do token simétrico para assinar (HMAC-SHA256) a
informação de descoberta que estabelece a raiz de confiança para a camada de
gerenciamento. Para utilizar este modo, os nós que estão se associando ao cluster
devem ignorar a validação do _hash_ da chave pública da autoridade de
certificação, utilizando a opção `--discovery-token-unsafe-skip-ca-verification`.
Você deve considerar o uso de um dos outros modos quando possível.

**Exemplo de comando `kubeadm join`:**

```shell
kubeadm join --token abcdef.1234567890abcdef --discovery-token-unsafe-skip-ca-verification 1.2.3.4:6443
```

**Vantagens:**

- Ainda protege de muitos ataques a nível de rede.

- O token pode ser gerado de antemão e compartilhado com os nós da camada de
  gerenciamento e de processamento, que por sua vez podem inicializar-se em
  paralelo, sem coordenação. Isto permite que este modo seja utilizado em muitos
  cenários de aprovisionamento.

**Desvantagens:**

- Se um mau ator conseguir roubar um token de inicialização através de algum tipo
  de vulnerabilidade, este mau ator conseguirá utilizar o token (juntamente com
  accesso a nível de rede) para personificar um nó da camada de gerenciamento
  perante os outros nós de processamento. Esta contrapartida pode ou não ser
  aceitável no seu ambiente.

#### Descoberta baseada em arquivos ou HTTPS

Este modo fornece uma maneira alternativa de estabelecer uma raiz de confiança
entre os nós da camada de gerenciamento e os nós de processamento. Considere
utilizar este modo se você estiver construindo uma infraestrutura de
aprovisionamento automático utilizando o kubeadm. O formato do arquivo de
descoberta é um arquivo [kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
comum do Kubernetes.

Caso o arquivo de descoberta não contenha credenciais, o token de descoberta TLS
será utilizado.

**Exemplos de comandos `kubeadm join`:**

- `kubeadm join --discovery-file caminho/para/arquivo.conf` (arquivo local)

- `kubeadm join --discovery-file https://endereco/arquivo.conf` (URL HTTPS remota)

**Vantagens:**

- Permite à inicialização dos nós descobrir uma raiz de confiança de forma segura
  para que a camada de gerenciamento utilize mesmo que a rede ou outros nós de
  processamento estejam comprometidos.

**Desvantagens:**

- Requer que você tenha uma forma de carregar a informação do nó da camada de
  gerenciamento para outros nós em inicialização. Se o arquivo de descoberta
  contém credenciais, você precisa mantê-lo secreto e transferi-lo através de
  um canal de comunicação seguro. Isto pode ser possível através do seu provedor
  de nuvem ou ferramenta de aprovisionamento.

### Tornando sua instalação ainda mais segura {#securing-more}

Os valores padrão de instalação do kubeadm podem não funcionar para todos os
casos de uso. Esta seção documenta como tornar uma instalação mais segura, ao
custo de usabilidade.

#### Desligando a auto-aprovação de certificados de cliente para nós

Por padrão, um auto-aprovador de requisições CSR está habilitado. Este
auto-aprovador irá aprovar quaisquer requisições de certificado de cliente para
um kubelet quando um token de autoinicialização for utilizado para autenticação.
Se você não deseja que o cluster aprove automaticamente certificados de cliente
para os kubelets, você pode desligar a auto-aprovação com o seguinte comando:

```shell
kubectl delete clusterrolebinding kubeadm:node-autoapprove-bootstrap
```

Após o desligamento da auto-aprovação, o comando `kubeadm join` irá aguardar até
que o administrador do cluster aprove a requisição CSR:

1. Utilizando o comando `kubeadm get csr`, você verá que o CSR original está em
   estado pendente.

   ```shell
   kubectl get csr
   ```

   A saída é semelhante a:

   ```
   NAME                                                   AGE       REQUESTOR                 CONDITION
   node-csr-c69HXe7aYcqkS1bKmH4faEnHAWxn6i2bHZ2mD04jZyQ   18s       system:bootstrap:878f07   Pending
   ```

1. O comando `kubectl certificate approve` permite ao administrador aprovar o
   CSR. Esta ação informa ao controlador de assinatura de certificados que este
   deve emitir um certificado para o requerente com os atributos requeridos no
   CSR.

   ```shell
   kubectl certificate approve node-csr-c69HXe7aYcqkS1bKmH4faEnHAWxn6i2bHZ2mD04jZyQ
   ```

   A saída é semelhante a:

   ```
   certificatesigningrequest "node-csr-c69HXe7aYcqkS1bKmH4faEnHAWxn6i2bHZ2mD04jZyQ" approved
   ```

1. Este comando muda o estado do objeto CSR para o estado ativo.

   ```shell
   kubectl get csr
   ```

   A saída é semelhante a:

   ```
   NAME                                                   AGE       REQUESTOR                 CONDITION
   node-csr-c69HXe7aYcqkS1bKmH4faEnHAWxn6i2bHZ2mD04jZyQ   1m        system:bootstrap:878f07   Approved,Issued
   ```

Esta mudança força com que o fluxo do comando `kubeadm join` seja bem-sucedido
somente quando o comando `kubectl certificate approve` for executado.

#### Desligando o acesso público ao ConfigMap `cluster-info`

Para que o fluxo de associação de um nó ao cluster seja possível utilizando
somente um token como a única informação necessária para validação, um ConfigMap
com alguns dados necessários para validação da identidade do nó da camada de
gerenciamento é exposto publicamente por padrão. Embora nenhum dado deste
ConfigMap seja privado, alguns usuários ainda podem preferir bloquear este
acesso. Mudar este acesso bloqueia a habilidade de utilizar a opção
`--discovery-token` do fluxo do comando `kubeadm join`. Para desabilitar este
acesso:

* Obtenha o arquivo `cluster-info` do servidor da API:

```shell
kubectl -n kube-public get cm cluster-info -o jsonpath='{.data.kubeconfig}' | tee cluster-info.yaml
```

A saída é semelhante a:

```yaml
apiVersion: v1
kind: Config
clusters:
- cluster:
    certificate-authority-data: <ca-cert>
    server: https://<ip>:<port>
  name: ""
contexts: []
current-context: ""
preferences: {}
users: []
```

* Utilize o arquivo `cluster-info.yaml` como um argumento para o comando
`kubeadm join --discovery-file`.

* Desligue o acesso público ao ConfigMap `cluster-info`:

```shell
kubectl -n kube-public delete rolebinding kubeadm:bootstrap-signer-clusterinfo
```

Estes comandos devem ser executados após `kubeadm init`, mas antes de
`kubeadm join`.

### Utilizando `kubeadm join` com um arquivo de configuração {#config-file}

{{< caution >}}
O arquivo de configuração ainda é considerado beta e pode mudar em versões
futuras.
{{< /caution >}}

É possível configurar o comando `kubeadm join` apenas com um arquivo de
configuração, em vez de utilizar opções de linha de comando, e algumas
funcionalidades avançadas podem estar disponíveis somente como opções no arquivo
de configuração. Este arquivo é passado através da opção `--config` e deve conter
uma estrutura `JoinConfiguration`. A utilização da opção `--config` com outras
opções da linha de comando pode não ser permitida em alguns casos.

A configuração padrão pode ser emitida utilizando o comando
[kubeadm config print](/pt-br/docs/reference/setup-tools/kubeadm/kubeadm-config/#cmd-config-print).

Caso sua configuração não esteja utilizando a versão mais recente, é
**recomendado** que você migre utilizando o comando
[kubeadm config migrate](/pt-br/docs/reference/setup-tools/kubeadm/kubeadm-config/#cmd-config-migrate).

Para mais informações sobre os campos e utilização da configuração você pode
consultar a [referência da API](/docs/reference/config-api/kubeadm-config.v1beta3/).

## {{% heading "whatsnext" %}}

* [kubeadm init](/pt-br/docs/reference/setup-tools/kubeadm/kubeadm-init/) para
  inicializar um nó da camada de gerenciamento do Kubernetes.
* [kubeadm token](/pt-br/docs/reference/setup-tools/kubeadm/kubeadm-token/) para
  gerenciar tokens utilizados no comando `kubeadm join`.
* [kubeadm reset](/pt-br/docs/reference/setup-tools/kubeadm/kubeadm-reset/) para
  reverter quaisquer mudanças feitas nesta máquina pelos comandos `kubeadm init`
  ou `kubeadm join`.
