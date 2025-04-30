CREATE DATABASE  IF NOT EXISTS `nomina_guatemalteca` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `nomina_guatemalteca`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: nomina_guatemalteca
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `anticipos_viaticos`
--

DROP TABLE IF EXISTS `anticipos_viaticos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `anticipos_viaticos` (
  `id_anticipo` int NOT NULL AUTO_INCREMENT,
  `id_solicitud` int NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha_entrega` date NOT NULL,
  `metodo_pago` enum('Efectivo','Transferencia','Cheque') COLLATE utf8mb4_unicode_ci NOT NULL,
  `referencia_pago` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entregado_por` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recibido_por` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_anticipo`),
  KEY `id_solicitud` (`id_solicitud`),
  CONSTRAINT `anticipos_viaticos_ibfk_1` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes_viaticos` (`id_solicitud`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `anticipos_viaticos`
--

LOCK TABLES `anticipos_viaticos` WRITE;
/*!40000 ALTER TABLE `anticipos_viaticos` DISABLE KEYS */;
INSERT INTO `anticipos_viaticos` VALUES (1,1,5000.00,'2024-01-12','Transferencia','TRANS-12345','Tesorero','Juan López','Anticipo completo',1,'2025-04-29 20:34:40'),(2,2,3500.00,'2024-02-18','Transferencia','TRANS-23456','Tesorero','Pedro Ramírez','Anticipo completo',1,'2025-04-29 20:34:40'),(3,3,3000.00,'2024-03-10','Cheque','CHQ-78901','Tesorero','Carlos López','Anticipo parcial para auditoría',1,'2025-04-29 20:34:40'),(4,4,4000.00,'2024-03-20','Transferencia','TRANS-34567','Tesorero','José Torres','Anticipo para feria comercial',1,'2025-04-29 20:34:40'),(5,5,1500.00,'2024-04-05','Efectivo',NULL,'Asistente Contable','Miguel Gutiérrez','Anticipo en efectivo para viaje',1,'2025-04-29 20:34:40');
/*!40000 ALTER TABLE `anticipos_viaticos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ausencias`
--

DROP TABLE IF EXISTS `ausencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ausencias` (
  `id_ausencia` int NOT NULL AUTO_INCREMENT,
  `id_empleado` int NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `tipo` enum('Permiso con goce','Permiso sin goce','Enfermedad','Suspensión IGSS','Otro') COLLATE utf8mb4_unicode_ci NOT NULL,
  `motivo` text COLLATE utf8mb4_unicode_ci,
  `documento_respaldo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` enum('Solicitada','Aprobada','Rechazada','Completada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Solicitada',
  `aprobado_por` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `afecta_salario` tinyint(1) NOT NULL DEFAULT '0',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_ausencia`),
  KEY `id_empleado` (`id_empleado`),
  CONSTRAINT `ausencias_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleado`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ausencias`
--

LOCK TABLES `ausencias` WRITE;
/*!40000 ALTER TABLE `ausencias` DISABLE KEYS */;
INSERT INTO `ausencias` VALUES (1,2,'2024-01-10','2024-01-10','Permiso con goce','Cita médica',NULL,'Completada','Gerente RRHH',0,1,'2025-04-29 20:24:58'),(2,4,'2024-02-05','2024-02-07','Enfermedad','Gripe','constancia_medica.pdf','Completada','Gerente RRHH',0,1,'2025-04-29 20:24:58'),(3,6,'2024-02-20','2024-02-20','Permiso sin goce','Asuntos personales',NULL,'Completada','Gerente RRHH',1,1,'2025-04-29 20:24:58'),(4,8,'2024-03-07','2024-03-11','Suspensión IGSS','Suspensión por enfermedad','suspension_igss.pdf','Completada','Gerente RRHH',0,1,'2025-04-29 20:24:58'),(5,10,'2024-04-05','2024-04-05','Permiso con goce','Trámites gubernamentales',NULL,'Aprobada','Gerente RRHH',0,1,'2025-04-29 20:24:58');
/*!40000 ALTER TABLE `ausencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conceptos_aplicados`
--

DROP TABLE IF EXISTS `conceptos_aplicados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conceptos_aplicados` (
  `id_concepto_aplicado` int NOT NULL AUTO_INCREMENT,
  `id_detalle` int NOT NULL,
  `id_concepto` int NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `observacion` text COLLATE utf8mb4_unicode_ci,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_concepto_aplicado`),
  KEY `id_detalle` (`id_detalle`),
  KEY `id_concepto` (`id_concepto`),
  CONSTRAINT `conceptos_aplicados_ibfk_29` FOREIGN KEY (`id_detalle`) REFERENCES `detalle_nomina` (`id_detalle`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `conceptos_aplicados_ibfk_30` FOREIGN KEY (`id_concepto`) REFERENCES `conceptos_pago` (`id_concepto`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conceptos_aplicados`
--

LOCK TABLES `conceptos_aplicados` WRITE;
/*!40000 ALTER TABLE `conceptos_aplicados` DISABLE KEYS */;
INSERT INTO `conceptos_aplicados` VALUES (33,1,1,7500.00,'Salario base quincena',1,'2025-04-29 20:14:36'),(34,1,2,125.00,'Bonificación incentivo',1,'2025-04-29 20:14:36'),(35,1,4,362.25,'IGSS laboral',1,'2025-04-29 20:14:36'),(36,1,5,400.00,'ISR',1,'2025-04-29 20:14:36'),(37,2,1,6000.00,'Salario base quincena',1,'2025-04-29 20:14:36'),(38,2,2,125.00,'Bonificación incentivo',1,'2025-04-29 20:14:36'),(39,2,4,289.80,'IGSS laboral',1,'2025-04-29 20:14:36'),(40,2,5,300.00,'ISR',1,'2025-04-29 20:14:36'),(41,7,1,1750.00,'Salario base quincena',1,'2025-04-29 20:14:36'),(42,7,2,125.00,'Bonificación incentivo',1,'2025-04-29 20:14:36'),(43,7,3,87.50,'Pago 2 horas extra',1,'2025-04-29 20:14:36'),(44,7,4,88.84,'IGSS laboral',1,'2025-04-29 20:14:36'),(45,10,1,1750.00,'Salario base quincena',1,'2025-04-29 20:14:36'),(46,10,2,125.00,'Bonificación incentivo',1,'2025-04-29 20:14:36'),(47,10,3,131.25,'Pago 3 horas extra',1,'2025-04-29 20:14:36'),(48,10,4,90.66,'IGSS laboral',1,'2025-04-29 20:14:36');
/*!40000 ALTER TABLE `conceptos_aplicados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conceptos_pago`
--

DROP TABLE IF EXISTS `conceptos_pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conceptos_pago` (
  `id_concepto` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `tipo` enum('Ingreso','Descuento','Aporte') COLLATE utf8mb4_unicode_ci NOT NULL,
  `es_fijo` tinyint(1) NOT NULL DEFAULT '0',
  `afecta_igss` tinyint(1) NOT NULL DEFAULT '0',
  `afecta_isr` tinyint(1) NOT NULL DEFAULT '0',
  `es_viatico` tinyint(1) NOT NULL DEFAULT '0',
  `porcentaje` decimal(5,2) DEFAULT NULL,
  `monto_fijo` decimal(10,2) DEFAULT NULL,
  `obligatorio` tinyint(1) NOT NULL DEFAULT '0',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_concepto`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conceptos_pago`
--

LOCK TABLES `conceptos_pago` WRITE;
/*!40000 ALTER TABLE `conceptos_pago` DISABLE KEYS */;
INSERT INTO `conceptos_pago` VALUES (1,'VIAT','Viáticos','Reembolso de gastos por viáticos','Ingreso',0,0,0,1,NULL,NULL,0,1,'2025-04-28 16:14:34'),(2,'SALB','Salario Base','Salario base mensual','Ingreso',1,1,1,0,NULL,NULL,1,1,'2025-04-29 20:08:59'),(3,'BONIF','Bonificación Incentivo','Bonificación incentivo decreto 78-89','Ingreso',1,0,0,0,NULL,250.00,1,1,'2025-04-29 20:08:59'),(4,'HEXTR','Horas Extra','Pago por horas extraordinarias','Ingreso',0,1,1,0,NULL,NULL,0,1,'2025-04-29 20:08:59'),(5,'IGSS','IGSS Laboral','Descuento por IGSS laboral','Descuento',1,0,0,0,4.83,NULL,1,1,'2025-04-29 20:08:59'),(6,'ISR','ISR','Descuento por Impuesto Sobre la Renta','Descuento',1,0,0,0,NULL,NULL,1,1,'2025-04-29 20:08:59'),(7,'PREST','Préstamo','Descuento por préstamo','Descuento',0,0,0,0,NULL,NULL,0,1,'2025-04-29 20:08:59'),(8,'BONO14','Bono 14','Bono anual decreto 42-92','Ingreso',0,0,0,0,NULL,NULL,1,1,'2025-04-29 20:08:59'),(9,'AGUIN','Aguinaldo','Aguinaldo anual','Ingreso',0,0,0,0,NULL,NULL,1,1,'2025-04-29 20:08:59'),(10,'ANTIC','Anticipo Salarial','Anticipo de salario','Descuento',0,0,0,0,NULL,NULL,0,1,'2025-04-29 20:08:59'),(11,'COMIS','Comisiones','Comisiones por ventas','Ingreso',0,1,1,0,NULL,NULL,0,1,'2025-04-29 20:08:59');
/*!40000 ALTER TABLE `conceptos_pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuracion_fiscal`
--

DROP TABLE IF EXISTS `configuracion_fiscal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuracion_fiscal` (
  `id_configuracion` int NOT NULL AUTO_INCREMENT,
  `anio` int NOT NULL,
  `porcentaje_igss_empleado` decimal(5,2) NOT NULL,
  `porcentaje_igss_patronal` decimal(5,2) NOT NULL,
  `rango_isr_tramo1` decimal(10,2) NOT NULL,
  `porcentaje_isr_tramo1` decimal(5,2) NOT NULL,
  `rango_isr_tramo2` decimal(10,2) NOT NULL,
  `porcentaje_isr_tramo2` decimal(5,2) NOT NULL,
  `monto_bonificacion_incentivo` decimal(10,2) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_actualizacion` datetime NOT NULL,
  PRIMARY KEY (`id_configuracion`),
  UNIQUE KEY `anio` (`anio`),
  UNIQUE KEY `anio_2` (`anio`),
  UNIQUE KEY `anio_3` (`anio`),
  UNIQUE KEY `anio_4` (`anio`),
  UNIQUE KEY `anio_5` (`anio`),
  UNIQUE KEY `anio_6` (`anio`),
  UNIQUE KEY `anio_7` (`anio`),
  UNIQUE KEY `anio_8` (`anio`),
  UNIQUE KEY `anio_9` (`anio`),
  UNIQUE KEY `anio_10` (`anio`),
  UNIQUE KEY `anio_11` (`anio`),
  UNIQUE KEY `anio_12` (`anio`),
  UNIQUE KEY `anio_13` (`anio`),
  UNIQUE KEY `anio_14` (`anio`),
  UNIQUE KEY `anio_15` (`anio`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuracion_fiscal`
--

LOCK TABLES `configuracion_fiscal` WRITE;
/*!40000 ALTER TABLE `configuracion_fiscal` DISABLE KEYS */;
INSERT INTO `configuracion_fiscal` VALUES (1,2024,4.83,10.67,48000.00,5.00,300000.00,7.00,250.00,1,'2025-04-28 16:14:34');
/*!40000 ALTER TABLE `configuracion_fiscal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departamentos`
--

DROP TABLE IF EXISTS `departamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departamentos` (
  `id_departamento` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_departamento`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departamentos`
--

LOCK TABLES `departamentos` WRITE;
/*!40000 ALTER TABLE `departamentos` DISABLE KEYS */;
INSERT INTO `departamentos` VALUES (1,'Administración','Departamento encargado de la gestión administrativa total',1,'2025-04-28 16:14:34'),(2,'Recursos Humanos','Departamento encargado de la gestión del personal',1,'2025-04-28 16:14:34'),(3,'Contabilidad','Departamento encargado de la contabilidad y finanzas',1,'2025-04-28 16:14:34'),(4,'Ventas','Departamento encargado de las ventas',1,'2025-04-28 16:14:34'),(5,'Producción','Departamento encargado de la producción',1,'2025-04-28 16:14:34'),(6,'TI','Departamento encargado de la tecnologia',1,'2025-04-30 07:41:36');
/*!40000 ALTER TABLE `departamentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `destinos_viaticos`
--

DROP TABLE IF EXISTS `destinos_viaticos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `destinos_viaticos` (
  `id_destino` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `es_internacional` tinyint(1) NOT NULL DEFAULT '0',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_destino`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `destinos_viaticos`
--

LOCK TABLES `destinos_viaticos` WRITE;
/*!40000 ALTER TABLE `destinos_viaticos` DISABLE KEYS */;
INSERT INTO `destinos_viaticos` VALUES (1,'Ciudad de Guatemala','Capital',0,1,'2025-04-29 20:25:42'),(2,'Quetzaltenango','Segunda ciudad más grande',0,1,'2025-04-29 20:25:42'),(3,'Petén','Zona norte',0,1,'2025-04-29 20:25:42'),(4,'San Salvador','Capital de El Salvador',1,1,'2025-04-29 20:25:42'),(5,'San Pedro Sula','Ciudad de Honduras',1,1,'2025-04-29 20:25:42'),(6,'Escuintla','Zona sur de Guatemala',0,1,'2025-04-29 20:38:00'),(7,'Huehuetenango','Zona noroccidental',0,1,'2025-04-29 20:38:00'),(8,'Izabal','Zona nororiental',0,1,'2025-04-29 20:38:00'),(9,'Ciudad de Panamá','Capital de Panamá',1,1,'2025-04-29 20:38:00'),(10,'Managua','Capital de Nicaragua',1,1,'2025-04-29 20:38:00'),(11,'Belice','Ciudad de Belice',1,1,'2025-04-29 20:38:00');
/*!40000 ALTER TABLE `destinos_viaticos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_liquidacion_viaticos`
--

DROP TABLE IF EXISTS `detalle_liquidacion_viaticos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_liquidacion_viaticos` (
  `id_detalle` int NOT NULL AUTO_INCREMENT,
  `id_liquidacion` int NOT NULL,
  `id_tipo_viatico` int NOT NULL,
  `fecha_gasto` date NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `numero_factura` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nombre_proveedor` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nit_proveedor` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tiene_factura` tinyint(1) NOT NULL DEFAULT '1',
  `imagen_comprobante` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `id_liquidacion` (`id_liquidacion`),
  KEY `id_tipo_viatico` (`id_tipo_viatico`),
  CONSTRAINT `detalle_liquidacion_viaticos_ibfk_29` FOREIGN KEY (`id_liquidacion`) REFERENCES `liquidacion_viaticos` (`id_liquidacion`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `detalle_liquidacion_viaticos_ibfk_30` FOREIGN KEY (`id_tipo_viatico`) REFERENCES `tipos_viaticos` (`id_tipo_viatico`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_liquidacion_viaticos`
--

LOCK TABLES `detalle_liquidacion_viaticos` WRITE;
/*!40000 ALTER TABLE `detalle_liquidacion_viaticos` DISABLE KEYS */;
INSERT INTO `detalle_liquidacion_viaticos` VALUES (1,1,1,'2024-01-15','Almuerzo reunión con inversionistas',250.00,'FAC-001-2024','Restaurante La Hacienda','12154',1,NULL,1,'2025-04-29 20:37:32'),(2,1,1,'2024-01-16','Cena con clientes',300.00,'FAC-002-2024','Restaurante Donde José','254864',1,NULL,1,'2025-04-29 20:37:32'),(3,1,2,'2024-01-15','Pasaje aéreo Guatemala-San Salvador',1800.00,'BOL-001-2024','Aerolíneas Guatemaltecas','345645',1,NULL,1,'2025-04-29 20:37:32'),(4,1,3,'2024-01-15','Hospedaje 3 noches Hotel Real',1950.00,'FAC-003-2024','Hotel Real San Salvador','45672',1,NULL,1,'2025-04-29 20:37:32'),(5,1,5,'2024-01-17','Transporte local durante reuniones',250.00,'FAC-004-2024','Taxi Seguro S.A.','5678568',1,NULL,1,'2025-04-29 20:37:32'),(6,1,5,'2024-01-18','Materiales para presentación',300.00,'FAC-005-2024','Oficentro San Salvador','678901',1,NULL,1,'2025-04-29 20:37:32'),(7,2,1,'2024-02-20','Desayuno equipo de trabajo',150.00,'FAC-006-2024','Cafetería Central','7365654',1,NULL,1,'2025-04-29 20:37:32'),(8,2,1,'2024-02-21','Almuerzo participantes capacitación',450.00,'FAC-007-2024','Restaurante El Mirador','890154',1,NULL,1,'2025-04-29 20:37:32'),(9,2,2,'2024-02-20','Transporte terrestre Guatemala-Xela',500.00,'BOL-002-2024','Transportes Altiplano','901255',1,NULL,1,'2025-04-29 20:37:32'),(10,2,3,'2024-02-20','Hospedaje 3 noches Hotel Plaza',1050.00,'FAC-008-2024','Hotel Plaza Quetzaltenango','012312',1,NULL,1,'2025-04-29 20:37:32'),(11,2,5,'2024-02-22','Materiales para capacitación',800.00,'FAC-009-2024','Librería Técnica','123433',1,NULL,1,'2025-04-29 20:37:32'),(12,2,5,'2024-02-23','Transporte local en Xela',200.00,'FAC-010-2024','Taxi Quetzaltenango','234568',1,NULL,1,'2025-04-29 20:37:32'),(13,3,1,'2024-03-12','Alimentación durante auditoría',600.00,'FAC-011-2024','Restaurante Las Puertas','3456658',1,NULL,1,'2025-04-29 20:37:32'),(14,3,2,'2024-03-12','Transporte terrestre a Petén',800.00,'BOL-003-2024','Transportes del Norte','456784',1,NULL,1,'2025-04-29 20:37:32'),(15,3,3,'2024-03-12','Hospedaje 3 noches Hotel Petén',1650.00,'FAC-012-2024','Hotel Gran Petén','567898',1,NULL,1,'2025-04-29 20:37:32'),(16,3,4,'2024-03-13','Combustible para visitas a sucursales',500.00,'FAC-013-2024','Estación Puma','6546546',1,NULL,1,'2025-04-29 20:37:32'),(17,3,5,'2024-03-14','Gastos varios durante auditoría',300.00,'FAC-014-2024','Varios Proveedores','7890002',1,NULL,1,'2025-04-29 20:37:32');
/*!40000 ALTER TABLE `detalle_liquidacion_viaticos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_nomina`
--

DROP TABLE IF EXISTS `detalle_nomina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_nomina` (
  `id_detalle` int NOT NULL AUTO_INCREMENT,
  `id_nomina` int NOT NULL,
  `id_empleado` int NOT NULL,
  `salario_base` decimal(10,2) NOT NULL,
  `dias_trabajados` decimal(5,2) NOT NULL,
  `horas_extra` decimal(5,2) NOT NULL DEFAULT '0.00',
  `monto_horas_extra` decimal(10,2) NOT NULL DEFAULT '0.00',
  `bonificacion_incentivo` decimal(10,2) NOT NULL DEFAULT '0.00',
  `otros_ingresos` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total_ingresos` decimal(10,2) NOT NULL,
  `igss_laboral` decimal(10,2) NOT NULL DEFAULT '0.00',
  `isr` decimal(10,2) NOT NULL DEFAULT '0.00',
  `otros_descuentos` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total_descuentos` decimal(10,2) NOT NULL,
  `liquido_recibir` decimal(10,2) NOT NULL,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `fecha_creacion` datetime NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_detalle`),
  UNIQUE KEY `id_nomina` (`id_nomina`,`id_empleado`),
  UNIQUE KEY `detalle_nomina_id_nomina_id_empleado` (`id_nomina`,`id_empleado`),
  KEY `id_empleado` (`id_empleado`),
  CONSTRAINT `detalle_nomina_ibfk_29` FOREIGN KEY (`id_nomina`) REFERENCES `nominas` (`id_nomina`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `detalle_nomina_ibfk_30` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleado`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_nomina`
--

LOCK TABLES `detalle_nomina` WRITE;
/*!40000 ALTER TABLE `detalle_nomina` DISABLE KEYS */;
INSERT INTO `detalle_nomina` VALUES (1,1,1,7500.00,15.00,0.00,0.00,125.00,0.00,7625.00,362.25,400.00,0.00,762.25,6862.75,NULL,'2025-04-29 20:14:32',1),(2,1,2,6000.00,15.00,0.00,0.00,125.00,0.00,6125.00,289.80,300.00,0.00,589.80,5535.20,NULL,'2025-04-29 20:14:32',1),(3,1,3,5000.00,15.00,0.00,0.00,125.00,0.00,5125.00,241.50,250.00,0.00,491.50,4633.50,NULL,'2025-04-29 20:14:32',1),(4,1,4,2000.00,15.00,0.00,0.00,125.00,0.00,2125.00,96.60,0.00,0.00,96.60,2028.40,NULL,'2025-04-29 20:14:32',1),(5,1,5,2250.00,15.00,0.00,0.00,125.00,0.00,2375.00,108.68,0.00,0.00,108.68,2266.33,NULL,'2025-04-29 20:14:32',1),(6,1,6,2000.00,15.00,0.00,0.00,125.00,0.00,2125.00,96.60,0.00,0.00,96.60,2028.40,NULL,'2025-04-29 20:14:32',1),(7,1,7,1750.00,15.00,2.00,87.50,125.00,0.00,1962.50,88.84,0.00,0.00,88.84,1873.66,NULL,'2025-04-29 20:14:32',1),(8,1,8,3000.00,15.00,0.00,0.00,125.00,0.00,3125.00,144.90,0.00,0.00,144.90,2980.10,NULL,'2025-04-29 20:14:32',1),(9,1,9,1500.00,15.00,0.00,0.00,125.00,0.00,1625.00,72.45,0.00,0.00,72.45,1552.55,NULL,'2025-04-29 20:14:32',1),(10,1,10,1750.00,15.00,3.00,131.25,125.00,0.00,2006.25,90.66,0.00,0.00,90.66,1915.59,NULL,'2025-04-29 20:14:32',1),(11,7,1,15000.00,15.00,0.00,0.00,250.00,0.00,15250.00,0.00,0.00,0.00,0.00,15250.00,'','2025-04-30 22:05:14',1),(12,7,2,12000.00,15.00,0.00,0.00,250.00,0.00,12250.00,0.00,0.00,0.00,0.00,12250.00,'','2025-04-30 22:05:14',1),(13,7,3,10000.00,15.00,0.00,0.00,250.00,0.00,10250.00,0.00,0.00,0.00,0.00,10250.00,'','2025-04-30 22:05:14',1),(14,7,4,4000.00,15.00,0.00,0.00,250.00,0.00,4250.00,0.00,0.00,500.00,500.00,3750.00,'','2025-04-30 22:05:14',1),(15,7,5,4500.00,15.00,0.00,0.00,250.00,0.00,4750.00,0.00,0.00,0.00,0.00,4750.00,'','2025-04-30 22:05:14',1),(16,7,6,4000.00,15.00,0.00,0.00,250.00,0.00,4250.00,0.00,0.00,500.00,500.00,3750.00,'','2025-04-30 22:05:14',1),(17,7,7,3500.00,15.00,0.00,0.00,250.00,0.00,3750.00,0.00,0.00,1000.00,1000.00,2750.00,'','2025-04-30 22:05:14',1),(18,7,8,6000.00,15.00,0.00,0.00,250.00,0.00,6250.00,0.00,0.00,0.00,0.00,6250.00,'','2025-04-30 22:05:14',1),(19,7,9,3000.00,15.00,0.00,0.00,250.00,0.00,3250.00,0.00,0.00,500.00,500.00,2750.00,'','2025-04-30 22:05:14',1),(20,7,10,3500.00,15.00,0.00,0.00,250.00,0.00,3750.00,0.00,0.00,800.00,800.00,2950.00,'','2025-04-30 22:05:14',1),(21,7,11,8000.00,15.00,0.00,0.00,250.00,0.00,8250.00,0.00,0.00,0.00,0.00,8250.00,'','2025-04-30 22:05:14',1);
/*!40000 ALTER TABLE `detalle_nomina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_solicitud_viaticos`
--

DROP TABLE IF EXISTS `detalle_solicitud_viaticos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_solicitud_viaticos` (
  `id_detalle` int NOT NULL AUTO_INCREMENT,
  `id_solicitud` int NOT NULL,
  `id_tipo_viatico` int NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `monto` decimal(10,2) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `id_solicitud` (`id_solicitud`),
  KEY `id_tipo_viatico` (`id_tipo_viatico`),
  CONSTRAINT `detalle_solicitud_viaticos_ibfk_29` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes_viaticos` (`id_solicitud`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `detalle_solicitud_viaticos_ibfk_30` FOREIGN KEY (`id_tipo_viatico`) REFERENCES `tipos_viaticos` (`id_tipo_viatico`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_solicitud_viaticos`
--

LOCK TABLES `detalle_solicitud_viaticos` WRITE;
/*!40000 ALTER TABLE `detalle_solicitud_viaticos` DISABLE KEYS */;
INSERT INTO `detalle_solicitud_viaticos` VALUES (1,1,1,'Alimentación 3 días',900.00,1,'2025-04-29 20:26:43'),(2,1,2,'Transporte aéreo ida y vuelta',2000.00,1,'2025-04-29 20:26:43'),(3,1,3,'Hospedaje 3 noches',2100.00,1,'2025-04-29 20:26:43'),(4,2,1,'Alimentación 3 días',750.00,1,'2025-04-29 20:26:43'),(5,2,2,'Transporte terrestre ida y vuelta',600.00,1,'2025-04-29 20:26:43'),(6,2,3,'Hospedaje 3 noches',1200.00,1,'2025-04-29 20:26:43'),(7,2,5,'Materiales para capacitación',950.00,1,'2025-04-29 20:26:43'),(8,3,1,'Alimentación 3 días',750.00,1,'2025-04-29 20:26:43'),(9,3,2,'Transporte terrestre y local',900.00,1,'2025-04-29 20:26:43'),(10,3,3,'Hospedaje 3 noches',1800.00,1,'2025-04-29 20:26:43'),(11,3,4,'Combustible',550.00,1,'2025-04-29 20:26:43'),(12,4,1,'Alimentación 5 días',1250.00,1,'2025-04-29 20:26:43'),(13,4,2,'Transporte aéreo ida y vuelta',2500.00,1,'2025-04-29 20:26:43'),(14,4,3,'Hospedaje 5 noches',2250.00,1,'2025-04-29 20:26:43'),(15,5,1,'Alimentación 2 días',400.00,1,'2025-04-29 20:26:43'),(16,5,2,'Transporte terrestre ida y vuelta',700.00,1,'2025-04-29 20:26:43'),(17,5,3,'Hospedaje 2 noches',900.00,1,'2025-04-29 20:26:43'),(18,5,4,'Combustible',500.00,1,'2025-04-29 20:26:43');
/*!40000 ALTER TABLE `detalle_solicitud_viaticos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empleados`
--

DROP TABLE IF EXISTS `empleados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleados` (
  `id_empleado` int NOT NULL AUTO_INCREMENT,
  `codigo_empleado` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dpi` varchar(13) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nit` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero_igss` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_nacimiento` date NOT NULL,
  `genero` enum('M','F','O') COLLATE utf8mb4_unicode_ci NOT NULL,
  `direccion` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `correo_electronico` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_puesto` int NOT NULL,
  `fecha_contratacion` date NOT NULL,
  `fecha_fin_contrato` date DEFAULT NULL,
  `tipo_contrato` enum('Indefinido','Plazo fijo','Por obra') COLLATE utf8mb4_unicode_ci NOT NULL,
  `salario_actual` decimal(10,2) NOT NULL,
  `cuenta_bancaria` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `banco` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` enum('Activo','Inactivo','Suspendido','Vacaciones') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Activo',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_empleado`),
  UNIQUE KEY `codigo_empleado` (`codigo_empleado`),
  UNIQUE KEY `dpi` (`dpi`),
  UNIQUE KEY `nit` (`nit`),
  KEY `id_puesto` (`id_puesto`),
  CONSTRAINT `empleados_ibfk_1` FOREIGN KEY (`id_puesto`) REFERENCES `puestos` (`id_puesto`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleados`
--

LOCK TABLES `empleados` WRITE;
/*!40000 ALTER TABLE `empleados` DISABLE KEYS */;
INSERT INTO `empleados` VALUES (1,'EMP-001','Juan Carlos','López Méndez','1234567890123','12345678','98765432','1985-05-15','M','4ta Calle 5-23 Zona 10, Guatemala','55551234','jlopez@empresa.com',1,'2015-01-15',NULL,'Indefinido',15000.00,'123456789','Banco Industrial','Activo',1,'2025-04-29 20:05:38'),(2,'EMP-002','María José','García Hernández','2345678901234','23456789','87654321','1990-08-22','F','3ra Avenida 10-25 Zona 4, Guatemala','55552345','mgarcia@empresa.com',3,'2016-03-01',NULL,'Indefinido',12000.00,'234567890','Banrural','Activo',1,'2025-04-29 20:05:38'),(3,'EMP-003','Pedro Antonio','Ramírez Gómez','3456789012345','34567890','76543210','1988-11-10','M','7ma Calle 15-30 Zona 9, Guatemala','55553456','pramirez@empresa.com',5,'2017-05-10',NULL,'Indefinido',10000.00,'345678901','Banco G&T Continental','Activo',1,'2025-04-29 20:05:38'),(4,'EMP-004','Ana Lucía','Morales Paz','4567890123456','45678901','65432109','1992-04-18','F','10ma Avenida 8-15 Zona 1, Guatemala','55554567','amorales@empresa.com',2,'2018-02-15',NULL,'Indefinido',4000.00,'456789012','Banco Industrial','Activo',1,'2025-04-29 20:05:38'),(5,'EMP-005','Carlos Eduardo','Figueroa Torres','5678901234567','56789012','54321098','1986-09-05','M','5ta Calle 20-35 Zona 15, Guatemala','55555678','cfigueroa@empresa.com',4,'2017-10-01',NULL,'Indefinido',4500.00,'567890123','Banrural','Activo',1,'2025-04-29 20:05:38'),(6,'EMP-006','Lucía Fernanda','Vásquez Solís','6789012345678','67890123','43210987','1993-12-12','F','8va Avenida 5-10 Zona 10, Guatemala','55556789','lvasquez@empresa.com',6,'2019-04-01',NULL,'Indefinido',4000.00,'678901234','Banco G&T Continental','Activo',1,'2025-04-29 20:05:38'),(7,'EMP-007','José Manuel','Torres Orellana','7890123456789','78901234','32109876','1990-02-28','M','12va Calle 3-22 Zona 7, Guatemala','55557890','jtorres@empresa.com',7,'2018-06-15',NULL,'Indefinido',3500.00,'789012345','Banco Industrial','Activo',1,'2025-04-29 20:05:38'),(8,'EMP-008','Rosa María','López Sandoval','8901234567890','89012345','21098765','1989-07-19','F','3ra Avenida 15-30 Zona 11, Guatemala','55558901','rlopez@empresa.com',8,'2017-08-01',NULL,'Indefinido',6000.00,'890123456','Banrural','Activo',1,'2025-04-29 20:05:38'),(9,'EMP-009','Miguel Ángel','Gutiérrez López','9012345678901','90123456','10987654','1991-03-25','M','9na Calle 7-15 Zona 6, Guatemala','55559012','mgutierrez@empresa.com',9,'2019-01-10',NULL,'Indefinido',3000.00,'901234567','Banco G&T Continental','Activo',1,'2025-04-29 20:05:38'),(10,'EMP-010','Laura Patricia','Estrada Molina','0123456789012','01234567','09876543','1987-06-30','F','5ta Avenida 9-12 Zona 9, Guatemala','55550123','lestrada@empresa.com',7,'2018-03-15',NULL,'Indefinido',3500.00,'012345678','Banco Industrial','Activo',1,'2025-04-29 20:05:38'),(11,'EMP-011','Margarito Andres','Perez Lopez','3025458758401','6584874','3025458758401','2003-06-18','M','Villa nueva, Villa Nueva, Guatemala','45612378','margarito@empresa.com',7,'2025-04-30',NULL,'Indefinido',8000.00,'1325464','Banrural','Activo',1,'2025-04-30 07:12:35');
/*!40000 ALTER TABLE `empleados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_salarios`
--

DROP TABLE IF EXISTS `historial_salarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_salarios` (
  `id_historial` int NOT NULL AUTO_INCREMENT,
  `id_empleado` int NOT NULL,
  `salario_anterior` decimal(10,2) NOT NULL,
  `salario_nuevo` decimal(10,2) NOT NULL,
  `fecha_cambio` date NOT NULL,
  `motivo` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `autorizado_por` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_historial`),
  KEY `id_empleado` (`id_empleado`),
  CONSTRAINT `historial_salarios_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleado`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_salarios`
--

LOCK TABLES `historial_salarios` WRITE;
/*!40000 ALTER TABLE `historial_salarios` DISABLE KEYS */;
INSERT INTO `historial_salarios` VALUES (1,1,14000.00,15000.00,'2024-01-01','Ajuste anual','Gerente General',1,'2025-04-29 20:25:24'),(2,2,11000.00,12000.00,'2024-01-01','Ajuste anual','Gerente General',1,'2025-04-29 20:25:24'),(3,3,9500.00,10000.00,'2024-01-01','Ajuste anual','Gerente General',1,'2025-04-29 20:25:24'),(4,5,4000.00,4500.00,'2024-02-01','Promoción','Gerente RRHH',1,'2025-04-29 20:25:24'),(5,8,5500.00,6000.00,'2024-03-01','Ajuste por desempeño','Gerente Producción',1,'2025-04-29 20:25:24');
/*!40000 ALTER TABLE `historial_salarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horas_extras`
--

DROP TABLE IF EXISTS `horas_extras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horas_extras` (
  `id_hora_extra` int NOT NULL AUTO_INCREMENT,
  `id_empleado` int NOT NULL,
  `fecha` date NOT NULL,
  `horas` decimal(4,2) NOT NULL,
  `motivo` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` enum('Pendiente','Aprobada','Rechazada','Pagada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pendiente',
  `aprobado_por` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_detalle_nomina` int DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_hora_extra`),
  KEY `id_empleado` (`id_empleado`),
  KEY `id_detalle_nomina` (`id_detalle_nomina`),
  CONSTRAINT `horas_extras_ibfk_29` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleado`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `horas_extras_ibfk_30` FOREIGN KEY (`id_detalle_nomina`) REFERENCES `detalle_nomina` (`id_detalle`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horas_extras`
--

LOCK TABLES `horas_extras` WRITE;
/*!40000 ALTER TABLE `horas_extras` DISABLE KEYS */;
INSERT INTO `horas_extras` VALUES (1,7,'2024-01-10',2.00,'Inventario fin de mes','Pagada','Supervisor',7,1,'2025-04-29 20:25:10'),(2,10,'2024-01-12',3.00,'Preparación de reportes urgentes','Pagada','Supervisor',10,1,'2025-04-29 20:25:10'),(3,7,'2024-02-08',2.00,'Inventario fin de mes','Pagada','Supervisor',NULL,1,'2025-04-29 20:25:10'),(4,9,'2024-03-15',3.00,'Producción extra','Aprobada','Supervisor',NULL,1,'2025-04-29 20:25:10'),(5,10,'2024-03-20',2.00,'Preparación de reportes urgentes','Pendiente',NULL,NULL,1,'2025-04-29 20:25:10');
/*!40000 ALTER TABLE `horas_extras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `liquidacion_viaticos`
--

DROP TABLE IF EXISTS `liquidacion_viaticos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `liquidacion_viaticos` (
  `id_liquidacion` int NOT NULL AUTO_INCREMENT,
  `id_solicitud` int NOT NULL,
  `fecha_liquidacion` date NOT NULL,
  `monto_total_gastado` decimal(10,2) NOT NULL,
  `monto_anticipo` decimal(10,2) NOT NULL,
  `saldo_favor_empresa` decimal(10,2) NOT NULL DEFAULT '0.00',
  `saldo_favor_empleado` decimal(10,2) NOT NULL DEFAULT '0.00',
  `estado` enum('Pendiente','Aprobada','Rechazada','Completada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pendiente',
  `aprobado_por` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_aprobacion` date DEFAULT NULL,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `incluido_en_nomina` tinyint(1) NOT NULL DEFAULT '0',
  `id_detalle_nomina` int DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_liquidacion`),
  KEY `id_solicitud` (`id_solicitud`),
  KEY `id_detalle_nomina` (`id_detalle_nomina`),
  CONSTRAINT `liquidacion_viaticos_ibfk_29` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes_viaticos` (`id_solicitud`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `liquidacion_viaticos_ibfk_30` FOREIGN KEY (`id_detalle_nomina`) REFERENCES `detalle_nomina` (`id_detalle`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `liquidacion_viaticos`
--

LOCK TABLES `liquidacion_viaticos` WRITE;
/*!40000 ALTER TABLE `liquidacion_viaticos` DISABLE KEYS */;
INSERT INTO `liquidacion_viaticos` VALUES (1,1,'2024-01-20',4850.00,5000.00,150.00,0.00,'Completada','Gerente Financiero','2024-01-22','Se devuelven Q150 a la empresa',1,NULL,1,'2025-04-29 20:35:11'),(2,2,'2024-02-25',3650.00,3500.00,0.00,150.00,'Completada','Gerente General','2024-02-28','Se pagarán Q150 adicionales al empleado',1,NULL,1,'2025-04-29 20:35:11'),(3,3,'2024-03-18',3850.00,3000.00,0.00,850.00,'Aprobada','Gerente Financiero','2024-03-20','Gastos adicionales justificados',0,NULL,1,'2025-04-29 20:35:11'),(4,4,'2024-04-02',5500.00,4000.00,0.00,1500.00,'Pendiente',NULL,NULL,'En revisión de comprobantes',0,NULL,1,'2025-04-29 20:35:11');
/*!40000 ALTER TABLE `liquidacion_viaticos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logs_sistema`
--

DROP TABLE IF EXISTS `logs_sistema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logs_sistema` (
  `id_log` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `accion` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `tabla_afectada` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_registro` int DEFAULT NULL,
  `datos_anteriores` text COLLATE utf8mb4_unicode_ci,
  `datos_nuevos` text COLLATE utf8mb4_unicode_ci,
  `direccion_ip` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_hora` datetime NOT NULL,
  PRIMARY KEY (`id_log`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `logs_sistema_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs_sistema`
--

LOCK TABLES `logs_sistema` WRITE;
/*!40000 ALTER TABLE `logs_sistema` DISABLE KEYS */;
INSERT INTO `logs_sistema` VALUES (1,1,'Creación de nómina','nominas',1,NULL,'{\"id_periodo\":1,\"descripcion\":\"Nómina Quincena 1 Enero 2024\"}','192.168.1.100','2025-04-29 20:39:36'),(2,2,'Actualización de empleado','empleados',3,'{\"salario_actual\":9500.00}','{\"salario_actual\":10000.00}','192.168.1.101','2025-04-29 20:39:36'),(3,3,'Aprobación de liquidación de viáticos','liquidacion_viaticos',1,'{\"estado\":\"Pendiente\"}','{\"estado\":\"Aprobada\"}','192.168.1.102','2025-04-29 20:39:36'),(4,1,'Eliminación de concepto de pago','conceptos_pago',12,'{\"codigo\":\"TEST\",\"nombre\":\"Concepto prueba\"}',NULL,'192.168.1.100','2025-04-29 20:39:36'),(5,5,'Aprobación de solicitud de viáticos','solicitudes_viaticos',4,'{\"estado\":\"Solicitada\"}','{\"estado\":\"Aprobada\"}','192.168.1.105','2025-04-29 20:39:36'),(6,2,'Registro de horas extras','horas_extras',5,NULL,'{\"id_empleado\":10,\"horas\":2,\"motivo\":\"Preparación de reportes\"}','192.168.1.101','2025-04-29 20:39:36'),(7,3,'Actualización de política de viáticos','politicas_viaticos_puesto',8,'{\"monto_maximo_diario\":350.00}','{\"monto_maximo_diario\":400.00}','192.168.1.102','2025-04-29 20:39:36');
/*!40000 ALTER TABLE `logs_sistema` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nominas`
--

DROP TABLE IF EXISTS `nominas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nominas` (
  `id_nomina` int NOT NULL AUTO_INCREMENT,
  `id_periodo` int NOT NULL,
  `descripcion` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_generacion` datetime NOT NULL,
  `estado` enum('Borrador','Verificada','Aprobada','Pagada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Borrador',
  `total_ingresos` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total_descuentos` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total_neto` decimal(12,2) NOT NULL DEFAULT '0.00',
  `usuario_generacion` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usuario_aprobacion` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_aprobacion` datetime DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_nomina`),
  KEY `id_periodo` (`id_periodo`),
  CONSTRAINT `nominas_ibfk_1` FOREIGN KEY (`id_periodo`) REFERENCES `periodos_pago` (`id_periodo`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nominas`
--

LOCK TABLES `nominas` WRITE;
/*!40000 ALTER TABLE `nominas` DISABLE KEYS */;
INSERT INTO `nominas` VALUES (1,1,'Nómina Quincena 1 Enero 2024','2025-04-29 20:12:09','Pagada',53750.00,6750.00,47000.00,'sistema','admin','2024-01-15 12:00:00',1),(2,2,'Nómina Quincena 2 Enero 2024','2025-04-29 20:12:09','Pagada',54250.00,6850.00,47400.00,'sistema','admin','2024-01-31 12:00:00',1),(3,3,'Nómina Quincena 1 Febrero 2024','2025-04-29 20:12:09','Pagada',54750.00,6950.00,47800.00,'sistema','admin','2024-02-15 12:00:00',1),(4,4,'Nómina Quincena 2 Febrero 2024','2025-04-29 20:12:09','Pagada',55250.00,7050.00,48200.00,'sistema','admin','2024-02-29 12:00:00',1),(5,5,'Nómina Quincena 1 Marzo 2024','2025-04-29 20:12:09','Pagada',55750.00,7150.00,48600.00,'sistema','admin','2024-03-15 12:00:00',1),(6,6,'Nómina Quincena 2 Marzo 2024','2025-04-29 20:12:09','Aprobada',56250.00,7250.00,49000.00,'sistema','admin','2024-03-31 12:00:00',1),(7,7,'Nómina Quincena 1 Abril 2024 - Año Desconocido','2025-04-30 22:05:14','Borrador',76250.00,3300.00,72950.00,'Sistema',NULL,NULL,0);
/*!40000 ALTER TABLE `nominas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagos_prestamos`
--

DROP TABLE IF EXISTS `pagos_prestamos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagos_prestamos` (
  `id_pago` int NOT NULL AUTO_INCREMENT,
  `id_prestamo` int NOT NULL,
  `id_detalle_nomina` int DEFAULT NULL,
  `monto_pagado` decimal(10,2) NOT NULL,
  `fecha_pago` date NOT NULL,
  `tipo_pago` enum('Nómina','Manual') COLLATE utf8mb4_unicode_ci NOT NULL,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_pago`),
  KEY `id_prestamo` (`id_prestamo`),
  KEY `id_detalle_nomina` (`id_detalle_nomina`),
  CONSTRAINT `pagos_prestamos_ibfk_29` FOREIGN KEY (`id_prestamo`) REFERENCES `prestamos` (`id_prestamo`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `pagos_prestamos_ibfk_30` FOREIGN KEY (`id_detalle_nomina`) REFERENCES `detalle_nomina` (`id_detalle`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagos_prestamos`
--

LOCK TABLES `pagos_prestamos` WRITE;
/*!40000 ALTER TABLE `pagos_prestamos` DISABLE KEYS */;
INSERT INTO `pagos_prestamos` VALUES (1,1,4,500.00,'2024-01-15','Nómina','Pago de cuota de préstamo',1,'2025-04-29 20:16:47'),(2,2,6,500.00,'2024-01-15','Nómina','Pago de cuota de préstamo',1,'2025-04-29 20:16:47'),(3,3,7,1000.00,'2024-01-15','Nómina','Pago de cuota de préstamo',1,'2025-04-29 20:16:47'),(4,4,9,500.00,'2024-01-15','Nómina','Pago de cuota de préstamo',1,'2025-04-29 20:16:47'),(5,5,10,800.00,'2024-03-15','Nómina','Pago de cuota de préstamo',1,'2025-04-29 20:16:47');
/*!40000 ALTER TABLE `pagos_prestamos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `periodos_pago`
--

DROP TABLE IF EXISTS `periodos_pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `periodos_pago` (
  `id_periodo` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `fecha_pago` date NOT NULL,
  `tipo` enum('Quincenal','Mensual','Bono14','Aguinaldo','Otro') COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` enum('Abierto','Procesando','Cerrado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Abierto',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_periodo`),
  UNIQUE KEY `fecha_inicio` (`fecha_inicio`,`fecha_fin`,`tipo`),
  UNIQUE KEY `periodos_pago_fecha_inicio_fecha_fin_tipo` (`fecha_inicio`,`fecha_fin`,`tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `periodos_pago`
--

LOCK TABLES `periodos_pago` WRITE;
/*!40000 ALTER TABLE `periodos_pago` DISABLE KEYS */;
INSERT INTO `periodos_pago` VALUES (1,'Quincena 1 Enero 2024','2024-01-01','2024-01-15','2024-01-15','Quincenal','Cerrado',1,'2025-04-29 20:10:28'),(2,'Quincena 2 Enero 2024','2024-01-16','2024-01-31','2024-01-31','Quincenal','Cerrado',1,'2025-04-29 20:10:28'),(3,'Quincena 1 Febrero 2024','2024-02-01','2024-02-15','2024-02-15','Quincenal','Cerrado',1,'2025-04-29 20:10:28'),(4,'Quincena 2 Febrero 2024','2024-02-16','2024-02-29','2024-02-29','Quincenal','Cerrado',1,'2025-04-29 20:10:28'),(5,'Quincena 1 Marzo 2024','2024-03-01','2024-03-15','2024-03-15','Quincenal','Cerrado',1,'2025-04-29 20:10:28'),(6,'Quincena 2 Marzo 2024','2024-03-16','2024-03-31','2024-03-31','Quincenal','Cerrado',1,'2025-04-29 20:10:28'),(7,'Quincena 1 Abril 2024','2024-04-01','2024-04-15','2024-04-15','Quincenal','Abierto',1,'2025-04-29 20:10:28'),(8,'Bono 14 - 2024','2023-07-01','2024-06-30','2024-07-15','Bono14','Abierto',1,'2025-04-29 20:10:28'),(9,'Aguinaldo 2024','2023-12-01','2024-11-30','2024-12-15','Aguinaldo','Abierto',1,'2025-04-29 20:10:28');
/*!40000 ALTER TABLE `periodos_pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `politicas_viaticos_puesto`
--

DROP TABLE IF EXISTS `politicas_viaticos_puesto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `politicas_viaticos_puesto` (
  `id_politica` int NOT NULL AUTO_INCREMENT,
  `id_puesto` int NOT NULL,
  `id_tipo_viatico` int NOT NULL,
  `monto_maximo_diario` decimal(10,2) NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_politica`),
  UNIQUE KEY `id_puesto` (`id_puesto`,`id_tipo_viatico`),
  UNIQUE KEY `politicas_viaticos_puesto_id_puesto_id_tipo_viatico` (`id_puesto`,`id_tipo_viatico`),
  KEY `id_tipo_viatico` (`id_tipo_viatico`),
  CONSTRAINT `politicas_viaticos_puesto_ibfk_29` FOREIGN KEY (`id_puesto`) REFERENCES `puestos` (`id_puesto`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `politicas_viaticos_puesto_ibfk_30` FOREIGN KEY (`id_tipo_viatico`) REFERENCES `tipos_viaticos` (`id_tipo_viatico`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `politicas_viaticos_puesto`
--

LOCK TABLES `politicas_viaticos_puesto` WRITE;
/*!40000 ALTER TABLE `politicas_viaticos_puesto` DISABLE KEYS */;
INSERT INTO `politicas_viaticos_puesto` VALUES (1,1,1,300.00,'Alimentación para Gerente General',1,'2025-04-29 20:26:09'),(2,1,2,500.00,'Transporte para Gerente General',1,'2025-04-29 20:26:09'),(3,1,3,1200.00,'Hospedaje para Gerente General',1,'2025-04-29 20:26:09'),(4,3,1,250.00,'Alimentación para Gerente RRHH',1,'2025-04-29 20:26:09'),(5,3,2,400.00,'Transporte para Gerente RRHH',1,'2025-04-29 20:26:09'),(6,3,3,1000.00,'Hospedaje para Gerente RRHH',1,'2025-04-29 20:26:09'),(7,5,1,200.00,'Alimentación para Contador General',1,'2025-04-29 20:26:09'),(8,5,2,350.00,'Transporte para Contador General',1,'2025-04-29 20:26:09'),(9,5,3,900.00,'Hospedaje para Contador General',1,'2025-04-29 20:26:09'),(10,7,1,150.00,'Alimentación para Vendedor',1,'2025-04-29 20:26:09'),(11,7,2,300.00,'Transporte para Vendedor',1,'2025-04-29 20:26:09'),(12,7,3,700.00,'Hospedaje para Vendedor',1,'2025-04-29 20:26:09'),(13,8,1,175.00,'Alimentación para Supervisor',1,'2025-04-29 20:26:09'),(14,8,2,325.00,'Transporte para Supervisor',1,'2025-04-29 20:26:09'),(15,8,3,750.00,'Hospedaje para Supervisor',1,'2025-04-29 20:26:09'),(16,2,1,180.00,'Alimentación para Asistente Administrativo',1,'2025-04-29 20:37:51'),(17,2,2,200.00,'Transporte para Asistente Administrativo',1,'2025-04-29 20:37:51'),(18,2,3,450.00,'Hospedaje para Asistente Administrativo',1,'2025-04-29 20:37:51'),(19,4,1,160.00,'Alimentación para Asistente de RRHH',1,'2025-04-29 20:37:51'),(20,4,2,180.00,'Transporte para Asistente de RRHH',1,'2025-04-29 20:37:51'),(21,4,3,400.00,'Hospedaje para Asistente de RRHH',1,'2025-04-29 20:37:51'),(22,6,1,140.00,'Alimentación para Auxiliar Contable',1,'2025-04-29 20:37:51'),(23,6,2,150.00,'Transporte para Auxiliar Contable',1,'2025-04-29 20:37:51'),(24,6,3,350.00,'Hospedaje para Auxiliar Contable',1,'2025-04-29 20:37:51'),(25,9,1,120.00,'Alimentación para Operario',1,'2025-04-29 20:37:51'),(26,9,2,100.00,'Transporte para Operario',1,'2025-04-29 20:37:51'),(27,9,3,300.00,'Hospedaje para Operario',1,'2025-04-29 20:37:51');
/*!40000 ALTER TABLE `politicas_viaticos_puesto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prestamos`
--

DROP TABLE IF EXISTS `prestamos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prestamos` (
  `id_prestamo` int NOT NULL AUTO_INCREMENT,
  `id_empleado` int NOT NULL,
  `monto_total` decimal(10,2) NOT NULL,
  `saldo_pendiente` decimal(10,2) NOT NULL,
  `cuota_mensual` decimal(10,2) NOT NULL,
  `cantidad_cuotas` int NOT NULL,
  `cuotas_pagadas` int NOT NULL DEFAULT '0',
  `fecha_inicio` date NOT NULL,
  `fecha_fin_estimada` date NOT NULL,
  `motivo` text COLLATE utf8mb4_unicode_ci,
  `estado` enum('Aprobado','En Curso','Pagado','Cancelado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Aprobado',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_prestamo`),
  KEY `id_empleado` (`id_empleado`),
  CONSTRAINT `prestamos_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleado`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prestamos`
--

LOCK TABLES `prestamos` WRITE;
/*!40000 ALTER TABLE `prestamos` DISABLE KEYS */;
INSERT INTO `prestamos` VALUES (1,4,10000.00,7000.00,500.00,20,6,'2023-07-01','2025-02-28','Gastos médicos','En Curso',1,'2025-04-29 20:16:03'),(2,6,6000.00,3000.00,500.00,12,6,'2023-09-01','2024-08-31','Compra de electrodomésticos','En Curso',1,'2025-04-29 20:16:03'),(3,7,12000.00,10000.00,1000.00,12,2,'2024-01-01','2024-12-31','Compra de motocicleta','En Curso',1,'2025-04-29 20:16:03'),(4,9,5000.00,4000.00,500.00,10,2,'2024-01-01','2024-10-31','Gastos educativos','En Curso',1,'2025-04-29 20:16:03'),(5,10,8000.00,6400.00,800.00,10,2,'2024-02-01','2024-11-30','Renovación de vivienda','En Curso',1,'2025-04-29 20:16:03');
/*!40000 ALTER TABLE `prestamos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `puestos`
--

DROP TABLE IF EXISTS `puestos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `puestos` (
  `id_puesto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `salario_base` decimal(10,2) NOT NULL,
  `id_departamento` int DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_puesto`),
  KEY `id_departamento` (`id_departamento`),
  CONSTRAINT `puestos_ibfk_1` FOREIGN KEY (`id_departamento`) REFERENCES `departamentos` (`id_departamento`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `puestos`
--

LOCK TABLES `puestos` WRITE;
/*!40000 ALTER TABLE `puestos` DISABLE KEYS */;
INSERT INTO `puestos` VALUES (1,'Gerente General','Encargado de dirigir la empresa',15000.00,1,1,'2025-04-28 16:14:34'),(2,'Asistente Administrativo','Apoyo administrativo',4000.00,1,1,'2025-04-28 16:14:34'),(3,'Gerente de RRHH','Encargado del departamento de RRHH',12000.00,2,1,'2025-04-28 16:14:34'),(4,'Asistente de RRHH','Apoyo en gestiones de RRHH',4500.00,2,1,'2025-04-28 16:14:34'),(5,'Contador General','Encargado de la contabilidad',10000.00,3,1,'2025-04-28 16:14:34'),(6,'Auxiliar Contable','Apoyo en contabilidad',4000.00,3,1,'2025-04-28 16:14:34'),(7,'Vendedor','Encargado de ventas',3500.00,4,1,'2025-04-28 16:14:34'),(8,'Supervisor de Producción','Encargado de supervisar la producción',6000.00,5,1,'2025-04-28 16:14:34'),(9,'Operario','Trabajador de producción',3000.00,5,1,'2025-04-28 16:14:34'),(10,'DBA','Administrador de base de datos',10000.00,6,1,'2025-04-30 08:07:01');
/*!40000 ALTER TABLE `puestos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitudes_viaticos`
--

DROP TABLE IF EXISTS `solicitudes_viaticos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitudes_viaticos` (
  `id_solicitud` int NOT NULL AUTO_INCREMENT,
  `id_empleado` int NOT NULL,
  `fecha_solicitud` date NOT NULL,
  `fecha_inicio_viaje` date NOT NULL,
  `fecha_fin_viaje` date NOT NULL,
  `destino` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `motivo` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `monto_solicitado` decimal(10,2) NOT NULL,
  `monto_aprobado` decimal(10,2) DEFAULT NULL,
  `estado` enum('Solicitada','Aprobada','Rechazada','Liquidada','Cancelada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Solicitada',
  `aprobado_por` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_aprobacion` date DEFAULT NULL,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_solicitud`),
  KEY `id_empleado` (`id_empleado`),
  CONSTRAINT `solicitudes_viaticos_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleado`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitudes_viaticos`
--

LOCK TABLES `solicitudes_viaticos` WRITE;
/*!40000 ALTER TABLE `solicitudes_viaticos` DISABLE KEYS */;
INSERT INTO `solicitudes_viaticos` VALUES (1,1,'2024-01-05','2024-01-15','2024-01-18','San Salvador','Reunión con inversionistas',5000.00,5000.00,'Liquidada','Gerente Financiero','2024-01-10','Aprobado completo',1,'2025-04-29 20:26:25'),(2,3,'2024-02-10','2024-02-20','2024-02-23','Quetzaltenango','Capacitación personal',3500.00,3500.00,'Liquidada','Gerente General','2024-02-15','Aprobado completo',1,'2025-04-29 20:26:25'),(3,5,'2024-03-01','2024-03-12','2024-03-15','Petén','Auditoría sucursal',4200.00,4000.00,'Aprobada','Gerente Financiero','2024-03-05','Se ajustó el monto de alimentación',1,'2025-04-29 20:26:25'),(4,7,'2024-03-08','2024-03-25','2024-03-30','San Pedro Sula','Feria comercial',6000.00,5800.00,'Aprobada','Gerente Ventas','2024-03-15','Se ajustó hospedaje a hotel más económico',1,'2025-04-29 20:26:25'),(5,8,'2024-04-01','2024-04-10','2024-04-12','Quetzaltenango','Supervisión de proyecto',2500.00,NULL,'Solicitada',NULL,NULL,'En espera de aprobación',1,'2025-04-29 20:26:25');
/*!40000 ALTER TABLE `solicitudes_viaticos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tarifas_destino`
--

DROP TABLE IF EXISTS `tarifas_destino`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tarifas_destino` (
  `id_tarifa` int NOT NULL AUTO_INCREMENT,
  `id_destino` int NOT NULL,
  `id_tipo_viatico` int NOT NULL,
  `monto_sugerido` decimal(10,2) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_tarifa`),
  UNIQUE KEY `id_destino` (`id_destino`,`id_tipo_viatico`),
  UNIQUE KEY `tarifas_destino_id_destino_id_tipo_viatico` (`id_destino`,`id_tipo_viatico`),
  KEY `id_tipo_viatico` (`id_tipo_viatico`),
  CONSTRAINT `tarifas_destino_ibfk_29` FOREIGN KEY (`id_destino`) REFERENCES `destinos_viaticos` (`id_destino`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tarifas_destino_ibfk_30` FOREIGN KEY (`id_tipo_viatico`) REFERENCES `tipos_viaticos` (`id_tipo_viatico`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarifas_destino`
--

LOCK TABLES `tarifas_destino` WRITE;
/*!40000 ALTER TABLE `tarifas_destino` DISABLE KEYS */;
INSERT INTO `tarifas_destino` VALUES (1,1,1,150.00,1,'2025-04-29 20:25:56'),(2,1,2,100.00,1,'2025-04-29 20:25:56'),(3,1,3,500.00,1,'2025-04-29 20:25:56'),(4,2,1,125.00,1,'2025-04-29 20:25:56'),(5,2,2,150.00,1,'2025-04-29 20:25:56'),(6,2,3,400.00,1,'2025-04-29 20:25:56'),(7,3,1,175.00,1,'2025-04-29 20:25:56'),(8,3,2,300.00,1,'2025-04-29 20:25:56'),(9,3,3,600.00,1,'2025-04-29 20:25:56'),(10,4,1,250.00,1,'2025-04-29 20:25:56'),(11,4,2,350.00,1,'2025-04-29 20:25:56'),(12,4,3,800.00,1,'2025-04-29 20:25:56'),(13,5,1,225.00,1,'2025-04-29 20:25:56'),(14,5,2,325.00,1,'2025-04-29 20:25:56'),(15,5,3,750.00,1,'2025-04-29 20:25:56'),(16,6,1,130.00,1,'2025-04-29 20:38:14'),(17,6,2,120.00,1,'2025-04-29 20:38:14'),(18,6,3,350.00,1,'2025-04-29 20:38:14'),(19,7,1,140.00,1,'2025-04-29 20:38:14'),(20,7,2,180.00,1,'2025-04-29 20:38:14'),(21,7,3,380.00,1,'2025-04-29 20:38:14'),(22,8,1,150.00,1,'2025-04-29 20:38:14'),(23,8,2,250.00,1,'2025-04-29 20:38:14'),(24,8,3,450.00,1,'2025-04-29 20:38:14'),(25,9,1,350.00,1,'2025-04-29 20:38:14'),(26,9,2,500.00,1,'2025-04-29 20:38:14'),(27,9,3,1200.00,1,'2025-04-29 20:38:14'),(28,10,1,280.00,1,'2025-04-29 20:38:14'),(29,10,2,450.00,1,'2025-04-29 20:38:14'),(30,10,3,950.00,1,'2025-04-29 20:38:14'),(31,11,1,320.00,1,'2025-04-29 20:38:14'),(32,11,2,400.00,1,'2025-04-29 20:38:14'),(33,11,3,1100.00,1,'2025-04-29 20:38:14');
/*!40000 ALTER TABLE `tarifas_destino` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_viaticos`
--

DROP TABLE IF EXISTS `tipos_viaticos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_viaticos` (
  `id_tipo_viatico` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `monto_maximo` decimal(10,2) DEFAULT NULL,
  `requiere_factura` tinyint(1) NOT NULL DEFAULT '1',
  `afecta_isr` tinyint(1) NOT NULL DEFAULT '0',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_tipo_viatico`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_viaticos`
--

LOCK TABLES `tipos_viaticos` WRITE;
/*!40000 ALTER TABLE `tipos_viaticos` DISABLE KEYS */;
INSERT INTO `tipos_viaticos` VALUES (1,'ALIM','Alimentación','Gastos de alimentación durante viajes',200.00,1,0,1,'2025-04-28 16:14:34'),(2,'TRANSP','Transporte','Gastos de transporte',300.00,1,0,1,'2025-04-28 16:14:34'),(3,'HOSP','Hospedaje','Gastos de hospedaje',800.00,1,0,1,'2025-04-28 16:14:34'),(4,'COMB','Combustible','Gastos de combustible',500.00,1,0,1,'2025-04-28 16:14:34'),(5,'OTROS','Otros gastos','Otros gastos relacionados con el viaje',200.00,1,0,1,'2025-04-28 16:14:34');
/*!40000 ALTER TABLE `tipos_viaticos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre_usuario` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contrasena` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre_completo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `correo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol` enum('Administrador','RRHH','Contador','Consulta') COLLATE utf8mb4_unicode_ci NOT NULL,
  `ultimo_acceso` datetime DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `nombre_usuario` (`nombre_usuario`),
  UNIQUE KEY `correo` (`correo`),
  UNIQUE KEY `nombre_usuario_2` (`nombre_usuario`),
  UNIQUE KEY `correo_2` (`correo`),
  UNIQUE KEY `nombre_usuario_3` (`nombre_usuario`),
  UNIQUE KEY `correo_3` (`correo`),
  UNIQUE KEY `nombre_usuario_4` (`nombre_usuario`),
  UNIQUE KEY `correo_4` (`correo`),
  UNIQUE KEY `nombre_usuario_5` (`nombre_usuario`),
  UNIQUE KEY `correo_5` (`correo`),
  UNIQUE KEY `nombre_usuario_6` (`nombre_usuario`),
  UNIQUE KEY `correo_6` (`correo`),
  UNIQUE KEY `nombre_usuario_7` (`nombre_usuario`),
  UNIQUE KEY `correo_7` (`correo`),
  UNIQUE KEY `nombre_usuario_8` (`nombre_usuario`),
  UNIQUE KEY `correo_8` (`correo`),
  UNIQUE KEY `nombre_usuario_9` (`nombre_usuario`),
  UNIQUE KEY `correo_9` (`correo`),
  UNIQUE KEY `nombre_usuario_10` (`nombre_usuario`),
  UNIQUE KEY `correo_10` (`correo`),
  UNIQUE KEY `nombre_usuario_11` (`nombre_usuario`),
  UNIQUE KEY `correo_11` (`correo`),
  UNIQUE KEY `nombre_usuario_12` (`nombre_usuario`),
  UNIQUE KEY `correo_12` (`correo`),
  UNIQUE KEY `nombre_usuario_13` (`nombre_usuario`),
  UNIQUE KEY `correo_13` (`correo`),
  UNIQUE KEY `nombre_usuario_14` (`nombre_usuario`),
  UNIQUE KEY `correo_14` (`correo`),
  UNIQUE KEY `nombre_usuario_15` (`nombre_usuario`),
  UNIQUE KEY `correo_15` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'admin','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Administrador del Sistema','admin@empresa.com','Administrador','2024-04-15 09:30:00',1,'2025-04-29 20:38:30'),(2,'rrhh','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','María García - RRHH','rrhh@empresa.com','RRHH','2024-04-15 10:15:00',1,'2025-04-29 20:38:30'),(3,'contador','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Carlos López - Contabilidad','contabilidad@empresa.com','Contador','2024-04-14 16:45:00',1,'2025-04-29 20:38:30'),(4,'consulta1','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Usuario de Consulta','consulta@empresa.com','Consulta','2024-04-12 11:20:00',1,'2025-04-29 20:38:30'),(5,'supervisor','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Luis Martínez - Supervisor','supervisor@empresa.com','RRHH','2024-04-15 08:45:00',1,'2025-04-29 20:38:30');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vacaciones`
--

DROP TABLE IF EXISTS `vacaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vacaciones` (
  `id_vacaciones` int NOT NULL AUTO_INCREMENT,
  `id_empleado` int NOT NULL,
  `fecha_solicitud` date NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `dias_tomados` int NOT NULL,
  `estado` enum('Solicitada','Aprobada','Rechazada','Cancelada','Completada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Solicitada',
  `aprobado_por` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id_vacaciones`),
  KEY `id_empleado` (`id_empleado`),
  CONSTRAINT `vacaciones_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleado`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacaciones`
--

LOCK TABLES `vacaciones` WRITE;
/*!40000 ALTER TABLE `vacaciones` DISABLE KEYS */;
INSERT INTO `vacaciones` VALUES (1,1,'2024-01-05','2024-01-22','2024-02-05',15,'Completada','Gerente RRHH','Vacaciones anuales',1,'2025-04-29 20:18:35'),(2,3,'2024-02-10','2024-03-01','2024-03-15',15,'Completada','Gerente RRHH','Vacaciones anuales',1,'2025-04-29 20:18:35'),(3,5,'2024-03-01','2024-04-01','2024-04-10',10,'Aprobada','Gerente RRHH','Vacaciones parciales',1,'2025-04-29 20:18:35'),(4,7,'2024-03-15','2024-05-01','2024-05-15',15,'Aprobada','Gerente RRHH','Vacaciones anuales',1,'2025-04-29 20:18:35'),(5,9,'2024-03-20','2024-06-01','2024-06-10',10,'Solicitada',NULL,'Solicitud de vacaciones parciales',1,'2025-04-29 20:18:35');
/*!40000 ALTER TABLE `vacaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'nomina_guatemalteca'
--
/*!50003 DROP PROCEDURE IF EXISTS `calcular_igss_empleado` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `calcular_igss_empleado`(
    IN p_salario DECIMAL(10,2),
    IN p_anio YEAR,
    OUT p_igss DECIMAL(10,2)
)
BEGIN
    DECLARE v_porcentaje DECIMAL(5,2);
    
    SELECT porcentaje_igss_empleado INTO v_porcentaje
    FROM configuracion_fiscal
    WHERE anio = p_anio AND activo = TRUE
    LIMIT 1;
    
    SET p_igss = p_salario * (v_porcentaje / 100);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `calcular_isr_mensual` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `calcular_isr_mensual`(
    IN p_salario_anual DECIMAL(10,2),
    IN p_anio YEAR,
    OUT p_isr_mensual DECIMAL(10,2)
)
BEGIN
    DECLARE v_rango_tramo1 DECIMAL(10,2);
    DECLARE v_porcentaje_tramo1 DECIMAL(5,2);
    DECLARE v_rango_tramo2 DECIMAL(10,2);
    DECLARE v_porcentaje_tramo2 DECIMAL(5,2);
    DECLARE v_isr_anual DECIMAL(10,2);
    
    -- Obtener parámetros fiscales
    SELECT 
        rango_isr_tramo1, 
        porcentaje_isr_tramo1, 
        rango_isr_tramo2, 
        porcentaje_isr_tramo2
    INTO 
        v_rango_tramo1, 
        v_porcentaje_tramo1, 
        v_rango_tramo2, 
        v_porcentaje_tramo2
    FROM configuracion_fiscal
    WHERE anio = p_anio AND activo = TRUE
    LIMIT 1;
    
    -- Cálculo de ISR anual según los tramos
    IF p_salario_anual <= v_rango_tramo1 THEN
        SET v_isr_anual = 0;
    ELSEIF p_salario_anual <= v_rango_tramo2 THEN
        SET v_isr_anual = (p_salario_anual - v_rango_tramo1) * (v_porcentaje_tramo1 / 100);
    ELSE
        SET v_isr_anual = (v_rango_tramo2 - v_rango_tramo1) * (v_porcentaje_tramo1 / 100) +
                          (p_salario_anual - v_rango_tramo2) * (v_porcentaje_tramo2 / 100);
    END IF;
    
    -- Dividir el ISR anual entre 12 para obtener la cuota mensual
    SET p_isr_mensual = v_isr_anual / 12;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `calcular_saldos_viaticos` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `calcular_saldos_viaticos`(
    IN p_id_solicitud INT,
    IN p_monto_gastado DECIMAL(10,2),
    OUT p_saldo_favor_empresa DECIMAL(10,2),
    OUT p_saldo_favor_empleado DECIMAL(10,2)
)
BEGIN
    DECLARE v_monto_anticipo DECIMAL(10,2);
    
    -- Obtener el monto del anticipo
    SELECT COALESCE(SUM(monto), 0) INTO v_monto_anticipo
    FROM anticipos_viaticos
    WHERE id_solicitud = p_id_solicitud AND activo = TRUE;
    
    -- Calcular saldos
    IF v_monto_anticipo > p_monto_gastado THEN
        SET p_saldo_favor_empresa = v_monto_anticipo - p_monto_gastado;
        SET p_saldo_favor_empleado = 0;
    ELSE
        SET p_saldo_favor_empresa = 0;
        SET p_saldo_favor_empleado = p_monto_gastado - v_monto_anticipo;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-30 16:48:57
