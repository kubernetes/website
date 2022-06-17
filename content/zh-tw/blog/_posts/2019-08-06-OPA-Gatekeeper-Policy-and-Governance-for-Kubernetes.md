---
layout: blog
title: "OPA Gatekeeper：Kubernetes 的策略和管理"
date: 2019-08-06
slug: OPA-Gatekeeper-Policy-and-Governance-for-Kubernetes 
---
<!--
---
layout: blog
title: "OPA Gatekeeper: Policy and Governance for Kubernetes"
date: 2019-08-06
slug: OPA-Gatekeeper-Policy-and-Governance-for-Kubernetes 
---
--->

<!--
**Authors:** Rita Zhang (Microsoft), Max Smythe (Google), Craig Hooper (Commonwealth Bank AU), Tim Hinrichs (Styra), Lachie Evenson (Microsoft), Torin Sandall (Styra)
--->
**作者：** Rita Zhang (Microsoft), Max Smythe (Google), Craig Hooper (Commonwealth Bank AU), Tim Hinrichs (Styra), Lachie Evenson (Microsoft), Torin Sandall (Styra)

<!--
The [Open Policy Agent Gatekeeper](https://github.com/open-policy-agent/gatekeeper) project can be leveraged to help enforce policies and strengthen governance in your Kubernetes environment. In this post, we will walk through the goals, history, and current state of the project.
--->
可以從專案 [Open Policy Agent Gatekeeper](https://github.com/open-policy-agent/gatekeeper) 中獲得幫助，在 Kubernetes 環境下實施策略並加強治理。在本文中，我們將逐步介紹該專案的目標，歷史和當前狀態。

<!--
The following recordings from the Kubecon EU 2019 sessions are a great starting place in working with Gatekeeper:

* [Intro: Open Policy Agent Gatekeeper](https://youtu.be/Yup1FUc2Qn0)
* [Deep Dive: Open Policy Agent](https://youtu.be/n94_FNhuzy4)
--->
以下是 Kubecon EU 2019 會議的錄音，幫助我們更好地開展與 Gatekeeper 合作：

* [簡介：開放策略代理 Gatekeeper](https://youtu.be/Yup1FUc2Qn0)
* [深入研究：開放策略代理](https://youtu.be/n94_FNhuzy4)

<!--
## Motivations 

If your organization has been operating Kubernetes, you probably have been looking for ways to control what end-users can do on the cluster and ways to ensure that clusters are in compliance with company policies. These policies may be there to meet governance and legal requirements or to enforce best practices and organizational conventions. With Kubernetes, how do you ensure compliance without sacrificing development agility and operational independence? 
--->
## 出發點 

如果您所在的組織一直在使用 Kubernetes，您可能一直在尋找如何控制終端使用者在叢集上的行為，以及如何確保叢集符合公司政策。這些策略可能需要滿足管理和法律要求，或者符合最佳執行方法和組織慣例。使用 Kubernetes，如何在不犧牲開發敏捷性和運營獨立性的前提下確保合規性？

<!--
For example, you can enforce policies like:

* All images must be from approved repositories
* All ingress hostnames must be globally unique
* All pods must have resource limits
* All namespaces must have a label that lists a point-of-contact
--->
例如，您可以執行以下策略：

* 所有映象必須來自獲得批准的儲存庫
* 所有入口主機名必須是全域性唯一的
* 所有 Pod 必須有資源限制
* 所有名稱空間都必須具有列出聯絡的標籤

<!--
Kubernetes allows decoupling policy decisions from the API server by means of [admission controller webhooks](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/) to intercept admission requests before they are persisted as objects in Kubernetes. [Gatekeeper](https://github.com/open-policy-agent/gatekeeper) was created to enable users to customize admission control via configuration, not code and to bring awareness of the cluster’s state, not just the single object under evaluation at admission time. Gatekeeper is a customizable admission webhook for Kubernetes that enforces policies executed by the [Open Policy Agent (OPA)](https://www.openpolicyagent.org), a policy engine for Cloud Native environments hosted by CNCF.
--->
在接收請求被持久化為 Kubernetes 中的物件之前，Kubernetes 允許透過 [admission controller webhooks](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/) 將策略決策與 API 伺服器分離，從而攔截這些請求。[Gatekeeper](https://github.com/open-policy-agent/gatekeeper) 建立的目的是使使用者能夠透過配置（而不是程式碼）自定義控制許可，並使使用者瞭解叢集的狀態，而不僅僅是針對評估狀態的單個物件，在這些物件准許加入的時候。Gatekeeper 是 Kubernetes 的一個可定製的許可 webhook ，它由 [Open Policy Agent (OPA)](https://www.openpolicyagent.org) 強制執行， OPA 是 Cloud Native 環境下的策略引擎，由 CNCF 主辦。

<!--
## Evolution 

Before we dive into the current state of Gatekeeper, let’s take a look at how the Gatekeeper project has evolved. 
--->
## 發展 

在深入瞭解 Gatekeeper 的當前情況之前，讓我們看一下 Gatekeeper 專案是如何發展的。

<!--
* Gatekeeper v1.0 - Uses OPA as the admission controller with the kube-mgmt sidecar enforcing configmap-based policies. It provides validating and mutating admission control. Donated by Styra. 
* Gatekeeper v2.0 - Uses Kubernetes policy controller as the admission controller with OPA and kube-mgmt sidecars enforcing configmap-based policies. It provides validating and mutating admission control and audit functionality. Donated by Microsoft. 
 * Gatekeeper v3.0 - The admission controller is integrated with the [OPA Constraint Framework](https://github.com/open-policy-agent/frameworks/tree/master/constraint) to enforce CRD-based policies and allow declaratively configured policies to be reliably shareable. Built with kubebuilder, it provides validating and, eventually, mutating (to be implemented) admission control and audit functionality. This enables the creation of policy templates for [Rego](https://www.openpolicyagent.org/docs/latest/how-do-i-write-policies/) policies, creation of policies as CRDs, and storage of audit results on policy CRDs. This project is a collaboration between Google, Microsoft, Red Hat, and Styra.
--->
* Gatekeeper v1.0 - 使用 OPA 作為帶有 kube-mgmt sidecar 的許可控制器，用來強制執行基於 configmap 的策略。這種方法實現了驗證和轉換許可控制。貢獻方：Styra
* Gatekeeper v2.0 - 使用 Kubernetes 策略控制器作為許可控制器，OPA 和 kube-mgmt sidecar 實施基於 configmap 的策略。這種方法實現了驗證和轉換准入控制和稽核功能。貢獻方：Microsoft
 * Gatekeeper v3.0 - 准入控制器與 [OPA Constraint Framework](https://github.com/open-policy-agent/frameworks/tree/master/constraint) 整合在一起，用來實施基於 CRD 的策略，並可以可靠地共享已完成宣告配置的策略。使用 kubebuilder 進行構建，實現了驗證以及最終轉換（待完成）為許可控制和稽核功能。這樣就可以為 [Rego](https://www.openpolicyagent.org/docs/latest/how-do-i-write-policies/) 策略建立策略模板，將策略建立為 CRD 並存儲稽核結果到策略 CRD 上。該專案是 Google，Microsoft，Red Hat 和 Styra 合作完成的。

![](/images/blog/2019-08-06-opa-gatekeeper/v3.png)
 
<!--
## Gatekeeper v3.0 Features 

Now let’s take a closer look at the current state of Gatekeeper and how you can leverage all the latest features. Consider an organization that wants to ensure all objects in a cluster have departmental information provided as part of the object’s labels. How can you do this with Gatekeeper?
--->
## Gatekeeper v3.0 的功能 

現在我們詳細看一下 Gatekeeper 當前的狀態，以及如何利用所有最新的功能。假設一個組織希望確保叢集中的所有物件都有 department 資訊，這些資訊是物件標籤的一部分。如何利用 Gatekeeper 完成這項需求？

<!--
### Validating Admission Control 

Once all the Gatekeeper components have been [installed](https://github.com/open-policy-agent/gatekeeper) in your cluster, the API server will trigger the Gatekeeper admission webhook to process the admission request whenever a resource in the cluster is created, updated, or deleted. 

During the validation process, Gatekeeper acts as a bridge between the API server and OPA. The API server will enforce all policies executed by OPA.
--->
### 驗證許可控制 

在叢集中所有 Gatekeeper 元件都 [安裝](https://github.com/open-policy-agent/gatekeeper) 完成之後，只要叢集中的資源進行建立、更新或刪除，API 伺服器將觸發 Gatekeeper 准入 webhook 來處理准入請求。

在驗證過程中，Gatekeeper 充當 API 伺服器和 OPA 之間的橋樑。API 伺服器將強制實施 OPA 執行的所有策略。

<!--
### Policies and Constraints 

With the integration of the OPA Constraint Framework, a Constraint is a declaration that its author wants a system to meet a given set of requirements. Each Constraint is written with Rego, a declarative query language used by OPA to enumerate instances of data that violate the expected state of the system. All Constraints are evaluated as a logical AND. If one Constraint is not satisfied, then the whole request is rejected. 
--->
### 策略與 Constraint 

結合 OPA Constraint Framework，Constraint 是一個宣告，表示作者希望系統滿足給定的一系列要求。Constraint 都使用 Rego 編寫，Rego 是宣告性查詢語言，OPA 用 Rego 來列舉違背系統預期狀態的資料例項。所有 Constraint 都遵循邏輯 AND。假使有一個 Constraint 不滿足，那麼整個請求都將被拒絕。

<!--
Before defining a Constraint, you need to create a Constraint Template that allows people to declare new Constraints. Each template describes both the Rego logic that enforces the Constraint and the schema for the Constraint, which includes the schema of the CRD and the parameters that can be passed into a Constraint, much like arguments to a function. 

For example, here is a Constraint template CRD that requires certain labels to be present on an arbitrary object. 
--->
在定義 Constraint 之前，您需要建立一個 Constraint Template，允許大家宣告新的 Constraint。每個模板都描述了強制執行 Constraint 的 Rego 邏輯和 Constraint 的模式，其中包括 CRD 的模式和傳遞到 enforces 中的引數，就像函式的引數一樣。              

例如，以下是一個 Constraint 模板 CRD，它的請求是在任意物件上顯示某些標籤。

```yaml
apiVersion: templates.gatekeeper.sh/v1beta1
kind: ConstraintTemplate
metadata:
  name: k8srequiredlabels
spec:
  crd:
    spec:
      names:
        kind: K8sRequiredLabels
        listKind: K8sRequiredLabelsList
        plural: k8srequiredlabels
        singular: k8srequiredlabels
      validation:
        # Schema for the `parameters` field
        openAPIV3Schema:
          properties:
            labels:
              type: array
              items: string
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package k8srequiredlabels

        deny[{"msg": msg, "details": {"missing_labels": missing}}] {
          provided := {label | input.review.object.metadata.labels[label]}
          required := {label | label := input.parameters.labels[_]}
          missing := required - provided
          count(missing) > 0
          msg := sprintf("you must provide labels: %v", [missing])
        }
```

<!--
Once a Constraint template has been deployed in the cluster, an admin can now create individual Constraint CRDs as defined by the Constraint template. For example, here is a Constraint CRD that requires the label `hr` to be present on all namespaces. 
--->
在叢集中部署了 Constraint 模板後，管理員現在可以建立由 Constraint 模板定義的單個 Constraint CRD。例如，這裡以下是一個 Constraint CRD，要求標籤 `hr` 出現在所有名稱空間上。

```yaml
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sRequiredLabels
metadata:
  name: ns-must-have-hr
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Namespace"]
  parameters:
    labels: ["hr"]
```

<!--
Similarly, another Constraint CRD that requires the label `finance` to be present on all namespaces can easily be created from the same Constraint template. 
--->
類似地，可以從同一個 Constraint 模板輕鬆地建立另一個 Constraint CRD，該 Constraint CRD 要求所有名稱空間上都有 `finance` 標籤。

```yaml
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sRequiredLabels
metadata:
  name: ns-must-have-finance
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Namespace"]
  parameters:
    labels: ["finance"]
```

<!--
As you can see, with the Constraint framework, we can reliably share Regos via the Constraint templates, define the scope of enforcement with the match field, and provide user-defined parameters to the Constraints to create customized behavior for each Constraint. 
--->
如您所見，使用 Constraint framework，我們可以透過 Constraint 模板可靠地共享 rego，使用匹配欄位定義執行範圍，併為 Constraint 提供使用者定義的引數，從而為每個 Constraint 建立自定義行為。

<!--
### Audit 

The audit functionality enables periodic evaluations of replicated resources against the Constraints enforced in the cluster to detect pre-existing misconfigurations. Gatekeeper stores audit results as `violations` listed in the `status` field of the relevant Constraint.  --->
### 稽核 

根據叢集中強制執行的 Constraint，稽核功能可定期評估複製的資源，並檢測先前存在的錯誤配置。Gatekeeper 將稽核結果儲存為 `violations`，在相關 Constraint 的 `status` 欄位中列出。

```yaml
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sRequiredLabels
metadata:
  name: ns-must-have-hr
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Namespace"]
  parameters:
    labels: ["hr"]
status:
  auditTimestamp: "2019-08-06T01:46:13Z"
  byPod:
  - enforced: true
    id: gatekeeper-controller-manager-0
  violations:
  - enforcementAction: deny
    kind: Namespace
    message: 'you must provide labels: {"hr"}'
    name: default
  - enforcementAction: deny
    kind: Namespace
    message: 'you must provide labels: {"hr"}'
    name: gatekeeper-system
  - enforcementAction: deny
    kind: Namespace
    message: 'you must provide labels: {"hr"}'
    name: kube-public
  - enforcementAction: deny
    kind: Namespace
    message: 'you must provide labels: {"hr"}'
    name: kube-system
```

<!--
### Data Replication 

Audit requires replication of Kubernetes resources into OPA before they can be evaluated against the enforced Constraints. Data replication is also required by Constraints that need access to objects in the cluster other than the object under evaluation. For example, a Constraint that enforces uniqueness of ingress hostname must have access to all other ingresses in the cluster. 
--->
### 資料複製 

稽核要求將 Kubernetes 複製到 OPA 中，然後才能根據強制的 Constraint 對其進行評估。資料複製同樣也需要 Constraint，這些 Constraint 需要訪問叢集中除評估物件之外的物件。例如，一個 Constraint 要強制確定入口主機名的唯一性，就必須有權訪問叢集中的所有其他入口。

<!--
To configure Kubernetes data to be replicated, create a sync config resource with the resources to be replicated into OPA. For example, the below configuration replicates all namespace and pod resources to OPA. 
--->
對 Kubernetes 資料進行復制，請使用複製到 OPA 中的資源建立 sync config 資源。例如，下面的配置將所有名稱空間和 Pod 資源複製到 OPA。

```yaml
apiVersion: config.gatekeeper.sh/v1alpha1
kind: Config
metadata:
  name: config
  namespace: "gatekeeper-system"
spec:
  sync:
    syncOnly:
      - group: ""
        version: "v1"
        kind: "Namespace"
      - group: ""
        version: "v1"
        kind: "Pod"
```

<!--
## Planned for Future 

The community behind the Gatekeeper project will be focusing on providing mutating admission control to support mutation scenarios (for example: annotate objects automatically with departmental information when creating a new resource), support external data to inject context external to the cluster into the admission decisions, support dry run to see impact of a policy on existing resources in the cluster before enforcing it, and more audit functionalities.  
--->
## 未來計劃 

Gatekeeper 專案背後的社群將專注於提供轉換許可控制，可以用來支援轉換方案（例如：在建立新資源時使用 department 資訊自動註釋物件），支援外部資料以將叢集外部環境加入到許可決策中，支援試執行以便在執行策略之前瞭解策略對叢集中現有資源的影響，還有更多的稽核功能。

<!--
If you are interested in learning more about the project, check out the [Gatekeeper](https://github.com/open-policy-agent/gatekeeper) repo. If you are interested in helping define the direction of Gatekeeper, join the [#kubernetes-policy](https://openpolicyagent.slack.com/messages/CDTN970AX) channel on OPA Slack, and join our [weekly meetings](https://docs.google.com/document/d/1A1-Q-1OMw3QODs1wT6eqfLTagcGmgzAJAjJihiO3T48/edit) to discuss development, issues, use cases, etc.  
--->
如果您有興趣瞭解更多有關該專案的資訊，請檢視 [Gatekeeper](https://github.com/open-policy-agent/gatekeeper) 儲存庫。如果您有興趣幫助確定 Gatekeeper 的方向，請加入 [#kubernetes-policy](https://openpolicyagent.slack.com/messages/CDTN970AX) OPA Slack 頻道，並加入我們的 [週會](https://docs.google.com/document/d/1A1-Q-1OMw3QODs1wT6eqfLTagcGmgzAJAjJihiO3T48/edit) 一同討論開發、任務、用例等。 
