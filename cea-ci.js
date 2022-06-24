const readmeService = require('./services/ReadmeService');
const fs = require('fs');
const prompt = require('prompt');
const _ = require('lodash');

/**
 * cria o arquivo README.ms
 * @param callback function
 */
readmeService.getReadmeProperties(function(err, result){

    if(err){
        return onError(err);
    }

    const readmeProperties = result;

    const confirmarProperties = [
        { 
          name: 'yes',
          message: 'Estas configurações estão ok? Pressione enter para confirmar',
          validator: /^[a-zA-Z\s]+$/,
        }
      ];
  
    prompt.start();

    prompt.get(confirmarProperties, function(err, result){

        if(err){
            return onError(err);
        }

        if(result['yes'] === '' ||  result['yes'] === 'yes'){

            var pathTarget = __dirname + '/.company-ci-' + readmeProperties['artifact-id']; // cria um diretorio na pasta de usuario com o nome do artefato do projeto 

            if(!fs.existsSync(pathTarget)){fs.mkdirSync(pathTarget);} // cria o diretorio de saida

            var README = fs.readFileSync('./static/java11/README_TEMPLATE_JAVA_11_ORACLE', 'utf-8');

            README = _.replace(README, new RegExp("9artifact-id9","gi"), readmeProperties['artifact-id']);
            README = _.replace(README, new RegExp("9project-name9", "gi"), readmeProperties['project-name']);
            README = _.replace(README, new RegExp("9project-description9", "gi"), readmeProperties['project-description']);
            README = _.replace(README, new RegExp("9git-group9", "gi"), readmeProperties['git-group']);
            README = _.replace(README, new RegExp("9artifact-id9", "gi"), readmeProperties['artifact-id']);
            README = _.replace(README, new RegExp("9docker-image9", "gi"), readmeProperties['docker-image']);
            README = _.replace(README, new RegExp("9openshift-namespace9", "gi"), readmeProperties['openshift-namespace']);
        
            fs.writeFileSync(pathTarget + '/README.md', README); // gera o README

            var Dockerfile = fs.readFileSync('./static/java11/Dockerfile_TEMPLATE_JAVA_11_ORACLE', 'utf-8');
            Dockerfile = _.replace(Dockerfile, new RegExp('9artifact-id9','gi'), readmeProperties['artifact-id']);

            fs.writeFileSync(pathTarget + '/Dockerfile', Dockerfile); // gera o Dockerfile

            var pathTargetDeploy = pathTarget + '/deploy'; // cria uma subpasta com o nome deploy

            if(!fs.existsSync(pathTargetDeploy)){fs.mkdirSync(pathTargetDeploy);} // cria o diretorio dos arquivos de deploy

            var deploy = fs.readFileSync('./static/01-deploy_TEMPLATE', 'utf-8');
            deploy = _.replace(deploy, new RegExp("9artifact-id9","gi"), readmeProperties['artifact-id']);
            deploy = _.replace(deploy, new RegExp("9git-group9", "gi"), readmeProperties['git-group']);
            deploy = _.replace(deploy, new RegExp("9openshift-namespace9", "gi"), readmeProperties['openshift-namespace']);

            fs.writeFileSync(pathTargetDeploy + '/01-deploy.yaml', deploy); // gera o 01-deploy.yml

            var service = fs.readFileSync('./static/02-service_TEMPLATE', 'utf-8');
            service = _.replace(service, new RegExp("9artifact-id9","gi"), readmeProperties['artifact-id']);
            service = _.replace(service, new RegExp("9git-group9", "gi"), readmeProperties['git-group']);
            service = _.replace(service, new RegExp("9openshift-namespace9", "gi"), readmeProperties['openshift-namespace']);

            fs.writeFileSync(pathTargetDeploy + '/02-service.yaml', service); // gera o 02-service.yml

            var route = fs.readFileSync('./static/03-route_TEMPLATE', 'utf-8');
            route = _.replace(route, new RegExp("9artifact-id9","gi"), readmeProperties['artifact-id']);
            route = _.replace(route, new RegExp("9openshift-namespace9", "gi"), readmeProperties['openshift-namespace']);

            fs.writeFileSync(pathTargetDeploy + '/03-route.yaml', route); // gera o 03-route.yml

            var applicationProperties = fs.readFileSync('./static/application.yml_TEMPLATE', 'utf-8');
            fs.writeFileSync(pathTargetDeploy + '/application.yml', applicationProperties); // gera o 03-route.yml

            var gitlab = fs.readFileSync('./static/.gitlab-ci_TEMPLATE', 'utf-8');
            fs.writeFileSync(pathTarget + '/.gitlab-ci.yml', gitlab); // gera o .gitlab-ci.yml

            console.log('Processo finalizado com sucesso! Os arquivos foram gerados na pasta ' + pathTarget);
        }

    });

});

function onError(err){
    console.log(err.message);
    return 1;
}

return(0);





