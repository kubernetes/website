---
title: Validar configuração do nó
weight: 30
---


## Teste de Conformidade do Nó

O *teste de conformidade do nó* é um framework de teste contentorizado que fornece uma verificação do sistema
e teste de funcionalidade para um nó. O teste valida se o
nó cumpre os requisitos mínimos para o Kubernetes; um nó que passa no teste
está qualificado para se juntar a um cluster Kubernetes.

## Pré-requisito do Nó

Para executar o teste de conformidade do nó, um nó deve satisfazer os mesmos pré-requisitos como um
nó padrão do Kubernetes. No mínimo, o nó deve ter os seguintes
daemons instalados:

* Runtimes de contentores compatíveis com CRI como Docker, Containerd e CRI-O
* Kubelet

## Executando o Teste de Conformidade do Nó

Para executar o teste de conformidade do nó, execute os seguintes passos:
1. Determine o valor da opção `--kubeconfig` para o kubelet; por exemplo:
   `--kubeconfig=/var/lib/kubelet/config.yaml`.
    Como o framework de teste inicia um plano de controlo local para testar o kubelet,
    use `http://localhost:8080` como o URL do servidor API.
    Existem alguns outros parâmetros de linha de comando do kubelet que pode querer usar:
  * `--cloud-provider`: Se está a usar `--cloud-provider=gce`, deve
    remover a bandeira para executar o teste.

2. Execute o teste de conformidade do nó com o comando:

```shell
# $CONFIG_DIR é o caminho do manifesto do pod do seu Kubelet.
# $LOG_DIR é o caminho para a saída do teste.
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  registry.k8s.io/node-test:0.2
```

## Executando o Teste de Conformidade do Nó para Outras Arquiteturas

O Kubernetes também fornece imagens docker de teste de conformidade do nó para outras
arquiteturas:

  Arch  |       Imagem       |
--------|:-------------------:|
 amd64  |  node-test-amd64  |
  arm   |    node-test-arm  |
 arm64  |  node-test-arm64  |

## Executando Teste Selecionado

Para executar testes específicos, sobrescreva a variável de ambiente `FOCUS` com a
expressão regular dos testes que deseja executar.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e FOCUS=MirrorPod \ # Executar apenas o teste MirrorPod
  registry.k8s.io/node-test:0.2
```

Para pular testes específicos, sobrescreva a variável de ambiente `SKIP` com a
expressão regular dos testes que deseja pular.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e SKIP=MirrorPod \ # Executar todos os testes de conformidade, mas pular o teste MirrorPod
  registry.k8s.io/node-test:0.2
```

O teste de conformidade do nó é uma versão contentorizada do [teste e2e do nó](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/e2e-node-tests.md).
Por padrão, ele executa todos os testes de conformidade.

Teoricamente, pode executar qualquer teste e2e do nó se configurar o contentor e
montar os volumes necessários adequadamente. Mas **é fortemente recomendado executar apenas o teste de conformidade**, porque requer uma configuração muito mais complexa para executar teste não-conformidade.

## Advertências

* O teste deixa algumas imagens docker no nó, incluindo a imagem do teste de conformidade do nó e imagens dos contentores usados no teste
  de funcionalidade.
* O teste deixa contentores mortos no nó. Esses contentores são criados
  durante o teste de funcionalidade.
