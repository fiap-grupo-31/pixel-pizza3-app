![Static Badge](https://img.shields.io/badge/v11-version?logo=typescript&color=%234169E1&labelColor=white&label=Typescript)
![Static Badge](https://img.shields.io/badge/v18-version?logo=node.js&color=%234169E1&labelColor=white&label=Nojes)
![Static Badge](https://img.shields.io/badge/v18-version?logo=mongodb&color=%234169E1&labelColor=white&label=Mongodb)
![Static Badge](https://img.shields.io/badge/v11-version?logo=ubuntu&color=%234169E1&labelColor=white&label=Ubuntu) ![Static Badge](https://img.shields.io/badge/v20-version?logo=docker&color=%234169E1&labelColor=white&label=Docker) ![Static Badge](https://img.shields.io/badge/v1.29.2-version?logo=dockercompose&color=%234169E1&labelColor=white&label=DockerCompose) ![Static Badge](https://img.shields.io/badge/vOAS3-version?logo=swagger&color=%234169E1&labelColor=white&label=Swagger)



# Tech Challenge - Fase 03 (GRUPO 31) - Sistema de gestão de pedidos

Consiste no backend de um sistema de gestão de pedidos para autoatendimento incluindo as seguintes caracteristicas:

## Caracteristicas

-   Cadastro de cliente
-   Identificação do cliente via CPF
-   Criar, editar e remover produto
-   Buscar produtos por categoria
-   Fakecheckout, apenas enviar os produtos escolhidos para fila ( *refatorado para o novo endpoint* )
-   Listar pedidos por situação
-   #####   Checkout do Pedido onde é retornado o id do pedido (protocol) e as informações
-   #####   Pedido de pagamento onde é enviado o broker e o id do pedido e é retornado a URL do broker (mercado pago) e o url do callback (webhook)
-   #####   Pedido de pagamento com o mercadopago onde é enviado o broker e o id do pedido e é retornado a URL do broker (mercado pago) e o url do callback (webhook)
-   #####   Lista de pedidos com ordenação de status / entrada respeitando a ordem pronto, em preparação e recebidos ( não considerado o finalizado )
-   #####   Atualização de status do pedido
-   #####   Implementação da integração do mercado pago para pagamento
-   #####   Deployment e Service kubernets

## Documentação DDD (Domain Driven Design)

Toda documentação DDD com seus diagramas, linguagem úbiqua está disponível no link (notion) a seguir:

[Documentação](https://2cx.notion.site/dbd5a5e318554fbc9e9fcee88e9c4caa?v=72aefde135fc4fd1b886c9693b3426c2&pvs=25)

Tambem esta disponível no link a seguir local abaixo:

[Documentação Local](/docs/ddd.md)

Para uma visualização completa em PDF é possivel visualizar no documento abaixo:

[Documentação Pdf](/docs/documentation.pdf)

## Requisitos para execução direta

- Debian: 11 ou superior | Ubuntu: 20
- Node: 18
- Banco de dados Mongodb

## Requisitos para execução via docker ( Tech Challenge Fase 1 )

- Docker: 20 ou superior
- Docker-compose: 1.29.2 ou superior

## Requisitos para execução via kubernets ( Tech Challenge Fase 2 )

- Minikube
- kubectl

## Gerar a versão de distribuição /dist ( se necessário )

Executar o comando abaixo para gerar automaticamente o dist
- npm run build

## Execução via docker
A execução da aplicação via docker-compose permite a execução do monolito com escalabilidade horizontal (para aplicação).

Para executar o modelo padrão da atividade executando 2 instâncias (1 para aplicação e 1 para o banco de dados), acesse o diretorio onde está o código e digite o comando a seguir:

    docker-compose up

Ele irá provisionar uam instância de banco de dados (mongodb) e aplicar um build no Dockerfile para provisionar a instância de aplicação. Em tela irá apresentar o log continuo da execução dos serviços.

Para executar o pacote sem visualizar os log's, execute o comando abaixo:

    docker-compose up -d

Para encerrar o serviço digite o comando a seguir: 

    docker-compose down


## Execução via kubernets

Gerar imagem docker para uso no kubernets

    docker build -t andersonarsilva/fiap-31-pedidos:latest .

Subir o services do mongodb: Ele será responsável por expor a porta do mongo para ser utilizado pelo deployment de apis

    kubectl apply -f services-mongodb.yaml

Subir o deployment : Ele será responsável pela execução das apis com 1 replica (se necessário modificar a "replicas")

    kubectl apply -f deployment-apis.yaml

Subir o nodeport (opcional) : Caso queira testar a API localmente, ele irá liberar as apis na porta 30000

    kubectl apply -f nodeport-apis.yaml

Subir o loadbalance: Ele será responsável por liberar o loadblance do deployment

    kubectl apply -f services-loadbalance.yaml


Para efeito de simulação caso queira executar todas os itens de uma só vez, executar o comando abaixo.

    kubectl apply -f stack.yaml

Para listar os services,pods execute o comando abaixo

    kubectl get services,pods -o wide

Caso queira testar o LoadBalance local executar o comando abaixo para liberar o tunnel.

    minikube tunnel


## Documentação das API's

A documentação pode ser acessada via browser digitando o endereço abaixo quando a aplicação estiver em execução:

    http://localhost:8080/api-docs/

Para acessar diretamente [clique aqui](http://localhost:8080/api-docs/)

O swagger é um framework composto por diversas ferramentas que, independente da linguagem, auxilia a descrição, consumo e visualização de serviços de uma API REST e foi selecionado para documentação dos endpoints do backend da aplicação.

- CLIENTES (customer)
    - permite criar um novo cadastro de cliente
    - permite consultar um cadastro pelo cpf
    - ##### permite consultar todos os cadastro ( novo )
    - ##### permite consultar um cadastro por id ( novo )
    - ##### permite atualizar um cadastro por id ( novo )
    - ##### permite remover um cadastro por id ( novo )
- PRODUTOS
    - ##### permite buscar todos os produtos ( novo )
    - permite buscar produtos por categorias pré definidas 'ACCOMPANIMENT', 'DESSERT', 'DRINK' e 'SNACK'
    - permite buscar produtos por id
    - permite remover produtos por id
    - permite cadastrar um novo produto em uma das categorias pré definidas
    - permite atualizar um produto existente
- PEDIDOS
    - permite criar um novo pedido enviando os produtos seleecionados
    - permite atualizar a situação (status) do pedido
    - permite consultar pedidos por situação (status)
    - ##### permite atualizar o status de um pedido ( novo )
    - ##### permite consultar um pedido por id ( novo )
    - ##### permite remover um pedido por id ( novo )
    - ##### permite atualizar o status de pagamento de um pedido por id ( novo )
- ##### PAGAMENTO ( novo )
    - ##### permite efetuar um pedido de pagamento enviando o broker e o pedido ( novo )
    - ##### permite receber o evento de pagamento aprovado ou não (até cancelado) via webhook endpoint por id de pagamento

## Requisitos para jornada de teste

### Mercado pago

É necessário incluir no docker-compose.yaml e no deployment-apis.yaml e pod-apis.yaml as enviroment (env) da configuração do mercado pago.

```
MELI_USER_ID: 
MELI_POSID: 
MELI_TOKEN: 
```




## Jornada de teste

Cadastra um produto "lanche"
```
curl --location 'http://localhost:8080/products' \
--header 'Content-Type: application/json' \
--data '{
  "name": "Cheeseburger (P)",
  "price": 11.90,
  "category": "SNACK",
  "description": "Hamburger de 70g (pão, molho rosé, queijo tipo cheddar, alface e tomate)"
}'

```

Cadastra um produto "bebida"
```
curl --location 'http://localhost:8080/products' \
--header 'Content-Type: application/json' \
--data '{
  "name": "Suco de uva",
  "price": 11.90,
  "category": "DRINK",
  "description": "Suco"
}'
```

Atualiza produto
```
curl --location --request PUT 'http://localhost:8080/products/64ea48eaa5925b790c90e7d2' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Cheeseburger (P)",
    "price": 20.90,
    "category": "SNACK",
    "description": "Hamburger de 70g (pão, molho rosé, queijo tipo cheddar, alface e tomate)"
}'
```

Deleta um produto
```
curl --location --request DELETE 'http://localhost:8080/products/64ea48eaa5925b790c90e7d2'
```

##### Buscar todos os produtos
```
curl --location 'http://localhost:8080/products'
```

##### Buscar um produto por ID
```
curl --location 'http://localhost:8080/products/64ea48cea5925b790c90e7d0'
```

Buscar um produto por categoria
```
curl --location 'http://localhost:8080/products?category=SNACK'
```

Criar um cadastro de cliente.
```
curl --location 'http://localhost:8080/customers' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Grupo 31",
    "mail": "",
    "cpf": "44445337064",
    "birthdate": "1986-04-04",
    "subscription": "Informação adicional"
}'
```



##### Cadastra uma imagem de um produto
```
curl --location 'http://localhost:8080/products/64ea6e99d69544e1cdb1f680/images' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Principal",
    "size": "10",
    "type": "SNACK",
    "base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwkHBgoJCA.....L1ejMzMzMzMzMzMzMzMzMzM9WZn/d/9k="
}'

```

##### Busca todas as imagens de um produto
```
curl --location 'http://localhost:8080/products/64ea6e99d69544e1cdb1f680/images'
```

##### Busca uma imagem especifica de um produto
```
curl --location 'http://localhost:8080/products/64ea6e99d69544e1cdb1f680/images/64ea6eebd69544e1cdb1f683'
```

##### Atualiza uma imagem especifica de um produto
```
curl --location --request PUT 'http://localhost:8080/products/64ea6e99d69544e1cdb1f680/images/64ea6eebd69544e1cdb1f683' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Principal",
    "size": "10",
    "type": "SNACK",
    "base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwkHBAkLCwo...L1ejMzMzMzMzMzMzMzMzMzM9WZn/d/9k="
}'
```

##### Remove uma imagem especifica de um produto
```
curl --location --request DELETE 'http://localhost:3000/products/64ea6e99d69544e1cdb1f680/images/64ea6eebd69544e1cdb1f683'
```


##### Criar um cadastro de cliente.
```
curl --location 'http://localhost:8080/customers' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Grupo 31",
    "mail": "",
    "cpf": "44445337064",
    "birthdate": "1986-04-04",
    "subscription": "Informação adicional"
}'
```

##### Buscar todos os clientes
```
curl --location 'http://localhost:8080/customers'
```

##### Buscar um cliente por id
```
curl --location 'http://localhost:8080/customers/64e262c9c949fba1be313182'
```

##### Buscar um cliente por cpf
```
curl --location 'http://localhost:8080/customers?cpf=44445337064'
```




#### Criar um pedido ( retorna _protocol_ == numero do pedido e _id chave), retornando o pedido por completo
```
curl --location 'http://localhost:8080/orders' \
--header 'Content-Type: application/json' \
--data '{
    "customerId": "64e262c9c949fba1be313182",
    "orderItens": [{
        "productId": "64ea4849a5925b790c90e7c6",
        "quantity": 3,
        "obs": "Sem cebola"
    },{
        "productId": "64ea5370da7c340abe23dba3",
        "quantity": 3,
        "obs": "gelada"
    }]
}'
```

Busca pedidos pela situação do pedido (status)

```
curl --location 'http://localhost:8080/orders/status/IN_PROGRESS'
```
```
curl --location 'http://localhost:8080/orders/status/DONE'
```

Busca pedidos pelo ID

```
curl --location 'http://localhost:8080/orders/64ea538bda7c340abe23dba9'
```

#### Atualiza status do pedido por id ( incluso regras de validação do status a ser executado )
```
curl --location --request PUT 'http://localhost:8080/orders/64ea538bda7c340abe23dba9' \
--header 'Content-Type: application/json' \
--data '{
    "status": "CANCELED"
}'
```

#### Criar uma requisição de pagamento para o pedido em especifico iniciando o processo de pagamento - exemplo 'fake' ele retorna o webhook para receber o evento de pagamento
```
curl --location 'http://localhost:8080/payment' \
--header 'Content-Type: application/json' \
--data '{
    "orderId": "64ea5568a0e65782ec9aec23",
    "broker": "fake"
}'
```

#### Webhook para o pagamento 'fake': validação APPROVED, DENIED, CANCELED
```
curl --location 'http://localhost:8080/payment/webhook/64ea56b45386a25887bb7da1' \
--header 'Content-Type: application/json' \
--data '{
    "status": "APPROVED",
    "description": ""
}'
```


#### Criar uma requisição de pagamento para o pedido em especifico iniciando o processo de pagamento - exemplo 'fake' ele retorna o webhook para receber o evento de pagamento
```
curl --location 'http://localhost:8080/payment' \
--header 'Content-Type: application/json' \
--data '{
    "orderId": "64ea5568a0e65782ec9aec23",
    "broker": "fake"
}'
```

#### Webhook para o pagamento 'fake': validação APPROVED, DENIED, CANCELED
```
curl --location 'http://localhost:8080/payment/webhook/fake/64ea56b45386a25887bb7da1' \
--header 'Content-Type: application/json' \
--data '{
    "status": "APPROVED",
    "description": ""
}'
```



#### Criar uma requisição de pagamento para o pedido em especifico iniciando o processo de pagamento - exemplo 'mercadopago' ele retorna o webhook para receber o evento de pagamento direto e foi incluso 1 opcional adicional para teste publico e injeção via requisição
```
curl --location 'http://localhost:8080/payment' \
--header 'Content-Type: application/json' \
--data '{
    "orderId": "64ea5568a0e65782ec9aec23",
    "broker": "mercadopago"
}'
```

#### Webhook para o pagamento 'mercadopago'
```
curl --location 'http://localhost:8080/payment/webhook/mercadopago/64ea62aed8acfa2be9eb16fc' \
--header 'Content-Type: application/json' \
--data '{
  "action": "payment.created",
  "api_version": "v1",
  "data": {
    "id": "62769692566"
  },
  "date_created": "2023-08-26T20:38:56Z",
  "id": 107245981863,
  "live_mode": true,
  "type": "payment",
  "user_id": "157842011"
}'
```
Para representar o teste acima configure o enviroment "MELI_WEBHOOK" com o link do webhook.site, export curl e troque o "https://webhook.site/XXXXXXXXXXXXXXXXXXXXXXXX/" por "http://localhost:8080/payment/webhook/mercadopago/" e execute o post para obter o resultado de pagamento



Retonar a lista de pedidos ordenados por Pronto [DONE], Em preparação [IN_PROGRESS], Recebido [RECEIVE COM PAYMENT APPROVED] e por recebimento. Nesta seleção não entra os Finalizados [FINISH] nem os que foram cancelados [CANCELED]
curl --location 'http://localhost:8080/orders/open'



## Requisitos para deploy em Amazon Eks

* [Terraform](https://www.terraform.io/) - Terraform is an open-source infrastructure as code software tool that provides a consistent CLI workflow to manage hundreds of cloud services. Terraform codifies cloud APIs into declarative configuration files.
* [Amazon AWS Account](https://aws.amazon.com/it/console/) - Amazon AWS account with billing enabled
* [aws cli](https://aws.amazon.com/cli/) optional

## Antes de começar

Esta execução esta fora do nível gratuito da AWS, importante avaliar antes de executar

## AWS configuração

Com os requisitos já identificados, configure abaixo no secrets do github.

```
AWS_ACCESS_KEY = "xxxxxxxxxxxxxxxxx"
AWS_SECRET_KEY = "xxxxxxxxxxxxxxxxx"
```

## Uso

Com os requisitos já identificados, configure abaixo no secrets do github.

```
    - name: Checkout do repositório
      uses: actions/checkout@v2

    - name: Configurando a AWS Credentials Action para o GitHub Actions
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_KEY }}
        aws-region: ${{ env.AWS_REGION }}
      

    - name: Obtem ENDPOINT_DB DocumentDB
      run: |
        export ENDPOINT_DB=$(aws docdb describe-db-instances --db-instance-identifier pixels-db --query 'DBInstances[0].Endpoint.Address' --output text)
        echo $ENDPOINT_DB
        cp k8s/configmap.tmpl.yaml k8s/configmap.yaml
        sed -i 's|REPLACE_DB_STRING_CLOUD|'"$ENDPOINT_DB"'|g' k8s/configmap.yaml
        cat k8s/configmap.yaml

    - name: Login em Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v1

    - name: Instala dependencias
      run: |
        npm install

    - name: Gera versão de distribuição
      run: |
        npm run build

    - name: Build do Dockerfile, criação da Tag e Push Image em Amazon ECR
      id: build-image
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
      run: |
        docker image build \
        --tag ${{ env.ECR_REGISTRY }}/${{ env.ECR_REPOSITORY }}:latest \
        --tag ${{ env.ECR_REGISTRY }}/${{ env.ECR_REPOSITORY }}:${{ env.SHORT_SHA }} \
        .
        docker push ${{ env.ECR_REGISTRY }}/${{ env.ECR_REPOSITORY }}:latest
        docker push ${{ env.ECR_REGISTRY }}/${{ env.ECR_REPOSITORY }}:${{ env.SHORT_SHA }}

    - name: Instala e Configura Kubectl
      run: |
        VERSION=$(curl --silent https://storage.googleapis.com/kubernetes-release/release/stable.txt)
        # https://github.com/aws/aws-cli/issues/6920#issuecomment-1117981158
        VERSION=v1.23.6
        curl https://storage.googleapis.com/kubernetes-release/release/$VERSION/bin/linux/amd64/kubectl \
          --progress-bar \
          --location \
          --remote-name
        chmod +x kubectl
        sudo mv kubectl /usr/local/bin/

    - name: Deploy da aplicação em EKS
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
      run: |
        export ECR_REPOSITORY=${{ env.ECR_REGISTRY }}/${{ env.ECR_REPOSITORY }}
        export IMAGE_TAG=${{ env.SHORT_SHA }}
        aws eks update-kubeconfig --name Fiap_Pixels-Eks
        envsubst < k8s/kustomization.tmpl.yaml > k8s/kustomization.yaml
        kubectl kustomize k8s | kubectl apply -f -
```

### Execução do projeto

Ao efetuar um push no repositório develop com sucesso, é necessário efetuar um pull request na branch master para que a execução do pipeline do workflow seja executado
