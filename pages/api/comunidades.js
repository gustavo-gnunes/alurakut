// api é servidor

// BFF (backend for frontend)-> usada para criar back-end para clientes
// --> consumir uma api através de um token, usuário e senha, algo secreto, que não pode estar livre para o usuário
//     Ex: ao inspecionar o navegador, não deve aparecer o token de algo
//     navegador-> inspecionar elemento-> Network-> graphql.datocms.com-> Headers-> authorization: 3762686832 'é o token'
// --> consome a api, para mandar algo para cadastrar no BD
// --> esconde o token usado, para não ficar acessivel para todo mundo

// garante que o token não aparece no navegador do usuário
import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequests(request, response) {
  if(request.method === 'POST') {
    const TOKEN = '067bc9667847e1563aaa6ae8d743ef'; // esse token foi pego lá DatoCMS-> Configuração-> Tokens da API-> Full-access API token
    const client = new SiteClient(TOKEN);

    // cria o registro no servidor
    const registroCriado = await client.items.create({
      itemType: "967609", // id do Model de "Comunidade" criado pelo Dato
      ...request.body,
      // title: "Comunidade de Teste",
      // imageUrl: "https://github.com/gustavo-gnunes.png",
      // creatorSlug: "gustavo-gnunes"
    })

    console.log(resgistroCriado);

    response.json({
      dados: 'Algum dados qualquer',
      registroCriado: registroCriado,
    })

    return;
  }

  response.status(404).json({
    message: 'Ainda não temos nada no GET, mas no POST tem!'
  })
}