---
title: SOLID principles with Golang
created: 2024-03-12
image: '/assets/solid/intro.jpg'
tags:
  - golang
  - theory
---

This series aims to simply explain the SOLID principles implementation tactics with golang. With the use of metaphor and analogy, we can understand the purpose of each principle and how golang makes it easy to use them to write clean, easily maintainable code.

## Single Responsibility Principle (SRP)

![Giant Machine vs. Specific Workers](/assets/solid/singleresponsibility-giant.jpg)

### The Tale of the Overburdened Struct

Imagine, in a faraway land called *Codebase*, a very overzealous `struct` called *Monolith* who handled all the tasks of the realm. He was baking bread for the entire village, stitching clothes, and forging tool. When the village was small, he processed his tasks with difficulty but in time. As the village grew, and the demand kept rising, *Monolith* found himself in a world of pain. He simply could not think, burning the bread, ripping the fabric, and melting the tools.

When everything seemed lost and the village was at the brink of chaos, a saviour named *Refactor* came and helped *Monolith*. He introduced him to the **Single Responsibility Principle**, a very powerful spell that tells a `struct` to perform only one job.

A lot of new `structs` emerged from the villagers, each an expert in their craft : *Baker Bob*, *Tailor Tess*, *Blacksmith Ben* and much more. From this point, the village could grow infinitely, every new villager bringing their own ability to the realm. Even better, when the villagers demanded cake instead of bread, *Baker Bob* could easily change his baking routine without affecting *Tailor Tess* or *Blacksmith Ben*.

### Example

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

In this tale, `Monolith` learned the importance of SRP, leading to a more organised and efficient kingdom of *Codebase*.

## Open/Closed Principle (OCP)

![Inn Logger Tavern](/assets/solid/openclose-inn.jpg)

### The adventure of the extensible tavern

In the land of *Codebase*, there was a renowned tavern where everyone would gather to share their heroic tales. The tavern, known as *The Logger Inn*, was famous for its ability to log tales of adventures and daily gossip.
The innkeeper, a `stuct` named *Logger*, despite his best efforts, could only tell tales orally. The travellers were more and more in demand of scrolls, tapisseries, and other way to understand the tales. *Logger* was in bit of a pickle, as he was not equipped to deliver the stories in different formats.
One day, a mysterious traveler, wearing the cloak of **Abstraction**, visited the inn. Understanding the innkeeper's dilemma, he introduced *Logger* to the **Open/Closed Principle**. **OCP**, a powerful enchantment, stated that entities should be open for extension but closed for modification. That meant *Logger* could use new story telling format without altering the core structure of the tavern.
With the new enchantment, the tavern permitted the traveler to tell their stories to the innkeeper, who could save them in any format he wanted. The travellers then would be able to use the format they wanted, like stone, scroll, or even magical projection.
The village rejoiced as *The Logger Inn* became more popular than ever, serving as a testament to the flexibility and foresight provided by the **Open/Closed Principle**.

### Example

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

In this adventure, *The Logger Inn* learned to embrace change and extend its capabilities, all thanks to the **Open/Closed Principle**, ensuring it remained a beloved landmark in *Codebase* for years to come.

## Liskov Substitution Principle (LSP)

![Guild of shapes](/assets/solid/liskov-shapes.jpg)

### The Parable of the Shape Shifter

*Codebase* was home to a very special guild : the *guild of Shapes*. Each shape had a unique power, but they all coexisted in harmony and unity under their wise and abstract guru, *Shape*.  Every member of the guild had to adhere to him, making shapes like *Rectangle* and *Square* live in peace under the same reality.

However, turmoil arose when *Square*, driven by its ego, tried to inherit the form of *Rectangle*. At first, this seemed normal, for are not all squares rectangles by nature ? But when *Square* tried to change the length of his side independently from each other, the sheer fabric of reality could not bare this blasphemy.

*Shape* seek the guidance of his predecessor, *Liskov*, the wisest and most intelligent entity in all *Codebase*. He proposed a principle, called from then the **Liskov Substitution Principle (LSP)**, to the guild. This rule stated that entities from a superclass should be replaceable with entities of a subclass without affecting the fabric of reality.

