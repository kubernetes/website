---
title: 手動輪換 CA 證書
content_type: task
---
<!--
title: Manual Rotation of CA Certificates
content_type: task
-->

<!-- overview -->

<!--
This page shows how to manually rotate the certificate authority (CA) certificates.
-->
本頁展示如何手動輪換證書機構（CA）證書。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
- For more information about authentication in Kubernetes, see
  [Authenticating](/docs/reference/access-authn-authz/authentication).
- For more information about best practices for CA certificates, see
  [Single root CA](/docs/setup/best-practices/certificates/#single-root-ca).
-->
- 要了解 Kubernetes 中用戶認證的更多信息，參閱
  [認證](/zh-cn/docs/reference/access-authn-authz/authentication)；
- 要了解與 CA 證書最佳實踐有關的更多信息，
  參閱[單根 CA](/zh-cn/docs/setup/best-practices/certificates/#single-root-ca)。

<!-- steps -->

<!--
## Rotate the CA certificates manually
-->
## 手動輪換 CA 證書  {#rotate-the-ca-certificates-manually}

{{< caution >}}
<!--
Make sure to back up your certificate directory along with configuration files and any other necessary files.

This approach assumes operation of the Kubernetes control plane in a HA configuration with multiple API servers.
Graceful termination of the API server is also assumed so clients can cleanly disconnect from one API server and reconnect to another.

Configurations with a single API server will experience unavailability while the API server is being restarted.
-->
確保備份你的證書目錄、配置文件以及其他必要文件。

這裏的方法假定 Kubernetes 的控制面通過運行多個 API 服務器以高可用配置模式運行。
另一假定是 API 服務器可體面地終止，因而客戶端可以徹底地與一個 API 服務器斷開
連接並連接到另一個 API 服務器。

如果集羣中只有一個 API 服務器，則在 API 服務器重啓期間會經歷服務中斷期。
{{< /caution >}}

<!--
1. Distribute the new CA certificates and private keys (for example: `ca.crt`, `ca.key`, `front-proxy-ca.crt`,
   and `front-proxy-ca.key`) to all your control plane nodes in the Kubernetes certificates directory.
-->
1. 將新的 CA 證書和私鑰（例如：`ca.crt`、`ca.key`、`front-proxy-ca.crt` 和
   `front-proxy-client.key`）分發到所有控制面節點，放在其 Kubernetes 證書目錄下。

<!--
1. Update the `--root-ca-file` flag for the {{< glossary_tooltip term_id="kube-controller-manager" >}} to include
   both old and new CA, then restart the kube-controller-manager.

   Any {{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}} created after this point will get
   Secrets that include both old and new CAs.
-->
2. 更新 {{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}}
   的 `--root-ca-file` 標誌，使之同時包含老的和新的 CA，之後重啓
   kube-controller-manager。

   自此刻起，所創建的所有{{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}}
   都會獲得同時包含老的 CA 和新的 CA 的 Secret。

   {{< note >}}
   <!--
   The files specified by the kube-controller-manager flags `--client-ca-file` and `--cluster-signing-cert-file`
   cannot be CA bundles. If these flags and `--root-ca-file` point to the same `ca.crt` file which is now a
   bundle (includes both old and new CA) you will face an error. To workaround this problem you can copy the new CA
   to a separate file and make the flags `--client-ca-file` and `--cluster-signing-cert-file` point to the copy.
   Once `ca.crt` is no longer a bundle you can restore the problem flags to point to `ca.crt` and delete the copy.
   -->
   kube-controller-manager 標誌 `--client-ca-file` 和 `--cluster-signing-cert-file`
   所引用的文件不能是 CA 證書包。如果這些標誌和 `--root-ca-file` 指向同一個 `ca.crt` 包文件
   （包含老的和新的 CA 證書），你將會收到出錯信息。
   要解決這個問題，可以將新的 CA 證書複製到單獨的文件中，並將 `--client-ca-file` 和
   `--cluster-signing-cert-file` 標誌指向該副本。一旦 `ca.crt` 不再是證書包文件，
   就可以恢復有問題的標誌指向  `ca.crt` 並刪除該副本。

   <!--
   [Issue 1350](https://github.com/kubernetes/kubeadm/issues/1350) for kubeadm tracks an bug with the
   kube-controller-manager being unable to accept a CA bundle.
   -->
   kubeadm 的 [Issue 1350](https://github.com/kubernetes/kubeadm/issues/1350)
   在跟蹤一個導致 kube-controller-manager 無法接收 CA 證書包的問題。
   {{< /note >}}

<!--
1. Wait for the controller manager to update `ca.crt` in the service account Secrets to include both old and new CA certificates.

If any Pods are started before new CA is used by API servers, the new Pods get this update and will trust both old and new CAs.
-->
3. 等待該控制器管理器更新服務賬號 Secret 中的 `ca.crt`，使之同時包含老的和新的 CA 證書。

   如果在 API 服務器使用新的 CA 之前啓動了新的 Pod，這些新的 Pod
   也會獲得此更新並且同時信任老的和新的 CA 證書。

<!--
1. Restart all pods using in-cluster configurations (for example: kube-proxy, CoreDNS, etc) so they can use the
   updated certificate authority data from Secrets that link to ServiceAccounts.

   * Make sure CoreDNS, kube-proxy and other Pods using in-cluster configurations are working as expected.

1. Append the both old and new CA to the file against `--client-ca-file` and `--kubelet-certificate-authority`
   flag in the `kube-apiserver` configuration.

1. Append the both old and new CA to the file against `--client-ca-file` flag in the `kube-scheduler` configuration.
-->
4. 重啓所有使用集羣內配置的 Pod（例如：kube-proxy、CoreDNS 等），以便這些 Pod
   能夠使用與 ServiceAccount 相關聯的 Secret 中的、已更新的證書機構數據。

   * 確保 CoreDNS、kube-proxy 和其他使用集羣內配置的 Pod 都正按預期方式工作。

5. 將老的和新的 CA 都追加到 `kube-apiserver` 配置的 `--client-ca-file` 和
   `--kubelet-certificate-authority` 標誌所指的文件。

6. 將老的和新的 CA 都追加到 `kube-scheduler` 配置的 `--client-ca-file` 標誌所指的文件。

<!--
1. Update certificates for user accounts by replacing the content of `client-certificate-data` and `client-key-data` respectively.

   For information about creating certificates for individual user accounts, see
   [Configure certificates for user accounts](/docs/setup/best-practices/certificates/#configure-certificates-for-user-accounts).

   Additionally, update the `certificate-authority-data` section in the kubeconfig files,
   respectively with Base64-encoded old and new certificate authority data
-->
7. 通過替換 `client-certificate-data` 和 `client-key-data` 中的內容，更新用戶賬號的證書。

   有關爲獨立用戶賬號創建證書的更多信息，可參閱
   [爲用戶帳號配置證書](/zh-cn/docs/setup/best-practices/certificates/#configure-certificates-for-user-accounts)。

   另外，還要更新 kubeconfig 文件中的 `certificate-authority-data` 節，
   使之包含 Base64 編碼的老的和新的證書機構數據。

<!--
1. Update the `--root-ca-file` flag for the {{< glossary_tooltip term_id="cloud-controller-manager" >}} to include
   both old and new CA, then restart the cloud-controller-manager.
-->
8. 更新 {{< glossary_tooltip term_id="cloud-controller-manager" >}} 的 `--root-ca-file`
   標誌值，使之同時包含老的和新的 CA，之後重新啓動 cloud-controller-manager。

   {{< note >}}
   <!--
   If your cluster does not have a cloud-controller-manager, you can skip this step.
   -->
   如果你的集羣中不包含 cloud-controller-manager，你可以略過這一步。
   {{< /note >}}

<!--
1. Follow the steps below in a rolling fashion.

   1. Restart any other
      [aggregated API servers](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) or
      webhook handlers to trust the new CA certificates.

   1. Restart the kubelet by update the file against `clientCAFile` in kubelet configuration and
      `certificate-authority-data` in `kubelet.conf` to use both the old and new CA on all nodes.

      If your kubelet is not using client certificate rotation, update `client-certificate-data` and
      `client-key-data` in `kubelet.conf` on all nodes along with the kubelet client certificate file
      usually found in `/var/lib/kubelet/pki`.
-->
9. 遵循下列步驟執行滾動更新

   1. 重新啓動所有其他[被聚合的 API 服務器](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
      或者 Webhook 處理程序，使之信任新的 CA 證書。

   2. 在所有節點上更新 kubelet 配置中的 `clientCAFile` 所指文件以及 `kubelet.conf` 中的
      `certificate-authority-data` 並重啓 kubelet 以同時使用老的和新的 CA 證書。

      如果你的 kubelet 並未使用客戶端證書輪換，則在所有節點上更新 `kubelet.conf` 中
      `client-certificate-data` 和 `client-key-data` 以及 kubelet
      客戶端證書文件（通常位於 `/var/lib/kubelet/pki` 目錄下）

   <!--
   1. Restart API servers with the certificates (`apiserver.crt`, `apiserver-kubelet-client.crt` and
      `front-proxy-client.crt`) signed by new CA.
      You can use the existing private keys or new private keys.
      If you changed the private keys then update these in the Kubernetes certificates directory as well.
   -->
   3. 使用用新的 CA 簽名的證書
       （`apiserver.crt`、`apiserver-kubelet-client.crt` 和 `front-proxy-client.crt`）
      來重啓 API 服務器。
      你可以使用現有的私鑰，也可以使用新的私鑰。
      如果你改變了私鑰，則要將更新的私鑰也放到 Kubernetes 證書目錄下。

      <!--
      Since the Pods in your cluster trust both old and new CAs, there will be a momentarily disconnection
      after which pods' Kubernetes clients reconnect to the new API server.
      The new API server uses a certificate signed by the new CA.
      -->
      由於集羣中的 Pod 既信任老的 CA 也信任新的 CA，Pod 中的客戶端會經歷短暫的連接斷開狀態，
      之後再使用新的 CA 所簽名的證書連接到新的 API 服務器。

      <!--
      * Restart the {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}} to use and
        trust the new CAs.
      * Make sure control plane components logs no TLS errors.
      -->
      * 重啓 {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}} 以使用並信任新的
        CA 證書。
      * 確保控制面組件的日誌中沒有 TLS 相關的錯誤信息。

      {{< note >}}
      <!--
      To generate certificates and private keys for your cluster using the `openssl` command line tool,
      see [Certificates (`openssl`)](/docs/tasks/administer-cluster/certificates/#openssl).
      You can also use [`cfssl`](/docs/tasks/administer-cluster/certificates/#cfssl).
      -->
      要使用 `openssl` 命令行爲集羣生成新的證書和私鑰，可參閱
      [證書（`openssl`）](/zh-cn/docs/tasks/administer-cluster/certificates/#openssl)。
      你也可以使用[`cfssl`](/zh-cn/docs/tasks/administer-cluster/certificates/#cfssl).
      {{< /note >}}

   <!--
   1. Annotate any DaemonSets and Deployments to trigger pod replacement in a safer rolling fashion.
   -->
   4. 爲 Daemonset 和 Deployment 添加註解，從而觸發較安全的滾動更新，替換 Pod。

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

      {{< note >}}
      <!--
      To limit the number of concurrent disruptions that your application experiences,
      see [configure pod disruption budget](/docs/tasks/run-application/configure-pdb/).
      -->
      要限制應用可能受到的併發干擾數量，
      可以參閱[配置 Pod 干擾預算](/zh-cn/docs/tasks/run-application/configure-pdb/)。
      {{< /note >}}

      <!--
      Depending on how you use StatefulSets you may also need to perform similar rolling replacement.
      -->
      取決於你在如何使用 StatefulSet，你可能需要對其執行類似的滾動替換操作。

<!--
1. If your cluster is using bootstrap tokens to join nodes, update the ConfigMap `cluster-info` in the `kube-public`
   namespace with new CA.
-->
10. 如果你的集羣使用啓動引導令牌來添加節點，則需要更新 `kube-public` 名字空間下的
    ConfigMap `cluster-info`，使之包含新的 CA 證書。

    ```shell
    base64_encoded_ca="$(base64 -w0 /etc/kubernetes/pki/ca.crt)"

    kubectl get cm/cluster-info --namespace kube-public -o yaml | \
       /bin/sed "s/\(certificate-authority-data:\).*/\1 ${base64_encoded_ca}/" | \
       kubectl apply -f -
    ```
<!--
1. Verify the cluster functionality.

   1. Check the logs from control plane components, along with the kubelet and the kube-proxy.
       Ensure those components are not reporting any TLS errors; see
       [looking at the logs](/docs/tasks/debug/debug-cluster/#looking-at-logs) for more details.

   1. Validate logs from any aggregated api servers and pods using in-cluster config.
-->
11. 驗證集羣的功能正常。

    1. 檢查控制面組件以及 `kubelet` 和 `kube-proxy` 的日誌，確保其中沒有拋出 TLS 錯誤，
       參閱[查看日誌](/zh-cn/docs/tasks/debug/debug-cluster/#looking-at-logs)。

    2. 驗證被聚合的 API 服務器的日誌，以及所有使用集羣內配置的 Pod 的日誌。

<!--
1. Once the cluster functionality is successfully verified:

   1. Update all service account tokens to include new CA certificate only.

      * All pods using an in-cluster kubeconfig will eventually need to be restarted to pick up the new Secret,
        so that no Pods are relying on the old cluster CA.

   1. Restart the control plane components by removing the old CA from the kubeconfig files and the files against `--client-ca-file`, `--root-ca-file` flags resp.

   1. On each node, restart the kubelet by removing the old CA from file against the `clientCAFile` flag
      and from the kubelet kubeconfig file. You should carry this out as a rolling update.

      If your cluster lets you make this change, you can also roll it out by replacing nodes rather than
      reconfiguring them.
-->
12. 完成集羣功能的檢查之後：

    1. 更新所有的服務賬號令牌，使之僅包含新的 CA 證書。

       * 使用集羣內 kubeconfig 的 Pod 最終也需要被重啓，以獲得新的服務賬號 Secret
         數據，這樣就不會有 Pod 再依賴老的集羣 CA。

    1. 從 kubeconfig 文件和 `--client-ca-file` 以及 `--root-ca-file` 標誌所指向的文件
       中去除老的 CA 數據，之後重啓控制面組件。

    1. 在每個節點上，移除 `clientCAFile` 標誌所指向的文件，以刪除老的 CA 數據，並從
       kubelet kubeconfig 文件中去掉老的 CA，重啓 kubelet。
       你應該用滾動更新的方式來執行這一步驟的操作。

       如果你的集羣允許你執行這一變更，你也可以通過替換節點而不是重新配置節點的方式來將其上線。


