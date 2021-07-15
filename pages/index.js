import React, { useState, useEffect } from 'react'

import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'

function ProfileSidebar(propriedades) {
  return (
    <Box >
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}.png`}>
          @{propriedades.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(propriedades) {
  // console.log(propriedades)
  const seguidores = propriedades.items;
  // console.log('ssjhjk',seguidores)
  const listarSeisSeguidores = seguidores.slice(0,6);
  // console.log('6 Elementos: ', mostrar6Seguidores);

  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>

      <ul>
        {/* {propriedades.items.map((itemAtual) => { */}
        {listarSeisSeguidores.map((itemAtual) => {
          return (
            <li key={itemAtual.id}>
              <a href={`https://github.com/${itemAtual.title}.png`}>
                <img src={itemAtual.avatar_url} />
                <span>{itemAtual.title}</span>
              </a>
            </li>
          )
        })}
      </ul> 
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home() {
  const usuarioAleatorio = 'gustavo-gnunes';
  const [comunidades, setComunidades] = useState([])
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ]

  const [seguidores, setSeguidores] = useState([]);
  // pegar o array de dados do github
  useEffect(() => {
    // GET
    // fetch-> faz a chamada para pegar os dados da api
    // throw new Error-> erro 404, que é erro que não encontrou a página, ou o link está errado ou a página não existe ou está sem internet, etc..
    // then-> faz o fetch, então retorna algo (esses dados vem de pedacinho em pedacinho)
    // resposta.json-> converte todos os pedacinhos dados usados em js
    // then-> espera converter todos esses pedacinhos e retorna algo
    // catch-> caso der errado algo, mostra o erro

    // API do github
    fetch('https://api.github.com/users/peas/followers')
    .then((respostaDoServidor) => {
      return respostaDoServidor.json();
    })
    .then((respostaCompleta) => {
      setSeguidores(respostaCompleta);
    })

    // API GraphQl - DatoCMS
    fetch('https://graphql.datocms.com/', {
      method: 'POST', // por padrão é GET
      headers: {
        'Authorization': 'ce68f848e6bc447e85293a6cfbe916', // esse token foi pego lá DatoCMS-> Configuração-> Tokens da API-> Read-only API token
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // essa query pega no DatoCMS-> API Explorer-> onde faz as buscas para vim os dados cadastrados
      body: JSON.stringify({
        "query": `query {
          allCommunities {
            id
            title
            imageUrl
            creatorSlug
          }
        }`
      })
    }) 
    .then((response) => response.json()) // pega o retorno do reesponse.json() e já retorna
    .then((respostaCompleta) => {
      // data: esse data é padrão o graphql devolver
      // data: é pq no navegador-> inspecionar-> Network-> graphql.datocms.com-> Response, vem esse data
      // allCommunities: está dentro do data, que é o nome que está na consulta, ali em cima
      const comunidadesVindasoDato = respostaCompleta.data.allCommunities // pega todas comunidades cadastradas no Dato
      console.log(comunidadesVindasoDato)
      setComunidades(comunidadesVindasoDato) 
    })
    
  }, [])

  function handleCriaComunidade(e) {
    e.preventDefault();

    const dadosDoForm = new FormData(e.target); // e.target-> para ter acesso a função get, set e outras
    // console.log(dadosDoForm); 
    //pega o que o usuário digitou no input
    console.log('Campo: ', dadosDoForm.get('title')); // title: é o name que foi dado na propriedade do input
    console.log('Campo: ', dadosDoForm.get('image'));
    
    //pega o que o usuário digitou no input
    const comunidade = {
      title: dadosDoForm.get('title'),
      imageUrl: dadosDoForm.get('image'),
      creatorSlug: usuarioAleatorio,
    }

    // chamar o servidor que o next está rodando que foi criado na pasta pages-> api-> comunidades.js
    // conectar o front-end em qq api do back-end
    fetch('/api/comunidades', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comunidade)
    })
    .then(async (response) => {
      const dados = await response.json();
      console.log(dados.registroCriado);
      const comunidade = dados.registroCriado;

      const comunidadesAtualizadas = [...comunidades, comunidade];
      setComunidades(comunidadesAtualizadas);
    })
  }

  return (
    <>
      <AlurakutMenu githubUser={usuarioAleatorio}/>
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box >
            <h1 className="title">
              Bem vindo(a)
            </h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={handleCriaComunidade}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?" 
                  type="text"
                />
              </div>

              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa" 
                />
              </div>
              
              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>

        <div className="profileRelationArea" style={{ gridArea: 'profileRelationArea' }}>
          <ProfileRelationsBox title="Seguidores" items={seguidores} />

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>

            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/communities/${itemAtual.id}`}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul> 
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul> 
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}
