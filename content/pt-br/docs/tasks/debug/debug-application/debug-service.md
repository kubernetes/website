---
content_type: task
title: Depuração de Services
weight: 20
---

<!-- overview -->
Um problema que surge com bastante frequência em novas instalações do Kubernetes 
é que um Service não está funcionando corretamente. Você implantou seus Pods 
através de um Deployment (ou outro controlador de carga de trabalho) e criou um Service, 
mas não recebe nenhuma resposta ao tentar acessá-lo. Este documento, 
esperançosamente, ajudará você a descobrir o que está errado.

<!-- body -->

## Executando comandos em um Pod

Para muitas etapas aqui, você desejará ver o que um Pod em execução no cluster 
está enxergando. A maneira mais simples de fazer isso é executar um Pod interativo 
com busybox:

```none
kubectl run -it --rm --restart=Never busybox --image=gcr.io/google-containers/busybox sh
```

{{< note >}}
Se você não vir um prompt de comando, tente pressionar Enter.
{{< /note >}}

Se você já tem um Pod em execução que prefere usar, você pode executar um 
comando nele usando:

```shell
kubectl exec <POD-NAME> -c <CONTAINER-NAME> -- <COMMAND>
```

## Configuração

Para os propósitos deste passo a passo, vamos executar alguns Pods. Como você 
provavelmente está depurando seu próprio Service, pode substituir os detalhes 
pelos seus próprios ou seguir junto para obter um segundo ponto de referência.

```shell
kubectl create deployment hostnames --image=registry.k8s.io/serve_hostname
```
```none
deployment.apps/hostnames created
```

Os comandos `kubectl` exibirão o tipo e o nome do recurso criado ou modificado, 
que podem então ser usados em comandos subsequentes.

Vamos escalar o deployment para 3 réplicas.
```shell
kubectl scale deployment hostnames --replicas=3
```
```none
deployment.apps/hostnames scaled
```

Observe que isso é o mesmo que se você tivesse iniciado o Deployment com o 
seguinte YAML:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: hostnames
  name: hostnames
spec:
  selector:
    matchLabels:
      app: hostnames
  replicas: 3
  template:
    metadata:
      labels:
        app: hostnames
    spec:
      containers:
      - name: hostnames
        image: registry.k8s.io/serve_hostname
```

O rótulo "app" é definido automaticamente pelo `kubectl create deployment` como o nome do Deployment.

Você pode confirmar que seus Pods estão em execução:

```shell
kubectl get pods -l app=hostnames
```
```none
NAME                        READY     STATUS    RESTARTS   AGE
hostnames-632524106-bbpiw   1/1       Running   0          2m
hostnames-632524106-ly40y   1/1       Running   0          2m
hostnames-632524106-tlaok   1/1       Running   0          2m
```

Você também pode confirmar que seus Pods estão respondendo. Você pode obter a 
lista de endereços IP dos Pods e testá-los diretamente.

```shell
kubectl get pods -l app=hostnames \
    -o go-template='{{range .items}}{{.status.podIP}}{{"\n"}}{{end}}'
```
```none
10.244.0.5
10.244.0.6
10.244.0.7
```

O contêiner de exemplo usado neste passo a passo serve seu próprio hostname 
via HTTP na porta 9376, mas se você estiver depurando sua própria aplicação, 
deverá usar o número da porta na qual seus Pods estão escutando.

De dentro de um Pod:

```shell
for ep in 10.244.0.5:9376 10.244.0.6:9376 10.244.0.7:9376; do
    wget -qO- $ep
