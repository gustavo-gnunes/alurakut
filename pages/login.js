import React, { useState } from 'react';
import { useRouter } from 'next/router';
import nookies from 'nookies';

export default function LoginScreen() {
  const router = useRouter();
  const [githubUser, setGithubUser] = useState('');

  function handleRoute(event) {
    event.preventDefault();

    // API que foi criada pelo alura, para retornar um token do usuário do github
    // esse token é codificado, gera um código que tem informações do nome do usuário do github
    fetch('https://alurakut.vercel.app/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ githubUser: githubUser })
    })
    .then(async (respostaDoServer) => {
      const dadosDaResposta = await respostaDoServer.json();
      const token = dadosDaResposta.token; // pega o token que a api trouxe

      // envia informações para o cookies do navegador
      // armazenar em um cookie, para poder pegar uma informação em outra página
      // 1º parametro: null, 
      // 2º: nome da informação que está salvando "o nome que vai aparecer no inspecionar elemento-> Aplication-> Cookies", 
      // 3º: valor do token, 
      // 4º: path: a partir de onde vai estar disponível para acessar o cookie, maxAge: data de validade do cookie
      nookies.set(null, 'USER_TOKEN', token, {
        path: '/',
        maxAge: 86400 * 7 // 86400 segundos tem um dia
      })

      // navegar da página de login para home
      router.push('/')
    })
  }

  return (
    <main style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <div className="loginScreen">
        <section className="logoArea">
          <img src="https://alurakut.vercel.app/logo.svg" />

          <p><strong>Conecte-se</strong> aos seus amigos e familiares usando recados e mensagens instantâneas</p>
          <p><strong>Conheça</strong> novas pessoas através de amigos de seus amigos e comunidades</p>
          <p><strong>Compartilhe</strong> seus vídeos, fotos e paixões em um só lugar</p>
        </section>

        <section className="formArea">
          <form className="box" onSubmit={handleRoute}>
            <p>
              Acesse agora mesmo com seu usuário do <strong>GitHub</strong>!
          </p>
            <input 
              placeholder="Usuário"
              value={githubUser}
              onChange={(event) => {setGithubUser(event.target.value)}}
            />
            {githubUser.length === 0 ? 'Preencha o campo' : ''}
            <button type="submit">
              Login
          </button>
          </form>

          <footer className="box">
            <p>
              Ainda não é membro? <br />
              <a href="/login">
                <strong>
                  ENTRAR JÁ
              </strong>
              </a>
            </p>
          </footer>
        </section>

        <footer className="footerArea">
          <p>
            © 2021 alura.com.br - <a href="/">Sobre o Orkut.br</a> - <a href="/">Centro de segurança</a> - <a href="/">Privacidade</a> - <a href="/">Termos</a> - <a href="/">Contato</a>
          </p>
        </footer>
      </div>
    </main>
  )
} 