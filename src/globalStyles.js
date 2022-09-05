import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    :root {
        --background: #F2F1F6;
    }
    *{
        margin: 0;
        padding: 0;
        outline: 0;
        box-sizing: border-box
    }
    html, body, #root, .App {
      height: 100%;
    }
    html {
        @media (max-width: 1080px){
            font-size: 93.75%; // 15px
        }
        @media (max-widht: 720px) {
            font-size: 87.5%; //14px
        }
        height: 100%;
        overflow: scroll;
        overflow-x: hidden;
  }
  body {
      background: var(--background);
      -webkit-font-smoothing: antialised;
  }
  body, input, textarea, span {
      font-family: 'Roboto', sans-serif;
      font-weight: 400;
      color: var(--text-body);
      height: 2rem;
  }
  h1, h2, h3, h4, h5, h6, strong {
    font-family: 'Roboto', sans-serif;
    font-weight: 600;
    color: var(--text-title);
  }
  button {
    cursor: pointer;
  }
  [disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;