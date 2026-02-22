---
title: Criando Pods Estáticos
weight: 170
content_type: task
---

<!-- overview -->


*Pods Estáticos* são gerenciados diretamente pelo `daemon` kubelet em um nó específico,
sem o {{< glossary_tooltip text="servidor de API" term_id="kube-apiserver" >}}
observando-os.
Ao contrário dos pods que são gerenciados pelo `Control Plane` (por exemplo, uma
{{< glossary_tooltip text="Implantação" term_id="deployment" >}});
em vez disso, o kubelet observa cada Pod estático 
(e reinicia-os se falharem).

Pods estáticos estão sempre ligados a um {{< glossary_tooltip term_id="kubelet" >}} em um nó específico.

O Kubelet tenta automaticamente criar um {{< glossary_tooltip text="mirror Pod" term_id="mirror-pod" >}}
no servidor de API do Kubernetes para cada Pod estático.
Isso significa que os pods em execução em um nó são visíveis no servidor de API,
mas não podem ser controlados a partir daí.
Aos nomes de Pods será sufixados com o nome de host do nó, com um hífem a esquerda. 


{{< note >}}
Se você está executando um cluster Kubernetes, usando Pods estáticos para executar um Pod em cada Nó,
provávelmente você deveria estar usando um {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}} em substituição.
{{< /note >}}