done
```

Isso deve produzir algo como:

```
hostnames-632524106-bbpiw
hostnames-632524106-ly40y
hostnames-632524106-tlaok
```

Se você não estiver recebendo as respostas esperadas neste ponto, seus Pods 
podem não estar íntegro ou podem não estar ouvindo na porta que você pensa 
que estão. Você pode achar útil usar `kubectl logs` para ver o que está 
acontecendo ou, talvez, seja necessário executar `kubectl exec` diretamente 
em seus Pods e depurar a partir daí.

Supondo que tudo tenha ocorrido conforme o esperado até agora, você pode começar 
a investigar por que seu Service não está funcionando.

## O Service existe?

O leitor atento terá notado que você ainda não criou um Service – isso é 
intencional. Esse é um passo que às vezes é esquecido e é a primeira coisa a verificar.

O que aconteceria se você tentasse acessar um Service inexistente? Se você 
tiver outro Pod que consome esse Service pelo nome, obteria algo como:

```shell
wget -O- hostnames
```
```none
Resolving hostnames (hostnames)... failed: Name or service not known.
wget: unable to resolve host address 'hostnames'
```

A primeira coisa a verificar é se esse Service realmente existe:

```shell
kubectl get svc hostnames
```
```none
No resources found.
Error from server (NotFound): services "hostnames" not found
```

Vamos criar o Service. Como antes, isso faz parte do passo a passo – você pode 
usar os detalhes do seu próprio Service aqui.

```shell
kubectl expose deployment hostnames --port=80 --target-port=9376
```
```none
service/hostnames exposed
```

E ler de volta:

```shell
kubectl get svc hostnames
```
```none
NAME        TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
hostnames   ClusterIP   10.0.1.175   <none>        80/TCP    5s
```

Agora você sabe que o Service existe.

Como antes, isso é o mesmo que se você tivesse iniciado o Service com YAML:

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: hostnames
  name: hostnames
spec:
  selector:
    app: hostnames
  ports:
  - name: default
    protocol: TCP
    port: 80
    targetPort: 9376
```

Para destacar toda a gama de configurações, o Service que você criou aqui 
usa um número de porta diferente dos Pods. Para muitos Services do mundo real, 
esses valores podem ser os mesmos.

## Alguma regra de Network Policy Ingress está afetando os Pods de destino?

Se você implantou alguma regra de Network Policy Ingress que possa afetar o 
tráfego de entrada para os Pods `hostnames-*`, elas precisam ser revisadas.

Consulte a [documentação sobre Network Policies](/docs/concepts/services-networking/network-policies/) para mais detalhes.

## O Service funciona pelo nome DNS?

Uma das formas mais comuns de os clientes consumirem um Service é através de 
um nome DNS.

A partir de um Pod no mesmo Namespace:

```shell
nslookup hostnames
```
```none
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

Se isso falhar, talvez seu Pod e Service estejam em Namespaces diferentes. 
Tente um nome qualificado pelo namespace (novamente, de dentro de um Pod):

```shell
nslookup hostnames.default
```
```none
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames.default
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

Se isso funcionar, você precisará ajustar sua aplicação para usar um nome 
qualificado pelo namespace ou executar sua aplicação e o Service no mesmo Namespace. 
Se isso ainda falhar, tente um nome totalmente qualificado:

```shell
nslookup hostnames.default.svc.cluster.local
```
```none
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames.default.svc.cluster.local
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

Observe o sufixo aqui: "default.svc.cluster.local". O "default" é o Namespace 
no qual você está operando. O "svc" indica que este é um Service. O "cluster.local" 
é o domínio do seu cluster, que PODE ser diferente no seu próprio cluster.

Você também pode tentar isso a partir de um Node no cluster:

{{< note >}}
10.0.0.10 é o IP do Service DNS do cluster, o seu pode ser diferente.
{{< /note >}}

```shell
nslookup hostnames.default.svc.cluster.local 10.0.0.10
```
```none
Server:         10.0.0.10
Address:        10.0.0.10#53

Name:   hostnames.default.svc.cluster.local
Address: 10.0.1.175
```

Se você conseguir fazer uma consulta de nome totalmente qualificado, mas não 
uma relativa, precisará verificar se o arquivo `/etc/resolv.conf` no seu Pod 
está correto. De dentro de um Pod:

```shell
cat /etc/resolv.conf
```

Você deve ver algo como:

```
nameserver 10.0.0.10
search default.svc.cluster.local svc.cluster.local cluster.local example.com
options ndots:5
```

A linha `nameserver` deve indicar o Service DNS do seu cluster. Isso é passado 
para o `kubelet` com a flag `--cluster-dns`.

A linha `search` deve incluir um sufixo apropriado para que o nome do Service 
seja encontrado. Neste caso, ele está procurando Services no Namespace local 
("default.svc.cluster.local"), Services em todos os Namespaces ("svc.cluster.local"), 
e, por último, nomes no cluster ("cluster.local"). Dependendo da sua instalação, 
você pode ter registros adicionais depois disso (até um total de 6). O sufixo 
do cluster é passado para o `kubelet` com a flag `--cluster-domain`. Ao longo 
deste documento, assumimos que o sufixo do cluster é "cluster.local". Seu 
cluster pode estar configurado de forma diferente, e, nesse caso, você deve 
ajustar isso em todos os comandos anteriores.

A linha `options` deve definir `ndots` com um valor alto o suficiente para que 
sua biblioteca cliente de DNS considere os caminhos de pesquisa. O Kubernetes 
define isso como 5 por padrão, o que é suficiente para cobrir todos os nomes 
DNS que ele gera.

### Algum Service funciona pelo nome DNS? {#does-any-service-exist-in-dns}

Se as etapas anteriores ainda falharem, as consultas DNS não estão funcionando 
para seu Service. Você pode dar um passo atrás e verificar o que mais não está 
funcionando. O Service principal do Kubernetes deve sempre funcionar. De dentro 
de um Pod:

```shell
nslookup kubernetes.default
```
```none
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      kubernetes.default
Address 1: 10.0.0.1 kubernetes.default.svc.cluster.local
```

Se isso falhar, consulte a seção [kube-proxy](#is-the-kube-proxy-working) deste 
documento ou até volte ao início e comece novamente, mas, em vez de depurar seu 
próprio Service, depure o Service de DNS.

## O Service funciona pelo IP?

Supondo que você tenha confirmado que o DNS está funcionando, o próximo passo 
é testar se o seu Service funciona pelo endereço IP. A partir de um Pod no seu 
cluster, acesse o IP do Service (obtido com `kubectl get` acima).

```shell
for i in $(seq 1 3); do 
    wget -qO- 10.0.1.175:80
