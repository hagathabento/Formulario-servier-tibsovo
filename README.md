# Formulário Educacional TIBSOVO®

Este projeto é um **Formulário Educacional Interativo** desenvolvido para a Servier, focado no lançamento e educação médica sobre o medicamento **Tibsovo® (Ivosidenibe)**.

A aplicação guia o usuário através de um caso clínico fictício, apresentando vídeos educativos e coletando feedback através de um questionário interativo.

## 🚀 Tecnologias Utilizadas

-   **[Next.js 15](https://nextjs.org/)**: Framework React para produção.
-   **[React](https://reactjs.org/)**: Biblioteca para construção de interfaces de usuário.
-   **[Tailwind CSS](https://tailwindcss.com/)**: Framework CSS utilitário para estilização rápida e responsiva.
-   **[Magic UI](https://magicui.design/)**: Componentes de UI modernos e animados (Particles, Shine Border, Shimmer Button, etc.).
-   **[Framer Motion](https://www.framer.com/motion/)**: Biblioteca para animações fluidas.
-   **[Lucide React](https://lucide.dev/)**: Ícones vetoriais.
-   **PWA (Progressive Web App)**: Configurado para ser instalável em dispositivos móveis e desktop como um aplicativo nativo.

## ✨ Funcionalidades

-   **Fluxo Interativo**:
    1.  **Tela de Boas-vindas**: Coleta do nome do participante.
    2.  **Caso Clínico**: Apresentação dos dados do paciente (Histórico e Exames).
    3.  **Vídeo Introdutório**: Conteúdo educacional inicial.
    4.  **Questionário (Parte 1)**: Perguntas sobre diagnóstico e conduta.
    5.  **Vídeo Intermediário**: Conteúdo adicional após a primeira interação.
    6.  **Questionário (Parte 2)**: Continuação do caso clínico.
    7.  **Vídeo de Encerramento**: Conclusão do caso.
    8.  **Avaliação**: Feedback sobre o evento.
    9.  **Tela Final**: Agradecimento e encerramento.
-   **Design Responsivo**: Otimizado para funcionar perfeitamente em tablets (iPad), celulares e desktops.
-   **Animações**: Transições suaves entre etapas e efeitos visuais para engajamento.
-   **PWA Standalone**: Pode ser instalado na tela inicial e executado sem a barra de navegação do navegador, proporcionando uma experiência imersiva.

## 📱 Como Instalar (PWA)

1.  Acesse a aplicação pelo navegador do seu dispositivo (Chrome, Safari, Edge).
2.  **iOS (Safari)**: Toque no botão "Compartilhar" e selecione "Adicionar à Tela de Início".
3.  **Android (Chrome)**: Toque no menu (três pontos) e selecione "Instalar aplicativo" ou "Adicionar à tela inicial".
4.  O ícone da Servier aparecerá na sua lista de aplicativos.

## 🛠️ Como Executar Localmente

1.  Clone o repositório:
    ```bash
    git clone https://github.com/hagathabento/Formulario-servier-tibsovo.git
    ```
2.  Instale as dependências:
    ```bash
    npm install
    # ou
    yarn install
    ```
3.  Execute o servidor de desenvolvimento:
    ```bash
    npm run dev
    # ou
    yarn dev
    ```
4.  Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📦 Build para Produção

Para criar uma versão otimizada para produção:

```bash
npm run build
npm start
```

## 📄 Licença

Este projeto é de uso exclusivo para fins educacionais da Servier.
