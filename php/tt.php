<?php
$servername = "localhost";
$username = "root";
$password = "0510";
 
// 创建连接
$conn = new mysqli($servername, $username, $password,'',3307);
// 检测连接
if ($conn->connect_error) {
    die("连接失败: " . $conn->connect_error);
} 
 
// 创建数据库
$sql = "CREATE DATABASE myDB";
if ($conn->query($sql) === TRUE) {
    echo "数据库创建成功";
} else {
    echo "Error creating database: " . $conn->error;
}
 
$conn->close();
?>