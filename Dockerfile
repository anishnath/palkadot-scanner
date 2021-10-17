FROM node:14

# Create app directory
WORKDIR palkadot-scanner

# Bundle app source
COPY . .

RUN pwd && \
    ls -ltr && \
    cd web && \
    npm i && \
    cd .. && \
    ls -ltr && \
    cd api-server && \
    pwd && \
    ls -ltr && \
    npm i

EXPOSE 3000
EXPOSE 3001
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["$@"]