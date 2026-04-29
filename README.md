# 📦 Courier & Bank API - Design Patterns Challenge

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Apache Kafka](https://img.shields.io/badge/Apache%20Kafka-000?style=for-the-badge&logo=apachekafka&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

Este repositorio contiene la resolución del **Courier API Challenge**, un proyecto diseñado para demostrar el dominio de patrones de diseño avanzados, arquitectura limpia y sistemas distribuidos.

---

## 🏗️ Arquitectura del Proyecto

El proyecto sigue los principios de **Arquitectura Hexagonal (Ports & Adapters)**, garantizando que la lógica de negocio sea independiente de los frameworks, bases de datos o servicios externos.

### Capas Principales:
- **Domain:** Entidades de negocio y lógica pura.
- **Application:** Casos de uso (Use Cases) y definición de puertos (Interfaces).
- **Infrastructure:** Implementaciones concretas (TypeORM, Kafka, NestJS Controllers).

---

## 🚀 Patrones de Diseño Implementados

### 1. Patrón Strategy (Shipping Modalities)
Se implementaron 4 estrategias diferentes para el cálculo de costos y validación de envíos, permitiendo que el sistema sea escalable sin modificar el código existente (Principio Open/Closed).
- `STANDARD`: Costo por peso (mínimo $5,000).
- `EXPRESS`: Costo fijo para entregas rápidas.
- `INTERNATIONAL`: Manejo de aduanas y declaraciones.
- `THIRD_PARTY_CARRIER`: Integración con transportadoras externas (DHL, FedEx, etc).

### 2. Patrón Observer (Event-Driven with Kafka)
El sistema utiliza un enfoque basado en eventos para desacoplar procesos secundarios.
- **Publisher:** Emite eventos cuando un envío cambia de estado.
- **Consumers:** 
  - `NotificationsConsumer`: Simula el envío de alertas en tiempo real.
  - `AuditConsumer`: Registra la traza técnica de cada transacción para cumplimiento y auditoría.

---

## 🐳 Infraestructura & Ejecución

Todo el entorno está containerizado para garantizar que funcione en cualquier máquina "out of the box".

### Requisitos:
- Docker & Docker Compose
- Node.js (v18+)

### Guía Rápida:
1. **Clonar y Entrar:**
   ```bash
   git clone <tu-repo-url>
   cd canteras-2-semana-2-patrones-de-dise-o-bank/courier-api
   ```
2. **Levantar Servicios (DB & Kafka):**
   ```bash
   docker-compose up -d
   ```
3. **Instalar y Correr:**
   ```bash
   npm install
   npm run start:dev
   ```

---

## 🛠️ Herramientas de Desarrollo

- **Swagger UI:** Documentación interactiva disponible en `http://localhost:3000/api/docs`
- **Postman:** Colección lista para importar en `courier-api/postman-collection.json`
- **Clean Code:** Aplicación estricta de principios SOLID y metodologías ágiles.

---

## 👨‍🏫 Créditos
Proyecto base proporcionado por **Sofka University** para el entrenamiento de Canteras | Enfoque para desarrolladores en patrones de diseño y arquitectura de software. .

---
> "La calidad del código es un reflejo de la calidad del pensamiento."
