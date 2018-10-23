node {
  def image
  def archiveName
  def archiveFileName
  def BUILD_PATH_LINK = "${env.PUBLISH_PATH}www-latest"

  stage("SSH: checking connection") {
    sshagent (credentials: [env.SSH_CREDENTIALS_NAME]) {
      sh "ssh ${env.PUBLISH_SSH_USERNAME}@${env.PUBLISH_SSH_HOST} id"
    }
  }

  stage("SCM: checkout") {
    checkout scm
  }

  stage("Build: docker image") {
    image = docker.build("blocksettle/landing:${env.BUILD_ID}")
  }

  stage("Build: app") {
    image.inside("-v ${WORKSPACE}:/home/node/app -u root") {
      sh "yarn install --frozen-lockfile"
      sh "yarn build"
    }
  }

  stage("Archive") {
    image.inside("-v ${WORKSPACE}:/home/node/app -u root") {
      archiveName = sh(
        script: "echo www--`date +%Y-%m-%d--%H-%M-%S`--`git rev-parse --short HEAD`",
        returnStdout: true
      ).trim()

      archiveFileName = "${archiveName}.zip"

      sh "cd www && zip -r ../${archiveFileName} * && cd -"
    }
  }

  stage("Deploy") {
    sshagent (credentials: [env.SSH_CREDENTIALS_NAME]) {
      sh "ssh ${env.PUBLISH_SSH_USERNAME}@${env.PUBLISH_SSH_HOST} ls -al ${env.PUBLISH_PATH}"
      sh "scp ${archiveFileName} ${env.PUBLISH_SSH_USERNAME}@${env.PUBLISH_SSH_HOST}:${env.PUBLISH_PATH}"
      sh "ssh ${env.PUBLISH_SSH_USERNAME}@${env.PUBLISH_SSH_HOST} unzip ${env.PUBLISH_PATH}${archiveFileName} -d ${env.PUBLISH_PATH}${archiveName}"
      sh "ssh ${env.PUBLISH_SSH_USERNAME}@${env.PUBLISH_SSH_HOST} ln -sfn ${archiveName} ${BUILD_PATH_LINK}"
      sh "ssh ${env.PUBLISH_SSH_USERNAME}@${env.PUBLISH_SSH_HOST} rm -rf ${env.PUBLISH_PATH}${archiveFileName}"
      sh "ssh ${env.PUBLISH_SSH_USERNAME}@${env.PUBLISH_SSH_HOST} ls -al ${env.PUBLISH_PATH}"
      sh "rm -rf ${archiveFileName}"
    }
  }
}