done
```

Isso deve produzir algo como:

```
hostnames-632524106-bbpiw
hostnames-632524106-ly40y
hostnames-632524106-tlaok
```

Se o seu Service estiver funcionando, você deverá obter respostas corretas. 
Caso contrário, há várias possíveis causas para o problema. Continue lendo.

## O Service está definido corretamente?

Pode parecer óbvio, mas você deve realmente verificar duas ou três vezes se 
seu Service está correto e corresponde à porta do seu Pod. Leia novamente seu 
Service e verifique:

```shell
kubectl get service hostnames -o json
```
```json
{
    "kind": "Service",
    "apiVersion": "v1",
    "metadata": {
        "name": "hostnames",
        "namespace": "default",
        "uid": "428c8b6c-24bc-11e5-936d-42010af0a9bc",
        "resourceVersion": "347189",
        "creationTimestamp": "2015-07-07T15:24:29Z",
        "labels": {
            "app": "hostnames"
        }
    },
    "spec": {
        "ports": [
            {
                "name": "default",
                "protocol": "TCP",
                "port": 80,
                "targetPort": 9376,
                "nodePort": 0
            }
        ],
        "selector": {
            "app": "hostnames"
        },
        "clusterIP": "10.0.1.175",
        "type": "ClusterIP",
        "sessionAffinity": "None"
    },
    "status": {
        "loadBalancer": {}
    }
}
```

* A porta do Service que você está tentando acessar está listada em `spec.ports[]`?
* O `targetPort` está correto para seus Pods (alguns Pods usam uma porta diferente da do Service)?
* Se você pretende usar uma porta numérica, ela está especificada como um número (9376) ou como uma string ("9376")?
* Se você pretende usar uma porta nomeada, seus Pods expõem uma porta com o mesmo nome?
* O `protocol` da porta está correto para seus Pods?

## O Service tem algum Endpoint?

Se você chegou até aqui, já confirmou que seu Service está corretamente 
definido e resolvido pelo DNS. Agora, vamos verificar se os Pods que você 
executou estão realmente sendo selecionados pelo Service.

Anteriormente, você viu que os Pods estavam em execução. Você pode verificar 
novamente:

```shell
kubectl get pods -l app=hostnames
```
```none
NAME                        READY     STATUS    RESTARTS   AGE
hostnames-632524106-bbpiw   1/1       Running   0          1h
hostnames-632524106-ly40y   1/1       Running   0          1h
hostnames-632524106-tlaok   1/1       Running   0          1h
```

O argumento `-l app=hostnames` é um seletor de rótulo configurado no Service.

A coluna "AGE" indica que esses Pods têm cerca de uma hora de idade, o que 
implica que estão funcionando corretamente e não estão falhando.

A coluna "RESTARTS" indica que esses Pods não estão falhando frequentemente 
ou sendo reiniciados. Reinicializações frequentes podem causar problemas 
intermitentes de conectividade. Se a contagem de reinicializações for alta, 
leia mais sobre como [depurar pods](/docs/tasks/debug/debug-application/debug-pods).

Dentro do sistema Kubernetes, existe um loop de controle que avalia o seletor 
de cada Service e salva os resultados em um objeto Endpoints correspondente.

```shell
kubectl get endpoints hostnames

