---
title: SAML
id: saml
date: 2021-03-16
full_link: 
short_description: >
   SAML significa Linguagem de Marcação para Asserção de Segurança. É um padrão aberto baseado em XML para transferência de dados de identidade entre duas partes: um provedor de identidade (IdP) e um provedor de serviços (SP).
   
aka: 
tags:
- authentication
---

<!--more-->
SAML significa Linguagem de Marcação para Asserção de Segurança. É um padrão aberto baseado em XML para transferência de dados de identidade entre duas partes: um provedor de identidade (IdP) e um provedor de serviços (SP).

Provedor de identidade - executa autenticação e passa a identidade do usuário e o nível de autorização para o provedor de serviços.

Provedor de serviços - confia no provedor de identidade e autoriza o usuário fornecido a acessar o recurso solicitado.

A autenticação de logon único SAML normalmente envolve um provedor de serviços e um provedor de identidade. O fluxo do processo geralmente envolve os estágios de estabelecimento de confiança e fluxo de autenticação.

Considere este exemplo:

Nosso provedor de identidade é Auth0
Nosso provedor de serviços é um serviço fictício, Zagadat
Nota: O provedor de identidade pode ser qualquer plataforma de gerenciamento de identidade.

Agora, um usuário está tentando obter acesso ao Zagadat usando a autenticação SAML.

Este é o fluxo do processo:

O usuário tenta fazer login no Zagadat a partir de um navegador.
O Zagadat responde gerando uma solicitação SAML.


