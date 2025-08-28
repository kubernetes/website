---
title: Estendendo a API do Kubernetes
weight: 30
---

Recursos personalizados são extensões da API do Kubernetes.
O Kubernetes fornece duas formas de adicionar recursos personalizados ao seu cluster:

- O mecanismo [CustomResourceDefinition](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
  (CRD) permite que você defina uma nova API personalizada de forma declarativa
  com os campos `apiGroup`, `kind` e o formato que você especificar.
  A camada de gerenciamento do Kubernetes irá servir e controlar o armazenamento
  do seu recurso personalizado. CRDs permitem que você crie novos tipos de recurso
  para o seu cluster sem precisar escrever e executar um servidor da API personalizado.
- A [camada de agregação](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
  roda por trás do servidor da API primário, que age como um proxy.
  Este arranjo é chamado de Agregação de API (_API aggregation_, ou AA), e permite
  que você forneça implementações especializadas dos seus recursos personalizados
  através da escrita e instalação de um servidor de API próprio.
  A API principal delega as requisições para o seu servidor de API para as APIs
  personalizadas que você especificar, fazendo com que fiquem disponíveis para
  todos os seus clientes.
