FROM alpine:3.3

RUN apk add --no-cache \
	build-base \
	ca-certificates \
	libffi-dev \
	nodejs \
	ruby-dev \
	ruby-nokogiri \
	zlib-dev

RUN	gem install \
	bundler \
	github-pages \
	io-console \
	--no-rdoc --no-ri

VOLUME /k8sdocs

EXPOSE 4000

COPY start.sh /start.sh
WORKDIR /k8sdocs

CMD [ "/start.sh" ]
# For instructions, see http://kubernetes.io/editdocs/
