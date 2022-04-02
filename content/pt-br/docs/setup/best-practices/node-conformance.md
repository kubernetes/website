---
title: Validando Instalação no Nó
weight: 30
---


## Teste de Conformidade no Nó

*Teste de Conformidade no Nó* é um framework de contêiner que fornece um verificação do sistema e um teste de funcionalidade de cada nó. O teste valida se o nó atende aos mínimos requisitos do Kubernetes; Um nó que passa no teste, se qualifica para ingressar no cluster Kubernetes.

## Pré-requisito do Nó

Para executar o teste de conformidade, um nó deve atender os mesmos pré-requisitos de um nó padrão do Kubernetes. No mínimo, o nó deve ter os seguintes daemons instalados:

* Execurtor de contêiner (Docker)
* Kubelet

  There are some other kubelet command line parameters you may want to use:
## Executando o Teste de Conformidade no Nó

Para executar o teste no conformidade no nó, siga as seguintes etapas:
1. Determine o valor da opção `--kubeconfig` para o kubelet; por exemplo: `--kubeconfig=/var/lib/kubelet/config.yaml`. Sabendo que a framework de teste inicia um plano de controle local para testar o kubelet, utilize `http://localhost:8080` como a URL do servidor de API. Existem alguns outros parâmetros de linha de comando do kubelet que você pode usar:
  * `--pod-cidr`: Se estiver utilizando `kubenet`, você deve especificar um determindado CIDR para o Kubelet, por exemplo `--pod-cidr=10.180.0.0/24`.
  * `--cloud-provider`: Se estiver utilizando `--cloud-provider=gce`, você deve remover a flag para executar o teste.

2. Execute o teste de conformidade no nó com o comando:

```shell
# $CONFIG_DIR é o diretório do manisfesto do pod do seu Kubelet.
# $LOG_DIR é o diretório de saída do teste.
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  k8s.gcr.io/node-test:0.2
```

## Running Node Conformance Test for Other Architectures

Kubernetes also provides node conformance test docker images for other
architectures:

  Arch  |       Image       |
--------|:-----------------:|
 amd64  |  node-test-amd64  |
  arm   |    node-test-arm  |
 arm64  |  node-test-arm64  |

## Running Selected Test

To run specific tests, overwrite the environment variable `FOCUS` with the
regular expression of tests you want to run.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e FOCUS=MirrorPod \ # Only run MirrorPod test
  k8s.gcr.io/node-test:0.2
```

To skip specific tests, overwrite the environment variable `SKIP` with the
regular expression of tests you want to skip.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e SKIP=MirrorPod \ # Run all conformance tests but skip MirrorPod test
  k8s.gcr.io/node-test:0.2
```

Node conformance test is a containerized version of [node e2e test](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/e2e-node-tests.md).
By default, it runs all conformance tests.

Theoretically, you can run any node e2e test if you configure the container and
mount required volumes properly. But **it is strongly recommended to only run conformance
test**, because it requires much more complex configuration to run non-conformance test.

## Caveats

* The test leaves some docker images on the node, including the node conformance
  test image and images of containers used in the functionality
  test.
* The test leaves dead containers on the node. These containers are created
  during the functionality test.
