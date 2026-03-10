---
layout: blog
title: 'Уніфікований доступ до сервера API за допомогою clientcmd'
date: 2026-01-19T10:00:00-08:00
slug: clientcmd-apiserver-access
author: >
  [Stephen Kitt](https://github.com/skitt) (Red Hat)
translator: >
  [Андрій Головін](https://github.com/Andygol)
---

Якщо ви коли-небудь хотіли створювати консольного клієнта для API Kubernetes, особливо якщо ви розглядали можливість використання вашого клієнта як втулка `kubectl`, ви, можливо, замислювалися над тим, як зробити вашого клієнта звичним для користувачів `kubectl`. Швидкий погляд на вихідні дані `kubectl options` може вас збентежити: «Невже я повинен реалізувати всі ці опції?»

Не бійтеся, інші вже зробили за вас велику частину роботи. Насправді проєкт Kubernetes надає дві бібліотеки, які допоможуть вам обробляти аргументи командного рядка в стилі `kubectl` у програмах Go: [`clientcmd`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd) та [`cli-runtime`](https://pkg.go.dev/k8s.io/cli-runtime) (яка використовує `clientcmd`). У цій статті ми покажемо, як використовувати першу з них.

## Загальна філософія {#general-philosophy}

Як і слід було очікувати, оскільки це частина `client-go`, кінцевою метою `clientcmd` є надання екземпляра [`restclient.Config`](https://pkg.go.dev/k8s.io/client-go/rest#Config), який може надсилати запити до сервера API.

Він дотримується семантики `kubectl`:

* стандартні значення беруться з `~/.kube` або еквівалентного файлу;
* файли можна вказати за допомогою змінної середовища `KUBECONFIG`;
* усі вищезазначені налаштування можна додатково замінити за допомогою аргументів командного рядка.

Він не встановлює аргумент командного рядка `--kubeconfig`, що може знадобитися для узгодження з `kubectl`; як це зробити, ви дізнаєтеся в розділі «[Привʼязування прапорців](#bind-the-flags)».

## Доступні функції {#available-features}

`clientcmd` дозволяє програмам обробляти

* вибір `kubeconfig` (за допомогою `KUBECONFIG`);
* вибір контексту;
* вибір простору імен;
* сертифікати клієнта та приватні ключі;
* імітацію користувача;
* підтримку базової автентифікації HTTP (імʼя користувача/пароль).

## Обʼєднання конфігурацій {#configuration-merging}

У різних сценаріях `clientcmd` підтримує _обʼєднання_ параметрів конфігурацій: `KUBECONFIG` може вказувати декілька файлів, вміст яких обʼєднується. Це може викликати плутанину, оскільки параметри обʼєднуються в різних напрямках залежно від того, як вони реалізовані. Якщо параметр визначений у мапі, перше визначення має пріоритет, а наступні визначення ігноруються. Якщо параметр не визначений у мапі, останнє визначення має пріоритет.

Коли налаштування отримуються за допомогою `KUBECONFIG`, відсутні файли призводять лише до попереджень. Якщо користувач явно вказує шлях (у стилі `--kubeconfig`), повинен бути відповідний файл.

Якщо `KUBECONFIG` не визначено, замість нього використовується стандартний файл конфігурації `~/.kube/config`, якщо він є.

### Загальний процес {#overall-process}

Загальна схема використання стисло викладена в документації до пакунка [`clientcmd`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd):

```go
loadingRules := clientcmd.NewDefaultClientConfigLoadingRules()
// якщо ви хочете змінити правила завантаження (які файли в якому порядку), ви можете зробити це тут

configOverrides := &clientcmd.ConfigOverrides{}
// якщо ви хочете змінити значення перевизначення або привʼязати їх до прапорців, є методи, які допоможуть вам

kubeConfig := clientcmd.NewNonInteractiveDeferredLoadingClientConfig(loadingRules, configOverrides)
config, err := kubeConfig.ClientConfig()
if err != nil {
	//Щось робимо
}
client, err := metav1.New(config)
// ...
```

У контексті цієї статті є шість кроків:

1. [Налаштування правил завантаження](#configure-the-loading-rules).
1. [Налаштування перевизначення](#configure-the-overrides).
1. [Створення набору прапорців](#build-a-set-of-flags).
1. [Привʼязування прапорів](#bind-the-flags).
1. [Створення обʼєднаної конфігурації](#build-the-merged-configuration).
1. [Отримання клієнта API](#obtain-an-api-client).

### Налаштування правил завантаження {#configure-the-loading-rules}

`clientcmd.NewDefaultClientConfigLoadingRules()` створює правила завантаження, які будуть використовувати або вміст змінної середовища `KUBECONFIG`, або імʼя стандартного файлу конфігурації (`~/.kube/config`). Крім того, якщо використовується стандартний файл конфігурації, він може перенести налаштування з (дуже) старого стандартного файлу конфігурації (`~/.kube/.kubeconfig`).

Ви можете створити власні `ClientConfigLoadingRules`, але в більшості випадків стандартні налаштування підходять.

### Налаштування перевизначення {#configure-the-overrides}

`clientcmd.ConfigOverrides` — це `структура`, що зберігає перевизначення, які будуть застосовані до налаштувань, завантажених із конфігурації, отриманої за допомогою правил завантаження. У контексті цієї статті її основною метою є зберігання значень, отриманих з аргументів командного рядка. Вони обробляються за допомогою бібліотеки [pflag](https://github.com/spf13/pflag), яка є повноцінною заміною пакунка Go [`flag`](https://pkg.go.dev/flag) і додає підтримку аргументів з подвійним дефісом і довгими іменами.

У більшості випадків в перевизначеннях нічого не потрібно встановлювати; я лише привʼяжу їх до прапорців.

### Створення набору прапорців {#build-a-set-of-flags}

У цьому контексті прапорець є уособленням аргументу командного рядка, що вказує його повну назву (наприклад, `--namespace`), його скорочену назву, якщо така є (наприклад, `-n`), його стандартне значення та опис, що показується в інформації про використання. Прапорці зберігаються в екземплярах структури [`FlagInfo`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd#FlagInfo).

Доступні три набори прапорців, що представляють такі аргументи командного рядка:

* аргументи автентифікації (сертифікати, токени, імітації іншого користувача, імʼя користувача/пароль);
* аргументи кластера (сервер API, центр сертифікації, конфігурація TLS, проксі, стиснення)
* аргументи контексту (ім'я кластера, імʼя користувача `kubeconfig`, простір імен)

Рекомендований вибір включає всі три з аргументом вибору іменованого контексту та аргументом часу очікування.

Всі вони доступні за допомогою функцій `Recommended…Flags`. Функції приймають префікс, який додається до всіх довгих імен аргументів.

Отже, виклик [`clientcmd.RecommendedConfigOverrideFlags(«»)`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd#RecommendedConfigOverrideFlags) призводить до появи аргументів командного рядка, таких як `--context`, `--namespace` тощо. Аргументу `--timeout` присвоюється стандартне значення 0, а аргумент `--namespace` має відповідний короткий варіант `-n`. Додавання префікса, наприклад `"from-"`, призводить до появи аргументів командного рядка, таких як `--from-context`, `--from-namespace` тощо. Це може здатися не особливо корисним для команд, що стосуються одного сервера API, але вони стають у пригоді, коли залучено кілька серверів API, наприклад у сценаріях із кількома кластерами.

Тут є потенційна проблема: префікси не змінюють коротке імʼя, тому `--namespace` потребує певної обережності, якщо використовується кілька префіксів: лише один із префіксів може бути повʼязаний із коротким імʼям `-n`. Вам доведеться очистити короткі імена, повʼязані з іншими префіксами `--namespace`, або, можливо, всі префікси, якщо немає логічного звʼязку з `-n`. Короткі імена можна очистити таким чином:

```go
kflags := clientcmd.RecommendedConfigOverrideFlags(prefix)
kflags.ContextOverrideFlags.Namespace.ShortName = ""
```

Аналогічним чином прапорці можна повністю вимкнути, очистивши їх довге імʼя:

```go
kflags.ContextOverrideFlags.Namespace.LongName = ""
```

### Привʼязування прапорів {#bind-the-flags}

Після визначення набору прапорців його можна використовувати для привʼязки аргументів командного рядка до перевизначення за допомогою [`clientcmd.BindOverrideFlags`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd#BindOverrideFlags). Для цього потрібен [`pflag`](https://pkg.go.dev/github.com/spf13/pflag) `FlagSet`, а не пакунок `flag` з Go.

Якщо ви також хочете привʼязати `--kubeconfig`, зробіть це зараз, привʼязавши `ExplicitPath` у правилах завантаження:

```go
flags.StringVarP(&loadingRules.ExplicitPath, "kubeconfig", "", "", "absolute path(s) to the kubeconfig file(s)")
```

### Створення обʼєднаної конфігурації {#build-the-merged-configuration}

Для створення обʼєднаної конфігурації доступні дві функції:

* [`clientcmd.NewInteractiveDeferredLoadingClientConfig`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd#NewInteractiveDeferredLoadingClientConfig)
* [`clientcmd.NewNonInteractiveDeferredLoadingClientConfig`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd#NewNonInteractiveDeferredLoadingClientConfig)

Як випливає з назв, різниця між цими двома функціями полягає в тому, що перша може запитувати інформацію для автентифікації в інтерактивному режимі, використовуючи наданий зчитувач, тоді як друга працює тільки з інформацією, наданою їй викликом.

Слово "deferred" (відкладене) у назвах цих функцій означає, що остаточна конфігурація буде визначена якомога пізніше. Це означає, що ці функції можна викликати до аналізу аргументів командного рядка, а в результаті конфігурація буде використовувати будь-які значення, проаналізовані на момент її фактичного створення.

### Отримання клієнта API {#obtain-an-api-client}

Обʼєднана конфігурація повертається як екземпляр [`ClientConfig`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd#ClientConfig). API-клієнт можна отримати з нього, викликавши метод `ClientConfig()`.

Якщо конфігурація не вказана (`KUBECONFIG` порожній або вказує на відсутні файли, `~/.kube/config` не існує, а конфігурація не вказана за допомогою аргументів командного рядка), стандартна настройка поверне незрозумілу помилку, що посилається на `KUBERNETES_MASTER`. Це застаріла поведінка; було зроблено кілька спроб позбутися її, але вона збереглася для аргументів командного рядка `--local` та `--dry-run` у `--kubectl`. Ви повинні перевіряти наявність помилок «порожньої конфігурації», викликаючи `clientcmd.IsEmptyConfig()`, і надавати чіткіше повідомлення про помилку.

Метод `Namespace()` також корисний: він повертає простір імен, який слід використовувати. Він також вказує, чи був простір імен перезаписаний користувачем (за допомогою `--namespace`).

## Повний приклад {#full-example}

Ось повний приклад.

```go
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/spf13/pflag"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
)

func main() {
	// Завантаження правил, без налаштувань
	loadingRules := clientcmd.NewDefaultClientConfigLoadingRules()

	// Перезапис і налаштування прапорця (аргумент командного рядка)
	configOverrides := &clientcmd.ConfigOverrides{}
	flags := pflag.NewFlagSet("clientcmddemo", pflag.ExitOnError)
	clientcmd.BindOverrideFlags(configOverrides, flags,
		clientcmd.RecommendedConfigOverrideFlags(""))
	flags.StringVarP(&loadingRules.ExplicitPath, "kubeconfig", "", "", "absolute path(s) to the kubeconfig file(s)")
	flags.Parse(os.Args)

	// Створення клієнта
	kubeConfig := clientcmd.NewNonInteractiveDeferredLoadingClientConfig(loadingRules, configOverrides)
	config, err := kubeConfig.ClientConfig()
	if err != nil {
		if clientcmd.IsEmptyConfig(err) {
			panic("Please provide a configuration pointing to the Kubernetes API server")
		}
		panic(err)
	}
	client, err := kubernetes.NewForConfig(config)
	if err != nil {
		panic(err)
	}

	// Як дізнатися, який простір імен використовувати
	namespace, overridden, err := kubeConfig.Namespace()
	if err != nil {
		panic(err)
	}
	fmt.Printf("Chosen namespace: %s; overridden: %t\n", namespace, overridden)

	// Використаємо клієнта
	nodeList, err := client.CoreV1().Nodes().List(context.TODO(), v1.ListOptions{})
	if err != nil {
		panic(err)
	}
	for _, node := range nodeList.Items {
		fmt.Println(node.Name)
	}
}
```

Приємного програмування та дякуємо за ваш інтерес до впровадження інструментів зі звичними моделями використання!
