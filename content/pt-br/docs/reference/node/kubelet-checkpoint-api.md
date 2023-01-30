---
content_type: "referência"
título: API de Checkpoint do Kubelet
weight: 10
---


{{< feature-state for_k8s_version="v1.25" state="alpha" >}}

Verificar um contêiner é a funcionalidade de criar uma cópia com estado de um contêiner em execução. Uma vez que você tem uma cópia com estado de um contêiner, você pode movê-lo para um computador diferente para depuração ou fins semelhantes.

Se você mover os dados do contêiner verificado para um computador que seja capaz de restaurá-lo, esse contêiner restaurado continua a ser executado exatamente no mesmo ponto em que foi verificado. Você também pode inspecionar os dados salvos, desde que tenha ferramentas adequadas para isso.

Criando um ponto de verificação de um contêiner pode ter implicações de segurança. Normalmente
um ponto de verificação contém todas as páginas de memória de todos os processos no contêiner
verificado. Isso significa que tudo o que costumava estar na memória agora está disponível
no disco local. Isso inclui todos os dados privados e possivelmente chaves usadas para
criptografia. As implementações CRI subjacentes (o tempo de execução do contêiner nesse nó)
deve criar o arquivo de verificação para ser acessível apenas pelo usuário `root`. Ainda é importante lembrar que se o arquivo de verificação for transferido para outro
sistema todas as páginas de memória serão legíveis pelo proprietário do arquivo de verificação.

## Operações {#operations}

### `post` verificar o contêiner especificado {#post-checkpoint}

Diga ao kubelet para verificar um contêiner específico do Pod especificado.

Consulte a [referência de autenticação/autorização do Kubelet](/docs/reference/access-authn-authz/kubelet-authn-authz)
para obter mais informações sobre como o acesso à interface de verificação do kubelet é
controlado.

O kubelet solicitará um ponto de verificação da implementação subjacente
{{<glossary_tooltip term_id="cri" text="CRI">}}. Na solicitação de verificação
o kubelet especificará o nome do arquivo de verificação como
`checkpoint-<podFullName>-<containerName>-<timestamp>.tar` e também solicitará para
armazenar o arquivo de verificação no diretório `checkpoints` abaixo do seu diretório raiz
diretório (como definido por `--root-dir`). Isso é padrão
`/var/lib/kubelet/checkpoints`.

O arquivo de verificação é no formato _tar_ e pode ser listado usando uma implementação de
[`tar`](https://pubs.opengroup.org/onlinepubs/7908799/xcu/tar.html). O conteúdo do arquivo

#### Requisição HTTP {#post-checkpoint-request}

POST /checkpoint/{namespace}/{pod}/{container}

#### Parâmetros {#post-checkpoint-params}

- **namespace** (*in path*): string, requerido

  {{< glossary_tooltip term_id="namespace" >}}

- **pod** (*in path*): string, requirido

  {{< glossary_tooltip term_id="pod" >}}

- **container** (*in path*): string, requerido

  {{< glossary_tooltip term_id="container" >}}

- **timeout** (*in query*): integer

  Tempo limite em segundos para aguardar até que a criação do ponto de verificação seja concluída. Se zero ou nenhum tempo limite for especificado, o valor padrão do tempo limite da {{<glossary_tooltip term_id="cri" text="CRI">}} será usado. A criação do ponto de verificação depende diretamente da memória usada pelo contêiner. Quanto mais memória um contêiner usa, mais tempo é necessário para criar o ponto de verificação correspondente.
  
#### Resposta {#post-checkpoint-response}

200: OK

401: Unauthorized

404: Not Found (se o `ContainerCheckpoint` feature gate estiver desativado)

404: Not Found (se o `namespace`, `pod` ou `container` especificado não puder ser encontrado)

500: Internal Server Error (se a implementação CRI encontrar um erro durante a verificação (veja a mensagem de erro para obter mais detalhes))

500: Internal Server Error (se a implementação CRI não implementar a API de verificação CRI (veja a mensagem de erro para obter mais detalhes))

{{< comment >}}
TODO: Add more information about return codes once CRI implementation have checkpoint/restore.
      This TODO cannot be fixed before the release, because the CRI implementation need
      the Kubernetes changes to be merged to implement the new ContainerCheckpoint CRI API
      call. We need to wait after the 1.25 release to fix this.
{{< /comment >}}