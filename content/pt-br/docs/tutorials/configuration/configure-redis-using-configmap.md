---
title: Configurando o Redis usando um ConfigMap
content_type: tutorial
weight: 30
---

<!-- overview -->

Esta página fornece um exemplo prático de como configurar o Redis usando um ConfigMap e baseia-se na tarefa
[Configurar um Pod para usar um ConfigMap](/pt-br/docs/tasks/configure-pod-container/configure-pod-configmap/).



## {{% heading "objectives" %}}


* Criar um ConfigMap com valores de configuração para o Redis.
* Criar um Pod do Redis que monte e use o ConfigMap criado.
* Verificar se a configuração foi aplicada corretamente.


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* O exemplo mostrado nesta página funciona com `kubectl` 1.14 ou superior.
* Entenda [Configurar um Pod para usar um ConfigMap](/pt-br/docs/tasks/configure-pod-container/configure-pod-configmap/).


<!-- lessoncontent -->


## Exemplo prático: Configurando o Redis usando um ConfigMap

Siga os passos abaixo para configurar um cache Redis usando dados armazenados em um ConfigMap.

Primeiro, crie um ConfigMap com um bloco de configuração vazio:

```shell
cat <<EOF >./example-redis-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: example-redis-config
data:
  redis-config: ""
EOF
```
Aplique o ConfigMap criado acima, juntamente com o manifesto de Pod Redis:

```shell
kubectl apply -f example-redis-config.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
```

Examine o conteúdo do manifesto do Pod Redis e observe o seguinte:

* Um volume chamado `config` é criado em `spec.volumes[1]`
* A `key` e o `path` em `spec.volumes[1].configMap.items[0]` expõem a chave `redis-config` do ConfigMap
  `example-redis-config` como um arquivo chamado `redis.conf` no volume `config`.
* O volume `config` é então montado em `/redis-master` por `spec.containers[0].volumeMounts[1]`.

O efeito final é expor os dados de `data.redis-config` do ConfigMap `example-redis-config`
acima como `/redis-master/redis.conf` dentro do Pod.

{{% code_sample file="pods/config/redis-pod.yaml" %}}

Examine os objetos criados:

```shell
kubectl get pod/redis configmap/example-redis-config
```

Você deverá ver a seguinte saída:

```
NAME        READY   STATUS    RESTARTS   AGE
pod/redis   1/1     Running   0          8s

NAME                             DATA   AGE
configmap/example-redis-config   1      14s
```

Lembre-se de que deixamos a chave `redis-config` no ConfigMap `example-redis-config` em branco:

```shell
kubectl describe configmap/example-redis-config
```
Você deverá ver uma chave `redis-config` vazia:

```shell
Name:         example-redis-config
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
redis-config:
```

Use `kubectl exec` para entrar no pod e executar a ferramenta `redis-cli` para verificar a configuração atual:

```shell
kubectl exec -it pod/redis -- redis-cli
```

Verifique `maxmemory`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

Ele deve mostrar o valor padrão 0:

```shell
1) "maxmemory"
2) "0"
```
Da mesma forma, verifique `maxmemory-policy`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```
O que também deve retornar seu valor padrão `noeviction`:

```shell
1) "maxmemory-policy"
2) "noeviction"
```
Agora, vamos adicionar alguns valores de configuração ao ConfigMap `example-redis-config`:

{{% code_sample file="pods/config/example-redis-config.yaml" %}}

Aplique o ConfigMap atualizado:

```shell
kubectl apply -f example-redis-config.yaml
```

Confirme que o ConfigMap foi atualizado:

```shell
kubectl describe configmap/example-redis-config
```

Você deverá ver os valores de configuração que acabamos de adicionar:

```shell
Name:         example-redis-config
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
redis-config:
----
maxmemory 2mb
maxmemory-policy allkeys-lru
```

Verifique novamente o Pod Redis usando `redis-cli` via `kubectl exec` para confirmar se a configuração foi aplicada:

```shell
kubectl exec -it pod/redis -- redis-cli
```

Verifique `maxmemory`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

Ele permanece no valor padrão de 0:

```shell
1) "maxmemory"
2) "0"
```

Da mesma forma, `maxmemory-policy` permanece com a configuração padrão `noeviction`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

Retorna:

```shell
1) "maxmemory-policy"
2) "noeviction"
```

Os valores de configuração não mudaram porque o Pod precisa ser reiniciado para carregar os valores atualizados dos ConfigMaps associados. Vamos excluir e recriar o Pod:

```shell
kubectl delete pod redis
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
```

Agora verifique os valores de configuração mais uma vez:

```shell
kubectl exec -it pod/redis -- redis-cli
```

Verifique `maxmemory`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

Ele agora deve retornar o valor atualizado de 2097152:

```shell
1) "maxmemory"
2) "2097152"
```

Da mesma forma, `maxmemory-policy` também foi atualizado:

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

Ele agora reflete o valor desejado de `allkeys-lru`:

```shell
1) "maxmemory-policy"
2) "allkeys-lru"
```

Limpe o ambiente excluindo os recursos criados:

```shell
kubectl delete pod/redis configmap/example-redis-config
```

## {{% heading "whatsnext" %}}

* Aprenda mais sobre [ConfigMaps](/pt-br/docs/tasks/configure-pod-container/configure-pod-configmap/).
* Veja um exemplo de [como atualizar configuração usando ConfigMap](/docs/tutorials/configuration/updating-configuration-via-a-configmap/).

