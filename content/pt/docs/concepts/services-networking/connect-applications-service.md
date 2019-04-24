---
reviewers:
- femrtnz
- jcjesus
title: Conectando Aplicativos com Serviços
content_template: templates/concept
weight: 30
---


{{% capture overview %}}

## O modelo Kubernetes para conectar contêineres

Agora que você tem um aplicativo replicado e em execução contínua, você pode expô-lo em uma rede. Antes de discutir a abordagem Kubernetes à rede, vale a pena contrastá-la com a maneira "normal" de trabalhar em rede com o Docker.

Por padrão, o Docker usa a rede privada do host, portanto, os contêineres só podem falar com outros contêineres se estiverem na mesma máquina. Para que os contêineres do Docker se comuniquem entre os nós, deve haver portas alocadas no próprio endereço IP da máquina, que são encaminhadas ou intermediadas por proxy para os contêineres. Isso obviamente significa que os contêineres devem coordenar as portas que usam com muito cuidado ou as portas devem ser alocadas dinamicamente.

A coordenação de portas entre vários desenvolvedores é muito difícil de fazer em escala e expõe os usuários a problemas no nível do cluster fora de seu controle. O Kubernetes assume que os pods podem se comunicar com outros pods, independentemente de qual host eles se hospedam. Damos a cada pod seu próprio endereço IP privado de cluster, para que você não precise criar explicitamente links entre pods ou portas de contêiner de mapa para portas de host. Isso significa que os contêineres dentro de um Pod podem alcançar as portas uns dos outros no host local, e todos os pods em um cluster podem se ver sem o NAT. O restante deste documento irá elaborar como você pode executar serviços confiáveis ​​em tal modelo de rede.

