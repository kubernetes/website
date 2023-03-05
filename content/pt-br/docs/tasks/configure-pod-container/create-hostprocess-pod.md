---
title: Crie um Pod de HostProcess do Windows
content_type: task
weight: 20
min-kubernetes-server-version: 1.23
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="beta" >}}

Os contêineres de HostProcess do Windows permitem que você execute
cargas de trabalho em um host Windows contêinerizado. Esses contêineres operam como
processos normais, mas têm acesso à rede host do namespace,
armazenamento e dispositivos, quando recebem os privilégios de usuário apropriados.
Os contêineres HostProcess podem ser usados para implantar plugins de rede,
configurações de armazenamento, plugins de dispositivos, kube-proxy, e outros
componentes para nós do Windows, sem a necessidade de *proxies* dedicados ou
a instalação direta dos serviços de host.

Tarefas administrativas, como a instalação de correções de segurança, 
coleta de logs de eventos, e mais podem ser realizadas sem a necessidade 
de que operadores de cluster façam login em cada nó. 
Contêineres `HostProcess` podem ser executados como qualquer usuário 
que esteja disponível no host ou esteja no domínio da máquina host, 
permitindo aos administradores restringirem o acesso aos recursos, 
por meio de permissões de usuário. Enquanto nenhum sistema de arquivos 
ou isolamento de processos são suportados, um novo volume é criado no host 
ao iniciar o contêiner para fornecer um espaço de trabalho limpo e consolidado. 
Contêineres `HostProcess` também podem ser construídos sobre as imagens base 
do Windows existente, e não herdam os mesmos
[requisitos de compatibilidade](https://docs.microsoft.com/virtualization/windowscontainers/deploy-containers/version-compatibility)
como contêineres do `Windows Server`, o que significa que a versão das 
imagens base não precisa combinar com a do host. É, no entanto, 
recomendado que você use a mesma versão da imagem base como seu
servidor Windows de cargas de trabalho, para garantir que você não tenha 
nenhuma imagem não utilizada ocupando espaço no nó. Contêineres HostProcess 
também suportam [montagem de volume](#volume-mounts) dentro do volume do contêiner.

### Quando devo usar um contêiner do Windows HostProcess?

- Quando você precisar executar tarefas que exigem o namespace de rede do host.
Contêineres HostProcess tem acesso às interfaces de rede e endereços IP do host.
- Você precisa acessar recursos no host como o sistema de arquivos, 
os logs de eventos, etc.
- Instalação de drivers de dispositivo específicos ou serviços Windows.
- Consolidação de tarefas administrativas e políticas de segurança. 
Isso reduz o grau de privilégios necessários para os nós do Windows.


## {{% heading "prerequisites" %}}

<!-- change this when graduating to stable -->

Este guia de tarefas é específica para o Kubernetes v{{< skew currentVersion >}}.
Se você não está executando o Kubernetes v{{< skew currentVersion >}}, 
verifique a documentação para essa versão do Kubernetes.

No Kubernetes {{< skew currentVersion >}}, O recurso de contêiner do HostProcess 
é ativado por padrão. 
O kubelet irá comunicar-se com o contêiner diretamente passando a flag HostProcess 
via `CRI`. Você pode usar a versão mais recente do containerd (v1.6+) para executar 
contêineres HostProcess.
[Como instalar o containerd.](/docs/setup/production-environment/container-runtimes/#containerd)

Para *desabilitar* contêineres HostProcess você precisa passar a seguinte flag 
de `feature gate` para o **kubelet** e **kube-apiserver**:

```powershell
--feature-gates=WindowsHostProcessContainers=false
```

Veja a documentação [Feature gates](/docs/reference/command-line-tools-reference/feature-gates/#overview)
para mais detalhes.



## Limitações

Essas limitações são relevantes para o Kubernetes v{{< skew currentVersion >}}:

- Contêineres HostProcess requerem o agente de execução de contêiner containerd 1.6 ou mais recente
  {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}.
- Pods HostProcess só podem conter contêineres HostProcess. Esta é uma limitação atual
  do sistema operacional Windows; Contêineres do Windows sem privilégios não podem 
  compartilhar um vNIC com o IP do host no namespace.
- Contêineres HostProcess executam como um processo do host e não tem nenhum grau de
  isolamento, além das restrições de recursos impostas à conta de usuário do HostProcess. 
  Nem o sistema de arquivos nem o isolamento Hyper-V são suportados para contêineres 
  HostProcess.
- `Volume mounts` são suportados e são montados dentro do volume do contêiner. Veja
  [Volume Mounts](#volume-mounts)
- Um conjunto limitado de contas de usuário do host está disponível para os contêineres 
  HostProcess por padrão.
  Veja [Escolhendo uma conta de usuário](#choosing-a-user-account).
- Limites de recursos (disco, memória, número de cpus) são suportados da mesma maneira 
  que os processos no host.
- Ambos `montagens de pipe nomeado` e `soquetes de domínio Unix` **não** são suportados e devem
  ser acessados através de seu caminho no host (ex. \\\\.\\pipe\\\*)

## Pod HostProcess requisitos de configuração

Habilitar um Pod do Windows HostProcess requer a definição das configurações corretas 
de segurança na configuração do Pod. Entre as políticas definidas no 
[padrões de segurança de Pod](/docs/concepts/security/pod-security-standards)
Pods HostProcess não são permitidos nas políticas `baseline` e `restricted`. 
É, portanto, recomendado que estes pods HostProcess executem em alinhamento 
com o perfil `privileged`.

Ao executar sob a política privilegiada, as configurações a seguir precisam 
ser definidas para permitir a criação de um Pod HostProcess:

<table>
  <caption style="display: none">Especificação de politica privilegiada</caption>
  <thead>
    <tr>
      <th>Controle</th>
      <th>Política</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="white-space: nowrap"><a href="/docs/concepts/security/pod-security-standards"><tt>securityContext.windowsOptions.hostProcess</tt></a></td>
      <td>
        <p>Os pods do Windows oferecem a capacidade de excutar pods <a href="/docs/tasks/configure-pod-container/create-hostprocess-pod">
        contêineres HostProcess </a> que permite acesso privilegiado ao nó do Windows. </p>
        <p><strong>Valores Permitidos</strong></p>
        <ul>
          <li><code>true</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td style="white-space: nowrap"><a href="/docs/concepts/security/pod-security-standards"><tt>hostNetwork</tt></a></td>
      <td>
        <p>Estará na rede do host por padrão inicialmente. Suportar
         definir a rede para um compartimento diferente pode ser desejável no futuro.</p>
        <p><strong>Valores Permitidos</strong></p>
        <ul>
          <li><code>true</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td style="white-space: nowrap"><a href="/docs/tasks/configure-pod-container/configure-runasusername/"><tt>securityContext.windowsOptions.runAsUsername</tt></a></td>
      <td>
        <p>Especificação de qual usuário o contêiner HostProcess deve ser executado conforme necessário para a especificação de pod.</p>
        <p><strong>Valores Permitidos</strong></p>
        <ul>
          <li><code>NT AUTHORITY\SYSTEM</code></li>
          <li><code>NT AUTHORITY\Local service</code></li>
          <li><code>NT AUTHORITY\NetworkService</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td style="white-space: nowrap"><a href="/docs/concepts/security/pod-security-standards"><tt>runAsNonRoot</tt></a></td>
      <td>
        <p>Devido aos contêineres HostProcess terem acesso privilegiado ao host, o <tt>runAsNonRoot</tt> campo não pode ser definido como `true`.</p>
        <p><strong>Valores Permitidos</strong></p>
        <ul>
          <li>Undefined/Nil</li>
          <li><code>false</code></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

### Manifesto de Exemplo (excerto) {#manifest-example}

```yaml
spec:
  securityContext:
    windowsOptions:
      hostProcess: true
      runAsUserName: "NT AUTHORITY\\Local service"
  hostNetwork: true
  containers:
  - name: test
    image: image1:latest
    command:
      - ping
      - -t
      - 127.0.0.1
  nodeSelector:
    "kubernetes.io/os": windows
```

## Volume mounts

Contêineres HostProcess suportam a capacidade de montar volumes dentro do espaço 
de volume do contêiner.
As aplicações em execução dentro do contêiner podem acessar montagens de volume 
diretamente por meio de caminhos relativos ou absolutos. Uma variável de ambiente 
`$CONTAINER_SANDBOX_MOUNT_POINT` é definida na criação de contêineres, e fornece 
o caminho absoluto do host para o volume do contêiner. Caminhos relativos 
são baseados na configuração `.spec.containers.volumeMounts.mountPath`.

### Exemplo {#volume-mount-example}

Para acessar os tokens da conta de serviço, as seguintes estruturas de caminho 
são suportadas no contêiner:

`.\var\run\secrets\kubernetes.io\serviceaccount\`

`$CONTAINER_SANDBOX_MOUNT_POINT\var\run\secrets\kubernetes.io\serviceaccount\`

## Limites de recursos

Limites de recursos (disco, memória, número de cpus) são aplicados ao job todo.
Por exemplo, com um limite de 10MB definido, a memória alocada para qualquer 
objeto job HostProcess será limitado em 10MB. 
Este é o mesmo comportamento que outros tipos de contêiner do Windows.
Esses limites seriam especificados da mesma maneira que são atualmente, para qualquer 
orquestrador ou agente de execução sendo usado. A única diferença está no cálculo do uso 
de recursos de disco usados para rastreamento de recursos, devido à diferença em 
como contêineres HostProcess são inicializados.

## Escolha uma conta de usuário

Contêineres HostProcess tem a capacidade de executar como uma das três contas 
de serviço do Windows suportadas:

- **[LocalSystem](https://learn.microsoft.com/pt-br/windows/win32/services/localsystem-account)**
- **[LocalService](https://learn.microsoft.com/pt-br/windows/win32/services/localservice-account)**
- **[NetworkService](https://learn.microsoft.com/pt-br/windows/win32/services/networkservice-account)**

Você deve selecionar uma conta de serviço do Windows apropriada para cada 
contêiner HostProcess, com o objetivo de limitar o grau de privilégios, 
a fim de evitar danos acidentais (ou até maliciosos) ao host. O serviço de conta 
`LocalSystem` tem o mais alto nível de privilégio dos três, e deve ser usado apenas 
se absolutamente necessário. Sempre que possível, 
use a conta do serviço `LocalService`, pois é o menos privilegiado das três opções.

## Solução de problemas de contêineres de HostProcess

- Contêineres HostProcess falham na inicialização com `failed to create user process token: failed to logon user: Access is denied.: unknown`

  Verifique se o contêiner está executando como a conta de serviço 
  `LocalSystem` ou `LocalService`. Contas de usuário (mesmo contas de administrador) 
  não tem permissões para criar tokens de logon para qualquer uma das [contas de usuários](#choosing-a-user-account) suportadas.
  