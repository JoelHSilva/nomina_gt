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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-26 11:43:26
