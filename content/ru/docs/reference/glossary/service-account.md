---
title: ServiceAccount
id: service-account
date: 2018-04-12
full_link: /docs/tasks/configure-pod-container/configure-service-account/
short_description: >
  Отвечает за идентификацию процессов, выполняющихся в Pod'е.

aka: 
tags:
- fundamental
- core-object
---
 Отвечает за идентификацию процессов, выполняющихся в {{< glossary_tooltip text="Pod'е" term_id="pod" >}}.

<!--more--> 

Процессы внутри Pod'а аутентифицируются сервером API и относятся к определенной учетной записи (service account) (например, к `default`) для доступа к кластеру. Если при создании Pod'а служебная учетная запись не указана, ему автоматически присваивается service account по умолчанию в том же {{< glossary_tooltip text="пространстве имен" term_id="namespace" >}}.
