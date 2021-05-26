---
title: TLS Common Name
id: tls-common-name
date: 2021-03-16
full_link: 
short_description: >
   O nome comum é normalmente composto de Host + Nome de domínio e será semelhante a www.seusite.com ou seusite.com. Os certificados de servidor SSL são específicos para o nome comum para o qual foram emitidos no nível do host.

aka: 
tags:
- authentication
---

<!--more-->

O nome comum é normalmente composto de Host + Nome de domínio e será semelhante a www.seusite.com ou seusite.com. Os certificados de servidor SSL são específicos para o nome comum para o qual foram emitidos no nível do host.

O nome comum deve ser igual ao endereço da Web que você acessará ao se conectar a um site seguro. Por exemplo, um certificado de servidor SSL para o domínio domínio.com receberá um aviso do navegador se o acesso a um site chamado www.domain.com ou secure.domain.com, pois www.domain.com e secure.domain.com são diferentes de dominio.com. Você precisaria criar um CSR para o nome comum correto.