---
reviewers:
- 
title: Política de Tráfego Interno do Serviço
content_type: concept
weight: 45
---


<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

_Política de Tráfego Interno do Serviço_ ativa restrições de tráfego internos para rotear
trafego interno apenas para endpoints dentro do nó em que o trafego foi originado. O
trafego "interno" se refere ao trafego originado de pods em um determinado cluster. 
Isso pode ajudar a reduzir custos e melhorar performance.

<!-- body -->

## Utilizando políticas de tráfego interno do serviço

Uma vez ativado o [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`ServiceInternalTrafficPolicy`, é possível ativar uma política que permite apenas tráfego interno para um
{{< glossary_tooltip text="Services" term_id="service" >}} ao configurar o
`.spec.internalTrafficPolicy` com o valor `Local`.
Essa configuração faz o cube-proxy utilizar apenas endpoints locais do nó para realizar o cluster de trafego interno.

{{< note >}}
Para os pods em nós que não possuem endpoints para um determinado Serviço, o Serviço se comporta como se não existissem endpoints
(para os pods nesse nó) mesmo se o serviço possuir endpoints em outros nós.
{{< /note >}}

O exemplo abaixo retrata como um Serviço se parece quando é setado
`.spec.internalTrafficPolicy` para `Local`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  internalTrafficPolicy: Local
```

## Como funciona

O kube-proxy filtra os endpoints para os quais ele roteia baseado na configuração 
`spec.internalTrafficPolicy`. Quando está configurado como `Local`, apenas endpoints locais do nó
são considerados. Quando está configurado como `Cluster` ou não for especificado, ele considera todos
os endpoints.
Quando o [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`ServiceInternalTrafficPolicy` é ativado, `spec.internalTrafficPolicy` é configurado como "Cluster" por padrão.

## Restrições

* Políticas de tráfego interno do serviço não são utilizadas quando `externalTrafficPolicy` está
  configurado como `Local` em um Serviço. É possível utilizar as duas funcionalidades no mesmo cluster, 
  só não é possível a utilização dos dois no mesmo Serviço.

## {{% heading "whatsnext" %}}

* Leia sobre [ativar Topology Aware Hints](/docs/tasks/administer-cluster/enabling-topology-aware-hints)
* Leia sobre [Política de tráfego externo do serviço](/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)
* Leia [Conectando Aplicações com Serviços](/docs/concepts/services-networking/connect-applications-service/)
