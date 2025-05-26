-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: nomina_guatemalteca
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
  CONSTRAINT `detalle_liquidacion_viaticos_ibfk_125` FOREIGN KEY (`id_liquidacion`) REFERENCES `liquidacion_viaticos` (`id_liquidacion`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `detalle_liquidacion_viaticos_ibfk_126` FOREIGN KEY (`id_tipo_viatico`) REFERENCES `tipos_viaticos` (`id_tipo_viatico`) ON DELETE RESTRICT ON UPDATE CASCADE
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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-26 11:43:28
