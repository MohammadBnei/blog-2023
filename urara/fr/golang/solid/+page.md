---
title: Les principes SOLID avec Golang
created: 2024-03-12
image: '/assets/solid/intro.jpg'
tags:
  - golang
  - théorie
---

Cette série vise à expliquer simplement les tactiques d'implémentation des principes SOLID avec golang. En utilisant la métaphore et l'analogie, nous pouvons comprendre le but de chaque principe et comment golang facilite leur utilisation pour écrire un code propre et facilement maintenable.

## Single Responsibility Principle (SRP) (Principe de Responsabilité Unique)

![Giant Machine vs. Specific Workers](/assets/solid/singleresponsibility-giant.jpg)

### Le Conte du Struct Surmené

Imaginez, dans un pays lointain appelé *Codebase*, une `struct` très zélée appelée *Monolith* qui gérait toutes les tâches du royaume. Elle cuisait le pain pour tout le village, cousait les vêtements et forgeait les outils. Quand le village était petit, elle accomplissait ses tâches difficilement mais à temps. À mesure que le village grandissait, et que la demande augmentait, *Monolith* se retrouvait dans un monde de douleur. Elle ne pouvait tout simplement pas réfléchir, brûlant le pain, déchirant le tissu et fondant les outils.

Quand tout semblait perdu et que le village était au bord du chaos, un sauveur nommé *Refactor* vint et aida *Monolith*. Il lui présenta le **Single Responsibility Principle**, un sort très puissant qui dit à une `struct` de n'effectuer qu'une seule tâche.

Beaucoup de nouvelles `structs` émergèrent des villageois, chacun expert dans son métier : *Baker Bob*, *Tailor Tess*, *Blacksmith Ben* et bien d'autres. À partir de ce moment, le village pouvait croître indéfiniment, chaque nouveau villageois apportant sa propre capacité au royaume. Mieux encore, lorsque les villageois demandaient du gâteau au lieu du pain, *Baker Bob* pouvait facilement changer sa routine de cuisson sans affecter *Tailor Tess* ou *Blacksmith Ben*.

### Exemple

```go
// Before: A struct with multiple responsibilities
type Monolith struct {
    // Contains user data, business logic, and database interaction logic
}

// After: Applying SRP

// Handles user data
type UserDataHandler struct {
    // User data fields
}

func (u *UserDataHandler) ProcessUserData() {
    // Process user data
}

// Processes business logic
type BusinessLogicProcessor struct {
    // Business logic fields
}

func (b *BusinessLogicProcessor) ExecuteBusinessLogic() {
    // Execute business logic
}

// Manages database interactions
type DatabaseManager struct {
    // Database interaction fields
}

func (d *DatabaseManager) ManageDatabase() {
    // Handle database interactions
}
```

Dans cette histoire, `Monolith` apprit l'importance du SRP, conduisant à un royaume de *Codebase* plus efficace et organisé.

## Open/Closed Principle (OCP) (Principe Ouvert/Fermé)

![Inn Logger Tavern](/assets/solid/openclose-inn.jpg)

### L'aventure de la taverne extensible

Dans le pays de *Codebase*, il y avait une taverne renommée où tout le monde se rassemblait pour partager ses récits héroïques. La taverne, connue sous le nom de *The Logger Inn*, était célèbre pour sa capacité à enregistrer les contes d'aventures et les potins quotidiens.

Le tavernier, une `struct` nommé *Logger*, malgré ses meilleurs efforts, ne pouvait raconter les contes qu'oralement. Les voyageurs étaient de plus en plus demandeurs de parchemins, de tapisseries et d'autres moyens de comprendre les contes. *Logger* était dans une impasse, car il n'était pas équipé pour livrer les histoires dans différents formats.

Un jour, un voyageur mystérieux, portant la cape d'**Abstraction**, visita l'auberge. Comprenant le dilemme du tavernier, il présenta à *Logger* le **Open/Closed Principle**. **OCP**, un enchantement puissant, stipulait que les entités devraient être ouvertes à l'extension mais fermées à la modification. Cela signifiait que *Logger* pouvait utiliser de nouveaux formats de narration sans altérer la structure principale de la taverne.

