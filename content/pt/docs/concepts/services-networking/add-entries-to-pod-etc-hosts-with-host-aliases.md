---
reviewers:
- femrtnz
- jcjesus
title: Adicionando entradas ao Pod /etc/hosts com o HostAliases
content_template: templates/concept
weight: 60
---

{{< toc >}}

{{% capture overview %}}
Adicionar entradas ao arquivo /etc/hosts de um Pod fornece uma substituição de nível de host da resolução do nome do host quando o DNS e outras opções não são aplicáveis. Na versão 1.7, os usuários podem adicionar essas entradas personalizadas ao campo HostAliases no PodSpec.

A modificação que não usa o HostAliases não é sugerida porque o arquivo é gerenciado pelo Kubelet e pode ser sobrescrito durante a criação ou reinicialização do Pod.
{{% /capture %}}

{{% capture body %}}

## Conteúdo Padrão do Hosts

Vamos começar um Nginx Pod que é atribuído um Pod IP:

```shell
kubectl run nginx --image nginx --generator=run-pod/v1
```

```shell
pod/nginx created
```

Examine a Pod IP:

```shell
kubectl get pods --output=wide
```

```shell
NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
nginx    1/1       Running   0          13s    10.200.0.4   worker0
```

O conteúdo do arquivo de hosts seria semelhante a este:

```shell
kubectl exec nginx -- cat /etc/hosts
```

```none
# Arquivo de hosts gerenciados pelo Kubernetes.
127.0.0.1	localhost
::1	localhost ip6-localhost ip6-loopback
fe00::0	ip6-localnet
fe00::0	ip6-mcastprefix
fe00::1	ip6-allnodes
fe00::2	ip6-allrouters
10.200.0.4	nginx
```

Por padrão, o `hosts` arquivo inclui apenas boilerplates IPv4 e IPv6 como
`localhost` e seu próprio nome de host.

## Adicionando Entradas Adicionais com HostAliases

Além do clichê padrão, podemos adicionar entradas adicionais ao
`hosts` amigos os resolve `foo.local`, `bar.local` para `127.0.0.1` e `foo.remote`,
`bar.remote` para `10.1.2.3`, podemos adicionar HostAliases ao Pod em
`.spec.hostAliases`:

{{< codenew file="service/networking/hostaliases-pod.yaml" >}}

Este Pod pode ser iniciado com os seguintes comandos:

```shell
kubectl apply -f hostaliases-pod.yaml
```

```shell
pod/hostaliases-pod created
```

Examine um IP e status do Pod:

```shell
kubectl get pod -o=wide
```

```shell
NAME                           READY     STATUS      RESTARTS   AGE       IP              NODE
hostaliases-pod                0/1       Completed   0          6s        10.200.0.5      worker0
```

O conteúdo do arquivo `hosts` ficaria assim:

```shell
kubectl logs hostaliases-pod
```

```none
# Arquivo de hosts gerenciados pelo Kubernetes.
127.0.0.1	localhost
::1	localhost ip6-localhost ip6-loopback
fe00::0	ip6-localnet
fe00::0	ip6-mcastprefix
fe00::1	ip6-allnodes
fe00::2	ip6-allrouters
10.200.0.5	hostaliases-pod

# Entradas adicionadas pelo HostAliases.
127.0.0.1	foo.local	bar.local
10.1.2.3	foo.remote	bar.remote
```

Com as entradas adicionais especificadas na parte inferior.

## Por que o Kubelet gerencia o arquivo de hosts?

Kubelet [gerencia](https://github.com/kubernetes/kubernetes/issues/14633) o
arquivo `hosts` para cada contêiner do Pod para evitar que o Docker
[modifique](https://github.com/moby/moby/issues/17190) o arquivo após os
recipientes forem iniciados.

Devido à natureza gerenciada do arquivo, qualquer conteúdo escrito pelo usuário será
sobrescrito sempre que o arquivo `hosts` é remontado pelo Kubelet em caso de
um reinício do contêiner ou um reagendamento do Pod. Assim, não é sugerido modificar
o conteúdo do arquivo.

{{% /capture %}}

