---
title: Client Authentication (v1)
content_type: tool-reference
package: client.authentication.k8s.io/v1
auto_generated: false
---

## Типи ресурсів

- [ExecCredential](#client-authentication-k8s-io-v1-ExecCredential)

## `ExecCredential` {#client-authentication-k8s-io-v1-ExecCredential}

ExecCredential використовується втулками на основі exec для передачі облікових даних до HTTP транспортів.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>apiVersion</code><br/>string</td>
            <td><code>client.authentication.k8s.io/v1</code></td>
        </tr>
        <tr>
            <td><code>kind</code><br/>string</td>
            <td><code>ExecCredential</code></td>
        </tr>
        <tr>
            <td><code>spec</code> <b>[Обовʼязкове]</b><br/>
                <a href="#client-authentication-k8s-io-v1-ExecCredentialSpec"><code>ExecCredentialSpec</code></a>
            </td>
            <td><p>Spec містить інформацію, передану транспортом втулку.</p></td>
      </tr>
        <tr>
            <td><code>status</code><br/>
                <a href="#client-authentication-k8s-io-v1-ExecCredentialStatus"><code>ExecCredentialStatus</code></a>
            </td>
            <td><p>Status заповнюється втулоком і містить облікові дані, які транспорт повинен використовувати для контакту з API.</p></td>
        </tr>
    </tbody>
</table>

## `Cluster` {#client-authentication-k8s-io-v1-Cluster}

**Зустрічається в:**

- [ExecCredentialSpec](#client-authentication-k8s-io-v1-ExecCredentialSpec)

Cluster містить інформацію, що дозволяє exec втулку спілкуватися з кластером Kubernetes, до якого здійснюється автентифікація.

Щоб забезпечити наявність у цій структурі всього необхідного для звʼязку з кластером Kubernetes (як це робиться через kubeconfig), поля повинні відображати структуру &quot;k8s.io/client-go/tools/clientcmd/api/v1&quot;. Cluster, за винятком CertificateAuthority, оскільки дані CA завжди будуть передаватися втулку у вигляді байтів.</p>

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>server</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
          </td>
          <td><p>Server — це адреса кластера Kubernetes (https://hostname:port).</p></td>
        </tr>
        <tr>
          <td><code>tls-server-name</code><br/>
              <code>string</code>
          </td>
          <td><p>TLSServerName передається серверу для SNI і використовується у клієнті для перевірки сертифікатів сервера. Якщо ServerName порожній, використовується імʼя хоста, за яким здійснюється контакт з сервером.</p></td>
        </tr>
        <tr>
            <td><code>insecure-skip-tls-verify</code><br/>
                <code>bool</code>
            </td>
            <td><p>InsecureSkipTLSVerify пропускає перевірку дійсності сертифіката сервера. Це зробить ваші HTTPS-зʼєднання небезпечними.</p></td>
        </tr>
        <tr>
            <td><code>certificate-authority-data</code><br/>
                <code>[]byte</code>
            </td>
            <td><p>CAData містить сертифікати органів сертифікації, закодовані у форматі PEM. Якщо порожнє, слід використовувати системні корені.</p></td>
        </tr>
        <tr>
            <td><code>proxy-url</code><br/>
                <code>string</code>
            </td>
            <td><p>ProxyURL — це URL-адреса проксі-сервера, який буде використовуватися для всіх запитів до цього кластера.</p></td>
        </tr>
        <tr>
            <td><code>disable-compression</code><br/>
                <code>bool</code>
            </td>
            <td><p>DisableCompression дозволяє клієнту відмовитися від стиснення відповідей для всіх запитів до сервера. Це корисно для прискорення запитів (особливо списків), коли пропускна здатність мережі клієнт-сервер достатня, за рахунок економії часу на стиснення (на стороні сервера) і розпакування (на стороні клієнта): https://github.com/kubernetes/kubernetes/issues/112296.</p></td>
        </tr>
        <tr>
            <td><code>config</code><br/>
                <a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/runtime/#RawExtension"><code>k8s.io/apimachinery/pkg/runtime.RawExtension</code></a>
            </td>
            <td>
                <p>Config містить додаткові дані конфігурації, специфічні для exec втулка щодо кластера, до якого здійснюється автентифікація.</p>
                <p>Ці дані походять з поля extensions[client.authentication.k8s.io/exec] обʼєкта Cluster клієнтської конфігурації:</p>
                <p>clusters:</p>
                <ul>
                    <li>name: my-cluster<br/>
                    cluster:<br/>
                    ...<br/>
                    extensions:<br/>
                    <ul>
                        <li>name: client.authentication.k8s.io/exec  # зарезервована назва розширення для конфігурації exec для кожного кластера<br/>
                        extension:<br/>
                        audience: 06e3fbd18de8  # довільна конфігурація</li>
                    </ul>
                    </li>
                </ul>
                <p>В деяких середовищах конфігурація користувача може бути точно такою ж для багатьох кластерів (тобто викликати цей exec втулок), за винятком деяких деталей, специфічних для кожного кластера, таких як аудиторія. Це поле дозволяє безпосередньо вказати конфігурацію для кожного кластера разом з інформацією про кластер. Використання цього поля для зберігання секретних даних не рекомендується, оскільки однією з основних переваг exec втулків є те, що жодні секрети не потрібно зберігати безпосередньо в kubeconfig.</p></td>
        </tr>
    </tbody>
</table>

## `ExecCredentialSpec` {#client-authentication-k8s-io-v1-ExecCredentialSpec}

**Зустрічається в:**

- [ExecCredential](#client-authentication-k8s-io-v1-ExecCredential)

ExecCredentialSpec містить інформацію про запит і специфічну для часу виконання, надану транспортом.

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>cluster</code><br/>
                <a href="#client-authentication-k8s-io-v1-Cluster"><code>Cluster</code></a>
            </td>
            <td><p>Cluster містить інформацію, що дозволяє exec втулку спілкуватися з кластером Kubernetes, до якого здійснюється автентифікація. Зверніть увагу, що Cluster є ненульовим тільки тоді, коли provideClusterInfo встановлено в true у конфігурації exec провайдера (тобто, ExecConfig.ProvideClusterInfo).</p></td>
        </tr>
        <tr>
            <td><code>interactive</code> <b>[Обовʼязкове]</b><br/>
                <code>bool</code>
            </td>
            <td><p>Interactive вказує, чи було передано stdin цьому exec втулку.</p></td>
        </tr>
    </tbody>
</table>

## `ExecCredentialStatus` {#client-authentication-k8s-io-v1-ExecCredentialStatus}

**Зустрічається в:**

- [ExecCredential](#client-authentication-k8s-io-v1-ExecCredential)

ExecCredentialStatus містить облікові дані для використання транспортом.

Token і ClientKeyData є конфіденційними полями. Ці дані повинні передаватися тільки в памʼяті між клієнтом і процесом exec втулка. Сам exec втулок повинен бути захищений принаймні через права доступу до файлів.</p>

<table class="table">
    <thead><tr><th width="30%">Поле</th><th>Опис</th></tr></thead>
    <tbody>
        <tr>
            <td><code>expirationTimestamp</code><br/>
                <a href="/docs/reference/generated/kubernetes-api/v1.35/#time-v1-meta"><code>meta/v1.Time</code></a>
            </td>
            <td><p>ExpirationTimestamp вказує час, коли надані облікові дані закінчуються.</p></td>
        </tr>
        <tr>
            <td><code>token</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td><p>Token є маркером доступу, що використовується клієнтом для автентифікації запитів.</p></td>
        </tr>
        <tr>
            <td><code>clientCertificateData</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td><p>PEM-кодовані клієнтські TLS сертифікати (включаючи проміжні, якщо є).</p></td>
        </tr>
        <tr>
            <td><code>clientKeyData</code> <b>[Обовʼязкове]</b><br/>
                <code>string</code>
            </td>
            <td><p>PEM-кодований приватний ключ для вищезгаданого сертифіката.</p></td>
        </tr>
    </tbody>
</table>