Avec ce nouvel enchantement, la taverne permettait au voyageur de raconter leurs histoires au tavernier, qui pouvait les traiter dans le format qu'il souhaitait. Le village se réjouit car *The Logger Inn* devint plus populaire que jamais, servant de témoignage à la flexibilité et à la prévoyance fournies par le **Open/Closed Principle**.

### Exemple

```go
// LogStrategy defines the interface for logging methods
type LogStrategy interface {
    Log(message string)
}

// ConsoleLogger logs messages to the console
type ConsoleLogger struct{}

func (c *ConsoleLogger) Log(message string) {
    fmt.Println("Console log:", message)
}

// FileLogger logs messages to a file
type FileLogger struct {
    FileName string
}

func (f *FileLogger) Log(message string) {
    // Append message to file (simplified for brevity)
    fmt.Println("Logging to file:", f.FileName, "Message:", message)
}

// Logger uses LogStrategy to log messages
type Logger struct {
    Strategy LogStrategy
}

func (l *Logger) Log(message string) {
    l.Strategy.Log(message)
}

// Usage
func main() {
    consoleLogger := &ConsoleLogger{}
    fileLogger := &FileLogger{FileName: "adventures.log"}

    logger := Logger{Strategy: consoleLogger}
    logger.Log("A brave adventurer entered the tavern.")

    logger.Strategy = fileLogger
    logger.Log("The adventurer shared a tale of a dragon.")
}
```

Dans cette aventure, *The Logger Inn* a appris à embrasser le changement et à étendre ses capacités, tout cela grâce au **Open/Closed Principle**, s'assurant qu'elle reste un point de repère aimé dans *Codebase* pour les années à venir.

## Liskov Substitution Principle (LSP) (Principe de Substitution de Liskov)

![Guild of shapes](/assets/solid/liskov-shapes.jpg)

### La Parabole du Changeur de Forme

*Codebase* abritait une guilde très spéciale : la *guilde des Formes*. Chaque forme avait un pouvoir unique, mais elles coexistaient toutes en harmonie et unies sous leur sage et abstrait gourou, *Shape*. Chaque membre de la guilde devait lui adhérer, permettant à des formes comme *Rectangle* et *Square* de vivre en paix dans la même réalité.

Cependant, des troubles surgirent lorsque *Square*, poussé par son ego, tenta d'hériter de la forme de *Rectangle*. Au début, cela semblait normal, car les carrés ne sont-ils pas des rectangles par nature ? Mais lorsque *Square* tenta de changer la longueur d'un de ses côté indépendamment l'un de l'autre, le tissu même de la réalité ne pouvait supporter ce blasphème.

*Shape* chercha la guidance de son prédécesseur, *Liskov*, l'entité la plus sage et la plus intelligente de tout *Codebase*. Il proposa un principe, appelé depuis le **Liskov Substitution Principle (LSP)**, à la guilde. Cette règle stipulait que les entités d'une superclasse devaient être remplaçables par les entités d'une sous-classe sans affecter le tissu de la réalité.

*Square* et *Rectangle* réalisèrent la puissance derrière les mots de *Liskov*, et décidèrent que l'un ne devaient jamais prétendre être l'autre. Au lieu de cela, ils trouvèrent un terrain d'entente, une essence plus abstraite qu'ils pourraient partager sans sacrifier l'équilibre de la réalité. Ainsi, *Polygon* naquit. La paix et l'ordre furent restaurés dans *Codebase*, grâce au **LSP**.

### Exemple

