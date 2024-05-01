---
title: Contribuir com a documentação do Kubernetes em português
content_type: concept
---

Olá!

Esta página contém informações sobre o processo de localização em português (Brazil), desde o processo de contribuição até um dicionário de temos com as respectivas traduções.


## Passo a passo para contribuição

1. Escolha uma página que deseja localizar.
2. Verifique se já existe uma issue no repositório (kubernetes/website) aberta para a página que escolheu.
3. Faça o fork do repositório kubernetes/website.
4. Crie uma branch no seu fork e faça a localização da página.
5. Execute o check de links quebrados (os detalhes de como executar estão nessa página).
7. Abra o Pull Request, caso ainda não tenha aceito o [CLA](https://github.com/kubernetes/community/blob/master/CLA.md) vai receber as instruções no Pull Request.
8. Verifique se as checagens no Pull Requests não estão quebradas e se foi gerado um preview da sua localização.
9. Por fim, recomendamos que envie o pull request no canal do slack do time `#kubernetes-docs-pt`.


## Checagem de links quebrados
Para garantir que os links referenciados na página que localizou não estão quebrados, você pode executar um script de checagem de links quebrados.   
Dentro do seu fork local do repositório, executar:

```bash
scripts/linkchecker.py -f content/pt-br/<caminho-da-pagina>
```

Onde,
* `content/pt-br/<caminho-da-pagina>` é o caminho da página que está localizando


## Dicionário de termos com tradução

|      Inglês            |        Português          |   Comentários           |
| ---------------------- | ----------------------    | ----------------------- |
| addon                 | complemento               |                          |
| API call               | chamada para a API        |                         |
| API server             | servidor de API           |                         |
| backward compatibility | retrocompatibilidade      |                         |
| builtin                | embutido                  |                         | 
| container image        | imagem do contêiner       |                         | 
| dashboard              | painel                    |                         | 
| data plane             | camada de dados           |                         | 
| control plane          | camada de gerenciamento   |                         |
| workload               | carga de trabalho         |                         |
| workflow               | fluxo de execução         |                         |


## Dicionário de termos não traduzidos

|      Inglês            |    Comentários           |
| ---------------------- | -----------------------  |
| addon manager          |                          |
| auto-scaling           |                          |
| bind                   |                          |
| cloud native           |                          |
| controller manager     |                          |
| deploy                 |                          |
| service mesh           |                          |
| release                |                          |
| proxy                  |                          |
| endpoint               |                          |

Nomes de objetos do Kubernetes não são traduzidos, e permanecem no original com a primeira letra em maúsculo, por exemplo:
* Pod
* Service
* Deployment

e outros.


