# Finance gestor

Esta é uma API criada somente com NodeJS nativo para fins de estudo

# Tabela de conteúdos

- [Primeiros passos](#footprints-primeiros-passos)
- [Rodando o projeto](#runner-rodando-o-projeto)
- [A Api](#computer-a-api)
- [Playlist](#book-playlist)

# :footprints: Primeiros passos

# :runner: Rodando o projeto

# :computer: A Api

### Funcionalidades

- [ ] Criar entrada de caixa
- [ ] Criar saída de caixa
- [ ] Histórico de entradas e saídas

### Modelos

**Modelo de entrada**
```json
{
	"id": "random-uuid",
	"note": "Pizza iFood",
	"type": "outcome",
	"value": 6990,
	"created_at": "2022-06-04T15:01:23.000Z"
}
```

**Modelo de saída**
```json
{
	"id": "random-uuid",
	"note": "Salário",
	"type": "income",
	"value": 160087,
	"created_at": "2022-06-04T15:01:23.000Z"
}
```

**Rotas da api**

| Caminho | Método | Ação |
|:---:|:---:|:---|
|  /ping                | **GET**   | Rota para checar saúde da aplicação |
|  /transaction         | **POST**  | Cadastro de nova transação          |
|  /transaction/{{id}}  | **DELETE**| Excluir transação                   |
|  /transactions        | **GET**   | Recupera o histórico de transações  |

### Material auxiliar

- [Criar testar e aprender RegExp](https://regex101.com/)
- [Como funciona o regex de rotas](https://regex101.com/r/Vw7fH1/1)

# :book: Playlist

**[Inscreva-se no canal](https://www.youtube.com/channel/UCWQyi_jJN_C-yVffPleNlaQ?sub_confirmation=1&utm_source=github&utm_campaing=finance-management-api-no-fw)**

- [Aula 01](https://www.youtube.com/watch?v=10jVqDUXyEg)