---
title: 設定ファイルを使用したKubernetesオブジェクトの宣言型の管理
content_type: task
weight: 10
---

<!-- overview -->

Kubernetesオブジェクトの作成・更新・削除は、1つのディレクトリに複数のオブジェクトファイルを保存して、`kubectl apply`を使用することで可能になり、必要に応じてこれらのオブジェクトを再帰的に作成・更新できます。この方法では、変更点をオブジェクトの設定ファイルにマージせずに、作成済みのオブジェクトに対して書き込みを行います。また、`kubectl diff`を使用すると、`apply`によってどんな変更が行われるかをプレビューできます。

## {{% heading "prerequisites" %}}

[`kubectl`](/ja/docs/tasks/tools/)をインストールしてください。

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## トレードオフ

`kubectl`ツールは3種類のオブジェクトの管理方法をサポートしています。

* 命令型のコマンド
* 命令型のオブジェクト管理
* 宣言型のオブジェクト管理

各種類のオブジェクト管理の利点と欠点の議論については、[Kubernetesのオブジェクト管理](/ja/docs/concepts/overview/working-with-objects/object-management/)を読んでください。

## 概要

宣言型のオブジェクトの設定はKubernetesオブジェクトの定義と設定について確かな理解を必要とします。まだ読んでいない場合は、以下のドキュメントを読んでください。

