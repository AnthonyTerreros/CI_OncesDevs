pipeline {
    agent any
    stage('Checkout') {
        steps {
            script {
                checkout([$class: 'GitSCM', branches: [[name: 'main']], userRemoteConfigs: [[url: 'https://github.com/AnthonyTerreros/CI_OncesDevs']]])
            }
        }
    }
    stages {
        stage("Install") {
            steps {
                script {
                    bat "npm install"
                }
            }
        }
        stage("Test") {
            steps {
                script {
                    bat "npm test"
                }
            }
            post {
                always {
                    junit 'output/coverage/junit/junit.xml'
                }
            }
        }
    }
}
