---
title: Portas e protocolos
content_type: reference
weight: 50
---

Quando o Kubernetes está sendo executado em um ambiente com uma rede mais restritiva, 
como por exemplo um data center on-premises com firewalls de rede físicos ou redes virtuais em nuvens públicas,
é útil saber quais portas e protocolos são utilizados pelos componentes do Kubernetes. 

## Camada de gerenciamento

| Protocolo | Direção | Intervalo de Portas | Propósito                 | Utilizado por                   |
|----------|-----------|------------|-------------------------|---------------------------|
| TCP      | Entrada   | 6443       | Servidor da API do Kubernetes | Todos                       |
| TCP      | Entrada   | 2379-2380  | API servidor-cliente do etcd  | kube-apiserver, etcd      |
| TCP      | Entrada   | 10250      | API do kubelet             | kubeadm, Camada de gerenciamento       |
| TCP      | Entrada   | 10259      | kube-scheduler          | kubeadm                      |
| TCP      | Entrada   | 10257      | kube-controller-manager | kubeadm                      |

Embora as portas do etcd estejam inclusas na seção da Camada de gerenciamento, você também 
pode hospedar o seu próprio cluster etcd externamente ou em portas customizadas. 

## Nós de processamento {#node}

| Protocolo | Direção | Intervalo de Portas | Propósito                 | Utilizado por                   |
|----------|-----------|-------------|-----------------------|-------------------------|
| TCP      | Entrada   | 10250       | API do Kubelet        | O próprio, Camada de gerenciamento     |
| TCP      | Entrada   | 30000-32767 | Serviços NodePort†    | Todos                     |

† Intervalo padrão de portas para os [serviços NodePort](/docs/concepts/services-networking/service/).

Todas as portas padrão podem ser sobrescritas. Quando portas customizadas são utilizadas, essas portas
precisam estar abertas, ao invés das mencionadas aqui.

Um exemplo comum é a porta do servidor da API, que as vezes é trocado para a porta 433.
Com isso, a porta padrão é mantida e o servidor da API é colocado atrás de um balanceador de carga
que escuta na porta 433 e faz o roteamento das requisições para o servidor da API na porta padrão.
