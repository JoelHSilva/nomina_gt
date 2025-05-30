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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-26 11:43:27
