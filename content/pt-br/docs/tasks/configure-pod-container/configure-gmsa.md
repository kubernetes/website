---
title: Configurando GMSA Para Pods e Contêineres Windows
content_type: task
weight: 20
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

Esta página mostra como configurar [Contas de serviço gerenciadas em grupo]
(https://docs.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/group-managed-service-accounts-overview) (GMSA) 
para Pods e contêineres que vão executar em nós Windows. Contas de serviço gerenciadas em grupo 
são um tipo específico de conta do `Active Directory` que provê gerenciamento automático 
de senhas, gerenciamento simplificado de `service principal name` (SPN), e a habilidade 
de delegar o gerenciamento a outros administradores através de múltiplos servidores.

No Kubernetes, especificações de credenciais GMSA são configuradas dentro do escopo 
do cluster Kubernetes como recursos personalizados. Os Pods Windows, assim como contêineres 
individuais dentro de um Pod, podem ser configurados para usar as funções GMSA 
baseadas em domínio (ex. autenticação Kerberos) quando interagirem com outros 
serviços Windows.

## {{% heading "prerequisites" %}}

Você precisa ter um cluster Kubernetes, e a ferramenta de linha de comando `kubectl` 
precisa estar configurada para comunicar-se com seu cluster.
O cluster está esperando que haja nós trabalhadores Windows. 
Esta seção cobre o conjunto inicial de passos requeridos para cada cluster:

### Instale o `GMSACredentialSpec CRD`

Uma [CustomResourcedefinition](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)(CRD) uma especificação de recursos de credencial GMSA precisa ser configurada no cluster, para definir o tipo de recurso do cliente `GMSACredentialSpec`. Faça o download da GMSA CRD [YAML](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/gmsa-crd.yml) 
e salve como gmsa-crd.yaml.
A seguir, instale o CRD com `kubectl apply -f gmsa-crd.yaml`

### Instale `webhooks` para validar usuários GMSA

Dois `webhooks` precisam ser configurados no cluster Kubernetes para popular e validar 
as referências de especificação de credenciais GMSA no nível do Pod ou contêiner:

1. Um webhook mutante que expanda as referências para as GMSAs,
(por nome de uma especificação de Pod) dentro de toda a especificação de credencial, 
no formato JSON dentro da especificação do Pod.

1. Um webhook de validação garante que todas as referências para GMSAs estão 
autorizadas a serem usadas pela conta de serviço do Pod.

A instalação dos webhooks acima e dos objetos associados requer as etapas abaixo: 

1. Crie um par de chaves de certificado (que será usado para permitir que o 
contêiner do webhook se comunique com o cluster)

1. Instale a `secret` com o certificado acima.

1. Crie uma implantação para `core webhook logic`.

1. Crie as configurações de validação e o webhook mutante, referentes à implantação.

Um [script](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/deploy-gmsa-webhook.sh) 
pode ser usado para implantar e configurar os webhooks GMSA e objetos associados 
mencionados acima. O script pode ser executado com a opção ```--dry-run=server``` 
para possibilitar que você possa revisar as alterações antes que sejam aplicadas 
no seu cluster.

O [YAML template](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/gmsa-webhook.yml.tpl) 
usado pelo script também pode ser usado para implantar os webhooks e objetos 
associados manualmente (com as substituições apropriadas para os parâmetros).

<!-- steps -->

## Configurar GMSAs e nós Windows em Active Directory

Antes que os Pods no Kubernetes possam ser configurados para usar GMSAs, as apropriadas 
GMSAs precisam ser provisionadas no Active Directory como descrito na 
[documentação do Windows GMSA]
(https://docs.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts#BKMK_Step1). 
Nós `worker` Windows (que são parte do cluster Kubernetes) precisam ser configurados no 
Active Directory para acessar as credenciais secretas associadas com a apropriada GMSA, 
como descrito na [documentação Windows GMSA]
(https://docs.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts#to-add-member-hosts-using-the-set-adserviceaccount-cmdlet).

## Crie recursos de especificação de GMSA

Com o `GMSACredentialSpec CRD` instalado (como descrito anteriormente), 
recursos customizados contendo recursos de especificação de credenciais GMSA podem 
ser configurados. A especificação de credencial GMSA não contém segredos nem dados 
sensíveis. É informação que o contêiner runtime pode usar para descrever a apropriada 
GMSA de um contêiner para o Windows. Especificações de credenciais GMSA podem 
ser geradas em formato YAML com o utilitário [PowerShell script]
(https://github.com/kubernetes-sigs/windows-gmsa/tree/master/scripts/GenerateCredentialSpecResource.ps1).

A seguir são os passos para gerar a especificação de credencial GMSA YAML 
manualmente, em formato JSON e então convertê-la:

1. Importar a `CredentialSpec` [módulo]
(https://github.com/MicrosoftDocs/Virtualization-Documentation/blob/live/windows-server-container-tools/ServiceAccounts/CredentialSpec.psm1): 
`ipmo CredentialSpec.psm1`

1. Crie a especificação da credencial em formato JSON usando `New-CredentialSpec`. 
Para criar a especificação da credencial GMSA nomeada WebApp1, 
execute `New-CredentialSpec -Name WebApp1 -AccountName WebApp1 -Domain $(Get-ADDomain -Current LocalComputer)`

1. Use `Get-CredentialSpec` para mostrar o caminho do arquivo JSON.

1. Converta o arquivo `credspec` de JSON para o formato YAML e aplique os campos 
de cabeçalho necessários `apiVersion`, `kind`, `metadata` e `credspec` para fazer 
o recurso customizado `GMSACredentialSpec` que pode ser configurado no Kubernetes.

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
    DnsTreeName: contoso.com    #Nome de domínio DNS Root
    Guid: 244818ae-87ac-4fcd-92ec-e79e5252348a  #GUID
    MachineAccountName: WebApp1 #Nome de usuário da conta GMSA
    NetBiosName: CONTOSO        #Nome de domínio NETBIOS
    Sid: S-1-5-21-2126449477-2524075714-3094792973 #SID da GMSA
```

O recurso de especificação de credencial acima deve ser salvo como 
`gmsa-Webapp1-credspec.yaml` e aplicado no cluster usando: 
`kubectl apply -f gmsa-Webapp1-credspec.yml`

## Configure a `cluster role` para habilitar RBAC nas especificações 
de credenciais GMSA específicas

Uma `cluster role` precisa ser definida para cada recurso de especificação 
de credencial GMSA. Isto autoriza a `usar` um recurso GMSA específico, 
por um sujeito que tipicamente é um serviço de conta. O exemplo a seguir mostra 
uma `cluster role` que autoriza o uso da especificação da credencial `gmsa-WebApp1` 
acima. Salve o arquivo como gmsa-webapp1-role.yaml e aplique 
usando `kubectl apply -f gmsa-webapp1-role.yaml`

```yaml
#Criando a Role para ler o credspec
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

## Atribua o papel ao serviço de contas para usar a especificação de credencial GMSA especifíca

Um serviço de conta (com a qual os Pods virão configurados), precisa ser vinculado 
ao `cluster role` criado acima. Isto autoriza o serviço de conta a usar, a apropriada 
especificação de recurso de credencial GMSA. A seguir mostra o serviço de conta 
padrão vinculado a `cluster role` `webapp1-role`, para usar a especificação 
de recurso da credencial `gmsa-WebApp1` criada acima.

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

O campo de especificação do Pod `securityContext.windowsOptions.gmsaCredentialSpecName`,  
é usado para especificar referências para recursos customizados, em especificações 
de certificado GMSA apropriadas em especificações do Pod. 
Isto configura todos contêineres na especificação do Pod para usar a especificação GMSA. 
Uma amostra da especificação do Pod com anotação populada para referir-se a `gmsa-WebApp1`:

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

Contêineres individuais em uma especificação de Pod, podem também especificar 
a apropriada especificação de credencial GMSA, usando um campo por contêiner 
`securityContext.windowsOptions.gmsaCredentialSpecName`. Por exemplo:

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

1. O webhook mutante resolve e expande todas as referências aos recursos de 
especificações de credenciais GMSA para o conteúdo das especificações de credenciais GMSA.

1. O webhook validador garante que a conta de serviço associada ao Pod, seja autorizada 
para o `uso` verbal na especificação GMSA especificada.

1. O `contêiner Runtime` configura cada contêiner do Windows com a especificação 
de credencial GMSA especificada, para que o contêiner possa assumir a identidade 
do GMSA no Active Directory, e tenha acesso aos serviços no domínio usando essa identidade.

## Autenticando para compartilhamentos de rede usando `hostname` ou FQDN

Se você estiver enfrentando problemas ao se conectar aos compartilhamentos SMB 
de pods usando o hostname ou o FQDN, mas conseguindo acessar os compartilhamentos 
por meio de seu endereço IPv4, verifique se a chave do registro a seguir 
está definida nos nós Windows.

```cmd
reg add "HKLM\SYSTEM\CurrentControlSet\Services\hns\State" /v EnableCompartmentNamespace /t REG_DWORD /d 1
```

Os pods em execução precisarão ser recriados para pegar as mudanças de comportamento.
Mais informações sobre como essa chave de registro é usada pode ser encontrada [aqui](
https://github.com/microsoft/hcsshim/blob/885f896c5a8548ca36c88c4b87fd2208c8d16543/internal/uvm/create.go#L74-L83)

## Solução de problemas

Se você estiver tendo dificuldades para fazer com que o GMSA funcione em seu ambiente, 
existem algumas etapas de solução de problemas que você pode tentar.

Primeiro, verifique se a especificação de credencial foi passada para o Pod. Para fazer isso, 
você precisará `executar` em um de seus Pods e verificar 
a saída do comando `nltest.exe /parentdomain`.  

No exemplo abaixo, o pod não recebeu a especificação de credencial corretamente:

```PowerShell
kubectl exec -it iis-auth-7776966999-n5nzr powershell.exe
```

`nltest.exe /parentdomain` resulta no seguinte erro:

```output
Getting parent domain failed: Status = 1722 0x6ba RPC_S_SERVER_UNAVAILABLE
```

Se o seu pod obteve a especificação de credencial corretamente, em seguida, 
verifique a comunicação com o domínio. Primeiro, de dentro do seu pod, 
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

Se o exposto acima corrigir o erro, você poderá automatizar a etapa adicionando 
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
até que o comando `nltest.exe /query` saia sem erro.
