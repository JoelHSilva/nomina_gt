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
  CONSTRAINT `liquidacion_viaticos_ibfk_125` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes_viaticos` (`id_solicitud`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `liquidacion_viaticos_ibfk_126` FOREIGN KEY (`id_detalle_nomina`) REFERENCES `detalle_nomina` (`id_detalle`) ON DELETE SET NULL ON UPDATE CASCADE
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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-26 11:43:26
