---
title: Configurando GMSA Para Pods e Contêineres Windows
content_type: task
weight: 20
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

Esta página mostra como configurar [Contas de serviço gerenciadas em grupo](https://docs.microsoft.com/pt-br/windows-server/security/group-managed-service-accounts/group-managed-service-accounts-overview) (GMSA) 
para Pods e contêineres que vão executar em nós Windows. Contas de serviço gerenciadas em grupo 
são um tipo específico de conta do Active Directory que provê gerenciamento automático 
de senhas, gerenciamento simplificado de *service principal name* (SPN), e a habilidade 
de delegar o gerenciamento a outros administradores através de múltiplos servidores.

No Kubernetes, especificações de credenciais GMSA são configuradas dentro do escopo 
do cluster Kubernetes como recursos personalizados. Os Pods Windows, assim como contêineres 
individuais dentro de um Pod, podem ser configurados para usar as funções GMSA 
baseadas em domínio (exemplo: autenticação Kerberos) quando interagirem com outros 
serviços Windows.

## {{% heading "prerequisites" %}}

Você precisa ter um cluster Kubernetes, e a ferramenta de linha de comando `kubectl` 
precisa estar configurada para comunicar-se com seu cluster.
O cluster deve possuir nós de carga de trabalho Windows. 
Esta seção cobre o conjunto inicial de passos requeridos para cada cluster:

### Instale o CRD GMSACredentialSpec

Uma [CustomResourceDefinition](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/) (CRD) para a especificação de recursos de credencial GMSA precisa ser configurada no cluster, para definir o tipo de recurso do cliente `GMSACredentialSpec`. Faça o download do [YAML](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/gmsa-crd.yml) do CRD de GMSA 
e salve como gmsa-crd.yaml.
A seguir, instale o CRD com `kubectl apply -f gmsa-crd.yaml`.

### Instale webhooks para validar usuários GMSA

Dois webhooks precisam ser configurados no cluster Kubernetes para popular e validar 
as referências de especificação de credenciais GMSA no nível do Pod ou contêiner:

1. Um webhook de mutação que expanda as referências para as GMSAs,
(por nome a partir de uma especificação de Pod) em uma especificação de credencial completa 
em formato JSON dentro da especificação do Pod.

1. Um webhook de validação garante que todas as referências para GMSAs estão 
autorizadas a serem usadas pela conta de serviço do Pod.

A instalação dos webhooks acima e dos objetos associados requer as etapas abaixo: 

1. Crie um par de chaves de certificado (que será usado para permitir que o 
contêiner do webhook se comunique com o cluster)

1. Instale um Secret com o certificado acima.

1. Crie um Deployment para a lógica principal do webhook.

1. Crie as configurações de webhook de validação e de mutação, referentes ao Deployment.

Um [script](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/deploy-gmsa-webhook.sh) 
pode ser usado para implantar e configurar os webhooks GMSA e objetos associados 
mencionados acima. O script pode ser executado com a opção ```--dry-run=server``` 
para possibilitar que você possa revisar as alterações antes que sejam aplicadas 
no seu cluster.

O [template YAML](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/gmsa-webhook.yml.tpl) 
usado pelo script também pode ser usado para implantar os webhooks e objetos 
associados manualmente (com as substituições apropriadas para os parâmetros).

<!-- steps -->

## Configurar GMSAs e nós Windows em Active Directory

Antes que os Pods no Kubernetes possam ser configurados para usar GMSAs, as GMSAs apropriadas precisam ser provisionadas no Active Directory como descrito na 
[documentação de GMSA do Windows](https://docs.microsoft.com/pt-br/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts#BKMK_Step1). 
Nós de carga de trabalho Windows (que são parte do cluster Kubernetes) precisam ser configurados no 
Active Directory para acessar as credenciais secretas associadas com a GMSA apropriada, 
como descrito na [documentação de GMSA do Windows](https://docs.microsoft.com/pt-br/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts#to-add-member-hosts-using-the-set-adserviceaccount-cmdlet).

## Crie recursos de especificação de GMSA

Com o CRD GMSACredentialSpec instalado (como descrito anteriormente), 
recursos customizados contendo recursos de especificação de credenciais GMSA podem 
ser configurados. A especificação de credencial GMSA não contém dados secretos nem 
sensíveis. É informação que o agente de execução de contêiner pode usar para descrever a apropriada 
GMSA de um contêiner para o Windows. Especificações de credenciais GMSA podem 
ser geradas em formato YAML com o utilitário [PowerShell script](https://github.com/kubernetes-sigs/windows-gmsa/tree/master/scripts/GenerateCredentialSpecResource.ps1).

A seguir são os passos para gerar a especificação de credencial GMSA YAML 
manualmente, em formato JSON e então convertê-la para YAML:

1. Importar o [módulo `CredentialSpec`](https://github.com/MicrosoftDocs/Virtualization-Documentation/blob/live/windows-server-container-tools/ServiceAccounts/CredentialSpec.psm1): 
`ipmo CredentialSpec.psm1`

1. Crie a especificação da credencial em formato JSON usando `New-CredentialSpec`. 
Para criar a especificação da credencial GMSA nomeada WebApp1, 
execute `New-CredentialSpec -Name WebApp1 -AccountName WebApp1 -Domain $(Get-ADDomain -Current LocalComputer)`

1. Use `Get-CredentialSpec` para mostrar o caminho do arquivo JSON.

1. Converta o arquivo `credspec` de JSON para o formato YAML e aplique os campos 
de cabeçalho necessários `apiVersion`, `kind`, `metadata` e `credspec` para transformá-lo em 
uma instância do recurso customizado GMSACredentialSpec que pode ser configurado no Kubernetes.

A configuração YAML a seguir descreve as especificações de credencial GMSA nomeada 
`gmsa-WebApp1`:

```yaml
apiVersion: windows.k8s.io/v1
kind: GMSACredentialSpec
metadata:
  name: gmsa-WebApp1      #Este é um nome arbitrário, mas será usado como referência
credspec:
  ActiveDirectoryConfig:
    GroupManagedServiceAccounts:
    - Name: WebApp1       #Nome de usuário da conta GMSA
      Scope: CONTOSO      #Nome de Domínio NETBIOS
    - Name: WebApp1       #Nome de usuário da conta GMSA
      Scope: contoso.com  #Nome de domínio DNS
  CmsPlugins:
  - ActiveDirectory
  DomainJoinConfig:
    DnsName: contoso.com        #Nome de domínio DNS
    DnsTreeName: contoso.com    #Nome de domínio DNS raiz
    Guid: 244818ae-87ac-4fcd-92ec-e79e5252348a  #GUID
    MachineAccountName: WebApp1 #Nome de usuário da conta GMSA
    NetBiosName: CONTOSO        #Nome de domínio NETBIOS
    Sid: S-1-5-21-2126449477-2524075714-3094792973 #SID da GMSA
```

O recurso de especificação de credencial acima deve ser salvo como 
`gmsa-Webapp1-credspec.yaml` e aplicado no cluster usando: 
`kubectl apply -f gmsa-Webapp1-credspec.yml`

## Configure um ClusterRole para habilitar RBAC nas especificações de credenciais GMSA específicas

Uma ClusterRole precisa ser definida para cada recurso de especificação 
de credencial GMSA. Isto autoriza o verbo `use` em um recurso GMSA específico
por um sujeito, geralmente uma conta de serviço. O exemplo a seguir mostra 
um ClusterRole que autoriza o uso de credencial `gmsa-WebApp1` 
acima. Salve o arquivo como gmsa-webapp1-role.yaml e aplique 
usando `kubectl apply -f gmsa-webapp1-role.yaml`

```yaml
#Criando um Role para ler o credspec
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: webapp1-role
rules:
- apiGroups: ["windows.k8s.io"]
  resources: ["gmsacredentialspecs"]
  verbs: ["use"]
  resourceNames: ["gmsa-WebApp1"]
```

## Atribua o Role às contas de serviço para usar especificações de credencial GMSA específicas

Uma conta de serviço (com a qual os Pods virão configurados), precisa ser vinculada 
ao ClusterRole criado acima. Isto autoriza a conta de serviço a usar a especificação apropriada 
de recurso de credencial GMSA. O trecho a seguir mostra a conta de serviço padrão vinculada ao ClusterRole `webapp1-role`, para usar a especificação 
de recurso de credencial `gmsa-WebApp1` criada acima.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: allow-default-svc-account-read-on-gmsa-WebApp1
  namespace: default
subjects:
- kind: ServiceAccount
  name: default
  namespace: default
roleRef:
  kind: ClusterRole
  name: webapp1-role
  apiGroup: rbac.authorization.k8s.io
```

## Configure a especificação de recurso de credencial GMSA em uma especificação de Pod

O campo `securityContext.windowsOptions.gmsaCredentialSpecName` do Pod, é usado de referência para recursos customizados, em especificações 
de certificado GMSA apropriadas em especificações do Pod. 
Isto configura todos contêineres do Pod para usar GMSA. 
Uma amostra da anotação populada para referir-se a `gmsa-WebApp1`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    run: with-creds
  name: with-creds
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      run: with-creds
  template:
    metadata:
      labels:
        run: with-creds
    spec:
      securityContext:
        windowsOptions:
          gmsaCredentialSpecName: gmsa-webapp1
      containers:
      - image: mcr.microsoft.com/windows/servercore/iis:windowsservercore-ltsc2019
        imagePullPolicy: Always
        name: iis
      nodeSelector:
        kubernetes.io/os: windows
```

Contêineres individuais em uma especificação de Pod podem também indicar 
a credencial GMSA apropriada, usando o campo `securityContext.windowsOptions.gmsaCredentialSpecName` por contêiner. Por exemplo:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    run: with-creds
  name: with-creds
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      run: with-creds
  template:
    metadata:
      labels:
        run: with-creds
    spec:
      containers:
      - image: mcr.microsoft.com/windows/servercore/iis:windowsservercore-ltsc2019
        imagePullPolicy: Always
        name: iis
        securityContext:
          windowsOptions:
            gmsaCredentialSpecName: gmsa-Webapp1
      nodeSelector:
        kubernetes.io/os: windows
```

Assim que as especificações do Pod com os campos GMSA preenchidos 
(como descrito acima) são aplicadas em um cluster, ocorre a seguinte sequência de eventos:

1. O webhook de mutação resolve e expande todas as referências aos recursos de 
especificações de credenciais GMSA para o conteúdo das especificações de credenciais GMSA.

1. O webhook de validação garante que a conta de serviço associada ao Pod, seja autorizada 
para o verbo `use` na especificação GMSA especificada.

1. O agente de execução de contêiner configura cada contêiner do Windows com a especificação 
de credencial GMSA especificada, para que o contêiner possa assumir a identidade 
do GMSA no Active Directory, e tenha acesso aos serviços no domínio usando essa identidade.

## Autenticando para compartilhamentos de rede usando `hostname` ou FQDN

Se você estiver enfrentando problemas ao se conectar aos compartilhamentos SMB 
de Pods usando o hostname ou o FQDN, mas conseguindo acessar os compartilhamentos 
por meio de seu endereço IPv4, verifique se a chave do registro a seguir 
está definida nos nós Windows.

```cmd
reg add "HKLM\SYSTEM\CurrentControlSet\Services\hns\State" /v EnableCompartmentNamespace /t REG_DWORD /d 1
```

Os Pods em execução precisarão ser recriados para pegar as mudanças de comportamento.
Mais informações sobre como essa chave de registro é usada podem ser encontradas [aqui](https://github.com/microsoft/hcsshim/blob/885f896c5a8548ca36c88c4b87fd2208c8d16543/internal/uvm/create.go#L74-L83)

## Solução de problemas

Se você estiver tendo dificuldades para fazer com que o GMSA funcione em seu ambiente, 
existem algumas etapas de solução de problemas que você pode tentar.

Primeiro, verifique se a especificação de credencial foi passada para o Pod. Para fazer isso, 
você precisará rodar `kubectl exec` em um de seus Pods e verificar 
a saída do comando `nltest.exe /parentdomain`.  

No exemplo abaixo, o Pod não recebeu a especificação de credencial corretamente:

```PowerShell
kubectl exec -it iis-auth-7776966999-n5nzr powershell.exe
```

`nltest.exe /parentdomain` resulta no seguinte erro:

```output
Getting parent domain failed: Status = 1722 0x6ba RPC_S_SERVER_UNAVAILABLE
```

Se o seu Pod obteve a especificação de credencial corretamente, o próximo passo é 
verificar a comunicação com o domínio. Primeiro, de dentro do seu Pod, 
execute rapidamente um `nslookup` para encontrar a raiz do seu domínio.

Isso vai nos dizer 3 coisas:

1. O Pod pode chegar ao DC
1. O DC pode chegar ao Pod
1. O DNS está funcionando corretamente.

Se o DNS e o teste de comunicação passarem, em seguida, 
você precisará verificar se o Pod estabeleceu um canal de comunicação segura 
com o domínio. Para fazer isso, novamente, em seu Pod 
execute o comando `nltest.exe /query`.

```PowerShell
nltest.exe /query
```

Resulta na seguinte saída:

```output
I_NetLogonControl failed: Status = 1722 0x6ba RPC_S_SERVER_UNAVAILABLE
```

Isso nos diz que, por algum motivo, o Pod não conseguiu se logar no domínio 
usando a conta definida na especificação de credencial. Você pode tentar reparar 
o canal seguro executando o seguinte:

```PowerShell
nltest /sc_reset:domain.example
```

Se o comando for bem sucedido, você verá uma saída semelhante a esta:

```output
Flags: 30 HAS_IP  HAS_TIMESERV
Trusted DC Name \\dc10.domain.example
Trusted DC Connection Status Status = 0 0x0 NERR_Success
The command completed successfully
```

Se o excerto acima corrigir o erro, você poderá automatizar a etapa adicionando 
o seguinte `lifecycle hook` à sua especificação de Pod. Se não corrigiu o erro, você 
precisará examinar sua especificação de credencial novamente e confirmar que ela está correta e completa.

```yaml
        image: registry.domain.example/iis-auth:1809v1
        lifecycle:
          postStart:
            exec:
              command: ["powershell.exe","-command","do { Restart-Service -Name netlogon } while ( $($Result = (nltest.exe /query); if ($Result -like '*0x0 NERR_Success*') {return $true} else {return $false}) -eq $false)"]
        imagePullPolicy: IfNotPresent
```

Se você adicionar a seção `lifecycle`, mostrada acima à sua especificação de Pod, 
o Pod irá executar os comandos listados para reiniciar o serviço `netlogon` 
até que o comando `nltest.exe /query` execute sem erro.