```go
// Polygon provides a common interface for all shapes
type Polygon interface {
    Area() float64
}

// Rectangle implements Polygon, representing a rectangle
type Rectangle struct {
    Width, Height float64
}

func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

// Square implements Polygon, representing a square
type Square struct {
    SideLength float64
}

func (s Square) Area() float64 {
    return s.SideLength * s.SideLength
}

// CalculateTotalArea calculates the total area of multiple polygons
func CalculateTotalArea(polygons []Polygon) float64 {
    var totalArea float64
    for _, polygon := range polygons {
        totalArea += polygon.Area()
    }
    return totalArea
}

// Usage
func main() {
    rectangle := Rectangle{Width: 4, Height: 5}
    square := Square{SideLength: 4}

    polygons := []Polygon{rectangle, square}
    totalArea := CalculateTotalArea(polygons)
    fmt.Printf("The total area is: %f\n", totalArea)
}
```

Dans cette parabole, la guilde des formes a appris l'importance du **Liskov Substitution Principle**, assurant que leur monde reste un lieu où toutes les formes peuvent coexister en harmonie, chacune contribuant à la beauté de Codebase sans perdre leur essence.

## Interface Segregation Principle (ISP) (Principe de Ségrégation des Interfaces)

![The burdened traveler and the specialized one](/assets/solid/interface-segregation.jpg)

### La fable du Voyageur Surmené

Dans le vaste et varié paysage de *Codebase*, vivait un voyageur nommé *MultiTool*. *MultiTool* était renommé pour sa polyvalence, il pouvait faire tout ce que quiconque lui demandait. Il disposait d'un éventail de fonctions pour aider dans toute situation imaginable, de l'ouverture de bouteilles à l'envoi de messages à travers les dimensions, *MultiTool* pouvait tout faire. Mais il y avait un coût à la polyvalence de *MultiTool* : chaque outil qu'il devait porter le ralentissait, le rendant de plus en plus lent, et il savait qu'il faisait face à une mort statique s'il poursuivait son chemin sous cette forme.

*Ivy*, un artisan sage de *Codebase*, vit le voyageur surmené entrer dans son village. Il conseilla à *MultiTool* d'utiliser une technique très puissante, appelée le **Interface Segregation Principle (ISP)**. Ce principe suggérait qu'aucun client ne devrait être forcé de dépendre de méthodes qu'il n'utilise pas. En essence, il valait mieux avoir de nombreuses interfaces (outils) plus petites et ciblées  qu'une seule grande interface fourre-tout.

Avec les conseils d'*Ivy*, *MultiTool* fut réimaginé en une collection d'outils spécialisés, chacun servant un but spécifique et distinct. *BottleOpener*, *MessageSender*, *FireStarter* naquirent. Ils parcouraient chacun le pays avec une vitesse immensément plus grande, répondant aux besoins de chaque habitant de *Codebase*.

La transformation fut une révélation. Les habitants de *Codebase* s'émerveillèrent de l'élégance et de la simplicité des outils spécialisés, chacun parfaitement conçu pour sa tâche. `MultiTool`, désormais un ensemble harmonieux d'outils ciblés, trouva un nouveau but, servant les besoins de la communauté sans le poids des devoirs superflus.

### Exemple

```go
// Before: A monolithic interface
type MultiTool interface {
    OpenBottle()
    SendMessage(message string)
    StartFire()
}

// After: Applying ISP

// BottleOpener interface for opening bottles
type BottleOpener interface {
    OpenBottle()
}

// MessageSender interface for sending messages
type MessageSender interface {
    SendMessage(message string)
}

// FireStarter interface for starting fires
type FireStarter interface {
    StartFire()
}

// Implementations of specialized tools
type SimpleOpener struct{}

func (s SimpleOpener) OpenBottle() {
    fmt.Println("Bottle opened.")
}

type Radio struct{}

func (r Radio) SendMessage(message string) {
    fmt.Println("Sending message:", message)
}

type FlintAndSteel struct{}

func (f FlintAndSteel) StartFire() {
    fmt.Println("Fire started.")
}

// Usage
func main() {
    opener := SimpleOpener{}
    radio := Radio{}
    fireStarter := FlintAndSteel{}

    opener.OpenBottle()
    radio.SendMessage("Hello, Codebase!")
    fireStarter.StartFire()
}
```

Dans cette fable, le Interface Segregation Principle a éclairé le chemin vers la simplicité et l'efficacité, permettant à `MultiTool` et aux habitants de Codeville de prospérer, chacun selon ses besoins, sans le fardeau de la complexité inutile.

