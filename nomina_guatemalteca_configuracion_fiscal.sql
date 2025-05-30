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
  UNIQUE KEY `anio_15` (`anio`),
  UNIQUE KEY `anio_16` (`anio`),
  UNIQUE KEY `anio_17` (`anio`),
  UNIQUE KEY `anio_18` (`anio`),
  UNIQUE KEY `anio_19` (`anio`),
  UNIQUE KEY `anio_20` (`anio`),
  UNIQUE KEY `anio_21` (`anio`),
  UNIQUE KEY `anio_22` (`anio`),
  UNIQUE KEY `anio_23` (`anio`),
  UNIQUE KEY `anio_24` (`anio`),
  UNIQUE KEY `anio_25` (`anio`),
  UNIQUE KEY `anio_26` (`anio`),
  UNIQUE KEY `anio_27` (`anio`),
  UNIQUE KEY `anio_28` (`anio`),
  UNIQUE KEY `anio_29` (`anio`),
  UNIQUE KEY `anio_30` (`anio`),
  UNIQUE KEY `anio_31` (`anio`),
  UNIQUE KEY `anio_32` (`anio`),
  UNIQUE KEY `anio_33` (`anio`),
  UNIQUE KEY `anio_34` (`anio`),
  UNIQUE KEY `anio_35` (`anio`),
  UNIQUE KEY `anio_36` (`anio`),
  UNIQUE KEY `anio_37` (`anio`),
  UNIQUE KEY `anio_38` (`anio`),
  UNIQUE KEY `anio_39` (`anio`),
  UNIQUE KEY `anio_40` (`anio`),
  UNIQUE KEY `anio_41` (`anio`),
  UNIQUE KEY `anio_42` (`anio`),
  UNIQUE KEY `anio_43` (`anio`),
  UNIQUE KEY `anio_44` (`anio`),
  UNIQUE KEY `anio_45` (`anio`),
  UNIQUE KEY `anio_46` (`anio`),
  UNIQUE KEY `anio_47` (`anio`),
  UNIQUE KEY `anio_48` (`anio`),
  UNIQUE KEY `anio_49` (`anio`),
  UNIQUE KEY `anio_50` (`anio`),
  UNIQUE KEY `anio_51` (`anio`),
  UNIQUE KEY `anio_52` (`anio`),
  UNIQUE KEY `anio_53` (`anio`),
  UNIQUE KEY `anio_54` (`anio`),
  UNIQUE KEY `anio_55` (`anio`),
  UNIQUE KEY `anio_56` (`anio`),
  UNIQUE KEY `anio_57` (`anio`),
  UNIQUE KEY `anio_58` (`anio`),
  UNIQUE KEY `anio_59` (`anio`),
  UNIQUE KEY `anio_60` (`anio`),
  UNIQUE KEY `anio_61` (`anio`),
  UNIQUE KEY `anio_62` (`anio`),
  UNIQUE KEY `anio_63` (`anio`)
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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-26 11:43:28
