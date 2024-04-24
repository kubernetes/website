---
title: Kerberos
id: kerberos
date: 2021-03-16
full_link: 
short_description: >
   Kerberos é um protocolo de rede que usa criptografia de chave secreta para autenticar aplicativos cliente-servidor. O Kerberos solicita um tíquete criptografado por meio de uma sequência de servidor autenticada para usar os serviços.
   
   O protocolo recebe o nome do cão de três cabeças (Kerberos ou Cerberus) que guardava os portões de Hades na mitologia grega.
   
aka: 
tags:
- authentication
---

<!--more-->

Kerberos é um protocolo de rede que usa criptografia de chave secreta para autenticar aplicativos cliente-servidor. O Kerberos solicita um tíquete criptografado por meio de uma sequência de servidor autenticada para usar os serviços.

Kerberos foi desenvolvido pelo Project Athena - um projeto conjunto entre o Massachusetts Institute of Technology (MIT), Digital Equipment Corporation e IBM que funcionou entre 1983 e 1991.

Um servidor de autenticação usa um tíquete Kerberos para conceder acesso ao servidor e, em seguida, cria uma chave de sessão com base na senha do solicitante e outro valor aleatório. O tíquete de concessão de tíquete (TGT) é enviado ao servidor de concessão de tíquete (TGS), que é necessário para usar o mesmo servidor de autenticação.

O solicitante recebe uma chave TGS criptografada com um registro de data e hora e um tíquete de serviço, que é retornado ao solicitante e descriptografado. O solicitante envia ao TGS essas informações e encaminha a chave criptografada ao servidor para obter o serviço desejado. Se todas as ações forem tratadas corretamente, o servidor aceita o tíquete e realiza o atendimento ao usuário desejado, que deve descriptografar a chave, verificar a data e hora e entrar em contato com o centro de distribuição para obter as chaves de sessão. Essa chave de sessão é enviada ao solicitante, que descriptografa o tíquete.

Se as chaves e o carimbo de data / hora forem válidos, a comunicação cliente-servidor continuará. O tíquete TGS tem carimbo de data / hora, o que permite solicitações simultâneas dentro do período de tempo alocado.

