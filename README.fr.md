# Une Extension Visual Studio Code pour Identifier le Code Dupliqué

Cette extension identifie les définitions d'objets dupliqués dans votre code. Elle analyse votre projet pour trouver des redondances dans:

- Les corps de méthodes
- Les déclarations d'interfaces
- Les structures enum
- Les définitions de classes CSS

## Fonctionnalités

- **Liste en Vue Arborescente**: Affichez les règles CSS identiques, les définitions d'interfaces, les enums et les méthodes regroupées par type.
- **Navigation dans les Fichiers**: Cliquez sur un élément de la vue arborescente pour ouvrir le fichier et placer le curseur sur la définition.
- **Rafraîchissement Manuel**: Utilisez le bouton de rafraîchissement en haut de la vue arborescente pour rafraîchir la liste après avoir modifié des fichiers.
- **Exclusion Automatique**: Ignore les fichiers situés dans le répertoire node_modules et tout répertoire commençant par un '.'.

## Quoi de neuf dans la version 1.1.1

- **Définir le Répertoire Racine**: Configurez le chemin du répertoire racine pour votre analyse.
- **Exclusion de Répertoires**: Spécifiez les répertoires à exclure de l'analyse du dépôt.

## Utilisation

![Visualisation du Répertoire](https://github.com/jasonamark/jasonamark/raw/main/identify-duplicates.gif)

## Pourquoi cette Extension est Utile

En identifiant les objets dupliqués, cette extension vous aide à éliminer les redondances, rendant votre base de code plus propre et plus facile à maintenir.

## Fonctionnalités en Développement

- **Rechargement à Chaud**: Rafraîchit automatiquement la liste des doublons à chaque enregistrement de fichiers.

## Retour d'Information

J'apprécie vos retours et suggestions! Si vous rencontrez des problèmes, avez des questions ou souhaitez proposer de nouvelles fonctionnalités, veuillez m'envoyer un e-mail à [jason.a.mark@gmail.com](jason.a.mark@gmail.com).

## Soutenez-moi
Si vous trouvez cette extension utile et souhaitez soutenir mon travail, envisagez de m'acheter un café! Vos contributions m'aident à continuer d'améliorer et de maintenir l'extension.

[!["Achetez-moi un Café"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/jasonamark8)

Merci pour votre soutien!