{{< note >}}
A `especificação` de um Pod estático não pode referir-se à outros objetos da API
(ex., {{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}},
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}},
{{< glossary_tooltip text="Secret" term_id="secret" >}}, etc).
{{< /note >}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Esta página assume que você está usando um {{< glossary_tooltip term_id="cri-o" >}} para executar os Pods,
e que seus nós estão executando o sistema operacional Fedora.
Instruções para outras distribuições, ou instalações de Kubernetes, podem variar.

<!-- steps -->

## Crie um pod estático {#static-pod-creation}

Você pode configurar um Pod estático com um [arquivo de configuração hospedado no sistema de arquivos](/docs/tasks/configure-pod-container/static-pod/#configuration-files) ou um [arquivo de configuração hospedado na Web](/docs/tasks/configure-pod-container/static-pod/#pods-created-via-http).

### Manifesto do Pod estático hospedado no sistema de arquivos {#configuration-files}

Os manifestos, são definições de Pod padrão em formato JSON ou YAML em um diretório específico. Use o campo `staticPodPath: <diretório>` no
[arquivo de configuração do kubelet](/docs/reference/config-api/kubelet-config.v1beta1/),
que periodicamente varre o diretório e cria/exclui Pods estáticos conforme os arquivos YAML/JSON aparecem/desaparecem.
Observe que o Kubelet ignorará os arquivos começando com pontos ao varrer o diretório especificado.

Por exemplo, como iniciar um servidor Web simples como um Pod estático

1. Escolha um nó onde você deseja executar um Pod estático. Neste exemplo, é `my-node1`.

    ```shell
    ssh my-node1
    ```

2. Escolha um diretório, digamos `/etc/kubernetes/manifests` e coloque uma definição de pod para um servidor web lá, por exemplo `/etc/kubernetes/manifests/static-web.yaml`:

    ```shell
    # Execute este comando no nó onde o Kubelet está funcionando
    mkdir -p /etc/kubernetes/manifests/
    cat <<EOF >/etc/kubernetes/manifests/static-web.yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: static-web
      labels:
        role: myrole
    spec:
      containers:
        - name: web
          image: nginx
          ports:
            - name: web
              containerPort: 80
              protocol: TCP
    EOF
    ```

3. Configure seu kubelet no nó para usar este diretório executando-o com o argumento `--pod-manifest-path=/etc/kubernetes/manifests/`. No Fedora, edite o arquivo `/etc/kubernetes/kubelet` para incluir esta linha:

   ```
   KUBELET_ARGS="--cluster-dns=10.254.0.10 --cluster-domain=kube.local --pod-manifest-path=/etc/kubernetes/manifests/"
   ```
   ou adicione o campo `staticPodPath: <o diretótio>` no 
   [arquivo de configuração do kubelet](/docs/reference/config-api/kubelet-config.v1beta1/).

4. Reinicie o kubelet. No Fedora, você poderia executar:

   ```shell
   # Execute este comando no nó onde o kubelet está funcionando
   systemctl restart kubelet
   ```

### Manifesto do Pod estático hospedado na Web {#pods-created-via-http}

O Kubelet baixa periodicamente um arquivo especificado pelo argumento `--manifest-url=<URL>` 
e interpreta-o como um arquivo JSON/YAML que contém as definições do Pod.
Similar ao que [manifestos hospedados no sistema de arquivos](#configuration-files) fazem, o kubelet
reexamina o manifesto em um agendamento. Se houver alterações na lista de Pods estáticos, o kubelet aplica-os.

Para usar esta abordagem: 

1. Crie um arquivo YAML e armazene-o em um servidor da Web, para que você possa passar o URL desse arquivo para o Kubelet.

    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: static-web
      labels:
        role: myrole
    spec:
      containers:
        - name: web
          image: nginx
          ports:
            - name: web
              containerPort: 80
              protocol: TCP
    ```

2. Configure o kubelet no seu nó selecionado para usar este manifesto da Web, executando-o com `--manifest-url=<manifest-url>`. No Fedora, edite `/etc/kubernetes/kubelet` para incluir esta linha:

    ```
    KUBELET_ARGS="--cluster-dns=10.254.0.10 --cluster-domain=kube.local --manifest-url=<manifest-url>"
    ```

3. Reinicie o Kubelet. No Fedora, você usaria:

    ```shell
    # Execute este comando no nó onde o kubelet está funcionando
    systemctl restart kubelet
    ```

## Observe o comportamento do Pod estático {#behavior-of-static-pods}

Quando o kubelet começa, inicia automaticamente todos os pods estáticos definidos. 
Como você definiu um Pod estático e reiniciou o kubelet, o novo pod estático deveria
já estar em execução.

Você pode ver os Contêineres em execução (incluindo os Pods estáticos) ao executar (no Nó):

```shell
# Execute este comando no nó onde o kubelet está funcionando
crictl ps
```

A saída pode ser algo como:

```console
CONTAINER       IMAGE                                 CREATED           STATE      NAME    ATTEMPT    POD ID
129fd7d382018   docker.io/library/nginx@sha256:...    11 minutes ago    Running    web     0          34533c6729106
```

{{< note >}}
`crictl` mostra a URI da imagem e o checksum SHA-256. O `NAME` vai parecer mais como:
`docker.io/library/nginx@sha256:0d17b565c37bcbd895e9d92315a05c1c3c9a29f762b011a10c54a66cd53c9b31`.
{{< /note >}}

Você pode ver o Pod espelho no servidor de API:

```shell
kubectl get pods
```
```
NAME         READY   STATUS    RESTARTS        AGE
static-web   1/1     Running   0               2m
```

{{< note >}}
Verifique se o Kubelet tem permissão para criar o Pod espelho no servidor de API. Caso contrário, a solicitação de criação é rejeitada pelo servidor de API. Veja [Admissão de segurança do pod](/docs/concepts/security/pod-security-admission) e [Políticas de Segurança de Pod](/docs/concepts/security/pod-security-policy/).
{{< /note >}}

Os {{< glossary_tooltip term_id="label" text="Rótulos" >}} dos pods estáticos são
propagados no Pod espelho. Você pode usar esses rótulos como 
{{< glossary_tooltip term_id="selector" text="seletores" >}} via normal, etc.

Se você tentar usar o `kubectl` para excluir o Pod espelho do servidor de API,
o kubelet _não_ remove o Pod estático:

```shell
kubectl delete pod static-web
```
```
pod "static-web" deleted
```
Você pode ver que o Pod ainda está funcionando:
```shell
kubectl get pods
```
```
NAME         READY   STATUS    RESTARTS   AGE
static-web   1/1     Running   0          4s
```

De volta ao seu nó, onde o kubelet está funcionando, você pode tentar parar o Contêiner manualmente.
Você verá que, depois de algum tempo, o Kubelet notará e reiniciará o Pod
automaticamente:

```shell
# Execute esses comandos no nó onde o Kubelet está funcionando
crictl stop 129fd7d382018 # substitua pelo ID do seu contêiner
sleep 20
crictl ps
```
```console
CONTAINER       IMAGE                                 CREATED           STATE      NAME    ATTEMPT    POD ID
89db4553e1eeb   docker.io/library/nginx@sha256:...    19 seconds ago    Running    web     1          34533c6729106
```

## Adição e remoção dinâmica de Pods estáticos

O Kubelet em execução varre periodicamente o diretório configurado (`/etc/kubernetes/manifests` em nosso exemplo) por alterações, e adiciona/remove os pods à medida que os arquivos aparecem/desaparecem neste diretório.

```shell
# Pressupondo que você esteja usando a configuração de Pod estático hospedada no sistema de arquivos
# Execute esses comandos no nó onde o Kubelet está funcionando
#
mv /etc/kubelet.d/static-web.yaml /tmp
sleep 20
crictl ps
# Você vê que nenhum contêiner nginx está funcionando
#
mv /tmp/static-web.yaml  /etc/kubelet.d/
sleep 20
crictl ps
```
```console
CONTAINER       IMAGE                                 CREATED           STATE      NAME    ATTEMPT    POD ID
f427638871c35   docker.io/library/nginx@sha256:...    19 seconds ago    Running    web     1          34533c6729106
```
