---
reviewers: 
- erictune
- mikedanese

title: Configurando um Contexto de Segurança Para um Pod ou Contêiner
content_type: task
weight: 80
---

<!-- overview -->

Um contexto de segurança define configurações de controle de privilégio e acesso para
um Pod ou Contêiner. As configurações de contexto de segurança incluem, mas não estão limitadas, a:

* Controle de acesso discricionário: Permissão para acessar um objeto, como um arquivo, é baseada em
  [ID de usuário (UID) e ID de grupo (GID)](https://wiki.archlinux.org/index.php/users_and_groups).

* [Segurança aprimorada Linux (SELinux)](https://pt.wikipedia.org/wiki/SELinux):
  os objetos recebem rótulos de segurança.

* Execução com privilégios ou sem privilégios.

* [Linux Capabilities](https://linux-audit.com/linux-capabilities-hardening-linux-binaries-by-removing-setuid/):
  Dê a um processo alguns privilégios, mas não todos os privilégios do usuário root.

* [AppArmor](/docs/tutorials/security/apparmor/):
  Use perfis de programa para restringir os recursos de programas individuais.

* [Seccomp](/docs/tutorials/security/seccomp/): Filtre as chamadas de sistema de um processo.

* `allowPrivilegeEscalation`: Controla se um processo pode obter mais privilégios do que
  seu processo origem. Este valor booleano controla diretamente se a flag 
  [`no_new_privs`](https://www.kernel.org/doc/Documentation/prctl/no_new_privs.txt)
  está definida no processo do contêiner.
  `allowPrivilegeEscalation` é sempre `True` quando o contêiner:

  - é executado com privilégios, ou
  - tem a _capability_ `CAP_SYS_ADMIN`

* `readOnlyRootFilesystem`: Monta o sistema de arquivos raiz do contêiner como somente leitura.

As opções acima não são um conjunto completo de configurações de contexto de segurança -- por favor veja
[SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core)
para uma lista abrangente.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Defina o contexto de segurança em um Pod

Para especificar configurações de segurança para um Pod, inclua o campo `securityContext` 
na especificação do Pod. O campo `securityContext` é um objeto [PodSecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritycontext-v1-core).
As configurações de segurança que você especifica para um Pod se aplicam a todos os contêineres no Pod.
Aqui está um arquivo de configuração para um pod que tem um `securityContext` e um volume `emptyDir`:

{{< codenew file="pods/security/security-context.yaml" >}}

No arquivo de configuração, o campo `runAsUser` especifica que para qualquer contêiner no Pod, todos os processos são executados com o Id de usuário 1000. O campo `runAsGroup` especifica que o ID do grupo primário é 3000 para
todos os processos em qualquer contêiner do Pod. Se este campo for omitido, o ID do grupo primário dos contêineres
vai ser root (0). Quaisquer arquivos criados também serão de propriedade do usuário 1000 e grupo 3000 quando `runAsGroup` estiver especificado.
Desde que o campo `fsGroup` esteja especificado, todos os processos do contêiner também fazem parte do ID do grupo suplementar 2000.
O proprietário do volume `/data/demo` e quaisquer arquivos criados nesse volume será o ID de grupo 2000.

Crie o Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context.yaml
```

Verifique que o contêiner do Pod está executando:

```shell
kubectl get pod security-context-demo
```

Abra um shell para o contêiner em execução:

```shell
kubectl exec -it security-context-demo -- sh
```

No seu shell, liste os processos em execução:

```shell
ps
```

A saída mostra que os processos estão em execução como usuário 1000, que é o valor de `runAsUser`:

```none
PID   USER     TIME  COMMAND
    1 1000      0:00 sleep 1h
    6 1000      0:00 sh
...
```

No seu shell, navegue até a pasta `/data`, e liste esse diretório:

```shell
cd /data
ls -l
```

A saída mostra que o diretório `/data/demo` tem o ID de grupo 2000, que é
o valor de `fsGroup`.

```none
drwxrwsrwx 2 root 2000 4096 Jun  6 20:08 demo
```

No seu shell, navegue até `/data/demo`, e crie um arquivo:

```shell
cd demo
echo hello > testfile
```

Liste o arquivo no diretório `/data/demo`:

```shell
ls -l
```

A saída mostra que o arquivo `testfile` tem o ID de grupo 2000, que é o valor de `fsGroup`.

```none
-rw-r--r-- 1 1000 2000 6 Jun  6 20:08 testfile
```

Execute o seguinte comando:

```shell
id
```

A saída é semelhante a esta:

```none
uid=1000 gid=3000 groups=2000
```

Da saída, você pode ver que `gid` é 3000 que é o mesmo que o campo `runAsGroup`.
Se o `runAsGroup` fosse omitido, o `gid` permaneceria como 0 (root), e o processo vai
ser capaz de interagir com arquivos de propriedade do grupo de root (0), e grupos que têm
as permissões de grupo exigidas para o grupo de root (0).

Saia do seu shell:

```shell
exit
```

## Configure a permissão de volume e a política de mudança de propriedade para Pods

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Por padrão, o Kubernetes muda recursivamente a propriedade e permissões para o conteúdo de cada
volume, para corresponder ao `fsGroup` especificado em um `securityContext` do Pod quando o volume é montado.
Para grandes volumes, verificação e mudança de propriedade e permissões podem levar muito tempo,
tornando lenta a inicialização do Pod. Você pode usar o campo `fsGroupChangePolicy` dentro de um `securityContext`
para controlar o modo como o Kubernetes verifica e gerencia a propriedade e as permissões
para um volume.

**fsGroupChangePolicy** - `fsGroupChangePolicy` define o comportamento para mudar a propriedade
  e permissão do volume antes de ser exposto dentro de um Pod.
  Este campo se aplica apenas a tipos de volume que suportam propriedade controlada e permissões `fsGroup`.
  Este campo tem dois valores possíveis:

* _OnRootMismatch_: Altera permissões e propriedade somente se a permissão e a propriedade do diretório 
  root não correspondem às permissões esperadas do volume.
  Isso pode ajudar a reduzir o tempo necessário para mudar o proprietário e a permissão de um volume.
* _Always_: Sempre muda a permissão e a propriedade do volume quando o volume for montado.

Por exemplo:

```yaml
securityContext:
  runAsUser: 1000
  runAsGroup: 3000
  fsGroup: 2000
  fsGroupChangePolicy: "OnRootMismatch"
```

{{< note >}}
Este campo não tem efeito nos tipos de volumes efêmeros, como
[`secret`](/docs/concepts/storage/volumes/#secret),
[`configMap`](/docs/concepts/storage/volumes/#configmap),
e [`emptydir`](/docs/concepts/storage/volumes/#emptydir).
{{< /note >}}

## Delegue a permissão de volume e a alteração de propriedade para o driver CSI

{{< feature-state for_k8s_version="v1.23" state="beta" >}}

Se você implantar um driver [Interface de armazenamento de contêineres (CSI)](https://github.com/container-storage-interface/spec/blob/master/spec.md)
que suporta o `VOLUME_MOUNT_GROUP` `NodeServiceCapability`, o
processo de definir a propriedade e permissões de arquivos com base no
`fsGroup` especificado no `securityContext`, será realizado pelo driver CSI em vez do Kubernetes, desde que o `DelegateFSGroupToCSIDriver` Kubernetes
`feature gate` esteja habilitada. Nesse caso, contanto que o Kubernetes não realize nenhuma
mudança de propriedade e permissão, `fsGroupChangePolicy` não entra em vigor e
conforme especificado por CSI, é esperado que o driver monte o volume com `fsGroup` fornecido, resultando em um volume que pode ser lido/gravado pelo
`fsGroup`.

## Defina o contexto de segurança para um Contêiner

Para especificar configurações de segurança a um Contêiner, inclua o campo `securityContext` no manifesto do Contêiner. O campo `securityContext` é um objeto
[SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core).
Configurações de segurança que você especifica para um contêiner se aplicam apenas ao contêiner individual, e substituem as configurações feitas no nível do Pod quando
há sobreposição. As configurações de contêiner não afetam os volumes do Pod.

Aqui está o arquivo de configuração para um Pod que possui um contêiner. Ambos o Pod
e o contêiner têm um campo `securityContext`:

{{< codenew file="pods/security/security-context-2.yaml" >}}

Crie o Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-2.yaml
```

Verifique que o contêiner do Pod está rodando:

```shell
kubectl get pod security-context-demo-2
```

Abra um shell no contêiner em execução:

```shell
kubectl exec -it security-context-demo-2 -- sh
```

No seu shell, liste os processos em execução:

```shell
ps aux
```

A saída mostra que os processos estão em execução como usuário 2000. Este é o valor
do campo `runAsUser` especificado para o contêiner. Ele toma precedência sobre o valor 1000 que é especificado para o Pod.

```
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
2000         1  0.0  0.0   4336   764 ?        Ss   20:36   0:00 /bin/sh -c node server.js
2000         8  0.1  0.5 772124 22604 ?        Sl   20:36   0:00 node server.js
...
```

Saia do seu shell:

```shell
exit
```

## Defina recursos para um Contêiner

Com [`Linux Capabilities`](https://man7.org/linux/man-pages/man7/capabilities.7.html),
Você pode conceder certos privilégios a um processo, sem conceder todos os privilégios
do usuário root. Para adicionar ou remover recursos Linux para um contêiner, inclua o campo `capabilities` na seção `securityContext` do manifesto do contêiner.

Primeiro, veja o que acontece quando você não inclui um campo `capabilities`.
Aqui está o arquivo de configuração que não adiciona ou remove nenhum recurso do contêiner:

{{< codenew file="pods/security/security-context-3.yaml" >}}

Crie o Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-3.yaml
```

Verifique que o contêiner do Pod está executando:

```shell
kubectl get pod security-context-demo-3
```

Abra um shell dentro do contêiner em execução:

```shell
kubectl exec -it security-context-demo-3 -- sh
```

No seu shell, liste os processos em execução:

```shell
ps aux
```

A saída mostra os IDs dos processos (PIDs) para o contêiner:

```
USER  PID %CPU %MEM    VSZ   RSS TTY   STAT START   TIME COMMAND
root    1  0.0  0.0   4336   796 ?     Ss   18:17   0:00 /bin/sh -c node server.js
root    5  0.1  0.5 772124 22700 ?     Sl   18:17   0:00 node server.js
```

No seu shell, veja o status para o processo 1:

```shell
cd /proc/1
cat status
```

A saída mostra o bitmap de recursos para o processo:

```
...
CapPrm:	00000000a80425fb
CapEff:	00000000a80425fb
...
```

Anote o bitmap dos recursos e depois saia do seu shell:

```shell
exit
```

Em seguida, execute um contêiner que seja o mesmo que o contêiner anterior, porém com recursos adicionais definidos.

Aqui está o arquivo de configuração para um Pod que executa um contêiner. A configuração
adiciona os recursos `CAP_NET_ADMIN` e `CAP_SYS_TIME`:

{{< codenew file="pods/security/security-context-4.yaml" >}}

Crie o Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-4.yaml
```

Abra um shell no contêiner em execução:

```shell
kubectl exec -it security-context-demo-4 -- sh
```

No seu shell, veja os recursos para o processo 1:

```shell
cd /proc/1
cat status
```

A saída mostra os recursos de bitmap para o processo:

```
...
CapPrm:	00000000aa0435fb
CapEff:	00000000aa0435fb
...
```

Compare os recursos dos dois contêineres:

```
00000000a80425fb
00000000aa0435fb
```

No bitmap de _capabilities_ do primeiro contêiner, os bits 12 e 25 estão vazios. No segundo contêiner,
os bits 12 e 25 estão definidos. O bit 12 é `CAP_NET_ADMIN`, e o bit 25 é `CAP_SYS_TIME`.
Veja [capability.h](https://github.com/torvalds/linux/blob/master/include/uapi/linux/capability.h)
para definições das constantes de _capabilities_.

{{< note >}}
As constantes de _capabilities_ do Linux têm o formato `CAP_XXX`.
Mas quando você listar os recursos no manifesto do seu contêiner, você deve
omitir a parte `CAP_` da constante.
Por exemplo, para adicionar `CAP_SYS_TIME`, inclua `SYS_TIME` na sua lista de recursos.
{{< /note >}}

## Defina o perfil do Seccomp para um Contêiner

Para definir o perfil do Seccomp para um contêiner, inclua o campo `seccompProfile` na seção `securityContext` do seu Pod ou manifesto do contêiner. 
O campo `seccompProfile` é um objeto
[SeccompProfile](/docs/reference/generated/kubernetes-api/{{< param "version">}}/#seccompprofile-v1-core) consistindo de `type` e `localhostProfile`.
As opções válidas para `type` incluem `RuntimeDefault`, `Unconfined`, e
`Localhost`. O campo `localhostProfile` só deve ser definido quando `type: Localhost`. 
Este campo indica o caminho do perfil pré-configurado no nó, relativo à localização do perfil de Seccomp do Kubelet 
(configurado com a flag `--root-dir`).

Aqui está um exemplo que define o perfil Seccomp ao perfil padrão do nó do agente de execução do contêiner:

```yaml
...
securityContext:
  seccompProfile:
    type: RuntimeDefault
```

Aqui está um exemplo que define o perfil Seccomp para um arquivo pré-configurado em
`<kubelet-root-dir>/seccomp/my-profiles/profile-allow.json`:

```yaml
...
securityContext:
  seccompProfile:
    type: Localhost
    localhostProfile: my-profiles/profile-allow.json
```

## Atribua rótulos SELinux a um contêiner

Para atribuir rótulos SELinux a um contêiner, inclua o campo `seLinuxOptions` na seção `securityContext` do seu Pod ou manifesto do contêiner. O campo
`seLinuxOptions` é um objeto
[SELinuxOptions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#selinuxoptions-v1-core). 
Aqui está um exemplo que aplica um nível SELinux:

```yaml
...
securityContext:
  seLinuxOptions:
    level: "s0:c123,c456"
```

{{< note >}}
Para atribuir rótulos SELinux, o módulo de segurança SELinux deve ser carregado no sistema operacional host.
{{< /note >}}

### Re-rotulagem de volume SELinux eficiente

{{< feature-state for_k8s_version="v1.27" state="beta" >}}

Por padrão, o agente de execução de contêiner atribuí recursivamente rótulos SELinux à todos 
os arquivos em todos os volumes do Pod. Para acelerar esse processo, o kubernetes pode trocar 
o rótulo SELinux de um volume instantaneamente pelo uso da opção de montagem `-o context=<label>`.

Para se beneficiar desta aceleração, todas estas condições precisam ser observadas:

* O [portal de recursos](/docs/reference/command-line-tools-reference/feature-gates/) `ReadWriteOncePod`
  e `SELinuxMountReadWriteOncePod` precisam estar habilitados.
* O Pod precisa usar PersistentVolumeClaim com `accessModes: ["ReadWriteOncePod"]`.
* O Pod (ou todos os seus contêineres que usam o PersistentVolumeClaim) precisam ter o campo `seLinuxOptions` atribuído.
* O PersistentVolume correspondente precisa ser de um dos tipos:
  * Um volume que usa o tipo de volume legado in-tree `iscsi`, `rbd` ou `fc`.
  * Ou um volume que usa um driver {{< glossary_tooltip text="CSI" term_id="csi" >}}.
    O driver CSI precisa anunciar que suporta a montagem com `-o context` atribuindo
    `spec.seLinuxMount: true` na sua instância CSIDriver.

Para quaisquer outros tipos de volumes, a re-rotulagem SELinux acontece de outra forma: O agente de execução de contêiner recursivamente troca 
os rótulos SELinux para todos os inodes (arquivos e diretórios) no volume.
Quanto mais arquivos e diretórios no volume, maior será o tempo dispendido na re-rotulagem. 

{{< note >}}
<!-- remove after Kubernetes v1.30 is released -->
Se você estiver rodando o Kubernetes v1.25, verifique a versão v1.25 na página de tarefas:
[Configure um contexto de segurança para um pod ou contêiner](https://v1-25.docs.kubernetes.io/pt-br/docs/tasks/configure-pod-container/security-context/) (v1.25).  
Existe uma nota importante nesta documentação sobre a situação em que o kubelet 
pode deixar de localizar rótulos de volumes após a reinicialização. Esta deficiência foi corrigida na versão 1.26 do Kubernetes.
{{< /note >}}


## Discussão

O contexto de segurança de um Pod se aplica aos contêineres do Pod e também aos volumes do Pod quando aplicável. Especificamente `fsGroup` e `seLinuxOptions` são
aplicados a volumes da seguinte maneira:

* `fsGroup`: Volumes que aceitam o gerenciamento de propriedade, são
  modificados para o proprietário e permissão de escrita ao GID especificado no `fsGroup`. Veja o
  [documento de design e gerenciamento de propriedade](https://git.k8s.io/design-proposals-archive/storage/volume-ownership-management.md)
  para mais detalhes.

* `seLinuxOptions`: Volumes que suportam rotulagem SELinux são re-rotulados para serem acessíveis pelo rótulo
  especificado em `seLinuxOptions`. Geralmente você precisa somente definir a seção `level`. Isso define a
  [Segurança de múltiplas categorias (_Multi-Category Security_, ou MCS)](https://selinuxproject.org/page/NB_MLS),
  um rótulo fornecido a todos os Contêineres no pod e aos volumes.

{{< warning >}}
Depois de especificar um rótulo MCS para um Pod, todos os Pods com o mesmo rótulo podem acessar o volume.
Se você precisar de proteção entre Pods, você deve atribuir um rótulo único MCS a cada Pod.
{{< /warning >}}

## Limpeza

Apague o Pod:

```shell
kubectl delete pod security-context-demo
kubectl delete pod security-context-demo-2
kubectl delete pod security-context-demo-3
kubectl delete pod security-context-demo-4
```

## {{% heading "whatsnext" %}}

* [PodSecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritycontext-v1-core)
* [SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core)
* [ajustando o Docker com os mais novos aprimoramentos de segurança](https://github.com/containerd/containerd/blob/main/docs/cri/config.md)
* [Documento de desenho de contextos de segurança](https://git.k8s.io/design-proposals-archive/auth/security_context.md)
* [Documento de desenho de gerenciamento de propriedade](https://git.k8s.io/design-proposals-archive/storage/volume-ownership-management.md)
* [PodSecurityPolicy](/docs/concepts/security/pod-security-policy/)
* [documento de desenho de `AllowPrivilegeEscalation`](https://git.k8s.io/design-proposals-archive/auth/no-new-privs.md)
* Para mais informações sobre mecanismos de segurança no Linux, veja
[Visão geral dos recursos de segurança do kernel Linux](https://www.linux.com/learn/overview-linux-kernel-security-features) (Nota: Algumas informações estão desatualizadas)
