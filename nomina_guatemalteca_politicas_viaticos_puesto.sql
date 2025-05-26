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
  CONSTRAINT `politicas_viaticos_puesto_ibfk_107` FOREIGN KEY (`id_puesto`) REFERENCES `puestos` (`id_puesto`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `politicas_viaticos_puesto_ibfk_108` FOREIGN KEY (`id_tipo_viatico`) REFERENCES `tipos_viaticos` (`id_tipo_viatico`) ON DELETE RESTRICT ON UPDATE CASCADE
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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-26 11:43:27
