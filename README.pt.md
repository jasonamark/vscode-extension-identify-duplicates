# Uma Extensão do Visual Studio Code para Identificar Código Duplicado

Esta extensão identifica definições de objetos duplicados no seu código. Ela analisa o seu projeto em busca de:

- Corpos de métodos
- Declarações de interfaces
- Estruturas enum
- Definições de classes CSS

## Funcionalidades

- **Listagem em Visualização em Árvore**: Veja regras CSS idênticas, definições de interfaces, enums e métodos agrupados por tipo.
- **Navegação de Arquivos**: Clique em um item na visualização em árvore para abrir o arquivo e posicionar o cursor na definição.
- **Atualização Manual**: Use o botão de atualização no topo da visualização em árvore para atualizar a lista após fazer alterações nos arquivos.
- **Exclusão Automática**: Ignora arquivos localizados no diretório node_modules e qualquer diretório prefixado com um '.'.

## O que há de novo na versão 1.1.3

- **Definir Diretório Raiz**: Configure o caminho do diretório raiz para sua análise.
- **Exclusão de Diretórios**: Especifique diretórios a serem excluídos da análise do repositório.

## Uso

![Visualização do Repositório](https://github.com/jasonamark/jasonamark/raw/main/identify-duplicates.gif)

## Por que esta Extensão é Útil

Ao identificar objetos duplicados, esta extensão ajuda você a eliminar redundâncias, tornando sua base de código mais limpa e fácil de manter.

## Funcionalidades em Desenvolvimento

- **Recarga Automática**: Atualize automaticamente a lista de duplicados sempre que os arquivos forem salvos.

## Comentários

Valorizo seus comentários e sugestões! Se você encontrar algum problema, tiver perguntas ou quiser propor novas funcionalidades, envie-me um e-mail para [jason.a.mark@gmail.com](jason.a.mark@gmail.com).

## Apoie-me
Se você acha esta extensão útil e gostaria de apoiar meu trabalho, considere me comprar um café! Suas contribuições me ajudam a continuar melhorando e mantendo a extensão.

[!["Compre-me um Café"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/jasonamark8)

Obrigado pelo seu apoio!
