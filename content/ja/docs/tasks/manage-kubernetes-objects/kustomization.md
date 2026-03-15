---
title: Kustomizeを使用したKubernetesオブジェクトの宣言的管理
content_type: task
weight: 20
---

<!-- overview -->

[Kustomize](https://github.com/kubernetes-sigs/kustomize)は、[kustomizationファイル](https://kubectl.docs.kubernetes.io/references/kustomize/glossary/#kustomization)を用いてKubernetesオブジェクトをカスタマイズするためのスタンドアロンツールです。

1.14以降、kubectlもkustomizationファイルを使用したKubernetesオブジェクトの管理をサポートしています。
kustomizationファイルを含むディレクトリ内のリソースを表示するには、次のコマンドを実行します:

```shell
kubectl kustomize <kustomization_directory>
```

これらのリソースを適用するには、`--kustomize`または`-k`フラグを指定して`kubectl apply`を実行します:

```shell
kubectl apply -k <kustomization_directory>
```

## {{% heading "prerequisites" %}}

[`kubectl`](/docs/tasks/tools/)をインストールしてください。

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Kustomizeの概要 {#overview-of-kustomize}

Kustomizeは、Kubernetesの設定をカスタマイズするためのツールです。
アプリケーションの設定ファイルを管理するために、次の機能があります:

* 他のソースからリソースを生成する
* リソースに対して横断的なフィールドを設定する
* リソースのコレクションを構成およびカスタマイズする

### リソースの生成 {#generating-resources}

ConfigMapとSecretは、Podなど他のKubernetesオブジェクトによって使用される設定や機密データを保持します。
ConfigMapやSecretの信頼できる情報源は、通常、`.properties`ファイルやSSH鍵ファイルなど、クラスター外部にあります。
Kustomizeには、`secretGenerator`や`configMapGenerator`があり、ファイルやリテラルからSecretやConfigMapを生成することができます。

#### configMapGenerator

ファイルからConfigMapを生成するには、`configMapGenerator`の`files`リストにエントリを追加します。
以下は、`.properties`ファイルからデータ項目を含むConfigMapを生成する例です:

```shell
# application.propertiesファイルを作成
cat <<EOF >application.properties
FOO=Bar
EOF

cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: example-configmap-1
  files:
  - application.properties
EOF
```

生成されたConfigMapは、次のコマンドで確認できます:

```shell
kubectl kustomize ./
```

生成されたConfigMapは次のとおりです:

```yaml
apiVersion: v1
data:
  application.properties: |
    FOO=Bar
kind: ConfigMap
metadata:
  name: example-configmap-1-8mbdf7882g
```

envファイルからConfigMapを生成するには、`configMapGenerator`の`envs`リストにエントリを追加します。
以下は、`.env`ファイルからデータ項目を含むConfigMapを生成する例です:

```shell
# .envファイルを作成
cat <<EOF >.env
FOO=Bar
EOF

cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: example-configmap-1
  envs:
  - .env
EOF
```

生成されたConfigMapは、次のコマンドで確認できます:

```shell
kubectl kustomize ./
```

生成されたConfigMapは次のとおりです:

```yaml
apiVersion: v1
data:
  FOO: Bar
kind: ConfigMap
metadata:
  name: example-configmap-1-42cfbf598f
```

{{< note >}}
`.env`ファイル内の各変数は、生成するConfigMap内で個別のキーになります。
これは、`application.properties`という名前のファイル(とそのすべてのエントリ)を単一のキーの値として埋め込む前の例とは異なります。
{{< /note >}}

ConfigMapは、リテラルのキーと値のペアからも生成できます。
リテラルのキーと値のペアからConfigMapを生成するには、configMapGeneratorの`literals`リストにエントリを追加します。
以下は、キーと値のペアからデータ項目を含むConfigMapを生成する例です。

```shell
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: example-configmap-2
  literals:
  - FOO=Bar
EOF
```

生成されたConfigMapは、次のコマンドで確認できます:

```shell
kubectl kustomize ./
```

生成されたConfigMapは次のとおりです:

```yaml
apiVersion: v1
data:
  FOO: Bar
kind: ConfigMap
metadata:
  name: example-configmap-2-g2hdhfc6tk
```

生成されたConfigMapをDeploymentで使用するには、configMapGeneratorの名前で参照します。
Kustomizeは、この名前を自動的に生成された名前に置き換えます。

これは、生成されたConfigMapを使用するDeploymentの例です:

```yaml
# application.propertiesファイルを作成
cat <<EOF >application.properties
FOO=Bar
EOF

cat <<EOF >deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: my-app
        volumeMounts:
        - name: config
          mountPath: /config
      volumes:
      - name: config
        configMap:
          name: example-configmap-1
EOF

cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml
configMapGenerator:
- name: example-configmap-1
  files:
  - application.properties
EOF
```

ConfigMapとDeploymentを生成します:

```shell
kubectl kustomize ./
```

生成されたDeploymentは、生成されたConfigMapを名前で参照します:

```yaml
apiVersion: v1
data:
  application.properties: |
    FOO=Bar
kind: ConfigMap
metadata:
  name: example-configmap-1-g4hk9g2ff8
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: my-app
  name: my-app
spec:
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - image: my-app
        name: app
        volumeMounts:
        - mountPath: /config
          name: config
      volumes:
      - configMap:
          name: example-configmap-1-g4hk9g2ff8
        name: config
```

#### secretGenerator

Secretは、ファイルまたはリテラルのキーと値のペアから生成できます。
ファイルからSecretを生成するには、`secretGenerator`の`files`リストにエントリを追加します。
以下は、ファイルからデータ項目を含むSecretを生成する例です:

```shell
# password.txtファイルを作成
cat <<EOF >./password.txt
username=admin
password=secret
EOF

cat <<EOF >./kustomization.yaml
secretGenerator:
- name: example-secret-1
  files:
  - password.txt
EOF
```

生成されたSecretは次のとおりです:

```yaml
apiVersion: v1
data:
  password.txt: dXNlcm5hbWU9YWRtaW4KcGFzc3dvcmQ9c2VjcmV0Cg==
kind: Secret
metadata:
  name: example-secret-1-t2kt65hgtb
type: Opaque
```

リテラルのキーと値のペアからSecretを生成するには、`secretGenerator`の`literals`リストにエントリを追加します。
以下は、キーと値のペアからデータ項目を含むSecretを生成する例です:

```shell
cat <<EOF >./kustomization.yaml
secretGenerator:
- name: example-secret-2
  literals:
  - username=admin
  - password=secret
EOF
```

生成されたSecretは次のとおりです:

```yaml
apiVersion: v1
data:
  password: c2VjcmV0
  username: YWRtaW4=
kind: Secret
metadata:
  name: example-secret-2-t52t6g96d8
type: Opaque
```

ConfigMapと同様に、生成されたSecretは、secretGeneratorの名前を参照することでDeploymentで使用できます:

```shell
# password.txtファイルを作成
cat <<EOF >./password.txt
username=admin
password=secret
EOF

cat <<EOF >deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: my-app
        volumeMounts:
        - name: password
          mountPath: /secrets
      volumes:
      - name: password
        secret:
          secretName: example-secret-1
EOF

cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml
secretGenerator:
- name: example-secret-1
  files:
  - password.txt
EOF
```

#### generatorOptions

生成されたConfigMapとSecretには、コンテンツハッシュのサフィックスが付加されます。
これにより、コンテンツが変更されたときに新しいConfigMapまたはSecretが生成されることが保証されます。
サフィックスを付加する挙動を無効にするには、`generatorOptions`を使用できます。
さらに、生成されたConfigMapとSecretに対して横断的なオプションを指定することも可能です。

```shell
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: example-configmap-3
  literals:
  - FOO=Bar
generatorOptions:
  disableNameSuffixHash: true
  labels:
    type: generated
  annotations:
    note: generated
EOF
```

`kubectl kustomize ./`を実行して、生成されたConfigMapを確認します:

```yaml
apiVersion: v1
data:
  FOO: Bar
kind: ConfigMap
metadata:
  annotations:
    note: generated
  labels:
    type: generated
  name: example-configmap-3
```

### 横断的なフィールドの設定 {#setting-cross-cutting-fields}

プロジェクト内のすべてのKubernetesリソースに対して横断的なフィールドを設定することは非常に一般的です。
横断的なフィールドを設定するいくつかのユースケースは次のとおりです:

* すべてのリソースに同じNamespaceを設定する
* 同じ名前のプレフィックスまたはサフィックスを追加する
* 同じラベルのセットを追加する
* 同じアノテーションのセットを追加する

以下は例です:

```shell
# deployment.yamlを作成
cat <<EOF >./deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
EOF

cat <<EOF >./kustomization.yaml
namespace: my-namespace
namePrefix: dev-
nameSuffix: "-001"
labels:
  - pairs:
      app: bingo
    includeSelectors: true 
commonAnnotations:
  oncallPager: 800-555-1212
resources:
- deployment.yaml
EOF
```

`kubectl kustomize ./`を実行して、これらのフィールドがすべてDeploymentリソースに設定されていることを確認します:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    oncallPager: 800-555-1212
  labels:
    app: bingo
  name: dev-nginx-deployment-001
  namespace: my-namespace
spec:
  selector:
    matchLabels:
      app: bingo
  template:
    metadata:
      annotations:
        oncallPager: 800-555-1212
      labels:
        app: bingo
    spec:
      containers:
      - image: nginx
        name: nginx
```

### リソースの集約とカスタマイズ {#composing-and-customizing-resources}

プロジェクト内で一連のリソースを集約し、同じファイルやディレクトリ内で管理することは一般的です。
Kustomizeは、異なるファイルからリソースを集約し、それらにパッチやその他のカスタマイズを適用することをサポートしています。

#### 集約 {#composing}

Kustomizeは、異なるリソースの集約をサポートしています。
`kustomization.yaml`ファイルの`resources`フィールドは、構成に含めるリソースのリストを定義します。
`resources`リストにリソースの構成ファイルへのパスを設定します。
以下は、DeploymentとServiceで構成されるNGINXアプリケーションの例です:

```shell
# deployment.yamlファイルを作成
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

# service.yamlファイルを作成
cat <<EOF > service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nginx
  labels:
    run: my-nginx
spec:
  ports:
  - port: 80
    protocol: TCP
  selector:
    run: my-nginx
EOF

# それらを集約するkustomization.yamlを作成
cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml
- service.yaml
EOF
```

`kubectl kustomize ./`の出力のリソースには、DeploymentとServiceの両方のオブジェクトが含まれます。

#### カスタマイズ {#customizing}

パッチを使用して、リソースにさまざまなカスタマイズを適用できます。
Kustomizeは、`patches`フィールドを使用した`StrategicMerge`と`Json6902`による異なるパッチメカニズムをサポートしています。
`patches`は、ファイルまたはインライン文字列で、単一または複数のリソースを対象にできます。

`patches`フィールドには、指定された順序で適用されるパッチのリストが含まれます。
パッチの対象となるリソースは、`group`、`version`、`kind`、`name`、`namespace`、`labelSelector`、`annotationSelector`によって選択されます。

1つのことを行う小さなパッチが推奨されます。
たとえば、デプロイメントのレプリカ数を増やすパッチと、メモリ制限を設定する別のパッチを個別に作成します。
パッチ対象のリソースは、パッチファイルの`group`、`version`、`kind`、`name`フィールドを使用してマッチングされます。

```shell
# deployment.yamlファイルを作成
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

# パッチ用のincrease_replicas.yamlを作成
cat <<EOF > increase_replicas.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  replicas: 3
EOF

# 別のパッチ用のset_memory.yamlを作成
cat <<EOF > set_memory.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  template:
    spec:
      containers:
      - name: my-nginx
        resources:
          limits:
            memory: 512Mi
EOF

cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml
patches:
  - path: increase_replicas.yaml
  - path: set_memory.yaml
EOF
```

`kubectl kustomize ./`を実行して、Deploymentを確認します:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      run: my-nginx
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - image: nginx
        name: my-nginx
        ports:
        - containerPort: 80
        resources:
          limits:
            memory: 512Mi
```

すべてのリソースやフィールドが`strategicMerge`パッチをサポートしているわけではありません。
任意のリソース内の任意のフィールドの変更をサポートするために、Kustomizeは`Json6902`による[JSONパッチ](https://tools.ietf.org/html/rfc6902)の適用を提供しています。
`Json6902`パッチ対象の正しいリソースを見つけるには、`kustomization.yaml`で`target`フィールドを指定することが必須です。

たとえば、Deploymentオブジェクトのレプリカ数を増やすことは、`Json6902`パッチでも実行できます。
対象のリソースは、`target`フィールドの`group`、`version`、`kind`、`name`を使用してマッチングされます。

```shell
# deployment.yamlファイルを作成
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

# JSONパッチを作成
cat <<EOF > patch.yaml
- op: replace
  path: /spec/replicas
  value: 3
EOF

# kustomization.yamlを作成
cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml

patches:
- target:
    group: apps
    version: v1
    kind: Deployment
    name: my-nginx
  path: patch.yaml
EOF
```

`kubectl kustomize ./`を実行して、`replicas`フィールドが更新されていることを確認します:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      run: my-nginx
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - image: nginx
        name: my-nginx
        ports:
        - containerPort: 80
```

パッチに加えて、Kustomizeは、パッチを作成せずに、コンテナイメージのカスタマイズや、他のオブジェクトからコンテナへのフィールド値の注入も提供します。
たとえば、`kustomization.yaml`の`images`フィールドで新しいイメージを指定することで、コンテナ内で使用されるイメージを変更できます。

```shell
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml
images:
- name: nginx
  newName: my.image.registry/nginx
  newTag: "1.4.0"
EOF
```

`kubectl kustomize ./`を実行して、使用されるイメージが更新されていることを確認します:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  replicas: 2
  selector:
    matchLabels:
      run: my-nginx
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - image: my.image.registry/nginx:1.4.0
        name: my-nginx
        ports:
        - containerPort: 80
```

場合によっては、Pod内で実行されているアプリケーションが、他のオブジェクトからの設定値を使用する必要があるかもしれません。
たとえば、DeploymentオブジェクトのPodは、対応するService名をEnvから読み取るか、コマンド引数として読み取る必要があります。
`kustomization.yaml`ファイルで`namePrefix`または`nameSuffix`が追加されるとService名が変更される可能性があるため、コマンド引数にService名をハードコードすることは推奨されません。
このような用途のために、Kustomizeは`replacements`を通じてService名をコンテナに注入できます。

```shell
# deployment.yamlファイルを作成(ヒアドキュメントのデリミタを引用符で囲む)
cat <<'EOF' > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        command: ["start", "--host", "MY_SERVICE_NAME_PLACEHOLDER"]
EOF

# service.yamlファイルを作成
cat <<EOF > service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nginx
  labels:
    run: my-nginx
spec:
  ports:
  - port: 80
    protocol: TCP
  selector:
    run: my-nginx
EOF

cat <<EOF >./kustomization.yaml
namePrefix: dev-
nameSuffix: "-001"

resources:
- deployment.yaml
- service.yaml

replacements:
- source:
    kind: Service
    name: my-nginx
    fieldPath: metadata.name
  targets:
  - select:
      kind: Deployment
      name: my-nginx
    fieldPaths:
    - spec.template.spec.containers.0.command.2
EOF
```

`kubectl kustomize ./`を実行して、コンテナに注入されたService名が`dev-my-nginx-001`であることを確認します:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: dev-my-nginx-001
spec:
  replicas: 2
  selector:
    matchLabels:
      run: my-nginx
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - command:
        - start
        - --host
        - dev-my-nginx-001
        image: nginx
        name: my-nginx
```

## ベースとオーバーレイ {#bases-and-overlays}

Kustomizeには、**ベース**と**オーバーレイ**の概念があります。
**ベース**は、`kustomization.yaml`を含むディレクトリで、一連のリソースと関連するカスタマイズが含まれます。
ベースは、`kustomization.yaml`が内部に存在する限り、ローカルディレクトリまたはリモートリポジトリのディレクトリのいずれかになります。
**オーバーレイ**は、他のkustomizationディレクトリを`bases`として参照する`kustomization.yaml`を含むディレクトリです。
**ベース**はオーバーレイを認識せず、複数のオーバーレイで使用できます。

**オーバーレイ**ディレクトリの`kustomization.yaml`は、複数の`bases`を参照し、これらのベースで定義されたすべてのリソースを1つの構成に結合します。
さらに、特定の要件を満たすために、これらのリソースにカスタマイズを適用することも可能です。

以下はベースの例です:

```shell
# ベースを保持するディレクトリを作成
mkdir base
# base/deployment.yamlを作成
cat <<EOF > base/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
EOF

# base/service.yamlファイルを作成
cat <<EOF > base/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nginx
  labels:
    run: my-nginx
spec:
  ports:
  - port: 80
    protocol: TCP
  selector:
    run: my-nginx
EOF
# base/kustomization.yamlを作成
cat <<EOF > base/kustomization.yaml
resources:
- deployment.yaml
- service.yaml
EOF
```

このベースは複数のオーバーレイで使用できます。
異なるオーバーレイで、異なる`namePrefix`やその他の横断的なフィールドを追加できます。
以下は、同じベースを使用する2つのオーバーレイです:

```shell
mkdir dev
cat <<EOF > dev/kustomization.yaml
resources:
- ../base
namePrefix: dev-
EOF

mkdir prod
cat <<EOF > prod/kustomization.yaml
resources:
- ../base
namePrefix: prod-
EOF
```

## Kustomizeを使用してオブジェクトを適用/表示/削除する方法 {#how-to-apply-view-delete-objects-using-kustomize}

`kubectl`コマンドで`--kustomize`または`-k`を使用して、`kustomization.yaml`によって管理されるリソースを認識します。
`-k`は、次のようにkustomizationディレクトリを指す必要があることに注意してください。

```shell
kubectl apply -k <kustomization directory>/
```

次の`kustomization.yaml`があるとします:

```shell
# deployment.yamlファイルを作成
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

# kustomization.yamlを作成
cat <<EOF >./kustomization.yaml
namePrefix: dev-
labels:
  - pairs:
      app: my-nginx
    includeSelectors: true 
resources:
- deployment.yaml
EOF
```

次のコマンドを実行して、Deploymentオブジェクト`dev-my-nginx`を適用します:

```shell
> kubectl apply -k ./
deployment.apps/dev-my-nginx created
```

次のいずれかのコマンドを実行して、Deploymentオブジェクト`dev-my-nginx`を表示します:

```shell
kubectl get -k ./
```

```shell
kubectl describe -k ./
```

次のコマンドを実行して、Deploymentオブジェクト`dev-my-nginx`を、マニフェストが適用された場合のクラスターの状態と比較します:

```shell
kubectl diff -k ./
```

次のコマンドを実行して、Deploymentオブジェクト`dev-my-nginx`を削除します:

```shell
> kubectl delete -k ./
deployment.apps "dev-my-nginx" deleted
```

## Kustomizeの機能リスト {#kustomize-feature-list}

| フィールド | 型 | 説明 |
|-------|------|-------------|
| bases | []string | このリスト内の各エントリは、kustomization.yamlファイルを含むディレクトリに解決される必要があります |
| commonAnnotations | map[string]string | すべてのリソースに追加するアノテーション |
| commonLabels | map[string]string | すべてのリソースとセレクターに追加するラベル |
| configMapGenerator | [][ConfigMapArgs](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/configmapargs.go#L7) | このリスト内の各エントリはConfigMapを生成します |
| configurations | []string | このリスト内の各エントリは、[Kustomize Transformerの設定](https://github.com/kubernetes-sigs/kustomize/tree/master/examples/transformerconfigs)を含むファイルに解決される必要があります |
| crds | []string | このリスト内の各エントリは、Kubernetes型のOpenAPI定義ファイルに解決される必要があります |
| generatorOptions | [GeneratorOptions](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/generatoroptions.go#L7) | すべてのConfigMapとSecretジェネレーターの動作を変更します |
| images | [][Image](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/image.go#L8) | 各エントリは、パッチを作成せずに1つのイメージの名前、タグ、ダイジェストを変更するためのものです |
| labels | map[string]string | 対応するセレクターを自動的に注入せずにラベルを追加します |
| namePrefix | string | このフィールドの値は、すべてのリソースの名前の前に付加されます |
| nameSuffix | string | このフィールドの値は、すべてのリソースの名前の後に付加されます |
| patchesJson6902 | [][Patch](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/patch.go#L10) | このリスト内の各エントリは、KubernetesオブジェクトとJSONパッチに解決される必要があります |
| patchesStrategicMerge | []string | このリスト内の各エントリは、KubernetesオブジェクトのStrategic Mergeパッチに解決される必要があります |
| replacements | [][Replacements](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/replacement.go#L15) | リソースのフィールドから値をコピーして、指定された任意の数のターゲットに適用します |
| resources | []string | このリスト内の各エントリは、既存のリソース設定ファイルに解決される必要があります |
| secretGenerator | [][SecretArgs](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/secretargs.go#L7) | このリスト内の各エントリはSecretを生成します |
| vars | [][Var](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/var.go#L19) | 各エントリは、1つのリソースのフィールドからテキストをキャプチャするためのものです |

## {{% heading "whatsnext" %}}

* [Kustomize](https://github.com/kubernetes-sigs/kustomize)
* [Kubectl Book](https://kubectl.docs.kubernetes.io)
* [Kubectlコマンドリファレンス](/docs/reference/generated/kubectl/kubectl-commands/)
* [Kubernetes APIリファレンス](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
