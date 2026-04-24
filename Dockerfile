FROM registry.global.ccc.srvb.bo.paas.cloudcenter.corp/produban/nodejs-22-ubi9:1.7.10.RELEASE

ARG ARTIFACT_PATH

USER root
ENV APP_HOME /opt/app
WORKDIR ${APP_HOME}
ADD $ARTIFACT_PATH ${APP_HOME}/app.zip

RUN unzip -o ${APP_HOME}/app.zip -d ${APP_HOME}/ && rm -f ${APP_HOME}/app.zip && chown -R 23550:23550 ${APP_HOME}

USER 23550
WORKDIR /opt/produban

ENTRYPOINT [ "./control.sh" ]
CMD [ "start" ]