NAME        ENDPOINTS
hostnames   10.244.0.5:9376,10.244.0.6:9376,10.244.0.7:9376
```

Isso confirma que o controlador de endpoints encontrou os Pods corretos para 
seu Service. Se a coluna `ENDPOINTS` estiver com `<none>`, você deve verificar 
se o campo `spec.selector` do seu Service realmente seleciona os valores de 
`metadata.labels` nos seus Pods. Um erro comum é ter um erro de digitação ou 
outra inconsistência, como o Service selecionando `app=hostnames`, mas o 
Deployment especificando `run=hostnames`, como em versões anteriores à 1.18, 
onde o comando `kubectl run` também poderia ser usado para criar um Deployment.

## Os Pods estão funcionando?

Neste ponto, você já sabe que seu Service existe e selecionou seus Pods. No 
início deste passo a passo, você verificou os próprios Pods. Vamos verificar 
novamente se os Pods estão realmente funcionando – você pode ignorar o 
mecanismo do Service e ir diretamente para os Pods, conforme listado nos 
Endpoints acima.

{{< note >}}
Esses comandos usam a porta do Pod (9376), em vez da porta do Service (80).
{{< /note >}}

De dentro de um Pod:

```shell
for ep in 10.244.0.5:9376 10.244.0.6:9376 10.244.0.7:9376; do
    wget -qO- $ep
