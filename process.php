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

$day = $data['day'];
$session = $data['session'];
$participant = $data['participant'];
$ratioStaff = $data['ratioStaff'];
$ratioParticipant = $data['ratioParticipant'];
$staffInputs = $data['staffInputs'];
$staffTotal = count($data['staffInputs']);
shuffle($staffInputs);

$headerOutput = "";
for ($x = 0; $x < $session; $x++) {
    $headerOutput .= "<th>Session " . ($x + 1) . "</th>";
}

$bodyOutput = "";
for ($y = 0; $y < $day; $y++) {
    $bodyOutput .= "<tr><th>" . ($y + 1) . "</th>";
    for ($z = 0; $z < $session; $z++) {
        $bodyOutput .= "<td>";
        for ($a = 0; $a < ($staffTotal / ($session * $day)); $a++) {
            if ($a == ($staffTotal / ($session * $day)) - 1) {
                $bodyOutput .= array_pop($staffInputs);
            } else {
                $bodyOutput .= array_pop($staffInputs) . ", ";
            }
        }
        $bodyOutput .= "</td>";
    }
    $bodyOutput .= "</tr>";
}

$scheduleTemplate = "
<table>
    <thead>
        <tr>
            <th>Day</th>
            {$headerOutput}
        </tr>
    </thead>
    <tbody>
        {$bodyOutput}
    </tbody>
</table>
";

$response = [
    'status' => 'success',
    'message' => 'Data received',
    'table' => $scheduleTemplate,
];

echo json_encode($response);
?>
