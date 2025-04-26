<?php
$host = "localhost";
$dbname = "r9789286_book";
$username = "r9789286_book";
$password = "Cook_!_Book_1";

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
