# 🚚 Courier API - Technical Documentation

Esta es la implementación técnica del **Courier Challenge**, desarrollada con **NestJS**, **TypeORM** y **Kafka**.

## 🛠️ Tecnologías
- **Runtime:** Node.js v18+
- **Framework:** NestJS
- **Base de Datos:** PostgreSQL
- **Mensajería:** Apache Kafka (KafkaJS)
- **Documentación:** Swagger / OpenAPI

---

## 🚀 Endpoints Principales

### Customers
- `POST /api/customers`: Crear un nuevo cliente (SENDER o ADMIN).
- `GET /api/customers`: Listar todos los clientes.
- `GET /api/customers/:id`: Obtener detalle de un cliente.

### Shipments
- `POST /api/shipments`: Crear un nuevo envío.
- `GET /api/shipments/:id`: Consultar estado de un envío.
- `GET /api/shipments/customer/:customerId`: Historial de envíos por cliente.
- `PATCH /api/shipments/:id/status`: Actualizar estado (dispara eventos de Kafka).

---

## 📋 Ejemplos de Payload (JSON)

### Crear Envío (POST /api/shipments)
```json
{
  "senderId": "UUID-AQUÍ",
  "recipientId": "UUID-AQUÍ",
  "weight": 10.5,
  "declaredValue": 50000,
  "type": "STANDARD",
  "originAddress": "Calle 123, Bogotá",
  "destinationAddress": "Av. Siempre Viva 742"
}
```
*Tipos válidos: `STANDARD`, `EXPRESS`, `INTERNATIONAL`, `THIRD_PARTY_CARRIER`*

---

## 🧠 Implementación de Patrones

### Strategy Pattern
La lógica de cálculo de costos se encuentra en `src/shipments/application/strategies/`. Cada clase implementa la interfaz `ShippingStrategy`:
- `StandardShippingStrategy`: $2,000 por kg (mínimo $5,000).
- `ExpressShippingStrategy`: Costo base $15,000.
- `InternationalShippingStrategy`: $5,000 por kg + arancel del 15%.
- `ThirdPartyCarrierStrategy`: Tarifa plana $25,000.

### Observer Pattern (Kafka)
Los eventos se emiten al topic `shipment.events`. Los consumidores configurados son:
- **ShipmentEventsConsumer:** Maneja la lógica de notificaciones simuladas.
- **AuditEventsConsumer:** Registra cada cambio de estado para trazabilidad técnica.

---

## 🧪 Pruebas
1. Levantar la infraestructura: `docker-compose up -d` (en la raíz).
2. Ejecutar la app: `npm run start:dev`.
3. Abrir Swagger: `http://localhost:3000/api/docs`.
4. Importar Colección de Postman: `./postman-collection.json`.

---
*Desarrollado como parte del entrenamiento de Canteras para Sofka | Patrones de Diseño - SofkaU.*
