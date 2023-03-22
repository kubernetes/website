---
title: Interface de Armazenamento de Contêiner
id: csi
date: 2018-06-25
full_link: /pt-br/docs/concepts/storage/volumes/#csi
short_description: >
 A Interface de Armazenamento de Contêiner (_Container Storage Interface_, CSI) define um padrão de interface para expor sistemas de armazenamento a contêineres.

aka: 
tags:
- storage 
---
 A Interface de Armazenamento de Contêiner (_Container Storage Interface_, CSI) define um padrão de interface para expor sistemas de armazenamento a contêineres.

<!--more--> 

O CSI permite que os fornecedores criem plugins personalizados de armazenamento para o Kubernetes sem adicioná-los ao repositório Kubernetes (plugins fora da árvore). 
Para usar um driver CSI de um provedor de armazenamento, você deve primeiro [instalá-lo no seu cluster](https://kubernetes-csi.github.io/docs/deploying.html). 
Você poderá então criar uma {{< glossary_tooltip text="Classe de Armazenamento" term_id="storage-class" >}} que use esse driver CSI.

* [CSI na documentação do Kubernetes](/pt-br/docs/concepts/storage/volumes/#csi)
* [Lista de drivers CSI disponíveis](https://kubernetes-csi.github.io/docs/drivers.html)
