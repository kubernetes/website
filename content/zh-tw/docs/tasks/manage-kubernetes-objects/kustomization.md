---
title: 使用 Kustomize 對 Kubernetes 物件進行宣告式管理
content_type: task
weight: 20
---
<!--
title: Declarative Management of Kubernetes Objects Using Kustomize
content_type: task
weight: 20
-->
<!-- overview -->

<!--
[Kustomize](https://github.com/kubernetes-sigs/kustomize) is a standalone tool
to customize Kubernetes objects
through a [kustomization file](https://kubectl.docs.kubernetes.io/references/kustomize/glossary/#kustomization).
-->
[Kustomize](https://github.com/kubernetes-sigs/kustomize) 是一個獨立的工具，用來透過
[kustomization 檔案](https://kubectl.docs.kubernetes.io/references/kustomize/glossary/#kustomization)
定製 Kubernetes 物件。

<!--
Since 1.14, Kubectl also
supports the management of Kubernetes objects using a kustomization file.
To view Resources found in a directory containing a kustomization file, run the following command:
-->
從 1.14 版本開始，`kubectl` 也開始支援使用 kustomization 檔案來管理 Kubernetes 物件。
要檢視包含 kustomization 檔案的目錄中的資源，執行下面的命令：

```shell
kubectl kustomize <kustomization_directory>
```

<!--
To apply those Resources, run `kubectl apply` with `- -kustomize` or `-k` flag:
-->
要應用這些資源，使用引數 `--kustomize` 或 `-k` 標誌來執行 `kubectl apply`：

```shell
kubectl apply -k <kustomization_directory>
```

## {{% heading "prerequisites" %}}

<!--
Install [`kubectl`](/docs/tasks/tools/).
-->
安裝 [`kubectl`](/zh-cn/docs/tasks/tools/).

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Overview of Kustomize

Kustomize is a tool for customizing Kubernetes configurations. It has the following features to manage application configuration files:

* generating resources from other sources
* setting cross-cutting fields for resources
* composing and customizing collections of resources
-->
## Kustomize 概述    {#overview-of-kustomize}

Kustomize 是一個用來定製 Kubernetes 配置的工具。它提供以下功能特性來管理
應用配置檔案：

* 從其他來源生成資源
* 為資源設定貫穿性（Cross-Cutting）欄位
* 組織和定製資源集合

<!--
### Generating Resources

ConfigMaps and Secrets hold configuration or sensitive data that are used by other Kubernetes objects, such as Pods. The source of truth of ConfigMaps or Secrets are usually external to a cluster, such as a `.properties` file or an SSH keyfile.
Kustomize has `secretGenerator` and `configMapGenerator`, which generate Secret and ConfigMap from files or literals.
-->
### 生成資源   {#generating-resources}

ConfigMap 和 Secret 包含其他 Kubernetes 物件（如 Pod）所需要的配置或敏感資料。
ConfigMap 或 Secret 中資料的來源往往是叢集外部，例如某個 `.properties`
檔案或者 SSH 金鑰檔案。
Kustomize 提供 `secretGenerator` 和 `configMapGenerator`，可以基於檔案或字面
值來生成 Secret 和 ConfigMap。

<!--
#### configMapGenerator

To generate a ConfigMap from a file, add an entry to the `files` list in `configMapGenerator`. Here is an example of generating a ConfigMap with a data item from a `.properties` file:
-->
#### configMapGenerator

要基於檔案來生成 ConfigMap，可以在 `configMapGenerator` 的 `files`
列表中新增表項。
下面是一個根據 `.properties` 檔案中的資料條目來生成 ConfigMap 的示例：

```shell
# 生成一個  application.properties 檔案
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

<!--
The generated ConfigMap can be examined with the following command:
-->
所生成的 ConfigMap 可以使用下面的命令來檢查：

```shell
kubectl kustomize ./
```

<!--
The generated ConfigMap is:
-->
所生成的 ConfigMap 為：

```yaml
apiVersion: v1
data:
  application.properties: |
    FOO=Bar
kind: ConfigMap
metadata:
  name: example-configmap-1-8mbdf7882g
```

<!--
To generate a ConfigMap from an env file, add an entry to the `envs` list in `configMapGenerator`. This can also be used to set values from local environment variables by omitting the `=` and the value.
-->
要從 env 檔案生成 ConfigMap，請在 `configMapGenerator` 中的 `envs` 列表中新增一個條目。
這也可以用於透過省略 `=` 和值來設定本地環境變數的值。

<!--
It's recommended to use the local environment variable population functionality sparingly - an overlay with a patch is often more maintainable. Setting values from the environment may be useful when they cannot easily be predicted, such as a git SHA.
-->
建議謹慎使用本地環境變數填充功能 —— 用補丁覆蓋通常更易於維護。 
當無法輕鬆預測變數的值時，從環境中設定值可能很有用，例如 git SHA。

<!--
Here is an example of generating a ConfigMap with a data item from a `.env` file:
-->
下面是一個用來自 `.env` 檔案的資料生成 ConfigMap 的例子：

```shell
# 建立一個 .env 檔案
# BAZ 將使用本地環境變數 $BAZ 的取值填充
cat <<EOF >.env
FOO=Bar
BAZ
EOF

cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: example-configmap-1
  envs:
  - .env
EOF
```

<!--
The generated ConfigMap can be examined with the following command:
-->
可以使用以下命令檢查生成的 ConfigMap：

```shell
BAZ=Qux kubectl kustomize ./
```

<!--
The generated ConfigMap is:
-->
生成的 ConfigMap 為：

```yaml
apiVersion: v1
data:
  BAZ: Qux
  FOO: Bar
kind: ConfigMap
metadata:
  name: example-configmap-1-892ghb99c8
```

<!--
Each variable in the `.env` file becomes a separate key in the ConfigMap that you generate. This is different from the previous example which embeds a file named `.properties` (and all its entries) as the value for a single key.
-->
{{< note >}}
`.env` 檔案中的每個變數在生成的 ConfigMap 中成為一個單獨的鍵。
這與之前的示例不同，前一個示例將一個名為 `.properties` 的檔案（及其所有條目）嵌入到同一個鍵的值中。
{{< /note >}}

<!--
ConfigMaps can also be generated from literal key-value pairs. To generate a ConfigMap from a literal key-value pair, add an entry to the `literals` list in configMapGenerator. Here is an example of generating a ConfigMap with a data item from a key-value pair:
-->
ConfigMap 也可基於字面的鍵值偶對來生成。要基於鍵值偶對來生成 ConfigMap，
在 `configMapGenerator` 的 `literals` 列表中新增表項。下面是一個例子，展示
如何使用鍵值偶對中的資料條目來生成 ConfigMap 物件：

```shell
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: example-configmap-2
  literals:
  - FOO=Bar
EOF
```

<!--
The generated ConfigMap can be checked by the following command:
-->
可以用下面的命令檢查所生成的 ConfigMap：

```shell
kubectl kustomize ./
```

<!--
The generated ConfigMap is:
-->
所生成的 ConfigMap 為：

```yaml
apiVersion: v1
data:
  FOO: Bar
kind: ConfigMap
metadata:
  name: example-configmap-2-g2hdhfc6tk
```

<!--
To use a generated ConfigMap in a Deployment, reference it by the name of the configMapGenerator. Kustomize will automatically replace this name with the generated name.

This is an example deployment that uses a generated ConfigMap:
-->
要在 Deployment 中使用生成的 ConfigMap，使用 configMapGenerator 的名稱對其進行引用。
Kustomize 將自動使用生成的名稱替換該名稱。

這是使用生成的 ConfigMap 的 deployment 示例：

```yaml
# 建立一個 application.properties 檔案
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

<!--
Generate the ConfigMap and Deployment:
-->
生成 ConfigMap 和 Deployment：

```shell
kubectl kustomize ./
```

<!--
The generated Deployment will refer to the generated ConfigMap by name:
-->
生成的 Deployment 將透過名稱引用生成的 ConfigMap：

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

<!--
You can generate Secrets from files or literal key-value pairs. To generate a Secret from a file, add an entry to the `files` list in `secretGenerator`. Here is an example of generating a Secret with a data item from a file:
-->
你可以基於檔案或者鍵值偶對來生成 Secret。要使用檔案內容來生成 Secret，
在 `secretGenerator` 下面的 `files` 列表中新增表項。
下面是一個根據檔案中資料來生成 Secret 物件的示例：

```shell
# 建立一個 password.txt 檔案
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

<!--
The generated Secret is as follows:
-->
所生成的 Secret 如下：

```yaml
apiVersion: v1
data:
  password.txt: dXNlcm5hbWU9YWRtaW4KcGFzc3dvcmQ9c2VjcmV0Cg==
kind: Secret
metadata:
  name: example-secret-1-t2kt65hgtb
type: Opaque
```

<!--
To generate a Secret from a literal key-value pair, add an entry to `literals` list in `secretGenerator`. Here is an example of generating a Secret with a data item from a key-value pair:
-->
要基於鍵值偶對字面值生成 Secret，先要在 `secretGenerator` 的 `literals`
列表中新增表項。下面是基於鍵值偶對中資料條目來生成 Secret 的示例：

```shell
cat <<EOF >./kustomization.yaml
secretGenerator:
- name: example-secret-2
  literals:
  - username=admin
  - password=secret
EOF
```

<!--
The generated Secret is as follows:
-->
所生成的 Secret 如下：

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

<!--
Like ConfigMaps, generated Secrets can be used in Deployments by referring to the name of the secretGenerator:
-->
與 ConfigMaps 一樣，生成的 Secrets 可以透過引用 secretGenerator 的名稱在部署中使用：

```shell
# 建立一個 password.txt 檔案
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

<!--
The generated ConfigMaps and Secrets have a content hash suffix appended. This ensures that a new ConfigMap or Secret is generated when the contents are changed. To disable the behavior of appending a suffix, one can use `generatorOptions`. Besides that, it is also possible to specify cross-cutting options for generated ConfigMaps and Secrets.
-->
所生成的 ConfigMap 和 Secret 都會包含內容雜湊值字尾。
這是為了確保內容發生變化時，所生成的是新的 ConfigMap 或 Secret。
要禁止自動新增字尾的行為，使用者可以使用 `generatorOptions`。
除此以外，為生成的 ConfigMap 和 Secret 指定貫穿性選項也是可以的。

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

<!--
Run`kubectl kustomize ./` to view the generated ConfigMap:
-->
執行 `kubectl kustomize ./` 來檢視所生成的 ConfigMap：

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

<!--
### Setting cross-cutting fields

It is quite common to set cross-cutting fields for all Kubernetes resources in a project.
Some use cases for setting cross-cutting fields:

* setting the same namespace for all Resources
* adding the same name prefix or suffix
* adding the same set of labels
* adding the same set of annotations

Here is an example:
-->
### 設定貫穿性欄位  {#setting-cross-cutting-fields}

在專案中為所有 Kubernetes 物件設定貫穿性欄位是一種常見操作。
貫穿性欄位的一些使用場景如下：

* 為所有資源設定相同的名字空間
* 為所有物件新增相同的字首或字尾
* 為物件新增相同的標籤集合
* 為物件新增相同的註解集合

下面是一個例子：

```shell
# 建立一個 deployment.yaml
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
commonLabels:
  app: bingo
commonAnnotations:
  oncallPager: 800-555-1212
resources:
- deployment.yaml
EOF
```

<!--
Run `kubectl kustomize ./` to view those fields are all set in the Deployment Resource:
-->
執行 `kubectl kustomize ./` 檢視這些欄位都被設定到 Deployment 資源上：

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

<!--
### Composing and Customizing Resources

It is common to compose a set of Resources in a project and manage them inside
the same file or directory.
Kustomize offers composing Resources from different files and applying patches or other customization to them.
-->
### 組織和定製資源    {#composing-and-customizing-resources}

一種常見的做法是在專案中構造資源集合並將其放到同一個檔案或目錄中管理。
Kustomize 提供基於不同檔案來組織資源並向其應用補丁或者其他定製的能力。

<!--
#### Composing

Kustomize supports composition of different resources. The `resources` field, in the `kustomization.yaml` file, defines the list of resources to include in a configuration. Set the path to a resource's configuration file in the `resources` list.
Here is an example of an NGINX application comprised of a Deployment and a Service:
-->
#### 組織    {#composing}

Kustomize 支援組合不同的資源。`kustomization.yaml` 檔案的 `resources` 欄位
定義配置中要包含的資源列表。你可以將 `resources` 列表中的路徑設定為資源配置檔案
的路徑。下面是由 Deployment 和 Service 構成的 NGINX 應用的示例：


```shell
# 建立 deployment.yaml 檔案
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

# 建立 service.yaml 檔案
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

# 建立 kustomization.yaml 來組織以上兩個資源
cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml
- service.yaml
EOF
```

<!--
The Resources from `kubectl kustomize ./` contain both the Deployment and the Service objects.
-->
`kubectl kustomize ./` 所得到的資源中既包含 Deployment 也包含 Service 物件。

<!--
#### Customizing

Patches can be used to apply different customizations to Resources. Kustomize supports different patching
mechanisms through `patchesStrategicMerge` and `patchesJson6902`. `patchesStrategicMerge` is a list of file paths. Each file should be resolved to a [strategic merge patch](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-api-machinery/strategic-merge-patch.md). The names inside the patches must match Resource names that are already loaded. Small patches that do one thing are recommended. For example, create one patch for increasing the deployment replica number and another patch for setting the memory limit.
-->
#### 定製   {#customizing}

補丁檔案（Patches）可以用來對資源執行不同的定製。
Kustomize 透過 `patchesStrategicMerge` 和 `patchesJson6902` 支援不同的打補丁
機制。`patchesStrategicMerge` 的內容是一個檔案路徑的列表，其中每個檔案都應可解析為
[策略性合併補丁（Strategic Merge Patch）](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-api-machinery/strategic-merge-patch.md)。
補丁檔案中的名稱必須與已經載入的資源的名稱匹配。
建議構造規模較小的、僅做一件事情的補丁。
例如，構造一個補丁來增加 Deployment
的副本個數；構造另外一個補丁來設定記憶體限制。

```shell
# 建立 deployment.yaml 檔案
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

# 生成一個補丁 increase_replicas.yaml
cat <<EOF > increase_replicas.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  replicas: 3
EOF

# 生成另一個補丁 set_memory.yaml
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
patchesStrategicMerge:
- increase_replicas.yaml
- set_memory.yaml
EOF
```

<!--
Run `kubectl kustomize ./` to view the Deployment:
-->
執行 `kubectl kustomize ./` 來檢視 Deployment：

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

<!--
Not all Resources or fields support strategic merge patches. To support modifying arbitrary fields in arbitrary Resources,
Kustomize offers applying [JSON patch](https://tools.ietf.org/html/rfc6902) through `patchesJson6902`.
To find the correct Resource for a Json patch, the group, version, kind and name of that Resource need to be
specified in `kustomization.yaml`. For example, increasing the replica number of a Deployment object can also be done
through `patchesJson6902`.
-->
並非所有資源或者欄位都支援策略性合併補丁。為了支援對任何資源的任何欄位進行修改，
Kustomize 提供透過 `patchesJson6902` 來應用 [JSON 補丁](https://tools.ietf.org/html/rfc6902)
的能力。為了給 JSON 補丁找到正確的資源，需要在 `kustomization.yaml` 檔案中指定資源的
組（group）、版本（version）、類別（kind）和名稱（name）。
例如，為某 Deployment 物件增加副本個數的操作也可以透過 `patchesJson6902`
來完成：

```shell
# 建立一個 deployment.yaml 檔案
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

# 建立一個 JSON 補丁檔案
cat <<EOF > patch.yaml
- op: replace
  path: /spec/replicas
  value: 3
EOF

# 建立一個 kustomization.yaml
cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml

patchesJson6902:
- target:
    group: apps
    version: v1
    kind: Deployment
    name: my-nginx
  path: patch.yaml
EOF
```

<!--
Run `kubectl kustomize ./` to see the `replicas` field is updated:
-->
執行 `kubectl kustomize ./` 以檢視 `replicas` 欄位被更新：

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

<!--
In addition to patches, Kustomize also offers customizing container images or injecting field values from other objects into containers
without creating patches. For example, you can change the image used inside containers by specifying the new image in `images` field in `kustomization.yaml`.
-->
除了補丁之外，Kustomize 還提供定製容器映象或者將其他物件的欄位值注入到容器
中的能力，並且不需要建立補丁。
例如，你可以透過在 `kustomization.yaml` 檔案的 `images` 欄位設定新的映象來
更改容器中使用的映象。

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
  newTag: 1.4.0
EOF
```

<!--
Run `kubectl kustomize ./` to see that the image being used is updated:
-->
執行 `kubectl kustomize ./` 以檢視所使用的映象已被更新：

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

<!--
Sometimes, the application running in a Pod may need to use configuration values from other objects. For example,
a Pod from a Deployment object need to read the corresponding Service name from Env or as a command argument.
Since the Service name may change as `namePrefix` or `nameSuffix` is added in the `kustomization.yaml` file. It is
not recommended to hard code the Service name in the command argument. For this usage, Kustomize can inject the Service name into containers through `vars`.
-->
有些時候，Pod 中執行的應用可能需要使用來自其他物件的配置值。
例如，某 Deployment 物件的 Pod 需要從環境變數或命令列引數中讀取讀取
Service 的名稱。
由於在 `kustomization.yaml` 檔案中新增 `namePrefix` 或 `nameSuffix` 時
Service 名稱可能發生變化，建議不要在命令引數中硬編碼 Service 名稱。
對於這種使用場景，Kustomize 可以透過 `vars` 將 Service 名稱注入到容器中。

```shell
# 建立一個 deployment.yaml 檔案（引用此處的文件分隔符）
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
        command: ["start", "--host", "$(MY_SERVICE_NAME)"]
EOF

# 建立一個 service.yaml 檔案
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

vars:
- name: MY_SERVICE_NAME
  objref:
    kind: Service
    name: my-nginx
    apiVersion: v1
EOF
```

<!--
Run `kubectl kustomize ./` to see that the Service name injected into containers is `dev-my-nginx-001`:
-->
執行 `kubectl kustomize ./` 以檢視注入到容器中的 Service 名稱是 `dev-my-nginx-001`：

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

<!--
## Bases and Overlays

Kustomize has the concepts of **bases** and **overlays**. A **base** is a directory with a `kustomization.yaml`, which contains a
set of resources and associated customization. A base could be either a local directory or a directory from a remote repo,
as long as a `kustomization.yaml` is present inside. An **overlay** is a directory with a `kustomization.yaml` that refers to other
kustomization directories as its `bases`. A **base** has no knowledge of an overlay and can be used in multiple overlays.
An overlay may have multiple bases and it composes all resources
from bases and may also have customization on top of them.

Here is an example of a base:
-->
## 基準（Bases）與覆蓋（Overlays）

Kustomize 中有 **基準（bases）** 和 **覆蓋（overlays）** 的概念區分。
**基準** 是包含 `kustomization.yaml` 檔案的一個目錄，其中包含一組資源及其相關的定製。
基準可以是本地目錄或者來自遠端倉庫的目錄，只要其中存在 `kustomization.yaml` 檔案即可。
**覆蓋** 也是一個目錄，其中包含將其他 kustomization 目錄當做 `bases` 來引用的
`kustomization.yaml` 檔案。
**基準**不瞭解覆蓋的存在，且可被多個覆蓋所使用。
覆蓋則可以有多個基準，且可針對所有基準中的資源執行組織操作，還可以在其上執行定製。

```shell
# 建立一個包含基準的目錄 
mkdir base
# 建立 base/deployment.yaml
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

# 建立 base/service.yaml 檔案
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

# 建立 base/kustomization.yaml
cat <<EOF > base/kustomization.yaml
resources:
- deployment.yaml
- service.yaml
EOF
```

<!--
This base can be used in multiple overlays. You can add different `namePrefix` or other cross-cutting fields
in different overlays. Here are two overlays using the same base.
-->
此基準可在多個覆蓋中使用。你可以在不同的覆蓋中新增不同的 `namePrefix` 或
其他貫穿性欄位。下面是兩個使用同一基準的覆蓋：

```shell
mkdir dev
cat <<EOF > dev/kustomization.yaml
bases:
- ../base
namePrefix: dev-
EOF

mkdir prod
cat <<EOF > prod/kustomization.yaml
bases:
- ../base
namePrefix: prod-
EOF
```

<!--
## How to apply/view/delete objects using Kustomize

Use `--kustomize` or `-k` in `kubectl` commands to recognize Resources managed by `kustomization.yaml`.
Note that `-k` should point to a kustomization directory, such as
-->
## 如何使用 Kustomize 來應用、檢視和刪除物件

在 `kubectl` 命令中使用 `--kustomize` 或 `-k` 引數來識別被 `kustomization.yaml` 所管理的資源。
注意 `-k` 要指向一個 kustomization 目錄。例如：

```shell
kubectl apply -k <kustomization 目錄>/
```

<!--
Given the following `kustomization.yaml`,
-->
假定使用下面的 `kustomization.yaml`，

```shell
# 建立 deployment.yaml 檔案
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

# 建立 kustomization.yaml
cat <<EOF >./kustomization.yaml
namePrefix: dev-
commonLabels:
  app: my-nginx
resources:
- deployment.yaml
EOF
```

<!--
Run the following command to apply the Deployment object `dev-my-nginx`:
-->
執行下面的命令來應用 Deployment 物件 `dev-my-nginx`：

```shell
kubectl apply -k ./
```
```
deployment.apps/dev-my-nginx created
```

<!--
Run one of the following commands to view the Deployment object `dev-my-nginx`:
-->
執行下面的命令之一來檢視 Deployment 物件 `dev-my-nginx`：

```shell
kubectl get -k ./
```

```shell
kubectl describe -k ./
```

<!--
Run the following command to compare the Deployment object `dev-my-nginx` against the state that the cluster would be in if the manifest was applied:
-->
執行下面的命令來比較 Deployment 物件 `dev-my-nginx` 與清單被應用之後
叢集將處於的狀態：

```shell
kubectl diff -k ./
```

<!--
Run the following command to delete the Deployment object `dev-my-nginx`:
-->
執行下面的命令刪除 Deployment 物件 `dev-my-nginx`：

```shell
kubectl delete -k ./
```
```
deployment.apps "dev-my-nginx" deleted
```

<!--
## Kustomize Feature List
-->
## Kustomize 功能特性列表

<!--
| Field                 | Type                                                                                                         | Explanation                                                                        |
|-----------------------|--------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------|
| namespace             | string                                                                                                       | add namespace to all resources                                                     |
| namePrefix            | string                                                                                                       | value of this field is prepended to the names of all resources                     |
| nameSuffix            | string                                                                                                       | value of this field is appended to the names of all resources                      |
| commonLabels          | map[string]string                                                                                            | labels to add to all resources and selectors                                       |
| commonAnnotations     | map[string]string                                                                                            | annotations to add to all resources                                                |
| resources             | []string                                                                                                     | each entry in this list must resolve to an existing resource configuration file    |
| configMapGenerator    | [][ConfigMapArgs](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/configmapargs.go#L7)    | Each entry in this list generates a ConfigMap                                      |
| secretGenerator       | [][SecretArgs](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/secretargs.go#L7)          | Each entry in this list generates a Secret                                         |
| generatorOptions      | [GeneratorOptions](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/generatoroptions.go#L7) | Modify behaviors of all ConfigMap and Secret generator                             |
| bases                 | []string                                                                                                     | Each entry in this list should resolve to a directory containing a kustomization.yaml file |
| patchesStrategicMerge | []string                                                                                                     | Each entry in this list should resolve a strategic merge patch of a Kubernetes object |
| patchesJson6902       | [][Patch](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/patch.go#L10)                   | Each entry in this list should resolve to a Kubernetes object and a Json Patch     |
| vars                  | [][Var](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/var.go#L19)                       | Each entry is to capture text from one resource's field                            |
| images                | [][Image](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/image.go#L8)                    | Each entry is to modify the name, tags and/or digest for one image without creating patches |
| configurations        | []string                                                                                                     | Each entry in this list should resolve to a file containing [Kustomize transformer configurations](https://github.com/kubernetes-sigs/kustomize/tree/master/examples/transformerconfigs) |
| crds                  | []string                                                                                                     | Each entry in this list should resolve to an OpenAPI definition file for Kubernetes types |
-->

| 欄位                  | 型別                                                                                                         | 解釋                                                                               |
|-----------------------|--------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------|
| namespace             | string                                                                                                       | 為所有資源新增名字空間                                                     |
| namePrefix            | string                                                                                                       | 此欄位的值將被新增到所有資源名稱前面                     |
| nameSuffix            | string                                                                                                       | 此欄位的值將被新增到所有資源名稱後面                      |
| commonLabels          | map[string]string                                                                                            | 要新增到所有資源和選擇算符的標籤                                       |
| commonAnnotations     | map[string]string                                                                                            | 要新增到所有資源的註解                                                |
| resources             | []string                                                                                                     | 列表中的每個條目都必須能夠解析為現有的資源配置檔案    |
| configMapGenerator    | [][ConfigMapArgs](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/configmapargs.go#L7)    | 列表中的每個條目都會生成一個 ConfigMap                                      |
| secretGenerator       | [][SecretArgs](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/secretargs.go#L7)          | 列表中的每個條目都會生成一個 Secret                                         |
| generatorOptions      | [GeneratorOptions](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/generatoroptions.go#L7) | 更改所有 ConfigMap 和 Secret 生成器的行為 |
| bases                 | []string                                                                                                     | 列表中每個條目都應能解析為一個包含 kustomization.yaml 檔案的目錄 |
| patchesStrategicMerge | []string                                                                                                     | 列表中每個條目都能解析為某 Kubernetes 物件的策略性合併補丁 |
| patchesJson6902       | [][Patch](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/patch.go#L10)                   | 列表中每個條目都能解析為一個 Kubernetes 物件和一個 JSON 補丁 |
| vars                  | [][Var](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/var.go#L19)                       | 每個條目用來從某資源的欄位來析取文字                            |
| images                | [][Image](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/image.go#L8)                    | 每個條目都用來更改映象的名稱、標記與/或摘要，不必生成補丁 |
| configurations        | []string                                                                                                     | 列表中每個條目都應能解析為一個包含 [Kustomize 轉換器配置](https://github.com/kubernetes-sigs/kustomize/tree/master/examples/transformerconfigs) 的檔案 |
| crds                  | []string                                                                                                     | 列表中每個條目都應能夠解析為 Kubernetes 類別的 OpenAPI 定義檔案 |

## {{% heading "whatsnext" %}}

<!--
* [Kustomize](https://github.com/kubernetes-sigs/kustomize)
* [Kubectl Book](https://kubectl.docs.kubernetes.io)
* [Kubectl Command Reference](/docs/reference/generated/kubectl/kubectl-commands/)
* [Kubernetes API Reference](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
-->
* [Kustomize](https://github.com/kubernetes-sigs/kustomize)
* [Kubectl Book](https://kubectl.docs.kubernetes.io)
* [Kubectl 命令參考](/docs/reference/generated/kubectl/kubectl-commands/)
* [Kubernetes API 參考](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)

