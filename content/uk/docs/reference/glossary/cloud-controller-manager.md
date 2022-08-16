---
title: Cloud Controller Manager
id: cloud-controller-manager
date: 2018-04-12
full_link: /docs/concepts/architecture/cloud-controller/
short_description: >
  Компонент Control plane 
  Control plane component that integrates Kubernetes with third-party cloud providers.
aka: 
tags:
- core-object
- architecture
- operation
---
<!-- A Kubernetes {{< glossary_tooltip text="control plane" term_id="control-plane" >}} component
that embeds cloud-specific control logic. The cloud controller manager lets you link your
cluster into your cloud provider's API, and separates out the components that interact
with that cloud platform from components that only interact with your cluster.
 -->

 Компонент Kubernetes,  {< glossary_tooltip text="control plane" term_id="control-plane" >}} що містить у собі логіку для роботи у cloud оточенні.  
Cloud-controller-manager дозволяє поєднати кластер до обраного cloud провайдеру за допомогою API та виділяє компоненти, що взаємодіють з cloud платформою через компоненти, що взаємодіють лише з кластером.
 
<!--more-->
<!-- By decoupling the interoperability logic between Kubernetes and the underlying cloud
infrastructure, the cloud-controller-manager component enables cloud providers to release
features at a different pace compared to the main Kubernetes project.
 -->

За допомогою розділення логіки сумісності між Kubernetes та cloud інфраструктурою, cloud-controller-manager допомагає cloud провайдерам випускати нові оновлення у різному темпі у порівнянні до основного Kubernetes проєкту.
