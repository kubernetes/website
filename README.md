# The Kubernetes documentation
# தி குபேர்ண்ட்ஸ் டௌமெண்டஷன் 
[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys) [![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

இந்த களஞ்சியத்தில் கட்டமைக்க தேவையான சொத்துக்கள் உள்ளன [Kubernetes website and documentation](https://kubernetes.io/). 
நீங்கள் பங்களிக்க விரும்புவதில் நாங்கள் மகிழ்ச்சியடைகிறோம்!

- [Contributing to the docs](#contributing-to-the-docs)
- [Localization ReadMes](#localization-readmemds)

## இந்த களஞ்சியத்தைப் பயன்படுத்துதல்


ஹியூகோ (நீட்டிக்கப்பட்ட பதிப்பு) ஐப் பயன்படுத்தி நீங்கள் உள்ளூர் வலைத்தளத்தை இயக்கலாம் அல்லது ஒரு கொள்கலன் இயக்க நேரத்தில் அதை இயக்கலாம். நேரடி வலைத்தளத்துடன் வரிசைப்படுத்தல் நிலைத்தன்மையை வழங்குவதால், கொள்கலன் இயக்க நேரத்தைப் பயன்படுத்த நாங்கள் கடுமையாக பரிந்துரைக்கிறோம்.
## Prerequisites

இந்த களஞ்சியத்தைப் பயன்படுத்த, உங்களுக்கு பின்வரும் உள்நாட்டில் நிறுவப்பட வேண்டும்:

- [npm](https://www.npmjs.com/)
- [Go](https://golang.org/)
- [Hugo (Extended version)](https://gohugo.io/)
- A container runtime, like [Docker](https://www.docker.com/).


நீங்கள் தொடங்குவதற்கு முன், சார்புகளை நிறுவவும். களஞ்சியத்தை க்ளோன் செய்து கோப்பகத்திற்கு செல்லவும்:

```bash
git clone https://github.com/kubernetes/website.git
cd website
```


குபர்நெட்ஸ் இணையதளம் இதைப் பயன்படுத்துகிறது[Docsy Hugo theme](https://github.com/google/docsy#readme). 
நீங்கள் ஒரு கொள்கலனில் வலைத்தளத்தை இயக்க திட்டமிட்டிருந்தாலும், பின்வருவதை இயக்குவதன் மூலம் துணைப்பகுதி மற்றும் பிற வளர்ச்சி சார்புகளை இழுக்க நாங்கள் கடுமையாக பரிந்துரைக்கிறோம்:
```bash
# pull in the Docsy submodule
git submodule update --init --recursive --depth 1
```

## ஒரு கொள்கலனைப் பயன்படுத்தி இணையதளத்தை இயக்குதல்


ஒரு கொள்கலனில் தளத்தை உருவாக்க, கொள்கலன் படத்தை உருவாக்கி அதை இயக்க பின்வருவதை இயக்கவும்:

```bash
make container-image
make container-serve
```


நீங்கள் பிழைகளைக் கண்டால், ஹ்யூகோ கொள்கலனில் போதுமான கணினி வளங்கள் இல்லை என்று அர்த்தம். அதைத் தீர்க்க, உங்கள் கணினியில் டோக்கருக்கான அனுமதிக்கப்பட்ட CPU மற்றும் நினைவகப் பயன்பாட்டின் அளவை அதிகரிக்கவும் ([MacOSX](https://docs.docker.com/docker-for-mac/#resources) and [Windows](https://docs.docker.com/docker-for-windows/#resources)).


உங்கள் உலாவியைத் திறக்கவும் <http://localhost:1313> வலைத்தளத்தைப் பார்க்க. 
நீங்கள் மூலக் கோப்புகளில் மாற்றங்களைச் செய்யும்போது, ​​ஹ்யூகோ வலைத்தளத்தைப் புதுப்பித்து, உலாவியைப் புதுப்பிக்கும்படி கட்டாயப்படுத்துகிறது.

## Running the website locally using Hugo


மூலம் குறிப்பிடப்பட்ட ஹ்யூகோ நீட்டிக்கப்பட்ட பதிப்பை நிறுவ உறுதி செய்யவும் `HUGO_VERSION` சூழல் மாறி [`netlify.toml`](netlify.toml#L10) 
கோப்பு.


உள்நாட்டில் தளத்தை உருவாக்க மற்றும் சோதிக்க, இயக்கவும்:

```bash
# install dependencies
npm ci
make serve
```


இது போர்ட் 1313 இல் உள்ளூர் ஹ்யூகோ சேவையகத்தைத் தொடங்கும். உங்கள் உலாவியைத் திறக்கவும் <http://localhost:1313> 
வலைத்தளத்தைப் பார்க்க. நீங்கள் மூலக் கோப்புகளில் மாற்றங்களைச் செய்யும்போது, ​​ஹ்யூகோ வலைத்தளத்தைப் புதுப்பித்து, உலாவியைப் புதுப்பிக்கும்படி கட்டாயப்படுத்துகிறது.
## Building the API reference pages

அமைந்துள்ள ஏபிஐ API குறிப்பு பக்கங்கள் `content/en/docs/reference/kubernetes-api` பயன்படுத்தி ஸ்வாகர் விவரக்குறிப்பிலிருந்து கட்டப்பட்டுள்ளன <https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs>.


ஒரு புதிய Kubernetes வெளியீட்டிற்கான குறிப்புப் பக்கங்களைப் புதுப்பிக்க (புதுப்பிக்க வெளியீட்டைக் கொண்டு பின்வரும் எடுத்துக்காட்டுகளில் v1.20 ஐ மாற்றவும்):
1. Pull the `kubernetes-resources-reference` submodule:

   ```bash
   git submodule update --init --recursive --depth 1
   ```

2.ஸ்வாகர் விவரக்குறிப்பைப் புதுப்பிக்கவும்:( Update the Swagger specification:)

```
curl 'https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json' > api-ref-assets/api/swagger.json
```

3. In `api-ref-assets/config/`, adapt the files `toc.yaml` and `fields.yaml` to reflect the changes of the new release.

4. Next, build the pages:

   ```bash
   make api-reference
   ```

   
ஒரு கொள்கலன் படத்திலிருந்து தளத்தை உருவாக்கி சேவை செய்வதன் மூலம் நீங்கள் உள்நாட்டில் முடிவுகளை சோதிக்கலாம்:
   ```bash
   make container-image
   make container-serve
   ```

   
ஒரு இணைய உலாவியில், செல்க <http://localhost:1313/docs/reference/kubernetes-api/> ஏபிஐ குறிப்பைக் காண.

5. புதிய ஒப்பந்தத்தின் அனைத்து மாற்றங்களும் உள்ளமைவு கோப்புகளில் பிரதிபலிக்கும் போது `toc.yaml` and `fields.yaml`, புதிதாக உருவாக்கப்பட்ட ஏபிஐ குறிப்பு பக்கங்களுடன் ஒரு புல் கோரிக்கையை உருவாக்கவும்.

## பழுது நீக்கும்

### பிழை: வளத்தை மாற்ற முடியவில்லை: TOCSS: மாற்ற முடியவில்லை "scss/main.scss" (text/x-scss): இந்த அம்சம் உங்கள் தற்போதைய ஹ்யூகோ பதிப்பில் இல்லை

ஹ்யூகோ தொழில்நுட்ப காரணங்களுக்காக இரண்டு பைனரி தொகுப்புகளில் அனுப்பப்படுகிறது. தற்போதைய இணையதளம் அதன் அடிப்படையில் இயங்குகிறது **Hugo Extended** version only. In the [release page](https://github.com/gohugoio/hugo/releases) உடன் காப்பகங்களைத் தேடுங்கள் `extended` பெயரில். உறுதிப்படுத்த, இயக்கவும் `hugo version` மற்றும் வார்த்தையைத் தேடுங்கள் `extended`.

### பல திறந்த கோப்புகளுக்கு MacOS ஐ சரிசெய்தல்


நீங்கள் ஓடினால் `make serve` MacOS இல் மற்றும் பின்வரும் பிழையைப் பெறுங்கள்:

```bash
ERROR 2020/08/01 19:09:18 Error: listen tcp 127.0.0.1:1313: socket: too many open files
make: *** [serve] Error 1
```


திறந்த கோப்புகளுக்கான தற்போதைய வரம்பை சரிபார்க்க முயற்சிக்கவும்:

`launchctl limit maxfiles`


பின் பின்வரும் கட்டளைகளை இயக்கவும் (adapted from <https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c>):

```shell
#!/bin/sh

# These are the original gist links, linking to my gists now.
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxfiles.plist
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxproc.plist

curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxfiles.plist
curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxproc.plist

sudo mv limit.maxfiles.plist /Library/LaunchDaemons
sudo mv limit.maxproc.plist /Library/LaunchDaemons

sudo chown root:wheel /Library/LaunchDaemons/limit.maxfiles.plist
sudo chown root:wheel /Library/LaunchDaemons/limit.maxproc.plist

sudo launchctl load -w /Library/LaunchDaemons/limit.maxfiles.plist
```


இது Catalina மற்றும் Mojave macOS க்கு வேலை செய்கிறது.

## SIG டாக்ஸில் ஈடுபடுங்கள்


SIG Docs Kubernetes சமூகம் மற்றும் சந்திப்புகள் பற்றி மேலும் அறியவும் [community page](https://github.com/kubernetes/community/tree/master/sig-docs#meetings).

இந்த திட்டத்தின் பராமரிப்பாளர்களையும் நீங்கள் இங்கு அணுகலாம்:

- [Slack](https://kubernetes.slack.com/messages/sig-docs) [Get an invite for this Slack](https://slack.k8s.io/)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

## Contributing to the docs
## ஆவணங்களுக்கு பங்களித்தல்

நீங்கள் கிளிக் செய்யலாம் **Fork** 
உங்கள் GitHub கணக்கில் இந்த களஞ்சியத்தின் நகலை உருவாக்க திரையின் மேல் வலது பகுதியில் உள்ள பொத்தான். இந்த நகல் அழைக்கப்படுகிறது _fork_.உங்கள் முட்கரண்டியில் நீங்கள் விரும்பும் மாற்றங்களைச் செய்யுங்கள், அந்த மாற்றங்களை எங்களுக்கு அனுப்ப நீங்கள் தயாராக இருக்கும்போது, ​​உங்கள் முட்கரண்டிக்குச் சென்று, அதைப் பற்றி எங்களுக்குத் தெரியப்படுத்த புதிய இழுக்கும் கோரிக்கையை உருவாக்கவும்.

உங்கள் புல் கோரிக்கை உருவாக்கப்பட்டவுடன், ஒரு குபர்நெட்ஸ் விமர்சகர் தெளிவான, செயல்படக்கூடிய கருத்துக்களை வழங்குவதற்கான பொறுப்பை ஏற்றுக்கொள்வார். இழுக்கும் கோரிக்கையின் உரிமையாளராக, **it is your responsibility to modify your pull request to address the feedback that has been provided to you by the Kubernetes reviewer.**

மேலும், நீங்கள் ஒன்றுக்கு மேற்பட்ட குபர்நெட்ஸ் விமர்சகர்களைக் கொண்டு முடிவடையலாம் அல்லது உங்களுக்கு பின்னூட்டம் வழங்க ஆரம்பத்தில் ஒதுக்கப்பட்டதை விட வித்தியாசமான குபெர்னெட்ஸ் விமர்சகரிடமிருந்து பின்னூட்டம் பெறலாம்.

மேலும், சில சமயங்களில், உங்கள் விமர்சகர்களில் ஒருவர் தேவைப்படும்போது ஒரு குபர்நெட்ஸ் தொழில்நுட்ப விமர்சகரிடம் தொழில்நுட்ப மதிப்பாய்வைக் கேட்கலாம். விமர்சகர்கள் சரியான நேரத்தில் பின்னூட்டங்களை வழங்க தங்களால் முடிந்ததை செய்வார்கள் ஆனால் சூழ்நிலைகளின் அடிப்படையில் பதில் நேரம் மாறுபடும்.

குபர்நெட்ஸ் ஆவணத்தில் பங்களிப்பது பற்றிய மேலும் தகவலுக்கு, பார்க்கவும்:

- [Contribute to Kubernetes docs](https://kubernetes.io/docs/contribute/)
- [Page Content Types](https://kubernetes.io/docs/contribute/style/page-content-types/)
- [Documentation Style Guide](https://kubernetes.io/docs/contribute/style/style-guide/)
- [Localizing Kubernetes Documentation](https://kubernetes.io/docs/contribute/localization/)

## Localization `README.md`'s

| Language                   | Language                   |
| -------------------------- | -------------------------- |
| [Chinese](README-zh.md)    | [Korean](README-ko.md)     |
| [French](README-fr.md)     | [Polish](README-pl.md)     |
| [German](README-de.md)     | [Portuguese](README-pt.md) |
| [Hindi](README-hi.md)      | [Russian](README-ru.md)    |
| [Indonesian](README-id.md) | [Spanish](README-es.md)    |
| [Italian](README-it.md)    | [Ukrainian](README-uk.md)  |
| [Japanese](README-ja.md)   | [Vietnamese](README-vi.md) |
|[Tamil](README-ta.md)       |                            | 

##நடத்தை விதி


குபெர்னெட்ஸ் சமூகத்தில் பங்கேற்பு நிர்வகிக்கப்படுகிறது [CNCF Code of Conduct](https://github.com/cncf/foundation/blob/master/code-of-conduct.md).

## நன்றி


Kubernetes சமூக பங்கேற்பில் செழித்து வளர்கிறது, மேலும் எங்கள் வலைத்தளத்திற்கும் உங்கள் ஆவணங்களுக்கும் உங்கள் பங்களிப்புகளை நாங்கள் பாராட்டுகிறோம்!