done
```

Isso deve produzir algo como:

```
hostnames-632524106-bbpiw
hostnames-632524106-ly40y
hostnames-632524106-tlaok
```

Você espera que cada Pod na lista de Endpoints retorne seu próprio hostname. 
Se isso não acontecer (ou se o comportamento correto for diferente para seus 
próprios Pods), você deve investigar o que está acontecendo.

## O kube-proxy está funcionando? {#is-the-kube-proxy-working}

Se você chegou até aqui, seu Service está em execução, possui Endpoints e seus 
Pods estão realmente respondendo. Neste ponto, todo o mecanismo de proxy do 
Service pode ser o problema. Vamos confirmá-lo, parte por parte.

A implementação padrão dos Services, e a mais usada na maioria dos clusters, 
é o kube-proxy. Esse é um programa que roda em cada nó e configura um dos 
mecanismos disponíveis para fornecer a abstração de Service. Se seu cluster 
não usa kube-proxy, as próximas seções não se aplicarão, e você precisará 
investigar qual implementação de Services está em uso.

### O kube-proxy está em execução?

Confirme que o `kube-proxy` está rodando nos seus Nodes. Executando diretamente 
em um Node, você deve obter algo como o seguinte:

```shell
ps auxw | grep kube-proxy
```
```none
root  4194  0.4  0.1 101864 17696 ?    Sl Jul04  25:43 /usr/local/bin/kube-proxy --master=https://kubernetes-master --kubeconfig=/var/lib/kube-proxy/kubeconfig --v=2
```

Em seguida, confirme que ele não está falhando em algo óbvio, como contatar o 
master. Para isso, você precisará verificar os logs. O acesso aos logs depende 
do sistema operacional do Node. Em alguns sistemas, é um arquivo, como 
`/var/log/kube-proxy.log`, enquanto em outros, os logs podem ser acessados com 
`journalctl`. Você deve ver algo como:

```none
I1027 22:14:53.995134    5063 server.go:200] Running in resource-only container "/kube-proxy"
I1027 22:14:53.998163    5063 server.go:247] Using iptables Proxier.
I1027 22:14:54.038140    5063 proxier.go:352] Setting endpoints for "kube-system/kube-dns:dns-tcp" to [10.244.1.3:53]
I1027 22:14:54.038164    5063 proxier.go:352] Setting endpoints for "kube-system/kube-dns:dns" to [10.244.1.3:53]
I1027 22:14:54.038209    5063 proxier.go:352] Setting endpoints for "default/kubernetes:https" to [10.240.0.2:443]
I1027 22:14:54.038238    5063 proxier.go:429] Not syncing iptables until Services and Endpoints have been received from master
I1027 22:14:54.040048    5063 proxier.go:294] Adding new service "default/kubernetes:https" at 10.0.0.1:443/TCP
I1027 22:14:54.040154    5063 proxier.go:294] Adding new service "kube-system/kube-dns:dns" at 10.0.0.10:53/UDP
I1027 22:14:54.040223    5063 proxier.go:294] Adding new service "kube-system/kube-dns:dns-tcp" at 10.0.0.10:53/TCP
```

Se você vir mensagens de erro sobre a impossibilidade de contatar o master, 
deve verificar novamente a configuração do seu Node e as etapas de instalação.

O kube-proxy pode rodar em diferentes modos. No log listado acima, a linha 
`Using iptables Proxier` indica que o kube-proxy está rodando no modo 
"iptables". O outro modo mais comum é o "ipvs".

#### Modo Iptables

No modo "iptables", você deve ver algo como o seguinte em um Node:

```shell
iptables-save | grep hostnames
```
```none
-A KUBE-SEP-57KPRZ3JQVENLNBR -s 10.244.3.6/32 -m comment --comment "default/hostnames:" -j MARK --set-xmark 0x00004000/0x00004000
-A KUBE-SEP-57KPRZ3JQVENLNBR -p tcp -m comment --comment "default/hostnames:" -m tcp -j DNAT --to-destination 10.244.3.6:9376
-A KUBE-SEP-WNBA2IHDGP2BOBGZ -s 10.244.1.7/32 -m comment --comment "default/hostnames:" -j MARK --set-xmark 0x00004000/0x00004000
-A KUBE-SEP-WNBA2IHDGP2BOBGZ -p tcp -m comment --comment "default/hostnames:" -m tcp -j DNAT --to-destination 10.244.1.7:9376
-A KUBE-SEP-X3P2623AGDH6CDF3 -s 10.244.2.3/32 -m comment --comment "default/hostnames:" -j MARK --set-xmark 0x00004000/0x00004000
-A KUBE-SEP-X3P2623AGDH6CDF3 -p tcp -m comment --comment "default/hostnames:" -m tcp -j DNAT --to-destination 10.244.2.3:9376
-A KUBE-SERVICES -d 10.0.1.175/32 -p tcp -m comment --comment "default/hostnames: cluster IP" -m tcp --dport 80 -j KUBE-SVC-NWV5X2332I4OT4T3
-A KUBE-SVC-NWV5X2332I4OT4T3 -m comment --comment "default/hostnames:" -m statistic --mode random --probability 0.33332999982 -j KUBE-SEP-WNBA2IHDGP2BOBGZ
-A KUBE-SVC-NWV5X2332I4OT4T3 -m comment --comment "default/hostnames:" -m statistic --mode random --probability 0.50000000000 -j KUBE-SEP-X3P2623AGDH6CDF3
-A KUBE-SVC-NWV5X2332I4OT4T3 -m comment --comment "default/hostnames:" -j KUBE-SEP-57KPRZ3JQVENLNBR
```

Para cada porta de cada Service, deve haver uma regra em `KUBE-SERVICES` e 
uma cadeia `KUBE-SVC-<hash>`. Para cada endpoint do Pod, deve haver um pequeno 
número de regras nessa cadeia `KUBE-SVC-<hash>` e uma cadeia `KUBE-SEP-<hash>` 
com algumas regras dentro dela. As regras exatas podem variar dependendo da sua 
configuração específica (incluindo node-ports e load-balancers).

#### Modo IPVS

No modo "ipvs", você deve ver algo como o seguinte em um Node:

```shell
ipvsadm -ln
```
```none
Prot LocalAddress:Port Scheduler Flags
  -> RemoteAddress:Port           Forward Weight ActiveConn InActConn
...
TCP  10.0.1.175:80 rr
  -> 10.244.0.5:9376               Masq    1      0          0
  -> 10.244.0.6:9376               Masq    1      0          0
  -> 10.244.0.7:9376               Masq    1      0          0