*Square* and *Rectangle* realised the power behind *Liskov*'s word, and decided they should never pretend to be each other. Instead, they found a common ground, a more abstract essence that they could share without sacrificing the equilibrium of reality. Thus, *Polygon* was born. Peace and order were restored in *Codebase*, thanks to **LSP**.

### Example

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

In this parable, the guild of shapes learned the importance of the **Liskov Substitution Principle**, ensuring that their world remained a place where all shapes could coexist in harmony, each contributing to the beauty of Codebase without losing their essence.

## Interface Segregation Principle (ISP)

![The burdened traveler and the specialized one](/assets/solid/interface-segregation.jpg)

### The fable of the Over-Encumbered Traveler

In the vast and varied landscape of *Codebase*, there lived a traveler named *MultiTool*. *MultiTool* was renowned for its versatility, he could do everything anybody ever asked him to do. He had an array of functions to aid in any conceivable situation, from opening bottles to sending messages accros dimensions, *MultiTool* could do it all. But there was a cost to *MultiTool* versatility : every tool he had to carry weighted him down, making him slower and slower, and he knew that he was facing static death if he pursued his path in this form. 

*Ivy*, a wise artisan of *Codebase*, saw the burdened traveler entering his village. He advised *MultiTool* to use a very powerful technique, called the **Interface Segregation Principle (ISP)**. This principle suggested that no client should be forced to depend on methods he does not use. In essence, it was better to have many smaller, focused interfaces (tools) than one large, catch-all interface.

With *Ivy*'s guidance, *MultiTool* was reimagined into a collection of specialised tools, each serving a specific and distinct purpose. *BottleOpener*, *MessageSender*, *FireStarter* were born. They each traveled the land much with immensely greater speed, catering the need of every inhabitant of *Codebase*.

The transformation was a revelation. The inhabitants of *Codebase* marvelled at the elegance and simplicity of the specialised tools, each perfectly designed for its task. `MultiTool`, now a harmonious assembly of focused tools, found new purpose, serving the needs of the community without the weight of superfluous duties.

### Example
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

In this fable, the Interface Segregation Principle illuminated the path to simplicity and efficiency, allowing `MultiTool` and the inhabitants of Codeville to thrive, each according to their needs, without the burden of unnecessary complexity.

## Dependency Inversion Principle (DIP)

![Hall with magic connections](/assets/solid/dependency-inversion.jpg)

### The Saga of the Enlightened Village

In the verdant valleys of *Codebase*, there existed a village renowned for its craftsmanship, known as *Modularville*. The villagers, skilled artisans and builders, prided themselves on creating structures that stood the test of time. However, as the village grew, so did the complexity of their creations, leading to a web of dependencies that threatened the very integrity of their work.

At the heart of the village's woes was the Great Hall, a magnificent structure that relied heavily on the StoneQuarry for its materials. The builders of the Great Hall had directly intertwined its structure with the workings of the StoneQuarry, making any change in the quarry a potential catastrophe for the hall's stability.

Seeing the precarious situation, a wise architect named *Dianne* introduced the villagers to the **Dependency Inversion Principle (DIP)**. **DIP**, a principle as profound as the deepest mines, stated that high-level modules should not depend on low-level modules, but both should depend on abstractions. Furthermore, abstractions should not depend on details, but details should depend on abstractions.

Inspired by *Dianne*'s wisdom, the villagers set out to redefine their approach. They introduced an interface, `MaterialSupplier`, an abstraction that outlined the methods for supplying materials without specifying the source. The Great Hall and the StoneQuarry were then adapted to depend on this interface, decoupling their direct relationship and allowing for greater flexibility and resilience in the face of change.

As a result, *Modularville* flourished like never before. The Great Hall stood tall and proud, no longer at the mercy of the StoneQuarry's fluctuations. The villagers learned to embrace change, confident in the knowledge that their structures were built on the solid foundation of abstraction.

### Example 

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

In the saga of *Modularville*, the Dependency Inversion Principle illuminated the path to a future where change was not feared but embraced, ensuring that the craftsmanship of the village would endure for generations to come, a testament to the wisdom of abstraction and the strength of flexibility.

## Conclusion

The application of these principles should not be systematic and direct. The developper should understand each of their usefulness, alongside their potential risk. The developper is responsible for the efficiency and functionality of his application, and these principles help streamline the process of the codebase architectural step, and provide a clear mental structure for the life of the app.
