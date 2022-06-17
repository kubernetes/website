---
title: 手動輪換 CA 證書
min-kubernetes-server-version: v1.13
content_type: task
---
<!--
title: Manual Rotation of CA Certificates
min-kubernetes-server-version: v1.13
content_type: task
-->
<!-- overview -->

<!--
This page shows how to manually rotate the certificate authority (CA) certificates.
-->
本頁展示如何手動輪換證書機構（CA）證書。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
- For more information about authentication in Kubernetes, see [Authenticating](/docs/reference/access-authn-authz/authentication).
- For more information about best practices for CA certificates, see [Single root CA](/docs/setup/best-practices/certificates/#single-root-ca).
-->
- 要了解 Kubernetes 中使用者認證的更多資訊，參閱
  [認證](/zh-cn/docs/reference/access-authn-authz/authentication)；
- 要了解與 CA 證書最佳實踐有關的更多資訊，參閱[單根 CA](/zh-cn/docs/setup/best-practices/certificates/#single-root-ca)。

<!-- steps -->

<!--
## Rotate the CA certificates manually
-->
## 手動輪換 CA 證書  {#rotate-the-ca-certificates-manually}

<!--
Make sure to back up your certificate directory along with configuration files and any other necessary files.

This approach assumes operation of the Kubernetes control plane in a HA configuration with multiple API servers.
Graceful termination of the API server is also assumed so clients can cleanly disconnect from one API server and reconnect to another.

Configurations with a single API server will experience unavailability while the API server is being restarted.
-->
{{< caution >}}
確保備份你的證書目錄、配置檔案以及其他必要檔案。

這裡的方法假定 Kubernetes 的控制面透過執行多個 API 伺服器以高可用配置模式執行。
另一假定是 API 伺服器可體面地終止，因而客戶端可以徹底地與一個 API 伺服器斷開
連線並連線到另一個 API 伺服器。

如果叢集中只有一個 API 伺服器，則在 API 伺服器重啟期間會經歷服務中斷期。
{{< /caution >}}

<!--
1. Distribute the new CA certificates and private keys
   (ex: `ca.crt`, `ca.key`, `front-proxy-ca.crt`, and `front-proxy-ca.key`)
   to all your control plane nodes in the Kubernetes certificates directory.
-->
1. 將新的 CA 證書和私鑰（例如：`ca.crt`、`ca.key`、`front-proxy-ca.crt` 和
   `front-proxy-client.key`）分發到所有控制面節點，放在其 Kubernetes 證書目錄下。

<!--
1. Update {{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}}'s `--root-ca-file` to
   include both old and new CA. Then restart the component.

   Any service account created after this point will get secrets that include both old and new CAs.
   
   {{< note >}}
   The files specified by the kube-controller-manager flags `--client-ca-file` and `--cluster-signing-cert-file`
   cannot be CA bundles. If these flags and `--root-ca-file` point to the same `ca.crt` file which is now a
   bundle (includes both old and new CA) you will face an error. To workaround this problem you can copy the new CA to a separate
   file and make the flags `--client-ca-file` and `--cluster-signing-cert-file` point to the copy. Once `ca.crt` is no longer
   a bundle you can restore the problem flags to point to `ca.crt` and delete the copy.
   {{< /note >}}
-->
2. 更新 {{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}} 的
   `--root-ca-file` 標誌，使之同時包含老的和新的 CA，之後重啟元件。

   自此刻起，所建立的所有服務賬號都會獲得同時包含老的 CA 和新的 CA 的 Secret。

   {{< note >}}
   kube-controller-manager 標誌 `--client-ca-file` 和 `--cluster-signing-cert-file` 所引用的檔案
   不能是 CA 證書包。如果這些標誌和 `--root-ca-file` 指向同一個 `ca.crt` 包檔案（包含老的和新的 CA 證書），
   你將會收到出錯資訊。
   要解決這個問題，可以將新的 CA 證書複製到單獨的檔案中，並將 `--client-ca-file` 和 `--cluster-signing-cert-file` 
   標誌指向該副本。一旦 `ca.crt` 不再是證書包檔案，就可以恢復有問題的標誌指向  `ca.crt` 並刪除該副本。
   {{< /note >}}

<!--
   1. Update all service account tokens to include both old and new CA certificates.

   If any pods are started before new CA is used by API servers, they will get this update and trust both old and new CAs.
-->
3. 更新所有服務賬號令牌，使之同時包含老的和新的 CA 證書。

   如果在 API 伺服器使用新的 CA 之前啟動了新的 Pod，這些 Pod
   也會獲得此更新並且同時信任老的和新的 CA 證書。
   <!--
   ```shell
   base64_encoded_ca="$(base64 -w0 <path to file containing both old and new CAs>)"

   for namespace in $(kubectl get ns --no-headers | awk '{print $1}'); do
       for token in $(kubectl get secrets --namespace "$namespace" --field-selector type=kubernetes.io/service-account-token -o name); do
           kubectl get $token --namespace "$namespace" -o yaml | \
             /bin/sed "s/\(ca.crt:\).*/\1 ${base64_encoded_ca}/" | \
             kubectl apply -f -
       done
   done
   ```
   -->

   ```shell
   base64_encoded_ca="$(base64 -w0 <path to file containing both old and new CAs>)"

   for namespace in $(kubectl get ns --no-headers | awk '{print $1}'); do
       for token in $(kubectl get secrets --namespace "$namespace" --field-selector type=kubernetes.io/service-account-token -o name); do
           kubectl get $token --namespace "$namespace" -o yaml | \
             /bin/sed "s/\(ca.crt:\).*/\1 ${base64_encoded_ca}/" | \
             kubectl apply -f -
       done
   done
   ```
<!--
1. Restart all pods using in-cluster configs (ex: kube-proxy, coredns, etc) so they can use the updated certificate authority data from *ServiceAccount* secrets.

   * Make sure coredns, kube-proxy and other pods using in-cluster configs are working as expected.

1. Append the both old and new CA to the file against `-client-ca-file` and `-kubelet-certificate-authority` flag in the `kube-apiserver` configuration.

1. Append the both old and new CA to the file against `-client-ca-file` flag in the `kube-scheduler` configuration.
-->
4. 重啟所有使用叢集內配置的 Pods（例如：`kube-proxy`、`coredns` 等），以便這些 Pod 能夠使用
   來自 *ServiceAccount* Secret 中的、已更新的證書機構資料。

   * 確保 `coredns`、`kube-proxy` 和其他使用叢集內配置的 Pod 都正按預期方式工作。

5. 將老的和新的 CA 都追加到 `kube-apiserver` 配置的 `--client-ca-file` 和 `--kubelet-certificate-authority` 標誌所指的檔案。

6. 將老的和新的 CA 都追加到 `kube-scheduler` 配置的 `--client-ca-file` 標誌所指的檔案。

<!--
1. Update certificates for user accounts by replacing the content of `client-certificate-data` and `client-key-data` respectively.

   For information about creating certificates for individual user accounts, see
   [Configure certificates for user accounts](/docs/setup/best-practices/certificates/#configure-certificates-for-user-accounts).

   Additionally, update the `certificate-authority-data` section in the kubeconfig files,
   respectively with Base64-encoded old and new certificate authority data
-->
7. 透過替換 `client-certificate-data` 和 `client-key-data`
   中的內容，更新使用者賬號的證書。

   有關為獨立使用者賬號建立證書的更多資訊，可參閱
   [為使用者帳號配置證書](/zh-cn/docs/setup/best-practices/certificates/#configure-certificates-for-user-accounts)。

   另外，還要更新 kubeconfig 檔案中的 `certificate-authority-data`
   節，使之包含 Base64 編碼的老的和新的證書機構資料。
<!--
1. Follow below steps in a rolling fashion.

   1. Restart any other *[aggregated api servers](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)*
      or *webhook handlers* to trust the new CA certificates.

   1. Restart the kubelet by update the file against `clientCAFile` in kubelet configuration and
      `certificate-authority-data` in kubelet.conf to use both the old and new CA on all nodes.

      If your kubelet is not using client certificate rotation update `client-certificate-data` and
      `client-key-data` in kubelet.conf on all nodes along with the kubelet client certificate file
      usually found in `/var/lib/kubelet/pki`.
-->
8. 遵循下列步驟執行滾動更新

   1. 重新啟動所有其他 *[被聚合的 API 伺服器](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)*
      或者 *Webhook 處理程式*，使之信任新的 CA 證書。

   2. 在所有節點上更新 kubelet 配置中的 `clientCAFile` 所指檔案以及 kubelet.conf 中的
      `certificate-authority-data` 並重啟 kubelet 以同時使用老的和新的 CA 證書。

      如果你的 kubelet 並未使用客戶端證書輪換，則在所有節點上更新 kubelet.conf 中
      `client-certificate-data` 和 `client-key-data` 以及 kubelet
      客戶端證書檔案（通常位於 `/var/lib/kubelet/pki` 目錄下）

   <!--
   1. Restart API servers with the certificates (`apiserver.crt`, `apiserver-kubelet-client.crt` and
      `front-proxy-client.crt`) signed by new CA.
      You can use the existing private keys or new private keys.
      If you changed the private keys then update these in the Kubernetes certificates directory as well.
   -->
   3. 使用用新的 CA 簽名的證書
       （`apiserver.crt`、`apiserver-kubelet-client.crt` 和 `front-proxy-client.crt`）
      來重啟 API 伺服器。
      你可以使用現有的私鑰，也可以使用新的私鑰。
      如果你改變了私鑰，則要將更新的私鑰也放到 Kubernetes 證書目錄下。

      由於 Pod 既信任老的 CA 也信任新的 CA，Pod 中的客戶端會經歷短暫的連線斷開狀態，
      之後再連線到使用新的 CA 所簽名的證書的新的 API 伺服器。

      <!--
      * Restart Scheduler to use the new CAs.
      * Make sure control plane components logs no TLS errors.
      -->
      * 重啟排程器以使用新的 CA 證書。
      * 確保控制面元件的日誌中沒有 TLS 相關的錯誤資訊。

      <!--
      To generate certificates and private keys for your cluster using the `openssl`
      command line tool, see [Certificates (`openssl`)](/docs/tasks/administer-cluster/certificates/#openssl).
      You can also use [`cfssl`](/docs/tasks/administer-cluster/certificates/#cfssl).
      -->
      {{< note >}}
      要使用 `openssl` 命令列為叢集生成新的證書和私鑰，可參閱
      [證書（`openssl`）](/zh-cn/docs/tasks/administer-cluster/certificates/#openssl)。
      你也可以使用[`cfssl`](/zh-cn/docs/tasks/administer-cluster/certificates/#cfssl).
      {{< /note >}}

   <!--
   1. Annotate any Daemonsets and Deployments to trigger pod replacement in a safer rolling fashion.

      Example:
   -->
   4. 為 Daemonset 和 Deployment 添加註解，從而觸發較安全的滾動更新，替換 Pod。

      示例：

      ```shell
      for namespace in $(kubectl get namespace -o jsonpath='{.items[*].metadata.name}'); do
          for name in $(kubectl get deployments -n $namespace -o jsonpath='{.items[*].metadata.name}'); do
              kubectl patch deployment -n ${namespace} ${name} -p '{"spec":{"template":{"metadata":{"annotations":{"ca-rotation": "1"}}}}}';
          done
          for name in $(kubectl get daemonset -n $namespace -o jsonpath='{.items[*].metadata.name}'); do
              kubectl patch daemonset -n ${namespace} ${name} -p '{"spec":{"template":{"metadata":{"annotations":{"ca-rotation": "1"}}}}}';
          done
      done
      ```

      <!--
      To limit the number of concurrent disruptions that your application experiences,
      see [configure pod disruption budget](/docs/tasks/run-application/configure-pdb/).
      -->
      {{< note >}}
      要限制應用可能受到的併發干擾數量，可以參閱
      [配置 Pod 干擾預算](/zh-cn/docs/tasks/run-application/configure-pdb/).
      {{< /note >}}
<!--
1. If your cluster is using bootstrap tokens to join nodes, update the ConfigMap `cluster-info` in the `kube-public` namespace with new CA.
-->
9. 如果你的叢集使用啟動引導令牌來新增節點，則需要更新 `kube-public` 名字空間下的
   ConfigMap `cluster-info`，使之包含新的 CA 證書。

   ```shell
   base64_encoded_ca="$(base64 -w0 /etc/kubernetes/pki/ca.crt)"

   kubectl get cm/cluster-info --namespace kube-public -o yaml | \
       /bin/sed "s/\(certificate-authority-data:\).*/\1 ${base64_encoded_ca}/" | \
       kubectl apply -f -
   ```
<!--
1. Verify the cluster functionality.

   1. Validate the logs from control plane components, along with the kubelet and the
      kube-proxy are not throwing any tls errors, see
       [looking at the logs](/docs/tasks/debug/debug-cluster/#looking-at-logs).

   1. Validate logs from any aggregated api servers and pods using in-cluster config.
-->
10. 驗證叢集的功能正常

    1. 驗證控制面元件的日誌，以及 `kubelet` 和 `kube-proxy` 的日誌，確保其中沒有
       丟擲 TLS 錯誤，參閱
       [檢視日誌](/zh-cn/docs/tasks/debug/debug-cluster/#looking-at-logs).

    2. 驗證被聚合的 API 伺服器的日誌，以及所有使用叢集內配置的 Pod 的日誌。

<!--
1. Once the cluster functionality is successfully verified:

   1. Update all service account tokens to include new CA certificate only.

      * All pods using an in-cluster kubeconfig will eventually need to be restarted to pick up the new SA secret for the old CA to be completely untrusted.

   1. Restart the control plane components by removing the old CA from the kubeconfig files and the files against `--client-ca-file`, `--root-ca-file` flags resp.

   1. Restart kubelet by removing the old CA from file against the `clientCAFile` flag and kubelet kubeconfig file.
-->
11. 完成叢集功能的檢查之後：

    1. 更新所有的服務賬號令牌，使之僅包含新的 CA 證書。

       * 使用叢集內 kubeconfig 的 Pod 最終也需要被重啟，以獲得新的服務賬號 Secret
         資料，進而不再信任老的 CA 證書。

    1. 從 kubeconfig 檔案和 `--client-ca-file` 以及 `--root-ca-file` 標誌所指向的檔案
       中去除老的 CA 資料，之後重啟控制面元件。

    1. 重啟 kubelet，移除 `clientCAFile` 標誌所指向的檔案以及 kubelet kubeconfig 檔案中
       的老的 CA 資料。
