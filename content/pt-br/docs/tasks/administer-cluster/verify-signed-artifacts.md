---
title: Verificar artefatos assinados do Kubernetes
content_type: task
min-kubernetes-server-version: v1.26
weight: 420
---

<!-- overview -->

{{< feature-state state="beta" for_k8s_version="v1.26" >}}

## {{% heading "prerequisites" %}}

Você precisará ter as seguintes ferramentas instaladas:

- `cosign` ([guia de instalação](https://docs.sigstore.dev/cosign/system_config/installation/))
- `curl` (geralmente fornecido pelo seu sistema operacional)
- `jq` ([baixar o jq](https://jqlang.github.io/jq/download/))

## Verificando assinaturas de binários

O processo de lançamento de versões do Kubernetes assina todos os artefatos binários (tarballs,
arquivos SPDX, binários independentes) usando a assinatura sem chave (keyless) do
cosign. Para verificar um binário específico, baixe-o juntamente com sua assinatura
e seu certificado:

```bash
URL=https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/linux/amd64
BINARY=kubectl

FILES=(
    "$BINARY"
    "$BINARY.sig"
    "$BINARY.cert"
)

for FILE in "${FILES[@]}"; do
    curl -sSfL --retry 3 --retry-delay 3 "$URL/$FILE" -o "$FILE"
done
```

Em seguida, verifique o blob usando o comando `cosign verify-blob`:

```shell
cosign verify-blob "$BINARY" \
  --signature "$BINARY".sig \
  --certificate "$BINARY".cert \
  --certificate-identity krel-staging@k8s-releng-prod.iam.gserviceaccount.com \
  --certificate-oidc-issuer https://accounts.google.com
```

{{< note >}}
O Cosign 2.0 exige as opções `--certificate-identity` e `--certificate-oidc-issuer`.

Para saber mais sobre a assinatura sem chave (keyless), consulte
[Assinaturas sem chave](https://docs.sigstore.dev/cosign/signing/overview/).

Versões anteriores do Cosign exigiam a definição de `COSIGN_EXPERIMENTAL=1`.

Para mais informações, consulte o [blog do sigstore](https://blog.sigstore.dev/cosign-2-0-released/).
{{< /note >}}

## Verificando assinaturas de imagens

Para uma lista completa das imagens que são assinadas, consulte
[Releases](/releases/download/).

Escolha uma imagem desta lista e verifique sua assinatura usando
o comando `cosign verify`:

```shell
cosign verify registry.k8s.io/kube-apiserver-amd64:v{{< skew currentPatchVersion >}} \
  --certificate-identity krel-trust@k8s-releng-prod.iam.gserviceaccount.com \
  --certificate-oidc-issuer https://accounts.google.com \
  | jq .
```

### Verificando as imagens de todos os componentes da camada de gerenciamento

Para verificar todas as imagens assinadas da camada de gerenciamento para a versão
estável mais recente (v{{< skew currentPatchVersion >}}), execute os seguintes comandos:

```shell
curl -Ls "https://sbom.k8s.io/$(curl -Ls https://dl.k8s.io/release/stable.txt)/release" \
  | grep "SPDXID: SPDXRef-Package-registry.k8s.io" \
  | grep -v sha256 | cut -d- -f3- | sed 's/-/\//' | sed 's/-v1/:v1/' \
  | sort > images.txt
input=images.txt
while IFS= read -r image
do
  cosign verify "$image" \
    --certificate-identity krel-trust@k8s-releng-prod.iam.gserviceaccount.com \
    --certificate-oidc-issuer https://accounts.google.com \
    | jq .
done < "$input"
```

Depois de verificar uma imagem, você pode especificá-la pelo seu digest nos
manifestos dos seus Pods, conforme este exemplo:

```console
registry-url/image-name@sha256:45b23dee08af5e43a7fea6c4cf9c25ccf269ee113168c19722f87876677c5cb2
```

Para mais informações, consulte a seção
[Política de download de imagem](/pt-br/docs/concepts/containers/images/#política-de-download-de-imagem).

## Verificando assinaturas de imagens com um controlador de admissão

Para imagens que não são da camada de gerenciamento (por exemplo, a
[imagem de conformidade](https://github.com/kubernetes/kubernetes/blob/master/test/conformance/image/README.md)),
as assinaturas também podem ser verificadas no momento da implantação usando o
controlador de admissão
[sigstore policy-controller](https://docs.sigstore.dev/policy-controller/overview).

Aqui estão alguns recursos úteis para começar a usar o `policy-controller`:

- [Instalação](https://github.com/sigstore/helm-charts/tree/main/charts/policy-controller)
- [Opções de configuração](https://github.com/sigstore/policy-controller/tree/main/config)

## Verificar a lista de materiais de software (SBOM)

Você pode verificar a lista de materiais de software (Software Bill of Materials, ou SBOM)
do Kubernetes usando o certificado e a assinatura do sigstore, ou os arquivos SHA
correspondentes:

```shell
# Obtenha a versão mais recente disponível do Kubernetes
VERSION=$(curl -Ls https://dl.k8s.io/release/stable.txt)

# Verifique a soma SHA512
curl -Ls "https://sbom.k8s.io/$VERSION/release" -o "$VERSION.spdx"
echo "$(curl -Ls "https://sbom.k8s.io/$VERSION/release.sha512") $VERSION.spdx" | sha512sum --check

# Verifique a soma SHA256
echo "$(curl -Ls "https://sbom.k8s.io/$VERSION/release.sha256") $VERSION.spdx" | sha256sum --check

# Obtenha a assinatura e o certificado do sigstore
curl -Ls "https://sbom.k8s.io/$VERSION/release.sig" -o "$VERSION.spdx.sig"
curl -Ls "https://sbom.k8s.io/$VERSION/release.cert" -o "$VERSION.spdx.cert"

# Verifique a assinatura do sigstore
cosign verify-blob \
    --certificate "$VERSION.spdx.cert" \
    --signature "$VERSION.spdx.sig" \
    --certificate-identity krel-staging@k8s-releng-prod.iam.gserviceaccount.com \
    --certificate-oidc-issuer https://accounts.google.com \
    "$VERSION.spdx"
```
