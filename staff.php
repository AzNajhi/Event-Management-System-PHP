<?php
    if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        header("Location: http://localhost/event_management/");
        exit;
    }

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");

    $accessGranted = $_POST["grant-access"];
    if (!$accessGranted) {
        header("Location: http://localhost/event_management/");
        exit; 
    }

    include("database.php");
    $stmt = $conn->prepare("SELECT * FROM staff ORDER BY fullname ASC");
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"/>
        <link href="http://localhost/event_management/staff.css" rel="stylesheet">
        <title>AzNajhi's Staff Management</title>
    </head>
    <body>
        <div class="app-title">
            <h1>Staff Management</h1>
            <h6>by AzNajhi</h6>
        </div>

        <div class="app-form">
            <div class="card">
                <table>
                    <?php
                        $htmlString = "";
                        foreach ($result as $index => $row) {
                            $htmlString .= "<tr><td><input class='form-control staff-input' type='text' value='{$row['fullname']}' data-id='{$row['id']}' data-index='" . ($index + 1) . "' disabled='true'></td>";
                            $htmlString .= "<td><div class='button-group'>";
                            $htmlString .= "<button class='btn btn-secondary edit-button' data-index='" . ($index + 1) . "' type='button' onclick='editStaff(this)'><i class='fa-solid fa-pen-to-square'></i></button>";
                            $htmlString .= "<button class='btn btn-danger delete-button' data-index='" . ($index + 1) . "' type='button' onclick='deleteStaff(this)'><i class='fas fa-trash'></i></button></div></td></tr>";
                        }
                        echo $htmlString;
                    ?>
                </table>
            </div>
        </div>

        <div class="bottom-buttons mt-4 mb-4">
            <a href="http://localhost/event_management/" class="btn btn-primary process-button" type="button">Back</a>
            <button class="btn btn-primary" name="add-staff" type="button" onclick="addStaff()">Add Staff</button>
        </div>

        <script src="http://localhost/event_management/staff.js"></script>
    </body>
</html>