...
```

Para cada porta de cada Service, além de qualquer NodePort, IP externo e IP de 
load-balancer, o kube-proxy criará um servidor virtual. Para cada endpoint de 
Pod, ele criará servidores reais correspondentes. Neste exemplo, o Service 
`hostnames` (`10.0.1.175:80`) tem 3 endpoints (`10.244.0.5:9376`, 
`10.244.0.6:9376`, `10.244.0.7:9376`).

### O kube-proxy está realizando o proxy?

Supondo que você tenha identificado um dos casos acima, tente novamente acessar 
seu Service pelo IP a partir de um dos seus Nodes:

```shell
curl 10.0.1.175:80
```
```none
hostnames-632524106-bbpiw
```

Se isso ainda falhar, verifique os logs do `kube-proxy` em busca de linhas 
específicas como:

```none
Setting endpoints for default/hostnames:default to [10.244.0.5:9376 10.244.0.6:9376 10.244.0.7:9376]
```

Se você não encontrar essas mensagens nos logs, tente reiniciar o `kube-proxy` 
com a flag `-v` definida como 4 e, em seguida, verifique os logs novamente.

### Caso extremo: Um Pod não consegue acessar a si mesmo pelo IP do Service {#a-pod-fails-to-reach-itself-via-the-service-ip}

Isso pode parecer improvável, mas acontece e deveria funcionar corretamente.

Esse problema pode ocorrer quando a rede não está configurada corretamente para 
tráfego "hairpin", geralmente quando o `kube-proxy` está rodando no modo 
`iptables` e os Pods estão conectados por meio de uma rede bridge. O `Kubelet` 
expõe um parâmetro `hairpin-mode` na [linha de comando](/docs/reference/command-line-tools-reference/kubelet/) 
que permite que os endpoints de um Service realizem balanceamento de carga para 
si mesmos ao tentar acessar seu próprio VIP do Service. O parâmetro 
`hairpin-mode` deve estar configurado como `hairpin-veth` ou `promiscuous-bridge`.

As etapas comuns para solucionar esse problema são as seguintes:

* Confirme se o `hairpin-mode` está configurado como `hairpin-veth` ou 
`promiscuous-bridge`. Você deve ver algo semelhante ao seguinte. No exemplo 
abaixo, `hairpin-mode` está definido como `promiscuous-bridge`:

```shell
ps auxw | grep kubelet
```
```none
root      3392  1.1  0.8 186804 65208 ?        Sl   00:51  11:11 /usr/local/bin/kubelet --enable-debugging-handlers=true --config=/etc/kubernetes/manifests --allow-privileged=True --v=4 --cluster-dns=10.0.0.10 --cluster-domain=cluster.local --configure-cbr0=true --cgroup-root=/ --system-cgroups=/system --hairpin-mode=promiscuous-bridge --runtime-cgroups=/docker-daemon --kubelet-cgroups=/kubelet --babysit-daemons=true --max-pods=110 --serialize-image-pulls=false --outofdisk-transition-frequency=0
```

* Confirme o `hairpin-mode` efetivo. Para isso, será necessário verificar o 
log do kubelet. O acesso aos logs depende do sistema operacional do Node. Em 
alguns sistemas, ele está em um arquivo como `/var/log/kubelet.log`, enquanto 
em outros, os logs podem ser acessados com `journalctl`. Observe que o modo 
hairpin efetivo pode não corresponder à flag `--hairpin-mode` devido a 
questões de compatibilidade. Verifique se há linhas de log contendo a palavra-chave 
`hairpin` no `kubelet.log`. Deve haver linhas indicando o modo hairpin efetivo, 
como algo semelhante ao seguinte:

```none
I0629 00:51:43.648698    3252 kubelet.go:380] Hairpin mode set to "promiscuous-bridge"
```

* Se o modo hairpin efetivo for `hairpin-veth`, certifique-se de que o `Kubelet` 
tem permissão para operar em `/sys` no Node. Se tudo estiver funcionando 
corretamente, você deve ver algo como:

```shell
for intf in /sys/devices/virtual/net/cbr0/brif/*; do cat $intf/hairpin_mode; done
```
```none
1
1
1
1
```

* Se o modo hairpin efetivo for `promiscuous-bridge`, certifique-se de que o 
`Kubelet` tem permissão para manipular a bridge Linux no Node. Se a bridge `cbr0` 
for usada e configurada corretamente, você deve ver:

```shell
ifconfig cbr0 |grep PROMISC
```
```none
UP BROADCAST RUNNING PROMISC MULTICAST  MTU:1460  Metric:1
```

* Procure ajuda se nenhuma das opções acima funcionar.

## Procure ajuda

Se você chegou até aqui, algo muito estranho está acontecendo. Seu Service 
está rodando, tem Endpoints e seus Pods estão realmente respondendo. O DNS 
está funcionando e o `kube-proxy` não parece estar com problemas. E, mesmo 
assim, seu Service não está funcionando. Informe-nos o que está acontecendo, 
para que possamos ajudar a investigar!

Entre em contato conosco pelo
[Slack](https://slack.k8s.io/), 
[Fórum](https://discuss.kubernetes.io) ou 
[GitHub](https://github.com/kubernetes/kubernetes).

## {{% heading "whatsnext" %}}

Visite o documento de [visão geral de solução de problemas](/docs/tasks/debug/) 
para mais informações.