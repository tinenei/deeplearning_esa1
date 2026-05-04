# Deep Learning Einsendeaufgabe 1 - Sommersemester 2026
## Thema: Bilderkennung (Klassifikation) mit dem ml5 Framework

**Bearbeitungszeit:** 15–20 Stunden, je nach Vorkenntnissen und Erfahrung.

**Voraussetzungen:** Kapitel 1 und 2 bis einschließlich (Learning from Data).

**Kompetenzerwerb/Lernziele:** Nach der Bearbeitung der Aufgabe sollten Sie:

- Ihr Wissen über Web Anwendung wieder aufgefrischt haben, und besonders durch den Austausch mit anderen neue nützliche Tipps und Frameworks zu diesem Thema hinzugewonnen haben.
- Sie wissen, wie man ein vor-trainiertes KI-Modell für eine Web-Anwendung nutzt.

**Vorbereitung:** Verschaffen Sie sich einen Überblick über das ml5.js Framework. Vollziehen Sie das Image Classification Tutorial nach.

### Aufgabenstellung:

Erweitern Sie das ml5 Image Classification Tutorial (es gibt auch eine neuere Version, siehe Coding und Tutorials)  so, dass ein Nutzer beliebige Bilder klassifizieren kann. Sie verwenden dazu wie im Tutorial ein bestehendes, vor-trainiertes Model. Sie müssen also nichts selber trainieren/anlernen.

A1) Zeigen Sie Beispiel-Bilder, jeweils drei für korrekte und falsche Klassifikation, zusammen mit den Ergebnissen der Klassifikation als Diagramm (siehe Resultate und Visualisierung). Die Klassifikation wird direkt in der Anwendung berechnet. Machen Sie bei der Darstellung deutlich, welche Bilder korrekt oder falsch klassifiziert werden. Die Bilder können aus dem ImageNet Datensatz zum Image Classification Tutorial stammen (siehe Daten) oder von Ihnen kommen. Sie können Bilder auch künstlich modifizieren.

A2) Der Nutzer soll ein eigenes Bild in die Anwendung laden und klassifizieren lassen können (siehe Interaktion).

**Interaktion:** Der Nutzer kann ein Bild zur Klassifikation hochladen oder per Drag-and-drop in die Anwendung ziehen. Dieses wird zunächst dargestellt und dann automatisch oder mittels eines Buttons "Classify" klassifiziert.

**Resultate und Visualisierung:**

Das Netzwerk gibt eine Wahrscheinlichkeitsverteilung aus. Diese Werte kann man als Confidence interpretieren. Diese Confidence sollen Sie als Klassifikationsergebnis ausgeben beziehungsweise darstellen in Form eines Diagramms (Balken-, Pie-, etc.).  In den Diagrammen sollen auch die Zahlenwerte der Confidence in Prozent für die dargestellten Klassen stehen. Zur Visualisieren Ihrer Ergebnisse können Sie Bibliotheken wie z. B. Plotly oder Chart.js nutzen (siehe Libraries).

**Layout:** Stellen Sie Ihre Lösung in zwei Spalten dar, links das Bild und rechts das Diagramm mit der Klassifikation:

R1) Zunächst die drei richtig klassifizierte Bilder übereinander, dann die drei falsch Klassifizierungen.

R2) Darunter das vom Nutzer geladene Bild mit den zugehörigen Interaktionselementen.

**Diskussion:** Diskutieren Sie Ihre Ergebnisse (unter den Resultaten auf der gleichen HTML-Seite, max. 10 Sätze). Was haben Sie beobachtet/gelernt?  Bei welchen Bildern hat die Klassifikation funktioniert und bei welchen nicht und warum ist das wohl so?

**Dokumentation:** Nutzen Sie die gleiche HTML-Seite (unter der Diskussion) wie zur Abgabe Ihrer Lösung zur Dokumentation der folgenden Aspekte:

1) Technisch: Listen Sie alle verwendeten Frameworks auf und erklären Sie kurz (1–3 Sätze) wozu Sie diese verwenden. Dokumentieren Sie technische Besonderheiten Ihrer Lösung.

2) Fachlich: Erläutern Sie Ihre Implementierung der Logik und alles, was für ihre Lösung wichtig ist (Ansatz, Resultate, Quellen, etc.)

Schreiben Sie bitte nichts in die Moodle Abgabe-Felder.

**Anwendung und Abgabe:** Sie erstellen eine Web-Anwendung und stellen diese auf einem öffentlichen Web-Server bereit, siehe Kursplan (siehe Web-Anwendungen und Frameworks: Client-side Web APIs by MDN).

**Hinweise:** Das ml5 Framework ist ein high-level API zu TensorFlow (TF) oder TFJS. Für mehr Kontrolle über die Logik der Anwendung muss eine tiefere Schnittstelle/API gewählt werden.

**Fehlerbehandlung, Test und QA:** Prüfen Sie, dass die Bilder das richtige Format haben.

**User Experience (UX):** Beachten Sie die Human/Mensch-Computer-Interaction (HCI) Kriterien beim Interaktionsdesign: ISO 9241-11 Anforderungen an die Gebrauchstauglichkeit und ISO 9241-110 Interaktionsprinzipien. Ihre Anwendung sollte funktional (Aufgabenangemessenheit) und benutzerfreundlich (Usability) und mit angemessenem Feedback und einer [kontextsensitive] Hilfe ausgestattet sein.

**Gestaltung:** Achten Sie auf eine sinnvolle Semantik bei der Farbgestaltung und ein übersichtliches Layout. Siehe dazu: material.io - Design guidance and code.

**Daten:** ImageNet Datensatz aus dem Tutorial für Beispiel-Bilder (oder suchen Sie einfach nach ImageNet Bildern):

Paper: https://arxiv.org/abs/1409.0575

Dataset: https://www.image-net.org/index.php

Challenges: https://www.image-net.org/challenges/LSVRC/

Paper zu MobileNets for Mobile Vision Applications: https://arxiv.org/abs/1704.04861

**Libraries:** Chart.js, Plotly.

**Coding und Tutorials:** ml5.js Examples (neue Version, aber nicht so ausführlich)

**Arbeitsumgebung:** JS-, HTML-IDE (z. B. Atom, WebStorm, Visual Studio Code), [local] Web-Server.

**Testumgebung:** Chrome [unter macOS].

**Bewertungskriterien und Punkte:**

Bewertet werden Logik, User Experience (UX) und Gestaltung:

1. Funktionsfähigkeit und Vollständigkeit der Anwendung entsprechend der Aufgabenstellung (8 Punkte)
2. Experimente, Resultate und Diskussion. Auswahl von geeigneten und interessanten Beispielen (8 Punkte)
3. Dokumentation, technisch und fachlich (3 Punkte)
4. User Experience (UX) und User Interaktion (HCI, Interaktionsdesign, Dialoggestaltung, Usability, Hilfe) (3 Punkte)
5. Gestaltung und Visualisierung (Farben, Formen, Screen-Layout, Text, Semantik) (3 Punkte)

**Gesamtpunktzahl:** 25 Punkte
