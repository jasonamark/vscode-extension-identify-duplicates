# Eine Visual Studio Code Erweiterung zur Identifizierung von doppeltem Code

Diese Erweiterung identifiziert doppelte Objektdefinitionen in Ihrem Code. Sie durchsucht Ihr Projekt nach redundanten:

- Methodenkörpern
- Schnittstellendeklarationen
- Enum-Strukturen
- CSS-Klassendefinitionen

## Funktionen

- **Baumansicht-Listing**: Anzeigen identischer CSS-Regeln, Schnittstellendefinitionen, Enums und Methoden, gruppiert nach Typ.
- **Dateinavigation**: Klicken Sie auf ein Element in der Baumansicht, um die Datei zu öffnen und den Cursor auf die Definition zu setzen.
- **Manuelles Aktualisieren**: Verwenden Sie die Schaltfläche „Aktualisieren“ oben in der Baumansicht, um die Liste nach Dateiänderungen zu aktualisieren.
- **Automatische Ausschluss**: Ignoriert Dateien im node_modules-Verzeichnis und in jedem Verzeichnis, das mit einem '.' beginnt.

## Was ist neu in 1.1.1

- **Root-Verzeichnis festlegen**: Konfigurieren Sie den Pfad des Root-Verzeichnisses für Ihre Analyse.
- **Verzeichnisausschluss**: Geben Sie Verzeichnisse an, die von der Repository-Analyse ausgeschlossen werden sollen.

## Verwendung

![Repository-Visualisierung](https://github.com/jasonamark/jasonamark/raw/main/identify-duplicates.gif)

## Warum diese Erweiterung hilfreich ist

Durch die Identifizierung doppelter Objekte hilft Ihnen diese Erweiterung, Redundanz zu beseitigen und Ihren Code sauberer und wartbarer zu machen.

## In Entwicklung befindliche Funktionen

- **Hot Reload**: Automatisches Aktualisieren der doppelten Liste bei Speicherung von Dateien.

## Feedback

Ich schätze Ihr Feedback und Ihre Vorschläge! Wenn Sie auf Probleme stoßen, Fragen haben oder neue Funktionen vorschlagen möchten, senden Sie mir bitte eine E-Mail an [jason.a.mark@gmail.com](jason.a.mark@gmail.com).

## Unterstützen Sie mich
Wenn Sie diese Erweiterung hilfreich finden und meine Arbeit unterstützen möchten, können Sie mir gerne einen Kaffee kaufen! Ihre Beiträge helfen mir, die Erweiterung weiter zu verbessern und zu pflegen.

[!["Kaufen Sie mir einen Kaffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/jasonamark8)

Vielen Dank für Ihre Unterstützung!
