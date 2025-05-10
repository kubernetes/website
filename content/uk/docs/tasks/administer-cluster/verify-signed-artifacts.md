---
title: Перевірка підписаних артефактів Kubernetes
content_type: task
min-kubernetes-server-version: v1.26
weight: 420
---

<!-- overview -->

{{< feature-state state="beta" for_k8s_version="v1.26" >}}

## {{% heading "prerequisites" %}}

Вам знадобиться мати встановлені наступні інструменти:

- `cosign` ([інструкція щодо встановлення](https://docs.sigstore.dev/cosign/system_config/installation/))
- `curl` (часто надається вашою операційною системою)
- `jq` ([завантажте jq](https://jqlang.github.io/jq/download/))

## Перевірка підписів бінарних файлів {#verifying-binary-signatures}

В процесі підготовки випуску Kubernetes підписує всі бінарні артефакти (tarballs, файли SPDX, окремі бінарні файли) за допомогою безключового підписування cosign. Щоб перевірити певний бінарний файл, отримайте його разом з підписом та сертифікатом:

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

Потім перевірте блоб, використовуючи `cosign verify-blob`:

```shell
cosign verify-blob "$BINARY" \
  --signature "$BINARY".sig \
  --certificate "$BINARY".cert \
  --certificate-identity krel-staging@k8s-releng-prod.iam.gserviceaccount.com \
  --certificate-oidc-issuer https://accounts.google.com
```

{{< note >}}
Cosign 2.0 вимагає опції `--certificate-identity` та `--certificate-oidc-issuer`.

Для отримання додаткової інформації щодо безключового підписування, див. [Безключові Підписи](https://docs.sigstore.dev/cosign/signing/overview/).

Попередні версії Cosign вимагали встановлення `COSIGN_EXPERIMENTAL=1`.

Для отримання додаткової інформації зверніться до [Блогу sigstore](https://blog.sigstore.dev/cosign-2-0-released/)
{{< /note >}}

## Перевірка підписів образів {#verifying-image-signatures}

Для повного списку образів, які підписані, дивіться [Випуски](/releases/download/).

Оберіть один образ з цього списку та перевірте його підпис, використовуючи команду `cosign verify`:

```shell
cosign verify registry.k8s.io/kube-apiserver-amd64:v{{< skew currentPatchVersion >}} \
  --certificate-identity krel-trust@k8s-releng-prod.iam.gserviceaccount.com \
  --certificate-oidc-issuer https://accounts.google.com \
  | jq .
```

### Перевірка образів для всіх компонентів панелі управління {#verifying-images-for-all-control-plane-components}

Щоб перевірити всі підписані образи компонентів панелі управління для останньої стабільної версії (v{{< skew currentPatchVersion >}}), запустіть наступні команди:

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

Після перевірки образу можна вказати його за його дайджестом у вашому маніфесті Podʼа, як у цьому прикладі:

```console
registry-url/image-name@sha256:45b23dee08af5e43a7fea6c4cf9c25ccf269ee113168c19722f87876677c5cb2
```

Для отримання додаткової інформації, див. Розділ [Політика отримання образів](/docs/concepts/containers/images/#image-pull-policy).

## Перевірка підписів образів за допомогою контролера допуску {#verifying-image-signatures-with-admission-controller}

Для образів, що не є частиною компонентів панелі управління (наприклад, [образ conformance](https://github.com/kubernetes/kubernetes/blob/master/test/conformance/image/README.md)), підписи також можна перевірити під час розгортання за допомогою контролера допуску [sigstore policy-controller](https://docs.sigstore.dev/policy-controller/overview).

Ось кілька корисних ресурсів для початку роботи з `policy-controller`:

- [Встановлення](https://github.com/sigstore/helm-charts/tree/main/charts/policy-controller)
- [Параметри конфігурації](https://github.com/sigstore/policy-controller/tree/main/config)

## Перевірка специфікації на програмне забезпечення {#verifying-the-software-bill-of-materials}

Ви можете перевірити Kubernetes Software Bill of Materials (SBOM), використовуючи сертифікат та підпис sigstore, або відповідні файли SHA:

```shell
# Отримайте останню доступну версію релізу Kubernetes
VERSION=$(curl -Ls https://dl.k8s.io/release/stable.txt)

# Перевірте суму SHA512
curl -Ls "https://sbom.k8s.io/$VERSION/release" -o "$VERSION.spdx"
echo "$(curl -Ls "https://sbom.k8s.io/$VERSION/release.sha512") $VERSION.spdx" | sha512sum --check

# Перевірте суму SHA256
echo "$(curl -Ls "https://sbom.k8s.io/$VERSION/release.sha256") $VERSION.spdx" | sha256sum --check

# Отримайте підпис та сертифікат sigstore
curl -Ls "https://sbom.k8s.io/$VERSION/release.sig" -o "$VERSION.spdx.sig"
curl -Ls "https://sbom.k8s.io/$VERSION/release.cert" -o "$VERSION.spdx.cert"

# Перевірте підпис sigstore
cosign verify-blob \
    --certificate "$VERSION.spdx.cert" \
    --signature "$VERSION.spdx.sig" \
    --certificate-identity krel-staging@k8s-releng-prod.iam.gserviceaccount.com \
    --certificate-oidc-issuer https://accounts.google.com \
    "$VERSION.spdx"
```
