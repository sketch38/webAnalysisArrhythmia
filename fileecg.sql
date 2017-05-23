-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 22, 2017 at 06:41 AM
-- Server version: 5.7.14
-- PHP Version: 5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fileecg`
--

-- --------------------------------------------------------

--
-- Table structure for table `record`
--

CREATE TABLE `record` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `time` varchar(2) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `record`
--

INSERT INTO `record` (`id`, `name`, `time`) VALUES
(1, 'record200', '01'),
(2, 'record200', '18'),
(4, 'record201', '26'),
(5, 'record203', '05'),
(6, 'record203', '26'),
(7, 'record203', '27'),
(8, 'record205', '04'),
(9, 'record205', '15'),
(10, 'record205', '24'),
(11, 'record207', '00'),
(12, 'record210', '06'),
(13, 'record210', '17'),
(14, 'record213', '14'),
(15, 'record213', '17'),
(16, 'record214', '05'),
(17, 'record214', '13'),
(18, 'record215', '02'),
(19, 'record215', '20'),
(20, 'record217', '07'),
(21, 'record221', '13'),
(22, 'record223', '09'),
(23, 'record223', '17'),
(24, 'record223', '23'),
(25, 'record223', '25'),
(26, 'record232', '23'),
(27, 'record233', '00'),
(28, 'record233', '09'),
(29, 'record233', '22'),
(30, 'record234', '14');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `record`
--
ALTER TABLE `record`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `record`
--
ALTER TABLE `record`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
