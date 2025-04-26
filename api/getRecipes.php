<?php
header("Content-Type: application/json");
require 'db.php';

$result = $conn->query("SELECT * FROM recipes ORDER BY id DESC");
$recipes = [];

while ($row = $result->fetch_assoc()) {
    $recipes[] = $row;
}

echo json_encode($recipes);
?>
