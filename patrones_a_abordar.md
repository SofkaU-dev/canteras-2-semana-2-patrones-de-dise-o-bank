🏗️ Arquitectura y Estructura
Arquitectura Hexagonal (Ports and Adapters): El marco principal para desacoplar la lógica de negocio de agentes externos (DB, UI, APIs).

DTO (Data Transfer Object): Utilizado específicamente para no exponer las entidades del dominio hacia las capas externas.

Facade: Un patrón estructural que provee una interfaz simplificada a un cuerpo de código complejo (muy común para exponer servicios del "hexágono").

🧩 Patrones de Diseño (Creacionales y de Comportamiento)
Factory Method: Define una interfaz para crear un objeto, pero deja que las subclases decidan qué clase instanciar.

Builder: Separa la construcción de un objeto complejo de su representación, permitiendo crear diferentes tipos y representaciones.

Strategy: Permite definir un conjunto de algoritmos, encapsular cada uno y hacerlos intercambiables.

Template Method: Define el esqueleto de un algoritmo en una operación, delegando algunos pasos a las subclases.

Observer: Define una dependencia uno-a-muchos para que cuando un objeto cambie de estado, sus dependientes sean notificados.

State: Permite que un objeto altere su comportamiento cuando su estado interno cambia.

🛠️ Conceptos de Dominio y Pruebas
Value Objects: Objetos que no tienen identidad propia y se definen solo por sus atributos (pilar de DDD).

Screenplay: Un patrón de diseño para pruebas automatizadas (especialmente en UI/Acceptance) enfocado en actores, tareas e interacciones.