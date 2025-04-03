---
title: Cài đặt và cấu hình kubectl trên Linux
content_type: task
weight: 10
---

## {{% heading "prerequisites" %}}

Bạn cần sử dụng phiên bản kubectl có chênh lệch không quá một phiên bản phụ (minor) so với Kubernetes cluster của bạn.
Ví dụ: Một kubectl phiên bản v{{< skew currentVersion >}} có thể tương tác với các control plane phiên bản v{{< skew currentVersionAddMinor -1 >}}, v{{< skew currentVersionAddMinor 0 >}} và v{{< skew currentVersionAddMinor 1 >}}.
Việc sử dụng kubectl với phiên bản mới nhất và chênh lệch không quá một phiên bản phụ sẽ giúp tránh các sự cố ngoài dự kiến.

## Cài đặt kubectl trên Linux

Bạn có thể cài đặt kubectl trên Linux bằng các phương pháp sau:

- [Cài đặt tệp binary kubectl bằng curl trên Linux](#install-kubectl-binary-with-curl-on-linux)
- [Cài đặt bằng trình quản lý gói của hệ điều hành](#install-using-native-package-management)
- [Cài đặt bằng các trình quản lý gói khác](#install-using-other-package-management)

### <a id="install-kubectl-binary-with-curl-on-linux"></a>Cài đặt tệp binary kubectl bằng curl trên Linux

1. Tải xuống phiên bản mới nhất bằng lệnh:

   {{< tabs name="download_binary_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl"
   {{< /tab >}}
   {{< /tabs >}}

   {{< note >}}
   Để tải một phiên bản cụ thể, hãy thay thế phiên bản cụ thể vào câu lệnh sau `$(curl -L -s https://dl.k8s.io/release/stable.txt)`.

   Ví dụ, để tải phiên bản {{< skew currentPatchVersion >}} với Linux x86-64, gõ:

   ```bash
   curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/linux/amd64/kubectl
   ```

   Đối với Linux ARM64:

   ```bash
   curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/linux/arm64/kubectl
   ```
   {{< /note >}}

1. Xác minh tệp binary (bước này không bắt buộc)

   Tải xuống tệp checksum của kubectl:

   {{< tabs name="download_checksum_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl.sha256"
   {{< /tab >}}
   {{< /tabs >}}

   Xác minh tệp binary kubectl với tệp checksum:

   ```bash
   echo "$(cat kubectl.sha256)  kubectl" | sha256sum --check
   ```

   Nếu hợp lệ, kết quả sẽ là:

   ```
   kubectl: OK
   ```

   Nếu việc kiểm tra thất bại, bạn sẽ nhận được thông báo:

   ```
   kubectl: FAILED
   sha256sum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   Bạn cần phải tải tệp binary và checksum cùng một phiên bản.
   {{< /note >}}

1. Cài đặt kubectl

   ```bash
   sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
   ```

   {{< note >}}
   Nếu bạn không có quyền root, bạn có thể cài kubectl vào thư mục `~/.local/bin`:

   ```bash
   chmod +x kubectl
   mkdir -p ~/.local/bin
   mv ./kubectl ~/.local/bin/kubectl
   # Thêm ~/.local/bin vào $PATH
   ```

   {{< /note >}}

1. Kiểm tra phiên bản đã cài đặt:

   ```bash
   kubectl version --client
   ```

   Hoặc để xem chi tiết hơn:

   ```bash
   kubectl version --client --output=yaml
   ```

### Cài đặt bằng trình quản lý gói của hệ điều hành

{{< tabs name="kubectl_install" >}}
{{% tab name="Dùng APT (Debian/Ubuntu)" %}}

1. Cập nhật `apt` và cài các gói cần thiết:

```bash
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg
```

2. Thêm khóa xác thực của Kubernetes:

```bash
sudo mkdir -p -m 755 /etc/apt/keyrings
curl -fsSL https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
sudo chmod 644 /etc/apt/keyrings/kubernetes-apt-keyring.gpg
```

3. Thêm repository Kubernetes vào APT:

```bash
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo chmod 644 /etc/apt/sources.list.d/kubernetes.list
```

4. Cài đặt kubectl:

```bash
sudo apt-get update
sudo apt-get install -y kubectl
```

{{% /tab %}}

{{% tab name="Dùng YUM (Red Hat/CentOS)" %}}

1. Thêm repository Kubernetes vào YUM:

   ```bash
   cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   EOF
   ```

2. Cài kubectl bằng YUM:

   ```bash
   sudo yum install -y kubectl
   ```

{{% /tab %}}

{{% tab name="Dùng Zypper (SUSE)" %}}

1. Thêm repository Kubernetes vào Zypper:

   ```bash
   cat <<EOF | sudo tee /etc/zypp/repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   EOF
   ```

2. Cập nhật Zypper:
   
   ```bash
   sudo zypper update
   ```

   When this message appears, press 't' or 'a':

   ```
   New repository or package signing key received:

   Repository:       Kubernetes
   Key Fingerprint:  1111 2222 3333 4444 5555 6666 7777 8888 9999 AAAA
   Key Name:         isv:kubernetes OBS Project <isv:kubernetes@build.opensuse.org>
   Key Algorithm:    RSA 2048
   Key Created:      Thu 25 Aug 2022 01:21:11 PM -03
   Key Expires:      Sat 02 Nov 2024 01:21:11 PM -03 (expires in 85 days)
   Rpm Name:         gpg-pubkey-9a296436-6307a177

   Note: Signing data enables the recipient to verify that no modifications occurred after the data
   were signed. Accepting data with no, wrong or unknown signature can lead to a corrupted system
   and in extreme cases even to a system compromise.

   Note: A GPG pubkey is clearly identified by its fingerprint. Do not rely on the key's name. If
   you are not sure whether the presented key is authentic, ask the repository provider or check
   their web site. Many providers maintain a web page showing the fingerprints of the GPG keys they
   are using.

   Do you want to reject the key, trust temporarily, or trust always? [r/t/a/?] (r): a
   ```

   <!-- (Xác nhận khóa khi được hỏi: nhấn `a`) -->

3. Cài kubectl bằng Zypper:

   ```bash
   sudo zypper install -y kubectl
   ```

{{% /tab %}}
{{< /tabs >}}

### Cài đặt bằng các trình quản lý gói khác

{{< tabs name="other_kubectl_install" >}}
{{% tab name="Snap" %}}
If you are on Ubuntu or another Linux distribution that supports the
[snap](https://snapcraft.io/docs/core/install) package manager, kubectl
is available as a [snap](https://snapcraft.io/) application.

```bash
snap install kubectl --classic
kubectl version --client
```

{{% /tab %}}
{{% tab name="Homebrew" %}}

```bash
brew install kubectl
kubectl version --client
```

{{% /tab %}}

{{< /tabs >}}

## Xác minh cấu hình kubectl

{{< include "included/verify-kubectl.md" >}}

## Các cấu hình và plugin tùy chọn của kubectl

### Bật tự động hoàn tất trong shell

kubectl hỗ trợ Bash, Zsh, Fish và PowerShell. Xem hướng dẫn đầy đủ:

{{< tabs name="kubectl_autocompletion" >}}
{{< tab name="Bash" include="included/optional-kubectl-configs-bash-linux.md" />}}
{{< tab name="Fish" include="included/optional-kubectl-configs-fish.md" />}}
{{< tab name="Zsh" include="included/optional-kubectl-configs-zsh.md" />}}
{{< /tabs >}}

### Cài đặt plugin `kubectl convert`

{{< include "included/kubectl-convert-overview.md" >}}

1. Tải xuống binary mới nhất:

   {{< tabs name="download_convert_binary_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl-convert"
   {{< /tab >}}
   {{< /tabs >}}

   Validate the kubectl-convert binary against the checksum file:

   ```bash
   echo "$(cat kubectl-convert.sha256) kubectl-convert" | sha256sum --check
   ```

   If valid, the output is:

   ```console
   kubectl-convert: OK
   ```

   If the check fails, `sha256` exits with nonzero status and prints output similar to:

   ```console
   kubectl-convert: FAILED
   sha256sum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   Download the same version of the binary and checksum.
   {{< /note >}}

1. Cài đặt plugin kubectl-convert:

   ```bash
   sudo install -o root -g root -m 0755 kubectl-convert /usr/local/bin/kubectl-convert
   ```

1. Xác minh plugin đã cài thành công:

   ```bash
   kubectl convert --help
   ```

1. Dọn các tệp cài đặt sau khi hoàn tất:

   ```bash
   rm kubectl-convert kubectl-convert.sha256
   ```

## {{% heading "whatsnext" %}}

Xem thêm tại [Bước tiếp theo](included/kubectl-whats-next.md).