* [命令型のコマンドを使用してKubernetesのオブジェクトを管理する](/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [設定ファイルを使用したKubernetesオブジェクトの命令型の管理](/docs/tasks/manage-kubernetes-objects/imperative-config/)

以下に、このドキュメントで使用する用語の定義を説明します。

- *オブジェクトの設定ファイル/設定ファイル*: Kubernetesオブジェクトの設定を定義するファイル。このトピックでは、設定ファイルを`kubectl apply`にわたす方法について説明します。設定ファイルはGitなどのソースコントロールの中に保存するのが普通です。
- *live object configuration / live configuration*: The live configuration
  values of an object, as observed by the Kubernetes cluster. These are kept in the Kubernetes
  cluster storage, typically etcd.
- *declarative configuration writer /  declarative writer*: A person or software component
  that makes updates to a live object. The live writers referred to in this topic make changes
  to object configuration files and run `kubectl apply` to write the changes.

## オブジェクトの作成方法

すでに存在するオブジェクト以外の、指定されたディレクトリ内の設定ファイルとして定義されたすべてのオブジェクトを作成するには、`kubectl apply`を使用してください。

```shell
kubectl apply -f <directory>/
```

これにより、各オブジェクトに`kubectl.kubernetes.io/last-applied-configuration: '{...}'`アノテーションが設定されます。このアノテーションには、オブジェクトの作成に使われたオブジェクトの設定ファイルの内容が含まれています。

{{< note >}}
`-R`フラグを追加すると、ディレクトリが再帰的に処理されます。
{{< /note >}}

以下は、オブジェクトの設定ファイルの一例です。

{{< codenew file="application/simple_deployment.yaml" >}}

作成予定のオブジェクトを出力するには、`kubectl diff`を実行します。

```shell
kubectl diff -f https://k8s.io/examples/application/simple_deployment.yaml
```

{{< note >}}
`diff`は、[server-side dry-run](/docs/reference/using-api/api-concepts/#dry-run)を使用しています。そのためには、`kube-apiserver`上で設定を有効にする必要があります。

`diff`はサーバーサイドのapplyリクエストをdry-runモードで実行するため、`PATCH`、`CREATE`、`UPDATE`の権限を与える必要があります。詳細については、[Dry-Run Authorization](/docs/reference/using-api/api-concepts#dry-run-authorization)を参照してください。
{{< /note >}}

`kubectl apply`を使用してオブジェクトを作成します。

```shell
kubectl apply -f https://k8s.io/examples/application/simple_deployment.yaml
```

実際の設定を出力するには、`kubectl get`を使用します。

```shell
kubectl get -f https://k8s.io/examples/application/simple_deployment.yaml -o yaml
```

出力を見ると、実際の設定に`kubectl.kubernetes.io/last-applied-configuration`アノテーションが書き込まれていて、それが設定ファイルの内容と一致することがわかります。

```yaml
kind: Deployment
metadata:
  annotations:
    # ...
    # これは simple_deployment.yaml の json 表現です。
    # オブジェクトの作成時に kubectl apply によって書き込まれました。
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.14.2","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  # ...
  minReadySeconds: 5
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        # ...
        name: nginx
        ports:
        - containerPort: 80
        # ...
      # ...
    # ...
  # ...
```

## オブジェクトの更新方法

`kubectl apply`は、たとえすでにオブジェクトが存在していたとしても、ディレクトリ内で定義されたすべてのオブジェクトの更新をするためにも使用できます。更新を実現するには、次のようなアプローチがあります。

1. 設定ファイルに現れるフィールドを実際の設定上に設定する。
2. 設定ファイルからフィールドを実際の設定上でクリアする。

```shell
kubectl diff -f <directory>/
kubectl apply -f <directory>/
```

{{< note >}}
`-R`フラグを追加すると、ディレクトリが再帰的に処理されます。
{{< /note >}}

以下は、設定ファイルの一例です。

{{< codenew file="application/simple_deployment.yaml" >}}

`kubectl apply`を使用してオブジェクトを作成します。

```shell
kubectl apply -f https://k8s.io/examples/application/simple_deployment.yaml
```

{{< note >}}
説明のために、上記のコマンドではディレクトリではなく単一のファイルを指定しています。
{{< /note >}}

`kubectl get`を使用して実際の設定を出力します。

```shell
kubectl get -f https://k8s.io/examples/application/simple_deployment.yaml -o yaml
```

出力を見ると、実際の設定に`kubectl.kubernetes.io/last-applied-configuration`アノテーションが書き込まれていて、それが設定ファイルの内容と一致することがわかります。

```yaml
kind: Deployment
metadata:
  annotations:
    # ...
    # これは simple_deployment.yaml の json 表現です。
    # オブジェクトの作成時に kubectl apply によって書き込まれました。
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.14.2","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  # ...
  minReadySeconds: 5
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        # ...
        name: nginx
        ports:
        - containerPort: 80
        # ...
      # ...
    # ...
  # ...
```

次に、`kubectl scale`を実行して、実際の設定内の`replicas`フィールドを直接更新します。この方法では、`kubectl apply`は使用しません。

```shell
kubectl scale deployment/nginx-deployment --replicas=2
```

`kubectl get`を使用して実際の設定を出力します。

```shell
kubectl get deployment nginx-deployment -o yaml
```


出力を見ると、`replicas`フィールドが2に設定されていて、`kubectl.kubernetes.io/last-applied-configuration`アノテーションには`replicas`フィールドが含まれないことがわかります。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # アノテーションには replicas が含まれていないことに注目してください。
    # apply によって更新されたわけではないためです。
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.14.2","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  replicas: 2 # scale によって書き込まれた
  # ...
  minReadySeconds: 5
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        # ...
        name: nginx
        ports:
        - containerPort: 80
      # ...
```

`simple_deployment.yaml`設定ファイルを更新して、imageを`nginx:1.14.2`から`nginx:1.16.1`に変更し、`minReadySeconds`フィールドを削除します。

{{< codenew file="application/update_deployment.yaml" >}}

設定ファイルに加えた変更をapplyします。

```shell
kubectl diff -f https://k8s.io/examples/application/update_deployment.yaml
kubectl apply -f https://k8s.io/examples/application/update_deployment.yaml
```

`kubectl get`を使用して実際の設定を出力します。

```shell
kubectl get -f https://k8s.io/examples/application/update_deployment.yaml -o yaml
```

出力には、実際の設定に加えられた以下の変更が表示されます。

* `replicas` field retains the value of 2 set by `kubectl scale`.
  This is possible because it is omitted from the configuration file.
* `image` field has been updated to `nginx:1.16.1` from `nginx:1.14.2`.
* `last-applied-configuration` annotation has been updated with the new image.
* `minReadySeconds`フィールドがクリアされた。
* `last-applied-configuration`アノテーションには`minReadySeconds`フィールドが

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # The annotation contains the updated image to nginx 1.11.9,
    # but does not contain the updated replicas to 2
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.16.1","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
    # ...
spec:
  replicas: 2 # Set by `kubectl scale`.  Ignored by `kubectl apply`.
  # minReadySeconds cleared by `kubectl apply`
  # ...
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.16.1 # Set by `kubectl apply`
        # ...
        name: nginx
        ports:
        - containerPort: 80
        # ...
      # ...
    # ...
  # ...
```

{{< warning >}}
`kubectl apply`を命令型のオブジェクト設定コマンドの`create`や`replace`と組み合わせて使用することはできません。その理由は、`create`と`replace`は`kubectl apply`が更新するために使う`kubectl.kubernetes.io/last-applied-configuration`を保持しないためです。
{{< /warning >}}

## オブジェクトの削除方法

`kubectl apply`で管理されたオブジェクトの削除には、2種類のアプローチがあります。

### 推奨の方法: `kubectl delete -f <filename>`

以下のように、命令型のコマンドを使用してオブジェクトを手動で削除するアプローチが推奨されます。このほうが削除される対象がより明確で、ユーザーが意図しないオブジェクトを削除してしまう可能性が低いからです。

```shell
kubectl delete -f <filename>
```

### 別の方法: `kubectl apply -f <directory/> --prune -l your=label`

どういう意味であるかを理解していない場合、このコマンドは使わないでください。

{{< warning >}}
`kubectl apply --prune`はアルファ版の機能であるため、将来のリリースで後方互換性のない変更が導入される可能性があります。
{{< /warning >}}

{{< warning >}}
意図しないオブジェクトを削除しないようにするため、このコマンドを使用するときは十分気をつけなければなりません。
{{< /warning >}}

As an alternative to `kubectl delete`, you can use `kubectl apply` to identify objects to be deleted after their
configuration files have been removed from the directory. Apply with `--prune`
queries the API server for all objects matching a set of labels, and attempts
to match the returned live object configurations against the object
configuration files. If an object matches the query, and it does not have a
configuration file in the directory, and it has a `last-applied-configuration` annotation,
it is deleted.

{{< comment >}}
TODO(pwittrock): We need to change the behavior to prevent the user from running apply on subdirectories unintentionally.
{{< /comment >}}

```shell
kubectl apply -f <directory/> --prune -l <labels>
```

{{< warning >}}
Apply with prune should only be run against the root directory
containing the object configuration files. Running against sub-directories
can cause objects to be unintentionally deleted if they are returned
by the label selector query specified with `-l <labels>` and
do not appear in the subdirectory.
{{< /warning >}}

## オブジェクトの確認方法

`kubectl get`に`-o yaml`を使用すると、実際のオブジェクトの設定を表示することができます。

```shell
kubectl get -f <filename|url> -o yaml
```

## applyが変更の差分とマージを計算する仕組み

{{< caution >}}
*patch* is an update operation that is scoped to specific fields of an object
instead of the entire object. This enables updating only a specific set of fields
on an object without reading the object first.
{{< /caution >}}

When `kubectl apply` updates the live configuration for an object,
it does so by sending a patch request to the API server. The
patch defines updates scoped to specific fields of the live object
configuration. The `kubectl apply` command calculates this patch request
using the configuration file, the live configuration, and the
`last-applied-configuration` annotation stored in the live configuration.

### マージパッチの計算

The `kubectl apply` command writes the contents of the configuration file to the
`kubectl.kubernetes.io/last-applied-configuration` annotation. This
is used to identify fields that have been removed from the configuration
file and need to be cleared from the live configuration. Here are the steps used
to calculate which fields should be deleted or set:

1. Calculate the fields to delete. These are the fields present in `last-applied-configuration` and missing from the configuration file.
2. Calculate the fields to add or set. These are the fields present in the configuration file whose values don't match the live configuration.

Here's an example. Suppose this is the configuration file for a Deployment object:

{{< codenew file="application/update_deployment.yaml" >}}

Also, suppose this is the live configuration for the same Deployment object:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # note that the annotation does not contain replicas
    # because it was not updated through apply
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.14.2","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  replicas: 2 # written by scale
  # ...
  minReadySeconds: 5
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        # ...
        name: nginx
        ports:
        - containerPort: 80
      # ...
```

Here are the merge calculations that would be performed by `kubectl apply`:

1. Calculate the fields to delete by reading values from
   `last-applied-configuration` and comparing them to values in the
   configuration file.
   Clear fields explicitly set to null in the local object configuration file
   regardless of whether they appear in the `last-applied-configuration`.
   In this example, `minReadySeconds` appears in the
   `last-applied-configuration` annotation, but does not appear in the configuration file.
    **Action:** Clear `minReadySeconds` from the live configuration.
2. Calculate the fields to set by reading values from the configuration
   file and comparing them to values in the live configuration. In this example,
   the value of `image` in the configuration file does not match
    the value in the live configuration. **Action:** Set the value of `image` in the live configuration.
3. Set the `last-applied-configuration` annotation to match the value
   of the configuration file.
4. Merge the results from 1, 2, 3 into a single patch request to the API server.

Here is the live configuration that is the result of the merge:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # The annotation contains the updated image to nginx 1.11.9,
    # but does not contain the updated replicas to 2
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.16.1","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
    # ...
spec:
  selector:
    matchLabels:
      # ...
      app: nginx
  replicas: 2 # Set by `kubectl scale`.  Ignored by `kubectl apply`.
  # minReadySeconds cleared by `kubectl apply`
  # ...
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.16.1 # Set by `kubectl apply`
        # ...
        name: nginx
        ports:
        - containerPort: 80
        # ...
      # ...
    # ...
  # ...
```

### How different types of fields are merged

How a particular field in a configuration file is merged with
the live configuration depends on the
type of the field. There are several types of fields:

- *primitive*: A field of type string, integer, or boolean.
  For example, `image` and `replicas` are primitive fields. **Action:** Replace.

- *map*, also called *object*: A field of type map or a complex type that contains subfields. For example, `labels`,
  `annotations`,`spec` and `metadata` are all maps. **Action:** Merge elements or subfields.

- *list*: A field containing a list of items that can be either primitive types or maps.
  For example, `containers`, `ports`, and `args` are lists. **Action:** Varies.

When `kubectl apply` updates a map or list field, it typically does
not replace the entire field, but instead updates the individual subelements.
For instance, when merging the `spec` on a Deployment, the entire `spec` is
not replaced. Instead the subfields of `spec`, such as `replicas`, are compared
and merged.

### Merging changes to primitive fields

Primitive fields are replaced or cleared.

{{< note >}}
`-` is used for "not applicable" because the value is not used.
{{< /note >}}

| Field in object configuration file  | Field in live object configuration | Field in last-applied-configuration | Action                                    |
|-------------------------------------|------------------------------------|-------------------------------------|-------------------------------------------|
| Yes                                 | Yes                                | -                                   | Set live to configuration file value.  |
| Yes                                 | No                                 | -                                   | Set live to local configuration.           |
| No                                  | -                                  | Yes                                 | Clear from live configuration.            |
| No                                  | -                                  | No                                  | Do nothing. Keep live value.             |

### Merging changes to map fields

Fields that represent maps are merged by comparing each of the subfields or elements of the map:

{{< note >}}
`-` is used for "not applicable" because the value is not used.
{{< /note >}}

| Key in object configuration file    | Key in live object configuration   | Field in last-applied-configuration | Action                           |
|-------------------------------------|------------------------------------|-------------------------------------|----------------------------------|
| Yes                                 | Yes                                | -                                   | Compare sub fields values.        |
| Yes                                 | No                                 | -                                   | Set live to local configuration.  |
| No                                  | -                                  | Yes                                 | Delete from live configuration.   |
| No                                  | -                                  | No                                  | Do nothing. Keep live value.     |

### Merging changes for fields of type list

Merging changes to a list uses one of three strategies:

* Replace the list if all its elements are primitives.
* Merge individual elements in a list of complex elements.
* Merge a list of primitive elements.

The choice of strategy is made on a per-field basis.

#### Replace the list if all its elements are primitives

Treat the list the same as a primitive field. Replace or delete the
entire list. This preserves ordering.

**Example:** Use `kubectl apply` to update the `args` field of a Container in a Pod. This sets
the value of `args` in the live configuration to the value in the configuration file.
Any `args` elements that had previously been added to the live configuration are lost.
The order of the `args` elements defined in the configuration file is
retained in the live configuration.

```yaml
# last-applied-configuration value
    args: ["a", "b"]

# configuration file value
    args: ["a", "c"]

# live configuration
    args: ["a", "b", "d"]

# result after merge
    args: ["a", "c"]
```

**Explanation:** The merge used the configuration file value as the new list value.

#### Merge individual elements of a list of complex elements:

Treat the list as a map, and treat a specific field of each element as a key.
Add, delete, or update individual elements. This does not preserve ordering.

This merge strategy uses a special tag on each field called a `patchMergeKey`. The
`patchMergeKey` is defined for each field in the Kubernetes source code:
[types.go](https://github.com/kubernetes/api/blob/d04500c8c3dda9c980b668c57abc2ca61efcf5c4/core/v1/types.go#L2747)
When merging a list of maps, the field specified as the `patchMergeKey` for a given element
is used like a map key for that element.

**Example:** Use `kubectl apply` to update the `containers` field of a PodSpec.
This merges the list as though it was a map where each element is keyed
by `name`.

```yaml
# last-applied-configuration value
    containers:
    - name: nginx
      image: nginx:1.16
    - name: nginx-helper-a # key: nginx-helper-a; will be deleted in result
      image: helper:1.3
    - name: nginx-helper-b # key: nginx-helper-b; will be retained
      image: helper:1.3

# configuration file value
    containers:
    - name: nginx
      image: nginx:1.16
    - name: nginx-helper-b
      image: helper:1.3
    - name: nginx-helper-c # key: nginx-helper-c; will be added in result
      image: helper:1.3

# live configuration
    containers:
    - name: nginx
      image: nginx:1.16
    - name: nginx-helper-a
      image: helper:1.3
    - name: nginx-helper-b
      image: helper:1.3
      args: ["run"] # Field will be retained
    - name: nginx-helper-d # key: nginx-helper-d; will be retained
      image: helper:1.3

# result after merge
    containers:
    - name: nginx
      image: nginx:1.16
      # Element nginx-helper-a was deleted
    - name: nginx-helper-b
      image: helper:1.3
      args: ["run"] # Field was retained
    - name: nginx-helper-c # Element was added
      image: helper:1.3
    - name: nginx-helper-d # Element was ignored
      image: helper:1.3
```

**Explanation:**

- The container named "nginx-helper-a" was deleted because no container
  named "nginx-helper-a" appeared in the configuration file.
- The container named "nginx-helper-b" retained the changes to `args`
  in the live configuration. `kubectl apply` was able to identify
  that "nginx-helper-b" in the live configuration was the same
  "nginx-helper-b" as in the configuration file, even though their fields
  had different values (no `args` in the configuration file). This is
  because the `patchMergeKey` field value (name) was identical in both.
- The container named "nginx-helper-c" was added because no container
  with that name appeared in the live configuration, but one with
  that name appeared in the configuration file.
- The container named "nginx-helper-d" was retained because
  no element with that name appeared in the last-applied-configuration.

#### Merge a list of primitive elements

As of Kubernetes 1.5, merging lists of primitive elements is not supported.

{{< note >}}
Which of the above strategies is chosen for a given field is controlled by
the `patchStrategy` tag in [types.go](https://github.com/kubernetes/api/blob/d04500c8c3dda9c980b668c57abc2ca61efcf5c4/core/v1/types.go#L2748)
If no `patchStrategy` is specified for a field of type list, then
the list is replaced.
{{< /note >}}

{{< comment >}}
TODO(pwittrock): Uncomment this for 1.6

- Treat the list as a set of primitives.  Replace or delete individual
  elements.  Does not preserve ordering.  Does not preserve duplicates.

**Example:** Using apply to update the `finalizers` field of ObjectMeta
keeps elements added to the live configuration.  Ordering of finalizers
is lost.
{{< /comment >}}

## デフォルトのフィールドの値

The API server sets certain fields to default values in the live configuration if they are
not specified when the object is created.

Here's a configuration file for a Deployment. The file does not specify `strategy`:

{{< codenew file="application/simple_deployment.yaml" >}}

Create the object using `kubectl apply`:

```shell
kubectl apply -f https://k8s.io/examples/application/simple_deployment.yaml
```

Print the live configuration using `kubectl get`:

```shell
kubectl get -f https://k8s.io/examples/application/simple_deployment.yaml -o yaml
```

The output shows that the API server set several fields to default values in the live
configuration. These fields were not specified in the configuration file.

```yaml
apiVersion: apps/v1
kind: Deployment
# ...
spec:
  selector:
    matchLabels:
      app: nginx
  minReadySeconds: 5
  replicas: 1 # defaulted by apiserver
  strategy:
    rollingUpdate: # defaulted by apiserver - derived from strategy.type
      maxSurge: 1
      maxUnavailable: 1
    type: RollingUpdate # defaulted by apiserver
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        imagePullPolicy: IfNotPresent # defaulted by apiserver
        name: nginx
        ports:
        - containerPort: 80
          protocol: TCP # defaulted by apiserver
        resources: {} # defaulted by apiserver
        terminationMessagePath: /dev/termination-log # defaulted by apiserver
      dnsPolicy: ClusterFirst # defaulted by apiserver
      restartPolicy: Always # defaulted by apiserver
      securityContext: {} # defaulted by apiserver
      terminationGracePeriodSeconds: 30 # defaulted by apiserver
# ...
```

In a patch request, defaulted fields are not re-defaulted unless they are explicitly cleared
as part of a patch request. This can cause unexpected behavior for
fields that are defaulted based
on the values of other fields. When the other fields are later changed,
the values defaulted from them will not be updated unless they are
explicitly cleared.

For this reason, it is recommended that certain fields defaulted
by the server are explicitly defined in the configuration file, even
if the desired values match the server defaults. This makes it
easier to recognize conflicting values that will not be re-defaulted
by the server.

**例:**

```yaml
# last-applied-configuration
spec:
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80

# 設定ファイル
spec:
  strategy:
    type: Recreate # 更新された値
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80

# live configuration
spec:
  strategy:
    type: RollingUpdate # defaulted value
    rollingUpdate: # defaulted value derived from type
      maxSurge : 1
      maxUnavailable: 1
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80

# result after merge - ERROR!
spec:
  strategy:
    type: Recreate # updated value: incompatible with rollingUpdate
    rollingUpdate: # defaulted value: incompatible with "type: Recreate"
      maxSurge : 1
      maxUnavailable: 1
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```

**説明:**

1. The user creates a Deployment without defining `strategy.type`.
2. The server defaults `strategy.type` to `RollingUpdate` and defaults the
   `strategy.rollingUpdate` values.
3. The user changes `strategy.type` to `Recreate`. The `strategy.rollingUpdate`
   values remain at their defaulted values, though the server expects them to be cleared.
   If the `strategy.rollingUpdate` values had been defined initially in the configuration file,
   it would have been more clear that they needed to be deleted.
4. Apply fails because `strategy.rollingUpdate` is not cleared. The `strategy.rollingupdate`
   field cannot be defined with a `strategy.type` of `Recreate`.

Recommendation: These fields should be explicitly defined in the object configuration file:

- Selectors and PodTemplate labels on workloads, such as Deployment, StatefulSet, Job, DaemonSet,
  ReplicaSet, and ReplicationController
- Deployment rollout strategy

### How to clear server-defaulted fields or fields set by other writers

Fields that do not appear in the configuration file can be cleared by
setting their values to `null` and then applying the configuration file.
For fields defaulted by the server, this triggers re-defaulting
the values.

## How to change ownership of a field between the configuration file and direct imperative writers

These are the only methods you should use to change an individual object field:

- Use `kubectl apply`.
- Write directly to the live configuration without modifying the configuration file:
for example, use `kubectl scale`.

### Changing the owner from a direct imperative writer to a configuration file

Add the field to the configuration file. For the field, discontinue direct updates to
the live configuration that do not go through `kubectl apply`.

### Changing the owner from a configuration file to a direct imperative writer

Kubernetes 1.5時点で、フィールドの所有権を設定ファイルから命令型の書き込みに変更するには、以下のような手動の作業が必要です。

- 設定ファイルからフィールドを削除する。
- 実際のオブジェクト上の`kubectl.kubernetes.io/last-applied-configuration`アノテーションからフィールドを削除する。

## 管理の方法を変更する

Kubernetesオブジェクトは一度に1つの方法で管理するべきです。1つの方法から他の方法へ切り替えることは可能ではありますが、手動のプロセスになります。

{{< note >}}
宣言型の管理とともに命令型の削除を使用することは問題ありません。
{{< /note >}}

{{< comment >}}
TODO(pwittrock): We need to make using imperative commands with
declarative object configuration work so that it doesn't write the
fields to the annotation, and instead.  Then add this bullet point.

- using imperative commands with declarative configuration to manage where each manages different fields.
{{< /comment >}}

### Migrating from imperative command management to declarative object configuration

Migrating from imperative command management to declarative object
configuration involves several manual steps:

1. Export the live object to a local configuration file:

     ```shell
     kubectl get <kind>/<name> -o yaml > <kind>_<name>.yaml
     ```

1. Manually remove the `status` field from the configuration file.

    {{< note >}}
    This step is optional, as `kubectl apply` does not update the status field
    even if it is present in the configuration file.
    {{< /note >}}

1. Set the `kubectl.kubernetes.io/last-applied-configuration` annotation on the object:

    ```shell
    kubectl replace --save-config -f <kind>_<name>.yaml
    ```

1. Change processes to use `kubectl apply` for managing the object exclusively.

{{< comment >}}
TODO(pwittrock): Why doesn't export remove the status field?  Seems like it should.
{{< /comment >}}

### Migrating from imperative object configuration to declarative object configuration

1. Set the `kubectl.kubernetes.io/last-applied-configuration` annotation on the object:

    ```shell
    kubectl replace --save-config -f <kind>_<name>.yaml
    ```

1. Change processes to use `kubectl apply` for managing the object exclusively.

## コントローラーセレクターとPodTempalteのラベルを定義する

{{< warning >}}
コントローラー上のセレクターを更新することは強くお勧めしません。
{{< /warning >}}

コントローラーセレクターにしか使用されないような他には意味を持たない、単一のイミュータブルなPodTemplateのラベルを定義するというアプローチが推奨されます。

**例:**

```yaml
selector:
  matchLabels:
      controller-selector: "apps/v1/deployment/nginx"
template:
  metadata:
    labels:
      controller-selector: "apps/v1/deployment/nginx"
```

## {{% heading "whatsnext" %}}

* [命令型のコマンドを使用してKubernetesオブジェクトを管理する](/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [設定ファイルを使用したKubernetesオブジェクトの命令型の管理](/docs/tasks/manage-kubernetes-objects/imperative-config/)
* [Kubectlコマンドリファレンス](/docs/reference/generated/kubectl/kubectl-commands/)
* [Kubernetes APIリファレンス](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
