reviewers:
- eparis
- pmorie
title: Configurando Redis usando um ConfigMap
content_type: tutorial
weight: 30
---

Esta página fornece um exemplo real de como configurar o Redis usando um ConfigMap e se baseia na tarefa [Configurar um Pod para Usar um ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/).

## {{% heading "objectives" %}}

* Criar um ConfigMap com valores de configuração do Redis
* Criar um Pod Redis que monta e usa o ConfigMap criado
* Verificar se a configuração foi aplicada corretamente.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* O exemplo mostrado nesta página funciona com `kubectl` 1.14 e superior.
* Entender [Configurar um Pod para Usar um ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/).

## Exemplo do Mundo Real: Configurando Redis usando um ConfigMap

Siga os passos abaixo para configurar um cache Redis usando dados armazenados em um ConfigMap.

Primeiro crie um ConfigMap com um bloco de configuração vazio:

```shell
cat <<EOF >./example-redis-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: example-redis-config
data:
  redis-config: ""
EOF
Aplique o ConfigMap criado acima, juntamente com um manifesto de pod Redis:

Shell

kubectl apply -f example-redis-config.yaml
kubectl apply -f [https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml](https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml)
Examine o conteúdo do manifesto do pod Redis e observe o seguinte:

Um volume chamado config é criado por spec.volumes[1]

As chaves key e path sob spec.volumes[1].configMap.items[0] expõem a chave redis-config do
ConfigMap example-redis-config como um arquivo chamado redis.conf no volume config.

O volume config é então montado em /redis-master por spec.containers[0].volumeMounts[1].

Isso tem o efeito líquido de expor os dados em data.redis-config do
ConfigMap example-redis-config acima como /redis-master/redis.conf dentro do Pod.

{{% code_sample file="pods/config/redis-pod.yaml" %}}

Examine os objetos criados:

Shell

kubectl get pod/redis configmap/example-redis-config
Você deverá ver a seguinte saída:

NAME          READY   STATUS    RESTARTS   AGE
pod/redis     1/1     Running   0          8s

NAME                              DATA   AGE
configmap/example-redis-config    1      14s
Lembre-se que deixamos a chave redis-config no ConfigMap example-redis-config em branco:

Shell

kubectl describe configmap/example-redis-config
Você deverá ver uma chave redis-config vazia:

Shell

Name:         example-redis-config
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
redis-config:
Use kubectl exec para entrar no pod e executar a ferramenta redis-cli para verificar a configuração atual:

Shell

kubectl exec -it redis -- redis-cli
Verifique maxmemory:

Shell

127.0.0.1:6379> CONFIG GET maxmemory
Deve mostrar o valor padrão de 0:

Shell

1) "maxmemory"
2) "0"
Da mesma forma, verifique maxmemory-policy:

Shell

127.0.0.1:6379> CONFIG GET maxmemory-policy
Que também deve render seu valor padrão de noeviction:

Shell

1) "maxmemory-policy"
2) "noeviction"
Agora vamos adicionar alguns valores de configuração ao ConfigMap example-redis-config:

{{% code_sample file="pods/config/example-redis-config.yaml" %}}

Aplique o ConfigMap atualizado:

Shell

kubectl apply -f example-redis-config.yaml
Confirme se o ConfigMap foi atualizado:

Shell

kubectl describe configmap/example-redis-config
Você deverá ver os valores de configuração que acabamos de adicionar:

Shell

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
Verifique o Pod Redis novamente usando redis-cli via kubectl exec para ver se a configuração foi aplicada:

Shell

kubectl exec -it redis -- redis-cli
Verifique maxmemory:

Shell

127.0.0.1:6379> CONFIG GET maxmemory
Permanece no valor padrão de 0:

Shell

1) "maxmemory"
2) "0"
Da mesma forma, maxmemory-policy permanece na configuração padrão noeviction:

Shell

127.0.0.1:6379> CONFIG GET maxmemory-policy
Retorna:

Shell

1) "maxmemory-policy"
2) "noeviction"
Os valores de configuração não foram alterados porque o Pod precisa ser reiniciado para obter os valores atualizados
dos ConfigMaps associados. Vamos deletar e recriar o Pod:

Shell

kubectl delete pod redis
kubectl apply -f [https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml](https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml)
Agora, verifique os valores de configuração pela última vez:

Shell

kubectl exec -it redis -- redis-cli
Verifique maxmemory:

Shell

127.0.0.1:6379> CONFIG GET maxmemory
Agora deve retornar o valor atualizado de 2097152:

Shell

1) "maxmemory"
2) "2097152"
Da mesma forma, maxmemory-policy também foi atualizado:

Shell

127.0.0.1:6379> CONFIG GET maxmemory-policy
Agora reflete o valor desejado de allkeys-lru:

Shell

1) "maxmemory-policy"
2) "allkeys-lru"
Limpe seu trabalho excluindo os recursos criados:

Shell

kubectl delete pod/redis configmap/example-redis-config
{{% heading "whatsnext" %}}
Saiba mais sobre ConfigMaps.

Siga um exemplo de Atualizando a configuração via um ConfigMap.
