<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
    header('Location: http://localhost/event_management/');
    exit;
}

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

$json = file_get_contents("php://input");
$data = json_decode($json, true);
$action = $data['action'];
include("database.php");

try {
    if ($action == "delete") {
        $sql = "DELETE FROM staff WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $data['id']);
        $stmt->execute();

        $conn->exec("SET @count = 0;");
        $conn->exec("UPDATE staff SET id = (@count := @count + 1);");

        $maxIdResult = $conn->query("SELECT MAX(id) AS max_id FROM staff")->fetch(PDO::FETCH_ASSOC);
        $maxId = $maxIdResult['max_id'] + 1;
        $conn->exec("ALTER TABLE staff AUTO_INCREMENT = $maxId;");

        $response = [
            'status' => 'success',
            'message' => 'Data received',
        ];
        echo json_encode($response);
        exit;

    } else if ($action == "add") {
        $sql = "INSERT INTO staff (fullname) VALUES (:name)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':name', $data['name']);
        $stmt->execute();

        $sql = "SELECT id FROM staff WHERE fullname = :name";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':name', $data['name']);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        $response = [
            'status' => 'success',
            'message' => 'Data received',
            'id' => $result['id'],
        ];
        echo json_encode($response);
        exit;

    } else if ($action == "edit") {
        $sql = "UPDATE staff SET fullname = :name WHERE id = :id;";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':id', $data['id']);
        $stmt->execute();

        $response = [
            'status' => 'success',
            'message' => 'Data received',
            'name' => $data['name']
        ];
        echo json_encode($response);
        exit;

    } else if ($action == "update") {
        $stmt = $conn->prepare("SELECT fullname FROM staff ORDER BY fullname ASC");
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $namesArray = [];

        foreach ($result as $row) {
            $namesArray[] = $row['fullname'];
        }

        $response = [
            'status' => 'success',
            'message' => 'Data received',
            'nameList' => $namesArray,
        ];
        echo json_encode($response);
        exit;
    }

} catch (PDOException $e) {
    $response = [
        'status' => 'error',
        'message' => 'Database Error: ' . $e->getMessage(),
    ];
    echo json_encode($response);
    exit;
}
?>