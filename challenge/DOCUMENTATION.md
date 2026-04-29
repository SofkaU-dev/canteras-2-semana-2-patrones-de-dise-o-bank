# Documentación Técnica — Courier API Challenge

Este documento detalla la implementación, arquitectura y patrones de diseño aplicados en el desarrollo de la **Courier API**. El objetivo de este proyecto es gestionar clientes y envíos de paquetes utilizando principios de ingeniería de software avanzados para garantizar escalabilidad, mantenibilidad y desacoplamiento.

---

## 1. Arquitectura Hexagonal (Ports & Adapters)

La arquitectura hexagonal es el pilar de este proyecto. Su objetivo principal es **aislar la lógica de negocio (el Core)** de las tecnologías externas (bases de datos, frameworks, brokers de mensajería).

### Estructura de Carpetas por Módulo:
Cada módulo (`customers`, `shipments`, `shared`, `notifications`) se divide en tres capas:

1.  **Domain (Dominio):** Es el corazón de la aplicación.
    *   **Models:** Define las entidades de negocio (ej. `ShipmentModel`). Son clases puras de TypeScript.
    *   **Ports:** Define las interfaces (contratos) que el dominio necesita para interactuar con el mundo exterior (ej. `ShipmentRepositoryPort`).
    *   **Exceptions:** Excepciones específicas del negocio (ej. `ShipmentNotFoundException`).
2.  **Application (Aplicación):** Coordina las tareas de la aplicación.
    *   **Use Cases:** Implementan la lógica de los procesos (ej. `CreateShipmentUseCase`).
    *   **DTOs:** Objetos de transferencia de datos para la entrada y salida de la API.
    *   **Strategies:** Implementaciones concretas de algoritmos de negocio.
3.  **Infrastructure (Infraestructura):** Implementaciones técnicas.
    *   **Controllers:** Puntos de entrada HTTP (NestJS).
    *   **Persistence:** Implementación de repositorios con TypeORM, entidades de BD y Mappers.
    *   **Adapters:** Implementaciones de ports (ej. `KafkaEventPublisher`).

---

## 2. Patrones de Diseño Aplicados

### A. Patrón Strategy
Se utiliza para gestionar las **4 modalidades de envío**, permitiendo que el sistema sea extensible (Open/Closed Principle). Si se desea agregar un nuevo tipo de envío, solo se crea una nueva clase sin tocar el Use Case.

*   **Port:** `ShippingStrategyPort` define los métodos `validate`, `calculateCost` y `execute`.
*   **Estrategias Concretas:**
    1.  **Standard:** Costo basado en porcentaje (0.1%), peso máx 20kg.
    2.  **Express:** Costo fijo $15,000, peso máx 5kg, valor máx $3M.
    3.  **International:** Costo $50k + 2%, requiere país destino y declaración, estado inicial `IN_CUSTOMS`.
    4.  **Third Party:** Costo 5%, requiere transportadora externa y tracking.

**Flujo:** El `CreateShipmentUseCase` recibe el tipo de envío, busca la estrategia correspondiente en un `Map` y delega la validación y el cálculo del costo.

### B. Patrón Observer (Event-Driven)
Se utiliza para desacoplar el proceso de envío de las tareas secundarias como notificaciones y auditoría.

*   **Sujeto (Publisher):** El Use Case, tras guardar un envío, publica un evento en Kafka a través del `EventPublisherPort`.
*   **Observadores (Consumers):**
    1.  **NotificationsConsumer:** Escucha los eventos y simula el envío de alertas al usuario.
    2.  **AuditConsumer:** Escucha los mismos eventos y registra una traza técnica (offset, partition, timestamp) para cumplimiento legal y técnico.

---

## 3. Flujo de Trabajo (Workflow)

1.  **Entrada:** El cliente envía una petición `POST /api/shipments`.
2.  **Validación de DTO:** NestJS usa `class-validator` para asegurar que los datos tengan el formato correcto.
3.  **Coordinación (Use Case):**
    *   Verifica que el remitente y destinatario existan y estén activos.
    *   Selecciona la **Strategy** según el tipo de envío.
    *   La estrategia valida reglas de negocio (ej. peso excedido).
    *   La estrategia calcula el costo.
4.  **Persistencia:**
    *   El **Mapper** convierte el modelo de dominio a una entidad de TypeORM.
    *   El repositorio guarda en PostgreSQL.
5.  **Evento:** Se publica un mensaje en Kafka según el estado (`shipment.dispatched`, `shipment.in_customs`, etc.).
6.  **Respuesta:** Se devuelve un `201 Created` al cliente con el ID del envío.
7.  **Post-Procesamiento:** Los consumidores de Kafka procesan el evento de forma asíncrona.

---

## 4. Infraestructura y Tecnologías

*   **Framework:** NestJS (Node.js).
*   **Base de Datos:** PostgreSQL.
*   **Broker de Mensajería:** Kafka (vía Confluent Platform).
*   **Documentación:** Swagger (OpenAPI) en `/api/docs`.
*   **Contenedores:** Docker y Docker Compose.

---

## 5. Cómo Ejecutar el Proyecto

### Requisitos Previos
*   Docker y Docker Compose instalados.
*   Node.js v20+ (si deseas correr la app fuera de docker).

### Pasos para Iniciar

1.  **Entrar a la carpeta del proyecto:**
    Es fundamental que todos los comandos se ejecuten dentro de la carpeta `courier-api`, ya que allí se encuentran los archivos de configuración (`package.json`, `docker-compose.yml`, etc.).
    ```bash
    cd courier-api
    ```

2.  **Levantar Infraestructura:**
    ```bash
    docker-compose up -d
    ```
    *Esto iniciará PostgreSQL en el puerto 5432 y Kafka en el 9094.*

3.  **Configurar Variables:**
    Asegúrate de tener un archivo `.env` basado en `.env.example` dentro de la carpeta `courier-api`.

4.  **Instalar Dependencias:**
    ```bash
    npm install
    ```

5.  **Iniciar la Aplicación:**
    ```bash
    npm run start:dev
    ```

5.  **Acceder a Swagger:**
    Abre tu navegador en: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

## 6. Pruebas con Postman

Se ha incluido una colección en `postman-collection.json` con:
*   Creación de clientes.
*   Pruebas de las 4 estrategias de envío.
*   Casos de error (ej. peso inválido en Express).
*   Actualización de estados.

---

## 7. Sustentación Técnica

*   **Escalabilidad:** Al usar Kafka, podemos añadir más consumidores (ej. un módulo de analítica) sin cambiar el código de envíos.
*   **Mantenibilidad:** La Arquitectura Hexagonal permite cambiar la base de datos (ej. de Postgres a MongoDB) solo creando un nuevo Adapter en Infrastructure, sin tocar la lógica de negocio.
*   **Robustez:** Las estrategias encapsulan reglas complejas, evitando que los Use Cases se conviertan en archivos gigantes llenos de `if/else`.