Este guia usa um servidor nginx simples para demonstrar a prova de conceito. Os mesmos princípios são incorporados em um aplicativo mais completo [Jenkins CI](https://kubernetes.io/blog/2015/07/strong-simple-ssl-for-kubernetes).

{{% /capture %}}

{{% capture body %}}

## Expondo pods ao cluster

Fizemos isso em um exemplo anterior, mas vamos fazer isso mais uma vez e nos concentrar na perspectiva da rede.
Crie um nginx Pod e observe que ele possui uma especificação de porta do contêiner:

{{< codenew file="service/networking/run-my-nginx.yaml" >}}

Isso torna acessível de qualquer nó no cluster. Verifique os nós nos quais o Pod está sendo executado:

```shell
kubectl apply -f ./run-my-nginx.yaml
kubectl get pods -l run=my-nginx -o wide
```
```
NAME                        READY     STATUS    RESTARTS   AGE       IP            NODE
my-nginx-3800858182-jr4a2   1/1       Running   0          13s       10.244.3.4    kubernetes-minion-905m
my-nginx-3800858182-kna2y   1/1       Running   0          13s       10.244.2.5    kubernetes-minion-ljyd
```

Verifique os IPs dos seus pods:

```shell
kubectl get pods -l run=my-nginx -o yaml | grep podIP
    podIP: 10.244.3.4
    podIP: 10.244.2.5
```

Você deve ser capaz de fazer ssh em qualquer nó do cluster e enrolar ambos os IPs. Observe que os contêineres * não * estão usando a porta 80 no nó, nem existem regras NAT especiais para rotear o tráfego para o conjunto. Isso significa que você pode executar vários pods nginx no mesmo nó, todos usando o mesmo containerPort e acessá-los de qualquer outro pod ou nó em seu cluster usando IP. Como o Docker, as portas ainda podem ser publicadas nas interfaces do nó do host, mas a necessidade disso é radicalmente diminuída devido ao modelo de rede.

Você pode ler mais sobre [como conseguimos isso](/docs/concepts/cluster-administration/networking/#how-to-achieve-this) se você está curioso.

## Criando um Serviço

Portanto, temos pods executando o nginx em um espaço de endereçamento plano e amplo. Em teoria, você poderia falar diretamente com esses pods, mas o que acontece quando um nó morre? Os pods morrem com isso e a Implantação criará novos, com diferentes IPs. Este é o problema que um Serviço resolve.

Um Serviço do Kubernetes é uma abstração que define um conjunto lógico de pods em algum lugar do cluster, que fornecem a mesma funcionalidade. Quando criado, cada Serviço recebe um endereço IP exclusivo (também chamado de clusterIP). Esse endereço está vinculado à vida útil do Serviço e não será alterado enquanto o Serviço estiver ativo. Os pods podem ser configurados para falar com o Serviço e saber que a comunicação com o Serviço será automaticamente balanceada para algum pod que seja membro do Serviço.

Você pode criar um Serviço para suas 2 réplicas nginx com `kubectl expose`:

```shell
kubectl expose deployment/my-nginx
```
```
service/my-nginx exposed
```

Isso é equivalente a `kubectl apply -f` o seguinte yaml:

{{< codenew file="service/networking/nginx-svc.yaml" >}}

Esta especificação criará um Serviço que segmente a porta TCP 80 em qualquer Pod
com o `run: my-nginx` rotular e expô-lo em uma porta de serviço
(`targetPort`: é a porta na qual o contêiner aceita tráfego, `port`: é o
porta de serviço abstraída, que pode ser qualquer porta que outros pods usam para acessar
Serviço).
Acesse as definições dos serviços na [API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core)
para ver a lista de campos suportados na definição de serviço.
Verifique seu serviço:

```shell
kubectl get svc my-nginx
```
```
NAME       TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
my-nginx   ClusterIP   10.0.162.149   <none>        80/TCP    21s
```

Como mencionado anteriormente, um serviço é respaldado por um grupo de pods. Esses pods são
exposta através `endpoints`. O seletor do serviço será avaliado continuamente
e os resultados serão POSTados para um objeto de Endpoints também chamado `my-nginx`.
Quando um pod morre, ele é automaticamente removido dos Endpoints e novos pods
correspondentes do seletor do serviço será automaticamente adicionado aos Endpoints.
Verifique os Endpoints e observe que os IPs são os mesmos que os Pods criados em
o primeiro passo:

```shell
kubectl describe svc my-nginx
```
```
Name:                my-nginx
Namespace:           default
Labels:              run=my-nginx
Annotations:         <none>
Selector:            run=my-nginx
Type:                ClusterIP
IP:                  10.0.162.149
Port:                <unset> 80/TCP
Endpoints:           10.244.2.5:80,10.244.3.4:80
Session Affinity:    None
Events:              <none>
```
```shell
kubectl get ep my-nginx
```
```
NAME       ENDPOINTS                     AGE
my-nginx   10.244.2.5:80,10.244.3.4:80   1m
```

Agora você deve ser capaz de acessar o serviço nginx em `<CLUSTER-IP>:<PORT>` de
qualquer nó no seu cluster. Note que o IP de Serviço é completamente virtual,
nunca acessa diretamente. Se você está curioso sobre como isso funciona, você pode ler mais
sobre o [proxy de serviço](/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies).

## Acessando o Serviço

O Kubernetes suporta dois modos primários de encontrar um serviço - variáveis ​​de ambiente
e DNS. O primeiro funciona fora da caixa, enquanto o segundo requer a
[Addon de cluster CoreDNS](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/dns/coredns).

### variáveis ​​ambientais

Quando um Pod é executado em um Nó, o kubelet adiciona um conjunto de variáveis ​​de ambiente para
cada serviço ativo. Isso introduz um problema de ordem. Para ver porque, inspecione
o ambiente da sua execução nginx Pods (seu nome Pod será diferente):

```shell
kubectl exec my-nginx-3800858182-jr4a2 -- printenv | grep SERVICE
```
```
KUBERNETES_SERVICE_HOST=10.0.0.1
KUBERNETES_SERVICE_PORT=443
KUBERNETES_SERVICE_PORT_HTTPS=443
```

Note que não há menção ao seu serviço. Isso é porque você criou as réplicas
antes do serviço. Outra desvantagem de fazer isso é que o agendador pode
colocar ambos os Pods na mesma máquina, o que derrubará todo o seu serviço se
ele morrer. Podemos fazer isso da maneira certa, matando os 2 Pods e esperar pelo
Deploy para recriá-los. Desta vez, o Serviço existirá *antes* das
réplicas. Isso fornecerá a você o Serviço em nível de agendamento de seus pods
(desde que todos os seus nós tenham capacidade igual), bem como as variáveis de ambiente corretas:

```shell
kubectl scale deployment my-nginx --replicas=0; kubectl scale deployment my-nginx --replicas=2;

kubectl get pods -l run=my-nginx -o wide
```
```
NAME                        READY     STATUS    RESTARTS   AGE     IP            NODE
my-nginx-3800858182-e9ihh   1/1       Running   0          5s      10.244.2.7    kubernetes-minion-ljyd
my-nginx-3800858182-j4rm4   1/1       Running   0          5s      10.244.3.8    kubernetes-minion-905m
```

Você pode perceber que os pods têm nomes diferentes, já que são mortos e recriados.

```shell
kubectl exec my-nginx-3800858182-e9ihh -- printenv | grep SERVICE
```
```
KUBERNETES_SERVICE_PORT=443
MY_NGINX_SERVICE_HOST=10.0.162.149
KUBERNETES_SERVICE_HOST=10.0.0.1
MY_NGINX_SERVICE_PORT=80
KUBERNETES_SERVICE_PORT_HTTPS=443
```

### DNS

O Kubernetes oferece um serviço, como um complemento de DNS ao cluster que atribui automaticamente nomes de DNS a outros Serviços. Você pode verificar se está sendo executado em seu cluster:

```shell
kubectl get services kube-dns --namespace=kube-system
```
```
NAME       TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)         AGE
kube-dns   ClusterIP   10.0.0.10    <none>        53/UDP,53/TCP   8m
```

Se não estiver em execução, você pode [ativá-lo](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/dns/kube-dns/README.md#how-do-i-configure-it).
O restante desta seção assumirá que você tem um Serviço com um IP de longa duração
(my-nginx) e um servidor DNS que atribuiu um nome a esse IP (o CoreDNS
cluster addon), para que você possa falar com o Serviço a partir de qualquer pod em seu cluster usando
métodos padrão (por exemplo, gethostbyname). Vamos executar o aplicativo curl para testar isso:

```shell
kubectl run curl --image=radial/busyboxplus:curl -i --tty
```
```
Esperando o pod default/curl-131556218-9fnch para estar em execução, o status é pendente, pod ready:false
Pressione Enter para o prompt de comando
```

Então, aperte enter e corra `nslookup my-nginx`:

```shell
[ root@curl-131556218-9fnch:/ ]$ nslookup my-nginx
Server:    10.0.0.10
Address 1: 10.0.0.10

Name:      my-nginx
Address 1: 10.0.162.149
```

## Protegendo o serviço

Até agora só acessamos o servidor nginx de dentro do cluster. Antes de expor o Serviço à Internet, você quer ter certeza de que o canal de comunicação seja seguro. Para isso, você precisará de:

* Certificados auto-assinados para https (a menos que você já tenha um certificado de identidade)
* Um servidor nginx configurado para usar os certificados
* [Chaves criptografadas](/docs/concepts/configuration/secret/) que torna os certificados acessíveis aos pods

Você pode adquirir todos estes a partir do [exemplo nginx https](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/https-nginx/). Isso requer a instalação de ferramentas. Se você não quiser instalá-los, siga as etapas manuais mais tarde. Em resumo:

```shell
make keys secret KEY=/tmp/nginx.key CERT=/tmp/nginx.crt SECRET=/tmp/secret.json
kubectl apply -f /tmp/secret.json
```
```
secret/nginxsecret created
```
```shell
kubectl get secrets
```
```
NAME                  TYPE                                  DATA      AGE
default-token-il9rc   kubernetes.io/service-account-token   1         1d
nginxsecret           Opaque                                2         1m
```
A seguir estão as etapas manuais a serem seguidas, caso você tenha problemas ao executar o make (no Windows, por exemplo):

```shell
#criar um par de chaves privadas públicas
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /d/tmp/nginx.key -out /d/tmp/nginx.crt -subj "/CN=my-nginx/O=my-nginx"
#converter as chaves para codificação base64
cat /d/tmp/nginx.crt | base64
cat /d/tmp/nginx.key | base64
```
Use a saída dos comandos anteriores para criar um arquivo yaml da seguinte maneira. O valor codificado de base64 deve estar em uma única linha.

```yaml
apiVersion: "v1"
kind: "Secret"
metadata:
  name: "nginxsecret"
  namespace: "default"
data:
  nginx.crt: "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURIekNDQWdlZ0F3SUJBZ0lKQUp5M3lQK0pzMlpJTUEwR0NTcUdTSWIzRFFFQkJRVUFNQ1l4RVRBUEJnTlYKQkFNVENHNW5hVzU0YzNaak1SRXdEd1lEVlFRS0V3aHVaMmx1ZUhOMll6QWVGdzB4TnpFd01qWXdOekEzTVRKYQpGdzB4T0RFd01qWXdOekEzTVRKYU1DWXhFVEFQQmdOVkJBTVRDRzVuYVc1NGMzWmpNUkV3RHdZRFZRUUtFd2h1CloybHVlSE4yWXpDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBSjFxSU1SOVdWM0IKMlZIQlRMRmtobDRONXljMEJxYUhIQktMSnJMcy8vdzZhU3hRS29GbHlJSU94NGUrMlN5ajBFcndCLzlYTnBwbQppeW1CL3JkRldkOXg5UWhBQUxCZkVaTmNiV3NsTVFVcnhBZW50VWt1dk1vLzgvMHRpbGhjc3paenJEYVJ4NEo5Ci82UVRtVVI3a0ZTWUpOWTVQZkR3cGc3dlVvaDZmZ1Voam92VG42eHNVR0M2QURVODBpNXFlZWhNeVI1N2lmU2YKNHZpaXdIY3hnL3lZR1JBRS9mRTRqakxCdmdONjc2SU90S01rZXV3R0ljNDFhd05tNnNTSzRqYUNGeGpYSnZaZQp2by9kTlEybHhHWCtKT2l3SEhXbXNhdGp4WTRaNVk3R1ZoK0QrWnYvcW1mMFgvbVY0Rmo1NzV3ajFMWVBocWtsCmdhSXZYRyt4U1FVQ0F3RUFBYU5RTUU0d0hRWURWUjBPQkJZRUZPNG9OWkI3YXc1OUlsYkROMzhIYkduYnhFVjcKTUI4R0ExVWRJd1FZTUJhQUZPNG9OWkI3YXc1OUlsYkROMzhIYkduYnhFVjdNQXdHQTFVZEV3UUZNQU1CQWY4dwpEUVlKS29aSWh2Y05BUUVGQlFBRGdnRUJBRVhTMW9FU0lFaXdyMDhWcVA0K2NwTHI3TW5FMTducDBvMm14alFvCjRGb0RvRjdRZnZqeE04Tzd2TjB0clcxb2pGSW0vWDE4ZnZaL3k4ZzVaWG40Vm8zc3hKVmRBcStNZC9jTStzUGEKNmJjTkNUekZqeFpUV0UrKzE5NS9zb2dmOUZ3VDVDK3U2Q3B5N0M3MTZvUXRUakViV05VdEt4cXI0Nk1OZWNCMApwRFhWZmdWQTRadkR4NFo3S2RiZDY5eXM3OVFHYmg5ZW1PZ05NZFlsSUswSGt0ejF5WU4vbVpmK3FqTkJqbWZjCkNnMnlwbGQ0Wi8rUUNQZjl3SkoybFIrY2FnT0R4elBWcGxNSEcybzgvTHFDdnh6elZPUDUxeXdLZEtxaUMwSVEKQ0I5T2wwWW5scE9UNEh1b2hSUzBPOStlMm9KdFZsNUIyczRpbDlhZ3RTVXFxUlU9Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K"
  nginx.key: "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUV2UUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktjd2dnU2pBZ0VBQW9JQkFRQ2RhaURFZlZsZHdkbFIKd1V5eFpJWmVEZWNuTkFhbWh4d1NpeWF5N1AvOE9ta3NVQ3FCWmNpQ0RzZUh2dGtzbzlCSzhBZi9WemFhWm9zcApnZjYzUlZuZmNmVUlRQUN3WHhHVFhHMXJKVEVGSzhRSHA3VkpMcnpLUC9QOUxZcFlYTE0yYzZ3MmtjZUNmZitrCkU1bEVlNUJVbUNUV09UM3c4S1lPNzFLSWVuNEZJWTZMMDUrc2JGQmd1Z0ExUE5JdWFubm9UTWtlZTRuMG4rTDQKb3NCM01ZUDhtQmtRQlAzeE9JNHl3YjREZXUraURyU2pKSHJzQmlIT05Xc0RadXJFaXVJMmdoY1kxeWIyWHI2UAozVFVOcGNSbC9pVG9zQngxcHJHclk4V09HZVdPeGxZZmcvbWIvNnBuOUYvNWxlQlkrZStjSTlTMkQ0YXBKWUdpCkwxeHZzVWtGQWdNQkFBRUNnZ0VBZFhCK0xkbk8ySElOTGo5bWRsb25IUGlHWWVzZ294RGQwci9hQ1Zkank4dlEKTjIwL3FQWkUxek1yall6Ry9kVGhTMmMwc0QxaTBXSjdwR1lGb0xtdXlWTjltY0FXUTM5SjM0VHZaU2FFSWZWNgo5TE1jUHhNTmFsNjRLMFRVbUFQZytGam9QSFlhUUxLOERLOUtnNXNrSE5pOWNzMlY5ckd6VWlVZWtBL0RBUlBTClI3L2ZjUFBacDRuRWVBZmI3WTk1R1llb1p5V21SU3VKdlNyblBESGtUdW1vVlVWdkxMRHRzaG9reUxiTWVtN3oKMmJzVmpwSW1GTHJqbGtmQXlpNHg0WjJrV3YyMFRrdWtsZU1jaVlMbjk4QWxiRi9DSmRLM3QraTRoMTVlR2ZQegpoTnh3bk9QdlVTaDR2Q0o3c2Q5TmtEUGJvS2JneVVHOXBYamZhRGR2UVFLQmdRRFFLM01nUkhkQ1pKNVFqZWFKClFGdXF4cHdnNzhZTjQyL1NwenlUYmtGcVFoQWtyczJxWGx1MDZBRzhrZzIzQkswaHkzaE9zSGgxcXRVK3NHZVAKOWRERHBsUWV0ODZsY2FlR3hoc0V0L1R6cEdtNGFKSm5oNzVVaTVGZk9QTDhPTm1FZ3MxMVRhUldhNzZxelRyMgphRlpjQ2pWV1g0YnRSTHVwSkgrMjZnY0FhUUtCZ1FEQmxVSUUzTnNVOFBBZEYvL25sQVB5VWs1T3lDdWc3dmVyClUycXlrdXFzYnBkSi9hODViT1JhM05IVmpVM25uRGpHVHBWaE9JeXg5TEFrc2RwZEFjVmxvcG9HODhXYk9lMTAKMUdqbnkySmdDK3JVWUZiRGtpUGx1K09IYnRnOXFYcGJMSHBzUVpsMGhucDBYSFNYVm9CMUliQndnMGEyOFVadApCbFBtWmc2d1BRS0JnRHVIUVV2SDZHYTNDVUsxNFdmOFhIcFFnMU16M2VvWTBPQm5iSDRvZUZKZmcraEppSXlnCm9RN3hqWldVR3BIc3AyblRtcHErQWlSNzdyRVhsdlhtOElVU2FsbkNiRGlKY01Pc29RdFBZNS9NczJMRm5LQTQKaENmL0pWb2FtZm1nZEN0ZGtFMXNINE9MR2lJVHdEbTRpb0dWZGIwMllnbzFyb2htNUpLMUI3MkpBb0dBUW01UQpHNDhXOTVhL0w1eSt5dCsyZ3YvUHM2VnBvMjZlTzRNQ3lJazJVem9ZWE9IYnNkODJkaC8xT2sybGdHZlI2K3VuCnc1YytZUXRSTHlhQmd3MUtpbGhFZDBKTWU3cGpUSVpnQWJ0LzVPbnlDak9OVXN2aDJjS2lrQ1Z2dTZsZlBjNkQKckliT2ZIaHhxV0RZK2Q1TGN1YSt2NzJ0RkxhenJsSlBsRzlOZHhrQ2dZRUF5elIzT3UyMDNRVVV6bUlCRkwzZAp4Wm5XZ0JLSEo3TnNxcGFWb2RjL0d5aGVycjFDZzE2MmJaSjJDV2RsZkI0VEdtUjZZdmxTZEFOOFRwUWhFbUtKCnFBLzVzdHdxNWd0WGVLOVJmMWxXK29xNThRNTBxMmk1NVdUTThoSDZhTjlaMTltZ0FGdE5VdGNqQUx2dFYxdEYKWSs4WFJkSHJaRnBIWll2NWkwVW1VbGc9Ci0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS0K"
```
Agora crie as chaves criptografadas usando o arquivo:

```shell
kubectl apply -f nginxsecrets.yaml
kubectl get secrets
```
```
NAME                  TYPE                                  DATA      AGE
default-token-il9rc   kubernetes.io/service-account-token   1         1d
nginxsecret           Opaque                                2         1m
```

Agora modifique suas réplicas nginx para iniciar um servidor https usando o certificado com a chave criptografada, e o Serviço, para expor as duas portas (80 e 443):

{{< codenew file="service/networking/nginx-secure-app.yaml" >}}

Pontos dignos de nota sobre o manifesto nginx-secure-app:

- Ele contém as especificações de implantação e serviço no mesmo arquivo.
- O [servidor nginx](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/https-nginx/default.conf)
  atende o tráfego HTTP na porta 80 e o tráfego HTTPS em 443 e o serviço nginx
  expõe as duas portas.
- Cada contêiner tem acesso às chaves através de um volume montado em `/etc/nginx/ssl`.
  Esta é a configuração *antes de* o servidor nginx ser iniciado.

```shell
kubectl delete deployments,svc my-nginx; kubectl create -f ./nginx-secure-app.yaml
```

Neste ponto, você pode acessar o servidor nginx de qualquer nó.

```shell
kubectl get pods -o yaml | grep -i podip
    podIP: 10.244.3.5
node $ curl -k https://10.244.3.5
...
<h1>Bem vindo ao nginx!</h1>
```

Note como fornecemos o parâmetro `-k` para enrolar na última etapa, porque não sabemos nada sobre os pods que executam o nginx no momento da geração do certificado,
então temos que dizer ao curl para ignorar a incompatibilidade do CName. Ao criar um serviço, vinculamos o CName usado no certificado ao nome DNS real usado pelos pods durante a pesquisa de serviço.
Vamos testar isso a partir de um pod (o mesmo segredo está sendo reutilizado para simplificar, o pod só precisa de nginx.crt para acessar o serviço):

{{< codenew file="service/networking/curlpod.yaml" >}}

```shell
kubectl apply -f ./curlpod.yaml
kubectl get pods -l app=curlpod
```
```
NAME                               READY     STATUS    RESTARTS   AGE
curl-deployment-1515033274-1410r   1/1       Running   0          1m
```
```shell
kubectl exec curl-deployment-1515033274-1410r -- curl https://my-nginx --cacert /etc/nginx/ssl/nginx.crt
...
<title>Bem vindo ao nginx!</title>
...
```

## Expondo o serviço

Para algumas partes de seus aplicativos, você pode querer expor um Serviço a um
endereço IP externo. O Kubernetes suporta duas maneiras de fazer isso: NodePorts e
LoadBalancers. O Serviço criado na última seção já usou o `NodePort`,
então a sua réplica HTTPS nginx está pronta para servir o tráfego na internet se o seu
nó tem um IP público.

```shell
kubectl get svc my-nginx -o yaml | grep nodePort -C 5
  uid: 07191fb3-f61a-11e5-8ae5-42010af00002
spec:
  clusterIP: 10.0.162.149
  ports:
  - name: http
    nodePort: 31704
    port: 8080
    protocol: TCP
    targetPort: 80
  - name: https
    nodePort: 32453
    port: 443
    protocol: TCP
    targetPort: 443
  selector:
    run: my-nginx
```
```shell
kubectl get nodes -o yaml | grep ExternalIP -C 1
    - address: 104.197.41.11
      type: ExternalIP
    allocatable:
--
    - address: 23.251.152.56
      type: ExternalIP
    allocatable:
...

$ curl https://<EXTERNAL-IP>:<NODE-PORT> -k
...
<h1>Bem vindo ao nginx!</h1>
```

Vamos agora recriar o serviço para usar um balanceador de carga em nuvem, basta alterar o `Type` do `my-nginx` Serviço de `NodePort` para `LoadBalancer`:

```shell
kubectl edit svc my-nginx
kubectl get svc my-nginx
```
```
NAME       TYPE        CLUSTER-IP     EXTERNAL-IP        PORT(S)               AGE
my-nginx   ClusterIP   10.0.162.149   162.222.184.144    80/TCP,81/TCP,82/TCP  21s
```
```
curl https://<EXTERNAL-IP> -k
...
<title>Welcome to nginx!</title>
```

O endereço IP no `EXTERNAL-IP` coluna é a que está disponível na internet pública. o `CLUSTER-IP` só está disponível dentro do seu
cluster/rede de nuvem privada.

Observe que na AWS, digite `LoadBalancer` cria um ELB, que usa um (long)
hostname, não um IP. É muito longo para caber no padrão saída `kubectl get svc`, na verdade, então você precisa fazer `kubectl describe service my-nginx` para
Veja. Você verá algo assim:

```shell
kubectl describe service my-nginx
...
LoadBalancer Ingress:   a320587ffd19711e5a37606cf4a74574-1142138393.us-east-1.elb.amazonaws.com
...
```

{{% /capture %}}

{{% capture whatsnext %}}

O Kubernetes também suporta Central de Serviços, que podem abranger
clusters e provedores de nuvem, para fornecer maior disponibilidade,
melhor tolerância a falhas e maior escalabilidade para seus serviços. Ver
a [Guia do Usuário da Central de Serviços](/docs/concepts/cluster-administration/federation-service-discovery/)
para mais informações.

{{% /capture %}}