## Dependency Inversion Principle (DIP) (Principe d'Inversion de Dépendance)

![Hall with magic connections](/assets/solid/dependency-inversion.jpg)

### La Saga du Village Éclairé

Dans les vallées verdoyantes de *Codebase*, existait un village renommé pour son artisanat, connu sous le nom de *Modularville*. Les villageois, artisans et bâtisseurs qualifiés, étaient fiers de créer des structures qui résistaient à l'épreuve du temps. Cependant, à mesure que le village grandissait, la complexité de leurs créations augmentait également, menant à un réseau de dépendances qui menaçait l'intégrité même de leur travail.

Au cœur des problèmes du village se trouvait la Grande Salle, une structure magnifique qui dépendait fortement de la Carrière de Pierre pour ses matériaux. Les bâtisseurs de la Grande Salle avaient directement entrelacé sa structure avec le fonctionnement de la Carrière de Pierre, rendant tout changement dans la carrière une catastrophe potentielle pour la stabilité de la salle.

Voyant la situation précaire, une architecte sage nommée *Dianne* introduisit les villageois au **Dependency Inversion Principle (DIP)**. **DIP** stipulait que les modules de haut niveau ne devraient pas dépendre des modules de bas niveau, mais que les deux devraient dépendre des abstractions. De plus, les abstractions ne devraient pas dépendre des détails, mais les détails devraient dépendre des abstractions.

Inspirés par la sagesse de *Dianne*, les villageois se mirent à redéfinir leur approche. Ils introduisirent une interface, `MaterialSupplier`, une abstraction qui définissait les méthodes pour fournir des matériaux sans spécifier la source. La Grande Salle et la Carrière de Pierre furent alors adaptées pour dépendre de cette interface, déliant leur relation directe et permettant une plus grande flexibilité et résilience face au changement.

En conséquence, *Modularville* prospéra comme jamais auparavant. La Grande Salle se dressait fière, n'étant plus à la merci des fluctuations de la Carrière de Pierre. Les villageois apprirent à embrasser le changement, confiants dans le fait que leurs structures étaient construites sur la solide fondation de l'abstraction.

### Exemple

```go
// MaterialSupplier defines the interface for supplying building materials
type MaterialSupplier interface {
    SupplyMaterials() string
}

// StoneQuarry implements MaterialSupplier, providing stone materials
type StoneQuarry struct{}

func (s StoneQuarry) SupplyMaterials() string {
    return "Stone"
}

// LumberMill implements MaterialSupplier, providing wood materials
type LumberMill struct{}

func (l LumberMill) SupplyMaterials() string {
    return "Wood"
}

// GreatHall represents a high-level module that depends on MaterialSupplier
type GreatHall struct {
    supplier MaterialSupplier
}

func (g *GreatHall) Construct() {
    materials := g.supplier.SupplyMaterials()
    fmt.Printf("Constructing Great Hall with %s\n", materials)
}

// Usage
func main() {
    stoneQuarry := StoneQuarry{}
    lumberMill := LumberMill{}

    greatHallWithStone := GreatHall{supplier: stoneQuarry}
    greatHallWithStone.Construct()

    greatHallWithWood := GreatHall{supplier: lumberMill}
    greatHallWithWood.Construct()
}
```

Dans la saga de *Modularville*, le Dependency Inversion Principle a illuminé le chemin vers un avenir où le changement n'était pas craint mais embrassé, assurant que l'artisanat du village perdurerait pour les générations à venir, un témoignage de la sagesse de l'abstraction et de la force de la flexibilité.

## Conclusion

L'application de ces principes ne devrait pas être systématique et directe. Le développeur doit comprendre chacune de leur utilité, à côté de leurs risques potentiels. Le développeur est responsable de l'efficacité et de la fonctionnalité de son application, et ces principes aident à rationaliser le processus de l'étape architecturale de la base de code, et fournissent une structure mentale claire pour la vie de l'application.
