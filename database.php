<?php 
    $servername = "localhost";
    $username = "root";
    $password = "najhi@1997";
    $dbname = "event_management";
    $conn = "";

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    } catch (PDOException $e) {
        echo "Connection failed: " . $e->getMessage();
    }
?>