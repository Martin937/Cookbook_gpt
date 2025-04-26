<?php
header("Content-Type: application/json");
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'];
$image = $data['image'];
$description = $data['description'];
$meal_type = $data['meal_type'];
$dish_type = $data['dish_type'];
$is_diet = $data['is_diet'] ? 1 : 0;

$stmt = $conn->prepare("INSERT INTO recipes (name, image, description, meal_type, dish_type, is_diet) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssi", $name, $image, $description, $meal_type, $dish_type, $is_diet);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "id" => $conn->insert_id]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}
?>
