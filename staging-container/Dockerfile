FROM starefossen/ruby-node:2-4

RUN gem install github-pages

VOLUME /k8sdocs

EXPOSE 4000

WORKDIR /k8sdocs

CMD bundle && jekyll clean && jekyll serve -H 0.0.0.0 -P 4000

# For instructions, see http://kubernetes.io/editdocs/
