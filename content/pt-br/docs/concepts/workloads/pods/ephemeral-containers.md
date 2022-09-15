---
reviewers:
  - verb
  - yujuhong
title: Ephemeral Containers
content_type: concept
weight: 80
---

<!-- overview -->

{{< feature-state state="beta" for_k8s_version="v1.23" >}}

Esta página fornece uma visão geral dos contêineres efêmeros: um tipo especial de contêiner que é executado temporariamente em um existente {{< glossary_tooltip term_id="pod" >}} para realizar ações iniciadas pelo usuário, como solução de problemas. Você usa
contêineres efêmeros para inspecionar serviços em vez de construir aplicativos.

<!-- body -->

## Entendendo containeres efêmeros

{{< glossary_tooltip text="Pods" term_id="pod" >}} são as bases de construção de aplicativos Kubernetes. Como os Pods se destinam a ser descartável ​​e substituível, não é possível adicionar um contêiner a um pod depois de criá-lo.
Em vez disso, você geralmente exclui e substitui Pods de maneira controlada usando {{< glossary_tooltip text="deployments" term_id="deployment" >}}.

Às vezes, é necessário inspecionar o estado de um pod existente, no entanto, para
exemplo para solucionar um bug difícil de reproduzir. Nesses casos, você pode executar um contêiner efêmero em um pod existente para inspecionar seu estado e executar
comandos arbitrários.

### O que é um container efêmero?

Os contêineres efêmeros diferem de outros contêineres por não terem garantias para recursos ou execução, e eles nunca serão reiniciados automaticamente, então eles não são apropriados para aplicações de construção. Os recipientes efêmeros são descrito usando o mesmo `ContainerSpec` como contêineres regulares, mas muitos campos são incompatíveis e não permitidos para contêineres efêmeros.

- Contêineres efêmeros podem não ter portas, então campos como `ports`, `livenessProbe`, `readinessProbe` não são permitidos.
- As alocações de recursos do pod são imutáveis, portanto, a configuração de `resources` não é permitida.
- Para obter uma lista completa de campos permitidos, consulte a [referência de EphemeralContainer documentação](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#efemeralcontainer-v1-core).

Os contêineres efêmeros são criados usando um manipulador especial `ephemeralcontainers` na API em vez de adicioná-los diretamente ao `pod.spec`, então não é possível adicionar um contêiner efêmero usando `kubectl edit`.

Assim como os contêineres comuns, você não pode alterar ou remover um contêiner efêmero depois de adicioná-lo a um pod.

## Usos de containeres efêmeros

Os contêineres efêmeros são úteis para solução de problemas interativa quando `kubectl exec` é insuficiente porque um contêiner travou ou uma imagem de contêiner não inclui utilitários de depuração.

Em particular, [imagens sem distro](https://github.com/GoogleContainerTools/distroless) permitem que você implante imagens de contêiner mínimas que reduzem a superfície de ataque e exposição a bugs e vulnerabilidades. Como as imagens distroless não incluem um shell ou qualquer utilitário de depuração, é difícil solucionar problemas de distroless imagens usando `kubectl exec` sozinho.

Ao usar contêineres efêmeros, é útil habilitar [process namespace
compartilhamento](/docs/tasks/configure-pod-container/share-process-namespace/) para você poder visualizar processos em outros contêineres.

## {{% heading "whatsnext" %}}

- Saiba mais em [debug pods using ephemeral containers](/docs/tasks/debug/debug-application/debug-running-pod/#ephemeral-container).
