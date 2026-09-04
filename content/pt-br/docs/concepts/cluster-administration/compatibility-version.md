---
title: Versão de Compatibilidade para Componentes do Control Plane do Kubernetes
content_type: concept
weight: 70
---

<!-- overview -->

Desde o release v1.32, introduzimos opções configuráveis de compatibilidade e emulação de versão nos componentes do control plane do Kubernetes para tornar os upgrades mais seguros, oferecendo mais controle e aumentando a granularidade das etapas disponíveis para os administradores de cluster.

<!-- body -->

## Versão Emulada

A opção de emulação é definida pela flag `--emulated-version` dos componentes do control plane. Ela permite que o componente emule o comportamento (APIs, funcionalidades, ...) de uma versão anterior do Kubernetes.

Quando utilizada, as capacidades disponíveis corresponderão à versão emulada:
* Qualquer capacidade presente na versão do binário que tenha sido introduzida após a versão de emulação estará indisponível.
* Qualquer capacidade removida após a versão de emulação estará disponível.

Isso permite que um binário de um release específico do Kubernetes emule o comportamento de uma versão anterior com fidelidade suficiente para que a interoperabilidade com outros componentes do sistema possa ser definida em termos da versão emulada.

O `--emulated-version` deve ser <= `binaryVersion`. Consulte a mensagem de ajuda da flag `--emulated-version` para conhecer a faixa de versões emuladas suportadas.
